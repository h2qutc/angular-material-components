import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { createMissingDateImplError } from '../../helpers';
import { Color } from '../../models';
import { ColorAdapter, MAT_COLOR_FORMATS, MatColorFormats } from '../../services';
import { NgxMatColorPickerComponent } from './color-picker.component';

export class NgxMatColorPickerInputEvent {
  /** The new value for the target colorpicker input. */
  value: Color | null;

  constructor(
    /** Reference to the colorpicker input component that emitted the event. */
    public target: NgxMatColorPickerInput,
    /** Reference to the native input element associated with the colorpicker input. */
    public targetElement: HTMLElement) {
    this.value = this.target.value;
  }
}


export const MAT_COLORPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxMatColorPickerInput),
  multi: true
};


export const MAT_COLORPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxMatColorPickerInput),
  multi: true
};

@Directive({
  selector: 'input[ngxMatColorPicker]',
  providers: [
    MAT_COLORPICKER_VALUE_ACCESSOR,
    MAT_COLORPICKER_VALIDATORS,
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: NgxMatColorPickerInput },
  ],
  host: {
    '[attr.aria-haspopup]': '_picker ? "dialog" : null',
    '[attr.aria-owns]': '(_picker?.opened && _picker.id) || null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'ngxMatColorPickerInput',
})
export class NgxMatColorPickerInput implements ControlValueAccessor, OnInit, OnDestroy, Validator {

  @Input()
  set ngxMatColorPicker(value: NgxMatColorPickerComponent) {
    if (!value) {
      return;
    }

    this._picker = value;
    this._picker.registerInput(this);
    this._pickerSubscription.unsubscribe();

    this._pickerSubscription = this._picker._selectedChanged.subscribe((selected: Color) => {
      this.value = selected;
      this._cvaOnChange(selected);
      this._onTouched();
      this.colorInput.emit(new NgxMatColorPickerInputEvent(this, this._elementRef.nativeElement));
      this.colorChange.emit(new NgxMatColorPickerInputEvent(this, this._elementRef.nativeElement));
    });
  }
  _picker: NgxMatColorPickerComponent;

  /** Whether the colorpicker-input is disabled. */
  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }

    // We need to null check the `blur` method, because it's undefined during SSR.
    if (newValue && element.blur) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      element.blur();
    }
  }
  private _disabled: boolean;

  /** The value of the input. */
  @Input()
  get value(): Color | null { return this._value; }
  set value(value: Color | null) {
    const oldValue = this.value;
    this._value = value;
    this._formatValue(value);

    if (!this._adapter.sameColor(oldValue, value)) {
      this._valueChange.emit(value);
    }

  }
  private _value: Color | null;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly colorChange: EventEmitter<NgxMatColorPickerInputEvent> =
    new EventEmitter<NgxMatColorPickerInputEvent>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly colorInput: EventEmitter<NgxMatColorPickerInputEvent> =
    new EventEmitter<NgxMatColorPickerInputEvent>();

  /** Emits when the disabled state has changed */
  _disabledChange = new EventEmitter<boolean>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<Color>();

  _onTouched = () => { };

  private _cvaOnChange: (value: any) => void = () => { };

  private _validatorOnChange = () => { };

  private _pickerSubscription = Subscription.EMPTY;

  /** The combined form control validator for this input. */
  private _validator: ValidatorFn | null =
    Validators.compose([]);

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  constructor(private _elementRef: ElementRef<HTMLInputElement>,
    @Optional() private _formField: MatFormField,
    @Optional() @Inject(MAT_COLOR_FORMATS) private _colorFormats: MatColorFormats,
    private _adapter: ColorAdapter) {
    if (!this._colorFormats) {
      throw createMissingDateImplError('MAT_COLOR_FORMATS');
    }
  }

  /** Returns the palette used by the input's form field, if any. */
  public getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }


  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }


  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  /**
   * @deprecated
   * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
   */
  getPopupConnectionElementRef(): ElementRef {
    return this.getConnectedOverlayOrigin();
  }

  /**
  * Gets the element that the colorpicker popup should be connected to.
  * @return The element to connect the popup to.
  */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }


  ngOnInit() {
  }

  ngOnDestroy(): void {
    this._pickerSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: Color): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _onChange() {
    this.colorChange.emit(new NgxMatColorPickerInputEvent(this, this._elementRef.nativeElement));
  }

  _onKeydown(event: KeyboardEvent) {
    const isAltDownArrow = event.altKey && event.keyCode === DOWN_ARROW;

    if (this._picker && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
      this._picker.open();
      event.preventDefault();
    }
  }

  /** Handles blur events on the input. */
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: Color | null) {
    this._elementRef.nativeElement.value = value ? this._adapter.format(value, this._colorFormats.display.colorInput) : '';
  }

  _onInput(value: string) {
    const lastValueWasValid = this._lastValueValid;
    const nextValue = this._adapter.parse(value);

    if (!this._adapter.sameColor(nextValue, this._value)) {
      this._value = nextValue;
      this._cvaOnChange(nextValue);
      this._valueChange.emit(nextValue);
      this.colorInput.emit(new NgxMatColorPickerInputEvent(this, this._elementRef.nativeElement));
    } else if (lastValueWasValid !== this._lastValueValid) {
      this._validatorOnChange();
    }
  }

}


