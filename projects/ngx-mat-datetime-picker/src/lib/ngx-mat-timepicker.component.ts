import { ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NgxMatDateAdapter } from './core/ngx-mat-date-adapter';
import { createMissingDateImplError, DEFAULT_HOUR_PLACEHOLDER, DEFAULT_MINUTE_PLACEHOLDER, DEFAULT_SECOND_PLACEHOLDER, DEFAULT_STEP, formatTwoDigitTimeValue, LIMIT_TIMES, PATTERN_INPUT_HOUR, PATTERN_INPUT_MINUTE, PATTERN_INPUT_SECOND } from './utils/date-utils';

@Component({
  selector: 'ngx-mat-timepicker',
  templateUrl: './ngx-mat-timepicker.component.html',
  styleUrls: ['./ngx-mat-timepicker.component.scss'],
  host: {
    'class': 'ngx-mat-timepicker'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatTimepickerComponent),
      multi: true
    }
  ],
  exportAs: 'ngxMatTimepicker',
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatTimepickerComponent<D> implements ControlValueAccessor, OnInit, OnChanges {

  public form: FormGroup;

  @Input() disabled = false;
  @Input() showSpinners = true;
  @Input() hourPlaceholder = DEFAULT_HOUR_PLACEHOLDER;
  @Input() minutePlaceholder = DEFAULT_MINUTE_PLACEHOLDER;
  @Input() secondPlaceholder = DEFAULT_SECOND_PLACEHOLDER;
  @Input() stepHour: number = DEFAULT_STEP;
  @Input() stepMinute: number = DEFAULT_STEP;
  @Input() stepSecond: number = DEFAULT_STEP;
  @Input() disableSecond = false;

  /** Hour */
  private get hour() {
    let val = Number(this.form.controls['hour'].value);
    return isNaN(val) ? 0 : val;
  };

  private get minute() {
    let val = Number(this.form.controls['minute'].value);
    return isNaN(val) ? 0 : val;
  };

  private get second() {
    let val = Number(this.form.controls['second'].value);
    return isNaN(val) ? 0 : val;
  };

  /** Whether or not the form is valid */
  public get isValid(): boolean {
    return this.form.valid;
  }

  public limit = LIMIT_TIMES;

  private _onChange: any = () => { };
  private _onTouched: any = () => { };
  private _disabled: boolean;
  private _model: D;

  private _destroyed: Subject<void> = new Subject<void>();
  private _configEventForm = {
    onlySelf: false,
    emitEvent: false
  }

  public pattern = PATTERN_INPUT_HOUR;

  constructor(@Optional() public _dateAdapter: NgxMatDateAdapter<D>,
    private cd: ChangeDetectorRef, private formBuilder: FormBuilder) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('NgxMatDateAdapter');
    }
    this.form = this.formBuilder.group(
      {
        hour: [{ value: null, disabled: this.disabled }, [Validators.required, Validators.pattern(PATTERN_INPUT_HOUR)]],
        minute: [{ value: null, disabled: this.disabled }, [Validators.required, Validators.pattern(PATTERN_INPUT_MINUTE)]],
        second: [{ value: null, disabled: this.disabled }, [Validators.required, Validators.pattern(PATTERN_INPUT_SECOND)]]
      });
  }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this._destroyed), debounceTime(400)).subscribe(val => {
      this._updateModel();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled && !changes.disabled.firstChange) {
      this.disabled ? this.form.disable() : this.form.enable();
    }

  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Writes a new value to the element.
   * @param obj
   */
  writeValue(val: D): void {
    this._model = val || this._dateAdapter.today();
    this._updateHourMinuteSecond();
  }

  /** Registers a callback function that is called when the control's value changes in the UI. */
  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  /**
   * Set the function to be called when the control receives a touch event.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /** Enables or disables the appropriate DOM element */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cd.markForCheck();
  }

  /** Change property of time */
  public change(prop: string, up: boolean) {
    console.log('change');
    //hour => stepHour
    const keyProp = prop[0].toUpperCase() + prop.slice(1);
    let nextVal = up ? this[prop] + this[`step${keyProp}`] : this[prop] - this[`step${keyProp}`];
    const min = this.limit[`min${keyProp}`];
    const max = this.limit[`max${keyProp}`];
    if (up) {
      nextVal = nextVal > max ? (nextVal - max + min - 1) : nextVal;
    } else {
      nextVal = nextVal < min ? (nextVal - min + max + 1) : nextVal;
    }
    this.form.controls[prop].setValue(formatTwoDigitTimeValue(nextVal), this._configEventForm);
    this._updateModel();
  }

  /** Update controls of form by model */
  private _updateHourMinuteSecond() {
    const _hour = this._dateAdapter.getHour(this._model);
    const _minute = this._dateAdapter.getMinute(this._model);
    const _second = this._dateAdapter.getSecond(this._model);

    this.form.controls['hour'].setValue(formatTwoDigitTimeValue(_hour));
    this.form.controls['minute'].setValue(formatTwoDigitTimeValue(_minute));
    this.form.controls['second'].setValue(formatTwoDigitTimeValue(_second));
  }

  /** Update model */
  private _updateModel() {
    this._dateAdapter.setHour(this._model, this.hour);
    this._dateAdapter.setMinute(this._model, this.minute);
    this._dateAdapter.setSecond(this._model, this.second);
    this._onChange(this._model);
  }

}
