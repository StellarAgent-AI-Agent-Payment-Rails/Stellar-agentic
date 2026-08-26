[**@stellaragent/react**](../README.md)

***

[@stellaragent/react](../README.md) / useChannel

# Function: useChannel()

> **useChannel**(`channelId`, `options?`): [`UsePollingResult`](../interfaces/UsePollingResult.md)\<`ChannelInfo`\>

Defined in: [hooks/useChannel.ts:13](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/react/src/hooks/useChannel.ts#L13)

Polls `PaymentChannel.get_channel` for `channelId` via the current
`StellarAgent`. Disabled (stays `idle`) until both the agent is `ready`
and `channelId` is defined, so it's safe to call before a channel has
been opened yet — e.g. `useChannel(channelId)` where `channelId` starts
`undefined`.

## Parameters

### channelId

`bigint` \| `undefined`

### options?

[`UsePollingOptions`](../interfaces/UsePollingOptions.md)

## Returns

[`UsePollingResult`](../interfaces/UsePollingResult.md)\<`ChannelInfo`\>
