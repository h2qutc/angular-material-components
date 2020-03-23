import { Directive, HostListener } from '@angular/core';
import { NUMERIC_REGEX } from '../helpers';

@Directive({
  selector: '[ngxMatNumericColorInput]'
})
export class NumericColorInputDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInput($event: any) {
    this._formatInput($event.target);
  }

  /**
* Format input
* @param input 
*/
  private _formatInput(input: any) {
    let val = Number(input.value.replace(NUMERIC_REGEX, ''));
    val = isNaN(val) ? 0 : val;
    input.value = val;
  }

}
