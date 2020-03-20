import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoColorpickerComponent } from './demo-colorpicker.component';

const routes: Routes = [
  { path: '', component: DemoColorpickerComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes,
    ),
  ],
  declarations: [DemoColorpickerComponent]
})
export class DemoColorpickerModule { }
