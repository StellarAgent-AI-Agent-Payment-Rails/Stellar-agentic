[**@stellaragent/core**](../../../../README.md)

***

[@stellaragent/core](../../../../README.md) / [math](../README.md) / RATE\_LIMIT\_LEDGERS\_PER\_HOUR

# Variable: RATE\_LIMIT\_LEDGERS\_PER\_HOUR

> `const` **RATE\_LIMIT\_LEDGERS\_PER\_HOUR**: `720` = `720`

Defined in: [math/predict.ts:73](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/math/predict.ts#L73)

`RateLimiter`'s hourly/daily windows are fixed cadences, independent of any
channel's own configurable period — mirroring the constants inside
`RateLimiter::reset_windows_if_needed` in
`contracts/rate_limiter/src/lib.rs`.
