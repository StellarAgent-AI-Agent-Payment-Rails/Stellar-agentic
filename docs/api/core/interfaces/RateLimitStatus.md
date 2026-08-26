[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RateLimitStatus

# Interface: RateLimitStatus

Defined in: [types/index.ts:240](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L240)

Current rate-limit usage alongside the configured limits, for `RateLimiter`.

## Extends

- [`RateLimitConfig`](RateLimitConfig.md)

## Properties

### maxPerTx

> **maxPerTx**: `string`

Defined in: [types/index.ts:233](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L233)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerTx`](RateLimitConfig.md#maxpertx)

***

### maxPerHour

> **maxPerHour**: `string`

Defined in: [types/index.ts:234](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L234)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerHour`](RateLimitConfig.md#maxperhour)

***

### maxPerDay

> **maxPerDay**: `string`

Defined in: [types/index.ts:235](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L235)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerDay`](RateLimitConfig.md#maxperday)

***

### maxTxsPerHour

> **maxTxsPerHour**: `number`

Defined in: [types/index.ts:236](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L236)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxTxsPerHour`](RateLimitConfig.md#maxtxsperhour)

***

### spentThisHour

> **spentThisHour**: `string`

Defined in: [types/index.ts:242](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L242)

Amount spent in the current rolling hour

***

### spentToday

> **spentToday**: `string`

Defined in: [types/index.ts:244](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L244)

Amount spent in the current rolling day

***

### txsThisHour

> **txsThisHour**: `number`

Defined in: [types/index.ts:246](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L246)

Transaction count in the current rolling hour

***

### configured

> **configured**: `boolean`

Defined in: [types/index.ts:256](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L256)

Whether `RateLimiter.set_limits` has ever been called for this agent
(mirrors the contract's internal `has_limit` check). When `false`,
every other field on this object is meaningless — `RateLimiter.check`
returns `true` unconditionally for an unconfigured agent, so payments
are unrestricted by the rate limiter (though still subject to a
payment channel's own spend limit, if any). Distinct from `active`:
an agent can be `configured: true, active: false` (killed).

***

### active

> **active**: `boolean`

Defined in: [types/index.ts:264](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L264)

Mirrors the contract's `RateLimit.active` flag (set by `kill_agent`).
Note this does **not** by itself change what `RateLimiter.check`
returns on-chain today — see `predictPaymentOutcome`'s doc comment —
so treat this as informational (e.g. "killed" badge), not as a
blocking signal on its own.

***

### hourWindowStartLedger

> **hourWindowStartLedger**: `number`

Defined in: [types/index.ts:266](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L266)

Ledger sequence at which the current hourly window started.

***

### dayWindowStartLedger

> **dayWindowStartLedger**: `number`

Defined in: [types/index.ts:268](https://github.com/Nanle-code/Stellar-agentic/blob/89bd9706be3624688bb5c198505399710140927e/packages/core/src/types/index.ts#L268)

Ledger sequence at which the current daily window started.
