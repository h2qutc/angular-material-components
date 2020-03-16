import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('picker') picker: any;

  public date: Date;
  public disabled = false;
  public showSpinners = true;
  public disableSecond = true;
  public minDate: Date;
  public maxDate: Date;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(new Date());
  public dateControlMinMax = new FormControl(new Date());

  constructor(private http: HttpClient, private zone: NgZone) {
    this.minDate = new Date();
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.date = null;
    const now = new Date();
    this.minDate.setDate(now.getDate() - 1);
    this.maxDate.setDate(now.getDate() + 1);
  }

  closePicker() {
    this.picker.cancel();
  }

}
