import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from 'projects/datetime-picker/src';
import { AppComponent } from './app.component';
import { DemoDatetimeComponent } from './demo-datetime/demo-datetime.component';
import { DemoTimeComponent } from './demo-time/demo-time.component';

const appRoutes: Routes = [
   { path: 'datetime', component: DemoDatetimeComponent },
   { path: 'time', component: DemoTimeComponent },
   { path: '', redirectTo: '/datetime', pathMatch: 'full' },
   { path: '**', redirectTo: '/datetime', pathMatch: 'full' }
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