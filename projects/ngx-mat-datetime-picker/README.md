# Ngx Material DatetimePicker, Timepicker for @angular/material 7.x, 8.x

[![Build Status](https://travis-ci.com/h2qutc/ngx-mat-datetime-picker.svg?branch=master)](https://travis-ci.com/h2qutc/ngx-mat-datetime-picker)
[![codecov](https://codecov.io/gh/h2qutc/ngx-mat-datetime-picker/branch/master/graph/badge.svg)](https://codecov.io/gh/h2qutc/ngx-mat-datetime-picker)
[![License](https://img.shields.io/npm/l/ngx-mat-datetime-picker.svg)](https://www.npmjs.com/package/ngx-mat-datetime-picker)
[![npm version](https://badge.fury.io/js/ngx-mat-datetime-picker.svg)](https://badge.fury.io/for/js/ngx-mat-datetime-picker)

## Description

A DatetimePicker like @angular/material [Datepicker](https://material.angular.io/components/datepicker/overview) by adding support for choosing time.

## DEMO
@see [Demo here](https://stackblitz.com/edit/demo-ngx-mat-datetime-picker)

![Alt Text](demo.png)

## Getting started
```
npm install --save ngx-mat-datetime-picker
```

## Setup
Basically the same way the @angular/material Datepicker is configured and imported.

```
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
@NgModule({
   ...
   imports: [
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      MatDatepickerModule,
      MatInputModule,
      NgxMatTimepickerModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      NgxMatDatetimePickerModule,
   ],
   ...
})
export class AppModule { }
```
@see [src/app/app.module.ts](src/app/app.module.ts)

## Using the component

The same API as @angular/material Datepicker (@see [API docs](https://material.angular.io/components/datepicker/api))

Datetime picker using FormControl

```
<mat-form-field>
    <input matInput [ngxMatDatetimePicker]="picker" placeholder="Choose a date" [formControl]="dateControl">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <ngx-mat-datetime-picker #picker></ngx-mat-datetime-picker>
</mat-form-field>
```

Timepicker

```
<ngx-mat-timepicker [(ngModel)]="date"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [disabled]="disabled"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [stepHour]="2" [stepMinute]="5" [stepSecond]="10"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [showSpinners]="showSpinners"></ngx-mat-timepicker>
```

## Theming
- @see @angular/material [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License
MIT