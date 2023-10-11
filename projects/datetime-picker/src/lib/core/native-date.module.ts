

import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';
import { NgxMatDateAdapter } from './date-adapter';
import { NgxMatNativeDateAdapter } from './native-date-adapter';
import { NGX_MAT_NATIVE_DATE_FORMATS } from './native-date-formats';
import { NGX_MAT_DATE_FORMATS } from './date-formats';


@NgModule({
    imports: [PlatformModule],
    providers: [
        { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
    ],
})
export class NgxNativeDateModule { }

@NgModule({
    imports: [NgxNativeDateModule],
    providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }],
})
export class NgxMatNativeDateModule { }
