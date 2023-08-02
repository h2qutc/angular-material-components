import {
  AfterContentInit, ChangeDetectorRef, Component, ContentChild, Directive, Input, OnChanges, OnDestroy,
  OnInit, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Subscription, merge, of } from 'rxjs';
import { NgxMatColorPickerComponent } from '../color-picker/color-picker.component';

@Directive({
  selector: '[ngxMatColorpickerToggleIcon]',
})
export class NgxMatColorpickerToggleIcon { }

@Component({
  selector: 'ngx-mat-color-toggle',
  templateUrl: './color-toggle.component.html',
  styleUrls: ['./color-toggle.component.scss'],
  host: {
    'class': 'ngx-mat-color-toggle',
    // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
    // consumer may have provided, while still being able to receive focus.
    '[attr.tabindex]': '-1',
    '[class.ngx-mat-color-toggle-active]': 'picker && picker.opened',
    '[class.mat-accent]': 'picker && picker.color === "accent"',
    '[class.mat-warn]': 'picker && picker.color === "warn"',
    '(focus)': '_button.focus()',
  },
  exportAs: 'ngxMatColorPickerToggle',
  encapsulation: ViewEncapsulation.None
})
export class NgxMatColorToggleComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  private _stateChanges = Subscription.EMPTY;

  @Input('for') picker: NgxMatColorPickerComponent;
  @Input() tabIndex: number;

  @Input() get disabled(): boolean {
    if (this._disabled == null && this.picker) {
      return this.picker.disabled;
    }
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled: boolean;

  /** Whether ripples on the toggle should be disabled. */
  @Input() disableRipple: boolean;

  /** Custom icon set by the consumer. */
  @ContentChild(NgxMatColorpickerToggleIcon) _customIcon: NgxMatColorpickerToggleIcon;

  @ViewChild('button') _button: MatButton;

  constructor(private _cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['picker']) {
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
    const disabled$ = this.picker ? this.picker._disabledChange : of();
    const inputDisabled$ = this.picker && this.picker._pickerInput ?
      this.picker._pickerInput._disabledChange : of();

    const pickerToggled$ = this.picker ?
      merge(this.picker.openedStream, this.picker.closedStream) : of();
    this._stateChanges.unsubscribe();

    this._stateChanges = merge(disabled$, inputDisabled$, pickerToggled$).subscribe(() => this._cd.markForCheck());
  }

}
