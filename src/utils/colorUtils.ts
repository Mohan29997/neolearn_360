// import { alpha } from '@mui/material/styles';
// import { PaletteOptions } from '@mui/material';

// /**
//  * Converts a hex color string to an RGB channel string ("r g b").
//  *
//  * @param hex - The hex color string (e.g. "#C8FAD6", "#FFF", "#FF00FFAA").
//  * @returns The RGB channel string (e.g. "200 250 214").
//  * @throws {Error} If the input is not a valid hex color.
//  */
// export function hexToRgbChannel(hex: string) {
//   let cleaned = hex.replace(/^#/, '');

//   if (cleaned.length === 3) {
//     cleaned = cleaned
//       .split('')
//       .map((c) => c + c)
//       .join('');
//   }
//   if (cleaned.length === 4) {
//     cleaned = cleaned
//       .split('')
//       .map((c) => c + c)
//       .join('');
//   }

//   if (cleaned.length !== 6 && cleaned.length !== 8) {
//     throw new Error(`Invalid hex color: ${hex}`);
//   }

//   const r = parseInt(cleaned.substring(0, 2), 16);
//   const g = parseInt(cleaned.substring(2, 4), 16);
//   const b = parseInt(cleaned.substring(4, 6), 16);

//   return `${r} ${g} ${b}`;
// }

// export function extendPaletteWithChannels(palette: PaletteOptions) {
//   const result = { ...palette };

//   Object.entries(palette).forEach(([k, v]) => {
//     if (typeof v === 'string' && v.startsWith('#')) {
//       result[`${k}Channel`] = hexToRgbChannel(v);
//     } else if (typeof v === 'object' && v !== null) {
//       result[k] = extendPaletteWithChannels(v);
//     }
//   });

//   return result;
// }

// export function withAlpha(color: string, opacity: number) {
//   // Case 1: normal color (hex, rgb, hsl…)
//   if (/^#|rgb|hsl|color/i.test(color)) {
//     return alpha(color, opacity);
//   }

//   // Case 2: CSS Var: var(--mui-palette-xxx) or var(--palette-xxx, #hex)
//   if (color.startsWith('var(')) {
//     // inject "Channel" *before the closing parenthesis of the var name only*
//     return color.replace(/(--[a-zA-Z0-9-]+)(.*)\)/, `$1Channel$2)`).replace(/^var\((.+)\)$/, `rgba(var($1) / ${opacity})`);
//   }

//   // Fallback
//   return color;
// }

import { alpha } from '@mui/material/styles';
import type { PaletteOptions, PaletteColorOptions } from '@mui/material';

/**
 * Converts a hex color string to an RGB channel string ("r g b").
 *
 * @param hex - The hex color string (e.g. "#C8FAD6", "#FFF", "#FF00FFAA").
 * @returns The RGB channel string (e.g. "200 250 214").
 * @throws {Error} If the input is not a valid hex color.
 */
export function hexToRgbChannel(hex: string): string {
    let cleaned = hex.replace(/^#/, '');

    if (cleaned.length === 3 || cleaned.length === 4) {
        cleaned = cleaned
            .split('')
            .map((c) => c + c)
            .join('');
    }

    if (cleaned.length !== 6 && cleaned.length !== 8) {
        throw new Error(`Invalid hex color: ${hex}`);
    }

    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);

    return `${r} ${g} ${b}`;
}

type PaletteValue = string | PaletteColorOptions | Record<string, unknown>;
type ExtendedPalette<T> = T & Record<string, any>;

/**
 * Recursively extends the palette by adding "*Channel" properties
 * next to each hex color.
 */
export function extendPaletteWithChannels<T extends PaletteOptions>(
    palette: T
): ExtendedPalette<T> {
    const result: any = { ...palette };

    Object.entries(palette).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('#')) {
            // example: primary → primaryChannel
            result[`${key}Channel`] = hexToRgbChannel(value);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = extendPaletteWithChannels(value as any);
        }
    });

    return result;
}

/**
 * Applies opacity to a color, including CSS variable colors.
 *
 * @param color The input color (hex, rgb, hsl, or CSS var)
 * @param opacity Number between 0 and 1
 */
export function withAlpha(color: string, opacity: number): string {
    // Case 1: Normal color (#rgb, rgb(), hsl(), color-mix)
    if (/^#|rgb|hsl|color/i.test(color)) {
        return alpha(color, opacity);
    }

    // Case 2: CSS variable -- converting:
    //   var(--mui-palette-primary-main)
    // into:
    //   rgba(var(--mui-palette-primary-mainChannel) / 0.5)
    if (color.startsWith('var(')) {
        return color
            .replace(/(--[a-zA-Z0-9-]+)([^)]*)\)/, `$1Channel$2)`)
            .replace(/^var\((.+)\)$/, `rgba(var($1) / ${opacity})`);
    }

    // fallback unchanged
    return color;
}
