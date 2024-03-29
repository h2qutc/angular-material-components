import { A11yModule } from "@angular/cdk/a11y";
import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { CdkScrollableModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCommonModule } from "@angular/material/core";
import {
  NgxMatCalendarComponent,
  NgxMatCalendarHeaderComponent,
} from "./components/calendar/calendar";
import { NgxMatCalendarBodyComponent } from "./components/calendar-body/calendar-body.component";
import { NgxMatDateRangeInput } from "./components/date-range-input/date-range-input";
import {
  NgxMatEndDate,
  NgxMatStartDate,
} from "./directives/date-range-input-parts";
import { NgxMatDateRangePicker } from "./directives/date-range-picker";
import { NgxMatDatetimepicker } from "./components/datepicker/datepicker";
import {
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
} from "./components/datepicker-actions/datepicker-actions";
import {
  NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  NgxMatDatepickerContentComponent,
} from "./components/datepicker-content/datepicker-base.component";
import { NgxMatDatepickerInput } from "./directives/datepicker-input";
import { NgxMatDatepickerIntl } from "./utils/datepicker-intl";
import {
  NgxMatDatepickerToggleIcon,
  NgxMatDatepickerToggle,
} from "./components/datepicker-toggle/datepicker-toggle";
import { NgxMatMonthViewComponent } from "./components/month-view/month-view.component";
import { NgxMatMultiYearView } from "./components/multi-year-view/multi-year-view";
import { NgxMatYearView } from "./components/year-view/year-view";
import { NgxMatTimepickerModule } from "./timepicker.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    MatCommonModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CdkScrollableModule,
    NgxMatCalendarComponent,
    NgxMatCalendarBodyComponent,
    NgxMatDatetimepicker,
    NgxMatDatepickerContentComponent,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatepickerToggleIcon,
    NgxMatMonthViewComponent,
    NgxMatYearView,
    NgxMatMultiYearView,
    NgxMatCalendarHeaderComponent,
    NgxMatDateRangeInput,
    NgxMatStartDate,
    NgxMatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    NgxMatDatepickerCancel,
    NgxMatDatepickerApply,
  ],
  declarations: [
    NgxMatCalendarComponent,
    NgxMatCalendarBodyComponent,
    NgxMatDatetimepicker,
    NgxMatDatepickerContentComponent,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatepickerToggleIcon,
    NgxMatMonthViewComponent,
    NgxMatYearView,
    NgxMatMultiYearView,
    NgxMatCalendarHeaderComponent,
    NgxMatDateRangeInput,
    NgxMatStartDate,
    NgxMatEndDate,
    NgxMatDateRangePicker,
    NgxMatDatepickerActions,
    NgxMatDatepickerCancel,
    NgxMatDatepickerApply,
  ],
  providers: [
    NgxMatDatepickerIntl,
    NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  ],
})
export class NgxMatDatetimePickerModule {}
