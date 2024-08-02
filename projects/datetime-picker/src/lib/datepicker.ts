import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';
import {
  NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  NgxMatDatepickerBase,
  NgxMatDatepickerControl,
} from './datepicker-base';

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
  selector: 'ngx-mat-datetime-picker',
  template: '',
  exportAs: 'ngxMatDatetimePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    NGX_MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
    NGX_MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
    { provide: NgxMatDatepickerBase, useExisting: NgxMatDatetimepicker },
  ],
  standalone: true,
})
export class NgxMatDatetimepicker<D> extends NgxMatDatepickerBase<
  NgxMatDatepickerControl<D>,
  D | null,
  D
> {}
