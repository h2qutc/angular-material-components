import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { Component, DoCheck, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorState, ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MAT_INPUT_VALUE_ACCESSOR, _MatInputMixinBase } from '@angular/material/input';
import { Subject } from 'rxjs';

let nextUniqueId = 0;

// class MatFileInputBase {
//   constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
//               public _parentForm: NgForm,
//               public _parentFormGroup: FormGroupDirective,
//               public ngControl: NgControl) {}
// }
// const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
//     mixinErrorState(MatInputBase);

@Component({
  selector: 'ngx-mat-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-file-input'
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: NgxMatFileInputComponent }
  ]
})
export class NgxMatFileInputComponent extends _MatInputMixinBase implements OnInit, MatFormFieldControl<File>,
  OnDestroy, OnInit, DoCheck, CanUpdateErrorState {

  @ViewChild('inputFile') private _inputFileRef: ElementRef;

  @Input() color: ThemePalette;

  @Output() fileChanged = new EventEmitter<File>();

  selectedFile: File;

  public fileNames: string = null;

  protected _uid = `ngx-mat-fileinput-${nextUniqueId++}`;
  private _inputValueAccessor: { value: any };
  protected _previousNativeValue: any;
  _ariaDescribedby: string;

  readonly stateChanges: Subject<void> = new Subject<void>();
  focused: boolean = false;
  errorState: boolean;
  controlType: string = 'ngx-mat-fileinput';
  autofilled: boolean = false;

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
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
  set multiple(value: boolean) { this._multiple = value; }
  protected _multiple = true;

  @Input() placeholder: string;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }
  protected _required = false;

  @Input() errorStateMatcher: ErrorStateMatcher;

  @Input()
  get value(): File { return this._inputValueAccessor.value; }
  set value(value: File) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
  private _readonly = true;

  constructor(protected _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    protected _platform: Platform,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() @Inject(MAT_INPUT_VALUE_ACCESSOR) inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    const element = this._elementRef.nativeElement;

    this._inputValueAccessor = inputValueAccessor || element;

    this.id = this.id;

  }


  ngOnInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();

    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
    this._dirtyCheckNativeValue();
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }

  }

  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    let validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  get empty(): boolean {
    return !this._elementRef.nativeElement.value && !this._isBadInput() &&
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
  }

  handleFiles(files: FileList) {
    const selected = files.item(0);
    if (selected != null) {
      this._resetInputFile();
      this.fileNames = selected.name;
      this.fileChanged.emit(selected);
    }
  }

  /** Handles a click on the control's container. */
  onContainerClick(event: MouseEvent) {
    console.log('onContainerClick');
    if (!this.focused) {
      this.focus();
    }
  };

  private _resetInputFile() {
    this._inputFileRef.nativeElement.value = "";
  }

}
