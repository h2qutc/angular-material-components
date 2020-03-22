import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS } from 'projects/color-picker/src/lib/services';
import { NgxMatColorPickerModule } from 'projects/color-picker/src/public-api';
import { DemoColorpickerComponent } from './demo-colorpicker.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  declarations: [
    DemoColorpickerComponent
  ]
})
export class DemoColorpickerModule { }
