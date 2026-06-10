import { describe, it, expect } from 'vitest';
import { buildQueryParams } from '../../utils/buildQueryParams';

describe('buildQueryParams', () => {
  it('builds a simple string param', () => {
    expect(buildQueryParams({ name: 'Alice' })).toBe('name=Alice');
  });

  it('builds a number param', () => {
    expect(buildQueryParams({ page: 2 })).toBe('page=2');
  });

  it('builds a boolean param', () => {
    expect(buildQueryParams({ active: true })).toBe('active=true');
  });

  it('builds multiple params', () => {
    const result = buildQueryParams({ page: 1, limit: 10 });
    expect(result).toContain('page=1');
    expect(result).toContain('limit=10');
  });

  it('serialises array values as JSON', () => {
    const result = buildQueryParams({ ids: [1, 2, 3] });
    expect(result).toContain('ids=%5B1%2C2%2C3%5D');
  });

  it('handles null by stringifying it', () => {
    const result = buildQueryParams({ foo: null });
    expect(result).toBe('foo=null');
  });

  it('handles undefined by stringifying it', () => {
    const result = buildQueryParams({ foo: undefined });
    expect(result).toBe('foo=undefined');
  });

  it('returns empty string for empty object', () => {
    expect(buildQueryParams({})).toBe('');
  });
});
