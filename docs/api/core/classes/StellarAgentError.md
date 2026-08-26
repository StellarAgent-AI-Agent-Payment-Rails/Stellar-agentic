[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / StellarAgentError

# Class: StellarAgentError

Defined in: [errors.ts:21](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/errors.ts#L21)

Error thrown for SDK validation, Soroban RPC, and contract failures.

## Extends

- `Error`

## Constructors

### Constructor

> **new StellarAgentError**(`code`, `message`, `options?`): `StellarAgentError`

Defined in: [errors.ts:26](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/errors.ts#L26)

#### Parameters

##### code

[`StellarAgentErrorCode`](../type-aliases/StellarAgentErrorCode.md)

##### message

`string`

##### options?

###### cause?

`unknown`

###### transactionHash?

`string`

#### Returns

`StellarAgentError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`StellarAgentErrorCode`](../type-aliases/StellarAgentErrorCode.md)

Defined in: [errors.ts:22](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/errors.ts#L22)

***

### cause?

> `readonly` `optional` **cause?**: `unknown`

Defined in: [errors.ts:23](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/errors.ts#L23)

***

### transactionHash?

> `readonly` `optional` **transactionHash?**: `string`

Defined in: [errors.ts:24](https://github.com/Nanle-code/Stellar-agentic/blob/main/packages/core/src/errors.ts#L24)
