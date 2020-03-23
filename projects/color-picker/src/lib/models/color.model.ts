import { MAX_RGB, rgbaToHex, rgbToHex } from '../helpers';
import { ColorInputFormat } from './color-input-format';

export class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number;
    public roundA: number;

    public hex: string;
    public rgba: string;

    constructor(_r: number, _g: number, _b: number, _a?: number) {
        this.r = _r > MAX_RGB ? MAX_RGB : _r;
        this.g = _g > MAX_RGB ? MAX_RGB : _g;
        this.b = _b > MAX_RGB ? MAX_RGB : _b;
        if (_a != null) {
            this.a = _a > 1 ? 1 : _a;
        } else {
            this.a = 1;
        }
        this.roundA = Math.round(this.a);
        this.hex = rgbToHex(this.r, this.g, this.b);
        this.rgba = this.toRgba();
    }

    public toHex(allow3Char?: boolean, ): string {
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    }

    public toRgba(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public toHexString(allow3Char?: boolean): string {
        return '#' + this.toHex(allow3Char);
    }

    public toRgbString(): string {
        return (this.a === 1) ?
            "rgb(" + Math.round(this.r) + ", " + Math.round(this.g) + ", " + Math.round(this.b) + ")" :
            "rgba(" + Math.round(this.r) + ", " + Math.round(this.g) + ", " + Math.round(this.b) + ", " + this.roundA + ")";
    }

    public toHex8(allow4Char): string {
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    }

    public toHex8String(allow4Char?: boolean): string {
        return '#' + this.toHex8(allow4Char);
    }

    public toString(format: ColorInputFormat): string {
        let formatSet = !!format;

        let formattedString;
        let hasAlpha = this.a < 1 && this.a >= 0;
        let needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6"
            || format === "hex3" || format === "hex4" || format === "hex8");

        if (needsAlphaFormat) {
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }

        return formattedString || this.toHexString();
    }

}