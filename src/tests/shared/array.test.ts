import { describe, it, expect } from 'vitest';
import {
  getFilledArray,
  updateIndex,
  joinArrayStrings,
  append,
  mergeArrayStringFromIndex,
} from '../../shared/helpers/array';

describe('getFilledArray', () => {
  it('creates an array of given length via mapfn', () => {
    expect(getFilledArray(3, (_, i) => i * 2)).toEqual([0, 2, 4]);
  });

  it('returns empty array for range <= 0', () => {
    expect(getFilledArray(0, (_, i) => i)).toEqual([]);
    expect(getFilledArray(-1, (_, i) => i)).toEqual([]);
  });
});

describe('updateIndex', () => {
  it('replaces the element at the given index', () => {
    expect(updateIndex(['a', 'b', 'c'], 1, 'x')).toEqual(['a', 'x', 'c']);
  });

  it('leaves other elements unchanged', () => {
    const result = updateIndex([1, 2, 3], 2, 99);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(99);
  });
});

describe('joinArrayStrings', () => {
  it('joins string array into a single string', () => {
    expect(joinArrayStrings(['a', 'b', 'c'])).toBe('abc');
  });

  it('returns empty string for empty array', () => {
    expect(joinArrayStrings([])).toBe('');
  });
});

describe('append', () => {
  it('appends an item to the array', () => {
    expect(append([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [1, 2];
    append(original, 3);
    expect(original).toEqual([1, 2]);
  });
});

describe('mergeArrayStringFromIndex', () => {
  it('keeps items before fromIndex from the original array', () => {
    const result = mergeArrayStringFromIndex(['a', 'b', 'c'], ['x', 'y'], 1);
    expect(result[0]).toBe('a');
  });

  it('replaces items from fromIndex with arrayToMerge', () => {
    const result = mergeArrayStringFromIndex(['a', 'b', 'c'], ['x', 'y'], 1);
    expect(result[1]).toBe('x');
    expect(result[2]).toBe('y');
  });

  it('fills with empty string when arrayToMerge is exhausted', () => {
    const result = mergeArrayStringFromIndex(['a', 'b', 'c'], ['x'], 1);
    expect(result[2]).toBe('');
  });

  it('replaces from index 0', () => {
    const result = mergeArrayStringFromIndex(['a', 'b'], ['x', 'y'], 0);
    expect(result).toEqual(['x', 'y']);
  });
});
