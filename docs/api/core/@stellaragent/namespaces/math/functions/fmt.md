[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / fmt

# Function: fmt()

> **fmt**(`value`, `places?`): `string`

Defined in: [math/fixed-point.ts:160](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/fixed-point.ts#L160)

Format a decimal amount for display, rounding down to `places` decimal
places.  Never uses `Number.toFixed` to avoid float coercion.

## Parameters

### value

`string` \| `BigNumber`

### places?

`number` = `2`

## Returns

`string`

## Example

```ts
fmt('8.2300001', 2)  // → '8.23'
```
