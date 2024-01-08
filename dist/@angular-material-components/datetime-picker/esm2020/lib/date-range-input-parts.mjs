import { Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Directive, Inject, InjectionToken, Optional, inject, } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, Validators, } from '@angular/forms';
import { mixinErrorState } from '@angular/material/core';
import { _computeAriaAccessibleName } from './aria-accessible-name';
import { NGX_MAT_DATE_FORMATS } from './core/date-formats';
import { NgxDateRange } from './date-selection-model';
import { NgxMatDatepickerInputBase } from './datepicker-input-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/core";
import * as i2 from "@angular/forms";
import * as i3 from "./core/date-adapter";
/**
 * Used to provide the date range input wrapper component
 * to the parts without circular dependencies.
 */
export const NGX_MAT_DATE_RANGE_INPUT_PARENT = new InjectionToken('NGX_MAT_DATE_RANGE_INPUT_PARENT');
/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
class NgxMatDateRangeInputPartBase extends NgxMatDatepickerInputBase {
    constructor(_rangeInput, _elementRef, _defaultErrorStateMatcher, _injector, _parentForm, _parentFormGroup, dateAdapter, dateFormats) {
        super(_elementRef, dateAdapter, dateFormats);
        this._rangeInput = _rangeInput;
        this._elementRef = _elementRef;
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._injector = _injector;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this._dir = inject(Directionality, { optional: true });
    }
    ngOnInit() {
        // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
        // injecting its `NgControl` so that the error state is handled correctly. This introduces a
        // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
        // itself. Usually we can work around it for the CVA, but there's no API to do it for the
        // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
        // everything has been resolved.
        // tslint:disable-next-line:no-bitwise
        const ngControl = this._injector.get(NgControl, null, { optional: true, self: true });
        if (ngControl) {
            this.ngControl = ngControl;
        }
    }
    ngDoCheck() {
        if (this.ngControl) {
            // We need to re-evaluate this on every change detection cycle, because there are some
            // error triggers that we can't subscribe to (e.g. parent form submissions). This means
            // that whatever logic is in here has to be super lean or we risk destroying the performance.
            this.updateErrorState();
        }
    }
    /** Gets whether the input is empty. */
    isEmpty() {
        return this._elementRef.nativeElement.value.length === 0;
    }
    /** Gets the placeholder of the input. */
    _getPlaceholder() {
        return this._elementRef.nativeElement.placeholder;
    }
    /** Focuses the input. */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    /** Gets the value that should be used when mirroring the input's size. */
    getMirrorValue() {
        const element = this._elementRef.nativeElement;
        const value = element.value;
        return value.length > 0 ? value : element.placeholder;
    }
    /** Handles `input` events on the input element. */
    _onInput(value) {
        super._onInput(value);
        this._rangeInput._handleChildValueChange();
    }
    /** Opens the datepicker associated with the input. */
    _openPopup() {
        this._rangeInput._openDatepicker();
    }
    /** Gets the minimum date from the range input. */
    _getMinDate() {
        return this._rangeInput.min;
    }
    /** Gets the maximum date from the range input. */
    _getMaxDate() {
        return this._rangeInput.max;
    }
    /** Gets the date filter function from the range input. */
    _getDateFilter() {
        return this._rangeInput.dateFilter;
    }
    _parentDisabled() {
        return this._rangeInput._groupDisabled;
    }
    _shouldHandleChangeEvent({ source }) {
        return source !== this._rangeInput._startInput && source !== this._rangeInput._endInput;
    }
    _assignValueProgrammatically(value) {
        super._assignValueProgrammatically(value);
        const opposite = (this === this._rangeInput._startInput
            ? this._rangeInput._endInput
            : this._rangeInput._startInput);
        opposite?._validatorOnChange();
    }
    /** return the ARIA accessible name of the input element */
    _getAccessibleName() {
        return _computeAriaAccessibleName(this._elementRef.nativeElement);
    }
}
/** @nocollapse */ NgxMatDateRangeInputPartBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateRangeInputPartBase, deps: [{ token: NGX_MAT_DATE_RANGE_INPUT_PARENT }, { token: i0.ElementRef }, { token: i1.ErrorStateMatcher }, { token: i0.Injector }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.NgxMatDateAdapter, optional: true }, { token: NGX_MAT_DATE_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDateRangeInputPartBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDateRangeInputPartBase, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateRangeInputPartBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_MAT_DATE_RANGE_INPUT_PARENT]
                }] }, { type: i0.ElementRef }, { type: i1.ErrorStateMatcher }, { type: i0.Injector }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_FORMATS]
                }] }]; } });
const _NgxMatDateRangeInputBase = mixinErrorState(NgxMatDateRangeInputPartBase);
/** Input for entering the start date in a `mat-date-range-input`. */
export class NgxMatStartDate extends _NgxMatDateRangeInputBase {
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /** Validator that checks that the start date isn't after the end date. */
        this._startValidator = (control) => {
            const start = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const end = this._model ? this._model.selection.end : null;
            return !start || !end || this._dateAdapter.compareDate(start, end) <= 0
                ? null
                : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
        };
        this._validator = Validators.compose([...super._getValidators(), this._startValidator]);
    }
    _getValueFromModel(modelValue) {
        return modelValue.start;
    }
    _shouldHandleChangeEvent(change) {
        if (!super._shouldHandleChangeEvent(change)) {
            return false;
        }
        else {
            return !change.oldValue?.start
                ? !!change.selection.start
                : !change.selection.start ||
                    !!this._dateAdapter.compareDate(change.oldValue.start, change.selection.start);
        }
    }
    _assignValueToModel(value) {
        if (this._model) {
            const range = new NgxDateRange(value, this._model.selection.end);
            this._model.updateSelection(range, this);
        }
    }
    _formatValue(value) {
        super._formatValue(value);
        // Any time the input value is reformatted we need to tell the parent.
        this._rangeInput._handleChildValueChange();
    }
    _onKeydown(event) {
        const endInput = this._rangeInput._endInput;
        const element = this._elementRef.nativeElement;
        const isLtr = this._dir?.value !== 'rtl';
        // If the user hits RIGHT (LTR) when at the end of the input (and no
        // selection), move the cursor to the start of the end input.
        if (((event.keyCode === RIGHT_ARROW && isLtr) || (event.keyCode === LEFT_ARROW && !isLtr)) &&
            element.selectionStart === element.value.length &&
            element.selectionEnd === element.value.length) {
            event.preventDefault();
            endInput._elementRef.nativeElement.setSelectionRange(0, 0);
            endInput.focus();
        }
        else {
            super._onKeydown(event);
        }
    }
}
/** @nocollapse */ NgxMatStartDate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatStartDate, deps: [{ token: NGX_MAT_DATE_RANGE_INPUT_PARENT }, { token: i0.ElementRef }, { token: i1.ErrorStateMatcher }, { token: i0.Injector }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.NgxMatDateAdapter, optional: true }, { token: NGX_MAT_DATE_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatStartDate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatStartDate, selector: "input[ngxMatStartDate]", inputs: { errorStateMatcher: "errorStateMatcher" }, outputs: { dateChange: "dateChange", dateInput: "dateInput" }, host: { attributes: { "type": "text" }, listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "keydown": "_onKeydown($event)", "blur": "_onBlur()" }, properties: { "disabled": "disabled", "attr.aria-haspopup": "_rangeInput.rangePicker ? \"dialog\" : null", "attr.aria-owns": "(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null", "attr.min": "_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null", "attr.max": "_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null" }, classAttribute: "mat-start-date mat-date-range-input-inner" }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: NgxMatStartDate, multi: true },
        { provide: NG_VALIDATORS, useExisting: NgxMatStartDate, multi: true },
    ], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatStartDate, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngxMatStartDate]',
                    host: {
                        'class': 'mat-start-date mat-date-range-input-inner',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(keydown)': '_onKeydown($event)',
                        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                        '(blur)': '_onBlur()',
                        'type': 'text',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: NgxMatStartDate, multi: true },
                        { provide: NG_VALIDATORS, useExisting: NgxMatStartDate, multi: true },
                    ],
                    // These need to be specified explicitly, because some tooling doesn't
                    // seem to pick them up from the base class. See #20932.
                    outputs: ['dateChange', 'dateInput'],
                    inputs: ['errorStateMatcher'],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_MAT_DATE_RANGE_INPUT_PARENT]
                }] }, { type: i0.ElementRef }, { type: i1.ErrorStateMatcher }, { type: i0.Injector }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_FORMATS]
                }] }]; } });
/** Input for entering the end date in a `mat-date-range-input`. */
export class NgxMatEndDate extends _NgxMatDateRangeInputBase {
    constructor(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats) {
        super(rangeInput, elementRef, defaultErrorStateMatcher, injector, parentForm, parentFormGroup, dateAdapter, dateFormats);
        /** Validator that checks that the end date isn't before the start date. */
        this._endValidator = (control) => {
            const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const start = this._model ? this._model.selection.start : null;
            return !end || !start || this._dateAdapter.compareDate(end, start) >= 0
                ? null
                : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
        };
        this._validator = Validators.compose([...super._getValidators(), this._endValidator]);
    }
    _getValueFromModel(modelValue) {
        return modelValue.end;
    }
    _shouldHandleChangeEvent(change) {
        if (!super._shouldHandleChangeEvent(change)) {
            return false;
        }
        else {
            return !change.oldValue?.end
                ? !!change.selection.end
                : !change.selection.end ||
                    !!this._dateAdapter.compareDate(change.oldValue.end, change.selection.end);
        }
    }
    _assignValueToModel(value) {
        if (this._model) {
            const range = new NgxDateRange(this._model.selection.start, value);
            this._model.updateSelection(range, this);
        }
    }
    _onKeydown(event) {
        const startInput = this._rangeInput._startInput;
        const element = this._elementRef.nativeElement;
        const isLtr = this._dir?.value !== 'rtl';
        // If the user is pressing backspace on an empty end input, move focus back to the start.
        if (event.keyCode === BACKSPACE && !element.value) {
            startInput.focus();
        }
        // If the user hits LEFT (LTR) when at the start of the input (and no
        // selection), move the cursor to the end of the start input.
        else if (((event.keyCode === LEFT_ARROW && isLtr) || (event.keyCode === RIGHT_ARROW && !isLtr)) &&
            element.selectionStart === 0 &&
            element.selectionEnd === 0) {
            event.preventDefault();
            const endPosition = startInput._elementRef.nativeElement.value.length;
            startInput._elementRef.nativeElement.setSelectionRange(endPosition, endPosition);
            startInput.focus();
        }
        else {
            super._onKeydown(event);
        }
    }
}
/** @nocollapse */ NgxMatEndDate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatEndDate, deps: [{ token: NGX_MAT_DATE_RANGE_INPUT_PARENT }, { token: i0.ElementRef }, { token: i1.ErrorStateMatcher }, { token: i0.Injector }, { token: i2.NgForm, optional: true }, { token: i2.FormGroupDirective, optional: true }, { token: i3.NgxMatDateAdapter, optional: true }, { token: NGX_MAT_DATE_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatEndDate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatEndDate, selector: "input[ngxMatEndDate]", inputs: { errorStateMatcher: "errorStateMatcher" }, outputs: { dateChange: "dateChange", dateInput: "dateInput" }, host: { attributes: { "type": "text" }, listeners: { "input": "_onInput($event.target.value)", "change": "_onChange()", "keydown": "_onKeydown($event)", "blur": "_onBlur()" }, properties: { "disabled": "disabled", "attr.aria-haspopup": "_rangeInput.rangePicker ? \"dialog\" : null", "attr.aria-owns": "(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null", "attr.min": "_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null", "attr.max": "_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null" }, classAttribute: "mat-end-date mat-date-range-input-inner" }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: NgxMatEndDate, multi: true },
        { provide: NG_VALIDATORS, useExisting: NgxMatEndDate, multi: true },
    ], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatEndDate, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngxMatEndDate]',
                    host: {
                        'class': 'mat-end-date mat-date-range-input-inner',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(keydown)': '_onKeydown($event)',
                        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_rangeInput.rangePicker?.opened && _rangeInput.rangePicker.id) || null',
                        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()) : null',
                        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()) : null',
                        '(blur)': '_onBlur()',
                        'type': 'text',
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: NgxMatEndDate, multi: true },
                        { provide: NG_VALIDATORS, useExisting: NgxMatEndDate, multi: true },
                    ],
                    // These need to be specified explicitly, because some tooling doesn't
                    // seem to pick them up from the base class. See #20932.
                    outputs: ['dateChange', 'dateInput'],
                    inputs: ['errorStateMatcher'],
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_MAT_DATE_RANGE_INPUT_PARENT]
                }] }, { type: i0.ElementRef }, { type: i1.ErrorStateMatcher }, { type: i0.Injector }, { type: i2.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i2.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_FORMATS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1pbnB1dC1wYXJ0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2RhdGV0aW1lLXBpY2tlci9zcmMvbGliL2RhdGUtcmFuZ2UtaW5wdXQtcGFydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzNFLE9BQU8sRUFDTCxTQUFTLEVBR1QsTUFBTSxFQUNOLGNBQWMsRUFHZCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxhQUFhLEVBQ2IsaUJBQWlCLEVBQ2pCLFNBQVMsRUFJVCxVQUFVLEdBQ1gsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBS0wsZUFBZSxFQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXBFLE9BQU8sRUFBRSxvQkFBb0IsRUFBcUIsTUFBTSxxQkFBcUIsQ0FBQztBQUM5RSxPQUFPLEVBQUUsWUFBWSxFQUErQixNQUFNLHdCQUF3QixDQUFDO0FBQ25GLE9BQU8sRUFBbUIseUJBQXlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7Ozs7QUFtQnJGOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHLElBQUksY0FBYyxDQUMvRCxpQ0FBaUMsQ0FDbEMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFDZSw0QkFDYixTQUFRLHlCQUEwQztJQWlCbEQsWUFDa0QsV0FBMEMsRUFDMUUsV0FBeUMsRUFDbEQseUJBQTRDLEVBQzNDLFNBQW1CLEVBQ1IsV0FBbUIsRUFDbkIsZ0JBQW9DLEVBQzNDLFdBQWlDLEVBQ0gsV0FBOEI7UUFFeEUsS0FBSyxD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LE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0tBQ3BFOzJGQU1VLGFBQWE7a0JBeEJ6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUseUNBQXlDO3dCQUNsRCxZQUFZLEVBQUUsVUFBVTt3QkFDeEIsU0FBUyxFQUFFLCtCQUErQjt3QkFDMUMsVUFBVSxFQUFFLGFBQWE7d0JBQ3pCLFdBQVcsRUFBRSxvQkFBb0I7d0JBQ2pDLHNCQUFzQixFQUFFLDJDQUEyQzt3QkFDbkUsa0JBQWtCLEVBQUUseUVBQXlFO3dCQUM3RixZQUFZLEVBQUUsOERBQThEO3dCQUM1RSxZQUFZLEVBQUUsOERBQThEO3dCQUM1RSxRQUFRLEVBQUUsV0FBVzt3QkFDckIsTUFBTSxFQUFFLE1BQU07cUJBQ2Y7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsZUFBZSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7d0JBQ3ZFLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLGVBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO3FCQUNwRTtvQkFDRCxzRUFBc0U7b0JBQ3RFLHdEQUF3RDtvQkFDeEQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQztvQkFDcEMsTUFBTSxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQzlCOzswQkFZSSxNQUFNOzJCQUFDLCtCQUErQjs7MEJBSXRDLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBCQUNLU1BBQ0UsIExFRlRfQVJST1csIFJJR0hUX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIE5nQ29udHJvbCxcbiAgTmdGb3JtLFxuICBWYWxpZGF0aW9uRXJyb3JzLFxuICBWYWxpZGF0b3JGbixcbiAgVmFsaWRhdG9ycyxcbn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIE1BVF9EQVRFX0ZPUk1BVFMsXG4gIE1hdERhdGVGb3JtYXRzLFxuICBtaXhpbkVycm9yU3RhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQgeyBfY29tcHV0ZUFyaWFBY2Nlc3NpYmxlTmFtZSB9IGZyb20gJy4vYXJpYS1hY2Nlc3NpYmxlLW5hbWUnO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IE5HWF9NQVRfREFURV9GT1JNQVRTLCBOZ3hNYXREYXRlRm9ybWF0cyB9IGZyb20gJy4vY29yZS9kYXRlLWZvcm1hdHMnO1xuaW1wb3J0IHsgTmd4RGF0ZVJhbmdlLCBOZ3hEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2UgfSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7IE5neERhdGVGaWx0ZXJGbiwgTmd4TWF0RGF0ZXBpY2tlcklucHV0QmFzZSB9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcblxuLyoqIFBhcmVudCBjb21wb25lbnQgdGhhdCBzaG91bGQgYmUgd3JhcHBlZCBhcm91bmQgYE1hdFN0YXJ0RGF0ZWAgYW5kIGBNYXRFbmREYXRlYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmd4TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8RD4ge1xuICBpZDogc3RyaW5nO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkYXRlRmlsdGVyOiBOZ3hEYXRlRmlsdGVyRm48RD47XG4gIHJhbmdlUGlja2VyOiB7XG4gICAgb3BlbmVkOiBib29sZWFuO1xuICAgIGlkOiBzdHJpbmc7XG4gIH07XG4gIF9zdGFydElucHV0OiBOZ3hNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+O1xuICBfZW5kSW5wdXQ6IE5neE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD47XG4gIF9ncm91cERpc2FibGVkOiBib29sZWFuO1xuICBfaGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpOiB2b2lkO1xuICBfb3BlbkRhdGVwaWNrZXIoKTogdm9pZDtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgdGhlIGRhdGUgcmFuZ2UgaW5wdXQgd3JhcHBlciBjb21wb25lbnRcbiAqIHRvIHRoZSBwYXJ0cyB3aXRob3V0IGNpcmN1bGFyIGRlcGVuZGVuY2llcy5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HWF9NQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQgPSBuZXcgSW5qZWN0aW9uVG9rZW48Tmd4TWF0RGF0ZVJhbmdlSW5wdXRQYXJlbnQ8dW5rbm93bj4+KFxuICAnTkdYX01BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCcsXG4pO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBpbmRpdmlkdWFsIGlucHV0cyB0aGF0IGNhbiBiZSBwcm9qZWN0ZWQgaW5zaWRlIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC5cbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBOZ3hNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlPEQ+XG4gIGV4dGVuZHMgTmd4TWF0RGF0ZXBpY2tlcklucHV0QmFzZTxOZ3hEYXRlUmFuZ2U8RD4+XG4gIGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrIHtcbiAgLyoqXG4gICAqIEZvcm0gY29udHJvbCBib3VuZCB0byB0aGlzIGlucHV0IHBhcnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG5nQ29udHJvbDogTmdDb250cm9sO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGFic3RyYWN0IHVwZGF0ZUVycm9yU3RhdGUoKTogdm9pZDtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb3ZlcnJpZGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBudWxsO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb3ZlcnJpZGUgX2Fzc2lnblZhbHVlVG9Nb2RlbCh2YWx1ZTogRCB8IG51bGwpOiB2b2lkO1xuICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb3ZlcnJpZGUgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IE5neERhdGVSYW5nZTxEPik6IEQgfCBudWxsO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGlyID0gaW5qZWN0KERpcmVjdGlvbmFsaXR5LCB7IG9wdGlvbmFsOiB0cnVlIH0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTkdYX01BVF9EQVRFX1JBTkdFX0lOUFVUX1BBUkVOVCkgcHVibGljIF9yYW5nZUlucHV0OiBOZ3hNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBwdWJsaWMgb3ZlcnJpZGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHVibGljIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBOZ3hNYXREYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HWF9NQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTmd4TWF0RGF0ZUZvcm1hdHMsXG4gICkge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmLCBkYXRlQWRhcHRlciwgZGF0ZUZvcm1hdHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0aGUgZGF0ZSBpbnB1dCB0byBwcm92aWRlIGl0c2VsZiBhcyBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgYW5kIGEgYFZhbGlkYXRvcmAsIHdoaWxlXG4gICAgLy8gaW5qZWN0aW5nIGl0cyBgTmdDb250cm9sYCBzbyB0aGF0IHRoZSBlcnJvciBzdGF0ZSBpcyBoYW5kbGVkIGNvcnJlY3RseS4gVGhpcyBpbnRyb2R1Y2VzIGFcbiAgICAvLyBjaXJjdWxhciBkZXBlbmRlbmN5LCBiZWNhdXNlIGJvdGggYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBhbmQgYFZhbGlkYXRvcmAgZGVwZW5kIG9uIHRoZSBpbnB1dFxuICAgIC8vIGl0c2VsZi4gVXN1YWxseSB3ZSBjYW4gd29yayBhcm91bmQgaXQgZm9yIHRoZSBDVkEsIGJ1dCB0aGVyZSdzIG5vIEFQSSB0byBkbyBpdCBmb3IgdGhlXG4gICAgLy8gdmFsaWRhdG9yLiBXZSB3b3JrIGFyb3VuZCBpdCBoZXJlIGJ5IGluamVjdGluZyB0aGUgYE5nQ29udHJvbGAgaW4gYG5nT25Jbml0YCwgYWZ0ZXJcbiAgICAvLyBldmVyeXRoaW5nIGhhcyBiZWVuIHJlc29sdmVkLlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1iaXR3aXNlXG4gICAgY29uc3QgbmdDb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0KE5nQ29udHJvbCwgbnVsbCwgeyBvcHRpb25hbDogdHJ1ZSwgc2VsZjogdHJ1ZSB9KTtcblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMubmdDb250cm9sID0gbmdDb250cm9sO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gcmUtZXZhbHVhdGUgdGhpcyBvbiBldmVyeSBjaGFuZ2UgZGV0ZWN0aW9uIGN5Y2xlLCBiZWNhdXNlIHRoZXJlIGFyZSBzb21lXG4gICAgICAvLyBlcnJvciB0cmlnZ2VycyB0aGF0IHdlIGNhbid0IHN1YnNjcmliZSB0byAoZS5nLiBwYXJlbnQgZm9ybSBzdWJtaXNzaW9ucykuIFRoaXMgbWVhbnNcbiAgICAgIC8vIHRoYXQgd2hhdGV2ZXIgbG9naWMgaXMgaW4gaGVyZSBoYXMgdG8gYmUgc3VwZXIgbGVhbiBvciB3ZSByaXNrIGRlc3Ryb3lpbmcgdGhlIHBlcmZvcm1hbmNlLlxuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgaW5wdXQgaXMgZW1wdHkuICovXG4gIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcGxhY2Vob2xkZXIgb2YgdGhlIGlucHV0LiAqL1xuICBfZ2V0UGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBpbnB1dC4gKi9cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCB3aGVuIG1pcnJvcmluZyB0aGUgaW5wdXQncyBzaXplLiAqL1xuICBnZXRNaXJyb3JWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwID8gdmFsdWUgOiBlbGVtZW50LnBsYWNlaG9sZGVyO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYGlucHV0YCBldmVudHMgb24gdGhlIGlucHV0IGVsZW1lbnQuICovXG4gIG92ZXJyaWRlIF9vbklucHV0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBzdXBlci5fb25JbnB1dCh2YWx1ZSk7XG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfb3BlblBvcHVwKCk6IHZvaWQge1xuICAgIHRoaXMuX3JhbmdlSW5wdXQuX29wZW5EYXRlcGlja2VyKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5taW47XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSBkYXRlIGZyb20gdGhlIHJhbmdlIGlucHV0LiAqL1xuICBfZ2V0TWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5tYXg7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGF0ZSBmaWx0ZXIgZnVuY3Rpb24gZnJvbSB0aGUgcmFuZ2UgaW5wdXQuICovXG4gIHByb3RlY3RlZCBfZ2V0RGF0ZUZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5kYXRlRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmFuZ2VJbnB1dC5fZ3JvdXBEaXNhYmxlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoeyBzb3VyY2UgfTogTmd4RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPE5neERhdGVSYW5nZTxEPj4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gc291cmNlICE9PSB0aGlzLl9yYW5nZUlucHV0Ll9zdGFydElucHV0ICYmIHNvdXJjZSAhPT0gdGhpcy5fcmFuZ2VJbnB1dC5fZW5kSW5wdXQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2Fzc2lnblZhbHVlUHJvZ3JhbW1hdGljYWxseSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICBzdXBlci5fYXNzaWduVmFsdWVQcm9ncmFtbWF0aWNhbGx5KHZhbHVlKTtcbiAgICBjb25zdCBvcHBvc2l0ZSA9IChcbiAgICAgIHRoaXMgPT09IHRoaXMuX3JhbmdlSW5wdXQuX3N0YXJ0SW5wdXRcbiAgICAgICAgPyB0aGlzLl9yYW5nZUlucHV0Ll9lbmRJbnB1dFxuICAgICAgICA6IHRoaXMuX3JhbmdlSW5wdXQuX3N0YXJ0SW5wdXRcbiAgICApIGFzIE5neE1hdERhdGVSYW5nZUlucHV0UGFydEJhc2U8RD4gfCB1bmRlZmluZWQ7XG4gICAgb3Bwb3NpdGU/Ll92YWxpZGF0b3JPbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqIHJldHVybiB0aGUgQVJJQSBhY2Nlc3NpYmxlIG5hbWUgb2YgdGhlIGlucHV0IGVsZW1lbnQgKi9cbiAgX2dldEFjY2Vzc2libGVOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIF9jb21wdXRlQXJpYUFjY2Vzc2libGVOYW1lKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gIH1cbn1cblxuY29uc3QgX05neE1hdERhdGVSYW5nZUlucHV0QmFzZSA9IG1peGluRXJyb3JTdGF0ZShOZ3hNYXREYXRlUmFuZ2VJbnB1dFBhcnRCYXNlKTtcblxuLyoqIElucHV0IGZvciBlbnRlcmluZyB0aGUgc3RhcnQgZGF0ZSBpbiBhIGBtYXQtZGF0ZS1yYW5nZS1pbnB1dGAuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFtuZ3hNYXRTdGFydERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RhcnQtZGF0ZSBtYXQtZGF0ZS1yYW5nZS1pbnB1dC1pbm5lcicsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoaW5wdXQpJzogJ19vbklucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCknLFxuICAgICcoa2V5ZG93biknOiAnX29uS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIgPyBcImRpYWxvZ1wiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKF9yYW5nZUlucHV0LnJhbmdlUGlja2VyPy5vcGVuZWQgJiYgX3JhbmdlSW5wdXQucmFuZ2VQaWNrZXIuaWQpIHx8IG51bGwnLFxuICAgICdbYXR0ci5taW5dJzogJ19nZXRNaW5EYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNaW5EYXRlKCkpIDogbnVsbCcsXG4gICAgJ1thdHRyLm1heF0nOiAnX2dldE1heERhdGUoKSA/IF9kYXRlQWRhcHRlci50b0lzbzg2MDEoX2dldE1heERhdGUoKSkgOiBudWxsJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gICAgJ3R5cGUnOiAndGV4dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBOZ3hNYXRTdGFydERhdGUsIG11bHRpOiB0cnVlIH0sXG4gICAgeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogTmd4TWF0U3RhcnREYXRlLCBtdWx0aTogdHJ1ZSB9LFxuICBdLFxuICAvLyBUaGVzZSBuZWVkIHRvIGJlIHNwZWNpZmllZCBleHBsaWNpdGx5LCBiZWNhdXNlIHNvbWUgdG9vbGluZyBkb2Vzbid0XG4gIC8vIHNlZW0gdG8gcGljayB0aGVtIHVwIGZyb20gdGhlIGJhc2UgY2xhc3MuIFNlZSAjMjA5MzIuXG4gIG91dHB1dHM6IFsnZGF0ZUNoYW5nZScsICdkYXRlSW5wdXQnXSxcbiAgaW5wdXRzOiBbJ2Vycm9yU3RhdGVNYXRjaGVyJ10sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdFN0YXJ0RGF0ZTxEPiBleHRlbmRzIF9OZ3hNYXREYXRlUmFuZ2VJbnB1dEJhc2U8RD4gaW1wbGVtZW50cyBDYW5VcGRhdGVFcnJvclN0YXRlIHtcbiAgLyoqIFZhbGlkYXRvciB0aGF0IGNoZWNrcyB0aGF0IHRoZSBzdGFydCBkYXRlIGlzbid0IGFmdGVyIHRoZSBlbmQgZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc3RhcnRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpLFxuICAgICk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uZW5kIDogbnVsbDtcbiAgICByZXR1cm4gIXN0YXJ0IHx8ICFlbmQgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUoc3RhcnQsIGVuZCkgPD0gMFxuICAgICAgPyBudWxsXG4gICAgICA6IHsgJ21hdFN0YXJ0RGF0ZUludmFsaWQnOiB7ICdlbmQnOiBlbmQsICdhY3R1YWwnOiBzdGFydCB9IH07XG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChOR1hfTUFUX0RBVEVfUkFOR0VfSU5QVVRfUEFSRU5UKSByYW5nZUlucHV0OiBOZ3hNYXREYXRlUmFuZ2VJbnB1dFBhcmVudDxEPixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIGRlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBkYXRlQWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChOR1hfTUFUX0RBVEVfRk9STUFUUykgZGF0ZUZvcm1hdHM6IE5neE1hdERhdGVGb3JtYXRzLFxuICApIHtcbiAgICBzdXBlcihcbiAgICAgIHJhbmdlSW5wdXQsXG4gICAgICBlbGVtZW50UmVmLFxuICAgICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgaW5qZWN0b3IsXG4gICAgICBwYXJlbnRGb3JtLFxuICAgICAgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgZGF0ZUFkYXB0ZXIsXG4gICAgICBkYXRlRm9ybWF0cyxcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoWy4uLnN1cGVyLl9nZXRWYWxpZGF0b3JzKCksIHRoaXMuX3N0YXJ0VmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBOZ3hEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5zdGFydDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoXG4gICAgY2hhbmdlOiBOZ3hEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2U8Tmd4RGF0ZVJhbmdlPEQ+PixcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKCFzdXBlci5fc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoY2hhbmdlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gIWNoYW5nZS5vbGRWYWx1ZT8uc3RhcnRcbiAgICAgICAgPyAhIWNoYW5nZS5zZWxlY3Rpb24uc3RhcnRcbiAgICAgICAgOiAhY2hhbmdlLnNlbGVjdGlvbi5zdGFydCB8fFxuICAgICAgICAhIXRoaXMuX2RhdGVBZGFwdGVyLmNvbXBhcmVEYXRlKGNoYW5nZS5vbGRWYWx1ZS5zdGFydCwgY2hhbmdlLnNlbGVjdGlvbi5zdGFydCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBOZ3hEYXRlUmFuZ2UodmFsdWUsIHRoaXMuX21vZGVsLnNlbGVjdGlvbi5lbmQpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKHJhbmdlLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX2Zvcm1hdFZhbHVlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHN1cGVyLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG5cbiAgICAvLyBBbnkgdGltZSB0aGUgaW5wdXQgdmFsdWUgaXMgcmVmb3JtYXR0ZWQgd2UgbmVlZCB0byB0ZWxsIHRoZSBwYXJlbnQuXG4gICAgdGhpcy5fcmFuZ2VJbnB1dC5faGFuZGxlQ2hpbGRWYWx1ZUNoYW5nZSgpO1xuICB9XG5cbiAgb3ZlcnJpZGUgX29uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IGVuZElucHV0ID0gdGhpcy5fcmFuZ2VJbnB1dC5fZW5kSW5wdXQ7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBpc0x0ciA9IHRoaXMuX2Rpcj8udmFsdWUgIT09ICdydGwnO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0cyBSSUdIVCAoTFRSKSB3aGVuIGF0IHRoZSBlbmQgb2YgdGhlIGlucHV0IChhbmQgbm9cbiAgICAvLyBzZWxlY3Rpb24pLCBtb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIHN0YXJ0IG9mIHRoZSBlbmQgaW5wdXQuXG4gICAgaWYgKFxuICAgICAgKChldmVudC5rZXlDb2RlID09PSBSSUdIVF9BUlJPVyAmJiBpc0x0cikgfHwgKGV2ZW50LmtleUNvZGUgPT09IExFRlRfQVJST1cgJiYgIWlzTHRyKSkgJiZcbiAgICAgIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT09IGVsZW1lbnQudmFsdWUubGVuZ3RoICYmXG4gICAgICBlbGVtZW50LnNlbGVjdGlvbkVuZCA9PT0gZWxlbWVudC52YWx1ZS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlbmRJbnB1dC5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIDApO1xuICAgICAgZW5kSW5wdXQuZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIuX29uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBJbnB1dCBmb3IgZW50ZXJpbmcgdGhlIGVuZCBkYXRlIGluIGEgYG1hdC1kYXRlLXJhbmdlLWlucHV0YC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25neE1hdEVuZERhdGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZW5kLWRhdGUgbWF0LWRhdGUtcmFuZ2UtaW5wdXQtaW5uZXInLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnKGlucHV0KSc6ICdfb25JbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgpJyxcbiAgICAnKGtleWRvd24pJzogJ19vbktleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ19yYW5nZUlucHV0LnJhbmdlUGlja2VyID8gXCJkaWFsb2dcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhfcmFuZ2VJbnB1dC5yYW5nZVBpY2tlcj8ub3BlbmVkICYmIF9yYW5nZUlucHV0LnJhbmdlUGlja2VyLmlkKSB8fCBudWxsJyxcbiAgICAnW2F0dHIubWluXSc6ICdfZ2V0TWluRGF0ZSgpID8gX2RhdGVBZGFwdGVyLnRvSXNvODYwMShfZ2V0TWluRGF0ZSgpKSA6IG51bGwnLFxuICAgICdbYXR0ci5tYXhdJzogJ19nZXRNYXhEYXRlKCkgPyBfZGF0ZUFkYXB0ZXIudG9Jc284NjAxKF9nZXRNYXhEYXRlKCkpIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICAgICd0eXBlJzogJ3RleHQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogTmd4TWF0RW5kRGF0ZSwgbXVsdGk6IHRydWUgfSxcbiAgICB7IHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBOZ3hNYXRFbmREYXRlLCBtdWx0aTogdHJ1ZSB9LFxuICBdLFxuICAvLyBUaGVzZSBuZWVkIHRvIGJlIHNwZWNpZmllZCBleHBsaWNpdGx5LCBiZWNhdXNlIHNvbWUgdG9vbGluZyBkb2Vzbid0XG4gIC8vIHNlZW0gdG8gcGljayB0aGVtIHVwIGZyb20gdGhlIGJhc2UgY2xhc3MuIFNlZSAjMjA5MzIuXG4gIG91dHB1dHM6IFsnZGF0ZUNoYW5nZScsICdkYXRlSW5wdXQnXSxcbiAgaW5wdXRzOiBbJ2Vycm9yU3RhdGVNYXRjaGVyJ10sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdEVuZERhdGU8RD4gZXh0ZW5kcyBfTmd4TWF0RGF0ZVJhbmdlSW5wdXRCYXNlPEQ+IGltcGxlbWVudHMgQ2FuVXBkYXRlRXJyb3JTdGF0ZSB7XG4gIC8qKiBWYWxpZGF0b3IgdGhhdCBjaGVja3MgdGhhdCB0aGUgZW5kIGRhdGUgaXNuJ3QgYmVmb3JlIHRoZSBzdGFydCBkYXRlLiAqL1xuICBwcml2YXRlIF9lbmRWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSkpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fbW9kZWwgPyB0aGlzLl9tb2RlbC5zZWxlY3Rpb24uc3RhcnQgOiBudWxsO1xuICAgIHJldHVybiAhZW5kIHx8ICFzdGFydCB8fCB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShlbmQsIHN0YXJ0KSA+PSAwXG4gICAgICA/IG51bGxcbiAgICAgIDogeyAnbWF0RW5kRGF0ZUludmFsaWQnOiB7ICdzdGFydCc6IHN0YXJ0LCAnYWN0dWFsJzogZW5kIH0gfTtcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE5HWF9NQVRfREFURV9SQU5HRV9JTlBVVF9QQVJFTlQpIHJhbmdlSW5wdXQ6IE5neE1hdERhdGVSYW5nZUlucHV0UGFyZW50PEQ+LFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIGRhdGVBZGFwdGVyOiBOZ3hNYXREYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HWF9NQVRfREFURV9GT1JNQVRTKSBkYXRlRm9ybWF0czogTmd4TWF0RGF0ZUZvcm1hdHMsXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgcmFuZ2VJbnB1dCxcbiAgICAgIGVsZW1lbnRSZWYsXG4gICAgICBkZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICBpbmplY3RvcixcbiAgICAgIHBhcmVudEZvcm0sXG4gICAgICBwYXJlbnRGb3JtR3JvdXAsXG4gICAgICBkYXRlQWRhcHRlcixcbiAgICAgIGRhdGVGb3JtYXRzLFxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMuY29tcG9zZShbLi4uc3VwZXIuX2dldFZhbGlkYXRvcnMoKSwgdGhpcy5fZW5kVmFsaWRhdG9yXSk7XG5cbiAgcHJvdGVjdGVkIF9nZXRWYWx1ZUZyb21Nb2RlbChtb2RlbFZhbHVlOiBOZ3hEYXRlUmFuZ2U8RD4pIHtcbiAgICByZXR1cm4gbW9kZWxWYWx1ZS5lbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KFxuICAgIGNoYW5nZTogTmd4RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPE5neERhdGVSYW5nZTxEPj4sXG4gICk6IGJvb2xlYW4ge1xuICAgIGlmICghc3VwZXIuX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KGNoYW5nZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICFjaGFuZ2Uub2xkVmFsdWU/LmVuZFxuICAgICAgICA/ICEhY2hhbmdlLnNlbGVjdGlvbi5lbmRcbiAgICAgICAgOiAhY2hhbmdlLnNlbGVjdGlvbi5lbmQgfHxcbiAgICAgICAgISF0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShjaGFuZ2Uub2xkVmFsdWUuZW5kLCBjaGFuZ2Uuc2VsZWN0aW9uLmVuZCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zdCByYW5nZSA9IG5ldyBOZ3hEYXRlUmFuZ2UodGhpcy5fbW9kZWwuc2VsZWN0aW9uLnN0YXJ0LCB2YWx1ZSk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24ocmFuZ2UsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIF9vbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBzdGFydElucHV0ID0gdGhpcy5fcmFuZ2VJbnB1dC5fc3RhcnRJbnB1dDtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGlzTHRyID0gdGhpcy5fZGlyPy52YWx1ZSAhPT0gJ3J0bCc7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBpcyBwcmVzc2luZyBiYWNrc3BhY2Ugb24gYW4gZW1wdHkgZW5kIGlucHV0LCBtb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIHN0YXJ0LlxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBCQUNLU1BBQ0UgJiYgIWVsZW1lbnQudmFsdWUpIHtcbiAgICAgIHN0YXJ0SW5wdXQuZm9jdXMoKTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0cyBMRUZUIChMVFIpIHdoZW4gYXQgdGhlIHN0YXJ0IG9mIHRoZSBpbnB1dCAoYW5kIG5vXG4gICAgLy8gc2VsZWN0aW9uKSwgbW92ZSB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIHN0YXJ0IGlucHV0LlxuICAgIGVsc2UgaWYgKFxuICAgICAgKChldmVudC5rZXlDb2RlID09PSBMRUZUX0FSUk9XICYmIGlzTHRyKSB8fCAoZXZlbnQua2V5Q29kZSA9PT0gUklHSFRfQVJST1cgJiYgIWlzTHRyKSkgJiZcbiAgICAgIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQgPT09IDAgJiZcbiAgICAgIGVsZW1lbnQuc2VsZWN0aW9uRW5kID09PSAwXG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgZW5kUG9zaXRpb24gPSBzdGFydElucHV0Ll9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUubGVuZ3RoO1xuICAgICAgc3RhcnRJbnB1dC5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGVuZFBvc2l0aW9uLCBlbmRQb3NpdGlvbik7XG4gICAgICBzdGFydElucHV0LmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLl9vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxufVxuIl19