[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / assertDeployed

# Function: assertDeployed()

> **assertDeployed**(`network`, `contracts`): `void`

Defined in: [contracts.ts:192](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/contracts.ts#L192)

Throw unless every contract address is a real deployed contract ID.

This runs at `StellarAgent.create()` time so the failure names the actual
problem, instead of surfacing later as a confusing RPC error from the
middle of a payment.

## Parameters

### network

[`Network`](../type-aliases/Network.md)

### contracts

[`ContractAddresses`](../interfaces/ContractAddresses.md)

## Returns

`void`
