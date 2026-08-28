[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / PayForAPIParams

# Interface: PayForAPIParams

Defined in: [types/index.ts:198](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L198)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [types/index.ts:200](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L200)

API endpoint being paid for (stored in memo)

***

### amount

> **amount**: `string`

Defined in: [types/index.ts:202](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L202)

Amount to pay, denominated in the channel's settlement asset

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:204](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L204)

Asset to pay with (must match the channel's settlement asset)

***

### channelId?

> `optional` **channelId?**: `bigint`

Defined in: [types/index.ts:206](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L206)

Channel ID to use (uses default if not specified)

***

### recipient?

> `optional` **recipient?**: `string`

Defined in: [types/index.ts:211](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L211)

Stellar account or contract receiving the payment. Defaults to the
agent address for compatibility; real API payments should set this.

***

### destAsset?

> `optional` **destAsset?**: `string`

Defined in: [types/index.ts:221](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L221)

Asset the recipient should actually receive, if different from the
channel's settlement asset (`asset`) — e.g. a channel funded in USDC
paying a provider that only accepts XLM. When set, this routes through
`PaymentChannel.pay_with_conversion` instead of `pay`, converting via
the channel contract's configured price oracle + AMM. The spend limit
is still enforced in the channel's settlement asset regardless of
`destAsset`. Requires `minReceived` to also be set.

***

### minReceived?

> `optional` **minReceived?**: `string`

Defined in: [types/index.ts:230](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L230)

Minimum amount of `destAsset` the recipient must receive (slippage
floor), as a string in `destAsset` units. Required when `destAsset` is
set. The contract additionally enforces its own oracle-derived
fairness bound on top of this — see
`contracts/payment_channel/src/lib.rs`'s `pay_with_conversion` for the
full slippage/price-oracle design.
