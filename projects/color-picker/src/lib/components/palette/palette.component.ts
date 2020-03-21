import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { Color } from '../../models';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NUMERIC_REGEX } from '../../helpers';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ngx-mat-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-palette'
  }
})
export class NgxMatPaletteComponent implements OnInit, AfterViewInit {

  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();

  @Input()
  set color(val: Color) {
    console.log('color', val);
    const config = { emitEvent: false };
    this._color = val;
    this.rCtrl.setValue(val.r, config);
    this.gCtrl.setValue(val.g, config);
    this.bCtrl.setValue(val.b, config);
    this.aCtrl.setValue(val.a, config);
    this.hexCtrl.setValue(val.hex, config);
  }
  _color: Color;

  get rCtrl(): AbstractControl {
    return this.formGroup.get('r');
  }

  get gCtrl(): AbstractControl {
    return this.formGroup.get('g');
  }

  get bCtrl(): AbstractControl {
    return this.formGroup.get('b');
  }

  get aCtrl(): AbstractControl {
    return this.formGroup.get('a');
  }

  get hexCtrl(): AbstractControl {
    return this.formGroup.get('hex');
  }

  canvasBlock: HTMLCanvasElement;
  canvasStrip: HTMLCanvasElement;

  ctxBlock: CanvasRenderingContext2D;
  ctxStrip: CanvasRenderingContext2D;

  widthBlock: number;
  heightBlock: number;
  widthStrip: number;
  heightStrip: number;

  x: number = 0;
  y: number = 0;

  drag = false;

  formGroup: FormGroup;

  rgba: string;

  constructor() {
    this.formGroup = new FormGroup({
      r: new FormControl(null, [Validators.required]),
      g: new FormControl(null, [Validators.required]),
      b: new FormControl(null, [Validators.required]),
      a: new FormControl(null, [Validators.required]),
      hex: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(values => {
        console.log('values changes', values);
        this._color = new Color(Number(this.rCtrl.value),
          Number(this.gCtrl.value), Number(this.bCtrl.value), Number(this.aCtrl.value));
        this.emitChange(this._color);
      })
  }

  ngAfterViewInit(): void {
    this.canvasBlock = <HTMLCanvasElement>document.getElementById('color-block');
    this.ctxBlock = this.canvasBlock.getContext('2d');
    this.widthBlock = this.canvasBlock.width;
    this.heightBlock = this.canvasBlock.height;

    this.canvasStrip = <HTMLCanvasElement>document.getElementById('color-strip');
    this.ctxStrip = this.canvasStrip.getContext('2d');
    this.widthStrip = this.canvasStrip.width;
    this.heightStrip = this.canvasStrip.height;

    this.drawBlock();
  }

  /**
  * Format input
  * @param input 
  */
  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(NUMERIC_REGEX, '');
  }

  private drawBlock() {
    this.ctxBlock.rect(0, 0, this.widthBlock, this.heightBlock);
    this.fillGradient();

    this.ctxStrip.rect(0, 0, this.widthStrip, this.heightStrip);
    const grd = this.ctxStrip.createLinearGradient(0, 0, 0, this.heightBlock);
    grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd.addColorStop(1, 'rgba(255, 0, 0, 1)');
    this.ctxStrip.fillStyle = grd;
    this.ctxStrip.fill();
  }

  private fillGradient() {
    this.ctxBlock.fillStyle = this._color.rgba;

    this.ctxBlock.fillRect(0, 0, this.widthBlock, this.heightBlock);

    const grdWhite = this.ctxStrip.createLinearGradient(0, 0, this.widthBlock, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    this.ctxBlock.fillStyle = grdWhite;
    this.ctxBlock.fillRect(0, 0, this.widthBlock, this.heightBlock);

    const grdBlack = this.ctxStrip.createLinearGradient(0, 0, 0, this.heightBlock);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    this.ctxBlock.fillStyle = grdBlack;
    this.ctxBlock.fillRect(0, 0, this.widthBlock, this.heightBlock);
  }

  public onStripClicked(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    const imageData: Uint8ClampedArray = this.ctxStrip.getImageData(this.x, this.y, 1, 1).data;
    this.color = new Color(imageData[0], imageData[1], imageData[2]);
    this.fillGradient();
    this.emitChange(this._color);
  }

  public onMousedown(e: MouseEvent) {
    this.drag = true;
    this.changeColor(e);
  }

  public onMousemove(e: MouseEvent) {
    if (this.drag) {
      this.changeColor(e);
    }
  }

  public onMouseup(e: MouseEvent) {
    this.drag = false;
  }

  private changeColor(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    const imageData: Uint8ClampedArray = this.ctxBlock.getImageData(this.x, this.y, 1, 1).data;
    this.color = new Color(imageData[0], imageData[1], imageData[2]);
    this.emitChange(this._color);
  }

  private emitChange(color: Color) {
    this.colorChanged.emit(color);
  }




}
