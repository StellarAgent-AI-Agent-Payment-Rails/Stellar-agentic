// ─── Stellar Amount Helpers ──────────────────────────────────────────────────
// 1 XLM = 10,000,000 stroops (7 decimal places)

const STROOPS_PER_UNIT = 10_000_000n;
const DECIMAL_PLACES = 7;

/**
 * Convert a human-readable amount string to stroops (bigint).
 *
 * @example toStroops("1.0000001") // => 10_000_001n
 * @example toStroops("100")       // => 1_000_000_000n
 */
export function toStroops(amount: string): bigint {
  if (typeof amount !== 'string' || amount.trim() === '') {
    throw new Error('Amount must be a non-empty string');
  }

  const trimmed = amount.trim();

  if (trimmed.startsWith('-')) {
    throw new Error('Negative amounts are not allowed');
  }

  const parts = trimmed.split('.');
  if (parts.length > 2) {
    throw new Error('Invalid amount format');
  }

  const whole = parts[0] || '0';
  let fraction = parts[1] || '';

  if (fraction.length > DECIMAL_PLACES) {
    throw new Error(`Amount exceeds maximum precision of ${DECIMAL_PLACES} decimal places`);
  }

  // Pad fraction to 7 digits
  fraction = fraction.padEnd(DECIMAL_PLACES, '0');

  const wholeBigInt = BigInt(whole) * STROOPS_PER_UNIT;
  const fractionBigInt = BigInt(fraction);

  return wholeBigInt + fractionBigInt;
}

/**
 * Convert stroops (bigint) to a human-readable amount string.
 *
 * @example fromStroops(10_000_001n) // => "1.0000001"
 * @example fromStroops(0n)          // => "0"
 */
export function fromStroops(stroops: bigint): string {
  if (stroops < 0n) {
    throw new Error('Negative stroops are not allowed');
  }

  const whole = stroops / STROOPS_PER_UNIT;
  const fraction = stroops % STROOPS_PER_UNIT;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(DECIMAL_PLACES, '0').replace(/0+$/, '');
  return `${whole}.${fractionStr}`;
}

/**
 * Format an amount with its asset symbol for display.
 *
 * @example formatAmount("1.5", "XLM")  // => "1.5 XLM"
 * @example formatAmount("0.001", "USDC") // => "0.001 USDC"
 */
export function formatAmount(amount: string, asset: string): string {
  if (typeof amount !== 'string' || amount.trim() === '') {
    throw new Error('Amount must be a non-empty string');
  }
  if (typeof asset !== 'string' || asset.trim() === '') {
    throw new Error('Asset must be a non-empty string');
  }

  // Validate by round-tripping through stroops
  const stroops = toStroops(amount);
  const normalized = fromStroops(stroops);

  return `${normalized} ${asset.trim()}`;
}
