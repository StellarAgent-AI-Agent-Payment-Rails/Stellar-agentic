// ─── Stellar Agent Error Hierarchy ───────────────────────────────────────────

/**
 * Base error class for all StellarAgent SDK errors.
 */
export class StellarAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StellarAgentError';
  }
}

/**
 * Thrown when an operation requires an active payment channel but none exists.
 */
export class NoActiveChannelError extends StellarAgentError {
  constructor(message = 'No active payment channel. Call openChannel() first.') {
    super(message);
    this.name = 'NoActiveChannelError';
  }
}

/**
 * Thrown when a payment would exceed the configured spend limit.
 */
export class SpendLimitExceededError extends StellarAgentError {
  constructor(message = 'Spend limit exceeded') {
    super(message);
    this.name = 'SpendLimitExceededError';
  }
}

/**
 * Thrown when a Soroban contract call panics or returns an error code.
 */
export class ContractPanicError extends StellarAgentError {
  constructor(message = 'Contract invocation failed') {
    super(message);
    this.name = 'ContractPanicError';
  }
}
