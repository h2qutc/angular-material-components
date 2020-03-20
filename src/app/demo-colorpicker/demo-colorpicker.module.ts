import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoColorpickerComponent } from './demo-colorpicker.component';
import { NgxMatColorPickerModule } from 'projects/color-picker/src/public-api';

const routes: Routes = [
  { path: '', component: DemoColorpickerComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes,
    ),
    NgxMatColorPickerModule
  ],
  declarations: [DemoColorpickerComponent]
})
export class DemoColorpickerModule { }
