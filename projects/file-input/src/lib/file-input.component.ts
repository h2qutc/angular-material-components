import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Platform } from "@angular/cdk/platform";
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
} from "@angular/forms";
import {
  CanUpdateErrorState,
  ErrorStateMatcher,
  mixinErrorState,
  ThemePalette,
} from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { FileOrArrayFile } from "./file-input-type";

let nextUniqueId = 0;

const _NgxMatInputMixinBase = mixinErrorState(
  class {
    readonly stateChanges = new Subject<void>();

    constructor(
      public _defaultErrorStateMatcher: ErrorStateMatcher,
      public _parentForm: NgForm,
      public _parentFormGroup: FormGroupDirective,
      /** @docs-private */
      public ngControl: NgControl,
    ) {}
  },
);

@Directive({
  selector: "[ngxMatFileInputIcon]",
})
export class NgxMatFileInputIcon {}

@Component({
  selector: "ngx-mat-file-input",
  templateUrl: "file-input.component.html",
  styleUrls: ["file-input.component.scss"],
  host: {
    class: "ngx-mat-file-input",
  },
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => NgxMatFileInputComponent),
    },
  ],
  exportAs: "ngx-mat-file-input",
})
export class NgxMatFileInputComponent
  extends _NgxMatInputMixinBase
  implements
    MatFormFieldControl<FileOrArrayFile>,
    OnDestroy,
    DoCheck,
    CanUpdateErrorState,
    ControlValueAccessor
{
  @ViewChild("inputFile", { static: true }) private _inputFileRef!: ElementRef;
  @ViewChild("inputValue", { static: true })
  private _inputValueRef!: ElementRef;

  /** Custom icon set by the consumer. */
  @ContentChild(NgxMatFileInputIcon) _customIcon: NgxMatFileInputIcon | null =
    null;

  @Input() color: ThemePalette = "primary";

  public fileNames: string | null = null;

  protected _uid = `ngx-mat-fileinput-${nextUniqueId++}`;
  _ariaDescribedby: string | null = null;

  readonly stateChanges: Subject<void> = new Subject<void>();
  focused: boolean = false;
  errorState: boolean = false;
  controlType: string = "ngx-mat-file-input";
  autofilled: boolean = false;

  /** Function when touched */
  _onTouched = () => {};

  /** Function when changed */
  _onChange: (value: FileOrArrayFile) => void = () => {};

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
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id: string = this._uid;

  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  protected _multiple = false;

  @Input() placeholder: string = "Choose a file";
  @Input() separator: string = ",";

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  protected _required = false;

  @Input() errorStateMatcher: ErrorStateMatcher =
    this._defaultErrorStateMatcher;

  @Input()
  get value(): FileOrArrayFile | null {
    return this._value;
  }
  set value(value: FileOrArrayFile | null) {
    this._value = value;
  }
  protected _value: FileOrArrayFile | null = null;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = true;

  /**
   * Limiting accepted file types
   * Example: accept="image/png, image/jpeg" or accept=".png, .jpg, .jpeg" — Accept PNG or JPEG files.
   */
  @Input()
  get accept(): string | null {
    return this._accept;
  }
  set accept(value: string | null) {
    this._accept = value;
  }
  private _accept: string | null = null;

  constructor(
    protected _elementRef: ElementRef<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    protected _platform: Platform,
    private _cd: ChangeDetectorRef,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

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

  // Implemented as part of ControlValueAccessor.
  writeValue(value: FileOrArrayFile): void {
    this._updateInputValue(value);
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: unknown) => void): void {
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
    const validity = (this._inputValueRef.nativeElement as HTMLInputElement)
      .validity;
    return validity && validity.badInput;
  }

  get empty(): boolean {
    return (
      !this._inputValueRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(" ");
  }

  openFilePicker(event?: MouseEvent) {
    this._inputFileRef.nativeElement.click();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this._markAsTouched();
  }

  handleFiles($event: Event) {
    const fileList = ($event.target as HTMLInputElement).files;
    if (fileList === null) {
      throw new Error("File list is null");
    }
    if (fileList.length > 0) {
      const files: Array<File> = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file !== null) {
          files.push(file);
        } else {
          console.error("File not found");
        }
      }
      this._updateInputValue(files);
      this._resetInputFile();
      this._onChange(this.multiple ? files : files[0]);
    }
  }

  /** Handles a click on the control's container. */
  onContainerClick() {}

  private _resetInputFile() {
    this._inputFileRef.nativeElement.value = "";
  }

  private _updateInputValue(files: FileOrArrayFile) {
    let text = null;
    if (files) {
      if (Array.isArray(files)) {
        text = this._multiple
          ? files.map((x) => x.name).join(this.separator)
          : files[0].name;
      } else {
        text = files.name != null ? files.name : null;
      }
    }

    this._inputValueRef.nativeElement.value = text;
  }
}
