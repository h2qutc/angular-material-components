import { FactoryProvider, Injectable, InjectionToken, Optional, SkipSelf } from '@angular/core';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxDateRange } from './date-selection-model';

/** Injection token used to customize the date range selection behavior. */
export const NGX_MAT_DATE_RANGE_SELECTION_STRATEGY = new InjectionToken<
  NgxMatDateRangeSelectionStrategy<any>
>('NGX_MAT_DATE_RANGE_SELECTION_STRATEGY');

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
  createDrag?(
    dragOrigin: D,
    originalRange: NgxDateRange<D>,
    newDate: D,
    event: Event,
  ): NgxDateRange<D> | null;
}

/** Provides the default date range selection behavior. */
@Injectable()
export class DefaultNgxMatCalendarRangeStrategy<D> implements NgxMatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: NgxMatDateAdapter<D>) { }

  selectionFinished(date: D, currentRange: NgxDateRange<D>) {
    let { start, end } = currentRange;

    if (start == null) {
      start = date;
    } else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
      end = date;
    } else {
      start = date;
      end = null;
    }

    return new NgxDateRange<D>(start, end);
  }

  createPreview(activeDate: D | null, currentRange: NgxDateRange<D>) {
    let start: D | null = null;
    let end: D | null = null;

    if (currentRange.start && !currentRange.end && activeDate) {
      start = currentRange.start;
      end = activeDate;
    }

    return new NgxDateRange<D>(start, end);
  }

  createDrag(dragOrigin: D, originalRange: NgxDateRange<D>, newDate: D) {
    let start = originalRange.start;
    let end = originalRange.end;

    if (!start || !end) {
      // Can't drag from an incomplete range.
      return null;
    }

    const adapter = this._dateAdapter;

    const isRange = adapter.compareDate(start, end) !== 0;
    const diffYears = adapter.getYear(newDate) - adapter.getYear(dragOrigin);
    const diffMonths = adapter.getMonth(newDate) - adapter.getMonth(dragOrigin);
    const diffDays = adapter.getDate(newDate) - adapter.getDate(dragOrigin);

    if (isRange && adapter.sameDate(dragOrigin, originalRange.start)) {
      start = newDate;
      if (adapter.compareDate(newDate, end) > 0) {
        end = adapter.addCalendarYears(end, diffYears);
        end = adapter.addCalendarMonths(end, diffMonths);
        end = adapter.addCalendarDays(end, diffDays);
      }
    } else if (isRange && adapter.sameDate(dragOrigin, originalRange.end)) {
      end = newDate;
      if (adapter.compareDate(newDate, start) < 0) {
        start = adapter.addCalendarYears(start, diffYears);
        start = adapter.addCalendarMonths(start, diffMonths);
        start = adapter.addCalendarDays(start, diffDays);
      }
    } else {
      start = adapter.addCalendarYears(start, diffYears);
      start = adapter.addCalendarMonths(start, diffMonths);
      start = adapter.addCalendarDays(start, diffDays);
      end = adapter.addCalendarYears(end, diffYears);
      end = adapter.addCalendarMonths(end, diffMonths);
      end = adapter.addCalendarDays(end, diffDays);
    }

    return new NgxDateRange<D>(start, end);
  }
}

/** @docs-private */
export function NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY(
  parent: NgxMatDateRangeSelectionStrategy<unknown>,
  adapter: NgxMatDateAdapter<unknown>,
) {
  return parent || new DefaultNgxMatCalendarRangeStrategy(adapter);
}

export const NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER: FactoryProvider = {
  provide: NGX_MAT_DATE_RANGE_SELECTION_STRATEGY,
  deps: [[new Optional(), new SkipSelf(), NGX_MAT_DATE_RANGE_SELECTION_STRATEGY], NgxMatDateAdapter],
  useFactory: NGX_MAT_CALENDAR_RANGE_STRATEGY_PROVIDER_FACTORY,
};
