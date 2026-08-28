[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / SubmissionPipelineConfig

# Interface: SubmissionPipelineConfig

Defined in: [types/index.ts:157](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L157)

## Properties

### concurrency?

> `optional` **concurrency?**: `number`

Defined in: [types/index.ts:158](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L158)

***

### maxQueueSize?

> `optional` **maxQueueSize?**: `number`

Defined in: [types/index.ts:159](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L159)

***

### maxAttempts?

> `optional` **maxAttempts?**: `number`

Defined in: [types/index.ts:160](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L160)

***

### retryDelayMs?

> `optional` **retryDelayMs?**: `number`

Defined in: [types/index.ts:161](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L161)

***

### classifyError?

> `optional` **classifyError?**: [`RetryClassifier`](../type-aliases/RetryClassifier.md)

Defined in: [types/index.ts:162](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L162)

***

### minChannels?

> `optional` **minChannels?**: `number`

Defined in: [types/index.ts:164](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L164)

Eager sponsored channel count when `sponsorService` creates the pool.

#### Default

```ts
1
```

***

### maxChannels?

> `optional` **maxChannels?**: `number`

Defined in: [types/index.ts:166](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L166)

Demand-driven sponsored channel limit.

#### Default

```ts
concurrency
```
