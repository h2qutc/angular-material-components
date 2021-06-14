/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ContentChild, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, Optional, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { CanColor, CanColorCtor, mixinColor, ThemePalette } from '@angular/material/core';
import { MatCalendarCellCssClasses, matDatepickerAnimations, MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NgxMatCalendar } from './calendar';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxMatDatetimeInput } from './datetime-input';
import { NgxMatTimepickerComponent } from './timepicker.component';
import { createMissingDateImplError, DEFAULT_STEP } from './utils/date-utils';

/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;

// Boilerplate for applying mixins to MatDatepickerContent.
/** @docs-private */
class MatDatepickerContentBase {
  constructor(public _elementRef: ElementRef) { }
}
const _MatDatepickerContentMixinBase: CanColorCtor & typeof MatDatepickerContentBase =
  mixinColor(MatDatepickerContentBase);

/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * NgxMatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
@Component({
  selector: 'ngx-mat-datetime-content',
  templateUrl: 'datetime-content.component.html',
  styleUrls: ['datetime-content.component.scss'],
  host: {
    'class': 'mat-datepicker-content',
    '[@transformPanel]': '"enter"',
    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
  },
  animations: [
    matDatepickerAnimations.transformPanel,
    matDatepickerAnimations.fadeInCalendar,
  ],
  exportAs: 'ngxMatDatetimeContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['color'],
})
export class NgxMatDatetimeContent<D> extends _MatDatepickerContentMixinBase
  implements AfterViewInit, CanColor {

  /** Reference to the internal calendar component. */
  @ViewChild(NgxMatCalendar) _calendar: NgxMatCalendar<D>;

  /** Reference to the internal time picker component. */
  @ViewChild(NgxMatTimepickerComponent) _timePicker: NgxMatTimepickerComponent<D>;

  /** Reference to the datepicker that created the overlay. */
  datepicker: NgxMatDatetimePicker<D>;

  /** Whether the datepicker is above or below the input. */
  _isAbove: boolean;

  /** Whether or not the selected date is valid (min,max...) */
  get valid(): boolean {
    if (this.datepicker.hideTime) return this.datepicker.valid;
    return this._timePicker && this._timePicker.valid && this.datepicker.valid;
  }

  get isViewMonth(): boolean {
    if (!this._calendar || this._calendar.currentView == null) return true;
    return this._calendar.currentView == 'month';
  }

  _templateCustomIconPortal: TemplatePortal<any>;

  constructor(elementRef: ElementRef, private cd: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef) {
    super(elementRef);
  }

  ngAfterViewInit() {
    this._calendar.focusActiveCell();
    if (this.datepicker._customIcon) {
      this._templateCustomIconPortal = new TemplatePortal(
        this.datepicker._customIcon,
        this._viewContainerRef
      );
      this.cd.detectChanges();
    }

  }

}

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
  selector: 'ngx-mat-datetime-picker',
  template: '',
  exportAs: 'ngxMatDatetimePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatDatetimePicker<D> implements OnDestroy, CanColor {

  private _scrollStrategy: () => ScrollStrategy;

  /** An input indicating the type of the custom header component for the calendar, if set. */
  @Input() calendarHeaderComponent: ComponentType<any>;

  /** Custom icon set by the consumer. */
  @ContentChild(TemplateRef) _customIcon: TemplateRef<any>;

  /** The date to open the calendar to initially. */
  @Input()
  get startAt(): D | null {
    // If an explicit startAt is set we start there, otherwise we start at whatever the currently
    // selected value is.
    return this._startAt || (this.datepickerInput ? this.datepickerInput.value : null);
  }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** The view that the calendar should start in. */
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';

  /** Default Color palette to use on the datepicker's calendar. */
  @Input()
  get defaultColor(): ThemePalette {
    return this._defaultColor;
  }
  set defaultColor(value: ThemePalette) {
    this._defaultColor = value;
  }
  _defaultColor: ThemePalette = 'primary';

  /** Color palette to use on the datepicker's calendar. */
  @Input()
  get color(): ThemePalette {
    return this._color ||
      (this.datepickerInput ? this.datepickerInput._getThemePalette() : 'primary');
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette;

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean { return this._touchUi; }
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  @Input()
  get hideTime(): boolean { return this._hideTime; }
  set hideTime(value: boolean) {
    this._hideTime = coerceBooleanProperty(value);
  }
  public _hideTime = false;

  /** Whether the datepicker pop-up should be disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled === undefined && this.datepickerInput ?
      this.datepickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this.stateChanges.next(newValue);
    }
  }
  public _disabled: boolean;

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

  /** Classes to be passed to the date picker panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[];

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass: (date: D) => MatCalendarCellCssClasses;

  /** Emits when the datepicker has been opened. */
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();


  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.close(); }
  private _opened = false;

  /** Whether the timepicker'spinners is shown. */
  @Input()
  get showSpinners(): boolean { return this._showSpinners; }
  set showSpinners(value: boolean) { this._showSpinners = value; }
  public _showSpinners = true;

  /** Whether the second part is disabled. */
  @Input()
  get showSeconds(): boolean { return this._showSeconds; }
  set showSeconds(value: boolean) { this._showSeconds = value; }
  public _showSeconds = false;

  /** Step hour */
  @Input()
  get stepHour(): number { return this._stepHour; }
  set stepHour(value: number) { this._stepHour = value; }
  public _stepHour: number = DEFAULT_STEP;

  /** Step minute */
  @Input()
  get stepMinute(): number { return this._stepMinute; }
  set stepMinute(value: number) { this._stepMinute = value; }
  public _stepMinute: number = DEFAULT_STEP;

  /** Step second */
  @Input()
  get stepSecond(): number { return this._stepSecond; }
  set stepSecond(value: number) { this._stepSecond = value; }
  public _stepSecond: number = DEFAULT_STEP;

  /** Enable meridian */
  @Input()
  get enableMeridian(): boolean { return this._enableMeridian; }
  set enableMeridian(value: boolean) { this._enableMeridian = value; }
  public _enableMeridian: boolean = false;

  /** disable minute */
  @Input()
  get disableMinute(): boolean { return this._disableMinute; }
  set disableMinute(value: boolean) { this._disableMinute = value; }
  public _disableMinute: boolean;

  /** Step second */
  @Input()
  get defaultTime(): number[] { return this._defaultTime; }
  set defaultTime(value: number[]) { this._defaultTime = value; }
  public _defaultTime: number[];

  private _hasBackdrop: boolean = true;

  /** The id for the datepicker calendar. */
  id: string = `mat-datepicker-${datepickerUid++}`;

  /** The currently selected date. */
  get _selected(): D | null { return this._validSelected; }
  set _selected(value: D | null) { this._validSelected = value; }
  private _validSelected: D | null = null;

  /** The minimum selectable date. */
  get _minDate(): D | null {
    return this.datepickerInput && this.datepickerInput.min;
  }

  /** The maximum selectable date. */
  get _maxDate(): D | null {
    return this.datepickerInput && this.datepickerInput.max;
  }

  get valid(): boolean {
    const minValidators = this._minValidator();
    const maxValidators = this._maxValidator();
    return minValidators == null && maxValidators == null;
  }

  get _dateFilter(): (date: D | null) => boolean {
    return this.datepickerInput && this.datepickerInput._dateFilter;
  }

  /** A reference to the overlay when the calendar is opened as a popup. */
  _popupRef: OverlayRef;

  /** A reference to the dialog when the calendar is opened as a dialog. */
  private _dialogRef: MatDialogRef<NgxMatDatetimeContent<D>> | null;

  /** A portal containing the calendar for this datepicker. */
  private _calendarPortal: ComponentPortal<NgxMatDatetimeContent<D>>;

  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<NgxMatDatetimeContent<D>> | null;

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  /** The input element this datepicker is associated with. */
  datepickerInput: NgxMatDatetimeInput<D>;

  /** Emits when the datepicker is disabled. */
  readonly stateChanges = new Subject<boolean>();

  /** Emits new selected date when selected date changes. */
  readonly _selectedChanged = new Subject<D>();

  /** Raw value before  */
  private _rawValue: D;

  constructor(private _dialog: MatDialog,
    private _overlay: Overlay,
    private _ngZone: NgZone,
    private _viewContainerRef: ViewContainerRef,
    @Inject(MAT_DATEPICKER_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() private _dateAdapter: NgxMatDateAdapter<D>,
    @Optional() private _dir: Directionality,
    @Optional() @Inject(DOCUMENT) private _document: any) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('NgxMatDateAdapter');
    }

    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy() {
    this.close();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
    this._inputSubscription.unsubscribe();
    this.stateChanges.complete();
  }

  /** The form control validator for the min date. */
  private _minValidator = (): ValidationErrors | null => {
    return (!this._minDate || !this._selected ||
      this._dateAdapter.compareDateWithTime(this._minDate, this._selected, this.showSeconds) <= 0) ?
      null : { 'matDatetimePickerMin': { 'min': this._minDate, 'actual': this._selected } };
  }

  /** The form control validator for the max date. */
  private _maxValidator = (): ValidationErrors | null => {
    return (!this._maxDate || !this._selected ||
      this._dateAdapter.compareDateWithTime(this._maxDate, this._selected, this.showSeconds) >= 0) ?
      null : { 'matDatetimePickerMax': { 'max': this._maxDate, 'actual': this._selected } };
  }

  /** Selects the given date */
  select(date: D): void {
    this._selected = this._dateAdapter.copyTime(date, this._selected);
  }

  /** Emits the selected year in multiyear view */
  _selectYear(normalizedYear: D): void {
    this.yearSelected.emit(normalizedYear);
  }

  /** Emits selected month in year view */
  _selectMonth(normalizedMonth: D): void {
    this.monthSelected.emit(normalizedMonth);
  }

  /** OK button handler and close*/
  public ok(): void {
    const cloned = this._dateAdapter.clone(this._selected);
    this._selectedChanged.next(cloned);
    this.close();
  }

  /** Cancel and close */
  public cancel(): void {
    this._selected = this._rawValue;
    this.close();
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  _registerInput(input: NgxMatDatetimeInput<D>): void {
    if (this.datepickerInput) {
      throw Error('A NgxMatDatepicker can only be associated with a single input.');
    }
    this.datepickerInput = input;
    this._inputSubscription =
      this.datepickerInput._valueChange.subscribe((value: D | null) => this._selected = value);
  }

  /** Open the calendar. */
  open(): void {
    this._rawValue = this._selected != null
      ? this._dateAdapter.clone(this._selected) : null;

    if (this._selected == null) {
      this._selected = this._dateAdapter.today();
      if (this.defaultTime != null) {
        this._selected = this._dateAdapter.setTimeByDefaultValues(this._selected, this.defaultTime);
      }
    }

    if (this._opened || this.disabled) {
      return;
    }
    if (!this.datepickerInput) {
      throw Error('Attempted to open an NgxMatDatepicker with no associated input.');
    }
    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this._opened = true;
    this.openedStream.emit();
  }

  /** Close the calendar. */
  close(): void {
    if (!this._opened) {
      return;
    }
    if (this._popupRef && this._popupRef.hasAttached()) {
      this._popupRef.detach();
    }
    if (this._dialogRef) {
      this._dialogRef.close();
      this._dialogRef = null;
    }
    if (this._calendarPortal && this._calendarPortal.isAttached) {
      this._calendarPortal.detach();
    }

    const completeClose = () => {
      // The `_opened` could've been reset already if
      // we got two events in quick succession.
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
        this._focusedElementBeforeOpen = null;
      }
    };

    if (this._focusedElementBeforeOpen &&
      typeof this._focusedElementBeforeOpen.focus === 'function') {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      this._focusedElementBeforeOpen.focus();
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {
    // Usually this would be handled by `open` which ensures that we can only have one overlay
    // open at a time, however since we reset the variables in async handlers some overlays
    // may slip through if the user opens and closes multiple times in quick succession (e.g.
    // by holding down the enter key).
    if (this._dialogRef) {
      this._dialogRef.close();
    }

    this._dialogRef = this._dialog.open<NgxMatDatetimeContent<D>>(NgxMatDatetimeContent, {
      direction: this._dir ? this._dir.value : 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'mat-datepicker-dialog',
      hasBackdrop: this._hasBackdrop
    });

    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.datepicker = this;
    this._setColor();
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._calendarPortal) {
      this._calendarPortal = new ComponentPortal<NgxMatDatetimeContent<D>>(NgxMatDatetimeContent,
        this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
      this._popupComponentRef.instance.datepicker = this;
      this._setColor();

      // Update the position once the calendar has rendered.
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: this._hasBackdrop,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'mat-datepicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the datepicker.
        return event.keyCode === ESCAPE ||
          (this.datepickerInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(event => {
      if (event) {
        event.preventDefault();
      }

      (this._hasBackdrop && event) ? this.cancel() : this.close();

    });
  }

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.mat-datepicker-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }

  /** Passes the current theme color along to the calendar overlay. */
  private _setColor(): void {
    const color = this.color;
    if (this._popupComponentRef) {
      this._popupComponentRef.instance.color = color;
    }
    if (this._dialogRef) {
      this._dialogRef.componentInstance.color = color;
    }
  }

}
