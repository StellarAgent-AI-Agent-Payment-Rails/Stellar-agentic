[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / MultiplierFeeStrategy

# Class: MultiplierFeeStrategy

Defined in: fleet/feeStrategy.ts:107

Multiplies another strategy (recent-fee strategy by default).

## Implements

- [`FeeStrategy`](../interfaces/FeeStrategy.md)

## Constructors

### Constructor

> **new MultiplierFeeStrategy**(`multiplier`, `base?`): `MultiplierFeeStrategy`

Defined in: fleet/feeStrategy.ts:110

#### Parameters

##### multiplier

`number`

##### base?

[`FeeStrategy`](../interfaces/FeeStrategy.md) = `...`

#### Returns

`MultiplierFeeStrategy`

## Methods

### getFee()

> **getFee**(`context`): `Promise`\<`string`\>

Defined in: fleet/feeStrategy.ts:117

#### Parameters

##### context

[`FeeContext`](../interfaces/FeeContext.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`FeeStrategy`](../interfaces/FeeStrategy.md).[`getFee`](../interfaces/FeeStrategy.md#getfee)
