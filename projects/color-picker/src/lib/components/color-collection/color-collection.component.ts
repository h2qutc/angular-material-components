import { NgClass } from '@angular/common';
import { Component, Input, output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BASIC_COLORS, stringInputToObject } from '../../helpers';
import { Color } from '../../models';

@Component({
  selector: 'ngx-mat-color-collection',
  templateUrl: './color-collection.component.html',
  styleUrls: ['./color-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ngx-mat-color-collection',
  },
  standalone: true,
  imports: [MatButtonModule, NgClass],
})
export class NgxMatColorCollectionComponent {
  readonly colorChanged = output<Color>();

  @Input()
  set color(c: Color) {
    if (c) {
      this.selectedColor.set(c.toHexString());
    }
  }

  readonly selectedColor = signal<string>('');

  colors1: string[] = BASIC_COLORS.slice(0, 8);
  colors2: string[] = BASIC_COLORS.slice(8, 16);

  select(hex: string) {
    this.selectedColor.set(hex);
    const { r, g, b, a } = stringInputToObject(hex);
    this.colorChanged.emit(new Color(r, g, b, a));
  }
}
