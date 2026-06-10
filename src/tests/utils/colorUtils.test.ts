import { describe, it, expect, vi } from 'vitest';
import { hexToRgbChannel, extendPaletteWithChannels, withAlpha } from '../../utils/colorUtils';

vi.mock('@mui/material/styles', () => ({
  alpha: (color: string, opacity: number) => `rgba(${color},${opacity})`,
}));

describe('hexToRgbChannel', () => {
  it('converts 6-char hex', () => {
    expect(hexToRgbChannel('#C8FAD6')).toBe('200 250 214');
  });

  it('converts 3-char hex', () => {
    expect(hexToRgbChannel('#FFF')).toBe('255 255 255');
  });

  it('converts 4-char hex', () => {
    expect(hexToRgbChannel('#000F')).toBe('0 0 0');
  });

  it('converts 8-char hex (ignores alpha)', () => {
    expect(hexToRgbChannel('#FF0000FF')).toBe('255 0 0');
  });

  it('throws for 5-char hex', () => {
    expect(() => hexToRgbChannel('#12345')).toThrow('Invalid hex color');
  });

  it('throws for 2-char hex', () => {
    expect(() => hexToRgbChannel('#AB')).toThrow('Invalid hex color');
  });
});

describe('extendPaletteWithChannels', () => {
  it('adds Channel sibling for top-level hex values', () => {
    const result = extendPaletteWithChannels({ primary: '#FF0000' } as any);
    expect(result.primaryChannel).toBe('255 0 0');
  });

  it('recursively adds channels for nested objects', () => {
    const palette = { brand: { main: '#00FF00' } } as any;
    const result = extendPaletteWithChannels(palette);
    expect(result.brand.mainChannel).toBe('0 255 0');
  });

  it('does not add channel for non-hex strings', () => {
    const result = extendPaletteWithChannels({ mode: 'light' } as any);
    expect(result.modeChannel).toBeUndefined();
  });
});

describe('withAlpha', () => {
  it('applies opacity to hex color', () => {
    const result = withAlpha('#FF0000', 0.5);
    expect(result).toContain('0.5');
  });

  it('applies opacity to rgb color', () => {
    const result = withAlpha('rgb(255,0,0)', 0.3);
    expect(result).toContain('0.3');
  });

  it('handles CSS var color', () => {
    const result = withAlpha('var(--mui-palette-primary-main)', 0.5);
    expect(result).toContain('Channel');
    expect(result).toContain('0.5');
  });

  it('returns unchanged color for unrecognised format', () => {
    // should not match #/rgb/hsl/color keywords and not start with var(
    expect(withAlpha('brand-token', 0.5)).toBe('brand-token');
  });
});
