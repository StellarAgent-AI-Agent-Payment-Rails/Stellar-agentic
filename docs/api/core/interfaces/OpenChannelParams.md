[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / OpenChannelParams

# Interface: OpenChannelParams

Defined in: [types/index.ts:112](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L112)

## Properties

### token?

> `optional` **token?**: `string`

Defined in: [types/index.ts:121](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L121)

Token to use for payments (defaults to XLM). This remains the
channel's single funding/settlement asset — `limitPerPeriod` is always
denominated in it, even for cross-asset payments made via
`payForAPI`'s `destAsset` (see `PayForAPIParams`). Cross-asset support
lets one channel pay recipients in other assets; it does not make the
channel itself multi-asset.

***

### deposit

> **deposit**: `string`

Defined in: [types/index.ts:123](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L123)

Initial deposit amount (as string to avoid precision issues)

***

### limitPerPeriod

> **limitPerPeriod**: `string`

Defined in: [types/index.ts:125](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L125)

Max spend per period, denominated in `token`

***

### period

> **period**: [`SpendPeriod`](../type-aliases/SpendPeriod.md)

Defined in: [types/index.ts:126](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L126)
