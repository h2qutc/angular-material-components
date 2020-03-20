import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMatColorPickerComponent, NgxMatPaletteComponent } from './components';

@NgModule({
  declarations: [
    NgxMatColorPickerComponent,
    NgxMatPaletteComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
  ],
  exports: [
    NgxMatColorPickerComponent
  ]
})
export class NgxMatColorPickerModule { }
