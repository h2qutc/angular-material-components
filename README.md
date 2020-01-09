# Ngx Material DatetimePicker for @angular/material 7.x - 8.x

Angular 7/8, @angular/material 7.x-8.x.

## Description

A DatetimePicker like @angular/material [Datepicker](https://material.angular.io/components/datepicker/overview) by adding support for choosing time.

# Usage
## Installation
```
npm install ngx-mat-datetime-picker
```

## Setup
Basically the same way the @angular/material Datepicker is configured and imported.

```
imports: [
  ...
  BrowserModule,
  BrowserAnimationsModule,
  MatInputModule,
  MatButtonModule,
  FormsModule,
  ReactiveFormsModule,
  MatDatepickerModule
  NgxMatDatetimePickerModule
]
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

Timepicker using FormControl

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