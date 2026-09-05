import { useCallback } from 'react';
import { useStellarAgent } from '../StellarAgentProvider.js';
import { usePolling, type UsePollingOptions, type UsePollingResult } from '../internal/usePolling.js';

export interface UseBalanceResult extends UsePollingResult<string> {}

/**
 * Polls the agent's current XLM balance.
 *
 * Returns the balance as a string (in canonical Horizon format), the async
 * status (`idle` | `loading` | `ready` | `error`), any error, and a `refetch`
 * function for manual refresh.
 *
 * Polling is disabled until the agent is ready, so this hook is safe to mount
 * before `StellarAgent.create()` has resolved.
 */
export function useBalance(options?: UsePollingOptions): UseBalanceResult {
  const { agent, status } = useStellarAgent();

  const fetcher = useCallback(() => {
    if (!agent) {
      return Promise.reject(new Error('useBalance: agent not ready'));
    }
    return agent.getBalance();
  }, [agent]);

  const enabled = Boolean(agent) && status === 'ready';
  return usePolling(enabled ? fetcher : null, options);
}
