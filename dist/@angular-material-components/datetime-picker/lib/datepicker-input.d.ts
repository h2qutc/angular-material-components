import { ElementRef, OnDestroy } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxDateSelectionModelChange } from './date-selection-model';
import { NgxMatDatepickerControl, NgxMatDatepickerPanel } from './datepicker-base';
import { _NgxMatFormFieldPartial, NgxDateFilterFn, NgxMatDatepickerInputBase } from './datepicker-input-base';
import { NgxMatDateFormats } from './core/date-formats';
import * as i0 from "@angular/core";
/** @docs-private */
export declare const NGX_MAT_DATEPICKER_VALUE_ACCESSOR: any;
/** @docs-private */
export declare const NGX_MAT_DATEPICKER_VALIDATORS: any;
/** Directive used to connect an input to a MatDatepicker. */
export declare class NgxMatDatepickerInput<D> extends NgxMatDatepickerInputBase<D | null, D> implements NgxMatDatepickerControl<D | null>, OnDestroy {
    private _formField?;
    private _closedSubscription;
    /** The datepicker that this input is associated with. */
    set ngxMatDatetimePicker(datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, D | null, D>);
    _datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, D | null, D>;
    /** The minimum valid date. */
    get min(): D | null;
    set min(value: D | null);
    private _min;
    /** The maximum valid date. */
    get max(): D | null;
    set max(value: D | null);
    private _max;
    /** Function that can be used to filter out dates within the datepicker. */
    get dateFilter(): NgxDateFilterFn<D | null>;
    set dateFilter(value: NgxDateFilterFn<D | null>);
    private _dateFilter;
    /** The combined form control validator for this input. */
    protected _validator: ValidatorFn | null;
    constructor(elementRef: ElementRef<HTMLInputElement>, dateAdapter: NgxMatDateAdapter<D>, dateFormats: NgxMatDateFormats, _formField?: _NgxMatFormFieldPartial);
    /**
     * Gets the element that the datepicker popup should be connected to.
     * @return The element to connect the popup to.
     */
    getConnectedOverlayOrigin(): ElementRef;
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId(): string | null;
    /** Returns the palette used by the input's form field, if any. */
    getThemePalette(): ThemePalette;
    /** Gets the value at which the calendar should start. */
    getStartValue(): D | null;
    ngOnDestroy(): void;
    /** Opens the associated datepicker. */
    protected _openPopup(): void;
    protected _getValueFromModel(modelValue: D | null): D | null;
    protected _assignValueToModel(value: D | null): void;
    /** Gets the input's minimum date. */
    _getMinDate(): D;
    /** Gets the input's maximum date. */
    _getMaxDate(): D;
    /** Gets the input's date filtering function. */
    protected _getDateFilter(): NgxDateFilterFn<D>;
    protected _shouldHandleChangeEvent(event: NgxDateSelectionModelChange<D>): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerInput<any>, [null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDatepickerInput<any>, "input[ngxMatDatetimePicker]", ["ngxMatDatepickerInput"], { "ngxMatDatetimePicker": "ngxMatDatetimePicker"; "min": "min"; "max": "max"; "dateFilter": "matDatepickerFilter"; }, {}, never, never, false, never>;
}
