[**@stellaragent/react**](../README.md)

***

[@stellaragent/react](../README.md) / UsePayForAPIResult

# Interface: UsePayForAPIResult

Defined in: [hooks/usePayForAPI.ts:7](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/usePayForAPI.ts#L7)

## Properties

### payForAPI

> **payForAPI**: (`params`) => `Promise`\<`TxResult`\>

Defined in: [hooks/usePayForAPI.ts:9](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/usePayForAPI.ts#L9)

Invoke a payment. Resolves/rejects the same as `StellarAgent.payForAPI`.

#### Parameters

##### params

`PayForAPIParams`

#### Returns

`Promise`\<`TxResult`\>

***

### status

> **status**: [`PayForAPIStatus`](../type-aliases/PayForAPIStatus.md)

Defined in: [hooks/usePayForAPI.ts:10](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/usePayForAPI.ts#L10)

***

### error

> **error**: `Error` \| `null`

Defined in: [hooks/usePayForAPI.ts:11](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/usePayForAPI.ts#L11)

***

### reset

> **reset**: () => `void`

Defined in: [hooks/usePayForAPI.ts:13](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/usePayForAPI.ts#L13)

Back to `idle` — does not affect any in-flight call.

#### Returns

`void`
