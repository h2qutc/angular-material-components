import { ChangeDetectionStrategy, Component, Directive, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-base";
/** Button that will close the datepicker and assign the current selection to the data model. */
export class NgxMatDatepickerApply {
    constructor(_datepicker) {
        this._datepicker = _datepicker;
    }
    _applySelection() {
        this._datepicker._applyPendingSelection();
        this._datepicker.close();
    }
}
/** @nocollapse */ NgxMatDatepickerApply.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerApply, deps: [{ token: i1.NgxMatDatepickerBase }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDatepickerApply.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerApply, selector: "[ngxMatDatepickerApply], [ngxMatDateRangePickerApply]", host: { listeners: { "click": "_applySelection()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerApply, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxMatDatepickerApply], [ngxMatDateRangePickerApply]',
                    host: { '(click)': '_applySelection()' },
                }]
        }], ctorParameters: function () { return [{ type: i1.NgxMatDatepickerBase }]; } });
/** Button that will close the datepicker and discard the current selection. */
export class NgxMatDatepickerCancel {
    constructor(_datepicker) {
        this._datepicker = _datepicker;
    }
}
/** @nocollapse */ NgxMatDatepickerCancel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerCancel, deps: [{ token: i1.NgxMatDatepickerBase }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDatepickerCancel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerCancel, selector: "[ngxMatDatepickerCancel], [ngxMatDateRangePickerCancel]", host: { listeners: { "click": "_datepicker.close()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerCancel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxMatDatepickerCancel], [ngxMatDateRangePickerCancel]',
                    host: { '(click)': '_datepicker.close()' },
                }]
        }], ctorParameters: function () { return [{ type: i1.NgxMatDatepickerBase }]; } });
/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
export class NgxMatDatepickerActions {
    constructor(_datepicker, _viewContainerRef) {
        this._datepicker = _datepicker;
        this._viewContainerRef = _viewContainerRef;
    }
    ngAfterViewInit() {
        this._portal = new TemplatePortal(this._template, this._viewContainerRef);
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
/** @nocollapse */ NgxMatDatepickerActions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerActions, deps: [{ token: i1.NgxMatDatepickerBase }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatDatepickerActions.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerActions, selector: "ngx-mat-datepicker-actions, ngx-mat-date-range-picker-actions", viewQueries: [{ propertyName: "_template", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `, isInline: true, styles: [".mat-datepicker-actions{display:flex;justify-content:flex-end;align-items:center;padding:8px}.mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerActions, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-mat-datepicker-actions, ngx-mat-date-range-picker-actions', template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".mat-datepicker-actions{display:flex;justify-content:flex-end;align-items:center;padding:8px}.mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgxMatDatepickerBase }, { type: i0.ViewContainerRef }]; }, propDecorators: { _template: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvZGF0ZXBpY2tlci1hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFNBQVMsRUFFVCxXQUFXLEVBQ1gsU0FBUyxFQUVULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7OztBQUduRCxnR0FBZ0c7QUFLaEcsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUFvQixXQUF3RTtRQUF4RSxnQkFBVyxHQUFYLFdBQVcsQ0FBNkQ7SUFBRyxDQUFDO0lBRWhHLGVBQWU7UUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDOztxSUFOVSxxQkFBcUI7eUhBQXJCLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQUpqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1REFBdUQ7b0JBQ2pFLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxtQkFBbUIsRUFBQztpQkFDdkM7O0FBVUQsK0VBQStFO0FBSy9FLE1BQU0sT0FBTyxzQkFBc0I7SUFDakMsWUFBbUIsV0FBd0U7UUFBeEUsZ0JBQVcsR0FBWCxXQUFXLENBQTZEO0lBQUcsQ0FBQzs7c0lBRHBGLHNCQUFzQjswSEFBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBSmxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlEQUF5RDtvQkFDbkUsSUFBSSxFQUFFLEVBQUMsU0FBUyxFQUFFLHFCQUFxQixFQUFDO2lCQUN6Qzs7QUFLRDs7O0dBR0c7QUFjSCxNQUFNLE9BQU8sdUJBQXVCO0lBSWxDLFlBQ1UsV0FBd0UsRUFDeEUsaUJBQW1DO1FBRG5DLGdCQUFXLEdBQVgsV0FBVyxDQUE2RDtRQUN4RSxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO0lBQzFDLENBQUM7SUFFSixlQUFlO1FBQ2IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3Qyx3RUFBd0U7UUFDeEUsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzt1SUFyQlUsdUJBQXVCOzJIQUF2Qix1QkFBdUIsZ0pBQ3ZCLFdBQVcsZ0RBWFo7Ozs7OztHQU1UOzJGQUlVLHVCQUF1QjtrQkFibkMsU0FBUzsrQkFDRSwrREFBK0QsWUFFL0Q7Ozs7OztHQU1ULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzBJQUdiLFNBQVM7c0JBQWhDLFNBQVM7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIE9uRGVzdHJveSxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge05neE1hdERhdGVwaWNrZXJCYXNlLCBOZ3hNYXREYXRlcGlja2VyQ29udHJvbH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuXG4vKiogQnV0dG9uIHRoYXQgd2lsbCBjbG9zZSB0aGUgZGF0ZXBpY2tlciBhbmQgYXNzaWduIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgZGF0YSBtb2RlbC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ3hNYXREYXRlcGlja2VyQXBwbHldLCBbbmd4TWF0RGF0ZVJhbmdlUGlja2VyQXBwbHldJyxcbiAgaG9zdDogeycoY2xpY2spJzogJ19hcHBseVNlbGVjdGlvbigpJ30sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJBcHBseSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RhdGVwaWNrZXI6IE5neE1hdERhdGVwaWNrZXJCYXNlPE5neE1hdERhdGVwaWNrZXJDb250cm9sPGFueT4sIHVua25vd24+KSB7fVxuXG4gIF9hcHBseVNlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9kYXRlcGlja2VyLl9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKTtcbiAgICB0aGlzLl9kYXRlcGlja2VyLmNsb3NlKCk7XG4gIH1cbn1cblxuLyoqIEJ1dHRvbiB0aGF0IHdpbGwgY2xvc2UgdGhlIGRhdGVwaWNrZXIgYW5kIGRpc2NhcmQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25neE1hdERhdGVwaWNrZXJDYW5jZWxdLCBbbmd4TWF0RGF0ZVJhbmdlUGlja2VyQ2FuY2VsXScsXG4gIGhvc3Q6IHsnKGNsaWNrKSc6ICdfZGF0ZXBpY2tlci5jbG9zZSgpJ30sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJDYW5jZWwge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2RhdGVwaWNrZXI6IE5neE1hdERhdGVwaWNrZXJCYXNlPE5neE1hdERhdGVwaWNrZXJDb250cm9sPGFueT4sIHVua25vd24+KSB7fVxufVxuXG4vKipcbiAqIENvbnRhaW5lciB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb2plY3QgYSByb3cgb2YgYWN0aW9uIGJ1dHRvbnNcbiAqIHRvIHRoZSBib3R0b20gb2YgYSBkYXRlcGlja2VyIG9yIGRhdGUgcmFuZ2UgcGlja2VyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ3gtbWF0LWRhdGVwaWNrZXItYWN0aW9ucywgbmd4LW1hdC1kYXRlLXJhbmdlLXBpY2tlci1hY3Rpb25zJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGVwaWNrZXItYWN0aW9ucy5zY3NzJ10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlPlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWFjdGlvbnNcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJBY3Rpb25zIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjx1bmtub3duPjtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kYXRlcGlja2VyOiBOZ3hNYXREYXRlcGlja2VyQmFzZTxOZ3hNYXREYXRlcGlja2VyQ29udHJvbDxhbnk+LCB1bmtub3duPixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICApIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLl90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgdGhpcy5fZGF0ZXBpY2tlci5yZWdpc3RlckFjdGlvbnModGhpcy5fcG9ydGFsKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RhdGVwaWNrZXIucmVtb3ZlQWN0aW9ucyh0aGlzLl9wb3J0YWwpO1xuXG4gICAgLy8gTmVlZHMgdG8gYmUgbnVsbCBjaGVja2VkIHNpbmNlIHdlIGluaXRpYWxpemUgaXQgaW4gYG5nQWZ0ZXJWaWV3SW5pdGAuXG4gICAgaWYgKHRoaXMuX3BvcnRhbCAmJiB0aGlzLl9wb3J0YWwuaXNBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fcG9ydGFsPy5kZXRhY2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==