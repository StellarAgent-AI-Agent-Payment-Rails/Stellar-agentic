/**
 * TypeScript value -> `xdr.ScVal` encoding for Soroban contract arguments.
 * The inverse direction (contract results -> TypeScript values) lives in
 * `./decoding.ts`.
 */
import { Address, Asset, nativeToScVal, xdr } from '@stellar/stellar-sdk';
import { toStroops } from '../math/index.js';
import { StellarAgentError } from '../errors.js';
import type { OpenChannelParams } from '../types/index.js';

export function addressVal(value: string): xdr.ScVal {
  try {
    return Address.fromString(value).toScVal();
  } catch (error) {
    throw new StellarAgentError('INVALID_ARGUMENT', `Invalid Stellar address: ${value}`, {
      cause: error,
    });
  }
}

export function i128Val(value: string): xdr.ScVal {
  try {
    return nativeToScVal(toStroops(value), { type: 'i128' });
  } catch (error) {
    throw new StellarAgentError('INVALID_ARGUMENT', `Invalid amount: ${value}`, { cause: error });
  }
}

export function u64Val(value: bigint): xdr.ScVal {
  if (value < 0n || value > 0xffff_ffff_ffff_ffffn) {
    throw new StellarAgentError('INVALID_ARGUMENT', `Value is outside u64 range: ${value}`);
  }
  return nativeToScVal(value, { type: 'u64' });
}

export function u32Val(value: number): xdr.ScVal {
  if (!Number.isInteger(value) || value < 0 || value > 0xffff_ffff) {
    throw new StellarAgentError('INVALID_ARGUMENT', `Value is outside u32 range: ${value}`);
  }
  return nativeToScVal(value, { type: 'u32' });
}

export function bytesVal(value: string): xdr.ScVal {
  return xdr.ScVal.scvBytes(Buffer.from(value, 'utf8'));
}

/** Rust contracttype unit enums encode as a one-element symbol vector. */
export function enumVal(variant: string): xdr.ScVal {
  return xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(variant)]);
}

export function spendPeriodVariant(period: OpenChannelParams['period']): string {
  return { per_ledger: 'PerLedger', hourly: 'Hourly', daily: 'Daily' }[period];
}

export function resolveAssetContract(
  asset: string,
  assetContracts: Record<string, string>,
  networkPassphrase: string,
): string {
  if (asset === 'XLM') return Asset.native().contractId(networkPassphrase);
  const resolved = assetContracts[asset] ?? asset;
  try {
    Address.fromString(resolved);
    if (!resolved.startsWith('C')) throw new Error('not a contract');
    return resolved;
  } catch {
    throw new StellarAgentError(
      'INVALID_ARGUMENT',
      `Unknown asset "${asset}". Pass its C... token contract ID or configure assetContracts.${asset}.`,
    );
  }
}
