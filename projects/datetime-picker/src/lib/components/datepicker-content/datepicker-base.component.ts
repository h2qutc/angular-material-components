import { AnimationEvent } from "@angular/animations";
import { ListKeyManagerModifierKey } from "@angular/cdk/a11y";
import { Directionality } from "@angular/cdk/bidi";
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceStringArray,
} from "@angular/cdk/coercion";
import {
  DOWN_ARROW,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
  hasModifierKey,
} from "@angular/cdk/keycodes";
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
} from "@angular/cdk/overlay";
import { _getFocusedElementPierceShadowDom } from "@angular/cdk/platform";
import {
  ComponentPortal,
  ComponentType,
  TemplatePortal,
} from "@angular/cdk/portal";
import { DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
  HostBinding,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { Observable, Subject, Subscription, merge } from "rxjs";
import { filter, take } from "rxjs/operators";
import {
  NgxMatCalendarComponent,
  NgxMatCalendarView,
} from "../calendar/calendar";
import {
  NgxMatCalendarCellClassFunction,
  NgxMatCalendarUserEvent,
} from "../calendar-body/calendar-body.component";
import { NgxMatDateAdapter } from "../../core/date-adapter";
import {
  NGX_MAT_DATE_RANGE_SELECTION_STRATEGY,
  NgxMatDateRangeSelectionStrategy,
} from "../../utils/date-range-selection-strategy";
import {
  NgxDateRange,
  NgxExtractDateTypeFromSelection,
  NgxMatDateSelectionModel,
} from "../../utils/date-selection-model";
import { ngxMatDatepickerAnimations } from "../../utils/datepicker-animations";
import { createMissingDateImplError } from "../../utils/datepicker-errors";
import { NgxDateFilterFn } from "../../directives/datepicker-input-base";
import { NgxMatDatepickerIntl } from "../../utils/datepicker-intl";
import { DEFAULT_STEP } from "../../utils/date-utils";

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

/** Injection token that determines the scroll handling while the calendar is open. */
export const NGX_MAT_DATEPICKER_SCROLL_STRATEGY =
  new InjectionToken<ScrollStrategy>("ngx-mat-datepicker-scroll-strategy");

/** @docs-private */
export function NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay,
): ScrollStrategy {
  return overlay.scrollStrategies.reposition();
}

/** Possible positions for the datepicker dropdown along the X axis. */
export type NgxDatepickerDropdownPositionX = "start" | "end";

/** Possible positions for the datepicker dropdown along the Y axis. */
export type NgxDatepickerDropdownPositionY = "above" | "below";

/** @docs-private */
export const NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: NGX_MAT_DATEPICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};

/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: "ngx-mat-datepicker-content",
  templateUrl: "datepicker-content.component.html",
  styleUrls: ["datepicker-content.component.scss"],
  animations: [
    ngxMatDatepickerAnimations.transformPanel,
    ngxMatDatepickerAnimations.fadeInCalendar,
  ],
  exportAs: "ngxMatDatepickerContent",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatDatepickerContentComponent<
    S,
    D = NgxExtractDateTypeFromSelection<S>,
  >
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Reference to the datepicker that created the overlay. */
  datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<D>, S, D> | null =
    null;
  @HostBinding("class") hostClass = "mat-datepicker-content";
  @HostBinding("[class.mat-datepicker-content-touch]")
  matDatepickerContentTouch = this.datepicker ? this.datepicker.touchUi : false;
  @HostBinding("[class.mat-datepicker-content-touch-with-time]")
  matDatepickerContentTouchWithTime = this.datepicker
    ? !this.datepicker.hideTime
    : false;
  @HostBinding("(@transformPanel.start)") startTransformPanel = (
    $event: AnimationEvent,
  ) => this._handleAnimationEvent($event);
  @HostBinding("(@transformPanel.done)") doneTransformPanel = (
    $event: AnimationEvent,
  ) => this._handleAnimationEvent($event);

  /** Current state of the animation. */
  @HostBinding("[@transformPanel]") _animationState:
    | "enter-dropdown"
    | "enter-dialog"
    | "void"
    | null = null;
  @Input({ required: true }) color: ThemePalette;
  private _subscriptions = new Subscription();
  private _model: NgxMatDateSelectionModel<S, D> | null = null;
  /** Reference to the internal calendar component. */
  @ViewChild(NgxMatCalendarComponent)
  _calendar: NgxMatCalendarComponent<D> | null = null;

  /** Start of the comparison range. */
  comparisonStart: D | null = null;

  /** End of the comparison range. */
  comparisonEnd: D | null = null;

  /** ARIA Accessible name of the `<input matStartDate/>` */
  startDateAccessibleName: string | null = null;

  /** ARIA Accessible name of the `<input matEndDate/>` */
  endDateAccessibleName: string | null = null;

  /** Whether the datepicker is above or below the input. */
  _isAbove: boolean = false;

  /** Emits when an animation has finished. */
  readonly _animationDone = new Subject<void>();

  /** Whether there is an in-progress animation. */
  _isAnimating = false;

  /** Text for the close button. */
  _closeButtonText: string;

  /** Whether the close button currently has focus. */
  _closeButtonFocused: boolean = false;

  /** Portal with projected action buttons. */
  _actionsPortal: TemplatePortal | null = null;

  /** Id of the label for the `role="dialog"` element. */
  _dialogLabelId: string | null = null;

  get isViewMonth(): boolean {
    if (!this._calendar || this._calendar.currentView == null) return true;
    return this._calendar.currentView == "month";
  }

  _modelTime: D | null = null;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _globalModel: NgxMatDateSelectionModel<S, D>,
    private _dateAdapter: NgxMatDateAdapter<D>,
    @Optional()
    @Inject(NGX_MAT_DATE_RANGE_SELECTION_STRATEGY)
    private _rangeSelectionStrategy: NgxMatDateRangeSelectionStrategy<D>,
    intl: NgxMatDatepickerIntl,
  ) {
    this._closeButtonText = intl.closeCalendarLabel;
    if (this.datepicker === null) {
      throw Error(
        "Could not initialize the datepicker content component because the associated datepicker is missing.",
      );
    }
  }

  ngOnInit() {
    if (!this.datepicker) {
      throw Error(
        "MatDatepickerContent must be associated with a MatDatepicker instance.",
      );
    }
    this._animationState = this.datepicker.touchUi
      ? "enter-dialog"
      : "enter-dropdown";
  }

  ngAfterViewInit() {
    if (!this.datepicker) {
      throw Error(
        "MatDatepickerContent must be associated with a MatDatepicker instance.",
      );
    }
    this._subscriptions.add(
      this.datepicker.stateChanges.subscribe(() => {
        this._changeDetectorRef.markForCheck();
      }),
    );
    if (!this._calendar) {
      throw Error("MatDatepickerContent must have an NgxMatCalendar instance.");
    }
    this._calendar.focusActiveCell();
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
    this._animationDone.complete();
  }

  onTimeChanged(selectedDateWithTime: D | null) {
    const userEvent: NgxMatCalendarUserEvent<D | null> = {
      value: selectedDateWithTime,
      event: null,
    };

    this._updateUserSelectionWithCalendarUserEvent(userEvent);
  }

  _handleUserSelection(event: NgxMatCalendarUserEvent<D | null>) {
    this._updateUserSelectionWithCalendarUserEvent(event);
    if (!this.datepicker) {
      throw Error(
        "MatDatepickerContent must be associated with a MatDatepicker instance.",
      );
    }
    // Delegate closing the overlay to the actions.
    if (this.datepicker.hideTime) {
      if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
        this.datepicker.close();
      }
    }
  }

  private _updateUserSelectionWithCalendarUserEvent(
    event: NgxMatCalendarUserEvent<D | null>,
  ) {
    if (!this._model) {
      throw Error(
        "Could not update the user selection on the calendar because the NgxMatDateSelectionModel is missing.",
      );
    }
    const selection = this._model.selection;
    const value = event.value;
    const isRange = selection instanceof NgxDateRange;

    // If we're selecting a range and we have a selection strategy, always pass the value through
    // there. Otherwise don't assign null values to the model, unless we're selecting a range.
    // A null value when picking a range means that the user cancelled the selection (e.g. by
    // pressing escape), whereas when selecting a single value it means that the value didn't
    // change. This isn't very intuitive, but it's here for backwards-compatibility.
    if (isRange && this._rangeSelectionStrategy) {
      if (!event.event) {
        throw Error(
          "The user event must contain the native event on the calendar when selecting a range.",
        );
      }

      const newSelection = this._rangeSelectionStrategy.selectionFinished(
        value,
        selection as unknown as NgxDateRange<D>,
        event.event,
      );
      this._model.updateSelection(newSelection as unknown as S, this);
    } else {
      const isSameTime = this._dateAdapter.isSameTime(
        selection as unknown as D,
        value,
      );
      const isSameDate = this._dateAdapter.sameDate(
        value,
        selection as unknown as D,
      );
      const isSame = isSameDate && isSameTime;

      if (value && (isRange || !isSame)) {
        this._model.add(value);
      }
    }
  }

  _handleUserDragDrop(event: NgxMatCalendarUserEvent<NgxDateRange<D>>) {
    if (!this._model) {
      throw Error(
        "Could not update the user selection on the calendar because the NgxMatDateSelectionModel is missing.",
      );
    }
    this._model.updateSelection(event.value as unknown as S, this);
  }

  _startExitAnimation() {
    this._animationState = "void";
    this._changeDetectorRef.markForCheck();
  }

  _handleAnimationEvent(event: AnimationEvent) {
    this._isAnimating = event.phaseName === "start";

    if (!this._isAnimating) {
      this._animationDone.next();
    }
  }

  _getSelected() {
    if (!this._model) {
      throw Error(
        "Could not get the selected value from the calendar because the NgxMatDateSelectionModel is missing.",
      );
    }
    this._modelTime = this._model.selection as unknown as D;
    return this._model.selection as unknown as D | NgxDateRange<D> | null;
  }

  /** Applies the current pending selection to the global model. */
  _applyPendingSelection() {
    if (!this._model) {
      throw Error(
        "Could not apply the pending selection because the NgxMatDateSelectionModel is missing.",
      );
    }
    if (this._model !== this._globalModel) {
      this._globalModel.updateSelection(this._model.selection, this);
    }
  }

  /**
   * Assigns a new portal containing the datepicker actions.
   * @param portal Portal with the actions to be assigned.
   * @param forceRerender Whether a re-render of the portal should be triggered. This isn't
   * necessary if the portal is assigned during initialization, but it may be required if it's
   * added at a later point.
   */
  _assignActions(
    portal: TemplatePortal<unknown> | null,
    forceRerender: boolean,
  ) {
    // If we have actions, clone the model so that we have the ability to cancel the selection,
    // otherwise update the global model directly. Note that we want to assign this as soon as
    // possible, but `_actionsPortal` isn't available in the constructor so we do it in `ngOnInit`.
    this._model = portal ? this._globalModel.clone() : this._globalModel;
    this._actionsPortal = portal;

    if (forceRerender) {
      this._changeDetectorRef.detectChanges();
    }
  }
}

/** Form control that can be associated with a datepicker. */
export interface NgxMatDatepickerControl<D> {
  getStartValue(): D | null;
  getThemePalette(): ThemePalette;
  min: D | null;
  max: D | null;
  disabled: boolean;
  dateFilter: NgxDateFilterFn<D | null> | null;
  getConnectedOverlayOrigin(): ElementRef;
  getOverlayLabelId(): string | null;
  stateChanges: Observable<void>;
}

/** A datepicker that can be attached to a {@link NgxMatDatepickerControl}. */
export interface NgxMatDatepickerPanel<
  C extends NgxMatDatepickerControl<D>,
  S,
  D = NgxExtractDateTypeFromSelection<S>,
> {
  /** Stream that emits whenever the date picker is closed. */
  closedStream: EventEmitter<void>;
  /** Color palette to use on the datepicker's calendar. */
  color: ThemePalette;
  /** The input element the datepicker is associated with. */
  datepickerInput: C | null;
  /** Whether the datepicker pop-up should be disabled. */
  disabled: boolean;
  /** The id for the datepicker's calendar. */
  id: string;
  /** Whether the datepicker is open. */
  opened: boolean;
  /** Stream that emits whenever the date picker is opened. */
  openedStream: EventEmitter<void>;
  /** Emits when the datepicker's state changes. */
  stateChanges: Subject<void>;
  /** Opens the datepicker. */
  open(): void;
  /** Register an input with the datepicker. */
  registerInput(input: C): NgxMatDateSelectionModel<S, D>;
}

/** Base class for a datepicker. */
@Directive()
export abstract class NgxMatDatepickerBase<
    C extends NgxMatDatepickerControl<D>,
    S,
    D = NgxExtractDateTypeFromSelection<S>,
  >
  implements NgxMatDatepickerPanel<C, S, D>, OnDestroy, OnChanges
{
  private readonly _scrollStrategy: ScrollStrategy;
  private _inputStateChanges = Subscription.EMPTY;
  private _document = inject(DOCUMENT);

  /** An input indicating the type of the custom header component for the calendar, if set. */
  @Input() calendarHeaderComponent: ComponentType<unknown> | null = null;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return (
      this._startAt ||
      (this.datepickerInput ? this.datepickerInput.getStartValue() : null)
    );
  }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value),
    );
  }
  private _startAt: D | null = null;

  /** The view that the calendar should start in. */
  @Input() startView: "month" | "year" | "multi-year" = "month";

  /** Color palette to use on the datepicker's calendar. */
  @Input()
  get color(): ThemePalette {
    return (
      this._color ||
      (this.datepickerInput
        ? this.datepickerInput.getThemePalette()
        : undefined)
    );
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a dropdown and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }
  set touchUi(value: BooleanInput) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  @Input()
  get hideTime(): boolean {
    return this._hideTime;
  }
  set hideTime(value: boolean) {
    this._hideTime = coerceBooleanProperty(value);
  }
  public _hideTime = false;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this.datepickerInput
      ? this.datepickerInput.disabled
      : this._disabled;
  }
  set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this.stateChanges.next(undefined);
    }
  }
  public _disabled: boolean = false;

  /** Preferred position of the datepicker in the X axis. */
  @Input()
  xPosition: NgxDatepickerDropdownPositionX = "start";

  /** Preferred position of the datepicker in the Y axis. */
  @Input()
  yPosition: NgxDatepickerDropdownPositionY = "below";

  /**
   * Whether to restore focus to the previously-focused element when the calendar is closed.
   * Note that automatic focus restoration is an accessibility feature and it is recommended that
   * you provide your own equivalent, if you decide to turn it off.
   */
  @Input()
  get restoreFocus(): boolean {
    return this._restoreFocus;
  }
  set restoreFocus(value: BooleanInput) {
    this._restoreFocus = coerceBooleanProperty(value);
  }
  private _restoreFocus = true;

  /**
   * Emits selected year in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits selected month in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits when the current view changes.
   */
  @Output() readonly viewChanged: EventEmitter<NgxMatCalendarView> =
    new EventEmitter<NgxMatCalendarView>(true);

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass: NgxMatCalendarCellClassFunction<D> | null = null;

  /** Emits when the datepicker has been opened. */
  @Output() readonly openedStream = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output() readonly closedStream = new EventEmitter<void>();

  /**
   * Classes to be passed to the date picker panel.
   * Supports string and string array values, similar to `ngClass`.
   */
  @Input()
  get panelClass(): string | string[] {
    if (this._panelClass === null) {
      throw Error(
        "The panelClass property is required for the datepicker component.",
      );
    }
    return this._panelClass;
  }
  set panelClass(value: string | string[]) {
    this._panelClass = coerceStringArray(value);
  }
  private _panelClass: string[] | null = null;

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: BooleanInput) {
    coerceBooleanProperty(value) ? this.open() : this.close();
  }
  private _opened = false;

  /** Whether the timepicker'spinners is shown. */
  @Input()
  get showSpinners(): boolean {
    return this._showSpinners;
  }
  set showSpinners(value: boolean) {
    this._showSpinners = value;
  }
  public _showSpinners = true;

  /** Whether the second part is disabled. */
  @Input()
  get showSeconds(): boolean {
    return this._showSeconds;
  }
  set showSeconds(value: boolean) {
    this._showSeconds = value;
  }
  public _showSeconds = false;

  /** Step hour */
  @Input()
  get stepHour(): number {
    return this._stepHour;
  }
  set stepHour(value: number) {
    this._stepHour = value;
  }
  public _stepHour: number = DEFAULT_STEP;

  /** Step minute */
  @Input()
  get stepMinute(): number {
    return this._stepMinute;
  }
  set stepMinute(value: number) {
    this._stepMinute = value;
  }
  public _stepMinute: number = DEFAULT_STEP;

  /** Step second */
  @Input()
  get stepSecond(): number {
    return this._stepSecond;
  }
  set stepSecond(value: number) {
    this._stepSecond = value;
  }
  public _stepSecond: number = DEFAULT_STEP;

  /** Enable meridian */
  @Input()
  get enableMeridian(): boolean {
    return this._enableMeridian;
  }
  set enableMeridian(value: boolean) {
    this._enableMeridian = value;
  }
  public _enableMeridian: boolean = false;

  /** disable minute */
  @Input()
  get disableMinute(): boolean {
    return this._disableMinute;
  }
  set disableMinute(value: boolean) {
    this._disableMinute = value;
  }
  public _disableMinute: boolean = false;

  /** Step second */
  @Input()
  get defaultTime(): number[] {
    if (this._defaultTime === null) {
      throw Error(
        "The defaultTime property is required for the datepicker component.",
      );
    }
    return this._defaultTime;
  }
  set defaultTime(value: number[]) {
    this._defaultTime = value;
  }
  public _defaultTime: number[] | null = null;

  /** The id for the datepicker calendar. */
  id: string = `mat-datepicker-${datepickerUid++}`;

  /** The minimum selectable date. */
  _getMinDate(): D | null {
    return this.datepickerInput && this.datepickerInput.min;
  }

  /** The maximum selectable date. */
  _getMaxDate(): D | null {
    return this.datepickerInput && this.datepickerInput.max;
  }

  _getDateFilter(): NgxDateFilterFn<D> | null {
    if (this.datepickerInput === null) {
      throw Error(
        "Could not retrieve date filter function for the datepicker because the associated input is missing.",
      );
    }
    if (!this.datepickerInput.dateFilter) {
      return null;
    }
    return this.datepickerInput && this.datepickerInput.dateFilter;
  }

  /** A reference to the overlay into which we've rendered the calendar. */
  private _overlayRef: OverlayRef | null = null;

  /** Reference to the component instance rendered in the overlay. */
  private _componentRef: ComponentRef<
    NgxMatDatepickerContentComponent<S, D>
  > | null = null;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
  private _backdropHarnessClass = `${this.id}-backdrop`;

  /** Currently-registered actions portal. */
  private _actionsPortal: TemplatePortal | null = null;

  /** The input element this datepicker is associated with. */
  datepickerInput: C | null = null;

  /** Emits when the datepicker's state changes. */
  readonly stateChanges = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    @Inject(NGX_MAT_DATEPICKER_SCROLL_STRATEGY) scrollStrategy: ScrollStrategy,
    @Optional() private _dateAdapter: NgxMatDateAdapter<D>,
    @Optional() private _dir: Directionality,
    private _model: NgxMatDateSelectionModel<S, D>,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError("NgxMatDateAdapter");
    }

    this._scrollStrategy = scrollStrategy;
  }

  ngOnChanges(changes: SimpleChanges) {
    const positionChange = changes["xPosition"] || changes["yPosition"];

    if (positionChange && !positionChange.firstChange && this._overlayRef) {
      const positionStrategy = this._overlayRef.getConfig().positionStrategy;

      if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
        this._setConnectedPositions(positionStrategy);

        if (this.opened) {
          this._overlayRef.updatePosition();
        }
      }
    }

    this.stateChanges.next(undefined);
  }

  ngOnDestroy() {
    this._destroyOverlay();
    this.close();
    this._inputStateChanges.unsubscribe();
    this.stateChanges.complete();
  }

  /** Selects the given date */
  select(date: D): void {
    this._model.add(date);
  }

  /** Emits the selected year in multiyear view */
  _selectYear(normalizedYear: D): void {
    this.yearSelected.emit(normalizedYear);
  }

  /** Emits selected month in year view */
  _selectMonth(normalizedMonth: D): void {
    this.monthSelected.emit(normalizedMonth);
  }

  /** Emits changed view */
  _viewChanged(view: NgxMatCalendarView): void {
    this.viewChanged.emit(view);
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   * @returns Selection model that the input should hook itself up to.
   */
  registerInput(input: C): NgxMatDateSelectionModel<S, D> {
    if (this.datepickerInput) {
      throw Error(
        "A MatDatepicker can only be associated with a single input.",
      );
    }
    this._inputStateChanges.unsubscribe();
    this.datepickerInput = input;
    this._inputStateChanges = input.stateChanges.subscribe(() =>
      this.stateChanges.next(undefined),
    );
    return this._model;
  }

  /**
   * Registers a portal containing action buttons with the datepicker.
   * @param portal Portal to be registered.
   */
  registerActions(portal: TemplatePortal): void {
    if (this._actionsPortal) {
      throw Error(
        "A MatDatepicker can only be associated with a single actions row.",
      );
    }
    this._actionsPortal = portal;
    this._componentRef?.instance._assignActions(portal, true);
  }

  /**
   * Removes a portal containing action buttons from the datepicker.
   * @param portal Portal to be removed.
   */
  removeActions(portal: TemplatePortal): void {
    if (portal === this._actionsPortal) {
      this._actionsPortal = null;
      this._componentRef?.instance._assignActions(null, true);
    }
  }

  /** Open the calendar. */
  open(): void {
    // Skip reopening if there's an in-progress animation to avoid overlapping
    // sequences which can cause "changed after checked" errors. See #25837.
    if (
      this._opened ||
      this.disabled ||
      this._componentRef?.instance._isAnimating
    ) {
      return;
    }

    if (!this.datepickerInput) {
      throw Error(
        "Attempted to open an MatDatepicker with no associated input.",
      );
    }

    this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
    this._openOverlay();
    this._opened = true;
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    // Skip reopening if there's an in-progress animation to avoid overlapping
    // sequences which can cause "changed after checked" errors. See #25837.
    if (!this._opened || this._componentRef?.instance._isAnimating) {
      return;
    }

    const canRestoreFocus =
      this._restoreFocus &&
      this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === "function";

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
      }
    };

    if (this._componentRef) {
      const { instance, location } = this._componentRef;
      instance._startExitAnimation();
      instance._animationDone.pipe(take(1)).subscribe(() => {
        const activeElement = this._document.activeElement;

        // Since we restore focus after the exit animation, we have to check that
        // the user didn't move focus themselves inside the `close` handler.
        if (
          canRestoreFocus &&
          (!activeElement ||
            activeElement === this._document.activeElement ||
            location.nativeElement.contains(activeElement))
        ) {
          this._focusedElementBeforeOpen!.focus();
        }

        this._focusedElementBeforeOpen = null;
        this._destroyOverlay();
      });
    }

    if (canRestoreFocus) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Applies the current pending selection on the overlay to the model. */
  _applyPendingSelection() {
    this._componentRef?.instance?._applyPendingSelection();
  }

  /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
  protected _forwardContentValues(
    instance: NgxMatDatepickerContentComponent<S, D>,
  ) {
    if (!this.datepickerInput) {
      throw Error(
        "Could not forward content values to the datepicker instance because the datepicker input is missing.",
      );
    }
    instance.datepicker = this;
    instance.color = this.color;
    instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
    instance._assignActions(this._actionsPortal, false);
  }

  /** Opens the overlay with the calendar. */
  private _openOverlay(): void {
    this._destroyOverlay();

    const isDialog = this.touchUi;
    const portal = new ComponentPortal<NgxMatDatepickerContentComponent<S, D>>(
      NgxMatDatepickerContentComponent,
      this._viewContainerRef,
    );
    const overlayRef: OverlayRef = (this._overlayRef = this._overlay.create(
      new OverlayConfig({
        positionStrategy: isDialog
          ? this._getDialogStrategy()
          : this._getDropdownStrategy(),
        hasBackdrop: true,
        backdropClass: [
          isDialog
            ? "cdk-overlay-dark-backdrop"
            : "mat-overlay-transparent-backdrop",
          this._backdropHarnessClass,
        ],
        direction: this._dir,
        scrollStrategy: isDialog
          ? this._overlay.scrollStrategies.block()
          : this._scrollStrategy,
        panelClass: `mat-datepicker-${isDialog ? "dialog" : "popup"}`,
      }),
    ));

    this._getCloseStream(overlayRef).subscribe((event) => {
      if (event) {
        event.preventDefault();
      }
      this.close();
    });

    // The `preventDefault` call happens inside the calendar as well, however focus moves into
    // it inside a timeout which can give browsers a chance to fire off a keyboard event in-between
    // that can scroll the page (see #24969). Always block default actions of arrow keys for the
    // entire overlay so the page doesn't get scrolled by accident.
    overlayRef.keydownEvents().subscribe((event) => {
      const keyCode = event.keyCode;

      if (
        keyCode === UP_ARROW ||
        keyCode === DOWN_ARROW ||
        keyCode === LEFT_ARROW ||
        keyCode === RIGHT_ARROW ||
        keyCode === PAGE_UP ||
        keyCode === PAGE_DOWN
      ) {
        event.preventDefault();
      }
    });

    this._componentRef = overlayRef.attach(portal);
    this._forwardContentValues(this._componentRef.instance);

    // Update the position once the calendar has rendered. Only relevant in dropdown mode.
    if (!isDialog) {
      this._ngZone.onStable
        .pipe(take(1))
        .subscribe(() => overlayRef.updatePosition());
    }
  }

  /** Destroys the current overlay. */
  private _destroyOverlay() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = this._componentRef = null;
    }
  }

  /** Gets a position strategy that will open the calendar as a dropdown. */
  private _getDialogStrategy() {
    return this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
  }

  /** Gets a position strategy that will open the calendar as a dropdown. */
  private _getDropdownStrategy() {
    if (this.datepickerInput === null) {
      throw Error(
        "Could not get dropdown position strategy because the datepicker input is missing.",
      );
    }
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn(".mat-datepicker-content")
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition();

    return this._setConnectedPositions(strategy);
  }

  /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
  private _setConnectedPositions(strategy: FlexibleConnectedPositionStrategy) {
    const primaryX = this.xPosition === "end" ? "end" : "start";
    const secondaryX = primaryX === "start" ? "end" : "start";
    const primaryY = this.yPosition === "above" ? "bottom" : "top";
    const secondaryY = primaryY === "top" ? "bottom" : "top";

    return strategy.withPositions([
      {
        originX: primaryX,
        originY: secondaryY,
        overlayX: primaryX,
        overlayY: primaryY,
      },
      {
        originX: primaryX,
        originY: primaryY,
        overlayX: primaryX,
        overlayY: secondaryY,
      },
      {
        originX: secondaryX,
        originY: secondaryY,
        overlayX: secondaryX,
        overlayY: primaryY,
      },
      {
        originX: secondaryX,
        originY: primaryY,
        overlayX: secondaryX,
        overlayY: secondaryY,
      },
    ]);
  }

  /** Gets an observable that will emit when the overlay is supposed to be closed. */
  private _getCloseStream(overlayRef: OverlayRef) {
    const ctrlShiftMetaModifiers: ListKeyManagerModifierKey[] = [
      "ctrlKey",
      "shiftKey",
      "metaKey",
    ];
    return merge(
      overlayRef.backdropClick(),
      overlayRef.detachments(),
      overlayRef.keydownEvents().pipe(
        filter((event) => {
          const escapeNoModifier =
            event.key === "Escape" && !hasModifierKey(event);
          const arrowUpAndCtrl =
            this.datepickerInput &&
            hasModifierKey(event, "altKey") &&
            event.key === "ArrowUp" &&
            ctrlShiftMetaModifiers.every(
              (modifier: ListKeyManagerModifierKey) =>
                !hasModifierKey(event, modifier),
            );
          return escapeNoModifier || !!arrowUpAndCtrl;
        }),
      ),
    );
  }
}
