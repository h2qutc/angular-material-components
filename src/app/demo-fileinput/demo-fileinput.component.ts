import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AcceptValidator, MaxSizeValidator } from 'projects/file-input/src';

const presetFiles = [new File([], "file 1"), new File([], "file 2")];
const presetFile = new File([], "file 1");

@Component({
  selector: 'app-demo-fileinput',
  templateUrl: './demo-fileinput.component.html',
  styleUrls: ['./demo-fileinput.component.scss']
})
export class DemoFileInputComponent implements OnInit {

  color: ThemePalette = 'primary';
  disabled: boolean = false;
  multiple: boolean = false;
  accept: string;

  fileControl: FormControl;

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];
  public listAccepts = [
    null,
    ".png",
    "image/*",
    ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  public files;

  code3=`<mat-form-field>
  <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept" [color]="color">
    <!-- <mat-icon ngxMatFileInputIcon>folder</mat-icon> -->
  </ngx-mat-file-input>
</mat-form-field>`;

code4=`<mat-form-field>
  <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept" [color]="color">
    <mat-icon ngxMatFileInputIcon>folder</mat-icon>
  </ngx-mat-file-input>
</mat-form-field>`;

  code1=`npm install --save @angular-material-components/file-input`;

  code2=`import { NgxMatFileInputModule } from '@angular-material-components/file-input';

  @NgModule({
     ...
     imports: [
          ...
          NgxMatFileInputModule
     ]
     ...
  })
  export class AppModule { }`;

  maxSize = 16;

  constructor() {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])
  }

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
    })
  }

  onDisabledChanged(value: boolean) {
    if (!value) {
      this.fileControl.enable();
    } else {
      this.fileControl.disable();
    }
  }

}
