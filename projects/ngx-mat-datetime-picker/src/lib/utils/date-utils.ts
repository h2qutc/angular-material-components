export const LIMIT_TIMES = {
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    minSecond: 0,
    maxSecond: 59
}

export const DEFAULT_STEP = 1;
export const DEFAULT_HOUR_PLACEHOLDER = '';
export const DEFAULT_MINUTE_PLACEHOLDER = '';
export const DEFAULT_SECOND_PLACEHOLDER = '';

export const PATTERN_INPUT_HOUR = /^(2[0-3]|[0-1][0-9]|[0-9])$/;
export const PATTERN_INPUT_MINUTE = /^([0-5][0-9]|[0-9])$/;
export const PATTERN_INPUT_SECOND = /^([0-5][0-9]|[0-9])$/;

export function formatTwoDigitTimeValue(val: number) {
    const txt = val.toString();
    return txt.length > 1 ? txt : `0${txt}`;
}

export function createMissingDateImplError(provider: string) {
    return Error(
        `MatDatepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MatNativeDateModule, MatMomentDateModule, or provide a ` +
        `custom implementation.`);
}

/** Formats a range of years. */
export function formatYearRange(start: string, end: string): string {
    return `${start} \u2013 ${end}`;
}

