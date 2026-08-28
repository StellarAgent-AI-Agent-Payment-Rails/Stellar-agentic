[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / PathPaymentCandidate

# Interface: PathPaymentCandidate

Defined in: routing/types.ts:126

## Properties

### venueId

> **venueId**: `string`

Defined in: routing/types.ts:128

Stable liquidity-source identifier, or an execution-adapter contract ID.

***

### path

> **path**: `string`[]

Defined in: routing/types.ts:130

Assets between source and destination, excluding both endpoints.

***

### expectedDestinationAmount

> **expectedDestinationAmount**: `string`

Defined in: routing/types.ts:131

***

### feeAmount?

> `optional` **feeAmount?**: `string`

Defined in: routing/types.ts:132

***

### feeBps?

> `optional` **feeBps?**: `number`

Defined in: routing/types.ts:133

***

### slippageBps?

> `optional` **slippageBps?**: `number`

Defined in: routing/types.ts:134

***

### reliabilityBps?

> `optional` **reliabilityBps?**: `number`

Defined in: routing/types.ts:135

***

### minDestinationAmount?

> `optional` **minDestinationAmount?**: `string`

Defined in: routing/types.ts:136
