import { AnimationEvent } from '@angular/animations';
import { Directionality } from '@angular/cdk/bidi';
import { BooleanInput } from '@angular/cdk/coercion';
import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, InjectionToken, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { CanColor, ThemePalette } from '@angular/material/core';
import { Observable, Subject } from 'rxjs';
import { NgxMatCalendar, NgxMatCalendarView } from './calendar';
import { NgxMatCalendarCellClassFunction, NgxMatCalendarUserEvent } from './calendar-body';
import { NgxMatDateAdapter } from './core/date-adapter';
import { NgxMatDateRangeSelectionStrategy } from './date-range-selection-strategy';
import { NgxDateRange, NgxExtractDateTypeFromSelection, NgxMatDateSelectionModel } from './date-selection-model';
import { NgxDateFilterFn } from './datepicker-input-base';
import { NgxMatDatepickerIntl } from './datepicker-intl';
import * as i0 from "@angular/core";
/** Injection token that determines the scroll handling while the calendar is open. */
export declare const NGX_MAT_DATEPICKER_SCROLL_STRATEGY: InjectionToken<() => ScrollStrategy>;
/** @docs-private */
export declare function NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy;
/** Possible positions for the datepicker dropdown along the X axis. */
export declare type NgxDatepickerDropdownPositionX = 'start' | 'end';
/** Possible positions for the datepicker dropdown along the Y axis. */
export declare type NgxDatepickerDropdownPositionY = 'above' | 'below';
/** @docs-private */
export declare const NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER: {
    provide: InjectionToken<() => ScrollStrategy>;
    deps: (typeof Overlay)[];
    useFactory: typeof NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY;
};
/** @docs-private */
declare const _NgxMatDatepickerContentBase: import("@angular/material/core")._Constructor<CanColor> & import("@angular/material/core")._AbstractConstructor<CanColor> & {
    new (_elementRef: ElementRef): {
        _elementRef: ElementRef;
    };
};
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export declare class NgxMatDatepickerContent<S, D = NgxExtractDateTypeFromSelection<S>> extends _NgxMatDatepickerContentBase implements OnInit, AfterViewInit, OnDestroy, CanColor {
    private _changeDetectorRef;
    private _globalModel;
    private _dateAdapter;
    private _rangeSelectionStrategy;
    private _subscriptions;
    private _model;
    /** Reference to the internal calendar component. */
    _calendar: NgxMatCalendar<D>;
    /** Reference to the datepicker that created the overlay. */
    datepicker: NgxMatDatepickerBase<any, S, D>;
    /** Start of the comparison range. */
    comparisonStart: D | null;
    /** End of the comparison range. */
    comparisonEnd: D | null;
    /** ARIA Accessible name of the `<input matStartDate/>` */
    startDateAccessibleName: string | null;
    /** ARIA Accessible name of the `<input matEndDate/>` */
    endDateAccessibleName: string | null;
    /** Whether the datepicker is above or below the input. */
    _isAbove: boolean;
    /** Current state of the animation. */
    _animationState: 'enter-dropdown' | 'enter-dialog' | 'void';
    /** Emits when an animation has finished. */
    readonly _animationDone: Subject<void>;
    /** Whether there is an in-progress animation. */
    _isAnimating: boolean;
    /** Text for the close button. */
    _closeButtonText: string;
    /** Whether the close button currently has focus. */
    _closeButtonFocused: boolean;
    /** Portal with projected action buttons. */
    _actionsPortal: TemplatePortal | null;
    /** Id of the label for the `role="dialog"` element. */
    _dialogLabelId: string | null;
    get isViewMonth(): boolean;
    _modelTime: D | null;
    constructor(elementRef: ElementRef, _changeDetectorRef: ChangeDetectorRef, _globalModel: NgxMatDateSelectionModel<S, D>, _dateAdapter: NgxMatDateAdapter<D>, _rangeSelectionStrategy: NgxMatDateRangeSelectionStrategy<D>, intl: NgxMatDatepickerIntl);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onTimeChanged(selectedDateWithTime: D | null): void;
    _handleUserSelection(event: NgxMatCalendarUserEvent<D | null>): void;
    private _updateUserSelectionWithCalendarUserEvent;
    _handleUserDragDrop(event: NgxMatCalendarUserEvent<NgxDateRange<D>>): void;
    _startExitAnimation(): void;
    _handleAnimationEvent(event: AnimationEvent): void;
    _getSelected(): D | NgxDateRange<D>;
    /** Applies the current pending selection to the global model. */
    _applyPendingSelection(): void;
    /**
     * Assigns a new portal containing the datepicker actions.
     * @param portal Portal with the actions to be assigned.
     * @param forceRerender Whether a re-render of the portal should be triggered. This isn't
     * necessary if the portal is assigned during initialization, but it may be required if it's
     * added at a later point.
     */
    _assignActions(portal: TemplatePortal<any> | null, forceRerender: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerContent<any, any>, [null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatDatepickerContent<any, any>, "ngx-mat-datepicker-content", ["ngxMatDatepickerContent"], { "color": "color"; }, {}, never, never, false, never>;
}
/** Form control that can be associated with a datepicker. */
export interface NgxMatDatepickerControl<D> {
    getStartValue(): D | null;
    getThemePalette(): ThemePalette;
    min: D | null;
    max: D | null;
    disabled: boolean;
    dateFilter: NgxDateFilterFn<D>;
    getConnectedOverlayOrigin(): ElementRef;
    getOverlayLabelId(): string | null;
    stateChanges: Observable<void>;
}
/** A datepicker that can be attached to a {@link NgxMatDatepickerControl}. */
export interface NgxMatDatepickerPanel<C extends NgxMatDatepickerControl<D>, S, D = NgxExtractDateTypeFromSelection<S>> {
    /** Stream that emits whenever the date picker is closed. */
    closedStream: EventEmitter<void>;
    /** Color palette to use on the datepicker's calendar. */
    color: ThemePalette;
    /** The input element the datepicker is associated with. */
    datepickerInput: C;
    /** Whether the datepicker pop-up should be disabled. */
    disabled: boolean;
    /** The id for the datepicker's calendar. */
    id: string;
    /** Whether the datepicker is open. */
    opened: boolean;
    /** Stream that emits whenever the date picker is opened. */
    openedStream: EventEmitter<void>;
    /** Emits when the datepicker's state changes. */
    stateChanges: Subject<void>;
    /** Opens the datepicker. */
    open(): void;
    /** Register an input with the datepicker. */
    registerInput(input: C): NgxMatDateSelectionModel<S, D>;
}
/** Base class for a datepicker. */
export declare abstract class NgxMatDatepickerBase<C extends NgxMatDatepickerControl<D>, S, D = NgxExtractDateTypeFromSelection<S>> implements NgxMatDatepickerPanel<C, S, D>, OnDestroy, OnChanges {
    private _overlay;
    private _ngZone;
    private _viewContainerRef;
    private _dateAdapter;
    private _dir;
    private _model;
    private _scrollStrategy;
    private _inputStateChanges;
    private _document;
    /** An input indicating the type of the custom header component for the calendar, if set. */
    calendarHeaderComponent: ComponentType<any>;
    /** The date to open the calendar to initially. */
    get startAt(): D | null;
    set startAt(value: D | null);
    private _startAt;
    /** The view that the calendar should start in. */
    startView: 'month' | 'year' | 'multi-year';
    /** Color palette to use on the datepicker's calendar. */
    get color(): ThemePalette;
    set color(value: ThemePalette);
    _color: ThemePalette;
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a dropdown and elements have more padding to allow for bigger touch targets.
     */
    get touchUi(): boolean;
    set touchUi(value: BooleanInput);
    private _touchUi;
    get hideTime(): boolean;
    set hideTime(value: boolean);
    _hideTime: boolean;
    /** Whether the datepicker pop-up should be disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    _disabled: boolean;
    /** Preferred position of the datepicker in the X axis. */
    xPosition: NgxDatepickerDropdownPositionX;
    /** Preferred position of the datepicker in the Y axis. */
    yPosition: NgxDatepickerDropdownPositionY;
    /**
     * Whether to restore focus to the previously-focused element when the calendar is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus(): boolean;
    set restoreFocus(value: BooleanInput);
    private _restoreFocus;
    /**
     * Emits selected year in multiyear view.
     * This doesn't imply a change on the selected date.
     */
    readonly yearSelected: EventEmitter<D>;
    /**
     * Emits selected month in year view.
     * This doesn't imply a change on the selected date.
     */
    readonly monthSelected: EventEmitter<D>;
    /**
     * Emits when the current view changes.
     */
    readonly viewChanged: EventEmitter<NgxMatCalendarView>;
    /** Function that can be used to add custom CSS classes to dates. */
    dateClass: NgxMatCalendarCellClassFunction<D>;
    /** Emits when the datepicker has been opened. */
    readonly openedStream: EventEmitter<void>;
    /** Emits when the datepicker has been closed. */
    readonly closedStream: EventEmitter<void>;
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass(): string | string[];
    set panelClass(value: string | string[]);
    private _panelClass;
    /** Whether the calendar is open. */
    get opened(): boolean;
    set opened(value: BooleanInput);
    private _opened;
    /** Whether the timepicker'spinners is shown. */
    get showSpinners(): boolean;
    set showSpinners(value: boolean);
    _showSpinners: boolean;
    /** Whether the second part is disabled. */
    get showSeconds(): boolean;
    set showSeconds(value: boolean);
    _showSeconds: boolean;
    /** Step hour */
    get stepHour(): number;
    set stepHour(value: number);
    _stepHour: number;
    /** Step minute */
    get stepMinute(): number;
    set stepMinute(value: number);
    _stepMinute: number;
    /** Step second */
    get stepSecond(): number;
    set stepSecond(value: number);
    _stepSecond: number;
    /** Enable meridian */
    get enableMeridian(): boolean;
    set enableMeridian(value: boolean);
    _enableMeridian: boolean;
    /** disable minute */
    get disableMinute(): boolean;
    set disableMinute(value: boolean);
    _disableMinute: boolean;
    /** Step second */
    get defaultTime(): number[];
    set defaultTime(value: number[]);
    _defaultTime: number[];
    /** The id for the datepicker calendar. */
    id: string;
    /** The minimum selectable date. */
    _getMinDate(): D | null;
    /** The maximum selectable date. */
    _getMaxDate(): D | null;
    _getDateFilter(): NgxDateFilterFn<D>;
    /** A reference to the overlay into which we've rendered the calendar. */
    private _overlayRef;
    /** Reference to the component instance rendered in the overlay. */
    private _componentRef;
    /** The element that was focused before the datepicker was opened. */
    private _focusedElementBeforeOpen;
    /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
    private _backdropHarnessClass;
    /** Currently-registered actions portal. */
    private _actionsPortal;
    /** The input element this datepicker is associated with. */
    datepickerInput: C;
    /** Emits when the datepicker's state changes. */
    readonly stateChanges: Subject<void>;
    constructor(_overlay: Overlay, _ngZone: NgZone, _viewContainerRef: ViewContainerRef, scrollStrategy: any, _dateAdapter: NgxMatDateAdapter<D>, _dir: Directionality, _model: NgxMatDateSelectionModel<S, D>);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /** Selects the given date */
    select(date: D): void;
    /** Emits the selected year in multiyear view */
    _selectYear(normalizedYear: D): void;
    /** Emits selected month in year view */
    _selectMonth(normalizedMonth: D): void;
    /** Emits changed view */
    _viewChanged(view: NgxMatCalendarView): void;
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     * @returns Selection model that the input should hook itself up to.
     */
    registerInput(input: C): NgxMatDateSelectionModel<S, D>;
    /**
     * Registers a portal containing action buttons with the datepicker.
     * @param portal Portal to be registered.
     */
    registerActions(portal: TemplatePortal): void;
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal: TemplatePortal): void;
    /** Open the calendar. */
    open(): void;
    /** Close the calendar. */
    close(): void;
    /** Applies the current pending selection on the overlay to the model. */
    _applyPendingSelection(): void;
    /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
    protected _forwardContentValues(instance: NgxMatDatepickerContent<S, D>): void;
    /** Opens the overlay with the calendar. */
    private _openOverlay;
    /** Destroys the current overlay. */
    private _destroyOverlay;
    /** Gets a position strategy that will open the calendar as a dropdown. */
    private _getDialogStrategy;
    /** Gets a position strategy that will open the calendar as a dropdown. */
    private _getDropdownStrategy;
    /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
    private _setConnectedPositions;
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    private _getCloseStream;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerBase<any, any, any>, [null, null, null, null, { optional: true; }, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDatepickerBase<any, any, any>, never, never, { "calendarHeaderComponent": "calendarHeaderComponent"; "startAt": "startAt"; "startView": "startView"; "color": "color"; "touchUi": "touchUi"; "hideTime": "hideTime"; "disabled": "disabled"; "xPosition": "xPosition"; "yPosition": "yPosition"; "restoreFocus": "restoreFocus"; "dateClass": "dateClass"; "panelClass": "panelClass"; "opened": "opened"; "showSpinners": "showSpinners"; "showSeconds": "showSeconds"; "stepHour": "stepHour"; "stepMinute": "stepMinute"; "stepSecond": "stepSecond"; "enableMeridian": "enableMeridian"; "disableMinute": "disableMinute"; "defaultTime": "defaultTime"; }, { "yearSelected": "yearSelected"; "monthSelected": "monthSelected"; "viewChanged": "viewChanged"; "openedStream": "opened"; "closedStream": "closed"; }, never, never, false, never>;
}
export {};
