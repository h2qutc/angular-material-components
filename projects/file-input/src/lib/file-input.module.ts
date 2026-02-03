import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatFileInputComponent, NgxMatFileInputIcon } from './file-input.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatFileInputComponent,
    NgxMatFileInputIcon,
  ],
  exports: [
    NgxMatFileInputComponent,
    NgxMatFileInputIcon
  ]
})
export class NgxMatFileInputModule { }
