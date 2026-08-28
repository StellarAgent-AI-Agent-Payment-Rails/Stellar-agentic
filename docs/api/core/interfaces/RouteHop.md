[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RouteHop

# Interface: RouteHop

Defined in: routing/types.ts:13

One executable segment of a candidate route.

## Properties

### venue

> **venue**: [`RouteVenue`](../type-aliases/RouteVenue.md)

Defined in: routing/types.ts:14

***

### venueId

> **venueId**: `string`

Defined in: routing/types.ts:16

Stable venue identifier. A contract-backed venue uses its C... address.

***

### sourceAsset

> **sourceAsset**: `string`

Defined in: routing/types.ts:17

***

### destinationAsset

> **destinationAsset**: `string`

Defined in: routing/types.ts:18

***

### sourceAmount

> **sourceAmount**: `string`

Defined in: routing/types.ts:19

***

### expectedOutput

> **expectedOutput**: `string`

Defined in: routing/types.ts:20

***

### feeAmount

> **feeAmount**: `string`

Defined in: routing/types.ts:22

Fee charged by this segment, in its source asset's base units.

***

### feeBps

> **feeBps**: `number`

Defined in: routing/types.ts:24

Source-normalized fee, in basis points.

***

### slippageBps

> **slippageBps**: `number`

Defined in: routing/types.ts:26

Expected price impact/slippage, in basis points.

***

### reliabilityBps

> **reliabilityBps**: `number`

Defined in: routing/types.ts:28

0..10,000; 10,000 represents the most reliable quote.

***

### path?

> `optional` **path?**: `string`[]

Defined in: routing/types.ts:30

Intermediate assets embedded in a classic Stellar path-payment quote.

***

### minOutput?

> `optional` **minOutput?**: `string`

Defined in: routing/types.ts:32

Per-hop execution floor. The final route still has one end-to-end floor.
