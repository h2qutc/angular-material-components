import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Validator for size of file
 * @param max Max of size of file (in bytes)
 */
export function MaxSizeValidator(max: number): ValidatorFn {
    return (ctrl: AbstractControl): ValidationErrors | null => {
        max = Number(max);
        if (isNaN(max)) {
            throw 'MaxSizeValidator: max of size of file is invalid';
        }
        if (!ctrl.value) return null;
        if (ctrl.value.size > max) {
            return {
                maxSize: true
            };
        }
        return null;
    }
}