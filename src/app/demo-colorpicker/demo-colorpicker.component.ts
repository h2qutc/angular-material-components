import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { ThemePalette } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import {
  Color,
  MAT_COLOR_FORMATS,
  MatColorFormats,
  NgxMatColorPickerComponent,
  NgxMatColorPickerInput,
  NgxMatColorToggleComponent,
} from "projects/color-picker/src/public-api";
import { NgxMatHighlightDirective } from "../shared/NgxMatHighlightDirective";

const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
  display: {
    colorInput: "hex8",
  },
};

@Component({
  selector: "ngx-mat-demo-colorpicker",
  templateUrl: "./demo-colorpicker.component.html",
  styleUrls: ["./demo-colorpicker.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    NgxMatColorPickerComponent,
    NgxMatColorPickerComponent,
    NgxMatColorPickerInput,
    NgxMatColorToggleComponent,
    NgxMatHighlightDirective,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS },
  ],
})
export class DemoColorpickerComponent {
  public disabled = false;
  public color: ThemePalette = "primary";
  public touchUi = false;

  colorCtr: AbstractControl = new FormControl(new Color(0, 255, 255), [
    Validators.required,
  ]);

  public options = [
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  public listColors = ["primary", "accent", "warn"];

  public code3 = `<mat-form-field>
  <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr" [disabled]="disabled">
  <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
  <ngx-mat-color-picker #picker [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>`;

  public code6 = `
import { Color } from '@angular-material-components/color-picker';
colorCtr: AbstractControl = new FormControl(new Color(255, 243, 0), [Validators.required]);`;

  public code1 = "npm install --save @angular-material-components/color-picker";

  public code2 = `import { MAT_COLOR_FORMATS, NgxMatColorPickerComponent, NGX_MAT_COLOR_FORMATS }
  from '@angular-material-components/color-picker'

  @Component({
    ...
    imports: [
         ...
         NgxMatColorPickerComponent
    ],
    providers: [
     { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
    ],
    ...
 })
 export class AppComponent { }`;

  public code4 = `export const CUSTOM_MAT_COLOR_FORMATS: MatColorFormats = {
    display: {
        colorInput: 'hex'
    }
}

@Component({
    ...
    providers: [
      { provide: MAT_COLOR_FORMATS, useValue: CUSTOM_MAT_COLOR_FORMATS }
    ],
    ...
  })
export class AppComponent { }`;

  public code5 =
    '<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">';

  public code7 = `<mat-form-field>
  <input matInput [ngxMatColorPicker]="pickerCustomIcon" [formControl]="colorCtr" [disabled]="disabled">
  <ngx-mat-color-toggle matSuffix [for]="pickerCustomIcon">
    <mat-icon ngxMatColorpickerToggleIcon>keyboard_arrow_down</mat-icon>
  </ngx-mat-color-toggle>
  <ngx-mat-color-picker #pickerCustomIcon [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>`;

  onDisabledChanged(value: boolean) {
    if (!value) {
      this.colorCtr.enable();
    } else {
      this.colorCtr.disable();
    }
  }
}
