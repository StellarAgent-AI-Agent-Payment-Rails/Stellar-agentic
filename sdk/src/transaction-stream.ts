import { Horizon } from '@stellar/stellar-sdk';

import type { TxResult } from './types/index.js';

export interface HorizonTransactionRecord {
  hash: string;
  successful?: boolean;
  ledger_attr?: number;
  ledger?: number;
  paging_token?: string;
}

export interface TransactionStreamHandlers<TRecord> {
  onmessage(record: TRecord): void;
  onerror(error: unknown): void;
}

export interface TransactionStreamBuilder<TRecord> {
  cursor(cursor: string): TransactionStreamBuilder<TRecord>;
  includeFailed?(value: boolean): TransactionStreamBuilder<TRecord>;
  forAccount?(accountId: string): TransactionStreamBuilder<TRecord>;
  stream(handlers: TransactionStreamHandlers<TRecord>): () => void;
}

export interface TransactionStreamServer<TRecord> {
  transactions(): TransactionStreamBuilder<TRecord>;
}

export interface WaitForTransactionOptions<TRecord extends HorizonTransactionRecord = HorizonTransactionRecord> {
  /** Existing Horizon server. Supplying this avoids constructing a new client. */
  server?: TransactionStreamServer<TRecord>;
  /** Horizon URL used when no server is supplied. */
  horizonUrl?: string;
  /** Cursor to start the SSE stream from. Defaults to `now`. */
  cursor?: string;
  /** Optional account filter to narrow the Horizon transaction stream. */
  accountId?: string;
  /** Include failed transactions in the stream. Defaults to true. */
  includeFailed?: boolean;
  /** Timeout in milliseconds. Defaults to 60 seconds. */
  timeoutMs?: number;
  /** Abort signal for caller-controlled cancellation. */
  signal?: AbortSignal;
  /** Optional record mapper for SDK consumers that need the full Horizon payload. */
  toResult?: (record: TRecord) => TxResult;
}

export interface TransactionWatcher {
  /** Promise that resolves when the transaction appears in Horizon. */
  promise: Promise<TxResult>;
  /** Stop the underlying SSE stream and reject the promise if still pending. */
  stop(reason?: unknown): void;
}

const DEFAULT_TIMEOUT_MS = 60_000;

function defaultToResult(record: HorizonTransactionRecord): TxResult {
  return {
    hash: record.hash,
    success: record.successful ?? true,
    ledger: record.ledger_attr ?? record.ledger,
  };
}

function makeServer<TRecord extends HorizonTransactionRecord>(
  horizonUrl: string,
): TransactionStreamServer<TRecord> {
  return new Horizon.Server(horizonUrl) as unknown as TransactionStreamServer<TRecord>;
}

function timeoutError(hash: string, timeoutMs: number): Error {
  return new Error(`Timed out waiting ${timeoutMs}ms for transaction ${hash}`);
}

function stoppedError(reason?: unknown): Error {
  if (reason instanceof Error) {
    return reason;
  }
  return new Error(reason ? `Transaction watcher stopped: ${String(reason)}` : 'Transaction watcher stopped');
}

/**
 * Start a Horizon Server-Sent Events stream for one transaction hash.
 *
 * This avoids repeated Soroban RPC polling when many agents submit
 * transactions concurrently. Call `stop()` when abandoning the wait.
 */
export function createTransactionWatcher<TRecord extends HorizonTransactionRecord = HorizonTransactionRecord>(
  hash: string,
  options: WaitForTransactionOptions<TRecord> = {},
): TransactionWatcher {
  if (!hash) {
    throw new Error('Transaction hash is required');
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const cursor = options.cursor ?? 'now';
  const server = options.server ?? makeServer<TRecord>(options.horizonUrl ?? 'https://horizon-testnet.stellar.org');
  const toResult = options.toResult ?? ((record: TRecord) => defaultToResult(record));

  let settled = false;
  let stopStream: (() => void) | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let rejectPromise: ((reason?: unknown) => void) | undefined;

  const cleanup = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (stopStream) {
      stopStream();
      stopStream = undefined;
    }
    if (options.signal) {
      options.signal.removeEventListener('abort', abortHandler);
    }
  };

  const stop = (reason?: unknown) => {
    if (settled) {
      return;
    }
    settled = true;
    cleanup();
    rejectPromise?.(stoppedError(reason));
  };

  const abortHandler = () => stop(options.signal?.reason ?? 'aborted');

  const promise = new Promise<TxResult>((resolve, reject) => {
    rejectPromise = reject;

    if (options.signal?.aborted) {
      stop(options.signal.reason ?? 'aborted');
      return;
    }

    options.signal?.addEventListener('abort', abortHandler, { once: true });

    timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(timeoutError(hash, timeoutMs));
    }, timeoutMs);

    let builder = server.transactions();

    if (options.accountId && builder.forAccount) {
      builder = builder.forAccount(options.accountId);
    }

    if (options.includeFailed ?? true) {
      builder = builder.includeFailed?.(true) ?? builder;
    }

    stopStream = builder.cursor(cursor).stream({
        onmessage(record: TRecord) {
          if (settled) {
            return;
          }
          if (record.hash !== hash) {
            return;
          }
          settled = true;
          cleanup();
          resolve(toResult(record));
        },
        onerror(error: unknown) {
          if (settled) {
            return;
          }
          settled = true;
          cleanup();
          reject(error);
        },
      });
  });

  return { promise, stop };
}

/**
 * Wait for a transaction to appear in Horizon using SSE instead of polling.
 */
export async function waitForTransaction<TRecord extends HorizonTransactionRecord = HorizonTransactionRecord>(
  hash: string,
  options: WaitForTransactionOptions<TRecord> = {},
): Promise<TxResult> {
  return createTransactionWatcher(hash, options).promise;
}
