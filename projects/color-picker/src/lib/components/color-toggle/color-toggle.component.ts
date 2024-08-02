import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation,
  effect,
  input,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, merge, of } from 'rxjs';
import { NgxMatColorPickerComponent } from '../color-picker/color-picker.component';

@Directive({
  selector: '[ngxMatColorpickerToggleIcon]',
  standalone: true,
})
export class NgxMatColorpickerToggleIcon {}

@Component({
  selector: 'ngx-mat-color-toggle',
  templateUrl: './color-toggle.component.html',
  styleUrls: ['./color-toggle.component.scss'],
  host: {
    class: 'ngx-mat-color-toggle',
    // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
    // consumer may have provided, while still being able to receive focus.
    '[attr.tabindex]': '-1',
    '[class.ngx-mat-color-toggle-active]': 'picker && picker.opened',
    '[class.mat-accent]': 'picker && picker.color === "accent"',
    '[class.mat-warn]': 'picker && picker.color === "warn"',
    '(focus)': '_button.focus()',
  },
  exportAs: 'ngxMatColorPickerToggle',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class NgxMatColorToggleComponent implements AfterContentInit, OnDestroy {
  private _stateChanges = Subscription.EMPTY;

  picker = input<NgxMatColorPickerComponent>(undefined, { alias: 'for' });
  tabIndex = input<number>();

  @Input() get disabled(): boolean {
    if (this._disabled == null && this.picker()) {
      return this.picker().disabled;
    }
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled: boolean;

  /** Whether ripples on the toggle should be disabled. */
  disableRipple = input<boolean>();

  _button = viewChild<MatButton>('button');

  constructor(private _cd: ChangeDetectorRef) {
    effect(() => {
      this.picker();

      untracked(() => this._watchStateChanges());
    });
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  public open(event: Event): void {
    if (this.picker() && !this.disabled) {
      this.picker().open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const disabled$ = this.picker()?._disabledChange ?? new EventEmitter();
    const inputDisabled$ = this.picker()?._pickerInput?._disabledChange ?? new EventEmitter();

    const pickerToggled$ = this.picker()
      ? merge(this.picker()!.openedStream, this.picker()!.closedStream)
      : of();
    this._stateChanges.unsubscribe();

    this._stateChanges = merge(disabled$, inputDisabled$, pickerToggled$).subscribe(() =>
      this._cd.markForCheck(),
    );
  }
}
