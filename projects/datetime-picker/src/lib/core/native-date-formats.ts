import { NgxMatDateFormats } from './date-formats';


const DEFAULT_DATE_INPUT = {
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"
}

export const NGX_MAT_NATIVE_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: DEFAULT_DATE_INPUT,
  },
  display: {
    dateInput: DEFAULT_DATE_INPUT,
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
