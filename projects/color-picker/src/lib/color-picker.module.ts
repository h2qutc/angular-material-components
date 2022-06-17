import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  NgxMatColorCanvasComponent,
  NgxMatColorCollectionComponent,
  NgxMatColorPaletteComponent,
  NgxMatColorPickerComponent,
  NgxMatColorPickerInput, NgxMatColorSliderComponent,
  NgxMatColorToggleComponent,
  NGX_MAT_COLOR_PICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  NgxMatColorPickerContentComponent
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
