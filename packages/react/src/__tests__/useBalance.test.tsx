import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { StellarAgent } from '@stellaragent/core';
import { StellarAgentProvider } from '../StellarAgentProvider.js';
import { useBalance } from '../hooks/useBalance.js';
import { createMockAgent } from '../test/mockAgent.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const MOCK_BALANCE = '123.4567890';

function renderBalance(overrides: Parameters<typeof createMockAgent>[0], options?: Parameters<typeof useBalance>[0]) {
  const mockAgent = createMockAgent(overrides);
  return renderHook(() => useBalance(options), {
    wrapper: ({ children }) => (
      <StellarAgentProvider config={{ network: 'local' }} agent={mockAgent}>
        {children}
      </StellarAgentProvider>
    ),
  });
}

describe('useBalance', () => {
  it('is idle until the agent is ready', () => {
    vi.spyOn(StellarAgent, 'create').mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBalance(), {
      wrapper: ({ children }) => (
        <StellarAgentProvider config={{ network: 'local' }}>{children}</StellarAgentProvider>
      ),
    });

    expect(result.current.status).toBe('idle');
  });

  it('loads the XLM balance once the agent is ready', async () => {
    const { result } = renderBalance({
      getBalance: async () => MOCK_BALANCE,
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toBe(MOCK_BALANCE);
  });

  it('exposes a manual refetch', async () => {
    let balance = MOCK_BALANCE;
    const { result } = renderBalance({
      getBalance: async () => balance,
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toBe(MOCK_BALANCE);

    balance = '999.0000000';
    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toBe('999.0000000'));
  });

  it('reports errors from getBalance', async () => {
    const { result } = renderBalance({
      getBalance: async () => {
        throw new Error('horizon unavailable');
      },
    });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.message).toBe('horizon unavailable');
  });
});
