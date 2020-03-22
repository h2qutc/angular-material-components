import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatColorCollectionComponent, NgxMatColorPaletteComponent, NgxMatColorSliderComponent, NgxMatColorCanvasComponent } from './components';
import { NumericColorInputDirective } from './directives';

@NgModule({
  declarations: [
    NgxMatColorPaletteComponent,
    NgxMatColorCanvasComponent,
    NgxMatColorCollectionComponent,
    NgxMatColorSliderComponent,
    NumericColorInputDirective,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NgxMatColorPaletteComponent
  ]
})
export class NgxMatColorPickerModule { }
