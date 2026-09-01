import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { AgentInfo } from '@stellaragent/core';
import { StellarAgentProvider } from '../StellarAgentProvider.js';
import { useAgent } from '../hooks/useAgent.js';
import { createMockAgent } from '../test/mockAgent.js';

const agentInfo: AgentInfo = {
  id: 42n,
  address: 'GAGENTADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  name: 'test-agent',
  owner: 'GOWNERXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  active: true,
  createdAt: 1_700_000_000,
  totalOps: 7n,
};

// `@testing-library/react`'s `waitFor` polls via `setTimeout`, which is
// exactly what fake timers freeze — so under `vi.useFakeTimers()` we
// advance time explicitly (inside `act`) and assert directly.
async function flush() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useAgent', () => {
  it('stays idle when agentId is undefined', () => {
    const mockAgent = createMockAgent();
    const { result } = renderHook(() => useAgent(undefined), {
      wrapper: ({ children }) => (
        <StellarAgentProvider config={{ network: 'local' }} agent={mockAgent}>
          {children}
        </StellarAgentProvider>
      ),
    });

    expect(result.current.status).toBe('idle');
    expect(mockAgent.getAgent).not.toHaveBeenCalled();
  });

  it('loads and returns agent data', async () => {
    const mockAgent = createMockAgent({ getAgent: async () => agentInfo });

    const { result } = renderHook(() => useAgent(42n), {
      wrapper: ({ children }) => (
        <StellarAgentProvider config={{ network: 'local' }} agent={mockAgent}>
          {children}
        </StellarAgentProvider>
      ),
    });

    await flush();
    expect(result.current.status).toBe('ready');
    expect(result.current.data).toEqual(agentInfo);
    expect(mockAgent.getAgent).toHaveBeenCalledWith(42n);
  });

  it('surfaces errors from the agent', async () => {
    const mockAgent = createMockAgent({
      getAgent: async () => {
        throw new Error('agent not found');
      },
    });

    const { result } = renderHook(() => useAgent(99n), {
      wrapper: ({ children }) => (
        <StellarAgentProvider config={{ network: 'local' }} agent={mockAgent}>
          {children}
        </StellarAgentProvider>
      ),
    });

    await flush();
    expect(result.current.status).toBe('error');
    expect(result.current.error?.message).toBe('agent not found');
    expect(result.current.data).toBeNull();
  });

  it('re-polls on the configured interval and stops after unmount', async () => {
    const getAgent = vi.fn(async () => agentInfo);
    const mockAgent = createMockAgent({ getAgent });

    const { result, unmount } = renderHook(() => useAgent(42n, { intervalMs: 1000 }), {
      wrapper: ({ children }) => (
        <StellarAgentProvider config={{ network: 'local' }} agent={mockAgent}>
          {children}
        </StellarAgentProvider>
      ),
    });

    await flush();
    expect(result.current.status).toBe('ready');
    expect(getAgent).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(getAgent).toHaveBeenCalledTimes(2);

    unmount();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(getAgent).toHaveBeenCalledTimes(2);
  });
});
