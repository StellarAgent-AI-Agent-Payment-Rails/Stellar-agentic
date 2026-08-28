[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / SponsorServiceOptions

# Interface: SponsorServiceOptions

Defined in: fleet/sponsorship.ts:32

## Properties

### sponsorSigner

> **sponsorSigner**: [`Signer`](Signer.md)

Defined in: fleet/sponsorship.ts:33

***

### rpc

> **rpc**: [`SponsorRpc`](SponsorRpc.md)

Defined in: fleet/sponsorship.ts:34

***

### networkPassphrase

> **networkPassphrase**: `string`

Defined in: fleet/sponsorship.ts:35

***

### feeStrategy?

> `optional` **feeStrategy?**: `string` \| `number` \| `bigint` \| [`FeeStrategy`](FeeStrategy.md)

Defined in: fleet/sponsorship.ts:36

***

### timeoutSeconds?

> `optional` **timeoutSeconds?**: `number`

Defined in: fleet/sponsorship.ts:38

Transaction validity window.

#### Default

```ts
60
```

***

### confirmationAttempts?

> `optional` **confirmationAttempts?**: `number`

Defined in: fleet/sponsorship.ts:40

Confirmation polls before timing out.

#### Default

```ts
30
```

***

### pollIntervalMs?

> `optional` **pollIntervalMs?**: `number`

Defined in: fleet/sponsorship.ts:42

Delay between confirmation polls.

#### Default

```ts
1000
```

***

### sleep?

> `optional` **sleep?**: (`milliseconds`) => `Promise`\<`void`\>

Defined in: fleet/sponsorship.ts:43

#### Parameters

##### milliseconds

`number`

#### Returns

`Promise`\<`void`\>
