import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-demo-datetime',
  templateUrl: './demo-datetime.component.html',
  styleUrls: ['./demo-datetime.component.scss']
})
export class DemoDatetimeComponent implements OnInit {

  @ViewChild('picker', { static: true }) picker: any;

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: Date;
  public maxDate: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public disableMinute = false;
  public hideTime = false;

  public dateControl = new FormControl(new Date());

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  public code1 = 'npm install --save @angular-material-components/datetime-picker';

  public code3 = `<mat-form-field>
  <input matInput [ngxMatDatetimePicker]="picker" placeholder="Choose a date" [formControl]="dateControl"
    [min]="minDate" [max]="maxDate" [disabled]="disabled">
  <ngx-mat-datepicker-toggle matSuffix [for]="picker"></ngx-mat-datepicker-toggle>
  <ngx-mat-datetime-picker #picker [showSpinners]="showSpinners" [showSeconds]="showSeconds"
    [stepHour]="stepHour" [stepMinute]="stepMinute" [stepSecond]="stepSecond" [touchUi]="touchUi"
    [color]="color" [enableMeridian]="enableMeridian" [disableMinute]="disableMinute" [hideTime]="hideTime">
  </ngx-mat-datetime-picker>
</mat-form-field>`;

  public code2 = `import {
           NgxMatDatetimePickerModule, 
           NgxMatNativeDateModule, 
           NgxMatTimepickerModule 
  } from '@angular-material-components/datetime-picker';
  
@NgModule({
  imports: [
    ...
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    ...
  ]
})
export class AppModule { }`;
  public code4 = 'npm install --save  @angular-material-components/moment-adapter';
  public code5 = `@Injectable()
export class CustomDateAdapter extends NgxMatDateAdapter<D> {...}
// D can be Date, Moment or customized type`;

  public code6 = `@NgModule({
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    }
  ],
})
export class CustomDateModule { }`;

  public code7 = `// If using Moment
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
  ]`;

  public code8 = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">';


  public code9 = `<mat-form-field>
  <input matInput [ngxMatDatetimePicker]="pickerCustomIcon" placeholder="Choose a date"
    [formControl]="dateControl" [min]="minDate" [max]="maxDate" [disabled]="disabled">
  <ngx-mat-datepicker-toggle matSuffix [for]="pickerCustomIcon"></ngx-mat-datepicker-toggle>
  <ngx-mat-datetime-picker #pickerCustomIcon [showSpinners]="showSpinners" [showSeconds]="showSeconds"
    [stepHour]="stepHour" [stepMinute]="stepMinute" [stepSecond]="stepSecond" [touchUi]="touchUi"
    [color]="color" [enableMeridian]="enableMeridian" [disableMinute]="disableMinute" [hideTime]="hideTime">
    <ngx-mat-datepicker-actions>
      <button mat-button ngxMatDatepickerCancel>Cancel</button>
      <button mat-raised-button color="primary" ngxMatDatepickerApply>Apply</button>
    </ngx-mat-datepicker-actions>
  </ngx-mat-datetime-picker>
</mat-form-field>`;

public code10 = `<mat-form-field>
<input matInput [ngxMatDatetimePicker]="pickerCustomIcon" placeholder="Choose a date"
  [formControl]="dateControl" [min]="minDate" [max]="maxDate" [disabled]="disabled">
<ngx-mat-datepicker-toggle matSuffix [for]="pickerCustomIcon">
  <mat-icon ngxMatDatepickerToggleIcon>keyboard_arrow_down</mat-icon>
</ngx-mat-datepicker-toggle>
<ngx-mat-datetime-picker #pickerCustomIcon [showSpinners]="showSpinners" [showSeconds]="showSeconds"
  [stepHour]="stepHour" [stepMinute]="stepMinute" [stepSecond]="stepSecond" [touchUi]="touchUi"
  [color]="color" [enableMeridian]="enableMeridian" [disableMinute]="disableMinute" [hideTime]="hideTime">
</ngx-mat-datetime-picker>
</mat-form-field>`;

  constructor() { }

  ngOnInit() {
    // this.picker.closedStream.subscribe(() => {
    //   console.log('closed');
    // })
    // this.picker.openedStream.subscribe(() => {
    //   console.log('opened');
    // })
  }

  toggleMinDate(evt: any) {
    if (evt.checked) {
      this._setMinDate();
    } else {
      this.minDate = null;
    }
  }

  toggleMaxDate(evt: any) {
    if (evt.checked) {
      this._setMaxDate();
    } else {
      this.maxDate = null;
    }
  }

  closePicker() {
    this.picker.cancel();
  }

  private _setMinDate() {
    const now = new Date();
    this.minDate = new Date();
    this.minDate.setDate(now.getDate() - 1);
  }


  private _setMaxDate() {
    const now = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(now.getDate() + 1);
  }

}
