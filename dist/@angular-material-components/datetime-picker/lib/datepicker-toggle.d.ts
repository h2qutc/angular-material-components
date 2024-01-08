import { BooleanInput } from '@angular/cdk/coercion';
import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgxMatDatepickerControl, NgxMatDatepickerPanel } from './datepicker-base';
import { NgxMatDatepickerIntl } from './datepicker-intl';
import * as i0 from "@angular/core";
/** Can be used to override the icon of a `matDatepickerToggle`. */
export declare class NgxMatDatepickerToggleIcon {
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerToggleIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgxMatDatepickerToggleIcon, "[ngxMatDatepickerToggleIcon]", never, {}, {}, never, never, false, never>;
}
export declare class NgxMatDatepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
    _intl: NgxMatDatepickerIntl;
    private _changeDetectorRef;
    private _stateChanges;
    /** Datepicker instance that the button will toggle. */
    datepicker: NgxMatDatepickerPanel<NgxMatDatepickerControl<any>, D>;
    /** Tabindex for the toggle. */
    tabIndex: number | null;
    /** Screen-reader label for the button. */
    ariaLabel: string;
    /** Whether the toggle button is disabled. */
    get disabled(): boolean;
    set disabled(value: BooleanInput);
    private _disabled;
    /** Whether ripples on the toggle should be disabled. */
    disableRipple: boolean;
    /** Custom icon set by the consumer. */
    _customIcon: NgxMatDatepickerToggleIcon;
    /** Underlying button element. */
    _button: MatButton;
    constructor(_intl: NgxMatDatepickerIntl, _changeDetectorRef: ChangeDetectorRef, defaultTabIndex: string);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngAfterContentInit(): void;
    _open(event: Event): void;
    private _watchStateChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxMatDatepickerToggle<any>, [null, null, { attribute: "tabindex"; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxMatDatepickerToggle<any>, "ngx-mat-datepicker-toggle", ["ngxMatDatepickerToggle"], { "datepicker": "for"; "tabIndex": "tabIndex"; "ariaLabel": "aria-label"; "disabled": "disabled"; "disableRipple": "disableRipple"; }, {}, ["_customIcon"], ["[ngxMatDatepickerToggleIcon]"], false, never>;
}
