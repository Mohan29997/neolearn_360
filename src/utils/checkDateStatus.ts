/**
 * Classifies a date string relative to today.
 *
 * @param selectedDateString - ISO date string to evaluate
 * @returns
 *   - `status`: `"expired"` | `"today"` | `"upcoming"`
 *   - `expire`: `true` if the date is in the past
 *   - `remainDays`: days remaining (0 for expired/today, positive integer for upcoming)
 *
 * @example
 * checkDateStatus("2025-01-01") // { status: "expired", expire: true, remainDays: 0 }
 * checkDateStatus("2099-12-31") // { status: "upcoming", expire: false, remainDays: 27208 }
 */
export function checkDateStatus(selectedDateString: string): { status: "expired" | "today" | "upcoming", expire: true | false, remainDays: string | number } {
    const selectedDate = new Date(selectedDateString);
    const currentDate = new Date();

    // Reset time part to compare only dates
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < currentDate.getTime()) {
        return { status: "expired", expire: true, remainDays: 0 };
    } else if (selectedDate.getTime() === currentDate.getTime()) {
        return { status: "today", expire: false, remainDays: 0 };
    } else {
        const diffInTime = selectedDate.getTime() - currentDate.getTime();
        const remainingDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        return { status: "upcoming", expire: false, remainDays: remainingDays };
    }
}
