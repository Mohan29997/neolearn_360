import dayjs from 'dayjs';

// export interface YearsAndMonthsProps { value: string, years: number }
export interface YearsAndMonthsProps {
    value: string;
    years: number;
    months: number;
    days: number;
    isCanDonate: boolean;
}
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

