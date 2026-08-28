[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelInfo

# Interface: ChannelInfo

Defined in: [types/index.ts:233](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L233)

## Properties

### id

> **id**: `bigint`

Defined in: [types/index.ts:234](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L234)

***

### agent

> **agent**: `string`

Defined in: [types/index.ts:235](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L235)

***

### owner

> **owner**: `string`

Defined in: [types/index.ts:236](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L236)

***

### token

> **token**: `string`

Defined in: [types/index.ts:237](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L237)

***

### limitPerPeriod

> **limitPerPeriod**: `bigint`

Defined in: [types/index.ts:238](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L238)

***

### spentThisPeriod

> **spentThisPeriod**: `bigint`

Defined in: [types/index.ts:239](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L239)

***

### totalSpent

> **totalSpent**: `bigint`

Defined in: [types/index.ts:240](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L240)

***

### active

> **active**: `boolean`

Defined in: [types/index.ts:241](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L241)

***

### period

> **period**: [`SpendPeriod`](../type-aliases/SpendPeriod.md)

Defined in: [types/index.ts:243](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L243)

Reset cadence for `spentThisPeriod`, mirroring `Channel.period` on-chain.

***

### periodStartLedger

> **periodStartLedger**: `number`

Defined in: [types/index.ts:251](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L251)

Ledger sequence at which the current period started, mirroring
`Channel.period_start_ledger`. `PaymentChannel.pay` resets
`spentThisPeriod` to 0 once `currentLedger >= periodStartLedger +
<ledgers for period>` — needed to predict spend-limit outcomes without
a stale `spentThisPeriod` (see `math/predict.ts`).
