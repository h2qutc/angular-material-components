import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Color } from '../../models';
import { NgxMatColorCanvasComponent } from '../color-canvas/color-canvas.component';
import { NgxMatColorCollectionComponent } from '../color-collection/color-collection.component';

@Component({
  selector: 'ngx-mat-color-palette',
  templateUrl: 'color-palette.component.html',
  styleUrls: ['color-palette.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngx-mat-color-palette',
  },
  standalone: true,
  imports: [NgxMatColorCollectionComponent, NgxMatColorCanvasComponent],
})
export class NgxMatColorPaletteComponent {
  readonly colorChanged = output<Color>();

  readonly color = input<Color>();
  readonly theme = input<ThemePalette>();

  public handleColorChanged(color: Color) {
    this.colorChanged.emit(color);
  }
}
