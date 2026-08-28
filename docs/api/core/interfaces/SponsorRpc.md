[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / SponsorRpc

# Interface: SponsorRpc

Defined in: fleet/sponsorship.ts:17

Minimal RPC surface needed for classic sponsorship transactions.

## Methods

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account`\>

Defined in: fleet/sponsorship.ts:18

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`Account`\>

***

### sendTransaction()

> **sendTransaction**(`transaction`): `Promise`\<\{ `status`: `string`; `hash`: `string`; `errorResult?`: \{ `toXDR`: `string`; \}; \}\>

Defined in: fleet/sponsorship.ts:19

#### Parameters

##### transaction

`Transaction`\<`Memo`\<`MemoType`\>, `Operation`[]\> \| `FeeBumpTransaction`

#### Returns

`Promise`\<\{ `status`: `string`; `hash`: `string`; `errorResult?`: \{ `toXDR`: `string`; \}; \}\>

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<\{ `status`: `string`; `ledger?`: `number`; `resultXdr?`: \{ `feeCharged`: \{ `toString`: `string`; \}; \}; \}\>

Defined in: fleet/sponsorship.ts:24

#### Parameters

##### hash

`string`

#### Returns

`Promise`\<\{ `status`: `string`; `ledger?`: `number`; `resultXdr?`: \{ `feeCharged`: \{ `toString`: `string`; \}; \}; \}\>

***

### getFeeStats()?

> `optional` **getFeeStats**(): `Promise`\<[`FeeStats`](FeeStats.md)\>

Defined in: fleet/sponsorship.ts:29

#### Returns

`Promise`\<[`FeeStats`](FeeStats.md)\>
