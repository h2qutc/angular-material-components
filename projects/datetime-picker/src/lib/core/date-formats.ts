import { InjectionToken } from "@angular/core";

export type NgxMatDateFormats = {
  parse: {
    dateInput: unknown;
  };
  display: {
    dateInput: unknown;
    monthLabel?: unknown;
    monthYearLabel: unknown;
    dateA11yLabel: unknown;
    monthYearA11yLabel: unknown;
  };
};

export const NGX_MAT_DATE_FORMATS = new InjectionToken<NgxMatDateFormats>(
  "ngx-mat-date-formats",
);
