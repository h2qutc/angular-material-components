import { rgbaToHex, rgbToHex, MAX_RGB } from '../helpers';

export class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public hex: string;
    public rgba: string;

    constructor(_r: number, _g: number, _b: number, _a?: number) {
        this.r = _r > MAX_RGB ? MAX_RGB : _r;
        this.g = _g > MAX_RGB ? MAX_RGB : _g;
        this.b = _b > MAX_RGB ? MAX_RGB : _b;
        this.a = _a != null ? _a : 1;
        this.hex = rgbToHex(this.r, this.g, this.b);
        this.rgba = this._toRgba();
    }

    public _toRgba(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public toHexString(): string {
        return '#' + this.hex;
    }
}