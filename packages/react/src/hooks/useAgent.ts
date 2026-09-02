import { useCallback } from 'react';
import type { AgentInfo } from '@stellaragent/core';
import { useStellarAgent } from '../StellarAgentProvider.js';
import { usePolling, type UsePollingOptions, type UsePollingResult } from '../internal/usePolling.js';

/**
 * Polls `StellarAgent.getAgent` for `agentId` via the current
 * `StellarAgent`. Disabled (stays `idle`) until both the agent is `ready`
 * and `agentId` is defined.
 */
export function useAgent(
  agentId: bigint | undefined,
  options?: UsePollingOptions,
): UsePollingResult<AgentInfo> {
  const { agent, status } = useStellarAgent();

  const fetcher = useCallback(() => {
    if (!agent || agentId === undefined) {
      return Promise.reject(new Error('useAgent: agent not ready or agentId not set'));
    }
    return agent.getAgent(agentId);
  }, [agent, agentId]);

  const enabled = Boolean(agent) && status === 'ready' && agentId !== undefined;

  return usePolling(enabled ? fetcher : null, options);
}
