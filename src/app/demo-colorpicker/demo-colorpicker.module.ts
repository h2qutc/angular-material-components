import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';
import { MAT_COLOR_FORMATS, MatColorFormats, NgxMatColorPickerModule } from '../../../projects/color-picker/src/public-api';
import { SharedModule } from '../shared';
import { DemoColorpickerComponent } from './demo-colorpicker.component';

const routes: Routes = [
  { path: '', component: DemoColorpickerComponent }
]

//'rgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8'
const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
  display: {
    colorInput: 'hex8'
  }
}

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
    MatSelectModule,
    MatIconModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS }
  ],
  declarations: [
    DemoColorpickerComponent
  ]
})
export class DemoColorpickerModule { }
