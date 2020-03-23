import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoDatetimeComponent } from './demo-datetime.component';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
//TODO replace import path
import { NgxMatNativeDateModule, NgxMatTimepickerModule, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes: Routes = [
  { path: '', component: DemoDatetimeComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes,
    ),
    MatDatepickerModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxMatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
  ],
  declarations: [DemoDatetimeComponent]
})
export class DemoDatetimeModule { }
