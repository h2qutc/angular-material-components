import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for input file accept
 * @param accept Allowable type of file
 */
export function AcceptValidator(accept: string): ValidatorFn {
    return (ctrl: AbstractControl): ValidationErrors | null => {
        if (!accept) {
            throw ('AcceptValidator: allowable type of file can not be empty');
        }

        if (ctrl.value == null) return null;

        if (!accept.includes(ctrl.value.type)) {
            return {
                accept: true
            };
        }

        return null;

    }
}