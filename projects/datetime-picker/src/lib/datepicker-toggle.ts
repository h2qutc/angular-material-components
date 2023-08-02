

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Observable, Subscription, merge, of as observableOf } from 'rxjs';
import { NgxMatDatepickerControl, NgxMatDatepickerPanel } from './datepicker-base';
import { NgxMatDatepickerIntl } from './datepicker-intl';

/** Can be used to override the icon of a `matDatepickerToggle`. */
@Directive({
  selector: '[ngxMatDatepickerToggleIcon]',
})
export class NgxMatDatepickerToggleIcon { }

@Component({
  selector: 'ngx-mat-datepicker-toggle',
  templateUrl: 'datepicker-toggle.html',
  styleUrls: ['datepicker-toggle.scss'],
  host: {
    'class': 'mat-datepicker-toggle',
    '[attr.tabindex]': 'null',
    '[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
    '[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
    '[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
    // Used by the test harness to tie this toggle to its datepicker.
    '[attr.data-mat-calendar]': 'datepicker ? datepicker.id : null',
    // Bind the `click` on the host, rather than the inner `button`, so that we can call
    // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
    // it so that the input doesn't get focused automatically by the form field (See #21836).
    '(click)': '_open($event)',
  },
  exportAs: 'ngxMatDatepickerToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatDatepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
  private _stateChanges = Subscription.EMPTY;

  /** Datepicker instance that the button will toggle. */
  @Input('for') datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<any>, D>;

  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Screen-reader label for the button. */
  @Input('aria-label') ariaLabel: string;

  /** Whether the toggle button is disabled. */
  @Input()
  get disabled(): boolean {
    if (this._disabled === undefined && this.datepicker) {
      return this.datepicker.disabled;
    }

    return !!this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean;

  /** Whether ripples on the toggle should be disabled. */
  @Input() disableRipple: boolean;

  /** Custom icon set by the consumer. */
  @ContentChild(NgxMatDatepickerToggleIcon) _customIcon: NgxMatDatepickerToggleIcon;

  /** Underlying button element. */
  @ViewChild('button') _button: MatButton;

  constructor(
    public _intl: NgxMatDatepickerIntl,
    private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string,
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datepicker']) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  _open(event: Event): void {
    if (this.datepicker && !this.disabled) {
      this.datepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const datepickerStateChanged = this.datepicker ? this.datepicker.stateChanges : observableOf();
    const inputStateChanged =
      this.datepicker && this.datepicker.datepickerInput
        ? this.datepicker.datepickerInput.stateChanges
        : observableOf();
    const datepickerToggled = this.datepicker
      ? merge(this.datepicker.openedStream, this.datepicker.closedStream)
      : observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      this._intl.changes,
      datepickerStateChanged as Observable<void>,
      inputStateChanged,
      datepickerToggled,
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
