import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../../storagemanager/index';

beforeEach(() => {
  localStorage.clear();
});

describe('StorageManager – access token', () => {
  it('stores and retrieves access token', () => {
    StorageManager.setAccessToken('my-access-token');
    expect(StorageManager.getAccessToken()).toBe('my-access-token');
  });

  it('returns null when no access token set', () => {
    expect(StorageManager.getAccessToken()).toBeNull();
  });
});

describe('StorageManager – refresh token', () => {
  it('stores and retrieves refresh token', () => {
    StorageManager.setRefreshToken('my-refresh-token');
    expect(StorageManager.getRefreshToken()).toBe('my-refresh-token');
  });

  it('returns null when no refresh token set', () => {
    expect(StorageManager.getRefreshToken()).toBeNull();
  });
});

describe('StorageManager – profile', () => {
  const mockProfile = {
    _id: '1',
    employeeId: 'E001',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'ADMIN' as const,
    technologies: ['React'],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  it('stores and retrieves profile', () => {
    StorageManager.setProfile(mockProfile);
    expect(StorageManager.getProfile()).toEqual(mockProfile);
  });

  it('returns null when no profile set', () => {
    expect(StorageManager.getProfile()).toBeNull();
  });
});

describe('StorageManager – logout / removeItems', () => {
  it('appLogout clears localStorage', () => {
    StorageManager.setAccessToken('tok');
    StorageManager.appLogout();
    expect(StorageManager.getAccessToken()).toBeNull();
  });

  it('removeItems clears localStorage', () => {
    StorageManager.setRefreshToken('tok');
    StorageManager.removeItems();
    expect(StorageManager.getRefreshToken()).toBeNull();
  });
});

describe('StorageManager – error handling', () => {
  it('getAccessToken handles corrupted storage gracefully', () => {
    // Store a non-encrypted value directly to trigger decryption failure
    localStorage.setItem('accessToken', 'corrupted-not-encrypted');
    // decryptData returns null for invalid ciphertext, so result is null/undefined
    const result = StorageManager.getAccessToken();
    expect(result == null).toBe(true);
  });

  it('getProfile returns null for corrupted profile', () => {
    localStorage.setItem('adminprofile', 'corrupted-data');
    expect(StorageManager.getProfile()).toBeNull();
  });
});
