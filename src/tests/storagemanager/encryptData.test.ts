import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from '../../storagemanager/encryptData';

const SALT = 'test-salt-123';

describe('encryptData / decryptData', () => {
  it('round-trips a simple string', () => {
    const cipher = encryptData('hello', SALT);
    expect(decryptData(cipher, SALT)).toBe('hello');
  });

  it('round-trips a JSON object string', () => {
    const json = JSON.stringify({ id: 1, name: 'Alice' });
    const cipher = encryptData(json, SALT);
    expect(decryptData(cipher, SALT)).toBe(json);
  });

  it('produces different ciphertext from plaintext', () => {
    const cipher = encryptData('secret', SALT);
    expect(cipher).not.toBe('secret');
  });

  it('returns null for corrupted ciphertext', () => {
    expect(decryptData('not-valid-cipher', SALT)).toBeNull();
  });

  it('returns null when decrypted with wrong salt', () => {
    const cipher = encryptData('hello', SALT);
    expect(decryptData(cipher, 'wrong-salt')).toBeNull();
  });
});
