import { ElementRef, EventEmitter, NgZone, OnChanges, SimpleChanges, OnDestroy, AfterViewChecked } from '@angular/core';
import * as i0 from "@angular/core";
/** Extra CSS classes that can be associated with a calendar cell. */
export declare type NgxMatCalendarCellCssClasses = string | string[] | Set<string> | {
    [key: string]: any;
};
/** Function that can generate the extra classes that should be added to a calendar cell. */
export declare type NgxMatCalendarCellClassFunction<D> = (date: D, view: 'month' | 'year' | 'multi-year') => NgxMatCalendarCellCssClasses;
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export declare class NgxMatCalendarCell<D = any> {
    value: number;
    displayValue: string;
    ariaLabel: string;
    enabled: boolean;
    cssClasses: NgxMatCalendarCellCssClasses;
    compareValue: number;
    rawValue?: D;
    constructor(value: number, displayValue: string, ariaLabel: string, enabled: boolean, cssClasses?: NgxMatCalendarCellCssClasses, compareValue?: number, rawValue?: D);
}
/** Event emitted when a date inside the calendar is triggered as a result of a user action. */
export interface NgxMatCalendarUserEvent<D> {
    value: D;
    event: Event;
}
export declare class NgxMatCalendarBody<D = any> implements OnChanges, OnDestroy, AfterViewChecked {
    private _elementRef;
    private _ngZone;
    private _platform;
    /**
     * Used to skip the next focus event when rendering the preview range.
     * We need a flag like this, because some browsers fire focus events asynchronously.
     */
    private _skipNextFocus;
    /**
     * Used to focus the active cell after change detection has run.
     */
    private _focusActiveCellAfterViewChecked;
    /** The label for the table. (e.g. "Jan 2017"). */
    label: string;
    /** The cells to display in the table. */
    rows: NgxMatCalendarCell[][];
    /** The value in the table that corresponds to today. */
    todayValue: number;
    /** Start value of the selected date range. */
    startValue: number;
    /** End value of the selected date range. */
    endValue: number;
    /** The minimum number of free cells needed to fit the label in the first row. */
    labelMinRequiredCells: number;
    /** The number of columns in the table. */
    numCols: number;
    /** The cell number of the active cell in the table. */
    activeCell: number;
    ngAfterViewChecked(): void;
    /** Whether a range is being selected. */
    isRange: boolean;
    /**
     * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
     * maintained even as the table resizes.
     */
    cellAspectRatio: number;
    /** Start of the comparison range. */
    comparisonStart: number | null;
    /** End of the comparison range. */
    comparisonEnd: number | null;
    /** Start of the preview range. */
    previewStart: number | null;
    /** End of the preview range. */
    previewEnd: number | null;
    /** ARIA Accessible name of the `<input matStartDate/>` */
    startDateAccessibleName: string | null;
    /** ARIA Accessible name of the `<input matEndDate/>` */
    endDateAccessibleName: string | null;
    /** Emits when a new value is selected. */
    readonly selectedValueChange: EventEmitter<NgxMatCalendarUserEvent<number>>;
    /** Emits when the preview has changed as a result of a user action. */
    readonly previewChange: EventEmitter<NgxMatCalendarUserEvent<NgxMatCalendarCell<any>>>;
    readonly activeDateChange: EventEmitter<NgxMatCalendarUserEvent<number>>;
    /** Emits the date at the possible start of a drag event. */
    readonly dragStarted: EventEmitter<NgxMatCalendarUserEvent<D>>;
    /** Emits the date at the conclusion of a drag, or null if mouse was not released on a date. */
    readonly dragEnded: EventEmitter<NgxMatCalendarUserEvent<D>>;
    /** The number of blank cells to put at the beginning for the first row. */
    _firstRowOffset: number;
    /** Padding for the individual date cells. */
    _cellPadding: string;
    /** Width of an individual cell. */
    _cellWidth: string;
    private _didDragSinceMouseDown;
    constructor(_elementRef: ElementRef<HTMLElement>, _ngZone: NgZone);
    /** Called when a cell is clicked. */
    _cellClicked(cell: NgxMatCalendarCell, event: MouseEvent): void;
    _emitActiveDateChange(cell: NgxMatCalendarCell, event: FocusEvent): void;
    /** Returns whether a cell should be marked as selected. */
    _isSelected(value: number): boolean;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Returns whether a cell is active. */
    _isActiveCell(rowIndex: number, colIndex: number): boolean;
    _focusActiveCell(movePreview?: boolean): void;
    /** Focuses the active cell after change detection has run and the microtask queue is empty. */
    _scheduleFocusActiveCellAfterViewChecked(): void;
    /** Gets whether a value is the start of the main range. */
    _isRangeStart(value: number): boolean;
    /** Gets whether a value is the end of the main range. */
    _isRangeEnd(value: number): boolean;
    /** Gets whether a value is within the currently-selected range. */
    _isInRange(value: number): boolean;
    /** Gets whether a value is the start of the comparison range. */
    _isComparisonStart(value: number): boolean;
    /** Whether the cell is a start bridge cell between the main and comparison ranges. */
    _isComparisonBridgeStart(value: number, rowIndex: number, colIndex: number): boolean;
    /** Whether the cell is an end bridge cell between the main and comparison ranges. */
    _isComparisonBridgeEnd(value: number, rowIndex: number, colIndex: number): boolean;
    /** Gets whether a value is the end of the comparison range. */
    _isComparisonEnd(value: number): boolean;
    /** Gets whether a value is within the current comparison range. */
    _isInComparisonRange(value: number): boolean;
    _isComparisonIdentical(value: number): boolean;
    /** Gets whether a value is the start of the preview range. */
    _isPreviewStart(value: number): boolean;
    /** Gets whether a value is the end of the preview range. */
    _isPreviewEnd(value: number): boolean;
    /** Gets whether a value is inside the preview range. */
    _isInPreview(value: number): boolean;
    /** Gets ids of aria descriptions for the start and end of a date range. */
    _getDescribedby(value: number): string | null;
    /**
     * Event handler for when the user enters an element
     * inside the calendar body (e.g. by hovering in or focus).
     */
    private _enterHandler;
    private _touchmoveHandler;
    /**
     * Event handler for when the user's pointer leaves an element
     * inside the calendar body (e.g. by hovering out or blurring).
     */
    private _leaveHandler;
    /**
     * Triggered on mousedown or touchstart on a date cell.
     * Respsonsible for starting a drag sequence.
     */
    private _mousedownHandler;
    /** Triggered on mouseup anywhere. Respsonsible for ending a drag sequence. */
    private _mouseupHandler;
    /** Triggered on touchend anywhere. Respsonsible for ending a drag sequence. */
    private _touchendHandler;
    /** Finds the MatCalendarCell that corresponds to a DOM node. */
    private _getCellFromElement;
    private _id;
    _startDateLabelId: string;
    _endDateLabelId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatCalendarBody<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatCalendarBody<any>, "[ngx-mat-calendar-body]", ["matCalendarBody"], { "label": "label"; "rows": "rows"; "todayValue": "todayValue"; "startValue": "startValue"; "endValue": "endValue"; "labelMinRequiredCells": "labelMinRequiredCells"; "numCols": "numCols"; "activeCell": "activeCell"; "isRange": "isRange"; "cellAspectRatio": "cellAspectRatio"; "comparisonStart": "comparisonStart"; "comparisonEnd": "comparisonEnd"; "previewStart": "previewStart"; "previewEnd": "previewEnd"; "startDateAccessibleName": "startDateAccessibleName"; "endDateAccessibleName": "endDateAccessibleName"; }, { "selectedValueChange": "selectedValueChange"; "previewChange": "previewChange"; "activeDateChange": "activeDateChange"; "dragStarted": "dragStarted"; "dragEnded": "dragEnded"; }, never, never, false, never>;
}
