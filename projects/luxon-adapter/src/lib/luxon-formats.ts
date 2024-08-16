/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {MatDateFormats} from '@angular/material/core';

export const MAT_LUXON_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D hh:mm',
  },
  display: {
    dateInput: 'D hh:mm',
    monthYearLabel: 'LLL yyyy hh:mm',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'LLLL yyyy hh:mm',
  },
};
