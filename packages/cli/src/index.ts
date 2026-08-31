#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import {
  fromStroops,
  rankRoutes,
  type PaymentQuote,
  type RouteHop,
  type RouteQuote,
} from '@stellaragent/core';

const HELP = `StellarAgent CLI

Usage:
  stellaragent route preview --quote <quote.json> [--confirm]

Commands:
  route preview   Validate and display a routed-payment quote before confirmation

Options:
  --quote <file>  PaymentQuote JSON produced by @stellaragent/core
  --confirm       Confirm the displayed route (preview-only without this flag)
  --help          Show this help`;

export interface CliIO {
  stdout(message: string): void;
  stderr(message: string): void;
}

const terminalIO: CliIO = {
  stdout: (message) => process.stdout.write(`${message}\n`),
  stderr: (message) => process.stderr.write(`${message}\n`),
};

/** Execute the CLI without terminating the host process. */
export async function runCli(args: readonly string[], io: CliIO = terminalIO): Promise<number> {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    io.stdout(HELP);
    return 0;
  }

  if (args[0] !== 'route' || args[1] !== 'preview') {
    io.stderr(`Unknown command: ${args.join(' ')}`);
    io.stderr(HELP);
    return 2;
  }

  const quotePath = optionValue(args, '--quote');
  if (!quotePath) {
    io.stderr('Missing required option: --quote <quote.json>');
    return 2;
  }

  try {
    const quote = parsePaymentQuote(JSON.parse(await readFile(quotePath, 'utf8')));
    io.stdout(formatQuotePreview(quote));
    if (args.includes('--confirm')) {
      io.stdout(`Confirmed route ${quote.route.id}. Pass this unchanged quote to payForAPI().`);
    } else {
      io.stdout('Preview only. Re-run with --confirm after reviewing the route and cost.');
    }
    return 0;
  } catch (error) {
    io.stderr(`Route preview failed: ${errorMessage(error)}`);
    return 1;
  }
}

/** Human-readable preview shared by the command and tests. */
export function formatQuotePreview(quote: PaymentQuote): string {
  const route = quote.route;
  const sourceFee = BigInt(route.sourceAmount) * BigInt(route.totalFeeBps) / 10_000n;
  const warnings = quote.failures.length === 0
    ? 'none'
    : quote.failures.map((failure) => `${failure.providerId}/${failure.code}`).join(', ');

  return [
    'Routed payment preview',
    '──────────────────────',
    `You pay:             ${displayAmount(route.sourceAmount)} ${route.sourceAsset}`,
    `Recipient receives:  ${displayAmount(route.expectedDestinationAmount)} ${route.destinationAsset}`,
    `Minimum received:    ${displayAmount(quote.minimumDestinationAmount)} ${route.destinationAsset}`,
    `Route:               ${formatRoute(route)}`,
    `Estimated fee:       ${route.totalFeeBps} bps (~${displayAmount(sourceFee.toString())} ${route.sourceAsset})`,
    `Expected slippage:   ${route.expectedSlippageBps} bps`,
    `Reliability:         ${route.reliabilityBps} / 10000`,
    `Selector score:      ${route.score}`,
    `Quoted at ledger:    ${quote.quotedAtLedger}`,
    `Valid through:       ${quote.validUntilLedger}`,
    `Unavailable venues:  ${warnings}`,
  ].join('\n');
}

export function formatRoute(route: RouteQuote): string {
  const segments: string[] = [route.sourceAsset];
  for (const hop of route.hops) {
    const venue = venueLabel(hop);
    segments.push(`${venue} → ${hop.destinationAsset}`);
  }
  return segments.join(' → ');
}

function venueLabel(hop: RouteHop): string {
  if (hop.venue === 'path_payment') {
    const path = hop.path?.length ? ` via ${hop.path.join('/')}` : '';
    return `PATH[${hop.venueId}${path}]`;
  }
  return `${hop.venue.toUpperCase()}[${hop.venueId}]`;
}

function parsePaymentQuote(value: unknown): PaymentQuote {
  if (!isRecord(value) || !isRecord(value.route)) {
    throw new TypeError('quote JSON must contain a route object');
  }

  const minimum = requiredInteger(value.minimumDestinationAmount, 'minimumDestinationAmount');
  const quotedAtLedger = requiredLedger(value.quotedAtLedger, 'quotedAtLedger');
  const validUntilLedger = requiredLedger(value.validUntilLedger, 'validUntilLedger');
  if (validUntilLedger < quotedAtLedger) {
    throw new RangeError('validUntilLedger precedes quotedAtLedger');
  }

  // Reusing the production selector both recomputes the canonical score and
  // rejects malformed or out-of-policy routes before a caller confirms them.
  const route = rankRoutes([value.route as unknown as RouteQuote])[0];
  if (!route) throw new RangeError('route is outside routing policy bounds');
  if (BigInt(minimum) > BigInt(route.expectedDestinationAmount)) {
    throw new RangeError('minimumDestinationAmount exceeds expected output');
  }

  return {
    route,
    minimumDestinationAmount: minimum,
    quotedAtLedger,
    validUntilLedger,
    failures: parseFailures(value.failures),
  };
}

function parseFailures(value: unknown): PaymentQuote['failures'] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new TypeError('failures must be an array');
  return value.map((failure) => {
    if (!isRecord(failure) || typeof failure.providerId !== 'string' ||
      typeof failure.code !== 'string' || typeof failure.message !== 'string') {
      throw new TypeError('each failure must contain providerId, code, and message');
    }
    return failure as unknown as PaymentQuote['failures'][number];
  });
}

function optionValue(args: readonly string[], option: string): string | undefined {
  const index = args.indexOf(option);
  return index >= 0 ? args[index + 1] : undefined;
}

function requiredInteger(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new TypeError(`${name} must be a canonical integer string`);
  }
  return value;
}

function requiredLedger(value: unknown, name: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new TypeError(`${name} must be a non-negative safe integer`);
  }
  return value as number;
}

function displayAmount(amount: string): string {
  return fromStroops(BigInt(amount));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

if (process.env.NODE_ENV !== 'test') {
  void runCli(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
