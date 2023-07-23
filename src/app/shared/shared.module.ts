import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatHighlightDirective } from './NgxMatHighlightDirective';


@NgModule({
  imports: [MatTabsModule],
  declarations: [NgxMatHighlightDirective],
  exports: [NgxMatHighlightDirective, MatTabsModule]
})
export class SharedModule { }
