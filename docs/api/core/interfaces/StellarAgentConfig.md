[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / StellarAgentConfig

# Interface: StellarAgentConfig

Defined in: [types/index.ts:42](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L42)

## Properties

### network

> **network**: [`Network`](../type-aliases/Network.md)

Defined in: [types/index.ts:44](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L44)

Stellar network to connect to

***

### signer?

> `optional` **signer?**: `object`

Defined in: [types/index.ts:56](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L56)

Where signing happens.

Prefer this over `secretKey` for anything holding real funds: with a
`RemoteSigner` (or a hardware/wallet-backed one) the key never enters
this process, so a heap dump or a compromised transitive dependency
cannot yield it. Mutually exclusive with `secretKey`.

Typed structurally rather than imported to keep `types/` free of runtime
imports; see `signer.ts` for the interface and its implementations.

#### getPublicKey()

> **getPublicKey**(): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### signTransaction()

> **signTransaction**(`xdr`, `options`): `Promise`\<`string`\>

##### Parameters

###### xdr

`string`

###### options

###### networkPassphrase

`string`

##### Returns

`Promise`\<`string`\>

#### signAuthEntry()

> **signAuthEntry**(`authEntryXdr`, `options`): `Promise`\<`string`\>

##### Parameters

###### authEntryXdr

`string`

###### options

###### networkPassphrase

`string`

###### validUntilLedgerSeq

`number`

##### Returns

`Promise`\<`string`\>

***

### secretKey?

> `optional` **secretKey?**: `string`

Defined in: [types/index.ts:71](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L71)

Private key for the agent wallet (keep secret!).

Holding a raw secret in a long-lived process is a real risk for an agent
with funds — use `signer` instead where that matters. Mutually exclusive
with `signer`.

***

### spendLimit?

> `optional` **spendLimit?**: [`SpendLimit`](SpendLimit.md)

Defined in: [types/index.ts:73](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L73)

Spend limit enforced on-chain

***

### contracts?

> `optional` **contracts?**: `Partial`\<[`ContractAddresses`](ContractAddresses.md)\>

Defined in: [types/index.ts:79](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L79)

Contract addresses. Anything omitted falls back to the
`STELLARAGENT_<NETWORK>_<CONTRACT>` / `STELLARAGENT_<CONTRACT>`
environment variables, then to the network's unconfigured sentinel.

***

### assetContracts?

> `optional` **assetContracts?**: `Record`\<`string`, `string`\>

Defined in: [types/index.ts:84](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L84)

Token contract IDs keyed by friendly asset code (for example `USDC`).
`XLM` resolves automatically, and a `C...` ID may be passed directly.

***

### allowUnconfiguredContracts?

> `optional` **allowUnconfiguredContracts?**: `boolean`

Defined in: [types/index.ts:97](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L97)

Skip the deployed-contracts check in `StellarAgent.create()`.

By default an agent refuses to be created against contract addresses
that are not real deployed contract IDs, so the failure names the actual
problem instead of surfacing as an opaque RPC error mid-payment. Set
this when you only need calls that touch no contract at all — currently
`getBalance()` — or in tests. Any contract call made on such an agent
will still fail.

#### Default

```ts
false
```
