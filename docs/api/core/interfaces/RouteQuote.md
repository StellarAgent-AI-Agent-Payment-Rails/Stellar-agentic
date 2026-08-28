[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RouteQuote

# Interface: RouteQuote

Defined in: routing/types.ts:36

A normalized executable quote consumed by the deterministic selector.

## Properties

### id

> **id**: `string`

Defined in: routing/types.ts:38

Canonical identifier derived from assets, venues, and path.

***

### sourceAsset

> **sourceAsset**: `string`

Defined in: routing/types.ts:39

***

### destinationAsset

> **destinationAsset**: `string`

Defined in: routing/types.ts:40

***

### sourceAmount

> **sourceAmount**: `string`

Defined in: routing/types.ts:41

***

### expectedDestinationAmount

> **expectedDestinationAmount**: `string`

Defined in: routing/types.ts:42

***

### totalFeeBps

> **totalFeeBps**: `number`

Defined in: routing/types.ts:43

***

### expectedSlippageBps

> **expectedSlippageBps**: `number`

Defined in: routing/types.ts:44

***

### reliabilityBps

> **reliabilityBps**: `number`

Defined in: routing/types.ts:45

***

### hopCount

> **hopCount**: `number`

Defined in: routing/types.ts:47

Economic depth, including assets embedded in path-payment operations.

***

### hops

> **hops**: [`RouteHop`](RouteHop.md)[]

Defined in: routing/types.ts:48

***

### expiresAtLedger?

> `optional` **expiresAtLedger?**: `number`

Defined in: routing/types.ts:50

Last ledger in which every component quote is valid.
