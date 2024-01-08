import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Datepicker data that requires internationalization. */
export class NgxMatDatepickerIntl {
    constructor() {
        /**
         * Stream that emits whenever the labels here are changed. Use this to notify
         * components if the labels have changed after initialization.
         */
        this.changes = new Subject();
        /** A label for the calendar popup (used by screen readers). */
        this.calendarLabel = 'Calendar';
        /** A label for the button used to open the calendar popup (used by screen readers). */
        this.openCalendarLabel = 'Open calendar';
        /** Label for the button used to close the calendar popup. */
        this.closeCalendarLabel = 'Close calendar';
        /** A label for the previous month button (used by screen readers). */
        this.prevMonthLabel = 'Previous month';
        /** A label for the next month button (used by screen readers). */
        this.nextMonthLabel = 'Next month';
        /** A label for the previous year button (used by screen readers). */
        this.prevYearLabel = 'Previous year';
        /** A label for the next year button (used by screen readers). */
        this.nextYearLabel = 'Next year';
        /** A label for the previous multi-year button (used by screen readers). */
        this.prevMultiYearLabel = 'Previous 24 years';
        /** A label for the next multi-year button (used by screen readers). */
        this.nextMultiYearLabel = 'Next 24 years';
        /** A label for the 'switch to month view' button (used by screen readers). */
        this.switchToMonthViewLabel = 'Choose date';
        /** A label for the 'switch to year view' button (used by screen readers). */
        this.switchToMultiYearViewLabel = 'Choose month and year';
        /**
         * A label for the first date of a range of dates (used by screen readers).
         * @deprecated Provide your own internationalization string.
         * @breaking-change 17.0.0
         */
        this.startDateLabel = 'Start date';
        /**
         * A label for the last date of a range of dates (used by screen readers).
         * @deprecated Provide your own internationalization string.
         * @breaking-change 17.0.0
         */
        this.endDateLabel = 'End date';
    }
    /** Formats a range of years (used for visuals). */
    formatYearRange(start, end) {
        return `${start} \u2013 ${end}`;
    }
    /** Formats a label for a range of years (used by screen readers). */
    formatYearRangeLabel(start, end) {
        return `${start} to ${end}`;
    }
}
/** @nocollapse */ NgxMatDatepickerIntl.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ NgxMatDatepickerIntl.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerIntl, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnRsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvZGF0ZXBpY2tlci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFFN0IsMERBQTBEO0FBRTFELE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFRTs7O1dBR0c7UUFDTSxZQUFPLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFFdEQsK0RBQStEO1FBQy9ELGtCQUFhLEdBQUcsVUFBVSxDQUFDO1FBRTNCLHVGQUF1RjtRQUN2RixzQkFBaUIsR0FBRyxlQUFlLENBQUM7UUFFcEMsNkRBQTZEO1FBQzdELHVCQUFrQixHQUFHLGdCQUFnQixDQUFDO1FBRXRDLHNFQUFzRTtRQUN0RSxtQkFBYyxHQUFHLGdCQUFnQixDQUFDO1FBRWxDLGtFQUFrRTtRQUNsRSxtQkFBYyxHQUFHLFlBQVksQ0FBQztRQUU5QixxRUFBcUU7UUFDckUsa0JBQWEsR0FBRyxlQUFlLENBQUM7UUFFaEMsaUVBQWlFO1FBQ2pFLGtCQUFhLEdBQUcsV0FBVyxDQUFDO1FBRTVCLDJFQUEyRTtRQUMzRSx1QkFBa0IsR0FBRyxtQkFBbUIsQ0FBQztRQUV6Qyx1RUFBdUU7UUFDdkUsdUJBQWtCLEdBQUcsZUFBZSxDQUFDO1FBRXJDLDhFQUE4RTtRQUM5RSwyQkFBc0IsR0FBRyxhQUFhLENBQUM7UUFFdkMsNkVBQTZFO1FBQzdFLCtCQUEwQixHQUFHLHVCQUF1QixDQUFDO1FBRXJEOzs7O1dBSUc7UUFDSCxtQkFBYyxHQUFHLFlBQVksQ0FBQztRQUU5Qjs7OztXQUlHO1FBQ0gsaUJBQVksR0FBRyxVQUFVLENBQUM7S0FXM0I7SUFUQyxtREFBbUQ7SUFDbkQsZUFBZSxDQUFDLEtBQWEsRUFBRSxHQUFXO1FBQ3hDLE9BQU8sR0FBRyxLQUFLLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSxvQkFBb0IsQ0FBQyxLQUFhLEVBQUUsR0FBVztRQUM3QyxPQUFPLEdBQUcsS0FBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7O29JQTlEVSxvQkFBb0I7d0lBQXBCLG9CQUFvQixjQURSLE1BQU07MkZBQ2xCLG9CQUFvQjtrQkFEaEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKiBEYXRlcGlja2VyIGRhdGEgdGhhdCByZXF1aXJlcyBpbnRlcm5hdGlvbmFsaXphdGlvbi4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJJbnRsIHtcbiAgLyoqXG4gICAqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBsYWJlbHMgaGVyZSBhcmUgY2hhbmdlZC4gVXNlIHRoaXMgdG8gbm90aWZ5XG4gICAqIGNvbXBvbmVudHMgaWYgdGhlIGxhYmVscyBoYXZlIGNoYW5nZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICByZWFkb25seSBjaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIGNhbGVuZGFyIHBvcHVwICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgY2FsZW5kYXJMYWJlbCA9ICdDYWxlbmRhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBidXR0b24gdXNlZCB0byBvcGVuIHRoZSBjYWxlbmRhciBwb3B1cCAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIG9wZW5DYWxlbmRhckxhYmVsID0gJ09wZW4gY2FsZW5kYXInO1xuXG4gIC8qKiBMYWJlbCBmb3IgdGhlIGJ1dHRvbiB1c2VkIHRvIGNsb3NlIHRoZSBjYWxlbmRhciBwb3B1cC4gKi9cbiAgY2xvc2VDYWxlbmRhckxhYmVsID0gJ0Nsb3NlIGNhbGVuZGFyJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIHByZXZpb3VzIG1vbnRoIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZNb250aExhYmVsID0gJ1ByZXZpb3VzIG1vbnRoJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlIG5leHQgbW9udGggYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dE1vbnRoTGFiZWwgPSAnTmV4dCBtb250aCc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBwcmV2aW91cyB5ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIHByZXZZZWFyTGFiZWwgPSAnUHJldmlvdXMgeWVhcic7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSBuZXh0IHllYXIgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgbmV4dFllYXJMYWJlbCA9ICdOZXh0IHllYXInO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgcHJldmlvdXMgbXVsdGkteWVhciBidXR0b24gKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBwcmV2TXVsdGlZZWFyTGFiZWwgPSAnUHJldmlvdXMgMjQgeWVhcnMnO1xuXG4gIC8qKiBBIGxhYmVsIGZvciB0aGUgbmV4dCBtdWx0aS15ZWFyIGJ1dHRvbiAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuICovXG4gIG5leHRNdWx0aVllYXJMYWJlbCA9ICdOZXh0IDI0IHllYXJzJztcblxuICAvKiogQSBsYWJlbCBmb3IgdGhlICdzd2l0Y2ggdG8gbW9udGggdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9Nb250aFZpZXdMYWJlbCA9ICdDaG9vc2UgZGF0ZSc7XG5cbiAgLyoqIEEgbGFiZWwgZm9yIHRoZSAnc3dpdGNoIHRvIHllYXIgdmlldycgYnV0dG9uICh1c2VkIGJ5IHNjcmVlbiByZWFkZXJzKS4gKi9cbiAgc3dpdGNoVG9NdWx0aVllYXJWaWV3TGFiZWwgPSAnQ2hvb3NlIG1vbnRoIGFuZCB5ZWFyJztcblxuICAvKipcbiAgICogQSBsYWJlbCBmb3IgdGhlIGZpcnN0IGRhdGUgb2YgYSByYW5nZSBvZiBkYXRlcyAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuXG4gICAqIEBkZXByZWNhdGVkIFByb3ZpZGUgeW91ciBvd24gaW50ZXJuYXRpb25hbGl6YXRpb24gc3RyaW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgc3RhcnREYXRlTGFiZWwgPSAnU3RhcnQgZGF0ZSc7XG5cbiAgLyoqXG4gICAqIEEgbGFiZWwgZm9yIHRoZSBsYXN0IGRhdGUgb2YgYSByYW5nZSBvZiBkYXRlcyAodXNlZCBieSBzY3JlZW4gcmVhZGVycykuXG4gICAqIEBkZXByZWNhdGVkIFByb3ZpZGUgeW91ciBvd24gaW50ZXJuYXRpb25hbGl6YXRpb24gc3RyaW5nLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgZW5kRGF0ZUxhYmVsID0gJ0VuZCBkYXRlJztcblxuICAvKiogRm9ybWF0cyBhIHJhbmdlIG9mIHllYXJzICh1c2VkIGZvciB2aXN1YWxzKS4gKi9cbiAgZm9ybWF0WWVhclJhbmdlKHN0YXJ0OiBzdHJpbmcsIGVuZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7c3RhcnR9IFxcdTIwMTMgJHtlbmR9YDtcbiAgfVxuXG4gIC8qKiBGb3JtYXRzIGEgbGFiZWwgZm9yIGEgcmFuZ2Ugb2YgeWVhcnMgKHVzZWQgYnkgc2NyZWVuIHJlYWRlcnMpLiAqL1xuICBmb3JtYXRZZWFyUmFuZ2VMYWJlbChzdGFydDogc3RyaW5nLCBlbmQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3N0YXJ0fSB0byAke2VuZH1gO1xuICB9XG59XG4iXX0=