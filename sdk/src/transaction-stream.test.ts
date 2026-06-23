import { describe, expect, it, vi } from 'vitest';

import {
  createTransactionWatcher,
  waitForTransaction,
  type HorizonTransactionRecord,
  type TransactionStreamBuilder,
  type TransactionStreamHandlers,
  type TransactionStreamServer,
} from './transaction-stream.js';

class FakeTransactionBuilder implements TransactionStreamBuilder<HorizonTransactionRecord> {
  cursorValue?: string;
  accountId?: string;
  includeFailedValue?: boolean;
  handlers?: TransactionStreamHandlers<HorizonTransactionRecord>;
  stopped = false;

  cursor(cursor: string): TransactionStreamBuilder<HorizonTransactionRecord> {
    this.cursorValue = cursor;
    return this;
  }

  includeFailed(value: boolean): TransactionStreamBuilder<HorizonTransactionRecord> {
    this.includeFailedValue = value;
    return this;
  }

  forAccount(accountId: string): TransactionStreamBuilder<HorizonTransactionRecord> {
    this.accountId = accountId;
    return this;
  }

  stream(handlers: TransactionStreamHandlers<HorizonTransactionRecord>): () => void {
    this.handlers = handlers;
    return () => {
      this.stopped = true;
    };
  }
}

function fakeServer(builder: FakeTransactionBuilder): TransactionStreamServer<HorizonTransactionRecord> {
  return {
    transactions() {
      return builder;
    },
  };
}

describe('transaction SSE watcher', () => {
  it('resolves from the Horizon transaction stream and closes the stream', async () => {
    const builder = new FakeTransactionBuilder();
    const promise = waitForTransaction('abc123', {
      server: fakeServer(builder),
      cursor: 'now',
      accountId: 'GAGENT',
    });

    expect(builder.cursorValue).toBe('now');
    expect(builder.accountId).toBe('GAGENT');
    expect(builder.includeFailedValue).toBe(true);

    builder.handlers?.onmessage({
      hash: 'different',
      successful: true,
      ledger_attr: 41,
    });

    builder.handlers?.onmessage({
      hash: 'abc123',
      successful: true,
      ledger_attr: 42,
    });

    await expect(promise).resolves.toEqual({
      hash: 'abc123',
      success: true,
      ledger: 42,
    });
    expect(builder.stopped).toBe(true);
  });

  it('rejects and stops when aborted', async () => {
    const builder = new FakeTransactionBuilder();
    const controller = new AbortController();
    const watcher = createTransactionWatcher('abc123', {
      server: fakeServer(builder),
      signal: controller.signal,
    });

    controller.abort('caller cancelled');

    await expect(watcher.promise).rejects.toThrow('caller cancelled');
    expect(builder.stopped).toBe(true);
  });

  it('times out without polling', async () => {
    vi.useFakeTimers();
    const builder = new FakeTransactionBuilder();
    const promise = waitForTransaction('abc123', {
      server: fakeServer(builder),
      timeoutMs: 5,
    });

    vi.advanceTimersByTime(5);

    await expect(promise).rejects.toThrow('Timed out waiting 5ms');
    expect(builder.stopped).toBe(true);
    vi.useRealTimers();
  });
});
