[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / fetchLedgerCloseEstimate

# Function: fetchLedgerCloseEstimate()

> **fetchLedgerCloseEstimate**(`horizonUrl`, `sampleSize?`): `Promise`\<[`LedgerCloseEstimate`](../interfaces/LedgerCloseEstimate.md)\>

Defined in: [ledgerTime.ts:126](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/ledgerTime.ts#L126)

Fetch the most recent `sampleSize` ledgers from Horizon and derive both
the current ledger sequence and an observed average close time from them
— a single round trip covers everything a caller needs to turn a
ledger-count window into a wall-clock estimate.

## Parameters

### horizonUrl

`string`

### sampleSize?

`number` = `20`

## Returns

`Promise`\<[`LedgerCloseEstimate`](../interfaces/LedgerCloseEstimate.md)\>
