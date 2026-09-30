import { describe, it, expect, beforeEach } from 'vitest';
import {
  averagePageLoadMs,
  formatLagStatus,
  getPageTimings,
  getTelemetryEvents,
  recordEvent,
  recordPageTiming,
} from '../telemetry.js';

describe('dashboard telemetry', () => {
  beforeEach(() => {
    // Prevent event history from leaking across tests.
    getTelemetryEvents().splice(0);
    getPageTimings().splice(0);
  });

  it('records page timing events', () => {
    recordEvent('test.event', { foo: 'bar' });
    const events = getTelemetryEvents();
    expect(events.some((e) => e.name === 'test.event')).toBe(true);
  });

  it('records page timings in order', ()) => {
    recordPageTiming({ path: '/a', loadMs: 100, domContentLoadedMs: 50, timestamp: 1 });
    recordPageTiming({ path: '/b', loadMs: 200, domContentLoadedMs: 80, timestamp: 2 });
    const timings = getPageTimings();
    expect(timings.length).toBe(2);
    expect(timings[0].path).toBe('/a');
    expect(timings[1].path).toBe('/b');
  });

  it('formats lag status labels', () => {
    expect(formatLagStatus(null)).toBe('—');
    expect(formatLagStatus(1)).toBe('Synced');
    expect(formatLagStatus(5)).toBe('Catching up');
    expect(formatLagStatus(20)).toBe('Behind');
  });

  it('computes average page load', () => {
    const avg = averagePageLoadMs([
      { path: '/a', loadMs: 100, domContentLoadedMs: 50, timestamp: 1 },
      { path: '/b', loadMs: 200, domContentLoadedMs: 80, timestamp: 2 },
    ]);
    expect(avg).toBe(150);
  });

  it('returns zero average for an empty history', () => {
    expect(averagePageLoadMs([])).toBe(0);
  });

  it('exposes readonly timing history', () => {
    expect(Array.isArray(getPageTimings())).toBe(true);
  });
});
