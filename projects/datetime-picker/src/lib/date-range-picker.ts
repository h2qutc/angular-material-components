import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NgxMatDatepickerBase, NgxMatDatepickerContent, NgxMatDatepickerControl} from './datepicker-base';
import {NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER, NgxDateRange} from './date-selection-model';
import {NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER} from './date-range-selection-strategy';

/**
 * Input that can be associated with a date range picker.
 * @docs-private
 */
export interface NgxMatDateRangePickerInput<D> extends NgxMatDatepickerControl<D> {
  _getEndDateAccessibleName(): string | null;
  _getStartDateAccessibleName(): string | null;
  comparisonStart: D | null;
  comparisonEnd: D | null;
}

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the date range picker popup/dialog. */
@Component({
  selector: 'ngx-mat-date-range-picker',
  template: '',
  exportAs: 'ngxMatDateRangePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER,
    NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER,
    {provide: NgxMatDatepickerBase, useExisting: NgxMatDateRangePicker},
  ],
})
export class NgxMatDateRangePicker<D> extends NgxMatDatepickerBase<
  NgxMatDateRangePickerInput<D>,
  NgxDateRange<D>,
  D
> {
  protected override _forwardContentValues(instance: NgxMatDatepickerContent<NgxDateRange<D>, D>) {
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
