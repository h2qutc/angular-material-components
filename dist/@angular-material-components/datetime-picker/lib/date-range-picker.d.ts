import { NgxMatDatepickerBase, NgxMatDatepickerContent, NgxMatDatepickerControl } from './datepicker-base';
import { NgxDateRange } from './date-selection-model';
import * as i0 from "@angular/core";
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
/** Component responsible for managing the date range picker popup/dialog. */
export declare class NgxMatDateRangePicker<D> extends NgxMatDatepickerBase<NgxMatDateRangePickerInput<D>, NgxDateRange<D>, D> {
    protected _forwardContentValues(instance: NgxMatDatepickerContent<NgxDateRange<D>, D>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDateRangePicker<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatDateRangePicker<any>, "ngx-mat-date-range-picker", ["ngxMatDateRangePicker"], {}, {}, never, never, false, never>;
}
