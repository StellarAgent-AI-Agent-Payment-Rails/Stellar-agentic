import { test, expect } from '@playwright/test';

/**
 * Browser compatibility smoke test for `@stellaragent/core`.
 *
 * The SDK ships CJS and ESM and is bundled into the dashboard through Vite.
 * Nothing up to now verified that the read paths actually work in a browser,
 * and `Buffer` usage in the SDK is a live risk outside Node.
 *
 * This spec drives the browser bundle of the SDK through its read paths and
 * asserts that no Node-only globals (`Buffer`, `process`) are referenced at
 * runtime. The bundle is produced by Vite in the `dashboard/' workspace,
 * which is the same path the dashboard ships.
 *
 * The actual bundle is exposed to the page by `dashboard/src/browser-smoke.ts`,
 * which imports the SEK and attaches it to `window.__stellaragentCore`
 * when the `?smoke=browser-sdk` query parameter is present. That keeps the
 * production bundle free of test-only code while still exercising the real
 * bundled module.
 */

const SMOKE_PATH = '/?smoke=browser-sdk';

type SmokeResult = {
  ok: boolean;
  error?: string;
  bufferReferenced: boolean;
  processReferenced: boolean;
  decodeBytes: {
    hex: string;
    utf8: string;
    empty: string;
  };
  bytesVal: {
    value: string;
    length: number;
  };
};

declare global {
  interface Window {
    __stellaragentCoreSmoke?: () => Promise<SmokeResult>;
  }
}

test.describe('@Stellaragent/core browser bundle', () => {
  test('exposes the SDK and runs its read paths without Node-only globals', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on 'console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(SMOKE_PATH);

    // The smoke hook is installed by the bundled module itself. If the
    // bundle failed to load (bad ESM export, missing polyfill, etc.), this will
    // time out and the test fails with a clear message.
    await page.waitForFunction(
      () => typeof window.__stellaragentCoreSmoke === 'function',
    );

    const result = await page.evaluate(() => window.__stellaragentCoreSmoke!());

    expect(result.error, 'smoke run reported an error').toBeUndefined();
    expect(result.ok).toBe(true);

    // The whole point of the issue: no Node-only globals on the browser
    // path. The bundle is audited by the smoke hook and the result is
    // surfaced here so a regression fails the suite rather than shipping.
    expect(result.bufferReferenced, 'Buffer referenced in browser bundle').toBe(false);
    expect(result.processReferenced, 'process referenced in browser bundle').toBe(false);

    // Read paths that the issue calls out explicitly.
    expect(result.decodeBytes.hex).toBe('hello');
    expect(result.decodeBytes.utf8).toBe('hi');
    expect(result.decodeBytes.empty).toBe('');
    expect(result.bytesVal.value).toBe('hex');
    expect(result.bytesVal.length).toBe(3);

    // No browser console errors during the run.
    expect(consoleErrors).equal([]);
  });
});
