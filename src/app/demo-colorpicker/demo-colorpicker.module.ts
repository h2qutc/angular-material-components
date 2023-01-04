import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { RouterModule, Routes } from '@angular/router';
import { MatColorFormats, MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '../../../projects/color-picker/src/public-api';
import { DemoColorpickerComponent } from './demo-colorpicker.component';
import { SharedModule } from '../shared';

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
