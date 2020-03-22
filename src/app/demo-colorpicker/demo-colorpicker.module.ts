import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoColorpickerComponent } from './demo-colorpicker.component';
import { NgxMatColorPickerModule } from 'projects/color-picker/src/public-api';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: DemoColorpickerComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes,
    ),
    NgxMatColorPickerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [DemoColorpickerComponent]
})
export class DemoColorpickerModule { }
