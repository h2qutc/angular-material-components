import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public date: Date;
  public disabled = false;
  public showSpinners = true;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(new Date());

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  ngOnInit() {
    this.date = new Date();
  }

}
