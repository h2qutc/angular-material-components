import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  Input,
  HostBinding,
} from "@angular/core";
import { Color } from "../../models";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "ngx-mat-color-palette",
  templateUrl: "color-palette.component.html",
  styleUrls: ["color-palette.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatColorPaletteComponent {
  @HostBinding("class") class = "ngx-mat-color-palette";
  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();

  @Input() color: Color | null = null;
  @Input() theme: ThemePalette;

  public handleColorChanged(color: Color) {
    this.colorChanged.emit(color);
  }
}
