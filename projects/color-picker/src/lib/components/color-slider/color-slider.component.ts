import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Color } from '../../models';
import { getColorAtPosition } from '../../helpers';

@Component({
  selector: 'ngx-mat-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss']
})
export class NgxMatColorSliderComponent implements OnInit {

  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();

  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  x: number = 0;
  y: number = 0;

  drag = false;

  rgba: string;

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('color-strip');
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.draw();
  }

  // private clearArc(ctx: CanvasRenderingContext2D, x: number, y: number) {
  //   ctx.beginPath();
  //   this.ctx.strokeStyle = 'white';
  //   this.ctx.arc(x, y, RADIUS_NOB, 0, 2 * Math.PI, false);
  //   this.ctx.stroke();
  //   this.ctx.closePath();
  // }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.rect(0, 0, this.width, this.height);
    const grd = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grd.addColorStop(0, 'rgba(255, 0, 0, 1)');
    grd.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    grd.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    grd.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    grd.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    grd.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    grd.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.ctx.fillStyle = grd;
    this.ctx.fill();
  }

  public onClicked(e: MouseEvent) {
    this._changeColor(e);
  }

  public onMousedown(e: MouseEvent) {
    this.drag = true;
    this._changeColor(e);
  }

  public onMousemove(e: MouseEvent) {
    if (this.drag) {
      this._changeColor(e);
    }
  }

  public onMouseup(e: MouseEvent) {
    this.drag = false;
  }

  private _changeColor(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    const { r, g, b } = getColorAtPosition(this.ctx, e.offsetX, e.offsetY);
    this.emitChange(new Color(r, g, b));
  }

  private emitChange(color: Color) {
    this.colorChanged.emit(color);
  }


}
