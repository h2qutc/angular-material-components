

import { Directive, ElementRef, forwardRef, Inject, Input, OnDestroy, Optional } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MatDateFormats, ThemePalette } from '@angular/material/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxDateSelectionModelChange } from './date-selection-model';
import { NgxMatDatepickerControl, NgxMatDatepickerPanel } from './datepicker-base';
import { _NgxMatFormFieldPartial, NgxDateFilterFn, NgxMatDatepickerInputBase } from './datepicker-input-base';
import { NGX_MAT_DATE_FORMATS, NgxMatDateFormats } from './core/date-formats';

/** @docs-private */
export const NGX_MAT_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxMatDatepickerInput),
  multi: true,
};

/** @docs-private */
export const NGX_MAT_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxMatDatepickerInput),
  multi: true,
};

/** Directive used to connect an input to a MatDatepicker. */
@Directive({
  selector: 'input[ngxMatDatetimePicker]',
  providers: [
    NGX_MAT_DATEPICKER_VALUE_ACCESSOR,
    NGX_MAT_DATEPICKER_VALIDATORS,
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: NgxMatDatepickerInput },
  ],
  host: {
    'class': 'mat-datepicker-input',
    '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    // Used by the test harness to tie this input to its calendar. We can't depend on
    // `aria-owns` for this, because it's only defined while the calendar is open.
    '[attr.data-mat-calendar]': '_datepicker ? _datepicker.id : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'ngxMatDatepickerInput',
})
export class NgxMatDatepickerInput<D>
  extends NgxMatDatepickerInputBase<D | null, D>
  implements NgxMatDatepickerControl<D | null>, OnDestroy {
  private _closedSubscription = Subscription.EMPTY;

  /** The datepicker that this input is associated with. */
  @Input()
  set ngxMatDatetimePicker(datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, D | null, D>) {
    if (datepicker) {
      this._datepicker = datepicker;
      this._closedSubscription = datepicker.closedStream.subscribe(() => this._onTouched());
      this._registerModel(datepicker.registerInput(this));
    }
  }
  _datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<D>, D | null, D>;

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._validatorOnChange();
    }
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._validatorOnChange();
    }
  }
  private _max: D | null;

  /** Function that can be used to filter out dates within the datepicker. */
  @Input('matDatepickerFilter')
  get dateFilter() {
    return this._dateFilter;
  }
  set dateFilter(value: NgxDateFilterFn<D | null>) {
    const wasMatchingValue = this._matchesFilter(this.value);
    this._dateFilter = value;

    if (this._matchesFilter(this.value) !== wasMatchingValue) {
      this._validatorOnChange();
    }
  }
  private _dateFilter: NgxDateFilterFn<D | null>;

  /** The combined form control validator for this input. */
  protected _validator: ValidatorFn | null;

  constructor(
    elementRef: ElementRef<HTMLInputElement>,
    @Optional() dateAdapter: NgxMatDateAdapter<D>,
    @Optional() @Inject(NGX_MAT_DATE_FORMATS) dateFormats: NgxMatDateFormats,
    @Optional() @Inject(MAT_FORM_FIELD) private _formField?: _NgxMatFormFieldPartial,
  ) {
    super(elementRef, dateAdapter, dateFormats);
    this._validator = Validators.compose(super._getValidators());
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }

  /** Gets the ID of an element that should be used a description for the calendar overlay. */
  getOverlayLabelId(): string | null {
    if (this._formField) {
      return this._formField.getLabelId();
    }

    return this._elementRef.nativeElement.getAttribute('aria-labelledby');
  }

  /** Returns the palette used by the input's form field, if any. */
  getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /** Gets the value at which the calendar should start. */
  getStartValue(): D | null {
    return this.value;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._closedSubscription.unsubscribe();
  }

  /** Opens the associated datepicker. */
  protected _openPopup(): void {
    if (this._datepicker) {
      this._datepicker.open();
    }
  }

  protected _getValueFromModel(modelValue: D | null): D | null {
    return modelValue;
  }

  protected _assignValueToModel(value: D | null): void {
    if (this._model) {
      this._model.updateSelection(value, this);
    }
  }

  /** Gets the input's minimum date. */
  _getMinDate() {
    return this._min;
  }

  /** Gets the input's maximum date. */
  _getMaxDate() {
    return this._max;
  }

  /** Gets the input's date filtering function. */
  protected _getDateFilter() {
    return this._dateFilter;
  }

  protected _shouldHandleChangeEvent(event: NgxDateSelectionModelChange<D>) {
    return event.source !== this;
  }
}
