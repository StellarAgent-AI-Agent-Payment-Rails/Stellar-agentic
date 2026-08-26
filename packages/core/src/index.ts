// This file is the package's public surface and nothing else — every
// concrete implementation lives in a dedicated module and is re-exported
// here. See docs/architecture/core-modules.md for the module map and the
// reasoning behind it.

// ─── Deterministic math (re-exported for consumers) ──────────────────────────
export * as math from './math/index.js';
export {
  // fixed-point primitives
  bn,
  add,
  sub,
  mul,
  div,
  pct,
  clamp,
  sumStrings,
  toStroops,
  fromStroops,
  fmt,
  toStr,
  gt, gte, lt, lte, eq,
  isZero,
  isPositive,
  STROOP_SCALE,
  BPS_SCALE,
  BigNumber,
  // bidding algorithm
  scoreBid,
  rankBids,
  selectBestBid,
  isWithinSpendLimit,
  remainingBudget,
  DEFAULT_BID_WEIGHTS,
  // bid attestation
  attestRankBids,
  verifyBidAttestation,
  // payment-outcome prediction
  predictPaymentOutcome,
  isWindowExpired,
  ledgersRemainingInWindow,
  LEDGERS_PER_CHANNEL_PERIOD,
  RATE_LIMIT_LEDGERS_PER_HOUR,
  RATE_LIMIT_LEDGERS_PER_DAY,
} from './math/index.js';
export type {
  AgentBid,
  BidWeights,
  ScoredBid,
} from './math/bid.js';
export type {
  BidAttestation,
  AttestRankBidsOptions,
  AttestedRanking,
  ScorerKeyRecord,
  ScorerKeyDirectory,
  VerifyBidAttestationOptions,
  BidAttestationVerification,
} from './math/attestation.js';
export type {
  ChannelSpendState,
  RateLimitSpendState,
  PredictPaymentOutcomeParams,
  PaymentPrediction,
  BlockReason,
} from './math/predict.js';

// ─── Ledger-window wall-clock estimation ─────────────────────────────
//
// `RateLimiter`/`PaymentChannel` track their rolling windows in ledger
// sequence numbers, not timestamps. See ./ledgerTime.ts for why "5s per
// ledger" is treated as a fallback rather than a hard-coded constant.

export {
  estimateLedgerCloseSeconds,
  estimateSecondsRemaining,
  fetchLedgerCloseEstimate,
  FALLBACK_LEDGER_CLOSE_SECONDS,
} from './ledgerTime.js';
export type { LedgerCloseSample, LedgerCloseEstimate } from './ledgerTime.js';

// Public type surface — previously only imported internally, never
// re-exported, so consumers (e.g. @stellaragent/react) had no way to
// import these from the package root at all.
export type {
  Network,
  NetworkConfig,
  SpendPeriod,
  SpendLimit,
  StellarAgentConfig,
  AgentInfo,
  OpenChannelParams,
  PayForAPIParams,
  ChannelInfo,
  SpendReport,
  JobStatus,
  RequestWorkParams,
  JobInfo,
  RateLimitConfig,
  RateLimitStatus,
  ContractAddresses,
  AgentEvent,
  TxResult,
} from './types/index.js';

export { StellarAgentError } from './errors.js';
export type { StellarAgentErrorCode } from './errors.js';

// ─── Circuit Breaker (emergency pause) ────────────────────────────────────────
export {
  CircuitBreaker,
  asPublicAddress,
} from './circuitBreaker.js';
export type { CircuitBreakerOptions, PublicAddress } from './circuitBreaker.js';

// ─── Contract address resolution ─────────────────────────────────────────────
//
// Addresses used to be hard-coded here as obviously-fake placeholders. They
// now resolve from explicit config or environment variables, and an
// unconfigured network fails fast at create() time. See ./contracts.ts.

export {
  resolveContracts,
  assertDeployed,
  isDeployedAddress,
  envVarNames,
  ContractsNotDeployedError,
  UNCONFIGURED_CONTRACTS,
  CONTRACT_KEYS,
} from './contracts.js';
export type { ContractKey } from './contracts.js';

// ─── Signing ─────────────────────────────────────────────────────────────────
//
// The agent signs through a Signer rather than an in-memory Keypair, so key
// material need never live in this process. See ./signer.ts.

export {
  KeypairSigner,
  RemoteSigner,
  SignerAdapter,
  SigningError,
  isSigner,
} from './signer.js';
export type {
  Signer,
  SignTransactionOptions,
  SignAuthEntryOptions,
  RemoteSignerOptions,
  Sep43Like,
} from './signer.js';

// ─── StellarAgent ─────────────────────────────────────────────────────────────
//
// The class itself lives under ./agent/, split into invocation, encoding,
// decoding, queries, mutations, and configuration modules — see
// ./agent/StellarAgent.ts and docs/architecture/core-modules.md.

export { StellarAgent } from './agent/StellarAgent.js';
