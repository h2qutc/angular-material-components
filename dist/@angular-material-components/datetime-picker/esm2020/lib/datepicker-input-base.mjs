import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { Directive, EventEmitter, Inject, Input, Optional, Output, } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NGX_MAT_DATE_FORMATS } from './core/date-formats';
import { createMissingDateImplError } from './datepicker-errors';
import * as i0 from "@angular/core";
import * as i1 from "./core/date-adapter";
/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use MatDatepickerInputEvent instead.
 */
export class NgxMatDatepickerInputEvent {
    constructor(
    /** Reference to the datepicker input component that emitted the event. */
    target, 
    /** Reference to the native input element associated with the datepicker input. */
    targetElement) {
        this.target = target;
        this.targetElement = targetElement;
        this.value = this.target.value;
    }
}
/** Base class for datepicker inputs. */
export class NgxMatDatepickerInputBase {
    constructor(_elementRef, _dateAdapter, _dateFormats) {
        this._elementRef = _elementRef;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Emits when a `change` event is fired on this `<input>`. */
        this.dateChange = new EventEmitter();
        /** Emits when an `input` event is fired on this `<input>`. */
        this.dateInput = new EventEmitter();
        /** Emits when the internal state has changed */
        this.stateChanges = new Subject();
        this._onTouched = () => { };
        this._validatorOnChange = () => { };
        this._cvaOnChange = () => { };
        this._valueChangesSubscription = Subscription.EMPTY;
        this._localeSubscription = Subscription.EMPTY;
        /** The form control validator for whether the input parses. */
        this._parseValidator = () => {
            return this._lastValueValid
                ? null
                : { 'matDatepickerParse': { 'text': this._elementRef.nativeElement.value } };
        };
        /** The form control validator for the date filter. */
        this._filterValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            return !controlValue || this._matchesFilter(controlValue)
                ? null
                : { 'matDatepickerFilter': true };
        };
        /** The form control validator for the min date. */
        this._minValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const min = this._getMinDate();
            return !min || !controlValue || this._dateAdapter.compareDateWithTime(min, controlValue) <= 0
                ? null
                : { 'matDatetimePickerMin': { 'min': min, 'actual': controlValue } };
        };
        /** The form control validator for the max date. */
        this._maxValidator = (control) => {
            const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
            const max = this._getMaxDate();
            return !max || !controlValue || this._dateAdapter.compareDateWithTime(max, controlValue) >= 0
                ? null
                : { 'matDatetimePickerMax': { 'max': max, 'actual': controlValue } };
        };
        /** Whether the last value set on the input was valid. */
        this._lastValueValid = false;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('NgxMatDateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('NGX_MAT_DATE_FORMATS');
        }
        // Update the displayed date when the locale changes.
        this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
            this._assignValueProgrammatically(this.value);
        });
    }
    /** The value of the input. */
    get value() {
        return this._model ? this._getValueFromModel(this._model.selection) : this._pendingValue;
    }
    set value(value) {
        this._assignValueProgrammatically(value);
    }
    /** Whether the datepicker-input is disabled. */
    get disabled() {
        return !!this._disabled || this._parentDisabled();
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        const element = this._elementRef.nativeElement;
        if (this._disabled !== newValue) {
            this._disabled = newValue;
            this.stateChanges.next(undefined);
        }
        // We need to null check the `blur` method, because it's undefined during SSR.
        // In Ivy static bindings are invoked earlier, before the element is attached to the DOM.
        // This can cause an error to be thrown in some browsers (IE/Edge) which assert that the
        // element has been inserted.
        if (newValue && this._isInitialized && element.blur) {
            // Normally, native input elements automatically blur if they turn disabled. This behavior
            // is problematic, because it would mean that it triggers another change detection cycle,
            // which then causes a changed after checked error if the input element was focused before.
            element.blur();
        }
    }
    /** Gets the base validator functions. */
    _getValidators() {
        return [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator];
    }
    /** Registers a date selection model with the input. */
    _registerModel(model) {
        this._model = model;
        this._valueChangesSubscription.unsubscribe();
        if (this._pendingValue) {
            this._assignValue(this._pendingValue);
        }
        this._valueChangesSubscription = this._model.selectionChanged.subscribe(event => {
            if (this._shouldHandleChangeEvent(event)) {
                const value = this._getValueFromModel(event.selection);
                this._lastValueValid = this._isValidValue(value);
                this._cvaOnChange(value);
                this._onTouched();
                this._formatValue(value);
                this.dateInput.emit(new NgxMatDatepickerInputEvent(this, this._elementRef.nativeElement));
                this.dateChange.emit(new NgxMatDatepickerInputEvent(this, this._elementRef.nativeElement));
            }
        });
    }
    ngAfterViewInit() {
        this._isInitialized = true;
    }
    ngOnChanges(changes) {
        if (dateInputsHaveChanged(changes, this._dateAdapter)) {
            this.stateChanges.next(undefined);
        }
    }
    ngOnDestroy() {
        this._valueChangesSubscription.unsubscribe();
        this._localeSubscription.unsubscribe();
        this.stateChanges.complete();
    }
    /** @docs-private */
    registerOnValidatorChange(fn) {
        this._validatorOnChange = fn;
    }
    /** @docs-private */
    validate(c) {
        return this._validator ? this._validator(c) : null;
    }
    // Implemented as part of ControlValueAccessor.
    writeValue(value) {
        this._assignValueProgrammatically(value);
    }
    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn) {
        this._cvaOnChange = fn;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    _onKeydown(event) {
        const ctrlShiftMetaModifiers = ['ctrlKey', 'shiftKey', 'metaKey'];
        const isAltDownArrow = hasModifierKey(event, 'altKey') &&
            event.keyCode === DOWN_ARROW &&
            ctrlShiftMetaModifiers.every((modifier) => !hasModifierKey(event, modifier));
        if (isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
            this._openPopup();
            event.preventDefault();
        }
    }
    _onInput(value) {
        const lastValueWasValid = this._lastValueValid;
        let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
        this._lastValueValid = this._isValidValue(date);
        date = this._dateAdapter.getValidDateOrNull(date);
        const isSameTime = this._dateAdapter.isSameTime(date, this.value);
        const isSameDate = this._dateAdapter.sameDate(date, this.value);
        const isSame = isSameDate && isSameTime;
        const hasChanged = !isSame;
        // We need to fire the CVA change event for all
        // nulls, otherwise the validators won't run.
        if (!date || hasChanged) {
            this._cvaOnChange(date);
        }
        else {
            // Call the CVA change handler for invalid values
            // since this is what marks the control as dirty.
            if (value && !this.value) {
                this._cvaOnChange(date);
            }
            if (lastValueWasValid !== this._lastValueValid) {
                this._validatorOnChange();
            }
        }
        if (hasChanged) {
            this._assignValue(date);
            this.dateInput.emit(new NgxMatDatepickerInputEvent(this, this._elementRef.nativeElement));
        }
    }
    _onChange() {
        this.dateChange.emit(new NgxMatDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
    /** Handles blur events on the input. */
    _onBlur() {
        // Reformat the input only if we have a valid value.
        if (this.value) {
            this._formatValue(this.value);
        }
        this._onTouched();
    }
    /** Formats a value and sets it on the input element. */
    _formatValue(value) {
        this._elementRef.nativeElement.value =
            value != null ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
    }
    /** Assigns a value to the model. */
    _assignValue(value) {
        // We may get some incoming values before the model was
        // assigned. Save the value so that we can assign it later.
        if (this._model) {
            this._assignValueToModel(value);
            this._pendingValue = null;
        }
        else {
            this._pendingValue = value;
        }
    }
    /** Whether a value is considered valid. */
    _isValidValue(value) {
        return !value || this._dateAdapter.isValid(value);
    }
    /**
     * Checks whether a parent control is disabled. This is in place so that it can be overridden
     * by inputs extending this one which can be placed inside of a group that can be disabled.
     */
    _parentDisabled() {
        return false;
    }
    /** Programmatically assigns a value to the input. */
    _assignValueProgrammatically(value) {
        value = this._dateAdapter.deserialize(value);
        this._lastValueValid = this._isValidValue(value);
        value = this._dateAdapter.getValidDateOrNull(value);
        this._assignValue(value);
        this._formatValue(value);
    }
    /** Gets whether a value matches the current date filter. */
    _matchesFilter(value) {
        const filter = this._getDateFilter();
        return !filter || filter(value);
    }
}
/** @nocollapse */ NgxMatDatepickerInputBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerInputBase, deps: [{ token: i0.ElementRef }, { token: i1.NgxMatDateAdapter, optional: true }, { token: NGX_MAT_DATE_FORMATS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
/** @nocollapse */ NgxMatDatepickerInputBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.2", type: NgxMatDatepickerInputBase, inputs: { value: "value", disabled: "disabled" }, outputs: { dateChange: "dateChange", dateInput: "dateInput" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.2", ngImport: i0, type: NgxMatDatepickerInputBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgxMatDateAdapter, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NGX_MAT_DATE_FORMATS]
                }] }]; }, propDecorators: { value: [{
                type: Input
            }], disabled: [{
                type: Input
            }], dateChange: [{
                type: Output
            }], dateInput: [{
                type: Output
            }] } });
/**
 * Checks whether the `SimpleChanges` object from an `ngOnChanges`
 * callback has any changes, accounting for date objects.
 */
export function dateInputsHaveChanged(changes, adapter) {
    const keys = Object.keys(changes);
    for (let key of keys) {
        const { previousValue, currentValue } = changes[key];
        if (adapter.isDateInstance(previousValue) && adapter.isDateInstance(currentValue)) {
            if (!adapter.sameDate(previousValue, currentValue)) {
                return true;
            }
        }
        else {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZGF0ZXRpbWUtcGlja2VyL3NyYy9saWIvZGF0ZXBpY2tlci1pbnB1dC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBZ0IscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25FLE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQVN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQXFCLE1BQU0scUJBQXFCLENBQUM7QUFNOUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scUJBQXFCLENBQUM7OztBQUVqRTs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLDBCQUEwQjtJQUlyQztJQUNFLDBFQUEwRTtJQUNuRSxNQUF1QztJQUM5QyxrRkFBa0Y7SUFDM0UsYUFBMEI7UUFGMUIsV0FBTSxHQUFOLE1BQU0sQ0FBaUM7UUFFdkMsa0JBQWEsR0FBYixhQUFhLENBQWE7UUFFakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFtQkQsd0NBQXdDO0FBRXhDLE1BQU0sT0FBZ0IseUJBQXlCO0lBa0s3QyxZQUNZLFdBQXlDLEVBQ2hDLFlBQWtDLEVBQ0gsWUFBK0I7UUFGdkUsZ0JBQVcsR0FBWCxXQUFXLENBQThCO1FBQ2hDLGlCQUFZLEdBQVosWUFBWSxDQUFzQjtRQUNILGlCQUFZLEdBQVosWUFBWSxDQUFtQjtRQTNIbkYsOERBQThEO1FB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QUFDLEVBQUU7WUFDakYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxFQUFFO2dCQUNsRCxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgeyBMaXN0S2V5TWFuYWdlck1vZGlmaWVyS2V5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRE9XTl9BUlJPVywgaGFzTW9kaWZpZXJLZXkgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvcixcbiAgVmFsaWRhdG9yRm4sXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ3hNYXREYXRlQWRhcHRlciB9IGZyb20gJy4vY29yZS9kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgTkdYX01BVF9EQVRFX0ZPUk1BVFMsIE5neE1hdERhdGVGb3JtYXRzIH0gZnJvbSAnLi9jb3JlL2RhdGUtZm9ybWF0cyc7XG5pbXBvcnQge1xuICBOZ3hEYXRlU2VsZWN0aW9uTW9kZWxDaGFuZ2UsXG4gIE5neEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sXG4gIE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbn0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQgeyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvciB9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuXG4vKipcbiAqIEFuIGV2ZW50IHVzZWQgZm9yIGRhdGVwaWNrZXIgaW5wdXQgYW5kIGNoYW5nZSBldmVudHMuIFdlIGRvbid0IGFsd2F5cyBoYXZlIGFjY2VzcyB0byBhIG5hdGl2ZVxuICogaW5wdXQgb3IgY2hhbmdlIGV2ZW50IGJlY2F1c2UgdGhlIGV2ZW50IG1heSBoYXZlIGJlZW4gdHJpZ2dlcmVkIGJ5IHRoZSB1c2VyIGNsaWNraW5nIG9uIHRoZVxuICogY2FsZW5kYXIgcG9wdXAuIEZvciBjb25zaXN0ZW5jeSwgd2UgYWx3YXlzIHVzZSBNYXREYXRlcGlja2VySW5wdXRFdmVudCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgTmd4TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RCwgUyA9IHVua25vd24+IHtcbiAgLyoqIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB0YXJnZXQgZGF0ZXBpY2tlciBpbnB1dC4gKi9cbiAgdmFsdWU6IEQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGRhdGVwaWNrZXIgaW5wdXQgY29tcG9uZW50IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHRhcmdldDogTmd4TWF0RGF0ZXBpY2tlcklucHV0QmFzZTxTLCBEPixcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBuYXRpdmUgaW5wdXQgZWxlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVwaWNrZXIgaW5wdXQuICovXG4gICAgcHVibGljIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICApIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy50YXJnZXQudmFsdWU7XG4gIH1cbn1cblxuLyoqIEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gZmlsdGVyIG91dCBkYXRlcyBmcm9tIGEgY2FsZW5kYXIuICovXG5leHBvcnQgdHlwZSBOZ3hEYXRlRmlsdGVyRm48RD4gPSAoZGF0ZTogRCB8IG51bGwpID0+IGJvb2xlYW47XG5cbi8qKlxuICogUGFydGlhbCByZXByZXNlbnRhdGlvbiBvZiBgTWF0Rm9ybUZpZWxkYCB0aGF0IGlzIHVzZWQgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5XG4gKiBiZXR3ZWVuIHRoZSBsZWdhY3kgYW5kIG5vbi1sZWdhY3kgdmFyaWFudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgX05neE1hdEZvcm1GaWVsZFBhcnRpYWwge1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIGdldExhYmVsSWQoKTogc3RyaW5nIHwgbnVsbDtcbiAgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbiAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gIF9zaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW47XG4gIF9oYXNGbG9hdGluZ0xhYmVsKCk6IGJvb2xlYW47XG4gIF9sYWJlbElkOiBzdHJpbmc7XG59XG5cbi8qKiBCYXNlIGNsYXNzIGZvciBkYXRlcGlja2VyIGlucHV0cy4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5neE1hdERhdGVwaWNrZXJJbnB1dEJhc2U8UywgRCA9IE5neEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBWYWxpZGF0b3Ige1xuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkOiBib29sZWFuO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGlucHV0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbCA/IHRoaXMuX2dldFZhbHVlRnJvbU1vZGVsKHRoaXMuX21vZGVsLnNlbGVjdGlvbikgOiB0aGlzLl9wZW5kaW5nVmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9hc3NpZ25WYWx1ZVByb2dyYW1tYXRpY2FsbHkodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfbW9kZWw6IE5neE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlci1pbnB1dCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX2Rpc2FibGVkIHx8IHRoaXMuX3BhcmVudERpc2FibGVkKCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICh0aGlzLl9kaXNhYmxlZCAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBudWxsIGNoZWNrIHRoZSBgYmx1cmAgbWV0aG9kLCBiZWNhdXNlIGl0J3MgdW5kZWZpbmVkIGR1cmluZyBTU1IuXG4gICAgLy8gSW4gSXZ5IHN0YXRpYyBiaW5kaW5ncyBhcmUgaW52b2tlZCBlYXJsaWVyLCBiZWZvcmUgdGhlIGVsZW1lbnQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cbiAgICAvLyBUaGlzIGNhbiBjYXVzZSBhbiBlcnJvciB0byBiZSB0aHJvd24gaW4gc29tZSBicm93c2VycyAoSUUvRWRnZSkgd2hpY2ggYXNzZXJ0IHRoYXQgdGhlXG4gICAgLy8gZWxlbWVudCBoYXMgYmVlbiBpbnNlcnRlZC5cbiAgICBpZiAobmV3VmFsdWUgJiYgdGhpcy5faXNJbml0aWFsaXplZCAmJiBlbGVtZW50LmJsdXIpIHtcbiAgICAgIC8vIE5vcm1hbGx5LCBuYXRpdmUgaW5wdXQgZWxlbWVudHMgYXV0b21hdGljYWxseSBibHVyIGlmIHRoZXkgdHVybiBkaXNhYmxlZC4gVGhpcyBiZWhhdmlvclxuICAgICAgLy8gaXMgcHJvYmxlbWF0aWMsIGJlY2F1c2UgaXQgd291bGQgbWVhbiB0aGF0IGl0IHRyaWdnZXJzIGFub3RoZXIgY2hhbmdlIGRldGVjdGlvbiBjeWNsZSxcbiAgICAgIC8vIHdoaWNoIHRoZW4gY2F1c2VzIGEgY2hhbmdlZCBhZnRlciBjaGVja2VkIGVycm9yIGlmIHRoZSBpbnB1dCBlbGVtZW50IHdhcyBmb2N1c2VkIGJlZm9yZS5cbiAgICAgIGVsZW1lbnQuYmx1cigpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogRW1pdHMgd2hlbiBhIGBjaGFuZ2VgIGV2ZW50IGlzIGZpcmVkIG9uIHRoaXMgYDxpbnB1dD5gLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE5neE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQsIFM+PiA9IG5ldyBFdmVudEVtaXR0ZXI8XG4gICAgTmd4TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8RCwgUz5cbiAgPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGBpbnB1dGAgZXZlbnQgaXMgZmlyZWQgb24gdGhpcyBgPGlucHV0PmAuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkYXRlSW5wdXQ6IEV2ZW50RW1pdHRlcjxOZ3hNYXREYXRlcGlja2VySW5wdXRFdmVudDxELCBTPj4gPSBuZXcgRXZlbnRFbWl0dGVyPFxuICAgIE5neE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PEQsIFM+XG4gID4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgaW50ZXJuYWwgc3RhdGUgaGFzIGNoYW5nZWQgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBfb25Ub3VjaGVkID0gKCkgPT4geyB9O1xuICBfdmFsaWRhdG9yT25DaGFuZ2UgPSAoKSA9PiB7IH07XG5cbiAgcHJpdmF0ZSBfY3ZhT25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4geyB9O1xuICBwcml2YXRlIF92YWx1ZUNoYW5nZXNTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIHByaXZhdGUgX2xvY2FsZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogU2luY2UgdGhlIHZhbHVlIGlzIGtlcHQgb24gdGhlIG1vZGVsIHdoaWNoIGlzIGFzc2lnbmVkIGluIGFuIElucHV0LFxuICAgKiB3ZSBtaWdodCBnZXQgYSB2YWx1ZSBiZWZvcmUgd2UgaGF2ZSBhIG1vZGVsLiBUaGlzIHByb3BlcnR5IGtlZXBzIHRyYWNrXG4gICAqIG9mIHRoZSB2YWx1ZSB1bnRpbCB3ZSBoYXZlIHNvbWV3aGVyZSB0byBhc3NpZ24gaXQuXG4gICAqL1xuICBwcml2YXRlIF9wZW5kaW5nVmFsdWU6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3Igd2hldGhlciB0aGUgaW5wdXQgcGFyc2VzLiAqL1xuICBwcml2YXRlIF9wYXJzZVZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIHJldHVybiB0aGlzLl9sYXN0VmFsdWVWYWxpZFxuICAgICAgPyBudWxsXG4gICAgICA6IHsgJ21hdERhdGVwaWNrZXJQYXJzZSc6IHsgJ3RleHQnOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgfSB9O1xuICB9O1xuXG4gIC8qKiBUaGUgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhlIGRhdGUgZmlsdGVyLiAqL1xuICBwcml2YXRlIF9maWx0ZXJWYWxpZGF0b3I6IFZhbGlkYXRvckZuID0gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICBjb25zdCBjb250cm9sVmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoXG4gICAgICB0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZShjb250cm9sLnZhbHVlKSxcbiAgICApO1xuICAgIHJldHVybiAhY29udHJvbFZhbHVlIHx8IHRoaXMuX21hdGNoZXNGaWx0ZXIoY29udHJvbFZhbHVlKVxuICAgICAgPyBudWxsXG4gICAgICA6IHsgJ21hdERhdGVwaWNrZXJGaWx0ZXInOiB0cnVlIH07XG4gIH07XG5cbiAgLyoqIFRoZSBmb3JtIGNvbnRyb2wgdmFsaWRhdG9yIGZvciB0aGUgbWluIGRhdGUuICovXG4gIHByaXZhdGUgX21pblZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xWYWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbChcbiAgICAgIHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKGNvbnRyb2wudmFsdWUpLFxuICAgICk7XG4gICAgY29uc3QgbWluID0gdGhpcy5fZ2V0TWluRGF0ZSgpO1xuICAgIHJldHVybiAhbWluIHx8ICFjb250cm9sVmFsdWUgfHwgdGhpcy5fZGF0ZUFkYXB0ZXIuY29tcGFyZURhdGVXaXRoVGltZShtaW4sIGNvbnRyb2xWYWx1ZSkgPD0gMFxuICAgICAgPyBudWxsXG4gICAgICA6IHsgJ21hdERhdGV0aW1lUGlja2VyTWluJzogeyAnbWluJzogbWluLCAnYWN0dWFsJzogY29udHJvbFZhbHVlIH0gfTtcbiAgfTtcblxuICAvKiogVGhlIGZvcm0gY29udHJvbCB2YWxpZGF0b3IgZm9yIHRoZSBtYXggZGF0ZS4gKi9cbiAgcHJpdmF0ZSBfbWF4VmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgY29udHJvbFZhbHVlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuZ2V0VmFsaWREYXRlT3JOdWxsKFxuICAgICAgdGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUoY29udHJvbC52YWx1ZSksXG4gICAgKTtcbiAgICBjb25zdCBtYXggPSB0aGlzLl9nZXRNYXhEYXRlKCk7XG4gICAgcmV0dXJuICFtYXggfHwgIWNvbnRyb2xWYWx1ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5jb21wYXJlRGF0ZVdpdGhUaW1lKG1heCwgY29udHJvbFZhbHVlKSA+PSAwXG4gICAgICA/IG51bGxcbiAgICAgIDogeyAnbWF0RGF0ZXRpbWVQaWNrZXJNYXgnOiB7ICdtYXgnOiBtYXgsICdhY3R1YWwnOiBjb250cm9sVmFsdWUgfSB9O1xuICB9O1xuXG4gIC8qKiBHZXRzIHRoZSBiYXNlIHZhbGlkYXRvciBmdW5jdGlvbnMuICovXG4gIHByb3RlY3RlZCBfZ2V0VmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICByZXR1cm4gW3RoaXMuX3BhcnNlVmFsaWRhdG9yLCB0aGlzLl9taW5WYWxpZGF0b3IsIHRoaXMuX21heFZhbGlkYXRvciwgdGhpcy5fZmlsdGVyVmFsaWRhdG9yXTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIGRhdGUgZm9yIHRoZSBpbnB1dC4gVXNlZCBmb3IgdmFsaWRhdGlvbi4gKi9cbiAgYWJzdHJhY3QgX2dldE1pbkRhdGUoKTogRCB8IG51bGw7XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gZGF0ZSBmb3IgdGhlIGlucHV0LiBVc2VkIGZvciB2YWxpZGF0aW9uLiAqL1xuICBhYnN0cmFjdCBfZ2V0TWF4RGF0ZSgpOiBEIHwgbnVsbDtcblxuICAvKiogR2V0cyB0aGUgZGF0ZSBmaWx0ZXIgZnVuY3Rpb24uIFVzZWQgZm9yIHZhbGlkYXRpb24uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0RGF0ZUZpbHRlcigpOiBOZ3hEYXRlRmlsdGVyRm48RD4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFJlZ2lzdGVycyBhIGRhdGUgc2VsZWN0aW9uIG1vZGVsIHdpdGggdGhlIGlucHV0LiAqL1xuICBfcmVnaXN0ZXJNb2RlbChtb2RlbDogTmd4TWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+KTogdm9pZCB7XG4gICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLl92YWx1ZUNoYW5nZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgIGlmICh0aGlzLl9wZW5kaW5nVmFsdWUpIHtcbiAgICAgIHRoaXMuX2Fzc2lnblZhbHVlKHRoaXMuX3BlbmRpbmdWYWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWVDaGFuZ2VzU3Vic2NyaXB0aW9uID0gdGhpcy5fbW9kZWwuc2VsZWN0aW9uQ2hhbmdlZC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKHRoaXMuX3Nob3VsZEhhbmRsZUNoYW5nZUV2ZW50KGV2ZW50KSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX2dldFZhbHVlRnJvbU1vZGVsKGV2ZW50LnNlbGVjdGlvbik7XG4gICAgICAgIHRoaXMuX2xhc3RWYWx1ZVZhbGlkID0gdGhpcy5faXNWYWxpZFZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fY3ZhT25DaGFuZ2UodmFsdWUpO1xuICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgICAgdGhpcy5fZm9ybWF0VmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLmRhdGVJbnB1dC5lbWl0KG5ldyBOZ3hNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQobmV3IE5neE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50KHRoaXMsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBwb3B1cCBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX29wZW5Qb3B1cCgpOiB2b2lkO1xuXG4gIC8qKiBBc3NpZ25zIGEgdmFsdWUgdG8gdGhlIGlucHV0J3MgbW9kZWwuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYXNzaWduVmFsdWVUb01vZGVsKG1vZGVsOiBEIHwgbnVsbCk6IHZvaWQ7XG5cbiAgLyoqIENvbnZlcnRzIGEgdmFsdWUgZnJvbSB0aGUgbW9kZWwgaW50byBhIG5hdGl2ZSB2YWx1ZSBmb3IgdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2dldFZhbHVlRnJvbU1vZGVsKG1vZGVsVmFsdWU6IFMpOiBEIHwgbnVsbDtcblxuICAvKiogQ29tYmluZWQgZm9ybSBjb250cm9sIHZhbGlkYXRvciBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgbnVsbDtcblxuICAvKiogUHJlZGljYXRlIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBpbnB1dCBzaG91bGQgaGFuZGxlIGEgcGFydGljdWxhciBjaGFuZ2UgZXZlbnQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2hvdWxkSGFuZGxlQ2hhbmdlRXZlbnQoZXZlbnQ6IE5neERhdGVTZWxlY3Rpb25Nb2RlbENoYW5nZTxTPik6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhc3QgdmFsdWUgc2V0IG9uIHRoZSBpbnB1dCB3YXMgdmFsaWQuICovXG4gIHByb3RlY3RlZCBfbGFzdFZhbHVlVmFsaWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9kYXRlQWRhcHRlcjogTmd4TWF0RGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChOR1hfTUFUX0RBVEVfRk9STUFUUykgcHJpdmF0ZSBfZGF0ZUZvcm1hdHM6IE5neE1hdERhdGVGb3JtYXRzLFxuICApIHtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignTmd4TWF0RGF0ZUFkYXB0ZXInKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9kYXRlRm9ybWF0cykge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ05HWF9NQVRfREFURV9GT1JNQVRTJyk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBkaXNwbGF5ZWQgZGF0ZSB3aGVuIHRoZSBsb2NhbGUgY2hhbmdlcy5cbiAgICB0aGlzLl9sb2NhbGVTdWJzY3JpcHRpb24gPSBfZGF0ZUFkYXB0ZXIubG9jYWxlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fYXNzaWduVmFsdWVQcm9ncmFtbWF0aWNhbGx5KHRoaXMudmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChkYXRlSW5wdXRzSGF2ZUNoYW5nZWQoY2hhbmdlcywgdGhpcy5fZGF0ZUFkYXB0ZXIpKSB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdmFsdWVDaGFuZ2VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fbG9jYWxlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3JPbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IgPyB0aGlzLl92YWxpZGF0b3IoYykgOiBudWxsO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogRCk6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2lnblZhbHVlUHJvZ3JhbW1hdGljYWxseSh2YWx1ZSk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX2N2YU9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfb25LZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgY3RybFNoaWZ0TWV0YU1vZGlmaWVyczogTGlzdEtleU1hbmFnZXJNb2RpZmllcktleVtdID0gWydjdHJsS2V5JywgJ3NoaWZ0S2V5JywgJ21ldGFLZXknXTtcbiAgICBjb25zdCBpc0FsdERvd25BcnJvdyA9XG4gICAgICBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpICYmXG4gICAgICBldmVudC5rZXlDb2RlID09PSBET1dOX0FSUk9XICYmXG4gICAgICBjdHJsU2hpZnRNZXRhTW9kaWZpZXJzLmV2ZXJ5KChtb2RpZmllcjogTGlzdEtleU1hbmFnZXJNb2RpZmllcktleSkgPT4gIWhhc01vZGlmaWVyS2V5KGV2ZW50LCBtb2RpZmllcikpO1xuXG4gICAgaWYgKGlzQWx0RG93bkFycm93ICYmICF0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucmVhZE9ubHkpIHtcbiAgICAgIHRoaXMuX29wZW5Qb3B1cCgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnB1dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbGFzdFZhbHVlV2FzVmFsaWQgPSB0aGlzLl9sYXN0VmFsdWVWYWxpZDtcbiAgICBsZXQgZGF0ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLnBhcnNlKHZhbHVlLCB0aGlzLl9kYXRlRm9ybWF0cy5wYXJzZS5kYXRlSW5wdXQpO1xuICAgIHRoaXMuX2xhc3RWYWx1ZVZhbGlkID0gdGhpcy5faXNWYWxpZFZhbHVlKGRhdGUpO1xuICAgIGRhdGUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwoZGF0ZSk7XG5cbiAgICBjb25zdCBpc1NhbWVUaW1lID0gdGhpcy5fZGF0ZUFkYXB0ZXIuaXNTYW1lVGltZShkYXRlLCB0aGlzLnZhbHVlKTtcbiAgICBjb25zdCBpc1NhbWVEYXRlID0gdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUoZGF0ZSwgdGhpcy52YWx1ZSk7XG4gICAgY29uc3QgaXNTYW1lID0gaXNTYW1lRGF0ZSAmJiBpc1NhbWVUaW1lO1xuXG4gICAgY29uc3QgaGFzQ2hhbmdlZCA9ICFpc1NhbWU7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGZpcmUgdGhlIENWQSBjaGFuZ2UgZXZlbnQgZm9yIGFsbFxuICAgIC8vIG51bGxzLCBvdGhlcndpc2UgdGhlIHZhbGlkYXRvcnMgd29uJ3QgcnVuLlxuICAgIGlmICghZGF0ZSB8fCBoYXNDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9jdmFPbkNoYW5nZShkYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2FsbCB0aGUgQ1ZBIGNoYW5nZSBoYW5kbGVyIGZvciBpbnZhbGlkIHZhbHVlc1xuICAgICAgLy8gc2luY2UgdGhpcyBpcyB3aGF0IG1hcmtzIHRoZSBjb250cm9sIGFzIGRpcnR5LlxuICAgICAgaWYgKHZhbHVlICYmICF0aGlzLnZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2N2YU9uQ2hhbmdlKGRhdGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFzdFZhbHVlV2FzVmFsaWQgIT09IHRoaXMuX2xhc3RWYWx1ZVZhbGlkKSB7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRvck9uQ2hhbmdlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0NoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2Fzc2lnblZhbHVlKGRhdGUpO1xuICAgICAgdGhpcy5kYXRlSW5wdXQuZW1pdChuZXcgTmd4TWF0RGF0ZXBpY2tlcklucHV0RXZlbnQodGhpcywgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSk7XG4gICAgfVxuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KG5ldyBOZ3hNYXREYXRlcGlja2VySW5wdXRFdmVudCh0aGlzLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGJsdXIgZXZlbnRzIG9uIHRoZSBpbnB1dC4gKi9cbiAgX29uQmx1cigpIHtcbiAgICAvLyBSZWZvcm1hdCB0aGUgaW5wdXQgb25seSBpZiB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUuXG4gICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX2Zvcm1hdFZhbHVlKHRoaXMudmFsdWUpO1xuICAgIH1cblxuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgLyoqIEZvcm1hdHMgYSB2YWx1ZSBhbmQgc2V0cyBpdCBvbiB0aGUgaW5wdXQgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIF9mb3JtYXRWYWx1ZSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPVxuICAgICAgdmFsdWUgIT0gbnVsbCA/IHRoaXMuX2RhdGVBZGFwdGVyLmZvcm1hdCh2YWx1ZSwgdGhpcy5fZGF0ZUZvcm1hdHMuZGlzcGxheS5kYXRlSW5wdXQpIDogJyc7XG4gIH1cblxuICAvKiogQXNzaWducyBhIHZhbHVlIHRvIHRoZSBtb2RlbC4gKi9cbiAgcHJpdmF0ZSBfYXNzaWduVmFsdWUodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgLy8gV2UgbWF5IGdldCBzb21lIGluY29taW5nIHZhbHVlcyBiZWZvcmUgdGhlIG1vZGVsIHdhc1xuICAgIC8vIGFzc2lnbmVkLiBTYXZlIHRoZSB2YWx1ZSBzbyB0aGF0IHdlIGNhbiBhc3NpZ24gaXQgbGF0ZXIuXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl9hc3NpZ25WYWx1ZVRvTW9kZWwodmFsdWUpO1xuICAgICAgdGhpcy5fcGVuZGluZ1ZhbHVlID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgYSB2YWx1ZSBpcyBjb25zaWRlcmVkIHZhbGlkLiAqL1xuICBwcml2YXRlIF9pc1ZhbGlkVmFsdWUodmFsdWU6IEQgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF2YWx1ZSB8fCB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBhIHBhcmVudCBjb250cm9sIGlzIGRpc2FibGVkLiBUaGlzIGlzIGluIHBsYWNlIHNvIHRoYXQgaXQgY2FuIGJlIG92ZXJyaWRkZW5cbiAgICogYnkgaW5wdXRzIGV4dGVuZGluZyB0aGlzIG9uZSB3aGljaCBjYW4gYmUgcGxhY2VkIGluc2lkZSBvZiBhIGdyb3VwIHRoYXQgY2FuIGJlIGRpc2FibGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9wYXJlbnREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogUHJvZ3JhbW1hdGljYWxseSBhc3NpZ25zIGEgdmFsdWUgdG8gdGhlIGlucHV0LiAqL1xuICBwcm90ZWN0ZWQgX2Fzc2lnblZhbHVlUHJvZ3JhbW1hdGljYWxseSh2YWx1ZTogRCB8IG51bGwpIHtcbiAgICB2YWx1ZSA9IHRoaXMuX2RhdGVBZGFwdGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgICB0aGlzLl9sYXN0VmFsdWVWYWxpZCA9IHRoaXMuX2lzVmFsaWRWYWx1ZSh2YWx1ZSk7XG4gICAgdmFsdWUgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodmFsdWUpO1xuICAgIHRoaXMuX2Fzc2lnblZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLl9mb3JtYXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgdmFsdWUgbWF0Y2hlcyB0aGUgY3VycmVudCBkYXRlIGZpbHRlci4gKi9cbiAgX21hdGNoZXNGaWx0ZXIodmFsdWU6IEQgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5fZ2V0RGF0ZUZpbHRlcigpO1xuICAgIHJldHVybiAhZmlsdGVyIHx8IGZpbHRlcih2YWx1ZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgYFNpbXBsZUNoYW5nZXNgIG9iamVjdCBmcm9tIGFuIGBuZ09uQ2hhbmdlc2BcbiAqIGNhbGxiYWNrIGhhcyBhbnkgY2hhbmdlcywgYWNjb3VudGluZyBmb3IgZGF0ZSBvYmplY3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGF0ZUlucHV0c0hhdmVDaGFuZ2VkKFxuICBjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzLFxuICBhZGFwdGVyOiBOZ3hNYXREYXRlQWRhcHRlcjx1bmtub3duPixcbik6IGJvb2xlYW4ge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoY2hhbmdlcyk7XG5cbiAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICBjb25zdCB7IHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSB9ID0gY2hhbmdlc1trZXldO1xuXG4gICAgaWYgKGFkYXB0ZXIuaXNEYXRlSW5zdGFuY2UocHJldmlvdXNWYWx1ZSkgJiYgYWRhcHRlci5pc0RhdGVJbnN0YW5jZShjdXJyZW50VmFsdWUpKSB7XG4gICAgICBpZiAoIWFkYXB0ZXIuc2FtZURhdGUocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIl19