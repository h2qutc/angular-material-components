import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  Input,
  HostBinding,
} from "@angular/core";
import { Color } from "../../models";
import { BASIC_COLORS, stringInputToObject } from "../../helpers";

@Component({
  selector: "ngx-mat-color-collection",
  templateUrl: "./color-collection.component.html",
  styleUrls: ["./color-collection.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NgxMatColorCollectionComponent {
  @HostBinding("class") class = "ngx-mat-color-collection";
  @Output() colorChanged: EventEmitter<Color> = new EventEmitter<Color>();

  @Input()
  set color(c: Color) {
    if (c) {
      this.selectedColor = c.toHexString();
    }
  }

  selectedColor: string | null = null;

  colors1: string[] = BASIC_COLORS.slice(0, 8);
  colors2: string[] = BASIC_COLORS.slice(8, 16);

  select(hex: string) {
    this.selectedColor = hex;
    const inputToObject = stringInputToObject(hex);
    if (!inputToObject) {
      throw new Error(
        "Could not parse color string. The input should be a valid hex color string.",
      );
    }
    const { r, g, b, a } = inputToObject;
    this.colorChanged.emit(new Color(r, g, b, a));
  }
}
