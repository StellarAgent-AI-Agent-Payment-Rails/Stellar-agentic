[**@stellaragent/react**](../README.md)

***

[@stellaragent/react](../README.md) / useJob

# Function: useJob()

> **useJob**(`jobId`, `options?`): [`UsePollingResult`](../interfaces/UsePollingResult.md)\<`JobInfo`\>

Defined in: [hooks/useJob.ts:10](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/useJob.ts#L10)

Polls `Escrow.get_job` for `jobId` via the current `StellarAgent`.
Disabled until both the agent is `ready` and `jobId` is defined.

## Parameters

### jobId

`bigint` \| `undefined`

### options?

[`UsePollingOptions`](../interfaces/UsePollingOptions.md)

## Returns

[`UsePollingResult`](../interfaces/UsePollingResult.md)\<`JobInfo`\>
