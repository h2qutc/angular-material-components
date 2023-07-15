import { Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import {
  Directive,
  DoCheck,
  ElementRef,
  Inject,
  InjectionToken,
  Injector,
  OnInit,
  Optional,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  CanUpdateErrorState,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MatDateFormats,
  mixinErrorState
} from '@angular/material/core';
import { _computeAriaAccessibleName } from './aria-accessible-name';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats } from './core/date-formats';
import { NgxDateRange, NgxDateSelectionModelChange } from './date-selection-model';
import { NgxDateFilterFn, NgxMatDatepickerInputBase } from './datepicker-input-base';

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
export const NGX_MAT_DATE_RANGE_INPUT_PARENT = new InjectionToken<NgxMatDateRangeInputParent<unknown>>(
  'NGX_MAT_DATE_RANGE_INPUT_PARENT',
);

/**
 * Base class for the individual inputs that can be projected inside a `mat-date-range-input`.
 */
@Directive()
abstract class NgxMatDateRangeInputPartBase<D>
  extends NgxMatDatepickerInputBase<NgxDateRange<D>>
  implements OnInit, DoCheck {
  /**
   * Form control bound to this input part.
   * @docs-private
   */
  ngControl: NgControl;

  /** @docs-private */
  abstract updateErrorState(): void;

  protected abstract override _validator: ValidatorFn | null;
  protected abstract override _assignValueToModel(value: D | null): void;
  protected abstract override _getValueFromModel(modelValue: NgxDateRange<D>): D | null;

  protected readonly _dir = inject(Directionality, { optional: true });

  constructor(
    @Inject(NGX_MAT_DATE_RANGE_INPUT_PARENT) public _rangeInput: NgxMatDateRangeInputParent<D>,
    public override _elementRef: ElementRef<HTMLInputElement>,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    private _injector: Injector,
    @Optional() public _parentForm: NgForm,
    @Optional() public _parentFormGroup: FormGroupDirective,
    @Optional() dateAdapter: NgxMatDateAdapter<D>,
    @Optional() @Inject(NGX_MAT_DATE_FORMATS) dateFormats: NgxMatDateFormats,
  ) {
    super(_elementRef, dateAdapter, dateFormats);
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
  isEmpty(): boolean {
    return this._elementRef.nativeElement.value.length === 0;
  }

  /** Gets the placeholder of the input. */
  _getPlaceholder() {
    return this._elementRef.nativeElement.placeholder;
  }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Gets the value that should be used when mirroring the input's size. */
  getMirrorValue(): string {
    const element = this._elementRef.nativeElement;
    const value = element.value;
    return value.length > 0 ? value : element.placeholder;
  }

  /** Handles `input` events on the input element. */
  override _onInput(value: string) {
    super._onInput(value);
    this._rangeInput._handleChildValueChange();
  }

  /** Opens the datepicker associated with the input. */
  protected _openPopup(): void {
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
  protected _getDateFilter() {
    return this._rangeInput.dateFilter;
  }

  protected override _parentDisabled() {
    return this._rangeInput._groupDisabled;
  }

  protected _shouldHandleChangeEvent({ source }: NgxDateSelectionModelChange<NgxDateRange<D>>): boolean {
    return source !== this._rangeInput._startInput && source !== this._rangeInput._endInput;
  }

  protected override _assignValueProgrammatically(value: D | null) {
    super._assignValueProgrammatically(value);
    const opposite = (
      this === this._rangeInput._startInput
        ? this._rangeInput._endInput
        : this._rangeInput._startInput
    ) as NgxMatDateRangeInputPartBase<D> | undefined;
    opposite?._validatorOnChange();
  }

  /** return the ARIA accessible name of the input element */
  _getAccessibleName(): string {
    return _computeAriaAccessibleName(this._elementRef.nativeElement);
  }
}

const _NgxMatDateRangeInputBase = mixinErrorState(NgxMatDateRangeInputPartBase);

/** Input for entering the start date in a `mat-date-range-input`. */
@Directive({
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
})
export class NgxMatStartDate<D> extends _NgxMatDateRangeInputBase<D> implements CanUpdateErrorState {
  /** Validator that checks that the start date isn't after the end date. */
  private _startValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(control.value),
    );
    const end = this._model ? this._model.selection.end : null;
    return !start || !end || this._dateAdapter.compareDate(start, end) <= 0
      ? null
      : { 'matStartDateInvalid': { 'end': end, 'actual': start } };
  };

  constructor(
    @Inject(NGX_MAT_DATE_RANGE_INPUT_PARENT) rangeInput: NgxMatDateRangeInputParent<D>,
    elementRef: ElementRef<HTMLInputElement>,
    defaultErrorStateMatcher: ErrorStateMatcher,
    injector: Injector,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Optional() dateAdapter: NgxMatDateAdapter<D>,
    @Optional() @Inject(NGX_MAT_DATE_FORMATS) dateFormats: NgxMatDateFormats,
  ) {
    super(
      rangeInput,
      elementRef,
      defaultErrorStateMatcher,
      injector,
      parentForm,
      parentFormGroup,
      dateAdapter,
      dateFormats,
    );
  }

  protected _validator = Validators.compose([...super._getValidators(), this._startValidator]);

  protected _getValueFromModel(modelValue: NgxDateRange<D>) {
    return modelValue.start;
  }

  protected override _shouldHandleChangeEvent(
    change: NgxDateSelectionModelChange<NgxDateRange<D>>,
  ): boolean {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.start
        ? !!change.selection.start
        : !change.selection.start ||
        !!this._dateAdapter.compareDate(change.oldValue.start, change.selection.start);
    }
  }

  protected _assignValueToModel(value: D | null) {
    if (this._model) {
      const range = new NgxDateRange(value, this._model.selection.end);
      this._model.updateSelection(range, this);
    }
  }

  protected override _formatValue(value: D | null) {
    super._formatValue(value);

    // Any time the input value is reformatted we need to tell the parent.
    this._rangeInput._handleChildValueChange();
  }

  override _onKeydown(event: KeyboardEvent) {
    const endInput = this._rangeInput._endInput;
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';

    // If the user hits RIGHT (LTR) when at the end of the input (and no
    // selection), move the cursor to the start of the end input.
    if (
      ((event.keyCode === RIGHT_ARROW && isLtr) || (event.keyCode === LEFT_ARROW && !isLtr)) &&
      element.selectionStart === element.value.length &&
      element.selectionEnd === element.value.length
    ) {
      event.preventDefault();
      endInput._elementRef.nativeElement.setSelectionRange(0, 0);
      endInput.focus();
    } else {
      super._onKeydown(event);
    }
  }
}

/** Input for entering the end date in a `mat-date-range-input`. */
@Directive({
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
})
export class NgxMatEndDate<D> extends _NgxMatDateRangeInputBase<D> implements CanUpdateErrorState {
  /** Validator that checks that the end date isn't before the start date. */
  private _endValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const start = this._model ? this._model.selection.start : null;
    return !end || !start || this._dateAdapter.compareDate(end, start) >= 0
      ? null
      : { 'matEndDateInvalid': { 'start': start, 'actual': end } };
  };

  constructor(
    @Inject(NGX_MAT_DATE_RANGE_INPUT_PARENT) rangeInput: NgxMatDateRangeInputParent<D>,
    elementRef: ElementRef<HTMLInputElement>,
    defaultErrorStateMatcher: ErrorStateMatcher,
    injector: Injector,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Optional() dateAdapter: NgxMatDateAdapter<D>,
    @Optional() @Inject(NGX_MAT_DATE_FORMATS) dateFormats: NgxMatDateFormats,
  ) {
    super(
      rangeInput,
      elementRef,
      defaultErrorStateMatcher,
      injector,
      parentForm,
      parentFormGroup,
      dateAdapter,
      dateFormats,
    );
  }

  protected _validator = Validators.compose([...super._getValidators(), this._endValidator]);

  protected _getValueFromModel(modelValue: NgxDateRange<D>) {
    return modelValue.end;
  }

  protected override _shouldHandleChangeEvent(
    change: NgxDateSelectionModelChange<NgxDateRange<D>>,
  ): boolean {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.end
        ? !!change.selection.end
        : !change.selection.end ||
        !!this._dateAdapter.compareDate(change.oldValue.end, change.selection.end);
    }
  }

  protected _assignValueToModel(value: D | null) {
    if (this._model) {
      const range = new NgxDateRange(this._model.selection.start, value);
      this._model.updateSelection(range, this);
    }
  }

  override _onKeydown(event: KeyboardEvent) {
    const startInput = this._rangeInput._startInput;
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';

    // If the user is pressing backspace on an empty end input, move focus back to the start.
    if (event.keyCode === BACKSPACE && !element.value) {
      startInput.focus();
    }
    // If the user hits LEFT (LTR) when at the start of the input (and no
    // selection), move the cursor to the end of the start input.
    else if (
      ((event.keyCode === LEFT_ARROW && isLtr) || (event.keyCode === RIGHT_ARROW && !isLtr)) &&
      element.selectionStart === 0 &&
      element.selectionEnd === 0
    ) {
      event.preventDefault();
      const endPosition = startInput._elementRef.nativeElement.value.length;
      startInput._elementRef.nativeElement.setSelectionRange(endPosition, endPosition);
      startInput.focus();
    } else {
      super._onKeydown(event);
    }
  }
}
