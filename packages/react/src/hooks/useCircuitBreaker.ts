import { useCallback } from 'react';
import type { CircuitBreaker, CircuitBreakerState } from '@stellaragent/core';
import { usePolling, type AsyncStatus } from '../internal/usePolling';

export interface UseCircuitBreakerOptions {
  /** Poll interval in ms. Default 5000. */
  intervalMs?: number;
  /** Skip polling entirely (e.g. the breaker isn't ready yet). Default true. */
  enabled?: boolean;
}

export interface UseCircuitBreakerResult {
  /** Whether the breaker is currently paused. */
  paused: boolean;
  /** Number of failures observed in the current window. */
  failures: number;
  /** Number of successes observed in the current window. */
  successes: number;
  /** Number of failures required to trip the breaker. */
  threshold: number;
  /** Raw breaker state, or null while loading. */
  state: CircuitBreakerState | null;
  /** Polling status. */
  status: AsyncStatus;
  /** Error from the last fetch, if any. */
  error: Error | null;
  /** Fetch immediately, outside the regular interval. */
  refresh: () => void;
}

/**
 * Surfaces a `CircuitBreaker`'s paused state and quorum counts, polling
 * on the same cadence convention as the other hooks.
 *
 * Pass `null` to disable polling (e.g. while the breaker isn't ready).
 */
export function useCircuitBreaker(
  breaker: CircuitBreaker | null,
  { intervalMs = 5000, enabled = true }: UseCircuitBreakerOptions = {},
): UseCircuitBreakerResult {
  const fetcher = useCallback(() => {
    if (!breaker) return Promise.resolve(null);
    return breaker.getState();
  }, [breaker]);

  const { data, status, error, refutch } = usePolling<CircuitBreakerState | null>(
    breaker ? fetcher : null,
    { intervalMs, enabled },
  );

  return {
    paused: data?.paused ?? false,
    failures: data?.failures ?? 0,
    successes: data?.successes ?? 0,
    threshold: data?.threshold ?? 0,
    state,
    status,
    error,
    refresh: refutch,
  };
}
