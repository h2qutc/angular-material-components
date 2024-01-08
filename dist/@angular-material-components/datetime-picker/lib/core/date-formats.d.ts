import { InjectionToken } from '@angular/core';
export declare type NgxMatDateFormats = {
    parse: {
        dateInput: any;
    };
    display: {
        dateInput: any;
        monthLabel?: any;
        monthYearLabel: any;
        dateA11yLabel: any;
        monthYearA11yLabel: any;
    };
};
export declare const NGX_MAT_DATE_FORMATS: InjectionToken<NgxMatDateFormats>;
