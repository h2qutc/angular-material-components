import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { DOWN_ARROW, ESCAPE, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewChild, ViewEncapsulation, inject, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import { Subject, Subscription, merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { NgxMatCalendar } from './calendar';
import { NGX_MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import { NgxDateRange, } from './date-selection-model';
import { ngxMatDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { DEFAULT_STEP } from './utils/date-utils';
import * as i0 from "@angular/core";
import * as i1 from "./date-selection-model";
import * as i2 from "./core/date-adapter";
import * as i3 from "./datepicker-intl";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/cdk/portal";
import * as i8 from "./timepicker.component";
import * as i9 from "@angular/forms";
import * as i10 from "./calendar";
import * as i11 from "@angular/cdk/overlay";
import * as i12 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const NGX_MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('ngx-mat-datepicker-scroll-strategy');
/** @docs-private */
export function NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: NGX_MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MatDatepickerContent.
/** @docs-private */
const _NgxMatDatepickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export class NgxMatDatepickerContent extends _NgxMatDatepickerContentBase {
    constructor(elementRef, _changeDetectorRef, _globalModel, _dateAdapter, _rangeSelectionStrategy, intl) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._globalModel = _globalModel;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        this._subscriptions = new Subscription();
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Whether there is an in-progress animation. */
        this._isAnimating = false;
        /** Portal with projected action buttons. */
        this._actionsPortal = null;
        this._closeButtonText = intl.closeCalendarLabel;
    }
    get isViewMonth() {
        if (!this._calendar || this._calendar.currentView == null)
            return true;
        return this._calendar.currentView == 'month';
    }
    ngOnInit() {
        this._animationState = this.datepicker.touchUi ? 'enter-dialog' : 'enter-dropdown';
    }
    ngAfterViewInit() {
        this._subscriptions.add(this.datepicker.stateChanges.subscribe(() => {
            this._changeDetectorRef.markForCheck();
        }));
        this._calendar.focusActiveCell();
    }
    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        this._animationDone.complete();
    }
    onTimeChanged(selectedDateWithTime) {
        const userEvent = {
            value: selectedDateWithTime,
            event: null
        };
        this._updateUserSelectionWithCalendarUserEvent(userEvent);
    }
    _handleUserSelection(event) {
        this._updateUserSelectionWithCalendarUserEvent(event);
        // Delegate closing the overlay to the actions.
        if (this.datepicker.hideTime) {
            if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
                this.datepicker.close();
            }
        }
    }
    _updateUserSelectionWithCalendarUserEvent(event) {
        const selection = this._model.selection;
        const value = event.value;
        const isRange = selection instanceof NgxDateRange;
        // If we're selecting a range and we have a selection strategy, always pass the value through
        // there. Otherwise don't assign null values to the model, unless we're selecting a range.
        // A null value when picking a range means that the user cancelled the selection (e.g. by
        // pressing escape), whereas when selecting a single value it means that the value didn't
        // change. This isn't very intuitive, but it's here for backwards-compatibility.
        if (isRange && this._rangeSelectionStrategy) {
            const newSelection = this._rangeSelectionStrategy.selectionFinished(value, selection, event.event);
            this._model.updateSelection(newSelection, this);
        }
        else {
            const isSameTime = this._dateAdapter.isSameTime(selection, value);
            const isSameDate = this._dateAdapter.sameDate(value, selection);
            const isSame = isSameDate && isSameTime;
            if (value &&
                (isRange || !isSame)) {
                this._model.add(value);
            }
        }
    }
    _handleUserDragDrop(event) {
        this._model.updateSelection(event.value, this);
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    _handleAnimationEvent(event) {
        this._isAnimating = event.phaseName === 'start';
        if (!this._isAnimating) {
            this._animationDone.next();
        }
    }
    _getSelected() {
        this._modelTime = this._model.selection;
        return this._model.selection;
    }
    /** Applies the current pending selection to the global model. */
    _applyPendingSelection() {
        if (this._model !== this._globalModel) {
            this._globalModel.updateSelection(this._model.selection, this);
        }
    }
    /**
     * Assigns a new portal containing the datepicker actions.
     * @param portal Portal with the actions to be assigned.
     * @param forceRerender Whether a re-render of the portal should be triggered. This isn't
     * necessary if the portal is assigned during initialization, but it may be required if it's
     * added at a later point.
     */
    _assignActions(portal, forceRerender) {
        // If we have actions, clone the model so that we have the ability to cancel the selection,
        // otherwise update the global model directly. Note that we want to assign this as soon as
        // possible, but `_actionsPortal` isn't available in the constructor so we do it in `ngOnInit`.
        this._model = portal ? this._globalModel.clone() : this._globalModel;
        this._actionsPortal = portal;
        if (forceRerender) {
            this._changeDetectorRef.detectChanges();
        }
    }
}
/** @nocollapse */ NgxMatDatepickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.NgxMatDateSelectionModel }, { token: i2.NgxMatDateAdapter }, { token: NGX_MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }, { token: i3.NgxMatDatepickerIntl }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatDatepickerContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerContent, selector: "ngx-mat-datepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.start": "_handleAnimationEvent($event)", "@transformPanel.done": "_handleAnimationEvent($event)" }, properties: { "@transformPanel": "_animationState", "class.mat-datepicker-content-touch": "datepicker.touchUi", "class.mat-datepicker-content-touch-with-time": "!datepicker.hideTime" }, classAttribute: "mat-datepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: NgxMatCalendar, descendants: true }], exportAs: ["ngxMatDatepickerContent"], usesInheritance: true, ngImport: i0, template: "<div cdkTrapFocus role=\"dialog\" [attr.aria-modal]=\"true\" [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\"\n  [class.mat-datepicker-content-container-with-time]=\"!datepicker._hideTime\"\n  >\n  <ngx-mat-calendar [id]=\"datepicker.id\" [ngClass]=\"datepicker.panelClass\" [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\" [minDate]=\"datepicker._getMinDate()\" [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\" [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\" [dateClass]=\"datepicker.dateClass\" [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\" [@fadeInCalendar]=\"'enter'\" [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\" (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\" (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\" (_userDragDrop)=\"_handleUserDragDrop($event)\"></ngx-mat-calendar>\n\n  <ng-container *ngIf=\"isViewMonth\">\n    <div *ngIf=\"!datepicker._hideTime\" class=\"time-container\" [class.disable-seconds]=\"!datepicker._showSeconds\">\n      <ngx-mat-timepicker [showSpinners]=\"datepicker._showSpinners\" [showSeconds]=\"datepicker._showSeconds\"\n        [disabled]=\"datepicker._disabled || !_modelTime\" [stepHour]=\"datepicker._stepHour\"\n        [stepMinute]=\"datepicker._stepMinute\" [stepSecond]=\"datepicker._stepSecond\" [(ngModel)]=\"_modelTime\"\n        [color]=\"datepicker._color\" [enableMeridian]=\"datepicker._enableMeridian\"\n        [disableMinute]=\"datepicker._disableMinute\" (ngModelChange)=\"onTimeChanged($event)\">\n      </ngx-mat-timepicker>\n    </div>\n  </ng-container>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button type=\"button\" mat-raised-button [color]=\"color || 'primary'\" class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\" (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\" (click)=\"datepicker.close()\">{{ _closeButtonText }}\n  </button>\n</div>", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.time-container{display:flex;position:relative;padding-top:5px;justify-content:center}.time-container.disable-seconds .ngx-mat-timepicker .table{margin-left:9px}.time-container:before{content:\"\";position:absolute;top:0;left:0;right:0;height:1px;background-color:#0000001f}.mat-datepicker-content-touch{display:block;max-height:90vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:815px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:90vh}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time{height:auto}}@media all and (orientation: portrait){.mat-datepicker-content-touch{max-height:100vh}.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time{height:auto;max-height:870px}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time.mat-datepicker-content-container-with-actions{max-height:none!important}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"], dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "directive", type: i6.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i7.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }, { kind: "component", type: i8.NgxMatTimepickerComponent, selector: "ngx-mat-timepicker", inputs: ["disabled", "showSpinners", "stepHour", "stepMinute", "stepSecond", "showSeconds", "disableMinute", "enableMeridian", "defaultTime", "color"], exportAs: ["ngxMatTimepicker"] }, { kind: "directive", type: i9.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i9.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i10.NgxMatCalendar, selector: "ngx-mat-calendar", inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName"], outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection", "_userDragDrop"], exportAs: ["ngxMatCalendar"] }], animations: [ngxMatDatepickerAnimations.transformPanel, ngxMatDatepickerAnimations.fadeInCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-mat-datepicker-content', host: {
                        'class': 'mat-datepicker-content',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.start)': '_handleAnimationEvent($event)',
                        '(@transformPanel.done)': '_handleAnimationEvent($event)',
                        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                        '[class.mat-datepicker-content-touch-with-time]': '!datepicker.hideTime',
                    }, animations: [ngxMatDatepickerAnimations.transformPanel, ngxMatDatepickerAnimations.fadeInCalendar], exportAs: 'ngxMatDatepickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<div cdkTrapFocus role=\"dialog\" [attr.aria-modal]=\"true\" [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\"\n  [class.mat-datepicker-content-container-with-time]=\"!datepicker._hideTime\"\n  >\n  <ngx-mat-calendar [id]=\"datepicker.id\" [ngClass]=\"datepicker.panelClass\" [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\" [minDate]=\"datepicker._getMinDate()\" [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\" [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\" [dateClass]=\"datepicker.dateClass\" [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\" [@fadeInCalendar]=\"'enter'\" [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\" (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\" (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\" (_userDragDrop)=\"_handleUserDragDrop($event)\"></ngx-mat-calendar>\n\n  <ng-container *ngIf=\"isViewMonth\">\n    <div *ngIf=\"!datepicker._hideTime\" class=\"time-container\" [class.disable-seconds]=\"!datepicker._showSeconds\">\n      <ngx-mat-timepicker [showSpinners]=\"datepicker._showSpinners\" [showSeconds]=\"datepicker._showSeconds\"\n        [disabled]=\"datepicker._disabled || !_modelTime\" [stepHour]=\"datepicker._stepHour\"\n        [stepMinute]=\"datepicker._stepMinute\" [stepSecond]=\"datepicker._stepSecond\" [(ngModel)]=\"_modelTime\"\n        [color]=\"datepicker._color\" [enableMeridian]=\"datepicker._enableMeridian\"\n        [disableMinute]=\"datepicker._disableMinute\" (ngModelChange)=\"onTimeChanged($event)\">\n      </ngx-mat-timepicker>\n    </div>\n  </ng-container>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button type=\"button\" mat-raised-button [color]=\"color || 'primary'\" class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\" (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\" (click)=\"datepicker.close()\">{{ _closeButtonText }}\n  </button>\n</div>", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.time-container{display:flex;position:relative;padding-top:5px;justify-content:center}.time-container.disable-seconds .ngx-mat-timepicker .table{margin-left:9px}.time-container:before{content:\"\";position:absolute;top:0;left:0;right:0;height:1px;background-color:#0000001f}.mat-datepicker-content-touch{display:block;max-height:90vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:815px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:90vh}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time{height:auto}}@media all and (orientation: portrait){.mat-datepicker-content-touch{max-height:100vh}.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time{height:auto;max-height:870px}.mat-datepicker-content-touch .mat-datepicker-content-container.mat-datepicker-content-container-with-time.mat-datepicker-content-container-with-actions{max-height:none!important}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.NgxMatDateSelectionModel }, { type: i2.NgxMatDateAdapter }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_RANGE_SELECTION_STRATEGY]
                }] }, { type: i3.NgxMatDatepickerIntl }]; }, propDecorators: { _calendar: [{
                type: ViewChild,
                args: [NgxMatCalendar]
            }] } });
/** Base class for a datepicker. */
export class NgxMatDatepickerBase {
    constructor(_overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _model) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._model = _model;
        this._inputStateChanges = Subscription.EMPTY;
        this._document = inject(DOCUMENT);
        /** The view that the calendar should start in. */
        this.startView = 'month';
        this._touchUi = false;
        this._hideTime = false;
        /** Preferred position of the datepicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the datepicker in the Y axis. */
        this.yPosition = 'below';
        this._restoreFocus = true;
        /**
         * Emits selected year in multiyear view.
         * This doesn't imply a change on the selected date.
         */
        this.yearSelected = new EventEmitter();
        /**
         * Emits selected month in year view.
         * This doesn't imply a change on the selected date.
         */
        this.monthSelected = new EventEmitter();
        /**
         * Emits when the current view changes.
         */
        this.viewChanged = new EventEmitter(true);
        /** Emits when the datepicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the datepicker has been closed. */
        this.closedStream = new EventEmitter();
        this._opened = false;
        this._showSpinners = true;
        this._showSeconds = false;
        this._stepHour = DEFAULT_STEP;
        this._stepMinute = DEFAULT_STEP;
        this._stepSecond = DEFAULT_STEP;
        this._enableMeridian = false;
        /** The id for the datepicker calendar. */
        this.id = `mat-datepicker-${datepickerUid++}`;
        /** The element that was focused before the datepicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        /** Emits when the datepicker's state changes. */
        this.stateChanges = new Subject();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('NgxMatDateAdapter');
        }
        this._scrollStrategy = scrollStrategy;
    }
    /** The date to open the calendar to initially. */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this.datepickerInput ? this.datepickerInput.getStartValue() : null);
    }
    set startAt(value) {
        this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** Color palette to use on the datepicker's calendar. */
    get color() {
        return (this._color || (this.datepickerInput ? this.datepickerInput.getThemePalette() : undefined));
    }
    set color(value) {
        this._color = value;
    }
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a dropdown and elements have more padding to allow for bigger touch targets.
     */
    get touchUi() {
        return this._touchUi;
    }
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    get hideTime() { return this._hideTime; }
    set hideTime(value) {
        this._hideTime = coerceBooleanProperty(value);
    }
    /** Whether the datepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datepickerInput
            ? this.datepickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this.stateChanges.next(undefined);
        }
    }
    /**
     * Whether to restore focus to the previously-focused element when the calendar is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus() {
        return this._restoreFocus;
    }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
    }
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass() {
        return this._panelClass;
    }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** Whether the timepicker'spinners is shown. */
    get showSpinners() { return this._showSpinners; }
    set showSpinners(value) { this._showSpinners = value; }
    /** Whether the second part is disabled. */
    get showSeconds() { return this._showSeconds; }
    set showSeconds(value) { this._showSeconds = value; }
    /** Step hour */
    get stepHour() { return this._stepHour; }
    set stepHour(value) { this._stepHour = value; }
    /** Step minute */
    get stepMinute() { return this._stepMinute; }
    set stepMinute(value) { this._stepMinute = value; }
    /** Step second */
    get stepSecond() { return this._stepSecond; }
    set stepSecond(value) { this._stepSecond = value; }
    /** Enable meridian */
    get enableMeridian() { return this._enableMeridian; }
    set enableMeridian(value) { this._enableMeridian = value; }
    /** disable minute */
    get disableMinute() { return this._disableMinute; }
    set disableMinute(value) { this._disableMinute = value; }
    /** Step second */
    get defaultTime() { return this._defaultTime; }
    set defaultTime(value) { this._defaultTime = value; }
    /** The minimum selectable date. */
    _getMinDate() {
        return this.datepickerInput && this.datepickerInput.min;
    }
    /** The maximum selectable date. */
    _getMaxDate() {
        return this.datepickerInput && this.datepickerInput.max;
    }
    _getDateFilter() {
        return this.datepickerInput && this.datepickerInput.dateFilter;
    }
    ngOnChanges(changes) {
        const positionChange = changes['xPosition'] || changes['yPosition'];
        if (positionChange && !positionChange.firstChange && this._overlayRef) {
            const positionStrategy = this._overlayRef.getConfig().positionStrategy;
            if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
                this._setConnectedPositions(positionStrategy);
                if (this.opened) {
                    this._overlayRef.updatePosition();
                }
            }
        }
        this.stateChanges.next(undefined);
    }
    ngOnDestroy() {
        this._destroyOverlay();
        this.close();
        this._inputStateChanges.unsubscribe();
        this.stateChanges.complete();
    }
    /** Selects the given date */
    select(date) {
        this._model.add(date);
    }
    /** Emits the selected year in multiyear view */
    _selectYear(normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    }
    /** Emits selected month in year view */
    _selectMonth(normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    }
    /** Emits changed view */
    _viewChanged(view) {
        this.viewChanged.emit(view);
    }
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     * @returns Selection model that the input should hook itself up to.
     */
    registerInput(input) {
        if (this.datepickerInput) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._inputStateChanges.unsubscribe();
        this.datepickerInput = input;
        this._inputStateChanges = input.stateChanges.subscribe(() => this.stateChanges.next(undefined));
        return this._model;
    }
    /**
     * Registers a portal containing action buttons with the datepicker.
     * @param portal Portal to be registered.
     */
    registerActions(portal) {
        if (this._actionsPortal) {
            throw Error('A MatDatepicker can only be associated with a single actions row.');
        }
        this._actionsPortal = portal;
        this._componentRef?.instance._assignActions(portal, true);
    }
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal) {
        if (portal === this._actionsPortal) {
            this._actionsPortal = null;
            this._componentRef?.instance._assignActions(null, true);
        }
    }
    /** Open the calendar. */
    open() {
        // Skip reopening if there's an in-progress animation to avoid overlapping
        // sequences which can cause "changed after checked" errors. See #25837.
        if (this._opened || this.disabled || this._componentRef?.instance._isAnimating) {
            return;
        }
        if (!this.datepickerInput) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
        this._openOverlay();
        this._opened = true;
        this.openedStream.emit();
    }
    /** Close the calendar. */
    close() {
        // Skip reopening if there's an in-progress animation to avoid overlapping
        // sequences which can cause "changed after checked" errors. See #25837.
        if (!this._opened || this._componentRef?.instance._isAnimating) {
            return;
        }
        const canRestoreFocus = this._restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function';
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
            }
        };
        if (this._componentRef) {
            const { instance, location } = this._componentRef;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => {
                const activeElement = this._document.activeElement;
                // Since we restore focus after the exit animation, we have to check that
                // the user didn't move focus themselves inside the `close` handler.
                if (canRestoreFocus &&
                    (!activeElement ||
                        activeElement === this._document.activeElement ||
                        location.nativeElement.contains(activeElement))) {
                    this._focusedElementBeforeOpen.focus();
                }
                this._focusedElementBeforeOpen = null;
                this._destroyOverlay();
            });
        }
        if (canRestoreFocus) {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /** Applies the current pending selection on the overlay to the model. */
    _applyPendingSelection() {
        this._componentRef?.instance?._applyPendingSelection();
    }
    /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
    _forwardContentValues(instance) {
        instance.datepicker = this;
        instance.color = this.color;
        instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
        instance._assignActions(this._actionsPortal, false);
    }
    /** Opens the overlay with the calendar. */
    _openOverlay() {
        this._destroyOverlay();
        const isDialog = this.touchUi;
        const portal = new ComponentPortal(NgxMatDatepickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: [
                isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
                this._backdropHarnessClass,
            ],
            direction: this._dir,
            scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
            panelClass: `mat-datepicker-${isDialog ? 'dialog' : 'popup'}`,
        })));
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        // The `preventDefault` call happens inside the calendar as well, however focus moves into
        // it inside a timeout which can give browsers a chance to fire off a keyboard event in-between
        // that can scroll the page (see #24969). Always block default actions of arrow keys for the
        // entire overlay so the page doesn't get scrolled by accident.
        overlayRef.keydownEvents().subscribe(event => {
            const keyCode = event.keyCode;
            if (keyCode === UP_ARROW ||
                keyCode === DOWN_ARROW ||
                keyCode === LEFT_ARROW ||
                keyCode === RIGHT_ARROW ||
                keyCode === PAGE_UP ||
                keyCode === PAGE_DOWN) {
                event.preventDefault();
            }
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the calendar has rendered. Only relevant in dropdown mode.
        if (!isDialog) {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
        }
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDialogStrategy() {
        return this._overlay.position().global().centerHorizontally().centerVertically();
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mat-datepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
    }
    /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
    _setConnectedPositions(strategy) {
        const primaryX = this.xPosition === 'end' ? 'end' : 'start';
        const secondaryX = primaryX === 'start' ? 'end' : 'start';
        const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
        const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
        return strategy.withPositions([
            {
                originX: primaryX,
                originY: secondaryY,
                overlayX: primaryX,
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        const ctrlShiftMetaModifiers = ['ctrlKey', 'shiftKey', 'metaKey'];
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.datepickerInput &&
                    hasModifierKey(event, 'altKey') &&
                    event.keyCode === UP_ARROW &&
                    ctrlShiftMetaModifiers.every((modifier) => !hasModifierKey(event, modifier))));
        })));
    }
}
/** @nocollapse */ NgxMatDatepickerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerBase, deps: [{ token: i11.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: NGX_MAT_DATEPICKER_SCROLL_STRATEGY }, { token: i2.NgxMatDateAdapter, optional: true }, { token: i12.Directionality, optional: true }, { token: i1.NgxMatDateSelectionModel }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDatepickerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerBase, inputs: { calendarHeaderComponent: "calendarHeaderComponent", startAt: "startAt", startView: "startView", color: "color", touchUi: "touchUi", hideTime: "hideTime", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus", dateClass: "dateClass", panelClass: "panelClass", opened: "opened", showSpinners: "showSpinners", showSeconds: "showSeconds", stepHour: "stepHour", stepMinute: "stepMinute", stepSecond: "stepSecond", enableMeridian: "enableMeridian", disableMinute: "disableMinute", defaultTime: "defaultTime" }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", viewChanged: "viewChanged", openedStream: "opened", closedStream: "closed" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i11.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_MAT_DATEPICKER_SCROLL_STRATEGY]
                }] }, { type: i2.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i12.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i1.NgxMatDateSelectionModel }]; }, propDecorators: { calendarHeaderComponent: [{
                type: Input
            }], startAt: [{
                type: Input
            }], startView: [{
                type: Input
            }], color: [{
                type: Input
            }], touchUi: [{
                type: Input
            }], hideTime: [{
                type: Input
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], dateClass: [{
                type: Input
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], panelClass: [{
                type: Input
            }], opened: [{
                type: Input
            }], showSpinners: [{
                type: Input
            }], showSeconds: [{
                type: Input
            }], stepHour: [{
                type: Input
            }], stepMinute: [{
                type: Input
            }], stepSecond: [{
                type: Input
            }], enableMeridian: [{
                type: Input
            }], disableMinute: [{
                type: Input
            }], defaultTime: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvZGF0ZXBpY2tlci1iYXNlLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9GLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFVBQVUsRUFDVixTQUFTLEVBQ1QsT0FBTyxFQUNQLFdBQVcsRUFDWCxRQUFRLEVBQ1IsY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLGlDQUFpQyxFQUNqQyxPQUFPLEVBQ1AsYUFBYSxHQUdkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBaUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUVMLHVCQUF1QixFQUV2QixTQUFTLEVBRVQsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFLTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBMEIsVUFBVSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUUsT0FBTyxFQUFjLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFF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QUs7Z0JBT0YsVUFBVTtzQkFEYixLQUFLO2dCQU9GLGNBQWM7c0JBRGpCLEtBQUs7Z0JBT0YsYUFBYTtzQkFEaEIsS0FBSztnQkFPRixXQUFXO3NCQURkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25FdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTGlzdEtleU1hbmFnZXJNb2RpZmllcktleSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZVN0cmluZ0FycmF5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVTQ0FQRSxcbiAgTEVGVF9BUlJPVyxcbiAgUEFHRV9ET1dOLFxuICBQQUdFX1VQLFxuICBSSUdIVF9BUlJPVyxcbiAgVVBfQVJST1csXG4gIGhhc01vZGlmaWVyS2V5LFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FuQ29sb3IsIFRoZW1lUGFsZXR0ZSwgbWl4aW5Db2xvciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBtZXJnZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTmd4TWF0Q2FsZW5kYXIsIE5neE1hdENhbGVuZGFyVmlldyB9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHsgTmd4TWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbiwgTmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQgfSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7XG4gIE5HWF9NQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIE5neE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7XG4gIE5neERhdGVSYW5nZSxcbiAgTmd4RXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbixcbiAgTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxufSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7IG5neE1hdERhdGVwaWNrZXJBbmltYXRpb25zIH0gZnJvbSAnLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7IE5neERhdGVGaWx0ZXJGbiB9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7IE5neE1hdERhdGVwaWNrZXJJbnRsIH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuaW1wb3J0IHsgREVGQVVMVF9TVEVQIH0gZnJvbSAnLi91dGlscy9kYXRlLXV0aWxzJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgSUQgZm9yIGVhY2ggZGF0ZXBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBkYXRlcGlja2VyVWlkID0gMDtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBOR1hfTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ25neC1tYXQtZGF0ZXBpY2tlci1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBOR1hfTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBOZ3hEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnIHwgJ2VuZCc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBZIGF4aXMuICovXG5leHBvcnQgdHlwZSBOZ3hEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBOR1hfTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE5HWF9NQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTkdYX01BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXREYXRlcGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTmd4TWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG4gIH0sXG4pO1xuXG4vKipcbiAqIENvbXBvbmVudCB1c2VkIGFzIHRoZSBjb250ZW50IGZvciB0aGUgZGF0ZXBpY2tlciBvdmVybGF5LiBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mIHVzaW5nXG4gKiBNYXRDYWxlbmRhciBkaXJlY3RseSBhcyB0aGUgY29udGVudCBzbyB3ZSBjYW4gY29udHJvbCB0aGUgaW5pdGlhbCBmb2N1cy4gVGhpcyBhbHNvIGdpdmVzIHVzIGFcbiAqIHBsYWNlIHRvIHB1dCBhZGRpdGlvbmFsIGZlYXR1cmVzIG9mIHRoZSBvdmVybGF5IHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjYWxlbmRhciBpdHNlbGYgaW4gdGhlXG4gKiBmdXR1cmUuIChlLmcuIGNvbmZpcm1hdGlvbiBidXR0b25zKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGVwaWNrZXItY29udGVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGVwaWNrZXItY29udGVudC5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuc3RhcnQpJzogJ19oYW5kbGVBbmltYXRpb25FdmVudCgkZXZlbnQpJyxcbiAgICAnKEB0cmFuc2Zvcm1QYW5lbC5kb25lKSc6ICdfaGFuZGxlQW5pbWF0aW9uRXZlbnQoJGV2ZW50KScsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXBpY2tlci1jb250ZW50LXRvdWNoXSc6ICdkYXRlcGlja2VyLnRvdWNoVWknLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItY29udGVudC10b3VjaC13aXRoLXRpbWVdJzogJyFkYXRlcGlja2VyLmhpZGVUaW1lJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW25neE1hdERhdGVwaWNrZXJBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsLCBuZ3hNYXREYXRlcGlja2VyQW5pbWF0aW9ucy5mYWRlSW5DYWxlbmRhcl0sXG4gIGV4cG9ydEFzOiAnbmd4TWF0RGF0ZXBpY2tlckNvbnRlbnQnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG59KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQgPSBOZ3hFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBleHRlbmRzIF9OZ3hNYXREYXRlcGlja2VyQ29udGVudEJhc2VcbiAgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcml2YXRlIF9tb2RlbDogTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+O1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBjYWxlbmRhciBjb21wb25lbnQuICovXG4gIEBWaWV3Q2hpbGQoTmd4TWF0Q2FsZW5kYXIpIF9jYWxlbmRhcjogTmd4TWF0Q2FsZW5kYXI8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZGF0ZXBpY2tlciB0aGF0IGNyZWF0ZWQgdGhlIG92ZXJsYXkuICovXG4gIGRhdGVwaWNrZXI6IE5neE1hdERhdGVwaWNrZXJCYXNlPGFueSwgUywgRD47XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xuXG4gIC8qKiBBUklBIEFjY2Vzc2libGUgbmFtZSBvZiB0aGUgYDxpbnB1dCBtYXRTdGFydERhdGUvPmAgKi9cbiAgc3RhcnREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdEVuZERhdGUvPmAgKi9cbiAgZW5kRGF0ZUFjY2Vzc2libGVOYW1lOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlzIGFib3ZlIG9yIGJlbG93IHRoZSBpbnB1dC4gKi9cbiAgX2lzQWJvdmU6IGJvb2xlYW47XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAnZW50ZXItZHJvcGRvd24nIHwgJ2VudGVyLWRpYWxvZycgfCAndm9pZCc7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGFuIGluLXByb2dyZXNzIGFuaW1hdGlvbi4gKi9cbiAgX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBjbG9zZSBidXR0b24uICovXG4gIF9jbG9zZUJ1dHRvblRleHQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY2xvc2UgYnV0dG9uIGN1cnJlbnRseSBoYXMgZm9jdXMuICovXG4gIF9jbG9zZUJ1dHRvbkZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFBvcnRhbCB3aXRoIHByb2plY3RlZCBhY3Rpb24gYnV0dG9ucy4gKi9cbiAgX2FjdGlvbnNQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIElkIG9mIHRoZSBsYWJlbCBmb3IgdGhlIGByb2xlPVwiZGlhbG9nXCJgIGVsZW1lbnQuICovXG4gIF9kaWFsb2dMYWJlbElkOiBzdHJpbmcgfCBudWxsO1xuXG4gIGdldCBpc1ZpZXdNb250aCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX2NhbGVuZGFyIHx8IHRoaXMuX2NhbGVuZGFyLmN1cnJlbnRWaWV3ID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9jYWxlbmRhci5jdXJyZW50VmlldyA9PSAnbW9udGgnO1xuICB9XG5cbiAgX21vZGVsVGltZTogRCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZ2xvYmFsTW9kZWw6IE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPixcbiAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE5HWF9NQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1kpXG4gICAgcHJpdmF0ZSBfcmFuZ2VTZWxlY3Rpb25TdHJhdGVneTogTmd4TWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4sXG4gICAgaW50bDogTmd4TWF0RGF0ZXBpY2tlckludGwsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2Nsb3NlQnV0dG9uVGV4dCA9IGludGwuY2xvc2VDYWxlbmRhckxhYmVsO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmRhdGVwaWNrZXIudG91Y2hVaSA/ICdlbnRlci1kaWFsb2cnIDogJ2VudGVyLWRyb3Bkb3duJztcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuX2NhbGVuZGFyLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIG9uVGltZUNoYW5nZWQoc2VsZWN0ZWREYXRlV2l0aFRpbWU6IEQgfCBudWxsKSB7XG4gICAgY29uc3QgdXNlckV2ZW50OiBOZ3hNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4gPSB7XG4gICAgICB2YWx1ZTogc2VsZWN0ZWREYXRlV2l0aFRpbWUsXG4gICAgICBldmVudDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLl91cGRhdGVVc2VyU2VsZWN0aW9uV2l0aENhbGVuZGFyVXNlckV2ZW50KHVzZXJFdmVudCk7XG4gIH1cblxuICBfaGFuZGxlVXNlclNlbGVjdGlvbihldmVudDogTmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KSB7XG4gICAgdGhpcy5fdXBkYXRlVXNlclNlbGVjdGlvbldpdGhDYWxlbmRhclVzZXJFdmVudChldmVudCk7XG5cbiAgICAvLyBEZWxlZ2F0ZSBjbG9zaW5nIHRoZSBvdmVybGF5IHRvIHRoZSBhY3Rpb25zLlxuICAgIGlmICh0aGlzLmRhdGVwaWNrZXIuaGlkZVRpbWUpIHtcbiAgICAgIGlmICgoIXRoaXMuX21vZGVsIHx8IHRoaXMuX21vZGVsLmlzQ29tcGxldGUoKSkgJiYgIXRoaXMuX2FjdGlvbnNQb3J0YWwpIHtcbiAgICAgICAgdGhpcy5kYXRlcGlja2VyLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVXNlclNlbGVjdGlvbldpdGhDYWxlbmRhclVzZXJFdmVudChldmVudDogTmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5fbW9kZWwuc2VsZWN0aW9uO1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudmFsdWU7XG4gICAgY29uc3QgaXNSYW5nZSA9IHNlbGVjdGlvbiBpbnN0YW5jZW9mIE5neERhdGVSYW5nZTtcblxuICAgIC8vIElmIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlIGFuZCB3ZSBoYXZlIGEgc2VsZWN0aW9uIHN0cmF0ZWd5LCBhbHdheXMgcGFzcyB0aGUgdmFsdWUgdGhyb3VnaFxuICAgIC8vIHRoZXJlLiBPdGhlcndpc2UgZG9uJ3QgYXNzaWduIG51bGwgdmFsdWVzIHRvIHRoZSBtb2RlbCwgdW5sZXNzIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlLlxuICAgIC8vIEEgbnVsbCB2YWx1ZSB3aGVuIHBpY2tpbmcgYSByYW5nZSBtZWFucyB0aGF0IHRoZSB1c2VyIGNhbmNlbGxlZCB0aGUgc2VsZWN0aW9uIChlLmcuIGJ5XG4gICAgLy8gcHJlc3NpbmcgZXNjYXBlKSwgd2hlcmVhcyB3aGVuIHNlbGVjdGluZyBhIHNpbmdsZSB2YWx1ZSBpdCBtZWFucyB0aGF0IHRoZSB2YWx1ZSBkaWRuJ3RcbiAgICAvLyBjaGFuZ2UuIFRoaXMgaXNuJ3QgdmVyeSBpbnR1aXRpdmUsIGJ1dCBpdCdzIGhlcmUgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICAgIGlmIChpc1JhbmdlICYmIHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kuc2VsZWN0aW9uRmluaXNoZWQoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBOZ3hEYXRlUmFuZ2U8RD4sXG4gICAgICAgIGV2ZW50LmV2ZW50LFxuICAgICAgKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihuZXdTZWxlY3Rpb24gYXMgdW5rbm93biBhcyBTLCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaXNTYW1lVGltZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmlzU2FtZVRpbWUoc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCwgdmFsdWUpO1xuICAgICAgY29uc3QgaXNTYW1lRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbHVlLCBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEKTtcbiAgICAgIGNvbnN0IGlzU2FtZSA9IGlzU2FtZURhdGUgJiYgaXNTYW1lVGltZTtcblxuICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgIChpc1JhbmdlIHx8ICFpc1NhbWUpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuYWRkKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIF9oYW5kbGVVc2VyRHJhZ0Ryb3AoZXZlbnQ6IE5neE1hdENhbGVuZGFyVXNlckV2ZW50PE5neERhdGVSYW5nZTxEPj4pIHtcbiAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24oZXZlbnQudmFsdWUgYXMgdW5rbm93biBhcyBTLCB0aGlzKTtcbiAgfVxuXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFuZGxlQW5pbWF0aW9uRXZlbnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgdGhpcy5faXNBbmltYXRpbmcgPSBldmVudC5waGFzZU5hbWUgPT09ICdzdGFydCc7XG5cbiAgICBpZiAoIXRoaXMuX2lzQW5pbWF0aW5nKSB7XG4gICAgICB0aGlzLl9hbmltYXRpb25Eb25lLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0U2VsZWN0ZWQoKSB7XG4gICAgdGhpcy5fbW9kZWxUaW1lID0gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRDtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCB8IE5neERhdGVSYW5nZTxEPiB8IG51bGw7XG4gIH1cblxuICAvKiogQXBwbGllcyB0aGUgY3VycmVudCBwZW5kaW5nIHNlbGVjdGlvbiB0byB0aGUgZ2xvYmFsIG1vZGVsLiAqL1xuICBfYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCAhPT0gdGhpcy5fZ2xvYmFsTW9kZWwpIHtcbiAgICAgIHRoaXMuX2dsb2JhbE1vZGVsLnVwZGF0ZVNlbGVjdGlvbih0aGlzLl9tb2RlbC5zZWxlY3Rpb24sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ25zIGEgbmV3IHBvcnRhbCBjb250YWluaW5nIHRoZSBkYXRlcGlja2VyIGFjdGlvbnMuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHdpdGggdGhlIGFjdGlvbnMgdG8gYmUgYXNzaWduZWQuXG4gICAqIEBwYXJhbSBmb3JjZVJlcmVuZGVyIFdoZXRoZXIgYSByZS1yZW5kZXIgb2YgdGhlIHBvcnRhbCBzaG91bGQgYmUgdHJpZ2dlcmVkLiBUaGlzIGlzbid0XG4gICAqIG5lY2Vzc2FyeSBpZiB0aGUgcG9ydGFsIGlzIGFzc2lnbmVkIGR1cmluZyBpbml0aWFsaXphdGlvbiwgYnV0IGl0IG1heSBiZSByZXF1aXJlZCBpZiBpdCdzXG4gICAqIGFkZGVkIGF0IGEgbGF0ZXIgcG9pbnQuXG4gICAqL1xuICBfYXNzaWduQWN0aW9ucyhwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPGFueT4gfCBudWxsLCBmb3JjZVJlcmVuZGVyOiBib29sZWFuKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zLCBjbG9uZSB0aGUgbW9kZWwgc28gdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvIGNhbmNlbCB0aGUgc2VsZWN0aW9uLFxuICAgIC8vIG90aGVyd2lzZSB1cGRhdGUgdGhlIGdsb2JhbCBtb2RlbCBkaXJlY3RseS4gTm90ZSB0aGF0IHdlIHdhbnQgdG8gYXNzaWduIHRoaXMgYXMgc29vbiBhc1xuICAgIC8vIHBvc3NpYmxlLCBidXQgYF9hY3Rpb25zUG9ydGFsYCBpc24ndCBhdmFpbGFibGUgaW4gdGhlIGNvbnN0cnVjdG9yIHNvIHdlIGRvIGl0IGluIGBuZ09uSW5pdGAuXG4gICAgdGhpcy5fbW9kZWwgPSBwb3J0YWwgPyB0aGlzLl9nbG9iYWxNb2RlbC5jbG9uZSgpIDogdGhpcy5fZ2xvYmFsTW9kZWw7XG4gICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IHBvcnRhbDtcblxuICAgIGlmIChmb3JjZVJlcmVuZGVyKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmd4TWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogTmd4RGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIGdldE92ZXJsYXlMYWJlbElkKCk6IHN0cmluZyB8IG51bGw7XG4gIHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcbn1cblxuLyoqIEEgZGF0ZXBpY2tlciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBhIHtAbGluayBOZ3hNYXREYXRlcGlja2VyQ29udHJvbH0uICovXG5leHBvcnQgaW50ZXJmYWNlIE5neE1hdERhdGVwaWNrZXJQYW5lbDxcbiAgQyBleHRlbmRzIE5neE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LFxuICBTLFxuICBEID0gTmd4RXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPixcbj4ge1xuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGRhdGUgcGlja2VyIGlzIGNsb3NlZC4gKi9cbiAgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIC8qKiBDb2xvciBwYWxldHRlIHRvIHVzZSBvbiB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBjb2xvcjogVGhlbWVQYWxldHRlO1xuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRlcGlja2VySW5wdXQ6IEM7XG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVkOiBib29sZWFuO1xuICAvKiogVGhlIGlkIGZvciB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nO1xuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpcyBvcGVuLiAqL1xuICBvcGVuZWQ6IGJvb2xlYW47XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0ZSBwaWNrZXIgaXMgb3BlbmVkLiAqL1xuICBvcGVuZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD47XG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgb3BlbigpOiB2b2lkO1xuICAvKiogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGEgZGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJCYXNlPFxuICBDIGV4dGVuZHMgTmd4TWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sXG4gIFMsXG4gIEQgPSBOZ3hFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+LFxuPiBpbXBsZW1lbnRzIE5neE1hdERhdGVwaWNrZXJQYW5lbDxDLCBTLCBEPiwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2lucHV0U3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cbiAgLyoqIEFuIGlucHV0IGluZGljYXRpbmcgdGhlIHR5cGUgb2YgdGhlIGN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGZvciB0aGUgY2FsZW5kYXIsIGlmIHNldC4gKi9cbiAgQElucHV0KCkgY2FsZW5kYXJIZWFkZXJDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8YW55PjtcblxuICAvKiogVGhlIGRhdGUgdG8gb3BlbiB0aGUgY2FsZW5kYXIgdG8gaW5pdGlhbGx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gZXhwbGljaXQgc3RhcnRBdCBpcyBzZXQgd2Ugc3RhcnQgdGhlcmUsIG90aGVyd2lzZSB3ZSBzdGFydCBhdCB3aGF0ZXZlciB0aGUgY3VycmVudGx5XG4gICAgLy8gc2VsZWN0ZWQgdmFsdWUgaXMuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0QXQgfHwgKHRoaXMuZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9jb2xvciB8fCAodGhpcy5kYXRlcGlja2VySW5wdXQgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRUaGVtZVBhbGV0dGUoKSA6IHVuZGVmaW5lZClcbiAgICApO1xuICB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBkcm9wZG93biBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvdWNoVWkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdWNoVWk7XG4gIH1cbiAgc2V0IHRvdWNoVWkodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3RvdWNoVWkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3RvdWNoVWkgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBnZXQgaGlkZVRpbWUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlVGltZTsgfVxuICBzZXQgaGlkZVRpbWUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlVGltZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHVibGljIF9oaWRlVGltZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dFxuICAgICAgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5kaXNhYmxlZFxuICAgICAgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cbiAgcHVibGljIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHhQb3NpdGlvbjogTmd4RGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JztcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHlQb3NpdGlvbjogTmd4RGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXN0b3JlIGZvY3VzIHRvIHRoZSBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCB3aGVuIHRoZSBjYWxlbmRhciBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBhdXRvbWF0aWMgZm9jdXMgcmVzdG9yYXRpb24gaXMgYW4gYWNjZXNzaWJpbGl0eSBmZWF0dXJlIGFuZCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0XG4gICAqIHlvdSBwcm92aWRlIHlvdXIgb3duIGVxdWl2YWxlbnQsIGlmIHlvdSBkZWNpZGUgdG8gdHVybiBpdCBvZmYuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVzdG9yZUZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXN0b3JlRm9jdXM7XG4gIH1cbiAgc2V0IHJlc3RvcmVGb2N1cyh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVzdG9yZUZvY3VzID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9yZXN0b3JlRm9jdXMgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBzZWxlY3RlZCB5ZWFyIGluIG11bHRpeWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgeWVhclNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1vbnRoU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgY3VycmVudCB2aWV3IGNoYW5nZXMuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmlld0NoYW5nZWQ6IEV2ZW50RW1pdHRlcjxOZ3hNYXRDYWxlbmRhclZpZXc+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hNYXRDYWxlbmRhclZpZXc+KFxuICAgIHRydWUsXG4gICk7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gYWRkIGN1c3RvbSBDU1MgY2xhc3NlcyB0byBkYXRlcy4gKi9cbiAgQElucHV0KCkgZGF0ZUNsYXNzOiBOZ3hNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9uPEQ+O1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgcmVhZG9ubHkgb3BlbmVkU3RyZWFtID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgcmVhZG9ubHkgY2xvc2VkU3RyZWFtID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgZGF0ZSBwaWNrZXIgcGFuZWwuXG4gICAqIFN1cHBvcnRzIHN0cmluZyBhbmQgc3RyaW5nIGFycmF5IHZhbHVlcywgc2ltaWxhciB0byBgbmdDbGFzc2AuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFuZWxDbGFzcygpOiBzdHJpbmcgfCBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsQ2xhc3M7XG4gIH1cbiAgc2V0IHBhbmVsQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fcGFuZWxDbGFzcyA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9wYW5lbENsYXNzOiBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG4gIHNldCBvcGVuZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSkgPyB0aGlzLm9wZW4oKSA6IHRoaXMuY2xvc2UoKTtcbiAgfVxuICBwcml2YXRlIF9vcGVuZWQgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgdGltZXBpY2tlcidzcGlubmVycyBpcyBzaG93bi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNob3dTcGlubmVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Nob3dTcGlubmVyczsgfVxuICBzZXQgc2hvd1NwaW5uZXJzKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX3Nob3dTcGlubmVycyA9IHZhbHVlOyB9XG4gIHB1YmxpYyBfc2hvd1NwaW5uZXJzID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgc2Vjb25kIHBhcnQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93U2Vjb25kcygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Nob3dTZWNvbmRzOyB9XG4gIHNldCBzaG93U2Vjb25kcyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9zaG93U2Vjb25kcyA9IHZhbHVlOyB9XG4gIHB1YmxpYyBfc2hvd1NlY29uZHMgPSBmYWxzZTtcblxuICAvKiogU3RlcCBob3VyICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGVwSG91cigpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc3RlcEhvdXI7IH1cbiAgc2V0IHN0ZXBIb3VyKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fc3RlcEhvdXIgPSB2YWx1ZTsgfVxuICBwdWJsaWMgX3N0ZXBIb3VyOiBudW1iZXIgPSBERUZBVUxUX1NURVA7XG5cbiAgLyoqIFN0ZXAgbWludXRlICovXG4gIEBJbnB1dCgpXG4gIGdldCBzdGVwTWludXRlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zdGVwTWludXRlOyB9XG4gIHNldCBzdGVwTWludXRlKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5fc3RlcE1pbnV0ZSA9IHZhbHVlOyB9XG4gIHB1YmxpYyBfc3RlcE1pbnV0ZTogbnVtYmVyID0gREVGQVVMVF9TVEVQO1xuXG4gIC8qKiBTdGVwIHNlY29uZCAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RlcFNlY29uZCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc3RlcFNlY29uZDsgfVxuICBzZXQgc3RlcFNlY29uZCh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuX3N0ZXBTZWNvbmQgPSB2YWx1ZTsgfVxuICBwdWJsaWMgX3N0ZXBTZWNvbmQ6IG51bWJlciA9IERFRkFVTFRfU1RFUDtcblxuICAvKiogRW5hYmxlIG1lcmlkaWFuICovXG4gIEBJbnB1dCgpXG4gIGdldCBlbmFibGVNZXJpZGlhbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VuYWJsZU1lcmlkaWFuOyB9XG4gIHNldCBlbmFibGVNZXJpZGlhbih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9lbmFibGVNZXJpZGlhbiA9IHZhbHVlOyB9XG4gIHB1YmxpYyBfZW5hYmxlTWVyaWRpYW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogZGlzYWJsZSBtaW51dGUgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVNaW51dGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlTWludXRlOyB9XG4gIHNldCBkaXNhYmxlTWludXRlKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVNaW51dGUgPSB2YWx1ZTsgfVxuICBwdWJsaWMgX2Rpc2FibGVNaW51dGU6IGJvb2xlYW47XG5cbiAgLyoqIFN0ZXAgc2Vjb25kICovXG4gIEBJbnB1dCgpXG4gIGdldCBkZWZhdWx0VGltZSgpOiBudW1iZXJbXSB7IHJldHVybiB0aGlzLl9kZWZhdWx0VGltZTsgfVxuICBzZXQgZGVmYXVsdFRpbWUodmFsdWU6IG51bWJlcltdKSB7IHRoaXMuX2RlZmF1bHRUaW1lID0gdmFsdWU7IH1cbiAgcHVibGljIF9kZWZhdWx0VGltZTogbnVtYmVyW107XG5cbiAgLyoqIFRoZSBpZCBmb3IgdGhlIGRhdGVwaWNrZXIgY2FsZW5kYXIuICovXG4gIGlkOiBzdHJpbmcgPSBgbWF0LWRhdGVwaWNrZXItJHtkYXRlcGlja2VyVWlkKyt9YDtcblxuICAvKiogVGhlIG1pbmltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIF9nZXRNYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXQubWF4O1xuICB9XG5cbiAgX2dldERhdGVGaWx0ZXIoKTogTmd4RGF0ZUZpbHRlckZuPEQ+IHtcbiAgICByZXR1cm4gdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXQuZGF0ZUZpbHRlcjtcbiAgfVxuXG4gIC8qKiBBIHJlZmVyZW5jZSB0byB0aGUgb3ZlcmxheSBpbnRvIHdoaWNoIHdlJ3ZlIHJlbmRlcmVkIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbmNlIHJlbmRlcmVkIGluIHRoZSBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9jb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxOZ3hNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPj4gfCBudWxsO1xuXG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXBpY2tlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBjbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJhY2tkcm9wIHNvIHRoYXQgdGhlIHRlc3QgaGFybmVzc2VzIGNhbiBsb29rIGl0IHVwLiAqL1xuICBwcml2YXRlIF9iYWNrZHJvcEhhcm5lc3NDbGFzcyA9IGAke3RoaXMuaWR9LWJhY2tkcm9wYDtcblxuICAvKiogQ3VycmVudGx5LXJlZ2lzdGVyZWQgYWN0aW9ucyBwb3J0YWwuICovXG4gIHByaXZhdGUgX2FjdGlvbnNQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbDtcblxuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhpcyBkYXRlcGlja2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgZGF0ZXBpY2tlcklucHV0OiBDO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyJ3Mgc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChOR1hfTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBOZ3hNYXREYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX21vZGVsOiBOZ3hNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4sXG4gICkge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdOZ3hNYXREYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2UgPSBjaGFuZ2VzWyd4UG9zaXRpb24nXSB8fCBjaGFuZ2VzWyd5UG9zaXRpb24nXTtcblxuICAgIGlmIChwb3NpdGlvbkNoYW5nZSAmJiAhcG9zaXRpb25DaGFuZ2UuZmlyc3RDaGFuZ2UgJiYgdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneTtcblxuICAgICAgaWYgKHBvc2l0aW9uU3RyYXRlZ3kgaW5zdGFuY2VvZiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBnaXZlbiBkYXRlICovXG4gIHNlbGVjdChkYXRlOiBEKTogdm9pZCB7XG4gICAgdGhpcy5fbW9kZWwuYWRkKGRhdGUpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBzZWxlY3RlZCB5ZWFyIGluIG11bHRpeWVhciB2aWV3ICovXG4gIF9zZWxlY3RZZWFyKG5vcm1hbGl6ZWRZZWFyOiBEKTogdm9pZCB7XG4gICAgdGhpcy55ZWFyU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkWWVhcik7XG4gIH1cblxuICAvKiogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3ICovXG4gIF9zZWxlY3RNb250aChub3JtYWxpemVkTW9udGg6IEQpOiB2b2lkIHtcbiAgICB0aGlzLm1vbnRoU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkTW9udGgpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGNoYW5nZWQgdmlldyAqL1xuICBfdmlld0NoYW5nZWQodmlldzogTmd4TWF0Q2FsZW5kYXJWaWV3KTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZC5lbWl0KHZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGlucHV0IHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gaW5wdXQgVGhlIGRhdGVwaWNrZXIgaW5wdXQgdG8gcmVnaXN0ZXIgd2l0aCB0aGlzIGRhdGVwaWNrZXIuXG4gICAqIEByZXR1cm5zIFNlbGVjdGlvbiBtb2RlbCB0aGF0IHRoZSBpbnB1dCBzaG91bGQgaG9vayBpdHNlbGYgdXAgdG8uXG4gICAqL1xuICByZWdpc3RlcklucHV0KGlucHV0OiBDKTogTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+IHtcbiAgICBpZiAodGhpcy5kYXRlcGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdBIE1hdERhdGVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZGF0ZXBpY2tlcklucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMgPSBpbnB1dC5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKSk7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBvcnRhbCBjb250YWluaW5nIGFjdGlvbiBidXR0b25zIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3RlckFjdGlvbnMocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBhY3Rpb25zIHJvdy4nKTtcbiAgICB9XG4gICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IHBvcnRhbDtcbiAgICB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlLl9hc3NpZ25BY3Rpb25zKHBvcnRhbCwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHBvcnRhbCBjb250YWluaW5nIGFjdGlvbiBidXR0b25zIGZyb20gdGhlIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICByZW1vdmVBY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWwpOiB2b2lkIHtcbiAgICBpZiAocG9ydGFsID09PSB0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hY3Rpb25zUG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMuX2NvbXBvbmVudFJlZj8uaW5zdGFuY2UuX2Fzc2lnbkFjdGlvbnMobnVsbCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIC8vIFNraXAgcmVvcGVuaW5nIGlmIHRoZXJlJ3MgYW4gaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uIHRvIGF2b2lkIG92ZXJsYXBwaW5nXG4gICAgLy8gc2VxdWVuY2VzIHdoaWNoIGNhbiBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy4gU2VlICMyNTgzNy5cbiAgICBpZiAodGhpcy5fb3BlbmVkIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5fY29tcG9uZW50UmVmPy5pbnN0YW5jZS5faXNBbmltYXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGF0ZXBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGVkIHRvIG9wZW4gYW4gTWF0RGF0ZXBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgdGhpcy5fb3Blbk92ZXJsYXkoKTtcbiAgICB0aGlzLl9vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMub3BlbmVkU3RyZWFtLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgY2FsZW5kYXIuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIC8vIFNraXAgcmVvcGVuaW5nIGlmIHRoZXJlJ3MgYW4gaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uIHRvIGF2b2lkIG92ZXJsYXBwaW5nXG4gICAgLy8gc2VxdWVuY2VzIHdoaWNoIGNhbiBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy4gU2VlICMyNTgzNy5cbiAgICBpZiAoIXRoaXMuX29wZW5lZCB8fCB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlLl9pc0FuaW1hdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhblJlc3RvcmVGb2N1cyA9XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkU3RyZWFtLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2NvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgeyBpbnN0YW5jZSwgbG9jYXRpb24gfSA9IHRoaXMuX2NvbXBvbmVudFJlZjtcbiAgICAgIGluc3RhbmNlLl9zdGFydEV4aXRBbmltYXRpb24oKTtcbiAgICAgIGluc3RhbmNlLl9hbmltYXRpb25Eb25lLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgLy8gU2luY2Ugd2UgcmVzdG9yZSBmb2N1cyBhZnRlciB0aGUgZXhpdCBhbmltYXRpb24sIHdlIGhhdmUgdG8gY2hlY2sgdGhhdFxuICAgICAgICAvLyB0aGUgdXNlciBkaWRuJ3QgbW92ZSBmb2N1cyB0aGVtc2VsdmVzIGluc2lkZSB0aGUgYGNsb3NlYCBoYW5kbGVyLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgY2FuUmVzdG9yZUZvY3VzICYmXG4gICAgICAgICAgKCFhY3RpdmVFbGVtZW50IHx8XG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ID09PSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50IHx8XG4gICAgICAgICAgICBsb2NhdGlvbi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4hLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNhblJlc3RvcmVGb2N1cykge1xuICAgICAgLy8gQmVjYXVzZSBJRSBtb3ZlcyBmb2N1cyBhc3luY2hyb25vdXNseSwgd2UgY2FuJ3QgY291bnQgb24gaXQgYmVpbmcgcmVzdG9yZWQgYmVmb3JlIHdlJ3ZlXG4gICAgICAvLyBtYXJrZWQgdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLiBJZiB0aGUgZXZlbnQgZmlyZXMgb3V0IG9mIHNlcXVlbmNlIGFuZCB0aGUgZWxlbWVudCB0aGF0XG4gICAgICAvLyB3ZSdyZSByZWZvY3VzaW5nIG9wZW5zIHRoZSBkYXRlcGlja2VyIG9uIGZvY3VzLCB0aGUgdXNlciBjb3VsZCBiZSBzdHVjayB3aXRoIG5vdCBiZWluZ1xuICAgICAgLy8gYWJsZSB0byBjbG9zZSB0aGUgY2FsZW5kYXIgYXQgYWxsLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBtYWtpbmcgdGhlIGxvZ2ljLCB0aGF0IG1hcmtzXG4gICAgICAvLyB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQsIGFzeW5jIGFzIHdlbGwuXG4gICAgICBzZXRUaW1lb3V0KGNvbXBsZXRlQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZUNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFwcGxpZXMgdGhlIGN1cnJlbnQgcGVuZGluZyBzZWxlY3Rpb24gb24gdGhlIG92ZXJsYXkgdG8gdGhlIG1vZGVsLiAqL1xuICBfYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudFJlZj8uaW5zdGFuY2U/Ll9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKiBGb3J3YXJkcyByZWxldmFudCB2YWx1ZXMgZnJvbSB0aGUgZGF0ZXBpY2tlciB0byB0aGUgZGF0ZXBpY2tlciBjb250ZW50IGluc2lkZSB0aGUgb3ZlcmxheS4gKi9cbiAgcHJvdGVjdGVkIF9mb3J3YXJkQ29udGVudFZhbHVlcyhpbnN0YW5jZTogTmd4TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4pIHtcbiAgICBpbnN0YW5jZS5kYXRlcGlja2VyID0gdGhpcztcbiAgICBpbnN0YW5jZS5jb2xvciA9IHRoaXMuY29sb3I7XG4gICAgaW5zdGFuY2UuX2RpYWxvZ0xhYmVsSWQgPSB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRPdmVybGF5TGFiZWxJZCgpO1xuICAgIGluc3RhbmNlLl9hc3NpZ25BY3Rpb25zKHRoaXMuX2FjdGlvbnNQb3J0YWwsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgb3ZlcmxheSB3aXRoIHRoZSBjYWxlbmRhci4gKi9cbiAgcHJpdmF0ZSBfb3Blbk92ZXJsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIGNvbnN0IGlzRGlhbG9nID0gdGhpcy50b3VjaFVpO1xuICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWw8Tmd4TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+KFxuICAgICAgTmd4TWF0RGF0ZXBpY2tlckNvbnRlbnQsXG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICk7XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9ICh0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUoXG4gICAgICBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IGlzRGlhbG9nID8gdGhpcy5fZ2V0RGlhbG9nU3RyYXRlZ3koKSA6IHRoaXMuX2dldERyb3Bkb3duU3RyYXRlZ3koKSxcbiAgICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICAgIGJhY2tkcm9wQ2xhc3M6IFtcbiAgICAgICAgICBpc0RpYWxvZyA/ICdjZGstb3ZlcmxheS1kYXJrLWJhY2tkcm9wJyA6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICAgICAgdGhpcy5fYmFja2Ryb3BIYXJuZXNzQ2xhc3MsXG4gICAgICAgIF0sXG4gICAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyLFxuICAgICAgICBzY3JvbGxTdHJhdGVneTogaXNEaWFsb2cgPyB0aGlzLl9vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSA6IHRoaXMuX3Njcm9sbFN0cmF0ZWd5KCksXG4gICAgICAgIHBhbmVsQ2xhc3M6IGBtYXQtZGF0ZXBpY2tlci0ke2lzRGlhbG9nID8gJ2RpYWxvZycgOiAncG9wdXAnfWAsXG4gICAgICB9KSxcbiAgICApKTtcblxuICAgIHRoaXMuX2dldENsb3NlU3RyZWFtKG92ZXJsYXlSZWYpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIC8vIFRoZSBgcHJldmVudERlZmF1bHRgIGNhbGwgaGFwcGVucyBpbnNpZGUgdGhlIGNhbGVuZGFyIGFzIHdlbGwsIGhvd2V2ZXIgZm9jdXMgbW92ZXMgaW50b1xuICAgIC8vIGl0IGluc2lkZSBhIHRpbWVvdXQgd2hpY2ggY2FuIGdpdmUgYnJvd3NlcnMgYSBjaGFuY2UgdG8gZmlyZSBvZmYgYSBrZXlib2FyZCBldmVudCBpbi1iZXR3ZWVuXG4gICAgLy8gdGhhdCBjYW4gc2Nyb2xsIHRoZSBwYWdlIChzZWUgIzI0OTY5KS4gQWx3YXlzIGJsb2NrIGRlZmF1bHQgYWN0aW9ucyBvZiBhcnJvdyBrZXlzIGZvciB0aGVcbiAgICAvLyBlbnRpcmUgb3ZlcmxheSBzbyB0aGUgcGFnZSBkb2Vzbid0IGdldCBzY3JvbGxlZCBieSBhY2NpZGVudC5cbiAgICBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICAgIGlmIChcbiAgICAgICAga2V5Q29kZSA9PT0gVVBfQVJST1cgfHxcbiAgICAgICAga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fFxuICAgICAgICBrZXlDb2RlID09PSBMRUZUX0FSUk9XIHx8XG4gICAgICAgIGtleUNvZGUgPT09IFJJR0hUX0FSUk9XIHx8XG4gICAgICAgIGtleUNvZGUgPT09IFBBR0VfVVAgfHxcbiAgICAgICAga2V5Q29kZSA9PT0gUEFHRV9ET1dOXG4gICAgICApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IG92ZXJsYXlSZWYuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fY29tcG9uZW50UmVmLmluc3RhbmNlKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgcG9zaXRpb24gb25jZSB0aGUgY2FsZW5kYXIgaGFzIHJlbmRlcmVkLiBPbmx5IHJlbGV2YW50IGluIGRyb3Bkb3duIG1vZGUuXG4gICAgaWYgKCFpc0RpYWxvZykge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IG92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBjdXJyZW50IG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lPdmVybGF5KCkge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSB0aGlzLl9jb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERpYWxvZ1N0cmF0ZWd5KCkge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpO1xuICB9XG5cbiAgLyoqIEdldHMgYSBwb3NpdGlvbiBzdHJhdGVneSB0aGF0IHdpbGwgb3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBkcm9wZG93bi4gKi9cbiAgcHJpdmF0ZSBfZ2V0RHJvcGRvd25TdHJhdGVneSgpIHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkpXG4gICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGVwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIHJldHVybiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvZiB0aGUgZGF0ZXBpY2tlciBpbiBkcm9wZG93biBtb2RlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24uICovXG4gIHByaXZhdGUgX3NldENvbm5lY3RlZFBvc2l0aW9ucyhzdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgY29uc3QgcHJpbWFyeVggPSB0aGlzLnhQb3NpdGlvbiA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgY29uc3Qgc2Vjb25kYXJ5WCA9IHByaW1hcnlYID09PSAnc3RhcnQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHByaW1hcnlZID0gdGhpcy55UG9zaXRpb24gPT09ICdhYm92ZScgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIGNvbnN0IHNlY29uZGFyeVkgPSBwcmltYXJ5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuXG4gICAgcmV0dXJuIHN0cmF0ZWd5LndpdGhQb3NpdGlvbnMoW1xuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHByaW1hcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBzZWNvbmRhcnlYLFxuICAgICAgICBvcmlnaW5ZOiBzZWNvbmRhcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogc2Vjb25kYXJ5WSxcbiAgICAgIH0sXG4gICAgXSk7XG4gIH1cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgd2lsbCBlbWl0IHdoZW4gdGhlIG92ZXJsYXkgaXMgc3VwcG9zZWQgdG8gYmUgY2xvc2VkLiAqL1xuICBwcml2YXRlIF9nZXRDbG9zZVN0cmVhbShvdmVybGF5UmVmOiBPdmVybGF5UmVmKSB7XG4gICAgY29uc3QgY3RybFNoaWZ0TWV0YU1vZGlmaWVyczogTGlzdEtleU1hbmFnZXJNb2RpZmllcktleVtdID0gWydjdHJsS2V5JywgJ3NoaWZ0S2V5JywgJ21ldGFLZXknXTtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICBvdmVybGF5UmVmLmJhY2tkcm9wQ2xpY2soKSxcbiAgICAgIG92ZXJsYXlSZWYuZGV0YWNobWVudHMoKSxcbiAgICAgIG92ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoXG4gICAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgLy8gQ2xvc2luZyBvbiBhbHQgKyB1cCBpcyBvbmx5IHZhbGlkIHdoZW4gdGhlcmUncyBhbiBpbnB1dCBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICAgICAgICh0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJlxuICAgICAgICAgICAgICBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpICYmXG4gICAgICAgICAgICAgIGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XICYmXG4gICAgICAgICAgICAgIGN0cmxTaGlmdE1ldGFNb2RpZmllcnMuZXZlcnkoXG4gICAgICAgICAgICAgICAgKG1vZGlmaWVyOiBMaXN0S2V5TWFuYWdlck1vZGlmaWVyS2V5KSA9PiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQsIG1vZGlmaWVyKSxcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdiBjZGtUcmFwRm9jdXMgcm9sZT1cImRpYWxvZ1wiIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZGlhbG9nTGFiZWxJZCA/PyB1bmRlZmluZWRcIlxuICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyXCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtY3VzdG9tLWhlYWRlcl09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtYWN0aW9uc109XCJfYWN0aW9uc1BvcnRhbFwiXG4gIFtjbGFzcy5tYXQtZGF0ZXBpY2tlci1jb250ZW50LWNvbnRhaW5lci13aXRoLXRpbWVdPVwiIWRhdGVwaWNrZXIuX2hpZGVUaW1lXCJcbiAgPlxuICA8bmd4LW1hdC1jYWxlbmRhciBbaWRdPVwiZGF0ZXBpY2tlci5pZFwiIFtuZ0NsYXNzXT1cImRhdGVwaWNrZXIucGFuZWxDbGFzc1wiIFtzdGFydEF0XT1cImRhdGVwaWNrZXIuc3RhcnRBdFwiXG4gICAgW3N0YXJ0Vmlld109XCJkYXRlcGlja2VyLnN0YXJ0Vmlld1wiIFttaW5EYXRlXT1cImRhdGVwaWNrZXIuX2dldE1pbkRhdGUoKVwiIFttYXhEYXRlXT1cImRhdGVwaWNrZXIuX2dldE1heERhdGUoKVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZXBpY2tlci5fZ2V0RGF0ZUZpbHRlcigpXCIgW2hlYWRlckNvbXBvbmVudF09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgICBbc2VsZWN0ZWRdPVwiX2dldFNlbGVjdGVkKClcIiBbZGF0ZUNsYXNzXT1cImRhdGVwaWNrZXIuZGF0ZUNsYXNzXCIgW2NvbXBhcmlzb25TdGFydF09XCJjb21wYXJpc29uU3RhcnRcIlxuICAgIFtjb21wYXJpc29uRW5kXT1cImNvbXBhcmlzb25FbmRcIiBbQGZhZGVJbkNhbGVuZGFyXT1cIidlbnRlcidcIiBbc3RhcnREYXRlQWNjZXNzaWJsZU5hbWVdPVwic3RhcnREYXRlQWNjZXNzaWJsZU5hbWVcIlxuICAgIFtlbmREYXRlQWNjZXNzaWJsZU5hbWVdPVwiZW5kRGF0ZUFjY2Vzc2libGVOYW1lXCIgKHllYXJTZWxlY3RlZCk9XCJkYXRlcGlja2VyLl9zZWxlY3RZZWFyKCRldmVudClcIlxuICAgIChtb250aFNlbGVjdGVkKT1cImRhdGVwaWNrZXIuX3NlbGVjdE1vbnRoKCRldmVudClcIiAodmlld0NoYW5nZWQpPVwiZGF0ZXBpY2tlci5fdmlld0NoYW5nZWQoJGV2ZW50KVwiXG4gICAgKF91c2VyU2VsZWN0aW9uKT1cIl9oYW5kbGVVc2VyU2VsZWN0aW9uKCRldmVudClcIiAoX3VzZXJEcmFnRHJvcCk9XCJfaGFuZGxlVXNlckRyYWdEcm9wKCRldmVudClcIj48L25neC1tYXQtY2FsZW5kYXI+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzVmlld01vbnRoXCI+XG4gICAgPGRpdiAqbmdJZj1cIiFkYXRlcGlja2VyLl9oaWRlVGltZVwiIGNsYXNzPVwidGltZS1jb250YWluZXJcIiBbY2xhc3MuZGlzYWJsZS1zZWNvbmRzXT1cIiFkYXRlcGlja2VyLl9zaG93U2Vjb25kc1wiPlxuICAgICAgPG5neC1tYXQtdGltZXBpY2tlciBbc2hvd1NwaW5uZXJzXT1cImRhdGVwaWNrZXIuX3Nob3dTcGlubmVyc1wiIFtzaG93U2Vjb25kc109XCJkYXRlcGlja2VyLl9zaG93U2Vjb25kc1wiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkYXRlcGlja2VyLl9kaXNhYmxlZCB8fCAhX21vZGVsVGltZVwiIFtzdGVwSG91cl09XCJkYXRlcGlja2VyLl9zdGVwSG91clwiXG4gICAgICAgIFtzdGVwTWludXRlXT1cImRhdGVwaWNrZXIuX3N0ZXBNaW51dGVcIiBbc3RlcFNlY29uZF09XCJkYXRlcGlja2VyLl9zdGVwU2Vjb25kXCIgWyhuZ01vZGVsKV09XCJfbW9kZWxUaW1lXCJcbiAgICAgICAgW2NvbG9yXT1cImRhdGVwaWNrZXIuX2NvbG9yXCIgW2VuYWJsZU1lcmlkaWFuXT1cImRhdGVwaWNrZXIuX2VuYWJsZU1lcmlkaWFuXCJcbiAgICAgICAgW2Rpc2FibGVNaW51dGVdPVwiZGF0ZXBpY2tlci5fZGlzYWJsZU1pbnV0ZVwiIChuZ01vZGVsQ2hhbmdlKT1cIm9uVGltZUNoYW5nZWQoJGV2ZW50KVwiPlxuICAgICAgPC9uZ3gtbWF0LXRpbWVwaWNrZXI+XG4gICAgPC9kaXY+XG4gIDwvbmctY29udGFpbmVyPlxuXG4gIDxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cIl9hY3Rpb25zUG9ydGFsXCI+PC9uZy10ZW1wbGF0ZT5cblxuICA8IS0tIEludmlzaWJsZSBjbG9zZSBidXR0b24gZm9yIHNjcmVlbiByZWFkZXIgdXNlcnMuIC0tPlxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBtYXQtcmFpc2VkLWJ1dHRvbiBbY29sb3JdPVwiY29sb3IgfHwgJ3ByaW1hcnknXCIgY2xhc3M9XCJtYXQtZGF0ZXBpY2tlci1jbG9zZS1idXR0b25cIlxuICAgIFtjbGFzcy5jZGstdmlzdWFsbHktaGlkZGVuXT1cIiFfY2xvc2VCdXR0b25Gb2N1c2VkXCIgKGZvY3VzKT1cIl9jbG9zZUJ1dHRvbkZvY3VzZWQgPSB0cnVlXCJcbiAgICAoYmx1cik9XCJfY2xvc2VCdXR0b25Gb2N1c2VkID0gZmFsc2VcIiAoY2xpY2spPVwiZGF0ZXBpY2tlci5jbG9zZSgpXCI+e3sgX2Nsb3NlQnV0dG9uVGV4dCB9fVxuICA8L2J1dHRvbj5cbjwvZGl2PiJdfQ==