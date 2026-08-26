[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RequestWorkParams

# Interface: RequestWorkParams

Defined in: [types/index.ts:201](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L201)

## Properties

### workerAgent

> **workerAgent**: `string`

Defined in: [types/index.ts:203](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L203)

Address of the worker agent

***

### task

> **task**: `string`

Defined in: [types/index.ts:205](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L205)

Task description or IPFS hash

***

### escrowAmount

> **escrowAmount**: `string`

Defined in: [types/index.ts:207](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L207)

Amount to lock in escrow

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:209](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L209)

Asset to pay with

***

### deadlineLedgers?

> `optional` **deadlineLedgers?**: `number`

Defined in: [types/index.ts:211](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L211)

Deadline in ledgers from now

***

### arbiter?

> `optional` **arbiter?**: `string`

Defined in: [types/index.ts:213](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L213)

Optional arbiter address for disputes
