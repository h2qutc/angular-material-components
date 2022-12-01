# Angular Material Color Picker for @angular/material 7.x, 8.x, 9.x, 10.x, 11.x, 12.x, 13.x, 14.x, 15.x

[![Build Status](https://travis-ci.com/h2qutc/angular-material-components.svg?branch=master)](https://travis-ci.com/h2qutc/angular-material-components)
[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fcolor-picker.svg)](https://www.npmjs.com/package/@angular-material-components/color-picker)

## Description

An Angular Material Color Picker.

<a href="https://www.buymeacoffee.com/h2qutc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## DEMO

@see [DEMO stackblitz](https://stackblitz.com/edit/demo-ngx-mat-color-picker)

![Alt Text](demo_color_picker.png)

Choose the version corresponding to your Angular version:

 Angular     | @angular-material-components/color-picker
 ----------- | -------------------
 15          | 9.x+
 14          | 8.x+
 13          | 7.x+
 12          | 6.x+
 11          | 5.x+
 10          | 4.x+
 9           | 2.x+
 8           | 2.x+
 7           | 2.x+

## Getting started
```
npm install --save  @angular-material-components/color-picker
```

## Setup

```
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

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
export class AppModule { }
```
@see [src/app/demo-colorpicker/demo-colorpicker.module.ts](src/app/demo-colorpicker/demo-colorpicker.module.ts)

## Using the component

### Color Picker (ngx-mat-color-picker)

```
<mat-form-field>
    <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr" [disabled]="disabled">
    <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
    <ngx-mat-color-picker #picker [touchUi]="touchUi" [color]="color"></ngx-mat-color-picker>
</mat-form-field>
```

#### List of @Input

| @Input        	| Type     	| Default value 	| Description                                                          	|
|---------------	|----------	|---------------	|----------------------------------------------------------------------	|
| **disabled**      	| boolean  	| null          	| If true, the picker is readonly and can't be modified                	|
| **touchUi**    	   | boolean   | false           | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets. 	|

## Theming
- @see @angular/material [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License
MIT