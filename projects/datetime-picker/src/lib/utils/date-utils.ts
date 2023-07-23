export const LIMIT_TIMES = {
    minHour: 0,
    maxHour: 24,
    minMinute: 0,
    maxMinute: 60,
    minSecond: 0,
    maxSecond: 60,
    meridian: 12
}

export const MERIDIANS = {
    AM: 'AM',
    PM: 'PM'
}

export const DEFAULT_STEP = 1;
export const NUMERIC_REGEX = /[^0-9]/g;

export const PATTERN_INPUT_HOUR = /^(2[0-3]|[0-1][0-9]|[0-9])$/;
export const PATTERN_INPUT_MINUTE = /^([0-5][0-9]|[0-9])$/;
export const PATTERN_INPUT_SECOND = /^([0-5][0-9]|[0-9])$/;

export function formatTwoDigitTimeValue(val: number) {
    const txt = val.toString();
    return txt.length > 1 ? txt : `0${txt}`;
}

export function createMissingDateImplError(provider: string) {
    return Error(
        `NgxMatDatetimePicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: NgxMatNativeDateModule, NgxMatMomentModule, or provide a ` +
        `custom implementation.`);
}

/** Formats a range of years. */
export function formatYearRange(start: string, end: string): string {
    return `${start} \u2013 ${end}`;
}

