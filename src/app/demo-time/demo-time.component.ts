import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-demo-time',
  templateUrl: './demo-time.component.html',
  styleUrls: ['./demo-time.component.scss']
})
export class DemoTimeComponent implements OnInit {

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public disableMinute = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  public codeTimePicker = `<ngx-mat-timepicker 
              [(ngModel)]="date" [disabled]="disabled" 
              [showSpinners]="showSpinners"
              [stepHour]="stepHour" [stepMinute]="stepMinute" 
              [stepSecond]="stepSecond" 
              [showSeconds]="showSeconds"
              [color]="color">
  </ngx-mat-timepicker>`;


  public date: Date = new Date();

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  constructor() { }

  ngOnInit() { }

}
