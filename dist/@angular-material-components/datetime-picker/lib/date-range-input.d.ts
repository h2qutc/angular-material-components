import { FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ControlContainer, NgControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxMatDateRangeInputParent, NgxMatEndDate, NgxMatStartDate } from './date-range-input-parts';
import { NgxMatDateRangePickerInput } from './date-range-picker';
import { NgxDateRange } from './date-selection-model';
import { NgxMatDatepickerControl, NgxMatDatepickerPanel } from './datepicker-base';
import { NgxDateFilterFn, _NgxMatFormFieldPartial } from './datepicker-input-base';
import * as i0 from "@angular/core";
export declare class NgxMatDateRangeInput<D> implements MatFormFieldControl<NgxDateRange<D>>, NgxMatDatepickerControl<D>, NgxMatDateRangeInputParent<D>, NgxMatDateRangePickerInput<D>, AfterContentInit, OnChanges, OnDestroy {
    private _changeDetectorRef;
    private _elementRef;
    private _dateAdapter;
    private _formField?;
    private _closedSubscription;
    /** Current value of the range input. */
    get value(): NgxDateRange<D>;
    /** Unique ID for the group. */
    id: string;
    /** Whether the control is focused. */
    focused: boolean;
    /** Whether the control's label should float. */
    get shouldLabelFloat(): boolean;
    /** Name of the form control. */
    controlType: string;
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * Set the placeholder attribute on `matStartDate` and `matEndDate`.
     * @docs-private
     */
    get placeholder(): string;
    /** The range picker that this input is associated with. */
    get rangePicker(): NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, NgxDateRange<D>, D>;
    set rangePicker(rangePicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, NgxDateRange<D>, D>);
    private _rangePicker;
    /** Whether the input is required. */
    get required(): boolean;
    set required(value: BooleanInput);
    private _required;
    /** Function that can be used to filter out dates within the date range picker. */
    get dateFilter(): NgxDateFilterFn<D>;
    set dateFilter(value: NgxDateFilterFn<D>);
    private _dateFilter;
    /** The minimum valid date. */
    get min(): D | null;
    set min(value: D | null);
    private _min;
    /** The maximum valid date. */
    get max(): D | null;
    set max(value: D | null);
    private _max;
    /** Whether the input is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    _groupDisabled: boolean;
    /** Whether the input is in an error state. */
    get errorState(): boolean;
    /** Whether the datepicker input is empty. */
    get empty(): boolean;
    /** Value for the `aria-describedby` attribute of the inputs. */
    _ariaDescribedBy: string | null;
    /** Date selection model currently registered with the input. */
    private _model;
    /** Separator text to be shown between the inputs. */
    separator: string;
    /** Start of the comparison range that should be shown in the calendar. */
    comparisonStart: D | null;
    /** End of the comparison range that should be shown in the calendar. */
    comparisonEnd: D | null;
    _startInput: NgxMatStartDate<D>;
    _endInput: NgxMatEndDate<D>;
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * TODO(crisbeto): change type to `AbstractControlDirective` after #18206 lands.
     * @docs-private
     */
    ngControl: NgControl | null;
    /** Emits when the input's state has changed. */
    readonly stateChanges: Subject<void>;
    constructor(_changeDetectorRef: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, control: ControlContainer, _dateAdapter: NgxMatDateAdapter<D>, _formField?: _NgxMatFormFieldPartial);
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * @docs-private
     */
    setDescribedByIds(ids: string[]): void;
    /**
     * Implemented as a part of `MatFormFieldControl`.
     * @docs-private
     */
    onContainerClick(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Gets the date at which the calendar should start. */
    getStartValue(): D | null;
    /** Gets the input's theme palette. */
    getThemePalette(): ThemePalette;
    /** Gets the element to which the calendar overlay should be attached. */
    getConnectedOverlayOrigin(): ElementRef;
    /** Gets the ID of an element that should be used a description for the calendar overlay. */
    getOverlayLabelId(): string | null;
    /** Gets the value that is used to mirror the state input. */
    _getInputMirrorValue(part: 'start' | 'end'): string;
    /** Whether the input placeholders should be hidden. */
    _shouldHidePlaceholders(): boolean;
    /** Handles the value in one of the child inputs changing. */
    _handleChildValueChange(): void;
    /** Opens the date range picker associated with the input. */
    _openDatepicker(): void;
    /** Whether the separate text should be hidden. */
    _shouldHideSeparator(): boolean;
    /** Gets the value for the `aria-labelledby` attribute of the inputs. */
    _getAriaLabelledby(): string;
    _getStartDateAccessibleName(): string;
    _getEndDateAccessibleName(): string;
    /** Updates the focused state of the range input. */
    _updateFocus(origin: FocusOrigin): void;
    /** Re-runs the validators on the start/end inputs. */
    private _revalidate;
    /** Registers the current date selection model with the start/end inputs. */
    private _registerModel;
    /** Checks whether a specific range input directive is required. */
    private _isTargetRequired;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDateRangeInput<any>, [null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatDateRangeInput<any>, "ngx-mat-date-range-input", ["ngxMatDateRangeInput"], { "rangePicker": "rangePicker"; "required": "required"; "dateFilter": "dateFilter"; "min": "min"; "max": "max"; "disabled": "disabled"; "separator": "separator"; "comparisonStart": "comparisonStart"; "comparisonEnd": "comparisonEnd"; }, {}, ["_startInput", "_endInput"], ["input[matStartDate]", "input[matEndDate]"], false, never>;
}
