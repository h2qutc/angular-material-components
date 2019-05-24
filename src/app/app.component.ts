import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public date: Date;
  public disabled = false;
  public showSpinners = true;

  public dateControl = new FormControl(new Date());

  constructor(private http: HttpClient, private zone: NgZone) {
  }

  ngOnInit() {
    this.date = new Date();
  }

}
