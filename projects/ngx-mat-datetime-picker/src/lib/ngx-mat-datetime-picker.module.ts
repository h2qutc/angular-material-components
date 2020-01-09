import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from './ngx-mat-timepicker.module';
import { NgxMatDatetimeContent, NgxMatDatetimePicker } from './ngx-mat-datetime-picker.component';
import { NgxMatDatetimeInput } from './ngx-mat-datetime-input';

@NgModule({
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    PortalModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    NgxMatTimepickerModule,
  ],
  exports: [
    NgxMatDatetimePicker,
    NgxMatDatetimeInput
  ],
  declarations: [
    NgxMatDatetimePicker,
    NgxMatDatetimeContent,
    NgxMatDatetimeInput
  ],
  entryComponents: [
    NgxMatDatetimeContent
  ],
  providers: [
    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ]
})
export class NgxMatDatetimePickerModule { }
