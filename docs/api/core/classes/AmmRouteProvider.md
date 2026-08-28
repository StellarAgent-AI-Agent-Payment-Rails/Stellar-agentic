[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / AmmRouteProvider

# Class: AmmRouteProvider

Defined in: routing/providers.ts:43

Bounded graph discovery over one AMM/aggregator adapter.

## Implements

- [`RouteProvider`](../interfaces/RouteProvider.md)

## Constructors

### Constructor

> **new AmmRouteProvider**(`options`): `AmmRouteProvider`

Defined in: routing/providers.ts:49

#### Parameters

##### options

`AmmRouteProviderOptions`

#### Returns

`AmmRouteProvider`

## Properties

### id

> `readonly` **id**: `string`

Defined in: routing/providers.ts:44

#### Implementation of

[`RouteProvider`](../interfaces/RouteProvider.md).[`id`](../interfaces/RouteProvider.md#id)

## Methods

### discover()

> **discover**(`request`, `context`): `Promise`\<[`RouteHop`](../interfaces/RouteHop.md)[][]\>

Defined in: routing/providers.ts:57

#### Parameters

##### request

[`RouteRequest`](../interfaces/RouteRequest.md)

##### context

[`RouteProviderContext`](../interfaces/RouteProviderContext.md)

#### Returns

`Promise`\<[`RouteHop`](../interfaces/RouteHop.md)[][]\>

#### Implementation of

[`RouteProvider`](../interfaces/RouteProvider.md).[`discover`](../interfaces/RouteProvider.md#discover)
