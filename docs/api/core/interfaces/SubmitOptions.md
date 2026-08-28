[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / SubmitOptions

# Interface: SubmitOptions

Defined in: fleet/submissionQueue.ts:22

## Properties

### orderingKey?

> `optional` **orderingKey?**: `string`

Defined in: fleet/submissionQueue.ts:24

Tasks with the same key never overlap; unrelated keys stay concurrent.

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: fleet/submissionQueue.ts:25
