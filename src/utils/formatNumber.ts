/**
 * Formats a large number into a short human-readable string.
 *
 * @param value - The number to format (defaults to 0)
 * @returns Abbreviated string for values ≥ 1000; plain string otherwise
 *
 * @example
 * formatNumber(999)       // "999"
 * formatNumber(1500)      // "1.5K"
 * formatNumber(2300000)   // "2.3M"
 */
export const formatNumber = (value: number = 0): string => {
    if (value < 1000) return value.toString();

    const units = ["K", "M", "B", "T"];
    let unitIndex = -1;
    let num = value;

    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }

    return `${parseFloat(num.toFixed(1))}${units[unitIndex]}`;
};
