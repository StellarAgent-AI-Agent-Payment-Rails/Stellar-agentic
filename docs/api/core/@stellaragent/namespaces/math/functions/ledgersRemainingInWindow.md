[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / ledgersRemainingInWindow

# Function: ledgersRemainingInWindow()

> **ledgersRemainingInWindow**(`windowStartLedger`, `ledgersPerWindow`, `currentLedger`): `number`

Defined in: [math/predict.ts:147](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/predict.ts#L147)

Ledgers remaining until a rolling window resets, floored at 0 (an expired
window has 0 remaining, not a negative count).

## Parameters

### windowStartLedger

`number`

### ledgersPerWindow

`number`

### currentLedger

`number`

## Returns

`number`
