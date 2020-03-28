import { NgModule } from '@angular/core';
import { NgxMatHighlightDirective } from './NgxMatHighlightDirective';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  imports: [MatTabsModule],
  declarations: [NgxMatHighlightDirective],
  exports: [NgxMatHighlightDirective, MatTabsModule]
})
export class SharedModule { }
