import { ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NgxMatDateAdapter } from './core/date-adapter';
import {
  createMissingDateImplError, DEFAULT_STEP, formatTwoDigitTimeValue,
  LIMIT_TIMES, MERIDIANS, NUMERIC_REGEX, PATTERN_INPUT_HOUR, PATTERN_INPUT_MINUTE, PATTERN_INPUT_SECOND
} from './utils/date-utils';

@Component({
  selector: 'ngx-mat-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
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
  @Input() stepHour: number = DEFAULT_STEP;
  @Input() stepMinute: number = DEFAULT_STEP;
  @Input() stepSecond: number = DEFAULT_STEP;
  @Input() showSeconds = false;
  @Input() disableMinute = false;
  @Input() enableMeridian = false;
  @Input() defaultTime: number[];
  @Input() color: ThemePalette = 'primary';

  public meridian: string = MERIDIANS.AM;

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
  public get valid(): boolean {
    return this.form.valid;
  }

  private _onChange: any = () => { };
  private _onTouched: any = () => { };
  private _disabled: boolean;
  private _model: D;

  private _destroyed: Subject<void> = new Subject<void>();

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
    if (changes.disabled || changes.disableMinute) {
      this._setDisableStates();
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
    if (val != null) {
      this._model = val;
      this._updateHourMinuteSecond();
    }

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

  /**
   * Format input
   * @param input 
   */
  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(NUMERIC_REGEX, '');
  }

  /** Toggle meridian */
  public toggleMeridian() {
    this.meridian = (this.meridian === MERIDIANS.AM) ? MERIDIANS.PM : MERIDIANS.AM;
    this.change('hour');
  }

  /** Change property of time */
  public change(prop: string, up?: boolean) {
    const next = this._getNextValueByProp(prop, up);
    this.form.controls[prop].setValue(formatTwoDigitTimeValue(next), { onlySelf: false, emitEvent: false });
    this._updateModel();
  }

  /** Update controls of form by model */
  private _updateHourMinuteSecond() {
    let _hour = this._dateAdapter.getHour(this._model);
    const _minute = this._dateAdapter.getMinute(this._model);
    const _second = this._dateAdapter.getSecond(this._model);

    if (this.enableMeridian) {
      if (_hour >= LIMIT_TIMES.meridian) {
        _hour = _hour - LIMIT_TIMES.meridian;
        this.meridian = MERIDIANS.PM;
      } else {
        this.meridian = MERIDIANS.AM;
      }
      if (_hour === 0) {
        _hour = LIMIT_TIMES.meridian;
      }
    }

    this.form.patchValue({
      hour: formatTwoDigitTimeValue(_hour),
      minute: formatTwoDigitTimeValue(_minute),
      second: formatTwoDigitTimeValue(_second)
    }, {
      emitEvent: false
    })

  }

  /** Update model */
  private _updateModel() {
    let _hour = this.hour;

    if (this.enableMeridian) {
      if (this.meridian === MERIDIANS.AM && _hour === LIMIT_TIMES.meridian) {
        _hour = 0;
      } else if (this.meridian === MERIDIANS.PM && _hour !== LIMIT_TIMES.meridian) {
        _hour = _hour + LIMIT_TIMES.meridian;
      }
    }

    if (this._model) {
      const clonedModel = this._dateAdapter.clone(this._model);

      this._dateAdapter.setHour(clonedModel, _hour);
      this._dateAdapter.setMinute(clonedModel, this.minute);
      this._dateAdapter.setSecond(clonedModel, this.second);
      this._onChange(clonedModel);
    }
  }

  /**
   * Get next value by property
   * @param prop 
   * @param up
   */
  private _getNextValueByProp(prop: string, up?: boolean): number {
    const keyProp = prop[0].toUpperCase() + prop.slice(1);
    const min = LIMIT_TIMES[`min${keyProp}`];
    let max = LIMIT_TIMES[`max${keyProp}`];

    if (prop === 'hour' && this.enableMeridian) {
      max = LIMIT_TIMES.meridian;
    }

    let next;
    if (up == null) {
      next = this[prop] % (max);
      if (prop === 'hour' && this.enableMeridian) {
        if (next === 0) next = max;
      }
    } else {
      next = up ? this[prop] + this[`step${keyProp}`] : this[prop] - this[`step${keyProp}`];
      if (prop === 'hour' && this.enableMeridian) {
        next = next % (max + 1);
        if (next === 0) next = up ? 1 : max;
      } else {
        next = next % max;
      }
      if (up) {
        next = next > max ? (next - max + min) : next;
      } else {
        next = next < min ? (next - min + max) : next;
      }

    }

    return next;
  }

  /**
   * Set disable states
   */
  private _setDisableStates() {
    if (this.disabled) {
      this.form.disable();
    }
    else {
      this.form.enable();
      if (this.disableMinute) {
        this.form.get('minute').disable();
        if (this.showSeconds) {
          this.form.get('second').disable();
        }
      }
    }
  }

}
