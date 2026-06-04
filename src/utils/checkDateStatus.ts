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
