[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RouteUnavailableError

# Class: RouteUnavailableError

Defined in: routing/discovery.ts:17

A provider may use this to classify a normal venue miss without throwing a generic error.

## Extends

- `Error`

## Constructors

### Constructor

> **new RouteUnavailableError**(`code`, `message`): `RouteUnavailableError`

Defined in: routing/discovery.ts:20

#### Parameters

##### code

[`RouteUnavailableCode`](../type-aliases/RouteUnavailableCode.md)

##### message

`string`

#### Returns

`RouteUnavailableError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`RouteUnavailableCode`](../type-aliases/RouteUnavailableCode.md)

Defined in: routing/discovery.ts:18
