import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatDatetimePickerModule } from './ngx-mat-datetime-picker/ngx-mat-datetime-picker.module';
import { MatTimePickerModule } from './ngx-mat-timepicker/ngx-mat-timepicker.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      HttpModule,
      BrowserAnimationsModule,
      MatDatepickerModule,
      MatInputModule,
      MatDatetimePickerModule,
      MatTimePickerModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }