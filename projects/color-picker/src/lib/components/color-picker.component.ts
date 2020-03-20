import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Color } from '../models';

@Component({
  selector: 'ngx-mat-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-color-picker'
  }
})
export class NgxMatColorPickerComponent implements OnInit {

  color: Color;

  constructor() { }

  ngOnInit() {
    this.color = new Color(255, 0, 0);
  }

  public handleColorChanged(color: Color) {
    this.color = color;
  }

}
