[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / ChannelAccountPoolOptions

# Interface: ChannelAccountPoolOptions

Defined in: fleet/channelPool.ts:21

## Properties

### accounts?

> `optional` **accounts?**: readonly [`ChannelAccount`](ChannelAccount.md)[]

Defined in: fleet/channelPool.ts:23

Accounts available immediately.

***

### factory?

> `optional` **factory?**: [`ChannelAccountFactory`](ChannelAccountFactory.md)

Defined in: fleet/channelPool.ts:25

Lifecycle used when demand changes the pool size.

***

### minSize?

> `optional` **minSize?**: `number`

Defined in: fleet/channelPool.ts:27

Lowest size retained by idle reclamation.

#### Default

```ts
accounts.length
```

***

### maxSize?

> `optional` **maxSize?**: `number`

Defined in: fleet/channelPool.ts:29

Hard upper bound, including accounts being created.

#### Default

```ts
max(minSize, accounts.length)
```

***

### leaseTimeoutMs?

> `optional` **leaseTimeoutMs?**: `number`

Defined in: fleet/channelPool.ts:31

Maximum time to wait for a lease. Zero disables the timeout.

#### Default

```ts
30000
```

***

### now?

> `optional` **now?**: () => `number`

Defined in: fleet/channelPool.ts:33

Injectable clock for deterministic tests.

#### Returns

`number`
