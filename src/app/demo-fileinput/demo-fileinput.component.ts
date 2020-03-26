import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';

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


  fileControl: FormControl;

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  model = null;

  files;

  constructor() {
    this.fileControl = new FormControl(this.files, [Validators.required])
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

}
