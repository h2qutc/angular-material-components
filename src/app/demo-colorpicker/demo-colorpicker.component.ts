import { Component, OnInit } from '@angular/core';
import { Color } from 'projects/color-picker/src/lib/models';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-mat-demo-colorpicker',
  templateUrl: './demo-colorpicker.component.html',
  styleUrls: ['./demo-colorpicker.component.scss']
})
export class DemoColorpickerComponent implements OnInit {

  colorCtr: AbstractControl = new FormControl(null);

  constructor() { }

  ngOnInit() {
  }

}
