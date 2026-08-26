[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelInfo

# Interface: ChannelInfo

Defined in: [types/index.ts:177](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L177)

## Properties

### id

> **id**: `bigint`

Defined in: [types/index.ts:178](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L178)

***

### agent

> **agent**: `string`

Defined in: [types/index.ts:179](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L179)

***

### owner

> **owner**: `string`

Defined in: [types/index.ts:180](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L180)

***

### token

> **token**: `string`

Defined in: [types/index.ts:181](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L181)

***

### limitPerPeriod

> **limitPerPeriod**: `bigint`

Defined in: [types/index.ts:182](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L182)

***

### spentThisPeriod

> **spentThisPeriod**: `bigint`

Defined in: [types/index.ts:183](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L183)

***

### totalSpent

> **totalSpent**: `bigint`

Defined in: [types/index.ts:184](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L184)

***

### active

> **active**: `boolean`

Defined in: [types/index.ts:185](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L185)

***

### period

> **period**: [`SpendPeriod`](../type-aliases/SpendPeriod.md)

Defined in: [types/index.ts:187](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L187)

Reset cadence for `spentThisPeriod`, mirroring `Channel.period` on-chain.

***

### periodStartLedger

> **periodStartLedger**: `number`

Defined in: [types/index.ts:195](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L195)

Ledger sequence at which the current period started, mirroring
`Channel.period_start_ledger`. `PaymentChannel.pay` resets
`spentThisPeriod` to 0 once `currentLedger >= periodStartLedger +
<ledgers for period>` — needed to predict spend-limit outcomes without
a stale `spentThisPeriod` (see `math/predict.ts`).
