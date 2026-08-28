[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / SubmissionQueue

# Class: SubmissionQueue

Defined in: fleet/submissionQueue.ts:78

Bounded work queue with key-scoped ordering and retry classification.
Backpressure is explicit: once the pending bound is reached, producers get
`QUEUE_FULL` synchronously through the returned rejected promise.

## Constructors

### Constructor

> **new SubmissionQueue**(`options?`): `SubmissionQueue`

Defined in: fleet/submissionQueue.ts:97

#### Parameters

##### options?

[`SubmissionQueueOptions`](../interfaces/SubmissionQueueOptions.md) = `{}`

#### Returns

`SubmissionQueue`

## Accessors

### stats

#### Get Signature

> **get** **stats**(): [`SubmissionQueueStats`](../interfaces/SubmissionQueueStats.md)

Defined in: fleet/submissionQueue.ts:120

##### Returns

[`SubmissionQueueStats`](../interfaces/SubmissionQueueStats.md)

## Methods

### submit()

> **submit**\<`T`\>(`task`, `options?`): `Promise`\<`T`\>

Defined in: fleet/submissionQueue.ts:131

#### Type Parameters

##### T

`T`

#### Parameters

##### task

(`attempt`) => `Promise`\<`T`\>

##### options?

[`SubmitOptions`](../interfaces/SubmitOptions.md) = `{}`

#### Returns

`Promise`\<`T`\>

***

### drain()

> **drain**(): `Promise`\<`void`\>

Defined in: fleet/submissionQueue.ts:173

Resolve once both queued and running work have reached zero.

#### Returns

`Promise`\<`void`\>

***

### close()

> **close**(): `Promise`\<`void`\>

Defined in: fleet/submissionQueue.ts:179

Stop accepting work, then wait for accepted work to finish.

#### Returns

`Promise`\<`void`\>
