[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / fromStroops

# Function: fromStroops()

> **fromStroops**(`stroops`, `decimalPlaces?`): `string`

Defined in: [math/fixed-point.ts:145](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/fixed-point.ts#L145)

Convert on-chain stroops (i128 represented as `bigint`) to a
human-readable decimal string with `decimalPlaces` precision.

## Parameters

### stroops

`bigint`

### decimalPlaces?

`number` = `7`

## Returns

`string`

## Example

```ts
fromStroops(15000001n, 7)  // → '1.5000001'
```
