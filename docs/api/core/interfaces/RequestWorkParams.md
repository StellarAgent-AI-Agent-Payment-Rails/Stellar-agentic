[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RequestWorkParams

# Interface: RequestWorkParams

Defined in: [types/index.ts:214](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L214)

## Properties

### workerAgent

> **workerAgent**: `string`

Defined in: [types/index.ts:216](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L216)

Address of the worker agent

***

### task

> **task**: `string`

Defined in: [types/index.ts:218](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L218)

Task description or IPFS hash

***

### escrowAmount

> **escrowAmount**: `string`

Defined in: [types/index.ts:220](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L220)

Amount to lock in escrow

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:222](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L222)

Asset to pay with

***

### deadlineLedgers?

> `optional` **deadlineLedgers?**: `number`

Defined in: [types/index.ts:224](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L224)

Deadline in ledgers from now

***

### arbiter?

> `optional` **arbiter?**: `string`

Defined in: [types/index.ts:226](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L226)

Optional arbiter address for disputes
