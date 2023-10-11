import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '../../../projects/datetime-picker/src/public-api';
import { SharedModule } from '../shared';
import { DemoDatetimeComponent } from './demo-datetime.component';

import {NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, NgxMatMomentAdapter, NgxMatMomentModule, NgxMomentDateModule} from '@angular-material-components/moment-adapter';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDateFormats } from '@angular-material-components/datetime-picker';
import { NgxMatLuxonDateModule } from 'projects/luxon-adapter/src';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY HH:mm',
  },
  display: {
    dateInput: 'DD.MM.YYYY HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

const routes: Routes = [
  { path: '', component: DemoDatetimeComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes,
    ),
    MatInputModule,
    //NgxMatMomentModule,
   NgxMatLuxonDateModule,
    //NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    SharedModule
  ],
  declarations: [
    DemoDatetimeComponent
  ]




})
export class DemoDatetimeModule { }
