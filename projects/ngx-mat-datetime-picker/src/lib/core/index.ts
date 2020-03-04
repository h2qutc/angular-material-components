/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { NgxMatDateAdapter } from './ngx-mat-date-adapter';
import { NgxMatNativeDateAdapter } from './ngx-mat-native-date-adapter';
import { NGX_MAT_NATIVE_DATE_FORMATS } from './ngx-mat-native-date-formats';

export * from './ngx-mat-date-adapter';
export * from './ngx-mat-native-date-adapter';
export * from './ngx-mat-native-date-formats';


@NgModule({
    imports: [PlatformModule],
    providers: [
        { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
    ],
})
export class NgxNativeDateModule { }

@NgModule({
    imports: [NgxNativeDateModule],
    providers: [{ provide: MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }],
})
export class NgxMatNativeDateModule { }
