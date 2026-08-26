**@stellaragent/core**

***

# @stellaragent/core

## Namespaces

- [math](@stellaragent/namespaces/math/README.md)

## Classes

- [StellarAgent](classes/StellarAgent.md)
- [CircuitBreaker](classes/CircuitBreaker.md)
- [ContractsNotDeployedError](classes/ContractsNotDeployedError.md)
- [StellarAgentError](classes/StellarAgentError.md)
- [SigningError](classes/SigningError.md)
- [KeypairSigner](classes/KeypairSigner.md)
- [RemoteSigner](classes/RemoteSigner.md)
- [SignerAdapter](classes/SignerAdapter.md)

## Interfaces

- [CircuitBreakerOptions](interfaces/CircuitBreakerOptions.md)
- [LedgerCloseSample](interfaces/LedgerCloseSample.md)
- [LedgerCloseEstimate](interfaces/LedgerCloseEstimate.md)
- [SignTransactionOptions](interfaces/SignTransactionOptions.md)
- [SignAuthEntryOptions](interfaces/SignAuthEntryOptions.md)
- [Signer](interfaces/Signer.md)
- [RemoteSignerOptions](interfaces/RemoteSignerOptions.md)
- [Sep43Like](interfaces/Sep43Like.md)
- [NetworkConfig](interfaces/NetworkConfig.md)
- [SpendLimit](interfaces/SpendLimit.md)
- [StellarAgentConfig](interfaces/StellarAgentConfig.md)
- [AgentInfo](interfaces/AgentInfo.md)
- [OpenChannelParams](interfaces/OpenChannelParams.md)
- [PayForAPIParams](interfaces/PayForAPIParams.md)
- [ChannelInfo](interfaces/ChannelInfo.md)
- [SpendReport](interfaces/SpendReport.md)
- [RequestWorkParams](interfaces/RequestWorkParams.md)
- [JobInfo](interfaces/JobInfo.md)
- [RateLimitConfig](interfaces/RateLimitConfig.md)
- [RateLimitStatus](interfaces/RateLimitStatus.md)
- [ContractAddresses](interfaces/ContractAddresses.md)
- [AgentEvent](interfaces/AgentEvent.md)
- [TxResult](interfaces/TxResult.md)

## Type Aliases

- [PublicAddress](type-aliases/PublicAddress.md)
- [ContractKey](type-aliases/ContractKey.md)
- [StellarAgentErrorCode](type-aliases/StellarAgentErrorCode.md)
- [Network](type-aliases/Network.md)
- [SpendPeriod](type-aliases/SpendPeriod.md)
- [JobStatus](type-aliases/JobStatus.md)

## Variables

- [CONTRACT\_KEYS](variables/CONTRACT_KEYS.md)
- [UNCONFIGURED\_CONTRACTS](variables/UNCONFIGURED_CONTRACTS.md)
- [FALLBACK\_LEDGER\_CLOSE\_SECONDS](variables/FALLBACK_LEDGER_CLOSE_SECONDS.md)

## Functions

- [asPublicAddress](functions/asPublicAddress.md)
- [isDeployedAddress](functions/isDeployedAddress.md)
- [envVarNames](functions/envVarNames.md)
- [resolveContracts](functions/resolveContracts.md)
- [assertDeployed](functions/assertDeployed.md)
- [estimateLedgerCloseSeconds](functions/estimateLedgerCloseSeconds.md)
- [estimateSecondsRemaining](functions/estimateSecondsRemaining.md)
- [fetchLedgerCloseEstimate](functions/fetchLedgerCloseEstimate.md)
- [isSigner](functions/isSigner.md)

## References

### bn

Re-exports [bn](@stellaragent/namespaces/math/functions/bn.md)

***

### add

Re-exports [add](@stellaragent/namespaces/math/functions/add.md)

***

### sub

Re-exports [sub](@stellaragent/namespaces/math/functions/sub.md)

***

### mul

Re-exports [mul](@stellaragent/namespaces/math/functions/mul.md)

***

### div

Re-exports [div](@stellaragent/namespaces/math/functions/div.md)

***

### pct

Re-exports [pct](@stellaragent/namespaces/math/functions/pct.md)

***

### clamp

Re-exports [clamp](@stellaragent/namespaces/math/functions/clamp.md)

***

### sumStrings

Re-exports [sumStrings](@stellaragent/namespaces/math/functions/sumStrings.md)

***

### toStroops

Re-exports [toStroops](@stellaragent/namespaces/math/functions/toStroops.md)

***

### fromStroops

Re-exports [fromStroops](@stellaragent/namespaces/math/functions/fromStroops.md)

***

### fmt

Re-exports [fmt](@stellaragent/namespaces/math/functions/fmt.md)

***

### toStr

Re-exports [toStr](@stellaragent/namespaces/math/functions/toStr.md)

***

### gt

Re-exports [gt](@stellaragent/namespaces/math/functions/gt.md)

***

### gte

Re-exports [gte](@stellaragent/namespaces/math/functions/gte.md)

***

### lt

Re-exports [lt](@stellaragent/namespaces/math/functions/lt.md)

***

### lte

Re-exports [lte](@stellaragent/namespaces/math/functions/lte.md)

***

### eq

Re-exports [eq](@stellaragent/namespaces/math/functions/eq.md)

***

### isZero

Re-exports [isZero](@stellaragent/namespaces/math/functions/isZero.md)

***

### isPositive

Re-exports [isPositive](@stellaragent/namespaces/math/functions/isPositive.md)

***

### STROOP\_SCALE

Re-exports [STROOP_SCALE](@stellaragent/namespaces/math/variables/STROOP_SCALE.md)

***

### BPS\_SCALE

Re-exports [BPS_SCALE](@stellaragent/namespaces/math/variables/BPS_SCALE.md)

***

### scoreBid

Re-exports [scoreBid](@stellaragent/namespaces/math/functions/scoreBid.md)

***

### rankBids

Re-exports [rankBids](@stellaragent/namespaces/math/functions/rankBids.md)

***

### selectBestBid

Re-exports [selectBestBid](@stellaragent/namespaces/math/functions/selectBestBid.md)

***

### isWithinSpendLimit

Re-exports [isWithinSpendLimit](@stellaragent/namespaces/math/functions/isWithinSpendLimit.md)

***

### remainingBudget

Re-exports [remainingBudget](@stellaragent/namespaces/math/functions/remainingBudget.md)

***

### DEFAULT\_BID\_WEIGHTS

Re-exports [DEFAULT_BID_WEIGHTS](@stellaragent/namespaces/math/variables/DEFAULT_BID_WEIGHTS.md)

***

### attestRankBids

Re-exports [attestRankBids](@stellaragent/namespaces/math/functions/attestRankBids.md)

***

### verifyBidAttestation

Re-exports [verifyBidAttestation](@stellaragent/namespaces/math/functions/verifyBidAttestation.md)

***

### predictPaymentOutcome

Re-exports [predictPaymentOutcome](@stellaragent/namespaces/math/functions/predictPaymentOutcome.md)

***

### isWindowExpired

Re-exports [isWindowExpired](@stellaragent/namespaces/math/functions/isWindowExpired.md)

***

### ledgersRemainingInWindow

Re-exports [ledgersRemainingInWindow](@stellaragent/namespaces/math/functions/ledgersRemainingInWindow.md)

***

### LEDGERS\_PER\_CHANNEL\_PERIOD

Re-exports [LEDGERS_PER_CHANNEL_PERIOD](@stellaragent/namespaces/math/variables/LEDGERS_PER_CHANNEL_PERIOD.md)

***

### RATE\_LIMIT\_LEDGERS\_PER\_HOUR

Re-exports [RATE_LIMIT_LEDGERS_PER_HOUR](@stellaragent/namespaces/math/variables/RATE_LIMIT_LEDGERS_PER_HOUR.md)

***

### RATE\_LIMIT\_LEDGERS\_PER\_DAY

Re-exports [RATE_LIMIT_LEDGERS_PER_DAY](@stellaragent/namespaces/math/variables/RATE_LIMIT_LEDGERS_PER_DAY.md)

***

### AgentBid

Re-exports [AgentBid](@stellaragent/namespaces/math/interfaces/AgentBid.md)

***

### BidWeights

Re-exports [BidWeights](@stellaragent/namespaces/math/interfaces/BidWeights.md)

***

### ScoredBid

Re-exports [ScoredBid](@stellaragent/namespaces/math/interfaces/ScoredBid.md)

***

### BidAttestation

Re-exports [BidAttestation](@stellaragent/namespaces/math/interfaces/BidAttestation.md)

***

### AttestRankBidsOptions

Re-exports [AttestRankBidsOptions](@stellaragent/namespaces/math/interfaces/AttestRankBidsOptions.md)

***

### AttestedRanking

Re-exports [AttestedRanking](@stellaragent/namespaces/math/interfaces/AttestedRanking.md)

***

### ScorerKeyRecord

Re-exports [ScorerKeyRecord](@stellaragent/namespaces/math/interfaces/ScorerKeyRecord.md)

***

### ScorerKeyDirectory

Re-exports [ScorerKeyDirectory](@stellaragent/namespaces/math/type-aliases/ScorerKeyDirectory.md)

***

### VerifyBidAttestationOptions

Re-exports [VerifyBidAttestationOptions](@stellaragent/namespaces/math/interfaces/VerifyBidAttestationOptions.md)

***

### BidAttestationVerification

Re-exports [BidAttestationVerification](@stellaragent/namespaces/math/type-aliases/BidAttestationVerification.md)

***

### ChannelSpendState

Re-exports [ChannelSpendState](@stellaragent/namespaces/math/interfaces/ChannelSpendState.md)

***

### RateLimitSpendState

Re-exports [RateLimitSpendState](@stellaragent/namespaces/math/interfaces/RateLimitSpendState.md)

***

### PredictPaymentOutcomeParams

Re-exports [PredictPaymentOutcomeParams](@stellaragent/namespaces/math/interfaces/PredictPaymentOutcomeParams.md)

***

### PaymentPrediction

Re-exports [PaymentPrediction](@stellaragent/namespaces/math/interfaces/PaymentPrediction.md)

***

### BlockReason

Re-exports [BlockReason](@stellaragent/namespaces/math/type-aliases/BlockReason.md)
