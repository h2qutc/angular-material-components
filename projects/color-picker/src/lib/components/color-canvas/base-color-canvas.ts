import { AfterViewInit, Directive, EventEmitter, Input, NgZone, OnDestroy, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { Color } from '../../models';

@Directive({

})
export abstract class NgxMatBaseColorCanvas implements OnDestroy, AfterViewInit {

	@Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();
	@Input() color: Color;
	@Input() theme: ThemePalette;

	canvas: HTMLCanvasElement;

	elementId: string;

	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;

	x: number = 0;
	y: number = 0;

	drag = false;

	protected _destroyed: Subject<void> = new Subject<void>();

	constructor(protected zone: NgZone, elementId: string) {
		this.elementId = elementId;
	}

	ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}

	ngAfterViewInit(): void {
		this.canvas = <HTMLCanvasElement>document.getElementById(this.elementId);
		this.ctx = this.canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
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

		this.zone.runOutsideAngular(() => {
			this.canvas.addEventListener('mousemove', this.onMousemove.bind(this));
		})
	}

	public onMousemove(e: MouseEvent) {
		if (this.drag) {
			this.zone.run(() => {
				this.changeColor(e);
			})
		}
	}

	public onMouseup(e: MouseEvent) {
		this.drag = false;
		this.canvas.removeEventListener('mousemove', this.onMousemove);
	}

	public emitChange(color: Color) {
		this.colorChanged.emit(color);
	}

	abstract changeColor(e: MouseEvent): void;
	abstract fillGradient(): void;
	abstract redrawIndicator(x: number, y: number): void;

}
