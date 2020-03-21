import { rgbaToHex, rgbToHex } from '../helpers';

export class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(_r: number, _g: number, _b: number, _a?: number) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
        this.a = _a != null ? _a : 1;
    }

    public toString(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public toHex(allow3Char?: boolean): string {
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    }

    public toHexString(allow3Char?: boolean): string {
        return '#' + this.toHex(allow3Char);
    }
}