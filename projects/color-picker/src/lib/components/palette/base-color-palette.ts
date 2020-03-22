import { EventEmitter, Output, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Color } from '../../models';
import { Subject } from 'rxjs';

export abstract class BaseColorPalette implements OnDestroy, AfterViewInit {

	@Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();
	@Input() color: Color;

	elementId: string;

	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;

	x: number = 0;
	y: number = 0;

	drag = false;

	protected _destroyed: Subject<void> = new Subject<void>();

	constructor(elementId: string) {
		this.elementId = elementId;
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	ngAfterViewInit(): void {
		const canvas = <HTMLCanvasElement>document.getElementById(this.elementId);
		this.ctx = canvas.getContext('2d');
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw();
	}

	protected draw() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.rect(0, 0, this.width, this.height);
		this.fillGradient();
		if (this.y != 0) {
			this.redrawIndicator(this.x, this.y);
		}
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

	public emitChange(color: Color) {
		this.colorChanged.emit(color);
	}

	abstract changeColor(e: MouseEvent): void;
	abstract fillGradient(): void;
	abstract redrawIndicator(x: number, y: number): void;

}
