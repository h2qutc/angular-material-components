import { Component, OnInit } from '@angular/core';
import { Color } from '../models';

@Component({
  selector: 'ngx-mat-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrls: ['color-picker.component.scss']
})
export class NgxMatColorPickerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public handleColorChanged(color: Color) {
    console.log('color:', color.toString());
  }

}
