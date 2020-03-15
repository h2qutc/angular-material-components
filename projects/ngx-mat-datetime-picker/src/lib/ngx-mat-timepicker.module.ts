import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerComponent } from './ngx-mat-timepicker.component';
import { NgxMatInputOnlyNumericDirective } from './ngx-mat-input-only-numeric.directive';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    NgxMatTimepickerComponent,
    NgxMatInputOnlyNumericDirective
  ],
  declarations: [
    NgxMatTimepickerComponent,
    NgxMatInputOnlyNumericDirective
  ]
})
export class NgxMatTimepickerModule { }
