
const trimLeft = /^\s+/;
const trimRight = /\s+$/;
const tinyCounter = 0;
const mathRound = Math.round;
const mathMin = Math.min;
const mathMax = Math.max;
const mathRandom = Math.random;

export const NUMERIC_REGEX = /[^0-9]/g;
export const MAX_RGB = 255;
export const MIN_RGB = 0;


/** List basic colors */
export const BASIC_COLORS = ["#ffffff", "#ffff00", "#ff00ff", "#ff0000",
    "#c0c0c0", "#808080", "#808000", "#800080",
    "#800000", "#00ffff", "#00ff00", "#008080",
    "#008000", "#0000ff", "#000080", "#000000"
];

/**
 * Get color at position
 * @param ctx 
 * @param x 
 * @param y 
 */
export function getColorAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number): { r: number, g: number, b: number } {
    const imageData: Uint8ClampedArray = ctx.getImageData(x, y, 1, 1).data;
    return { r: imageData[0], g: imageData[1], b: imageData[2] };
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
export function rgbaToHex(r: number, g: number, b: number, a: number, allow4Char?: boolean): string {
    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// Force a hex value to have 2 characters
export function pad2(c): string {
    return c.length == 1 ? '0' + c : '' + c;
}

// Converts a decimal to a hex value
export function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}

// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
export function rgbToHex(r: number, g: number, b: number, allow3Char?: boolean) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening parent
const CSS_INTEGER = "[-\\+]?\\d+%?";
const CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
const CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
const PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
const PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

export const matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
export function stringInputToObject(color: string): { r: number, g: number, b: number, a: number } {

    color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    let match;
    let obj;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: 1 };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }

    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: 1
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: 1
        };
    }

    return null;
}

export function createMissingDateImplError(provider: string) {
    return Error(
        `NgxMatColorPicker: No provider found for ${provider}. You must define MAT_COLOR_FORMATS in your module`);
}