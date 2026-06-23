import type { Keypair } from '@stellar/stellar-sdk';

export type SequencedTask<T> = () => T | Promise<T>;

export interface SignableTransaction {
  sign(...signers: Keypair[]): void;
}

export interface SequencedTransactionServer<TAccount, TTransaction, TSubmitResponse> {
  loadAccount(sourceAccount: string): Promise<TAccount>;
  submitTransaction(transaction: TTransaction): Promise<TSubmitResponse>;
}

export type SequencedTransactionBuilder<TAccount, TTransaction> = (
  account: TAccount,
) => TTransaction | Promise<TTransaction>;

export interface SubmitSequencedTransactionOptions<
  TAccount,
  TTransaction extends SignableTransaction,
  TSubmitResponse,
> {
  server: SequencedTransactionServer<TAccount, TTransaction, TSubmitResponse>;
  sourceAccount: string;
  buildTransaction: SequencedTransactionBuilder<TAccount, TTransaction>;
  queue?: AccountSequenceQueue;
  signers?: Keypair[];
}

/**
 * Serializes async work per Stellar source account.
 *
 * Horizon account sequence numbers are consumed per source account. When many
 * agents submit concurrently, loading/building/submitting in parallel can reuse
 * the same sequence number. This queue preserves concurrency across different
 * source accounts while making each individual source account FIFO.
 */
export class AccountSequenceQueue {
  private readonly tails = new Map<string, Promise<void>>();

  async run<T>(sourceAccount: string, task: SequencedTask<T>): Promise<T> {
    if (!sourceAccount) {
      throw new Error('sourceAccount is required');
    }

    const previous = this.tails.get(sourceAccount) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const next = previous.catch(() => undefined).then(() => gate);

    this.tails.set(sourceAccount, next);

    await previous.catch(() => undefined);

    try {
      return await task();
    } finally {
      release();
      if (this.tails.get(sourceAccount) === next) {
        this.tails.delete(sourceAccount);
      }
    }
  }

  hasPending(sourceAccount: string): boolean {
    return this.tails.has(sourceAccount);
  }
}

export const defaultAccountSequenceQueue = new AccountSequenceQueue();

export async function submitSequencedTransaction<
  TAccount,
  TTransaction extends SignableTransaction,
  TSubmitResponse,
>(
  options: SubmitSequencedTransactionOptions<TAccount, TTransaction, TSubmitResponse>,
): Promise<TSubmitResponse> {
  const queue = options.queue ?? defaultAccountSequenceQueue;

  return queue.run(options.sourceAccount, async () => {
    const account = await options.server.loadAccount(options.sourceAccount);
    const transaction = await options.buildTransaction(account);

    if (options.signers?.length) {
      transaction.sign(...options.signers);
    }

    return options.server.submitTransaction(transaction);
  });
}
