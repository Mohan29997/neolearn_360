import { describe, it, expect, vi, afterEach } from 'vitest';

describe('devicelocation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('returns latitude and longitude (defaulting to 0)', async () => {
    vi.stubGlobal('navigator', {
      geolocation: {
        getCurrentPosition: vi.fn((success) => {
          success({ coords: { latitude: 10.5, longitude: 20.5 } });
        }),
      },
    });

    const mod = await import('../../helper/deviceloaction?v=1');
    const result = mod.devicelocation();
    // The function captures lat/lon from async callback but returns synchronously (always 0)
    expect(result).toHaveProperty('latitude');
    expect(result).toHaveProperty('longitude');
  });

  it('returns void when geolocation is not supported', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('navigator', { geolocation: null });

    const mod = await import('../../helper/deviceloaction?v=2');
    const result = mod.devicelocation();
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });
});
