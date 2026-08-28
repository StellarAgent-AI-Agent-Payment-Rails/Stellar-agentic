[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / FixedFeeStrategy

# Class: FixedFeeStrategy

Defined in: fleet/feeStrategy.ts:96

Always bids the same fee rate.

## Implements

- [`FeeStrategy`](../interfaces/FeeStrategy.md)

## Constructors

### Constructor

> **new FixedFeeStrategy**(`fee?`): `FixedFeeStrategy`

Defined in: fleet/feeStrategy.ts:98

#### Parameters

##### fee?

`string` \| `number` \| `bigint`

#### Returns

`FixedFeeStrategy`

## Methods

### getFee()

> **getFee**(`context`): `string`

Defined in: fleet/feeStrategy.ts:101

#### Parameters

##### context

[`FeeContext`](../interfaces/FeeContext.md)

#### Returns

`string`

#### Implementation of

[`FeeStrategy`](../interfaces/FeeStrategy.md).[`getFee`](../interfaces/FeeStrategy.md#getfee)
