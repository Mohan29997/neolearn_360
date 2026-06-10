import { describe, it, expect, vi, afterEach } from 'vitest';
import dayjs from 'dayjs';
import { calculateAge, calculateYearsAndMonths } from '../../utils/calculateAge';

const TODAY = '2026-06-10';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateAge', () => {
  it('returns correct age for a known DOB', () => {
    expect(calculateAge('2000-06-10')).toBe(26);
  });

  it('returns 0 for today as DOB', () => {
    expect(calculateAge(TODAY)).toBe(0);
  });

  it('handles birthday that has not passed this year', () => {
    // DOB December 10 2000, today June 10 2026 → 25 years
    expect(calculateAge('2000-12-10')).toBe(25);
  });
});

describe('calculateYearsAndMonths', () => {
  it('returns correct years, months, days', () => {
    const result = calculateYearsAndMonths('2000-06-10');
    expect(result.years).toBe(26);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('marks 18-65 year old as eligible to donate', () => {
    expect(calculateYearsAndMonths('2000-06-10').isCanDonate).toBe(true);
  });

  it('marks under-18 as not eligible to donate', () => {
    expect(calculateYearsAndMonths('2015-01-01').isCanDonate).toBe(false);
  });

  it('marks over-65 as not eligible to donate', () => {
    expect(calculateYearsAndMonths('1950-01-01').isCanDonate).toBe(false);
  });

  it('includes "year" singular when years === 1', () => {
    const result = calculateYearsAndMonths('2025-06-10');
    expect(result.value).toContain('1 year,');
  });

  it('includes "years" plural when years > 1', () => {
    const result = calculateYearsAndMonths('2000-06-10');
    expect(result.value).toContain('years');
  });
});
