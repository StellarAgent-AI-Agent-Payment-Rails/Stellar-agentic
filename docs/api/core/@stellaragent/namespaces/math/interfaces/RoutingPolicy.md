[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / RoutingPolicy

# Interface: RoutingPolicy

Defined in: math/routing.ts:11

## Properties

### costWeight

> **costWeight**: `number`

Defined in: math/routing.ts:13

Relative weight of source-normalized fees.

***

### slippageWeight

> **slippageWeight**: `number`

Defined in: math/routing.ts:15

Relative weight of expected price impact.

***

### reliabilityWeight

> **reliabilityWeight**: `number`

Defined in: math/routing.ts:17

Relative weight of the reliability shortfall.

***

### hopPenalty

> **hopPenalty**: `number`

Defined in: math/routing.ts:19

Fixed score added for every economic hop after the first.

***

### maxSlippageBps

> **maxSlippageBps**: `number`

Defined in: math/routing.ts:21

Routes above this expected slippage are inadmissible.

***

### minReliabilityBps

> **minReliabilityBps**: `number`

Defined in: math/routing.ts:23

Routes below this reliability are inadmissible.
