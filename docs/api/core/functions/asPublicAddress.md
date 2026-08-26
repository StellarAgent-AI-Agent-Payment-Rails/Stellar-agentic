[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / asPublicAddress

# Function: asPublicAddress()

> **asPublicAddress**(`value`): [`PublicAddress`](../type-aliases/PublicAddress.md)

Defined in: [circuitBreaker.ts:50](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/circuitBreaker.ts#L50)

Parse and validate a Stellar public address. Rejects secret keys so a
trusted-node list can never accidentally hold signing material.

## Parameters

### value

`string`

## Returns

[`PublicAddress`](../type-aliases/PublicAddress.md)
