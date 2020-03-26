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
        let files: File[] = ctrl.value;
        if (!Array.isArray(ctrl.value)) {
            files = [ctrl.value];
        }
        if(!files.length) return null;
        const add = (a: any, b: any): number => a + b;
        const sumSize = files.map(x => x.size).reduce(add);
        if (sumSize > max) {
            return {
                maxSize: true
            };
        }
        return null;
    }
}