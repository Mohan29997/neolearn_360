import { describe, it, expect } from 'vitest';
import { split } from '../../shared/helpers/string';

describe('split', () => {
  it('splits a string into individual characters', () => {
    expect(split('abc')).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty string', () => {
    expect(split('')).toEqual([]);
  });

  it('handles a single character', () => {
    expect(split('x')).toEqual(['x']);
  });

  it('handles spaces', () => {
    expect(split('a b')).toEqual(['a', ' ', 'b']);
  });
});
