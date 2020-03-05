/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, NgxMatMomentAdapter } from './ngx-mat-moment-adapter';
import { NGX_MAT_MOMENT_FORMATS } from './ngx-mat-moment-formats';
import { NgxMatDateAdapter } from 'ngx-mat-core';

@NgModule({
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: NgxMatMomentAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    }
  ],
})
export class NgxMomentDateModule { }


@NgModule({
  imports: [NgxMomentDateModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: NGX_MAT_MOMENT_FORMATS }],
})
export class NgxMatMomentModule { }
