import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, OnDestroy, OnInit, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CanColor, ThemePalette, mixinColor } from '@angular/material/core';
import { matDatepickerAnimations } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Color } from '../../models';
import { ColorAdapter } from '../../services';
import { NgxMatColorPaletteComponent } from '../color-palette/color-palette.component';
import { NgxMatColorPickerInput } from './color-input.component';

/** Injection token that determines the scroll handling while the calendar is open. */
export const NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('ngx-mat-colorpicker-scroll-strategy');


export function NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}


export const NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY,
};

const _MatColorpickerContentBase = mixinColor(
  class {
    constructor(public _elementRef: ElementRef) { }
  },
);


@Component({
  selector: 'ngx-mat-color-picker-content',
  templateUrl: './color-picker-content.component.html',
  styleUrls: ['color-picker-content.component.scss'],
  host: {
    'class': 'ngx-mat-colorpicker-content',
    '[@transformPanel]': '"enter"',
    '[class.ngx-mat-colorpicker-content-touch]': 'picker.touchUi',
  },
  animations: [
    matDatepickerAnimations.transformPanel,
    matDatepickerAnimations.fadeInCalendar,
  ],
  exportAs: 'ngxMatColorPickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['color']
})
export class NgxMatColorPickerContentComponent extends _MatColorpickerContentBase
  implements CanColor {

  /** Reference to the internal calendar component. */
  @ViewChild(NgxMatColorPaletteComponent) _palette: NgxMatColorPaletteComponent;

  picker: NgxMatColorPickerComponent;
  _isAbove: boolean;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

}

@Component({
  selector: 'ngx-mat-color-picker',
  template: '',
  exportAs: 'ngxMatColorPicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatColorPickerComponent implements OnInit, OnDestroy, CanColor {

  private _scrollStrategy: () => ScrollStrategy;

  /** Emits when the datepicker has been opened. */
  @Output('opened') openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output('closed') closedStream: EventEmitter<void> = new EventEmitter<void>();

  @Input() get disabled() {
    return this._disabled === undefined && this._pickerInput ?
      this._pickerInput.disabled : !!this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }
  private _disabled: boolean;

  @Input()
  get touchUi(): boolean { return this._touchUi; }
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { value ? this.open() : this.close(); }
  private _opened = false;

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
      (this._pickerInput ? this._pickerInput.getThemePalette() : undefined);
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette;


  /** The currently selected date. */
  get _selected(): Color { return this._validSelected; }
  set _selected(value: Color) { this._validSelected = value; }
  private _validSelected: Color = null;


  _pickerInput: NgxMatColorPickerInput;
  /** A reference to the overlay when the picker is opened as a popup. */
  _popupRef: OverlayRef;

  /** A reference to the dialog when the picker is opened as a dialog. */
  private _dialogRef: MatDialogRef<NgxMatColorPickerContentComponent> | null;
  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<NgxMatColorPickerContentComponent> | null;
  /** A portal containing the content for this picker. */
  private _portal: ComponentPortal<NgxMatColorPickerContentComponent>;

  /** Emits when the datepicker is disabled. */
  readonly _disabledChange = new Subject<boolean>();

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: HTMLElement | null = null;

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  /** Emits new selected date when selected date changes. */
  readonly _selectedChanged = new Subject<Color>();

  constructor(private _dialog: MatDialog,
    private _overlay: Overlay,
    private _zone: NgZone,
    private _adapter: ColorAdapter,
    @Optional() private _dir: Directionality,
    @Inject(NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() @Inject(DOCUMENT) private _document: any,
    private _viewContainerRef: ViewContainerRef) {
    this._scrollStrategy = scrollStrategy;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.close();
    this._inputSubscription.unsubscribe();
    this._disabledChange.complete();

    if (this._popupRef) {
      this._popupRef.dispose();
      this._popupComponentRef = null;
    }
  }


  /** Selects the given date */
  select(nextVal: Color): void {
    let oldValue = this._selected;
    this._selected = nextVal;
    if (!this._adapter.sameColor(oldValue, this._selected)) {
      this._selectedChanged.next(nextVal);
    }
  }


  /**
 * Register an input with this datepicker.
 * @param input The datepicker input to register with this datepicker.
 */
  registerInput(input: NgxMatColorPickerInput): void {
    if (this._pickerInput) {
      throw Error('A ColorPicker can only be associated with a single input.');
    }
    this._pickerInput = input;
    this._inputSubscription =
      this._pickerInput._valueChange.subscribe((value: Color) => this._selected = value);
  }

  public open(): void {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._pickerInput) {
      throw Error('Attempted to open an ColorPicker with no associated input.');
    }

    if (this._document) {
      this._focusedElementBeforeOpen = this._document.activeElement;
    }

    this.touchUi ? this._openAsDialog() : this._openAsPopup();
    this._opened = true;
    this.openedStream.emit();
  }

  /** Open the calendar as a dialog. */
  private _openAsDialog(): void {

    if (this._dialogRef) {
      this._dialogRef.close();
    }

    this._dialogRef = this._dialog.open<NgxMatColorPickerContentComponent>(NgxMatColorPickerContentComponent, {
      direction: this._dir ? this._dir.value : 'ltr',
      viewContainerRef: this._viewContainerRef,
      panelClass: 'ngx-mat-colorpicker-dialog',
    });

    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.picker = this;
    this._setColor();
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {

    if (!this._portal) {
      this._portal = new ComponentPortal<NgxMatColorPickerContentComponent>(NgxMatColorPickerContentComponent,
        this._viewContainerRef);
    }

    if (!this._popupRef) {
      this._createPopup();
    }

    if (!this._popupRef.hasAttached()) {
      this._popupComponentRef = this._popupRef.attach(this._portal);
      this._popupComponentRef.instance.picker = this;
      this._setColor();

      // Update the position once the calendar has rendered.
      this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._popupRef.updatePosition();
      });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'mat-colorpicker-popup',
    });

    this._popupRef = this._overlay.create(overlayConfig);
    this._popupRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef.keydownEvents().pipe(filter(event => {
        // Closing on alt + up is only valid when there's an input associated with the datepicker.
        return event.keyCode === ESCAPE ||
          (this._pickerInput && event.altKey && event.keyCode === UP_ARROW);
      }))
    ).subscribe(event => {
      if (event) {
        event.preventDefault();
      }

      this.close();
    });
  }


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
    if (this._portal && this._portal.isAttached) {
      this._portal.detach();
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

  /** Create the popup PositionStrategy. */
  private _createPopupPositionStrategy(): PositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(this._pickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn('.ngx-mat-colorpicker-content')
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


}
