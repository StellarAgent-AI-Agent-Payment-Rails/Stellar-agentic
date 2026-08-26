[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelInfo

# Interface: ChannelInfo

Defined in: [types/index.ts:164](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L164)

## Properties

### id

> **id**: `bigint`

Defined in: [types/index.ts:165](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L165)

***

### agent

> **agent**: `string`

Defined in: [types/index.ts:166](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L166)

***

### owner

> **owner**: `string`

Defined in: [types/index.ts:167](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L167)

***

### token

> **token**: `string`

Defined in: [types/index.ts:168](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L168)

***

### limitPerPeriod

> **limitPerPeriod**: `bigint`

Defined in: [types/index.ts:169](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L169)

***

### spentThisPeriod

> **spentThisPeriod**: `bigint`

Defined in: [types/index.ts:170](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L170)

***

### totalSpent

> **totalSpent**: `bigint`

Defined in: [types/index.ts:171](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L171)

***

### active

> **active**: `boolean`

Defined in: [types/index.ts:172](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L172)

***

### period

> **period**: [`SpendPeriod`](../type-aliases/SpendPeriod.md)

Defined in: [types/index.ts:174](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L174)

Reset cadence for `spentThisPeriod`, mirroring `Channel.period` on-chain.

***

### periodStartLedger

> **periodStartLedger**: `number`

Defined in: [types/index.ts:182](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L182)

Ledger sequence at which the current period started, mirroring
`Channel.period_start_ledger`. `PaymentChannel.pay` resets
`spentThisPeriod` to 0 once `currentLedger >= periodStartLedger +
<ledgers for period>` — needed to predict spend-limit outcomes without
a stale `spentThisPeriod` (see `math/predict.ts`).
