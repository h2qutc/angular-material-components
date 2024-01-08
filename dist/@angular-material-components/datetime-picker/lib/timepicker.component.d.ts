import { ChangeDetectorRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { NgxMatDateAdapter } from './core/date-adapter';
import * as i0 from "@angular/core";
export declare class NgxMatTimepickerComponent<D> implements ControlValueAccessor, OnInit, OnChanges {
    _dateAdapter: NgxMatDateAdapter<D>;
    private cd;
    private formBuilder;
    form: FormGroup;
    disabled: boolean;
    showSpinners: boolean;
    stepHour: number;
    stepMinute: number;
    stepSecond: number;
    showSeconds: boolean;
    disableMinute: boolean;
    enableMeridian: boolean;
    defaultTime: number[];
    color: ThemePalette;
    meridian: string;
    /** Hour */
    private get hour();
    private get minute();
    private get second();
    /** Whether or not the form is valid */
    get valid(): boolean;
    private _onChange;
    private _onTouched;
    private _disabled;
    private _model;
    private _destroyed;
    pattern: RegExp;
    constructor(_dateAdapter: NgxMatDateAdapter<D>, cd: ChangeDetectorRef, formBuilder: FormBuilder);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Writes a new value to the element.
     * @param obj
     */
    writeValue(val: D): void;
    /** Registers a callback function that is called when the control's value changes in the UI. */
    registerOnChange(fn: (_: any) => {}): void;
    /**
     * Set the function to be called when the control receives a touch event.
     */
    registerOnTouched(fn: () => {}): void;
    /** Enables or disables the appropriate DOM element */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Format input
     * @param input
     */
    formatInput(input: HTMLInputElement): void;
    /** Toggle meridian */
    toggleMeridian(): void;
    /** Change property of time */
    change(prop: string, up?: boolean): void;
    /** Update controls of form by model */
    private _updateHourMinuteSecond;
    /** Update model */
    private _updateModel;
    /**
     * Get next value by property
     * @param prop
     * @param up
     */
    private _getNextValueByProp;
    /**
     * Set disable states
     */
    private _setDisableStates;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatTimepickerComponent<any>, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatTimepickerComponent<any>, "ngx-mat-timepicker", ["ngxMatTimepicker"], { "disabled": "disabled"; "showSpinners": "showSpinners"; "stepHour": "stepHour"; "stepMinute": "stepMinute"; "stepSecond": "stepSecond"; "showSeconds": "showSeconds"; "disableMinute": "disableMinute"; "enableMeridian": "enableMeridian"; "defaultTime": "defaultTime"; "color": "color"; }, {}, never, never, false, never>;
}
