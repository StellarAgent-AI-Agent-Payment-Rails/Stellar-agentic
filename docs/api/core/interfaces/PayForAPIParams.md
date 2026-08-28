[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / PayForAPIParams

# Interface: PayForAPIParams

Defined in: [types/index.ts:210](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L210)

## Properties

### endpoint

> **endpoint**: `string`

Defined in: [types/index.ts:212](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L212)

API endpoint being paid for (stored in memo)

***

### amount

> **amount**: `string`

Defined in: [types/index.ts:214](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L214)

Amount to pay, denominated in the channel's settlement asset

***

### asset?

> `optional` **asset?**: `string`

Defined in: [types/index.ts:216](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L216)

Asset to pay with (must match the channel's settlement asset)

***

### sourceAsset?

> `optional` **sourceAsset?**: `string`

Defined in: [types/index.ts:218](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L218)

Explicit source asset; `asset` remains a backwards-compatible alias.

***

### channelId?

> `optional` **channelId?**: `bigint`

Defined in: [types/index.ts:220](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L220)

Channel ID to use (uses default if not specified)

***

### recipient?

> `optional` **recipient?**: `string`

Defined in: [types/index.ts:225](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L225)

Stellar account or contract receiving the payment. Defaults to the
agent address for compatibility; real API payments should set this.

***

### destAsset?

> `optional` **destAsset?**: `string`

Defined in: [types/index.ts:235](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L235)

Asset the recipient should actually receive, if different from the
channel's settlement asset (`asset`) — e.g. a channel funded in USDC
paying a provider that only accepts XLM. When set, this routes through
`PaymentChannel.pay_with_conversion` instead of `pay`, converting via
the channel contract's configured price oracle + AMM. The spend limit
is still enforced in the channel's settlement asset regardless of
`destAsset`. Requires `minReceived` to also be set.

***

### recipientAsset?

> `optional` **recipientAsset?**: `string`

Defined in: [types/index.ts:237](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L237)

Recipient asset; `destAsset` remains a backwards-compatible alias.

***

### minReceived?

> `optional` **minReceived?**: `string`

Defined in: [types/index.ts:246](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L246)

Minimum amount of `destAsset` the recipient must receive (slippage
floor), as a string in `destAsset` units. Required when `destAsset` is
set. The contract additionally enforces its own oracle-derived
fairness bound on top of this — see
`contracts/payment_channel/src/lib.rs`'s `pay_with_conversion` for the
full slippage/price-oracle design.

***

### route?

> `optional` **route?**: [`RouteQuote`](RouteQuote.md) \| [`PaymentQuote`](PaymentQuote.md)

Defined in: [types/index.ts:251](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L251)

Reuse a prior `quote()` result or override automatic selection with a
normalized route. Policy, intent, amount, and expiry remain enforced.

***

### allowedIntermediates?

> `optional` **allowedIntermediates?**: `string`[]

Defined in: [types/index.ts:253](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L253)

Intermediate assets automatic discovery may traverse.

***

### slippageToleranceBps?

> `optional` **slippageToleranceBps?**: `number`

Defined in: [types/index.ts:255](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L255)

Automatic-quote slippage tolerance in basis points, capped at 500.
