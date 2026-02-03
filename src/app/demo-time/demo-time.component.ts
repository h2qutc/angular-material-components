import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '../../../projects/datetime-picker/src/public-api';
import { SharedModule } from '../shared';

@Component({
  selector: 'app-demo-time',
  templateUrl: './demo-time.component.html',
  styleUrls: ['./demo-time.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    SharedModule
  ]
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
