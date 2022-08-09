import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { AcceptValidator, MaxSizeValidator } from '../../../projects/file-input/src';

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
  file2Control: FormControl;
  file3Control: FormControl;

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

  code3 = `<mat-form-field>
  <ngx-mat-file-input [formControl]="fileControl" [multiple]="multiple" [accept]="accept" [color]="color">
    <!-- <mat-icon ngxMatFileInputIcon>folder</mat-icon> -->
  </ngx-mat-file-input>
</mat-form-field>`;

  code4 = `<mat-form-field>
  <ngx-mat-file-input [formControl]="file2Control" [multiple]="multiple" [accept]="accept" [color]="color">
    <mat-icon ngxMatFileInputIcon>folder</mat-icon>
  </ngx-mat-file-input>
</mat-form-field>`;
  code5 = `<mat-form-field appearance="outline">
  <ngx-mat-file-input [formControl]="file3Control">
  </ngx-mat-file-input>
  <mat-hint>Hint</mat-hint>
</mat-form-field>`;

  code1 = `npm install --save @angular-material-components/file-input`;

  code2 = `import { NgxMatFileInputModule } from '@angular-material-components/file-input';
  
  @NgModule({
     ...
     imports: [
          ...
          NgxMatFileInputModule
     ]
     ...
  })
  export class AppModule { }`;

  public code6 = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" rel="stylesheet">';

  maxSize = 16;
  nbFiles = 0;

  constructor() {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])

    this.file2Control = new FormControl(this.files);

    this.file3Control = new FormControl(this.files);
  }

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
    })

    this.file3Control.valueChanges.subscribe((files: any) => {
      let data: any;
      if (!Array.isArray(files)) {
        data = [files];
      } else {
        data = files;
      }
      this.nbFiles = data.length;
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
