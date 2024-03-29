import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { Subject } from "rxjs";
import { Color } from "../../models";

@Directive({})
export abstract class NgxMatBaseColorCanvas
  implements OnDestroy, AfterViewInit
{
  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();
  @Input() color: Color | null = null;
  @Input() theme: ThemePalette;

  canvas: HTMLCanvasElement | null = null;

  elementId: string;

  ctx: CanvasRenderingContext2D | null = null;
  width: number | null = null;
  height: number | null = null;

  x: number = 0;
  y: number = 0;

  drag = false;

  protected _destroyed: Subject<void> = new Subject<void>();

  constructor(
    protected zone: NgZone,
    elementId: string,
  ) {
    this.elementId = elementId;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById(this.elementId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw();
  }

  protected draw() {
    if (!this.ctx) {
      console.error("No context found");
      return;
    }
    if (!this.width || !this.height) {
      console.error("No width and/or height found");
      return;
    }
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
      if (!this.canvas) {
        console.error(
          "Could not find canvas element to add mousemove event listener",
        );
        return;
      }
      this.canvas.addEventListener("mousemove", this.onMousemove.bind(this));
    });
  }

  public onMousemove(e: MouseEvent) {
    if (this.drag) {
      this.zone.run(() => {
        this.changeColor(e);
      });
    }
  }

  public onMouseup(_: MouseEvent) {
    this.drag = false;
    if (!this.canvas) {
      console.error(
        "Could not find canvas element to remove mousemove event listener",
      );
      return;
    }
    this.canvas.removeEventListener("mousemove", this.onMousemove);
  }

  public emitChange(color: Color) {
    this.colorChanged.emit(color);
  }

  abstract changeColor(e: MouseEvent): void;
  abstract fillGradient(): void;
  abstract redrawIndicator(x: number, y: number): void;
}
