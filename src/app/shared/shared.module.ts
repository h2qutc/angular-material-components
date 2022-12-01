import { NgModule } from '@angular/core';
import { NgxMatHighlightDirective } from './NgxMatHighlightDirective';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';


@NgModule({
  imports: [MatTabsModule],
  declarations: [NgxMatHighlightDirective],
  exports: [NgxMatHighlightDirective, MatTabsModule]
})
export class SharedModule { }
