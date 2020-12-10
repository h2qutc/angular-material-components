/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, InjectionToken} from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { NgxMatDateAdapter } from './core/date-adapter';

/** Injection token used to customize the date range selection behavior. */
export const NGX_MAT_DATE_RANGE_SELECTION_STRATEGY =
    new InjectionToken<NgxMatDateRangeSelectionStrategy<any>>('NGX_MAT_DATE_RANGE_SELECTION_STRATEGY');

/** Object that can be provided in order to customize the date range selection behavior. */
export interface NgxMatDateRangeSelectionStrategy<D> {
  /**
   * Called when the user has finished selecting a value.
   * @param date Date that was selected. Will be null if the user cleared the selection.
   * @param currentRange Range that is currently show in the calendar.
   * @param event DOM event that triggered the selection. Currently only corresponds to a `click`
   *    event, but it may get expanded in the future.
   */
  selectionFinished(date: D | null, currentRange: DateRange<D>, event: Event): DateRange<D>;

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
  createPreview(activeDate: D | null, currentRange: DateRange<D>, event: Event): DateRange<D>;
}

/** Provides the default date range selection behavior. */
@Injectable()
export class DefaultNgxMatCalendarRangeStrategy<D> implements NgxMatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: NgxMatDateAdapter<D>) {}

  selectionFinished(date: D, currentRange: DateRange<D>) {
    let {start, end} = currentRange;

    if (start == null) {
      start = date;
    } else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
      end = date;
    } else {
      start = date;
      end = null;
    }

    return new DateRange<D>(start, end);
  }

  createPreview(activeDate: D | null, currentRange: DateRange<D>) {
    let start: D | null = null;
    let end: D | null = null;

    if (currentRange.start && !currentRange.end && activeDate) {
      start = currentRange.start;
      end = activeDate;
    }

    return new DateRange<D>(start, end);
  }
}
