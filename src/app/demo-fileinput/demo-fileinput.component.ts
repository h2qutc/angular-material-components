import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-demo-fileinput',
  templateUrl: './demo-fileinput.component.html',
  styleUrls: ['./demo-fileinput.component.scss']
})
export class DemoFileInputComponent implements OnInit {

  public color: ThemePalette = 'primary';
  public disabled: boolean;

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];

  public listColors = ['primary', 'accent', 'warn'];

  constructor() { }

  ngOnInit() { }

  onFileChanged(files: File) {
    console.log('selected files', files);
  }

}
