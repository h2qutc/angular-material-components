

/** @docs-private */
export function createMissingDateImplError(provider: string) {
  return Error(
    `NgxMatDatetimePicker: No provider found for ${provider}. You must import one of the following ` +
      `modules at your application root: NgxMatNativeDateModule, NgxMatMomentDateModule, or provide a ` +
      `custom implementation.`,
  );
}
