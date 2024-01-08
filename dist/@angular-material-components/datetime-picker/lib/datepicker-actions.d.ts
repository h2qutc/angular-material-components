import { AfterViewInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { NgxMatDatepickerBase, NgxMatDatepickerControl } from './datepicker-base';
import * as i0 from "@angular/core";
/** Button that will close the datepicker and assign the current selection to the data model. */
export declare class NgxMatDatepickerApply {
    private _datepicker;
    constructor(_datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>);
    _applySelection(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerApply, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDatepickerApply, "[ngxMatDatepickerApply], [ngxMatDateRangePickerApply]", never, {}, {}, never, never, false, never>;
}
/** Button that will close the datepicker and discard the current selection. */
export declare class NgxMatDatepickerCancel {
    _datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>;
    constructor(_datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerCancel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDatepickerCancel, "[ngxMatDatepickerCancel], [ngxMatDateRangePickerCancel]", never, {}, {}, never, never, false, never>;
}
/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
export declare class NgxMatDatepickerActions implements AfterViewInit, OnDestroy {
    private _datepicker;
    private _viewContainerRef;
    _template: TemplateRef<unknown>;
    private _portal;
    constructor(_datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>, _viewContainerRef: ViewContainerRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatDatepickerActions, "ngx-mat-datepicker-actions, ngx-mat-date-range-picker-actions", never, {}, {}, never, ["*"], false, never>;
}
