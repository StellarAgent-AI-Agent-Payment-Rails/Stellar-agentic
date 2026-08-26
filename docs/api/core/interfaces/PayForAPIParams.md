[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / PayForAPIParams

# Interface: PayForAPIParams

Defined in: [types/index.ts:129](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L129)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [types/index.ts:131](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L131)

API endpoint being paid for (stored in memo)

***

### amount

> **amount**: `string`

Defined in: [types/index.ts:133](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L133)

Amount to pay, denominated in the channel's settlement asset

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:135](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L135)

Asset to pay with (must match the channel's settlement asset)

***

### channelId?

> `optional` **channelId?**: `bigint`

Defined in: [types/index.ts:137](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L137)

Channel ID to use (uses default if not specified)

***

### recipient?

> `optional` **recipient?**: `string`

Defined in: [types/index.ts:142](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L142)

Stellar account or contract receiving the payment. Defaults to the
agent address for compatibility; real API payments should set this.

***

### destAsset?

> `optional` **destAsset?**: `string`

Defined in: [types/index.ts:152](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L152)

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

Defined in: [types/index.ts:161](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L161)

Minimum amount of `destAsset` the recipient must receive (slippage
floor), as a string in `destAsset` units. Required when `destAsset` is
set. The contract additionally enforces its own oracle-derived
fairness bound on top of this — see
`contracts/payment_channel/src/lib.rs`'s `pay_with_conversion` for the
full slippage/price-oracle design.
