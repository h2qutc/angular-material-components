# Angular Material DatetimePicker, Timepicker for @angular/material 7.x, 8.x, 9.x, 10.x, 11.x, 12.x, 13.x, 14.x

[![Build Status](https://travis-ci.com/h2qutc/angular-material-components.svg?branch=master)](https://travis-ci.com/h2qutc/angular-material-components)
[![License](https://img.shields.io/npm/l/angular-material-components.svg)](https://www.npmjs.com/package/angular-material-components)
[![npm version](https://badge.fury.io/js/%40angular-material-components%2Fdatetime-picker.svg)](https://www.npmjs.com/package/@angular-material-components/datetime-picker)
[![Github All Releases](https://img.shields.io/npm/dt/@angular-material-components/datetime-picker.svg)]()

## Description

A DatetimePicker like @angular/material [Datepicker](https://material.angular.io/components/datepicker/overview) by adding support for choosing time.

<a href="https://www.buymeacoffee.com/h2qutc" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## DEMO

@see [LIVE DEMO AND DOCUMENTATION](https://h2qutc.github.io/angular-material-components/)

@see [DEMO stackblitz](https://stackblitz.com/edit/demo-ngx-mat-datetime-picker)

![Alt Text](demo_datetime_picker.png)

Choose the version corresponding to your Angular version:

 Angular     | @angular-material-components/datetime-picker
 ----------- | -------------------
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
npm install --save  @angular-material-components/datetime-picker
```

## Setup
Basically the same way the @angular/material Datepicker is configured and imported.

```
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
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
@see [src/app/demo-datetime/demo-datetime.module.ts](src/app/demo-datetime/demo-datetime.module.ts)

## Using the component

The same API as @angular/material Datepicker (@see [API docs](https://material.angular.io/components/datepicker/api))

### Datetime Picker (ngx-mat-datetime-picker)

```
<mat-form-field>
   <input matInput [ngxMatDatetimePicker]="picker" placeholder="Choose a date" [formControl]="dateControl"
      [min]="minDate" [max]="maxDate" [disabled]="disabled">
   <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
   <ngx-mat-datetime-picker #picker [showSpinners]="showSpinners" [showSeconds]="showSeconds"
      [stepHour]="stepHour" [stepMinute]="stepMinute" [stepSecond]="stepSecond"
      [touchUi]="touchUi" [color]="color" [enableMeridian]="enableMeridian" 
      [disableMinute]="disableMinute" [hideTime]="hideTime">
   </ngx-mat-datetime-picker>
</mat-form-field>
```

### Timepicker (ngx-mat-timepicker)

```
<ngx-mat-timepicker [(ngModel)]="date"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [disabled]="disabled"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [stepHour]="2" [stepMinute]="5" [stepSecond]="10"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [showSpinners]="showSpinners"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [showSeconds]="showSeconds"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [disableMinute]="disableMinute"></ngx-mat-timepicker>
<ngx-mat-timepicker [(ngModel)]="date" [defaultTime]="defaultTime"></ngx-mat-timepicker>
<ngx-mat-timepicker [formControl]="formControl"></ngx-mat-timepicker>
```

#### List of @Input of ngx-mat-timepicker

*You can use all @Input of ngx-mat-timepicker for ngx-mat-datetime-picker*

| @Input        	| Type     	| Default value 	| Description                                                          	|
|---------------	|----------	|---------------	|----------------------------------------------------------------------	|
| **disabled**      	| boolean  	| null          	| If true, the picker is readonly and can't be modified                	|
| **showSpinners**  	| boolean  	| true          	| If true, the spinners above and below input are visible              	|
| **showSeconds** 	| boolean  	| true          	| If true, it is not possible to select seconds                        	|
| **disableMinute** 	| boolean  	| false          	| If true, the minute (and second) is readonly                        	|
| **defaultTime** 	| Array  	| undefined          	| An array [hour, minute, second] for default time when the date is not yet defined                        	|
| **stepHour**      	| number   	| 1             	| The number of hours to add/substract when clicking hour spinners     	|
| **stepMinute**    	| number   	| 1             	| The number of minutes to add/substract when clicking minute spinners 	|
| **stepSecond**    	| number   	| 1             	| The number of seconds to add/substract when clicking second spinners 	|
| **color**    	   | ThemePalette   	| undefined             	| Color palette to use on the datepicker's calendar. 	|
| **enableMeridian** | boolean   	| false             	| Whether to display 12H or 24H mode. 	|
| **hideTime** | boolean   	| false             	| If true, the time is hidden. 	|
| **touchUi**    	   | boolean   | false           | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets. 	|

## Choosing a date implementation and date format settings

The datepicker was built to be date implementation agnostic. This means that it can be made to work with a variety of different date implementations. However it also means that developers need to make sure to provide the appropriate pieces for the datepicker to work with their chosen implementation.

The easiest way to ensure this is to import one of the provided date modules:

|                       	| **NgxMatNativeDateModule** 	| **NgxMatMomentModule**                                                              	|
|-----------------------	|----------------------------	|-------------------------------------------------------------------------------------	|
| **Date type**         	| Date                       	| Moment                                                                              	|
| **Supported locales** 	| en-US                      	| [See project for details](https://github.com/moment/moment/tree/develop/src/locale) 	|
| **Dependencies**      	| None                       	| [Moment.js](https://momentjs.com/)                                                  	|
| **Import from**       	| @angular-material-components/datetime-picker    	| [@angular-material-components/moment-adapter](https://www.npmjs.com/package/@angular-material-components/moment-adapter)      	|

To use NgxMatMomentModule: 
   ```
   npm install --save  @angular-material-components/moment-adapter
   ```

Please note: NgxMatNativeDateModule is based off the functionality available in JavaScript's native Date object. Thus it is not suitable for many locales. One of the biggest shortcomings of the native Date object is the inability to set the parse format.

We highly recommend using the **NgxMatMomentModule** or a custom **NgxMatDateAdapter** that works with the formatting/parsing library of your choice.

For example:

Creating a custom date adapter:

```
@Injectable()
export class CustomDateAdapter extends NgxMatDateAdapter<D> {...}
// D can be Date, Moment or customized type
```

Creating a custom date adapter module
```
@NgModule({
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    }
  ],
})
export class CustomDateModule { }
```

You can also customize the date format by providing your custom NGX_MAT_DATE_FORMATS in your module.

```
// If using Moment
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

//and in the module providers 
providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MOMENT_FORMATS }
  ]
```

## Theming
- @see @angular/material [Using a pre-built theme](https://material.angular.io/guide/theming#using-a-pre-built-theme)
- Add the Material Design icon font to your index.html
```
<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">
```

## License
MIT