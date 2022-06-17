import { FormControl } from '@angular/forms';

export interface TimepickerFormGroup {
  hour: FormControl<string>;
  minute: FormControl<string>;
  second: FormControl<string>;
}