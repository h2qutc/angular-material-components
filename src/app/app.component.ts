import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('picker') picker: any;

  public date: Date;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public minDate: Date;
  public maxDate: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(new Date());
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  public codeDatePicker = `
<mat-form-field>
  <input matInput [ngxMatDatetimePicker]="picker" 
                  placeholder="Choose a date" 
                  [formControl]="dateControl"
                  [min]="minDate" [max]="maxDate" 
                  [disabled]="disabled">
  <mat-datepicker-toggle matSuffix [for]="picker">
  </mat-datepicker-toggle>
  <ngx-mat-datetime-picker #picker 
    [showSpinners]="showSpinners" 
    [showSeconds]="showSeconds"
    [stepHour]="stepHour" [stepMinute]="stepMinute" 
    [stepSecond]="stepSecond"
    [touchUi]="touchUi"
    [color]="color">
  </ngx-mat-datetime-picker>
</mat-form-field>`;

  public codeTimePicker = `
<ngx-mat-timepicker 
            [(ngModel)]="date" [disabled]="disabled" 
            [showSpinners]="showSpinners"
            [stepHour]="stepHour" [stepMinute]="stepMinute" 
            [stepSecond]="stepSecond" 
            [showSeconds]="showSeconds">
</ngx-mat-timepicker>`;


  public codeFormGroup = `
  <div [formGroup]="formGroup">
    <mat-form-field>
      <input matInput [ngxMatDatetimePicker]="picker1" 
      placeholder="Choose a date" formControlName="date">
      <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
      <ngx-mat-datetime-picker #picker1></ngx-mat-datetime-picker>
    </mat-form-field>
  </div>`;

  public code1 = `formGroup.get('date').value?.toLocaleString()`;

  public codeFormGroup2 = `
  <form [formGroup]="formGroup">
    <ngx-mat-timepicker formControlName="date2"></ngx-mat-timepicker>
  </form>`;

  public code2 = `formGroup.get('date2').value?.toLocaleString()`;

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  ngOnInit() {
    this.date = null;
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
