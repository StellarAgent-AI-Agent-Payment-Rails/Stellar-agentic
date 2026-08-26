[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / PaymentPrediction

# Interface: PaymentPrediction

Defined in: [math/predict.ts:125](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/predict.ts#L125)

## Properties

### wouldBlock

> **wouldBlock**: `boolean`

Defined in: [math/predict.ts:127](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/predict.ts#L127)

`true` if any reason fired — i.e. the on-chain call(s) are predicted to fail.

***

### reasons

> **reasons**: [`BlockReason`](../type-aliases/BlockReason.md)[]

Defined in: [math/predict.ts:129](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/predict.ts#L129)

Every check that would fail, most upstream first. Empty when `wouldBlock` is `false`.
