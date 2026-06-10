import { describe, it, expect } from 'vitest';
import { hexToRgbColor } from '../../utils/hexToRgbColor';

describe('hexToRgbColor', () => {
  it('converts #FF0000 to rgba red', () => {
    expect(hexToRgbColor('#FF0000', 1)).toBe('rgba(255, 0, 0, 1)');
  });

  it('converts #000000 to rgba black', () => {
    expect(hexToRgbColor('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });

  it('converts #FFFFFF to rgba white', () => {
    expect(hexToRgbColor('#FFFFFF', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
  });

  it('works without # prefix', () => {
    expect(hexToRgbColor('00FF00', 1)).toBe('rgba(0, 255, 0, 1)');
  });

  it('accepts string opacity', () => {
    expect(hexToRgbColor('#FF0000', '0.8')).toBe('rgba(255, 0, 0, 0.8)');
  });
});
