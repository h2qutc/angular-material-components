import { DOWN_ARROW, END, ENTER, ESCAPE, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, SPACE, UP_ARROW, hasModifierKey, } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { NgxMatCalendarBody, NgxMatCalendarCell, } from './calendar-body';
import { NGX_MAT_DATE_FORMATS } from './core/date-formats';
import { NGX_MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import { NgxDateRange } from './date-selection-model';
import { createMissingDateImplError } from './datepicker-errors';
import * as i0 from "@angular/core";
import * as i1 from "./core/date-adapter";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/common";
import * as i4 from "./calendar-body";
const DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export class NgxMatMonthView {
    constructor(_changeDetectorRef, _dateFormats, _dateAdapter, _dir, _rangeStrategy) {
        this._changeDetectorRef = _changeDetectorRef;
        this._dateFormats = _dateFormats;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._rangeStrategy = _rangeStrategy;
        this._rerenderSubscription = Subscription.EMPTY;
        /** Origin of active drag, or null when dragging is not active. */
        this.activeDrag = null;
        /** Emits when a new date is selected. */
        this.selectedChange = new EventEmitter();
        /** Emits when any date is selected. */
        this._userSelection = new EventEmitter();
        /** Emits when the user initiates a date range drag via mouse or touch. */
        this.dragStarted = new EventEmitter();
        /**
         * Emits when the user completes or cancels a date range drag.
         * Emits null when the drag was canceled or the newly selected date range if completed.
         */
        this.dragEnded = new EventEmitter();
        /** Emits when any date is activated. */
        this.activeDateChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('NgxMatDateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('NGX_MAT_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    get activeDate() {
        return this._activeDate;
    }
    set activeDate(value) {
        const oldActiveDate = this._activeDate;
        const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) ||
            this._dateAdapter.today();
        this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
        if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
            this._init();
        }
    }
    /** The currently selected date. */
    get selected() {
        return this._selected;
    }
    set selected(value) {
        if (value instanceof NgxDateRange) {
            this._selected = value;
        }
        else {
            this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        this._setRanges(this._selected);
    }
    /** The minimum selectable date. */
    get minDate() {
        return this._minDate;
    }
    set minDate(value) {
        this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** The maximum selectable date. */
    get maxDate() {
        return this._maxDate;
    }
    set maxDate(value) {
        this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    ngAfterContentInit() {
        this._rerenderSubscription = this._dateAdapter.localeChanges
            .pipe(startWith(null))
            .subscribe(() => this._init());
    }
    ngOnChanges(changes) {
        const comparisonChange = changes['comparisonStart'] || changes['comparisonEnd'];
        if (comparisonChange && !comparisonChange.firstChange) {
            this._setRanges(this.selected);
        }
        if (changes['activeDrag'] && !this.activeDrag) {
            this._clearPreview();
        }
    }
    ngOnDestroy() {
        this._rerenderSubscription.unsubscribe();
    }
    /** Handles when a new date is selected. */
    _dateSelected(event) {
        const date = event.value;
        const selectedDate = this._getDateFromDayOfMonth(date);
        let rangeStartDate;
        let rangeEndDate;
        if (this._selected instanceof NgxDateRange) {
            rangeStartDate = this._getDateInCurrentMonth(this._selected.start);
            rangeEndDate = this._getDateInCurrentMonth(this._selected.end);
        }
        else {
            rangeStartDate = rangeEndDate = this._getDateInCurrentMonth(this._selected);
        }
        if (rangeStartDate !== date || rangeEndDate !== date) {
            this.selectedChange.emit(selectedDate);
        }
        this._userSelection.emit({ value: selectedDate, event: event.event });
        this._clearPreview();
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Takes the index of a calendar body cell wrapped in in an event as argument. For the date that
     * corresponds to the given cell, set `activeDate` to that date and fire `activeDateChange` with
     * that date.
     *
     * This function is used to match each component's model of the active date with the calendar
     * body cell that was focused. It updates its value of `activeDate` synchronously and updates the
     * parent's value asynchronously via the `activeDateChange` event. The child component receives an
     * updated value asynchronously via the `activeCell` Input.
     */
    _updateActiveDate(event) {
        const month = event.value;
        const oldActiveDate = this._activeDate;
        this.activeDate = this._getDateFromDayOfMonth(month);
        if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
            this.activeDateChange.emit(this._activeDate);
        }
    }
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydown(event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        const oldActiveDate = this._activeDate;
        const isRtl = this._isRtl();
        switch (event.keyCode) {
            case LEFT_ARROW:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? 1 : -1);
                break;
            case RIGHT_ARROW:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? -1 : 1);
                break;
            case UP_ARROW:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case END:
                this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate));
                break;
            case PAGE_UP:
                this.activeDate = event.altKey
                    ? this._dateAdapter.addCalendarYears(this._activeDate, -1)
                    : this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this.activeDate = event.altKey
                    ? this._dateAdapter.addCalendarYears(this._activeDate, 1)
                    : this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
            case SPACE:
                this._selectionKeyPressed = true;
                if (this._canSelect(this._activeDate)) {
                    // Prevent unexpected default actions such as form submission.
                    // Note that we only prevent the default action here while the selection happens in
                    // `keyup` below. We can't do the selection here, because it can cause the calendar to
                    // reopen if focus is restored immediately. We also can't call `preventDefault` on `keyup`
                    // because it's too late (see #23305).
                    event.preventDefault();
                }
                return;
            case ESCAPE:
                // Abort the current range selection if the user presses escape mid-selection.
                if (this._previewEnd != null && !hasModifierKey(event)) {
                    this._clearPreview();
                    // If a drag is in progress, cancel the drag without changing the
                    // current selection.
                    if (this.activeDrag) {
                        this.dragEnded.emit({ value: null, event });
                    }
                    else {
                        this.selectedChange.emit(null);
                        this._userSelection.emit({ value: null, event });
                    }
                    event.preventDefault();
                    event.stopPropagation(); // Prevents the overlay from closing.
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
            this.activeDateChange.emit(this.activeDate);
            this._focusActiveCellAfterViewChecked();
        }
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    }
    /** Handles keyup events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeyup(event) {
        if (event.keyCode === SPACE || event.keyCode === ENTER) {
            if (this._selectionKeyPressed && this._canSelect(this._activeDate)) {
                this._dateSelected({ value: this._dateAdapter.getDate(this._activeDate), event });
            }
            this._selectionKeyPressed = false;
        }
    }
    /** Initializes this month view. */
    _init() {
        this._setRanges(this.selected);
        this._todayDate = this._getCellCompareValue(this._dateAdapter.today());
        this._monthLabel = this._dateFormats.display.monthLabel
            ? this._dateAdapter.format(this.activeDate, this._dateFormats.display.monthLabel)
            : this._dateAdapter
                .getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)].toLocaleUpperCase();
        let firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK +
                this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) %
                DAYS_PER_WEEK;
        this._initWeekdays();
        this._createWeekCells();
        this._changeDetectorRef.markForCheck();
    }
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(movePreview) {
        this._matCalendarBody._focusActiveCell(movePreview);
    }
    /** Focuses the active cell after change detection has run and the microtask queue is empty. */
    _focusActiveCellAfterViewChecked() {
        this._matCalendarBody._scheduleFocusActiveCellAfterViewChecked();
    }
    /** Called when the user has activated a new cell and the preview needs to be updated. */
    _previewChanged({ event, value: cell }) {
        if (this._rangeStrategy) {
            // We can assume that this will be a range, because preview
            // events aren't fired for single date selections.
            const value = cell ? cell.rawValue : null;
            const previewRange = this._rangeStrategy.createPreview(value, this.selected, event);
            this._previewStart = this._getCellCompareValue(previewRange.start);
            this._previewEnd = this._getCellCompareValue(previewRange.end);
            if (this.activeDrag && value) {
                const dragRange = this._rangeStrategy.createDrag?.(this.activeDrag.value, this.selected, value, event);
                if (dragRange) {
                    this._previewStart = this._getCellCompareValue(dragRange.start);
                    this._previewEnd = this._getCellCompareValue(dragRange.end);
                }
            }
            // Note that here we need to use `detectChanges`, rather than `markForCheck`, because
            // the way `_focusActiveCell` is set up at the moment makes it fire at the wrong time
            // when navigating one month back using the keyboard which will cause this handler
            // to throw a "changed after checked" error when updating the preview state.
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Called when the user has ended a drag. If the drag/drop was successful,
     * computes and emits the new range selection.
     */
    _dragEnded(event) {
        if (!this.activeDrag)
            return;
        if (event.value) {
            // Propagate drag effect
            const dragDropResult = this._rangeStrategy?.createDrag?.(this.activeDrag.value, this.selected, event.value, event.event);
            this.dragEnded.emit({ value: dragDropResult ?? null, event: event.event });
        }
        else {
            this.dragEnded.emit({ value: null, event: event.event });
        }
    }
    /**
     * Takes a day of the month and returns a new date in the same month and year as the currently
     *  active date. The returned date will have the same day of the month as the argument date.
     */
    _getDateFromDayOfMonth(dayOfMonth) {
        return this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), dayOfMonth);
    }
    /** Initializes the weekdays. */
    _initWeekdays() {
        const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        let weekdays = longWeekdays.map((long, i) => {
            return { long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
    }
    /** Creates MatCalendarCells for the dates in this month. */
    _createWeekCells() {
        const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        const dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            const date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            const enabled = this._shouldEnableDate(date);
            const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            const cellClasses = this.dateClass ? this.dateClass(date, 'month') : undefined;
            this._weeks[this._weeks.length - 1].push(new NgxMatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses, this._getCellCompareValue(date), date));
        }
    }
    /** Date filter for the month */
    _shouldEnableDate(date) {
        return (!!date &&
            (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
            (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0) &&
            (!this.dateFilter || this.dateFilter(date)));
    }
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    _getDateInCurrentMonth(date) {
        return date && this._hasSameMonthAndYear(date, this.activeDate)
            ? this._dateAdapter.getDate(date)
            : null;
    }
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    _hasSameMonthAndYear(d1, d2) {
        return !!(d1 &&
            d2 &&
            this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    }
    /** Gets the value that will be used to one cell to another. */
    _getCellCompareValue(date) {
        if (date) {
            // We use the time since the Unix epoch to compare dates in this view, rather than the
            // cell values, because we need to support ranges that span across multiple months/years.
            const year = this._dateAdapter.getYear(date);
            const month = this._dateAdapter.getMonth(date);
            const day = this._dateAdapter.getDate(date);
            return new Date(year, month, day).getTime();
        }
        return null;
    }
    /** Determines whether the user has the RTL layout direction. */
    _isRtl() {
        return this._dir && this._dir.value === 'rtl';
    }
    /** Sets the current range based on a model value. */
    _setRanges(selectedValue) {
        if (selectedValue instanceof NgxDateRange) {
            this._rangeStart = this._getCellCompareValue(selectedValue.start);
            this._rangeEnd = this._getCellCompareValue(selectedValue.end);
            this._isRange = true;
        }
        else {
            this._rangeStart = this._rangeEnd = this._getCellCompareValue(selectedValue);
            this._isRange = false;
        }
        this._comparisonRangeStart = this._getCellCompareValue(this.comparisonStart);
        this._comparisonRangeEnd = this._getCellCompareValue(this.comparisonEnd);
    }
    /** Gets whether a date can be selected in the month view. */
    _canSelect(date) {
        return !this.dateFilter || this.dateFilter(date);
    }
    /** Clears out preview state. */
    _clearPreview() {
        this._previewStart = this._previewEnd = null;
    }
}
/** @nocollapse */ NgxMatMonthView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatMonthView, deps: [{ token: i0.ChangeDetectorRef }, { token: NGX_MAT_DATE_FORMATS, optional: true }, { token: i1.NgxMatDateAdapter, optional: true }, { token: i2.Directionality, optional: true }, { token: NGX_MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }], target: i0.ɵɵFactoryTarget.Component });
/** @nocollapse */ NgxMatMonthView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatMonthView, selector: "ngx-mat-month-view", inputs: { activeDate: "activeDate", selected: "selected", minDate: "minDate", maxDate: "maxDate", dateFilter: "dateFilter", dateClass: "dateClass", comparisonStart: "comparisonStart", comparisonEnd: "comparisonEnd", startDateAccessibleName: "startDateAccessibleName", endDateAccessibleName: "endDateAccessibleName", activeDrag: "activeDrag" }, outputs: { selectedChange: "selectedChange", _userSelection: "_userSelection", dragStarted: "dragStarted", dragEnded: "dragEnded", activeDateChange: "activeDateChange" }, viewQueries: [{ propertyName: "_matCalendarBody", first: true, predicate: NgxMatCalendarBody, descendants: true }], exportAs: ["ngxMatMonthView"], usesOnChanges: true, ngImport: i0, template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      <th scope=\"col\" *ngFor=\"let day of _weekdays\">\n        <span class=\"cdk-visually-hidden\">{{day.long}}</span>\n        <span aria-hidden=\"true\">{{day.narrow}}</span>\n      </th>\n    </tr>\n    <tr><th aria-hidden=\"true\" class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody ngx-mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate!\"\n         [startValue]=\"_rangeStart!\"\n         [endValue]=\"_rangeEnd!\"\n         [comparisonStart]=\"_comparisonRangeStart\"\n         [comparisonEnd]=\"_comparisonRangeEnd\"\n         [previewStart]=\"_previewStart\"\n         [previewEnd]=\"_previewEnd\"\n         [isRange]=\"_isRange\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         [startDateAccessibleName]=\"startDateAccessibleName\"\n         [endDateAccessibleName]=\"endDateAccessibleName\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (dragStarted)=\"dragStarted.emit($event)\"\n         (dragEnded)=\"_dragEnded($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n", dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i4.NgxMatCalendarBody, selector: "[ngx-mat-calendar-body]", inputs: ["label", "rows", "todayValue", "startValue", "endValue", "labelMinRequiredCells", "numCols", "activeCell", "isRange", "cellAspectRatio", "comparisonStart", "comparisonEnd", "previewStart", "previewEnd", "startDateAccessibleName", "endDateAccessibleName"], outputs: ["selectedValueChange", "previewChange", "activeDateChange", "dragStarted", "dragEnded"], exportAs: ["matCalendarBody"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatMonthView, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-mat-month-view', exportAs: 'ngxMatMonthView', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      <th scope=\"col\" *ngFor=\"let day of _weekdays\">\n        <span class=\"cdk-visually-hidden\">{{day.long}}</span>\n        <span aria-hidden=\"true\">{{day.narrow}}</span>\n      </th>\n    </tr>\n    <tr><th aria-hidden=\"true\" class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody ngx-mat-calendar-body\n         [label]=\"_monthLabel\"\n         [rows]=\"_weeks\"\n         [todayValue]=\"_todayDate!\"\n         [startValue]=\"_rangeStart!\"\n         [endValue]=\"_rangeEnd!\"\n         [comparisonStart]=\"_comparisonRangeStart\"\n         [comparisonEnd]=\"_comparisonRangeEnd\"\n         [previewStart]=\"_previewStart\"\n         [previewEnd]=\"_previewEnd\"\n         [isRange]=\"_isRange\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         [startDateAccessibleName]=\"startDateAccessibleName\"\n         [endDateAccessibleName]=\"endDateAccessibleName\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (dragStarted)=\"dragStarted.emit($event)\"\n         (dragEnded)=\"_dragEnded($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_FORMATS]
                }] }, { type: i1.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [NGX_MAT_DATE_RANGE_SELECTION_STRATEGY]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], dateFilter: [{
                type: Input
            }], dateClass: [{
                type: Input
            }], comparisonStart: [{
                type: Input
            }], comparisonEnd: [{
                type: Input
            }], startDateAccessibleName: [{
                type: Input
            }], endDateAccessibleName: [{
                type: Input
            }], activeDrag: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], _userSelection: [{
                type: Output
            }], dragStarted: [{
                type: Output
            }], dragEnded: [{
                type: Output
            }], activeDateChange: [{
                type: Output
            }], _matCalendarBody: [{
                type: ViewChild,
                args: [NgxMatCalendarBody]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2RhdGV0aW1lLXBpY2tlci9zcmMvbGliL21vbnRoLXZpZXcudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9tb250aC12aWV3Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUNMLFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLE1BQU0sRUFDTixJQUFJLEVBQ0osVUFBVSxFQUNWLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEVBQ1IsY0FBYyxHQUNmLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUVMLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsa0JBQWtCLEdBR25CLE1BQU0saUJBQWlCLENBQUM7QUFFekIsT0FBTyxFQUFFLG9CQUFvQixFQUFxQixNQUFNLHFCQUFxQixDQUFDO0FBQzlFLE9BQU8sRUFDTCxxQ0FBcUMsR0FFdEMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQUVqRSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFFeEI7OztHQUdHO0FBUUgsTUFBTSxPQUFPLGVBQWU7SUE0STFCLFlBQ1cs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UUFBUTs0Q0F4SVAsVUFBVTtzQkFEYixLQUFLO2dCQWtCRixRQUFRO3NCQURYLEtBQUs7Z0JBaUJGLE9BQU87c0JBRFYsS0FBSztnQkFXRixPQUFPO3NCQURWLEtBQUs7Z0JBVUcsVUFBVTtzQkFBbEIsS0FBSztnQkFHRyxTQUFTO3NCQUFqQixLQUFLO2dCQUdHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBR0csYUFBYTtzQkFBckIsS0FBSztnQkFHRyx1QkFBdUI7c0JBQS9CLEtBQUs7Z0JBR0cscUJBQXFCO3NCQUE3QixLQUFLO2dCQUdHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBR2EsY0FBYztzQkFBaEMsTUFBTTtnQkFHWSxjQUFjO3NCQUFoQyxNQUFNO2dCQUlZLFdBQVc7c0JBQTdCLE1BQU07Z0JBTVksU0FBUztzQkFBM0IsTUFBTTtnQkFHWSxnQkFBZ0I7c0JBQWxDLE1BQU07Z0JBR3dCLGdCQUFnQjtzQkFBOUMsU0FBUzt1QkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBFU0NBUEUsXG4gIEhPTUUsXG4gIExFRlRfQVJST1csXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFNQQUNFLFxuICBVUF9BUlJPVyxcbiAgaGFzTW9kaWZpZXJLZXksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIE5neE1hdENhbGVuZGFyQm9keSxcbiAgTmd4TWF0Q2FsZW5kYXJDZWxsLFxuICBOZ3hNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9uLFxuICBOZ3hNYXRDYWxlbmRhclVzZXJFdmVudCxcbn0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7IE5neE1hdERhdGVBZGFwdGVyIH0gZnJvbSAnLi9jb3JlL2RhdGUtYWRhcHRlcic7XG5pbXBvcnQgeyBOR1hfTUFUX0RBVEVfRk9STUFUUywgTmd4TWF0RGF0ZUZvcm1hdHMgfSBmcm9tICcuL2NvcmUvZGF0ZS1mb3JtYXRzJztcbmltcG9ydCB7XG4gIE5HWF9NQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIE5neE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7IE5neERhdGVSYW5nZSB9IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHsgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IgfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcblxuY29uc3QgREFZU19QRVJfV0VFSyA9IDc7XG5cbi8qKlxuICogQW4gaW50ZXJuYWwgY29tcG9uZW50IHVzZWQgdG8gZGlzcGxheSBhIHNpbmdsZSBtb250aCBpbiB0aGUgZGF0ZXBpY2tlci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LW1hdC1tb250aC12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICdtb250aC12aWV3Lmh0bWwnLFxuICBleHBvcnRBczogJ25neE1hdE1vbnRoVmlldycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBOZ3hNYXRNb250aFZpZXc8RD4gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3JlcmVuZGVyU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBGbGFnIHVzZWQgdG8gZmlsdGVyIG91dCBzcGFjZS9lbnRlciBrZXl1cCBldmVudHMgdGhhdCBvcmlnaW5hdGVkIG91dHNpZGUgb2YgdGhlIHZpZXcuICovXG4gIHByaXZhdGUgX3NlbGVjdGlvbktleVByZXNzZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIHRvIGRpc3BsYXkgaW4gdGhpcyBtb250aCB2aWV3IChldmVyeXRoaW5nIG90aGVyIHRoYW4gdGhlIG1vbnRoIGFuZCB5ZWFyIGlzIGlnbm9yZWQpLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGFjdGl2ZURhdGUoKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZURhdGU7XG4gIH1cbiAgc2V0IGFjdGl2ZURhdGUodmFsdWU6IEQpIHtcbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICBjb25zdCB2YWxpZERhdGUgPVxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSkgfHxcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCk7XG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmNsYW1wRGF0ZSh2YWxpZERhdGUsIHRoaXMubWluRGF0ZSwgdGhpcy5tYXhEYXRlKTtcbiAgICBpZiAoIXRoaXMuX2hhc1NhbWVNb250aEFuZFllYXIob2xkQWN0aXZlRGF0ZSwgdGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfYWN0aXZlRGF0ZTogRDtcblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2VsZWN0ZWQoKTogTmd4RGF0ZVJhbmdlPEQ+IHwgRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuICBzZXQgc2VsZWN0ZWQodmFsdWU6IE5neERhdGVSYW5nZTxEPiB8IEQgfCBudWxsKSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgTmd4RGF0ZVJhbmdlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICAgIH1cblxuICAgIHRoaXMuX3NldFJhbmdlcyh0aGlzLl9zZWxlY3RlZCk7XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWQ6IE5neERhdGVSYW5nZTxEPiB8IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtaW5EYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZTtcbiAgfVxuICBzZXQgbWluRGF0ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9taW5EYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKSk7XG4gIH1cbiAgcHJpdmF0ZSBfbWluRGF0ZTogRCB8IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG1heERhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlO1xuICB9XG4gIHNldCBtYXhEYXRlKHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX21heERhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9tYXhEYXRlOiBEIHwgbnVsbDtcblxuICAvKiogRnVuY3Rpb24gdXNlZCB0byBmaWx0ZXIgd2hpY2ggZGF0ZXMgYXJlIHNlbGVjdGFibGUuICovXG4gIEBJbnB1dCgpIGRhdGVGaWx0ZXI6IChkYXRlOiBEKSA9PiBib29sZWFuO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTmd4TWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIEBJbnB1dCgpIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgQElucHV0KCkgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdFN0YXJ0RGF0ZS8+YCAqL1xuICBASW5wdXQoKSBzdGFydERhdGVBY2Nlc3NpYmxlTmFtZTogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogQVJJQSBBY2Nlc3NpYmxlIG5hbWUgb2YgdGhlIGA8aW5wdXQgbWF0RW5kRGF0ZS8+YCAqL1xuICBASW5wdXQoKSBlbmREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIE9yaWdpbiBvZiBhY3RpdmUgZHJhZywgb3IgbnVsbCB3aGVuIGRyYWdnaW5nIGlzIG5vdCBhY3RpdmUuICovXG4gIEBJbnB1dCgpIGFjdGl2ZURyYWc6IE5neE1hdENhbGVuZGFyVXNlckV2ZW50PEQ+IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RCB8IG51bGw+ID0gbmV3IEV2ZW50RW1pdHRlcjxEIHwgbnVsbD4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF91c2VyU2VsZWN0aW9uOiBFdmVudEVtaXR0ZXI8Tmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxOZ3hNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHVzZXIgaW5pdGlhdGVzIGEgZGF0ZSByYW5nZSBkcmFnIHZpYSBtb3VzZSBvciB0b3VjaC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRyYWdTdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hNYXRDYWxlbmRhclVzZXJFdmVudDxEPj4oKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgdXNlciBjb21wbGV0ZXMgb3IgY2FuY2VscyBhIGRhdGUgcmFuZ2UgZHJhZy5cbiAgICogRW1pdHMgbnVsbCB3aGVuIHRoZSBkcmFnIHdhcyBjYW5jZWxlZCBvciB0aGUgbmV3bHkgc2VsZWN0ZWQgZGF0ZSByYW5nZSBpZiBjb21wbGV0ZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZHJhZ0VuZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxOZ3hNYXRDYWxlbmRhclVzZXJFdmVudDxOZ3hEYXRlUmFuZ2U8RD4gfCBudWxsPj4oKTtcblxuICAvKiogRW1pdHMgd2hlbiBhbnkgZGF0ZSBpcyBhY3RpdmF0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhY3RpdmVEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqIFRoZSBib2R5IG9mIGNhbGVuZGFyIHRhYmxlICovXG4gIEBWaWV3Q2hpbGQoTmd4TWF0Q2FsZW5kYXJCb2R5KSBfbWF0Q2FsZW5kYXJCb2R5OiBOZ3hNYXRDYWxlbmRhckJvZHk7XG5cbiAgLyoqIFRoZSBsYWJlbCBmb3IgdGhpcyBtb250aCAoZS5nLiBcIkphbnVhcnkgMjAxN1wiKS4gKi9cbiAgX21vbnRoTGFiZWw6IHN0cmluZztcblxuICAvKiogR3JpZCBvZiBjYWxlbmRhciBjZWxscyByZXByZXNlbnRpbmcgdGhlIGRhdGVzIG9mIHRoZSBtb250aC4gKi9cbiAgX3dlZWtzOiBOZ3hNYXRDYWxlbmRhckNlbGxbXVtdO1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGJsYW5rIGNlbGxzIGluIHRoZSBmaXJzdCByb3cgYmVmb3JlIHRoZSAxc3Qgb2YgdGhlIG1vbnRoLiAqL1xuICBfZmlyc3RXZWVrT2Zmc2V0OiBudW1iZXI7XG5cbiAgLyoqIFN0YXJ0IHZhbHVlIG9mIHRoZSBjdXJyZW50bHktc2hvd24gZGF0ZSByYW5nZS4gKi9cbiAgX3JhbmdlU3RhcnQ6IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIEVuZCB2YWx1ZSBvZiB0aGUgY3VycmVudGx5LXNob3duIGRhdGUgcmFuZ2UuICovXG4gIF9yYW5nZUVuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RhcnQgdmFsdWUgb2YgdGhlIGN1cnJlbnRseS1zaG93biBjb21wYXJpc29uIGRhdGUgcmFuZ2UuICovXG4gIF9jb21wYXJpc29uUmFuZ2VTdGFydDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogRW5kIHZhbHVlIG9mIHRoZSBjdXJyZW50bHktc2hvd24gY29tcGFyaXNvbiBkYXRlIHJhbmdlLiAqL1xuICBfY29tcGFyaXNvblJhbmdlRW5kOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgcHJldmlldyByYW5nZS4gKi9cbiAgX3ByZXZpZXdTdGFydDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBfcHJldmlld0VuZDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjdXJyZW50bHkgc2VsZWN0aW5nIGEgcmFuZ2Ugb2YgZGF0ZXMuICovXG4gIF9pc1JhbmdlOiBib29sZWFuO1xuXG4gIC8qKiBUaGUgZGF0ZSBvZiB0aGUgbW9udGggdGhhdCB0b2RheSBmYWxscyBvbi4gTnVsbCBpZiB0b2RheSBpcyBpbiBhbm90aGVyIG1vbnRoLiAqL1xuICBfdG9kYXlEYXRlOiBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBUaGUgbmFtZXMgb2YgdGhlIHdlZWtkYXlzLiAqL1xuICBfd2Vla2RheXM6IHsgbG9uZzogc3RyaW5nOyBuYXJyb3c6IHN0cmluZyB9W107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcmVhZG9ubHkgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HWF9NQVRfREFURV9GT1JNQVRTKSBwcml2YXRlIF9kYXRlRm9ybWF0czogTmd4TWF0RGF0ZUZvcm1hdHMsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9kYXRlQWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyPzogRGlyZWN0aW9uYWxpdHksXG4gICAgQEluamVjdChOR1hfTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHJpdmF0ZSBfcmFuZ2VTdHJhdGVneT86IE5neE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PEQ+LFxuICApIHtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTmd4TWF0RGF0ZUFkYXB0ZXInKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ05HWF9NQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fcmVyZW5kZXJTdWJzY3JpcHRpb24gPSB0aGlzLl9kYXRlQWRhcHRlci5sb2NhbGVDaGFuZ2VzXG4gICAgICAucGlwZShzdGFydFdpdGgobnVsbCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2luaXQoKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgY29tcGFyaXNvbkNoYW5nZSA9IGNoYW5nZXNbJ2NvbXBhcmlzb25TdGFydCddIHx8IGNoYW5nZXNbJ2NvbXBhcmlzb25FbmQnXTtcblxuICAgIGlmIChjb21wYXJpc29uQ2hhbmdlICYmICFjb21wYXJpc29uQ2hhbmdlLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLl9zZXRSYW5nZXModGhpcy5zZWxlY3RlZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ2FjdGl2ZURyYWcnXSAmJiAhdGhpcy5hY3RpdmVEcmFnKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpZXcoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXJlbmRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgd2hlbiBhIG5ldyBkYXRlIGlzIHNlbGVjdGVkLiAqL1xuICBfZGF0ZVNlbGVjdGVkKGV2ZW50OiBOZ3hNYXRDYWxlbmRhclVzZXJFdmVudDxudW1iZXI+KSB7XG4gICAgY29uc3QgZGF0ZSA9IGV2ZW50LnZhbHVlO1xuICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHRoaXMuX2dldERhdGVGcm9tRGF5T2ZNb250aChkYXRlKTtcbiAgICBsZXQgcmFuZ2VTdGFydERhdGU6IG51bWJlciB8IG51bGw7XG4gICAgbGV0IHJhbmdlRW5kRGF0ZTogbnVtYmVyIHwgbnVsbDtcblxuICAgIGlmICh0aGlzLl9zZWxlY3RlZCBpbnN0YW5jZW9mIE5neERhdGVSYW5nZSkge1xuICAgICAgcmFuZ2VTdGFydERhdGUgPSB0aGlzLl9nZXREYXRlSW5DdXJyZW50TW9udGgodGhpcy5fc2VsZWN0ZWQuc3RhcnQpO1xuICAgICAgcmFuZ2VFbmREYXRlID0gdGhpcy5fZ2V0RGF0ZUluQ3VycmVudE1vbnRoKHRoaXMuX3NlbGVjdGVkLmVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhbmdlU3RhcnREYXRlID0gcmFuZ2VFbmREYXRlID0gdGhpcy5fZ2V0RGF0ZUluQ3VycmVudE1vbnRoKHRoaXMuX3NlbGVjdGVkKTtcbiAgICB9XG5cbiAgICBpZiAocmFuZ2VTdGFydERhdGUgIT09IGRhdGUgfHwgcmFuZ2VFbmREYXRlICE9PSBkYXRlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoc2VsZWN0ZWREYXRlKTtcbiAgICB9XG5cbiAgICB0aGlzLl91c2VyU2VsZWN0aW9uLmVtaXQoeyB2YWx1ZTogc2VsZWN0ZWREYXRlLCBldmVudDogZXZlbnQuZXZlbnQgfSk7XG4gICAgdGhpcy5fY2xlYXJQcmV2aWV3KCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIGluZGV4IG9mIGEgY2FsZW5kYXIgYm9keSBjZWxsIHdyYXBwZWQgaW4gaW4gYW4gZXZlbnQgYXMgYXJndW1lbnQuIEZvciB0aGUgZGF0ZSB0aGF0XG4gICAqIGNvcnJlc3BvbmRzIHRvIHRoZSBnaXZlbiBjZWxsLCBzZXQgYGFjdGl2ZURhdGVgIHRvIHRoYXQgZGF0ZSBhbmQgZmlyZSBgYWN0aXZlRGF0ZUNoYW5nZWAgd2l0aFxuICAgKiB0aGF0IGRhdGUuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBtYXRjaCBlYWNoIGNvbXBvbmVudCdzIG1vZGVsIG9mIHRoZSBhY3RpdmUgZGF0ZSB3aXRoIHRoZSBjYWxlbmRhclxuICAgKiBib2R5IGNlbGwgdGhhdCB3YXMgZm9jdXNlZC4gSXQgdXBkYXRlcyBpdHMgdmFsdWUgb2YgYGFjdGl2ZURhdGVgIHN5bmNocm9ub3VzbHkgYW5kIHVwZGF0ZXMgdGhlXG4gICAqIHBhcmVudCdzIHZhbHVlIGFzeW5jaHJvbm91c2x5IHZpYSB0aGUgYGFjdGl2ZURhdGVDaGFuZ2VgIGV2ZW50LiBUaGUgY2hpbGQgY29tcG9uZW50IHJlY2VpdmVzIGFuXG4gICAqIHVwZGF0ZWQgdmFsdWUgYXN5bmNocm9ub3VzbHkgdmlhIHRoZSBgYWN0aXZlQ2VsbGAgSW5wdXQuXG4gICAqL1xuICBfdXBkYXRlQWN0aXZlRGF0ZShldmVudDogTmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8bnVtYmVyPikge1xuICAgIGNvbnN0IG1vbnRoID0gZXZlbnQudmFsdWU7XG4gICAgY29uc3Qgb2xkQWN0aXZlRGF0ZSA9IHRoaXMuX2FjdGl2ZURhdGU7XG4gICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZ2V0RGF0ZUZyb21EYXlPZk1vbnRoKG1vbnRoKTtcblxuICAgIGlmICh0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShvbGRBY3RpdmVEYXRlLCB0aGlzLmFjdGl2ZURhdGUpKSB7XG4gICAgICB0aGlzLmFjdGl2ZURhdGVDaGFuZ2UuZW1pdCh0aGlzLl9hY3RpdmVEYXRlKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlkb3duIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgLy8gVE9ETyhtbWFsZXJiYSk6IFdlIGN1cnJlbnRseSBhbGxvdyBrZXlib2FyZCBuYXZpZ2F0aW9uIHRvIGRpc2FibGVkIGRhdGVzLCBidXQganVzdCBwcmV2ZW50XG4gICAgLy8gZGlzYWJsZWQgb25lcyBmcm9tIGJlaW5nIHNlbGVjdGVkLiBUaGlzIG1heSBub3QgYmUgaWRlYWwsIHdlIHNob3VsZCBsb29rIGludG8gd2hldGhlclxuICAgIC8vIG5hdmlnYXRpb24gc2hvdWxkIHNraXAgb3ZlciBkaXNhYmxlZCBkYXRlcywgYW5kIGlmIHNvLCBob3cgdG8gaW1wbGVtZW50IHRoYXQgZWZmaWNpZW50bHkuXG5cbiAgICBjb25zdCBvbGRBY3RpdmVEYXRlID0gdGhpcy5fYWN0aXZlRGF0ZTtcbiAgICBjb25zdCBpc1J0bCA9IHRoaXMuX2lzUnRsKCk7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgTEVGVF9BUlJPVzpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKHRoaXMuX2FjdGl2ZURhdGUsIGlzUnRsID8gMSA6IC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJJR0hUX0FSUk9XOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgaXNSdGwgPyAtMSA6IDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyRGF5cyh0aGlzLl9hY3RpdmVEYXRlLCAtNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXModGhpcy5fYWN0aXZlRGF0ZSwgNyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBIT01FOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhckRheXMoXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGF0ZSxcbiAgICAgICAgICAxIC0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF0ZSh0aGlzLl9hY3RpdmVEYXRlKSxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJEYXlzKFxuICAgICAgICAgIHRoaXMuX2FjdGl2ZURhdGUsXG4gICAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TnVtRGF5c0luTW9udGgodGhpcy5fYWN0aXZlRGF0ZSkgLVxuICAgICAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGUodGhpcy5fYWN0aXZlRGF0ZSksXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX1VQOlxuICAgICAgICB0aGlzLmFjdGl2ZURhdGUgPSBldmVudC5hbHRLZXlcbiAgICAgICAgICA/IHRoaXMuX2RhdGVBZGFwdGVyLmFkZENhbGVuZGFyWWVhcnModGhpcy5fYWN0aXZlRGF0ZSwgLTEpXG4gICAgICAgICAgOiB0aGlzLl9kYXRlQWRhcHRlci5hZGRDYWxlbmRhck1vbnRocyh0aGlzLl9hY3RpdmVEYXRlLCAtMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQQUdFX0RPV046XG4gICAgICAgIHRoaXMuYWN0aXZlRGF0ZSA9IGV2ZW50LmFsdEtleVxuICAgICAgICAgID8gdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJZZWFycyh0aGlzLl9hY3RpdmVEYXRlLCAxKVxuICAgICAgICAgIDogdGhpcy5fZGF0ZUFkYXB0ZXIuYWRkQ2FsZW5kYXJNb250aHModGhpcy5fYWN0aXZlRGF0ZSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBFTlRFUjpcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbktleVByZXNzZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLl9jYW5TZWxlY3QodGhpcy5fYWN0aXZlRGF0ZSkpIHtcbiAgICAgICAgICAvLyBQcmV2ZW50IHVuZXhwZWN0ZWQgZGVmYXVsdCBhY3Rpb25zIHN1Y2ggYXMgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBvbmx5IHByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIGhlcmUgd2hpbGUgdGhlIHNlbGVjdGlvbiBoYXBwZW5zIGluXG4gICAgICAgICAgLy8gYGtleXVwYCBiZWxvdy4gV2UgY2FuJ3QgZG8gdGhlIHNlbGVjdGlvbiBoZXJlLCBiZWNhdXNlIGl0IGNhbiBjYXVzZSB0aGUgY2FsZW5kYXIgdG9cbiAgICAgICAgICAvLyByZW9wZW4gaWYgZm9jdXMgaXMgcmVzdG9yZWQgaW1tZWRpYXRlbHkuIFdlIGFsc28gY2FuJ3QgY2FsbCBgcHJldmVudERlZmF1bHRgIG9uIGBrZXl1cGBcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0J3MgdG9vIGxhdGUgKHNlZSAjMjMzMDUpLlxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBFU0NBUEU6XG4gICAgICAgIC8vIEFib3J0IHRoZSBjdXJyZW50IHJhbmdlIHNlbGVjdGlvbiBpZiB0aGUgdXNlciBwcmVzc2VzIGVzY2FwZSBtaWQtc2VsZWN0aW9uLlxuICAgICAgICBpZiAodGhpcy5fcHJldmlld0VuZCAhPSBudWxsICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgICB0aGlzLl9jbGVhclByZXZpZXcoKTtcbiAgICAgICAgICAvLyBJZiBhIGRyYWcgaXMgaW4gcHJvZ3Jlc3MsIGNhbmNlbCB0aGUgZHJhZyB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgc2VsZWN0aW9uLlxuICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZURyYWcpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZGVkLmVtaXQoeyB2YWx1ZTogbnVsbCwgZXZlbnQgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdChudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJTZWxlY3Rpb24uZW1pdCh7IHZhbHVlOiBudWxsLCBldmVudCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy8gUHJldmVudHMgdGhlIG92ZXJsYXkgZnJvbSBjbG9zaW5nLlxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERvbid0IHByZXZlbnQgZGVmYXVsdCBvciBmb2N1cyBhY3RpdmUgY2VsbCBvbiBrZXlzIHRoYXQgd2UgZG9uJ3QgZXhwbGljaXRseSBoYW5kbGUuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGUob2xkQWN0aXZlRGF0ZSwgdGhpcy5hY3RpdmVEYXRlKSkge1xuICAgICAgdGhpcy5hY3RpdmVEYXRlQ2hhbmdlLmVtaXQodGhpcy5hY3RpdmVEYXRlKTtcblxuICAgICAgdGhpcy5fZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCgpO1xuICAgIH1cblxuICAgIC8vIFByZXZlbnQgdW5leHBlY3RlZCBkZWZhdWx0IGFjdGlvbnMgc3VjaCBhcyBmb3JtIHN1Ym1pc3Npb24uXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleXVwIGV2ZW50cyBvbiB0aGUgY2FsZW5kYXIgYm9keSB3aGVuIGNhbGVuZGFyIGlzIGluIG1vbnRoIHZpZXcuICovXG4gIF9oYW5kbGVDYWxlbmRhckJvZHlLZXl1cChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBTUEFDRSB8fCBldmVudC5rZXlDb2RlID09PSBFTlRFUikge1xuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbktleVByZXNzZWQgJiYgdGhpcy5fY2FuU2VsZWN0KHRoaXMuX2FjdGl2ZURhdGUpKSB7XG4gICAgICAgIHRoaXMuX2RhdGVTZWxlY3RlZCh7IHZhbHVlOiB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKHRoaXMuX2FjdGl2ZURhdGUpLCBldmVudCB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2VsZWN0aW9uS2V5UHJlc3NlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJbml0aWFsaXplcyB0aGlzIG1vbnRoIHZpZXcuICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuX3NldFJhbmdlcyh0aGlzLnNlbGVjdGVkKTtcbiAgICB0aGlzLl90b2RheURhdGUgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvZGF5KCkpO1xuICAgIHRoaXMuX21vbnRoTGFiZWwgPSB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5Lm1vbnRoTGFiZWxcbiAgICAgID8gdGhpcy5fZGF0ZUFkYXB0ZXIuZm9ybWF0KHRoaXMuYWN0aXZlRGF0ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5tb250aExhYmVsKVxuICAgICAgOiB0aGlzLl9kYXRlQWRhcHRlclxuICAgICAgICAuZ2V0TW9udGhOYW1lcygnc2hvcnQnKVxuICAgICAgW3RoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSldLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG5cbiAgICBsZXQgZmlyc3RPZk1vbnRoID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldFllYXIodGhpcy5hY3RpdmVEYXRlKSxcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICAxLFxuICAgICk7XG4gICAgdGhpcy5fZmlyc3RXZWVrT2Zmc2V0ID1cbiAgICAgIChEQVlTX1BFUl9XRUVLICtcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF5T2ZXZWVrKGZpcnN0T2ZNb250aCkgLVxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRGaXJzdERheU9mV2VlaygpKSAlXG4gICAgICBEQVlTX1BFUl9XRUVLO1xuXG4gICAgdGhpcy5faW5pdFdlZWtkYXlzKCk7XG4gICAgdGhpcy5fY3JlYXRlV2Vla0NlbGxzKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cbiAgX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldz86IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9tYXRDYWxlbmRhckJvZHkuX2ZvY3VzQWN0aXZlQ2VsbChtb3ZlUHJldmlldyk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgY2hhbmdlIGRldGVjdGlvbiBoYXMgcnVuIGFuZCB0aGUgbWljcm90YXNrIHF1ZXVlIGlzIGVtcHR5LiAqL1xuICBfZm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9tYXRDYWxlbmRhckJvZHkuX3NjaGVkdWxlRm9jdXNBY3RpdmVDZWxsQWZ0ZXJWaWV3Q2hlY2tlZCgpO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBhY3RpdmF0ZWQgYSBuZXcgY2VsbCBhbmQgdGhlIHByZXZpZXcgbmVlZHMgdG8gYmUgdXBkYXRlZC4gKi9cbiAgX3ByZXZpZXdDaGFuZ2VkKHsgZXZlbnQsIHZhbHVlOiBjZWxsIH06IE5neE1hdENhbGVuZGFyVXNlckV2ZW50PE5neE1hdENhbGVuZGFyQ2VsbDxEPiB8IG51bGw+KSB7XG4gICAgaWYgKHRoaXMuX3JhbmdlU3RyYXRlZ3kpIHtcbiAgICAgIC8vIFdlIGNhbiBhc3N1bWUgdGhhdCB0aGlzIHdpbGwgYmUgYSByYW5nZSwgYmVjYXVzZSBwcmV2aWV3XG4gICAgICAvLyBldmVudHMgYXJlbid0IGZpcmVkIGZvciBzaW5nbGUgZGF0ZSBzZWxlY3Rpb25zLlxuICAgICAgY29uc3QgdmFsdWUgPSBjZWxsID8gY2VsbC5yYXdWYWx1ZSEgOiBudWxsO1xuICAgICAgY29uc3QgcHJldmlld1JhbmdlID0gdGhpcy5fcmFuZ2VTdHJhdGVneS5jcmVhdGVQcmV2aWV3KFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgdGhpcy5zZWxlY3RlZCBhcyBOZ3hEYXRlUmFuZ2U8RD4sXG4gICAgICAgIGV2ZW50LFxuICAgICAgKTtcbiAgICAgIHRoaXMuX3ByZXZpZXdTdGFydCA9IHRoaXMuX2dldENlbGxDb21wYXJlVmFsdWUocHJldmlld1JhbmdlLnN0YXJ0KTtcbiAgICAgIHRoaXMuX3ByZXZpZXdFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHByZXZpZXdSYW5nZS5lbmQpO1xuXG4gICAgICBpZiAodGhpcy5hY3RpdmVEcmFnICYmIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGRyYWdSYW5nZSA9IHRoaXMuX3JhbmdlU3RyYXRlZ3kuY3JlYXRlRHJhZz8uKFxuICAgICAgICAgIHRoaXMuYWN0aXZlRHJhZy52YWx1ZSxcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkIGFzIE5neERhdGVSYW5nZTxEPixcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZHJhZ1JhbmdlKSB7XG4gICAgICAgICAgdGhpcy5fcHJldmlld1N0YXJ0ID0gdGhpcy5fZ2V0Q2VsbENvbXBhcmVWYWx1ZShkcmFnUmFuZ2Uuc3RhcnQpO1xuICAgICAgICAgIHRoaXMuX3ByZXZpZXdFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKGRyYWdSYW5nZS5lbmQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdGUgdGhhdCBoZXJlIHdlIG5lZWQgdG8gdXNlIGBkZXRlY3RDaGFuZ2VzYCwgcmF0aGVyIHRoYW4gYG1hcmtGb3JDaGVja2AsIGJlY2F1c2VcbiAgICAgIC8vIHRoZSB3YXkgYF9mb2N1c0FjdGl2ZUNlbGxgIGlzIHNldCB1cCBhdCB0aGUgbW9tZW50IG1ha2VzIGl0IGZpcmUgYXQgdGhlIHdyb25nIHRpbWVcbiAgICAgIC8vIHdoZW4gbmF2aWdhdGluZyBvbmUgbW9udGggYmFjayB1c2luZyB0aGUga2V5Ym9hcmQgd2hpY2ggd2lsbCBjYXVzZSB0aGlzIGhhbmRsZXJcbiAgICAgIC8vIHRvIHRocm93IGEgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvciB3aGVuIHVwZGF0aW5nIHRoZSBwcmV2aWV3IHN0YXRlLlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgZW5kZWQgYSBkcmFnLiBJZiB0aGUgZHJhZy9kcm9wIHdhcyBzdWNjZXNzZnVsLFxuICAgKiBjb21wdXRlcyBhbmQgZW1pdHMgdGhlIG5ldyByYW5nZSBzZWxlY3Rpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2RyYWdFbmRlZChldmVudDogTmd4TWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZURyYWcpIHJldHVybjtcblxuICAgIGlmIChldmVudC52YWx1ZSkge1xuICAgICAgLy8gUHJvcGFnYXRlIGRyYWcgZWZmZWN0XG4gICAgICBjb25zdCBkcmFnRHJvcFJlc3VsdCA9IHRoaXMuX3JhbmdlU3RyYXRlZ3k/LmNyZWF0ZURyYWc/LihcbiAgICAgICAgdGhpcy5hY3RpdmVEcmFnLnZhbHVlLFxuICAgICAgICB0aGlzLnNlbGVjdGVkIGFzIE5neERhdGVSYW5nZTxEPixcbiAgICAgICAgZXZlbnQudmFsdWUsXG4gICAgICAgIGV2ZW50LmV2ZW50LFxuICAgICAgKTtcblxuICAgICAgdGhpcy5kcmFnRW5kZWQuZW1pdCh7IHZhbHVlOiBkcmFnRHJvcFJlc3VsdCA/PyBudWxsLCBldmVudDogZXZlbnQuZXZlbnQgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhZ0VuZGVkLmVtaXQoeyB2YWx1ZTogbnVsbCwgZXZlbnQ6IGV2ZW50LmV2ZW50IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGRheSBvZiB0aGUgbW9udGggYW5kIHJldHVybnMgYSBuZXcgZGF0ZSBpbiB0aGUgc2FtZSBtb250aCBhbmQgeWVhciBhcyB0aGUgY3VycmVudGx5XG4gICAqICBhY3RpdmUgZGF0ZS4gVGhlIHJldHVybmVkIGRhdGUgd2lsbCBoYXZlIHRoZSBzYW1lIGRheSBvZiB0aGUgbW9udGggYXMgdGhlIGFyZ3VtZW50IGRhdGUuXG4gICAqL1xuICBwcml2YXRlIF9nZXREYXRlRnJvbURheU9mTW9udGgoZGF5T2ZNb250aDogbnVtYmVyKTogRCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVBZGFwdGVyLmNyZWF0ZURhdGUoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRZZWFyKHRoaXMuYWN0aXZlRGF0ZSksXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgZGF5T2ZNb250aCxcbiAgICApO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSB3ZWVrZGF5cy4gKi9cbiAgcHJpdmF0ZSBfaW5pdFdlZWtkYXlzKCkge1xuICAgIGNvbnN0IGZpcnN0RGF5T2ZXZWVrID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0Rmlyc3REYXlPZldlZWsoKTtcbiAgICBjb25zdCBuYXJyb3dXZWVrZGF5cyA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERheU9mV2Vla05hbWVzKCduYXJyb3cnKTtcbiAgICBjb25zdCBsb25nV2Vla2RheXMgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXlPZldlZWtOYW1lcygnbG9uZycpO1xuXG4gICAgLy8gUm90YXRlIHRoZSBsYWJlbHMgZm9yIGRheXMgb2YgdGhlIHdlZWsgYmFzZWQgb24gdGhlIGNvbmZpZ3VyZWQgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgIGxldCB3ZWVrZGF5cyA9IGxvbmdXZWVrZGF5cy5tYXAoKGxvbmcsIGkpID0+IHtcbiAgICAgIHJldHVybiB7IGxvbmcsIG5hcnJvdzogbmFycm93V2Vla2RheXNbaV0gfTtcbiAgICB9KTtcbiAgICB0aGlzLl93ZWVrZGF5cyA9IHdlZWtkYXlzLnNsaWNlKGZpcnN0RGF5T2ZXZWVrKS5jb25jYXQod2Vla2RheXMuc2xpY2UoMCwgZmlyc3REYXlPZldlZWspKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIE1hdENhbGVuZGFyQ2VsbHMgZm9yIHRoZSBkYXRlcyBpbiB0aGlzIG1vbnRoLiAqL1xuICBwcml2YXRlIF9jcmVhdGVXZWVrQ2VsbHMoKSB7XG4gICAgY29uc3QgZGF5c0luTW9udGggPSB0aGlzLl9kYXRlQWRhcHRlci5nZXROdW1EYXlzSW5Nb250aCh0aGlzLmFjdGl2ZURhdGUpO1xuICAgIGNvbnN0IGRhdGVOYW1lcyA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldERhdGVOYW1lcygpO1xuICAgIHRoaXMuX3dlZWtzID0gW1tdXTtcbiAgICBmb3IgKGxldCBpID0gMCwgY2VsbCA9IHRoaXMuX2ZpcnN0V2Vla09mZnNldDsgaSA8IGRheXNJbk1vbnRoOyBpKyssIGNlbGwrKykge1xuICAgICAgaWYgKGNlbGwgPT0gREFZU19QRVJfV0VFSykge1xuICAgICAgICB0aGlzLl93ZWVrcy5wdXNoKFtdKTtcbiAgICAgICAgY2VsbCA9IDA7XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuY3JlYXRlRGF0ZShcbiAgICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcih0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICB0aGlzLl9kYXRlQWRhcHRlci5nZXRNb250aCh0aGlzLmFjdGl2ZURhdGUpLFxuICAgICAgICBpICsgMSxcbiAgICAgICk7XG4gICAgICBjb25zdCBlbmFibGVkID0gdGhpcy5fc2hvdWxkRW5hYmxlRGF0ZShkYXRlKTtcbiAgICAgIGNvbnN0IGFyaWFMYWJlbCA9IHRoaXMuX2RhdGVBZGFwdGVyLmZvcm1hdChkYXRlLCB0aGlzLl9kYXRlRm9ybWF0cy5kaXNwbGF5LmRhdGVBMTF5TGFiZWwpO1xuICAgICAgY29uc3QgY2VsbENsYXNzZXMgPSB0aGlzLmRhdGVDbGFzcyA/IHRoaXMuZGF0ZUNsYXNzKGRhdGUsICdtb250aCcpIDogdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLl93ZWVrc1t0aGlzLl93ZWVrcy5sZW5ndGggLSAxXS5wdXNoKFxuICAgICAgICBuZXcgTmd4TWF0Q2FsZW5kYXJDZWxsPEQ+KFxuICAgICAgICAgIGkgKyAxLFxuICAgICAgICAgIGRhdGVOYW1lc1tpXSxcbiAgICAgICAgICBhcmlhTGFiZWwsXG4gICAgICAgICAgZW5hYmxlZCxcbiAgICAgICAgICBjZWxsQ2xhc3NlcyxcbiAgICAgICAgICB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKGRhdGUpISxcbiAgICAgICAgICBkYXRlLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGF0ZSBmaWx0ZXIgZm9yIHRoZSBtb250aCAqL1xuICBwcml2YXRlIF9zaG91bGRFbmFibGVEYXRlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgISFkYXRlICYmXG4gICAgICAoIXRoaXMubWluRGF0ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCB0aGlzLm1pbkRhdGUpID49IDApICYmXG4gICAgICAoIXRoaXMubWF4RGF0ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZShkYXRlLCB0aGlzLm1heERhdGUpIDw9IDApICYmXG4gICAgICAoIXRoaXMuZGF0ZUZpbHRlciB8fCB0aGlzLmRhdGVGaWx0ZXIoZGF0ZSkpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRlIGluIHRoaXMgbW9udGggdGhhdCB0aGUgZ2l2ZW4gRGF0ZSBmYWxscyBvbi5cbiAgICogUmV0dXJucyBudWxsIGlmIHRoZSBnaXZlbiBEYXRlIGlzIGluIGFub3RoZXIgbW9udGguXG4gICAqL1xuICBwcml2YXRlIF9nZXREYXRlSW5DdXJyZW50TW9udGgoZGF0ZTogRCB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcbiAgICByZXR1cm4gZGF0ZSAmJiB0aGlzLl9oYXNTYW1lTW9udGhBbmRZZWFyKGRhdGUsIHRoaXMuYWN0aXZlRGF0ZSlcbiAgICAgID8gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0RGF0ZShkYXRlKVxuICAgICAgOiBudWxsO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSAyIGRhdGVzIGFyZSBub24tbnVsbCBhbmQgZmFsbCB3aXRoaW4gdGhlIHNhbWUgbW9udGggb2YgdGhlIHNhbWUgeWVhci4gKi9cbiAgcHJpdmF0ZSBfaGFzU2FtZU1vbnRoQW5kWWVhcihkMTogRCB8IG51bGwsIGQyOiBEIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShcbiAgICAgIGQxICYmXG4gICAgICBkMiAmJlxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZDEpID09IHRoaXMuX2RhdGVBZGFwdGVyLmdldE1vbnRoKGQyKSAmJlxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkMSkgPT0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkMilcbiAgICApO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIHRoYXQgd2lsbCBiZSB1c2VkIHRvIG9uZSBjZWxsIHRvIGFub3RoZXIuICovXG4gIHByaXZhdGUgX2dldENlbGxDb21wYXJlVmFsdWUoZGF0ZTogRCB8IG51bGwpOiBudW1iZXIgfCBudWxsIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgLy8gV2UgdXNlIHRoZSB0aW1lIHNpbmNlIHRoZSBVbml4IGVwb2NoIHRvIGNvbXBhcmUgZGF0ZXMgaW4gdGhpcyB2aWV3LCByYXRoZXIgdGhhbiB0aGVcbiAgICAgIC8vIGNlbGwgdmFsdWVzLCBiZWNhdXNlIHdlIG5lZWQgdG8gc3VwcG9ydCByYW5nZXMgdGhhdCBzcGFuIGFjcm9zcyBtdWx0aXBsZSBtb250aHMveWVhcnMuXG4gICAgICBjb25zdCB5ZWFyID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0WWVhcihkYXRlKTtcbiAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0TW9udGgoZGF0ZSk7XG4gICAgICBjb25zdCBkYXkgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXREYXRlKGRhdGUpO1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXkpLmdldFRpbWUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHVzZXIgaGFzIHRoZSBSVEwgbGF5b3V0IGRpcmVjdGlvbi4gKi9cbiAgcHJpdmF0ZSBfaXNSdGwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGN1cnJlbnQgcmFuZ2UgYmFzZWQgb24gYSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfc2V0UmFuZ2VzKHNlbGVjdGVkVmFsdWU6IE5neERhdGVSYW5nZTxEPiB8IEQgfCBudWxsKSB7XG4gICAgaWYgKHNlbGVjdGVkVmFsdWUgaW5zdGFuY2VvZiBOZ3hEYXRlUmFuZ2UpIHtcbiAgICAgIHRoaXMuX3JhbmdlU3RhcnQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHNlbGVjdGVkVmFsdWUuc3RhcnQpO1xuICAgICAgdGhpcy5fcmFuZ2VFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHNlbGVjdGVkVmFsdWUuZW5kKTtcbiAgICAgIHRoaXMuX2lzUmFuZ2UgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yYW5nZVN0YXJ0ID0gdGhpcy5fcmFuZ2VFbmQgPSB0aGlzLl9nZXRDZWxsQ29tcGFyZVZhbHVlKHNlbGVjdGVkVmFsdWUpO1xuICAgICAgdGhpcy5faXNSYW5nZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbXBhcmlzb25SYW5nZVN0YXJ0ID0gdGhpcy5fZ2V0Q2VsbENvbXBhcmVWYWx1ZSh0aGlzLmNvbXBhcmlzb25TdGFydCk7XG4gICAgdGhpcy5fY29tcGFyaXNvblJhbmdlRW5kID0gdGhpcy5fZ2V0Q2VsbENvbXBhcmVWYWx1ZSh0aGlzLmNvbXBhcmlzb25FbmQpO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciBhIGRhdGUgY2FuIGJlIHNlbGVjdGVkIGluIHRoZSBtb250aCB2aWV3LiAqL1xuICBwcml2YXRlIF9jYW5TZWxlY3QoZGF0ZTogRCkge1xuICAgIHJldHVybiAhdGhpcy5kYXRlRmlsdGVyIHx8IHRoaXMuZGF0ZUZpbHRlcihkYXRlKTtcbiAgfVxuXG4gIC8qKiBDbGVhcnMgb3V0IHByZXZpZXcgc3RhdGUuICovXG4gIHByaXZhdGUgX2NsZWFyUHJldmlldygpIHtcbiAgICB0aGlzLl9wcmV2aWV3U3RhcnQgPSB0aGlzLl9wcmV2aWV3RW5kID0gbnVsbDtcbiAgfVxufVxuIiwiPHRhYmxlIGNsYXNzPVwibWF0LWNhbGVuZGFyLXRhYmxlXCIgcm9sZT1cImdyaWRcIj5cbiAgPHRoZWFkIGNsYXNzPVwibWF0LWNhbGVuZGFyLXRhYmxlLWhlYWRlclwiPlxuICAgIDx0cj5cbiAgICAgIDx0aCBzY29wZT1cImNvbFwiICpuZ0Zvcj1cImxldCBkYXkgb2YgX3dlZWtkYXlzXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2RrLXZpc3VhbGx5LWhpZGRlblwiPnt7ZGF5Lmxvbmd9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+e3tkYXkubmFycm93fX08L3NwYW4+XG4gICAgICA8L3RoPlxuICAgIDwvdHI+XG4gICAgPHRyPjx0aCBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzcz1cIm1hdC1jYWxlbmRhci10YWJsZS1oZWFkZXItZGl2aWRlclwiIGNvbHNwYW49XCI3XCI+PC90aD48L3RyPlxuICA8L3RoZWFkPlxuICA8dGJvZHkgbmd4LW1hdC1jYWxlbmRhci1ib2R5XG4gICAgICAgICBbbGFiZWxdPVwiX21vbnRoTGFiZWxcIlxuICAgICAgICAgW3Jvd3NdPVwiX3dlZWtzXCJcbiAgICAgICAgIFt0b2RheVZhbHVlXT1cIl90b2RheURhdGUhXCJcbiAgICAgICAgIFtzdGFydFZhbHVlXT1cIl9yYW5nZVN0YXJ0IVwiXG4gICAgICAgICBbZW5kVmFsdWVdPVwiX3JhbmdlRW5kIVwiXG4gICAgICAgICBbY29tcGFyaXNvblN0YXJ0XT1cIl9jb21wYXJpc29uUmFuZ2VTdGFydFwiXG4gICAgICAgICBbY29tcGFyaXNvbkVuZF09XCJfY29tcGFyaXNvblJhbmdlRW5kXCJcbiAgICAgICAgIFtwcmV2aWV3U3RhcnRdPVwiX3ByZXZpZXdTdGFydFwiXG4gICAgICAgICBbcHJldmlld0VuZF09XCJfcHJldmlld0VuZFwiXG4gICAgICAgICBbaXNSYW5nZV09XCJfaXNSYW5nZVwiXG4gICAgICAgICBbbGFiZWxNaW5SZXF1aXJlZENlbGxzXT1cIjNcIlxuICAgICAgICAgW2FjdGl2ZUNlbGxdPVwiX2RhdGVBZGFwdGVyLmdldERhdGUoYWN0aXZlRGF0ZSkgLSAxXCJcbiAgICAgICAgIFtzdGFydERhdGVBY2Nlc3NpYmxlTmFtZV09XCJzdGFydERhdGVBY2Nlc3NpYmxlTmFtZVwiXG4gICAgICAgICBbZW5kRGF0ZUFjY2Vzc2libGVOYW1lXT1cImVuZERhdGVBY2Nlc3NpYmxlTmFtZVwiXG4gICAgICAgICAoc2VsZWN0ZWRWYWx1ZUNoYW5nZSk9XCJfZGF0ZVNlbGVjdGVkKCRldmVudClcIlxuICAgICAgICAgKGFjdGl2ZURhdGVDaGFuZ2UpPVwiX3VwZGF0ZUFjdGl2ZURhdGUoJGV2ZW50KVwiXG4gICAgICAgICAocHJldmlld0NoYW5nZSk9XCJfcHJldmlld0NoYW5nZWQoJGV2ZW50KVwiXG4gICAgICAgICAoZHJhZ1N0YXJ0ZWQpPVwiZHJhZ1N0YXJ0ZWQuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgIChkcmFnRW5kZWQpPVwiX2RyYWdFbmRlZCgkZXZlbnQpXCJcbiAgICAgICAgIChrZXl1cCk9XCJfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5dXAoJGV2ZW50KVwiXG4gICAgICAgICAoa2V5ZG93bik9XCJfaGFuZGxlQ2FsZW5kYXJCb2R5S2V5ZG93bigkZXZlbnQpXCI+XG4gIDwvdGJvZHk+XG48L3RhYmxlPlxuIl19