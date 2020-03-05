import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatCalendar, NgxMatCalendarHeader } from './ngx-mat-calendar';
import { NgxMatDatetimeInput } from './ngx-mat-datetime-input';
import { NgxMatDatetimeContent, NgxMatDatetimePicker } from './ngx-mat-datetime-picker.component';
import { NgxMatMonthView } from './ngx-mat-month-view';
import { NgxMatMultiYearView } from './ngx-mat-multi-year-view';
import { NgxMatTimepickerModule } from './ngx-mat-timepicker.module';
import { NgxMatYearView } from './ngx-mat-year-view';
import { NgxMatNativeDateModule } from 'ngx-mat-core';

@NgModule({
  imports: [
    CommonModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    PortalModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    NgxMatTimepickerModule,
  ],
  exports: [
    NgxMatDatetimePicker,
    NgxMatDatetimeInput,
    NgxMatCalendar,
    NgxMatMonthView,
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
    NgxMatYearView,
    NgxMatMultiYearView,
    NgxMatCalendarHeader
  ],
  entryComponents: [
    NgxMatDatetimeContent,
    NgxMatCalendarHeader
  ],
  providers: [
    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ]
})
export class NgxMatDatetimePickerModule { }
