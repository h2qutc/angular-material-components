import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMatFileInputComponent } from './file-input.component';

@NgModule({
  declarations: [NgxMatFileInputComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [NgxMatFileInputComponent]
})
export class NgxMatFileInputModule { }
