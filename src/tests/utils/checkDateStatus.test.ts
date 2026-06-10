import { describe, it, expect, vi, afterEach } from 'vitest';
import { checkDateStatus } from '../../utils/checkDateStatus';

const TODAY = '2026-06-10';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkDateStatus', () => {
  it('returns "expired" for a past date', () => {
    const result = checkDateStatus('2026-01-01');
    expect(result.status).toBe('expired');
    expect(result.expire).toBe(true);
    expect(result.remainDays).toBe(0);
  });

  it('returns "today" for today\'s date', () => {
    const result = checkDateStatus(TODAY);
    expect(result.status).toBe('today');
    expect(result.expire).toBe(false);
    expect(result.remainDays).toBe(0);
  });

  it('returns "upcoming" for a future date', () => {
    const result = checkDateStatus('2026-06-20');
    expect(result.status).toBe('upcoming');
    expect(result.expire).toBe(false);
    expect(result.remainDays).toBe(10);
  });

  it('calculates correct remainDays for a future date', () => {
    const result = checkDateStatus('2026-07-10');
    expect(result.status).toBe('upcoming');
    expect(result.remainDays).toBe(30);
  });
});
