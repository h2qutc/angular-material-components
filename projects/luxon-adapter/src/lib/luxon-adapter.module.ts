


import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import {NgModule} from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_LUXON_DATE_ADAPTER_OPTIONS, NgxMatLuxonDateAdapter } from './luxon-adapter';
import {MAT_LUXON_DATE_FORMATS} from './luxon-formats';

@NgModule({
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
