[**@stellaragent/core**](../README.md)

***

[@stellaragent/core](../README.md) / RateLimitStatus

# Interface: RateLimitStatus

Defined in: [types/index.ts:309](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L309)

Current rate-limit usage alongside the configured limits, for `RateLimiter`.

## Extends

- [`RateLimitConfig`](RateLimitConfig.md)

## Properties

### maxPerTx

> **maxPerTx**: `string`

Defined in: [types/index.ts:302](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L302)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerTx`](RateLimitConfig.md#maxpertx)

***

### maxPerHour

> **maxPerHour**: `string`

Defined in: [types/index.ts:303](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L303)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerHour`](RateLimitConfig.md#maxperhour)

***

### maxPerDay

> **maxPerDay**: `string`

Defined in: [types/index.ts:304](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L304)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxPerDay`](RateLimitConfig.md#maxperday)

***

### maxTxsPerHour

> **maxTxsPerHour**: `number`

Defined in: [types/index.ts:305](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L305)

#### Inherited from

[`RateLimitConfig`](RateLimitConfig.md).[`maxTxsPerHour`](RateLimitConfig.md#maxtxsperhour)

***

### spentThisHour

> **spentThisHour**: `string`

Defined in: [types/index.ts:311](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L311)

Amount spent in the current rolling hour

***

### spentToday

> **spentToday**: `string`

Defined in: [types/index.ts:313](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L313)

Amount spent in the current rolling day

***

### txsThisHour

> **txsThisHour**: `number`

Defined in: [types/index.ts:315](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L315)

Transaction count in the current rolling hour

***

### configured

> **configured**: `boolean`

Defined in: [types/index.ts:325](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L325)

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

Defined in: [types/index.ts:333](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L333)

Mirrors the contract's `RateLimit.active` flag (set by `kill_agent`).
Note this does **not** by itself change what `RateLimiter.check`
returns on-chain today — see `predictPaymentOutcome`'s doc comment —
so treat this as informational (e.g. "killed" badge), not as a
blocking signal on its own.

***

### hourWindowStartLedger

> **hourWindowStartLedger**: `number`

Defined in: [types/index.ts:335](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L335)

Ledger sequence at which the current hourly window started.

***

### dayWindowStartLedger

> **dayWindowStartLedger**: `number`

Defined in: [types/index.ts:337](https://github.com/StellarAgent-AI-Agent-Payment-Rails/Stellar-agentic/blob/main/packages/core/src/types/index.ts#L337)

Ledger sequence at which the current daily window started.
