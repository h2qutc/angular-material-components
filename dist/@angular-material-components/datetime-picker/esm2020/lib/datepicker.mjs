import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import { NgxMatDatepickerBase } from './datepicker-base';
import * as i0 from "@angular/core";
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
export class NgxMatDatetimepicker extends NgxMatDatepickerBase {
}
/** @nocollapse */ NgxMatDatetimepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimepicker, deps: null, target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatDatetimepicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatetimepicker, selector: "ngx-mat-datetime-picker", providers: [
        NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
        { provide: NgxMatDatepickerBase, useExisting: NgxMatDatetimepicker },
    ], exportAs: ["ngxMatDatetimePicker"], usesInheritance: true, ngImport: i0, template: '', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatetimepicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-mat-datetime-picker',
                    template: '',
                    exportAs: 'ngxMatDatetimePicker',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    providers: [
                        NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
                        { provide: NgxMatDatepickerBase, useExisting: NgxMatDatetimepicker },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2RhdGV0aW1lLXBpY2tlci9zcmMvbGliL2RhdGVwaWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RixPQUFPLEVBQUUsNENBQTRDLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RixPQUFPLEVBQUUsb0JBQW9CLEVBQTJCLE1BQU0sbUJBQW1CLENBQUM7O0FBRWxGLDhGQUE4RjtBQUM5RixrR0FBa0c7QUFDbEcscUVBQXFFO0FBQ3JFLHNFQUFzRTtBQVl0RSxNQUFNLE9BQU8sb0JBQXdCLFNBQVEsb0JBQTZEOztvSUFBN0Ysb0JBQW9CO3dIQUFwQixvQkFBb0Isa0RBTHBCO1FBQ1QsNENBQTRDO1FBQzVDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxvQkFBb0IsRUFBRTtLQUNyRSxxRkFQUyxFQUFFOzJGQVNELG9CQUFvQjtrQkFYaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUUsRUFBRTtvQkFDWixRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFNBQVMsRUFBRTt3QkFDVCw0Q0FBNEM7d0JBQzVDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsc0JBQXNCLEVBQUU7cUJBQ3JFO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HWF9NQVRfU0lOR0xFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSIH0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlcGlja2VyQmFzZSwgTmd4TWF0RGF0ZXBpY2tlckNvbnRyb2wgfSBmcm9tICcuL2RhdGVwaWNrZXItYmFzZSc7XG5cbi8vIFRPRE8obW1hbGVyYmEpOiBXZSB1c2UgYSBjb21wb25lbnQgaW5zdGVhZCBvZiBhIGRpcmVjdGl2ZSBoZXJlIHNvIHRoZSB1c2VyIGNhbiB1c2UgaW1wbGljaXRcbi8vIHRlbXBsYXRlIHJlZmVyZW5jZSB2YXJpYWJsZXMgKGUuZy4gI2QgdnMgI2Q9XCJtYXREYXRlcGlja2VyXCIpLiBXZSBjYW4gY2hhbmdlIHRoaXMgdG8gYSBkaXJlY3RpdmVcbi8vIGlmIGFuZ3VsYXIgYWRkcyBzdXBwb3J0IGZvciBgZXhwb3J0QXM6ICckaW1wbGljaXQnYCBvbiBkaXJlY3RpdmVzLlxuLyoqIENvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIGRhdGVwaWNrZXIgcG9wdXAvZGlhbG9nLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1kYXRldGltZS1waWNrZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIGV4cG9ydEFzOiAnbmd4TWF0RGF0ZXRpbWVQaWNrZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTkdYX01BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVIsXG4gICAgeyBwcm92aWRlOiBOZ3hNYXREYXRlcGlja2VyQmFzZSwgdXNlRXhpc3Rpbmc6IE5neE1hdERhdGV0aW1lcGlja2VyIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGV0aW1lcGlja2VyPEQ+IGV4dGVuZHMgTmd4TWF0RGF0ZXBpY2tlckJhc2U8Tmd4TWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIEQgfCBudWxsLCBEPiB7IH1cbiJdfQ==