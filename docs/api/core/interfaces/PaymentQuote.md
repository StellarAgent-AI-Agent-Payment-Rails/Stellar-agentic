[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / PaymentQuote

# Interface: PaymentQuote

Defined in: routing/planner.ts:27

Complete pre-commit artifact. Pass this object back to `payForAPI`.

## Properties

### route

> **route**: [`ScoredRoute`](../@stellaragent/namespaces/math/interfaces/ScoredRoute.md)

Defined in: routing/planner.ts:28

***

### minimumDestinationAmount

> **minimumDestinationAmount**: `string`

Defined in: routing/planner.ts:29

***

### quotedAtLedger

> **quotedAtLedger**: `number`

Defined in: routing/planner.ts:30

***

### validUntilLedger

> **validUntilLedger**: `number`

Defined in: routing/planner.ts:31

***

### failures

> **failures**: [`RouteDiscoveryFailure`](RouteDiscoveryFailure.md)[]

Defined in: routing/planner.ts:32
