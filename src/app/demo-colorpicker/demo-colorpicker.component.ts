import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Color, NgxMatColorPickerModule } from 'projects/color-picker/src/public-api';
import { SharedModule } from '../shared';

@Component({
  selector: 'ngx-mat-demo-colorpicker',
  templateUrl: './demo-colorpicker.component.html',
  styleUrls: ['./demo-colorpicker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    NgxMatColorPickerModule,
    SharedModule
  ]
})
export class DemoColorpickerComponent implements OnInit {

  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;

  colorCtr: AbstractControl = new FormControl(new Color(0, 255, 255), [Validators.required]);

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public code3 = `<mat-form-field>
  <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr" [disabled]="disabled">
  <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
  <ngx-mat-color-picker #picker [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>`;

  public code6 = `
import { Color } from '@angular-material-components/color-picker';
colorCtr: AbstractControl = new FormControl(new Color(255, 243, 0), [Validators.required]);`


  public code1 = 'npm install --save @angular-material-components/color-picker';


  public code2 = `import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } 
  from '@angular-material-components/color-picker'

  @NgModule({
    ...
    imports: [
         ...
         NgxMatColorPickerModule
    ],
    providers: [
     { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
    ],
    ...
 })
 export class AppModule { }`;

  public code4 =
    `export const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
    display: {
        colorInput: 'hex'
    }
}

@NgModule({
    ...
    providers: [
      { provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS }
    ],
    ...
  })
export class AppModule { }`;

  public code5 = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">';

  public code7 = `<mat-form-field>
  <input matInput [ngxMatColorPicker]="pickerCustomIcon" [formControl]="colorCtr" [disabled]="disabled">
  <ngx-mat-color-toggle matSuffix [for]="pickerCustomIcon">
    <mat-icon ngxMatColorpickerToggleIcon>keyboard_arrow_down</mat-icon>
  </ngx-mat-color-toggle>
  <ngx-mat-color-picker #pickerCustomIcon [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>`;

  constructor() { }

  ngOnInit() {
  }

  onDisabledChanged(value: boolean) {
    if (!value) {
      this.colorCtr.enable();
    } else {
      this.colorCtr.disable();
    }
  }

}
