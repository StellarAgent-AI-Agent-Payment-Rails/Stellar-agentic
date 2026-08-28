[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RequestWorkParams

# Interface: RequestWorkParams

Defined in: [types/index.ts:270](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L270)

## Properties

### workerAgent

> **workerAgent**: `string`

Defined in: [types/index.ts:272](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L272)

Address of the worker agent

***

### task

> **task**: `string`

Defined in: [types/index.ts:274](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L274)

Task description or IPFS hash

***

### escrowAmount

> **escrowAmount**: `string`

Defined in: [types/index.ts:276](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L276)

Amount to lock in escrow

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:278](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L278)

Asset to pay with

***

### deadlineLedgers?

> `optional` **deadlineLedgers?**: `number`

Defined in: [types/index.ts:280](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L280)

Deadline in ledgers from now

***

### arbiter?

> `optional` **arbiter?**: `string`

Defined in: [types/index.ts:282](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L282)

Optional arbiter address for disputes
