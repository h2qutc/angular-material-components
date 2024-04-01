import { Directionality } from "@angular/cdk/bidi";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { matDatepickerAnimations } from "@angular/material/datepicker";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subject, Subscription, merge } from "rxjs";
import { filter, take } from "rxjs/operators";
import { Color } from "../../models";
import { ColorAdapter } from "../../services";
import { NgxMatColorPaletteComponent } from "../color-palette/color-palette.component";
import { NgxMatColorPickerInputDirective } from "./color-input.directive";

/** Injection token that determines the scroll handling while the calendar is open. */
export const NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY = new InjectionToken<
  () => ScrollStrategy
>("ngx-mat-colorpicker-scroll-strategy");

export function NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY(
  overlay: Overlay,
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

export const NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY,
};

@Component({
  selector: "ngx-mat-color-picker-content",
  templateUrl: "./color-picker-content.component.html",
  styleUrls: ["color-picker-content.component.scss"],
  animations: [
    matDatepickerAnimations.transformPanel,
    matDatepickerAnimations.fadeInCalendar,
  ],
  exportAs: "ngxMatColorPickerContent",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatColorPickerContentComponent {
  @HostBinding("class.ngx-mat-colorpicker-content")
  get hostClass() {
    return true;
  }

  @HostBinding("@transformPanel")
  get transformPanel() {
    return "enter";
  }

  @HostBinding("class.ngx-mat-colorpicker-content-touch")
  get touchUiClass() {
    if (!this.picker) {
      throw Error(
        "No picker instance associated with the color picker content.",
      );
    }
    return this.picker.touchUi;
  }
  /** Reference to the internal calendar component. */
  @ViewChild(NgxMatColorPaletteComponent)
  _palette: NgxMatColorPaletteComponent | null = null;
  @Input({
    required: true,
  })
  color: ThemePalette;

  picker: NgxMatColorPickerComponent | null = null;
  _isAbove: boolean = false;

  constructor() {
    if (this.picker === null) {
      throw Error(
        "No picker instance associated with the color picker content.",
      );
    }
    if (this.color === undefined) {
      throw Error("Color is required for the color picker content.");
    }
  }
}

@Component({
  selector: "ngx-mat-color-picker",
  template: "",
  exportAs: "ngxMatColorPicker",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatColorPickerComponent implements OnDestroy {
  private readonly _scrollStrategy: ScrollStrategy;

  /** Emits when the datepicker has been opened. */
  @Output() openedStream: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output() closedStream: EventEmitter<void> = new EventEmitter<void>();

  @Input() get disabled() {
    return this._disabled === undefined && this._pickerInput
      ? this._pickerInput.disabled
      : this._disabled;
  }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._disabled) {
      this._disabled = newValue;
      this._disabledChange.next(newValue);
    }
  }
  private _disabled: boolean = false;

  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }
  set touchUi(value: boolean) {
    this._touchUi = coerceBooleanProperty(value);
  }
  private _touchUi = false;

  /** Whether the calendar is open. */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    value ? this.open() : this.close();
  }
  private _opened = false;

  /** Default Color palette to use on the datepicker's calendar. */
  @Input()
  get defaultColor(): ThemePalette {
    return this._defaultColor;
  }
  set defaultColor(value: ThemePalette) {
    this._defaultColor = value;
  }
  _defaultColor: ThemePalette = "primary";

  /** Color palette to use on the datepicker's calendar. */
  @Input()
  get color(): ThemePalette {
    return (
      this._color ||
      (this._pickerInput ? this._pickerInput.getThemePalette() : undefined)
    );
  }
  set color(value: ThemePalette) {
    this._color = value;
  }
  _color: ThemePalette;

  /** The currently selected color. */
  get _selected(): Color | null {
    return this._validSelected;
  }
  set _selected(value: Color) {
    this._validSelected = value;
  }
  private _validSelected: Color | null = null;

  _pickerInput: NgxMatColorPickerInputDirective | null = null;
  /** A reference to the overlay when the picker is opened as a popup. */
  _popupRef: OverlayRef | null = null;

  /** A reference to the dialog when the picker is opened as a dialog. */
  private _dialogRef: MatDialogRef<NgxMatColorPickerContentComponent> | null =
    null;
  /** Reference to the component instantiated in popup mode. */
  private _popupComponentRef: ComponentRef<NgxMatColorPickerContentComponent> | null =
    null;
  /** A portal containing the content for this picker. */
  private _portal: ComponentPortal<NgxMatColorPickerContentComponent> | null =
    null;

  /** Emits when the datepicker is disabled. */
  readonly _disabledChange = new Subject<boolean>();

  /** The element that was focused before the datepicker was opened. */
  private _focusedElementBeforeOpen: Element | null = null;

  /** Subscription to value changes in the associated input element. */
  private _inputSubscription = Subscription.EMPTY;

  /** Emits new selected date when selected date changes. */
  readonly _selectedChanged = new Subject<Color>();

  constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
    private _zone: NgZone,
    private _adapter: ColorAdapter,
    @Optional() private _dir: Directionality,
    @Inject(NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY)
    scrollStrategy: ScrollStrategy,
    @Optional() @Inject(DOCUMENT) private _document: Document,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this._scrollStrategy = scrollStrategy;
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

  /** Selects the given color */
  select(nextVal: Color): void {
    const oldValue = this._selected;
    if (!oldValue) {
      throw Error("Could not select a color. Provided value is null.");
    }
    this._selected = nextVal;
    if (!this._adapter.sameColor(oldValue, this._selected)) {
      this._selectedChanged.next(nextVal);
    }
  }

  /**
   * Register an input with this datepicker.
   * @param input The datepicker input to register with this datepicker.
   */
  registerInput(input: NgxMatColorPickerInputDirective): void {
    if (this._pickerInput) {
      throw Error("A ColorPicker can only be associated with a single input.");
    }
    this._pickerInput = input;
    this._inputSubscription = this._pickerInput._valueChange.subscribe(
      (value: Color) => (this._selected = value),
    );
  }

  public open(): void {
    if (this._opened || this.disabled) {
      return;
    }
    if (!this._pickerInput) {
      throw Error("Attempted to open an ColorPicker with no associated input.");
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

    this._dialogRef = this._dialog.open<NgxMatColorPickerContentComponent>(
      NgxMatColorPickerContentComponent,
      {
        direction: this._dir ? this._dir.value : "ltr",
        viewContainerRef: this._viewContainerRef,
        panelClass: "ngx-mat-colorpicker-dialog",
      },
    );

    this._dialogRef.afterClosed().subscribe(() => this.close());
    this._dialogRef.componentInstance.picker = this;
    this._setColor();
  }

  /** Open the calendar as a popup. */
  private _openAsPopup(): void {
    if (!this._portal) {
      this._portal = new ComponentPortal<NgxMatColorPickerContentComponent>(
        NgxMatColorPickerContentComponent,
        this._viewContainerRef,
      );
    }

    if (!this._popupRef) {
      this._createPopup();
    }
    const overlayRef = this._popupRef;
    if (!overlayRef) {
      throw Error(
        "Open as Popup. Popup creation failed. This is likely caused by a previous error.",
      );
    }
    if (!overlayRef.hasAttached()) {
      this._popupComponentRef = overlayRef.attach(this._portal);
      this._popupComponentRef.instance.picker = this;
      this._setColor();

      // Update the position once the calendar has rendered.
      this._zone.onStable
        .asObservable()
        .pipe(take(1))
        .subscribe(() => {
          overlayRef.updatePosition();
        });
    }
  }

  /** Create the popup. */
  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createPopupPositionStrategy(),
      hasBackdrop: true,
      backdropClass: "mat-overlay-transparent-backdrop",
      direction: this._dir,
      scrollStrategy: this._scrollStrategy,
      panelClass: "mat-colorpicker-popup",
    });
    const newOverlay = this._overlay.create(overlayConfig);
    newOverlay.overlayElement.setAttribute("role", "dialog");
    this._popupRef = newOverlay;

    merge(
      this._popupRef.backdropClick(),
      this._popupRef.detachments(),
      this._popupRef
        .keydownEvents()
        .pipe(filter((event: KeyboardEvent) => event instanceof KeyboardEvent)),
    ).subscribe((event) => {
      if (event instanceof KeyboardEvent) {
        if (
          event.key === "Escape" ||
          (this._pickerInput && event.altKey && event.key === "ArrowUp")
        ) {
          event.preventDefault();
          this.close();
        } else {
          return;
        }
      }
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

    if (
      this._focusedElementBeforeOpen &&
      typeof (this._focusedElementBeforeOpen as HTMLElement).focus ===
        "function"
    ) {
      // Because IE moves focus asynchronously, we can't count on it being restored before we've
      // marked the datepicker as closed. If the event fires out of sequence and the element that
      // we're refocusing opens the datepicker on focus, the user could be stuck with not being
      // able to close the calendar at all. We work around it by making the logic, that marks
      // the datepicker as closed, async as well.
      (this._focusedElementBeforeOpen as HTMLElement).focus();
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
    if (!this._pickerInput) {
      throw Error(
        "Could not create popup position strategy. No input associated with the color picker.",
      );
    }
    return this._overlay
      .position()
      .flexibleConnectedTo(this._pickerInput.getConnectedOverlayOrigin())
      .withTransformOriginOn(".ngx-mat-colorpicker-content")
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: "start",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top",
        },
        {
          originX: "start",
          originY: "top",
          overlayX: "start",
          overlayY: "bottom",
        },
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top",
        },
        {
          originX: "end",
          originY: "top",
          overlayX: "end",
          overlayY: "bottom",
        },
      ]);
  }
}
