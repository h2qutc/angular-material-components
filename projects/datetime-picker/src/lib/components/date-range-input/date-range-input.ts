import { FocusOrigin } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
  SimpleChanges,
} from "@angular/core";
import { ControlContainer, NgControl, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
} from "@angular/material/form-field";
import { Subject, Subscription, merge } from "rxjs";
import { NgxMatDateAdapter } from "../../core/date-adapter";
import {
  NGX_MAT_DATE_RANGE_INPUT_PARENT,
  NgxMatDateRangeInputParent,
  NgxMatEndDateDirective,
  NgxMatStartDateDirective,
} from "../../directives/date-range-input-parts";
import { NgxMatDateRangePickerInput } from "../../directives/date-range-picker";
import {
  NgxDateRange,
  NgxMatDateSelectionModel,
} from "../../utils/date-selection-model";
import {
  NgxMatDatepickerControl,
  NgxMatDatepickerPanel,
} from "../datepicker-content/datepicker-base.component";
import { createMissingDateImplError } from "../../utils/datepicker-errors";
import {
  NgxDateFilterFn,
  _NgxMatFormFieldPartial,
  dateInputsHaveChanged,
} from "../../directives/datepicker-input-base";

let nextUniqueId = 0;

@Component({
  selector: "ngx-mat-date-range-input",
  templateUrl: "date-range-input.html",
  styleUrls: ["date-range-input.scss"],
  exportAs: "ngxMatDateRangeInput",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NgxMatDateRangeInputComponent,
    },
    {
      provide: NGX_MAT_DATE_RANGE_INPUT_PARENT,
      useExisting: NgxMatDateRangeInputComponent,
    },
  ],
})
export class NgxMatDateRangeInputComponent<D>
  implements
    MatFormFieldControl<NgxDateRange<D>>,
    NgxMatDatepickerControl<D>,
    NgxMatDateRangeInputParent<D>,
    NgxMatDateRangePickerInput<D>,
    AfterContentInit,
    OnChanges,
    OnDestroy
{
  @HostBinding("class") hostClass = "mat-date-range-input";
  @HostBinding("[class.mat-date-range-input-hide-placeholders]")
  shouldHidePlaceholders = this._shouldHidePlaceholders();

  @HostBinding("[class.mat-date-range-input-required]") _required =
    this.required;
  private _closedSubscription = Subscription.EMPTY;
  /** Unique ID for the group. */
  @HostBinding("[attr.id]") _id = `mat-date-range-input-${nextUniqueId++}`;
  @HostBinding("role") _role = `group`;
  @HostBinding("[attr.data-mat-calendar]") dataMatCalendar = this.rangePicker
    ? this.rangePicker.id
    : null;
  @HostBinding("[attr.aria-describedby]") _ariaDescribedBy: string | null =
    null;
  /** Value for the `aria-describedby` attribute of the inputs. */
  @HostBinding("[attr.aria-labelledby]") ariaLabeledBy =
    this._getAriaLabelledby();

  /** Current value of the range input. */
  get value() {
    return this._model ? this._model.selection : null;
  }

  /** Whether the control is focused. */
  focused = false;

  /** Whether the control's label should float. */
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  /** Name of the form control. */
  controlType = "mat-date-range-input";

  /**
   * Implemented as a part of `MatFormFieldControl`.
   * Set the placeholder attribute on `matStartDate` and `matEndDate`.
   * @docs-private
   */
  get placeholder() {
    const start = this._startInput?._getPlaceholder() || "";
    const end = this._endInput?._getPlaceholder() || "";
    return start || end ? `${start} ${this.separator} ${end}` : "";
  }

  /** The range picker that this input is associated with. */
  @Input()
  get rangePicker() {
    if (this._rangePicker === null) {
      throw Error(
        "mat-date-range-input must be associated with a mat-date-range-picker",
      );
    }
    return this._rangePicker;
  }
  set rangePicker(
    rangePicker: NgxMatDatepickerPanel<
      NgxMatDatepickerControl<D>,
      NgxDateRange<D>,
      D
    >,
  ) {
    if (rangePicker) {
      this._model = rangePicker.registerInput(this);
      this._rangePicker = rangePicker;
      this._closedSubscription.unsubscribe();
      this._closedSubscription = rangePicker.closedStream.subscribe(() => {
        this._startInput?._onTouched();
        this._endInput?._onTouched();
      });
      this._registerModel(this._model!);
    }
  }
  private _rangePicker: NgxMatDatepickerPanel<
    NgxMatDatepickerControl<D>,
    NgxDateRange<D>,
    D
  > | null = null;

  /** Whether the input is required. */
  @Input()
  get required(): boolean {
    return (
      this._required ??
      (this._isTargetRequired(this) ||
        this._isTargetRequired(this._startInput) ||
        this._isTargetRequired(this._endInput)) ??
      false
    );
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }

  /** Function that can be used to filter out dates within the date range picker. */
  @Input()
  get dateFilter() {
    if (this._dateFilter === null) {
      throw Error("Could not get dateFilter because it is null");
    }
    return this._dateFilter;
  }
  set dateFilter(value: NgxDateFilterFn<D | null>) {
    const start = this._startInput;
    const end = this._endInput;
    const wasMatchingStart = start && start._matchesFilter(start.value);
    if (start === null) {
      throw Error("mat-date-range-input must contain a matStartDate input");
    }
    const wasMatchingEnd = end && end._matchesFilter(start.value);
    this._dateFilter = value;

    if (start && start._matchesFilter(start.value) !== wasMatchingStart) {
      start._validatorOnChange();
    }

    if (end && end._matchesFilter(end.value) !== wasMatchingEnd) {
      end._validatorOnChange();
    }
  }
  private _dateFilter: NgxDateFilterFn<D | null> | null = null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return this._min;
  }
  set min(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value),
    );

    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._revalidate();
    }
  }
  private _min: D | null = null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value),
    );

    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._revalidate();
    }
  }
  private _max: D | null = null;

  /** Whether the input is disabled. */
  @Input()
  get disabled(): boolean {
    return this._startInput && this._endInput
      ? this._startInput.disabled && this._endInput.disabled
      : this._groupDisabled;
  }
  set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._groupDisabled) {
      this._groupDisabled = newValue;
      this.stateChanges.next(undefined);
    }
  }
  _groupDisabled = false;

  /** Whether the input is in an error state. */
  get errorState(): boolean {
    if (this._startInput && this._endInput) {
      return this._startInput.errorState || this._endInput.errorState;
    }

    return false;
  }

  /** Whether the datepicker input is empty. */
  get empty(): boolean {
    const startEmpty = this._startInput ? this._startInput.isEmpty() : false;
    const endEmpty = this._endInput ? this._endInput.isEmpty() : false;
    return startEmpty && endEmpty;
  }

  /** Date selection model currently registered with the input. */
  private _model: NgxMatDateSelectionModel<NgxDateRange<D>> | undefined;

  /** Separator text to be shown between the inputs. */
  @Input() separator = "–";

  /** Start of the comparison range that should be shown in the calendar. */
  @Input() comparisonStart: D | null = null;

  /** End of the comparison range that should be shown in the calendar. */
  @Input() comparisonEnd: D | null = null;

  @ContentChild(NgxMatStartDateDirective)
  _startInput: NgxMatStartDateDirective<D> | null = null;
  @ContentChild(NgxMatEndDateDirective)
  _endInput: NgxMatEndDateDirective<D> | null = null;

  /**
   * Implemented as a part of `MatFormFieldControl`.
   * TODO(crisbeto): change type to `AbstractControlDirective` after #18206 lands.
   * @docs-private
   */
  ngControl: NgControl | null;

  /** Emits when the input's state has changed. */
  readonly stateChanges = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() control: ControlContainer,
    @Optional() private _dateAdapter: NgxMatDateAdapter<D>,
    @Optional()
    @Inject(MAT_FORM_FIELD)
    private _formField?: _NgxMatFormFieldPartial,
  ) {
    if (this.id === null || this.id === undefined) {
      throw Error("mat-date-range-input must have an id");
    }

    if (!_dateAdapter) {
      throw createMissingDateImplError("NgxMatDateAdapter");
    }

    // The datepicker module can be used both with MDC and non-MDC form fields. We have
    // to conditionally add the MDC input class so that the range picker looks correctly.
    if (
      _formField?._elementRef.nativeElement.classList.contains(
        "mat-mdc-form-field",
      )
    ) {
      _elementRef.nativeElement.classList.add(
        "mat-mdc-input-element",
        "mat-mdc-form-field-input-control",
        "mdc-text-field__input",
      );
    }

    this.ngControl = control as unknown as NgControl;
  }

  id!: string;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;

  /**
   * Implemented as a part of `MatFormFieldControl`.
   * @docs-private
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedBy = ids.length ? ids.join(" ") : null;
  }

  /**
   * Implemented as a part of `MatFormFieldControl`.
   * @docs-private
   */
  onContainerClick(): void {
    if (this._startInput === null) {
      throw Error(
        "Could not trigger onContainerClick because start input is null",
      );
    }
    if (!this.focused && !this.disabled) {
      if (!this._model || !this._model.selection.start) {
        this._startInput.focus();
      } else {
        if (this._endInput === null) {
          throw Error(
            "Could not trigger onContainerClick because end input is null",
          );
        }
        this._endInput.focus();
      }
    }
  }

  ngAfterContentInit() {
    if (!this._startInput) {
      throw Error("mat-date-range-input must contain a matStartDate input");
    }

    if (!this._endInput) {
      throw Error("mat-date-range-input must contain a matEndDate input");
    }

    if (this._model) {
      this._registerModel(this._model);
    }

    // We don't need to unsubscribe from this, because we
    // know that the input streams will be completed on destroy.
    merge(this._startInput.stateChanges, this._endInput.stateChanges).subscribe(
      () => {
        this.stateChanges.next(undefined);
      },
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (dateInputsHaveChanged(changes, this._dateAdapter)) {
      this.stateChanges.next(undefined);
    }
  }

  ngOnDestroy() {
    this._closedSubscription.unsubscribe();
    this.stateChanges.complete();
  }

  /** Gets the date at which the calendar should start. */
  getStartValue(): D | null {
    return this.value ? this.value.start : null;
  }

  /** Gets the input's theme palette. */
  getThemePalette(): ThemePalette {
    return this._formField ? this._formField.color : undefined;
  }

  /** Gets the element to which the calendar overlay should be attached. */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField
      ? this._formField.getConnectedOverlayOrigin()
      : this._elementRef;
  }

  /** Gets the ID of an element that should be used a description for the calendar overlay. */
  getOverlayLabelId(): string | null {
    return this._formField ? this._formField.getLabelId() : null;
  }

  /** Gets the value that is used to mirror the state input. */
  _getInputMirrorValue(part: "start" | "end") {
    const input = part === "start" ? this._startInput : this._endInput;
    return input ? input.getMirrorValue() : "";
  }

  /** Whether the input placeholders should be hidden. */
  _shouldHidePlaceholders() {
    return this._startInput ? !this._startInput.isEmpty() : false;
  }

  /** Handles the value in one of the child inputs changing. */
  _handleChildValueChange() {
    this.stateChanges.next(undefined);
    this._changeDetectorRef.markForCheck();
  }

  /** Opens the date range picker associated with the input. */
  _openDatepicker() {
    if (this._rangePicker) {
      this._rangePicker.open();
    }
  }

  /** Whether the separate text should be hidden. */
  _shouldHideSeparator() {
    return (
      (!this._formField ||
        (this._formField.getLabelId() &&
          !this._formField._shouldLabelFloat())) &&
      this.empty
    );
  }

  /** Gets the value for the `aria-labelledby` attribute of the inputs. */
  _getAriaLabelledby() {
    const formField = this._formField;
    return formField && formField._hasFloatingLabel()
      ? formField._labelId
      : null;
  }

  _getStartDateAccessibleName(): string {
    if (this._startInput === null) {
      throw Error(
        "Could not get start date accessible name because it is null",
      );
    }
    return this._startInput._getAccessibleName();
  }

  _getEndDateAccessibleName(): string {
    if (this._endInput === null) {
      throw Error("Could not get end date accessible name because it is null");
    }
    return this._endInput._getAccessibleName();
  }

  /** Updates the focused state of the range input. */
  _updateFocus(origin: FocusOrigin) {
    this.focused = origin !== null;
    this.stateChanges.next();
  }

  /** Re-runs the validators on the start/end inputs. */
  private _revalidate() {
    if (this._startInput) {
      this._startInput._validatorOnChange();
    }

    if (this._endInput) {
      this._endInput._validatorOnChange();
    }
  }

  /** Registers the current date selection model with the start/end inputs. */
  private _registerModel(model: NgxMatDateSelectionModel<NgxDateRange<D>>) {
    if (this._startInput) {
      this._startInput._registerModel(model);
    }

    if (this._endInput) {
      this._endInput._registerModel(model);
    }
  }

  /** Checks whether a specific range input directive is required. */
  private _isTargetRequired(
    target: { ngControl: NgControl | null } | null,
  ): boolean | undefined {
    return target?.ngControl?.control?.hasValidator(Validators.required);
  }
}
