# Angular Material Color Picker for @angular/material 7.x, 8.x, 9.x

[![Build Status](https://travis-ci.com/h2qutc/angular-material-components.svg?branch=master)](https://travis-ci.com/h2qutc/angular-material-components)
[![codecov](https://codecov.io/gh/h2qutc/angular-material-components/branch/master/graph/badge.svg)](https://codecov.io/gh/h2qutc/angular-material-components)
[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fcolor-picker.svg)](https://www.npmjs.com/package/@angular-material-components/color-picker)

## Description

A Angular Material Color Picker.

[![button](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SAAY32BP5KPPC&source=url)

## DEMO

@see [DEMO stackblitz](https://stackblitz.com/edit/demo-ngx-mat-color-picker)

![Alt Text](demo_color_picker.png)

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
@see [src/app/app.module.ts](src/app/app.module.ts)

## Using the component

The same API as @angular/material Datepicker (@see [API docs](https://material.angular.io/components/datepicker/api))

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
| **color**    	   | ThemePalette   	| undefined             	| Color palette to use on the datepicker's calendar. 	
| **touchUi**    	   | boolean   | false           | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets. 	|

## Theming
- @see @angular/material [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License
MIT