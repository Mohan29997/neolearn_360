import { describe, it, expect } from 'vitest';
import { formatNumber } from '../../utils/formatNumber';

describe('formatNumber', () => {
  it('returns the number as string when < 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(999999)).toBe('1000K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(1_000_000)).toBe('1M');
    expect(formatNumber(2_500_000)).toBe('2.5M');
  });

  it('formats billions with B suffix', () => {
    expect(formatNumber(1_000_000_000)).toBe('1B');
  });

  it('formats trillions with T suffix', () => {
    expect(formatNumber(1_000_000_000_000)).toBe('1T');
  });

  it('defaults to 0 when no argument', () => {
    expect(formatNumber()).toBe('0');
  });
});
