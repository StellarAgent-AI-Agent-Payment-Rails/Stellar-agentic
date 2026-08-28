[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / StellarAgent

# Class: StellarAgent

Defined in: [agent/StellarAgent.ts:59](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L59)

Main SDK class for AI Agent payment operations on Stellar.

## Example

```typescript
const agent = await StellarAgent.create({
  network: 'testnet',
  spendLimit: { amount: '10', asset: 'USDC', period: 'hourly' },
});

await agent.payForAPI({
  endpoint: 'https://api.example.com/inference',
  amount: '0.001',
  asset: 'USDC',
});
```

## Accessors

### address

#### Get Signature

> **get** **address**(): `string`

Defined in: [agent/StellarAgent.ts:285](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L285)

The agent's Stellar public address.

Resolved through the [Signer](../interfaces/Signer.md) at `create()` time, so this works
identically for a remote signer that never exposes its secret.

##### Returns

`string`

***

### secretKey

#### Get Signature

> **get** **secretKey**(): `string`

Defined in: [agent/StellarAgent.ts:303](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L303)

The agent's secret key.

Only available when the agent was built from an in-memory keypair. With
any other [Signer](../interfaces/Signer.md) there is no secret in this process to return —
which is the point — so this throws rather than returning something
misleading.

##### Deprecated

Reading key material off a live agent is the pattern the
[Signer](../interfaces/Signer.md) abstraction exists to remove. Hold the secret yourself if
you need it, or use a [RemoteSigner](RemoteSigner.md) and stop having one.

##### Throws

when signing is not backed by a local keypair

##### Returns

`string`

***

### holdsSecretKey

#### Get Signature

> **get** **holdsSecretKey**(): `boolean`

Defined in: [agent/StellarAgent.ts:320](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L320)

Whether this agent holds key material in-process.

`false` for a remote or hardware signer. Useful for asserting a
production deployment is not running with an in-memory secret.

##### Returns

`boolean`

## Methods

### create()

> `static` **create**(`config`): `Promise`\<`StellarAgent`\>

Defined in: [agent/StellarAgent.ts:144](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L144)

Create a new StellarAgent instance.

Supply exactly one of:
- `signer` — any [Signer](../interfaces/Signer.md). The secret never enters this process.
- `secretKey` — an in-memory keypair, wrapped in a [KeypairSigner](KeypairSigner.md).
- neither — a fresh random keypair is generated.

Contract addresses resolve from `config.contracts`, then from
`STELLARAGENT_*` environment variables, then from the per-network
unconfigured sentinels. If the result is not a set of real deployed
contract IDs this throws [ContractsNotDeployedError](ContractsNotDeployedError.md) immediately,
rather than letting an opaque RPC error surface later from the middle of
a payment. Pass `allowUnconfiguredContracts: true` to skip that check
when you only need read-only, contract-free calls such as
[StellarAgent.getBalance](#getbalance).

#### Parameters

##### config

[`StellarAgentConfig`](../interfaces/StellarAgentConfig.md)

#### Returns

`Promise`\<`StellarAgent`\>

#### Example

**Remote signer — no key material in this process**

```typescript
const agent = await StellarAgent.create({
  network: 'testnet',
  signer: new RemoteSigner({ url: 'https://signer.internal', token: TOKEN }),
});
```

#### Throws

when contracts are not deployed

***

### fromSecret()

> `static` **fromSecret**(`secretKey`, `network?`, `options?`): `Promise`\<`StellarAgent`\>

Defined in: [agent/StellarAgent.ts:269](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L269)

Restore an agent from an existing secret key.

`options` forwards the rest of [StellarAgentConfig](../interfaces/StellarAgentConfig.md) — notably
`contracts` and `allowUnconfiguredContracts`, without which a restored
agent could only ever target contracts resolved from the environment.

#### Parameters

##### secretKey

`string`

##### network?

[`Network`](../type-aliases/Network.md) = `'testnet'`

##### options?

`Omit`\<[`StellarAgentConfig`](../interfaces/StellarAgentConfig.md), `"network"` \| `"secretKey"`\> = `{}`

#### Returns

`Promise`\<`StellarAgent`\>

***

### getFleetStats()

> **getFleetStats**(): `object`

Defined in: [agent/StellarAgent.ts:325](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L325)

Current channel utilization and queue/backpressure counters.

#### Returns

`object`

##### channels?

> `optional` **channels?**: [`ChannelPoolStats`](../interfaces/ChannelPoolStats.md)

##### submissions

> **submissions**: [`SubmissionQueueStats`](../interfaces/SubmissionQueueStats.md)

***

### resizeChannelPool()

> **resizeChannelPool**(`size`): `Promise`\<`void`\>

Defined in: [agent/StellarAgent.ts:336](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L336)

Grow or reclaim the configured channel-account fleet.

#### Parameters

##### size

`number`

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [agent/StellarAgent.ts:347](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L347)

Drain accepted submissions and reclaim agent-owned channel accounts.

#### Returns

`Promise`\<`void`\>

***

### createAgentWallet()

> **createAgentWallet**(`name?`): `Promise`\<`bigint`\>

Defined in: [agent/StellarAgent.ts:354](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L354)

Register this wallet in the configured AgentWalletFactory contract.

#### Parameters

##### name?

`string` = `'StellarAgent'`

#### Returns

`Promise`\<`bigint`\>

***

### getAgent()

> **getAgent**(`agentId`): `Promise`\<[`AgentInfo`](../interfaces/AgentInfo.md)\>

Defined in: [agent/StellarAgent.ts:367](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L367)

Read and decode an agent registered in AgentWalletFactory.

#### Parameters

##### agentId

`bigint`

#### Returns

`Promise`\<[`AgentInfo`](../interfaces/AgentInfo.md)\>

***

### openChannel()

> **openChannel**(`params`): `Promise`\<`bigint`\>

Defined in: [agent/StellarAgent.ts:383](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L383)

Open a payment channel for this agent.
Deposits tokens and sets a per-period spend limit.

#### Parameters

##### params

[`OpenChannelParams`](../interfaces/OpenChannelParams.md)

#### Returns

`Promise`\<`bigint`\>

The channel ID

***

### closeChannel()

> **closeChannel**(`channelId?`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:397](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L397)

Close a payment channel and return its remaining token balance.

#### Parameters

##### channelId?

`bigint` \| `undefined`

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

***

### payForAPI()

> **payForAPI**(`params`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:442](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L442)

Pay for an API call. Deducts from the active payment channel.
Respects on-chain spend limits automatically.

If `destAsset` differs from the channel's settlement asset, this
settles the recipient in `destAsset` instead — e.g. a channel funded
in USDC paying a provider that only accepts XLM — by invoking
`PaymentChannel.pay_with_conversion` rather than `pay`. The spend
limit is still enforced in the channel's settlement asset either way.

#### Parameters

##### params

[`PayForAPIParams`](../interfaces/PayForAPIParams.md)

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

#### Example

```typescript
await agent.payForAPI({
  endpoint: 'https://api.openai.com/v1/chat',
  amount: '0.001',
  asset: 'USDC',
});

// Channel funded in USDC, provider only accepts XLM:
await agent.payForAPI({
  endpoint: 'https://api.example.com/inference',
  amount: '0.001',
  asset: 'USDC',
  destAsset: 'XLM',
  minReceived: '0.009', // slippage floor, in XLM
});
```

***

### requestWork()

> **requestWork**(`params`): `Promise`\<`bigint`\>

Defined in: [agent/StellarAgent.ts:477](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L477)

Create an escrow job delegating work to another agent.
Locks payment until the work is delivered and released.

#### Parameters

##### params

[`RequestWorkParams`](../interfaces/RequestWorkParams.md)

#### Returns

`Promise`\<`bigint`\>

#### Example

```typescript
const job = await agent.requestWork({
  workerAgent: 'G...WORKER_ADDRESS',
  task: 'Summarize this document: ipfs://Qm...',
  escrowAmount: '0.05',
  asset: 'USDC',
});
```

***

### acceptJob()

> **acceptJob**(`jobId`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:492](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L492)

Accept an open escrow job as a worker agent

#### Parameters

##### jobId

`bigint`

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

***

### submitResult()

> **submitResult**(`jobId`, `result`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:499](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L499)

Submit work result for an escrow job

#### Parameters

##### jobId

`bigint`

##### result

`string`

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

***

### releasePayment()

> **releasePayment**(`jobId`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:512](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L512)

Release escrow payment to the worker after work is complete

#### Parameters

##### jobId

`bigint`

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

***

### setRateLimits()

> **setRateLimits**(`config`): `Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

Defined in: [agent/StellarAgent.ts:522](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L522)

Configure rate limits for this agent on-chain.
Protects against runaway spending.

#### Parameters

##### config

[`RateLimitConfig`](../interfaces/RateLimitConfig.md)

#### Returns

`Promise`\<[`TxResult`](../interfaces/TxResult.md)\>

***

### checkRateLimit()

> **checkRateLimit**(`amount`): `Promise`\<`boolean`\>

Defined in: [agent/StellarAgent.ts:529](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L529)

Check if a payment would be blocked by rate limits (read-only)

#### Parameters

##### amount

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getBalance()

> **getBalance**(): `Promise`\<`string`\>

Defined in: [agent/StellarAgent.ts:538](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L538)

Get current XLM balance

#### Returns

`Promise`\<`string`\>

***

### getSpendReport()

> **getSpendReport**(): `Promise`\<[`SpendReport`](../interfaces/SpendReport.md)\>

Defined in: [agent/StellarAgent.ts:545](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L545)

Get spend report for the current period

#### Returns

`Promise`\<[`SpendReport`](../interfaces/SpendReport.md)\>

***

### getChannel()

> **getChannel**(`channelId`): `Promise`\<[`ChannelInfo`](../interfaces/ChannelInfo.md)\>

Defined in: [agent/StellarAgent.ts:552](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L552)

Get info about a payment channel

#### Parameters

##### channelId

`bigint`

#### Returns

`Promise`\<[`ChannelInfo`](../interfaces/ChannelInfo.md)\>

***

### getJob()

> **getJob**(`jobId`): `Promise`\<[`JobInfo`](../interfaces/JobInfo.md)\>

Defined in: [agent/StellarAgent.ts:559](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L559)

Get info about a job

#### Parameters

##### jobId

`bigint`

#### Returns

`Promise`\<[`JobInfo`](../interfaces/JobInfo.md)\>

***

### getRateLimitStatus()

> **getRateLimitStatus**(`agentAddress?`): `Promise`\<[`RateLimitStatus`](../interfaces/RateLimitStatus.md)\>

Defined in: [agent/StellarAgent.ts:572](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L572)

Get current rate-limit usage alongside the configured limits.

`RateLimiter.get_limits` is keyed by an arbitrary agent address, not
necessarily this agent's own — an owner monitoring several agents can
query any of them read-only through one signed-in `StellarAgent`.
Defaults to [StellarAgent.address](#address) (checking this agent's own
limits) when omitted.

#### Parameters

##### agentAddress?

`string` = `...`

#### Returns

`Promise`\<[`RateLimitStatus`](../interfaces/RateLimitStatus.md)\>

***

### getLedgerCloseEstimate()

> **getLedgerCloseEstimate**(): `Promise`\<[`LedgerCloseEstimate`](../interfaces/LedgerCloseEstimate.md)\>

Defined in: [agent/StellarAgent.ts:587](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/agent/StellarAgent.ts#L587)

Derive the current ledger sequence and an *estimated* average ledger
close time from a handful of recently observed ledgers via Horizon.

Ledgers close roughly every 5 seconds, but that figure drifts with
network conditions rather than being contractually fixed — so this
measures it from real recent closes instead of assuming a constant. Used
to convert a `RateLimiter`/`PaymentChannel` ledger-count window (e.g.
"720 ledgers until the hourly window resets") into a human wall-clock
estimate. See `ledgerTime.ts` for the derivation and its caveats.

#### Returns

`Promise`\<[`LedgerCloseEstimate`](../interfaces/LedgerCloseEstimate.md)\>
