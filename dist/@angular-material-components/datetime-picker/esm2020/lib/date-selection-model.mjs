import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxMatDateAdapter } from './core/date-adapter';
import * as i0 from "@angular/core";
import * as i1 from "./core/date-adapter";
/** A class representing a range of dates. */
export class NgxDateRange {
    constructor(
    /** The start date of the range. */
    start, 
    /** The end date of the range. */
    end) {
        this.start = start;
        this.end = end;
    }
}
/**
 * A selection model containing a date selection.
 * @docs-private
 */
export class NgxMatDateSelectionModel {
    constructor(
    /** The current selection. */
    selection, _adapter) {
        this.selection = selection;
        this._adapter = _adapter;
        this._selectionChanged = new Subject();
        /** Emits when the selection has changed. */
        this.selectionChanged = this._selectionChanged;
        this.selection = selection;
    }
    /**
     * Updates the current selection in the model.
     * @param value New selection that should be assigned.
     * @param source Object that triggered the selection change.
     */
    updateSelection(value, source) {
        const oldValue = this.selection;
        this.selection = value;
        this._selectionChanged.next({ selection: value, source, oldValue });
    }
    ngOnDestroy() {
        this._selectionChanged.complete();
    }
    _isValidDateInstance(date) {
        return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
    }
}
/** @nocollapse */ NgxMatDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateSelectionModel, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ NgxMatDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined }, { type: i1.NgxMatDateAdapter }]; } });
/**
 * A selection model that contains a single date.
 * @docs-private
 */
export class NgxMatSingleDateSelectionModel extends NgxMatDateSelectionModel {
    constructor(adapter) {
        super(null, adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     */
    add(date) {
        super.updateSelection(date, this);
    }
    /** Checks whether the current selection is valid. */
    isValid() {
        return this.selection != null && this._isValidDateInstance(this.selection);
    }
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     */
    isComplete() {
        return this.selection != null;
    }
    /** Clones the selection model. */
    clone() {
        const clone = new NgxMatSingleDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
/** @nocollapse */ NgxMatSingleDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatSingleDateSelectionModel, deps: [{ token: i1.NgxMatDateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ NgxMatSingleDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatSingleDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatSingleDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgxMatDateAdapter }]; } });
/**
 * A selection model that contains a date range.
 * @docs-private
 */
export class NgxMatRangeDateSelectionModel extends NgxMatDateSelectionModel {
    constructor(adapter) {
        super(new NgxDateRange(null, null), adapter);
    }
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     */
    add(date) {
        let { start, end } = this.selection;
        if (start == null) {
            start = date;
        }
        else if (end == null) {
            end = date;
        }
        else {
            start = date;
            end = null;
        }
        super.updateSelection(new NgxDateRange(start, end), this);
    }
    /** Checks whether the current selection is valid. */
    isValid() {
        const { start, end } = this.selection;
        // Empty ranges are valid.
        if (start == null && end == null) {
            return true;
        }
        // Complete ranges are only valid if both dates are valid and the start is before the end.
        if (start != null && end != null) {
            return (this._isValidDateInstance(start) &&
                this._isValidDateInstance(end) &&
                this._adapter.compareDate(start, end) <= 0);
        }
        // Partial ranges are valid if the start/end is valid.
        return ((start == null || this._isValidDateInstance(start)) &&
            (end == null || this._isValidDateInstance(end)));
    }
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     */
    isComplete() {
        return this.selection.start != null && this.selection.end != null;
    }
    /** Clones the selection model. */
    clone() {
        const clone = new NgxMatRangeDateSelectionModel(this._adapter);
        clone.updateSelection(this.selection, this);
        return clone;
    }
}
/** @nocollapse */ NgxMatRangeDateSelectionModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatRangeDateSelectionModel, deps: [{ token: i1.NgxMatDateAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
/** @nocollapse */ NgxMatRangeDateSelectionModel.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatRangeDateSelectionModel });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatRangeDateSelectionModel, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgxMatDateAdapter }]; } });
/** @docs-private */
export function NGX_MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new NgxMatSingleDateSelectionModel(adapter);
}
/**
 * Used to provide a single selection model to a component.
 * @docs-private
 */
export const NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: NgxMatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), NgxMatDateSelectionModel], NgxMatDateAdapter],
    useFactory: NGX_MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY,
};
/** @docs-private */
export function NGX_MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent, adapter) {
    return parent || new NgxMatRangeDateSelectionModel(adapter);
}
/**
 * Used to provide a range selection model to a component.
 * @docs-private
 */
export const NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
    provide: NgxMatDateSelectionModel,
    deps: [[new Optional(), new SkipSelf(), NgxMatDateSelectionModel], NgxMatDateAdapter],
    useFactory: NGX_MAT_RANGE_DATE_SELECTION_MODEL_FACTORY,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1zZWxlY3Rpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kYXRldGltZS1waWNrZXIvc3JjL2xpYi9kYXRlLXNlbGVjdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQW1CLFVBQVUsRUFBYSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUJBQXFCLENBQUM7OztBQUV4RCw2Q0FBNkM7QUFDN0MsTUFBTSxPQUFPLFlBQVk7SUFRdkI7SUFDRSxtQ0FBbUM7SUFDMUIsS0FBZTtJQUN4QixpQ0FBaUM7SUFDeEIsR0FBYTtRQUZiLFVBQUssR0FBTCxLQUFLLENBQVU7UUFFZixRQUFHLEdBQUgsR0FBRyxDQUFVO0lBQ3BCLENBQUM7Q0FDTjtBQXVCRDs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLHdCQUF3QjtJQU81QztJQUNFLDZCQUE2QjtJQUNwQixTQUFZLEVBQ1gsUUFBOEI7UUFEL0IsY0FBUyxHQUFULFNBQVMsQ0FBRztRQUNYLGFBQVEsR0FBUixRQUFRLENBQXNCO1FBUnpCLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFrQyxDQUFDO1FBRW5GLDRDQUE0QztRQUM1QyxxQkFBZ0IsR0FBK0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBT3BGLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsZUFBZSxDQUFDLEtBQVEsRUFBRSxNQUFlO1FBQ3ZDLE1BQU0sUUFBUSxHQUFJLElBQXlCLENBQUMsU0FBUyxDQUFDO1FBQ3JELElBQXlCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUM3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFD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SUFDckYsVUFBVSxFQUFFLDJDQUEyQztDQUN4RCxDQUFDO0FBRUYsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSwwQ0FBMEMsQ0FDeEQsTUFBK0MsRUFDL0MsT0FBbUM7SUFFbkMsT0FBTyxNQUFNLElBQUksSUFBSSw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkNBQTJDLEdBQW9CO0lBQzFFLE9BQU8sRUFBRSx3QkFBd0I7SUFDakMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLEVBQUUsd0JBQXdCLENBQUMsRUFBRSxpQkFBaUIsQ0FBQztJQUNyRixVQUFVLEVBQUUsMENBQTBDO0NBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHsgRmFjdG9yeVByb3ZpZGVyLCBJbmplY3RhYmxlLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBTa2lwU2VsZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmd4TWF0RGF0ZUFkYXB0ZXIgfSBmcm9tICcuL2NvcmUvZGF0ZS1hZGFwdGVyJztcblxuLyoqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgcmFuZ2Ugb2YgZGF0ZXMuICovXG5leHBvcnQgY2xhc3MgTmd4RGF0ZVJhbmdlPEQ+IHtcbiAgLyoqXG4gICAqIEVuc3VyZXMgdGhhdCBvYmplY3RzIHdpdGggYSBgc3RhcnRgIGFuZCBgZW5kYCBwcm9wZXJ0eSBjYW4ndCBiZSBhc3NpZ25lZCB0byBhIHZhcmlhYmxlIHRoYXRcbiAgICogZXhwZWN0cyBhIGBEYXRlUmFuZ2VgXG4gICAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW51c2VkLXZhcmlhYmxlXG4gIHByaXZhdGUgX2Rpc2FibGVTdHJ1Y3R1cmFsRXF1aXZhbGVuY3k6IG5ldmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgc3RhcnQgZGF0ZSBvZiB0aGUgcmFuZ2UuICovXG4gICAgcmVhZG9ubHkgc3RhcnQ6IEQgfCBudWxsLFxuICAgIC8qKiBUaGUgZW5kIGRhdGUgb2YgdGhlIHJhbmdlLiAqL1xuICAgIHJlYWRvbmx5IGVuZDogRCB8IG51bGwsXG4gICkgeyB9XG59XG5cbi8qKlxuICogQ29uZGl0aW9uYWxseSBwaWNrcyB0aGUgZGF0ZSB0eXBlLCBpZiBhIERhdGVSYW5nZSBpcyBwYXNzZWQgaW4uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCB0eXBlIE5neEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248VD4gPSBUIGV4dGVuZHMgTmd4RGF0ZVJhbmdlPGluZmVyIEQ+ID8gRCA6IE5vbk51bGxhYmxlPFQ+O1xuXG4vKipcbiAqIEV2ZW50IGVtaXR0ZWQgYnkgdGhlIGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdoZW4gaXRzIHNlbGVjdGlvbiBjaGFuZ2VzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5neERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPiB7XG4gIC8qKiBOZXcgdmFsdWUgZm9yIHRoZSBzZWxlY3Rpb24uICovXG4gIHNlbGVjdGlvbjogUztcblxuICAvKiogT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSBjaGFuZ2UuICovXG4gIHNvdXJjZTogdW5rbm93bjtcblxuICAvKiogUHJldmlvdXMgdmFsdWUgKi9cbiAgb2xkVmFsdWU/OiBTO1xufVxuXG4vKipcbiAqIEEgc2VsZWN0aW9uIG1vZGVsIGNvbnRhaW5pbmcgYSBkYXRlIHNlbGVjdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEID0gTmd4RXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPj5cbiAgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHJlYWRvbmx5IF9zZWxlY3Rpb25DaGFuZ2VkID0gbmV3IFN1YmplY3Q8Tmd4RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQuICovXG4gIHNlbGVjdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8Tmd4RGF0ZVNlbGVjdGlvbk1vZGVsQ2hhbmdlPFM+PiA9IHRoaXMuX3NlbGVjdGlvbkNoYW5nZWQ7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgY3VycmVudCBzZWxlY3Rpb24uICovXG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uOiBTLFxuICAgIHByb3RlY3RlZCBfYWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4sXG4gICkge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gc2VsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGluIHRoZSBtb2RlbC5cbiAgICogQHBhcmFtIHZhbHVlIE5ldyBzZWxlY3Rpb24gdGhhdCBzaG91bGQgYmUgYXNzaWduZWQuXG4gICAqIEBwYXJhbSBzb3VyY2UgT2JqZWN0IHRoYXQgdHJpZ2dlcmVkIHRoZSBzZWxlY3Rpb24gY2hhbmdlLlxuICAgKi9cbiAgdXBkYXRlU2VsZWN0aW9uKHZhbHVlOiBTLCBzb3VyY2U6IHVua25vd24pIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9ICh0aGlzIGFzIHsgc2VsZWN0aW9uOiBTIH0pLnNlbGVjdGlvbjtcbiAgICAodGhpcyBhcyB7IHNlbGVjdGlvbjogUyB9KS5zZWxlY3Rpb24gPSB2YWx1ZTtcbiAgICB0aGlzLl9zZWxlY3Rpb25DaGFuZ2VkLm5leHQoeyBzZWxlY3Rpb246IHZhbHVlLCBzb3VyY2UsIG9sZFZhbHVlIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uQ2hhbmdlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkRGF0ZUluc3RhbmNlKGRhdGU6IEQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWRhcHRlci5pc0RhdGVJbnN0YW5jZShkYXRlKSAmJiB0aGlzLl9hZGFwdGVyLmlzVmFsaWQoZGF0ZSk7XG4gIH1cblxuICAvKiogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiAqL1xuICBhYnN0cmFjdCBhZGQoZGF0ZTogRCB8IG51bGwpOiB2b2lkO1xuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgdmFsaWQuICovXG4gIGFic3RyYWN0IGlzVmFsaWQoKTogYm9vbGVhbjtcblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBpc0NvbXBsZXRlKCk6IGJvb2xlYW47XG5cbiAgLyoqIENsb25lcyB0aGUgc2VsZWN0aW9uIG1vZGVsLiAqL1xuICBhYnN0cmFjdCBjbG9uZSgpOiBOZ3hNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD47XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgdGhhdCBjb250YWlucyBhIHNpbmdsZSBkYXRlLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmd4TWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+IGV4dGVuZHMgTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsPEQgfCBudWxsLCBEPiB7XG4gIGNvbnN0cnVjdG9yKGFkYXB0ZXI6IE5neE1hdERhdGVBZGFwdGVyPEQ+KSB7XG4gICAgc3VwZXIobnVsbCwgYWRhcHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRhdGUgdG8gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLiBJbiB0aGUgY2FzZSBvZiBhIHNpbmdsZSBkYXRlIHNlbGVjdGlvbiwgdGhlIGFkZGVkIGRhdGVcbiAgICogc2ltcGx5IG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzIHNlbGVjdGlvblxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKSB7XG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKGRhdGUsIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbCAmJiB0aGlzLl9pc1ZhbGlkRGF0ZUluc3RhbmNlKHRoaXMuc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgY29tcGxldGUuIEluIHRoZSBjYXNlIG9mIGEgc2luZ2xlIGRhdGUgc2VsZWN0aW9uLCB0aGlzXG4gICAqIGlzIHRydWUgaWYgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIG5vdCBudWxsLlxuICAgKi9cbiAgaXNDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24gIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBDbG9uZXMgdGhlIHNlbGVjdGlvbiBtb2RlbC4gKi9cbiAgY2xvbmUoKSB7XG4gICAgY29uc3QgY2xvbmUgPSBuZXcgTmd4TWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+KHRoaXMuX2FkYXB0ZXIpO1xuICAgIGNsb25lLnVwZGF0ZVNlbGVjdGlvbih0aGlzLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG59XG5cbi8qKlxuICogQSBzZWxlY3Rpb24gbW9kZWwgdGhhdCBjb250YWlucyBhIGRhdGUgcmFuZ2UuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ3hNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbDxEPiBleHRlbmRzIE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxOZ3hEYXRlUmFuZ2U8RD4sIEQ+IHtcbiAgY29uc3RydWN0b3IoYWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4pIHtcbiAgICBzdXBlcihuZXcgTmd4RGF0ZVJhbmdlPEQ+KG51bGwsIG51bGwpLCBhZGFwdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZGF0ZSB0byB0aGUgY3VycmVudCBzZWxlY3Rpb24uIEluIHRoZSBjYXNlIG9mIGEgZGF0ZSByYW5nZSBzZWxlY3Rpb24sIHRoZSBhZGRlZCBkYXRlXG4gICAqIGZpbGxzIGluIHRoZSBuZXh0IGBudWxsYCB2YWx1ZSBpbiB0aGUgcmFuZ2UuIElmIGJvdGggdGhlIHN0YXJ0IGFuZCB0aGUgZW5kIGFscmVhZHkgaGF2ZSBhIGRhdGUsXG4gICAqIHRoZSBzZWxlY3Rpb24gaXMgcmVzZXQgc28gdGhhdCB0aGUgZ2l2ZW4gZGF0ZSBpcyB0aGUgbmV3IGBzdGFydGAgYW5kIHRoZSBgZW5kYCBpcyBudWxsLlxuICAgKi9cbiAgYWRkKGRhdGU6IEQgfCBudWxsKTogdm9pZCB7XG4gICAgbGV0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5zZWxlY3Rpb247XG5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgIGVuZCA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gZGF0ZTtcbiAgICAgIGVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgc3VwZXIudXBkYXRlU2VsZWN0aW9uKG5ldyBOZ3hEYXRlUmFuZ2U8RD4oc3RhcnQsIGVuZCksIHRoaXMpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyB2YWxpZC4gKi9cbiAgaXNWYWxpZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHRoaXMuc2VsZWN0aW9uO1xuXG4gICAgLy8gRW1wdHkgcmFuZ2VzIGFyZSB2YWxpZC5cbiAgICBpZiAoc3RhcnQgPT0gbnVsbCAmJiBlbmQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ29tcGxldGUgcmFuZ2VzIGFyZSBvbmx5IHZhbGlkIGlmIGJvdGggZGF0ZXMgYXJlIHZhbGlkIGFuZCB0aGUgc3RhcnQgaXMgYmVmb3JlIHRoZSBlbmQuXG4gICAgaWYgKHN0YXJ0ICE9IG51bGwgJiYgZW5kICE9IG51bGwpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2Uoc3RhcnQpICYmXG4gICAgICAgIHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSAmJlxuICAgICAgICB0aGlzLl9hZGFwdGVyLmNvbXBhcmVEYXRlKHN0YXJ0LCBlbmQpIDw9IDBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUGFydGlhbCByYW5nZXMgYXJlIHZhbGlkIGlmIHRoZSBzdGFydC9lbmQgaXMgdmFsaWQuXG4gICAgcmV0dXJuIChcbiAgICAgIChzdGFydCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2Uoc3RhcnQpKSAmJlxuICAgICAgKGVuZCA9PSBudWxsIHx8IHRoaXMuX2lzVmFsaWREYXRlSW5zdGFuY2UoZW5kKSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyBjb21wbGV0ZS4gSW4gdGhlIGNhc2Ugb2YgYSBkYXRlIHJhbmdlIHNlbGVjdGlvbiwgdGhpc1xuICAgKiBpcyB0cnVlIGlmIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBoYXMgYSBub24tbnVsbCBgc3RhcnRgIGFuZCBgZW5kYC5cbiAgICovXG4gIGlzQ29tcGxldGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uLnN0YXJ0ICE9IG51bGwgJiYgdGhpcy5zZWxlY3Rpb24uZW5kICE9IG51bGw7XG4gIH1cblxuICAvKiogQ2xvbmVzIHRoZSBzZWxlY3Rpb24gbW9kZWwuICovXG4gIGNsb25lKCkge1xuICAgIGNvbnN0IGNsb25lID0gbmV3IE5neE1hdFJhbmdlRGF0ZVNlbGVjdGlvbk1vZGVsPEQ+KHRoaXMuX2FkYXB0ZXIpO1xuICAgIGNsb25lLnVwZGF0ZVNlbGVjdGlvbih0aGlzLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTkdYX01BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfRkFDVE9SWShcbiAgcGFyZW50OiBOZ3hNYXRTaW5nbGVEYXRlU2VsZWN0aW9uTW9kZWw8dW5rbm93bj4sXG4gIGFkYXB0ZXI6IE5neE1hdERhdGVBZGFwdGVyPHVua25vd24+LFxuKSB7XG4gIHJldHVybiBwYXJlbnQgfHwgbmV3IE5neE1hdFNpbmdsZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBzaW5nbGUgc2VsZWN0aW9uIG1vZGVsIHRvIGEgY29tcG9uZW50LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTkdYX01BVF9TSU5HTEVfREFURV9TRUxFQ1RJT05fTU9ERUxfUFJPVklERVI6IEZhY3RvcnlQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBkZXBzOiBbW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsXSwgTmd4TWF0RGF0ZUFkYXB0ZXJdLFxuICB1c2VGYWN0b3J5OiBOR1hfTUFUX1NJTkdMRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZLFxufTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBOR1hfTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkoXG4gIHBhcmVudDogTmd4TWF0U2luZ2xlRGF0ZVNlbGVjdGlvbk1vZGVsPHVua25vd24+LFxuICBhZGFwdGVyOiBOZ3hNYXREYXRlQWRhcHRlcjx1bmtub3duPixcbikge1xuICByZXR1cm4gcGFyZW50IHx8IG5ldyBOZ3hNYXRSYW5nZURhdGVTZWxlY3Rpb25Nb2RlbChhZGFwdGVyKTtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSByYW5nZSBzZWxlY3Rpb24gbW9kZWwgdG8gYSBjb21wb25lbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBOR1hfTUFUX1JBTkdFX0RBVEVfU0VMRUNUSU9OX01PREVMX1BST1ZJREVSOiBGYWN0b3J5UHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgZGVwczogW1tuZXcgT3B0aW9uYWwoKSwgbmV3IFNraXBTZWxmKCksIE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbF0sIE5neE1hdERhdGVBZGFwdGVyXSxcbiAgdXNlRmFjdG9yeTogTkdYX01BVF9SQU5HRV9EQVRFX1NFTEVDVElPTl9NT0RFTF9GQUNUT1JZLFxufTtcbiJdfQ==