import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from 'projects/ngx-mat-datetime-picker/src/public-api';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DemoTimeComponent } from './demo-time/demo-time.component';
import { DemoDatetimeComponent } from './demo-datetime/demo-datetime.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
   { path: '', redirectTo: '/datetime', pathMatch: 'full' },
   { path: 'datetime', component: DemoDatetimeComponent },
   { path: 'time', component: DemoTimeComponent },
]

@NgModule({
   imports: [
      RouterModule.forRoot(
         appRoutes,
      )
   ],
   exports: [
      RouterModule
   ]
})
export class AppRoutingModule { }

@NgModule({
   declarations: [
      AppComponent,
      DemoTimeComponent,
      DemoDatetimeComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      MatDatepickerModule,
      MatInputModule,
      NgxMatDatetimePickerModule,
      NgxMatTimepickerModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      NgxMatNativeDateModule,
      MatRadioModule,
      MatSelectModule,
      MatCheckboxModule,
      MatSidenavModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatCardModule,
      MatDividerModule
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }