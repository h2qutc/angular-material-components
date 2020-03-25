import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'ngx-mat-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-file-input'
  },
  providers: [{ provide: MatFormFieldControl, useExisting: NgxMatFileInputComponent }],
})
export class NgxMatFileInputComponent implements OnInit, MatFormFieldControl<any> {

  @ViewChild('inputFile') private _inputFileRef: ElementRef;

  @Input() disabled: boolean;
  @Input() color: ThemePalette;

  @Output() fileChanged = new EventEmitter<File>();

  selectedFile: File;

  public fileNames: string = null;

  constructor() { }
  value: any;
  stateChanges: Observable<void>;
  id: string;
  placeholder: string;
  ngControl: NgControl;
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean;
  required: boolean;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;

  ngOnInit() {
  }

  ngAfterContentInit() {

  }

  onClick = (event: any) => {
    this._inputFileRef.nativeElement.click();
    event.preventDefault();
  }

  handleFileInput(files: FileList) {
    const selected = files.item(0);
    if (selected != null) {
      this._resetInputFile();
      this.fileNames = selected.name;
      this.fileChanged.emit(selected);
    }
  }


  /** Sets the list of element IDs that currently describe this control. */
  setDescribedByIds(ids: string[]) {

  };

  /** Handles a click on the control's container. */
  onContainerClick(event: MouseEvent) {

  };

  private _resetInputFile() {
    this._inputFileRef.nativeElement.value = "";
  }

}
