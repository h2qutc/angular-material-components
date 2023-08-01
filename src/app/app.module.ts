import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';

const appRoutes: Routes = [
   { path: 'home', component: HomeComponent },
   {
      path: 'datetimepicker',
      loadChildren: () => import('./demo-datetime/demo-datetime.module').then(m => m.DemoDatetimeModule)
   },
   {
      path: 'timepicker',
      loadChildren: () => import('./demo-time/demo-time.module').then(m => m.DemoTimeModule)
   },
   {
      path: 'colorpicker',
      loadChildren: () => import('./demo-colorpicker/demo-colorpicker.module').then(m => m.DemoColorpickerModule)
   },
   {
      path: 'fileinput',
      loadChildren: () => import('./demo-fileinput/demo-fileinput.module').then(m => m.DemoFileInputModule)
   },
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: '**', redirectTo: '/home', pathMatch: 'full' }
]

@NgModule({
   imports: [
      RouterModule.forRoot(
         appRoutes,
         {
            useHash: true
         }
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
      HomeComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      MatButtonModule,
      MatSidenavModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatCardModule
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }