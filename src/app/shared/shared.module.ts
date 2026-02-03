import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatHighlightDirective } from './NgxMatHighlightDirective';


@NgModule({
  imports: [MatTabsModule, NgxMatHighlightDirective],
  exports: [NgxMatHighlightDirective, MatTabsModule]
})
export class SharedModule { }
