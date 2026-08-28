[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RouteRequest

# Interface: RouteRequest

Defined in: routing/types.ts:53

## Properties

### sourceAsset

> **sourceAsset**: `string`

Defined in: routing/types.ts:54

***

### destinationAsset

> **destinationAsset**: `string`

Defined in: routing/types.ts:55

***

### sourceAmount

> **sourceAmount**: `string`

Defined in: routing/types.ts:57

Integer base units, not a decimal display amount.

***

### currentLedger?

> `optional` **currentLedger?**: `number`

Defined in: routing/types.ts:58

***

### allowedIntermediates?

> `optional` **allowedIntermediates?**: `string`[]

Defined in: routing/types.ts:60

Assets that bounded multi-hop discovery may traverse.
