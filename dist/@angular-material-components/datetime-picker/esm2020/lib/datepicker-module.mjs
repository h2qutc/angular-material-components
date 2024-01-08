import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { NgxMatCalendar, NgxMatCalendarHeader } from './calendar';
import { NgxMatCalendarBody } from './calendar-body';
import { NgxMatDateRangeInput } from './date-range-input';
import { NgxMatEndDate, NgxMatStartDate } from './date-range-input-parts';
import { NgxMatDateRangePicker } from './date-range-picker';
import { NgxMatDatetimepicker } from './datepicker';
import { NgxMatDatepickerActions, NgxMatDatepickerApply, NgxMatDatepickerCancel } from './datepicker-actions';
import { NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, NgxMatDatepickerContent, } from './datepicker-base';
import { NgxMatDatepickerInput } from './datepicker-input';
import { NgxMatDatepickerIntl } from './datepicker-intl';
import { NgxMatDatepickerToggleIcon, NgxMatDatepickerToggle } from './datepicker-toggle';
import { NgxMatMonthView } from './month-view';
import { NgxMatMultiYearView } from './multi-year-view';
import { NgxMatYearView } from './year-view';
import { NgxMatTimepickerModule } from './timepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
export class NgxMatDatetimePickerModule {
}
/** @nocollapse */ NgxMatDatetimePickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
/** @nocollapse */ NgxMatDatetimePickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimePickerModule, declarations: [NgxMatCalendar,
        NgxMatCalendarBody,
        NgxMatDatetimepicker,
        NgxMatDatepickerContent,
        NgxMatDatepickerInput,
        NgxMatDatepickerToggle,
        NgxMatDatepickerToggleIcon,
        NgxMatMonthView,
        NgxMatYearView,
        NgxMatMultiYearView,
        NgxMatCalendarHeader,
        NgxMatDateRangeInput,
        NgxMatStartDate,
        NgxMatEndDate,
        NgxMatDateRangePicker,
        NgxMatDatepickerActions,
        NgxMatDatepickerCancel,
        NgxMatDatepickerApply], imports: [CommonModule,
        MatButtonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatCommonModule,
        NgxMatTimepickerModule,
        FormsModule,
        ReactiveFormsModule], exports: [CdkScrollableModule,
        NgxMatCalendar,
        NgxMatCalendarBody,
        NgxMatDatetimepicker,
        NgxMatDatepickerContent,
        NgxMatDatepickerInput,
        NgxMatDatepickerToggle,
        NgxMatDatepickerToggleIcon,
        NgxMatMonthView,
        NgxMatYearView,
        NgxMatMultiYearView,
        NgxMatCalendarHeader,
        NgxMatDateRangeInput,
        NgxMatStartDate,
        NgxMatEndDate,
        NgxMatDateRangePicker,
        NgxMatDatepickerActions,
        NgxMatDatepickerCancel,
        NgxMatDatepickerApply] });
/** @nocollapse */ NgxMatDatetimePickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimePickerModule, providers: [NgxMatDatepickerIntl, NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER], imports: [CommonModule,
        MatButtonModule,
        OverlayModule,
        A11yModule,
        PortalModule,
        MatCommonModule,
        NgxMatTimepickerModule,
        FormsModule,
        ReactiveFormsModule, CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatButtonModule,
                        OverlayModule,
                        A11yModule,
                        PortalModule,
                        MatCommonModule,
                        NgxMatTimepickerModule,
                        FormsModule,
                        ReactiveFormsModule
                    ],
                    exports: [
                        CdkScrollableModule,
                        NgxMatCalendar,
                        NgxMatCalendarBody,
                        NgxMatDatetimepicker,
                        NgxMatDatepickerContent,
                        NgxMatDatepickerInput,
                        NgxMatDatepickerToggle,
                        NgxMatDatepickerToggleIcon,
                        NgxMatMonthView,
                        NgxMatYearView,
                        NgxMatMultiYearView,
                        NgxMatCalendarHeader,
                        NgxMatDateRangeInput,
                        NgxMatStartDate,
                        NgxMatEndDate,
                        NgxMatDateRangePicker,
                        NgxMatDatepickerActions,
                        NgxMatDatepickerCancel,
                        NgxMatDatepickerApply,
                    ],
                    declarations: [
                        NgxMatCalendar,
                        NgxMatCalendarBody,
                        NgxMatDatetimepicker,
                        NgxMatDatepickerContent,
                        NgxMatDatepickerInput,
                        NgxMatDatepickerToggle,
                        NgxMatDatepickerToggleIcon,
                        NgxMatMonthView,
                        NgxMatYearView,
                        NgxMatMultiYearView,
                        NgxMatCalendarHeader,
                        NgxMatDateRangeInput,
                        NgxMatStartDate,
                        NgxMatEndDate,
                        NgxMatDateRangePicker,
                        NgxMatDatepickerActions,
                        NgxMatDatepickerCancel,
                        NgxMatDatepickerApply,
                    ],
                    providers: [NgxMatDatepickerIntl, NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLHFCQUFxQixFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUcsT0FBTyxFQUNMLG1EQUFtRCxFQUNuRCx1QkFBdUIsR0FD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d0JBQ3JCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCO3dCQUN0QixxQkFBcUI7cUJBQ3RCO29CQUNELFNBQVMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLG1EQUFtRCxDQUFDO2lCQUN2RiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEExMXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDZGtTY3JvbGxhYmxlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQgeyBNYXRDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IE5neE1hdENhbGVuZGFyLCBOZ3hNYXRDYWxlbmRhckhlYWRlciB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgTmd4TWF0Q2FsZW5kYXJCb2R5IH0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7IE5neE1hdERhdGVSYW5nZUlucHV0IH0gZnJvbSAnLi9kYXRlLXJhbmdlLWlucHV0JztcbmltcG9ydCB7IE5neE1hdEVuZERhdGUsIE5neE1hdFN0YXJ0RGF0ZSB9IGZyb20gJy4vZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cyc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlUmFuZ2VQaWNrZXIgfSBmcm9tICcuL2RhdGUtcmFuZ2UtcGlja2VyJztcbmltcG9ydCB7IE5neE1hdERhdGV0aW1lcGlja2VyIH0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7IE5neE1hdERhdGVwaWNrZXJBY3Rpb25zLCBOZ3hNYXREYXRlcGlja2VyQXBwbHksIE5neE1hdERhdGVwaWNrZXJDYW5jZWwgfSBmcm9tICcuL2RhdGVwaWNrZXItYWN0aW9ucyc7XG5pbXBvcnQge1xuICBOR1hfTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIsXG4gIE5neE1hdERhdGVwaWNrZXJDb250ZW50LFxufSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlcGlja2VySW5wdXQgfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZXBpY2tlckludGwgfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlcGlja2VyVG9nZ2xlSWNvbiwgTmd4TWF0RGF0ZXBpY2tlclRvZ2dsZSB9IGZyb20gJy4vZGF0ZXBpY2tlci10b2dnbGUnO1xuaW1wb3J0IHsgTmd4TWF0TW9udGhWaWV3IH0gZnJvbSAnLi9tb250aC12aWV3JztcbmltcG9ydCB7IE5neE1hdE11bHRpWWVhclZpZXcgfSBmcm9tICcuL211bHRpLXllYXItdmlldyc7XG5pbXBvcnQgeyBOZ3hNYXRZZWFyVmlldyB9IGZyb20gJy4veWVhci12aWV3JztcbmltcG9ydCB7IE5neE1hdFRpbWVwaWNrZXJNb2R1bGUgfSBmcm9tICcuL3RpbWVwaWNrZXIubW9kdWxlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBOZ3hNYXRUaW1lcGlja2VyTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgTmd4TWF0Q2FsZW5kYXIsXG4gICAgTmd4TWF0Q2FsZW5kYXJCb2R5LFxuICAgIE5neE1hdERhdGV0aW1lcGlja2VyLFxuICAgIE5neE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE5neE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBOZ3hNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE5neE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE5neE1hdE1vbnRoVmlldyxcbiAgICBOZ3hNYXRZZWFyVmlldyxcbiAgICBOZ3hNYXRNdWx0aVllYXJWaWV3LFxuICAgIE5neE1hdENhbGVuZGFySGVhZGVyLFxuICAgIE5neE1hdERhdGVSYW5nZUlucHV0LFxuICAgIE5neE1hdFN0YXJ0RGF0ZSxcbiAgICBOZ3hNYXRFbmREYXRlLFxuICAgIE5neE1hdERhdGVSYW5nZVBpY2tlcixcbiAgICBOZ3hNYXREYXRlcGlja2VyQWN0aW9ucyxcbiAgICBOZ3hNYXREYXRlcGlja2VyQ2FuY2VsLFxuICAgIE5neE1hdERhdGVwaWNrZXJBcHBseSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmd4TWF0Q2FsZW5kYXIsXG4gICAgTmd4TWF0Q2FsZW5kYXJCb2R5LFxuICAgIE5neE1hdERhdGV0aW1lcGlja2VyLFxuICAgIE5neE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgIE5neE1hdERhdGVwaWNrZXJJbnB1dCxcbiAgICBOZ3hNYXREYXRlcGlja2VyVG9nZ2xlLFxuICAgIE5neE1hdERhdGVwaWNrZXJUb2dnbGVJY29uLFxuICAgIE5neE1hdE1vbnRoVmlldyxcbiAgICBOZ3hNYXRZZWFyVmlldyxcbiAgICBOZ3hNYXRNdWx0aVllYXJWaWV3LFxuICAgIE5neE1hdENhbGVuZGFySGVhZGVyLFxuICAgIE5neE1hdERhdGVSYW5nZUlucHV0LFxuICAgIE5neE1hdFN0YXJ0RGF0ZSxcbiAgICBOZ3hNYXRFbmREYXRlLFxuICAgIE5neE1hdERhdGVSYW5nZVBpY2tlcixcbiAgICBOZ3hNYXREYXRlcGlja2VyQWN0aW9ucyxcbiAgICBOZ3hNYXREYXRlcGlja2VyQ2FuY2VsLFxuICAgIE5neE1hdERhdGVwaWNrZXJBcHBseSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbTmd4TWF0RGF0ZXBpY2tlckludGwsIE5HWF9NQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUl0sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGV0aW1lUGlja2VyTW9kdWxlIHsgfVxuIl19