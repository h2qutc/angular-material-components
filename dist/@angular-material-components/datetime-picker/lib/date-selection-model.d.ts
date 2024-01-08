import { FactoryProvider, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxMatDateAdapter } from './core/date-adapter';
import * as i0 from "@angular/core";
/** A class representing a range of dates. */
export declare class NgxDateRange<D> {
    /** The start date of the range. */
    readonly start: D | null;
    /** The end date of the range. */
    readonly end: D | null;
    /**
     * Ensures that objects with a `start` and `end` property can't be assigned to a variable that
     * expects a `DateRange`
     */
    private _disableStructuralEquivalency;
    constructor(
    /** The start date of the range. */
    start: D | null, 
    /** The end date of the range. */
    end: D | null);
}
/**
 * Conditionally picks the date type, if a DateRange is passed in.
 * @docs-private
 */
export declare type NgxExtractDateTypeFromSelection<T> = T extends NgxDateRange<infer D> ? D : NonNullable<T>;
/**
 * Event emitted by the date selection model when its selection changes.
 * @docs-private
 */
export interface NgxDateSelectionModelChange<S> {
    /** New value for the selection. */
    selection: S;
    /** Object that triggered the change. */
    source: unknown;
    /** Previous value */
    oldValue?: S;
}
/**
 * A selection model containing a date selection.
 * @docs-private
 */
export declare abstract class NgxMatDateSelectionModel<S, D = NgxExtractDateTypeFromSelection<S>> implements OnDestroy {
    /** The current selection. */
    readonly selection: S;
    protected _adapter: NgxMatDateAdapter<D>;
    private readonly _selectionChanged;
    /** Emits when the selection has changed. */
    selectionChanged: Observable<NgxDateSelectionModelChange<S>>;
    protected constructor(
    /** The current selection. */
    selection: S, _adapter: NgxMatDateAdapter<D>);
    /**
     * Updates the current selection in the model.
     * @param value New selection that should be assigned.
     * @param source Object that triggered the selection change.
     */
    updateSelection(value: S, source: unknown): void;
    ngOnDestroy(): void;
    protected _isValidDateInstance(date: D): boolean;
    /** Adds a date to the current selection. */
    abstract add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    abstract isValid(): boolean;
    /** Checks whether the current selection is complete. */
    abstract isComplete(): boolean;
    /** Clones the selection model. */
    abstract clone(): NgxMatDateSelectionModel<S, D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDateSelectionModel<any, any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxMatDateSelectionModel<any, any>>;
}
/**
 * A selection model that contains a single date.
 * @docs-private
 */
export declare class NgxMatSingleDateSelectionModel<D> extends NgxMatDateSelectionModel<D | null, D> {
    constructor(adapter: NgxMatDateAdapter<D>);
    /**
     * Adds a date to the current selection. In the case of a single date selection, the added date
     * simply overwrites the previous selection
     */
    add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    isValid(): boolean;
    /**
     * Checks whether the current selection is complete. In the case of a single date selection, this
     * is true if the current selection is not null.
     */
    isComplete(): boolean;
    /** Clones the selection model. */
    clone(): NgxMatSingleDateSelectionModel<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatSingleDateSelectionModel<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxMatSingleDateSelectionModel<any>>;
}
/**
 * A selection model that contains a date range.
 * @docs-private
 */
export declare class NgxMatRangeDateSelectionModel<D> extends NgxMatDateSelectionModel<NgxDateRange<D>, D> {
    constructor(adapter: NgxMatDateAdapter<D>);
    /**
     * Adds a date to the current selection. In the case of a date range selection, the added date
     * fills in the next `null` value in the range. If both the start and the end already have a date,
     * the selection is reset so that the given date is the new `start` and the `end` is null.
     */
    add(date: D | null): void;
    /** Checks whether the current selection is valid. */
    isValid(): boolean;
    /**
     * Checks whether the current selection is complete. In the case of a date range selection, this
     * is true if the current selection has a non-null `start` and `end`.
     */
    isComplete(): boolean;
    /** Clones the selection model. */
    clone(): NgxMatRangeDateSelectionModel<D>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatRangeDateSelectionModel<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxMatRangeDateSelectionModel<any>>;
}
/** @docs-private */
export declare function NGX_MAT_SINGLE_DATE_SELECTION_MODEL_FACTORY(parent: NgxMatSingleDateSelectionModel<unknown>, adapter: NgxMatDateAdapter<unknown>): NgxMatSingleDateSelectionModel<unknown>;
/**
 * Used to provide a single selection model to a component.
 * @docs-private
 */
export declare const NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider;
/** @docs-private */
export declare function NGX_MAT_RANGE_DATE_SELECTION_MODEL_FACTORY(parent: NgxMatSingleDateSelectionModel<unknown>, adapter: NgxMatDateAdapter<unknown>): NgxMatSingleDateSelectionModel<unknown> | NgxMatRangeDateSelectionModel<unknown>;
/**
 * Used to provide a range selection model to a component.
 * @docs-private
 */
export declare const NGX_MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER: FactoryProvider;
