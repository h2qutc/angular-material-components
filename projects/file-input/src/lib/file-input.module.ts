import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NgxMatFileInputComponent, NgxMatFileInputIcon } from './file-input.component';

@NgModule({
  declarations: [
    NgxMatFileInputComponent,
    NgxMatFileInputIcon
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    NgxMatFileInputComponent,
    NgxMatFileInputIcon
  ]
})
export class NgxMatFileInputModule { }
