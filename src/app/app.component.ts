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

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public disableSecond = true;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(moment());

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  ngOnInit() {
    this.date = null;
  }

  closePicker() {
    this.picker.cancel();
  }

}
