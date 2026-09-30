# Browser compatibility

`The core SDK (`@stellaragent/core`) ships both CJS and ESM and is bundled into the dashboard through Vite. This document records what is verified to work in a browser, what is Node-only, and how the check is wired into CI.

## What is tested

The browser smoke test lives at `dashboard/e2e/browser-sdk.spec.ts`. It loads a production Vite build of the dashboard (the same bundle that ships) and drives the SDK's read paths in Chromium via Playwright. The bundled module exposes a smoke hook on `window.__stellaragentCoreSmoke` when the dashboard is loaded with `?smoke=browser-sdk`. The hook runs the read paths and reports whether `Buffer` or `process` were referenced at runtime.

Assertions:

- `TypeError: Buffer is not defined` must not appear in the browser console.
- `decodeBytes` decodes hex and UTF-8 bytes correctly.
- `bytesVal` returns the expected hex string and length.
- No `process.env` read is required to import or use the SEK.

## Node-only methods

At the time of writing, **the read paths exercised by the smoke test are browser-safe**. The following are Node-only and are not invoked from the browser bundle:

- Any method that requires a filesystem or a native crypto addon. These are guarded behind dynamic imports and are not part of the browser entry point.

If a new method is added that relies on `Buffer` or `process`, it must either be guarded behind a browser check or documented here as Node-only. The browser smoke test will fail if a new reference leaks onto the browser path.

## How to run it locally

```bash
cd dashboard
pnpm exec playwright test e2e/browser-sdk.spec.ts
```

The Playwright config builds the dashboard in mock mode and serves it with `vite preview`, so no deployed contracts or indexer are required.

## CI

The browser smoke test runs as part of the dashboard Playwright suite. The existing workflow that invokes `pnpm --filter dashboard test:e2e` therefore exercises the browser bundle of the SDK on every run. The `webServer` block in `dashboard/playwright.config.ts` builds the bundle before the tests start, so a broken browser build fails CI before any assertion runs.
