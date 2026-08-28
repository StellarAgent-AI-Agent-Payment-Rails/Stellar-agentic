[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelAccountLease

# Interface: ChannelAccountLease

Defined in: fleet/channelPool.ts:54

A single-use, exclusive claim on one channel account.

## Properties

### account

> `readonly` **account**: [`ChannelAccount`](ChannelAccount.md)

Defined in: fleet/channelPool.ts:55

***

### address

> `readonly` **address**: `string`

Defined in: fleet/channelPool.ts:56

***

### signer

> `readonly` **signer**: [`Signer`](Signer.md)

Defined in: fleet/channelPool.ts:57

## Methods

### release()

> **release**(`outcome?`): `Promise`\<`void`\>

Defined in: fleet/channelPool.ts:62

Release the account. A rollback means no transaction was accepted, so the
next lease reloads the on-chain sequence instead of advancing a local cursor.

#### Parameters

##### outcome?

[`ChannelLeaseOutcome`](../type-aliases/ChannelLeaseOutcome.md)

#### Returns

`Promise`\<`void`\>

***

### use()

> **use**\<`T`\>(`work`): `Promise`\<`T`\>

Defined in: fleet/channelPool.ts:64

Run work and always release, committing only after the callback succeeds.

#### Type Parameters

##### T

`T`

#### Parameters

##### work

(`account`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
