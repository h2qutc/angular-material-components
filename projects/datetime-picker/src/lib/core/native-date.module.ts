import { PlatformModule } from '@angular/cdk/platform';
import { importProvidersFrom, makeEnvironmentProviders, NgModule } from '@angular/core';
import { NgxMatDateAdapter } from './date-adapter';
import { NGX_MAT_DATE_FORMATS } from './date-formats';
import { NgxMatNativeDateAdapter } from './native-date-adapter';
import { NGX_MAT_NATIVE_DATE_FORMATS } from './native-date-formats';

@NgModule({
  imports: [PlatformModule],
  providers: [{ provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter }],
})
/**
 * @deprecated Use provideNgxNativeDate instead
 */
export class NgxNativeDateModule {}

@NgModule({
  imports: [NgxNativeDateModule],
  providers: [{ provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS }],
})
/**
 * @deprecated Use provideNgxMatNativeDate instead
 */
export class NgxMatNativeDateModule {}

export function provideNgxNativeDate() {
  return makeEnvironmentProviders([
    importProvidersFrom(PlatformModule),
    { provide: NgxMatDateAdapter, useClass: NgxMatNativeDateAdapter },
  ]);
}

export function provideNgxMatNativeDate() {
  return makeEnvironmentProviders([
    provideNgxNativeDate(),
    { provide: NGX_MAT_DATE_FORMATS, useValue: NGX_MAT_NATIVE_DATE_FORMATS },
  ]);
}
