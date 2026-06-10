import dayjs from 'dayjs';

/** Breakdown of age in years, months, and days with a donation eligibility flag. */
export interface YearsAndMonthsProps {
    value: string;
    years: number;
    months: number;
    days: number;
    isCanDonate: boolean;
}
/**
 * Returns the age in whole years from a date-of-birth string.
 * @param dob - ISO date string (e.g. `"1995-06-15"`)
 */
export const calculateAge = (dob: string): number => {
    const today = dayjs();
    const birthDate = dayjs(dob);
    return today.diff(birthDate, 'year');
};

// export const calculateYearsAndMonths = (dob: string): YearsAndMonthsProps => {
//     const today = dayjs();
//     const birthDate = dayjs(dob);

//     const totalMonths = today.diff(birthDate, 'month');
//     const years = Math.floor(totalMonths / 12);
//     const months = totalMonths % 12;

//     return {
//         value: `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`,
//         years: today.diff(birthDate, 'year')
//     };
// };



/**
 * Returns a detailed age breakdown (years, months, days) and whether the
 * person is blood-donation eligible (age 18–65).
 * @param dob - ISO date string (e.g. `"1995-06-15"`)
 */
export const calculateYearsAndMonths = (dob: string): YearsAndMonthsProps => {
    const today = dayjs();
    const birthDate = dayjs(dob);

    let years = today.diff(birthDate, 'year');
    let months = today.diff(birthDate.add(years, 'year'), 'month');
    let days = today.diff(birthDate.add(years, 'year').add(months, 'month'), 'day');

    const value = `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}, and ${days} day${days !== 1 ? 's' : ''}`;

    const isCanDonate = years >= 18 && years <= 65;

    return {
        value,
        years,
        months,
        days,
        isCanDonate,
    };
};

