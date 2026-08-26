/**
 * The shared Soroban contract-invocation pipeline: build, simulate, sign,
 * submit, and poll a single contract call. Every query and mutation in
 * `./queries.ts` / `./mutations.ts` goes through this.
 */
import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  SorobanRpc,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk';
import { StellarAgentError } from '../errors.js';
import type { StellarAgentErrorCode } from '../errors.js';
import { SigningError } from '../signer.js';
import type { Signer } from '../signer.js';
import type { NetworkConfig, TxResult } from '../types/index.js';

/** What {@link runInvocation} needs to build, sign, and submit a Soroban call. */
export interface InvocationContext {
  signer: Signer;
  rpc: SorobanRpc.Server;
  networkConfig: NetworkConfig;
  address: string;
}

/**
 * A bound reference to `StellarAgent`'s private `invokeContract` method —
 * what every query/mutation helper calls through. Routing calls through the
 * instance method (rather than {@link runInvocation} directly) means a test
 * spying on the instance still intercepts everything issued on its behalf.
 */
export type InvokeFn = (
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  readOnly?: boolean,
) => Promise<{ value: unknown; tx: TxResult }>;

/**
 * Build and simulate every contract call. Mutations additionally sign the
 * simulated auth entries, assemble the footprint/resources, sign and submit
 * the envelope, and wait for a terminal transaction status.
 */
export async function runInvocation(
  ctx: InvocationContext,
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  readOnly = false,
): Promise<{ value: unknown; tx: TxResult }> {
  try {
    const account = await ctx.rpc.getAccount(ctx.address);
    const operation = new Contract(contractId).call(method, ...args);
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: ctx.networkConfig.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const simulation = await ctx.rpc.simulateTransaction(transaction);
    if (SorobanRpc.Api.isSimulationError(simulation)) {
      throw contractError(
        'SIMULATION_FAILED',
        `${method} simulation failed: ${simulation.error}`,
      );
    }
    if (SorobanRpc.Api.isSimulationRestore(simulation)) {
      throw new StellarAgentError(
        'SIMULATION_FAILED',
        `${method} requires restoring expired ledger entries before invocation`,
      );
    }

    if (readOnly) {
      return {
        value: simulation.result?.retval
          ? scValToNative(simulation.result.retval)
          : undefined,
        tx: { hash: '', success: true },
      };
    }

    const validUntilLedgerSeq = simulation.latestLedger + 100;
    const auth = await Promise.all((simulation.result?.auth ?? []).map(async (entry) => {
      if (entry.credentials().switch().name !== 'sorobanCredentialsAddress') {
        return entry;
      }
      const signedXdr = await ctx.signer.signAuthEntry(entry.toXDR('base64'), {
        networkPassphrase: ctx.networkConfig.networkPassphrase,
        validUntilLedgerSeq,
      });
      return xdr.SorobanAuthorizationEntry.fromXDR(signedXdr, 'base64');
    }));

    const hostFunction = operation.body().invokeHostFunctionOp().hostFunction();
    const authorizedOperation = Operation.invokeHostFunction({ func: hostFunction, auth });
    const authorizedTransaction = TransactionBuilder.cloneFrom(transaction)
      .clearOperations()
      .addOperation(authorizedOperation)
      .build();
    const assembled = SorobanRpc.assembleTransaction(
      authorizedTransaction,
      simulation,
    ).build();
    const signedXdr = await ctx.signer.signTransaction(assembled.toXDR(), {
      networkPassphrase: ctx.networkConfig.networkPassphrase,
    });
    const signed = TransactionBuilder.fromXDR(
      signedXdr,
      ctx.networkConfig.networkPassphrase,
    );

    const submitted = await ctx.rpc.sendTransaction(signed);
    if (submitted.status !== 'PENDING' && submitted.status !== 'DUPLICATE') {
      const diagnostics = diagnosticText(submitted.diagnosticEvents);
      throw contractError(
        'SUBMISSION_FAILED',
        `${method} submission failed (${submitted.status}): ${
          diagnostics || submitted.errorResult?.toXDR('base64') || 'unknown error'
        }`,
      );
    }

    for (let attempt = 0; attempt < 30; attempt++) {
      const confirmed = await ctx.rpc.getTransaction(submitted.hash);
      if (confirmed.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        return {
          value: confirmed.returnValue ? scValToNative(confirmed.returnValue) : undefined,
          tx: { hash: submitted.hash, success: true, ledger: confirmed.ledger },
        };
      }
      if (confirmed.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
        const diagnostics = diagnosticText(confirmed.diagnosticEventsXdr);
        throw contractError(
          'TRANSACTION_FAILED',
          `${method} transaction failed${diagnostics ? `: ${diagnostics}` : ''}`,
          submitted.hash,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new StellarAgentError(
      'TRANSACTION_TIMEOUT',
      `${method} transaction did not complete in time`,
      { transactionHash: submitted.hash },
    );
  } catch (error) {
    if (error instanceof StellarAgentError || error instanceof SigningError) throw error;
    throw new StellarAgentError(
      'NETWORK_ERROR',
      `${method} failed while communicating with Soroban RPC: ${errorMessage(error)}`,
      { cause: error },
    );
  }
}

/** Maps a raw contract-panic or RPC failure message to a stable machine-readable code. */
export function contractError(
  fallback: StellarAgentErrorCode,
  message: string,
  transactionHash?: string,
): StellarAgentError {
  const mappings: Array<[RegExp, StellarAgentErrorCode]> = [
    [/spend limit exceeded/i, 'SPEND_LIMIT_EXCEEDED'],
    [/channel not found/i, 'CHANNEL_NOT_FOUND'],
    [/channel is closed/i, 'CHANNEL_CLOSED'],
    [/job not found/i, 'JOB_NOT_FOUND'],
    [/job is not open/i, 'JOB_NOT_OPEN'],
    [/job has expired/i, 'JOB_EXPIRED'],
    [/not (?:the )?(?:authorized|assigned)|not authorized/i, 'NOT_AUTHORIZED'],
    [/no rate limit|limit not found/i, 'RATE_LIMIT_NOT_FOUND'],
    [/(?:amount|deposit|limit).*(?:positive|invalid)|deadline must/i, 'INVALID_ARGUMENT'],
  ];
  const code = mappings.find(([pattern]) => pattern.test(message))?.[1] ?? fallback;
  return new StellarAgentError(code, message, { transactionHash });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function diagnosticText(events: xdr.DiagnosticEvent[] | undefined): string {
  if (!events?.length) return '';
  try {
    return events.map((diagnostic) => {
      const event = diagnostic.event();
      return JSON.stringify({
        topics: event.body().v0().topics().map((topic) => scValToNative(topic)),
        data: scValToNative(event.body().v0().data()),
      }, (_key, value) => typeof value === 'bigint' ? value.toString() : value);
    }).join('; ');
  } catch {
    return events.map((event) => event.toXDR('base64')).join('; ');
  }
}

export async function getLatestLedger(rpc: SorobanRpc.Server): Promise<number> {
  try {
    return (await rpc.getLatestLedger()).sequence;
  } catch (error) {
    throw new StellarAgentError('NETWORK_ERROR', 'Unable to read the latest ledger', {
      cause: error,
    });
  }
}
