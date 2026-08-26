[**@stellaragent/react**](../README.md)

***

[@stellaragent/react](../README.md) / StellarAgentProvider

# Function: StellarAgentProvider()

> **StellarAgentProvider**(`__namedParameters`): `Element`

Defined in: [StellarAgentProvider.tsx:117](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/StellarAgentProvider.tsx#L117)

Owns a `StellarAgent` instance (built from `config` via
`StellarAgent.create`, unless `agent` is supplied directly) and exposes
it — plus its async init status — to `useStellarAgent()` and every hook
in this package. Also owns the optimistic-payment overlay shared
between `usePayForAPI` and `useSpendReport`.

## Parameters

### \_\_namedParameters

[`StellarAgentProviderProps`](../interfaces/StellarAgentProviderProps.md)

## Returns

`Element`
