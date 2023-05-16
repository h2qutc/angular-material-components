import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import {
  NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  NgxMatColorCanvasComponent,
  NgxMatColorCollectionComponent,
  NgxMatColorPaletteComponent,
  NgxMatColorPickerComponent,
  NgxMatColorPickerContentComponent,
  NgxMatColorPickerInput, NgxMatColorSliderComponent,
  NgxMatColorToggleComponent
} from './components';
import { NumericColorInputDirective } from './directives';
import { ColorAdapter } from './services';

@NgModule({
  declarations: [
    NgxMatColorPaletteComponent,
    NgxMatColorCanvasComponent,
    NgxMatColorCollectionComponent,
    NgxMatColorSliderComponent,
    NumericColorInputDirective,
    NgxMatColorPickerContentComponent,
    NgxMatColorPickerComponent,
    NgxMatColorToggleComponent,
    NgxMatColorPickerInput
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    PortalModule,
    MatIconModule
  ],
  exports: [
    NgxMatColorToggleComponent,
    NgxMatColorPickerInput,
    NgxMatColorPickerComponent
  ],
  providers: [
    ColorAdapter,
    NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY_PROVIDER
  ]
})
export class NgxMatColorPickerModule { }
