import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NgxMatDatepickerBase } from './datepicker-base';
import { NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER } from './date-range-selection-strategy';
import * as i0 from "@angular/core";
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the date range picker popup/dialog. */
export class NgxMatDateRangePicker extends NgxMatDatepickerBase {
    _forwardContentValues(instance) {
        super._forwardContentValues(instance);
        const input = this.datepickerInput;
        if (input) {
            instance.comparisonStart = input.comparisonStart;
            instance.comparisonEnd = input.comparisonEnd;
            instance.startDateAccessibleName = input._getStartDateAccessibleName();
            instance.endDateAccessibleName = input._getEndDateAccessibleName();
        }
    }
}
/** @nocollapse */ NgxMatDateRangePicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateRangePicker, deps: null, target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatDateRangePicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDateRangePicker, selector: "ngx-mat-date-range-picker", providers: [
        NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
        NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
        { provide: NgxMatDatepickerBase, useExisting: NgxMatDateRangePicker },
    ], exportAs: ["ngxMatDateRangePicker"], usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateRangePicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-mat-date-range-picker',
                    template: '',
                    exportAs: 'ngxMatDateRangePicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
                        NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
                        { provide: NgxMatDatepickerBase, useExisting: NgxMatDateRangePicker },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9kYXRlLXJhbmdlLXBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxvQkFBb0IsRUFBbUQsTUFBTSxtQkFBbUIsQ0FBQztBQUN6RyxPQUFPLEVBQUMsMkNBQTJDLEVBQWUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRyxPQUFPLEVBQUMsd0NBQXdDLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7QUFhekYsOEZBQThGO0FBQzlGLDZGQUE2RjtBQUM3RiwrRUFBK0U7QUFDL0UsNkVBQTZFO0FBYTdFLE1BQU0sT0FBTyxxQkFBeUIsU0FBUSxvQkFJN0M7SUFDb0IscUJBQXFCLENBQUMsUUFBcUQ7UUFDNUYsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFbkMsSUFBSSxLQUFLLEVBQUU7WUFDVCxRQUFRLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDakQsUUFBUSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQzdDLFFBQVEsQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztZQUN2RSxRQUFRLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDcEU7SUFDSCxDQUFDOztxSUFoQlUscUJBQXFCO3lIQUFyQixxQkFBcUIsb0RBTnJCO1FBQ1QsMkNBQTJDO1FBQzNDLHdDQUF3QztRQUN4QyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUM7S0FDcEUsc0ZBUlMsRUFBRTsyRkFVRCxxQkFBcUI7a0JBWmpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxTQUFTLEVBQUU7d0JBQ1QsMkNBQTJDO3dCQUMzQyx3Q0FBd0M7d0JBQ3hDLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsdUJBQXVCLEVBQUM7cUJBQ3BFO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05neE1hdERhdGVwaWNrZXJCYXNlLCBOZ3hNYXREYXRlcGlja2VyQ29udGVudCwgTmd4TWF0RGF0ZXBpY2tlckNvbnRyb2x9IGZyb20gJy4vZGF0ZXBpY2tlci1iYXNlJztcbmltcG9ydCB7TkdYX01BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9QUk9WSURFUiwgTmd4RGF0ZVJhbmdlfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7TkdYX01BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUn0gZnJvbSAnLi9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneSc7XG5cbi8qKlxuICogSW5wdXQgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZSByYW5nZSBwaWNrZXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmd4TWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4gZXh0ZW5kcyBOZ3hNYXREYXRlcGlja2VyQ29udHJvbDxEPiB7XG4gIF9nZXRFbmREYXRlQWNjZXNzaWJsZU5hbWUoKTogc3RyaW5nIHwgbnVsbDtcbiAgX2dldFN0YXJ0RGF0ZUFjY2Vzc2libGVOYW1lKCk6IHN0cmluZyB8IG51bGw7XG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG4gIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xufVxuXG4vLyBUT0RPKG1tYWxlcmJhKTogV2UgdXNlIGEgY29tcG9uZW50IGluc3RlYWQgb2YgYSBkaXJlY3RpdmUgaGVyZSBzbyB0aGUgdXNlciBjYW4gdXNlIGltcGxpY2l0XG4vLyB0ZW1wbGF0ZSByZWZlcmVuY2UgdmFyaWFibGVzIChlLmcuICNkIHZzICNkPVwibWF0RGF0ZVJhbmdlUGlja2VyXCIpLiBXZSBjYW4gY2hhbmdlIHRoaXMgdG8gYVxuLy8gZGlyZWN0aXZlIGlmIGFuZ3VsYXIgYWRkcyBzdXBwb3J0IGZvciBgZXhwb3J0QXM6ICckaW1wbGljaXQnYCBvbiBkaXJlY3RpdmVzLlxuLyoqIENvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIGRhdGUgcmFuZ2UgcGlja2VyIHBvcHVwL2RpYWxvZy4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1tYXQtZGF0ZS1yYW5nZS1waWNrZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIGV4cG9ydEFzOiAnbmd4TWF0RGF0ZVJhbmdlUGlja2VyJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHByb3ZpZGVyczogW1xuICAgIE5HWF9NQVRfUkFOR0VfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVIsXG4gICAgTkdYX01BVF9DQUxFTkRBUl9SQU5HRV9TVFJBVEVHWV9QUk9WSURFUixcbiAgICB7cHJvdmlkZTogTmd4TWF0RGF0ZXBpY2tlckJhc2UsIHVzZUV4aXN0aW5nOiBOZ3hNYXREYXRlUmFuZ2VQaWNrZXJ9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hNYXREYXRlUmFuZ2VQaWNrZXI8RD4gZXh0ZW5kcyBOZ3hNYXREYXRlcGlja2VyQmFzZTxcbiAgTmd4TWF0RGF0ZVJhbmdlUGlja2VySW5wdXQ8RD4sXG4gIE5neERhdGVSYW5nZTxEPixcbiAgRFxuPiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE5neE1hdERhdGVwaWNrZXJDb250ZW50PE5neERhdGVSYW5nZTxEPiwgRD4pIHtcbiAgICBzdXBlci5fZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2UpO1xuXG4gICAgY29uc3QgaW5wdXQgPSB0aGlzLmRhdGVwaWNrZXJJbnB1dDtcblxuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvblN0YXJ0ID0gaW5wdXQuY29tcGFyaXNvblN0YXJ0O1xuICAgICAgaW5zdGFuY2UuY29tcGFyaXNvbkVuZCA9IGlucHV0LmNvbXBhcmlzb25FbmQ7XG4gICAgICBpbnN0YW5jZS5zdGFydERhdGVBY2Nlc3NpYmxlTmFtZSA9IGlucHV0Ll9nZXRTdGFydERhdGVBY2Nlc3NpYmxlTmFtZSgpO1xuICAgICAgaW5zdGFuY2UuZW5kRGF0ZUFjY2Vzc2libGVOYW1lID0gaW5wdXQuX2dldEVuZERhdGVBY2Nlc3NpYmxlTmFtZSgpO1xuICAgIH1cbiAgfVxufVxuIl19