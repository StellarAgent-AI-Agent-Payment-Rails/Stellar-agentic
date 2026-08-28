[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / FeeBumpConfig

# Interface: FeeBumpConfig

Defined in: [types/index.ts:135](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L135)

## Properties

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [types/index.ts:137](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L137)

#### Default

```ts
true
```

***

### mode?

> `optional` **mode?**: `"on_expiry"` \| `"always"`

Defined in: [types/index.ts:139](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L139)

`always` is required when the inner source has zero XLM.

#### Default

```ts
on_expiry
```

***

### signer?

> `optional` **signer?**: [`Signer`](Signer.md)

Defined in: [types/index.ts:141](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L141)

Outer fee source. Defaults to the sponsor, channel, or agent signer in that order.

***

### strategy?

> `optional` **strategy?**: `string` \| `number` \| `bigint` \| [`FeeStrategy`](FeeStrategy.md) \| [`FeeCallback`](../type-aliases/FeeCallback.md)

Defined in: [types/index.ts:143](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L143)

A distinct policy for bumps. Defaults to 10x the initial fee or recent fees, whichever is higher.

***

### triggerAfterAttempts?

> `optional` **triggerAfterAttempts?**: `number`

Defined in: [types/index.ts:150](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L150)

Poll attempts before a pending inner transaction is bumped.

#### Default

```ts
3
```

***

### expiryThresholdSeconds?

> `optional` **expiryThresholdSeconds?**: `number`

Defined in: [types/index.ts:152](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L152)

Remaining transaction lifetime that triggers a bump.

#### Default

```ts
10
```

***

### maxBumps?

> `optional` **maxBumps?**: `number`

Defined in: [types/index.ts:154](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L154)

Maximum replacement envelopes for one invocation.

#### Default

```ts
1
```
