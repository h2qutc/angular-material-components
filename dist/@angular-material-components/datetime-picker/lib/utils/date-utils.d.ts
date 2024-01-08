export declare const LIMIT_TIMES: {
    minHour: number;
    maxHour: number;
    minMinute: number;
    maxMinute: number;
    minSecond: number;
    maxSecond: number;
    meridian: number;
};
export declare const MERIDIANS: {
    AM: string;
    PM: string;
};
export declare const DEFAULT_STEP = 1;
export declare const NUMERIC_REGEX: RegExp;
export declare const PATTERN_INPUT_HOUR: RegExp;
export declare const PATTERN_INPUT_MINUTE: RegExp;
export declare const PATTERN_INPUT_SECOND: RegExp;
export declare function formatTwoDigitTimeValue(val: number): string;
export declare function createMissingDateImplError(provider: string): Error;
/** Formats a range of years. */
export declare function formatYearRange(start: string, end: string): string;
