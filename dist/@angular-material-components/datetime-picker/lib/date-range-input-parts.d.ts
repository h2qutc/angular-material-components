import { Directionality } from '@angular/cdk/bidi';
import { DoCheck, ElementRef, InjectionToken, Injector, OnInit } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, ValidatorFn } from '@angular/forms';
import { CanUpdateErrorState, ErrorStateMatcher } from '@angular/material/core';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxMatDateFormats } from './core/date-formats';
import { NgxDateRange, NgxDateSelectionModelChange } from './date-selection-model';
import { NgxDateFilterFn, NgxMatDatepickerInputBase } from './datepicker-input-base';
import * as i0 from "@angular/core";
/** Parent component that should be wrapped around `MatStartDate` and `MatEndDate`. */
export interface NgxMatDateRangeInputParent<D> {
    id: string;
    min: D | null;
    max: D | null;
    dateFilter: NgxDateFilterFn<D>;
    rangePicker: {
        opened: boolean;
        id: string;
    };
    _startInput: NgxMatDateRangeInputPartBase<D>;
    _endInput: NgxMatDateRangeInputPartBase<D>;
    _groupDisabled: boolean;
    _handleChildValueChange(): void;
    _openDatepicker(): void;
}
/**
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 */
export declare const NGX_MAT_DATE_RANGE_INPUT_PARENT: InjectionToken<NgxMatDateRangeInputParent<unknown>>;
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
declare abstract class NgxMatDateRangeInputPartBase<D> extends NgxMatDatepickerInputBase<NgxDateRange<D>> implements OnInit, DoCheck {
    _rangeInput: NgxMatDateRangeInputParent<D>;
    _elementRef: ElementRef<HTMLInputElement>;
    _defaultErrorStateMatcher: ErrorStateMatcher;
    private _injector;
    _parentForm: NgForm;
    _parentFormGroup: FormGroupDirective;
    /**
     * Form control bound to this input part.
     * @docs-private
     */
    ngControl: NgControl;
    /** @docs-private */
    abstract updateErrorState(): void;
    protected abstract _validator: ValidatorFn | null;
    protected abstract _assignValueToModel(value: D | null): void;
    protected abstract _getValueFromModel(modelValue: NgxDateRange<D>): D | null;
    protected readonly _dir: Directionality;
    constructor(_rangeInput: NgxMatDateRangeInputParent<D>, _elementRef: ElementRef<HTMLInputElement>, _defaultErrorStateMatcher: ErrorStateMatcher, _injector: Injector, _parentForm: NgForm, _parentFormGroup: FormGroupDirective, dateAdapter: NgxMatDateAdapter<D>, dateFormats: NgxMatDateFormats);
    ngOnInit(): void;
    ngDoCheck(): void;
    /** Gets whether the input is empty. */
    isEmpty(): boolean;
    /** Gets the placeholder of the input. */
    _getPlaceholder(): string;
    /** Focuses the input. */
    focus(): void;
    /** Gets the value that should be used when mirroring the input's size. */
    getMirrorValue(): string;
    /** Handles `input` events on the input element. */
    _onInput(value: string): void;
    /** Opens the datepicker associated with the input. */
    protected _openPopup(): void;
    /** Gets the minimum date from the range input. */
    _getMinDate(): D;
    /** Gets the maximum date from the range input. */
    _getMaxDate(): D;
    /** Gets the date filter function from the range input. */
    protected _getDateFilter(): NgxDateFilterFn<D>;
    protected _parentDisabled(): boolean;
    protected _shouldHandleChangeEvent({ source }: NgxDateSelectionModelChange<NgxDateRange<D>>): boolean;
    protected _assignValueProgrammatically(value: D | null): void;
    /** return the ARIA accessible name of the input element */
    _getAccessibleName(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDateRangeInputPartBase<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDateRangeInputPartBase<any>, never, never, {}, {}, never, never, false, never>;
}
declare const _NgxMatDateRangeInputBase: import("@angular/material/core")._Constructor<CanUpdateErrorState> & import("@angular/material/core")._AbstractConstructor<CanUpdateErrorState> & typeof NgxMatDateRangeInputPartBase;
/** Input for entering the start date in a `mat-date-range-input`. */
export declare class NgxMatStartDate<D> extends _NgxMatDateRangeInputBase<D> implements CanUpdateErrorState {
    /** Validator that checks that the start date isn't after the end date. */
    private _startValidator;
    constructor(rangeInput: NgxMatDateRangeInputParent<D>, elementRef: ElementRef<HTMLInputElement>, defaultErrorStateMatcher: ErrorStateMatcher, injector: Injector, parentForm: NgForm, parentFormGroup: FormGroupDirective, dateAdapter: NgxMatDateAdapter<D>, dateFormats: NgxMatDateFormats);
    protected _validator: ValidatorFn;
    protected _getValueFromModel(modelValue: NgxDateRange<D>): D;
    protected _shouldHandleChangeEvent(change: NgxDateSelectionModelChange<NgxDateRange<D>>): boolean;
    protected _assignValueToModel(value: D | null): void;
    protected _formatValue(value: D | null): void;
    _onKeydown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatStartDate<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatStartDate<any>, "input[ngxMatStartDate]", never, { "errorStateMatcher": "errorStateMatcher"; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; }, never, never, false, never>;
}
/** Input for entering the end date in a `mat-date-range-input`. */
export declare class NgxMatEndDate<D> extends _NgxMatDateRangeInputBase<D> implements CanUpdateErrorState {
    /** Validator that checks that the end date isn't before the start date. */
    private _endValidator;
    constructor(rangeInput: NgxMatDateRangeInputParent<D>, elementRef: ElementRef<HTMLInputElement>, defaultErrorStateMatcher: ErrorStateMatcher, injector: Injector, parentForm: NgForm, parentFormGroup: FormGroupDirective, dateAdapter: NgxMatDateAdapter<D>, dateFormats: NgxMatDateFormats);
    protected _validator: ValidatorFn;
    protected _getValueFromModel(modelValue: NgxDateRange<D>): D;
    protected _shouldHandleChangeEvent(change: NgxDateSelectionModelChange<NgxDateRange<D>>): boolean;
    protected _assignValueToModel(value: D | null): void;
    _onKeydown(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatEndDate<any>, [null, null, null, null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatEndDate<any>, "input[ngxMatEndDate]", never, { "errorStateMatcher": "errorStateMatcher"; }, { "dateChange": "dateChange"; "dateInput": "dateInput"; }, never, never, false, never>;
}
export {};
