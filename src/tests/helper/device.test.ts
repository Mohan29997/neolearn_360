import { describe, it, expect, vi, afterEach } from 'vitest';

describe('getReadableDeviceName', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns navigator.userAgent as deviceName', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'TestBrowser/1.0',
      productSub: '20030107',
    });

    // Re-import to pick up stubbed navigator
    const { getReadableDeviceName } = await import('../../helper/device?t=' + Date.now());
    const result = getReadableDeviceName();
    expect(result.deviceName).toBe('TestBrowser/1.0');
  });

  it('returns productSub as deviceUniqueId', async () => {
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla',
      productSub: '20030107',
    });

    const { getReadableDeviceName } = await import('../../helper/device?t=' + Date.now() + 1);
    const result = getReadableDeviceName();
    expect(result.deviceUniqueId).toBe('20030107');
  });
});
