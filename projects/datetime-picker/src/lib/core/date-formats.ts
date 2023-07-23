import { InjectionToken } from '@angular/core';


export type NgxMatDateFormats = {
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

export const NGX_MAT_DATE_FORMATS = new InjectionToken<NgxMatDateFormats>('ngx-mat-date-formats');
