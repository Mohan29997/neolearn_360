/**
 * Converts a hex color string to an `rgba()` CSS value with the given opacity.
 *
 * @param hex - Hex color string with or without `#` (e.g. `"#FF5733"` or `"FF5733"`)
 * @param opacity - Opacity value between 0 and 1
 * @returns CSS `rgba()` string (e.g. `"rgba(255, 87, 51, 0.5)"`)
 *
 * @example
 * hexToRgbColor('#8B1A2E', 0.15) // "rgba(139, 26, 46, 0.15)"
 */
export function hexToRgbColor(hex: string, opacity: number | string) {
    // Remove '#' if present
    hex = hex.replace('#', '');
    // Convert hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}