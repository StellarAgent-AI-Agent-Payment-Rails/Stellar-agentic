# @stellaragent/core

The TypeScript SDK for AI Agent Payment Rails on Stellar. See the
[root README](../../README.md#sdk-typescript) for installation and a quick
start.

- **API reference** (generated from this package's TSDoc comments):
  [`docs/api/core`](../../docs/api/core/README.md)
- **Module structure and where new code belongs**:
  [`docs/architecture/core-modules.md`](../../docs/architecture/core-modules.md)
- **Signing and key custody**: [`docs/signing.md`](../../docs/signing.md)

## Development

```bash
pnpm --filter @stellaragent/core build       # tsup, emits dist/ + .d.ts
pnpm --filter @stellaragent/core test        # vitest
pnpm --filter @stellaragent/core typecheck
pnpm --filter @stellaragent/core lint
```

After changing a public type or a `StellarAgent` method's signature or doc
comment, regenerate the API report and reference docs from the repo root:

```bash
pnpm docs:api
```

CI runs `pnpm docs:api:check` and fails if the committed output is stale.
