import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, Component, ContentChild, Directive, Input, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Subscription, merge, of as observableOf } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-intl";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
/** Can be used to override the icon of a `matDatepickerToggle`. */
export class NgxMatDatepickerToggleIcon {
}
/** @nocollapse */ NgxMatDatepickerToggleIcon.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerToggleIcon, deps: [], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDatepickerToggleIcon.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerToggleIcon, selector: "[ngxMatDatepickerToggleIcon]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerToggleIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxMatDatepickerToggleIcon]',
                }]
        }] });
export class NgxMatDatepickerToggle {
    constructor(_intl, _changeDetectorRef, defaultTabIndex) {
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._stateChanges = Subscription.EMPTY;
        const parsedTabIndex = Number(defaultTabIndex);
        this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
    }
    /** Whether the toggle button is disabled. */
    get disabled() {
        if (this._disabled === undefined && this.datepicker) {
            return this.datepicker.disabled;
        }
        return !!this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    ngOnChanges(changes) {
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
    _open(event) {
        if (this.datepicker && !this.disabled) {
            this.datepicker.open();
            event.stopPropagation();
        }
    }
    _watchStateChanges() {
        const datepickerStateChanged = this.datepicker ? this.datepicker.stateChanges : observableOf();
        const inputStateChanged = this.datepicker && this.datepicker.datepickerInput
            ? this.datepicker.datepickerInput.stateChanges
            : observableOf();
        const datepickerToggled = this.datepicker
            ? merge(this.datepicker.openedStream, this.datepicker.closedStream)
            : observableOf();
        this._stateChanges.unsubscribe();
        this._stateChanges = merge(this._intl.changes, datepickerStateChanged, inputStateChanged, datepickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
    }
}
/** @nocollapse */ NgxMatDatepickerToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerToggle, deps: [{ token: i1.NgxMatDatepickerIntl }, { token: i0.ChangeDetectorRef }, { token: 'tabindex', attribute: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatDatepickerToggle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerToggle, selector: "ngx-mat-datepicker-toggle", inputs: { datepicker: ["for", "datepicker"], tabIndex: "tabIndex", ariaLabel: ["aria-label", "ariaLabel"], disabled: "disabled", disableRipple: "disableRipple" }, host: { listeners: { "click": "_open($event)" }, properties: { "attr.tabindex": "null", "class.mat-datepicker-toggle-active": "datepicker && datepicker.opened", "class.mat-accent": "datepicker && datepicker.color === \"accent\"", "class.mat-warn": "datepicker && datepicker.color === \"warn\"", "attr.data-mat-calendar": "datepicker ? datepicker.id : null" }, classAttribute: "mat-datepicker-toggle" }, queries: [{ propertyName: "_customIcon", first: true, predicate: NgxMatDatepickerToggleIcon, descendants: true }], viewQueries: [{ propertyName: "_button", first: true, predicate: ["button"], descendants: true }], exportAs: ["ngxMatDatepickerToggle"], usesOnChanges: true, ngImport: i0, template: "<button\n  #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  <svg\n    *ngIf=\"!_customIcon\"\n    class=\"mat-datepicker-toggle-default-icon\"\n    viewBox=\"0 0 24 24\"\n    width=\"24px\"\n    height=\"24px\"\n    fill=\"currentColor\"\n    focusable=\"false\">\n    <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n  </svg>\n\n  <ng-content select=\"[ngxMatDatepickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mat-datepicker-toggle{pointer-events:auto}.cdk-high-contrast-active .mat-datepicker-toggle-default-icon{color:CanvasText}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.MatIconButton, selector: "button[mat-icon-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerToggle, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-mat-datepicker-toggle', host: {
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
                    }, exportAs: 'ngxMatDatepickerToggle', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  #button\n  mat-icon-button\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  <svg\n    *ngIf=\"!_customIcon\"\n    class=\"mat-datepicker-toggle-default-icon\"\n    viewBox=\"0 0 24 24\"\n    width=\"24px\"\n    height=\"24px\"\n    fill=\"currentColor\"\n    focusable=\"false\">\n    <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n  </svg>\n\n  <ng-content select=\"[ngxMatDatepickerToggleIcon]\"></ng-content>\n</button>\n", styles: [".mat-datepicker-toggle{pointer-events:auto}.cdk-high-contrast-active .mat-datepicker-toggle-default-icon{color:CanvasText}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgxMatDatepickerIntl }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }]; }, propDecorators: { datepicker: [{
                type: Input,
                args: ['for']
            }], tabIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], disabled: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], _customIcon: [{
                type: ContentChild,
                args: [NgxMatDatepickerToggleIcon]
            }], _button: [{
                type: ViewChild,
                args: ['button']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10b2dnbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9kYXRlcGlja2VyLXRvZ2dsZS50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2RhdGV0aW1lLXBpY2tlci9zcmMvbGliL2RhdGVwaWNrZXItdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVFLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULEtBQUssRUFJTCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7O0FBSTNFLG1FQUFtRTtBQUluRSxNQUFNLE9BQU8sMEJBQTBCOzswSUFBMUIsMEJBQTBCOzhIQUExQiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFIdEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsOEJBQThCO2lCQUN6Qzs7QUF3QkQsTUFBTSxPQUFPLHNCQUFzQjtJQW1DakMsWUFDUyxLQUEyQixFQUMxQixrQkFBcUMsRUFDdEIsZUFBdUI7UUFGdkMsVUFBSyxHQUFMLEtBQUssQ0FBc0I7UUFDMUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQXBDdkMsa0JBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBdUN6QyxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLElBQUksY0FBYyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJ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QixLQUFLO3VCQUFDLEtBQUs7Z0JBR0gsUUFBUTtzQkFBaEIsS0FBSztnQkFHZSxTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7Z0JBSWYsUUFBUTtzQkFEWCxLQUFLO2dCQWNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBR29DLFdBQVc7c0JBQXBELFlBQVk7dUJBQUMsMEJBQTBCO2dCQUduQixPQUFPO3NCQUEzQixTQUFTO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRCdXR0b24gfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlcGlja2VyQ29udHJvbCwgTmd4TWF0RGF0ZXBpY2tlclBhbmVsIH0gZnJvbSAnLi9kYXRlcGlja2VyLWJhc2UnO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZXBpY2tlckludGwgfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5cbi8qKiBDYW4gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgaWNvbiBvZiBhIGBtYXREYXRlcGlja2VyVG9nZ2xlYC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ3hNYXREYXRlcGlja2VyVG9nZ2xlSWNvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hNYXREYXRlcGlja2VyVG9nZ2xlSWNvbiB7IH1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1kYXRlcGlja2VyLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXBpY2tlci10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlcGlja2VyLXRvZ2dsZS5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItdG9nZ2xlJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItdG9nZ2xlLWFjdGl2ZV0nOiAnZGF0ZXBpY2tlciAmJiBkYXRlcGlja2VyLm9wZW5lZCcsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdkYXRlcGlja2VyICYmIGRhdGVwaWNrZXIuY29sb3IgPT09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2RhdGVwaWNrZXIgJiYgZGF0ZXBpY2tlci5jb2xvciA9PT0gXCJ3YXJuXCInLFxuICAgIC8vIFVzZWQgYnkgdGhlIHRlc3QgaGFybmVzcyB0byB0aWUgdGhpcyB0b2dnbGUgdG8gaXRzIGRhdGVwaWNrZXIuXG4gICAgJ1thdHRyLmRhdGEtbWF0LWNhbGVuZGFyXSc6ICdkYXRlcGlja2VyID8gZGF0ZXBpY2tlci5pZCA6IG51bGwnLFxuICAgIC8vIEJpbmQgdGhlIGBjbGlja2Agb24gdGhlIGhvc3QsIHJhdGhlciB0aGFuIHRoZSBpbm5lciBgYnV0dG9uYCwgc28gdGhhdCB3ZSBjYW4gY2FsbFxuICAgIC8vIGBzdG9wUHJvcGFnYXRpb25gIG9uIGl0IHdpdGhvdXQgYWZmZWN0aW5nIHRoZSB1c2VyJ3MgYGNsaWNrYCBoYW5kbGVycy4gV2UgbmVlZCB0byBzdG9wXG4gICAgLy8gaXQgc28gdGhhdCB0aGUgaW5wdXQgZG9lc24ndCBnZXQgZm9jdXNlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSBmb3JtIGZpZWxkIChTZWUgIzIxODM2KS5cbiAgICAnKGNsaWNrKSc6ICdfb3BlbigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICduZ3hNYXREYXRlcGlja2VyVG9nZ2xlJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJUb2dnbGU8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3N0YXRlQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogRGF0ZXBpY2tlciBpbnN0YW5jZSB0aGF0IHRoZSBidXR0b24gd2lsbCB0b2dnbGUuICovXG4gIEBJbnB1dCgnZm9yJykgZGF0ZXBpY2tlcjogTmd4TWF0RGF0ZXBpY2tlclBhbmVsPE5neE1hdERhdGVwaWNrZXJDb250cm9sPGFueT4sIEQ+O1xuXG4gIC8qKiBUYWJpbmRleCBmb3IgdGhlIHRvZ2dsZS4gKi9cbiAgQElucHV0KCkgdGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFNjcmVlbi1yZWFkZXIgbGFiZWwgZm9yIHRoZSBidXR0b24uICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgYnV0dG9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRlcGlja2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VyLmRpc2FibGVkO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgb24gdGhlIHRvZ2dsZSBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVSaXBwbGU6IGJvb2xlYW47XG5cbiAgLyoqIEN1c3RvbSBpY29uIHNldCBieSB0aGUgY29uc3VtZXIuICovXG4gIEBDb250ZW50Q2hpbGQoTmd4TWF0RGF0ZXBpY2tlclRvZ2dsZUljb24pIF9jdXN0b21JY29uOiBOZ3hNYXREYXRlcGlja2VyVG9nZ2xlSWNvbjtcblxuICAvKiogVW5kZXJseWluZyBidXR0b24gZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbjogTWF0QnV0dG9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfaW50bDogTmd4TWF0RGF0ZXBpY2tlckludGwsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgZGVmYXVsdFRhYkluZGV4OiBzdHJpbmcsXG4gICkge1xuICAgIGNvbnN0IHBhcnNlZFRhYkluZGV4ID0gTnVtYmVyKGRlZmF1bHRUYWJJbmRleCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlZFRhYkluZGV4IHx8IHBhcnNlZFRhYkluZGV4ID09PSAwID8gcGFyc2VkVGFiSW5kZXggOiBudWxsO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydkYXRlcGlja2VyJ10pIHtcbiAgICAgIHRoaXMuX3dhdGNoU3RhdGVDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fd2F0Y2hTdGF0ZUNoYW5nZXMoKTtcbiAgfVxuXG4gIF9vcGVuKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGVwaWNrZXIgJiYgIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5vcGVuKCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF93YXRjaFN0YXRlQ2hhbmdlcygpIHtcbiAgICBjb25zdCBkYXRlcGlja2VyU3RhdGVDaGFuZ2VkID0gdGhpcy5kYXRlcGlja2VyID8gdGhpcy5kYXRlcGlja2VyLnN0YXRlQ2hhbmdlcyA6IG9ic2VydmFibGVPZigpO1xuICAgIGNvbnN0IGlucHV0U3RhdGVDaGFuZ2VkID1cbiAgICAgIHRoaXMuZGF0ZXBpY2tlciAmJiB0aGlzLmRhdGVwaWNrZXIuZGF0ZXBpY2tlcklucHV0XG4gICAgICAgID8gdGhpcy5kYXRlcGlja2VyLmRhdGVwaWNrZXJJbnB1dC5zdGF0ZUNoYW5nZXNcbiAgICAgICAgOiBvYnNlcnZhYmxlT2YoKTtcbiAgICBjb25zdCBkYXRlcGlja2VyVG9nZ2xlZCA9IHRoaXMuZGF0ZXBpY2tlclxuICAgICAgPyBtZXJnZSh0aGlzLmRhdGVwaWNrZXIub3BlbmVkU3RyZWFtLCB0aGlzLmRhdGVwaWNrZXIuY2xvc2VkU3RyZWFtKVxuICAgICAgOiBvYnNlcnZhYmxlT2YoKTtcblxuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcyA9IG1lcmdlKFxuICAgICAgdGhpcy5faW50bC5jaGFuZ2VzLFxuICAgICAgZGF0ZXBpY2tlclN0YXRlQ2hhbmdlZCBhcyBPYnNlcnZhYmxlPHZvaWQ+LFxuICAgICAgaW5wdXRTdGF0ZUNoYW5nZWQsXG4gICAgICBkYXRlcGlja2VyVG9nZ2xlZCxcbiAgICApLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gIH1cbn1cbiIsIjxidXR0b25cbiAgI2J1dHRvblxuICBtYXQtaWNvbi1idXR0b25cbiAgdHlwZT1cImJ1dHRvblwiXG4gIFthdHRyLmFyaWEtaGFzcG9wdXBdPVwiZGF0ZXBpY2tlciA/ICdkaWFsb2cnIDogbnVsbFwiXG4gIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IF9pbnRsLm9wZW5DYWxlbmRhckxhYmVsXCJcbiAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyAtMSA6IHRhYkluZGV4XCJcbiAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgW2Rpc2FibGVSaXBwbGVdPVwiZGlzYWJsZVJpcHBsZVwiPlxuXG4gIDxzdmdcbiAgICAqbmdJZj1cIiFfY3VzdG9tSWNvblwiXG4gICAgY2xhc3M9XCJtYXQtZGF0ZXBpY2tlci10b2dnbGUtZGVmYXVsdC1pY29uXCJcbiAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICB3aWR0aD1cIjI0cHhcIlxuICAgIGhlaWdodD1cIjI0cHhcIlxuICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgPHBhdGggZD1cIk0xOSAzaC0xVjFoLTJ2Mkg4VjFINnYySDVjLTEuMTEgMC0xLjk5LjktMS45OSAyTDMgMTljMCAxLjEuODkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptMCAxNkg1VjhoMTR2MTF6TTcgMTBoNXY1SDd6XCIvPlxuICA8L3N2Zz5cblxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbbmd4TWF0RGF0ZXBpY2tlclRvZ2dsZUljb25dXCI+PC9uZy1jb250ZW50PlxuPC9idXR0b24+XG4iXX0=