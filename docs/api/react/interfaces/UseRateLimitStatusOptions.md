[**@stellaragent/react**](../README.md)

***

[@stellaragent/react](../README.md) / UseRateLimitStatusOptions

# Interface: UseRateLimitStatusOptions

Defined in: [hooks/useRateLimitStatus.ts:19](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/useRateLimitStatus.ts#L19)

## Extends

- [`UsePollingOptions`](UsePollingOptions.md)

## Properties

### channelId?

> `optional` **channelId?**: `bigint`

Defined in: [hooks/useRateLimitStatus.ts:26](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/useRateLimitStatus.ts#L26)

Channel to fold into `wouldBlock`/`predict` alongside the rate limiter,
via `PaymentChannel.get_channel`/`remaining_this_period`. Omit if the
proposed payment doesn't go through a channel at all — `wouldBlock`
then reflects the rate limiter only.

***

### intervalMs?

> `optional` **intervalMs?**: `number`

Defined in: [internal/usePolling.ts:13](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/internal/usePolling.ts#L13)

Poll interval in ms. Default 5000.

#### Inherited from

[`UsePollingOptions`](UsePollingOptions.md).[`intervalMs`](UsePollingOptions.md#intervalms)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [internal/usePolling.ts:15](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/internal/usePolling.ts#L15)

Skip fetching entirely (e.g. a dependency isn't ready yet). Default true.

#### Inherited from

[`UsePollingOptions`](UsePollingOptions.md).[`enabled`](UsePollingOptions.md#enabled)
