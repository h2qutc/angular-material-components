import { FormControl } from '@angular/forms';

export interface ColorFormGroup {
  r: FormControl<number>;
  g: FormControl<number>;
  b: FormControl<number>;
  a: FormControl<number>;
  hex: FormControl<string>;
}