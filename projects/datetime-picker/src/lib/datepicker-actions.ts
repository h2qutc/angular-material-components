import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import { NgxMatDatepickerBase, NgxMatDatepickerControl } from './datepicker-base';

/** Button that will close the datepicker and assign the current selection to the data model. */
@Directive({
  selector: '[ngxMatDatepickerApply], [ngxMatDateRangePickerApply]',
  host: { '(click)': '_applySelection()' },
  standalone: true,
})
export class NgxMatDatepickerApply {
  constructor(
    public readonly _datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>,
  ) {}

  _applySelection() {
    this._datepicker._applyPendingSelection();
    this._datepicker.close();
  }
}

/** Button that will close the datepicker and discard the current selection. */
@Directive({
  selector: '[ngxMatDatepickerCancel], [ngxMatDateRangePickerCancel]',
  host: { '(click)': '_datepicker.close()' },
  standalone: true,
})
export class NgxMatDatepickerCancel {
  constructor(
    public readonly _datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>,
  ) {}
}

/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
@Component({
  selector: 'ngx-mat-datepicker-actions, ngx-mat-date-range-picker-actions',
  styleUrls: ['datepicker-actions.scss'],
  template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class NgxMatDatepickerActions implements AfterViewInit, OnDestroy {
  _template = viewChild<TemplateRef<unknown>>(TemplateRef);
  private _portal: TemplatePortal;

  constructor(
    private _datepicker: NgxMatDatepickerBase<NgxMatDatepickerControl<any>, unknown>,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngAfterViewInit() {
    this._portal = new TemplatePortal(this._template(), this._viewContainerRef);
    this._datepicker.registerActions(this._portal);
  }

  ngOnDestroy() {
    this._datepicker.removeActions(this._portal);

    // Needs to be null checked since we initialize it in `ngAfterViewInit`.
    if (this._portal && this._portal.isAttached) {
      this._portal?.detach();
    }
  }
}
