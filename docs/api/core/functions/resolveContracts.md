[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / resolveContracts

# Function: resolveContracts()

> **resolveContracts**(`network`, `overrides?`): [`ContractAddresses`](../interfaces/ContractAddresses.md)

Defined in: [contracts.ts:141](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/contracts.ts#L141)

Resolve the contract addresses for a network.

Precedence, highest first:
1. `overrides` — what the caller passed as `config.contracts`
2. `STELLARAGENT_<NETWORK>_<CONTRACT>` environment variable
3. `STELLARAGENT_<CONTRACT>` environment variable
4. the unconfigured sentinel for that network

Resolution never throws — it reports what it found. Use `assertDeployed`
to reject the result if it is still unconfigured.

## Parameters

### network

[`Network`](../type-aliases/Network.md)

### overrides?

`Partial`\<[`ContractAddresses`](../interfaces/ContractAddresses.md)\>

## Returns

[`ContractAddresses`](../interfaces/ContractAddresses.md)
