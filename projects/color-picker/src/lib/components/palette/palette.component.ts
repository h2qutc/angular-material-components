import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Color } from '../../models';

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

  @Output() change: EventEmitter<Color> = new EventEmitter<Color>();

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

  rgbaColor = 'rgba(255,0,0,1)';
  drag = false;

  constructor() {

  }

  ngOnInit() {

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
    this.ctxBlock.fillStyle = this.rgbaColor;

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
    const color = new Color(imageData[0], imageData[1], imageData[2]);
    this.rgbaColor = color.toString();
    this.fillGradient();
    this.emitChange(color);
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
    const color = new Color(imageData[0], imageData[1], imageData[2]);
    this.rgbaColor = color.toString();
    this.emitChange(color);
    //colorLabel.style.backgroundColor = rgbaColor;
  }

  private emitChange(color: Color) {
    this.change.emit(color);
  }




}
