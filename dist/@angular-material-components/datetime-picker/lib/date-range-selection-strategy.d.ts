import { FactoryProvider, InjectionToken } from '@angular/core';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxDateRange } from './date-selection-model';
import * as i0 from "@angular/core";
/** Injection token used to customize the date range selection behavior. */
export declare const NGX_MAT_DATE_RANGE_SELECTION_STRATEGY: InjectionToken<NgxMatDateRangeSelectionStrategy<any>>;
/** Object that can be provided in order to customize the date range selection behavior. */
export interface NgxMatDateRangeSelectionStrategy<D> {
    /**
     * Called when the user has finished selecting a value.
     * @param date Date that was selected. Will be null if the user cleared the selection.
     * @param currentRange Range that is currently show in the calendar.
     * @param event DOM event that triggered the selection. Currently only corresponds to a `click`
     *    event, but it may get expanded in the future.
     */
    selectionFinished(date: D | null, currentRange: NgxDateRange<D>, event: Event): NgxDateRange<D>;
    /**
     * Called when the user has activated a new date (e.g. by hovering over
     * it or moving focus) and the calendar tries to display a date range.
     *
     * @param activeDate Date that the user has activated. Will be null if the user moved
     *    focus to an element that's no a calendar cell.
     * @param currentRange Range that is currently shown in the calendar.
     * @param event DOM event that caused the preview to be changed. Will be either a
     *    `mouseenter`/`mouseleave` or `focus`/`blur` depending on how the user is navigating.
     */
    createPreview(activeDate: D | null, currentRange: NgxDateRange<D>, event: Event): NgxDateRange<D>;
    /**
     * Called when the user has dragged a date in the currently selected range to another
     * date. Returns the date updated range that should result from this interaction.
     *
     * @param dateOrigin The date the user started dragging from.
     * @param originalRange The originally selected date range.
     * @param newDate The currently targeted date in the drag operation.
     * @param event DOM event that triggered the updated drag state. Will be
     *     `mouseenter`/`mouseup` or `touchmove`/`touchend` depending on the device type.
     */
    createDrag?(dragOrigin: D, originalRange: NgxDateRange<D>, newDate: D, event: Event): NgxDateRange<D> | null;
}
/** Provides the default date range selection behavior. */
export declare class DefaultNgxMatCalendarRangeStrategy<D> implements NgxMatDateRangeSelectionStrategy<D> {
    private _dateAdapter;
    constructor(_dateAdapter: NgxMatDateAdapter<D>);
    selectionFinished(date: D, currentRange: NgxDateRange<D>): NgxDateRange<D>;
    createPreview(activeDate: D | null, currentRange: NgxDateRange<D>): NgxDateRange<D>;
    createDrag(dragOrigin: D, originalRange: NgxDateRange<D>, newDate: D): NgxDateRange<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultNgxMatCalendarRangeStrategy<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DefaultNgxMatCalendarRangeStrategy<any>>;
}
/** @docs-private */
export declare function NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY(parent: NgxMatDateRangeSelectionStrategy<unknown>, adapter: NgxMatDateAdapter<unknown>): NgxMatDateRangeSelectionStrategy<unknown>;
export declare const NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER: FactoryProvider;
