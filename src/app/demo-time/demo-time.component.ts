import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ThemePalette } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import {
  NgxMatDatepickerInput,
  NgxMatNativeDateModule,
} from "projects/datetime-picker/src";
import { NgxMatTimepickerComponent } from "../../../projects/datetime-picker/src/lib/timepicker.component";
import { NgxMatHighlightDirective } from "../shared/NgxMatHighlightDirective";

@Component({
  selector: "app-demo-time",
  templateUrl: "./demo-time.component.html",
  styleUrls: ["./demo-time.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    NgxMatDatepickerInput,
    NgxMatHighlightDirective,
    NgxMatNativeDateModule,
    NgxMatTimepickerComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class DemoTimeComponent {
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public disableMinute = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = "primary";

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
    { value: true, label: "True" },
    { value: false, label: "False" },
  ];

  public listColors = ["primary", "accent", "warn"];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
}
