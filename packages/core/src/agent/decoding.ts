/**
 * Contract result -> TypeScript value decoding. `scValToNative` gets a raw
 * contract struct most of the way to a plain object; the functions here
 * validate that shape field-by-field (so a mismatch turns into a
 * {@link StellarAgentError} with a useful message instead of a `TypeError`
 * three frames later) and map it onto the SDK's public `*Info` types.
 *
 * The inverse direction (TypeScript values -> `xdr.ScVal` arguments) lives in
 * `./encoding.ts`.
 */
import { StellarAgentError } from '../errors.js';
import { fromStroops } from '../math/index.js';
import type {
  AgentInfo,
  ChannelInfo,
  JobInfo,
  RateLimitStatus,
  SpendPeriod,
} from '../types/index.js';

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (value instanceof Map) return Object.fromEntries(value);
    return value as Record<string, unknown>;
  }
  throw new StellarAgentError('CONTRACT_ERROR', 'Contract returned a malformed struct');
}

export function asBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number' && Number.isSafeInteger(value)) return BigInt(value);
  if (value && typeof value === 'object' && 'value' in value) {
    return asBigInt((value as { value: unknown }).value);
  }
  throw new StellarAgentError('CONTRACT_ERROR', 'Contract returned a malformed integer');
}

export function asNumber(value: unknown): number {
  const number = typeof value === 'bigint' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isSafeInteger(number)) {
    throw new StellarAgentError('CONTRACT_ERROR', 'Contract returned a malformed u32');
  }
  return number;
}

export function asString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'toString' in value) return String(value);
  throw new StellarAgentError('CONTRACT_ERROR', 'Contract returned a malformed address');
}

export function optionalString(value: unknown): string | null {
  return value == null ? null : asString(value);
}

export function decodeBytes(value: unknown): string {
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return Buffer.from(value).toString('utf8');
  }
  throw new StellarAgentError('CONTRACT_ERROR', 'Contract returned malformed bytes');
}

export function jobStatus(value: unknown): JobInfo['status'] {
  const raw = Array.isArray(value) ? value[0] : value;
  const status = String(raw).replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const valid: JobInfo['status'][] = [
    'open', 'in_progress', 'pending_release', 'completed', 'refunded', 'disputed',
  ];
  if (!valid.includes(status as JobInfo['status'])) {
    throw new StellarAgentError('CONTRACT_ERROR', `Unknown job status: ${String(raw)}`);
  }
  return status as JobInfo['status'];
}

/** Inverse of {@link spendPeriodVariant} in `./encoding.ts`: `Hourly` (as a symbol vec) -> `hourly`. */
export function spendPeriod(value: unknown): SpendPeriod {
  const raw = Array.isArray(value) ? value[0] : value;
  const period = String(raw).replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const valid: SpendPeriod[] = ['per_ledger', 'hourly', 'daily'];
  if (!valid.includes(period as SpendPeriod)) {
    throw new StellarAgentError('CONTRACT_ERROR', `Unknown spend period: ${String(raw)}`);
  }
  return period as SpendPeriod;
}

export function toAgentInfo(agentId: bigint, value: Record<string, unknown>): AgentInfo {
  return {
    id: agentId,
    address: asString(value.address),
    name: asString(value.name),
    owner: asString(value.owner),
    active: value.active === true,
    createdAt: asNumber(value.created_at),
    totalOps: asBigInt(value.total_ops),
  };
}

export function toChannelInfo(channelId: bigint, value: Record<string, unknown>): ChannelInfo {
  return {
    id: channelId,
    agent: asString(value.agent),
    owner: asString(value.owner),
    token: asString(value.token),
    limitPerPeriod: asBigInt(value.limit_per_period),
    period: spendPeriod(value.period),
    spentThisPeriod: asBigInt(value.spent_this_period),
    periodStartLedger: asNumber(value.period_start_ledger),
    totalSpent: asBigInt(value.total_spent),
    active: value.active === true,
  };
}

export function toJobInfo(jobId: bigint, value: Record<string, unknown>): JobInfo {
  return {
    id: jobId,
    requester: asString(value.requester),
    worker: optionalString(value.worker),
    arbiter: optionalString(value.arbiter),
    token: asString(value.token),
    amount: asBigInt(value.amount),
    taskDescription: decodeBytes(value.task_description),
    result: value.result == null ? null : decodeBytes(value.result),
    deadlineLedger: asNumber(value.deadline_ledger),
    status: jobStatus(value.status),
    createdAt: asNumber(value.created_at),
  };
}

export function toRateLimitStatus(value: Record<string, unknown>): RateLimitStatus {
  return {
    configured: true,
    active: value.active === true,
    maxPerTx: fromStroops(asBigInt(value.max_per_tx)),
    maxPerHour: fromStroops(asBigInt(value.max_per_hour)),
    maxPerDay: fromStroops(asBigInt(value.max_per_day)),
    maxTxsPerHour: asNumber(value.max_txs_per_hour),
    spentThisHour: fromStroops(asBigInt(value.hourly_spend)),
    spentToday: fromStroops(asBigInt(value.daily_spend)),
    txsThisHour: asNumber(value.hourly_tx_count),
    hourWindowStartLedger: asNumber(value.hour_window_start),
    dayWindowStartLedger: asNumber(value.day_window_start),
  };
}
