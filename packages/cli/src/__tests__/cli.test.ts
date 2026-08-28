import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatQuotePreview, formatRoute, runCli, type CliIO } from '../index.js';
import type { PaymentQuote } from '@stellaragent/core';

const pkgRoot = process.cwd();
const entry = resolve(pkgRoot, 'src/index.ts');
const built = resolve(pkgRoot, 'dist/index.js');

function quote(): PaymentQuote {
  return {
    route: {
      id: 'XLM>USDC|amm:CPOOL',
      sourceAsset: 'XLM',
      destinationAsset: 'USDC',
      sourceAmount: '10000000',
      expectedDestinationAmount: '9950000',
      totalFeeBps: 25,
      expectedSlippageBps: 30,
      reliabilityBps: 9700,
      hopCount: 1,
      expiresAtLedger: 12360,
      hops: [{
        venue: 'amm',
        venueId: 'CPOOL',
        sourceAsset: 'XLM',
        destinationAsset: 'USDC',
        sourceAmount: '10000000',
        expectedOutput: '9950000',
        feeAmount: '25000',
        feeBps: 25,
        slippageBps: 30,
        reliabilityBps: 9700,
      }],
      score: '81',
      breakdown: {
        weightedCost: '12',
        weightedSlippage: '9',
        weightedReliability: '60',
        hopPenalty: '0',
      },
    },
    minimumDestinationAmount: '9850500',
    quotedAtLedger: 12340,
    validUntilLedger: 12360,
    failures: [],
  };
}

function capture(): { io: CliIO; stdout: string[]; stderr: string[] } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    io: {
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    },
  };
}

function writeQuote(value: unknown = quote()): string {
  const path = join(mkdtempSync(join(tmpdir(), 'stellaragent-cli-')), 'quote.json');
  writeFileSync(path, JSON.stringify(value));
  return path;
}

describe('@stellaragent/cli packaging', () => {
  const pkg = JSON.parse(readFileSync(resolve(pkgRoot, 'package.json'), 'utf8'));

  it('declares an executable stellaragent bin entry', () => {
    expect(pkg.bin).toEqual({ stellaragent: 'dist/index.js' });
    expect(readFileSync(entry, 'utf8').startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it.runIf(existsSync(built))('the built bin shows help', () => {
    const out = execFileSync(process.execPath, [built, '--help'], {
      encoding: 'utf8',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    expect(out).toContain('route preview');
  });
});

describe('route preview', () => {
  it('shows route, cost, output floor, and expiry before confirmation', async () => {
    const output = capture();
    const exitCode = await runCli(['route', 'preview', '--quote', writeQuote()], output.io);
    const contents = output.stdout.join('\n');

    expect(exitCode).toBe(0);
    expect(contents).toContain('You pay:             1.0000000 XLM');
    expect(contents).toContain('Recipient receives:  0.9950000 USDC');
    expect(contents).toContain('Minimum received:    0.9850500 USDC');
    expect(contents).toContain('XLM → AMM[CPOOL] → USDC');
    expect(contents).toContain('Estimated fee:       25 bps');
    expect(contents).toContain('Expected slippage:   30 bps');
    expect(contents).toContain('Valid through:       12360');
    expect(contents).toContain('Preview only');
    expect(contents).not.toContain('Confirmed route');
  });

  it('prints the same preview before accepting explicit confirmation', async () => {
    const output = capture();
    const exitCode = await runCli(
      ['route', 'preview', '--quote', writeQuote(), '--confirm'],
      output.io,
    );

    expect(exitCode).toBe(0);
    expect(output.stdout[0]).toContain('Routed payment preview');
    expect(output.stdout.at(-1)).toContain('Confirmed route XLM>USDC|amm:CPOOL');
  });

  it('uses the deterministic selector to reject an inadmissible quote', async () => {
    const invalid = quote();
    invalid.route.reliabilityBps = 100;
    const output = capture();
    const exitCode = await runCli(
      ['route', 'preview', '--quote', writeQuote(invalid)],
      output.io,
    );

    expect(exitCode).toBe(1);
    expect(output.stderr.join('\n')).toContain('outside routing policy bounds');
  });

  it('reports command and option errors without terminating the process', async () => {
    const unknown = capture();
    const missing = capture();
    expect(await runCli(['unknown'], unknown.io)).toBe(2);
    expect(await runCli(['route', 'preview'], missing.io)).toBe(2);
    expect(unknown.stderr.join('\n')).toContain('Unknown command');
    expect(missing.stderr.join('\n')).toContain('Missing required option');
  });

  it('formats path-payment intermediates and provider warnings', () => {
    const value = quote();
    value.route.hops[0] = {
      ...value.route.hops[0]!,
      venue: 'path_payment',
      venueId: 'horizon',
      path: ['AQUA'],
    };
    value.failures = [{
      providerId: 'broken-amm',
      code: 'VENUE_UNAVAILABLE',
      message: 'timeout',
    }];

    expect(formatRoute(value.route)).toBe('XLM → PATH[horizon via AQUA] → USDC');
    expect(formatQuotePreview(value)).toContain('broken-amm/VENUE_UNAVAILABLE');
  });
});
