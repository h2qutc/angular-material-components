import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { Subscription, merge, of } from "rxjs";
import { NgxMatColorPickerComponent } from "../color-picker/color-picker.component";

@Directive({
  selector: "[ngxMatColorpickerToggleIcon]",
})
export class NgxMatColorPickerToggleIconDirective {}

@Component({
  selector: "ngx-mat-color-toggle",
  templateUrl: "./color-toggle.component.html",
  styleUrls: ["./color-toggle.component.scss"],
  exportAs: "ngxMatColorPickerToggle",
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatColorToggleComponent
  implements AfterContentInit, OnChanges, OnDestroy
{
  @Input() for!: NgxMatColorPickerComponent;
  @HostBinding("class.ngx-mat-color-toggle-active")
  get isActive() {
    return this.picker && this.picker.opened;
  }

  @HostBinding("class.mat-accent")
  get isAccent() {
    return this.picker && this.picker.color === "accent";
  }

  @HostBinding("class.mat-warn")
  get isWarn() {
    return this.picker && this.picker.color === "warn";
  }

  @HostListener("focus")
  onFocus() {
    if (!this._button) {
      throw new Error(
        "Could not focus the toggle because the toggle is missing a button ViewChild",
      );
    }
    this._button.focus();
  }
  private _stateChanges = Subscription.EMPTY;

  @Input() picker: NgxMatColorPickerComponent | null = null;
  @Input() tabIndex: number | null = null;

  @Input() get disabled(): boolean {
    if (this._disabled == null && this.picker) {
      return this.picker.disabled;
    } else {
      return this._disabled;
    }
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled: boolean = false;

  /** Whether ripples on the toggle should be disabled. */
  @Input() disableRipple: boolean = false;

  /** Custom icon set by the consumer. */
  @ContentChild(NgxMatColorPickerToggleIconDirective)
  _customIcon: NgxMatColorPickerToggleIconDirective | null = null;

  @ViewChild("button") _button: MatButton | null = null;

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["picker"]) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  public open(event: Event): void {
    if (this.picker && !this.disabled) {
      this.picker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const disabled$ = this.picker ? this.picker._disabledChange : of(false);
    const inputDisabled$ =
      this.picker && this.picker._pickerInput
        ? this.picker._pickerInput._disabledChange
        : of(false);

    const pickerToggled$ = this.picker
      ? merge(this.picker.openedStream, this.picker.closedStream)
      : of();
    this._stateChanges.unsubscribe();

    this._stateChanges = merge(
      disabled$,
      inputDisabled$,
      pickerToggled$,
    ).subscribe(() => this._cd.markForCheck());
  }
}
