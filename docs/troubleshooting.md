# Troubleshooting

Failures are listed by the text you actually see, so search this page for the
exact message. Each entry gives the cause, then the fix.

- [Build and deploy](#build-and-deploy)
- [Configuration](#configuration)
- [Runtime](#runtime)

## Build and deploy

### `can't find crate for 'core'`

```
error[E0463]: can't find crate for `core`
  = note: the `wasm32v1-none` target may not be installed
```

The wasm target is not installed. It reads like a broken dependency tree, but
the fix is one command:

```bash
rustup target add wasm32v1-none
```

`scripts/setup.sh` checks for this (and the other prerequisites) up front and
prints the fix under each failure. Run it first.

### `reference-types not enabled: zero byte expected`

```
HostError: Error(WasmVm, InvalidAction)
reference-types not enabled: zero byte expected
```

The contract was built for `wasm32-unknown-unknown`. Under Rust >= 1.82 that
target emits the post-MVP `reference-types` wasm feature, which soroban-sdk
22's VM rejects when you upload the contract.

The trap is that **`cargo build` succeeds**. The artifact is simply
undeployable, so nothing fails until upload. CI builds with `wasm32v1-none` for
the same reason (see the comment above the "Build WASM" step in
[.github/workflows/ci.yml](../.github/workflows/ci.yml)): building the old
target there would give a green CI and a broken deploy.

```bash
rustup target add wasm32v1-none
cd contracts && cargo build --target wasm32v1-none --release
```

`pnpm deploy:contracts` picks `wasm32v1-none` automatically when installed and
warns when it falls back. Setting
`RUSTFLAGS="-C target-feature=-reference-types"` does **not** help: the feature
comes from the precompiled `core`/`std` for that target, not from your crate.

### `WASM not found: ...`

You passed `--skip-build` without having built for the target the deploy script
selected. Drop the flag, or build that target explicitly (see above).

### `already initialized`

The contract was initialized by an earlier run. This is expected on a redeploy;
the deploy script skips it.

More deploy failures: [deployment.md](deployment.md#troubleshooting).

## Configuration

### `Contracts not deployed for network "testnet"`

```
ContractsNotDeployedError: Contracts not deployed for network "testnet" - see docs/deployment.md

Unconfigured or invalid: paymentChannel, escrow
```

`StellarAgent.create()` found a contract address that is still an
**unconfigured sentinel** (a placeholder standing in for "nothing deployed
here") or is not a valid 56-character contract ID. It fails at create time
rather than deep inside an RPC call. The `missing` field on the error lists the
offending contracts: `agentWalletFactory`, `paymentChannel`, `escrow`,
`rateLimiter`, `circuitBreaker`.

Pick one:

1. **Deploy them:** `pnpm deploy:contracts --network testnet --source alice`.
   This writes `deployments/testnet.json` and prints an `.env` block.
2. **Pass addresses explicitly** (highest precedence):
   ```typescript
   StellarAgent.create({ network: 'testnet', contracts: { paymentChannel: 'C...' } });
   ```
3. **Set environment variables.** Each contract is read from, in order:

   | Variable | Scope |
   | --- | --- |
   | `STELLARAGENT_<NETWORK>_<CONTRACT>` | one network, e.g. `STELLARAGENT_TESTNET_PAYMENT_CHANNEL` |
   | `STELLARAGENT_<CONTRACT>` | every network, e.g. `STELLARAGENT_PAYMENT_CHANNEL` |

   `<CONTRACT>` is one of `AGENT_WALLET_FACTORY`, `PAYMENT_CHANNEL`, `ESCROW`,
   `RATE_LIMITER`, `CIRCUIT_BREAKER`. All five must resolve.

Common causes: a variable is set for the wrong network (`MAINNET` vs
`TESTNET`), the `.env` block was never loaded into the process, or the value is
empty (empty counts as unset). The package is also bundled for browsers, so it
cannot read `deployments/<network>.json` itself; import the JSON and pass it as
`contracts` if you want the file.

Tests and tools that never touch the chain can pass
`allowUnconfiguredContracts: true` (Python: `allow_unconfigured_contracts`) to
skip the check. Do not use it for real payments.

Source: [packages/core/src/contracts.ts](../packages/core/src/contracts.ts).

### A non-XLM asset code (for example `USDC`) will not resolve

Friendly asset codes other than XLM (for example `USDC`) need an
`assetContracts` mapping to the deployed Stellar Asset Contract ID. See the
[README](../README.md#sdk-typescript).

## Runtime

### `no rate limit for agent`

```
HostError: Error(Contract, #3), no rate limit for agent
```

The `RateLimiter` contract has no limits registered for that agent address.
It is not a zero limit: the contract deliberately fails instead of returning
empty limits, so callers can tell "unconfigured" from "limit of 0". The SDKs
surface it as `RATE_LIMIT_NOT_FOUND`, and the dashboard's Rate Limits view shows
"No rate limits configured for ..." instead of zeros.

Set limits for the agent on the rate limiter, and check that the agent address
you are querying is the one that was configured (a restored agent must use the
same secret key).

### `this invocation reads ledger entries that have been archived`

Reported as `SIMULATION_FAILED`. Soroban archives contract state whose TTL has
lapsed, and simulation returns a `restorePreamble` when an invocation would
touch such an entry. The call cannot run until the entries are restored.

Restore them, then retry. With the Stellar CLI:

```bash
stellar contract restore --id <CONTRACT_ID> --network testnet --source <KEY>
```

Long-lived contracts should have their TTL extended periodically so this does
not happen on a quiet testnet deployment.

### `SPEND_LIMIT_EXCEEDED`, `channel is closed`, `job has expired`

These are contract-level rejections, mapped to specific error codes by the SDKs
(`SPEND_LIMIT_EXCEEDED`, `CHANNEL_CLOSED`, `JOB_EXPIRED`, and so on). They mean
the contract is working as designed: raise the channel limit, open a new
channel, or post a job with a later deadline. The full code list is in the
[API reference](api/README.md).

### `route quote expired`

The routing quote passed to `payForAPI()` is older than its validity window.
Call `agent.quote()` again and pass the fresh quote unchanged. See
[payment-routing.md](payment-routing.md).

### `quorum not reached` when pausing

Fewer than five distinct trusted nodes called `propose_pause` inside the
validity window, or the trusted set has fewer than five members. Rotate it with
`circuit_breaker.set_trusted_nodes`.

### Calls fail after a successful deploy

Cross-wiring was skipped. Re-run the deploy script; the `set_*` entrypoints are
idempotent for the same admin. See [deployment.md](deployment.md).
