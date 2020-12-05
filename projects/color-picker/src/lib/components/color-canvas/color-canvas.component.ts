import { AfterViewInit, Component, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { getColorAtPosition, matchers, stringInputToObject } from '../../helpers';
import { Color } from '../../models';
import { NgxMatBaseColorCanvas } from './base-color-canvas';

const RADIUS_NOB = 5;

@Component({
  selector: 'ngx-mat-color-canvas',
  templateUrl: './color-canvas.component.html',
  styleUrls: ['./color-canvas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ngx-mat-color-canvas'
  }
})
export class NgxMatColorCanvasComponent extends NgxMatBaseColorCanvas
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private _baseColor: Color;

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

  _resetBaseColor = true;

  formGroup: FormGroup;

  rgba: string;

  constructor(protected zone: NgZone) {
    super(zone, 'color-block');
    this.formGroup = new FormGroup({
      r: new FormControl(null, [Validators.required]),
      g: new FormControl(null, [Validators.required]),
      b: new FormControl(null, [Validators.required]),
      a: new FormControl(null, [Validators.required]),
      hex: new FormControl(null, [Validators.required, Validators.pattern(matchers.hex6)]),
    });
  }

  ngOnInit() {

    const rgbaCtrl$ = merge(this.rCtrl.valueChanges, this.gCtrl.valueChanges,
      this.bCtrl.valueChanges, this.aCtrl.valueChanges);
    rgbaCtrl$.pipe(takeUntil(this._destroyed), debounceTime(400))
      .subscribe(_ => {
        const color = new Color(Number(this.rCtrl.value),
          Number(this.gCtrl.value), Number(this.bCtrl.value), Number(this.aCtrl.value));
        this.emitChange(color);
      });

    const hexCtrl$ = this.hexCtrl.valueChanges;
    hexCtrl$.pipe(takeUntil(this._destroyed), debounceTime(400), distinctUntilChanged())
      .subscribe(hex => {
        const obj = stringInputToObject(hex);
        if (obj != null) {
          const color = new Color(obj.r, obj.g, obj.b, obj.a);
          this.emitChange(color);
        }
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color && changes.color.currentValue) {
      this.updateForm(changes.color.currentValue);
      if (this._resetBaseColor) {
        this._baseColor = changes.color.currentValue;
      }

      this._resetBaseColor = true;

      if (!changes.color.firstChange) {
        this.draw();
      }
    }
  }

  private updateForm(val: Color): void {
    const config = { emitEvent: false };
    this.rCtrl.setValue(val.r, config);
    this.gCtrl.setValue(val.g, config);
    this.bCtrl.setValue(val.b, config);
    this.aCtrl.setValue(val.a, config);
    this.hexCtrl.setValue(val.hex, config);
  }

  public redrawIndicator(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.arc(x, y, RADIUS_NOB, 0, 2 * Math.PI, false);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  public fillGradient() {
    this.ctx.fillStyle = this._baseColor ? this._baseColor.rgba : 'rgba(255,255,255,1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const grdWhite = this.ctx.createLinearGradient(0, 0, this.width, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    this.ctx.fillStyle = grdWhite;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const grdBlack = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    this.ctx.fillStyle = grdBlack;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public onSliderColorChanged(c: Color) {
    this._baseColor = c;
    this.color = c;
    this.fillGradient();
    this.emitChange(c);
  }

  public changeColor(e: MouseEvent): void {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this._resetBaseColor = false;
    this.draw();
    const { r, g, b } = getColorAtPosition(this.ctx, e.offsetX, e.offsetY);
    this.emitChange(new Color(r, g, b));
  }

}
