import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color } from '../../models';
import { ThemePalette } from '@angular/material/core';
import { NgxMatColorCanvasComponent } from '../color-canvas/color-canvas.component';
import { NgxMatColorCollectionComponent } from '../color-collection/color-collection.component';
import { NgxMatColorSliderComponent } from '../color-canvas/color-slider/color-slider.component';

@Component({
  selector: 'ngx-mat-color-palette',
  templateUrl: 'color-palette.component.html',
  styleUrls: ['color-palette.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-color-palette'
  },
  standalone: true,
  imports: [CommonModule, NgxMatColorCanvasComponent, NgxMatColorCollectionComponent]
})
export class NgxMatColorPaletteComponent implements OnInit {

  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();

  @Input() color: Color;
  @Input() theme: ThemePalette;

  constructor() { }

  ngOnInit() {
  }

  public handleColorChanged(color: Color) {
    this.colorChanged.emit(color);
  }

}
