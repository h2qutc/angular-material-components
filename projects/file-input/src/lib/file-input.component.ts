import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ContentChild, Directive, DoCheck, ElementRef, forwardRef, Input, OnDestroy, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { FileOrArrayFile } from './file-input-type';

let nextUniqueId = 0;

@Directive({
  selector: '[ngxMatFileInputIcon]',
  standalone: true,
})
export class NgxMatFileInputIcon { }

@Component({
  selector: 'ngx-mat-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-file-input'
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: forwardRef(() => NgxMatFileInputComponent) }
  ],
  exportAs: 'ngx-mat-file-input',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class NgxMatFileInputComponent implements MatFormFieldControl<FileOrArrayFile>,
  OnDestroy, DoCheck, ControlValueAccessor {

  readonly stateChanges = new Subject<void>();
  
  @ViewChild('inputFile', { static: true }) private _inputFileRef: ElementRef;
  @ViewChild('inputValue', { static: true }) private _inputValueRef: ElementRef;

  /** Custom icon set by the consumer. */
  @ContentChild(NgxMatFileInputIcon) _customIcon: NgxMatFileInputIcon;

  @Input() color: ThemePalette = 'primary';

  public fileNames: string = null;

  protected _uid = `ngx-mat-fileinput-${nextUniqueId++}`;
  protected _previousNativeValue: any;
  _ariaDescribedby: string;

  focused: boolean = false;
  errorState: boolean = false;
  controlType: string = 'ngx-mat-file-input';
  autofilled: boolean = false;

  /** Function when touched */
  _onTouched = () => { };

  /** Function when changed */
  _onChange: (value: FileOrArrayFile) => void = () => { };

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

  @Input()
  get id(): string { return this._id; }
  set id(value: string) { this._id = value || this._uid; }
  protected _id: string;

  @Input()
  get multiple(): boolean { return this._multiple; }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  protected _multiple = false;

  @Input() placeholder: string = 'Choose a file';
  @Input() separator: string = ',';

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }
  protected _required = false;

  @Input() errorStateMatcher: ErrorStateMatcher;

  @Input()
  get value(): FileOrArrayFile { return this._value; }
  set value(value: FileOrArrayFile) {
    this._value = value;
  }
  protected _value: FileOrArrayFile;

  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
  private _readonly = true;

  /**
   * Limiting accepted file types
   * Example: accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.
   */
  @Input()
  get accept(): string { return this._accept; }
  set accept(value: string) {
    this._accept = value;
  }
  private _accept: string;

  constructor(protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    protected _platform: Platform,
    private _cd: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective,
    private _defaultErrorStateMatcher: ErrorStateMatcher) {

    this.id = this.id;

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

  }


  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }
  
  /** Updates the error state based on the provided error state matcher. */
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher?.isErrorState(control, parent) ?? false;

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: FileOrArrayFile): void {
    this._updateInputValue(value);
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._inputValueRef.nativeElement.focus(options);
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }

  }

  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._cd.markForCheck();
    this.stateChanges.next();
  }

  protected _isBadInput() {
    let validity = (this._inputValueRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  get empty(): boolean {
    return !this._inputValueRef.nativeElement.value && !this._isBadInput() &&
      !this.autofilled;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  openFilePicker(event?: MouseEvent) {
    this._inputFileRef.nativeElement.click();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this._markAsTouched();
  }

  handleFiles(filelist: FileList) {
    if (filelist.length > 0) {
      const files: Array<File> = new Array();
      for (let i = 0; i < filelist.length; i++) {
        files.push(filelist.item(i));
      }
      this._updateInputValue(files);
      this._resetInputFile();
      this._onChange(this.multiple ? files : files[0]);
    }
  }

  /** Handles a click on the control's container. */
  onContainerClick(event: MouseEvent) { };

  private _resetInputFile() {
    this._inputFileRef.nativeElement.value = "";
  }

  private _updateInputValue(files: FileOrArrayFile) {
    let text = null;
    if (files) {
      if (Array.isArray(files)) {
        text = this._multiple
          ? files.map(x => x.name).join(this.separator)
          : files[0].name;
      } else {
        text = files.name != null ? files.name : null;
      }
    }

    this._inputValueRef.nativeElement.value = text;
  }

}
