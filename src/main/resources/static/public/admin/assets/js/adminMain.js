/*Part21 colorpicker-color.js */
/*!
 * Bootstrap Colorpicker v2.5.1
 * https://itsjavi.com/bootstrap-colorpicker/
 *
 * Originally written by (c) 2012 Stefan Petre
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(["jquery"], function (jq) {
            return (factory(jq));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("jquery"));
    } else if (jQuery && !jQuery.fn.colorpicker) {
        factory(jQuery);
    }
}(this, function ($) {
    'use strict';
    /**
     * Color manipulation helper class
     *
     * @param {Object|String} [val]
     * @param {Object} [predefinedColors]
     * @param {String|null} [fallbackColor]
     * @param {String|null} [fallbackFormat]
     * @param {Boolean} [hexNumberSignPrefix]
     * @constructor
     */
    var Color = function (
        val, predefinedColors, fallbackColor, fallbackFormat, hexNumberSignPrefix) {
        this.fallbackValue = fallbackColor ?
            (
                fallbackColor && (typeof fallbackColor.h !== 'undefined') ?
                    fallbackColor :
                    this.value = {
                        h: 0,
                        s: 0,
                        b: 0,
                        a: 1
                    }
            ) :
            null;

        this.fallbackFormat = fallbackFormat ? fallbackFormat : 'rgba';

        this.hexNumberSignPrefix = hexNumberSignPrefix === true;

        this.value = this.fallbackValue;

        this.origFormat = null; // original string format

        this.predefinedColors = predefinedColors ? predefinedColors : {};

        // We don't want to share aliases across instances so we extend new object
        this.colors = $.extend({}, Color.webColors, this.predefinedColors);

        if (val) {
            if (typeof val.h !== 'undefined') {
                this.value = val;
            } else {
                this.setColor(String(val));
            }
        }

        if (!this.value) {
            // Initial value is always black if no arguments are passed or val is empty
            this.value = {
                h: 0,
                s: 0,
                b: 0,
                a: 1
            };
        }
    };

    Color.webColors = { // 140 predefined colors from the HTML Colors spec
        "aliceblue": "f0f8ff",
        "antiquewhite": "faebd7",
        "aqua": "00ffff",
        "aquamarine": "7fffd4",
        "azure": "f0ffff",
        "beige": "f5f5dc",
        "bisque": "ffe4c4",
        "black": "000000",
        "blanchedalmond": "ffebcd",
        "blue": "0000ff",
        "blueviolet": "8a2be2",
        "brown": "a52a2a",
        "burlywood": "deb887",
        "cadetblue": "5f9ea0",
        "chartreuse": "7fff00",
        "chocolate": "d2691e",
        "coral": "ff7f50",
        "cornflowerblue": "6495ed",
        "cornsilk": "fff8dc",
        "crimson": "dc143c",
        "cyan": "00ffff",
        "darkblue": "00008b",
        "darkcyan": "008b8b",
        "darkgoldenrod": "b8860b",
        "darkgray": "a9a9a9",
        "darkgreen": "006400",
        "darkkhaki": "bdb76b",
        "darkmagenta": "8b008b",
        "darkolivegreen": "556b2f",
        "darkorange": "ff8c00",
        "darkorchid": "9932cc",
        "darkred": "8b0000",
        "darksalmon": "e9967a",
        "darkseagreen": "8fbc8f",
        "darkslateblue": "483d8b",
        "darkslategray": "2f4f4f",
        "darkturquoise": "00ced1",
        "darkviolet": "9400d3",
        "deeppink": "ff1493",
        "deepskyblue": "00bfff",
        "dimgray": "696969",
        "dodgerblue": "1e90ff",
        "firebrick": "b22222",
        "floralwhite": "fffaf0",
        "forestgreen": "228b22",
        "fuchsia": "ff00ff",
        "gainsboro": "dcdcdc",
        "ghostwhite": "f8f8ff",
        "gold": "ffd700",
        "goldenrod": "daa520",
        "gray": "808080",
        "green": "008000",
        "greenyellow": "adff2f",
        "honeydew": "f0fff0",
        "hotpink": "ff69b4",
        "indianred": "cd5c5c",
        "indigo": "4b0082",
        "ivory": "fffff0",
        "khaki": "f0e68c",
        "lavender": "e6e6fa",
        "lavenderblush": "fff0f5",
        "lawngreen": "7cfc00",
        "lemonchiffon": "fffacd",
        "lightblue": "add8e6",
        "lightcoral": "f08080",
        "lightcyan": "e0ffff",
        "lightgoldenrodyellow": "fafad2",
        "lightgrey": "d3d3d3",
        "lightgreen": "90ee90",
        "lightpink": "ffb6c1",
        "lightsalmon": "ffa07a",
        "lightseagreen": "20b2aa",
        "lightskyblue": "87cefa",
        "lightslategray": "778899",
        "lightsteelblue": "b0c4de",
        "lightyellow": "ffffe0",
        "lime": "00ff00",
        "limegreen": "32cd32",
        "linen": "faf0e6",
        "magenta": "ff00ff",
        "maroon": "800000",
        "mediumaquamarine": "66cdaa",
        "mediumblue": "0000cd",
        "mediumorchid": "ba55d3",
        "mediumpurple": "9370d8",
        "mediumseagreen": "3cb371",
        "mediumslateblue": "7b68ee",
        "mediumspringgreen": "00fa9a",
        "mediumturquoise": "48d1cc",
        "mediumvioletred": "c71585",
        "midnightblue": "191970",
        "mintcream": "f5fffa",
        "mistyrose": "ffe4e1",
        "moccasin": "ffe4b5",
        "navajowhite": "ffdead",
        "navy": "000080",
        "oldlace": "fdf5e6",
        "olive": "808000",
        "olivedrab": "6b8e23",
        "orange": "ffa500",
        "orangered": "ff4500",
        "orchid": "da70d6",
        "palegoldenrod": "eee8aa",
        "palegreen": "98fb98",
        "paleturquoise": "afeeee",
        "palevioletred": "d87093",
        "papayawhip": "ffefd5",
        "peachpuff": "ffdab9",
        "peru": "cd853f",
        "pink": "ffc0cb",
        "plum": "dda0dd",
        "powderblue": "b0e0e6",
        "purple": "800080",
        "red": "ff0000",
        "rosybrown": "bc8f8f",
        "royalblue": "4169e1",
        "saddlebrown": "8b4513",
        "salmon": "fa8072",
        "sandybrown": "f4a460",
        "seagreen": "2e8b57",
        "seashell": "fff5ee",
        "sienna": "a0522d",
        "silver": "c0c0c0",
        "skyblue": "87ceeb",
        "slateblue": "6a5acd",
        "slategray": "708090",
        "snow": "fffafa",
        "springgreen": "00ff7f",
        "steelblue": "4682b4",
        "tan": "d2b48c",
        "teal": "008080",
        "thistle": "d8bfd8",
        "tomato": "ff6347",
        "turquoise": "40e0d0",
        "violet": "ee82ee",
        "wheat": "f5deb3",
        "white": "ffffff",
        "whitesmoke": "f5f5f5",
        "yellow": "ffff00",
        "yellowgreen": "9acd32",
        "transparent": "transparent",
        "rgb": "rgb"
    };

    Color.prototype = {
        constructor: Color,
        colors: {}, // merged web and predefined colors
        predefinedColors: {},
        /**
         * @return {Object}
         */
        getValue: function () {
            return this.value;
        },
        /**
         * @param {Object} val
         */
        setValue: function (val) {
            this.value = val;
        },
        _sanitizeNumber: function (val) {


            if (typeof val === 'number') {
                return val;
            }
            if (isNaN(val) || (val === null) || (val === '') || (val === undefined)) {
                return 1;
            }
            if (val === '') {
                return 0;
            }
            if (typeof val.toLowerCase !== 'undefined') {
                if (val.match(/^\./)) {
                    val = "0" + val;
                }
                return Math.ceil(parseFloat(val) * 100) / 100;
            }
            return 1;
        },
        isTransparent: function (strVal) {
            if (!strVal || !(typeof strVal === 'string' || strVal instanceof String)) {
                return false;
            }

            strVal = strVal.toLowerCase().trim();
            return (strVal === 'rgb') || (strVal.match(/#?00000000/)) || (strVal.match(/(rgba|hsla)\(0,0,0,0?\.?0\)/));
        },

        isNone: function (strVal) {
            if (!strVal || !(typeof strVal === 'string' || strVal instanceof String)) {
                return false;
            }

            strVal = strVal.toLowerCase().trim();
            return (strVal === 'none') || (strVal === '-');
        },
        rgbaIsTransparent: function (rgba) {
            return ((rgba.r === 0) && (rgba.g === 0) && (rgba.b === 0) && (rgba.a === 0));
        },


        // parse a string to HSB
        /**
         * @protected
         * @param {String} strVal
         * @returns {boolean} Returns true if it could be parsed, false otherwise
         */
        setColor: function (strVal) {
            strVal = strVal.toLowerCase().trim();
            if (strVal) {
                if (this.isTransparent(strVal)) {
                    this.value = {
                        h: 0,
                        s: 0,
                        b: 0,
                        a: 0
                    };
                    return true;
                } else {
                    var parsedColor = this.parse(strVal);
                    if (parsedColor) {
                        this.value = this.value = {
                            h: parsedColor.h,
                            s: parsedColor.s,
                            b: parsedColor.b,
                            a: parsedColor.a
                        };
                        if (!this.origFormat) {
                            this.origFormat = parsedColor.format;
                        }
                    } else if (this.fallbackValue) {
                        // if parser fails, defaults to fallbackValue if defined, otherwise the value won't be changed
                        this.value = this.fallbackValue;
                    }
                }
            }
            return false;
        },
        setHue: function (h) {
            this.value.h = 1 - h;
        },
        setSaturation: function (s) {
            this.value.s = s;
        },
        setBrightness: function (b) {
            this.value.b = 1 - b;
        },
        setAlpha: function (a) {
            this.value.a = Math.round((parseInt((1 - a) * 100, 10) / 100) * 100) / 100;
        },
        toRGB: function (h, s, b, a) {
            if (arguments.length === 0) {
                h = this.value.h;
                s = this.value.s;
                b = this.value.b;
                a = this.value.a;
            }

            h *= 360;
            var R, G, B, X, C;
            h = (h % 360) / 60;
            C = b * s;
            X = C * (1 - Math.abs(h % 2 - 1));
            R = G = B = b - C;

            h = ~~h;
            R += [C, X, 0, 0, X, C][h];
            G += [X, C, C, X, 0, 0][h];
            B += [0, 0, X, C, C, X][h];

            return {
                r: Math.round(R * 255),
                g: Math.round(G * 255),
                b: Math.round(B * 255),
                a: a
            };
        },
        toHex: function (ignoreFormat, h, s, b, a) {
            if (arguments.length <= 1) {
                h = this.value.h;
                s = this.value.s;
                b = this.value.b;
                a = this.value.a;
            }

            var prefix = '#';
            var rgb = this.toRGB(h, s, b, a);
            var none = '-';
            if (this.rgbaIsTransparent(rgb)) {
                return 'RGB';
            }


            if (!ignoreFormat) {
                prefix = (this.hexNumberSignPrefix ? '#' : '');
            }

            var hexStr = prefix + (
                (1 << 24) +
                (parseInt(rgb.r) << 16) +
                (parseInt(rgb.g) << 8) +
                parseInt(rgb.b))
                .toString(16)
                .slice(1);

            return hexStr;
        },
        toHSL: function (h, s, b, a) {
            if (arguments.length === 0) {
                h = this.value.h;
                s = this.value.s;
                b = this.value.b;
                a = this.value.a;
            }

            var H = h,
                L = (2 - s) * b,
                S = s * b;
            if (L > 0 && L <= 1) {
                S /= L;
            } else {
                S /= 2 - L;
            }
            L /= 2;
            if (S > 1) {
                S = 1;
            }
            return {
                h: isNaN(H) ? 0 : H,
                s: isNaN(S) ? 0 : S,
                l: isNaN(L) ? 0 : L,
                a: isNaN(a) ? 0 : a
            };
        },
        toAlias: function (r, g, b, a) {
            var c, rgb = (arguments.length === 0) ? this.toHex(true) : this.toHex(true, r, g, b, a);

            // support predef. colors in non-hex format too, as defined in the alias itself
            var original = this.origFormat === 'alias' ? rgb : this.toString(false, this.origFormat);

            for (var alias in this.colors) {
                c = this.colors[alias].toLowerCase().trim();
                if ((c === rgb) || (c === original)) {
                    return alias;
                }
            }
            return false;
        },
        RGBtoHSB: function (r, g, b, a) {
            r /= 255;
            g /= 255;
            b /= 255;

            var H, S, V, C;
            V = Math.max(r, g, b);
            C = V - Math.min(r, g, b);
            H = (C === 0 ? null :
                    V === r ? (g - b) / C :
                        V === g ? (b - r) / C + 2 :
                            (r - g) / C + 4
            );
            H = ((H + 360) % 6) * 60 / 360;
            S = C === 0 ? 0 : C / V;
            return {
                h: this._sanitizeNumber(H),
                s: S,
                b: V,
                a: this._sanitizeNumber(a)
            };
        },
        HueToRGB: function (p, q, h) {
            if (h < 0) {
                h += 1;
            } else if (h > 1) {
                h -= 1;
            }
            if ((h * 6) < 1) {
                return p + (q - p) * h * 6;
            } else if ((h * 2) < 1) {
                return q;
            } else if ((h * 3) < 2) {
                return p + (q - p) * ((2 / 3) - h) * 6;
            } else {
                return p;
            }
        },
        HSLtoRGB: function (h, s, l, a) {
            if (s < 0) {
                s = 0;
            }
            var q;
            if (l <= 0.5) {
                q = l * (1 + s);
            } else {
                q = l + s - (l * s);
            }

            var p = 2 * l - q;

            var tr = h + (1 / 3);
            var tg = h;
            var tb = h - (1 / 3);

            var r = Math.round(this.HueToRGB(p, q, tr) * 255);
            var g = Math.round(this.HueToRGB(p, q, tg) * 255);
            var b = Math.round(this.HueToRGB(p, q, tb) * 255);
            return [r, g, b, this._sanitizeNumber(a)];
        },
        /**
         * @param {String} strVal
         * @returns {Object} Object containing h,s,b,a,format properties or FALSE if failed to parse
         */
        parse: function (strVal) {
            if (arguments.length === 0) {
                return false;
            }

            var that = this,
                result = false,
                isAlias = (typeof this.colors[strVal] !== 'undefined'),
                values, format;

            if (isAlias) {
                strVal = this.colors[strVal].toLowerCase().trim();
            }

            $.each(this.stringParsers, function (i, parser) {
                var match = parser.re.exec(strVal);
                values = match && parser.parse.apply(that, [match]);
                if (values) {
                    result = {};
                    format = (isAlias ? 'alias' : (parser.format ? parser.format : that.getValidFallbackFormat()));
                    if (format.match(/hsla?/)) {
                        result = that.RGBtoHSB.apply(that, that.HSLtoRGB.apply(that, values));
                    } else {
                        result = that.RGBtoHSB.apply(that, values);
                    }
                    if (result instanceof Object) {
                        result.format = format;
                    }
                    return false; // stop iterating
                }
                return true;
            });
            return result;
        },
        getValidFallbackFormat: function () {
            var formats = [
                'rgba', 'rgb', 'hex', 'hsla', 'hsl'
            ];
            if (this.origFormat && (formats.indexOf(this.origFormat) !== -1)) {
                return this.origFormat;
            }
            if (this.fallbackFormat && (formats.indexOf(this.fallbackFormat) !== -1)) {
                return this.fallbackFormat;
            }

            return 'rgba'; // By default, return a format that will not lose the alpha info
        },
        /**
         *
         * @param {string} [format] (default: rgba)
         * @param {boolean} [translateAlias] Return real color for pre-defined (non-standard) aliases (default: false)
         * @param {boolean} [forceRawValue] Forces hashtag prefix when getting hex color (default: false)
         * @returns {String}
         */
        toString: function (forceRawValue, format, translateAlias) {
            format = format || this.origFormat || this.fallbackFormat;
            translateAlias = translateAlias || false;

            var c = false;

            switch (format) {
                case 'rgb': {
                    c = this.toRGB();
                    if (this.rgbaIsTransparent(c)) {
                        return 'transparent';
                    }
                    return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
                }
                    break;
                case 'rgba': {
                    c = this.toRGB();
                    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
                }
                    break;
                case 'hsl': {
                    c = this.toHSL();
                    return 'hsl(' + Math.round(c.h * 360) + ',' + Math.round(c.s * 100) + '%,' + Math.round(c.l * 100) + '%)';
                }
                    break;
                case 'hsla': {
                    c = this.toHSL();
                    return 'hsla(' + Math.round(c.h * 360) + ',' + Math.round(c.s * 100) + '%,' + Math.round(c.l * 100) + '%,' + c.a + ')';
                }
                    break;
                case 'hex': {
                    return this.toHex(forceRawValue);
                }
                    break;
                case 'alias': {
                    c = this.toAlias();

                    if (c === false) {
                        return this.toString(forceRawValue, this.getValidFallbackFormat());
                    }

                    if (translateAlias && !(c in Color.webColors) && (c in this.predefinedColors)) {
                        return this.predefinedColors[c];
                    }

                    return c;
                }
                default: {
                    return c;
                }
                    break;
            }
        },
        // a set of RE's that can match strings and generate color tuples.
        // from John Resig color plugin
        // https://github.com/jquery/jquery-color/
        stringParsers: [{
            re: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*?\)/,
            format: 'rgb',
            parse: function (execResult) {
                return [
                    execResult[1],
                    execResult[2],
                    execResult[3],
                    1
                ];
            }
        }, {
            re: /rgb\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
            format: 'rgb',
            parse: function (execResult) {
                return [
                    2.55 * execResult[1],
                    2.55 * execResult[2],
                    2.55 * execResult[3],
                    1
                ];
            }
        }, {
            re: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: 'rgba',
            parse: function (execResult) {
                return [
                    execResult[1],
                    execResult[2],
                    execResult[3],
                    execResult[4]
                ];
            }
        }, {
            re: /rgba\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: 'rgba',
            parse: function (execResult) {
                return [
                    2.55 * execResult[1],
                    2.55 * execResult[2],
                    2.55 * execResult[3],
                    execResult[4]
                ];
            }
        }, {
            re: /hsl\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
            format: 'hsl',
            parse: function (execResult) {
                return [
                    execResult[1] / 360,
                    execResult[2] / 100,
                    execResult[3] / 100,
                    execResult[4]
                ];
            }
        }, {
            re: /hsla\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: 'hsla',
            parse: function (execResult) {
                return [
                    execResult[1] / 360,
                    execResult[2] / 100,
                    execResult[3] / 100,
                    execResult[4]
                ];
            }
        }, {
            re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
            format: 'hex',
            parse: function (execResult) {
                return [
                    parseInt(execResult[1], 16),
                    parseInt(execResult[2], 16),
                    parseInt(execResult[3], 16),
                    1
                ];
            }
        }, {
            re: /#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
            format: 'hex',
            parse: function (execResult) {
                return [
                    parseInt(execResult[1] + execResult[1], 16),
                    parseInt(execResult[2] + execResult[2], 16),
                    parseInt(execResult[3] + execResult[3], 16),
                    1
                ];
            }
        }],
        colorNameToHex: function (name) {
            if (typeof this.colors[name.toLowerCase()] !== 'undefined') {
                return this.colors[name.toLowerCase()];
            }
            return false;
        }
    };

    /*
     * Default plugin options
     */
    var defaults = {
        horizontal: false, // horizontal mode layout ?
        inline: false, //forces to show the colorpicker as an inline element
        color: false, //forces a color
        format: false, //forces a format
        input: 'input', // children input selector
        container: false, // container selector
        component: '.add-on, .input-group-addon', // children component selector
        fallbackColor: false, // fallback color value. null = keeps current color.
        fallbackFormat: 'hex', // fallback color format
        hexNumberSignPrefix: true, // put a '#' (number sign) before hex strings
        sliders: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: 'setSaturation',
                callTop: 'setBrightness'
            },
            hue: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: false,
                callTop: 'setHue'
            },
            alpha: {
                maxLeft: 0,
                maxTop: 100,
                callLeft: false,
                callTop: 'setAlpha'
            }
        },
        slidersHorz: {
            saturation: {
                maxLeft: 100,
                maxTop: 100,
                callLeft: 'setSaturation',
                callTop: 'setBrightness'
            },
            hue: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: 'setHue',
                callTop: false
            },
            alpha: {
                maxLeft: 100,
                maxTop: 0,
                callLeft: 'setAlpha',
                callTop: false
            }
        },
        template: '<div class="colorpicker dropdown-menus">' +
        '<div class="colorpicker-saturation"><i><b></b></i></div>' +
        '<div class="colorpicker-hue"><i></i></div>' +
        '<div class="colorpicker-alpha"><i></i></div>' +
        '<div class="colorpicker-color"><div /></div>' +
        '<div class="colorpicker-selectors"></div>' +
        '</div>',
        align: 'right',
        customClass: null, // custom class added to the colorpicker element
        colorSelectors: null // custom color aliases
    };

    /**
     * Colorpicker component class
     *
     * @param {Object|String} element
     * @param {Object} options
     * @constructor
     */
    var Colorpicker = function (element, options) {
        this.element = $(element).addClass('colorpicker-element');
        this.options = $.extend(true, {}, defaults, this.element.data(), options);
        this.component = this.options.component;
        this.component = (this.component !== false) ? this.element.find(this.component) : false;
        if (this.component && (this.component.length === 0)) {
            this.component = false;
        }
        this.container = (this.options.container === true) ? this.element : this.options.container;
        this.container = (this.container !== false) ? $(this.container) : false;

        // Is the element an input? Should we search inside for any input?
        this.input = this.element.is('input') ? this.element : (this.options.input ?
            this.element.find(this.options.input) : false);
        if (this.input && (this.input.length === 0)) {
            this.input = false;
        }
        // Set HSB color
        this.color = this.createColor(this.options.color !== false ? this.options.color : this.getValue());

        this.format = this.options.format !== false ? this.options.format : this.color.origFormat;

        if (this.options.color !== false) {
            this.updateInput(this.color);
            this.updateData(this.color);
        }

        // Setup picker
        var $picker = this.picker = $(this.options.template);
        if (this.options.customClass) {
            $picker.addClass(this.options.customClass);
        }
        if (this.options.inline) {
            $picker.addClass('colorpicker-inline colorpicker-visible');
        } else {
            $picker.addClass('colorpicker-hidden');
        }
        if (this.options.horizontal) {
            $picker.addClass('colorpicker-horizontal');
        }
        if (
            (['rgba', 'hsla', 'alias'].indexOf(this.format) !== -1) ||
            this.options.format === false ||
            this.getValue() === 'transparent'
        ) {
            $picker.addClass('colorpicker-with-alpha');
        }
        if (this.options.align === 'right') {
            $picker.addClass('colorpicker-right');
        }
        if (this.options.inline === true) {
            $picker.addClass('colorpicker-no-arrow');
        }
        if (this.options.colorSelectors) {
            var colorpicker = this,
                selectorsContainer = colorpicker.picker.find('.colorpicker-selectors');

            if (selectorsContainer.length > 0) {
                $.each(this.options.colorSelectors, function (name, color) {
                    var $btn = $('<i />')
                        .addClass('colorpicker-selectors-color')
                        .css('background-color', color)
                        .data('class', name).data('alias', name);

                    $btn.on('mousedown.colorpicker touchstart.colorpicker', function (event) {
                        event.preventDefault();
                        colorpicker.setValue(
                            colorpicker.format === 'alias' ? $(this).data('alias') : $(this).css('background-color')
                        );
                    });
                    selectorsContainer.append($btn);
                });
                selectorsContainer.show().addClass('colorpicker-visible');
            }
        }

        // Prevent closing the colorpicker when clicking on itself
        $picker.on('mousedown.colorpicker touchstart.colorpicker', $.proxy(function (e) {
            if (e.target === e.currentTarget) {
                e.preventDefault();
            }
        }, this));

        // Bind click/tap events on the sliders
        $picker.find('.colorpicker-saturation, .colorpicker-hue, .colorpicker-alpha')
            .on('mousedown.colorpicker touchstart.colorpicker', $.proxy(this.mousedown, this));

        $picker.appendTo(this.container ? this.container : $('body'));

        // Bind other events
        if (this.input !== false) {
            this.input.on({
                'keyup.colorpicker': $.proxy(this.keyup, this)
            });
            this.input.on({
                'change.colorpicker': $.proxy(this.change, this)
            });
            if (this.component === false) {
                this.element.on({
                    'focus.colorpicker': $.proxy(this.show, this)
                });
            }
            if (this.options.inline === false) {
                this.element.on({
                    'focusout.colorpicker': $.proxy(this.hide, this)
                });
            }
        }

        if (this.component !== false) {
            this.component.on({
                'click.colorpicker': $.proxy(this.show, this)
            });
        }

        if ((this.input === false) && (this.component === false)) {
            this.element.on({
                'click.colorpicker': $.proxy(this.show, this)
            });
        }

        // for HTML5 input[type='color']
        if ((this.input !== false) && (this.component !== false) && (this.input.attr('type') === 'color')) {

            this.input.on({
                'click.colorpicker': $.proxy(this.show, this),
                'focus.colorpicker': $.proxy(this.show, this)
            });
        }
        this.update();

        $($.proxy(function () {
            this.element.trigger('create');
        }, this));
    };

    Colorpicker.Color = Color;

    Colorpicker.prototype = {
        constructor: Colorpicker,
        destroy: function () {
            this.picker.remove();
            this.element.removeData('colorpicker', 'color').off('.colorpicker');
            if (this.input !== false) {
                this.input.off('.colorpicker');
            }
            if (this.component !== false) {
                this.component.off('.colorpicker');
            }
            this.element.removeClass('colorpicker-element');
            this.element.trigger({
                type: 'destroy'
            });
        },
        reposition: function () {
            if (this.options.inline !== false || this.options.container) {
                return false;
            }
            var type = this.container && this.container[0] !== window.document.body ? 'position' : 'offset';
            var element = this.component || this.element;
            var offset = element[type]();
            if (this.options.align === 'right') {
                offset.left -= this.picker.outerWidth() - element.outerWidth();
            }
            this.picker.css({
                top: offset.top + element.outerHeight(),
                left: offset.left
            });
        },
        show: function (e) {
            if (this.isDisabled()) {
                // Don't show the widget if it's disabled (the input)
                return;
            }
            this.picker.addClass('colorpicker-visible').removeClass('colorpicker-hidden');
            this.reposition();
            $(window).on('resize.colorpicker', $.proxy(this.reposition, this));
            if (e && (!this.hasInput() || this.input.attr('type') === 'color')) {
                if (e.stopPropagation && e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
            if ((this.component || !this.input) && (this.options.inline === false)) {
                $(window.document).on({
                    'mousedown.colorpicker': $.proxy(this.hide, this)
                });
            }
            this.element.trigger({
                type: 'showPicker',
                color: this.color
            });
        },
        hide: function (e) {
            if ((typeof e !== 'undefined') && e.target) {
                // Prevent hide if triggered by an event and an element inside the colorpicker has been clicked/touched
                if (
                    $(e.currentTarget).parents('.colorpicker').length > 0 ||
                    $(e.target).parents('.colorpicker').length > 0
                ) {
                    return false;
                }
            }
            this.picker.addClass('colorpicker-hidden').removeClass('colorpicker-visible');
            $(window).off('resize.colorpicker', this.reposition);
            $(window.document).off({
                'mousedown.colorpicker': this.hide
            });
            this.update();
            this.element.trigger({
                type: 'hidePicker',
                color: this.color
            });
        },
        updateData: function (val) {
            val = val || this.color.toString(false, this.format);
            this.element.data('color', val);
            return val;
        },
        updateInput: function (val) {
            val = val || this.color.toString(false, this.format);
            if (this.input !== false) {
                this.input.prop('value', val);
                this.input.trigger('change');
            }
            return val;
        },
        updatePicker: function (val) {
            if (typeof val !== 'undefined') {
                this.color = this.createColor(val);
            }
            var sl = (this.options.horizontal === false) ? this.options.sliders : this.options.slidersHorz;
            var icns = this.picker.find('i');
            if (icns.length === 0) {
                return;
            }
            if (this.options.horizontal === false) {
                sl = this.options.sliders;
                icns.eq(1).css('top', sl.hue.maxTop * (1 - this.color.value.h)).end()
                    .eq(2).css('top', sl.alpha.maxTop * (1 - this.color.value.a));
            } else {
                sl = this.options.slidersHorz;
                icns.eq(1).css('left', sl.hue.maxLeft * (1 - this.color.value.h)).end()
                    .eq(2).css('left', sl.alpha.maxLeft * (1 - this.color.value.a));
            }
            icns.eq(0).css({
                'top': sl.saturation.maxTop - this.color.value.b * sl.saturation.maxTop,
                'left': this.color.value.s * sl.saturation.maxLeft
            });

            this.picker.find('.colorpicker-saturation')
                .css('backgroundColor', this.color.toHex(true, this.color.value.h, 1, 1, 1));

            this.picker.find('.colorpicker-alpha')
                .css('backgroundColor', this.color.toHex(true));

            this.picker.find('.colorpicker-color, .colorpicker-color div')
                .css('backgroundColor', this.color.toString(true, this.format));

            return val;
        },
        updateComponent: function (val) {
            var color;

            if (typeof val !== 'undefined') {
                color = this.createColor(val);
            } else {
                color = this.color;
            }

            if (this.component !== false) {
                var icn = this.component.find('i').eq(0);
                if (icn.length > 0) {
                    icn.css({
                        'backgroundColor': color.toString(true, this.format)
                    });
                } else {
                    this.component.css({
                        'backgroundColor': color.toString(true, this.format)
                    });
                }
            }

            return color.toString(false, this.format);
        },
        update: function (force) {
            var val;
            if ((this.getValue(false) !== false) || (force === true)) {
                // Update input/data only if the current value is not empty
                val = this.updateComponent();
                this.updateInput(val);
                this.updateData(val);
                this.updatePicker(); // only update picker if value is not empty
            }
            return val;

        },
        setValue: function (val) { // set color manually
            this.color = this.createColor(val);
            this.update(true);
            this.element.trigger({
                type: 'changeColor',
                color: this.color,
                value: val
            });
        },
        /**
         * Creates a new color using the instance options
         * @protected
         * @param {String} val
         * @returns {Color}
         */
        createColor: function (val) {
            return new Color(
                val ? val : null,
                this.options.colorSelectors,
                this.options.fallbackColor ? this.options.fallbackColor : this.color,
                this.options.fallbackFormat,
                this.options.hexNumberSignPrefix
            );
        },
        getValue: function (defaultValue) {
            defaultValue = (typeof defaultValue === 'undefined') ? this.options.fallbackColor : defaultValue;
            var val;
            if (this.hasInput()) {
                val = this.input.val();
            } else {
                val = this.element.data('color');
            }
            if ((val === undefined) || (val === '') || (val === null)) {
                // if not defined or empty, return default
                val = defaultValue;
            }
            return val;
        },
        hasInput: function () {
            return (this.input !== false);
        },
        isDisabled: function () {
            if (this.hasInput()) {
                return (this.input.prop('disabled') === true);
            }
            return false;
        },
        disable: function () {
            if (this.hasInput()) {
                this.input.prop('disabled', true);
                this.element.trigger({
                    type: 'disable',
                    color: this.color,
                    value: this.getValue()
                });
                return true;
            }
            return false;
        },
        enable: function () {
            if (this.hasInput()) {
                this.input.prop('disabled', false);
                this.element.trigger({
                    type: 'enable',
                    color: this.color,
                    value: this.getValue()
                });
                return true;
            }
            return false;
        },
        currentSlider: null,
        mousePointer: {
            left: 0,
            top: 0
        },
        mousedown: function (e) {
            if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            }
            e.stopPropagation();
            e.preventDefault();

            var target = $(e.target);

            //detect the slider and set the limits and callbacks
            var zone = target.closest('div');
            var sl = this.options.horizontal ? this.options.slidersHorz : this.options.sliders;
            if (!zone.is('.colorpicker')) {
                if (zone.is('.colorpicker-saturation')) {
                    this.currentSlider = $.extend({}, sl.saturation);
                } else if (zone.is('.colorpicker-hue')) {
                    this.currentSlider = $.extend({}, sl.hue);
                } else if (zone.is('.colorpicker-alpha')) {
                    this.currentSlider = $.extend({}, sl.alpha);
                } else {
                    return false;
                }
                var offset = zone.offset();
                //reference to guide's style
                this.currentSlider.guide = zone.find('i')[0].style;
                this.currentSlider.left = e.pageX - offset.left;
                this.currentSlider.top = e.pageY - offset.top;
                this.mousePointer = {
                    left: e.pageX,
                    top: e.pageY
                };
                //trigger mousemove to move the guide to the current position
                $(window.document).on({
                    'mousemove.colorpicker': $.proxy(this.mousemove, this),
                    'touchmove.colorpicker': $.proxy(this.mousemove, this),
                    'mouseup.colorpicker': $.proxy(this.mouseup, this),
                    'touchend.colorpicker': $.proxy(this.mouseup, this)
                }).trigger('mousemove');
            }
            return false;
        },
        mousemove: function (e) {
            if (!e.pageX && !e.pageY && e.originalEvent && e.originalEvent.touches) {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            }
            e.stopPropagation();
            e.preventDefault();
            var left = Math.max(
                0,
                Math.min(
                    this.currentSlider.maxLeft,
                    this.currentSlider.left + ((e.pageX || this.mousePointer.left) - this.mousePointer.left)
                )
            );
            var top = Math.max(
                0,
                Math.min(
                    this.currentSlider.maxTop,
                    this.currentSlider.top + ((e.pageY || this.mousePointer.top) - this.mousePointer.top)
                )
            );
            this.currentSlider.guide.left = left + 'px';
            this.currentSlider.guide.top = top + 'px';
            if (this.currentSlider.callLeft) {
                this.color[this.currentSlider.callLeft].call(this.color, left / this.currentSlider.maxLeft);
            }
            if (this.currentSlider.callTop) {
                this.color[this.currentSlider.callTop].call(this.color, top / this.currentSlider.maxTop);
            }
            // Change format dynamically
            // Only occurs if user choose the dynamic format by
            // setting option format to false
            if (
                this.options.format === false &&
                (this.currentSlider.callTop === 'setAlpha' ||
                    this.currentSlider.callLeft === 'setAlpha')
            ) {

                // Converting from hex / rgb to rgba
                if (this.color.value.a !== 1) {
                    this.format = 'rgba';
                    this.color.origFormat = 'rgba';
                }

                // Converting from rgba to hex
                else {
                    this.format = 'hex';
                    this.color.origFormat = 'hex';
                }
            }
            this.update(true);

            this.element.trigger({
                type: 'changeColor',
                color: this.color
            });
            return false;
        },
        mouseup: function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(window.document).off({
                'mousemove.colorpicker': this.mousemove,
                'touchmove.colorpicker': this.mousemove,
                'mouseup.colorpicker': this.mouseup,
                'touchend.colorpicker': this.mouseup
            });
            return false;
        },
        change: function (e) {
            this.keyup(e);
        },
        keyup: function (e) {
            if ((e.keyCode === 38)) {
                if (this.color.value.a < 1) {
                    this.color.value.a = Math.round((this.color.value.a + 0.01) * 100) / 100;
                }
                this.update(true);
            } else if ((e.keyCode === 40)) {
                if (this.color.value.a > 0) {
                    this.color.value.a = Math.round((this.color.value.a - 0.01) * 100) / 100;
                }
                this.update(true);
            } else {
                this.color = this.createColor(this.input.val());
                // Change format dynamically
                // Only occurs if user choose the dynamic format by
                // setting option format to false
                if (this.color.origFormat && this.options.format === false) {
                    this.format = this.color.origFormat;
                }
                if (this.getValue(false) !== false) {
                    this.updateData();
                    this.updateComponent();
                    this.updatePicker();
                }
            }
            this.element.trigger({
                type: 'changeColor',
                color: this.color,
                value: this.input.val()
            });
        }
    };

    $.colorpicker = Colorpicker;

    $.fn.colorpicker = function (option) {
        var apiArgs = Array.prototype.slice.call(arguments, 1),
            isSingleElement = (this.length === 1),
            returnValue = null;

        var $jq = this.each(function () {
            var $this = $(this),
                inst = $this.data('colorpicker'),
                options = ((typeof option === 'object') ? option : {});

            if (!inst) {
                inst = new Colorpicker(this, options);
                $this.data('colorpicker', inst);
            }

            if (typeof option === 'string') {
                if ($.isFunction(inst[option])) {
                    returnValue = inst[option].apply(inst, apiArgs);
                } else { // its a property ?
                    if (apiArgs.length) {
                        // set property
                        inst[option] = apiArgs[0];
                    }
                    returnValue = inst[option];
                }
            } else {
                returnValue = $this;
            }
        });
        return isSingleElement ? returnValue : $jq;
    };

    $.fn.colorpicker.constructor = Colorpicker;

}));


/*Part24 html2canvas.min.js */
/*
 html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
 Copyright (c) 2016 Niklas von Hertzen

 Released under  License
 */
!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var n;
        "undefined" != typeof window ? n = window : "undefined" != typeof global ? n = global : "undefined" != typeof self && (n = self), n.html2canvas = e()
    }
}(function () {
    var e;
    return function n(e, f, o) {
        function d(t, l) {
            if (!f[t]) {
                if (!e[t]) {
                    var s = "function" == typeof require && require;
                    if (!l && s) return s(t, !0);
                    if (i) return i(t, !0);
                    var u = new Error("Cannot find module '" + t + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var a = f[t] = {exports: {}};
                e[t][0].call(a.exports, function (n) {
                    var f = e[t][1][n];
                    return d(f ? f : n)
                }, a, a.exports, n, e, f, o)
            }
            return f[t].exports
        }

        for (var i = "function" == typeof require && require, t = 0; t < o.length; t++) d(o[t]);
        return d
    }({
        1: [function (n, f, o) {
            (function (n) {
                !function (d) {
                    function i(e) {
                        throw RangeError(I[e])
                    }

                    function t(e, n) {
                        for (var f = e.length; f--;) e[f] = n(e[f]);
                        return e
                    }

                    function l(e, n) {
                        return t(e.split(H), n).join(".")
                    }

                    function s(e) {
                        for (var n, f, o = [], d = 0, i = e.length; i > d;) n = e.charCodeAt(d++), n >= 55296 && 56319 >= n && i > d ? (f = e.charCodeAt(d++), 56320 == (64512 & f) ? o.push(((1023 & n) << 10) + (1023 & f) + 65536) : (o.push(n), d--)) : o.push(n);
                        return o
                    }

                    function u(e) {
                        return t(e, function (e) {
                            var n = "";
                            return e > 65535 && (e -= 65536, n += L(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), n += L(e)
                        }).join("")
                    }

                    function a(e) {
                        return 10 > e - 48 ? e - 22 : 26 > e - 65 ? e - 65 : 26 > e - 97 ? e - 97 : k
                    }

                    function p(e, n) {
                        return e + 22 + 75 * (26 > e) - ((0 != n) << 5)
                    }

                    function c(e, n, f) {
                        var o = 0;
                        for (e = f ? K(e / B) : e >> 1, e += K(e / n); e > J * z >> 1; o += k) e = K(e / J);
                        return K(o + (J + 1) * e / (e + A))
                    }

                    function y(e) {
                        var n, f, o, d, t, l, s, p, y, m, r = [], v = e.length, w = 0, b = D, g = C;
                        for (f = e.lastIndexOf(E), 0 > f && (f = 0), o = 0; f > o; ++o) e.charCodeAt(o) >= 128 && i("not-basic"), r.push(e.charCodeAt(o));
                        for (d = f > 0 ? f + 1 : 0; v > d;) {
                            for (t = w, l = 1, s = k; d >= v && i("invalid-input"), p = a(e.charCodeAt(d++)), (p >= k || p > K((j - w) / l)) && i("overflow"), w += p * l, y = g >= s ? q : s >= g + z ? z : s - g, !(y > p); s += k) m = k - y, l > K(j / m) && i("overflow"), l *= m;
                            n = r.length + 1, g = c(w - t, n, 0 == t), K(w / n) > j - b && i("overflow"), b += K(w / n), w %= n, r.splice(w++, 0, b)
                        }
                        return u(r)
                    }

                    function m(e) {
                        var n, f, o, d, t, l, u, a, y, m, r, v, w, b, g, h = [];
                        for (e = s(e), v = e.length, n = D, f = 0, t = C, l = 0; v > l; ++l) r = e[l], 128 > r && h.push(L(r));
                        for (o = d = h.length, d && h.push(E); v > o;) {
                            for (u = j, l = 0; v > l; ++l) r = e[l], r >= n && u > r && (u = r);
                            for (w = o + 1, u - n > K((j - f) / w) && i("overflow"), f += (u - n) * w, n = u, l = 0; v > l; ++l) if (r = e[l], n > r && ++f > j && i("overflow"), r == n) {
                                for (a = f, y = k; m = t >= y ? q : y >= t + z ? z : y - t, !(m > a); y += k) g = a - m, b = k - m, h.push(L(p(m + g % b, 0))), a = K(g / b);
                                h.push(L(p(a, 0))), t = c(f, w, o == d), f = 0, ++o
                            }
                            ++f, ++n
                        }
                        return h.join("")
                    }

                    function r(e) {
                        return l(e, function (e) {
                            return F.test(e) ? y(e.slice(4).toLowerCase()) : e
                        })
                    }

                    function v(e) {
                        return l(e, function (e) {
                            return G.test(e) ? "xn--" + m(e) : e
                        })
                    }

                    var w = "object" == typeof o && o, b = "object" == typeof f && f && f.exports == w && f,
                        g = "object" == typeof n && n;
                    (g.global === g || g.window === g) && (d = g);
                    var h, x, j = 2147483647, k = 36, q = 1, z = 26, A = 38, B = 700, C = 72, D = 128, E = "-",
                        F = /^xn--/, G = /[^ -~]/, H = /\x2E|\u3002|\uFF0E|\uFF61/g, I = {
                            overflow: "Overflow: input needs wider integers to process",
                            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                            "invalid-input": "Invalid input"
                        }, J = k - q, K = Math.floor, L = String.fromCharCode;
                    if (h = {
                        version: "1.2.4",
                        ucs2: {decode: s, encode: u},
                        decode: y,
                        encode: m,
                        toASCII: v,
                        toUnicode: r
                    }, "function" == typeof e && "object" == typeof e.amd && e.amd) e("punycode", function () {
                        return h
                    }); else if (w && !w.nodeType) if (b) b.exports = h; else for (x in h) h.hasOwnProperty(x) && (w[x] = h[x]); else d.punycode = h
                }(this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}], 2: [function (e, n) {
            function f(e, n, f) {
                !e.defaultView || n === e.defaultView.pageXOffset && f === e.defaultView.pageYOffset || e.defaultView.scrollTo(n, f)
            }

            function o(e, n) {
                try {
                    n && (n.width = e.width, n.height = e.height, n.getContext("2d").putImageData(e.getContext("2d").getImageData(0, 0, e.width, e.height), 0, 0))
                } catch (f) {
                    t("Unable to copy canvas content from", e, f)
                }
            }

            function d(e, n) {
                for (var f = 3 === e.nodeType ? document.createTextNode(e.nodeValue) : e.cloneNode(!1), i = e.firstChild; i;) (n === !0 || 1 !== i.nodeType || "SCRIPT" !== i.nodeName) && f.appendChild(d(i, n)), i = i.nextSibling;
                return 1 === e.nodeType && (f._scrollTop = e.scrollTop, f._scrollLeft = e.scrollLeft, "CANVAS" === e.nodeName ? o(e, f) : ("TEXTAREA" === e.nodeName || "SELECT" === e.nodeName) && (f.value = e.value)), f
            }

            function i(e) {
                if (1 === e.nodeType) {
                    e.scrollTop = e._scrollTop, e.scrollLeft = e._scrollLeft;
                    for (var n = e.firstChild; n;) i(n), n = n.nextSibling
                }
            }

            var t = e("./log");
            n.exports = function (e, n, o, t, l, s, u) {
                var a = d(e.documentElement, l.javascriptEnabled), p = n.createElement("iframe");
                return p.className = "html2canvas-container", p.style.visibility = "hidden", p.style.position = "fixed", p.style.left = "-10000px", p.style.top = "0px", p.style.border = "0", p.width = o, p.height = t, p.scrolling = "no", n.body.appendChild(p), new Promise(function (n) {
                    var o = p.contentWindow.document;
                    p.contentWindow.onload = p.onload = function () {
                        var e = setInterval(function () {
                            o.body.childNodes.length > 0 && (i(o.documentElement), clearInterval(e), "view" === l.type && (p.contentWindow.scrollTo(s, u), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent) || p.contentWindow.scrollY === u && p.contentWindow.scrollX === s || (o.documentElement.style.top = -u + "px", o.documentElement.style.left = -s + "px", o.documentElement.style.position = "absolute")), n(p))
                        }, 50)
                    }, o.open(), o.write("<!DOCTYPE html><html></html>"), f(e, s, u), o.replaceChild(o.adoptNode(a), o.documentElement), o.close()
                })
            }
        }, {"./log": 13}], 3: [function (e, n) {
            function f(e) {
                this.r = 0, this.g = 0, this.b = 0, this.a = null;
                this.fromArray(e) || this.namedColor(e) || this.rgb(e) || this.rgba(e) || this.hex6(e) || this.hex3(e)
            }

            f.prototype.darken = function (e) {
                var n = 1 - e;
                return new f([Math.round(this.r * n), Math.round(this.g * n), Math.round(this.b * n), this.a])
            }, f.prototype.isTransparent = function () {
                return 0 === this.a
            }, f.prototype.isBlack = function () {
                return 0 === this.r && 0 === this.g && 0 === this.b
            }, f.prototype.fromArray = function (e) {
                return Array.isArray(e) && (this.r = Math.min(e[0], 255), this.g = Math.min(e[1], 255), this.b = Math.min(e[2], 255), e.length > 3 && (this.a = e[3])), Array.isArray(e)
            };
            var o = /^#([a-f0-9]{3})$/i;
            f.prototype.hex3 = function (e) {
                var n = null;
                return null !== (n = e.match(o)) && (this.r = parseInt(n[1][0] + n[1][0], 16), this.g = parseInt(n[1][1] + n[1][1], 16), this.b = parseInt(n[1][2] + n[1][2], 16)), null !== n
            };
            var d = /^#([a-f0-9]{6})$/i;
            f.prototype.hex6 = function (e) {
                var n = null;
                return null !== (n = e.match(d)) && (this.r = parseInt(n[1].substring(0, 2), 16), this.g = parseInt(n[1].substring(2, 4), 16), this.b = parseInt(n[1].substring(4, 6), 16)), null !== n
            };
            var i = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
            f.prototype.rgb = function (e) {
                var n = null;
                return null !== (n = e.match(i)) && (this.r = Number(n[1]), this.g = Number(n[2]), this.b = Number(n[3])), null !== n
            };
            var t = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
            f.prototype.rgba = function (e) {
                var n = null;
                return null !== (n = e.match(t)) && (this.r = Number(n[1]), this.g = Number(n[2]), this.b = Number(n[3]), this.a = Number(n[4])), null !== n
            }, f.prototype.toString = function () {
                return null !== this.a && 1 !== this.a ? "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" : "rgb(" + [this.r, this.g, this.b].join(",") + ")"
            }, f.prototype.namedColor = function (e) {
                e = e.toLowerCase();
                var n = l[e];
                if (n) this.r = n[0], this.g = n[1], this.b = n[2]; else if ("transparent" === e) return this.r = this.g = this.b = this.a = 0, !0;
                return !!n
            }, f.prototype.isColor = !0;
            var l = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50]
            };
            n.exports = f
        }, {}], 4: [function (n, f) {
            function o(e, n) {
                var f = j++;
                if (n = n || {}, n.logging && (v.options.logging = !0, v.options.start = Date.now()), n.async = "undefined" == typeof n.async ? !0 : n.async, n.allowTaint = "undefined" == typeof n.allowTaint ? !1 : n.allowTaint, n.removeContainer = "undefined" == typeof n.removeContainer ? !0 : n.removeContainer, n.javascriptEnabled = "undefined" == typeof n.javascriptEnabled ? !1 : n.javascriptEnabled, n.imageTimeout = "undefined" == typeof n.imageTimeout ? 1e4 : n.imageTimeout, n.renderer = "function" == typeof n.renderer ? n.renderer : c, n.strict = !!n.strict, "string" == typeof e) {
                    if ("string" != typeof n.proxy) return Promise.reject("Proxy must be used when rendering url");
                    var o = null != n.width ? n.width : window.innerWidth,
                        t = null != n.height ? n.height : window.innerHeight;
                    return g(a(e), n.proxy, document, o, t, n).then(function (e) {
                        return i(e.contentWindow.document.documentElement, e, n, o, t)
                    })
                }
                var l = (void 0 === e ? [document.documentElement] : e.length ? e : [e])[0];
                return l.setAttribute(x + f, f), d(l.ownerDocument, n, l.ownerDocument.defaultView.innerWidth, l.ownerDocument.defaultView.innerHeight, f).then(function (e) {
                    return "function" == typeof n.onrendered && (v("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), n.onrendered(e)), e
                })
            }

            function d(e, n, f, o, d) {
                return b(e, e, f, o, n, e.defaultView.pageXOffset, e.defaultView.pageYOffset).then(function (t) {
                    v("Document cloned");
                    var l = x + d, s = "[" + l + "='" + d + "']";
                    e.querySelector(s).removeAttribute(l);
                    var u = t.contentWindow, a = u.document.querySelector(s),
                        p = Promise.resolve("function" == typeof n.onclone ? n.onclone(u.document) : !0);
                    return p.then(function () {
                        return i(a, t, n, f, o)
                    })
                })
            }

            function i(e, n, f, o, d) {
                var i = n.contentWindow, a = new p(i.document), c = new y(f, a), r = h(e),
                    w = "view" === f.type ? o : s(i.document), b = "view" === f.type ? d : u(i.document),
                    g = new f.renderer(w, b, c, f, document), x = new m(e, g, a, c, f);
                return x.ready.then(function () {
                    v("Finished rendering");
                    var o;
                    return o = "view" === f.type ? l(g.canvas, {
                        width: g.canvas.width,
                        height: g.canvas.height,
                        top: 0,
                        left: 0,
                        x: 0,
                        y: 0
                    }) : e === i.document.body || e === i.document.documentElement || null != f.canvas ? g.canvas : l(g.canvas, {
                        width: null != f.width ? f.width : r.width,
                        height: null != f.height ? f.height : r.height,
                        top: r.top,
                        left: r.left,
                        x: 0,
                        y: 0
                    }), t(n, f), o
                })
            }

            function t(e, n) {
                n.removeContainer && (e.parentNode.removeChild(e), v("Cleaned up container"))
            }

            function l(e, n) {
                var f = document.createElement("canvas"), o = Math.min(e.width - 1, Math.max(0, n.left)),
                    d = Math.min(e.width, Math.max(1, n.left + n.width)),
                    i = Math.min(e.height - 1, Math.max(0, n.top)),
                    t = Math.min(e.height, Math.max(1, n.top + n.height));
                f.width = n.width, f.height = n.height;
                var l = d - o, s = t - i;
                return v("Cropping canvas at:", "left:", n.left, "top:", n.top, "width:", l, "height:", s), v("Resulting crop with width", n.width, "and height", n.height, "with x", o, "and y", i), f.getContext("2d").drawImage(e, o, i, l, s, n.x, n.y, l, s), f
            }

            function s(e) {
                return Math.max(Math.max(e.body.scrollWidth, e.documentElement.scrollWidth), Math.max(e.body.offsetWidth, e.documentElement.offsetWidth), Math.max(e.body.clientWidth, e.documentElement.clientWidth))
            }

            function u(e) {
                return Math.max(Math.max(e.body.scrollHeight, e.documentElement.scrollHeight), Math.max(e.body.offsetHeight, e.documentElement.offsetHeight), Math.max(e.body.clientHeight, e.documentElement.clientHeight))
            }

            function a(e) {
                var n = document.createElement("a");
                return n.href = e, n.href = n.href, n
            }

            var p = n("./support"), c = n("./renderers/canvas"), y = n("./imageloader"), m = n("./nodeparser"),
                r = n("./nodecontainer"), v = n("./log"), w = n("./utils"), b = n("./clone"),
                g = n("./proxy").loadUrlDocument, h = w.getBounds, x = "data-html2canvas-node", j = 0;
            o.CanvasRenderer = c, o.NodeContainer = r, o.log = v, o.utils = w;
            var k = "undefined" == typeof document || "function" != typeof Object.create || "function" != typeof document.createElement("canvas").getContext ? function () {
                return Promise.reject("No canvas support")
            } : o;
            f.exports = k, "function" == typeof e && e.amd && e("html2canvas", [], function () {
                return k
            })
        }, {
            "./clone": 2,
            "./imageloader": 11,
            "./log": 13,
            "./nodecontainer": 14,
            "./nodeparser": 15,
            "./proxy": 16,
            "./renderers/canvas": 20,
            "./support": 22,
            "./utils": 26
        }], 5: [function (e, n) {
            function f(e) {
                if (this.src = e, o("DummyImageContainer for", e), !this.promise || !this.image) {
                    o("Initiating DummyImageContainer"), f.prototype.image = new Image;
                    var n = this.image;
                    f.prototype.promise = new Promise(function (e, f) {
                        n.onload = e, n.onerror = f, n.src = d(), n.complete === !0 && e(n)
                    })
                }
            }

            var o = e("./log"), d = e("./utils").smallImage;
            n.exports = f
        }, {"./log": 13, "./utils": 26}], 6: [function (e, n) {
            function f(e, n) {
                var f, d, i = document.createElement("div"), t = document.createElement("img"),
                    l = document.createElement("span"), s = "Hidden Text";
                i.style.visibility = "hidden", i.style.fontFamily = e, i.style.fontSize = n, i.style.margin = 0, i.style.padding = 0, document.body.appendChild(i), t.src = o(), t.width = 1, t.height = 1, t.style.margin = 0, t.style.padding = 0, t.style.verticalAlign = "baseline", l.style.fontFamily = e, l.style.fontSize = n, l.style.margin = 0, l.style.padding = 0, l.appendChild(document.createTextNode(s)), i.appendChild(l), i.appendChild(t), f = t.offsetTop - l.offsetTop + 1, i.removeChild(l), i.appendChild(document.createTextNode(s)), i.style.lineHeight = "normal", t.style.verticalAlign = "super", d = t.offsetTop - i.offsetTop + 1, document.body.removeChild(i), this.baseline = f, this.lineWidth = 1, this.middle = d
            }

            var o = e("./utils").smallImage;
            n.exports = f
        }, {"./utils": 26}], 7: [function (e, n) {
            function f() {
                this.data = {}
            }

            var o = e("./font");
            f.prototype.getMetrics = function (e, n) {
                return void 0 === this.data[e + "-" + n] && (this.data[e + "-" + n] = new o(e, n)), this.data[e + "-" + n]
            }, n.exports = f
        }, {"./font": 6}], 8: [function (e, n) {
            function f(n, f, o) {
                this.image = null, this.src = n;
                var i = this, t = d(n);
                this.promise = (f ? new Promise(function (e) {
                    "about:blank" === n.contentWindow.document.URL || null == n.contentWindow.document.documentElement ? n.contentWindow.onload = n.onload = function () {
                        e(n)
                    } : e(n)
                }) : this.proxyLoad(o.proxy, t, o)).then(function (n) {
                    var f = e("./core");
                    return f(n.contentWindow.document.documentElement, {
                        type: "view",
                        width: n.width,
                        height: n.height,
                        proxy: o.proxy,
                        javascriptEnabled: o.javascriptEnabled,
                        removeContainer: o.removeContainer,
                        allowTaint: o.allowTaint,
                        imageTimeout: o.imageTimeout / 2
                    })
                }).then(function (e) {
                    return i.image = e
                })
            }

            var o = e("./utils"), d = o.getBounds, i = e("./proxy").loadUrlDocument;
            f.prototype.proxyLoad = function (e, n, f) {
                var o = this.src;
                return i(o.src, e, o.ownerDocument, n.width, n.height, f)
            }, n.exports = f
        }, {"./core": 4, "./proxy": 16, "./utils": 26}], 9: [function (e, n) {
            function f(e) {
                this.src = e.value, this.colorStops = [], this.type = null, this.x0 = .5, this.y0 = .5, this.x1 = .5, this.y1 = .5, this.promise = Promise.resolve(!0)
            }

            f.TYPES = {
                LINEAR: 1,
                RADIAL: 2
            }, f.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i, n.exports = f
        }, {}], 10: [function (e, n) {
            function f(e, n) {
                this.src = e, this.image = new Image;
                var f = this;
                this.tainted = null, this.promise = new Promise(function (o, d) {
                    f.image.onload = o, f.image.onerror = d, n && (f.image.crossOrigin = "anonymous"), f.image.src = e, f.image.complete === !0 && o(f.image)
                })
            }

            n.exports = f
        }, {}], 11: [function (e, n) {
            function f(e, n) {
                this.link = null, this.options = e, this.support = n, this.origin = this.getOrigin(window.location.href)
            }

            var o = e("./log"), d = e("./imagecontainer"), i = e("./dummyimagecontainer"),
                t = e("./proxyimagecontainer"), l = e("./framecontainer"), s = e("./svgcontainer"),
                u = e("./svgnodecontainer"), a = e("./lineargradientcontainer"), p = e("./webkitgradientcontainer"),
                c = e("./utils").bind;
            f.prototype.findImages = function (e) {
                var n = [];
                return e.reduce(function (e, n) {
                    switch (n.node.nodeName) {
                        case"IMG":
                            return e.concat([{args: [n.node.src], method: "url"}]);
                        case"svg":
                        case"IFRAME":
                            return e.concat([{args: [n.node], method: n.node.nodeName}])
                    }
                    return e
                }, []).forEach(this.addImage(n, this.loadImage), this), n
            }, f.prototype.findBackgroundImage = function (e, n) {
                return n.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(e, this.loadImage), this), e
            }, f.prototype.addImage = function (e, n) {
                return function (f) {
                    f.args.forEach(function (d) {
                        this.imageExists(e, d) || (e.splice(0, 0, n.call(this, f)), o("Added image #" + e.length, "string" == typeof d ? d.substring(0, 100) : d))
                    }, this)
                }
            }, f.prototype.hasImageBackground = function (e) {
                return "none" !== e.method
            }, f.prototype.loadImage = function (e) {
                if ("url" === e.method) {
                    var n = e.args[0];
                    return !this.isSVG(n) || this.support.svg || this.options.allowTaint ? n.match(/data:image\/.*;base64,/i) ? new d(n.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), !1) : this.isSameOrigin(n) || this.options.allowTaint === !0 || this.isSVG(n) ? new d(n, !1) : this.support.cors && !this.options.allowTaint && this.options.useCORS ? new d(n, !0) : this.options.proxy ? new t(n, this.options.proxy) : new i(n) : new s(n)
                }
                return "linear-gradient" === e.method ? new a(e) : "gradient" === e.method ? new p(e) : "svg" === e.method ? new u(e.args[0], this.support.svg) : "IFRAME" === e.method ? new l(e.args[0], this.isSameOrigin(e.args[0].src), this.options) : new i(e)
            }, f.prototype.isSVG = function (e) {
                return "svg" === e.substring(e.length - 3).toLowerCase() || s.prototype.isInline(e)
            }, f.prototype.imageExists = function (e, n) {
                return e.some(function (e) {
                    return e.src === n
                })
            }, f.prototype.isSameOrigin = function (e) {
                return this.getOrigin(e) === this.origin
            }, f.prototype.getOrigin = function (e) {
                var n = this.link || (this.link = document.createElement("a"));
                return n.href = e, n.href = n.href, n.protocol + n.hostname + n.port
            }, f.prototype.getPromise = function (e) {
                return this.timeout(e, this.options.imageTimeout)["catch"](function () {
                    var n = new i(e.src);
                    return n.promise.then(function (n) {
                        e.image = n
                    })
                })
            }, f.prototype.get = function (e) {
                var n = null;
                return this.images.some(function (f) {
                    return (n = f).src === e
                }) ? n : null
            }, f.prototype.fetch = function (e) {
                return this.images = e.reduce(c(this.findBackgroundImage, this), this.findImages(e)), this.images.forEach(function (e, n) {
                    e.promise.then(function () {
                        o("Succesfully loaded image #" + (n + 1), e)
                    }, function (f) {
                        o("Failed loading image #" + (n + 1), e, f)
                    })
                }), this.ready = Promise.all(this.images.map(this.getPromise, this)), o("Finished searching images"), this
            }, f.prototype.timeout = function (e, n) {
                var f, d = Promise.race([e.promise, new Promise(function (d, i) {
                    f = setTimeout(function () {
                        o("Timed out loading image", e), i(e)
                    }, n)
                })]).then(function (e) {
                    return clearTimeout(f), e
                });
                return d["catch"](function () {
                    clearTimeout(f)
                }), d
            }, n.exports = f
        }, {
            "./dummyimagecontainer": 5,
            "./framecontainer": 8,
            "./imagecontainer": 10,
            "./lineargradientcontainer": 12,
            "./log": 13,
            "./proxyimagecontainer": 17,
            "./svgcontainer": 23,
            "./svgnodecontainer": 24,
            "./utils": 26,
            "./webkitgradientcontainer": 27
        }], 12: [function (e, n) {
            function f(e) {
                o.apply(this, arguments), this.type = o.TYPES.LINEAR;
                var n = f.REGEXP_DIRECTION.test(e.args[0]) || !o.REGEXP_COLORSTOP.test(e.args[0]);
                n ? e.args[0].split(/\s+/).reverse().forEach(function (e, n) {
                    switch (e) {
                        case"left":
                            this.x0 = 0, this.x1 = 1;
                            break;
                        case"top":
                            this.y0 = 0, this.y1 = 1;
                            break;
                        case"right":
                            this.x0 = 1, this.x1 = 0;
                            break;
                        case"bottom":
                            this.y0 = 1, this.y1 = 0;
                            break;
                        case"to":
                            var f = this.y0, o = this.x0;
                            this.y0 = this.y1, this.x0 = this.x1, this.x1 = o, this.y1 = f;
                            break;
                        case"center":
                            break;
                        default:
                            var d = .01 * parseFloat(e, 10);
                            if (isNaN(d)) break;
                            0 === n ? (this.y0 = d, this.y1 = 1 - this.y0) : (this.x0 = d, this.x1 = 1 - this.x0)
                    }
                }, this) : (this.y0 = 0, this.y1 = 1), this.colorStops = e.args.slice(n ? 1 : 0).map(function (e) {
                    var n = e.match(o.REGEXP_COLORSTOP), f = +n[2], i = 0 === f ? "%" : n[3];
                    return {color: new d(n[1]), stop: "%" === i ? f / 100 : null}
                }), null === this.colorStops[0].stop && (this.colorStops[0].stop = 0), null === this.colorStops[this.colorStops.length - 1].stop && (this.colorStops[this.colorStops.length - 1].stop = 1), this.colorStops.forEach(function (e, n) {
                    null === e.stop && this.colorStops.slice(n).some(function (f, o) {
                        return null !== f.stop ? (e.stop = (f.stop - this.colorStops[n - 1].stop) / (o + 1) + this.colorStops[n - 1].stop, !0) : !1
                    }, this)
                }, this)
            }

            var o = e("./gradientcontainer"), d = e("./color");
            f.prototype = Object.create(o.prototype), f.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i, n.exports = f
        }, {"./color": 3, "./gradientcontainer": 9}], 13: [function (e, n) {
            var f = function () {
                f.options.logging && window.console && window.console.log && Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - f.options.start + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)))
            };
            f.options = {logging: !1}, n.exports = f
        }, {}], 14: [function (e, n) {
            function f(e, n) {
                this.node = e, this.parent = n, this.stack = null, this.bounds = null, this.borders = null, this.clip = [], this.backgroundClip = [], this.offsetBounds = null, this.visible = null, this.computedStyles = null, this.colors = {}, this.styles = {}, this.backgroundImages = null, this.transformData = null, this.transformMatrix = null, this.isPseudoElement = !1, this.opacity = null
            }

            function o(e) {
                var n = e.options[e.selectedIndex || 0];
                return n ? n.text || "" : ""
            }

            function d(e) {
                if (e && "matrix" === e[1]) return e[2].split(",").map(function (e) {
                    return parseFloat(e.trim())
                });
                if (e && "matrix3d" === e[1]) {
                    var n = e[2].split(",").map(function (e) {
                        return parseFloat(e.trim())
                    });
                    return [n[0], n[1], n[4], n[5], n[12], n[13]]
                }
            }

            function i(e) {
                return -1 !== e.toString().indexOf("%")
            }

            function t(e) {
                return e.replace("px", "")
            }

            function l(e) {
                return parseFloat(e)
            }

            var s = e("./color"), u = e("./utils"), a = u.getBounds, p = u.parseBackgrounds, c = u.offsetBounds;
            f.prototype.cloneTo = function (e) {
                e.visible = this.visible, e.borders = this.borders, e.bounds = this.bounds, e.clip = this.clip, e.backgroundClip = this.backgroundClip, e.computedStyles = this.computedStyles, e.styles = this.styles, e.backgroundImages = this.backgroundImages, e.opacity = this.opacity
            }, f.prototype.getOpacity = function () {
                return null === this.opacity ? this.opacity = this.cssFloat("opacity") : this.opacity
            }, f.prototype.assignStack = function (e) {
                this.stack = e, e.children.push(this)
            }, f.prototype.isElementVisible = function () {
                return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : "none" !== this.css("display") && "hidden" !== this.css("visibility") && !this.node.hasAttribute("data-html2canvas-ignore") && ("INPUT" !== this.node.nodeName || "hidden" !== this.node.getAttribute("type"))
            }, f.prototype.css = function (e) {
                return this.computedStyles || (this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null)), this.styles[e] || (this.styles[e] = this.computedStyles[e])
            }, f.prototype.prefixedCss = function (e) {
                var n = ["webkit", "moz", "ms", "o"], f = this.css(e);
                return void 0 === f && n.some(function (n) {
                    return f = this.css(n + e.substr(0, 1).toUpperCase() + e.substr(1)), void 0 !== f
                }, this), void 0 === f ? null : f
            }, f.prototype.computedStyle = function (e) {
                return this.node.ownerDocument.defaultView.getComputedStyle(this.node, e)
            }, f.prototype.cssInt = function (e) {
                var n = parseInt(this.css(e), 10);
                return isNaN(n) ? 0 : n
            }, f.prototype.color = function (e) {
                return this.colors[e] || (this.colors[e] = new s(this.css(e)))
            }, f.prototype.cssFloat = function (e) {
                var n = parseFloat(this.css(e));
                return isNaN(n) ? 0 : n
            }, f.prototype.fontWeight = function () {
                var e = this.css("fontWeight");
                switch (parseInt(e, 10)) {
                    case 401:
                        e = "bold";
                        break;
                    case 400:
                        e = "normal"
                }
                return e
            }, f.prototype.parseClip = function () {
                var e = this.css("clip").match(this.CLIP);
                return e ? {
                    top: parseInt(e[1], 10),
                    right: parseInt(e[2], 10),
                    bottom: parseInt(e[3], 10),
                    left: parseInt(e[4], 10)
                } : null
            }, f.prototype.parseBackgroundImages = function () {
                return this.backgroundImages || (this.backgroundImages = p(this.css("backgroundImage")))
            }, f.prototype.cssList = function (e, n) {
                var f = (this.css(e) || "").split(",");
                return f = f[n || 0] || f[0] || "auto", f = f.trim().split(" "), 1 === f.length && (f = [f[0], i(f[0]) ? "auto" : f[0]]), f
            }, f.prototype.parseBackgroundSize = function (e, n, f) {
                var o, d, t = this.cssList("backgroundSize", f);
                if (i(t[0])) o = e.width * parseFloat(t[0]) / 100; else {
                    if (/contain|cover/.test(t[0])) {
                        var l = e.width / e.height, s = n.width / n.height;
                        return s > l ^ "contain" === t[0] ? {width: e.height * s, height: e.height} : {
                            width: e.width,
                            height: e.width / s
                        }
                    }
                    o = parseInt(t[0], 10)
                }
                return d = "auto" === t[0] && "auto" === t[1] ? n.height : "auto" === t[1] ? o / n.width * n.height : i(t[1]) ? e.height * parseFloat(t[1]) / 100 : parseInt(t[1], 10), "auto" === t[0] && (o = d / n.height * n.width), {
                    width: o,
                    height: d
                }
            }, f.prototype.parseBackgroundPosition = function (e, n, f, o) {
                var d, t, l = this.cssList("backgroundPosition", f);
                return d = i(l[0]) ? (e.width - (o || n).width) * (parseFloat(l[0]) / 100) : parseInt(l[0], 10), t = "auto" === l[1] ? d / n.width * n.height : i(l[1]) ? (e.height - (o || n).height) * parseFloat(l[1]) / 100 : parseInt(l[1], 10), "auto" === l[0] && (d = t / n.height * n.width), {
                    left: d,
                    top: t
                }
            }, f.prototype.parseBackgroundRepeat = function (e) {
                return this.cssList("backgroundRepeat", e)[0]
            }, f.prototype.parseTextShadows = function () {
                var e = this.css("textShadow"), n = [];
                if (e && "none" !== e) for (var f = e.match(this.TEXT_SHADOW_PROPERTY), o = 0; f && o < f.length; o++) {
                    var d = f[o].match(this.TEXT_SHADOW_VALUES);
                    n.push({
                        color: new s(d[0]),
                        offsetX: d[1] ? parseFloat(d[1].replace("px", "")) : 0,
                        offsetY: d[2] ? parseFloat(d[2].replace("px", "")) : 0,
                        blur: d[3] ? d[3].replace("px", "") : 0
                    })
                }
                return n
            }, f.prototype.parseTransform = function () {
                if (!this.transformData) if (this.hasTransform()) {
                    var e = this.parseBounds(), n = this.prefixedCss("transformOrigin").split(" ").map(t).map(l);
                    n[0] += e.left, n[1] += e.top, this.transformData = {origin: n, matrix: this.parseTransformMatrix()}
                } else this.transformData = {origin: [0, 0], matrix: [1, 0, 0, 1, 0, 0]};
                return this.transformData
            }, f.prototype.parseTransformMatrix = function () {
                if (!this.transformMatrix) {
                    var e = this.prefixedCss("transform"), n = e ? d(e.match(this.MATRIX_PROPERTY)) : null;
                    this.transformMatrix = n ? n : [1, 0, 0, 1, 0, 0]
                }
                return this.transformMatrix
            }, f.prototype.parseBounds = function () {
                return this.bounds || (this.bounds = this.hasTransform() ? c(this.node) : a(this.node))
            }, f.prototype.hasTransform = function () {
                return "1,0,0,1,0,0" !== this.parseTransformMatrix().join(",") || this.parent && this.parent.hasTransform()
            }, f.prototype.getValue = function () {
                var e = this.node.value || "";
                return "SELECT" === this.node.tagName ? e = o(this.node) : "password" === this.node.type && (e = Array(e.length + 1).join("•")), 0 === e.length ? this.node.placeholder || "" : e
            }, f.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/, f.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g, f.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g, f.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/, n.exports = f
        }, {"./color": 3, "./utils": 26}], 15: [function (e, n) {
            function f(e, n, f, o, d) {
                N("Starting NodeParser"), this.renderer = n, this.options = d, this.range = null, this.support = f, this.renderQueue = [], this.stack = new U(!0, 1, e.ownerDocument, null);
                var i = new P(e, null);
                if (d.background && n.rectangle(0, 0, n.width, n.height, new T(d.background)), e === e.ownerDocument.documentElement) {
                    var t = new P(i.color("backgroundColor").isTransparent() ? e.ownerDocument.body : e.ownerDocument.documentElement, null);
                    n.rectangle(0, 0, n.width, n.height, t.color("backgroundColor"))
                }
                i.visibile = i.isElementVisible(), this.createPseudoHideStyles(e.ownerDocument), this.disableAnimations(e.ownerDocument), this.nodes = I([i].concat(this.getChildren(i)).filter(function (e) {
                    return e.visible = e.isElementVisible()
                }).map(this.getPseudoElements, this)), this.fontMetrics = new S, N("Fetched nodes, total:", this.nodes.length), N("Calculate overflow clips"), this.calculateOverflowClips(), N("Start fetching images"), this.images = o.fetch(this.nodes.filter(A)), this.ready = this.images.ready.then(W(function () {
                    return N("Images loaded, starting parsing"), N("Creating stacking contexts"), this.createStackingContexts(), N("Sorting stacking contexts"), this.sortStackingContexts(this.stack), this.parse(this.stack), N("Render queue created with " + this.renderQueue.length + " items"), new Promise(W(function (e) {
                        d.async ? "function" == typeof d.async ? d.async.call(this, this.renderQueue, e) : this.renderQueue.length > 0 ? (this.renderIndex = 0, this.asyncRenderer(this.renderQueue, e)) : e() : (this.renderQueue.forEach(this.paint, this), e())
                    }, this))
                }, this))
            }

            function o(e) {
                return e.parent && e.parent.clip.length
            }

            function d(e) {
                return e.replace(/(\-[a-z])/g, function (e) {
                    return e.toUpperCase().replace("-", "")
                })
            }

            function i() {
            }

            function t(e, n, f, o) {
                return e.map(function (d, i) {
                    if (d.width > 0) {
                        var t = n.left, l = n.top, s = n.width, u = n.height - e[2].width;
                        switch (i) {
                            case 0:
                                u = e[0].width, d.args = a({
                                    c1: [t, l],
                                    c2: [t + s, l],
                                    c3: [t + s - e[1].width, l + u],
                                    c4: [t + e[3].width, l + u]
                                }, o[0], o[1], f.topLeftOuter, f.topLeftInner, f.topRightOuter, f.topRightInner);
                                break;
                            case 1:
                                t = n.left + n.width - e[1].width, s = e[1].width, d.args = a({
                                    c1: [t + s, l],
                                    c2: [t + s, l + u + e[2].width],
                                    c3: [t, l + u],
                                    c4: [t, l + e[0].width]
                                }, o[1], o[2], f.topRightOuter, f.topRightInner, f.bottomRightOuter, f.bottomRightInner);
                                break;
                            case 2:
                                l = l + n.height - e[2].width, u = e[2].width, d.args = a({
                                    c1: [t + s, l + u],
                                    c2: [t, l + u],
                                    c3: [t + e[3].width, l],
                                    c4: [t + s - e[3].width, l]
                                }, o[2], o[3], f.bottomRightOuter, f.bottomRightInner, f.bottomLeftOuter, f.bottomLeftInner);
                                break;
                            case 3:
                                s = e[3].width, d.args = a({
                                    c1: [t, l + u + e[2].width],
                                    c2: [t, l],
                                    c3: [t + s, l + e[0].width],
                                    c4: [t + s, l + u]
                                }, o[3], o[0], f.bottomLeftOuter, f.bottomLeftInner, f.topLeftOuter, f.topLeftInner)
                        }
                    }
                    return d
                })
            }

            function l(e, n, f, o) {
                var d = 4 * ((Math.sqrt(2) - 1) / 3), i = f * d, t = o * d, l = e + f, s = n + o;
                return {
                    topLeft: u({x: e, y: s}, {x: e, y: s - t}, {x: l - i, y: n}, {x: l, y: n}),
                    topRight: u({x: e, y: n}, {x: e + i, y: n}, {x: l, y: s - t}, {x: l, y: s}),
                    bottomRight: u({x: l, y: n}, {x: l, y: n + t}, {x: e + i, y: s}, {x: e, y: s}),
                    bottomLeft: u({x: l, y: s}, {x: l - i, y: s}, {x: e, y: n + t}, {x: e, y: n})
                }
            }

            function s(e, n, f) {
                var o = e.left, d = e.top, i = e.width, t = e.height, s = n[0][0] < i / 2 ? n[0][0] : i / 2,
                    u = n[0][1] < t / 2 ? n[0][1] : t / 2, a = n[1][0] < i / 2 ? n[1][0] : i / 2,
                    p = n[1][1] < t / 2 ? n[1][1] : t / 2, c = n[2][0] < i / 2 ? n[2][0] : i / 2,
                    y = n[2][1] < t / 2 ? n[2][1] : t / 2, m = n[3][0] < i / 2 ? n[3][0] : i / 2,
                    r = n[3][1] < t / 2 ? n[3][1] : t / 2, v = i - a, w = t - y, b = i - c, g = t - r;
                return {
                    topLeftOuter: l(o, d, s, u).topLeft.subdivide(.5),
                    topLeftInner: l(o + f[3].width, d + f[0].width, Math.max(0, s - f[3].width), Math.max(0, u - f[0].width)).topLeft.subdivide(.5),
                    topRightOuter: l(o + v, d, a, p).topRight.subdivide(.5),
                    topRightInner: l(o + Math.min(v, i + f[3].width), d + f[0].width, v > i + f[3].width ? 0 : a - f[3].width, p - f[0].width).topRight.subdivide(.5),
                    bottomRightOuter: l(o + b, d + w, c, y).bottomRight.subdivide(.5),
                    bottomRightInner: l(o + Math.min(b, i - f[3].width), d + Math.min(w, t + f[0].width), Math.max(0, c - f[1].width), y - f[2].width).bottomRight.subdivide(.5),
                    bottomLeftOuter: l(o, d + g, m, r).bottomLeft.subdivide(.5),
                    bottomLeftInner: l(o + f[3].width, d + g, Math.max(0, m - f[3].width), r - f[2].width).bottomLeft.subdivide(.5)
                }
            }

            function u(e, n, f, o) {
                var d = function (e, n, f) {
                    return {x: e.x + (n.x - e.x) * f, y: e.y + (n.y - e.y) * f}
                };
                return {
                    start: e, startControl: n, endControl: f, end: o, subdivide: function (i) {
                        var t = d(e, n, i), l = d(n, f, i), s = d(f, o, i), a = d(t, l, i), p = d(l, s, i),
                            c = d(a, p, i);
                        return [u(e, t, a, c), u(c, p, s, o)]
                    }, curveTo: function (e) {
                        e.push(["bezierCurve", n.x, n.y, f.x, f.y, o.x, o.y])
                    }, curveToReversed: function (o) {
                        o.push(["bezierCurve", f.x, f.y, n.x, n.y, e.x, e.y])
                    }
                }
            }

            function a(e, n, f, o, d, i, t) {
                var l = [];
                return n[0] > 0 || n[1] > 0 ? (l.push(["line", o[1].start.x, o[1].start.y]), o[1].curveTo(l)) : l.push(["line", e.c1[0], e.c1[1]]), f[0] > 0 || f[1] > 0 ? (l.push(["line", i[0].start.x, i[0].start.y]), i[0].curveTo(l), l.push(["line", t[0].end.x, t[0].end.y]), t[0].curveToReversed(l)) : (l.push(["line", e.c2[0], e.c2[1]]), l.push(["line", e.c3[0], e.c3[1]])), n[0] > 0 || n[1] > 0 ? (l.push(["line", d[1].end.x, d[1].end.y]), d[1].curveToReversed(l)) : l.push(["line", e.c4[0], e.c4[1]]), l
            }

            function p(e, n, f, o, d, i, t) {
                n[0] > 0 || n[1] > 0 ? (e.push(["line", o[0].start.x, o[0].start.y]), o[0].curveTo(e), o[1].curveTo(e)) : e.push(["line", i, t]), (f[0] > 0 || f[1] > 0) && e.push(["line", d[0].start.x, d[0].start.y])
            }

            function c(e) {
                return e.cssInt("zIndex") < 0
            }

            function y(e) {
                return e.cssInt("zIndex") > 0
            }

            function m(e) {
                return 0 === e.cssInt("zIndex")
            }

            function r(e) {
                return -1 !== ["inline", "inline-block", "inline-table"].indexOf(e.css("display"))
            }

            function v(e) {
                return e instanceof U
            }

            function w(e) {
                return e.node.data.trim().length > 0
            }

            function b(e) {
                return /^(normal|none|0px)$/.test(e.parent.css("letterSpacing"))
            }

            function g(e) {
                return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function (n) {
                    var f = e.css("border" + n + "Radius"), o = f.split(" ");
                    return o.length <= 1 && (o[1] = o[0]), o.map(F)
                })
            }

            function h(e) {
                return e.nodeType === Node.TEXT_NODE || e.nodeType === Node.ELEMENT_NODE
            }

            function x(e) {
                var n = e.css("position"),
                    f = -1 !== ["absolute", "relative", "fixed"].indexOf(n) ? e.css("zIndex") : "auto";
                return "auto" !== f
            }

            function j(e) {
                return "static" !== e.css("position")
            }

            function k(e) {
                return "none" !== e.css("float")
            }

            function q(e) {
                return -1 !== ["inline-block", "inline-table"].indexOf(e.css("display"))
            }

            function z(e) {
                var n = this;
                return function () {
                    return !e.apply(n, arguments)
                }
            }

            function A(e) {
                return e.node.nodeType === Node.ELEMENT_NODE
            }

            function B(e) {
                return e.isPseudoElement === !0
            }

            function C(e) {
                return e.node.nodeType === Node.TEXT_NODE
            }

            function D(e) {
                return function (n, f) {
                    return n.cssInt("zIndex") + e.indexOf(n) / e.length - (f.cssInt("zIndex") + e.indexOf(f) / e.length)
                }
            }

            function E(e) {
                return e.getOpacity() < 1
            }

            function F(e) {
                return parseInt(e, 10)
            }

            function G(e) {
                return e.width
            }

            function H(e) {
                return e.node.nodeType !== Node.ELEMENT_NODE || -1 === ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(e.node.nodeName)
            }

            function I(e) {
                return [].concat.apply([], e)
            }

            function J(e) {
                var n = e.substr(0, 1);
                return n === e.substr(e.length - 1) && n.match(/'|"/) ? e.substr(1, e.length - 2) : e
            }

            function K(e) {
                for (var n, f = [], o = 0, d = !1; e.length;) L(e[o]) === d ? (n = e.splice(0, o), n.length && f.push(O.ucs2.encode(n)), d = !d, o = 0) : o++, o >= e.length && (n = e.splice(0, o), n.length && f.push(O.ucs2.encode(n)));
                return f
            }

            function L(e) {
                return -1 !== [32, 13, 10, 9, 45].indexOf(e)
            }

            function M(e) {
                return /[^\u0000-\u00ff]/.test(e)
            }

            var N = e("./log"), O = e("punycode"), P = e("./nodecontainer"), Q = e("./textcontainer"),
                R = e("./pseudoelementcontainer"), S = e("./fontmetrics"), T = e("./color"), U = e("./stackingcontext"),
                V = e("./utils"), W = V.bind, X = V.getBounds, Y = V.parseBackgrounds, Z = V.offsetBounds;
            f.prototype.calculateOverflowClips = function () {
                this.nodes.forEach(function (e) {
                    if (A(e)) {
                        B(e) && e.appendToDOM(), e.borders = this.parseBorders(e);
                        var n = "hidden" === e.css("overflow") ? [e.borders.clip] : [], f = e.parseClip();
                        f && -1 !== ["absolute", "fixed"].indexOf(e.css("position")) && n.push([["rect", e.bounds.left + f.left, e.bounds.top + f.top, f.right - f.left, f.bottom - f.top]]), e.clip = o(e) ? e.parent.clip.concat(n) : n, e.backgroundClip = "hidden" !== e.css("overflow") ? e.clip.concat([e.borders.clip]) : e.clip, B(e) && e.cleanDOM()
                    } else C(e) && (e.clip = o(e) ? e.parent.clip : []);
                    B(e) || (e.bounds = null)
                }, this)
            }, f.prototype.asyncRenderer = function (e, n, f) {
                f = f || Date.now(), this.paint(e[this.renderIndex++]), e.length === this.renderIndex ? n() : f + 20 > Date.now() ? this.asyncRenderer(e, n, f) : setTimeout(W(function () {
                    this.asyncRenderer(e, n)
                }, this), 0)
            }, f.prototype.createPseudoHideStyles = function (e) {
                this.createStyles(e, "." + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }.' + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }')
            }, f.prototype.disableAnimations = function (e) {
                this.createStyles(e, "* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}")
            }, f.prototype.createStyles = function (e, n) {
                var f = e.createElement("style");
                f.innerHTML = n, e.body.appendChild(f)
            }, f.prototype.getPseudoElements = function (e) {
                var n = [[e]];
                if (e.node.nodeType === Node.ELEMENT_NODE) {
                    var f = this.getPseudoElement(e, ":before"), o = this.getPseudoElement(e, ":after");
                    f && n.push(f), o && n.push(o)
                }
                return I(n)
            }, f.prototype.getPseudoElement = function (e, n) {
                var f = e.computedStyle(n);
                if (!f || !f.content || "none" === f.content || "-moz-alt-content" === f.content || "none" === f.display) return null;
                for (var o = J(f.content), i = "url" === o.substr(0, 3), t = document.createElement(i ? "img" : "html2canvaspseudoelement"), l = new R(t, e, n), s = f.length - 1; s >= 0; s--) {
                    var u = d(f.item(s));
                    t.style[u] = f[u]
                }
                if (t.className = R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + R.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, i) return t.src = Y(o)[0].args[0], [l];
                var a = document.createTextNode(o);
                return t.appendChild(a), [l, new Q(a, l)]
            }, f.prototype.getChildren = function (e) {
                return I([].filter.call(e.node.childNodes, h).map(function (n) {
                    var f = [n.nodeType === Node.TEXT_NODE ? new Q(n, e) : new P(n, e)].filter(H);
                    return n.nodeType === Node.ELEMENT_NODE && f.length && "TEXTAREA" !== n.tagName ? f[0].isElementVisible() ? f.concat(this.getChildren(f[0])) : [] : f
                }, this))
            }, f.prototype.newStackingContext = function (e, n) {
                var f = new U(n, e.getOpacity(), e.node, e.parent);
                e.cloneTo(f);
                var o = n ? f.getParentStack(this) : f.parent.stack;
                o.contexts.push(f), e.stack = f
            }, f.prototype.createStackingContexts = function () {
                this.nodes.forEach(function (e) {
                    A(e) && (this.isRootElement(e) || E(e) || x(e) || this.isBodyWithTransparentRoot(e) || e.hasTransform()) ? this.newStackingContext(e, !0) : A(e) && (j(e) && m(e) || q(e) || k(e)) ? this.newStackingContext(e, !1) : e.assignStack(e.parent.stack)
                }, this)
            }, f.prototype.isBodyWithTransparentRoot = function (e) {
                return "BODY" === e.node.nodeName && e.parent.color("backgroundColor").isTransparent()
            }, f.prototype.isRootElement = function (e) {
                return null === e.parent
            }, f.prototype.sortStackingContexts = function (e) {
                e.contexts.sort(D(e.contexts.slice(0))), e.contexts.forEach(this.sortStackingContexts, this)
            }, f.prototype.parseTextBounds = function (e) {
                return function (n, f, o) {
                    if ("none" !== e.parent.css("textDecoration").substr(0, 4) || 0 !== n.trim().length) {
                        if (this.support.rangeBounds && !e.parent.hasTransform()) {
                            var d = o.slice(0, f).join("").length;
                            return this.getRangeBounds(e.node, d, n.length)
                        }
                        if (e.node && "string" == typeof e.node.data) {
                            var i = e.node.splitText(n.length),
                                t = this.getWrapperBounds(e.node, e.parent.hasTransform());
                            return e.node = i, t
                        }
                    } else (!this.support.rangeBounds || e.parent.hasTransform()) && (e.node = e.node.splitText(n.length));
                    return {}
                }
            }, f.prototype.getWrapperBounds = function (e, n) {
                var f = e.ownerDocument.createElement("html2canvaswrapper"), o = e.parentNode, d = e.cloneNode(!0);
                f.appendChild(e.cloneNode(!0)), o.replaceChild(f, e);
                var i = n ? Z(f) : X(f);
                return o.replaceChild(d, f), i
            }, f.prototype.getRangeBounds = function (e, n, f) {
                var o = this.range || (this.range = e.ownerDocument.createRange());
                return o.setStart(e, n), o.setEnd(e, n + f), o.getBoundingClientRect()
            }, f.prototype.parse = function (e) {
                var n = e.contexts.filter(c), f = e.children.filter(A), o = f.filter(z(k)),
                    d = o.filter(z(j)).filter(z(r)), t = f.filter(z(j)).filter(k), l = o.filter(z(j)).filter(r),
                    s = e.contexts.concat(o.filter(j)).filter(m), u = e.children.filter(C).filter(w),
                    a = e.contexts.filter(y);
                n.concat(d).concat(t).concat(l).concat(s).concat(u).concat(a).forEach(function (e) {
                    this.renderQueue.push(e), v(e) && (this.parse(e), this.renderQueue.push(new i))
                }, this)
            }, f.prototype.paint = function (e) {
                try {
                    e instanceof i ? this.renderer.ctx.restore() : C(e) ? (B(e.parent) && e.parent.appendToDOM(), this.paintText(e), B(e.parent) && e.parent.cleanDOM()) : this.paintNode(e)
                } catch (n) {
                    if (N(n), this.options.strict) throw n
                }
            }, f.prototype.paintNode = function (e) {
                v(e) && (this.renderer.setOpacity(e.opacity), this.renderer.ctx.save(), e.hasTransform() && this.renderer.setTransform(e.parseTransform())), "INPUT" === e.node.nodeName && "checkbox" === e.node.type ? this.paintCheckbox(e) : "INPUT" === e.node.nodeName && "radio" === e.node.type ? this.paintRadio(e) : this.paintElement(e)
            }, f.prototype.paintElement = function (e) {
                var n = e.parseBounds();
                this.renderer.clip(e.backgroundClip, function () {
                    this.renderer.renderBackground(e, n, e.borders.borders.map(G))
                }, this), this.renderer.clip(e.clip, function () {
                    this.renderer.renderBorders(e.borders.borders)
                }, this), this.renderer.clip(e.backgroundClip, function () {
                    switch (e.node.nodeName) {
                        case"svg":
                        case"IFRAME":
                            var f = this.images.get(e.node);
                            f ? this.renderer.renderImage(e, n, e.borders, f) : N("Error loading <" + e.node.nodeName + ">", e.node);
                            break;
                        case"IMG":
                            var o = this.images.get(e.node.src);
                            o ? this.renderer.renderImage(e, n, e.borders, o) : N("Error loading <img>", e.node.src);
                            break;
                        case"CANVAS":
                            this.renderer.renderImage(e, n, e.borders, {image: e.node});
                            break;
                        case"SELECT":
                        case"INPUT":
                        case"TEXTAREA":
                            this.paintFormValue(e)
                    }
                }, this)
            }, f.prototype.paintCheckbox = function (e) {
                var n = e.parseBounds(), f = Math.min(n.width, n.height),
                    o = {width: f - 1, height: f - 1, top: n.top, left: n.left}, d = [3, 3], i = [d, d, d, d],
                    l = [1, 1, 1, 1].map(function (e) {
                        return {color: new T("#A5A5A5"), width: e}
                    }), u = s(o, i, l);
                this.renderer.clip(e.backgroundClip, function () {
                    this.renderer.rectangle(o.left + 1, o.top + 1, o.width - 2, o.height - 2, new T("#DEDEDE")), this.renderer.renderBorders(t(l, o, u, i)), e.node.checked && (this.renderer.font(new T("#424242"), "normal", "normal", "bold", f - 3 + "px", "arial"), this.renderer.text("✔", o.left + f / 6, o.top + f - 1))
                }, this)
            }, f.prototype.paintRadio = function (e) {
                var n = e.parseBounds(), f = Math.min(n.width, n.height) - 2;
                this.renderer.clip(e.backgroundClip, function () {
                    this.renderer.circleStroke(n.left + 1, n.top + 1, f, new T("#DEDEDE"), 1, new T("#A5A5A5")), e.node.checked && this.renderer.circle(Math.ceil(n.left + f / 4) + 1, Math.ceil(n.top + f / 4) + 1, Math.floor(f / 2), new T("#424242"))
                }, this)
            }, f.prototype.paintFormValue = function (e) {
                var n = e.getValue();
                if (n.length > 0) {
                    var f = e.node.ownerDocument, o = f.createElement("html2canvaswrapper"),
                        d = ["lineHeight", "textAlign", "fontFamily", "fontWeight", "fontSize", "color", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "width", "height", "borderLeftStyle", "borderTopStyle", "borderLeftWidth", "borderTopWidth", "boxSizing", "whiteSpace", "wordWrap"];
                    d.forEach(function (n) {
                        try {
                            o.style[n] = e.css(n)
                        } catch (f) {
                            N("html2canvas: Parse: Exception caught in renderFormValue: " + f.message)
                        }
                    });
                    var i = e.parseBounds();
                    o.style.position = "fixed", o.style.left = i.left + "px", o.style.top = i.top + "px", o.textContent = n, f.body.appendChild(o), this.paintText(new Q(o.firstChild, e)), f.body.removeChild(o)
                }
            }, f.prototype.paintText = function (e) {
                e.applyTextTransform();
                var n = O.ucs2.decode(e.node.data),
                    f = this.options.letterRendering && !b(e) || M(e.node.data) ? n.map(function (e) {
                        return O.ucs2.encode([e])
                    }) : K(n), o = e.parent.fontWeight(), d = e.parent.css("fontSize"), i = e.parent.css("fontFamily"),
                    t = e.parent.parseTextShadows();
                this.renderer.font(e.parent.color("color"), e.parent.css("fontStyle"), e.parent.css("fontVariant"), o, d, i), t.length ? this.renderer.fontShadow(t[0].color, t[0].offsetX, t[0].offsetY, t[0].blur) : this.renderer.clearShadow(), this.renderer.clip(e.parent.clip, function () {
                    f.map(this.parseTextBounds(e), this).forEach(function (n, o) {
                        n && (this.renderer.text(f[o], n.left, n.bottom), this.renderTextDecoration(e.parent, n, this.fontMetrics.getMetrics(i, d)))
                    }, this)
                }, this)
            }, f.prototype.renderTextDecoration = function (e, n, f) {
                switch (e.css("textDecoration").split(" ")[0]) {
                    case"underline":
                        this.renderer.rectangle(n.left, Math.round(n.top + f.baseline + f.lineWidth), n.width, 1, e.color("color"));
                        break;
                    case"overline":
                        this.renderer.rectangle(n.left, Math.round(n.top), n.width, 1, e.color("color"));
                        break;
                    case"line-through":
                        this.renderer.rectangle(n.left, Math.ceil(n.top + f.middle + f.lineWidth), n.width, 1, e.color("color"))
                }
            };
            var $ = {inset: [["darken", .6], ["darken", .1], ["darken", .1], ["darken", .6]]};
            f.prototype.parseBorders = function (e) {
                var n = e.parseBounds(), f = g(e), o = ["Top", "Right", "Bottom", "Left"].map(function (n, f) {
                    var o = e.css("border" + n + "Style"), d = e.color("border" + n + "Color");
                    "inset" === o && d.isBlack() && (d = new T([255, 255, 255, d.a]));
                    var i = $[o] ? $[o][f] : null;
                    return {width: e.cssInt("border" + n + "Width"), color: i ? d[i[0]](i[1]) : d, args: null}
                }), d = s(n, f, o);
                return {clip: this.parseBackgroundClip(e, d, o, f, n), borders: t(o, n, d, f)}
            }, f.prototype.parseBackgroundClip = function (e, n, f, o, d) {
                var i = e.css("backgroundClip"), t = [];
                switch (i) {
                    case"content-box":
                    case"padding-box":
                        p(t, o[0], o[1], n.topLeftInner, n.topRightInner, d.left + f[3].width, d.top + f[0].width), p(t, o[1], o[2], n.topRightInner, n.bottomRightInner, d.left + d.width - f[1].width, d.top + f[0].width), p(t, o[2], o[3], n.bottomRightInner, n.bottomLeftInner, d.left + d.width - f[1].width, d.top + d.height - f[2].width), p(t, o[3], o[0], n.bottomLeftInner, n.topLeftInner, d.left + f[3].width, d.top + d.height - f[2].width);
                        break;
                    default:
                        p(t, o[0], o[1], n.topLeftOuter, n.topRightOuter, d.left, d.top), p(t, o[1], o[2], n.topRightOuter, n.bottomRightOuter, d.left + d.width, d.top), p(t, o[2], o[3], n.bottomRightOuter, n.bottomLeftOuter, d.left + d.width, d.top + d.height), p(t, o[3], o[0], n.bottomLeftOuter, n.topLeftOuter, d.left, d.top + d.height)
                }
                return t
            }, n.exports = f
        }, {
            "./color": 3,
            "./fontmetrics": 7,
            "./log": 13,
            "./nodecontainer": 14,
            "./pseudoelementcontainer": 18,
            "./stackingcontext": 21,
            "./textcontainer": 25,
            "./utils": 26,
            punycode: 1
        }], 16: [function (e, n, f) {
            function o(e, n, f) {
                var o = "withCredentials" in new XMLHttpRequest;
                if (!n) return Promise.reject("No proxy configured");
                var d = t(o), s = l(n, e, d);
                return o ? a(s) : i(f, s, d).then(function (e) {
                    return m(e.content)
                })
            }

            function d(e, n, f) {
                var o = "crossOrigin" in new Image, d = t(o), s = l(n, e, d);
                return o ? Promise.resolve(s) : i(f, s, d).then(function (e) {
                    return "data:" + e.type + ";base64," + e.content
                })
            }

            function i(e, n, f) {
                return new Promise(function (o, d) {
                    var i = e.createElement("script"), t = function () {
                        delete window.html2canvas.proxy[f], e.body.removeChild(i)
                    };
                    window.html2canvas.proxy[f] = function (e) {
                        t(), o(e)
                    }, i.src = n, i.onerror = function (e) {
                        t(), d(e)
                    }, e.body.appendChild(i)
                })
            }

            function t(e) {
                return e ? "" : "html2canvas_" + Date.now() + "_" + ++r + "_" + Math.round(1e5 * Math.random())
            }

            function l(e, n, f) {
                return e + "?url=" + encodeURIComponent(n) + (f.length ? "&callback=html2canvas.proxy." + f : "")
            }

            function s(e) {
                return function (n) {
                    var f, o = new DOMParser;
                    try {
                        f = o.parseFromString(n, "text/html")
                    } catch (d) {
                        c("DOMParser not supported, falling back to createHTMLDocument"), f = document.implementation.createHTMLDocument("");
                        try {
                            f.open(), f.write(n), f.close()
                        } catch (i) {
                            c("createHTMLDocument write not supported, falling back to document.body.innerHTML"), f.body.innerHTML = n
                        }
                    }
                    var t = f.querySelector("base");
                    if (!t || !t.href.host) {
                        var l = f.createElement("base");
                        l.href = e, f.head.insertBefore(l, f.head.firstChild)
                    }
                    return f
                }
            }

            function u(e, n, f, d, i, t) {
                return new o(e, n, window.document).then(s(e)).then(function (e) {
                    return y(e, f, d, i, t, 0, 0)
                })
            }

            var a = e("./xhr"), p = e("./utils"), c = e("./log"), y = e("./clone"), m = p.decode64, r = 0;
            f.Proxy = o, f.ProxyURL = d, f.loadUrlDocument = u
        }, {"./clone": 2, "./log": 13, "./utils": 26, "./xhr": 28}], 17: [function (e, n) {
            function f(e, n) {
                var f = document.createElement("a");
                f.href = e, e = f.href, this.src = e, this.image = new Image;
                var d = this;
                this.promise = new Promise(function (f, i) {
                    d.image.crossOrigin = "Anonymous", d.image.onload = f, d.image.onerror = i, new o(e, n, document).then(function (e) {
                        d.image.src = e
                    })["catch"](i)
                })
            }

            var o = e("./proxy").ProxyURL;
            n.exports = f
        }, {"./proxy": 16}], 18: [function (e, n) {
            function f(e, n, f) {
                o.call(this, e, n), this.isPseudoElement = !0, this.before = ":before" === f
            }

            var o = e("./nodecontainer");
            f.prototype.cloneTo = function (e) {
                f.prototype.cloneTo.call(this, e), e.isPseudoElement = !0, e.before = this.before
            }, f.prototype = Object.create(o.prototype), f.prototype.appendToDOM = function () {
                this.before ? this.parent.node.insertBefore(this.node, this.parent.node.firstChild) : this.parent.node.appendChild(this.node), this.parent.node.className += " " + this.getHideClass()
            }, f.prototype.cleanDOM = function () {
                this.node.parentNode.removeChild(this.node), this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "")
            }, f.prototype.getHideClass = function () {
                return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")]
            }, f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before", f.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after", n.exports = f
        }, {"./nodecontainer": 14}], 19: [function (e, n) {
            function f(e, n, f, o, d) {
                this.width = e, this.height = n, this.images = f, this.options = o, this.document = d
            }

            var o = e("./log");
            f.prototype.renderImage = function (e, n, f, o) {
                var d = e.cssInt("paddingLeft"), i = e.cssInt("paddingTop"), t = e.cssInt("paddingRight"),
                    l = e.cssInt("paddingBottom"), s = f.borders, u = n.width - (s[1].width + s[3].width + d + t),
                    a = n.height - (s[0].width + s[2].width + i + l);
                this.drawImage(o, 0, 0, o.image.width || u, o.image.height || a, n.left + d + s[3].width, n.top + i + s[0].width, u, a)
            }, f.prototype.renderBackground = function (e, n, f) {
                n.height > 0 && n.width > 0 && (this.renderBackgroundColor(e, n), this.renderBackgroundImage(e, n, f))
            }, f.prototype.renderBackgroundColor = function (e, n) {
                var f = e.color("backgroundColor");
                f.isTransparent() || this.rectangle(n.left, n.top, n.width, n.height, f)
            }, f.prototype.renderBorders = function (e) {
                e.forEach(this.renderBorder, this)
            }, f.prototype.renderBorder = function (e) {
                e.color.isTransparent() || null === e.args || this.drawShape(e.args, e.color)
            }, f.prototype.renderBackgroundImage = function (e, n, f) {
                var d = e.parseBackgroundImages();
                d.reverse().forEach(function (d, i, t) {
                    switch (d.method) {
                        case"url":
                            var l = this.images.get(d.args[0]);
                            l ? this.renderBackgroundRepeating(e, n, l, t.length - (i + 1), f) : o("Error loading background-image", d.args[0]);
                            break;
                        case"linear-gradient":
                        case"gradient":
                            var s = this.images.get(d.value);
                            s ? this.renderBackgroundGradient(s, n, f) : o("Error loading background-image", d.args[0]);
                            break;
                        case"none":
                            break;
                        default:
                            o("Unknown background-image type", d.args[0])
                    }
                }, this)
            }, f.prototype.renderBackgroundRepeating = function (e, n, f, o, d) {
                var i = e.parseBackgroundSize(n, f.image, o), t = e.parseBackgroundPosition(n, f.image, o, i),
                    l = e.parseBackgroundRepeat(o);
                switch (l) {
                    case"repeat-x":
                    case"repeat no-repeat":
                        this.backgroundRepeatShape(f, t, i, n, n.left + d[3], n.top + t.top + d[0], 99999, i.height, d);
                        break;
                    case"repeat-y":
                    case"no-repeat repeat":
                        this.backgroundRepeatShape(f, t, i, n, n.left + t.left + d[3], n.top + d[0], i.width, 99999, d);
                        break;
                    case"no-repeat":
                        this.backgroundRepeatShape(f, t, i, n, n.left + t.left + d[3], n.top + t.top + d[0], i.width, i.height, d);
                        break;
                    default:
                        this.renderBackgroundRepeat(f, t, i, {top: n.top, left: n.left}, d[3], d[0])
                }
            }, n.exports = f
        }, {"./log": 13}], 20: [function (e, n) {
            function f(e, n) {
                d.apply(this, arguments), this.canvas = this.options.canvas || this.document.createElement("canvas"), this.options.canvas || (this.canvas.width = e, this.canvas.height = n), this.ctx = this.canvas.getContext("2d"), this.taintCtx = this.document.createElement("canvas").getContext("2d"), this.ctx.textBaseline = "bottom", this.variables = {}, t("Initialized CanvasRenderer with size", e, "x", n)
            }

            function o(e) {
                return e.length > 0
            }

            var d = e("../renderer"), i = e("../lineargradientcontainer"), t = e("../log");
            f.prototype = Object.create(d.prototype), f.prototype.setFillStyle = function (e) {
                return this.ctx.fillStyle = "object" == typeof e && e.isColor ? e.toString() : e, this.ctx
            }, f.prototype.rectangle = function (e, n, f, o, d) {
                this.setFillStyle(d).fillRect(e, n, f, o)
            }, f.prototype.circle = function (e, n, f, o) {
                this.setFillStyle(o), this.ctx.beginPath(), this.ctx.arc(e + f / 2, n + f / 2, f / 2, 0, 2 * Math.PI, !0), this.ctx.closePath(), this.ctx.fill()
            }, f.prototype.circleStroke = function (e, n, f, o, d, i) {
                this.circle(e, n, f, o), this.ctx.strokeStyle = i.toString(), this.ctx.stroke()
            }, f.prototype.drawShape = function (e, n) {
                this.shape(e), this.setFillStyle(n).fill()
            }, f.prototype.taints = function (e) {
                if (null === e.tainted) {
                    this.taintCtx.drawImage(e.image, 0, 0);
                    try {
                        this.taintCtx.getImageData(0, 0, 1, 1), e.tainted = !1
                    } catch (n) {
                        this.taintCtx = document.createElement("canvas").getContext("2d"), e.tainted = !0
                    }
                }
                return e.tainted
            }, f.prototype.drawImage = function (e, n, f, o, d, i, t, l, s) {
                (!this.taints(e) || this.options.allowTaint) && this.ctx.drawImage(e.image, n, f, o, d, i, t, l, s)
            }, f.prototype.clip = function (e, n, f) {
                this.ctx.save(), e.filter(o).forEach(function (e) {
                    this.shape(e).clip()
                }, this), n.call(f), this.ctx.restore()
            }, f.prototype.shape = function (e) {
                return this.ctx.beginPath(), e.forEach(function (e, n) {
                    "rect" === e[0] ? this.ctx.rect.apply(this.ctx, e.slice(1)) : this.ctx[0 === n ? "moveTo" : e[0] + "To"].apply(this.ctx, e.slice(1))
                }, this), this.ctx.closePath(), this.ctx
            }, f.prototype.font = function (e, n, f, o, d, i) {
                this.setFillStyle(e).font = [n, f, o, d, i].join(" ").split(",")[0]
            }, f.prototype.fontShadow = function (e, n, f, o) {
                this.setVariable("shadowColor", e.toString()).setVariable("shadowOffsetY", n).setVariable("shadowOffsetX", f).setVariable("shadowBlur", o)
            }, f.prototype.clearShadow = function () {
                this.setVariable("shadowColor", "rgba(0,0,0,0)")
            }, f.prototype.setOpacity = function (e) {
                this.ctx.globalAlpha = e
            }, f.prototype.setTransform = function (e) {
                this.ctx.translate(e.origin[0], e.origin[1]), this.ctx.transform.apply(this.ctx, e.matrix), this.ctx.translate(-e.origin[0], -e.origin[1])
            }, f.prototype.setVariable = function (e, n) {
                return this.variables[e] !== n && (this.variables[e] = this.ctx[e] = n), this
            }, f.prototype.text = function (e, n, f) {
                this.ctx.fillText(e, n, f)
            }, f.prototype.backgroundRepeatShape = function (e, n, f, o, d, i, t, l, s) {
                var u = [["line", Math.round(d), Math.round(i)], ["line", Math.round(d + t), Math.round(i)], ["line", Math.round(d + t), Math.round(l + i)], ["line", Math.round(d), Math.round(l + i)]];
                this.clip([u], function () {
                    this.renderBackgroundRepeat(e, n, f, o, s[3], s[0])
                }, this)
            }, f.prototype.renderBackgroundRepeat = function (e, n, f, o, d, i) {
                var t = Math.round(o.left + n.left + d), l = Math.round(o.top + n.top + i);
                this.setFillStyle(this.ctx.createPattern(this.resizeImage(e, f), "repeat")), this.ctx.translate(t, l), this.ctx.fill(), this.ctx.translate(-t, -l)
            }, f.prototype.renderBackgroundGradient = function (e, n) {
                if (e instanceof i) {
                    var f = this.ctx.createLinearGradient(n.left + n.width * e.x0, n.top + n.height * e.y0, n.left + n.width * e.x1, n.top + n.height * e.y1);
                    e.colorStops.forEach(function (e) {
                        f.addColorStop(e.stop, e.color.toString())
                    }), this.rectangle(n.left, n.top, n.width, n.height, f)
                }
            }, f.prototype.resizeImage = function (e, n) {
                var f = e.image;
                if (f.width === n.width && f.height === n.height) return f;
                var o, d = document.createElement("canvas");
                return d.width = n.width, d.height = n.height, o = d.getContext("2d"), o.drawImage(f, 0, 0, f.width, f.height, 0, 0, n.width, n.height), d
            }, n.exports = f
        }, {"../lineargradientcontainer": 12, "../log": 13, "../renderer": 19}], 21: [function (e, n) {
            function f(e, n, f, d) {
                o.call(this, f, d), this.ownStacking = e, this.contexts = [], this.children = [], this.opacity = (this.parent ? this.parent.stack.opacity : 1) * n
            }

            var o = e("./nodecontainer");
            f.prototype = Object.create(o.prototype), f.prototype.getParentStack = function (e) {
                var n = this.parent ? this.parent.stack : null;
                return n ? n.ownStacking ? n : n.getParentStack(e) : e.stack
            }, n.exports = f
        }, {"./nodecontainer": 14}], 22: [function (e, n) {
            function f(e) {
                this.rangeBounds = this.testRangeBounds(e), this.cors = this.testCORS(), this.svg = this.testSVG()
            }

            f.prototype.testRangeBounds = function (e) {
                var n, f, o, d, i = !1;
                return e.createRange && (n = e.createRange(), n.getBoundingClientRect && (f = e.createElement("boundtest"), f.style.height = "123px", f.style.display = "block", e.body.appendChild(f), n.selectNode(f), o = n.getBoundingClientRect(), d = o.height, 123 === d && (i = !0), e.body.removeChild(f))), i
            }, f.prototype.testCORS = function () {
                return "undefined" != typeof(new Image).crossOrigin
            }, f.prototype.testSVG = function () {
                var e = new Image, n = document.createElement("canvas"), f = n.getContext("2d");
                e.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
                try {
                    f.drawImage(e, 0, 0), n.toDataURL()
                } catch (o) {
                    return !1
                }
                return !0
            }, n.exports = f
        }, {}], 23: [function (e, n) {
            function f(e) {
                this.src = e, this.image = null;
                var n = this;
                this.promise = this.hasFabric().then(function () {
                    return n.isInline(e) ? Promise.resolve(n.inlineFormatting(e)) : o(e)
                }).then(function (e) {
                    return new Promise(function (f) {
                        window.html2canvas.svg.fabric.loadSVGFromString(e, n.createCanvas.call(n, f))
                    })
                })
            }

            var o = e("./xhr"), d = e("./utils").decode64;
            f.prototype.hasFabric = function () {
                return window.html2canvas.svg && window.html2canvas.svg.fabric ? Promise.resolve() : Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"))
            }, f.prototype.inlineFormatting = function (e) {
                return /^data:image\/svg\+xml;base64,/.test(e) ? this.decode64(this.removeContentType(e)) : this.removeContentType(e)
            }, f.prototype.removeContentType = function (e) {
                return e.replace(/^data:image\/svg\+xml(;base64)?,/, "")
            }, f.prototype.isInline = function (e) {
                return /^data:image\/svg\+xml/i.test(e)
            }, f.prototype.createCanvas = function (e) {
                var n = this;
                return function (f, o) {
                    var d = new window.html2canvas.svg.fabric.StaticCanvas("c");
                    n.image = d.lowerCanvasEl, d.setWidth(o.width).setHeight(o.height).add(window.html2canvas.svg.fabric.util.groupSVGElements(f, o)).renderAll(), e(d.lowerCanvasEl)
                }
            }, f.prototype.decode64 = function (e) {
                return "function" == typeof window.atob ? window.atob(e) : d(e)
            }, n.exports = f
        }, {"./utils": 26, "./xhr": 28}], 24: [function (e, n) {
            function f(e, n) {
                this.src = e, this.image = null;
                var f = this;
                this.promise = n ? new Promise(function (n, o) {
                    f.image = new Image, f.image.onload = n, f.image.onerror = o, f.image.src = "data:image/svg+xml," + (new XMLSerializer).serializeToString(e), f.image.complete === !0 && n(f.image)
                }) : this.hasFabric().then(function () {
                    return new Promise(function (n) {
                        window.html2canvas.svg.fabric.parseSVGDocument(e, f.createCanvas.call(f, n))
                    })
                })
            }

            var o = e("./svgcontainer");
            f.prototype = Object.create(o.prototype), n.exports = f
        }, {"./svgcontainer": 23}], 25: [function (e, n) {
            function f(e, n) {
                d.call(this, e, n)
            }

            function o(e, n, f) {
                return e.length > 0 ? n + f.toUpperCase() : void 0
            }

            var d = e("./nodecontainer");
            f.prototype = Object.create(d.prototype), f.prototype.applyTextTransform = function () {
                this.node.data = this.transform(this.parent.css("textTransform"))
            }, f.prototype.transform = function (e) {
                var n = this.node.data;
                switch (e) {
                    case"lowercase":
                        return n.toLowerCase();
                    case"capitalize":
                        return n.replace(/(^|\s|:|-|\(|\))([a-z])/g, o);
                    case"uppercase":
                        return n.toUpperCase();
                    default:
                        return n
                }
            }, n.exports = f
        }, {"./nodecontainer": 14}], 26: [function (e, n, f) {
            f.smallImage = function () {
                return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            }, f.bind = function (e, n) {
                return function () {
                    return e.apply(n, arguments)
                }
            }, f.decode64 = function (e) {
                var n, f, o, d, i, t, l, s, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                    a = e.length, p = "";
                for (n = 0; a > n; n += 4) f = u.indexOf(e[n]), o = u.indexOf(e[n + 1]), d = u.indexOf(e[n + 2]), i = u.indexOf(e[n + 3]), t = f << 2 | o >> 4, l = (15 & o) << 4 | d >> 2, s = (3 & d) << 6 | i, p += 64 === d ? String.fromCharCode(t) : 64 === i || -1 === i ? String.fromCharCode(t, l) : String.fromCharCode(t, l, s);
                return p
            }, f.getBounds = function (e) {
                if (e.getBoundingClientRect) {
                    var n = e.getBoundingClientRect(), f = null == e.offsetWidth ? n.width : e.offsetWidth;
                    return {
                        top: n.top,
                        bottom: n.bottom || n.top + n.height,
                        right: n.left + f,
                        left: n.left,
                        width: f,
                        height: null == e.offsetHeight ? n.height : e.offsetHeight
                    }
                }
                return {}
            }, f.offsetBounds = function (e) {
                var n = e.offsetParent ? f.offsetBounds(e.offsetParent) : {top: 0, left: 0};
                return {
                    top: e.offsetTop + n.top,
                    bottom: e.offsetTop + e.offsetHeight + n.top,
                    right: e.offsetLeft + n.left + e.offsetWidth,
                    left: e.offsetLeft + n.left,
                    width: e.offsetWidth,
                    height: e.offsetHeight
                }
            }, f.parseBackgrounds = function (e) {
                var n, f, o, d, i, t, l, s = " \r\n	", u = [], a = 0, p = 0, c = function () {
                    n && ('"' === f.substr(0, 1) && (f = f.substr(1, f.length - 2)), f && l.push(f), "-" === n.substr(0, 1) && (d = n.indexOf("-", 1) + 1) > 0 && (o = n.substr(0, d), n = n.substr(d)), u.push({
                        prefix: o,
                        method: n.toLowerCase(),
                        value: i,
                        args: l,
                        image: null
                    })), l = [], n = o = f = i = ""
                };
                return l = [], n = o = f = i = "", e.split("").forEach(function (e) {
                    if (!(0 === a && s.indexOf(e) > -1)) {
                        switch (e) {
                            case'"':
                                t ? t === e && (t = null) : t = e;
                                break;
                            case"(":
                                if (t) break;
                                if (0 === a) return a = 1, void(i += e);
                                p++;
                                break;
                            case")":
                                if (t) break;
                                if (1 === a) {
                                    if (0 === p) return a = 0, i += e, void c();
                                    p--
                                }
                                break;
                            case",":
                                if (t) break;
                                if (0 === a) return void c();
                                if (1 === a && 0 === p && !n.match(/^url$/i)) return l.push(f), f = "", void(i += e)
                        }
                        i += e, 0 === a ? n += e : f += e
                    }
                }), c(), u
            }
        }, {}], 27: [function (e, n) {
            function f(e) {
                o.apply(this, arguments), this.type = "linear" === e.args[0] ? o.TYPES.LINEAR : o.TYPES.RADIAL
            }

            var o = e("./gradientcontainer");
            f.prototype = Object.create(o.prototype), n.exports = f
        }, {"./gradientcontainer": 9}], 28: [function (e, n) {
            function f(e) {
                return new Promise(function (n, f) {
                    var o = new XMLHttpRequest;
                    o.open("GET", e), o.onload = function () {
                        200 === o.status ? n(o.responseText) : f(new Error(o.statusText))
                    }, o.onerror = function () {
                        f(new Error("Network Error"))
                    }, o.send()
                })
            }

            n.exports = f
        }, {}]
    }, {}, [4])(4)
});


/*Part25 persian-date */
/* persian-date - v0.1.8 */
(function () {


    var
        /**
         *
         * @type {number}
         */
        GREGORIAN_EPOCH = 1721425.5,

        /**
         *
         * @type {number}
         */
        PERSIAN_EPOCH = 1948320.5,

        /**
         *
         * @type {{}}
         */
        monthRange = {
            1: {
                name: {
                    fa: "فروردین"
                },
                abbr: {
                    fa: "فرو"
                }
            },
            2: {
                name: {
                    fa: "اردیبهشت"
                },
                abbr: {
                    fa: "ارد"
                }
            },
            3: {
                name: {
                    fa: "خرداد"
                },
                abbr: {
                    fa: "خرد"
                }
            },
            4: {
                name: {
                    fa: "تیر"
                },
                abbr: {
                    fa: "تیر"
                }
            },
            5: {
                name: {
                    fa: "مرداد"
                },
                abbr: {
                    fa: "مرد"
                }
            },
            6: {
                name: {
                    fa: "شهریور"
                },
                abbr: {
                    fa: "شهر"
                }
            },
            7: {
                name: {
                    fa: "مهر"
                },
                abbr: {
                    fa: "مهر"
                }
            },
            8: {
                name: {
                    fa: "آبان"
                },
                abbr: {
                    fa: "آبا"
                }

            },
            9: {
                name: {
                    fa: "آذر"
                },
                abbr: {
                    fa: "آذر"
                }
            },
            10: {
                name: {
                    fa: "دی"
                },
                abbr: {
                    fa: "دی"
                }
            },
            11: {
                name: {
                    fa: "بهمن"
                },
                abbr: {
                    fa: "بهم"
                }
            },
            12: {
                name: {
                    fa: "اسفند"
                },
                abbr: {
                    fa: "اسف"
                }
            }
        },


        /**
         *
         * @type {{}}
         */
        weekRange = {
            1: {
                name: {
                    fa: "شنبه"
                },
                abbr: {
                    fa: "ش"
                }
            },
            2: {
                name: {
                    fa: "یکشنبه"
                },
                abbr: {
                    fa: "ی"
                }
            },
            3: {
                name: {
                    fa: "دوشنبه"
                },
                abbr: {
                    fa: "د"
                }
            },
            4: {
                name: {
                    fa: "سه شنبه"
                },
                abbr: {
                    fa: "س"
                }
            },
            5: {
                name: {
                    fa: "چهار شنبه"
                },
                abbr: {
                    fa: "چ"
                }
            },
            6: {
                name: {
                    fa: "پنج شنبه"
                },
                abbr: {
                    fa: "پ"
                }
            },
            0: {
                name: {
                    fa: "جمعه"
                },
                abbr: {
                    fa: "ج"
                }
            }
        },


        /**
         *
         * @type {string[]}
         */
        persianDaysName = [
            "اورمزد",
            "بهمن",
            "اوردیبهشت",
            "شهریور",
            "سپندارمذ",
            "خورداد",
            "امرداد",
            "دی به آذز",
            "آذز",
            "آبان",
            "خورشید",
            "ماه",
            "تیر",
            "گوش",
            "دی به مهر",
            "مهر",
            "سروش",
            "رشن",
            "فروردین",
            "بهرام",
            "رام",
            "باد",
            "دی به دین",
            "دین",
            "ارد",
            "اشتاد",
            "آسمان",
            "زامیاد",
            "مانتره سپند",
            "انارام",
            "زیادی"];
    /**
     *
     * @param latinDigit
     * @returns {string} Persian equivalent unicode character of the given latin digits.
     */
    String.prototype.toPersianDigit = function (latinDigit) {
        return this.replace(/\d+/g, function (digit) {
            var enDigitArr = [], peDigitArr = [], i, j;
            for (i = 0; i < digit.length; i += 1) {
                enDigitArr.push(digit.charCodeAt(i));
            }
            for (j = 0; j < enDigitArr.length; j += 1) {
                peDigitArr.push(String.fromCharCode(enDigitArr[j] + ((!!latinDigit && latinDigit === true) ? 1584 : 1728)));
            }
            return peDigitArr.join('');
        });
    };


    /**
     *
     * @param digit
     * @returns {string|*}
     */
    function toPersianDigit(digit) {
        return digit.toString().toPersianDigit();
    }


    /**
     *
     * @param input
     * @returns {boolean}
     */
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }


    /**
     *
     * @param input
     * @returns {boolean}
     */
    function isString(input) {
        return typeof input === "string" ? true : false;
    }


    /**
     *
     * @param input
     * @returns {boolean}
     */
    function isNumber(input) {
        return typeof input === "number" ? true : false;
    }


    /**
     *
     * @param input
     * @returns {boolean}
     */
    function isDate(input) {
        return input instanceof Date;
    }


    /**
     *
     * @param input
     * @returns {boolean}
     */
    function isUndefined(input) {
        if (typeof input === "undefined")
            return true;
        else
            return false;
    }


    /**
     *
     * @param number
     * @param targetLength
     * @returns {string}
     */
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }


    /**
     *
     * @param number
     * @returns {number}
     */
    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }


    /**
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function mod(a, b) {
        return a - (b * Math.floor(a / b));
    }

    /**
     *
     * @param j
     * @returns {*}
     */
    function jwday(j) {
        return mod(Math.floor((j + 1.5)), 7);
    }


    /**
     * Is a given year in the Gregorian calendar a leap year ?
     * @param year
     * @returns {boolean}
     */
    function isLeapGregorian(year) {
        return ((year % 4) == 0) && (!(((year % 100) === 0) && ((year % 400) != 0)));
    }


    /**
     *
     * @param year
     * @returns {boolean}
     */
    function isLeapPersian(year) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    }


    /**
     * Determine Julian day number from Gregorian calendar date
     * @param year
     * @param month
     * @param day
     * @returns {number}
     */
    function gregorianToJd(year, month, day) {
        return (GREGORIAN_EPOCH - 1) + (365 * (year - 1)) + Math.floor((year - 1) / 4) + (-Math.floor((year - 1) / 100)) + Math.floor((year - 1) / 400) + Math.floor((((367 * month) - 362) / 12) + ((month <= 2) ? 0 : (isLeapGregorian(year) ? -1 : -2)
        ) + day);
    }


    /**
     * Calculate Gregorian calendar date from Julian day
     * @param jd
     * @returns {Array}
     */
    function jdToGregorian(jd) {
        var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad, yindex, dyindex, year, yearday, leapadj;
        wjd = Math.floor(jd - 0.5) + 0.5;
        depoch = wjd - GREGORIAN_EPOCH;
        quadricent = Math.floor(depoch / 146097);
        dqc = mod(depoch, 146097);
        cent = Math.floor(dqc / 36524);
        dcent = mod(dqc, 36524);
        quad = Math.floor(dcent / 1461);
        dquad = mod(dcent, 1461);
        yindex = Math.floor(dquad / 365);
        year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
        if (!((cent == 4) || (yindex == 4))) {
            year++;
        }
        yearday = wjd - gregorianToJd(year, 1, 1);
        leapadj = ((wjd < gregorianToJd(year, 3, 1)) ? 0 : (isLeapGregorian(year) ? 1 : 2)
        );
        month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
        day = (wjd - gregorianToJd(year, month, 1)) + 1;
        return new Array(year, month, day);
    }


    /**
     * Determine Julian day from Persian date
     * @param year
     * @param month
     * @param day
     * @returns {*}
     */
    function persianToJd(year, month, day) {
        mod = function (a, b) {
            return a - (b * Math.floor(a / b));
        };

        var epbase, epyear;
        epbase = year - ((year >= 0) ? 474 : 473);
        epyear = 474 + mod(epbase, 2820);
        return day + ((month <= 7) ? ((month - 1) * 31) : (((month - 1) * 30) + 6)
        ) + Math.floor(((epyear * 682) - 110) / 2816) + (epyear - 1) * 365 + Math.floor(epbase / 2820) * 1029983 + (PERSIAN_EPOCH - 1);
    }


    /**
     * Calculate Persian date from Julian day
     * @param jd
     * @returns {Array}
     */
    function jdToPersian(jd) {
        var year, month, day, depoch, cycle, cyear, ycycle, aux1, aux2, yday;
        jd = Math.floor(jd) + 0.5;
        depoch = jd - persianToJd(475, 1, 1);
        cycle = Math.floor(depoch / 1029983);
        cyear = mod(depoch, 1029983);
        if (cyear === 1029982) {
            ycycle = 2820;
        } else {
            aux1 = Math.floor(cyear / 366);
            aux2 = mod(cyear, 366);
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) + aux1 + 1;
        }
        year = ycycle + (2820 * cycle) + 474;
        if (year <= 0) {
            year -= 1;
        }
        yday = (jd - persianToJd(year, 1, 1)) + 1;
        month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        day = (jd - persianToJd(year, month, 1)) + 1;
        return new Array(year, month, day);
    }


    /**
     *
     * @param year
     * @param month
     * @param day
     * @returns {Array}
     */
    function calcPersian(year, month, day) {
        var date, j;
        var j = persianToJd(year, month, day);
        var date = jdToGregorian(j);
        return new Array(date[0], date[1] - 1, date[2]);
    }


    /**
     * Perform calculation starting with a Gregorian date
     * @param year
     * @param month
     * @param day
     * @returns {Array}
     */
    function calcGregorian(year, month, day) {
        //  Update Julian day
        var j = gregorianToJd(year, month + 1, day) + (Math.floor(0 + 60 * (0 + 60 * 0) + 0.5) / 86400.0),
            //  Update Persian Calendar
            perscal = jdToPersian(j), weekday = jwday(j);
        return new Array(perscal[0], perscal[1], perscal[2], weekday);
    }


    /**
     * Converts a gregorian date to Jalali date for different formats
     * @param gd
     * @returns {{}}
     */
    function toPersianDate(gd) {
        var pa = calcGregorian(gd.getFullYear(), gd.getMonth(), gd.getDate());
        var output = {};
        output.monthDayNumber = pa[2] - 1;
        if (pa[3] == 6) {
            output.weekDayNumber = 1;
        } else if (pa[3] == 5) {
            output.weekDayNumber = 0;
        } else if (pa[3] == 4) {
            output.weekDayNumber = 6;
        } else if (pa[3] == 3) {
            output.weekDayNumber = 5;
        } else if (pa[3] == 2) {
            output.weekDayNumber = 4;
        } else if (pa[3] == 1) {
            output.weekDayNumber = 3;
        } else if (pa[3] == 0) {
            output.weekDayNumber = 2;
        }
        output.year = pa[0];
        output.month = pa[1];
        output.day = output.weekDayNumber;
        output.date = pa[2];
        output.hours = gd.getHours();
        output.minutes = ((gd.getMinutes() < 10) ? ('0' + gd.getMinutes()) : (gd.getMinutes()));
        output.seconds = gd.getSeconds();
        output.milliseconds = gd.getMilliseconds();
        output.timeZoneOffset = gd.getTimezoneOffset();
        return output;
    }


    /**
     *
     * @param parray
     * @returns {Date}
     */
    function persianArrayToGregorianDate(parray) {
        // Howha : javascript Cant Parse this array truly 2011,2,20
        var pd = calcPersian(parray[0] ? parray[0] : 0, parray[1] ? parray[1] : 1, parray[2] ? parray[2] : 1);
        var gDate = new Date(pd[0], pd[1], pd[2]);
        gDate.setYear(pd[0]);
        gDate.setMonth(pd[1]);
        gDate.setDate(pd[2]);
        // TODO:
        gDate.setHours(parray[3] ? parray[3] : 0);
        gDate.setMinutes(parray[4] ? parray[4] : 0);
        gDate.setSeconds(parray[5] ? parray[5] : 0);
        return gDate;
    }


    /**
     *
     * @param pDate
     * @returns {array}
     */
    function getPersianArrayFromPDate(pDate) {
        return [pDate.year, pDate.month, pDate.date, pDate.hours, pDate.minutes, pDate.seconds, pDate.milliseconds];
    }

    /**
     * Duration object constructor
     * @param duration
     * @class Duration
     * @constructor
     */
    Duration = function (duration) {
        var absRound = function (number) {
                if (number < 0) {
                    return Math.ceil(number);
                } else {
                    return Math.floor(number);
                }
            }, data = this._data = {}, years = duration.years || duration.year || duration.y || 0,
            months = duration.months || duration.month || duration.M || 0,
            weeks = duration.weeks || duration.w || duration.week || 0,
            days = duration.days || duration.d || duration.day || 0,
            hours = duration.hours || duration.hour || duration.h || 0,
            minutes = duration.minutes || duration.minute || duration.m || 0,
            seconds = duration.seconds || duration.second || duration.s || 0,
            milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;
        // representation for dateAddRemove
        this._milliseconds = milliseconds + seconds * (1e3) + minutes * (6e4) + hours * (36e5);
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days + weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months + years * 12;
        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;
        seconds += absRound(milliseconds / 1000);
        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);
        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);
        data.hours = hours % 24;
        days += absRound(hours / 24);
        days += weeks * 7;
        data.days = days % 30;
        months += absRound(days / 30);
        data.months = months % 12;
        years += absRound(months / 12);
        data.years = years;
        return this;
    };


    /**
     * @class Duration
     * @type {{weeks: Function, valueOf: Function, humanize: Function}}
     */
    Duration.prototype = {

        /**
         *
         * @returns {string}
         */
        weeks: function () {
            return "Must Implement";
        },


        /**
         *
         * @returns {*}
         */
        valueOf: function () {
            return this._milliseconds + this._days * (864e5) + this._months * (2592e6);
        },


        /**
         *
         * @param withSuffix
         * @returns {string}
         */
        humanize: function (withSuffix) {
            return "Must Implement";
        }
    };


    /**
     * PersianDate object constructor
     * @param input
     * @class PersianDate
     * @constructor
     */
    var PersianDate = function (input) {

        if (!(this instanceof PersianDate))
            return new PersianDate(input)
        // Convert Any thing to Gregorian Date
        if (isUndefined(input)) {
            this.gDate = new Date();
        }
        else if (isDate(input)) {
            this.gDate = input;
        }
        else if (isArray(input)) {
            //  Encapsulate Input Array
            var arrayInput = input.slice();
            this.gDate = persianArrayToGregorianDate(arrayInput);
        }
        else if (isNumber(input)) {
            this.gDate = new Date(input);
        }
        else if (input instanceof PersianDate) {
            this.gDate = input.gDate;
        }
        // ASP.NET JSON Date
        else if (input.substring(0, 6) === "/Date(") {
            this.gDate = new Date(parseInt(input.substr(6)));
        }
        this.pDate = toPersianDate(this.gDate);
        return this;
    };


    /**
     *
     * @type {{version: string, formatPersian: string, _utcMode: boolean, duration: Function, isDuration: Function, humanize: Function, add: Function, subtract: Function, formatNumber: Function, format: Function, from: Function, fromNow: Function, humanizeDuration: Function, _d: Function, diff: Function, startOf: Function, endOf: Function, sod: Function, eod: Function, zone: Function, local: Function, utc: Function, isUtc: Function, isDST: Function, isLeapYear: Function, daysInMonth: Function, toDate: Function, toArray: Function, _valueOf: Function, unix: Function, isPersianDate: Function, millisecond: Function, milliseconds: Function, second: Function, seconds: Function, minute: Function, minutes: Function, hour: Function, hours: Function, dates: Function, date: Function, days: Function, day: Function, month: Function, years: Function, year: Function, getFirstWeekDayOfMonth: Function, clone: Function, _updatePDate: Function, valueOf: Function}}
     */
    PersianDate.prototype = {


        /**
         * @type {string}
         */
        version: "0.1.8b",

        /**
         * @type {string}
         */
        formatPersian: "_default",


        /**
         * @type {boolean}
         */
        _utcMode: false,

        /**
         *
         * @param input
         * @param key
         * @returns {Duration}
         */
        duration: function (input, key) {
            var isDuration = this.isDuration(input), isNumber = (typeof input === 'number'),
                duration = (isDuration ? input._data : (isNumber ? {} : input)), ret;
            if (isNumber) {
                if (key) {
                    duration[key] = input;
                } else {
                    duration.milliseconds = input;
                }
            }
            return new Duration(duration);
        },


        /**
         *
         * @param obj
         * @returns {boolean}
         */
        isDuration: function (obj) {
            return obj instanceof Duration;
        },


        /**
         *
         * @returns {string}
         */
        humanize: function () {
            return "Must Implement";
        },


        /**
         *
         * @param key
         * @param input
         * @returns {PersianDate}
         */
        add: function (key, input) {
            var d = this.duration(input, key).valueOf(), newUnixDate = this.gDate.valueOf() + d;
            return new PersianDate(newUnixDate);
        },


        /**
         *
         * @param key
         * @param input
         * @returns {PersianDate}
         */
        subtract: function (key, input) {
            var d = this.duration(input, key).valueOf(), newUnixDate = this.gDate.valueOf() - d;
            return new PersianDate(newUnixDate);
        },

        /**
         *
         * @returns {*}
         */
        formatNumber: function () {
            var output;
            // if default conf dosent set follow golbal config
            if (this.formatPersian === "_default") {
                if (window.formatPersian === false) {
                    output = false;
                } else {
                    // Default Conf
                    output = true;
                }
            } else {
                if (this.formatPersian === true) {
                    output = true;
                } else if (this.formatPersian === false) {
                    output = false;
                } else {
                    $.error("Invalid Config 'formatPersian' !!")
                }
            }
            return output;
        },


        /**
         *
         * @param inputString
         * @returns {*}
         */
        format: function (inputString) {
            var self = this,
                formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DD?D?D?|ddddd|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|X|LT|ll?l?l?|LL?L?L?)/g,
                info = {
                    year: self.year(),
                    month: self.month(),
                    hour: self.hours(),
                    minute: self.minutes(),
                    second: self.seconds(),
                    date: self.date(),
                    timezone: self.zone(),
                    unix: self.unix()
                };

            function replaceFunction(input) {
                formatToPersian = self.formatNumber();
                switch (input) {
                    // AM/PM
                    case("a"): {
                        if (formatToPersian)
                            return ((info.hour >= 12) ? 'ب ظ' : 'ق ظ');
                        else
                            return ((info.hour >= 12) ? 'PM' : 'AM');
                    }
                    // Hours (Int)
                    case("H"): {
                        if (formatToPersian)
                            return toPersianDigit(info.hour);
                        else
                            return info.hour;
                    }
                    case("HH"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.hour, 2));
                        else
                            return leftZeroFill(info.hour, 2);
                    }
                    case("h"): {
                        var h = info.hour % 12;
                        if (formatToPersian)
                            return toPersianDigit(h);
                        else
                            return h;
                    }
                    case("hh"): {
                        var h = info.hour % 12;
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(h, 2));
                        else
                            return leftZeroFill(h, 2);
                    }
                    // Minutes
                    case("m"): {
                        if (formatToPersian)
                            return toPersianDigit(info.minute);
                        else
                            return info.minute;
                    }
                    // Two Digit Minutes
                    case("mm"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.minute, 2));
                        else
                            return leftZeroFill(info.minute, 2);
                    }
                    // Second
                    case("s"): {
                        if (formatToPersian)
                            return toPersianDigit(info.second);
                        else
                            return info.second;
                    }
                    case("ss"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.second, 2));
                        else
                            return leftZeroFill(info.second, 2);
                    }
                    // Day (Int)
                    case("D"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.date));
                        else
                            return leftZeroFill(info.date);
                    }
                    // Return Two Digit
                    case("DD"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.date, 2));
                        else
                            return leftZeroFill(info.date, 2);
                    }
                    // Return day Of Year
                    case("DDD"): {
                        var t = self.startOf("year")
                        if (formatToPersian)
                            return toPersianDigit(self.diff(t, "days"));
                        else
                            return self.diff(t, "days");
                    }
                    // Return Week Day Full Name
                    case("DDDD"): {
                        var t = self.startOf("year")
                        if (formatToPersian)
                            return leftZeroFill(self.diff(t, "days"), 3);
                        else
                            return toPersianDigit(leftZeroFill(self.diff(t, "days"), 3));
                    }
                    // Return day Of week
                    case("d"): {
                        if (formatToPersian)
                            return toPersianDigit(self.pDate.weekDayNumber);
                        else
                            return self.pDate.weekDayNumber;
                    }
                    // Return week day name abbr
                    case("ddd"): {
                        return weekRange[self.pDate.weekDayNumber].abbr.fa;
                    }
                    case("dddd"): {
                        return weekRange[self.pDate.weekDayNumber].name.fa;
                    }
                    // Return Persian Day Name
                    case("ddddd"): {
                        return persianDaysName[self.pDate.monthDayNumber]
                    }
                    // Return Persian Day Name
                    case("w"): {
                        var t = self.startOf("year")
                        return parseInt(self.diff(t, "days") / 7) + 1;
                    }
                    // Return Persian Day Name
                    case("ww"): {
                        var t = self.startOf("year")
                        return leftZeroFill(parseInt(self.diff(t, "days") / 7) + 1, 2);
                    }
                    // Month  (Int)
                    case("M"): {
                        if (formatToPersian)
                            return toPersianDigit(info.month);
                        else
                            return info.month;
                    }
                    // Two Digit Month (Str)
                    case("MM"): {
                        if (formatToPersian)
                            return toPersianDigit(leftZeroFill(info.month, 2));
                        else
                            return leftZeroFill(info.month, 2);
                    }
                    // Abbr String of Month (Str)
                    case("MMM"): {
                        return monthRange[info.month].abbr.fa;
                    }
                    // Full String name of Month (Str)
                    case("MMMM"): {
                        return monthRange[info.month].name.fa;
                    }
                    // Year
                    // Two Digit Year (Str)
                    case("YY"): {
                        var yearDigitArray = info.year.toString().split("");
                        if (formatToPersian)
                            return toPersianDigit(yearDigitArray[2] + yearDigitArray[3]);
                        else
                            return yearDigitArray[2] + yearDigitArray[3];
                    }
                    // Full Year (Int)
                    case("YYYY"): {
                        if (formatToPersian)
                            return toPersianDigit(info.year);
                        else
                            return info.year;
                    }
                    case("Z"): {
                        var flag = "+";
                        var hours = Math.round(info.timezone / 60);
                        var minutes = info.timezone % 60;
                        if (minutes < 0) {
                            minutes *= -1;
                        }
                        if (hours < 0) {
                            flag = "-";
                            hours *= -1;
                        }

                        var z = flag + leftZeroFill(hours, 2) + ":" + leftZeroFill(minutes, 2);
                        if (formatToPersian)
                            return toPersianDigit(z)
                        else
                            return z;
                    }
                    case("ZZ"): {
                        var flag = "+";
                        var hours = Math.round(info.timezone / 60);
                        var minutes = info.timezone % 60;
                        if (minutes < 0) {
                            minutes *= -1;
                        }
                        if (hours < 0) {
                            flag = "-";
                            hours *= -1;
                        }

                        var z = flag + leftZeroFill(hours, 2) + "" + leftZeroFill(minutes, 2);
                        if (formatToPersian)
                            return toPersianDigit(z)
                        else
                            return z;
                    }
                    case("X"): {
                        return self.unix();
                    }
                    // 8:30 PM
                    case("LT"): {
                        return self.format("h:m a");
                    }
                    // 09/04/1986
                    case("L"): {
                        return self.format("YYYY/MM/DD");
                    }
                    // 9/4/1986
                    case("l"): {
                        return self.format("YYYY/M/D");
                    }
                    // September 4th 1986
                    case("LL"): {
                        return self.format("MMMM DD YYYY");
                    }
                    // Sep 4 1986
                    case("ll"): {
                        return self.format("MMM DD YYYY");
                    }
                    //September 4th 1986 8:30 PM
                    case("LLL"): {
                        return self.format("MMMM YYYY DD   h:m  a");
                    }
                    // Sep 4 1986 8:30 PM
                    case("lll"): {
                        return self.format("MMM YYYY DD   h:m  a");
                    }
                    //Thursday, September 4th 1986 8:30 PM
                    case("LLLL"): {
                        return self.format("dddd D MMMM YYYY  h:m  a");
                    }
                    // Thu, Sep 4 1986 8:30 PM
                    case("llll"): {
                        return self.format("ddd D MMM YYYY  h:m  a");
                    }

                    default:
                        return info._d;
                }
            }

            if (inputString) {
                return inputString.replace(formattingTokens, replaceFunction);
            } else {
                var inputString = "YYYY-MM-DD HH:mm:ss a"
                return inputString.replace(formattingTokens, replaceFunction);
            }
        },


        /**
         * Humanize
         * @returns {string}
         */
        from: function () {
            return "Must Implement";
        },


        /**
         *
         * @returns {string}
         */
        fromNow: function () {
            return "Must Implement";
        },


        /**
         *
         * @returns {string}
         */
        humanizeDuration: function () {
            return "Must Implement";
        },


        /**
         *
         * @returns {Function|PersianDate._d|_d}
         * @private
         */
        _d: function () {
            return this.gDate._d;
        },


        /**
         *
         * @param input
         * @param val
         * @param asFloat
         * @returns {*}
         */
        diff: function (input, val, asFloat) {
            var self = new PersianDate(this), inputMoment = input,
                //this._isUTC ? moment(input).utc() : moment(input).local();
                zoneDiff = 0,
                //(this.zone() - inputMoment.zone()) * 6e4;
                diff = self.gDate - inputMoment.gDate - zoneDiff, year = self.year() - inputMoment.year(),
                month = self.month() - inputMoment.month(), date = (self.date() - inputMoment.date()) * -1, output;
            if (val === 'months' || val === 'month') {
                output = year * 12 + month + date / 30;
            } else if (val === 'years' || val === 'year') {
                output = year + (month + date / 30) / 12;
            } else {
                output = val === 'seconds' || val === 'second' ? diff / 1e3 : // 1000
                    val === 'minutes' || val === 'minute' ? diff / 6e4 : // 1000 * 60
                        val === 'hours' || val === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                            val === 'days' || val === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                                val === 'weeks' || val === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                                    diff;
            }
            if (output < 0)
                output * -1;
            return asFloat ? output : Math.round(output);
        },


        /**
         *
         * @param key
         * @returns {*}
         */
        startOf: function (key) {
            // Simplify this
            switch (key) {
                case "years":
                case "year" :
                    return new PersianDate([this.year(), 1, 1]);
                case "months":
                case "month":
                    return new PersianDate([this.year(), this.month(), 1]);
                case "days" :
                case "day" :
                    return new PersianDate([this.year(), this.month(), this.date(), 0, 0, 0]);
                case "hours" :
                case "hour" :
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), 0, 0]);
                case "minutes":
                case "minute":
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), 0]);
                case "seconds":
                case "second":
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), this.seconds()]);
                case "weeks":
                case "week":
                    var weekDayNumber = this.pDate.weekDayNumber;
                    if (weekDayNumber === 0) {
                        return new PersianDate([this.year(), this.month(), this.date()]);
                    } else {
                        return new PersianDate([this.year(), this.month(), this.date()]).subtract("days", weekDayNumber);
                    }
                default:
                    return this;
            }
        },


        /**
         *
         * @param key
         * @returns {*}
         */
        endOf: function (key) {
            // Simplify this
            switch (key) {
                case "years":
                case "year":
                    var days = this.isLeapYear() ? 30 : 29;
                    return new PersianDate([this.year(), 12, days, 23, 59, 59]);
                case "months":
                case "month":
                    var monthDays = this.daysInMonth(this.year(), this.month());
                    return new PersianDate([this.year(), this.month(), monthDays, 23, 59, 59]);
                case "days" :
                case "day" :
                    return new PersianDate([this.year(), this.month(), this.date(), 23, 59, 59]);
                case "hours" :
                case "hour" :
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), 59, 59]);
                case "minutes":
                case "minute":
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), 59]);
                case "seconds":
                case "second":
                    return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), this.seconds()]);
                case "weeks":
                case "week":
                    var weekDayNumber = this.pDate.weekDayNumber;
                    if (weekDayNumber === 6) {
                        weekDayNumber = 7;
                    } else {
                        weekDayNumber = 6 - weekDayNumber;
                    }
                    return new PersianDate([this.year(), this.month(), this.date()]).add("days", weekDayNumber);
                default:
                    return this;
            }
        },


        /**
         *
         * @returns {*}
         */
        sod: function () {
            return this.startOf("day");
        },


        /**
         *
         * @returns {*}
         */
        eod: function () {
            return this.endOf("day");
        },
        // Get the timezone offset in minutes.
        /**
         *
         * @returns {output.timeZoneOffset|*|toPersianDate.timeZoneOffset|c.timeZoneOffset}
         */
        zone: function () {
            return this.pDate.timeZoneOffset;
        },


        /**
         *
         * @returns {PersianDate}
         */
        local: function () {
            if (!this._utcMode) {
                return this;
            } else {
                var offsetMils = this.pDate.timeZoneOffset * 60 * 1000;
                if (this.pDate.timeZoneOffset < 0) {
                    var utcStamp = this.valueOf() - offsetMils;
                } else {
                    var utcStamp = this.valueOf() + offsetMils;
                }
                this.gDate = new Date(utcStamp);
                this._updatePDate();
                this._utcMode = false;
                return this;
            }
        },


        /**
         * Current date/time in UTC mode
         * @param input
         * @returns {*}
         */
        utc: function (input) {
            if (input) {
                return new persianDate(input).utc();
            }
            if (this._utcMode) {
                return this;
            } else {
                var offsetMils = this.pDate.timeZoneOffset * 60 * 1000;
                if (this.pDate.timeZoneOffset < 0) {
                    var utcStamp = this.valueOf() + offsetMils;
                } else {
                    var utcStamp = this.valueOf() - offsetMils;
                }
                this.gDate = new Date(utcStamp);
                this._updatePDate();
                this._utcMode = true;
                return this;
            }
        },


        /**
         *
         * @returns {boolean}
         */
        isUtc: function () {
            return this._utcMode;
        },


        /**
         *
         * @returns {boolean}
         * version 0.0.1
         */
        isDST: function () {
            var
                month = this.month(),
                day = this.date();

            if (month < 7) {
                return false;
            }

            if ((month == 7 && day >= 2) ||
                month > 7) {
                return true;
            }
        },


        /**
         *
         * @returns {boolean}
         */
        isLeapYear: function () {
            return isLeapPersian(this.year());
        },


        /**
         *
         * @param yearInput
         * @param monthInput
         * @returns {number}
         */
        daysInMonth: function (yearInput, monthInput) {
            var year = yearInput ? yearInput : this.year();
            var month = monthInput ? monthInput : this.month();
            if (month < 1 || month > 12)
                return 0;
            if (month < 7)
                return 31;
            if (month < 12)
                return 30;
            if (isLeapPersian(year))
                return 30;
            return 29;
        },


        /**
         * Return Native Javascript Date
         * @returns {*|PersianDate.gDate}
         */
        toDate: function () {
            return this.gDate;
        },


        /**
         * Returns Array Of Persian Date
         * @returns {array}
         */
        toArray: function () {
            return [this.year(), this.month(), this.day(), this.hour(), this.minute(), this.second(), this.millisecond()];
        },


        /**
         * Return Milliseconds since the Unix Epoch (1318874398806)
         * @returns {*}
         * @private
         */
        _valueOf: function () {
            return this.gDate.valueOf();
        },


        /**
         * Return Unix Timestamp (1318874398)
         * @param timestamp
         * @returns {*}
         */
        unix: function (timestamp) {
            if (timestamp) {
                return new persianDate(timestamp * 1000);
            } else {
                var str = this.gDate.valueOf().toString();
                output = str.substring(0, str.length - 3);
            }
            return parseInt(output);
        },


        /**
         *
         * @param obj
         * @returns {boolean}
         */
        isPersianDate: function (obj) {
            return obj instanceof PersianDate;
        },


        /**
         *
         * @param input
         * @returns {*}
         * Getter Setter
         */
        millisecond: function (input) {
            return this.milliseconds(input)
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        milliseconds: function (input) {
            if (input) {
                this.gDate.setMilliseconds(input);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.milliseconds;
            }
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        second: function (input) {
            return this.seconds(input);

        },


        /**
         *
         * @param input
         * @returns {*}
         */
        seconds: function (input) {
            if (input | input === 0) {
                this.gDate.setSeconds(input);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.seconds;
            }
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        minute: function (input) {
            return this.minutes(input);
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        minutes: function (input) {
            if (input || input === 0) {
                this.gDate.setMinutes(input);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.minutes;
            }
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        hour: function (input) {
            return this.hours(input)
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        hours: function (input) {
            if (input | input === 0) {
                this.gDate.setHours(input);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.hours;
            }
        },


        /**
         * Day of Months
         * @param input
         * @returns {*}
         */
        dates: function (input) {
            return this.date(input)
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        date: function (input) {
            if (input | input == 0) {
                var pDateArray = getPersianArrayFromPDate(this.pDate);
                pDateArray[2] = input;
                this.gDate = persianArrayToGregorianDate(pDateArray);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.date;
            }
        },


        /**
         * Day of week
         * @returns {Function|Date.toJSON.day|date_json.day|PersianDate.day|day|output.day|*}
         */
        days: function () {
            return this.day();
        },


        /**
         *
         * @returns {Function|Date.toJSON.day|date_json.day|PersianDate.day|day|output.day|*}
         */
        day: function () {
            return this.pDate.day;
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        month: function (input) {
            if (input | input === 0) {
                var pDateArray = getPersianArrayFromPDate(this.pDate);
                pDateArray[1] = input;
                this.gDate = persianArrayToGregorianDate(pDateArray);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.month;
            }
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        years: function (input) {
            return this.year(input);
        },


        /**
         *
         * @param input
         * @returns {*}
         */
        year: function (input) {
            if (input | input === 0) {
                var pDateArray = getPersianArrayFromPDate(this.pDate);
                pDateArray[0] = input;
                this.gDate = persianArrayToGregorianDate(pDateArray);
                this._updatePDate();
                return this;
            } else {
                return this.pDate.year;
            }
        },


        /**
         *
         * @param year
         * @param month
         * @returns {*}
         */
        getFirstWeekDayOfMonth: function (year, month) {
            var dateArray = calcPersian(year, month, 1),
                pdate = calcGregorian(dateArray[0], dateArray[1], dateArray[2]);
            if (pdate[3] + 2 === 8) {
                return 1;
            } else if (pdate[3] + 2 === 7) {
                return 7;
            } else {
                return pdate[3] + 2;
            }
        },


        /**
         *
         * @returns {PersianDate}
         */
        clone: function () {
            var self = this;
            return new PersianDate(self.gDate);
        },


        /**
         *
         * @private
         */
        _updatePDate: function () {
            this.pDate = toPersianDate(this.gDate);
        },


        /**
         *
         * @returns {*}
         */
        valueOf: function () {
            return this._valueOf();
        }
    };
    persianDate = PersianDate;
    pDate = PersianDate;
    persianDate.unix = persianDate.prototype.unix;
    persianDate.utc = persianDate.prototype.utc;
}());

/*Part26 persian-datepicker */
/*
 persian-datepicker - v0.4.5
 Author: reza babakhani
 http://babakhani.github.io/PersianWebToolkit/datepicker
 */
(function () {
    (function (e) {
        e.fn.persianDatepicker = e.fn.pDatepicker = function (t) {
            var i = Array.prototype.slice.call(arguments), n = this;
            return this || e.error("Invalid selector"), e(this).each(function () {
                var a = [], s = i.concat(a), r = e(this).data("datepicker");
                if (r && "string" == typeof s[0]) {
                    var o = s[0];
                    s.splice(0, 1), n = r[o](s[0])
                } else this.pDatePicker = new f(this, t)
            }), n
        }
    })(jQuery);
    var e = {
        persianDigit: !0,
        viewMode: !1,
        position: "auto",
        autoClose: !1,
        format: !1,
        observer: !1,
        inputDelay: 800,
        formatter: function (e) {
            var t = this, i = new persianDate(e);
            return i.formatPersian = !1, i.format(t.format)
        },
        altField: !1,
        altFormat: "unix",
        altFieldFormatter: function (e) {
            var t = this, i = t.altFormat.toLowerCase();
            return "gregorian" === i | "g" === i ? new Date(e) : "unix" === i | "u" === i ? e : new persianDate(e).format(t.altFormat)
        },
        show: function () {
            return this.view.fixPosition(this), this.element.main.show(), this.onShow(this), this._viewed = !0, this
        },
        hide: function () {
            return this._viewed && (this.element.main.hide(), this.onHide(this), this._viewed = !1), this
        },
        destroy: function () {
            this.inputElem.removeClass(self.cssClass), this.element.main.remove()
        },
        onShow: function () {
        },
        onHide: function () {
        },
        onSelect: function () {
            return this
        },
        navigator: {
            enabled: !0, text: {btnNextText: "<", btnPrevText: ">"}, onNext: function () {
            }, onPrev: function () {
            }, onSwitch: function () {
            }
        },
        toolbox: {
            enabled: !0, text: {btnToday: "امروز"}, onToday: function () {
            }
        },
        timePicker: {
            enabled: !1,
            showSeconds: !0,
            showMeridian: !0,
            secondStep: 1,
            minuteStep: 1,
            hourStep: 1,
            scrollEnabled: !0,
            changeOnScroll: !0
        },
        dayPicker: {
            enabled: !0, scrollEnabled: !0, titleFormat: "YYYY MMMM", titleFormatter: function (e, t) {
                0 == this.datepicker.persianDigit && (window.formatPersian = !1);
                var i = new persianDate([e, t]).format(this.titleFormat);
                return window.formatPersian = !0, i
            }, onSelect: function () {
            }
        },
        monthPicker: {
            enabled: !0, scrollEnabled: !0, titleFormat: "YYYY", titleFormatter: function (e) {
                0 == this.datepicker.persianDigit && (window.formatPersian = !1);
                var t = new persianDate(e).format(this.titleFormat);
                return window.formatPersian = !0, t
            }, onSelect: function () {
            }
        },
        yearPicker: {
            enabled: !0, scrollEnabled: !0, titleFormat: "YYYY", titleFormatter: function (e) {
                var t = 12 * parseInt(e / 12);
                return t + "-" + (t + 11)
            }, onSelect: function () {
            }
        },
        onlyTimePicker: !1,
        justSelectOnDate: !0,
        minDate: !1,
        maxDate: !1,
        checkDate: function () {
            return !0
        },
        checkMonth: function () {
            return !0
        },
        checkYear: function () {
            return !0
        }
    }, t = {
        monthRange: {
            1: {name: {fa: "فروردین"}, abbr: {fa: "فرو"}},
            2: {name: {fa: "اردیبهشت"}, abbr: {fa: "ارد"}},
            3: {name: {fa: "خرداد"}, abbr: {fa: "خرد"}},
            4: {name: {fa: "تیر"}, abbr: {fa: "تیر"}},
            5: {name: {fa: "مرداد"}, abbr: {fa: "مرد"}},
            6: {name: {fa: "شهریور"}, abbr: {fa: "شهر"}},
            7: {name: {fa: "مهر"}, abbr: {fa: "مهر"}},
            8: {name: {fa: "آبان"}, abbr: {fa: "آبا"}},
            9: {name: {fa: "آذر"}, abbr: {fa: "آذر"}},
            10: {name: {fa: "دی"}, abbr: {fa: "دی"}},
            11: {name: {fa: "بهمن"}, abbr: {fa: "بهم"}},
            12: {name: {fa: "اسفند"}, abbr: {fa: "اسف"}}
        },
        weekRange: {
            0: {name: {fa: "شنبه"}, abbr: {fa: "ش"}},
            1: {name: {fa: "یکشنبه"}, abbr: {fa: "ی"}},
            2: {name: {fa: "دوشنبه"}, abbr: {fa: "د"}},
            3: {name: {fa: "سه شنبه"}, abbr: {fa: "س"}},
            4: {name: {fa: "چهار شنبه"}, abbr: {fa: "چ"}},
            5: {name: {fa: "پنج شنبه"}, abbr: {fa: "پ"}},
            6: {name: {fa: "جمعه"}, abbr: {fa: "ج"}}
        },
        persianDaysName: ["اورمزد", "بهمن", "اوردیبهشت", "شهریور", "سپندارمذ", "خورداد", "امرداد", "دی به آذز", "آذز", "آبان", "خورشید", "ماه", "تیر", "گوش", "دی به مهر", "مهر", "سروش", "رشن", "فروردین", "بهرام", "رام", "باد", "دی به دین", "دین", "ارد", "اشتاد", "آسمان", "زامیاد", "مانتره سپند", "انارام", "زیادی"]
    }, i = {
        datepciker: "<div class='{{css.datePickerPlotArea}}' ><div class='{{css.navigator}}' ></div> <div class='{{css.dayView}}' ></div><div class='{{css.monthView}}' ></div><div class='{{css.yearView}}' ></div><div class='{{css.timeView}}' ></div><div class='{{css.toolbox}}' ></div></div>",
        navigator: "<div class='{{css.datpickerHeader}}' ><div class='{{css.btnNext}}' >{{btnNextText}}</div><div class='{{css.btnSwitch}}' >{{btnSwitchText}}</div><div class='{{css.btnPrev}}' >{{btnPrevText}}</div></div>",
        timepicker: "<div class='hour time-segment' data-time-key='hour' ><div class='up-btn' >&#9650;</div><input type='text' placeholder='hour' class='hour-input' /><div class='down-btn' >&#9660;</div></div><div class='divider' >:</div><div class='minute time-segment' data-time-key='minute' ><div class='up-btn' >&#9650;</div><input type='text' placeholder='minute' class='minute-input' /><div class='down-btn' >&#9660;</div></div><div class='divider second-divider' >:</div><div class='second time-segment' data-time-key='second' ><div class='up-btn' >&#9650;</div><input type='text' placeholder='second' class='second-input' /><div class='down-btn' >&#9660;</div></div><div class='divider meridian-divider' ></div><div class='divider meridian-divider' ></div><div class='meridian time-segment' data-time-key='meridian' ><div class='up-btn' >&#9650;</div><input type='text' placeholder='meridian&' class='meridian-input' /><div class='down-btn' >&#9660;</div></div>",
        monthGrid: "<div class='{{css.main}}' ><div class='{{css.header}}' ><div class='{{css.headerTitle}}' ></div><div class='{{css.headerRow}}' ></div></div><table cellspacing='0' class='{{css.daysTable}}'  ><tbody><tr><td /><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr><tr><td/><td/><td/><td/><td/><td/><td/></tr></tbody></table></div>"
    }, n = {
        init: function () {
            this.isInstance = !0, this.raiseEvent("init")
        }, publishInDic: function (e, t) {
            return $.each(e, function (e, i) {
                i[t]()
            }), e
        }, callOfDict: function () {
        }, isSameDay: function (e, t) {
            var i = new pDate(e), n = new pDate(t);
            return i && n && i.year() === n.year() && i.month() === n.month() && i.date() === n.date()
        }, isValidGreguranDate: function (e) {
            return e && "Invalid Date" != new Date(e) && "undefined" != new Date(e)
        }, validatePersianDateString: function (e) {
            var t = new Date(e), i = e.split("/");
            if (3 === i.length) var n = 4 >= ("" + i[0]).length && ("" + i[0]).length >= 1,
                a = 2 >= ("" + i[1]).length && ("" + i[1]).length >= 1,
                s = 2 >= ("" + i[2]).length && ("" + i[2]).length >= 1;
            return $.each(i, function (e, t) {
                i[e] = parseInt(t)
            }), n && a && s && "Invalid Date" !== t ? i : null
        }, fullHeight: function (e) {
            return $(e).height() + parseInt($(e).css("padding-top")) + parseInt($(e).css("padding-bottom")) + parseInt($(e).css("borderTopWidth")) + parseInt($(e).css("borderBottomWidth"))
        }, attachEvent: function (e, t) {
            this.events[e] || (this.events[e] = []);
            var i;
            for (i in this.events[e]) "" + this.events[e][i] == "" + t && $.error("The function {0} was already added to event's chain.".format(t.toString));
            return this.events[e].push(t), this
        }, dettachEvent: function (e, t) {
            this.events[e] || $.error("The event's chain is empty.");
            var i;
            for (i in this.events[e]) "" + this.events[e][i] == "" + t && delete this.events[e][i];
            return this
        }, clearEvent: function (e) {
            return this.events[e] = null, this
        }, raiseEvent: function (e, t) {
            if (e && this.events) {
                t || (t = []);
                var i = this.events[e];
                if (i) {
                    if ("function" == typeof i) i.apply(this, t); else {
                        var n;
                        for (n in i) i[n].apply(this, t)
                    }
                    return this
                }
            }
        }
    }, a = {
        defaultView: "default", events: {
            init: function () {
                this.render()
            }, render: null
        }, views: {
            "default": {
                render: function () {
                }
            }
        }, element: {main: null}, createElementByClass: function (e) {
            return this.element.find("." + e)
        }, render: function (e) {
            return e || (e = "default"), this.raiseEvent("render"), this.view = this.views[e], this.view.render(this)
        }
    }, s = {
        compatConfig: function () {
            return this.viewMode === !1 && (this.yearPicker.enabled && (this.viewMode = "year"), this.monthPicker.enabled && (this.viewMode = "month"), this.dayPicker.enabled ? this.viewMode = "day" : this.justSelectOnDate = !1), this.minDate | this.maxDate ? (this.state.setFilterDate("unix", this.minDate, this.maxDate), this.state._filetredDate = !0) : this.state._filetredDate = !1, this
        }
    };
    Object.keys = Object.keys || function () {
        var e = Object.prototype.hasOwnProperty, t = !{toString: null}.propertyIsEnumerable("toString"),
            i = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
            n = i.length;
        return function (a) {
            if ("object" != typeof a && "function" != typeof a || null === a) throw new TypeError("Object.keys called on a non-object");
            var s = [];
            for (var r in a) e.call(a, r) && s.push(r);
            if (t) for (var o = 0; n > o; o++) e.call(a, i[o]) && s.push(i[o]);
            return s
        }
    }(), $.event.special.textchange = {
        setup: function () {
            $.event.special.textchange.saveLastValue(this), $(this).bind("keyup.textchange", $.event.special.textchange.handler), $(this).bind("cut.textchange paste.textchange input.textchange", $.event.special.textchange.delayedHandler)
        }, teardown: function () {
            $(this).unbind(".textchange")
        }, handler: function () {
            $.event.special.textchange.triggerIfChanged($(this))
        }, delayedHandler: function () {
            var e = $(this);
            setTimeout(function () {
                $.event.special.textchange.triggerIfChanged(e)
            }, 25)
        }, triggerIfChanged: function (e) {
            var t = "true" === e[0].contentEditable ? e.html() : e.val();
            t !== e.data("lastValue") && e.trigger("textchange", e.data("lastValue"))
        }, saveLastValue: function (e) {
            $(e).data("lastValue", "true" === e.contentEditable ? $(e).html() : $(e).val())
        }
    }, $.event.special.hastext = {
        setup: function () {
            $(this).bind("textchange", $.event.special.hastext.handler)
        }, teardown: function () {
            $(this).unbind("textchange", $.event.special.hastext.handler)
        }, handler: function (e, t) {
            "" === t && t !== $(this).val() && $(this).trigger("hastext")
        }
    }, $.event.special.notext = {
        setup: function () {
            $(this).bind("textchange", $.event.special.notext.handler)
        }, teardown: function () {
            $(this).unbind("textchange", $.event.special.notext.handler)
        }, handler: function (e, t) {
            "" === $(this).val() && $(this).val() !== t && $(this).trigger("notext")
        }
    };
    var r = $.fn.val;
    $.fn.val = function () {
        var e = r.apply(this, arguments);
        return arguments.length && this.each(function () {
            $.event.special.textchange.triggerIfChanged($(this))
        }), e
    }, $.tmplMustache = function (e, t) {
        return String.prototype.format = function (e) {
            function t(t) {
                var i = t.slice(2, -2).split("."), n = i[0], a = i[1];
                return e[n] instanceof Object ? e[n][a] : e[n]
            }

            return this.replace(/{{\s*[\w\.]+\s*}}/g, t)
        }, $(e.format(t))
    }, String.prototype.toPersianDigit = function (e) {
        return this.replace(/\d+/g, function (t) {
            for (var i = [], n = [], a = 0; t.length > a; a++) i.push(t.charCodeAt(a));
            for (var s = 0; i.length > s; s++) n.push(String.fromCharCode(i[s] + (e && 1 == e ? 1584 : 1728)));
            return n.join("")
        })
    }, String.prototype.toEngilshDigit = function (e) {
        return this.replace(/\d+/g, function (t) {
            for (var i = [], n = [], a = 0; t.length > a; a++) i.push(t.charCodeAt(a));
            for (var s = 0; i.length > s; s++) n.push(String.fromCharCode(i[s] - (e && 1 == e ? 1584 : 1728)));
            return i.join("")
        })
    };
    var o = function (e, t) {
        clearTimeout(window.datepickerTimer), window.datepickerTimer = setTimeout(e, t)
    }, c = function (e) {
        for (var t = [], i = 0; e - 1 >= i;) t.push(i), i++;
        return t
    }, h = function (e, t) {
        var i = function (e) {
            return $.extend(!0, {}, e)
        }, a = [!0, e, i(n)], s = [];
        for (var r in t) {
            var o = i(t[r]);
            o && (o.events && Object.keys(o.events).length > 0 && s.push(o.events), o.events = {}, a.push(o))
        }
        $.extend.apply(e, a);
        for (var r in s) {
            var c = s[r], h = Object.keys(c);
            for (var d in h) {
                var l = h[d], u = c[l];
                l && u && e.attachEvent(l, u)
            }
        }
        return e.init(), e
    };
    if (jQuery.uaMatch = function (e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {browser: t[1] || "", version: t[2] || "0"}
    }, !jQuery.browser) {
        var d = jQuery.uaMatch(window.navigator.userAgent), l = {};
        d.browser && (l[d.browser] = !0, l.version = d.version), l.chrome ? l.webkit = !0 : l.webkit && (l.safari = !0), jQuery.browser = l
    }
    var u = {
        state: {year: null, month: null, date: null, firstWeekDayOfMonth: null, daysCount: null},
        persianDigit: !0,
        _formatDigit: function (e) {
            return this.persianDigit ? ("" + e).toPersianDigit() : e
        },
        events: {
            init: function () {
            }, render: function () {
                this.state.month = this.month, this.state.year = this.year
            }, reRender: function () {
                this._markToday()
            }, selectDay: function () {
            }
        },
        _markToday: function () {
            var e = this, t = new persianDate;
            return $(e.element).removeClass(e.cssClass.today), $.each(e.daysList, function () {
                var i = $(this).data().day, n = $(this).data().month, a = $(this).data().year;
                i == t.date() && n == t.month() && a == t.year() && ($(this).addClass(e.cssClass.today), $(e.element).addClass(e.cssClass.today))
            }), this
        },
        _updateState: function () {
            var e = this, t = new persianDate;
            return e.daysCount = t.daysInMonth(e.state.year, e.state.month), e.firstWeekDayOfMonth = t.getFirstWeekDayOfMonth(e.state.year, e.state.month), this
        },
        selectDate: function (e) {
            var t, i = this, n = new persianDate(e);
            return t = i.state.year == n.year() && i.state.month == n.month() ? !1 : !0, i.state.year = n.year(), i.state.month = n.month(), i.state.date = n.date(), t && i.view.renderDays(i), i.markSelectedDate(e), this
        },
        markSelectedDate: function (e) {
            var t = this;
            $.each(t.daysList, function (i, n) {
                var a = parseInt($(n).attr("unixDate"));
                t.isSameDay(a, e) ? $(this).addClass(t.cssClass.selected) : $(this).removeClass(t.cssClass.selected)
            })
        },
        updateAs: function (e, t) {
            var i = this;
            return i.state.year = e, i.state.month = t, i.view.renderDays(i), this
        },
        goToNextMonth: function () {
            var e = this;
            return 12 === e.state.month ? (e.state.month = 1, e.state.viewYear += 1) : e.state.month += 1, e.updateAs(e.state.year, e.state.month), !1
        },
        goToPrevMonth: function () {
        },
        goToYear: function (e) {
            this.updateAs(e, this.state.month)
        },
        applyStory: function () {
        }
    };
    MonthGrid = function (e) {
        return h(this, [a, p, t, u, e]), this
    };
    var p = {
        cssClass: {
            main: "month-grid-box",
            header: "header",
            headerTitle: "title",
            headerRow: "header-row",
            headerRowCell: "header-row-cell",
            daysTable: "table-days",
            currentMonth: "current-month",
            today: "today",
            selected: "selected",
            disbaled: "disabled"
        }, views: {
            "default": {
                render: function (e) {
                    e.viewData = {css: e.cssClass}, e.element = $.tmplMustache(i.monthGrid, e.viewData).appendTo(e.container), e.header = e.createElementByClass(e.cssClass.header), e.headerRow = e.createElementByClass(e.cssClass.headerRow);
                    var t;
                    for (t in e.weekRange) $("<div/>").text(e.weekRange[t].abbr.fa).addClass(e.cssClass.headerRowCell).appendTo(e.headerRow)[0];
                    e.daysBox = e.createElementByClass(e.cssClass.daysTable), this.renderDays(e)
                }, renderDays: function (e) {
                    e._updateState(), e.daysList = [];
                    var t = function (t, i, n, a) {
                        var s = new persianDate([n, i, t]).valueOf(),
                            r = $("<span/>").text(e._formatDigit(t)).attr("unixDate", s).data({
                                day: t,
                                month: i,
                                year: n,
                                unixDate: s
                            }).addClass(a).appendTo($(this))[0];
                        e.daysList.push(r)
                    }, i = new persianDate;
                    e.daysCount = i.daysInMonth(e.state.year, e.state.month), e.firstWeekDayOfMonth = i.getFirstWeekDayOfMonth(e.state.year, e.state.month);
                    var n = 1, a = 1;
                    $(e.daysBox).find("td").each(function (s) {
                        if ($(this).empty(), e.firstWeekDayOfMonth > 1 && e.firstWeekDayOfMonth > s + 1) {
                            if (1 === e.state.month) var r = 12,
                                o = parseInt(e.state.year) - 1; else var r = parseInt(e.state.month) - 1,
                                o = parseInt(e.state.year);
                            var c = i.daysInMonth(o, r), h = parseInt(c - e.firstWeekDayOfMonth + (s + 2));
                            t.apply(this, [h, r, o, "other-month"])
                        } else if (s + 2 === n + e.firstWeekDayOfMonth && e.daysCount >= n) {
                            var h = n;
                            t.apply(this, [h, parseInt(e.state.month), parseInt(e.state.year)]), n++
                        } else {
                            if (12 === e.state.month) var d = 1,
                                l = parseInt(e.state.year) + 1; else var d = parseInt(e.state.month) + 1,
                                l = e.state.year;
                            var h = a;
                            t.apply(this, [h, d, l, "other-month"]), a += 1
                        }
                        var u = $(this).children("span").data("unixDate");
                        e.datepicker.state._filetredDate ? e.minDate && e.maxDate ? u >= e.minDate && e.maxDate >= u ? $(this).addClass(e.cssClass.disbaled) : $(this).removeClass(e.cssClass.disbaled) : e.minDate ? u >= e.minDate && $(this).addClass(e.cssClass.disbaled) : e.maxDate && e.maxDate >= u && $(this).removeClass(e.cssClass.disbaled) : e.datepicker.checkDate(u) ? $(this).removeClass(e.cssClass.disbaled) : $(this).addClass(e.cssClass.disbaled)
                    }), $(e.daysBox).find("td").not(".disabled").children("span").click(function () {
                        var t = $(this).data("unixDate");
                        return e.raiseEvent("selectDay", [t]), !1
                    }), $(e.daysBox).find("td.disabled").children("span").click(function () {
                        return !1
                    }), e.raiseEvent("reRender")
                }
            }
        }
    }, v = {
        cssClass: {
            datePickerPlotArea: "datepicker-plot-area",
            yearView: "datepicker-year-view",
            monthView: "datepicker-month-view",
            dayView: "datepicker-day-view",
            timeView: "datepicker-time-view",
            navigator: "navigator",
            toolbox: "toolbox "
        }, container: {}, views: {
            "default": {
                render: function (e) {
                    var t = {css: e.cssClass};
                    return e.element = {}, e.element.main = $.tmplMustache(i.datepciker, t).appendTo(e.$container), e._inlineView ? (e.element.main.addClass("datepicker-plot-area-inline-view"), e.element.main.show()) : e.element.main.hide(), e.view.fixPosition(e), e.container.navigator = $(e.element.main).children("." + e.cssClass.navigator), e.container.dayView = $(e.element.main).children("." + e.cssClass.dayView), e.container.monthView = $(e.element.main).children("." + e.cssClass.monthView), e.container.yearView = $(e.element.main).children("." + e.cssClass.yearView), e.container.timeView = $(e.element.main).children("." + e.cssClass.timeView), e.container.toolbox = $(e.element.main).children("." + e.cssClass.toolbox), e.navigator.enabled && 0 == e.onlyTimePicker ? e.navigator = new y($.extend(!0, e.navigator, {datepicker: e}), e.container.navigator) : (e.container.navigator.remove(), e.navigator = !1), e.toolbox.enabled && e.onlyTimePicker === !1 ? e.toolbox = new C($.extend(!0, e.toolbox, {datepicker: e}), e.container.toolbox) : (e.container.toolbox.remove(), e.toolbox = !1), e.dayPicker.enabled && e.onlyTimePicker === !1 ? (e.dayPicker = new D($.extend(!0, e.dayPicker, {datepicker: e}), e.container.dayView), e._pickers.day = e.dayPicker) : (e.container.dayView.hide(), e.dayPicker = !1), e.monthPicker.enabled && e.onlyTimePicker === !1 ? (e.monthPicker = new b($.extend(!0, e.monthPicker, {datepicker: e}), e.container.monthView), e._pickers.month = e.monthPicker) : (e.monthPicker = !1, e.container.monthView.hide()), e.yearPicker.enabled && e.onlyTimePicker === !1 ? (e.yearPicker = new _($.extend(!0, e.yearPicker, {datepicker: e}), e.container.yearView), e._pickers.year = e.yearPicker) : (e.yearPicker = !1, e.container.yearView.hide()), e.timePicker.enabled | e.onlyTimePicker === !0 ? e.timePicker = new I($.extend(!0, e.timePicker, {datepicker: e}), e.container.timeView) : e.container.timeView.hide(), e.changeView(e.viewMode), e._syncWithImportData(e.state.unixDate), this
                }, fixPosition: function (e) {
                    if (!e._inlineView) {
                        var t = e.inputElem.offset().top, i = e.inputElem.offset().left;
                        if ("auto" === e.position) {
                            var n = e.fullHeight(e.inputElem);
                            e.element.main.css({top: t + n + "px", left: i + "px"})
                        } else e.element.main.css({top: t + e.position[0] + "px", left: i + e.position[1] + "px"})
                    }
                    return this
                }
            }
        }
    }, m = {
        _pickers: {}, _viewed: !1, _inlineView: !1, _getNextState: function (e) {
            var t = this.currentView, i = this.currentView;
            return "next" === e ? ("month" === t && this.dayPicker && (i = "day"), "year" === t && (this.monthPicker ? i = "month" : this.dayPicker && (i = "day"))) : "prev" === e && ("month" === t && this.yearPicker && (i = "year"), "day" === t && (this.monthPicker ? i = "month" : this.yearPicker && (i = "year"))), this._checkNextStateAvalibility(i)
        }, _checkNextStateAvalibility: function (e) {
            return this._pickers[e] ? e : (this.element.main.hide(), !1)
        }, updateNavigator: function (e) {
            return this.navigator && this.navigator.updateSwitchBtn(this._formatDigit(e)), this
        }, switchNavigatorRelation: function (e) {
            return this.navigator && this.navigator.switchRelation(e), this
        }, changeView: function (e, t) {
            var i, n = this;
            return i = t ? this._getNextState(t) : this._checkNextStateAvalibility(e), i && (n.publishInDic(n._pickers, "hide"), n._pickers[i].show(), n.switchNavigatorRelation(i), n.currentView = i), this
        }, _flagSelfManipulate: !0, selectTime: function (e, t) {
            this.state.setTime(e, t), this._updateInputElement(), this.onSelect(e, this)
        }, selectDate: function (e) {
            var t = this;
            switch (t.state.setSelected("unix", e), this.state.syncViewWithelected(), t.currentView) {
                case"month":
                    t.monthPicker.selectMonth();
                    break;
                case"year":
                    t.yearPicker.selectYear();
                    break;
                case"day":
                    t.dayPicker.selectDay()
            }
            return t._updateInputElement(), t.onSelect(e, this), t.autoClose && t.element.main.hide(), this
        }, selectDateTime: function (e) {
            var t = this;
            switch (t.state.setSelectedDateTime("unix", e), this.state.syncViewWithelected(), t.currentView) {
                case"month":
                    t.monthPicker.selectMonth();
                    break;
                case"year":
                    t.yearPicker.selectYear();
                    break;
                case"day":
                    t.dayPicker.selectDay()
            }
            return t._updateInputElement(), t.onSelect(e, this), t.autoClose && t.element.main.hide(), this
        }, selectMonth: function (e) {
            var t = this;
            return this.justSelectOnDate ? t.state.setView("month", e) : (t.state.setSelected("month", e), t.state.setSelected("year", t.state.view.year), t.state.syncViewWithelected()), t._updateInputElement(), t.changeView(t.currentView, "next"), this
        }, selectYear: function (e) {
            var t = this;
            return this.justSelectOnDate ? t.state.setView("year", e) : (t.state.setSelected("year", e), t.state.syncViewWithelected()), t._updateInputElement(), t.changeView(t.currentView, "next"), this
        }, _formatDigit: function (e) {
            return this.persianDigit && e ? ("" + e).toPersianDigit() : e
        }, _syncWithImportData: function (e) {
            if (e) {
                var t = this;
                if (jQuery.isNumeric(e)) {
                    var i = new persianDate(e);
                    t.state.setSelected("unix", i), t._updateInputElement()
                } else {
                    var n = t.validatePersianDateString(e);
                    null != n && o(function () {
                        var e = new persianDate(n);
                        t.selectDate(e.valueOf())
                    }, t.inputDelay)
                }
            }
            return this
        }, _attachEvents: function () {
            var e = this;
            if ($(window).resize(function () {
                e.view.fixPosition(e)
            }), e.observer) {
                e.inputElem.bind("paste", function (t) {
                    o(function () {
                        e._syncWithImportData(t.target.value)
                    }, 60)
                }), $(e.altField).bind("change", function () {
                    if (!e._flagSelfManipulate) {
                        var t = new Date($(this).val());
                        if ("Invalid Date" !== t) {
                            var i = new persianDate(t);
                            e.selectDate(i.valueOf())
                        }
                    }
                });
                var t = !1, i = [17, 91], n = 86;
                $(document).keydown(function (e) {
                    $.inArray(e.keyCode, i) > 0 && (t = !0)
                }).keyup(function (e) {
                    $.inArray(e.keyCode, i) > 0 && (t = !1)
                }), e.inputElem.bind("keyup", function (a) {
                    var s = $(this);
                    if (!e._flagSelfManipulate) {
                        var r = !1;
                        (8 === a.keyCode || 105 > a.keyCode && a.keyCode > 96 || 58 > a.keyCode && a.keyCode > 47 || t && (a.keyCode == n || $.inArray(a.keyCode, i) > 0)) && (r = !0), r && e._syncWithImportData(s.val())
                    }
                })
            }
            return e.inputElem.focus(function () {
                e.show()
            }), e.inputElem.click(function (e) {
                return e.stopPropagation(), !1
            }), e.inputElem.blur(function () {
                $.browser.msie || e.hide()
            }), $(document).not(".datepicker-plot-area,.datepicker-plot-area > *").click(function () {
                e.inputElem.blur(), e.hide()
            }), $(e.element.main).mousedown(function (e) {
                return e.stopPropagation(), !1
            }), this
        }, _updateInputElement: function () {
            var e = this;
            return e._flagSelfManipulate = !0, e.altField.val(e.altFieldFormatter(e.state.selected.unixDate)).trigger("change"), e.inputElem.val(e.formatter(e.state.selected.unixDate)).trigger("change"), e._flagSelfManipulate = !1, e
        }, _defineOnInitState: function () {
            if ("INPUT" == $(this.$container)[0].nodeName) {
                var e = new Date(this.inputElem.val()).valueOf();
                this.$container = $("body")
            } else {
                var e = new Date($(this.$container).data("date")).valueOf();
                this._inlineView = !0
            }
            return this.state.unixDate = e && "undefined" != e ? e : (new Date).valueOf(), this.altField = $(this.altField), this.state.setSelectedDateTime("unix", this.state.unixDate), this.state.setTime("unix", this.state.unixDate), this.state.setView("unix", this.state.unixDate), this
        }, setTime: function () {
            return this.timePicker.enabled && this.timePicker.setTime(this.state.selected.unixDate), this
        }, setDate: function (e) {
            var t = new persianDate(e);
            return this.selectDateTime(t.valueOf()), this.setTime(), this
        }, init: function () {
            var e = this;
            return this.state = new T({datepicker: e}), this.compatConfig(), this._defineOnInitState(), this._updateInputElement(), this.view = this.views["default"], this.view.render(this), this.inputElem.data("datepicker", this), this.inputElem.addClass(e.cssClass), this._attachEvents(), this
        }
    }, f = function (t, i) {
        return h(this, [a, s, m, v, e, i, {$container: t, inputElem: $(t)}])
    }, w = {
        enabled: !0,
        text: {btnNextText: "<", btnPrevText: ">"},
        cssClass: {
            datpickerHeader: "datepicker-header",
            btnNext: "btn-next",
            btnSwitch: "btn-switch",
            btnPrev: "btn-prev"
        },
        relation: "day",
        switchRelation: function (e) {
            return this.relation = e, this.onSwitch(e), this
        },
        updateSwitchBtn: function (e) {
            return $(this.element).children("." + this.cssClass.btnSwitch).text(e), this
        },
        _next: function () {
            return this.datepicker[this.relation + "Picker"].next(), this.onNext(this), this
        },
        _prev: function () {
            return this.datepicker[this.relation + "Picker"].prev(), this.onPrev(this), this
        },
        _switch: function () {
            return this.datepicker.changeView(this.relation, "prev"), this
        },
        _render: function () {
            var e = this;
            e.viewData = {
                css: e.cssClass,
                btnNextText: e.text.btnNextText,
                btnPrevText: e.text.btnPrevText
            }, e.element = $.tmplMustache(i.navigator, e.viewData).appendTo(e.$container)
        },
        _attachEvents: function () {
            var e = this;
            e.element.children("." + e.cssClass.btnPrev).click(function () {
                return e._prev(), !1
            }), e.element.children("." + e.cssClass.btnNext).click(function () {
                return e._next(), !1
            }), e.element.children("." + e.cssClass.btnSwitch).click(function () {
                return e._switch(), !1
            })
        },
        init: function () {
            var e = this;
            return e._render(), e._attachEvents(), this
        }
    }, y = function (e, t) {
        return h(this, [a, w, e, {$container: t}])
    }, k = {
        next: function () {
            var e = this;
            return 12 === e.datepicker.state.view.month ? (e.datepicker.state.setView("month", 1), e.datepicker.state.setView("year", parseInt(e.datepicker.state.view.year) + 1)) : e.datepicker.state.setView("month", parseInt(e.datepicker.state.view.month) + 1), e._updateView(), this
        }, prev: function () {
            var e = this;
            return 1 === e.datepicker.state.view.month ? (e.datepicker.state.setView("month", 12), e.datepicker.state.setView("year", parseInt(e.datepicker.state.view.year) - 1)) : e.datepicker.state.setView("month", parseInt(e.datepicker.state.view.month) - 1), e._updateView(), this
        }, updateView: function () {
            return this._updateView(), this
        }, _updateView: function () {
            var e = this;
            return e.mGrid.updateAs(e.datepicker.state.view.year, e.datepicker.state.view.month), e._updateNavigator(e.datepicker.state.view.year, e.datepicker.state.view.month), this._updateSelectedDay(e.datepicker.state.selected.unixDate), this
        }, selectDay: function () {
            var e = this;
            return e.mGrid.updateAs(e.datepicker.state.selected.year, e.datepicker.state.selected.month), e._updateNavigator(e.datepicker.state.selected.year, e.datepicker.state.selected.month), this._updateSelectedDay(e.datepicker.state.selected.unixDate), this._updateView(), this
        }, _updateNavigator: function (e, t) {
            var i = this, n = this.titleFormatter(e, t);
            return i.datepicker.updateNavigator(n), this
        }, hide: function () {
            return this.container.hide(), this
        }, show: function () {
            return this.container.show(), this._updateView(), this
        }, _updateSelectedDay: function (e) {
            return this.mGrid.markSelectedDate(e), this
        }, _attachEvents: function () {
            var e = this;
            return this.scrollEnabled && ($(this.container).mousewheel(function (t) {
                t.deltaY > 0 ? e.next() : e.prev()
            }), $(this.container).bind("mousewheel DOMMouseScroll", function (e) {
                var t = null;
                "mousewheel" == e.type ? t = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" == e.type && (t = 40 * e.originalEvent.detail), t && (e.preventDefault(), $(this).scrollTop(t + $(this).scrollTop()))
            })), this
        }, _render: function () {
            var e = this;
            this.mGrid = new MonthGrid({
                container: e.container,
                persianDigit: e.datepicker.persianDigit,
                month: e.datepicker.state.selected.month,
                year: e.datepicker.state.selected.year,
                minDate: e.datepicker.state.filterDate.start.unixDate,
                maxDate: e.datepicker.state.filterDate.end.unixDate,
                datepicker: e.datepicker
            }), this.mGrid.attachEvent("selectDay", function (t) {
                e.datepicker.selectDate(t), e.onSelect(t), e.mGrid.selectDate(e.datepicker.state.selected.unixDate)
            }), this._updateSelectedDay(e.datepicker.state.selected.unixDate)
        }, init: function () {
            var e = this;
            return this._render(), this._attachEvents(), this._updateNavigator(e.datepicker.state.selected.year, e.datepicker.state.selected.month), this
        }
    }, D = function (e, t) {
        return h(this, [a, k, e, {container: t}])
    }, g = {
        cssClass: {selectedMonth: "selected", monthItem: "month-item", disbaleItem: "month-item-disable"},
        monthRange: t.monthRange,
        _updateNavigator: function () {
            var e = this;
            return e.datepicker.updateNavigator(this.titleFormatter(e.datepicker.state.view.unixDate)), this
        },
        hide: function () {
            return this.container.hide(), this
        },
        show: function () {
            return this.container.show(), this._updateNavigator(), this._render(), this
        },
        selectMonth: function () {
            this.defineSelectedMonth(), this._updateNavigator()
        },
        defineSelectedMonth: function () {
            var e = this;
            return e.container.children("." + e.cssClass.monthItem).removeClass(e.cssClass.selectedMonth), e.datepicker.state.view.year === e.datepicker.state.selected.year && e.container.children(".month" + e.datepicker.state.selected.month).addClass(e.cssClass.selectedMonth), this
        },
        next: function () {
            var e = this;
            return e.datepicker.state.setView("year", e.datepicker.state.view.year + 1), e.updateView(), e._render(), this
        },
        prev: function () {
            var e = this;
            return e.datepicker.state.setView("year", e.datepicker.state.view.year - 1), e.updateView(), e._render(), this
        },
        updateView: function () {
            return this.defineSelectedMonth(), this._updateNavigator(), this
        },
        _checkMonthAccess: function (e) {
            if (this.datepicker.state._filetredDate) {
                var t = this.datepicker.state.view.year, i = 1e3 * new pDate([t, e]).unix();
                return i >= this.datepicker.state.filterDate.start.unixDate && this.datepicker.state.filterDate.end.unixDate >= i ? !0 : !1
            }
            return this.datepicker.checkMonth(e)
        },
        _attachEvents: function () {
            var e = this;
            return this.scrollEnabled && ($(this.container).mousewheel(function (t) {
                t.deltaY > 0 ? e.next() : e.prev()
            }), $(this.container).bind("mousewheel DOMMouseScroll", function (e) {
                var t = null;
                "mousewheel" == e.type ? t = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" == e.type && (t = 40 * e.originalEvent.detail), t && (e.preventDefault(), $(this).scrollTop(t + $(this).scrollTop()))
            })), this
        },
        _render: function () {
            var e, t = this;
            t.container.empty();
            for (e in this.monthRange) {
                var i = $("<div/>").data({monthIndex: e}).addClass("month" + e).addClass(t.cssClass.monthItem).text(t.monthRange[e].name.fa).appendTo(t.container);
                t._checkMonthAccess(e) ? i.click(function () {
                    return t.onSelect($(this).data().monthIndex), t.datepicker.selectMonth(parseInt($(this).data().monthIndex)), !1
                }) : (i.addClass(t.cssClass.disbaleItem), i.click(function () {
                    return !1
                }))
            }
            return this.defineSelectedMonth(), this
        },
        init: function () {
            return this._render(), this._attachEvents(), this
        }
    }, b = function (e, t) {
        return h(this, [a, g, e, {container: t}])
    }, x = {
        cssClass: {selectedYear: "selected", yearItem: "year-item", disbaleItem: "year-item-disable"},
        events: {
            select: function () {
            }
        },
        _updateNavigator: function () {
            var e = this, t = e.datepicker.state.view.year;
            return e.datepicker.updateNavigator(e.titleFormatter(t)), this
        },
        hide: function () {
            return this.container.hide(), this
        },
        show: function () {
            return this.container.show(), this.updateView(), this
        },
        next: function () {
            var e = this;
            return e.datepicker.state.view.year += 12, e._render().updateView(), this
        },
        prev: function () {
            var e = this;
            return e.datepicker.state.view.year -= 12, e._render().updateView(), this
        },
        selectYear: function () {
            this.updateView()
        },
        updateView: function () {
            var e = this;
            return e._render(), e.container.children("." + e.cssClass.yearItem).each(function () {
                $(this).removeClass(e.cssClass.selectedYear), $(this).data().year === e.datepicker.state.selected.year && $(this).addClass(e.cssClass.selectedYear)
            }), e._updateNavigator(), this
        },
        _checkYearAccess: function (e) {
            if (this.datepicker.state._filetredDate) {
                var t = this.datepicker.state.filterDate.start.year, i = this.datepicker.state.filterDate.end.year;
                return e >= t & i >= e ? !0 : !1
            }
            return this.datepicker.checkYear(e)
        },
        _attachEvents: function () {
            var e = this;
            return this.scrollEnabled && ($(this.container).mousewheel(function (t) {
                t.deltaY > 0 ? e.next() : e.prev()
            }), $(this.container).bind("mousewheel DOMMouseScroll", function (e) {
                var t = null;
                "mousewheel" == e.type ? t = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" == e.type && (t = 40 * e.originalEvent.detail), t && (e.preventDefault(), $(this).scrollTop(t + $(this).scrollTop()))
            })), this
        },
        _render: function () {
            var e, t = this, i = t.datepicker.state.view.year, n = 12 * parseInt(i / 12);
            t.container.children("." + t.cssClass.yearItem).remove();
            var a;
            for (a in c(12)) e = $("<div/>").addClass(t.cssClass.yearItem).data({year: n + parseInt(a)}).text(t.datepicker._formatDigit(n + parseInt(a))).appendTo(t.container), i === n + parseInt(a) && e.addClass(t.cssClass.selectedYear), t._checkYearAccess(n + parseInt(a)) ? e.click(function () {
                var e = $(this).data().year;
                return t.datepicker.selectYear(parseInt(e)), t.onSelect(e), !1
            }) : (e.addClass(t.cssClass.disbaleItem), e.click(function () {
                return !1
            }));
            return this
        },
        init: function () {
            return this._render(), this._attachEvents(), this
        }
    }, _ = function (e, t) {
        return h(this, [a, x, e, {container: t}])
    }, S = {
        text: {btnToday: "امروز"}, enabled: !0, cssClass: {btnToday: "btn-today"}, _goToday: function () {
            var e = this, t = (new Date).valueOf();
            return e.datepicker.selectDate(t), this.onToday(this), this
        }, _render: function () {
            var e = this;
            return this.todayBtn = $("<div></div>").text(e.text.btnToday).addClass(e.cssClass.btnToday).click(function () {
                return e._goToday(), !1
            }).appendTo(this.$container), this
        }, init: function () {
            return this._render()
        }
    }, C = function (e, t) {
        return h(this, [a, S, e, {$container: t}])
    }, M = {
        secondStep: 1, minuteStep: 1, hourStep: 1, cssClss: {timepicker: "viewModel"}, show: function () {
            "use strict";
            return this.container.show(), this
        }, hide: function () {
            "use strict";
            return this.container.hide(), this
        }, _render: function () {
            var e = this, t = {css: e.cssClass};
            return $.tmplMustache(i.timepicker, t).appendTo(this.container), this
        }, _currentMeridian: null, convert24hTo12: function (e) {
            var t = e, i = "AM";
            return e >= 12 && (t = e - 12, i = "PM"), 0 === e && (t = 12), [t, i]
        }, convert12hTo24: function (e) {
            var t = e;
            return "PM" === this._currentMeridian && 12 > e && (t = e + 12), "AM" === this._currentMeridian && 12 === e && (t = e - 12), t
        }, _updateTime: function (e) {
            var t = e.selected, i = this.convert24hTo12(t.hour);
            return this.hourInput.val(t.hour), this.minuteInput.val(t.minute), this.secondInput.val(t.second), this.meridianInput.val(t.dateObj.format("a")), this._currentMeridian = i[1], this.meridianInput.attr({"data-meridian-mode": this._currentMeridian}), this
        }, _updateMeridian: function (e) {
            var t = e.selected;
            return this.meridianInput.val(t.dateObj.format("a")), this
        }, _toggleMeridian: function () {
            return "AM" === this._currentMeridian ? (this._currentMeridian = "PM", this.meridianInput.val("PM")) : "PM" === this._currentMeridian && (this._currentMeridian = "AM", this.meridianInput.val("AM")), this
        }, _movehour: function (e) {
            var t = parseInt(this.hourInput.val());
            return 1 == this.showMeridian ? "up" === e ? t >= 12 ? t = this.hourStep : t += this.hourStep : 1 >= t ? t = 12 : t -= this.hourStep : "up" === e ? t += this.hourStep : t -= this.hourStep, this.hourInput.val(t), this._updateState("hour", this.convert12hTo24(t)), this
        }, _moveminute: function (e) {
            var t = parseInt(this.minuteInput.val());
            return "up" === e ? 59 === t ? t = 0 : t += this.minuteStep : 0 === t ? t = 59 : t -= this.minuteStep, this.minuteInput.val(t), this._updateState("minute", t), this
        }, _movesecond: function (e) {
            var t = parseInt(this.secondInput.val());
            return "up" === e ? 59 === t ? t = 0 : t += this.secondStep : 0 === t ? t = 59 : t -= this.secondStep, this.secondInput.val(t), this._updateState("second", t), this
        }, _movemeridian: function () {
            return this._toggleMeridian(), this._updateState("hour", this.convert12hTo24(parseInt(this.hourInput.val()))), this
        }, _updateState: function (e, t) {
            return this.datepicker.selectTime(e, t), this._updateMeridian(this.datepicker.state), this
        }, _attachEvent: function () {
            var e = this;
            return $(".up-btn", this.container).click(function () {
                return e["_move" + $(this).parent().attr("data-time-key")]("up"), !1
            }), $(".down-btn", this.container).click(function () {
                return e["_move" + $(this).parent().attr("data-time-key")]("down"), !1
            }), this.scrollEnabled && ($("> div.time-segment", this.container).mousewheel(function (t) {
                var i = "down";
                t.deltaY > 0 && (i = "up"), e["_move" + $(this).attr("data-time-key")](i)
            }), $("> div.time-segment", this.container).bind("mousewheel DOMMouseScroll", function (e) {
                var t = null;
                "mousewheel" == e.type ? t = -1 * e.originalEvent.wheelDelta : "DOMMouseScroll" == e.type && (t = 40 * e.originalEvent.detail), t && (e.preventDefault(), $(this).scrollTop(t + $(this).scrollTop()))
            })), this
        }, _bootstrap: function () {
            return this.showMeridian === !1 && ($(".meridian", this.container).hide(), $(".meridian-divider", this.container).hide(), $(".time-segment", this.container).css({width: "31%"})), this.showSeconds === !1 && ($(".second", this.container).hide(), $(".second-divider", this.container).hide(), $(".time-segment", this.container).css({width: "31%"})), this.showMeridian === !1 && this.showSeconds === !1 && $(".time-segment", this.container).css({width: "47%"}), this.hourInput = $(".hour-input", this.container), this.minuteInput = $(".minute-input", this.container), this.secondInput = $(".second-input", this.container), this.meridianInput = $(".meridian-input", this.container), this._updateTime(this.datepicker.state), this
        }, setTime: function (e) {
            var t = new persianDate(e);
            this._updateState("hour", t.hour()), this._updateState("minute", t.minute()), this._updateState("second", t.second()), this.minuteInput.val(t.minute()), this.secondInput.val(t.second()), this.hourInput.val(t.hour())
        }, init: function () {
            return this._render()._bootstrap()._attachEvent(), this
        }
    }, I = function (e, t) {
        return h(this, [a, M, e, {container: t}])
    }, P = {
        filterDate: {
            start: {year: 0, month: 0, date: 0, hour: 0, minute: 0, second: 0, unixDate: 0},
            end: {year: 0, month: 0, date: 0, hour: 0, minute: 0, second: 0, unixDate: 100}
        },
        view: {year: 0, month: 0, date: 0, hour: 0, minute: 0, second: 0, unixDate: 0},
        selected: {year: 0, month: 0, date: 0, hour: 0, minute: 0, second: 0, unixDate: 0},
        setFilterDate: function (e, t, i) {
            var n = this;
            t || (t = -99999999999999);
            var a = new persianDate(t);
            n.filterDate.start.unixDate = t, n.filterDate.start.hour = a.hour(), n.filterDate.start.minute = a.minute(), n.filterDate.start.second = a.second(), n.filterDate.start.month = a.month(), n.filterDate.start.date = a.date(), n.filterDate.start.year = a.year(), i || (i = 99999999999999);
            var a = new persianDate(i);
            n.filterDate.end.unixDate = i, n.filterDate.end.hour = a.hour(), n.filterDate.end.minute = a.minute(), n.filterDate.end.second = a.second(), n.filterDate.end.month = a.month(), n.filterDate.end.date = a.date(), n.filterDate.end.year = a.year()
        },
        _updateSelectedUnix: function () {
            return this.selected.dateObj = new persianDate([this.selected.year, this.selected.month, this.selected.date, this.selected.hour, this.selected.minute, this.selected.second]), this.selected.unixDate = this.selected.dateObj.valueOf(), this
        },
        setTime: function (e, t) {
            var i = this;
            switch (e) {
                case"unix":
                    i.selected.unixDate = t;
                    var n = new persianDate(t);
                    i.selected.hour = n.hour(), i.selected.minute = n.minute(), i.selected.second = n.second(), i._updateSelectedUnix();
                    break;
                case"hour":
                    this.selected.hour = t, i._updateSelectedUnix();
                    break;
                case"minute":
                    this.selected.minute = t, i._updateSelectedUnix();
                    break;
                case"second":
                    this.selected.second = t, i._updateSelectedUnix()
            }
            return this
        },
        setSelected: function (e, t) {
            var i = this;
            switch (e) {
                case"unix":
                    i.selected.unixDate = t;
                    var n = new persianDate(t);
                    i.selected.year = n.year(), i.selected.month = n.month(), i.selected.date = n.date(), i._updateSelectedUnix();
                    break;
                case"year":
                    this.selected.year = t, i._updateSelectedUnix();
                    break;
                case"month":
                    this.selected.month = t, i._updateSelectedUnix();
                    break;
                case"date":
                    this.selected.month = t, i._updateSelectedUnix()
            }
            return this
        },
        setSelectedDateTime: function (e, t) {
            var i = this;
            switch (e) {
                case"unix":
                    i.selected.unixDate = t;
                    var n = new persianDate(t);
                    i.selected.year = n.year(), i.selected.month = n.month(), i.selected.date = n.date(), i.selected.hour = n.hour(), i.selected.minute = n.minute(), i.selected.second = n.second(), i._updateSelectedUnix();
                    break;
                case"year":
                    this.selected.year = t, i._updateSelectedUnix();
                    break;
                case"month":
                    this.selected.month = t, i._updateSelectedUnix();
                    break;
                case"date":
                    this.selected.month = t, i._updateSelectedUnix()
            }
            return this
        },
        syncViewWithelected: function () {
            return this.view.year = this.selected.year, this.view.month = this.selected.month, this.view.date = this.selected.date, this.view.unixDate = this.selected.unixDate, this
        },
        _updateViewUnix: function () {
            return this.view.dateObj = new persianDate([this.view.year, this.view.month, this.view.date, this.view.hour, this.view.minute, this.view.second]), this.view.unixDate = this.view.dateObj.valueOf(), this
        },
        setView: function (e, t) {
            var i = this;
            switch (e) {
                case"unix":
                    var n = new persianDate(t);
                    i.view.year = n.year(), i.view.month = n.month(), i.view.date = n.date(), i.view.unixDate = t;
                    break;
                case"year":
                    this.view.year = t, this._updateViewUnix();
                    break;
                case"month":
                    this.view.month = t, this._updateViewUnix();
                    break;
                case"date":
                    this.view.month = t, this._updateViewUnix()
            }
            return this
        }
    }, T = function (e) {
        return h(this, [P, e])
    };
    (function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
    })(function (e) {
        function t(t) {
            var r = t || window.event, o = c.call(arguments, 1), h = 0, l = 0, u = 0, p = 0, v = 0, m = 0;
            if (t = e.event.fix(r), t.type = "mousewheel", "detail" in r && (u = -1 * r.detail), "wheelDelta" in r && (u = r.wheelDelta), "wheelDeltaY" in r && (u = r.wheelDeltaY), "wheelDeltaX" in r && (l = -1 * r.wheelDeltaX), "axis" in r && r.axis === r.HORIZONTAL_AXIS && (l = -1 * u, u = 0), h = 0 === u ? l : u, "deltaY" in r && (u = -1 * r.deltaY, h = u), "deltaX" in r && (l = r.deltaX, 0 === u && (h = -1 * l)), 0 !== u || 0 !== l) {
                if (1 === r.deltaMode) {
                    var f = e.data(this, "mousewheel-line-height");
                    h *= f, u *= f, l *= f
                } else if (2 === r.deltaMode) {
                    var w = e.data(this, "mousewheel-page-height");
                    h *= w, u *= w, l *= w
                }
                if (p = Math.max(Math.abs(u), Math.abs(l)), (!s || s > p) && (s = p, n(r, p) && (s /= 40)), n(r, p) && (h /= 40, l /= 40, u /= 40), h = Math[h >= 1 ? "floor" : "ceil"](h / s), l = Math[l >= 1 ? "floor" : "ceil"](l / s), u = Math[u >= 1 ? "floor" : "ceil"](u / s), d.settings.normalizeOffset && this.getBoundingClientRect) {
                    var y = this.getBoundingClientRect();
                    v = t.clientX - y.left, m = t.clientY - y.top
                }
                return t.deltaX = l, t.deltaY = u, t.deltaFactor = s, t.offsetX = v, t.offsetY = m, t.deltaMode = 0, o.unshift(t, h, l, u), a && clearTimeout(a), a = setTimeout(i, 200), (e.event.dispatch || e.event.handle).apply(this, o)
            }
        }

        function i() {
            s = null
        }

        function n(e, t) {
            return d.settings.adjustOldDeltas && "mousewheel" === e.type && 0 === t % 120
        }

        var a, s, r = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            o = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            c = Array.prototype.slice;
        if (e.event.fixHooks) for (var h = r.length; h;) e.event.fixHooks[r[--h]] = e.event.mouseHooks;
        var d = e.event.special.mousewheel = {
            version: "3.1.12", setup: function () {
                if (this.addEventListener) for (var i = o.length; i;) this.addEventListener(o[--i], t, !1); else this.onmousewheel = t;
                e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
            }, teardown: function () {
                if (this.removeEventListener) for (var i = o.length; i;) this.removeEventListener(o[--i], t, !1); else this.onmousewheel = null;
                e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
            }, getLineHeight: function (t) {
                var i = e(t), n = i["offsetParent" in e.fn ? "offsetParent" : "parent"]();
                return n.length || (n = e("body")), parseInt(n.css("fontSize"), 10) || parseInt(i.css("fontSize"), 10) || 16
            }, getPageHeight: function (t) {
                return e(t).height()
            }, settings: {adjustOldDeltas: !0, normalizeOffset: !0}
        };
        e.fn.extend({
            mousewheel: function (e) {
                return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
            }, unmousewheel: function (e) {
                return this.unbind("mousewheel", e)
            }
        })
    })
})();


/*Part32 Chart.js */
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.7.0
 *
 * Copyright 2017 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
!function (t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Chart = t()
    }
}(function () {
    return function t(e, n, i) {
        function a(r, l) {
            if (!n[r]) {
                if (!e[r]) {
                    var s = "function" == typeof require && require;
                    if (!l && s) return s(r, !0);
                    if (o) return o(r, !0);
                    var u = new Error("Cannot find module '" + r + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var d = n[r] = {exports: {}};
                e[r][0].call(d.exports, function (t) {
                    var n = e[r][1][t];
                    return a(n || t)
                }, d, d.exports, t, e, n, i)
            }
            return n[r].exports
        }

        for (var o = "function" == typeof require && require, r = 0; r < i.length; r++) a(i[r]);
        return a
    }({
        1: [function (t, e, n) {
        }, {}], 2: [function (t, e, n) {
            function i(t) {
                if (t) {
                    var e = /^#([a-fA-F0-9]{3})$/i, n = /^#([a-fA-F0-9]{6})$/i,
                        i = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
                        a = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
                        o = /(\w+)/, r = [0, 0, 0], l = 1, s = t.match(e);
                    if (s) {
                        s = s[1];
                        for (d = 0; d < r.length; d++) r[d] = parseInt(s[d] + s[d], 16)
                    } else if (s = t.match(n)) {
                        s = s[1];
                        for (d = 0; d < r.length; d++) r[d] = parseInt(s.slice(2 * d, 2 * d + 2), 16)
                    } else if (s = t.match(i)) {
                        for (d = 0; d < r.length; d++) r[d] = parseInt(s[d + 1]);
                        l = parseFloat(s[4])
                    } else if (s = t.match(a)) {
                        for (d = 0; d < r.length; d++) r[d] = Math.round(2.55 * parseFloat(s[d + 1]));
                        l = parseFloat(s[4])
                    } else if (s = t.match(o)) {
                        if ("transparent" == s[1]) return [0, 0, 0, 0];
                        if (!(r = c[s[1]])) return
                    }
                    for (var d = 0; d < r.length; d++) r[d] = u(r[d], 0, 255);
                    return l = l || 0 == l ? u(l, 0, 1) : 1, r[3] = l, r
                }
            }

            function a(t) {
                if (t) {
                    var e = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
                        n = t.match(e);
                    if (n) {
                        var i = parseFloat(n[4]);
                        return [u(parseInt(n[1]), 0, 360), u(parseFloat(n[2]), 0, 100), u(parseFloat(n[3]), 0, 100), u(isNaN(i) ? 1 : i, 0, 1)]
                    }
                }
            }

            function o(t) {
                if (t) {
                    var e = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,
                        n = t.match(e);
                    if (n) {
                        var i = parseFloat(n[4]);
                        return [u(parseInt(n[1]), 0, 360), u(parseFloat(n[2]), 0, 100), u(parseFloat(n[3]), 0, 100), u(isNaN(i) ? 1 : i, 0, 1)]
                    }
                }
            }

            function r(t, e) {
                return void 0 === e && (e = void 0 !== t[3] ? t[3] : 1), "rgba(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + e + ")"
            }

            function l(t, e) {
                return "rgba(" + Math.round(t[0] / 255 * 100) + "%, " + Math.round(t[1] / 255 * 100) + "%, " + Math.round(t[2] / 255 * 100) + "%, " + (e || t[3] || 1) + ")"
            }

            function s(t, e) {
                return void 0 === e && (e = void 0 !== t[3] ? t[3] : 1), "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + e + ")"
            }

            function u(t, e, n) {
                return Math.min(Math.max(e, t), n)
            }

            function d(t) {
                var e = t.toString(16).toUpperCase();
                return e.length < 2 ? "0" + e : e
            }

            var c = t(6);
            e.exports = {
                getRgba: i, getHsla: a, getRgb: function (t) {
                    var e = i(t);
                    return e && e.slice(0, 3)
                }, getHsl: function (t) {
                    var e = a(t);
                    return e && e.slice(0, 3)
                }, getHwb: o, getAlpha: function (t) {
                    var e = i(t);
                    return e ? e[3] : (e = a(t)) ? e[3] : (e = o(t)) ? e[3] : void 0
                }, hexString: function (t) {
                    return "#" + d(t[0]) + d(t[1]) + d(t[2])
                }, rgbString: function (t, e) {
                    return e < 1 || t[3] && t[3] < 1 ? r(t, e) : "rgb(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
                }, rgbaString: r, percentString: function (t, e) {
                    return e < 1 || t[3] && t[3] < 1 ? l(t, e) : "rgb(" + Math.round(t[0] / 255 * 100) + "%, " + Math.round(t[1] / 255 * 100) + "%, " + Math.round(t[2] / 255 * 100) + "%)"
                }, percentaString: l, hslString: function (t, e) {
                    return e < 1 || t[3] && t[3] < 1 ? s(t, e) : "hsl(" + t[0] + ", " + t[1] + "%, " + t[2] + "%)"
                }, hslaString: s, hwbString: function (t, e) {
                    return void 0 === e && (e = void 0 !== t[3] ? t[3] : 1), "hwb(" + t[0] + ", " + t[1] + "%, " + t[2] + "%" + (void 0 !== e && 1 !== e ? ", " + e : "") + ")"
                }, keyword: function (t) {
                    return h[t.slice(0, 3)]
                }
            };
            var h = {};
            for (var f in c) h[c[f]] = f
        }, {6: 6}], 3: [function (t, e, n) {
            var i = t(5), a = t(2), o = function (t) {
                if (t instanceof o) return t;
                if (!(this instanceof o)) return new o(t);
                this.valid = !1, this.values = {
                    rgb: [0, 0, 0],
                    hsl: [0, 0, 0],
                    hsv: [0, 0, 0],
                    hwb: [0, 0, 0],
                    cmyk: [0, 0, 0, 0],
                    alpha: 1
                };
                var e;
                "string" == typeof t ? (e = a.getRgba(t)) ? this.setValues("rgb", e) : (e = a.getHsla(t)) ? this.setValues("hsl", e) : (e = a.getHwb(t)) && this.setValues("hwb", e) : "object" == typeof t && (void 0 !== (e = t).r || void 0 !== e.red ? this.setValues("rgb", e) : void 0 !== e.l || void 0 !== e.lightness ? this.setValues("hsl", e) : void 0 !== e.v || void 0 !== e.value ? this.setValues("hsv", e) : void 0 !== e.w || void 0 !== e.whiteness ? this.setValues("hwb", e) : void 0 === e.c && void 0 === e.cyan || this.setValues("cmyk", e))
            };
            o.prototype = {
                isValid: function () {
                    return this.valid
                }, rgb: function () {
                    return this.setSpace("rgb", arguments)
                }, hsl: function () {
                    return this.setSpace("hsl", arguments)
                }, hsv: function () {
                    return this.setSpace("hsv", arguments)
                }, hwb: function () {
                    return this.setSpace("hwb", arguments)
                }, cmyk: function () {
                    return this.setSpace("cmyk", arguments)
                }, rgbArray: function () {
                    return this.values.rgb
                }, hslArray: function () {
                    return this.values.hsl
                }, hsvArray: function () {
                    return this.values.hsv
                }, hwbArray: function () {
                    var t = this.values;
                    return 1 !== t.alpha ? t.hwb.concat([t.alpha]) : t.hwb
                }, cmykArray: function () {
                    return this.values.cmyk
                }, rgbaArray: function () {
                    var t = this.values;
                    return t.rgb.concat([t.alpha])
                }, hslaArray: function () {
                    var t = this.values;
                    return t.hsl.concat([t.alpha])
                }, alpha: function (t) {
                    return void 0 === t ? this.values.alpha : (this.setValues("alpha", t), this)
                }, red: function (t) {
                    return this.setChannel("rgb", 0, t)
                }, green: function (t) {
                    return this.setChannel("rgb", 1, t)
                }, blue: function (t) {
                    return this.setChannel("rgb", 2, t)
                }, hue: function (t) {
                    return t && (t = (t %= 360) < 0 ? 360 + t : t), this.setChannel("hsl", 0, t)
                }, saturation: function (t) {
                    return this.setChannel("hsl", 1, t)
                }, lightness: function (t) {
                    return this.setChannel("hsl", 2, t)
                }, saturationv: function (t) {
                    return this.setChannel("hsv", 1, t)
                }, whiteness: function (t) {
                    return this.setChannel("hwb", 1, t)
                }, blackness: function (t) {
                    return this.setChannel("hwb", 2, t)
                }, value: function (t) {
                    return this.setChannel("hsv", 2, t)
                }, cyan: function (t) {
                    return this.setChannel("cmyk", 0, t)
                }, magenta: function (t) {
                    return this.setChannel("cmyk", 1, t)
                }, yellow: function (t) {
                    return this.setChannel("cmyk", 2, t)
                }, black: function (t) {
                    return this.setChannel("cmyk", 3, t)
                }, hexString: function () {
                    return a.hexString(this.values.rgb)
                }, rgbString: function () {
                    return a.rgbString(this.values.rgb, this.values.alpha)
                }, rgbaString: function () {
                    return a.rgbaString(this.values.rgb, this.values.alpha)
                }, percentString: function () {
                    return a.percentString(this.values.rgb, this.values.alpha)
                }, hslString: function () {
                    return a.hslString(this.values.hsl, this.values.alpha)
                }, hslaString: function () {
                    return a.hslaString(this.values.hsl, this.values.alpha)
                }, hwbString: function () {
                    return a.hwbString(this.values.hwb, this.values.alpha)
                }, keyword: function () {
                    return a.keyword(this.values.rgb, this.values.alpha)
                }, rgbNumber: function () {
                    var t = this.values.rgb;
                    return t[0] << 16 | t[1] << 8 | t[2]
                }, luminosity: function () {
                    for (var t = this.values.rgb, e = [], n = 0; n < t.length; n++) {
                        var i = t[n] / 255;
                        e[n] = i <= .03928 ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4)
                    }
                    return .2126 * e[0] + .7152 * e[1] + .0722 * e[2]
                }, contrast: function (t) {
                    var e = this.luminosity(), n = t.luminosity();
                    return e > n ? (e + .05) / (n + .05) : (n + .05) / (e + .05)
                }, level: function (t) {
                    var e = this.contrast(t);
                    return e >= 7.1 ? "AAA" : e >= 4.5 ? "AA" : ""
                }, dark: function () {
                    var t = this.values.rgb;
                    return (299 * t[0] + 587 * t[1] + 114 * t[2]) / 1e3 < 128
                }, light: function () {
                    return !this.dark()
                }, negate: function () {
                    for (var t = [], e = 0; e < 3; e++) t[e] = 255 - this.values.rgb[e];
                    return this.setValues("rgb", t), this
                }, lighten: function (t) {
                    var e = this.values.hsl;
                    return e[2] += e[2] * t, this.setValues("hsl", e), this
                }, darken: function (t) {
                    var e = this.values.hsl;
                    return e[2] -= e[2] * t, this.setValues("hsl", e), this
                }, saturate: function (t) {
                    var e = this.values.hsl;
                    return e[1] += e[1] * t, this.setValues("hsl", e), this
                }, desaturate: function (t) {
                    var e = this.values.hsl;
                    return e[1] -= e[1] * t, this.setValues("hsl", e), this
                }, whiten: function (t) {
                    var e = this.values.hwb;
                    return e[1] += e[1] * t, this.setValues("hwb", e), this
                }, blacken: function (t) {
                    var e = this.values.hwb;
                    return e[2] += e[2] * t, this.setValues("hwb", e), this
                }, greyscale: function () {
                    var t = this.values.rgb, e = .3 * t[0] + .59 * t[1] + .11 * t[2];
                    return this.setValues("rgb", [e, e, e]), this
                }, clearer: function (t) {
                    var e = this.values.alpha;
                    return this.setValues("alpha", e - e * t), this
                }, opaquer: function (t) {
                    var e = this.values.alpha;
                    return this.setValues("alpha", e + e * t), this
                }, rotate: function (t) {
                    var e = this.values.hsl, n = (e[0] + t) % 360;
                    return e[0] = n < 0 ? 360 + n : n, this.setValues("hsl", e), this
                }, mix: function (t, e) {
                    var n = this, i = t, a = void 0 === e ? .5 : e, o = 2 * a - 1, r = n.alpha() - i.alpha(),
                        l = ((o * r == -1 ? o : (o + r) / (1 + o * r)) + 1) / 2, s = 1 - l;
                    return this.rgb(l * n.red() + s * i.red(), l * n.green() + s * i.green(), l * n.blue() + s * i.blue()).alpha(n.alpha() * a + i.alpha() * (1 - a))
                }, toJSON: function () {
                    return this.rgb()
                }, clone: function () {
                    var t, e, n = new o, i = this.values, a = n.values;
                    for (var r in i) i.hasOwnProperty(r) && (t = i[r], "[object Array]" === (e = {}.toString.call(t)) ? a[r] = t.slice(0) : "[object Number]" === e ? a[r] = t : console.error("unexpected color value:", t));
                    return n
                }
            }, o.prototype.spaces = {
                rgb: ["red", "green", "blue"],
                hsl: ["hue", "saturation", "lightness"],
                hsv: ["hue", "saturation", "value"],
                hwb: ["hue", "whiteness", "blackness"],
                cmyk: ["cyan", "magenta", "yellow", "black"]
            }, o.prototype.maxes = {
                rgb: [255, 255, 255],
                hsl: [360, 100, 100],
                hsv: [360, 100, 100],
                hwb: [360, 100, 100],
                cmyk: [100, 100, 100, 100]
            }, o.prototype.getValues = function (t) {
                for (var e = this.values, n = {}, i = 0; i < t.length; i++) n[t.charAt(i)] = e[t][i];
                return 1 !== e.alpha && (n.a = e.alpha), n
            }, o.prototype.setValues = function (t, e) {
                var n, a = this.values, o = this.spaces, r = this.maxes, l = 1;
                if (this.valid = !0, "alpha" === t) l = e; else if (e.length) a[t] = e.slice(0, t.length), l = e[t.length]; else if (void 0 !== e[t.charAt(0)]) {
                    for (n = 0; n < t.length; n++) a[t][n] = e[t.charAt(n)];
                    l = e.a
                } else if (void 0 !== e[o[t][0]]) {
                    var s = o[t];
                    for (n = 0; n < t.length; n++) a[t][n] = e[s[n]];
                    l = e.alpha
                }
                if (a.alpha = Math.max(0, Math.min(1, void 0 === l ? a.alpha : l)), "alpha" === t) return !1;
                var u;
                for (n = 0; n < t.length; n++) u = Math.max(0, Math.min(r[t][n], a[t][n])), a[t][n] = Math.round(u);
                for (var d in o) d !== t && (a[d] = i[t][d](a[t]));
                return !0
            }, o.prototype.setSpace = function (t, e) {
                var n = e[0];
                return void 0 === n ? this.getValues(t) : ("number" == typeof n && (n = Array.prototype.slice.call(e)), this.setValues(t, n), this)
            }, o.prototype.setChannel = function (t, e, n) {
                var i = this.values[t];
                return void 0 === n ? i[e] : n === i[e] ? this : (i[e] = n, this.setValues(t, i), this)
            }, "undefined" != typeof window && (window.Color = o), e.exports = o
        }, {2: 2, 5: 5}], 4: [function (t, e, n) {
            function i(t) {
                var e, n, i, a = t[0] / 255, o = t[1] / 255, r = t[2] / 255, l = Math.min(a, o, r),
                    s = Math.max(a, o, r), u = s - l;
                return s == l ? e = 0 : a == s ? e = (o - r) / u : o == s ? e = 2 + (r - a) / u : r == s && (e = 4 + (a - o) / u), (e = Math.min(60 * e, 360)) < 0 && (e += 360), i = (l + s) / 2, n = s == l ? 0 : i <= .5 ? u / (s + l) : u / (2 - s - l), [e, 100 * n, 100 * i]
            }

            function a(t) {
                var e, n, i, a = t[0], o = t[1], r = t[2], l = Math.min(a, o, r), s = Math.max(a, o, r), u = s - l;
                return n = 0 == s ? 0 : u / s * 1e3 / 10, s == l ? e = 0 : a == s ? e = (o - r) / u : o == s ? e = 2 + (r - a) / u : r == s && (e = 4 + (a - o) / u), (e = Math.min(60 * e, 360)) < 0 && (e += 360), i = s / 255 * 1e3 / 10, [e, n, i]
            }

            function o(t) {
                var e = t[0], n = t[1], a = t[2];
                return [i(t)[0], 100 * (1 / 255 * Math.min(e, Math.min(n, a))), 100 * (a = 1 - 1 / 255 * Math.max(e, Math.max(n, a)))]
            }

            function l(t) {
                var e, n, i, a, o = t[0] / 255, r = t[1] / 255, l = t[2] / 255;
                return a = Math.min(1 - o, 1 - r, 1 - l), e = (1 - o - a) / (1 - a) || 0, n = (1 - r - a) / (1 - a) || 0, i = (1 - l - a) / (1 - a) || 0, [100 * e, 100 * n, 100 * i, 100 * a]
            }

            function s(t) {
                return C[JSON.stringify(t)]
            }

            function u(t) {
                var e = t[0] / 255, n = t[1] / 255, i = t[2] / 255;
                return [100 * (.4124 * (e = e > .04045 ? Math.pow((e + .055) / 1.055, 2.4) : e / 12.92) + .3576 * (n = n > .04045 ? Math.pow((n + .055) / 1.055, 2.4) : n / 12.92) + .1805 * (i = i > .04045 ? Math.pow((i + .055) / 1.055, 2.4) : i / 12.92)), 100 * (.2126 * e + .7152 * n + .0722 * i), 100 * (.0193 * e + .1192 * n + .9505 * i)]
            }

            function d(t) {
                var e, n, i, a = u(t), o = a[0], r = a[1], l = a[2];
                return o /= 95.047, r /= 100, l /= 108.883, o = o > .008856 ? Math.pow(o, 1 / 3) : 7.787 * o + 16 / 116, r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116, l = l > .008856 ? Math.pow(l, 1 / 3) : 7.787 * l + 16 / 116, e = 116 * r - 16, n = 500 * (o - r), i = 200 * (r - l), [e, n, i]
            }

            function c(t) {
                var e, n, i, a, o, r = t[0] / 360, l = t[1] / 100, s = t[2] / 100;
                if (0 == l) return o = 255 * s, [o, o, o];
                e = 2 * s - (n = s < .5 ? s * (1 + l) : s + l - s * l), a = [0, 0, 0];
                for (var u = 0; u < 3; u++) (i = r + 1 / 3 * -(u - 1)) < 0 && i++, i > 1 && i--, o = 6 * i < 1 ? e + 6 * (n - e) * i : 2 * i < 1 ? n : 3 * i < 2 ? e + (n - e) * (2 / 3 - i) * 6 : e, a[u] = 255 * o;
                return a
            }

            function h(t) {
                var e = t[0] / 60, n = t[1] / 100, i = t[2] / 100, a = Math.floor(e) % 6, o = e - Math.floor(e),
                    r = 255 * i * (1 - n), l = 255 * i * (1 - n * o), s = 255 * i * (1 - n * (1 - o)), i = 255 * i;
                switch (a) {
                    case 0:
                        return [i, s, r];
                    case 1:
                        return [l, i, r];
                    case 2:
                        return [r, i, s];
                    case 3:
                        return [r, l, i];
                    case 4:
                        return [s, r, i];
                    case 5:
                        return [i, r, l]
                }
            }

            function f(t) {
                var e, n, i, a, o = t[0] / 360, l = t[1] / 100, s = t[2] / 100, u = l + s;
                switch (u > 1 && (l /= u, s /= u), e = Math.floor(6 * o), n = 1 - s, i = 6 * o - e, 0 != (1 & e) && (i = 1 - i), a = l + i * (n - l), e) {
                    default:
                    case 6:
                    case 0:
                        r = n, g = a, b = l;
                        break;
                    case 1:
                        r = a, g = n, b = l;
                        break;
                    case 2:
                        r = l, g = n, b = a;
                        break;
                    case 3:
                        r = l, g = a, b = n;
                        break;
                    case 4:
                        r = a, g = l, b = n;
                        break;
                    case 5:
                        r = n, g = l, b = a
                }
                return [255 * r, 255 * g, 255 * b]
            }

            function p(t) {
                var e, n, i, a = t[0] / 100, o = t[1] / 100, r = t[2] / 100, l = t[3] / 100;
                return e = 1 - Math.min(1, a * (1 - l) + l), n = 1 - Math.min(1, o * (1 - l) + l), i = 1 - Math.min(1, r * (1 - l) + l), [255 * e, 255 * n, 255 * i]
            }

            function v(t) {
                var e, n, i, a = t[0] / 100, o = t[1] / 100, r = t[2] / 100;
                return e = 3.2406 * a + -1.5372 * o + -.4986 * r, n = -.9689 * a + 1.8758 * o + .0415 * r, i = .0557 * a + -.204 * o + 1.057 * r, e = e > .0031308 ? 1.055 * Math.pow(e, 1 / 2.4) - .055 : e *= 12.92, n = n > .0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - .055 : n *= 12.92, i = i > .0031308 ? 1.055 * Math.pow(i, 1 / 2.4) - .055 : i *= 12.92, e = Math.min(Math.max(0, e), 1), n = Math.min(Math.max(0, n), 1), i = Math.min(Math.max(0, i), 1), [255 * e, 255 * n, 255 * i]
            }

            function m(t) {
                var e, n, i, a = t[0], o = t[1], r = t[2];
                return a /= 95.047, o /= 100, r /= 108.883, a = a > .008856 ? Math.pow(a, 1 / 3) : 7.787 * a + 16 / 116, o = o > .008856 ? Math.pow(o, 1 / 3) : 7.787 * o + 16 / 116, r = r > .008856 ? Math.pow(r, 1 / 3) : 7.787 * r + 16 / 116, e = 116 * o - 16, n = 500 * (a - o), i = 200 * (o - r), [e, n, i]
            }

            function x(t) {
                var e, n, i, a, o = t[0], r = t[1], l = t[2];
                return o <= 8 ? a = (n = 100 * o / 903.3) / 100 * 7.787 + 16 / 116 : (n = 100 * Math.pow((o + 16) / 116, 3), a = Math.pow(n / 100, 1 / 3)), e = e / 95.047 <= .008856 ? e = 95.047 * (r / 500 + a - 16 / 116) / 7.787 : 95.047 * Math.pow(r / 500 + a, 3), i = i / 108.883 <= .008859 ? i = 108.883 * (a - l / 200 - 16 / 116) / 7.787 : 108.883 * Math.pow(a - l / 200, 3), [e, n, i]
            }

            function y(t) {
                var e, n, i, a = t[0], o = t[1], r = t[2];
                return e = Math.atan2(r, o), (n = 360 * e / 2 / Math.PI) < 0 && (n += 360), i = Math.sqrt(o * o + r * r), [a, i, n]
            }

            function k(t) {
                return v(x(t))
            }

            function w(t) {
                var e, n, i, a = t[0], o = t[1];
                return i = t[2] / 360 * 2 * Math.PI, e = o * Math.cos(i), n = o * Math.sin(i), [a, e, n]
            }

            function M(t) {
                return S[t]
            }

            e.exports = {
                rgb2hsl: i,
                rgb2hsv: a,
                rgb2hwb: o,
                rgb2cmyk: l,
                rgb2keyword: s,
                rgb2xyz: u,
                rgb2lab: d,
                rgb2lch: function (t) {
                    return y(d(t))
                },
                hsl2rgb: c,
                hsl2hsv: function (t) {
                    var e, n, i = t[0], a = t[1] / 100, o = t[2] / 100;
                    return 0 === o ? [0, 0, 0] : (o *= 2, a *= o <= 1 ? o : 2 - o, n = (o + a) / 2, e = 2 * a / (o + a), [i, 100 * e, 100 * n])
                },
                hsl2hwb: function (t) {
                    return o(c(t))
                },
                hsl2cmyk: function (t) {
                    return l(c(t))
                },
                hsl2keyword: function (t) {
                    return s(c(t))
                },
                hsv2rgb: h,
                hsv2hsl: function (t) {
                    var e, n, i = t[0], a = t[1] / 100, o = t[2] / 100;
                    return n = (2 - a) * o, e = a * o, e /= n <= 1 ? n : 2 - n, e = e || 0, n /= 2, [i, 100 * e, 100 * n]
                },
                hsv2hwb: function (t) {
                    return o(h(t))
                },
                hsv2cmyk: function (t) {
                    return l(h(t))
                },
                hsv2keyword: function (t) {
                    return s(h(t))
                },
                hwb2rgb: f,
                hwb2hsl: function (t) {
                    return i(f(t))
                },
                hwb2hsv: function (t) {
                    return a(f(t))
                },
                hwb2cmyk: function (t) {
                    return l(f(t))
                },
                hwb2keyword: function (t) {
                    return s(f(t))
                },
                cmyk2rgb: p,
                cmyk2hsl: function (t) {
                    return i(p(t))
                },
                cmyk2hsv: function (t) {
                    return a(p(t))
                },
                cmyk2hwb: function (t) {
                    return o(p(t))
                },
                cmyk2keyword: function (t) {
                    return s(p(t))
                },
                keyword2rgb: M,
                keyword2hsl: function (t) {
                    return i(M(t))
                },
                keyword2hsv: function (t) {
                    return a(M(t))
                },
                keyword2hwb: function (t) {
                    return o(M(t))
                },
                keyword2cmyk: function (t) {
                    return l(M(t))
                },
                keyword2lab: function (t) {
                    return d(M(t))
                },
                keyword2xyz: function (t) {
                    return u(M(t))
                },
                xyz2rgb: v,
                xyz2lab: m,
                xyz2lch: function (t) {
                    return y(m(t))
                },
                lab2xyz: x,
                lab2rgb: k,
                lab2lch: y,
                lch2lab: w,
                lch2xyz: function (t) {
                    return x(w(t))
                },
                lch2rgb: function (t) {
                    return k(w(t))
                }
            };
            var S = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50]
            }, C = {};
            for (var _ in S) C[JSON.stringify(S[_])] = _
        }, {}], 5: [function (t, e, n) {
            var i = t(4), a = function () {
                return new u
            };
            for (var o in i) {
                a[o + "Raw"] = function (t) {
                    return function (e) {
                        return "number" == typeof e && (e = Array.prototype.slice.call(arguments)), i[t](e)
                    }
                }(o);
                var r = /(\w+)2(\w+)/.exec(o), l = r[1], s = r[2];
                (a[l] = a[l] || {})[s] = a[o] = function (t) {
                    return function (e) {
                        "number" == typeof e && (e = Array.prototype.slice.call(arguments));
                        var n = i[t](e);
                        if ("string" == typeof n || void 0 === n) return n;
                        for (var a = 0; a < n.length; a++) n[a] = Math.round(n[a]);
                        return n
                    }
                }(o)
            }
            var u = function () {
                this.convs = {}
            };
            u.prototype.routeSpace = function (t, e) {
                var n = e[0];
                return void 0 === n ? this.getValues(t) : ("number" == typeof n && (n = Array.prototype.slice.call(e)), this.setValues(t, n))
            }, u.prototype.setValues = function (t, e) {
                return this.space = t, this.convs = {}, this.convs[t] = e, this
            }, u.prototype.getValues = function (t) {
                var e = this.convs[t];
                if (!e) {
                    var n = this.space, i = this.convs[n];
                    e = a[n][t](i), this.convs[t] = e
                }
                return e
            }, ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function (t) {
                u.prototype[t] = function (e) {
                    return this.routeSpace(t, arguments)
                }
            }), e.exports = a
        }, {4: 4}], 6: [function (t, e, n) {
            "use strict";
            e.exports = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                grey: [128, 128, 128],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                rebeccapurple: [102, 51, 153],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50]
            }
        }, {}], 7: [function (t, e, n) {
            var i = t(29)();
            i.helpers = t(45), t(27)(i), i.defaults = t(25), i.Element = t(26), i.elements = t(40), i.Interaction = t(28), i.platform = t(48), t(31)(i), t(22)(i), t(23)(i), t(24)(i), t(30)(i), t(33)(i), t(32)(i), t(35)(i), t(54)(i), t(52)(i), t(53)(i), t(55)(i), t(56)(i), t(57)(i), t(15)(i), t(16)(i), t(17)(i), t(18)(i), t(19)(i), t(20)(i), t(21)(i), t(8)(i), t(9)(i), t(10)(i), t(11)(i), t(12)(i), t(13)(i), t(14)(i);
            var a = [];
            a.push(t(49)(i), t(50)(i), t(51)(i)), i.plugins.register(a), i.platform.initialize(), e.exports = i, "undefined" != typeof window && (window.Chart = i), i.canvasHelpers = i.helpers.canvas
        }, {
            10: 10,
            11: 11,
            12: 12,
            13: 13,
            14: 14,
            15: 15,
            16: 16,
            17: 17,
            18: 18,
            19: 19,
            20: 20,
            21: 21,
            22: 22,
            23: 23,
            24: 24,
            25: 25,
            26: 26,
            27: 27,
            28: 28,
            29: 29,
            30: 30,
            31: 31,
            32: 32,
            33: 33,
            35: 35,
            40: 40,
            45: 45,
            48: 48,
            49: 49,
            50: 50,
            51: 51,
            52: 52,
            53: 53,
            54: 54,
            55: 55,
            56: 56,
            57: 57,
            8: 8,
            9: 9
        }], 8: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Bar = function (e, n) {
                    return n.type = "bar", new t(e, n)
                }
            }
        }, {}], 9: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Bubble = function (e, n) {
                    return n.type = "bubble", new t(e, n)
                }
            }
        }, {}], 10: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Doughnut = function (e, n) {
                    return n.type = "doughnut", new t(e, n)
                }
            }
        }, {}], 11: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Line = function (e, n) {
                    return n.type = "line", new t(e, n)
                }
            }
        }, {}], 12: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.PolarArea = function (e, n) {
                    return n.type = "polarArea", new t(e, n)
                }
            }
        }, {}], 13: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Radar = function (e, n) {
                    return n.type = "radar", new t(e, n)
                }
            }
        }, {}], 14: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                t.Scatter = function (e, n) {
                    return n.type = "scatter", new t(e, n)
                }
            }
        }, {}], 15: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("bar", {
                hover: {mode: "label"},
                scales: {
                    xAxes: [{
                        type: "category",
                        categoryPercentage: .8,
                        barPercentage: .9,
                        offset: !0,
                        gridLines: {offsetGridLines: !0}
                    }], yAxes: [{type: "linear"}]
                }
            }), i._set("horizontalBar", {
                hover: {mode: "index", axis: "y"},
                scales: {
                    xAxes: [{type: "linear", position: "bottom"}],
                    yAxes: [{
                        position: "left",
                        type: "category",
                        categoryPercentage: .8,
                        barPercentage: .9,
                        offset: !0,
                        gridLines: {offsetGridLines: !0}
                    }]
                },
                elements: {rectangle: {borderSkipped: "left"}},
                tooltips: {
                    callbacks: {
                        title: function (t, e) {
                            var n = "";
                            return t.length > 0 && (t[0].yLabel ? n = t[0].yLabel : e.labels.length > 0 && t[0].index < e.labels.length && (n = e.labels[t[0].index])), n
                        }, label: function (t, e) {
                            return (e.datasets[t.datasetIndex].label || "") + ": " + t.xLabel
                        }
                    }, mode: "index", axis: "y"
                }
            }), e.exports = function (t) {
                t.controllers.bar = t.DatasetController.extend({
                    dataElementType: a.Rectangle, initialize: function () {
                        var e, n = this;
                        t.DatasetController.prototype.initialize.apply(n, arguments), (e = n.getMeta()).stack = n.getDataset().stack, e.bar = !0
                    }, update: function (t) {
                        var e, n, i = this, a = i.getMeta().data;
                        for (i._ruler = i.getRuler(), e = 0, n = a.length; e < n; ++e) i.updateElement(a[e], e, t)
                    }, updateElement: function (t, e, n) {
                        var i = this, a = i.chart, r = i.getMeta(), l = i.getDataset(), s = t.custom || {},
                            u = a.options.elements.rectangle;
                        t._xScale = i.getScaleForId(r.xAxisID), t._yScale = i.getScaleForId(r.yAxisID), t._datasetIndex = i.index, t._index = e, t._model = {
                            datasetLabel: l.label,
                            label: a.data.labels[e],
                            borderSkipped: s.borderSkipped ? s.borderSkipped : u.borderSkipped,
                            backgroundColor: s.backgroundColor ? s.backgroundColor : o.valueAtIndexOrDefault(l.backgroundColor, e, u.backgroundColor),
                            borderColor: s.borderColor ? s.borderColor : o.valueAtIndexOrDefault(l.borderColor, e, u.borderColor),
                            borderWidth: s.borderWidth ? s.borderWidth : o.valueAtIndexOrDefault(l.borderWidth, e, u.borderWidth)
                        }, i.updateElementGeometry(t, e, n), t.pivot()
                    }, updateElementGeometry: function (t, e, n) {
                        var i = this, a = t._model, o = i.getValueScale(), r = o.getBasePixel(), l = o.isHorizontal(),
                            s = i._ruler || i.getRuler(), u = i.calculateBarValuePixels(i.index, e),
                            d = i.calculateBarIndexPixels(i.index, e, s);
                        a.horizontal = l, a.base = n ? r : u.base, a.x = l ? n ? r : u.head : d.center, a.y = l ? d.center : n ? r : u.head, a.height = l ? d.size : void 0, a.width = l ? void 0 : d.size
                    }, getValueScaleId: function () {
                        return this.getMeta().yAxisID
                    }, getIndexScaleId: function () {
                        return this.getMeta().xAxisID
                    }, getValueScale: function () {
                        return this.getScaleForId(this.getValueScaleId())
                    }, getIndexScale: function () {
                        return this.getScaleForId(this.getIndexScaleId())
                    }, getStackCount: function (t) {
                        var e, n, i = this, a = i.chart, o = i.getIndexScale().options.stacked,
                            r = void 0 === t ? a.data.datasets.length : t + 1, l = [];
                        for (e = 0; e < r; ++e) (n = a.getDatasetMeta(e)).bar && a.isDatasetVisible(e) && (!1 === o || !0 === o && -1 === l.indexOf(n.stack) || void 0 === o && (void 0 === n.stack || -1 === l.indexOf(n.stack))) && l.push(n.stack);
                        return l.length
                    }, getStackIndex: function (t) {
                        return this.getStackCount(t) - 1
                    }, getRuler: function () {
                        var t, e, n = this, i = n.getIndexScale(), a = n.getStackCount(), o = n.index, r = [],
                            l = i.isHorizontal(), s = l ? i.left : i.top, u = s + (l ? i.width : i.height);
                        for (t = 0, e = n.getMeta().data.length; t < e; ++t) r.push(i.getPixelForValue(null, t, o));
                        return {pixels: r, start: s, end: u, stackCount: a, scale: i}
                    }, calculateBarValuePixels: function (t, e) {
                        var n, i, a, o, r, l, s = this, u = s.chart, d = s.getMeta(), c = s.getValueScale(),
                            h = u.data.datasets, f = c.getRightValue(h[t].data[e]), g = c.options.stacked, p = d.stack,
                            v = 0;
                        if (g || void 0 === g && void 0 !== p) for (n = 0; n < t; ++n) (i = u.getDatasetMeta(n)).bar && i.stack === p && i.controller.getValueScaleId() === c.id && u.isDatasetVisible(n) && (a = c.getRightValue(h[n].data[e]), (f < 0 && a < 0 || f >= 0 && a > 0) && (v += a));
                        return o = c.getPixelForValue(v), r = c.getPixelForValue(v + f), l = (r - o) / 2, {
                            size: l,
                            base: o,
                            head: r,
                            center: r + l / 2
                        }
                    }, calculateBarIndexPixels: function (t, e, n) {
                        var i, a, r, l, s, u, d = this, c = n.scale.options, h = d.getStackIndex(t), f = n.pixels,
                            g = f[e], p = f.length, v = n.start, m = n.end;
                        return 1 === p ? (i = g > v ? g - v : m - g, a = g < m ? m - g : g - v) : (e > 0 && (i = (g - f[e - 1]) / 2, e === p - 1 && (a = i)), e < p - 1 && (a = (f[e + 1] - g) / 2, 0 === e && (i = a))), r = i * c.categoryPercentage, l = a * c.categoryPercentage, s = (r + l) / n.stackCount, u = s * c.barPercentage, u = Math.min(o.valueOrDefault(c.barThickness, u), o.valueOrDefault(c.maxBarThickness, 1 / 0)), g -= r, g += s * h, g += (s - u) / 2, {
                            size: u,
                            base: g,
                            head: g + u,
                            center: g + u / 2
                        }
                    }, draw: function () {
                        var t = this, e = t.chart, n = t.getValueScale(), i = t.getMeta().data, a = t.getDataset(),
                            r = i.length, l = 0;
                        for (o.canvas.clipArea(e.ctx, e.chartArea); l < r; ++l) isNaN(n.getRightValue(a.data[l])) || i[l].draw();
                        o.canvas.unclipArea(e.ctx)
                    }, setHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t._index, i = t.custom || {},
                            a = t._model;
                        a.backgroundColor = i.hoverBackgroundColor ? i.hoverBackgroundColor : o.valueAtIndexOrDefault(e.hoverBackgroundColor, n, o.getHoverColor(a.backgroundColor)), a.borderColor = i.hoverBorderColor ? i.hoverBorderColor : o.valueAtIndexOrDefault(e.hoverBorderColor, n, o.getHoverColor(a.borderColor)), a.borderWidth = i.hoverBorderWidth ? i.hoverBorderWidth : o.valueAtIndexOrDefault(e.hoverBorderWidth, n, a.borderWidth)
                    }, removeHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t._index, i = t.custom || {},
                            a = t._model, r = this.chart.options.elements.rectangle;
                        a.backgroundColor = i.backgroundColor ? i.backgroundColor : o.valueAtIndexOrDefault(e.backgroundColor, n, r.backgroundColor), a.borderColor = i.borderColor ? i.borderColor : o.valueAtIndexOrDefault(e.borderColor, n, r.borderColor), a.borderWidth = i.borderWidth ? i.borderWidth : o.valueAtIndexOrDefault(e.borderWidth, n, r.borderWidth)
                    }
                }), t.controllers.horizontalBar = t.controllers.bar.extend({
                    getValueScaleId: function () {
                        return this.getMeta().xAxisID
                    }, getIndexScaleId: function () {
                        return this.getMeta().yAxisID
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 16: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("bubble", {
                hover: {mode: "single"},
                scales: {
                    xAxes: [{type: "linear", position: "bottom", id: "x-axis-0"}],
                    yAxes: [{type: "linear", position: "left", id: "y-axis-0"}]
                },
                tooltips: {
                    callbacks: {
                        title: function () {
                            return ""
                        }, label: function (t, e) {
                            var n = e.datasets[t.datasetIndex].label || "",
                                i = e.datasets[t.datasetIndex].data[t.index];
                            return n + ": (" + t.xLabel + ", " + t.yLabel + ", " + i.r + ")"
                        }
                    }
                }
            }), e.exports = function (t) {
                t.controllers.bubble = t.DatasetController.extend({
                    dataElementType: a.Point, update: function (t) {
                        var e = this, n = e.getMeta().data;
                        o.each(n, function (n, i) {
                            e.updateElement(n, i, t)
                        })
                    }, updateElement: function (t, e, n) {
                        var i = this, a = i.getMeta(), o = t.custom || {}, r = i.getScaleForId(a.xAxisID),
                            l = i.getScaleForId(a.yAxisID), s = i._resolveElementOptions(t, e),
                            u = i.getDataset().data[e], d = i.index,
                            c = n ? r.getPixelForDecimal(.5) : r.getPixelForValue("object" == typeof u ? u : NaN, e, d),
                            h = n ? l.getBasePixel() : l.getPixelForValue(u, e, d);
                        t._xScale = r, t._yScale = l, t._options = s, t._datasetIndex = d, t._index = e, t._model = {
                            backgroundColor: s.backgroundColor,
                            borderColor: s.borderColor,
                            borderWidth: s.borderWidth,
                            hitRadius: s.hitRadius,
                            pointStyle: s.pointStyle,
                            radius: n ? 0 : s.radius,
                            skip: o.skip || isNaN(c) || isNaN(h),
                            x: c,
                            y: h
                        }, t.pivot()
                    }, setHoverStyle: function (t) {
                        var e = t._model, n = t._options;
                        e.backgroundColor = o.valueOrDefault(n.hoverBackgroundColor, o.getHoverColor(n.backgroundColor)), e.borderColor = o.valueOrDefault(n.hoverBorderColor, o.getHoverColor(n.borderColor)), e.borderWidth = o.valueOrDefault(n.hoverBorderWidth, n.borderWidth), e.radius = n.radius + n.hoverRadius
                    }, removeHoverStyle: function (t) {
                        var e = t._model, n = t._options;
                        e.backgroundColor = n.backgroundColor, e.borderColor = n.borderColor, e.borderWidth = n.borderWidth, e.radius = n.radius
                    }, _resolveElementOptions: function (t, e) {
                        var n, i, a, r = this, l = r.chart, s = l.data.datasets[r.index], u = t.custom || {},
                            d = l.options.elements.point, c = o.options.resolve, h = s.data[e], f = {},
                            g = {chart: l, dataIndex: e, dataset: s, datasetIndex: r.index},
                            p = ["backgroundColor", "borderColor", "borderWidth", "hoverBackgroundColor", "hoverBorderColor", "hoverBorderWidth", "hoverRadius", "hitRadius", "pointStyle"];
                        for (n = 0, i = p.length; n < i; ++n) f[a = p[n]] = c([u[a], s[a], d[a]], g, e);
                        return f.radius = c([u.radius, h ? h.r : void 0, s.radius, d.radius], g, e), f
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 17: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("doughnut", {
                animation: {animateRotate: !0, animateScale: !1},
                hover: {mode: "single"},
                legendCallback: function (t) {
                    var e = [];
                    e.push('<ul class="' + t.id + '-legend">');
                    var n = t.data, i = n.datasets, a = n.labels;
                    if (i.length) for (var o = 0; o < i[0].data.length; ++o) e.push('<li><span style="background-color:' + i[0].backgroundColor[o] + '"></span>'), a[o] && e.push(a[o]), e.push("</li>");
                    return e.push("</ul>"), e.join("")
                },
                legend: {
                    labels: {
                        generateLabels: function (t) {
                            var e = t.data;
                            return e.labels.length && e.datasets.length ? e.labels.map(function (n, i) {
                                var a = t.getDatasetMeta(0), r = e.datasets[0], l = a.data[i], s = l && l.custom || {},
                                    u = o.valueAtIndexOrDefault, d = t.options.elements.arc;
                                return {
                                    text: n,
                                    fillStyle: s.backgroundColor ? s.backgroundColor : u(r.backgroundColor, i, d.backgroundColor),
                                    strokeStyle: s.borderColor ? s.borderColor : u(r.borderColor, i, d.borderColor),
                                    lineWidth: s.borderWidth ? s.borderWidth : u(r.borderWidth, i, d.borderWidth),
                                    hidden: isNaN(r.data[i]) || a.data[i].hidden,
                                    index: i
                                }
                            }) : []
                        }
                    }, onClick: function (t, e) {
                        var n, i, a, o = e.index, r = this.chart;
                        for (n = 0, i = (r.data.datasets || []).length; n < i; ++n) (a = r.getDatasetMeta(n)).data[o] && (a.data[o].hidden = !a.data[o].hidden);
                        r.update()
                    }
                },
                cutoutPercentage: 50,
                rotation: -.5 * Math.PI,
                circumference: 2 * Math.PI,
                tooltips: {
                    callbacks: {
                        title: function () {
                            return ""
                        }, label: function (t, e) {
                            var n = e.labels[t.index], i = ": " + e.datasets[t.datasetIndex].data[t.index];
                            return o.isArray(n) ? (n = n.slice())[0] += i : n += i, n
                        }
                    }
                }
            }), i._set("pie", o.clone(i.doughnut)), i._set("pie", {cutoutPercentage: 0}), e.exports = function (t) {
                t.controllers.doughnut = t.controllers.pie = t.DatasetController.extend({
                    dataElementType: a.Arc,
                    linkScales: o.noop,
                    getRingIndex: function (t) {
                        for (var e = 0, n = 0; n < t; ++n) this.chart.isDatasetVisible(n) && ++e;
                        return e
                    },
                    update: function (t) {
                        var e = this, n = e.chart, i = n.chartArea, a = n.options, r = a.elements.arc,
                            l = i.right - i.left - r.borderWidth, s = i.bottom - i.top - r.borderWidth,
                            u = Math.min(l, s), d = {x: 0, y: 0}, c = e.getMeta(), h = a.cutoutPercentage,
                            f = a.circumference;
                        if (f < 2 * Math.PI) {
                            var g = a.rotation % (2 * Math.PI),
                                p = (g += 2 * Math.PI * (g >= Math.PI ? -1 : g < -Math.PI ? 1 : 0)) + f,
                                v = {x: Math.cos(g), y: Math.sin(g)}, m = {x: Math.cos(p), y: Math.sin(p)},
                                b = g <= 0 && p >= 0 || g <= 2 * Math.PI && 2 * Math.PI <= p,
                                x = g <= .5 * Math.PI && .5 * Math.PI <= p || g <= 2.5 * Math.PI && 2.5 * Math.PI <= p,
                                y = g <= -Math.PI && -Math.PI <= p || g <= Math.PI && Math.PI <= p,
                                k = g <= .5 * -Math.PI && .5 * -Math.PI <= p || g <= 1.5 * Math.PI && 1.5 * Math.PI <= p,
                                w = h / 100, M = {
                                    x: y ? -1 : Math.min(v.x * (v.x < 0 ? 1 : w), m.x * (m.x < 0 ? 1 : w)),
                                    y: k ? -1 : Math.min(v.y * (v.y < 0 ? 1 : w), m.y * (m.y < 0 ? 1 : w))
                                }, S = {
                                    x: b ? 1 : Math.max(v.x * (v.x > 0 ? 1 : w), m.x * (m.x > 0 ? 1 : w)),
                                    y: x ? 1 : Math.max(v.y * (v.y > 0 ? 1 : w), m.y * (m.y > 0 ? 1 : w))
                                }, C = {width: .5 * (S.x - M.x), height: .5 * (S.y - M.y)};
                            u = Math.min(l / C.width, s / C.height), d = {x: -.5 * (S.x + M.x), y: -.5 * (S.y + M.y)}
                        }
                        n.borderWidth = e.getMaxBorderWidth(c.data), n.outerRadius = Math.max((u - n.borderWidth) / 2, 0), n.innerRadius = Math.max(h ? n.outerRadius / 100 * h : 0, 0), n.radiusLength = (n.outerRadius - n.innerRadius) / n.getVisibleDatasetCount(), n.offsetX = d.x * n.outerRadius, n.offsetY = d.y * n.outerRadius, c.total = e.calculateTotal(), e.outerRadius = n.outerRadius - n.radiusLength * e.getRingIndex(e.index), e.innerRadius = Math.max(e.outerRadius - n.radiusLength, 0), o.each(c.data, function (n, i) {
                            e.updateElement(n, i, t)
                        })
                    },
                    updateElement: function (t, e, n) {
                        var i = this, a = i.chart, r = a.chartArea, l = a.options, s = l.animation,
                            u = (r.left + r.right) / 2, d = (r.top + r.bottom) / 2, c = l.rotation, h = l.rotation,
                            f = i.getDataset(),
                            g = n && s.animateRotate ? 0 : t.hidden ? 0 : i.calculateCircumference(f.data[e]) * (l.circumference / (2 * Math.PI)),
                            p = n && s.animateScale ? 0 : i.innerRadius, v = n && s.animateScale ? 0 : i.outerRadius,
                            m = o.valueAtIndexOrDefault;
                        o.extend(t, {
                            _datasetIndex: i.index,
                            _index: e,
                            _model: {
                                x: u + a.offsetX,
                                y: d + a.offsetY,
                                startAngle: c,
                                endAngle: h,
                                circumference: g,
                                outerRadius: v,
                                innerRadius: p,
                                label: m(f.label, e, a.data.labels[e])
                            }
                        });
                        var b = t._model;
                        this.removeHoverStyle(t), n && s.animateRotate || (b.startAngle = 0 === e ? l.rotation : i.getMeta().data[e - 1]._model.endAngle, b.endAngle = b.startAngle + b.circumference), t.pivot()
                    },
                    removeHoverStyle: function (e) {
                        t.DatasetController.prototype.removeHoverStyle.call(this, e, this.chart.options.elements.arc)
                    },
                    calculateTotal: function () {
                        var t, e = this.getDataset(), n = this.getMeta(), i = 0;
                        return o.each(n.data, function (n, a) {
                            t = e.data[a], isNaN(t) || n.hidden || (i += Math.abs(t))
                        }), i
                    },
                    calculateCircumference: function (t) {
                        var e = this.getMeta().total;
                        return e > 0 && !isNaN(t) ? 2 * Math.PI * (t / e) : 0
                    },
                    getMaxBorderWidth: function (t) {
                        for (var e, n, i = 0, a = this.index, o = t.length, r = 0; r < o; r++) e = t[r]._model ? t[r]._model.borderWidth : 0, i = (n = t[r]._chart ? t[r]._chart.config.data.datasets[a].hoverBorderWidth : 0) > (i = e > i ? e : i) ? n : i;
                        return i
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 18: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("line", {
                showLines: !0,
                spanGaps: !1,
                hover: {mode: "label"},
                scales: {xAxes: [{type: "category", id: "x-axis-0"}], yAxes: [{type: "linear", id: "y-axis-0"}]}
            }), e.exports = function (t) {
                function e(t, e) {
                    return o.valueOrDefault(t.showLine, e.showLines)
                }

                t.controllers.line = t.DatasetController.extend({
                    datasetElementType: a.Line,
                    dataElementType: a.Point,
                    update: function (t) {
                        var n, i, a, r = this, l = r.getMeta(), s = l.dataset, u = l.data || [], d = r.chart.options,
                            c = d.elements.line, h = r.getScaleForId(l.yAxisID), f = r.getDataset(), g = e(f, d);
                        for (g && (a = s.custom || {}, void 0 !== f.tension && void 0 === f.lineTension && (f.lineTension = f.tension), s._scale = h, s._datasetIndex = r.index, s._children = u, s._model = {
                            spanGaps: f.spanGaps ? f.spanGaps : d.spanGaps,
                            tension: a.tension ? a.tension : o.valueOrDefault(f.lineTension, c.tension),
                            backgroundColor: a.backgroundColor ? a.backgroundColor : f.backgroundColor || c.backgroundColor,
                            borderWidth: a.borderWidth ? a.borderWidth : f.borderWidth || c.borderWidth,
                            borderColor: a.borderColor ? a.borderColor : f.borderColor || c.borderColor,
                            borderCapStyle: a.borderCapStyle ? a.borderCapStyle : f.borderCapStyle || c.borderCapStyle,
                            borderDash: a.borderDash ? a.borderDash : f.borderDash || c.borderDash,
                            borderDashOffset: a.borderDashOffset ? a.borderDashOffset : f.borderDashOffset || c.borderDashOffset,
                            borderJoinStyle: a.borderJoinStyle ? a.borderJoinStyle : f.borderJoinStyle || c.borderJoinStyle,
                            fill: a.fill ? a.fill : void 0 !== f.fill ? f.fill : c.fill,
                            steppedLine: a.steppedLine ? a.steppedLine : o.valueOrDefault(f.steppedLine, c.stepped),
                            cubicInterpolationMode: a.cubicInterpolationMode ? a.cubicInterpolationMode : o.valueOrDefault(f.cubicInterpolationMode, c.cubicInterpolationMode)
                        }, s.pivot()), n = 0, i = u.length; n < i; ++n) r.updateElement(u[n], n, t);
                        for (g && 0 !== s._model.tension && r.updateBezierControlPoints(), n = 0, i = u.length; n < i; ++n) u[n].pivot()
                    },
                    getPointBackgroundColor: function (t, e) {
                        var n = this.chart.options.elements.point.backgroundColor, i = this.getDataset(),
                            a = t.custom || {};
                        return a.backgroundColor ? n = a.backgroundColor : i.pointBackgroundColor ? n = o.valueAtIndexOrDefault(i.pointBackgroundColor, e, n) : i.backgroundColor && (n = i.backgroundColor), n
                    },
                    getPointBorderColor: function (t, e) {
                        var n = this.chart.options.elements.point.borderColor, i = this.getDataset(),
                            a = t.custom || {};
                        return a.borderColor ? n = a.borderColor : i.pointBorderColor ? n = o.valueAtIndexOrDefault(i.pointBorderColor, e, n) : i.borderColor && (n = i.borderColor), n
                    },
                    getPointBorderWidth: function (t, e) {
                        var n = this.chart.options.elements.point.borderWidth, i = this.getDataset(),
                            a = t.custom || {};
                        return isNaN(a.borderWidth) ? !isNaN(i.pointBorderWidth) || o.isArray(i.pointBorderWidth) ? n = o.valueAtIndexOrDefault(i.pointBorderWidth, e, n) : isNaN(i.borderWidth) || (n = i.borderWidth) : n = a.borderWidth, n
                    },
                    updateElement: function (t, e, n) {
                        var i, a, r = this, l = r.getMeta(), s = t.custom || {}, u = r.getDataset(), d = r.index,
                            c = u.data[e], h = r.getScaleForId(l.yAxisID), f = r.getScaleForId(l.xAxisID),
                            g = r.chart.options.elements.point;
                        void 0 !== u.radius && void 0 === u.pointRadius && (u.pointRadius = u.radius), void 0 !== u.hitRadius && void 0 === u.pointHitRadius && (u.pointHitRadius = u.hitRadius), i = f.getPixelForValue("object" == typeof c ? c : NaN, e, d), a = n ? h.getBasePixel() : r.calculatePointY(c, e, d), t._xScale = f, t._yScale = h, t._datasetIndex = d, t._index = e, t._model = {
                            x: i,
                            y: a,
                            skip: s.skip || isNaN(i) || isNaN(a),
                            radius: s.radius || o.valueAtIndexOrDefault(u.pointRadius, e, g.radius),
                            pointStyle: s.pointStyle || o.valueAtIndexOrDefault(u.pointStyle, e, g.pointStyle),
                            backgroundColor: r.getPointBackgroundColor(t, e),
                            borderColor: r.getPointBorderColor(t, e),
                            borderWidth: r.getPointBorderWidth(t, e),
                            tension: l.dataset._model ? l.dataset._model.tension : 0,
                            steppedLine: !!l.dataset._model && l.dataset._model.steppedLine,
                            hitRadius: s.hitRadius || o.valueAtIndexOrDefault(u.pointHitRadius, e, g.hitRadius)
                        }
                    },
                    calculatePointY: function (t, e, n) {
                        var i, a, o, r = this, l = r.chart, s = r.getMeta(), u = r.getScaleForId(s.yAxisID), d = 0,
                            c = 0;
                        if (u.options.stacked) {
                            for (i = 0; i < n; i++) if (a = l.data.datasets[i], "line" === (o = l.getDatasetMeta(i)).type && o.yAxisID === u.id && l.isDatasetVisible(i)) {
                                var h = Number(u.getRightValue(a.data[e]));
                                h < 0 ? c += h || 0 : d += h || 0
                            }
                            var f = Number(u.getRightValue(t));
                            return f < 0 ? u.getPixelForValue(c + f) : u.getPixelForValue(d + f)
                        }
                        return u.getPixelForValue(t)
                    },
                    updateBezierControlPoints: function () {
                        function t(t, e, n) {
                            return Math.max(Math.min(t, n), e)
                        }

                        var e, n, i, a, r = this, l = r.getMeta(), s = r.chart.chartArea, u = l.data || [];
                        if (l.dataset._model.spanGaps && (u = u.filter(function (t) {
                            return !t._model.skip
                        })), "monotone" === l.dataset._model.cubicInterpolationMode) o.splineCurveMonotone(u); else for (e = 0, n = u.length; e < n; ++e) i = u[e]._model, a = o.splineCurve(o.previousItem(u, e)._model, i, o.nextItem(u, e)._model, l.dataset._model.tension), i.controlPointPreviousX = a.previous.x, i.controlPointPreviousY = a.previous.y, i.controlPointNextX = a.next.x, i.controlPointNextY = a.next.y;
                        if (r.chart.options.elements.line.capBezierPoints) for (e = 0, n = u.length; e < n; ++e) (i = u[e]._model).controlPointPreviousX = t(i.controlPointPreviousX, s.left, s.right), i.controlPointPreviousY = t(i.controlPointPreviousY, s.top, s.bottom), i.controlPointNextX = t(i.controlPointNextX, s.left, s.right), i.controlPointNextY = t(i.controlPointNextY, s.top, s.bottom)
                    },
                    draw: function () {
                        var t = this, n = t.chart, i = t.getMeta(), a = i.data || [], r = n.chartArea, l = a.length,
                            s = 0;
                        for (o.canvas.clipArea(n.ctx, r), e(t.getDataset(), n.options) && i.dataset.draw(), o.canvas.unclipArea(n.ctx); s < l; ++s) a[s].draw(r)
                    },
                    setHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t._index, i = t.custom || {},
                            a = t._model;
                        a.radius = i.hoverRadius || o.valueAtIndexOrDefault(e.pointHoverRadius, n, this.chart.options.elements.point.hoverRadius), a.backgroundColor = i.hoverBackgroundColor || o.valueAtIndexOrDefault(e.pointHoverBackgroundColor, n, o.getHoverColor(a.backgroundColor)), a.borderColor = i.hoverBorderColor || o.valueAtIndexOrDefault(e.pointHoverBorderColor, n, o.getHoverColor(a.borderColor)), a.borderWidth = i.hoverBorderWidth || o.valueAtIndexOrDefault(e.pointHoverBorderWidth, n, a.borderWidth)
                    },
                    removeHoverStyle: function (t) {
                        var e = this, n = e.chart.data.datasets[t._datasetIndex], i = t._index, a = t.custom || {},
                            r = t._model;
                        void 0 !== n.radius && void 0 === n.pointRadius && (n.pointRadius = n.radius), r.radius = a.radius || o.valueAtIndexOrDefault(n.pointRadius, i, e.chart.options.elements.point.radius), r.backgroundColor = e.getPointBackgroundColor(t, i), r.borderColor = e.getPointBorderColor(t, i), r.borderWidth = e.getPointBorderWidth(t, i)
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 19: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("polarArea", {
                scale: {
                    type: "radialLinear",
                    angleLines: {display: !1},
                    gridLines: {circular: !0},
                    pointLabels: {display: !1},
                    ticks: {beginAtZero: !0}
                },
                animation: {animateRotate: !0, animateScale: !0},
                startAngle: -.5 * Math.PI,
                legendCallback: function (t) {
                    var e = [];
                    e.push('<ul class="' + t.id + '-legend">');
                    var n = t.data, i = n.datasets, a = n.labels;
                    if (i.length) for (var o = 0; o < i[0].data.length; ++o) e.push('<li><span style="background-color:' + i[0].backgroundColor[o] + '"></span>'), a[o] && e.push(a[o]), e.push("</li>");
                    return e.push("</ul>"), e.join("")
                },
                legend: {
                    labels: {
                        generateLabels: function (t) {
                            var e = t.data;
                            return e.labels.length && e.datasets.length ? e.labels.map(function (n, i) {
                                var a = t.getDatasetMeta(0), r = e.datasets[0], l = a.data[i].custom || {},
                                    s = o.valueAtIndexOrDefault, u = t.options.elements.arc;
                                return {
                                    text: n,
                                    fillStyle: l.backgroundColor ? l.backgroundColor : s(r.backgroundColor, i, u.backgroundColor),
                                    strokeStyle: l.borderColor ? l.borderColor : s(r.borderColor, i, u.borderColor),
                                    lineWidth: l.borderWidth ? l.borderWidth : s(r.borderWidth, i, u.borderWidth),
                                    hidden: isNaN(r.data[i]) || a.data[i].hidden,
                                    index: i
                                }
                            }) : []
                        }
                    }, onClick: function (t, e) {
                        var n, i, a, o = e.index, r = this.chart;
                        for (n = 0, i = (r.data.datasets || []).length; n < i; ++n) (a = r.getDatasetMeta(n)).data[o].hidden = !a.data[o].hidden;
                        r.update()
                    }
                },
                tooltips: {
                    callbacks: {
                        title: function () {
                            return ""
                        }, label: function (t, e) {
                            return e.labels[t.index] + ": " + t.yLabel
                        }
                    }
                }
            }), e.exports = function (t) {
                t.controllers.polarArea = t.DatasetController.extend({
                    dataElementType: a.Arc,
                    linkScales: o.noop,
                    update: function (t) {
                        var e = this, n = e.chart, i = n.chartArea, a = e.getMeta(), r = n.options, l = r.elements.arc,
                            s = Math.min(i.right - i.left, i.bottom - i.top);
                        n.outerRadius = Math.max((s - l.borderWidth / 2) / 2, 0), n.innerRadius = Math.max(r.cutoutPercentage ? n.outerRadius / 100 * r.cutoutPercentage : 1, 0), n.radiusLength = (n.outerRadius - n.innerRadius) / n.getVisibleDatasetCount(), e.outerRadius = n.outerRadius - n.radiusLength * e.index, e.innerRadius = e.outerRadius - n.radiusLength, a.count = e.countVisibleElements(), o.each(a.data, function (n, i) {
                            e.updateElement(n, i, t)
                        })
                    },
                    updateElement: function (t, e, n) {
                        for (var i = this, a = i.chart, r = i.getDataset(), l = a.options, s = l.animation, u = a.scale, d = a.data.labels, c = i.calculateCircumference(r.data[e]), h = u.xCenter, f = u.yCenter, g = 0, p = i.getMeta(), v = 0; v < e; ++v) isNaN(r.data[v]) || p.data[v].hidden || ++g;
                        var m = l.startAngle, b = t.hidden ? 0 : u.getDistanceFromCenterForValue(r.data[e]),
                            x = m + c * g, y = x + (t.hidden ? 0 : c),
                            k = s.animateScale ? 0 : u.getDistanceFromCenterForValue(r.data[e]);
                        o.extend(t, {
                            _datasetIndex: i.index,
                            _index: e,
                            _scale: u,
                            _model: {
                                x: h,
                                y: f,
                                innerRadius: 0,
                                outerRadius: n ? k : b,
                                startAngle: n && s.animateRotate ? m : x,
                                endAngle: n && s.animateRotate ? m : y,
                                label: o.valueAtIndexOrDefault(d, e, d[e])
                            }
                        }), i.removeHoverStyle(t), t.pivot()
                    },
                    removeHoverStyle: function (e) {
                        t.DatasetController.prototype.removeHoverStyle.call(this, e, this.chart.options.elements.arc)
                    },
                    countVisibleElements: function () {
                        var t = this.getDataset(), e = this.getMeta(), n = 0;
                        return o.each(e.data, function (e, i) {
                            isNaN(t.data[i]) || e.hidden || n++
                        }), n
                    },
                    calculateCircumference: function (t) {
                        var e = this.getMeta().count;
                        return e > 0 && !isNaN(t) ? 2 * Math.PI / e : 0
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 20: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("radar", {scale: {type: "radialLinear"}, elements: {line: {tension: 0}}}), e.exports = function (t) {
                t.controllers.radar = t.DatasetController.extend({
                    datasetElementType: a.Line,
                    dataElementType: a.Point,
                    linkScales: o.noop,
                    update: function (t) {
                        var e = this, n = e.getMeta(), i = n.dataset, a = n.data, r = i.custom || {},
                            l = e.getDataset(), s = e.chart.options.elements.line, u = e.chart.scale;
                        void 0 !== l.tension && void 0 === l.lineTension && (l.lineTension = l.tension), o.extend(n.dataset, {
                            _datasetIndex: e.index,
                            _scale: u,
                            _children: a,
                            _loop: !0,
                            _model: {
                                tension: r.tension ? r.tension : o.valueOrDefault(l.lineTension, s.tension),
                                backgroundColor: r.backgroundColor ? r.backgroundColor : l.backgroundColor || s.backgroundColor,
                                borderWidth: r.borderWidth ? r.borderWidth : l.borderWidth || s.borderWidth,
                                borderColor: r.borderColor ? r.borderColor : l.borderColor || s.borderColor,
                                fill: r.fill ? r.fill : void 0 !== l.fill ? l.fill : s.fill,
                                borderCapStyle: r.borderCapStyle ? r.borderCapStyle : l.borderCapStyle || s.borderCapStyle,
                                borderDash: r.borderDash ? r.borderDash : l.borderDash || s.borderDash,
                                borderDashOffset: r.borderDashOffset ? r.borderDashOffset : l.borderDashOffset || s.borderDashOffset,
                                borderJoinStyle: r.borderJoinStyle ? r.borderJoinStyle : l.borderJoinStyle || s.borderJoinStyle
                            }
                        }), n.dataset.pivot(), o.each(a, function (n, i) {
                            e.updateElement(n, i, t)
                        }, e), e.updateBezierControlPoints()
                    },
                    updateElement: function (t, e, n) {
                        var i = this, a = t.custom || {}, r = i.getDataset(), l = i.chart.scale,
                            s = i.chart.options.elements.point, u = l.getPointPositionForValue(e, r.data[e]);
                        void 0 !== r.radius && void 0 === r.pointRadius && (r.pointRadius = r.radius), void 0 !== r.hitRadius && void 0 === r.pointHitRadius && (r.pointHitRadius = r.hitRadius), o.extend(t, {
                            _datasetIndex: i.index,
                            _index: e,
                            _scale: l,
                            _model: {
                                x: n ? l.xCenter : u.x,
                                y: n ? l.yCenter : u.y,
                                tension: a.tension ? a.tension : o.valueOrDefault(r.lineTension, i.chart.options.elements.line.tension),
                                radius: a.radius ? a.radius : o.valueAtIndexOrDefault(r.pointRadius, e, s.radius),
                                backgroundColor: a.backgroundColor ? a.backgroundColor : o.valueAtIndexOrDefault(r.pointBackgroundColor, e, s.backgroundColor),
                                borderColor: a.borderColor ? a.borderColor : o.valueAtIndexOrDefault(r.pointBorderColor, e, s.borderColor),
                                borderWidth: a.borderWidth ? a.borderWidth : o.valueAtIndexOrDefault(r.pointBorderWidth, e, s.borderWidth),
                                pointStyle: a.pointStyle ? a.pointStyle : o.valueAtIndexOrDefault(r.pointStyle, e, s.pointStyle),
                                hitRadius: a.hitRadius ? a.hitRadius : o.valueAtIndexOrDefault(r.pointHitRadius, e, s.hitRadius)
                            }
                        }), t._model.skip = a.skip ? a.skip : isNaN(t._model.x) || isNaN(t._model.y)
                    },
                    updateBezierControlPoints: function () {
                        var t = this.chart.chartArea, e = this.getMeta();
                        o.each(e.data, function (n, i) {
                            var a = n._model,
                                r = o.splineCurve(o.previousItem(e.data, i, !0)._model, a, o.nextItem(e.data, i, !0)._model, a.tension);
                            a.controlPointPreviousX = Math.max(Math.min(r.previous.x, t.right), t.left), a.controlPointPreviousY = Math.max(Math.min(r.previous.y, t.bottom), t.top), a.controlPointNextX = Math.max(Math.min(r.next.x, t.right), t.left), a.controlPointNextY = Math.max(Math.min(r.next.y, t.bottom), t.top), n.pivot()
                        })
                    },
                    setHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t.custom || {}, i = t._index,
                            a = t._model;
                        a.radius = n.hoverRadius ? n.hoverRadius : o.valueAtIndexOrDefault(e.pointHoverRadius, i, this.chart.options.elements.point.hoverRadius), a.backgroundColor = n.hoverBackgroundColor ? n.hoverBackgroundColor : o.valueAtIndexOrDefault(e.pointHoverBackgroundColor, i, o.getHoverColor(a.backgroundColor)), a.borderColor = n.hoverBorderColor ? n.hoverBorderColor : o.valueAtIndexOrDefault(e.pointHoverBorderColor, i, o.getHoverColor(a.borderColor)), a.borderWidth = n.hoverBorderWidth ? n.hoverBorderWidth : o.valueAtIndexOrDefault(e.pointHoverBorderWidth, i, a.borderWidth)
                    },
                    removeHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t.custom || {}, i = t._index,
                            a = t._model, r = this.chart.options.elements.point;
                        a.radius = n.radius ? n.radius : o.valueAtIndexOrDefault(e.pointRadius, i, r.radius), a.backgroundColor = n.backgroundColor ? n.backgroundColor : o.valueAtIndexOrDefault(e.pointBackgroundColor, i, r.backgroundColor), a.borderColor = n.borderColor ? n.borderColor : o.valueAtIndexOrDefault(e.pointBorderColor, i, r.borderColor), a.borderWidth = n.borderWidth ? n.borderWidth : o.valueAtIndexOrDefault(e.pointBorderWidth, i, r.borderWidth)
                    }
                })
            }
        }, {25: 25, 40: 40, 45: 45}], 21: [function (t, e, n) {
            "use strict";
            t(25)._set("scatter", {
                hover: {mode: "single"},
                scales: {
                    xAxes: [{id: "x-axis-1", type: "linear", position: "bottom"}],
                    yAxes: [{id: "y-axis-1", type: "linear", position: "left"}]
                },
                showLines: !1,
                tooltips: {
                    callbacks: {
                        title: function () {
                            return ""
                        }, label: function (t) {
                            return "(" + t.xLabel + ", " + t.yLabel + ")"
                        }
                    }
                }
            }), e.exports = function (t) {
                t.controllers.scatter = t.controllers.line
            }
        }, {25: 25}], 22: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {
                animation: {
                    duration: 1e3,
                    easing: "easeOutQuart",
                    onProgress: o.noop,
                    onComplete: o.noop
                }
            }), e.exports = function (t) {
                t.Animation = a.extend({
                    chart: null,
                    currentStep: 0,
                    numSteps: 60,
                    easing: "",
                    render: null,
                    onAnimationProgress: null,
                    onAnimationComplete: null
                }), t.animationService = {
                    frameDuration: 17,
                    animations: [],
                    dropFrames: 0,
                    request: null,
                    addAnimation: function (t, e, n, i) {
                        var a, o, r = this.animations;
                        for (e.chart = t, i || (t.animating = !0), a = 0, o = r.length; a < o; ++a) if (r[a].chart === t) return void(r[a] = e);
                        r.push(e), 1 === r.length && this.requestAnimationFrame()
                    },
                    cancelAnimation: function (t) {
                        var e = o.findIndex(this.animations, function (e) {
                            return e.chart === t
                        });
                        -1 !== e && (this.animations.splice(e, 1), t.animating = !1)
                    },
                    requestAnimationFrame: function () {
                        var t = this;
                        null === t.request && (t.request = o.requestAnimFrame.call(window, function () {
                            t.request = null, t.startDigest()
                        }))
                    },
                    startDigest: function () {
                        var t = this, e = Date.now(), n = 0;
                        t.dropFrames > 1 && (n = Math.floor(t.dropFrames), t.dropFrames = t.dropFrames % 1), t.advance(1 + n);
                        var i = Date.now();
                        t.dropFrames += (i - e) / t.frameDuration, t.animations.length > 0 && t.requestAnimationFrame()
                    },
                    advance: function (t) {
                        for (var e, n, i = this.animations, a = 0; a < i.length;) n = (e = i[a]).chart, e.currentStep = (e.currentStep || 0) + t, e.currentStep = Math.min(e.currentStep, e.numSteps), o.callback(e.render, [n, e], n), o.callback(e.onAnimationProgress, [e], n), e.currentStep >= e.numSteps ? (o.callback(e.onAnimationComplete, [e], n), n.animating = !1, i.splice(a, 1)) : ++a
                    }
                }, Object.defineProperty(t.Animation.prototype, "animationObject", {
                    get: function () {
                        return this
                    }
                }), Object.defineProperty(t.Animation.prototype, "chartInstance", {
                    get: function () {
                        return this.chart
                    }, set: function (t) {
                        this.chart = t
                    }
                })
            }
        }, {25: 25, 26: 26, 45: 45}], 23: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(45), o = t(28), r = t(48);
            e.exports = function (t) {
                function e(t) {
                    var e = (t = t || {}).data = t.data || {};
                    return e.datasets = e.datasets || [], e.labels = e.labels || [], t.options = a.configMerge(i.global, i[t.type], t.options || {}), t
                }

                function n(t) {
                    var e = t.options;
                    e.scale ? t.scale.options = e.scale : e.scales && e.scales.xAxes.concat(e.scales.yAxes).forEach(function (e) {
                        t.scales[e.id].options = e
                    }), t.tooltip._options = e.tooltips
                }

                function l(t) {
                    return "top" === t || "bottom" === t
                }

                var s = t.plugins;
                t.types = {}, t.instances = {}, t.controllers = {}, a.extend(t.prototype, {
                    construct: function (n, i) {
                        var o = this;
                        i = e(i);
                        var l = r.acquireContext(n, i), s = l && l.canvas, u = s && s.height, d = s && s.width;
                        o.id = a.uid(), o.ctx = l, o.canvas = s, o.config = i, o.width = d, o.height = u, o.aspectRatio = u ? d / u : null, o.options = i.options, o._bufferedRender = !1, o.chart = o, o.controller = o, t.instances[o.id] = o, Object.defineProperty(o, "data", {
                            get: function () {
                                return o.config.data
                            }, set: function (t) {
                                o.config.data = t
                            }
                        }), l && s ? (o.initialize(), o.update()) : console.error("Failed to create chart: can't acquire context from the given item")
                    }, initialize: function () {
                        var t = this;
                        return s.notify(t, "beforeInit"), a.retinaScale(t, t.options.devicePixelRatio), t.bindEvents(), t.options.responsive && t.resize(!0), t.ensureScalesHaveIDs(), t.buildScales(), t.initToolTip(), s.notify(t, "afterInit"), t
                    }, clear: function () {
                        return a.canvas.clear(this), this
                    }, stop: function () {
                        return t.animationService.cancelAnimation(this), this
                    }, resize: function (t) {
                        var e = this, n = e.options, i = e.canvas, o = n.maintainAspectRatio && e.aspectRatio || null,
                            r = Math.max(0, Math.floor(a.getMaximumWidth(i))),
                            l = Math.max(0, Math.floor(o ? r / o : a.getMaximumHeight(i)));
                        if ((e.width !== r || e.height !== l) && (i.width = e.width = r, i.height = e.height = l, i.style.width = r + "px", i.style.height = l + "px", a.retinaScale(e, n.devicePixelRatio), !t)) {
                            var u = {width: r, height: l};
                            s.notify(e, "resize", [u]), e.options.onResize && e.options.onResize(e, u), e.stop(), e.update(e.options.responsiveAnimationDuration)
                        }
                    }, ensureScalesHaveIDs: function () {
                        var t = this.options, e = t.scales || {}, n = t.scale;
                        a.each(e.xAxes, function (t, e) {
                            t.id = t.id || "x-axis-" + e
                        }), a.each(e.yAxes, function (t, e) {
                            t.id = t.id || "y-axis-" + e
                        }), n && (n.id = n.id || "scale")
                    }, buildScales: function () {
                        var e = this, n = e.options, i = e.scales = {}, o = [];
                        n.scales && (o = o.concat((n.scales.xAxes || []).map(function (t) {
                            return {options: t, dtype: "category", dposition: "bottom"}
                        }), (n.scales.yAxes || []).map(function (t) {
                            return {options: t, dtype: "linear", dposition: "left"}
                        }))), n.scale && o.push({
                            options: n.scale,
                            dtype: "radialLinear",
                            isDefault: !0,
                            dposition: "chartArea"
                        }), a.each(o, function (n) {
                            var o = n.options, r = a.valueOrDefault(o.type, n.dtype),
                                s = t.scaleService.getScaleConstructor(r);
                            if (s) {
                                l(o.position) !== l(n.dposition) && (o.position = n.dposition);
                                var u = new s({id: o.id, options: o, ctx: e.ctx, chart: e});
                                i[u.id] = u, u.mergeTicksOptions(), n.isDefault && (e.scale = u)
                            }
                        }), t.scaleService.addScalesToLayout(this)
                    }, buildOrUpdateControllers: function () {
                        var e = this, n = [], i = [];
                        return a.each(e.data.datasets, function (a, o) {
                            var r = e.getDatasetMeta(o), l = a.type || e.config.type;
                            if (r.type && r.type !== l && (e.destroyDatasetMeta(o), r = e.getDatasetMeta(o)), r.type = l, n.push(r.type), r.controller) r.controller.updateIndex(o); else {
                                var s = t.controllers[r.type];
                                if (void 0 === s) throw new Error('"' + r.type + '" is not a chart type.');
                                r.controller = new s(e, o), i.push(r.controller)
                            }
                        }, e), i
                    }, resetElements: function () {
                        var t = this;
                        a.each(t.data.datasets, function (e, n) {
                            t.getDatasetMeta(n).controller.reset()
                        }, t)
                    }, reset: function () {
                        this.resetElements(), this.tooltip.initialize()
                    }, update: function (t) {
                        var e = this;
                        if (t && "object" == typeof t || (t = {
                            duration: t,
                            lazy: arguments[1]
                        }), n(e), !1 !== s.notify(e, "beforeUpdate")) {
                            e.tooltip._data = e.data;
                            var i = e.buildOrUpdateControllers();
                            a.each(e.data.datasets, function (t, n) {
                                e.getDatasetMeta(n).controller.buildOrUpdateElements()
                            }, e), e.updateLayout(), a.each(i, function (t) {
                                t.reset()
                            }), e.updateDatasets(), s.notify(e, "afterUpdate"), e._bufferedRender ? e._bufferedRequest = {
                                duration: t.duration,
                                easing: t.easing,
                                lazy: t.lazy
                            } : e.render(t)
                        }
                    }, updateLayout: function () {
                        var e = this;
                        !1 !== s.notify(e, "beforeLayout") && (t.layoutService.update(this, this.width, this.height), s.notify(e, "afterScaleUpdate"), s.notify(e, "afterLayout"))
                    }, updateDatasets: function () {
                        var t = this;
                        if (!1 !== s.notify(t, "beforeDatasetsUpdate")) {
                            for (var e = 0, n = t.data.datasets.length; e < n; ++e) t.updateDataset(e);
                            s.notify(t, "afterDatasetsUpdate")
                        }
                    }, updateDataset: function (t) {
                        var e = this, n = e.getDatasetMeta(t), i = {meta: n, index: t};
                        !1 !== s.notify(e, "beforeDatasetUpdate", [i]) && (n.controller.update(), s.notify(e, "afterDatasetUpdate", [i]))
                    }, render: function (e) {
                        var n = this;
                        e && "object" == typeof e || (e = {duration: e, lazy: arguments[1]});
                        var i = e.duration, o = e.lazy;
                        if (!1 !== s.notify(n, "beforeRender")) {
                            var r = n.options.animation, l = function (t) {
                                s.notify(n, "afterRender"), a.callback(r && r.onComplete, [t], n)
                            };
                            if (r && (void 0 !== i && 0 !== i || void 0 === i && 0 !== r.duration)) {
                                var u = new t.Animation({
                                    numSteps: (i || r.duration) / 16.66,
                                    easing: e.easing || r.easing,
                                    render: function (t, e) {
                                        var n = a.easing.effects[e.easing], i = e.currentStep, o = i / e.numSteps;
                                        t.draw(n(o), o, i)
                                    },
                                    onAnimationProgress: r.onProgress,
                                    onAnimationComplete: l
                                });
                                t.animationService.addAnimation(n, u, i, o)
                            } else n.draw(), l(new t.Animation({numSteps: 0, chart: n}));
                            return n
                        }
                    }, draw: function (t) {
                        var e = this;
                        e.clear(), a.isNullOrUndef(t) && (t = 1), e.transition(t), !1 !== s.notify(e, "beforeDraw", [t]) && (a.each(e.boxes, function (t) {
                            t.draw(e.chartArea)
                        }, e), e.scale && e.scale.draw(), e.drawDatasets(t), e.tooltip.draw(), s.notify(e, "afterDraw", [t]))
                    }, transition: function (t) {
                        for (var e = this, n = 0, i = (e.data.datasets || []).length; n < i; ++n) e.isDatasetVisible(n) && e.getDatasetMeta(n).controller.transition(t);
                        e.tooltip.transition(t)
                    }, drawDatasets: function (t) {
                        var e = this;
                        if (!1 !== s.notify(e, "beforeDatasetsDraw", [t])) {
                            for (var n = (e.data.datasets || []).length - 1; n >= 0; --n) e.isDatasetVisible(n) && e.drawDataset(n, t);
                            s.notify(e, "afterDatasetsDraw", [t])
                        }
                    }, drawDataset: function (t, e) {
                        var n = this, i = n.getDatasetMeta(t), a = {meta: i, index: t, easingValue: e};
                        !1 !== s.notify(n, "beforeDatasetDraw", [a]) && (i.controller.draw(e), s.notify(n, "afterDatasetDraw", [a]))
                    }, getElementAtEvent: function (t) {
                        return o.modes.single(this, t)
                    }, getElementsAtEvent: function (t) {
                        return o.modes.label(this, t, {intersect: !0})
                    }, getElementsAtXAxis: function (t) {
                        return o.modes["x-axis"](this, t, {intersect: !0})
                    }, getElementsAtEventForMode: function (t, e, n) {
                        var i = o.modes[e];
                        return "function" == typeof i ? i(this, t, n) : []
                    }, getDatasetAtEvent: function (t) {
                        return o.modes.dataset(this, t, {intersect: !0})
                    }, getDatasetMeta: function (t) {
                        var e = this, n = e.data.datasets[t];
                        n._meta || (n._meta = {});
                        var i = n._meta[e.id];
                        return i || (i = n._meta[e.id] = {
                            type: null,
                            data: [],
                            dataset: null,
                            controller: null,
                            hidden: null,
                            xAxisID: null,
                            yAxisID: null
                        }), i
                    }, getVisibleDatasetCount: function () {
                        for (var t = 0, e = 0, n = this.data.datasets.length; e < n; ++e) this.isDatasetVisible(e) && t++;
                        return t
                    }, isDatasetVisible: function (t) {
                        var e = this.getDatasetMeta(t);
                        return "boolean" == typeof e.hidden ? !e.hidden : !this.data.datasets[t].hidden
                    }, generateLegend: function () {
                        return this.options.legendCallback(this)
                    }, destroyDatasetMeta: function (t) {
                        var e = this.id, n = this.data.datasets[t], i = n._meta && n._meta[e];
                        i && (i.controller.destroy(), delete n._meta[e])
                    }, destroy: function () {
                        var e, n, i = this, o = i.canvas;
                        for (i.stop(), e = 0, n = i.data.datasets.length; e < n; ++e) i.destroyDatasetMeta(e);
                        o && (i.unbindEvents(), a.canvas.clear(i), r.releaseContext(i.ctx), i.canvas = null, i.ctx = null), s.notify(i, "destroy"), delete t.instances[i.id]
                    }, toBase64Image: function () {
                        return this.canvas.toDataURL.apply(this.canvas, arguments)
                    }, initToolTip: function () {
                        var e = this;
                        e.tooltip = new t.Tooltip({
                            _chart: e,
                            _chartInstance: e,
                            _data: e.data,
                            _options: e.options.tooltips
                        }, e)
                    }, bindEvents: function () {
                        var t = this, e = t._listeners = {}, n = function () {
                            t.eventHandler.apply(t, arguments)
                        };
                        a.each(t.options.events, function (i) {
                            r.addEventListener(t, i, n), e[i] = n
                        }), t.options.responsive && (n = function () {
                            t.resize()
                        }, r.addEventListener(t, "resize", n), e.resize = n)
                    }, unbindEvents: function () {
                        var t = this, e = t._listeners;
                        e && (delete t._listeners, a.each(e, function (e, n) {
                            r.removeEventListener(t, n, e)
                        }))
                    }, updateHoverStyle: function (t, e, n) {
                        var i, a, o, r = n ? "setHoverStyle" : "removeHoverStyle";
                        for (a = 0, o = t.length; a < o; ++a) (i = t[a]) && this.getDatasetMeta(i._datasetIndex).controller[r](i)
                    }, eventHandler: function (t) {
                        var e = this, n = e.tooltip;
                        if (!1 !== s.notify(e, "beforeEvent", [t])) {
                            e._bufferedRender = !0, e._bufferedRequest = null;
                            var i = e.handleEvent(t);
                            i |= n && n.handleEvent(t), s.notify(e, "afterEvent", [t]);
                            var a = e._bufferedRequest;
                            return a ? e.render(a) : i && !e.animating && (e.stop(), e.render(e.options.hover.animationDuration, !0)), e._bufferedRender = !1, e._bufferedRequest = null, e
                        }
                    }, handleEvent: function (t) {
                        var e = this, n = e.options || {}, i = n.hover, o = !1;
                        return e.lastActive = e.lastActive || [], "mouseout" === t.type ? e.active = [] : e.active = e.getElementsAtEventForMode(t, i.mode, i), a.callback(n.onHover || n.hover.onHover, [t.native, e.active], e), "mouseup" !== t.type && "click" !== t.type || n.onClick && n.onClick.call(e, t.native, e.active), e.lastActive.length && e.updateHoverStyle(e.lastActive, i.mode, !1), e.active.length && i.mode && e.updateHoverStyle(e.active, i.mode, !0), o = !a.arrayEquals(e.active, e.lastActive), e.lastActive = e.active, o
                    }
                }), t.Controller = t
            }
        }, {25: 25, 28: 28, 45: 45, 48: 48}], 24: [function (t, e, n) {
            "use strict";
            var i = t(45);
            e.exports = function (t) {
                function e(t, e) {
                    t._chartjs ? t._chartjs.listeners.push(e) : (Object.defineProperty(t, "_chartjs", {
                        configurable: !0,
                        enumerable: !1,
                        value: {listeners: [e]}
                    }), a.forEach(function (e) {
                        var n = "onData" + e.charAt(0).toUpperCase() + e.slice(1), a = t[e];
                        Object.defineProperty(t, e, {
                            configurable: !0, enumerable: !1, value: function () {
                                var e = Array.prototype.slice.call(arguments), o = a.apply(this, e);
                                return i.each(t._chartjs.listeners, function (t) {
                                    "function" == typeof t[n] && t[n].apply(t, e)
                                }), o
                            }
                        })
                    }))
                }

                function n(t, e) {
                    var n = t._chartjs;
                    if (n) {
                        var i = n.listeners, o = i.indexOf(e);
                        -1 !== o && i.splice(o, 1), i.length > 0 || (a.forEach(function (e) {
                            delete t[e]
                        }), delete t._chartjs)
                    }
                }

                var a = ["push", "pop", "shift", "splice", "unshift"];
                t.DatasetController = function (t, e) {
                    this.initialize(t, e)
                }, i.extend(t.DatasetController.prototype, {
                    datasetElementType: null,
                    dataElementType: null,
                    initialize: function (t, e) {
                        var n = this;
                        n.chart = t, n.index = e, n.linkScales(), n.addElements()
                    },
                    updateIndex: function (t) {
                        this.index = t
                    },
                    linkScales: function () {
                        var t = this, e = t.getMeta(), n = t.getDataset();
                        null === e.xAxisID && (e.xAxisID = n.xAxisID || t.chart.options.scales.xAxes[0].id), null === e.yAxisID && (e.yAxisID = n.yAxisID || t.chart.options.scales.yAxes[0].id)
                    },
                    getDataset: function () {
                        return this.chart.data.datasets[this.index]
                    },
                    getMeta: function () {
                        return this.chart.getDatasetMeta(this.index)
                    },
                    getScaleForId: function (t) {
                        return this.chart.scales[t]
                    },
                    reset: function () {
                        this.update(!0)
                    },
                    destroy: function () {
                        this._data && n(this._data, this)
                    },
                    createMetaDataset: function () {
                        var t = this, e = t.datasetElementType;
                        return e && new e({_chart: t.chart, _datasetIndex: t.index})
                    },
                    createMetaData: function (t) {
                        var e = this, n = e.dataElementType;
                        return n && new n({_chart: e.chart, _datasetIndex: e.index, _index: t})
                    },
                    addElements: function () {
                        var t, e, n = this, i = n.getMeta(), a = n.getDataset().data || [], o = i.data;
                        for (t = 0, e = a.length; t < e; ++t) o[t] = o[t] || n.createMetaData(t);
                        i.dataset = i.dataset || n.createMetaDataset()
                    },
                    addElementAndReset: function (t) {
                        var e = this.createMetaData(t);
                        this.getMeta().data.splice(t, 0, e), this.updateElement(e, t, !0)
                    },
                    buildOrUpdateElements: function () {
                        var t = this, i = t.getDataset(), a = i.data || (i.data = []);
                        t._data !== a && (t._data && n(t._data, t), e(a, t), t._data = a), t.resyncElements()
                    },
                    update: i.noop,
                    transition: function (t) {
                        for (var e = this.getMeta(), n = e.data || [], i = n.length, a = 0; a < i; ++a) n[a].transition(t);
                        e.dataset && e.dataset.transition(t)
                    },
                    draw: function () {
                        var t = this.getMeta(), e = t.data || [], n = e.length, i = 0;
                        for (t.dataset && t.dataset.draw(); i < n; ++i) e[i].draw()
                    },
                    removeHoverStyle: function (t, e) {
                        var n = this.chart.data.datasets[t._datasetIndex], a = t._index, o = t.custom || {},
                            r = i.valueAtIndexOrDefault, l = t._model;
                        l.backgroundColor = o.backgroundColor ? o.backgroundColor : r(n.backgroundColor, a, e.backgroundColor), l.borderColor = o.borderColor ? o.borderColor : r(n.borderColor, a, e.borderColor), l.borderWidth = o.borderWidth ? o.borderWidth : r(n.borderWidth, a, e.borderWidth)
                    },
                    setHoverStyle: function (t) {
                        var e = this.chart.data.datasets[t._datasetIndex], n = t._index, a = t.custom || {},
                            o = i.valueAtIndexOrDefault, r = i.getHoverColor, l = t._model;
                        l.backgroundColor = a.hoverBackgroundColor ? a.hoverBackgroundColor : o(e.hoverBackgroundColor, n, r(l.backgroundColor)), l.borderColor = a.hoverBorderColor ? a.hoverBorderColor : o(e.hoverBorderColor, n, r(l.borderColor)), l.borderWidth = a.hoverBorderWidth ? a.hoverBorderWidth : o(e.hoverBorderWidth, n, l.borderWidth)
                    },
                    resyncElements: function () {
                        var t = this, e = t.getMeta(), n = t.getDataset().data, i = e.data.length, a = n.length;
                        a < i ? e.data.splice(a, i - a) : a > i && t.insertElements(i, a - i)
                    },
                    insertElements: function (t, e) {
                        for (var n = 0; n < e; ++n) this.addElementAndReset(t + n)
                    },
                    onDataPush: function () {
                        this.insertElements(this.getDataset().data.length - 1, arguments.length)
                    },
                    onDataPop: function () {
                        this.getMeta().data.pop()
                    },
                    onDataShift: function () {
                        this.getMeta().data.shift()
                    },
                    onDataSplice: function (t, e) {
                        this.getMeta().data.splice(t, e), this.insertElements(t, arguments.length - 2)
                    },
                    onDataUnshift: function () {
                        this.insertElements(0, arguments.length)
                    }
                }), t.DatasetController.extend = i.inherits
            }
        }, {45: 45}], 25: [function (t, e, n) {
            "use strict";
            var i = t(45);
            e.exports = {
                _set: function (t, e) {
                    return i.merge(this[t] || (this[t] = {}), e)
                }
            }
        }, {45: 45}], 26: [function (t, e, n) {
            "use strict";

            function i(t, e, n, i) {
                var o, r, l, s, u, d, c, h, f, g = Object.keys(n);
                for (o = 0, r = g.length; o < r; ++o) if (l = g[o], d = n[l], e.hasOwnProperty(l) || (e[l] = d), (s = e[l]) !== d && "_" !== l[0]) {
                    if (t.hasOwnProperty(l) || (t[l] = s), u = t[l], (c = typeof d) === typeof u) if ("string" === c) {
                        if ((h = a(u)).valid && (f = a(d)).valid) {
                            e[l] = f.mix(h, i).rgbString();
                            continue
                        }
                    } else if ("number" === c && isFinite(u) && isFinite(d)) {
                        e[l] = u + (d - u) * i;
                        continue
                    }
                    e[l] = d
                }
            }

            var a = t(3), o = t(45), r = function (t) {
                o.extend(this, t), this.initialize.apply(this, arguments)
            };
            o.extend(r.prototype, {
                initialize: function () {
                    this.hidden = !1
                }, pivot: function () {
                    var t = this;
                    return t._view || (t._view = o.clone(t._model)), t._start = {}, t
                }, transition: function (t) {
                    var e = this, n = e._model, a = e._start, o = e._view;
                    return n && 1 !== t ? (o || (o = e._view = {}), a || (a = e._start = {}), i(a, o, n, t), e) : (e._view = n, e._start = null, e)
                }, tooltipPosition: function () {
                    return {x: this._model.x, y: this._model.y}
                }, hasValue: function () {
                    return o.isNumber(this._model.x) && o.isNumber(this._model.y)
                }
            }), r.extend = o.inherits, e.exports = r
        }, {3: 3, 45: 45}], 27: [function (t, e, n) {
            "use strict";
            var i = t(3), a = t(25), o = t(45);
            e.exports = function (t) {
                function e(t, e, n) {
                    var i;
                    return "string" == typeof t ? (i = parseInt(t, 10), -1 !== t.indexOf("%") && (i = i / 100 * e.parentNode[n])) : i = t, i
                }

                function n(t) {
                    return void 0 !== t && null !== t && "none" !== t
                }

                function r(t, i, a) {
                    var o = document.defaultView, r = t.parentNode, l = o.getComputedStyle(t)[i],
                        s = o.getComputedStyle(r)[i], u = n(l), d = n(s), c = Number.POSITIVE_INFINITY;
                    return u || d ? Math.min(u ? e(l, t, a) : c, d ? e(s, r, a) : c) : "none"
                }

                o.extend = function (t) {
                    for (var e = 1, n = arguments.length; e < n; e++) o.each(arguments[e], function (e, n) {
                        t[n] = e
                    });
                    return t
                }, o.configMerge = function () {
                    return o.merge(o.clone(arguments[0]), [].slice.call(arguments, 1), {
                        merger: function (e, n, i, a) {
                            var r = n[e] || {}, l = i[e];
                            "scales" === e ? n[e] = o.scaleMerge(r, l) : "scale" === e ? n[e] = o.merge(r, [t.scaleService.getScaleDefaults(l.type), l]) : o._merger(e, n, i, a)
                        }
                    })
                }, o.scaleMerge = function () {
                    return o.merge(o.clone(arguments[0]), [].slice.call(arguments, 1), {
                        merger: function (e, n, i, a) {
                            if ("xAxes" === e || "yAxes" === e) {
                                var r, l, s, u = i[e].length;
                                for (n[e] || (n[e] = []), r = 0; r < u; ++r) s = i[e][r], l = o.valueOrDefault(s.type, "xAxes" === e ? "category" : "linear"), r >= n[e].length && n[e].push({}), !n[e][r].type || s.type && s.type !== n[e][r].type ? o.merge(n[e][r], [t.scaleService.getScaleDefaults(l), s]) : o.merge(n[e][r], s)
                            } else o._merger(e, n, i, a)
                        }
                    })
                }, o.where = function (t, e) {
                    if (o.isArray(t) && Array.prototype.filter) return t.filter(e);
                    var n = [];
                    return o.each(t, function (t) {
                        e(t) && n.push(t)
                    }), n
                }, o.findIndex = Array.prototype.findIndex ? function (t, e, n) {
                    return t.findIndex(e, n)
                } : function (t, e, n) {
                    n = void 0 === n ? t : n;
                    for (var i = 0, a = t.length; i < a; ++i) if (e.call(n, t[i], i, t)) return i;
                    return -1
                }, o.findNextWhere = function (t, e, n) {
                    o.isNullOrUndef(n) && (n = -1);
                    for (var i = n + 1; i < t.length; i++) {
                        var a = t[i];
                        if (e(a)) return a
                    }
                }, o.findPreviousWhere = function (t, e, n) {
                    o.isNullOrUndef(n) && (n = t.length);
                    for (var i = n - 1; i >= 0; i--) {
                        var a = t[i];
                        if (e(a)) return a
                    }
                }, o.inherits = function (t) {
                    var e = this, n = t && t.hasOwnProperty("constructor") ? t.constructor : function () {
                        return e.apply(this, arguments)
                    }, i = function () {
                        this.constructor = n
                    };
                    return i.prototype = e.prototype, n.prototype = new i, n.extend = o.inherits, t && o.extend(n.prototype, t), n.__super__ = e.prototype, n
                }, o.isNumber = function (t) {
                    return !isNaN(parseFloat(t)) && isFinite(t)
                }, o.almostEquals = function (t, e, n) {
                    return Math.abs(t - e) < n
                }, o.almostWhole = function (t, e) {
                    var n = Math.round(t);
                    return n - e < t && n + e > t
                }, o.max = function (t) {
                    return t.reduce(function (t, e) {
                        return isNaN(e) ? t : Math.max(t, e)
                    }, Number.NEGATIVE_INFINITY)
                }, o.min = function (t) {
                    return t.reduce(function (t, e) {
                        return isNaN(e) ? t : Math.min(t, e)
                    }, Number.POSITIVE_INFINITY)
                }, o.sign = Math.sign ? function (t) {
                    return Math.sign(t)
                } : function (t) {
                    return 0 == (t = +t) || isNaN(t) ? t : t > 0 ? 1 : -1
                }, o.log10 = Math.log10 ? function (t) {
                    return Math.log10(t)
                } : function (t) {
                    return Math.log(t) / Math.LN10
                }, o.toRadians = function (t) {
                    return t * (Math.PI / 180)
                }, o.toDegrees = function (t) {
                    return t * (180 / Math.PI)
                }, o.getAngleFromPoint = function (t, e) {
                    var n = e.x - t.x, i = e.y - t.y, a = Math.sqrt(n * n + i * i), o = Math.atan2(i, n);
                    return o < -.5 * Math.PI && (o += 2 * Math.PI), {angle: o, distance: a}
                }, o.distanceBetweenPoints = function (t, e) {
                    return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
                }, o.aliasPixel = function (t) {
                    return t % 2 == 0 ? 0 : .5
                }, o.splineCurve = function (t, e, n, i) {
                    var a = t.skip ? e : t, o = e, r = n.skip ? e : n,
                        l = Math.sqrt(Math.pow(o.x - a.x, 2) + Math.pow(o.y - a.y, 2)),
                        s = Math.sqrt(Math.pow(r.x - o.x, 2) + Math.pow(r.y - o.y, 2)), u = l / (l + s),
                        d = s / (l + s), c = i * (u = isNaN(u) ? 0 : u), h = i * (d = isNaN(d) ? 0 : d);
                    return {
                        previous: {x: o.x - c * (r.x - a.x), y: o.y - c * (r.y - a.y)},
                        next: {x: o.x + h * (r.x - a.x), y: o.y + h * (r.y - a.y)}
                    }
                }, o.EPSILON = Number.EPSILON || 1e-14, o.splineCurveMonotone = function (t) {
                    var e, n, i, a, r = (t || []).map(function (t) {
                        return {model: t._model, deltaK: 0, mK: 0}
                    }), l = r.length;
                    for (e = 0; e < l; ++e) if (!(i = r[e]).model.skip) {
                        if (n = e > 0 ? r[e - 1] : null, (a = e < l - 1 ? r[e + 1] : null) && !a.model.skip) {
                            var s = a.model.x - i.model.x;
                            i.deltaK = 0 !== s ? (a.model.y - i.model.y) / s : 0
                        }
                        !n || n.model.skip ? i.mK = i.deltaK : !a || a.model.skip ? i.mK = n.deltaK : this.sign(n.deltaK) !== this.sign(i.deltaK) ? i.mK = 0 : i.mK = (n.deltaK + i.deltaK) / 2
                    }
                    var u, d, c, h;
                    for (e = 0; e < l - 1; ++e) i = r[e], a = r[e + 1], i.model.skip || a.model.skip || (o.almostEquals(i.deltaK, 0, this.EPSILON) ? i.mK = a.mK = 0 : (u = i.mK / i.deltaK, d = a.mK / i.deltaK, (h = Math.pow(u, 2) + Math.pow(d, 2)) <= 9 || (c = 3 / Math.sqrt(h), i.mK = u * c * i.deltaK, a.mK = d * c * i.deltaK)));
                    var f;
                    for (e = 0; e < l; ++e) (i = r[e]).model.skip || (n = e > 0 ? r[e - 1] : null, a = e < l - 1 ? r[e + 1] : null, n && !n.model.skip && (f = (i.model.x - n.model.x) / 3, i.model.controlPointPreviousX = i.model.x - f, i.model.controlPointPreviousY = i.model.y - f * i.mK), a && !a.model.skip && (f = (a.model.x - i.model.x) / 3, i.model.controlPointNextX = i.model.x + f, i.model.controlPointNextY = i.model.y + f * i.mK))
                }, o.nextItem = function (t, e, n) {
                    return n ? e >= t.length - 1 ? t[0] : t[e + 1] : e >= t.length - 1 ? t[t.length - 1] : t[e + 1]
                }, o.previousItem = function (t, e, n) {
                    return n ? e <= 0 ? t[t.length - 1] : t[e - 1] : e <= 0 ? t[0] : t[e - 1]
                }, o.niceNum = function (t, e) {
                    var n = Math.floor(o.log10(t)), i = t / Math.pow(10, n);
                    return (e ? i < 1.5 ? 1 : i < 3 ? 2 : i < 7 ? 5 : 10 : i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * Math.pow(10, n)
                }, o.requestAnimFrame = "undefined" == typeof window ? function (t) {
                    t()
                } : window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {
                    return window.setTimeout(t, 1e3 / 60)
                }, o.getRelativePosition = function (t, e) {
                    var n, i, a = t.originalEvent || t, r = t.currentTarget || t.srcElement,
                        l = r.getBoundingClientRect(), s = a.touches;
                    s && s.length > 0 ? (n = s[0].clientX, i = s[0].clientY) : (n = a.clientX, i = a.clientY);
                    var u = parseFloat(o.getStyle(r, "padding-left")), d = parseFloat(o.getStyle(r, "padding-top")),
                        c = parseFloat(o.getStyle(r, "padding-right")), h = parseFloat(o.getStyle(r, "padding-bottom")),
                        f = l.right - l.left - u - c, g = l.bottom - l.top - d - h;
                    return n = Math.round((n - l.left - u) / f * r.width / e.currentDevicePixelRatio), i = Math.round((i - l.top - d) / g * r.height / e.currentDevicePixelRatio), {
                        x: n,
                        y: i
                    }
                }, o.getConstraintWidth = function (t) {
                    return r(t, "max-width", "clientWidth")
                }, o.getConstraintHeight = function (t) {
                    return r(t, "max-height", "clientHeight")
                }, o.getMaximumWidth = function (t) {
                    var e = t.parentNode;
                    if (!e) return t.clientWidth;
                    var n = parseInt(o.getStyle(e, "padding-left"), 10),
                        i = parseInt(o.getStyle(e, "padding-right"), 10), a = e.clientWidth - n - i,
                        r = o.getConstraintWidth(t);
                    return isNaN(r) ? a : Math.min(a, r)
                }, o.getMaximumHeight = function (t) {
                    var e = t.parentNode;
                    if (!e) return t.clientHeight;
                    var n = parseInt(o.getStyle(e, "padding-top"), 10),
                        i = parseInt(o.getStyle(e, "padding-bottom"), 10), a = e.clientHeight - n - i,
                        r = o.getConstraintHeight(t);
                    return isNaN(r) ? a : Math.min(a, r)
                }, o.getStyle = function (t, e) {
                    return t.currentStyle ? t.currentStyle[e] : document.defaultView.getComputedStyle(t, null).getPropertyValue(e)
                }, o.retinaScale = function (t, e) {
                    var n = t.currentDevicePixelRatio = e || window.devicePixelRatio || 1;
                    if (1 !== n) {
                        var i = t.canvas, a = t.height, o = t.width;
                        i.height = a * n, i.width = o * n, t.ctx.scale(n, n), i.style.height = a + "px", i.style.width = o + "px"
                    }
                }, o.fontString = function (t, e, n) {
                    return e + " " + t + "px " + n
                }, o.longestText = function (t, e, n, i) {
                    var a = (i = i || {}).data = i.data || {}, r = i.garbageCollect = i.garbageCollect || [];
                    i.font !== e && (a = i.data = {}, r = i.garbageCollect = [], i.font = e), t.font = e;
                    var l = 0;
                    o.each(n, function (e) {
                        void 0 !== e && null !== e && !0 !== o.isArray(e) ? l = o.measureText(t, a, r, l, e) : o.isArray(e) && o.each(e, function (e) {
                            void 0 === e || null === e || o.isArray(e) || (l = o.measureText(t, a, r, l, e))
                        })
                    });
                    var s = r.length / 2;
                    if (s > n.length) {
                        for (var u = 0; u < s; u++) delete a[r[u]];
                        r.splice(0, s)
                    }
                    return l
                }, o.measureText = function (t, e, n, i, a) {
                    var o = e[a];
                    return o || (o = e[a] = t.measureText(a).width, n.push(a)), o > i && (i = o), i
                }, o.numberOfLabelLines = function (t) {
                    var e = 1;
                    return o.each(t, function (t) {
                        o.isArray(t) && t.length > e && (e = t.length)
                    }), e
                }, o.color = i ? function (t) {
                    return t instanceof CanvasGradient && (t = a.global.defaultColor), i(t)
                } : function (t) {
                    return console.error("Color.js not found!"), t
                }, o.getHoverColor = function (t) {
                    return t instanceof CanvasPattern ? t : o.color(t).saturate(.5).darken(.1).rgbString()
                }
            }
        }, {25: 25, 3: 3, 45: 45}], 28: [function (t, e, n) {
            "use strict";

            function i(t, e) {
                return t.native ? {x: t.x, y: t.y} : u.getRelativePosition(t, e)
            }

            function a(t, e) {
                var n, i, a, o, r;
                for (i = 0, o = t.data.datasets.length; i < o; ++i) if (t.isDatasetVisible(i)) for (a = 0, r = (n = t.getDatasetMeta(i)).data.length; a < r; ++a) {
                    var l = n.data[a];
                    l._view.skip || e(l)
                }
            }

            function o(t, e) {
                var n = [];
                return a(t, function (t) {
                    t.inRange(e.x, e.y) && n.push(t)
                }), n
            }

            function r(t, e, n, i) {
                var o = Number.POSITIVE_INFINITY, r = [];
                return a(t, function (t) {
                    if (!n || t.inRange(e.x, e.y)) {
                        var a = t.getCenterPoint(), l = i(e, a);
                        l < o ? (r = [t], o = l) : l === o && r.push(t)
                    }
                }), r
            }

            function l(t) {
                var e = -1 !== t.indexOf("x"), n = -1 !== t.indexOf("y");
                return function (t, i) {
                    var a = e ? Math.abs(t.x - i.x) : 0, o = n ? Math.abs(t.y - i.y) : 0;
                    return Math.sqrt(Math.pow(a, 2) + Math.pow(o, 2))
                }
            }

            function s(t, e, n) {
                var a = i(e, t);
                n.axis = n.axis || "x";
                var s = l(n.axis), u = n.intersect ? o(t, a) : r(t, a, !1, s), d = [];
                return u.length ? (t.data.datasets.forEach(function (e, n) {
                    if (t.isDatasetVisible(n)) {
                        var i = t.getDatasetMeta(n).data[u[0]._index];
                        i && !i._view.skip && d.push(i)
                    }
                }), d) : []
            }

            var u = t(45);
            e.exports = {
                modes: {
                    single: function (t, e) {
                        var n = i(e, t), o = [];
                        return a(t, function (t) {
                            if (t.inRange(n.x, n.y)) return o.push(t), o
                        }), o.slice(0, 1)
                    }, label: s, index: s, dataset: function (t, e, n) {
                        var a = i(e, t);
                        n.axis = n.axis || "xy";
                        var s = l(n.axis), u = n.intersect ? o(t, a) : r(t, a, !1, s);
                        return u.length > 0 && (u = t.getDatasetMeta(u[0]._datasetIndex).data), u
                    }, "x-axis": function (t, e) {
                        return s(t, e, {intersect: !0})
                    }, point: function (t, e) {
                        return o(t, i(e, t))
                    }, nearest: function (t, e, n) {
                        var a = i(e, t);
                        n.axis = n.axis || "xy";
                        var o = l(n.axis), s = r(t, a, n.intersect, o);
                        return s.length > 1 && s.sort(function (t, e) {
                            var n = t.getArea() - e.getArea();
                            return 0 === n && (n = t._datasetIndex - e._datasetIndex), n
                        }), s.slice(0, 1)
                    }, x: function (t, e, n) {
                        var o = i(e, t), r = [], l = !1;
                        return a(t, function (t) {
                            t.inXRange(o.x) && r.push(t), t.inRange(o.x, o.y) && (l = !0)
                        }), n.intersect && !l && (r = []), r
                    }, y: function (t, e, n) {
                        var o = i(e, t), r = [], l = !1;
                        return a(t, function (t) {
                            t.inYRange(o.y) && r.push(t), t.inRange(o.x, o.y) && (l = !0)
                        }), n.intersect && !l && (r = []), r
                    }
                }
            }
        }, {45: 45}], 29: [function (t, e, n) {
            "use strict";
            t(25)._set("global", {
                responsive: !0,
                responsiveAnimationDuration: 0,
                maintainAspectRatio: !0,
                events: ["mousemove", "mouseout", "click", "touchstart", "touchmove"],
                hover: {onHover: null, mode: "nearest", intersect: !0, animationDuration: 400},
                onClick: null,
                defaultColor: "rgba(0,0,0,0.1)",
                defaultFontColor: "#666",
                defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                defaultFontSize: 12,
                defaultFontStyle: "normal",
                showLines: !0,
                elements: {},
                layout: {padding: {top: 0, right: 0, bottom: 0, left: 0}}
            }), e.exports = function () {
                var t = function (t, e) {
                    return this.construct(t, e), this
                };
                return t.Chart = t, t
            }
        }, {25: 25}], 30: [function (t, e, n) {
            "use strict";
            var i = t(45);
            e.exports = function (t) {
                function e(t, e) {
                    return i.where(t, function (t) {
                        return t.position === e
                    })
                }

                function n(t, e) {
                    t.forEach(function (t, e) {
                        return t._tmpIndex_ = e, t
                    }), t.sort(function (t, n) {
                        var i = e ? n : t, a = e ? t : n;
                        return i.weight === a.weight ? i._tmpIndex_ - a._tmpIndex_ : i.weight - a.weight
                    }), t.forEach(function (t) {
                        delete t._tmpIndex_
                    })
                }

                t.layoutService = {
                    defaults: {}, addBox: function (t, e) {
                        t.boxes || (t.boxes = []), e.fullWidth = e.fullWidth || !1, e.position = e.position || "top", e.weight = e.weight || 0, t.boxes.push(e)
                    }, removeBox: function (t, e) {
                        var n = t.boxes ? t.boxes.indexOf(e) : -1;
                        -1 !== n && t.boxes.splice(n, 1)
                    }, configure: function (t, e, n) {
                        for (var i, a = ["fullWidth", "position", "weight"], o = a.length, r = 0; r < o; ++r) i = a[r], n.hasOwnProperty(i) && (e[i] = n[i])
                    }, update: function (t, a, o) {
                        function r(t) {
                            var e = i.findNextWhere(_, function (e) {
                                return e.box === t
                            });
                            if (e) if (t.isHorizontal()) {
                                var n = {left: Math.max(T, D), right: Math.max(F, I), top: 0, bottom: 0};
                                t.update(t.fullWidth ? x : S, y / 2, n)
                            } else t.update(e.minSize.width, C)
                        }

                        function l(t) {
                            t.isHorizontal() ? (t.left = t.fullWidth ? d : T, t.right = t.fullWidth ? a - c : T + S, t.top = V, t.bottom = V + t.height, V = t.bottom) : (t.left = N, t.right = N + t.width, t.top = O, t.bottom = O + C, N = t.right)
                        }

                        if (t) {
                            var s = t.options.layout || {}, u = i.options.toPadding(s.padding), d = u.left, c = u.right,
                                h = u.top, f = u.bottom, g = e(t.boxes, "left"), p = e(t.boxes, "right"),
                                v = e(t.boxes, "top"), m = e(t.boxes, "bottom"), b = e(t.boxes, "chartArea");
                            n(g, !0), n(p, !1), n(v, !0), n(m, !1);
                            var x = a - d - c, y = o - h - f, k = y / 2, w = (a - x / 2) / (g.length + p.length),
                                M = (o - k) / (v.length + m.length), S = x, C = y, _ = [];
                            i.each(g.concat(p, v, m), function (t) {
                                var e, n = t.isHorizontal();
                                n ? (e = t.update(t.fullWidth ? x : S, M), C -= e.height) : (e = t.update(w, k), S -= e.width), _.push({
                                    horizontal: n,
                                    minSize: e,
                                    box: t
                                })
                            });
                            var D = 0, I = 0, P = 0, A = 0;
                            i.each(v.concat(m), function (t) {
                                if (t.getPadding) {
                                    var e = t.getPadding();
                                    D = Math.max(D, e.left), I = Math.max(I, e.right)
                                }
                            }), i.each(g.concat(p), function (t) {
                                if (t.getPadding) {
                                    var e = t.getPadding();
                                    P = Math.max(P, e.top), A = Math.max(A, e.bottom)
                                }
                            });
                            var T = d, F = c, O = h, R = f;
                            i.each(g.concat(p), r), i.each(g, function (t) {
                                T += t.width
                            }), i.each(p, function (t) {
                                F += t.width
                            }), i.each(v.concat(m), r), i.each(v, function (t) {
                                O += t.height
                            }), i.each(m, function (t) {
                                R += t.height
                            }), i.each(g.concat(p), function (t) {
                                var e = i.findNextWhere(_, function (e) {
                                    return e.box === t
                                }), n = {left: 0, right: 0, top: O, bottom: R};
                                e && t.update(e.minSize.width, C, n)
                            }), T = d, F = c, O = h, R = f, i.each(g, function (t) {
                                T += t.width
                            }), i.each(p, function (t) {
                                F += t.width
                            }), i.each(v, function (t) {
                                O += t.height
                            }), i.each(m, function (t) {
                                R += t.height
                            });
                            var L = Math.max(D - T, 0);
                            T += L, F += Math.max(I - F, 0);
                            var z = Math.max(P - O, 0);
                            O += z, R += Math.max(A - R, 0);
                            var B = o - O - R, W = a - T - F;
                            W === S && B === C || (i.each(g, function (t) {
                                t.height = B
                            }), i.each(p, function (t) {
                                t.height = B
                            }), i.each(v, function (t) {
                                t.fullWidth || (t.width = W)
                            }), i.each(m, function (t) {
                                t.fullWidth || (t.width = W)
                            }), C = B, S = W);
                            var N = d + L, V = h + z;
                            i.each(g.concat(v), l), N += S, V += C, i.each(p, l), i.each(m, l), t.chartArea = {
                                left: T,
                                top: O,
                                right: T + S,
                                bottom: O + C
                            }, i.each(b, function (e) {
                                e.left = t.chartArea.left, e.top = t.chartArea.top, e.right = t.chartArea.right, e.bottom = t.chartArea.bottom, e.update(S, C)
                            })
                        }
                    }
                }
            }
        }, {45: 45}], 31: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {plugins: {}}), e.exports = function (t) {
                t.plugins = {
                    _plugins: [], _cacheId: 0, register: function (t) {
                        var e = this._plugins;
                        [].concat(t).forEach(function (t) {
                            -1 === e.indexOf(t) && e.push(t)
                        }), this._cacheId++
                    }, unregister: function (t) {
                        var e = this._plugins;
                        [].concat(t).forEach(function (t) {
                            var n = e.indexOf(t);
                            -1 !== n && e.splice(n, 1)
                        }), this._cacheId++
                    }, clear: function () {
                        this._plugins = [], this._cacheId++
                    }, count: function () {
                        return this._plugins.length
                    }, getAll: function () {
                        return this._plugins
                    }, notify: function (t, e, n) {
                        var i, a, o, r, l, s = this.descriptors(t), u = s.length;
                        for (i = 0; i < u; ++i) if (a = s[i], o = a.plugin, "function" == typeof(l = o[e]) && ((r = [t].concat(n || [])).push(a.options), !1 === l.apply(o, r))) return !1;
                        return !0
                    }, descriptors: function (t) {
                        var e = t._plugins || (t._plugins = {});
                        if (e.id === this._cacheId) return e.descriptors;
                        var n = [], a = [], r = t && t.config || {}, l = r.options && r.options.plugins || {};
                        return this._plugins.concat(r.plugins || []).forEach(function (t) {
                            if (-1 === n.indexOf(t)) {
                                var e = t.id, r = l[e];
                                !1 !== r && (!0 === r && (r = o.clone(i.global.plugins[e])), n.push(t), a.push({
                                    plugin: t,
                                    options: r || {}
                                }))
                            }
                        }), e.descriptors = a, e.id = this._cacheId, a
                    }
                }, t.pluginService = t.plugins, t.PluginBase = a.extend({})
            }
        }, {25: 25, 26: 26, 45: 45}], 32: [function (t, e, n) {
            "use strict";

            function i(t) {
                var e, n, i = [];
                for (e = 0, n = t.length; e < n; ++e) i.push(t[e].label);
                return i
            }

            function a(t, e, n) {
                var i = t.getPixelForTick(e);
                return n && (i -= 0 === e ? (t.getPixelForTick(1) - i) / 2 : (i - t.getPixelForTick(e - 1)) / 2), i
            }

            var o = t(25), r = t(26), l = t(45), s = t(34);
            o._set("scale", {
                display: !0,
                position: "left",
                offset: !1,
                gridLines: {
                    display: !0,
                    color: "rgba(0, 0, 0, 0.1)",
                    lineWidth: 1,
                    drawBorder: !0,
                    drawOnChartArea: !0,
                    drawTicks: !0,
                    tickMarkLength: 10,
                    zeroLineWidth: 1,
                    zeroLineColor: "rgba(0,0,0,0.25)",
                    zeroLineBorderDash: [],
                    zeroLineBorderDashOffset: 0,
                    offsetGridLines: !1,
                    borderDash: [],
                    borderDashOffset: 0
                },
                scaleLabel: {display: !1, labelString: "", lineHeight: 1.2, padding: {top: 4, bottom: 4}},
                ticks: {
                    beginAtZero: !1,
                    minRotation: 0,
                    maxRotation: 50,
                    mirror: !1,
                    padding: 0,
                    reverse: !1,
                    display: !0,
                    autoSkip: !0,
                    autoSkipPadding: 0,
                    labelOffset: 0,
                    callback: s.formatters.values,
                    minor: {},
                    major: {}
                }
            }), e.exports = function (t) {
                function e(t, e, n) {
                    return l.isArray(e) ? l.longestText(t, n, e) : t.measureText(e).width
                }

                function n(t) {
                    var e = l.valueOrDefault, n = o.global, i = e(t.fontSize, n.defaultFontSize),
                        a = e(t.fontStyle, n.defaultFontStyle), r = e(t.fontFamily, n.defaultFontFamily);
                    return {size: i, style: a, family: r, font: l.fontString(i, a, r)}
                }

                function s(t) {
                    return l.options.toLineHeight(l.valueOrDefault(t.lineHeight, 1.2), l.valueOrDefault(t.fontSize, o.global.defaultFontSize))
                }

                t.Scale = r.extend({
                    getPadding: function () {
                        var t = this;
                        return {
                            left: t.paddingLeft || 0,
                            top: t.paddingTop || 0,
                            right: t.paddingRight || 0,
                            bottom: t.paddingBottom || 0
                        }
                    },
                    getTicks: function () {
                        return this._ticks
                    },
                    mergeTicksOptions: function () {
                        var t = this.options.ticks;
                        !1 === t.minor && (t.minor = {display: !1}), !1 === t.major && (t.major = {display: !1});
                        for (var e in t) "major" !== e && "minor" !== e && (void 0 === t.minor[e] && (t.minor[e] = t[e]), void 0 === t.major[e] && (t.major[e] = t[e]))
                    },
                    beforeUpdate: function () {
                        l.callback(this.options.beforeUpdate, [this])
                    },
                    update: function (t, e, n) {
                        var i, a, o, r, s, u, d = this;
                        for (d.beforeUpdate(), d.maxWidth = t, d.maxHeight = e, d.margins = l.extend({
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }, n), d.longestTextCache = d.longestTextCache || {}, d.beforeSetDimensions(), d.setDimensions(), d.afterSetDimensions(), d.beforeDataLimits(), d.determineDataLimits(), d.afterDataLimits(), d.beforeBuildTicks(), s = d.buildTicks() || [], d.afterBuildTicks(), d.beforeTickToLabelConversion(), o = d.convertTicksToLabels(s) || d.ticks, d.afterTickToLabelConversion(), d.ticks = o, i = 0, a = o.length; i < a; ++i) r = o[i], (u = s[i]) ? u.label = r : s.push(u = {
                            label: r,
                            major: !1
                        });
                        return d._ticks = s, d.beforeCalculateTickRotation(), d.calculateTickRotation(), d.afterCalculateTickRotation(), d.beforeFit(), d.fit(), d.afterFit(), d.afterUpdate(), d.minSize
                    },
                    afterUpdate: function () {
                        l.callback(this.options.afterUpdate, [this])
                    },
                    beforeSetDimensions: function () {
                        l.callback(this.options.beforeSetDimensions, [this])
                    },
                    setDimensions: function () {
                        var t = this;
                        t.isHorizontal() ? (t.width = t.maxWidth, t.left = 0, t.right = t.width) : (t.height = t.maxHeight, t.top = 0, t.bottom = t.height), t.paddingLeft = 0, t.paddingTop = 0, t.paddingRight = 0, t.paddingBottom = 0
                    },
                    afterSetDimensions: function () {
                        l.callback(this.options.afterSetDimensions, [this])
                    },
                    beforeDataLimits: function () {
                        l.callback(this.options.beforeDataLimits, [this])
                    },
                    determineDataLimits: l.noop,
                    afterDataLimits: function () {
                        l.callback(this.options.afterDataLimits, [this])
                    },
                    beforeBuildTicks: function () {
                        l.callback(this.options.beforeBuildTicks, [this])
                    },
                    buildTicks: l.noop,
                    afterBuildTicks: function () {
                        l.callback(this.options.afterBuildTicks, [this])
                    },
                    beforeTickToLabelConversion: function () {
                        l.callback(this.options.beforeTickToLabelConversion, [this])
                    },
                    convertTicksToLabels: function () {
                        var t = this, e = t.options.ticks;
                        t.ticks = t.ticks.map(e.userCallback || e.callback, this)
                    },
                    afterTickToLabelConversion: function () {
                        l.callback(this.options.afterTickToLabelConversion, [this])
                    },
                    beforeCalculateTickRotation: function () {
                        l.callback(this.options.beforeCalculateTickRotation, [this])
                    },
                    calculateTickRotation: function () {
                        var t = this, e = t.ctx, a = t.options.ticks, o = i(t._ticks), r = n(a);
                        e.font = r.font;
                        var s = a.minRotation || 0;
                        if (o.length && t.options.display && t.isHorizontal()) for (var u, d = l.longestText(e, r.font, o, t.longestTextCache), c = d, h = t.getPixelForTick(1) - t.getPixelForTick(0) - 6; c > h && s < a.maxRotation;) {
                            var f = l.toRadians(s);
                            if (u = Math.cos(f), Math.sin(f) * d > t.maxHeight) {
                                s--;
                                break
                            }
                            s++, c = u * d
                        }
                        t.labelRotation = s
                    },
                    afterCalculateTickRotation: function () {
                        l.callback(this.options.afterCalculateTickRotation, [this])
                    },
                    beforeFit: function () {
                        l.callback(this.options.beforeFit, [this])
                    },
                    fit: function () {
                        var t = this, a = t.minSize = {width: 0, height: 0}, o = i(t._ticks), r = t.options,
                            u = r.ticks, d = r.scaleLabel, c = r.gridLines, h = r.display, f = t.isHorizontal(),
                            g = n(u), p = r.gridLines.tickMarkLength;
                        if (a.width = f ? t.isFullWidth() ? t.maxWidth - t.margins.left - t.margins.right : t.maxWidth : h && c.drawTicks ? p : 0, a.height = f ? h && c.drawTicks ? p : 0 : t.maxHeight, d.display && h) {
                            var v = s(d) + l.options.toPadding(d.padding).height;
                            f ? a.height += v : a.width += v
                        }
                        if (u.display && h) {
                            var m = l.longestText(t.ctx, g.font, o, t.longestTextCache), b = l.numberOfLabelLines(o),
                                x = .5 * g.size, y = t.options.ticks.padding;
                            if (f) {
                                t.longestLabelWidth = m;
                                var k = l.toRadians(t.labelRotation), w = Math.cos(k),
                                    M = Math.sin(k) * m + g.size * b + x * (b - 1) + x;
                                a.height = Math.min(t.maxHeight, a.height + M + y), t.ctx.font = g.font;
                                var S = e(t.ctx, o[0], g.font), C = e(t.ctx, o[o.length - 1], g.font);
                                0 !== t.labelRotation ? (t.paddingLeft = "bottom" === r.position ? w * S + 3 : w * x + 3, t.paddingRight = "bottom" === r.position ? w * x + 3 : w * C + 3) : (t.paddingLeft = S / 2 + 3, t.paddingRight = C / 2 + 3)
                            } else u.mirror ? m = 0 : m += y + x, a.width = Math.min(t.maxWidth, a.width + m), t.paddingTop = g.size / 2, t.paddingBottom = g.size / 2
                        }
                        t.handleMargins(), t.width = a.width, t.height = a.height
                    },
                    handleMargins: function () {
                        var t = this;
                        t.margins && (t.paddingLeft = Math.max(t.paddingLeft - t.margins.left, 0), t.paddingTop = Math.max(t.paddingTop - t.margins.top, 0), t.paddingRight = Math.max(t.paddingRight - t.margins.right, 0), t.paddingBottom = Math.max(t.paddingBottom - t.margins.bottom, 0))
                    },
                    afterFit: function () {
                        l.callback(this.options.afterFit, [this])
                    },
                    isHorizontal: function () {
                        return "top" === this.options.position || "bottom" === this.options.position
                    },
                    isFullWidth: function () {
                        return this.options.fullWidth
                    },
                    getRightValue: function (t) {
                        if (l.isNullOrUndef(t)) return NaN;
                        if ("number" == typeof t && !isFinite(t)) return NaN;
                        if (t) if (this.isHorizontal()) {
                            if (void 0 !== t.x) return this.getRightValue(t.x)
                        } else if (void 0 !== t.y) return this.getRightValue(t.y);
                        return t
                    },
                    getLabelForIndex: l.noop,
                    getPixelForValue: l.noop,
                    getValueForPixel: l.noop,
                    getPixelForTick: function (t) {
                        var e = this, n = e.options.offset;
                        if (e.isHorizontal()) {
                            var i = (e.width - (e.paddingLeft + e.paddingRight)) / Math.max(e._ticks.length - (n ? 0 : 1), 1),
                                a = i * t + e.paddingLeft;
                            n && (a += i / 2);
                            var o = e.left + Math.round(a);
                            return o += e.isFullWidth() ? e.margins.left : 0
                        }
                        var r = e.height - (e.paddingTop + e.paddingBottom);
                        return e.top + t * (r / (e._ticks.length - 1))
                    },
                    getPixelForDecimal: function (t) {
                        var e = this;
                        if (e.isHorizontal()) {
                            var n = (e.width - (e.paddingLeft + e.paddingRight)) * t + e.paddingLeft,
                                i = e.left + Math.round(n);
                            return i += e.isFullWidth() ? e.margins.left : 0
                        }
                        return e.top + t * e.height
                    },
                    getBasePixel: function () {
                        return this.getPixelForValue(this.getBaseValue())
                    },
                    getBaseValue: function () {
                        var t = this, e = t.min, n = t.max;
                        return t.beginAtZero ? 0 : e < 0 && n < 0 ? n : e > 0 && n > 0 ? e : 0
                    },
                    _autoSkip: function (t) {
                        var e, n, i, a, o = this, r = o.isHorizontal(), s = o.options.ticks.minor, u = t.length,
                            d = l.toRadians(o.labelRotation), c = Math.cos(d), h = o.longestLabelWidth * c, f = [];
                        for (s.maxTicksLimit && (a = s.maxTicksLimit), r && (e = !1, (h + s.autoSkipPadding) * u > o.width - (o.paddingLeft + o.paddingRight) && (e = 1 + Math.floor((h + s.autoSkipPadding) * u / (o.width - (o.paddingLeft + o.paddingRight)))), a && u > a && (e = Math.max(e, Math.floor(u / a)))), n = 0; n < u; n++) i = t[n], ((e > 1 && n % e > 0 || n % e == 0 && n + e >= u) && n !== u - 1 || l.isNullOrUndef(i.label)) && delete i.label, f.push(i);
                        return f
                    },
                    draw: function (t) {
                        var e = this, i = e.options;
                        if (i.display) {
                            var r = e.ctx, u = o.global, d = i.ticks.minor, c = i.ticks.major || d, h = i.gridLines,
                                f = i.scaleLabel, g = 0 !== e.labelRotation, p = e.isHorizontal(),
                                v = d.autoSkip ? e._autoSkip(e.getTicks()) : e.getTicks(),
                                m = l.valueOrDefault(d.fontColor, u.defaultFontColor), b = n(d),
                                x = l.valueOrDefault(c.fontColor, u.defaultFontColor), y = n(c),
                                k = h.drawTicks ? h.tickMarkLength : 0,
                                w = l.valueOrDefault(f.fontColor, u.defaultFontColor), M = n(f),
                                S = l.options.toPadding(f.padding), C = l.toRadians(e.labelRotation), _ = [],
                                D = "right" === i.position ? e.left : e.right - k,
                                I = "right" === i.position ? e.left + k : e.right,
                                P = "bottom" === i.position ? e.top : e.bottom - k,
                                A = "bottom" === i.position ? e.top + k : e.bottom;
                            if (l.each(v, function (n, o) {
                                if (void 0 !== n.label) {
                                    var r, s, c, f, m = n.label;
                                    o === e.zeroLineIndex && i.offset === h.offsetGridLines ? (r = h.zeroLineWidth, s = h.zeroLineColor, c = h.zeroLineBorderDash, f = h.zeroLineBorderDashOffset) : (r = l.valueAtIndexOrDefault(h.lineWidth, o), s = l.valueAtIndexOrDefault(h.color, o), c = l.valueOrDefault(h.borderDash, u.borderDash), f = l.valueOrDefault(h.borderDashOffset, u.borderDashOffset));
                                    var b, x, y, w, M, S, T, F, O, R, L = "middle", z = "middle", B = d.padding;
                                    if (p) {
                                        var W = k + B;
                                        "bottom" === i.position ? (z = g ? "middle" : "top", L = g ? "right" : "center", R = e.top + W) : (z = g ? "middle" : "bottom", L = g ? "left" : "center", R = e.bottom - W);
                                        var N = a(e, o, h.offsetGridLines && v.length > 1);
                                        N < e.left && (s = "rgba(0,0,0,0)"), N += l.aliasPixel(r), O = e.getPixelForTick(o) + d.labelOffset, b = y = M = T = N, x = P, w = A, S = t.top, F = t.bottom
                                    } else {
                                        var V, E = "left" === i.position;
                                        d.mirror ? (L = E ? "left" : "right", V = B) : (L = E ? "right" : "left", V = k + B), O = E ? e.right - V : e.left + V;
                                        var H = a(e, o, h.offsetGridLines && v.length > 1);
                                        H < e.top && (s = "rgba(0,0,0,0)"), H += l.aliasPixel(r), R = e.getPixelForTick(o) + d.labelOffset, b = D, y = I, M = t.left, T = t.right, x = w = S = F = H
                                    }
                                    _.push({
                                        tx1: b,
                                        ty1: x,
                                        tx2: y,
                                        ty2: w,
                                        x1: M,
                                        y1: S,
                                        x2: T,
                                        y2: F,
                                        labelX: O,
                                        labelY: R,
                                        glWidth: r,
                                        glColor: s,
                                        glBorderDash: c,
                                        glBorderDashOffset: f,
                                        rotation: -1 * C,
                                        label: m,
                                        major: n.major,
                                        textBaseline: z,
                                        textAlign: L
                                    })
                                }
                            }), l.each(_, function (t) {
                                if (h.display && (r.save(), r.lineWidth = t.glWidth, r.strokeStyle = t.glColor, r.setLineDash && (r.setLineDash(t.glBorderDash), r.lineDashOffset = t.glBorderDashOffset), r.beginPath(), h.drawTicks && (r.moveTo(t.tx1, t.ty1), r.lineTo(t.tx2, t.ty2)), h.drawOnChartArea && (r.moveTo(t.x1, t.y1), r.lineTo(t.x2, t.y2)), r.stroke(), r.restore()), d.display) {
                                    r.save(), r.translate(t.labelX, t.labelY), r.rotate(t.rotation), r.font = t.major ? y.font : b.font, r.fillStyle = t.major ? x : m, r.textBaseline = t.textBaseline, r.textAlign = t.textAlign;
                                    var e = t.label;
                                    if (l.isArray(e)) for (var n = 0, i = 0; n < e.length; ++n) r.fillText("" + e[n], 0, i), i += 1.5 * b.size; else r.fillText(e, 0, 0);
                                    r.restore()
                                }
                            }), f.display) {
                                var T, F, O = 0, R = s(f) / 2;
                                if (p) T = e.left + (e.right - e.left) / 2, F = "bottom" === i.position ? e.bottom - R - S.bottom : e.top + R + S.top; else {
                                    var L = "left" === i.position;
                                    T = L ? e.left + R + S.top : e.right - R - S.top, F = e.top + (e.bottom - e.top) / 2, O = L ? -.5 * Math.PI : .5 * Math.PI
                                }
                                r.save(), r.translate(T, F), r.rotate(O), r.textAlign = "center", r.textBaseline = "middle", r.fillStyle = w, r.font = M.font, r.fillText(f.labelString, 0, 0), r.restore()
                            }
                            if (h.drawBorder) {
                                r.lineWidth = l.valueAtIndexOrDefault(h.lineWidth, 0), r.strokeStyle = l.valueAtIndexOrDefault(h.color, 0);
                                var z = e.left, B = e.right, W = e.top, N = e.bottom, V = l.aliasPixel(r.lineWidth);
                                p ? (W = N = "top" === i.position ? e.bottom : e.top, W += V, N += V) : (z = B = "left" === i.position ? e.right : e.left, z += V, B += V), r.beginPath(), r.moveTo(z, W), r.lineTo(B, N), r.stroke()
                            }
                        }
                    }
                })
            }
        }, {25: 25, 26: 26, 34: 34, 45: 45}], 33: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(45);
            e.exports = function (t) {
                t.scaleService = {
                    constructors: {}, defaults: {}, registerScaleType: function (t, e, n) {
                        this.constructors[t] = e, this.defaults[t] = a.clone(n)
                    }, getScaleConstructor: function (t) {
                        return this.constructors.hasOwnProperty(t) ? this.constructors[t] : void 0
                    }, getScaleDefaults: function (t) {
                        return this.defaults.hasOwnProperty(t) ? a.merge({}, [i.scale, this.defaults[t]]) : {}
                    }, updateScaleDefaults: function (t, e) {
                        var n = this;
                        n.defaults.hasOwnProperty(t) && (n.defaults[t] = a.extend(n.defaults[t], e))
                    }, addScalesToLayout: function (e) {
                        a.each(e.scales, function (n) {
                            n.fullWidth = n.options.fullWidth, n.position = n.options.position, n.weight = n.options.weight, t.layoutService.addBox(e, n)
                        })
                    }
                }
            }
        }, {25: 25, 45: 45}], 34: [function (t, e, n) {
            "use strict";
            var i = t(45);
            e.exports = {
                generators: {
                    linear: function (t, e) {
                        var n, a = [];
                        if (t.stepSize && t.stepSize > 0) n = t.stepSize; else {
                            var o = i.niceNum(e.max - e.min, !1);
                            n = i.niceNum(o / (t.maxTicks - 1), !0)
                        }
                        var r = Math.floor(e.min / n) * n, l = Math.ceil(e.max / n) * n;
                        t.min && t.max && t.stepSize && i.almostWhole((t.max - t.min) / t.stepSize, n / 1e3) && (r = t.min, l = t.max);
                        var s = (l - r) / n;
                        s = i.almostEquals(s, Math.round(s), n / 1e3) ? Math.round(s) : Math.ceil(s), a.push(void 0 !== t.min ? t.min : r);
                        for (var u = 1; u < s; ++u) a.push(r + u * n);
                        return a.push(void 0 !== t.max ? t.max : l), a
                    }, logarithmic: function (t, e) {
                        var n, a, o = [], r = i.valueOrDefault, l = r(t.min, Math.pow(10, Math.floor(i.log10(e.min)))),
                            s = Math.floor(i.log10(e.max)), u = Math.ceil(e.max / Math.pow(10, s));
                        0 === l ? (n = Math.floor(i.log10(e.minNotZero)), a = Math.floor(e.minNotZero / Math.pow(10, n)), o.push(l), l = a * Math.pow(10, n)) : (n = Math.floor(i.log10(l)), a = Math.floor(l / Math.pow(10, n)));
                        do {
                            o.push(l), 10 === ++a && (a = 1, ++n), l = a * Math.pow(10, n)
                        } while (n < s || n === s && a < u);
                        var d = r(t.max, l);
                        return o.push(d), o
                    }
                }, formatters: {
                    values: function (t) {
                        return i.isArray(t) ? t : "" + t
                    }, linear: function (t, e, n) {
                        var a = n.length > 3 ? n[2] - n[1] : n[1] - n[0];
                        Math.abs(a) > 1 && t !== Math.floor(t) && (a = t - Math.floor(t));
                        var o = i.log10(Math.abs(a)), r = "";
                        if (0 !== t) {
                            var l = -1 * Math.floor(o);
                            l = Math.max(Math.min(l, 20), 0), r = t.toFixed(l)
                        } else r = "0";
                        return r
                    }, logarithmic: function (t, e, n) {
                        var a = t / Math.pow(10, Math.floor(i.log10(t)));
                        return 0 === t ? "0" : 1 === a || 2 === a || 5 === a || 0 === e || e === n.length - 1 ? t.toExponential() : ""
                    }
                }
            }
        }, {45: 45}], 35: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {
                tooltips: {
                    enabled: !0,
                    custom: null,
                    mode: "nearest",
                    position: "average",
                    intersect: !0,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    titleFontStyle: "bold",
                    titleSpacing: 2,
                    titleMarginBottom: 6,
                    titleFontColor: "#fff",
                    titleAlign: "left",
                    bodySpacing: 2,
                    bodyFontColor: "#fff",
                    bodyAlign: "left",
                    footerFontStyle: "bold",
                    footerSpacing: 2,
                    footerMarginTop: 6,
                    footerFontColor: "#fff",
                    footerAlign: "left",
                    yPadding: 6,
                    xPadding: 6,
                    caretPadding: 2,
                    caretSize: 5,
                    cornerRadius: 6,
                    multiKeyBackground: "#fff",
                    displayColors: !0,
                    borderColor: "rgba(0,0,0,0)",
                    borderWidth: 0,
                    callbacks: {
                        beforeTitle: o.noop,
                        title: function (t, e) {
                            var n = "", i = e.labels, a = i ? i.length : 0;
                            if (t.length > 0) {
                                var o = t[0];
                                o.xLabel ? n = o.xLabel : a > 0 && o.index < a && (n = i[o.index])
                            }
                            return n
                        },
                        afterTitle: o.noop,
                        beforeBody: o.noop,
                        beforeLabel: o.noop,
                        label: function (t, e) {
                            var n = e.datasets[t.datasetIndex].label || "";
                            return n && (n += ": "), n += t.yLabel
                        },
                        labelColor: function (t, e) {
                            var n = e.getDatasetMeta(t.datasetIndex).data[t.index]._view;
                            return {borderColor: n.borderColor, backgroundColor: n.backgroundColor}
                        },
                        labelTextColor: function () {
                            return this._options.bodyFontColor
                        },
                        afterLabel: o.noop,
                        afterBody: o.noop,
                        beforeFooter: o.noop,
                        footer: o.noop,
                        afterFooter: o.noop
                    }
                }
            }), e.exports = function (t) {
                function e(t, e) {
                    var n = o.color(t);
                    return n.alpha(e * n.alpha()).rgbaString()
                }

                function n(t, e) {
                    return e && (o.isArray(e) ? Array.prototype.push.apply(t, e) : t.push(e)), t
                }

                function r(t) {
                    var e = t._xScale, n = t._yScale || t._scale, i = t._index, a = t._datasetIndex;
                    return {
                        xLabel: e ? e.getLabelForIndex(i, a) : "",
                        yLabel: n ? n.getLabelForIndex(i, a) : "",
                        index: i,
                        datasetIndex: a,
                        x: t._model.x,
                        y: t._model.y
                    }
                }

                function l(t) {
                    var e = i.global, n = o.valueOrDefault;
                    return {
                        xPadding: t.xPadding,
                        yPadding: t.yPadding,
                        xAlign: t.xAlign,
                        yAlign: t.yAlign,
                        bodyFontColor: t.bodyFontColor,
                        _bodyFontFamily: n(t.bodyFontFamily, e.defaultFontFamily),
                        _bodyFontStyle: n(t.bodyFontStyle, e.defaultFontStyle),
                        _bodyAlign: t.bodyAlign,
                        bodyFontSize: n(t.bodyFontSize, e.defaultFontSize),
                        bodySpacing: t.bodySpacing,
                        titleFontColor: t.titleFontColor,
                        _titleFontFamily: n(t.titleFontFamily, e.defaultFontFamily),
                        _titleFontStyle: n(t.titleFontStyle, e.defaultFontStyle),
                        titleFontSize: n(t.titleFontSize, e.defaultFontSize),
                        _titleAlign: t.titleAlign,
                        titleSpacing: t.titleSpacing,
                        titleMarginBottom: t.titleMarginBottom,
                        footerFontColor: t.footerFontColor,
                        _footerFontFamily: n(t.footerFontFamily, e.defaultFontFamily),
                        _footerFontStyle: n(t.footerFontStyle, e.defaultFontStyle),
                        footerFontSize: n(t.footerFontSize, e.defaultFontSize),
                        _footerAlign: t.footerAlign,
                        footerSpacing: t.footerSpacing,
                        footerMarginTop: t.footerMarginTop,
                        caretSize: t.caretSize,
                        cornerRadius: t.cornerRadius,
                        backgroundColor: t.backgroundColor,
                        opacity: 0,
                        legendColorBackground: t.multiKeyBackground,
                        displayColors: t.displayColors,
                        borderColor: t.borderColor,
                        borderWidth: t.borderWidth
                    }
                }

                function s(t, e) {
                    var n = t._chart.ctx, i = 2 * e.yPadding, a = 0, r = e.body, l = r.reduce(function (t, e) {
                        return t + e.before.length + e.lines.length + e.after.length
                    }, 0);
                    l += e.beforeBody.length + e.afterBody.length;
                    var s = e.title.length, u = e.footer.length, d = e.titleFontSize, c = e.bodyFontSize,
                        h = e.footerFontSize;
                    i += s * d, i += s ? (s - 1) * e.titleSpacing : 0, i += s ? e.titleMarginBottom : 0, i += l * c, i += l ? (l - 1) * e.bodySpacing : 0, i += u ? e.footerMarginTop : 0, i += u * h, i += u ? (u - 1) * e.footerSpacing : 0;
                    var f = 0, g = function (t) {
                        a = Math.max(a, n.measureText(t).width + f)
                    };
                    return n.font = o.fontString(d, e._titleFontStyle, e._titleFontFamily), o.each(e.title, g), n.font = o.fontString(c, e._bodyFontStyle, e._bodyFontFamily), o.each(e.beforeBody.concat(e.afterBody), g), f = e.displayColors ? c + 2 : 0, o.each(r, function (t) {
                        o.each(t.before, g), o.each(t.lines, g), o.each(t.after, g)
                    }), f = 0, n.font = o.fontString(h, e._footerFontStyle, e._footerFontFamily), o.each(e.footer, g), a += 2 * e.xPadding, {
                        width: a,
                        height: i
                    }
                }

                function u(t, e) {
                    var n = t._model, i = t._chart, a = t._chart.chartArea, o = "center", r = "center";
                    n.y < e.height ? r = "top" : n.y > i.height - e.height && (r = "bottom");
                    var l, s, u, d, c, h = (a.left + a.right) / 2, f = (a.top + a.bottom) / 2;
                    "center" === r ? (l = function (t) {
                        return t <= h
                    }, s = function (t) {
                        return t > h
                    }) : (l = function (t) {
                        return t <= e.width / 2
                    }, s = function (t) {
                        return t >= i.width - e.width / 2
                    }), u = function (t) {
                        return t + e.width > i.width
                    }, d = function (t) {
                        return t - e.width < 0
                    }, c = function (t) {
                        return t <= f ? "top" : "bottom"
                    }, l(n.x) ? (o = "left", u(n.x) && (o = "center", r = c(n.y))) : s(n.x) && (o = "right", d(n.x) && (o = "center", r = c(n.y)));
                    var g = t._options;
                    return {xAlign: g.xAlign ? g.xAlign : o, yAlign: g.yAlign ? g.yAlign : r}
                }

                function d(t, e, n) {
                    var i = t.x, a = t.y, o = t.caretSize, r = t.caretPadding, l = t.cornerRadius, s = n.xAlign,
                        u = n.yAlign, d = o + r, c = l + r;
                    return "right" === s ? i -= e.width : "center" === s && (i -= e.width / 2), "top" === u ? a += d : a -= "bottom" === u ? e.height + d : e.height / 2, "center" === u ? "left" === s ? i += d : "right" === s && (i -= d) : "left" === s ? i -= c : "right" === s && (i += c), {
                        x: i,
                        y: a
                    }
                }

                t.Tooltip = a.extend({
                    initialize: function () {
                        this._model = l(this._options)
                    }, getTitle: function () {
                        var t = this, e = t._options.callbacks, i = e.beforeTitle.apply(t, arguments),
                            a = e.title.apply(t, arguments), o = e.afterTitle.apply(t, arguments), r = [];
                        return r = n(r, i), r = n(r, a), r = n(r, o)
                    }, getBeforeBody: function () {
                        var t = this._options.callbacks.beforeBody.apply(this, arguments);
                        return o.isArray(t) ? t : void 0 !== t ? [t] : []
                    }, getBody: function (t, e) {
                        var i = this, a = i._options.callbacks, r = [];
                        return o.each(t, function (t) {
                            var o = {before: [], lines: [], after: []};
                            n(o.before, a.beforeLabel.call(i, t, e)), n(o.lines, a.label.call(i, t, e)), n(o.after, a.afterLabel.call(i, t, e)), r.push(o)
                        }), r
                    }, getAfterBody: function () {
                        var t = this._options.callbacks.afterBody.apply(this, arguments);
                        return o.isArray(t) ? t : void 0 !== t ? [t] : []
                    }, getFooter: function () {
                        var t = this, e = t._options.callbacks, i = e.beforeFooter.apply(t, arguments),
                            a = e.footer.apply(t, arguments), o = e.afterFooter.apply(t, arguments), r = [];
                        return r = n(r, i), r = n(r, a), r = n(r, o)
                    }, update: function (e) {
                        var n, i, a = this, c = a._options, h = a._model, f = a._model = l(c), g = a._active,
                            p = a._data, v = {xAlign: h.xAlign, yAlign: h.yAlign}, m = {x: h.x, y: h.y},
                            b = {width: h.width, height: h.height}, x = {x: h.caretX, y: h.caretY};
                        if (g.length) {
                            f.opacity = 1;
                            var y = [], k = [];
                            x = t.Tooltip.positioners[c.position](g, a._eventPosition);
                            var w = [];
                            for (n = 0, i = g.length; n < i; ++n) w.push(r(g[n]));
                            c.filter && (w = w.filter(function (t) {
                                return c.filter(t, p)
                            })), c.itemSort && (w = w.sort(function (t, e) {
                                return c.itemSort(t, e, p)
                            })), o.each(w, function (t) {
                                y.push(c.callbacks.labelColor.call(a, t, a._chart)), k.push(c.callbacks.labelTextColor.call(a, t, a._chart))
                            }), f.title = a.getTitle(w, p), f.beforeBody = a.getBeforeBody(w, p), f.body = a.getBody(w, p), f.afterBody = a.getAfterBody(w, p), f.footer = a.getFooter(w, p), f.x = Math.round(x.x), f.y = Math.round(x.y), f.caretPadding = c.caretPadding, f.labelColors = y, f.labelTextColors = k, f.dataPoints = w, m = d(f, b = s(this, f), v = u(this, b))
                        } else f.opacity = 0;
                        return f.xAlign = v.xAlign, f.yAlign = v.yAlign, f.x = m.x, f.y = m.y, f.width = b.width, f.height = b.height, f.caretX = x.x, f.caretY = x.y, a._model = f, e && c.custom && c.custom.call(a, f), a
                    }, drawCaret: function (t, e) {
                        var n = this._chart.ctx, i = this._view, a = this.getCaretPosition(t, e, i);
                        n.lineTo(a.x1, a.y1), n.lineTo(a.x2, a.y2), n.lineTo(a.x3, a.y3)
                    }, getCaretPosition: function (t, e, n) {
                        var i, a, o, r, l, s, u = n.caretSize, d = n.cornerRadius, c = n.xAlign, h = n.yAlign, f = t.x,
                            g = t.y, p = e.width, v = e.height;
                        if ("center" === h) l = g + v / 2, "left" === c ? (a = (i = f) - u, o = i, r = l + u, s = l - u) : (a = (i = f + p) + u, o = i, r = l - u, s = l + u); else if ("left" === c ? (i = (a = f + d + u) - u, o = a + u) : "right" === c ? (i = (a = f + p - d - u) - u, o = a + u) : (i = (a = f + p / 2) - u, o = a + u), "top" === h) l = (r = g) - u, s = r; else {
                            l = (r = g + v) + u, s = r;
                            var m = o;
                            o = i, i = m
                        }
                        return {x1: i, x2: a, x3: o, y1: r, y2: l, y3: s}
                    }, drawTitle: function (t, n, i, a) {
                        var r = n.title;
                        if (r.length) {
                            i.textAlign = n._titleAlign, i.textBaseline = "top";
                            var l = n.titleFontSize, s = n.titleSpacing;
                            i.fillStyle = e(n.titleFontColor, a), i.font = o.fontString(l, n._titleFontStyle, n._titleFontFamily);
                            var u, d;
                            for (u = 0, d = r.length; u < d; ++u) i.fillText(r[u], t.x, t.y), t.y += l + s, u + 1 === r.length && (t.y += n.titleMarginBottom - s)
                        }
                    }, drawBody: function (t, n, i, a) {
                        var r = n.bodyFontSize, l = n.bodySpacing, s = n.body;
                        i.textAlign = n._bodyAlign, i.textBaseline = "top", i.font = o.fontString(r, n._bodyFontStyle, n._bodyFontFamily);
                        var u = 0, d = function (e) {
                            i.fillText(e, t.x + u, t.y), t.y += r + l
                        };
                        o.each(n.beforeBody, d);
                        var c = n.displayColors;
                        u = c ? r + 2 : 0, o.each(s, function (l, s) {
                            o.each(l.before, d), o.each(l.lines, function (o) {
                                if (c) {
                                    i.fillStyle = e(n.legendColorBackground, a), i.fillRect(t.x, t.y, r, r), i.lineWidth = 1, i.strokeStyle = e(n.labelColors[s].borderColor, a), i.strokeRect(t.x, t.y, r, r), i.fillStyle = e(n.labelColors[s].backgroundColor, a), i.fillRect(t.x + 1, t.y + 1, r - 2, r - 2);
                                    var l = e(n.labelTextColors[s], a);
                                    i.fillStyle = l
                                }
                                d(o)
                            }), o.each(l.after, d)
                        }), u = 0, o.each(n.afterBody, d), t.y -= l
                    }, drawFooter: function (t, n, i, a) {
                        var r = n.footer;
                        r.length && (t.y += n.footerMarginTop, i.textAlign = n._footerAlign, i.textBaseline = "top", i.fillStyle = e(n.footerFontColor, a), i.font = o.fontString(n.footerFontSize, n._footerFontStyle, n._footerFontFamily), o.each(r, function (e) {
                            i.fillText(e, t.x, t.y), t.y += n.footerFontSize + n.footerSpacing
                        }))
                    }, drawBackground: function (t, n, i, a, o) {
                        i.fillStyle = e(n.backgroundColor, o), i.strokeStyle = e(n.borderColor, o), i.lineWidth = n.borderWidth;
                        var r = n.xAlign, l = n.yAlign, s = t.x, u = t.y, d = a.width, c = a.height, h = n.cornerRadius;
                        i.beginPath(), i.moveTo(s + h, u), "top" === l && this.drawCaret(t, a), i.lineTo(s + d - h, u), i.quadraticCurveTo(s + d, u, s + d, u + h), "center" === l && "right" === r && this.drawCaret(t, a), i.lineTo(s + d, u + c - h), i.quadraticCurveTo(s + d, u + c, s + d - h, u + c), "bottom" === l && this.drawCaret(t, a), i.lineTo(s + h, u + c), i.quadraticCurveTo(s, u + c, s, u + c - h), "center" === l && "left" === r && this.drawCaret(t, a), i.lineTo(s, u + h), i.quadraticCurveTo(s, u, s + h, u), i.closePath(), i.fill(), n.borderWidth > 0 && i.stroke()
                    }, draw: function () {
                        var t = this._chart.ctx, e = this._view;
                        if (0 !== e.opacity) {
                            var n = {width: e.width, height: e.height}, i = {x: e.x, y: e.y},
                                a = Math.abs(e.opacity < .001) ? 0 : e.opacity,
                                o = e.title.length || e.beforeBody.length || e.body.length || e.afterBody.length || e.footer.length;
                            this._options.enabled && o && (this.drawBackground(i, e, t, n, a), i.x += e.xPadding, i.y += e.yPadding, this.drawTitle(i, e, t, a), this.drawBody(i, e, t, a), this.drawFooter(i, e, t, a))
                        }
                    }, handleEvent: function (t) {
                        var e = this, n = e._options, i = !1;
                        if (e._lastActive = e._lastActive || [], "mouseout" === t.type ? e._active = [] : e._active = e._chart.getElementsAtEventForMode(t, n.mode, n), !(i = !o.arrayEquals(e._active, e._lastActive))) return !1;
                        if (e._lastActive = e._active, n.enabled || n.custom) {
                            e._eventPosition = {x: t.x, y: t.y};
                            var a = e._model;
                            e.update(!0), e.pivot(), i |= a.x !== e._model.x || a.y !== e._model.y
                        }
                        return i
                    }
                }), t.Tooltip.positioners = {
                    average: function (t) {
                        if (!t.length) return !1;
                        var e, n, i = 0, a = 0, o = 0;
                        for (e = 0, n = t.length; e < n; ++e) {
                            var r = t[e];
                            if (r && r.hasValue()) {
                                var l = r.tooltipPosition();
                                i += l.x, a += l.y, ++o
                            }
                        }
                        return {x: Math.round(i / o), y: Math.round(a / o)}
                    }, nearest: function (t, e) {
                        var n, i, a, r = e.x, l = e.y, s = Number.POSITIVE_INFINITY;
                        for (n = 0, i = t.length; n < i; ++n) {
                            var u = t[n];
                            if (u && u.hasValue()) {
                                var d = u.getCenterPoint(), c = o.distanceBetweenPoints(e, d);
                                c < s && (s = c, a = u)
                            }
                        }
                        if (a) {
                            var h = a.tooltipPosition();
                            r = h.x, l = h.y
                        }
                        return {x: r, y: l}
                    }
                }
            }
        }, {25: 25, 26: 26, 45: 45}], 36: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {
                elements: {
                    arc: {
                        backgroundColor: i.global.defaultColor,
                        borderColor: "#fff",
                        borderWidth: 2
                    }
                }
            }), e.exports = a.extend({
                inLabelRange: function (t) {
                    var e = this._view;
                    return !!e && Math.pow(t - e.x, 2) < Math.pow(e.radius + e.hoverRadius, 2)
                }, inRange: function (t, e) {
                    var n = this._view;
                    if (n) {
                        for (var i = o.getAngleFromPoint(n, {
                            x: t,
                            y: e
                        }), a = i.angle, r = i.distance, l = n.startAngle, s = n.endAngle; s < l;) s += 2 * Math.PI;
                        for (; a > s;) a -= 2 * Math.PI;
                        for (; a < l;) a += 2 * Math.PI;
                        var u = a >= l && a <= s, d = r >= n.innerRadius && r <= n.outerRadius;
                        return u && d
                    }
                    return !1
                }, getCenterPoint: function () {
                    var t = this._view, e = (t.startAngle + t.endAngle) / 2, n = (t.innerRadius + t.outerRadius) / 2;
                    return {x: t.x + Math.cos(e) * n, y: t.y + Math.sin(e) * n}
                }, getArea: function () {
                    var t = this._view;
                    return Math.PI * ((t.endAngle - t.startAngle) / (2 * Math.PI)) * (Math.pow(t.outerRadius, 2) - Math.pow(t.innerRadius, 2))
                }, tooltipPosition: function () {
                    var t = this._view, e = t.startAngle + (t.endAngle - t.startAngle) / 2,
                        n = (t.outerRadius - t.innerRadius) / 2 + t.innerRadius;
                    return {x: t.x + Math.cos(e) * n, y: t.y + Math.sin(e) * n}
                }, draw: function () {
                    var t = this._chart.ctx, e = this._view, n = e.startAngle, i = e.endAngle;
                    t.beginPath(), t.arc(e.x, e.y, e.outerRadius, n, i), t.arc(e.x, e.y, e.innerRadius, i, n, !0), t.closePath(), t.strokeStyle = e.borderColor, t.lineWidth = e.borderWidth, t.fillStyle = e.backgroundColor, t.fill(), t.lineJoin = "bevel", e.borderWidth && t.stroke()
                }
            })
        }, {25: 25, 26: 26, 45: 45}], 37: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45), r = i.global;
            i._set("global", {
                elements: {
                    line: {
                        tension: .4,
                        backgroundColor: r.defaultColor,
                        borderWidth: 3,
                        borderColor: r.defaultColor,
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0,
                        borderJoinStyle: "miter",
                        capBezierPoints: !0,
                        fill: !0
                    }
                }
            }), e.exports = a.extend({
                draw: function () {
                    var t, e, n, i, a = this, l = a._view, s = a._chart.ctx, u = l.spanGaps, d = a._children.slice(),
                        c = r.elements.line, h = -1;
                    for (a._loop && d.length && d.push(d[0]), s.save(), s.lineCap = l.borderCapStyle || c.borderCapStyle, s.setLineDash && s.setLineDash(l.borderDash || c.borderDash), s.lineDashOffset = l.borderDashOffset || c.borderDashOffset, s.lineJoin = l.borderJoinStyle || c.borderJoinStyle, s.lineWidth = l.borderWidth || c.borderWidth, s.strokeStyle = l.borderColor || r.defaultColor, s.beginPath(), h = -1, t = 0; t < d.length; ++t) e = d[t], n = o.previousItem(d, t), i = e._view, 0 === t ? i.skip || (s.moveTo(i.x, i.y), h = t) : (n = -1 === h ? n : d[h], i.skip || (h !== t - 1 && !u || -1 === h ? s.moveTo(i.x, i.y) : o.canvas.lineTo(s, n._view, e._view), h = t));
                    s.stroke(), s.restore()
                }
            })
        }, {25: 25, 26: 26, 45: 45}], 38: [function (t, e, n) {
            "use strict";

            function i(t) {
                var e = this._view;
                return !!e && Math.pow(t - e.x, 2) < Math.pow(e.radius + e.hitRadius, 2)
            }

            var a = t(25), o = t(26), r = t(45), l = a.global.defaultColor;
            a._set("global", {
                elements: {
                    point: {
                        radius: 3,
                        pointStyle: "circle",
                        backgroundColor: l,
                        borderColor: l,
                        borderWidth: 1,
                        hitRadius: 1,
                        hoverRadius: 4,
                        hoverBorderWidth: 1
                    }
                }
            }), e.exports = o.extend({
                inRange: function (t, e) {
                    var n = this._view;
                    return !!n && Math.pow(t - n.x, 2) + Math.pow(e - n.y, 2) < Math.pow(n.hitRadius + n.radius, 2)
                }, inLabelRange: i, inXRange: i, inYRange: function (t) {
                    var e = this._view;
                    return !!e && Math.pow(t - e.y, 2) < Math.pow(e.radius + e.hitRadius, 2)
                }, getCenterPoint: function () {
                    var t = this._view;
                    return {x: t.x, y: t.y}
                }, getArea: function () {
                    return Math.PI * Math.pow(this._view.radius, 2)
                }, tooltipPosition: function () {
                    var t = this._view;
                    return {x: t.x, y: t.y, padding: t.radius + t.borderWidth}
                }, draw: function (t) {
                    var e = this._view, n = this._model, i = this._chart.ctx, o = e.pointStyle, s = e.radius, u = e.x,
                        d = e.y, c = r.color, h = 0;
                    e.skip || (i.strokeStyle = e.borderColor || l, i.lineWidth = r.valueOrDefault(e.borderWidth, a.global.elements.point.borderWidth), i.fillStyle = e.backgroundColor || l, void 0 !== t && (n.x < t.left || 1.01 * t.right < n.x || n.y < t.top || 1.01 * t.bottom < n.y) && (n.x < t.left ? h = (u - n.x) / (t.left - n.x) : 1.01 * t.right < n.x ? h = (n.x - u) / (n.x - t.right) : n.y < t.top ? h = (d - n.y) / (t.top - n.y) : 1.01 * t.bottom < n.y && (h = (n.y - d) / (n.y - t.bottom)), h = Math.round(100 * h) / 100, i.strokeStyle = c(i.strokeStyle).alpha(h).rgbString(), i.fillStyle = c(i.fillStyle).alpha(h).rgbString()), r.canvas.drawPoint(i, o, s, u, d))
                }
            })
        }, {25: 25, 26: 26, 45: 45}], 39: [function (t, e, n) {
            "use strict";

            function i(t) {
                return void 0 !== t._view.width
            }

            function a(t) {
                var e, n, a, o, r = t._view;
                if (i(t)) {
                    var l = r.width / 2;
                    e = r.x - l, n = r.x + l, a = Math.min(r.y, r.base), o = Math.max(r.y, r.base)
                } else {
                    var s = r.height / 2;
                    e = Math.min(r.x, r.base), n = Math.max(r.x, r.base), a = r.y - s, o = r.y + s
                }
                return {left: e, top: a, right: n, bottom: o}
            }

            var o = t(25), r = t(26);
            o._set("global", {
                elements: {
                    rectangle: {
                        backgroundColor: o.global.defaultColor,
                        borderColor: o.global.defaultColor,
                        borderSkipped: "bottom",
                        borderWidth: 0
                    }
                }
            }), e.exports = r.extend({
                draw: function () {
                    function t(t) {
                        return m[(b + t) % 4]
                    }

                    var e, n, i, a, o, r, l, s = this._chart.ctx, u = this._view, d = u.borderWidth;
                    if (u.horizontal ? (e = u.base, n = u.x, i = u.y - u.height / 2, a = u.y + u.height / 2, o = n > e ? 1 : -1, r = 1, l = u.borderSkipped || "left") : (e = u.x - u.width / 2, n = u.x + u.width / 2, i = u.y, o = 1, r = (a = u.base) > i ? 1 : -1, l = u.borderSkipped || "bottom"), d) {
                        var c = Math.min(Math.abs(e - n), Math.abs(i - a)), h = (d = d > c ? c : d) / 2,
                            f = e + ("left" !== l ? h * o : 0), g = n + ("right" !== l ? -h * o : 0),
                            p = i + ("top" !== l ? h * r : 0), v = a + ("bottom" !== l ? -h * r : 0);
                        f !== g && (i = p, a = v), p !== v && (e = f, n = g)
                    }
                    s.beginPath(), s.fillStyle = u.backgroundColor, s.strokeStyle = u.borderColor, s.lineWidth = d;
                    var m = [[e, a], [e, i], [n, i], [n, a]], b = ["bottom", "left", "top", "right"].indexOf(l, 0);
                    -1 === b && (b = 0);
                    var x = t(0);
                    s.moveTo(x[0], x[1]);
                    for (var y = 1; y < 4; y++) x = t(y), s.lineTo(x[0], x[1]);
                    s.fill(), d && s.stroke()
                }, height: function () {
                    var t = this._view;
                    return t.base - t.y
                }, inRange: function (t, e) {
                    var n = !1;
                    if (this._view) {
                        var i = a(this);
                        n = t >= i.left && t <= i.right && e >= i.top && e <= i.bottom
                    }
                    return n
                }, inLabelRange: function (t, e) {
                    var n = this;
                    if (!n._view) return !1;
                    var o = a(n);
                    return i(n) ? t >= o.left && t <= o.right : e >= o.top && e <= o.bottom
                }, inXRange: function (t) {
                    var e = a(this);
                    return t >= e.left && t <= e.right
                }, inYRange: function (t) {
                    var e = a(this);
                    return t >= e.top && t <= e.bottom
                }, getCenterPoint: function () {
                    var t, e, n = this._view;
                    return i(this) ? (t = n.x, e = (n.y + n.base) / 2) : (t = (n.x + n.base) / 2, e = n.y), {x: t, y: e}
                }, getArea: function () {
                    var t = this._view;
                    return t.width * Math.abs(t.y - t.base)
                }, tooltipPosition: function () {
                    var t = this._view;
                    return {x: t.x, y: t.y}
                }
            })
        }, {25: 25, 26: 26}], 40: [function (t, e, n) {
            "use strict";
            e.exports = {}, e.exports.Arc = t(36), e.exports.Line = t(37), e.exports.Point = t(38), e.exports.Rectangle = t(39)
        }, {36: 36, 37: 37, 38: 38, 39: 39}], 41: [function (t, e, n) {
            "use strict";
            var i = t(42), n = e.exports = {
                clear: function (t) {
                    t.ctx.clearRect(0, 0, t.width, t.height)
                }, roundedRect: function (t, e, n, i, a, o) {
                    if (o) {
                        var r = Math.min(o, i / 2), l = Math.min(o, a / 2);
                        t.moveTo(e + r, n), t.lineTo(e + i - r, n), t.quadraticCurveTo(e + i, n, e + i, n + l), t.lineTo(e + i, n + a - l), t.quadraticCurveTo(e + i, n + a, e + i - r, n + a), t.lineTo(e + r, n + a), t.quadraticCurveTo(e, n + a, e, n + a - l), t.lineTo(e, n + l), t.quadraticCurveTo(e, n, e + r, n)
                    } else t.rect(e, n, i, a)
                }, drawPoint: function (t, e, n, i, a) {
                    var o, r, l, s, u, d;
                    if ("object" != typeof e || "[object HTMLImageElement]" !== (o = e.toString()) && "[object HTMLCanvasElement]" !== o) {
                        if (!(isNaN(n) || n <= 0)) {
                            switch (e) {
                                default:
                                    t.beginPath(), t.arc(i, a, n, 0, 2 * Math.PI), t.closePath(), t.fill();
                                    break;
                                case"triangle":
                                    t.beginPath(), u = (r = 3 * n / Math.sqrt(3)) * Math.sqrt(3) / 2, t.moveTo(i - r / 2, a + u / 3), t.lineTo(i + r / 2, a + u / 3), t.lineTo(i, a - 2 * u / 3), t.closePath(), t.fill();
                                    break;
                                case"rect":
                                    d = 1 / Math.SQRT2 * n, t.beginPath(), t.fillRect(i - d, a - d, 2 * d, 2 * d), t.strokeRect(i - d, a - d, 2 * d, 2 * d);
                                    break;
                                case"rectRounded":
                                    var c = n / Math.SQRT2, h = i - c, f = a - c, g = Math.SQRT2 * n;
                                    t.beginPath(), this.roundedRect(t, h, f, g, g, n / 2), t.closePath(), t.fill();
                                    break;
                                case"rectRot":
                                    d = 1 / Math.SQRT2 * n, t.beginPath(), t.moveTo(i - d, a), t.lineTo(i, a + d), t.lineTo(i + d, a), t.lineTo(i, a - d), t.closePath(), t.fill();
                                    break;
                                case"cross":
                                    t.beginPath(), t.moveTo(i, a + n), t.lineTo(i, a - n), t.moveTo(i - n, a), t.lineTo(i + n, a), t.closePath();
                                    break;
                                case"crossRot":
                                    t.beginPath(), l = Math.cos(Math.PI / 4) * n, s = Math.sin(Math.PI / 4) * n, t.moveTo(i - l, a - s), t.lineTo(i + l, a + s), t.moveTo(i - l, a + s), t.lineTo(i + l, a - s), t.closePath();
                                    break;
                                case"star":
                                    t.beginPath(), t.moveTo(i, a + n), t.lineTo(i, a - n), t.moveTo(i - n, a), t.lineTo(i + n, a), l = Math.cos(Math.PI / 4) * n, s = Math.sin(Math.PI / 4) * n, t.moveTo(i - l, a - s), t.lineTo(i + l, a + s), t.moveTo(i - l, a + s), t.lineTo(i + l, a - s), t.closePath();
                                    break;
                                case"line":
                                    t.beginPath(), t.moveTo(i - n, a), t.lineTo(i + n, a), t.closePath();
                                    break;
                                case"dash":
                                    t.beginPath(), t.moveTo(i, a), t.lineTo(i + n, a), t.closePath()
                            }
                            t.stroke()
                        }
                    } else t.drawImage(e, i - e.width / 2, a - e.height / 2, e.width, e.height)
                }, clipArea: function (t, e) {
                    t.save(), t.beginPath(), t.rect(e.left, e.top, e.right - e.left, e.bottom - e.top), t.clip()
                }, unclipArea: function (t) {
                    t.restore()
                }, lineTo: function (t, e, n, i) {
                    if (n.steppedLine) return "after" === n.steppedLine && !i || "after" !== n.steppedLine && i ? t.lineTo(e.x, n.y) : t.lineTo(n.x, e.y), void t.lineTo(n.x, n.y);
                    n.tension ? t.bezierCurveTo(i ? e.controlPointPreviousX : e.controlPointNextX, i ? e.controlPointPreviousY : e.controlPointNextY, i ? n.controlPointNextX : n.controlPointPreviousX, i ? n.controlPointNextY : n.controlPointPreviousY, n.x, n.y) : t.lineTo(n.x, n.y)
                }
            };
            i.clear = n.clear, i.drawRoundedRectangle = function (t) {
                t.beginPath(), n.roundedRect.apply(n, arguments), t.closePath()
            }
        }, {42: 42}], 42: [function (t, e, n) {
            "use strict";
            var i = {
                noop: function () {
                }, uid: function () {
                    var t = 0;
                    return function () {
                        return t++
                    }
                }(), isNullOrUndef: function (t) {
                    return null === t || void 0 === t
                }, isArray: Array.isArray ? Array.isArray : function (t) {
                    return "[object Array]" === Object.prototype.toString.call(t)
                }, isObject: function (t) {
                    return null !== t && "[object Object]" === Object.prototype.toString.call(t)
                }, valueOrDefault: function (t, e) {
                    return void 0 === t ? e : t
                }, valueAtIndexOrDefault: function (t, e, n) {
                    return i.valueOrDefault(i.isArray(t) ? t[e] : t, n)
                }, callback: function (t, e, n) {
                    if (t && "function" == typeof t.call) return t.apply(n, e)
                }, each: function (t, e, n, a) {
                    var o, r, l;
                    if (i.isArray(t)) if (r = t.length, a) for (o = r - 1; o >= 0; o--) e.call(n, t[o], o); else for (o = 0; o < r; o++) e.call(n, t[o], o); else if (i.isObject(t)) for (r = (l = Object.keys(t)).length, o = 0; o < r; o++) e.call(n, t[l[o]], l[o])
                }, arrayEquals: function (t, e) {
                    var n, a, o, r;
                    if (!t || !e || t.length !== e.length) return !1;
                    for (n = 0, a = t.length; n < a; ++n) if (o = t[n], r = e[n], o instanceof Array && r instanceof Array) {
                        if (!i.arrayEquals(o, r)) return !1
                    } else if (o !== r) return !1;
                    return !0
                }, clone: function (t) {
                    if (i.isArray(t)) return t.map(i.clone);
                    if (i.isObject(t)) {
                        for (var e = {}, n = Object.keys(t), a = n.length, o = 0; o < a; ++o) e[n[o]] = i.clone(t[n[o]]);
                        return e
                    }
                    return t
                }, _merger: function (t, e, n, a) {
                    var o = e[t], r = n[t];
                    i.isObject(o) && i.isObject(r) ? i.merge(o, r, a) : e[t] = i.clone(r)
                }, _mergerIf: function (t, e, n) {
                    var a = e[t], o = n[t];
                    i.isObject(a) && i.isObject(o) ? i.mergeIf(a, o) : e.hasOwnProperty(t) || (e[t] = i.clone(o))
                }, merge: function (t, e, n) {
                    var a, o, r, l, s, u = i.isArray(e) ? e : [e], d = u.length;
                    if (!i.isObject(t)) return t;
                    for (a = (n = n || {}).merger || i._merger, o = 0; o < d; ++o) if (e = u[o], i.isObject(e)) for (s = 0, l = (r = Object.keys(e)).length; s < l; ++s) a(r[s], t, e, n);
                    return t
                }, mergeIf: function (t, e) {
                    return i.merge(t, e, {merger: i._mergerIf})
                }
            };
            e.exports = i, i.callCallback = i.callback, i.indexOf = function (t, e, n) {
                return Array.prototype.indexOf.call(t, e, n)
            }, i.getValueOrDefault = i.valueOrDefault, i.getValueAtIndexOrDefault = i.valueAtIndexOrDefault
        }, {}], 43: [function (t, e, n) {
            "use strict";
            var i = t(42), a = {
                linear: function (t) {
                    return t
                }, easeInQuad: function (t) {
                    return t * t
                }, easeOutQuad: function (t) {
                    return -t * (t - 2)
                }, easeInOutQuad: function (t) {
                    return (t /= .5) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
                }, easeInCubic: function (t) {
                    return t * t * t
                }, easeOutCubic: function (t) {
                    return (t -= 1) * t * t + 1
                }, easeInOutCubic: function (t) {
                    return (t /= .5) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
                }, easeInQuart: function (t) {
                    return t * t * t * t
                }, easeOutQuart: function (t) {
                    return -((t -= 1) * t * t * t - 1)
                }, easeInOutQuart: function (t) {
                    return (t /= .5) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
                }, easeInQuint: function (t) {
                    return t * t * t * t * t
                }, easeOutQuint: function (t) {
                    return (t -= 1) * t * t * t * t + 1
                }, easeInOutQuint: function (t) {
                    return (t /= .5) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
                }, easeInSine: function (t) {
                    return 1 - Math.cos(t * (Math.PI / 2))
                }, easeOutSine: function (t) {
                    return Math.sin(t * (Math.PI / 2))
                }, easeInOutSine: function (t) {
                    return -.5 * (Math.cos(Math.PI * t) - 1)
                }, easeInExpo: function (t) {
                    return 0 === t ? 0 : Math.pow(2, 10 * (t - 1))
                }, easeOutExpo: function (t) {
                    return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
                }, easeInOutExpo: function (t) {
                    return 0 === t ? 0 : 1 === t ? 1 : (t /= .5) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * --t))
                }, easeInCirc: function (t) {
                    return t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1)
                }, easeOutCirc: function (t) {
                    return Math.sqrt(1 - (t -= 1) * t)
                }, easeInOutCirc: function (t) {
                    return (t /= .5) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
                }, easeInElastic: function (t) {
                    var e = 1.70158, n = 0, i = 1;
                    return 0 === t ? 0 : 1 === t ? 1 : (n || (n = .3), i < 1 ? (i = 1, e = n / 4) : e = n / (2 * Math.PI) * Math.asin(1 / i), -i * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / n))
                }, easeOutElastic: function (t) {
                    var e = 1.70158, n = 0, i = 1;
                    return 0 === t ? 0 : 1 === t ? 1 : (n || (n = .3), i < 1 ? (i = 1, e = n / 4) : e = n / (2 * Math.PI) * Math.asin(1 / i), i * Math.pow(2, -10 * t) * Math.sin((t - e) * (2 * Math.PI) / n) + 1)
                }, easeInOutElastic: function (t) {
                    var e = 1.70158, n = 0, i = 1;
                    return 0 === t ? 0 : 2 == (t /= .5) ? 1 : (n || (n = .45), i < 1 ? (i = 1, e = n / 4) : e = n / (2 * Math.PI) * Math.asin(1 / i), t < 1 ? i * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / n) * -.5 : i * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / n) * .5 + 1)
                }, easeInBack: function (t) {
                    var e = 1.70158;
                    return t * t * ((e + 1) * t - e)
                }, easeOutBack: function (t) {
                    var e = 1.70158;
                    return (t -= 1) * t * ((e + 1) * t + e) + 1
                }, easeInOutBack: function (t) {
                    var e = 1.70158;
                    return (t /= .5) < 1 ? t * t * ((1 + (e *= 1.525)) * t - e) * .5 : .5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2)
                }, easeInBounce: function (t) {
                    return 1 - a.easeOutBounce(1 - t)
                }, easeOutBounce: function (t) {
                    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                }, easeInOutBounce: function (t) {
                    return t < .5 ? .5 * a.easeInBounce(2 * t) : .5 * a.easeOutBounce(2 * t - 1) + .5
                }
            };
            e.exports = {effects: a}, i.easingEffects = a
        }, {42: 42}], 44: [function (t, e, n) {
            "use strict";
            var i = t(42);
            e.exports = {
                toLineHeight: function (t, e) {
                    var n = ("" + t).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
                    if (!n || "normal" === n[1]) return 1.2 * e;
                    switch (t = +n[2], n[3]) {
                        case"px":
                            return t;
                        case"%":
                            t /= 100
                    }
                    return e * t
                }, toPadding: function (t) {
                    var e, n, a, o;
                    return i.isObject(t) ? (e = +t.top || 0, n = +t.right || 0, a = +t.bottom || 0, o = +t.left || 0) : e = n = a = o = +t || 0, {
                        top: e,
                        right: n,
                        bottom: a,
                        left: o,
                        height: e + a,
                        width: o + n
                    }
                }, resolve: function (t, e, n) {
                    var a, o, r;
                    for (a = 0, o = t.length; a < o; ++a) if (void 0 !== (r = t[a]) && (void 0 !== e && "function" == typeof r && (r = r(e)), void 0 !== n && i.isArray(r) && (r = r[n]), void 0 !== r)) return r
                }
            }
        }, {42: 42}], 45: [function (t, e, n) {
            "use strict";
            e.exports = t(42), e.exports.easing = t(43), e.exports.canvas = t(41), e.exports.options = t(44)
        }, {41: 41, 42: 42, 43: 43, 44: 44}], 46: [function (t, e, n) {
            e.exports = {
                acquireContext: function (t) {
                    return t && t.canvas && (t = t.canvas), t && t.getContext("2d") || null
                }
            }
        }, {}], 47: [function (t, e, n) {
            "use strict";

            function i(t, e) {
                var n = v.getStyle(t, e), i = n && n.match(/^(\d+)(\.\d+)?px$/);
                return i ? Number(i[1]) : void 0
            }

            function a(t, e) {
                var n = t.style, a = t.getAttribute("height"), o = t.getAttribute("width");
                if (t[m] = {
                    initial: {
                        height: a,
                        width: o,
                        style: {display: n.display, height: n.height, width: n.width}
                    }
                }, n.display = n.display || "block", null === o || "" === o) {
                    var r = i(t, "width");
                    void 0 !== r && (t.width = r)
                }
                if (null === a || "" === a) if ("" === t.style.height) t.height = t.width / (e.options.aspectRatio || 2); else {
                    var l = i(t, "height");
                    void 0 !== r && (t.height = l)
                }
                return t
            }

            function o(t, e, n) {
                t.addEventListener(e, n, M)
            }

            function r(t, e, n) {
                t.removeEventListener(e, n, M)
            }

            function l(t, e, n, i, a) {
                return {type: t, chart: e, native: a || null, x: void 0 !== n ? n : null, y: void 0 !== i ? i : null}
            }

            function s(t, e) {
                var n = w[t.type] || t.type, i = v.getRelativePosition(t, e);
                return l(n, e, i.x, i.y, t)
            }

            function u(t, e) {
                var n = !1, i = [];
                return function () {
                    i = Array.prototype.slice.call(arguments), e = e || this, n || (n = !0, v.requestAnimFrame.call(window, function () {
                        n = !1, t.apply(e, i)
                    }))
                }
            }

            function d(t) {
                var e = document.createElement("div"), n = b + "size-monitor",
                    i = "position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;";
                e.style.cssText = i, e.className = n, e.innerHTML = '<div class="' + n + '-expand" style="' + i + '"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="' + n + '-shrink" style="' + i + '"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div>';
                var a = e.childNodes[0], r = e.childNodes[1];
                e._reset = function () {
                    a.scrollLeft = 1e6, a.scrollTop = 1e6, r.scrollLeft = 1e6, r.scrollTop = 1e6
                };
                var l = function () {
                    e._reset(), t()
                };
                return o(a, "scroll", l.bind(a, "expand")), o(r, "scroll", l.bind(r, "shrink")), e
            }

            function c(t, e) {
                var n = (t[m] || (t[m] = {})).renderProxy = function (t) {
                    t.animationName === y && e()
                };
                v.each(k, function (e) {
                    o(t, e, n)
                }), t.classList.add(x)
            }

            function h(t) {
                var e = t[m] || {}, n = e.renderProxy;
                n && (v.each(k, function (e) {
                    r(t, e, n)
                }), delete e.renderProxy), t.classList.remove(x)
            }

            function f(t, e, n) {
                var i = t[m] || (t[m] = {}), a = i.resizer = d(u(function () {
                    if (i.resizer) return e(l("resize", n))
                }));
                c(t, function () {
                    if (i.resizer) {
                        var e = t.parentNode;
                        e && e !== a.parentNode && e.insertBefore(a, e.firstChild), a._reset()
                    }
                })
            }

            function g(t) {
                var e = t[m] || {}, n = e.resizer;
                delete e.resizer, h(t), n && n.parentNode && n.parentNode.removeChild(n)
            }

            function p(t, e) {
                var n = t._style || document.createElement("style");
                t._style || (t._style = n, e = "/* Chart.js */\n" + e, n.setAttribute("type", "text/css"), document.getElementsByTagName("head")[0].appendChild(n)), n.appendChild(document.createTextNode(e))
            }

            var v = t(45), m = "$chartjs", b = "chartjs-", x = b + "render-monitor", y = b + "render-animation",
                k = ["animationstart", "webkitAnimationStart"], w = {
                    touchstart: "mousedown",
                    touchmove: "mousemove",
                    touchend: "mouseup",
                    pointerenter: "mouseenter",
                    pointerdown: "mousedown",
                    pointermove: "mousemove",
                    pointerup: "mouseup",
                    pointerleave: "mouseout",
                    pointerout: "mouseout"
                }, M = !!function () {
                    var t = !1;
                    try {
                        var e = Object.defineProperty({}, "passive", {
                            get: function () {
                                t = !0
                            }
                        });
                        window.addEventListener("e", null, e)
                    } catch (t) {
                    }
                    return t
                }() && {passive: !0};
            e.exports = {
                _enabled: "undefined" != typeof window && "undefined" != typeof document,
                initialize: function () {
                    var t = "from{opacity:0.99}to{opacity:1}";
                    p(this, "@-webkit-keyframes " + y + "{" + t + "}@keyframes " + y + "{" + t + "}." + x + "{-webkit-animation:" + y + " 0.001s;animation:" + y + " 0.001s;}")
                },
                acquireContext: function (t, e) {
                    "string" == typeof t ? t = document.getElementById(t) : t.length && (t = t[0]), t && t.canvas && (t = t.canvas);
                    var n = t && t.getContext && t.getContext("2d");
                    return n && n.canvas === t ? (a(t, e), n) : null
                },
                releaseContext: function (t) {
                    var e = t.canvas;
                    if (e[m]) {
                        var n = e[m].initial;
                        ["height", "width"].forEach(function (t) {
                            var i = n[t];
                            v.isNullOrUndef(i) ? e.removeAttribute(t) : e.setAttribute(t, i)
                        }), v.each(n.style || {}, function (t, n) {
                            e.style[n] = t
                        }), e.width = e.width, delete e[m]
                    }
                },
                addEventListener: function (t, e, n) {
                    var i = t.canvas;
                    if ("resize" !== e) {
                        var a = n[m] || (n[m] = {});
                        o(i, e, (a.proxies || (a.proxies = {}))[t.id + "_" + e] = function (e) {
                            n(s(e, t))
                        })
                    } else f(i, n, t)
                },
                removeEventListener: function (t, e, n) {
                    var i = t.canvas;
                    if ("resize" !== e) {
                        var a = ((n[m] || {}).proxies || {})[t.id + "_" + e];
                        a && r(i, e, a)
                    } else g(i)
                }
            }, v.addEvent = o, v.removeEvent = r
        }, {45: 45}], 48: [function (t, e, n) {
            "use strict";
            var i = t(45), a = t(46), o = t(47), r = o._enabled ? o : a;
            e.exports = i.extend({
                initialize: function () {
                }, acquireContext: function () {
                }, releaseContext: function () {
                }, addEventListener: function () {
                }, removeEventListener: function () {
                }
            }, r)
        }, {45: 45, 46: 46, 47: 47}], 49: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(40), o = t(45);
            i._set("global", {plugins: {filler: {propagate: !0}}}), e.exports = function () {
                function t(t, e, n) {
                    var i, a = t._model || {}, o = a.fill;
                    if (void 0 === o && (o = !!a.backgroundColor), !1 === o || null === o) return !1;
                    if (!0 === o) return "origin";
                    if (i = parseFloat(o, 10), isFinite(i) && Math.floor(i) === i) return "-" !== o[0] && "+" !== o[0] || (i = e + i), !(i === e || i < 0 || i >= n) && i;
                    switch (o) {
                        case"bottom":
                            return "start";
                        case"top":
                            return "end";
                        case"zero":
                            return "origin";
                        case"origin":
                        case"start":
                        case"end":
                            return o;
                        default:
                            return !1
                    }
                }

                function e(t) {
                    var e, n = t.el._model || {}, i = t.el._scale || {}, a = t.fill, o = null;
                    if (isFinite(a)) return null;
                    if ("start" === a ? o = void 0 === n.scaleBottom ? i.bottom : n.scaleBottom : "end" === a ? o = void 0 === n.scaleTop ? i.top : n.scaleTop : void 0 !== n.scaleZero ? o = n.scaleZero : i.getBasePosition ? o = i.getBasePosition() : i.getBasePixel && (o = i.getBasePixel()), void 0 !== o && null !== o) {
                        if (void 0 !== o.x && void 0 !== o.y) return o;
                        if ("number" == typeof o && isFinite(o)) return e = i.isHorizontal(), {
                            x: e ? o : null,
                            y: e ? null : o
                        }
                    }
                    return null
                }

                function n(t, e, n) {
                    var i, a = t[e].fill, o = [e];
                    if (!n) return a;
                    for (; !1 !== a && -1 === o.indexOf(a);) {
                        if (!isFinite(a)) return a;
                        if (!(i = t[a])) return !1;
                        if (i.visible) return a;
                        o.push(a), a = i.fill
                    }
                    return !1
                }

                function r(t) {
                    var e = t.fill, n = "dataset";
                    return !1 === e ? null : (isFinite(e) || (n = "boundary"), d[n](t))
                }

                function l(t) {
                    return t && !t.skip
                }

                function s(t, e, n, i, a) {
                    var r;
                    if (i && a) {
                        for (t.moveTo(e[0].x, e[0].y), r = 1; r < i; ++r) o.canvas.lineTo(t, e[r - 1], e[r]);
                        for (t.lineTo(n[a - 1].x, n[a - 1].y), r = a - 1; r > 0; --r) o.canvas.lineTo(t, n[r], n[r - 1], !0)
                    }
                }

                function u(t, e, n, i, a, o) {
                    var r, u, d, c, h, f, g, p = e.length, v = i.spanGaps, m = [], b = [], x = 0, y = 0;
                    for (t.beginPath(), r = 0, u = p + !!o; r < u; ++r) h = n(c = e[d = r % p]._view, d, i), f = l(c), g = l(h), f && g ? (x = m.push(c), y = b.push(h)) : x && y && (v ? (f && m.push(c), g && b.push(h)) : (s(t, m, b, x, y), x = y = 0, m = [], b = []));
                    s(t, m, b, x, y), t.closePath(), t.fillStyle = a, t.fill()
                }

                var d = {
                    dataset: function (t) {
                        var e = t.fill, n = t.chart, i = n.getDatasetMeta(e),
                            a = i && n.isDatasetVisible(e) && i.dataset._children || [], o = a.length || 0;
                        return o ? function (t, e) {
                            return e < o && a[e]._view || null
                        } : null
                    }, boundary: function (t) {
                        var e = t.boundary, n = e ? e.x : null, i = e ? e.y : null;
                        return function (t) {
                            return {x: null === n ? t.x : n, y: null === i ? t.y : i}
                        }
                    }
                };
                return {
                    id: "filler", afterDatasetsUpdate: function (i, o) {
                        var l, s, u, d, c = (i.data.datasets || []).length, h = o.propagate, f = [];
                        for (s = 0; s < c; ++s) d = null, (u = (l = i.getDatasetMeta(s)).dataset) && u._model && u instanceof a.Line && (d = {
                            visible: i.isDatasetVisible(s),
                            fill: t(u, s, c),
                            chart: i,
                            el: u
                        }), l.$filler = d, f.push(d);
                        for (s = 0; s < c; ++s) (d = f[s]) && (d.fill = n(f, s, h), d.boundary = e(d), d.mapper = r(d))
                    }, beforeDatasetDraw: function (t, e) {
                        var n = e.meta.$filler;
                        if (n) {
                            var a = t.ctx, r = n.el, l = r._view, s = r._children || [], d = n.mapper,
                                c = l.backgroundColor || i.global.defaultColor;
                            d && c && s.length && (o.canvas.clipArea(a, t.chartArea), u(a, s, d, l, c, r._loop), o.canvas.unclipArea(a))
                        }
                    }
                }
            }
        }, {25: 25, 40: 40, 45: 45}], 50: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {
                legend: {
                    display: !0,
                    position: "top",
                    fullWidth: !0,
                    reverse: !1,
                    weight: 1e3,
                    onClick: function (t, e) {
                        var n = e.datasetIndex, i = this.chart, a = i.getDatasetMeta(n);
                        a.hidden = null === a.hidden ? !i.data.datasets[n].hidden : null, i.update()
                    },
                    onHover: null,
                    labels: {
                        boxWidth: 40, padding: 10, generateLabels: function (t) {
                            var e = t.data;
                            return o.isArray(e.datasets) ? e.datasets.map(function (e, n) {
                                return {
                                    text: e.label,
                                    fillStyle: o.isArray(e.backgroundColor) ? e.backgroundColor[0] : e.backgroundColor,
                                    hidden: !t.isDatasetVisible(n),
                                    lineCap: e.borderCapStyle,
                                    lineDash: e.borderDash,
                                    lineDashOffset: e.borderDashOffset,
                                    lineJoin: e.borderJoinStyle,
                                    lineWidth: e.borderWidth,
                                    strokeStyle: e.borderColor,
                                    pointStyle: e.pointStyle,
                                    datasetIndex: n
                                }
                            }, this) : []
                        }
                    }
                }, legendCallback: function (t) {
                    var e = [];
                    e.push('<ul class="' + t.id + '-legend">');
                    for (var n = 0; n < t.data.datasets.length; n++) e.push('<li><span style="background-color:' + t.data.datasets[n].backgroundColor + '"></span>'), t.data.datasets[n].label && e.push(t.data.datasets[n].label), e.push("</li>");
                    return e.push("</ul>"), e.join("")
                }
            }), e.exports = function (t) {
                function e(t, e) {
                    return t.usePointStyle ? e * Math.SQRT2 : t.boxWidth
                }

                function n(e, n) {
                    var i = new t.Legend({ctx: e.ctx, options: n, chart: e});
                    r.configure(e, i, n), r.addBox(e, i), e.legend = i
                }

                var r = t.layoutService, l = o.noop;
                return t.Legend = a.extend({
                    initialize: function (t) {
                        o.extend(this, t), this.legendHitBoxes = [], this.doughnutMode = !1
                    }, beforeUpdate: l, update: function (t, e, n) {
                        var i = this;
                        return i.beforeUpdate(), i.maxWidth = t, i.maxHeight = e, i.margins = n, i.beforeSetDimensions(), i.setDimensions(), i.afterSetDimensions(), i.beforeBuildLabels(), i.buildLabels(), i.afterBuildLabels(), i.beforeFit(), i.fit(), i.afterFit(), i.afterUpdate(), i.minSize
                    }, afterUpdate: l, beforeSetDimensions: l, setDimensions: function () {
                        var t = this;
                        t.isHorizontal() ? (t.width = t.maxWidth, t.left = 0, t.right = t.width) : (t.height = t.maxHeight, t.top = 0, t.bottom = t.height), t.paddingLeft = 0, t.paddingTop = 0, t.paddingRight = 0, t.paddingBottom = 0, t.minSize = {
                            width: 0,
                            height: 0
                        }
                    }, afterSetDimensions: l, beforeBuildLabels: l, buildLabels: function () {
                        var t = this, e = t.options.labels || {}, n = o.callback(e.generateLabels, [t.chart], t) || [];
                        e.filter && (n = n.filter(function (n) {
                            return e.filter(n, t.chart.data)
                        })), t.options.reverse && n.reverse(), t.legendItems = n
                    }, afterBuildLabels: l, beforeFit: l, fit: function () {
                        var t = this, n = t.options, a = n.labels, r = n.display, l = t.ctx, s = i.global,
                            u = o.valueOrDefault, d = u(a.fontSize, s.defaultFontSize),
                            c = u(a.fontStyle, s.defaultFontStyle), h = u(a.fontFamily, s.defaultFontFamily),
                            f = o.fontString(d, c, h), g = t.legendHitBoxes = [], p = t.minSize, v = t.isHorizontal();
                        if (v ? (p.width = t.maxWidth, p.height = r ? 10 : 0) : (p.width = r ? 10 : 0, p.height = t.maxHeight), r) if (l.font = f, v) {
                            var m = t.lineWidths = [0], b = t.legendItems.length ? d + a.padding : 0;
                            l.textAlign = "left", l.textBaseline = "top", o.each(t.legendItems, function (n, i) {
                                var o = e(a, d) + d / 2 + l.measureText(n.text).width;
                                m[m.length - 1] + o + a.padding >= t.width && (b += d + a.padding, m[m.length] = t.left), g[i] = {
                                    left: 0,
                                    top: 0,
                                    width: o,
                                    height: d
                                }, m[m.length - 1] += o + a.padding
                            }), p.height += b
                        } else {
                            var x = a.padding, y = t.columnWidths = [], k = a.padding, w = 0, M = 0, S = d + x;
                            o.each(t.legendItems, function (t, n) {
                                var i = e(a, d) + d / 2 + l.measureText(t.text).width;
                                M + S > p.height && (k += w + a.padding, y.push(w), w = 0, M = 0), w = Math.max(w, i), M += S, g[n] = {
                                    left: 0,
                                    top: 0,
                                    width: i,
                                    height: d
                                }
                            }), k += w, y.push(w), p.width += k
                        }
                        t.width = p.width, t.height = p.height
                    }, afterFit: l, isHorizontal: function () {
                        return "top" === this.options.position || "bottom" === this.options.position
                    }, draw: function () {
                        var t = this, n = t.options, a = n.labels, r = i.global, l = r.elements.line, s = t.width,
                            u = t.lineWidths;
                        if (n.display) {
                            var d, c = t.ctx, h = o.valueOrDefault, f = h(a.fontColor, r.defaultFontColor),
                                g = h(a.fontSize, r.defaultFontSize), p = h(a.fontStyle, r.defaultFontStyle),
                                v = h(a.fontFamily, r.defaultFontFamily), m = o.fontString(g, p, v);
                            c.textAlign = "left", c.textBaseline = "middle", c.lineWidth = .5, c.strokeStyle = f, c.fillStyle = f, c.font = m;
                            var b = e(a, g), x = t.legendHitBoxes, y = function (t, e, i) {
                                if (!(isNaN(b) || b <= 0)) {
                                    c.save(), c.fillStyle = h(i.fillStyle, r.defaultColor), c.lineCap = h(i.lineCap, l.borderCapStyle), c.lineDashOffset = h(i.lineDashOffset, l.borderDashOffset), c.lineJoin = h(i.lineJoin, l.borderJoinStyle), c.lineWidth = h(i.lineWidth, l.borderWidth), c.strokeStyle = h(i.strokeStyle, r.defaultColor);
                                    var a = 0 === h(i.lineWidth, l.borderWidth);
                                    if (c.setLineDash && c.setLineDash(h(i.lineDash, l.borderDash)), n.labels && n.labels.usePointStyle) {
                                        var s = g * Math.SQRT2 / 2, u = s / Math.SQRT2, d = t + u, f = e + u;
                                        o.canvas.drawPoint(c, i.pointStyle, s, d, f)
                                    } else a || c.strokeRect(t, e, b, g), c.fillRect(t, e, b, g);
                                    c.restore()
                                }
                            }, k = function (t, e, n, i) {
                                var a = g / 2, o = b + a + t, r = e + a;
                                c.fillText(n.text, o, r), n.hidden && (c.beginPath(), c.lineWidth = 2, c.moveTo(o, r), c.lineTo(o + i, r), c.stroke())
                            }, w = t.isHorizontal();
                            d = w ? {
                                x: t.left + (s - u[0]) / 2,
                                y: t.top + a.padding,
                                line: 0
                            } : {x: t.left + a.padding, y: t.top + a.padding, line: 0};
                            var M = g + a.padding;
                            o.each(t.legendItems, function (e, n) {
                                var i = c.measureText(e.text).width, o = b + g / 2 + i, r = d.x, l = d.y;
                                w ? r + o >= s && (l = d.y += M, d.line++, r = d.x = t.left + (s - u[d.line]) / 2) : l + M > t.bottom && (r = d.x = r + t.columnWidths[d.line] + a.padding, l = d.y = t.top + a.padding, d.line++), y(r, l, e), x[n].left = r, x[n].top = l, k(r, l, e, i), w ? d.x += o + a.padding : d.y += M
                            })
                        }
                    }, handleEvent: function (t) {
                        var e = this, n = e.options, i = "mouseup" === t.type ? "click" : t.type, a = !1;
                        if ("mousemove" === i) {
                            if (!n.onHover) return
                        } else {
                            if ("click" !== i) return;
                            if (!n.onClick) return
                        }
                        var o = t.x, r = t.y;
                        if (o >= e.left && o <= e.right && r >= e.top && r <= e.bottom) for (var l = e.legendHitBoxes, s = 0; s < l.length; ++s) {
                            var u = l[s];
                            if (o >= u.left && o <= u.left + u.width && r >= u.top && r <= u.top + u.height) {
                                if ("click" === i) {
                                    n.onClick.call(e, t.native, e.legendItems[s]), a = !0;
                                    break
                                }
                                if ("mousemove" === i) {
                                    n.onHover.call(e, t.native, e.legendItems[s]), a = !0;
                                    break
                                }
                            }
                        }
                        return a
                    }
                }), {
                    id: "legend", beforeInit: function (t) {
                        var e = t.options.legend;
                        e && n(t, e)
                    }, beforeUpdate: function (t) {
                        var e = t.options.legend, a = t.legend;
                        e ? (o.mergeIf(e, i.global.legend), a ? (r.configure(t, a, e), a.options = e) : n(t, e)) : a && (r.removeBox(t, a), delete t.legend)
                    }, afterEvent: function (t, e) {
                        var n = t.legend;
                        n && n.handleEvent(e)
                    }
                }
            }
        }, {25: 25, 26: 26, 45: 45}], 51: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(26), o = t(45);
            i._set("global", {
                title: {
                    display: !1,
                    fontStyle: "bold",
                    fullWidth: !0,
                    lineHeight: 1.2,
                    padding: 10,
                    position: "top",
                    text: "",
                    weight: 2e3
                }
            }), e.exports = function (t) {
                function e(e, i) {
                    var a = new t.Title({ctx: e.ctx, options: i, chart: e});
                    n.configure(e, a, i), n.addBox(e, a), e.titleBlock = a
                }

                var n = t.layoutService, r = o.noop;
                return t.Title = a.extend({
                    initialize: function (t) {
                        var e = this;
                        o.extend(e, t), e.legendHitBoxes = []
                    },
                    beforeUpdate: r,
                    update: function (t, e, n) {
                        var i = this;
                        return i.beforeUpdate(), i.maxWidth = t, i.maxHeight = e, i.margins = n, i.beforeSetDimensions(), i.setDimensions(), i.afterSetDimensions(), i.beforeBuildLabels(), i.buildLabels(), i.afterBuildLabels(), i.beforeFit(), i.fit(), i.afterFit(), i.afterUpdate(), i.minSize
                    },
                    afterUpdate: r,
                    beforeSetDimensions: r,
                    setDimensions: function () {
                        var t = this;
                        t.isHorizontal() ? (t.width = t.maxWidth, t.left = 0, t.right = t.width) : (t.height = t.maxHeight, t.top = 0, t.bottom = t.height), t.paddingLeft = 0, t.paddingTop = 0, t.paddingRight = 0, t.paddingBottom = 0, t.minSize = {
                            width: 0,
                            height: 0
                        }
                    },
                    afterSetDimensions: r,
                    beforeBuildLabels: r,
                    buildLabels: r,
                    afterBuildLabels: r,
                    beforeFit: r,
                    fit: function () {
                        var t = this, e = o.valueOrDefault, n = t.options, a = n.display,
                            r = e(n.fontSize, i.global.defaultFontSize), l = t.minSize,
                            s = o.isArray(n.text) ? n.text.length : 1, u = o.options.toLineHeight(n.lineHeight, r),
                            d = a ? s * u + 2 * n.padding : 0;
                        t.isHorizontal() ? (l.width = t.maxWidth, l.height = d) : (l.width = d, l.height = t.maxHeight), t.width = l.width, t.height = l.height
                    },
                    afterFit: r,
                    isHorizontal: function () {
                        var t = this.options.position;
                        return "top" === t || "bottom" === t
                    },
                    draw: function () {
                        var t = this, e = t.ctx, n = o.valueOrDefault, a = t.options, r = i.global;
                        if (a.display) {
                            var l, s, u, d = n(a.fontSize, r.defaultFontSize), c = n(a.fontStyle, r.defaultFontStyle),
                                h = n(a.fontFamily, r.defaultFontFamily), f = o.fontString(d, c, h),
                                g = o.options.toLineHeight(a.lineHeight, d), p = g / 2 + a.padding, v = 0, m = t.top,
                                b = t.left, x = t.bottom, y = t.right;
                            e.fillStyle = n(a.fontColor, r.defaultFontColor), e.font = f, t.isHorizontal() ? (s = b + (y - b) / 2, u = m + p, l = y - b) : (s = "left" === a.position ? b + p : y - p, u = m + (x - m) / 2, l = x - m, v = Math.PI * ("left" === a.position ? -.5 : .5)), e.save(), e.translate(s, u), e.rotate(v), e.textAlign = "center", e.textBaseline = "middle";
                            var k = a.text;
                            if (o.isArray(k)) for (var w = 0, M = 0; M < k.length; ++M) e.fillText(k[M], 0, w, l), w += g; else e.fillText(k, 0, 0, l);
                            e.restore()
                        }
                    }
                }), {
                    id: "title", beforeInit: function (t) {
                        var n = t.options.title;
                        n && e(t, n)
                    }, beforeUpdate: function (a) {
                        var r = a.options.title, l = a.titleBlock;
                        r ? (o.mergeIf(r, i.global.title), l ? (n.configure(a, l, r), l.options = r) : e(a, r)) : l && (t.layoutService.removeBox(a, l), delete a.titleBlock)
                    }
                }
            }
        }, {25: 25, 26: 26, 45: 45}], 52: [function (t, e, n) {
            "use strict";
            e.exports = function (t) {
                var e = {position: "bottom"}, n = t.Scale.extend({
                    getLabels: function () {
                        var t = this.chart.data;
                        return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels
                    }, determineDataLimits: function () {
                        var t = this, e = t.getLabels();
                        t.minIndex = 0, t.maxIndex = e.length - 1;
                        var n;
                        void 0 !== t.options.ticks.min && (n = e.indexOf(t.options.ticks.min), t.minIndex = -1 !== n ? n : t.minIndex), void 0 !== t.options.ticks.max && (n = e.indexOf(t.options.ticks.max), t.maxIndex = -1 !== n ? n : t.maxIndex), t.min = e[t.minIndex], t.max = e[t.maxIndex]
                    }, buildTicks: function () {
                        var t = this, e = t.getLabels();
                        t.ticks = 0 === t.minIndex && t.maxIndex === e.length - 1 ? e : e.slice(t.minIndex, t.maxIndex + 1)
                    }, getLabelForIndex: function (t, e) {
                        var n = this, i = n.chart.data, a = n.isHorizontal();
                        return i.yLabels && !a ? n.getRightValue(i.datasets[e].data[t]) : n.ticks[t - n.minIndex]
                    }, getPixelForValue: function (t, e) {
                        var n, i = this, a = i.options.offset,
                            o = Math.max(i.maxIndex + 1 - i.minIndex - (a ? 0 : 1), 1);
                        if (void 0 !== t && null !== t && (n = i.isHorizontal() ? t.x : t.y), void 0 !== n || void 0 !== t && isNaN(e)) {
                            var r = i.getLabels();
                            t = n || t;
                            var l = r.indexOf(t);
                            e = -1 !== l ? l : e
                        }
                        if (i.isHorizontal()) {
                            var s = i.width / o, u = s * (e - i.minIndex);
                            return a && (u += s / 2), i.left + Math.round(u)
                        }
                        var d = i.height / o, c = d * (e - i.minIndex);
                        return a && (c += d / 2), i.top + Math.round(c)
                    }, getPixelForTick: function (t) {
                        return this.getPixelForValue(this.ticks[t], t + this.minIndex, null)
                    }, getValueForPixel: function (t) {
                        var e = this, n = e.options.offset, i = Math.max(e._ticks.length - (n ? 0 : 1), 1),
                            a = e.isHorizontal(), o = (a ? e.width : e.height) / i;
                        return t -= a ? e.left : e.top, n && (t -= o / 2), (t <= 0 ? 0 : Math.round(t / o)) + e.minIndex
                    }, getBasePixel: function () {
                        return this.bottom
                    }
                });
                t.scaleService.registerScaleType("category", n, e)
            }
        }, {}], 53: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(45), o = t(34);
            e.exports = function (t) {
                var e = {position: "left", ticks: {callback: o.formatters.linear}}, n = t.LinearScaleBase.extend({
                    determineDataLimits: function () {
                        function t(t) {
                            return r ? t.xAxisID === e.id : t.yAxisID === e.id
                        }

                        var e = this, n = e.options, i = e.chart, o = i.data.datasets, r = e.isHorizontal();
                        e.min = null, e.max = null;
                        var l = n.stacked;
                        if (void 0 === l && a.each(o, function (e, n) {
                            if (!l) {
                                var a = i.getDatasetMeta(n);
                                i.isDatasetVisible(n) && t(a) && void 0 !== a.stack && (l = !0)
                            }
                        }), n.stacked || l) {
                            var s = {};
                            a.each(o, function (o, r) {
                                var l = i.getDatasetMeta(r),
                                    u = [l.type, void 0 === n.stacked && void 0 === l.stack ? r : "", l.stack].join(".");
                                void 0 === s[u] && (s[u] = {positiveValues: [], negativeValues: []});
                                var d = s[u].positiveValues, c = s[u].negativeValues;
                                i.isDatasetVisible(r) && t(l) && a.each(o.data, function (t, i) {
                                    var a = +e.getRightValue(t);
                                    isNaN(a) || l.data[i].hidden || (d[i] = d[i] || 0, c[i] = c[i] || 0, n.relativePoints ? d[i] = 100 : a < 0 ? c[i] += a : d[i] += a)
                                })
                            }), a.each(s, function (t) {
                                var n = t.positiveValues.concat(t.negativeValues), i = a.min(n), o = a.max(n);
                                e.min = null === e.min ? i : Math.min(e.min, i), e.max = null === e.max ? o : Math.max(e.max, o)
                            })
                        } else a.each(o, function (n, o) {
                            var r = i.getDatasetMeta(o);
                            i.isDatasetVisible(o) && t(r) && a.each(n.data, function (t, n) {
                                var i = +e.getRightValue(t);
                                isNaN(i) || r.data[n].hidden || (null === e.min ? e.min = i : i < e.min && (e.min = i), null === e.max ? e.max = i : i > e.max && (e.max = i))
                            })
                        });
                        e.min = isFinite(e.min) && !isNaN(e.min) ? e.min : 0, e.max = isFinite(e.max) && !isNaN(e.max) ? e.max : 1, this.handleTickRangeOptions()
                    }, getTickLimit: function () {
                        var t, e = this, n = e.options.ticks;
                        if (e.isHorizontal()) t = Math.min(n.maxTicksLimit ? n.maxTicksLimit : 11, Math.ceil(e.width / 50)); else {
                            var o = a.valueOrDefault(n.fontSize, i.global.defaultFontSize);
                            t = Math.min(n.maxTicksLimit ? n.maxTicksLimit : 11, Math.ceil(e.height / (2 * o)))
                        }
                        return t
                    }, handleDirectionalChanges: function () {
                        this.isHorizontal() || this.ticks.reverse()
                    }, getLabelForIndex: function (t, e) {
                        return +this.getRightValue(this.chart.data.datasets[e].data[t])
                    }, getPixelForValue: function (t) {
                        var e, n = this, i = n.start, a = +n.getRightValue(t), o = n.end - i;
                        return n.isHorizontal() ? (e = n.left + n.width / o * (a - i), Math.round(e)) : (e = n.bottom - n.height / o * (a - i), Math.round(e))
                    }, getValueForPixel: function (t) {
                        var e = this, n = e.isHorizontal(), i = n ? e.width : e.height,
                            a = (n ? t - e.left : e.bottom - t) / i;
                        return e.start + (e.end - e.start) * a
                    }, getPixelForTick: function (t) {
                        return this.getPixelForValue(this.ticksAsNumbers[t])
                    }
                });
                t.scaleService.registerScaleType("linear", n, e)
            }
        }, {25: 25, 34: 34, 45: 45}], 54: [function (t, e, n) {
            "use strict";
            var i = t(45), a = t(34);
            e.exports = function (t) {
                var e = i.noop;
                t.LinearScaleBase = t.Scale.extend({
                    getRightValue: function (e) {
                        return "string" == typeof e ? +e : t.Scale.prototype.getRightValue.call(this, e)
                    }, handleTickRangeOptions: function () {
                        var t = this, e = t.options.ticks;
                        if (e.beginAtZero) {
                            var n = i.sign(t.min), a = i.sign(t.max);
                            n < 0 && a < 0 ? t.max = 0 : n > 0 && a > 0 && (t.min = 0)
                        }
                        var o = void 0 !== e.min || void 0 !== e.suggestedMin,
                            r = void 0 !== e.max || void 0 !== e.suggestedMax;
                        void 0 !== e.min ? t.min = e.min : void 0 !== e.suggestedMin && (null === t.min ? t.min = e.suggestedMin : t.min = Math.min(t.min, e.suggestedMin)), void 0 !== e.max ? t.max = e.max : void 0 !== e.suggestedMax && (null === t.max ? t.max = e.suggestedMax : t.max = Math.max(t.max, e.suggestedMax)), o !== r && t.min >= t.max && (o ? t.max = t.min + 1 : t.min = t.max - 1), t.min === t.max && (t.max++, e.beginAtZero || t.min--)
                    }, getTickLimit: e, handleDirectionalChanges: e, buildTicks: function () {
                        var t = this, e = t.options.ticks, n = t.getTickLimit(), o = {
                            maxTicks: n = Math.max(2, n),
                            min: e.min,
                            max: e.max,
                            stepSize: i.valueOrDefault(e.fixedStepSize, e.stepSize)
                        }, r = t.ticks = a.generators.linear(o, t);
                        t.handleDirectionalChanges(), t.max = i.max(r), t.min = i.min(r), e.reverse ? (r.reverse(), t.start = t.max, t.end = t.min) : (t.start = t.min, t.end = t.max)
                    }, convertTicksToLabels: function () {
                        var e = this;
                        e.ticksAsNumbers = e.ticks.slice(), e.zeroLineIndex = e.ticks.indexOf(0), t.Scale.prototype.convertTicksToLabels.call(e)
                    }
                })
            }
        }, {34: 34, 45: 45}], 55: [function (t, e, n) {
            "use strict";
            var i = t(45), a = t(34);
            e.exports = function (t) {
                var e = {position: "left", ticks: {callback: a.formatters.logarithmic}}, n = t.Scale.extend({
                    determineDataLimits: function () {
                        function t(t) {
                            return s ? t.xAxisID === e.id : t.yAxisID === e.id
                        }

                        var e = this, n = e.options, a = n.ticks, o = e.chart, r = o.data.datasets,
                            l = i.valueOrDefault, s = e.isHorizontal();
                        e.min = null, e.max = null, e.minNotZero = null;
                        var u = n.stacked;
                        if (void 0 === u && i.each(r, function (e, n) {
                            if (!u) {
                                var i = o.getDatasetMeta(n);
                                o.isDatasetVisible(n) && t(i) && void 0 !== i.stack && (u = !0)
                            }
                        }), n.stacked || u) {
                            var d = {};
                            i.each(r, function (a, r) {
                                var l = o.getDatasetMeta(r),
                                    s = [l.type, void 0 === n.stacked && void 0 === l.stack ? r : "", l.stack].join(".");
                                o.isDatasetVisible(r) && t(l) && (void 0 === d[s] && (d[s] = []), i.each(a.data, function (t, i) {
                                    var a = d[s], o = +e.getRightValue(t);
                                    isNaN(o) || l.data[i].hidden || (a[i] = a[i] || 0, n.relativePoints ? a[i] = 100 : a[i] += o)
                                }))
                            }), i.each(d, function (t) {
                                var n = i.min(t), a = i.max(t);
                                e.min = null === e.min ? n : Math.min(e.min, n), e.max = null === e.max ? a : Math.max(e.max, a)
                            })
                        } else i.each(r, function (n, a) {
                            var r = o.getDatasetMeta(a);
                            o.isDatasetVisible(a) && t(r) && i.each(n.data, function (t, n) {
                                var i = +e.getRightValue(t);
                                isNaN(i) || r.data[n].hidden || (null === e.min ? e.min = i : i < e.min && (e.min = i), null === e.max ? e.max = i : i > e.max && (e.max = i), 0 !== i && (null === e.minNotZero || i < e.minNotZero) && (e.minNotZero = i))
                            })
                        });
                        e.min = l(a.min, e.min), e.max = l(a.max, e.max), e.min === e.max && (0 !== e.min && null !== e.min ? (e.min = Math.pow(10, Math.floor(i.log10(e.min)) - 1), e.max = Math.pow(10, Math.floor(i.log10(e.max)) + 1)) : (e.min = 1, e.max = 10))
                    }, buildTicks: function () {
                        var t = this, e = t.options.ticks, n = {min: e.min, max: e.max},
                            o = t.ticks = a.generators.logarithmic(n, t);
                        t.isHorizontal() || o.reverse(), t.max = i.max(o), t.min = i.min(o), e.reverse ? (o.reverse(), t.start = t.max, t.end = t.min) : (t.start = t.min, t.end = t.max)
                    }, convertTicksToLabels: function () {
                        this.tickValues = this.ticks.slice(), t.Scale.prototype.convertTicksToLabels.call(this)
                    }, getLabelForIndex: function (t, e) {
                        return +this.getRightValue(this.chart.data.datasets[e].data[t])
                    }, getPixelForTick: function (t) {
                        return this.getPixelForValue(this.tickValues[t])
                    }, getPixelForValue: function (t) {
                        var e, n, a, o = this, r = o.start, l = +o.getRightValue(t), s = o.options.ticks;
                        return o.isHorizontal() ? (a = i.log10(o.end) - i.log10(r), 0 === l ? n = o.left : (e = o.width, n = o.left + e / a * (i.log10(l) - i.log10(r)))) : (e = o.height, 0 !== r || s.reverse ? 0 === o.end && s.reverse ? (a = i.log10(o.start) - i.log10(o.minNotZero), n = l === o.end ? o.top : l === o.minNotZero ? o.top + .02 * e : o.top + .02 * e + .98 * e / a * (i.log10(l) - i.log10(o.minNotZero))) : 0 === l ? n = s.reverse ? o.top : o.bottom : (a = i.log10(o.end) - i.log10(r), e = o.height, n = o.bottom - e / a * (i.log10(l) - i.log10(r))) : (a = i.log10(o.end) - i.log10(o.minNotZero), n = l === r ? o.bottom : l === o.minNotZero ? o.bottom - .02 * e : o.bottom - .02 * e - .98 * e / a * (i.log10(l) - i.log10(o.minNotZero)))), n
                    }, getValueForPixel: function (t) {
                        var e, n, a = this, o = i.log10(a.end) - i.log10(a.start);
                        return a.isHorizontal() ? (n = a.width, e = a.start * Math.pow(10, (t - a.left) * o / n)) : (n = a.height, e = Math.pow(10, (a.bottom - t) * o / n) / a.start), e
                    }
                });
                t.scaleService.registerScaleType("logarithmic", n, e)
            }
        }, {34: 34, 45: 45}], 56: [function (t, e, n) {
            "use strict";
            var i = t(25), a = t(45), o = t(34);
            e.exports = function (t) {
                function e(t) {
                    var e = t.options;
                    return e.angleLines.display || e.pointLabels.display ? t.chart.data.labels.length : 0
                }

                function n(t) {
                    var e = t.options.pointLabels, n = a.valueOrDefault(e.fontSize, v.defaultFontSize),
                        i = a.valueOrDefault(e.fontStyle, v.defaultFontStyle),
                        o = a.valueOrDefault(e.fontFamily, v.defaultFontFamily);
                    return {size: n, style: i, family: o, font: a.fontString(n, i, o)}
                }

                function r(t, e, n) {
                    return a.isArray(n) ? {
                        w: a.longestText(t, t.font, n),
                        h: n.length * e + 1.5 * (n.length - 1) * e
                    } : {w: t.measureText(n).width, h: e}
                }

                function l(t, e, n, i, a) {
                    return t === i || t === a ? {start: e - n / 2, end: e + n / 2} : t < i || t > a ? {
                        start: e - n - 5,
                        end: e
                    } : {start: e, end: e + n + 5}
                }

                function s(t) {
                    var i, o, s, u = n(t), d = Math.min(t.height / 2, t.width / 2),
                        c = {r: t.width, l: 0, t: t.height, b: 0}, h = {};
                    t.ctx.font = u.font, t._pointLabelSizes = [];
                    var f = e(t);
                    for (i = 0; i < f; i++) {
                        s = t.getPointPosition(i, d), o = r(t.ctx, u.size, t.pointLabels[i] || ""), t._pointLabelSizes[i] = o;
                        var g = t.getIndexAngle(i), p = a.toDegrees(g) % 360, v = l(p, s.x, o.w, 0, 180),
                            m = l(p, s.y, o.h, 90, 270);
                        v.start < c.l && (c.l = v.start, h.l = g), v.end > c.r && (c.r = v.end, h.r = g), m.start < c.t && (c.t = m.start, h.t = g), m.end > c.b && (c.b = m.end, h.b = g)
                    }
                    t.setReductions(d, c, h)
                }

                function u(t) {
                    var e = Math.min(t.height / 2, t.width / 2);
                    t.drawingArea = Math.round(e), t.setCenterPoint(0, 0, 0, 0)
                }

                function d(t) {
                    return 0 === t || 180 === t ? "center" : t < 180 ? "left" : "right"
                }

                function c(t, e, n, i) {
                    if (a.isArray(e)) for (var o = n.y, r = 1.5 * i, l = 0; l < e.length; ++l) t.fillText(e[l], n.x, o), o += r; else t.fillText(e, n.x, n.y)
                }

                function h(t, e, n) {
                    90 === t || 270 === t ? n.y -= e.h / 2 : (t > 270 || t < 90) && (n.y -= e.h)
                }

                function f(t) {
                    var i = t.ctx, o = a.valueOrDefault, r = t.options, l = r.angleLines, s = r.pointLabels;
                    i.lineWidth = l.lineWidth, i.strokeStyle = l.color;
                    var u = t.getDistanceFromCenterForValue(r.ticks.reverse ? t.min : t.max), f = n(t);
                    i.textBaseline = "top";
                    for (var g = e(t) - 1; g >= 0; g--) {
                        if (l.display) {
                            var p = t.getPointPosition(g, u);
                            i.beginPath(), i.moveTo(t.xCenter, t.yCenter), i.lineTo(p.x, p.y), i.stroke(), i.closePath()
                        }
                        if (s.display) {
                            var m = t.getPointPosition(g, u + 5), b = o(s.fontColor, v.defaultFontColor);
                            i.font = f.font, i.fillStyle = b;
                            var x = t.getIndexAngle(g), y = a.toDegrees(x);
                            i.textAlign = d(y), h(y, t._pointLabelSizes[g], m), c(i, t.pointLabels[g] || "", m, f.size)
                        }
                    }
                }

                function g(t, n, i, o) {
                    var r = t.ctx;
                    if (r.strokeStyle = a.valueAtIndexOrDefault(n.color, o - 1), r.lineWidth = a.valueAtIndexOrDefault(n.lineWidth, o - 1), t.options.gridLines.circular) r.beginPath(), r.arc(t.xCenter, t.yCenter, i, 0, 2 * Math.PI), r.closePath(), r.stroke(); else {
                        var l = e(t);
                        if (0 === l) return;
                        r.beginPath();
                        var s = t.getPointPosition(0, i);
                        r.moveTo(s.x, s.y);
                        for (var u = 1; u < l; u++) s = t.getPointPosition(u, i), r.lineTo(s.x, s.y);
                        r.closePath(), r.stroke()
                    }
                }

                function p(t) {
                    return a.isNumber(t) ? t : 0
                }

                var v = i.global, m = {
                    display: !0,
                    animate: !0,
                    position: "chartArea",
                    angleLines: {display: !0, color: "rgba(0, 0, 0, 0.1)", lineWidth: 1},
                    gridLines: {circular: !1},
                    ticks: {
                        showLabelBackdrop: !0,
                        backdropColor: "rgba(255,255,255,0.75)",
                        backdropPaddingY: 2,
                        backdropPaddingX: 2,
                        callback: o.formatters.linear
                    },
                    pointLabels: {
                        display: !0, fontSize: 10, callback: function (t) {
                            return t
                        }
                    }
                }, b = t.LinearScaleBase.extend({
                    setDimensions: function () {
                        var t = this, e = t.options, n = e.ticks;
                        t.width = t.maxWidth, t.height = t.maxHeight, t.xCenter = Math.round(t.width / 2), t.yCenter = Math.round(t.height / 2);
                        var i = a.min([t.height, t.width]), o = a.valueOrDefault(n.fontSize, v.defaultFontSize);
                        t.drawingArea = e.display ? i / 2 - (o / 2 + n.backdropPaddingY) : i / 2
                    }, determineDataLimits: function () {
                        var t = this, e = t.chart, n = Number.POSITIVE_INFINITY, i = Number.NEGATIVE_INFINITY;
                        a.each(e.data.datasets, function (o, r) {
                            if (e.isDatasetVisible(r)) {
                                var l = e.getDatasetMeta(r);
                                a.each(o.data, function (e, a) {
                                    var o = +t.getRightValue(e);
                                    isNaN(o) || l.data[a].hidden || (n = Math.min(o, n), i = Math.max(o, i))
                                })
                            }
                        }), t.min = n === Number.POSITIVE_INFINITY ? 0 : n, t.max = i === Number.NEGATIVE_INFINITY ? 0 : i, t.handleTickRangeOptions()
                    }, getTickLimit: function () {
                        var t = this.options.ticks, e = a.valueOrDefault(t.fontSize, v.defaultFontSize);
                        return Math.min(t.maxTicksLimit ? t.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * e)))
                    }, convertTicksToLabels: function () {
                        var e = this;
                        t.LinearScaleBase.prototype.convertTicksToLabels.call(e), e.pointLabels = e.chart.data.labels.map(e.options.pointLabels.callback, e)
                    }, getLabelForIndex: function (t, e) {
                        return +this.getRightValue(this.chart.data.datasets[e].data[t])
                    }, fit: function () {
                        this.options.pointLabels.display ? s(this) : u(this)
                    }, setReductions: function (t, e, n) {
                        var i = this, a = e.l / Math.sin(n.l), o = Math.max(e.r - i.width, 0) / Math.sin(n.r),
                            r = -e.t / Math.cos(n.t), l = -Math.max(e.b - i.height, 0) / Math.cos(n.b);
                        a = p(a), o = p(o), r = p(r), l = p(l), i.drawingArea = Math.min(Math.round(t - (a + o) / 2), Math.round(t - (r + l) / 2)), i.setCenterPoint(a, o, r, l)
                    }, setCenterPoint: function (t, e, n, i) {
                        var a = this, o = a.width - e - a.drawingArea, r = t + a.drawingArea, l = n + a.drawingArea,
                            s = a.height - i - a.drawingArea;
                        a.xCenter = Math.round((r + o) / 2 + a.left), a.yCenter = Math.round((l + s) / 2 + a.top)
                    }, getIndexAngle: function (t) {
                        return t * (2 * Math.PI / e(this)) + (this.chart.options && this.chart.options.startAngle ? this.chart.options.startAngle : 0) * Math.PI * 2 / 360
                    }, getDistanceFromCenterForValue: function (t) {
                        var e = this;
                        if (null === t) return 0;
                        var n = e.drawingArea / (e.max - e.min);
                        return e.options.ticks.reverse ? (e.max - t) * n : (t - e.min) * n
                    }, getPointPosition: function (t, e) {
                        var n = this, i = n.getIndexAngle(t) - Math.PI / 2;
                        return {x: Math.round(Math.cos(i) * e) + n.xCenter, y: Math.round(Math.sin(i) * e) + n.yCenter}
                    }, getPointPositionForValue: function (t, e) {
                        return this.getPointPosition(t, this.getDistanceFromCenterForValue(e))
                    }, getBasePosition: function () {
                        var t = this, e = t.min, n = t.max;
                        return t.getPointPositionForValue(0, t.beginAtZero ? 0 : e < 0 && n < 0 ? n : e > 0 && n > 0 ? e : 0)
                    }, draw: function () {
                        var t = this, e = t.options, n = e.gridLines, i = e.ticks, o = a.valueOrDefault;
                        if (e.display) {
                            var r = t.ctx, l = this.getIndexAngle(0), s = o(i.fontSize, v.defaultFontSize),
                                u = o(i.fontStyle, v.defaultFontStyle), d = o(i.fontFamily, v.defaultFontFamily),
                                c = a.fontString(s, u, d);
                            a.each(t.ticks, function (e, a) {
                                if (a > 0 || i.reverse) {
                                    var u = t.getDistanceFromCenterForValue(t.ticksAsNumbers[a]);
                                    if (n.display && 0 !== a && g(t, n, u, a), i.display) {
                                        var d = o(i.fontColor, v.defaultFontColor);
                                        if (r.font = c, r.save(), r.translate(t.xCenter, t.yCenter), r.rotate(l), i.showLabelBackdrop) {
                                            var h = r.measureText(e).width;
                                            r.fillStyle = i.backdropColor, r.fillRect(-h / 2 - i.backdropPaddingX, -u - s / 2 - i.backdropPaddingY, h + 2 * i.backdropPaddingX, s + 2 * i.backdropPaddingY)
                                        }
                                        r.textAlign = "center", r.textBaseline = "middle", r.fillStyle = d, r.fillText(e, 0, -u), r.restore()
                                    }
                                }
                            }), (e.angleLines.display || e.pointLabels.display) && f(t)
                        }
                    }
                });
                t.scaleService.registerScaleType("radialLinear", b, m)
            }
        }, {25: 25, 34: 34, 45: 45}], 57: [function (t, e, n) {
            "use strict";

            function i(t, e) {
                return t - e
            }

            function a(t) {
                var e, n, i, a = {}, o = [];
                for (e = 0, n = t.length; e < n; ++e) a[i = t[e]] || (a[i] = !0, o.push(i));
                return o
            }

            function o(t, e, n, i) {
                if ("linear" === i || !t.length) return [{time: e, pos: 0}, {time: n, pos: 1}];
                var a, o, r, l, s, u = [], d = [e];
                for (a = 0, o = t.length; a < o; ++a) (l = t[a]) > e && l < n && d.push(l);
                for (d.push(n), a = 0, o = d.length; a < o; ++a) s = d[a + 1], r = d[a - 1], l = d[a], void 0 !== r && void 0 !== s && Math.round((s + r) / 2) === l || u.push({
                    time: l,
                    pos: a / (o - 1)
                });
                return u
            }

            function r(t, e, n) {
                for (var i, a, o, r = 0, l = t.length - 1; r >= 0 && r <= l;) {
                    if (i = r + l >> 1, a = t[i - 1] || null, o = t[i], !a) return {lo: null, hi: o};
                    if (o[e] < n) r = i + 1; else {
                        if (!(a[e] > n)) return {lo: a, hi: o};
                        l = i - 1
                    }
                }
                return {lo: o, hi: null}
            }

            function l(t, e, n, i) {
                var a = r(t, e, n), o = a.lo ? a.hi ? a.lo : t[t.length - 2] : t[0],
                    l = a.lo ? a.hi ? a.hi : t[t.length - 1] : t[1], s = l[e] - o[e], u = s ? (n - o[e]) / s : 0,
                    d = (l[i] - o[i]) * u;
                return o[i] + d
            }

            function s(t, e) {
                var n = e.parser, i = e.parser || e.format;
                return "function" == typeof n ? n(t) : "string" == typeof t && "string" == typeof i ? v(t, i) : (t instanceof v || (t = v(t)), t.isValid() ? t : "function" == typeof i ? i(t) : t)
            }

            function u(t, e) {
                if (b.isNullOrUndef(t)) return null;
                var n = e.options.time, i = s(e.getRightValue(t), n);
                return i.isValid() ? (n.round && i.startOf(n.round), i.valueOf()) : null
            }

            function d(t, e, n, i) {
                var a, o, r, l = e - t, s = k[n], u = s.size, d = s.steps;
                if (!d) return Math.ceil(l / ((i || 1) * u));
                for (a = 0, o = d.length; a < o && (r = d[a], !(Math.ceil(l / (u * r)) <= i)); ++a) ;
                return r
            }

            function c(t, e, n, i) {
                var a, o, r, l = w.length;
                for (a = w.indexOf(t); a < l - 1; ++a) if (o = k[w[a]], r = o.steps ? o.steps[o.steps.length - 1] : y, Math.ceil((n - e) / (r * o.size)) <= i) return w[a];
                return w[l - 1]
            }

            function h(t) {
                for (var e = w.indexOf(t) + 1, n = w.length; e < n; ++e) if (k[w[e]].major) return w[e]
            }

            function f(t, e, n, i, a, o) {
                var r, l = o.time, s = b.valueOrDefault(l.stepSize, l.unitStepSize), u = "week" === n && l.isoWeekday,
                    c = o.ticks.major.enabled, h = k[n], f = v(t), g = v(e), p = [];
                for (s || (s = d(t, e, n, a)), u && (f = f.isoWeekday(u), g = g.isoWeekday(u)), f = f.startOf(u ? "day" : n), (g = g.startOf(u ? "day" : n)) < e && g.add(1, n), r = v(f), c && i && !u && !l.round && (r.startOf(i), r.add(~~((f - r) / (h.size * s)) * s, n)); r < g; r.add(s, n)) p.push(+r);
                return p.push(+r), p
            }

            function g(t, e, n, i, a) {
                var o, r, s = 0, u = 0;
                return a.offset && e.length && (a.time.min || (o = e.length > 1 ? e[1] : i, r = e[0], s = (l(t, "time", o, "pos") - l(t, "time", r, "pos")) / 2), a.time.max || (o = e[e.length - 1], r = e.length > 1 ? e[e.length - 2] : n, u = (l(t, "time", o, "pos") - l(t, "time", r, "pos")) / 2)), {
                    left: s,
                    right: u
                }
            }

            function p(t, e) {
                var n, i, a, o, r = [];
                for (n = 0, i = t.length; n < i; ++n) a = t[n], o = !!e && a === +v(a).startOf(e), r.push({
                    value: a,
                    major: o
                });
                return r
            }

            var v = t(1);
            v = "function" == typeof v ? v : window.moment;
            var m = t(25), b = t(45), x = Number.MIN_SAFE_INTEGER || -9007199254740991,
                y = Number.MAX_SAFE_INTEGER || 9007199254740991, k = {
                    millisecond: {major: !0, size: 1, steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]},
                    second: {major: !0, size: 1e3, steps: [1, 2, 5, 10, 30]},
                    minute: {major: !0, size: 6e4, steps: [1, 2, 5, 10, 30]},
                    hour: {major: !0, size: 36e5, steps: [1, 2, 3, 6, 12]},
                    day: {major: !0, size: 864e5, steps: [1, 2, 5]},
                    week: {major: !1, size: 6048e5, steps: [1, 2, 3, 4]},
                    month: {major: !0, size: 2628e6, steps: [1, 2, 3]},
                    quarter: {major: !1, size: 7884e6, steps: [1, 2, 3, 4]},
                    year: {major: !0, size: 3154e7}
                }, w = Object.keys(k);
            e.exports = function (t) {
                var e = {
                    position: "bottom",
                    distribution: "linear",
                    bounds: "data",
                    time: {
                        parser: !1,
                        format: !1,
                        unit: !1,
                        round: !1,
                        displayFormat: !1,
                        isoWeekday: !1,
                        minUnit: "millisecond",
                        displayFormats: {
                            millisecond: "h:mm:ss.SSS a",
                            second: "h:mm:ss a",
                            minute: "h:mm a",
                            hour: "hA",
                            day: "MMM D",
                            week: "ll",
                            month: "MMM YYYY",
                            quarter: "[Q]Q - YYYY",
                            year: "YYYY"
                        }
                    },
                    ticks: {autoSkip: !1, source: "auto", major: {enabled: !1}}
                }, n = t.Scale.extend({
                    initialize: function () {
                        if (!v) throw new Error("Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com");
                        this.mergeTicksOptions(), t.Scale.prototype.initialize.call(this)
                    }, update: function () {
                        var e = this, n = e.options;
                        return n.time && n.time.format && console.warn("options.time.format is deprecated and replaced by options.time.parser."), t.Scale.prototype.update.apply(e, arguments)
                    }, getRightValue: function (e) {
                        return e && void 0 !== e.t && (e = e.t), t.Scale.prototype.getRightValue.call(this, e)
                    }, determineDataLimits: function () {
                        var t, e, n, o, r, l, s = this, d = s.chart, c = s.options.time, h = u(c.min, s) || y,
                            f = u(c.max, s) || x, g = [], p = [], m = [];
                        for (t = 0, n = d.data.labels.length; t < n; ++t) m.push(u(d.data.labels[t], s));
                        for (t = 0, n = (d.data.datasets || []).length; t < n; ++t) if (d.isDatasetVisible(t)) if (r = d.data.datasets[t].data, b.isObject(r[0])) for (p[t] = [], e = 0, o = r.length; e < o; ++e) l = u(r[e], s), g.push(l), p[t][e] = l; else g.push.apply(g, m), p[t] = m.slice(0); else p[t] = [];
                        m.length && (m = a(m).sort(i), h = Math.min(h, m[0]), f = Math.max(f, m[m.length - 1])), g.length && (g = a(g).sort(i), h = Math.min(h, g[0]), f = Math.max(f, g[g.length - 1])), h = h === y ? +v().startOf("day") : h, f = f === x ? +v().endOf("day") + 1 : f, s.min = Math.min(h, f), s.max = Math.max(h + 1, f), s._horizontal = s.isHorizontal(), s._table = [], s._timestamps = {
                            data: g,
                            datasets: p,
                            labels: m
                        }
                    }, buildTicks: function () {
                        var t, e, n, i = this, a = i.min, r = i.max, l = i.options, s = l.time, d = s.displayFormats,
                            v = i.getLabelCapacity(a), m = s.unit || c(s.minUnit, a, r, v), b = h(m), x = [], y = [];
                        switch (l.ticks.source) {
                            case"data":
                                x = i._timestamps.data;
                                break;
                            case"labels":
                                x = i._timestamps.labels;
                                break;
                            case"auto":
                            default:
                                x = f(a, r, m, b, v, l)
                        }
                        for ("ticks" === l.bounds && x.length && (a = x[0], r = x[x.length - 1]), a = u(s.min, i) || a, r = u(s.max, i) || r, t = 0, e = x.length; t < e; ++t) (n = x[t]) >= a && n <= r && y.push(n);
                        return i.min = a, i.max = r, i._unit = m, i._majorUnit = b, i._minorFormat = d[m], i._majorFormat = d[b], i._table = o(i._timestamps.data, a, r, l.distribution), i._offsets = g(i._table, y, a, r, l), p(y, b)
                    }, getLabelForIndex: function (t, e) {
                        var n = this, i = n.chart.data, a = n.options.time,
                            o = i.labels && t < i.labels.length ? i.labels[t] : "", r = i.datasets[e].data[t];
                        return b.isObject(r) && (o = n.getRightValue(r)), a.tooltipFormat && (o = s(o, a).format(a.tooltipFormat)), o
                    }, tickFormatFunction: function (t, e, n) {
                        var i = this, a = i.options, o = t.valueOf(), r = i._majorUnit, l = i._majorFormat,
                            s = t.clone().startOf(i._majorUnit).valueOf(), u = a.ticks.major,
                            d = u.enabled && r && l && o === s, c = t.format(d ? l : i._minorFormat),
                            h = d ? u : a.ticks.minor, f = b.valueOrDefault(h.callback, h.userCallback);
                        return f ? f(c, e, n) : c
                    }, convertTicksToLabels: function (t) {
                        var e, n, i = [];
                        for (e = 0, n = t.length; e < n; ++e) i.push(this.tickFormatFunction(v(t[e].value), e, t));
                        return i
                    }, getPixelForOffset: function (t) {
                        var e = this, n = e._horizontal ? e.width : e.height, i = e._horizontal ? e.left : e.top,
                            a = l(e._table, "time", t, "pos");
                        return i + n * (e._offsets.left + a) / (e._offsets.left + 1 + e._offsets.right)
                    }, getPixelForValue: function (t, e, n) {
                        var i = this, a = null;
                        if (void 0 !== e && void 0 !== n && (a = i._timestamps.datasets[n][e]), null === a && (a = u(t, i)), null !== a) return i.getPixelForOffset(a)
                    }, getPixelForTick: function (t) {
                        var e = this.getTicks();
                        return t >= 0 && t < e.length ? this.getPixelForOffset(e[t].value) : null
                    }, getValueForPixel: function (t) {
                        var e = this, n = e._horizontal ? e.width : e.height, i = e._horizontal ? e.left : e.top,
                            a = (n ? (t - i) / n : 0) * (e._offsets.left + 1 + e._offsets.left) - e._offsets.right,
                            o = l(e._table, "pos", a, "time");
                        return v(o)
                    }, getLabelWidth: function (t) {
                        var e = this, n = e.options.ticks, i = e.ctx.measureText(t).width,
                            a = b.toRadians(n.maxRotation), o = Math.cos(a), r = Math.sin(a);
                        return i * o + b.valueOrDefault(n.fontSize, m.global.defaultFontSize) * r
                    }, getLabelCapacity: function (t) {
                        var e = this;
                        e._minorFormat = e.options.time.displayFormats.millisecond;
                        var n = e.tickFormatFunction(v(t), 0, []), i = e.getLabelWidth(n),
                            a = e.isHorizontal() ? e.width : e.height;
                        return Math.floor(a / i)
                    }
                });
                t.scaleService.registerScaleType("time", n, e)
            }
        }, {1: 1, 25: 25, 45: 45}]
    }, {}, [7])(7)
});


// jQuery Mask Plugin v1.7.7
// github.com/igorescobar/jQuery-Mask-Plugin
(function (f) {
    "function" === typeof define && define.amd ? define(["jquery"], f) : f(window.jQuery || window.Zepto)
})(function (f) {
    var A = function (a, d, b) {
        var h = this, m, p;
        a = f(a);
        d = "function" === typeof d ? d(a.val(), void 0, a, b) : d;
        var c = {
            getCaret: function () {
                try {
                    var e, l = 0, c = a.get(0), g = document.selection, d = c.selectionStart;
                    if (g && !~navigator.appVersion.indexOf("MSIE 10")) e = g.createRange(), e.moveStart("character", a.is("input") ? -a.val().length : -a.text().length), l = e.text.length; else if (d || "0" === d) l = d;
                    return l
                } catch (b) {
                }
            }, setCaret: function (e) {
                try {
                    if (a.is(":focus")) {
                        var l,
                            c = a.get(0);
                        c.setSelectionRange ? c.setSelectionRange(e, e) : c.createTextRange && (l = c.createTextRange(), l.collapse(!0), l.moveEnd("character", e), l.moveStart("character", e), l.select())
                    }
                } catch (g) {
                }
            }, events: function () {
                a.on("keydown.mask", function () {
                    m = c.val()
                }).on("keyup.mask", c.behaviour).on("paste.mask drop.mask", function () {
                    setTimeout(function () {
                        a.keydown().keyup()
                    }, 100)
                }).on("change.mask", function () {
                    a.data("changed", !0)
                }).on("blur.mask", function () {
                    m === a.val() || a.data("changed") || a.trigger("change");
                    a.data("changed",
                        !1)
                }).on("focusout.mask", function () {
                    b.clearIfNotMatch && !p.test(c.val()) && c.val("")
                })
            }, getRegexMask: function () {
                for (var e = [], a, c, g, b, k = 0; k < d.length; k++) (a = h.translation[d[k]]) ? (c = a.pattern.toString().replace(/.{1}$|^.{1}/g, ""), g = a.optional, (a = a.recursive) ? (e.push(d[k]), b = {
                    digit: d[k],
                    pattern: c
                }) : e.push(g || a ? c + "?" : c)) : e.push(d[k].replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                e = e.join("");
                b && (e = e.replace(new RegExp("(" + b.digit + "(.*" + b.digit + ")?)"), "($1)?").replace(new RegExp(b.digit, "g"), b.pattern));
                return new RegExp(e)
            },
            destroyEvents: function () {
                a.off("keydown keyup paste drop change blur focusout DOMNodeInserted ".split(" ").join(".mask ")).removeData("changeCalled")
            }, val: function (e) {
                var c = a.is("input");
                return 0 < arguments.length ? c ? a.val(e) : a.text(e) : c ? a.val() : a.text()
            }, getMCharsBeforeCount: function (e, a) {
                for (var c = 0, b = 0, f = d.length; b < f && b < e; b++) h.translation[d.charAt(b)] || (e = a ? e + 1 : e, c++);
                return c
            }, caretPos: function (e, a, b, g) {
                return h.translation[d.charAt(Math.min(e - 1, d.length - 1))] ? Math.min(e + b - a - g, b) : c.caretPos(e + 1,
                    a, b, g)
            }, behaviour: function (a) {
                a = a || window.event;
                var b = a.keyCode || a.which;
                if (-1 === f.inArray(b, h.byPassKeys)) {
                    var d = c.getCaret(), g = c.val(), t = g.length, k = d < t, m = c.getMasked(), n = m.length,
                        p = c.getMCharsBeforeCount(n - 1) - c.getMCharsBeforeCount(t - 1);
                    m !== g && c.val(m);
                    !k || 65 === b && a.ctrlKey || (8 !== b && 46 !== b && (d = c.caretPos(d, t, n, p)), c.setCaret(d));
                    return c.callbacks(a)
                }
            }, getMasked: function (a) {
                var l = [], f = c.val(), g = 0, m = d.length, k = 0, p = f.length, n = 1, u = "push", r = -1, q, v;
                b.reverse ? (u = "unshift", n = -1, q = 0, g = m - 1, k = p - 1, v = function () {
                    return -1 <
                        g && -1 < k
                }) : (q = m - 1, v = function () {
                    return g < m && k < p
                });
                for (; v();) {
                    var w = d.charAt(g), x = f.charAt(k), s = h.translation[w];
                    if (s) x.match(s.pattern) ? (l[u](x), s.recursive && (-1 === r ? r = g : g === q && (g = r - n), q === r && (g -= n)), g += n) : s.optional && (g += n, k -= n), k += n; else {
                        if (!a) l[u](w);
                        x === w && (k += n);
                        g += n
                    }
                }
                a = d.charAt(q);
                m !== p + 1 || h.translation[a] || l.push(a);
                return l.join("")
            }, callbacks: function (e) {
                var f = c.val(), h = f !== m;
                if (!0 === h && "function" === typeof b.onChange) b.onChange(f, e, a, b);
                if (!0 === h && "function" === typeof b.onKeyPress) b.onKeyPress(f,
                    e, a, b);
                if ("function" === typeof b.onComplete && f.length === d.length) b.onComplete(f, e, a, b)
            }
        };
        h.mask = d;
        h.options = b;
        h.remove = function () {
            var b;
            c.destroyEvents();
            c.val(h.getCleanVal()).removeAttr("maxlength");
            b = c.getCaret();
            c.setCaret(b - c.getMCharsBeforeCount(b));
            return a
        };
        h.getCleanVal = function () {
            return c.getMasked(!0)
        };
        h.init = function () {
            b = b || {};
            h.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
            h.translation = {
                0: {pattern: /\d/},
                9: {pattern: /\d/, optional: !0},
                "#": {pattern: /\d/, recursive: !0},
                A: {pattern: /[a-zA-Z0-9]/},
                S: {pattern: /[a-zA-Z]/}
            };
            h.translation = f.extend({}, h.translation, b.translation);
            h = f.extend(!0, {}, h, b);
            p = c.getRegexMask();
            !1 !== b.maxlength && a.attr("maxlength", d.length);
            b.placeholder && a.attr("placeholder", b.placeholder);
            a.attr("autocomplete", "off");
            c.destroyEvents();
            c.events();
            var e = c.getCaret();
            c.val(c.getMasked());
            c.setCaret(e + c.getMCharsBeforeCount(e, !0))
        }()
    }, y = {}, z = function () {
        var a = f(this), d = {};
        a.attr("data-mask-reverse") && (d.reverse = !0);
        "false" === a.attr("data-mask-maxlength") && (d.maxlength = !1);
        a.attr("data-mask-clearifnotmatch") && (d.clearIfNotMatch = !0);
        a.mask(a.attr("data-mask"), d)
    };
    f.fn.mask = function (a, d) {
        var b = this.selector, h = function () {
            var b = f(this).data("mask"), h = JSON.stringify;
            if ("object" !== typeof b || h(b.options) !== h(d) || b.mask !== a) return f(this).data("mask", new A(this, a, d))
        };
        this.each(h);
        b && !y[b] && (y[b] = !0, setTimeout(function () {
            f(document).on("DOMNodeInserted.mask", b, h)
        }, 500))
    };
    f.fn.unmask = function () {
        try {
            return this.each(function () {
                f(this).data("mask").remove().removeData("mask")
            })
        } catch (a) {
        }
    };
    f.fn.cleanVal = function () {
        return this.data("mask").getCleanVal()
    };
    f("*[data-mask]").each(z);
    f(document).on("DOMNodeInserted.mask", "*[data-mask]", z)
});


/*Farsi validate Message */
var context = window.location.protocol + "//" + window.location.host;

jQuery.extend(jQuery.validator.messages, {
    required: "این فیلد را فراموش کرده اید",
    remote: "لطفا این فیلد را اصلاخ کنید",
    email: "لطفا یک آدرس پست الکترونیک صحیح وارد کنید",
    url: "لطفا آدرس وب را صحیح وارد کنید",
    date: "این تاریخ صحیح نیست",
    number: "لطفا یک رقم وارد کنید",
    digits: "لطفا یک رقم وارد کنید",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
    minlength: jQuery.validator.format("تعداد ارقام صحیح نیست"),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});


/*User Logs */

/*
jQuery(document).ready(function () {
    jQuery.ajax({
        type: "GET",
        url: context + "/_secure/getUserLogs",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {

            jQuery.each(data, function (i) {
                jQuery('.login-list').append(
                    '<b> <a href="javascript:;"><span class="time" style="font-size: 10px;display: inline;min-width: 110px">'
                    + persianDate(parseInt(data[i].createdDate)).format('HH:mm:ss - YYYY/MM/DD') +
                    '</span><span class="details">' +
                    '<span class="label label-sm label-icon label-success text-center text-justify" style="font-size: 5px;">' +
                    '</span>' + data[i].relation + '</span></a></b>');
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            jQuery("#error").html(xhr.responseText);
        },
        cache: false,
    });


});
*/


/*Datatable Session Expire */
jQuery(document).ready(function () {

    $.fn.dataTable.ext.errMode = 'none';
    $(document.body).on('xhr.dt', function (e, settings, json, xhr) {
        if (xhr.status === 901) {
            console.log('session expired !');
            window.location = context + "_secure/login";
        }
    });
});

/*Auto Input Direction Selector*/
jQuery(document).ready(function () {
    jQuery('input').on("keydown", function () {

        $this = jQuery(this);
        if ($this.val().length == 1) {
            var x = new RegExp("[\x00-\x80]+"); // is ascii

            //alert(x.test($this.val()));

            var isAscii = x.test($this.val());

            if (isAscii) {
                $this.css("direction", "ltr");
            }
            else {
                $this.css("direction", "rtl");
            }
        }
    });
});

/*Persian Date Picker */
jQuery(document).ready(function () {
    jQuery(".persianDatePicker").persianDatepicker({
        altField: '.persianDate',
        altFormat: "unix",
        observer: true,
        format: 'YYYY/MM/DD'
    });

    jQuery("body").find(".backToShamsi").each(function () {
        var ratingTdText = jQuery(this).text();
        if (ratingTdText) {
            jQuery(this).text(persianDate(parseInt(ratingTdText)).format('YYYY/MM/DD'));
        }
    });

    //var myDate = new Date( your epoch date *1000);

    jQuery("body").find(".backToShamsiByTime").each(function () {
        var ratingTdText = jQuery(this).text();
        if (ratingTdText) {
            var myDate = new Date(parseInt(ratingTdText));
            jQuery(this).text(myDate.getHours() + ":" + myDate.getMinutes());
        }
    });
});


/*Trim Long Char Title */
jQuery(document).ready(function () {
    var fullPath = document.getElementsByClassName('trimTitle').value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var trimTitle = fullPath.substring(startIndex);
        if (trimTitle.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            trimTitle = trimTitle.substring(1);
        }
        if (filename.length > 30) trimTitle = trimTitle.substr(0, 27) + '...';
        jQuery("#selectedtrimTitle").text(trimTitle);
    }


    jQuery('#cp2').colorpicker();
    jQuery('#slideAmazingColor').colorpicker();

    $('body').on('click', '.amazingbtn', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        $.post(url, $('#amazingForm').serialize(), function (msg) {
            var $ele = $('#slide-amazing').find(".panel");
            $($ele).empty().append(loading).wait(2000).load(url, function () {
                $(this).fadeIn('slow');
            });
        });


    });


});


