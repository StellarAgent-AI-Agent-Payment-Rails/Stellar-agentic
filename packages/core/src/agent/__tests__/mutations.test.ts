import { describe, expect, it, vi } from 'vitest';
import { scValToNative } from '@stellar/stellar-sdk';
import type { InvokeFn } from '../invocation.js';
import {
  acceptJob,
  closeChannel,
  createAgentWallet,
  openChannel,
  payForAPI,
  releasePayment,
  requestWork,
  setRateLimits,
  submitResult,
} from '../mutations.js';
import { StellarAgentError } from '../../errors.js';
import { TEST_PUBLIC } from '../../__tests__/fixtures.js';

function invokeReturning(value: unknown): InvokeFn {
  return vi.fn(async () => ({ value, tx: { hash: 'tx', success: true } }));
}

describe('createAgentWallet', () => {
  it('invokes create_agent and returns the decoded agent id', async () => {
    const invoke = invokeReturning(9n);
    await expect(createAgentWallet(invoke, 'CFACTORY', TEST_PUBLIC, 'my-agent')).resolves.toBe(9n);
    expect(invoke).toHaveBeenCalledWith('CFACTORY', 'create_agent', expect.any(Array));
  });
});

describe('openChannel', () => {
  it('invokes open_channel and returns the decoded channel id', async () => {
    const invoke = invokeReturning(7n);
    const channelId = await openChannel(invoke, 'CCHANNEL', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015', {
      deposit: '10',
      limitPerPeriod: '1',
      period: 'hourly',
    });
    expect(channelId).toBe(7n);
    const args = (invoke as unknown as ReturnType<typeof vi.fn>).mock.calls[0][2];
    expect(scValToNative(args[5])).toEqual(['Hourly']);
  });
});

describe('closeChannel', () => {
  it('invokes close_channel and returns its tx result', async () => {
    const invoke = invokeReturning(undefined);
    await expect(closeChannel(invoke, 'CCHANNEL', TEST_PUBLIC, 1n)).resolves.toEqual({ hash: 'tx', success: true });
    expect(invoke).toHaveBeenCalledWith('CCHANNEL', 'close_channel', expect.any(Array));
  });
});

describe('payForAPI', () => {
  it('routes a same-asset payment through pay', async () => {
    const invoke = invokeReturning(undefined);
    await payForAPI(invoke, 'CCHANNEL', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015', 1n, {
      endpoint: 'https://api.example.com',
      amount: '0.001',
    });
    expect(invoke).toHaveBeenCalledWith('CCHANNEL', 'pay', expect.any(Array));
  });

  it('routes a cross-asset payment through pay_with_conversion', async () => {
    const invoke = invokeReturning(undefined);
    await payForAPI(invoke, 'CCHANNEL', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015', 1n, {
      endpoint: 'https://api.example.com',
      amount: '0.001',
      destAsset: 'XLM',
      minReceived: '0.0009',
    });
    expect(invoke).toHaveBeenCalledWith('CCHANNEL', 'pay_with_conversion', expect.any(Array));
  });

  it('rejects destAsset without minReceived', async () => {
    const invoke = invokeReturning(undefined);
    const error = await payForAPI(invoke, 'CCHANNEL', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015', 1n, {
      endpoint: 'https://api.example.com',
      amount: '0.001',
      destAsset: 'XLM',
    }).catch((caught) => caught);
    expect(error).toBeInstanceOf(StellarAgentError);
    expect(error.code).toBe('INVALID_ARGUMENT');
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe('requestWork', () => {
  it('rejects a non-positive deadlineLedgers before invoking anything', async () => {
    const invoke = invokeReturning(1n);
    const getLatestLedger = vi.fn(async () => 100);
    const error = await requestWork(
      invoke, getLatestLedger, 'CESCROW', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015',
      { workerAgent: 'GWORKER', task: 't', escrowAmount: '1', deadlineLedgers: 0 },
    ).catch((caught) => caught);
    expect(error).toBeInstanceOf(StellarAgentError);
    expect(error.code).toBe('INVALID_ARGUMENT');
    expect(invoke).not.toHaveBeenCalled();
  });

  it('derives the deadline ledger from the current one plus the offset', async () => {
    const invoke = invokeReturning(1n);
    const getLatestLedger = vi.fn(async () => 100);
    await requestWork(
      invoke, getLatestLedger, 'CESCROW', TEST_PUBLIC, {}, 'Test SDF Network ; September 2015',
      { workerAgent: 'GWORKER', task: 't', escrowAmount: '1', deadlineLedgers: 50 },
    );
    const args = (invoke as unknown as ReturnType<typeof vi.fn>).mock.calls[0][2];
    expect(scValToNative(args[4])).toBe(150);
  });
});

describe('acceptJob / submitResult / releasePayment', () => {
  it('invoke the expected escrow methods', async () => {
    const invoke = invokeReturning(undefined);
    await acceptJob(invoke, 'CESCROW', TEST_PUBLIC, 1n);
    await submitResult(invoke, 'CESCROW', TEST_PUBLIC, 1n, 'done');
    await releasePayment(invoke, 'CESCROW', TEST_PUBLIC, 1n);
    const methods = (invoke as unknown as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[1]);
    expect(methods).toEqual(['accept_job', 'submit_result', 'release']);
  });
});

describe('setRateLimits', () => {
  it('invokes set_limits with the configured limits', async () => {
    const invoke = invokeReturning(undefined);
    await setRateLimits(invoke, 'CLIMITER', TEST_PUBLIC, {
      maxPerTx: '1', maxPerHour: '2', maxPerDay: '3', maxTxsPerHour: 4,
    });
    expect(invoke).toHaveBeenCalledWith('CLIMITER', 'set_limits', expect.any(Array));
  });
});
