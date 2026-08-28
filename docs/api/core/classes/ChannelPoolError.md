[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelPoolError

# Class: ChannelPoolError

Defined in: fleet/channelPool.ts:83

Raised when a lease cannot enter the pool.

## Extends

- `Error`

## Constructors

### Constructor

> **new ChannelPoolError**(`code`, `message`, `cause?`): `ChannelPoolError`

Defined in: fleet/channelPool.ts:84

#### Parameters

##### code

`"POOL_CLOSED"` \| `"LEASE_TIMEOUT"` \| `"LEASE_ABORTED"` \| `"FACTORY_FAILED"`

##### message

`string`

##### cause?

`unknown`

#### Returns

`ChannelPoolError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: `"POOL_CLOSED"` \| `"LEASE_TIMEOUT"` \| `"LEASE_ABORTED"` \| `"FACTORY_FAILED"`

Defined in: fleet/channelPool.ts:85

***

### cause?

> `readonly` `optional` **cause?**: `unknown`

Defined in: fleet/channelPool.ts:87
