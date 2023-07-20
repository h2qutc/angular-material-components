import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NgxMatCalendar, NgxMatCalendarHeader } from './calendar';
import { NgxMatCalendarBody } from './calendar-body';
import { DefaultNgxMatCalendarRangeStrategy, NGX_MAT_DATE_RANGE_SELECTION_STRATEGY } from './date-range-selection-strategy';
import { NgxMatDatetimeInput } from './datetime-input';
import { NgxMatDatetimeContent, NgxMatDatetimePicker } from './datetime-picker.component';
import { NgxMatMonthView } from './month-view';
import { NgxMatMultiYearView } from './multi-year-view';
import { NgxMatTimepickerModule } from './timepicker.module';
import { NgxMatYearView } from './year-view';

@NgModule({
   imports: [
      CommonModule,
      MatDatepickerModule,
      MatDialogModule,
      PortalModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
      MatInputModule,
      NgxMatTimepickerModule
   ],
   exports: [
      NgxMatDatetimePicker,
      NgxMatDatetimeInput,
      NgxMatCalendar,
      NgxMatMonthView,
      NgxMatCalendarBody,
      NgxMatYearView,
      NgxMatMultiYearView,
      NgxMatCalendarHeader
   ],
   declarations: [
      NgxMatDatetimePicker,
      NgxMatDatetimeContent,
      NgxMatDatetimeInput,
      NgxMatCalendar,
      NgxMatMonthView,
      NgxMatCalendarBody,
      NgxMatYearView,
      NgxMatMultiYearView,
      NgxMatCalendarHeader
   ],
   providers: [
      MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
      {
         provide: NGX_MAT_DATE_RANGE_SELECTION_STRATEGY,
         useClass: DefaultNgxMatCalendarRangeStrategy
      }
   ]
})
export class NgxMatDatetimePickerModule { }
