[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / bn

# Function: bn()

> **bn**(`value`): `BigNumber`

Defined in: [math/fixed-point.ts:58](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/fixed-point.ts#L58)

Wrap any string/number into a BigNumber, throwing immediately if the value
is not a valid finite decimal.  Using this at every entry point prevents
`NaN` / `Infinity` from silently propagating through calculations.

## Parameters

### value

`string` \| `number` \| `bigint` \| `BigNumber`

## Returns

`BigNumber`
