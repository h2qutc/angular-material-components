import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color } from '../../models';

@Component({
  selector: 'ngx-mat-color-palette',
  templateUrl: 'color-palette.component.html',
  styleUrls: ['color-palette.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-color-palette'
  }
})
export class NgxMatColorPaletteComponent implements OnInit {

  color: Color;

  constructor() { }

  ngOnInit() {
    this.color = new Color(255, 0, 0);
  }

  public handleColorChanged(color: Color) {
    this.color = color;
  }

}
