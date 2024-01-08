import { Directionality } from '@angular/cdk/bidi';
import { AfterContentInit, ChangeDetectorRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NgxMatCalendarBody, NgxMatCalendarCell, NgxMatCalendarCellClassFunction, NgxMatCalendarUserEvent } from './calendar-body';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxMatDateFormats } from './core/date-formats';
import { NgxMatDateRangeSelectionStrategy } from './date-range-selection-strategy';
import { NgxDateRange } from './date-selection-model';
import * as i0 from "@angular/core";
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class NgxMatMonthView<D> implements AfterContentInit, OnChanges, OnDestroy {
    readonly _changeDetectorRef: ChangeDetectorRef;
    private _dateFormats;
    _dateAdapter: NgxMatDateAdapter<D>;
    private _dir?;
    private _rangeStrategy?;
    private _rerenderSubscription;
    /** Flag used to filter out space/enter keyup events that originated outside of the view. */
    private _selectionKeyPressed;
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    get activeDate(): D;
    set activeDate(value: D);
    private _activeDate;
    /** The currently selected date. */
    get selected(): NgxDateRange<D> | D | null;
    set selected(value: NgxDateRange<D> | D | null);
    private _selected;
    /** The minimum selectable date. */
    get minDate(): D | null;
    set minDate(value: D | null);
    private _minDate;
    /** The maximum selectable date. */
    get maxDate(): D | null;
    set maxDate(value: D | null);
    private _maxDate;
    /** Function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Function that can be used to add custom CSS classes to dates. */
    dateClass: NgxMatCalendarCellClassFunction<D>;
    /** Start of the comparison range. */
    comparisonStart: D | null;
    /** End of the comparison range. */
    comparisonEnd: D | null;
    /** ARIA Accessible name of the `<input matStartDate/>` */
    startDateAccessibleName: string | null;
    /** ARIA Accessible name of the `<input matEndDate/>` */
    endDateAccessibleName: string | null;
    /** Origin of active drag, or null when dragging is not active. */
    activeDrag: NgxMatCalendarUserEvent<D> | null;
    /** Emits when a new date is selected. */
    readonly selectedChange: EventEmitter<D | null>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<NgxMatCalendarUserEvent<D | null>>;
    /** Emits when the user initiates a date range drag via mouse or touch. */
    readonly dragStarted: EventEmitter<NgxMatCalendarUserEvent<D>>;
    /**
     * Emits when the user completes or cancels a date range drag.
     * Emits null when the drag was canceled or the newly selected date range if completed.
     */
    readonly dragEnded: EventEmitter<NgxMatCalendarUserEvent<NgxDateRange<D>>>;
    /** Emits when any date is activated. */
    readonly activeDateChange: EventEmitter<D>;
    /** The body of calendar table */
    _matCalendarBody: NgxMatCalendarBody;
    /** The label for this month (e.g. "January 2017"). */
    _monthLabel: string;
    /** Grid of calendar cells representing the dates of the month. */
    _weeks: NgxMatCalendarCell[][];
    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;
    /** Start value of the currently-shown date range. */
    _rangeStart: number | null;
    /** End value of the currently-shown date range. */
    _rangeEnd: number | null;
    /** Start value of the currently-shown comparison date range. */
    _comparisonRangeStart: number | null;
    /** End value of the currently-shown comparison date range. */
    _comparisonRangeEnd: number | null;
    /** Start of the preview range. */
    _previewStart: number | null;
    /** End of the preview range. */
    _previewEnd: number | null;
    /** Whether the user is currently selecting a range of dates. */
    _isRange: boolean;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number | null;
    /** The names of the weekdays. */
    _weekdays: {
        long: string;
        narrow: string;
    }[];
    constructor(_changeDetectorRef: ChangeDetectorRef, _dateFormats: NgxMatDateFormats, _dateAdapter: NgxMatDateAdapter<D>, _dir?: Directionality, _rangeStrategy?: NgxMatDateRangeSelectionStrategy<D>);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Handles when a new date is selected. */
    _dateSelected(event: NgxMatCalendarUserEvent<number>): void;
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
    _updateActiveDate(event: NgxMatCalendarUserEvent<number>): void;
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Handles keyup events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeyup(event: KeyboardEvent): void;
    /** Initializes this month view. */
    _init(): void;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(movePreview?: boolean): void;
    /** Focuses the active cell after change detection has run and the microtask queue is empty. */
    _focusActiveCellAfterViewChecked(): void;
    /** Called when the user has activated a new cell and the preview needs to be updated. */
    _previewChanged({ event, value: cell }: NgxMatCalendarUserEvent<NgxMatCalendarCell<D> | null>): void;
    /**
     * Called when the user has ended a drag. If the drag/drop was successful,
     * computes and emits the new range selection.
     */
    protected _dragEnded(event: NgxMatCalendarUserEvent<D | null>): void;
    /**
     * Takes a day of the month and returns a new date in the same month and year as the currently
     *  active date. The returned date will have the same day of the month as the argument date.
     */
    private _getDateFromDayOfMonth;
    /** Initializes the weekdays. */
    private _initWeekdays;
    /** Creates MatCalendarCells for the dates in this month. */
    private _createWeekCells;
    /** Date filter for the month */
    private _shouldEnableDate;
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth;
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    private _hasSameMonthAndYear;
    /** Gets the value that will be used to one cell to another. */
    private _getCellCompareValue;
    /** Determines whether the user has the RTL layout direction. */
    private _isRtl;
    /** Sets the current range based on a model value. */
    private _setRanges;
    /** Gets whether a date can be selected in the month view. */
    private _canSelect;
    /** Clears out preview state. */
    private _clearPreview;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatMonthView<any>, [null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatMonthView<any>, "ngx-mat-month-view", ["ngxMatMonthView"], { "activeDate": "activeDate"; "selected": "selected"; "minDate": "minDate"; "maxDate": "maxDate"; "dateFilter": "dateFilter"; "dateClass": "dateClass"; "comparisonStart": "comparisonStart"; "comparisonEnd": "comparisonEnd"; "startDateAccessibleName": "startDateAccessibleName"; "endDateAccessibleName": "endDateAccessibleName"; "activeDrag": "activeDrag"; }, { "selectedChange": "selectedChange"; "_userSelection": "_userSelection"; "dragStarted": "dragStarted"; "dragEnded": "dragEnded"; "activeDateChange": "activeDateChange"; }, never, never, false, never>;
}
