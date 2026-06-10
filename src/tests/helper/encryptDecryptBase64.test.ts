import { describe, it, expect } from 'vitest';
import { encryptBase64 } from '../../helper/encryptBase64';
import { decryptBase64 } from '../../helper/decryptBase64';

describe('encryptBase64', () => {
  it('returns a base64 encoded string', () => {
    expect(encryptBase64('hello')).toBe(btoa('hello'));
  });

  it('encodes empty string', () => {
    expect(encryptBase64('')).toBe('');
  });
});

describe('decryptBase64', () => {
  it('decodes a base64 string', () => {
    expect(decryptBase64(btoa('hello'))).toBe('hello');
  });

  it('returns undefined for invalid base64', () => {
    expect(decryptBase64('not-valid-base64!!!')).toBeUndefined();
  });

  it('decodes empty string', () => {
    expect(decryptBase64('')).toBe('');
  });
});
