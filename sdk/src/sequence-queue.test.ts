import type { Keypair } from '@stellar/stellar-sdk';
import { describe, expect, it, vi } from 'vitest';

import {
  AccountSequenceQueue,
  submitSequencedTransaction,
  type SignableTransaction,
} from './sequence-queue.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

class FakeTransaction implements SignableTransaction {
  signed = false;

  constructor(readonly sequence: number) {}

  sign(...signers: Keypair[]): void {
    this.signed = signers.length > 0;
  }
}

describe('AccountSequenceQueue', () => {
  it('serializes work for the same source account', async () => {
    const queue = new AccountSequenceQueue();
    const order: string[] = [];
    let releaseFirst!: () => void;

    const first = queue.run('GAGENT', async () => {
      order.push('first:start');
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
      order.push('first:end');
      return 1;
    });

    const second = queue.run('GAGENT', async () => {
      order.push('second:start');
      return 2;
    });

    await tick();
    expect(order).toEqual(['first:start']);
    expect(queue.hasPending('GAGENT')).toBe(true);

    releaseFirst();

    await expect(Promise.all([first, second])).resolves.toEqual([1, 2]);
    expect(order).toEqual(['first:start', 'first:end', 'second:start']);
    expect(queue.hasPending('GAGENT')).toBe(false);
  });

  it('does not block different source accounts', async () => {
    const queue = new AccountSequenceQueue();
    const started: string[] = [];
    let releaseFirst!: () => void;

    const first = queue.run('GONE', async () => {
      started.push('one');
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
    });
    const second = queue.run('GTWO', async () => {
      started.push('two');
    });

    await tick();
    expect(started).toEqual(['one', 'two']);

    releaseFirst();
    await Promise.all([first, second]);
  });

  it('releases the account queue after a failed task', async () => {
    const queue = new AccountSequenceQueue();
    const failing = queue.run('GAGENT', async () => {
      throw new Error('submit failed');
    });

    await expect(failing).rejects.toThrow('submit failed');
    await expect(queue.run('GAGENT', () => 'next')).resolves.toBe('next');
  });
});

describe('submitSequencedTransaction', () => {
  it('loads a fresh account, signs, and submits transactions in FIFO order', async () => {
    const queue = new AccountSequenceQueue();
    const submitted: FakeTransaction[] = [];
    let sequence = 0;
    let releaseFirstSubmit!: () => void;

    const server = {
      loadAccount: vi.fn(async (sourceAccount: string) => ({
        sourceAccount,
        sequence: ++sequence,
      })),
      submitTransaction: vi.fn(async (transaction: FakeTransaction) => {
        submitted.push(transaction);
        if (transaction.sequence === 1) {
          await new Promise<void>((resolve) => {
            releaseFirstSubmit = resolve;
          });
        }
        return { hash: `tx-${transaction.sequence}` };
      }),
    };

    const first = submitSequencedTransaction({
      server,
      sourceAccount: 'GAGENT',
      queue,
      signers: [{} as Keypair],
      buildTransaction: (account) => new FakeTransaction(account.sequence),
    });

    const second = submitSequencedTransaction({
      server,
      sourceAccount: 'GAGENT',
      queue,
      signers: [{} as Keypair],
      buildTransaction: (account) => new FakeTransaction(account.sequence),
    });

    await tick();
    expect(server.loadAccount).toHaveBeenCalledTimes(1);
    expect(server.submitTransaction).toHaveBeenCalledTimes(1);

    releaseFirstSubmit();

    await expect(Promise.all([first, second])).resolves.toEqual([
      { hash: 'tx-1' },
      { hash: 'tx-2' },
    ]);

    expect(server.loadAccount).toHaveBeenCalledTimes(2);
    expect(submitted.map((tx) => tx.sequence)).toEqual([1, 2]);
    expect(submitted.every((tx) => tx.signed)).toBe(true);
  });
});
