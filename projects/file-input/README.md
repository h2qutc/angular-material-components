# Angular Material File Input for @angular/material 7.x, 8.x, 9.x, 10.x, 11.x, 12.x, 13.x, 14.x, 15.x, 16.x

[![Build Status](https://travis-ci.com/h2qutc/angular-material-components.svg?branch=master)](https://travis-ci.com/h2qutc/angular-material-components)
[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Ffile-input.svg)](https://www.npmjs.com/package/@angular-material-components/file-input)

## Description

An Angular Material File Input.

<a href="https://www.buymeacoffee.com/h2qutc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## DEMO

@see [DEMO stackblitz](https://stackblitz.com/edit/demo-ngx-mat-file-input)

@see [LIVE DEMO](https://h2qutc.github.io/angular-material-components/)

![Alt Text](demo_file_input.png)

Choose the version corresponding to your Angular version:

 Angular     | @angular-material-components/file-input
 ----------- | -------------------
 16          | 16.x+
 15          | 15.x+ OR 9.x+ for legacy import
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
npm install --save @angular-material-components/file-input
```

## Setup

```
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

@NgModule({
   ...
   imports: [
        ...
        NgxMatFileInputModule
   ]
   ...
})
export class AppModule { }
```

@see [src/app/demo-fileinput/demo-fileinput.module.ts](src/app/demo-fileinput/demo-fileinput.module.ts)

## Using the component

### File Input (ngx-mat-file-input)

```
<mat-form-field>
   <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept" [color]="color">
   </ngx-mat-file-input>
</mat-form-field>
```

#### You can provide a custom icon by using the directive *ngxMatFileInputIcon*

```
<mat-form-field>
   <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept"
   [color]="color">
      <mat-icon ngxMatFileInputIcon>folder</mat-icon>
   </ngx-mat-file-input>
</mat-form-field>
```

#### You can use with all properties of MatFormField such as appearance variants, hint...

```
<mat-form-field appearance="outline">
  <ngx-mat-file-input [formControl]="file3Control">
  </ngx-mat-file-input>
  <mat-hint>Hint</mat-hint>
</mat-form-field>
```

#### List of @Input

| @Input        	| Type     	| Default value 	| Description                                                          	|
|---------------	|----------	|---------------	|----------------------------------------------------------------------	|
| **disabled**      	| boolean  	| null          	| If true, the file input is readonly.                	|
| **multiple**      	| boolean  	| false          	| If true, the file input allows the user to select more than one file.                	|
| **accept**    	   | string   | null           | Limiting accepted file types (For example: accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.) 	|
| **color**      	| ThemePalette  	| null          	| Theme color palette for the component.                	|

## Theming
- @see @angular/material [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License
MIT