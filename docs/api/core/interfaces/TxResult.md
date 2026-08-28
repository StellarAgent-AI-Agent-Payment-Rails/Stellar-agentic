[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / TxResult

# Interface: TxResult

Defined in: [types/index.ts:361](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L361)

## Properties

### hash

> **hash**: `string`

Defined in: [types/index.ts:363](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L363)

Transaction hash

***

### success

> **success**: `boolean`

Defined in: [types/index.ts:365](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L365)

Whether the transaction succeeded

***

### ledger?

> `optional` **ledger?**: `number`

Defined in: [types/index.ts:367](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L367)

Ledger number it was confirmed in

***

### feePaid?

> `optional` **feePaid?**: `string`

Defined in: [types/index.ts:369](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L369)

Fee charged by the confirmed transaction result, in stroops.

***

### feeBumped?

> `optional` **feeBumped?**: `boolean`

Defined in: [types/index.ts:371](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L371)

Whether confirmation came through a fee-bump envelope.

***

### sourceAccount?

> `optional` **sourceAccount?**: `string`

Defined in: [types/index.ts:373](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L373)

Inner transaction source (the leased channel account when pooling is enabled).

***

### feeSource?

> `optional` **feeSource?**: `string`

Defined in: [types/index.ts:375](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L375)

Outer fee source when different from `sourceAccount`.

***

### submissionAttempts?

> `optional` **submissionAttempts?**: `number`

Defined in: [types/index.ts:377](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L377)

Number of envelopes accepted for this operation, including a replacement.
