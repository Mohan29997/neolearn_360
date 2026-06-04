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
