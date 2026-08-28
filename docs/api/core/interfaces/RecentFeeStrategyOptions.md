[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RecentFeeStrategyOptions

# Interface: RecentFeeStrategyOptions

Defined in: fleet/feeStrategy.ts:49

## Properties

### percentile?

> `optional` **percentile?**: [`FeePercentile`](../type-aliases/FeePercentile.md)

Defined in: fleet/feeStrategy.ts:50

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: fleet/feeStrategy.ts:51

***

### minimumFee?

> `optional` **minimumFee?**: `string` \| `number` \| `bigint`

Defined in: fleet/feeStrategy.ts:52

***

### maximumFee?

> `optional` **maximumFee?**: `string` \| `number` \| `bigint`

Defined in: fleet/feeStrategy.ts:53

***

### fallbackFee?

> `optional` **fallbackFee?**: `string` \| `number` \| `bigint`

Defined in: fleet/feeStrategy.ts:54

***

### cacheMs?

> `optional` **cacheMs?**: `number`

Defined in: fleet/feeStrategy.ts:56

Cache fee stats to avoid one RPC request per payment.

#### Default

```ts
5000
```

***

### now?

> `optional` **now?**: () => `number`

Defined in: fleet/feeStrategy.ts:57

#### Returns

`number`
