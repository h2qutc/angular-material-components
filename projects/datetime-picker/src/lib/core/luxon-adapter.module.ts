


import { NgxMatDateAdapter } from './date-adapter';
import { NGX_MAT_DATE_FORMATS } from './date-formats';
import {NgModule} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, NgxMatLuxonDateAdapter } from './luxon-adapter';
import {MAT_LUXON_DATE_FORMATS} from './luxon-formats';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  imports: [PlatformModule],
  providers: [

    {
      provide: NgxMatDateAdapter,
      useClass: NgxMatLuxonDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class NgxLuxonDateModule {}


@NgModule({
  imports: [NgxLuxonDateModule],
  providers: [{provide: NGX_MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS}],
})
export class NgxMatLuxonDateModule {}
