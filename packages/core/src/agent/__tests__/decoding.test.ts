import { describe, expect, it } from 'vitest';
import {
  asBigInt,
  asNumber,
  asRecord,
  asString,
  decodeBytes,
  jobStatus,
  optionalString,
  spendPeriod,
  toAgentInfo,
  toChannelInfo,
  toJobInfo,
  toRateLimitStatus,
} from '../decoding.js';
import { StellarAgentError } from '../../errors.js';

describe('asRecord', () => {
  it('passes a plain object through', () => {
    expect(asRecord({ a: 1 })).toEqual({ a: 1 });
  });

  it('converts a Map to a plain object', () => {
    expect(asRecord(new Map([['a', 1]]))).toEqual({ a: 1 });
  });

  it('rejects an array', () => {
    expect(() => asRecord([1, 2])).toThrow(StellarAgentError);
  });

  it('rejects a primitive', () => {
    expect(() => asRecord(42)).toThrow(StellarAgentError);
  });
});

describe('asBigInt', () => {
  it('passes a bigint through', () => {
    expect(asBigInt(7n)).toBe(7n);
  });

  it('converts a safe-integer number', () => {
    expect(asBigInt(7)).toBe(7n);
  });

  it('unwraps a { value } wrapper (as scValToNative produces for u128/i128)', () => {
    expect(asBigInt({ value: 7n })).toBe(7n);
  });

  it('rejects a non-numeric value', () => {
    expect(() => asBigInt('7')).toThrow(StellarAgentError);
  });
});

describe('asNumber', () => {
  it('passes a safe-integer number through', () => {
    expect(asNumber(42)).toBe(42);
  });

  it('converts a bigint', () => {
    expect(asNumber(42n)).toBe(42);
  });

  it('rejects a non-integer', () => {
    expect(() => asNumber(1.5)).toThrow(StellarAgentError);
  });
});

describe('asString', () => {
  it('passes a string through', () => {
    expect(asString('hello')).toBe('hello');
  });

  it('rejects a value with no string representation to fall back on', () => {
    expect(() => asString(42)).toThrow(StellarAgentError);
  });
});

describe('optionalString', () => {
  it('returns null for null/undefined', () => {
    expect(optionalString(null)).toBeNull();
    expect(optionalString(undefined)).toBeNull();
  });

  it('decodes a present value', () => {
    expect(optionalString('hello')).toBe('hello');
  });
});

describe('decodeBytes', () => {
  it('decodes a Buffer as UTF-8', () => {
    expect(decodeBytes(Buffer.from('hello', 'utf8'))).toBe('hello');
  });

  it('decodes a Uint8Array as UTF-8', () => {
    expect(decodeBytes(new TextEncoder().encode('hello'))).toBe('hello');
  });

  it('rejects a non-bytes value', () => {
    expect(() => decodeBytes('hello')).toThrow(StellarAgentError);
  });
});

describe('jobStatus', () => {
  it('normalises a PascalCase symbol-vector tag to snake_case', () => {
    expect(jobStatus(['PendingRelease'])).toBe('pending_release');
    expect(jobStatus(['Open'])).toBe('open');
  });

  it('rejects an unknown tag', () => {
    expect(() => jobStatus(['NotARealStatus'])).toThrow(StellarAgentError);
  });
});

describe('spendPeriod', () => {
  it('normalises a PascalCase symbol-vector tag to snake_case', () => {
    expect(spendPeriod(['Hourly'])).toBe('hourly');
    expect(spendPeriod(['PerLedger'])).toBe('per_ledger');
  });

  it('rejects an unknown tag', () => {
    expect(() => spendPeriod(['Weekly'])).toThrow(StellarAgentError);
  });
});

describe('toAgentInfo', () => {
  it('maps a raw AgentWalletFactory record onto AgentInfo', () => {
    const info = toAgentInfo(2n, {
      address: 'GADDRESS',
      name: 'worker',
      owner: 'GOWNER',
      active: true,
      created_at: 9,
      total_ops: 3n,
    });
    expect(info).toEqual({
      id: 2n,
      address: 'GADDRESS',
      name: 'worker',
      owner: 'GOWNER',
      active: true,
      createdAt: 9,
      totalOps: 3n,
    });
  });
});

describe('toChannelInfo', () => {
  it('maps a raw PaymentChannel record onto ChannelInfo', () => {
    const info = toChannelInfo(3n, {
      agent: 'GAGENT',
      owner: 'GOWNER',
      token: 'CTOKEN',
      limit_per_period: 50n,
      period: ['Hourly'],
      spent_this_period: 10n,
      period_start_ledger: 700,
      total_spent: 20n,
      active: true,
    });
    expect(info).toEqual({
      id: 3n,
      agent: 'GAGENT',
      owner: 'GOWNER',
      token: 'CTOKEN',
      limitPerPeriod: 50n,
      period: 'hourly',
      spentThisPeriod: 10n,
      periodStartLedger: 700,
      totalSpent: 20n,
      active: true,
    });
  });
});

describe('toJobInfo', () => {
  it('maps a raw Escrow record onto JobInfo, decoding bytes and Options', () => {
    const info = toJobInfo(4n, {
      requester: 'GREQ',
      worker: 'GWORKER',
      arbiter: null,
      token: 'CTOKEN',
      amount: 25n,
      task_description: Buffer.from('task'),
      result: Buffer.from('done'),
      deadline_ledger: 99,
      status: ['PendingRelease'],
      created_at: 8,
    });
    expect(info).toEqual({
      id: 4n,
      requester: 'GREQ',
      worker: 'GWORKER',
      arbiter: null,
      token: 'CTOKEN',
      amount: 25n,
      taskDescription: 'task',
      result: 'done',
      deadlineLedger: 99,
      status: 'pending_release',
      createdAt: 8,
    });
  });

  it('maps a null result to null rather than decoding it', () => {
    const info = toJobInfo(4n, {
      requester: 'GREQ',
      worker: null,
      arbiter: null,
      token: 'CTOKEN',
      amount: 25n,
      task_description: Buffer.from('task'),
      result: null,
      deadline_ledger: 99,
      status: ['Open'],
      created_at: 8,
    });
    expect(info.result).toBeNull();
    expect(info.worker).toBeNull();
  });
});

describe('toRateLimitStatus', () => {
  it('maps a raw RateLimiter record onto RateLimitStatus, converting stroops to decimal strings', () => {
    const status = toRateLimitStatus({
      active: true,
      max_per_tx: 10_000_000n,
      max_per_hour: 20_000_000n,
      max_per_day: 30_000_000n,
      max_txs_per_hour: 4,
      hourly_spend: 5_000_000n,
      daily_spend: 6_000_000n,
      hourly_tx_count: 2,
      hour_window_start: 700,
      day_window_start: 100,
    });
    expect(status).toEqual({
      configured: true,
      active: true,
      maxPerTx: '1.0000000',
      maxPerHour: '2.0000000',
      maxPerDay: '3.0000000',
      maxTxsPerHour: 4,
      spentThisHour: '0.5000000',
      spentToday: '0.6000000',
      txsThisHour: 2,
      hourWindowStartLedger: 700,
      dayWindowStartLedger: 100,
    });
  });
});
