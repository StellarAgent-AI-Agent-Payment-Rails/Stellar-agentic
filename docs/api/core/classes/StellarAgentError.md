[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / StellarAgentError

# Class: StellarAgentError

Defined in: [errors.ts:99](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/errors.ts#L99)

Error thrown for SDK validation, Soroban RPC, and contract failures.

## Extends

- `Error`

## Constructors

### Constructor

> **new StellarAgentError**(`code`, `message`, `options?`): `StellarAgentError`

Defined in: [errors.ts:104](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/errors.ts#L104)

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

Defined in: [errors.ts:100](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/errors.ts#L100)

***

### cause?

> `readonly` `optional` **cause?**: `unknown`

Defined in: [errors.ts:101](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/errors.ts#L101)

***

### transactionHash?

> `readonly` `optional` **transactionHash?**: `string`

Defined in: [errors.ts:102](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/errors.ts#L102)
