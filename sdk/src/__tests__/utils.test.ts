import { describe, it, expect } from 'vitest';
import { toStroops, fromStroops, formatAmount } from '../utils.js';

describe('toStroops', () => {
  it('converts whole numbers', () => {
    expect(toStroops('1')).toBe(10_000_000n);
    expect(toStroops('100')).toBe(1_000_000_000n);
  });

  it('converts decimals', () => {
    expect(toStroops('1.0000001')).toBe(10_000_001n);
    expect(toStroops('0.5')).toBe(5_000_000n);
    expect(toStroops('1.5')).toBe(15_000_000n);
  });

  it('converts zero', () => {
    expect(toStroops('0')).toBe(0n);
    expect(toStroops('0.0')).toBe(0n);
  });

  it('handles max precision (7 decimals)', () => {
    expect(toStroops('0.0000001')).toBe(1n);
    expect(toStroops('9999999.9999999')).toBe(99_999_999_999_999n);
  });

  it('rejects negative amounts', () => {
    expect(() => toStroops('-1')).toThrow('Negative amounts are not allowed');
    expect(() => toStroops('-0.5')).toThrow('Negative amounts are not allowed');
  });

  it('rejects more than 7 decimal places', () => {
    expect(() => toStroops('1.00000001')).toThrow('exceeds maximum precision');
  });

  it('rejects empty or invalid input', () => {
    expect(() => toStroops('')).toThrow('non-empty string');
    expect(() => toStroops('  ')).toThrow('non-empty string');
  });

  it('rejects invalid format', () => {
    expect(() => toStroops('1.2.3')).toThrow('Invalid amount format');
  });
});

describe('fromStroops', () => {
  it('converts whole stroops', () => {
    expect(fromStroops(10_000_000n)).toBe('1');
    expect(fromStroops(1_000_000_000n)).toBe('100');
  });

  it('converts fractional stroops', () => {
    expect(fromStroops(10_000_001n)).toBe('1.0000001');
    expect(fromStroops(5_000_000n)).toBe('0.5');
    expect(fromStroops(15_000_000n)).toBe('1.5');
  });

  it('converts zero', () => {
    expect(fromStroops(0n)).toBe('0');
  });

  it('strips trailing zeros', () => {
    expect(fromStroops(10_100_000n)).toBe('1.01');
    expect(fromStroops(10_000_000n)).toBe('1');
  });

  it('converts single stroop', () => {
    expect(fromStroops(1n)).toBe('0.0000001');
  });

  it('rejects negative stroops', () => {
    expect(() => fromStroops(-1n)).toThrow('Negative stroops are not allowed');
  });

  it('handles large values', () => {
    expect(fromStroops(99_999_999_999_999n)).toBe('9999999.9999999');
  });
});

describe('formatAmount', () => {
  it('formats amount with asset', () => {
    expect(formatAmount('1.5', 'XLM')).toBe('1.5 XLM');
    expect(formatAmount('0.001', 'USDC')).toBe('0.001 USDC');
  });

  it('normalizes amount via round-trip', () => {
    expect(formatAmount('1.0000000', 'XLM')).toBe('1 XLM');
    expect(formatAmount('01.5', 'XLM')).toBe('1.5 XLM');
  });

  it('formats zero', () => {
    expect(formatAmount('0', 'XLM')).toBe('0 XLM');
  });

  it('rejects empty amount', () => {
    expect(() => formatAmount('', 'XLM')).toThrow('non-empty string');
  });

  it('rejects empty asset', () => {
    expect(() => formatAmount('1', '')).toThrow('non-empty string');
  });
});
