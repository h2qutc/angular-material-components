import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'ngx-mat-demo-colorpicker',
  templateUrl: './demo-colorpicker.component.html',
  styleUrls: ['./demo-colorpicker.component.scss']
})
export class DemoColorpickerComponent implements OnInit {

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  colorCtr: AbstractControl = new FormControl(null, [Validators.required]);

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public codeColorPicker = `\n<mat-form-field>
  <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr">
  <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
  <ngx-mat-color-picker #picker></ngx-mat-color-picker>
</mat-form-field>`;

  constructor() { }

  ngOnInit() {
  }

}
