/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '../../../datetime-picker/src/public-api';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from './moment-adapter';
import { NGX_MAT_MOMENT_FORMATS } from './moment-formats';

@NgModule({
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: NgxMatMomentAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    }
  ],
})
export class NgxMomentDateModule { }


@NgModule({
  imports: [NgxMomentDateModule],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_MOMENT_FORMATS }],
})
export class NgxMatMomentModule { }
