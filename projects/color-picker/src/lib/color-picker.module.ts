import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NgxMatColorPickerComponent, NgxMatPaletteComponent, NgxMatColorCollectionComponent } from './components';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    NgxMatColorPickerComponent,
    NgxMatPaletteComponent,
    NgxMatColorCollectionComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ],
  exports: [
    NgxMatColorPickerComponent
  ]
})
export class NgxMatColorPickerModule { }
