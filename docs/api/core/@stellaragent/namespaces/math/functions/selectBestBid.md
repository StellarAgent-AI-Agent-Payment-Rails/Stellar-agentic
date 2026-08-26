[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / selectBestBid

# Function: selectBestBid()

> **selectBestBid**(`bids`, `weights?`): [`ScoredBid`](../interfaces/ScoredBid.md) \| `null`

Defined in: [math/bid.ts:228](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/bid.ts#L228)

Select the single best bid from a pool.
Returns `null` when the pool is empty.

## Parameters

### bids

[`AgentBid`](../interfaces/AgentBid.md)[]

### weights?

[`BidWeights`](../interfaces/BidWeights.md) = `DEFAULT_BID_WEIGHTS`

## Returns

[`ScoredBid`](../interfaces/ScoredBid.md) \| `null`
