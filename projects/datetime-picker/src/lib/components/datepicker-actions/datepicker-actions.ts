import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from "@angular/core";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  NgxMatDatepickerBase,
  NgxMatDatepickerControl,
} from "../datepicker-content/datepicker-base.component";

/** Button that will close the datepicker and assign the current selection to the data model. */
@Directive({
  selector: "[ngxMatDatepickerApply], [ngxMatDateRangePickerApply]",
})
export class NgxMatDatepickerApplyDirective {
  @HostBinding("(click)") _applySelection() {
    this._datepicker._applyPendingSelection();
    this._datepicker.close();
  }
  constructor(
    private _datepicker: NgxMatDatepickerBase<
      NgxMatDatepickerControl<object>,
      unknown
    >,
  ) {}
}

/** Button that will close the datepicker and discard the current selection. */
@Directive({
  selector: "[ngxMatDatepickerCancel], [ngxMatDateRangePickerCancel]",
})
export class NgxMatDatepickerCancelDirective {
  @HostBinding("(click)") _cancelSelection() {
    this._datepicker.close();
  }
  constructor(
    public _datepicker: NgxMatDatepickerBase<
      NgxMatDatepickerControl<object>,
      unknown
    >,
  ) {}
}

/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
@Component({
  selector: "ngx-mat-datepicker-actions, ngx-mat-date-range-picker-actions",
  styleUrls: ["datepicker-actions.scss"],
  template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatDatepickerActionsComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild(TemplateRef) _template: TemplateRef<unknown> | null = null;
  private _portal: TemplatePortal | null = null;

  constructor(
    private _datepicker: NgxMatDatepickerBase<
      NgxMatDatepickerControl<object>,
      unknown
    >,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  ngAfterViewInit() {
    if (this._template === null) {
      throw Error("NgxMatDatepickerActionsComponent: Missing template");
    }
    this._portal = new TemplatePortal(this._template, this._viewContainerRef);
    this._datepicker.registerActions(this._portal);
  }

  ngOnDestroy() {
    if (this._portal === null) {
      throw Error("NgxMatDatepickerActionsComponent: Missing portal");
    }
    this._datepicker.removeActions(this._portal);

    // Needs to be null checked since we initialize it in `ngAfterViewInit`.
    if (this._portal && this._portal.isAttached) {
      this._portal?.detach();
    }
  }
}
