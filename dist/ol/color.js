'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = undefined;
exports.asString = asString;
exports.asArray = asArray;
exports.normalize = normalize;
exports.toString = toString;

var _asserts = require('./asserts.js');

var _math = require('./math.js');

/**
 * A color represented as a short array [red, green, blue, alpha].
 * red, green, and blue should be integers in the range 0..255 inclusive.
 * alpha should be a float in the range 0..1 inclusive. If no alpha value is
 * given then `1` will be used.
 * @typedef {Array<number>} Color
 * @api
 */

/**
 * This RegExp matches # followed by 3, 4, 6, or 8 hex digits.
 * @const
 * @type {RegExp}
 * @private
 */
/**
 * @module ol/color
 */
var HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;

/**
 * Regular expression for matching potential named color style strings.
 * @const
 * @type {RegExp}
 * @private
 */
var NAMED_COLOR_RE_ = /^([a-z]*)$/i;

/**
 * Return the color as an rgba string.
 * @param {module:ol/color~Color|string} color Color.
 * @return {string} Rgba string.
 * @api
 */
function asString(color) {
  if (typeof color === 'string') {
    return color;
  } else {
    return toString(color);
  }
}

/**
 * Return named color as an rgba string.
 * @param {string} color Named color.
 * @return {string} Rgb string.
 */
function fromNamed(color) {
  var el = document.createElement('div');
  el.style.color = color;
  if (el.style.color !== '') {
    document.body.appendChild(el);
    var rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    return rgb;
  } else {
    return '';
  }
}

/**
 * @param {string} s String.
 * @return {module:ol/color~Color} Color.
 */
var fromString = exports.fromString = function () {

  // We maintain a small cache of parsed strings.  To provide cheap LRU-like
  // semantics, whenever the cache grows too large we simply delete an
  // arbitrary 25% of the entries.

  /**
   * @const
   * @type {number}
   */
  var MAX_CACHE_SIZE = 1024;

  /**
   * @type {Object<string, module:ol/color~Color>}
   */
  var cache = {};

  /**
   * @type {number}
   */
  var cacheSize = 0;

  return (
    /**
     * @param {string} s String.
     * @return {module:ol/color~Color} Color.
     */
    function (s) {
      var color = void 0;
      if (cache.hasOwnProperty(s)) {
        color = cache[s];
      } else {
        if (cacheSize >= MAX_CACHE_SIZE) {
          var i = 0;
          for (var key in cache) {
            if ((i++ & 3) === 0) {
              delete cache[key];
              --cacheSize;
            }
          }
        }
        color = fromStringInternal_(s);
        cache[s] = color;
        ++cacheSize;
      }
      return color;
    }
  );
}();

/**
 * Return the color as an array. This function maintains a cache of calculated
 * arrays which means the result should not be modified.
 * @param {module:ol/color~Color|string} color Color.
 * @return {module:ol/color~Color} Color.
 * @api
 */
function asArray(color) {
  if (Array.isArray(color)) {
    return color;
  } else {
    return fromString( /** @type {string} */color);
  }
}

/**
 * @param {string} s String.
 * @private
 * @return {module:ol/color~Color} Color.
 */
function fromStringInternal_(s) {
  var r = void 0,
      g = void 0,
      b = void 0,
      a = void 0,
      color = void 0;

  if (NAMED_COLOR_RE_.exec(s)) {
    s = fromNamed(s);
  }

  if (HEX_COLOR_RE_.exec(s)) {
    // hex
    var n = s.length - 1; // number of hex digits
    var d = void 0; // number of digits per channel
    if (n <= 4) {
      d = 1;
    } else {
      d = 2;
    }
    var hasAlpha = n === 4 || n === 8;
    r = parseInt(s.substr(1 + 0 * d, d), 16);
    g = parseInt(s.substr(1 + 1 * d, d), 16);
    b = parseInt(s.substr(1 + 2 * d, d), 16);
    if (hasAlpha) {
      a = parseInt(s.substr(1 + 3 * d, d), 16);
    } else {
      a = 255;
    }
    if (d == 1) {
      r = (r << 4) + r;
      g = (g << 4) + g;
      b = (b << 4) + b;
      if (hasAlpha) {
        a = (a << 4) + a;
      }
    }
    color = [r, g, b, a / 255];
  } else if (s.indexOf('rgba(') == 0) {
    // rgba()
    color = s.slice(5, -1).split(',').map(Number);
    normalize(color);
  } else if (s.indexOf('rgb(') == 0) {
    // rgb()
    color = s.slice(4, -1).split(',').map(Number);
    color.push(1);
    normalize(color);
  } else {
    (0, _asserts.assert)(false, 14); // Invalid color
  }
  return (
    /** @type {module:ol/color~Color} */color
  );
}

/**
 * TODO this function is only used in the test, we probably shouldn't export it
 * @param {module:ol/color~Color} color Color.
 * @return {module:ol/color~Color} Clamped color.
 */
function normalize(color) {
  color[0] = (0, _math.clamp)(color[0] + 0.5 | 0, 0, 255);
  color[1] = (0, _math.clamp)(color[1] + 0.5 | 0, 0, 255);
  color[2] = (0, _math.clamp)(color[2] + 0.5 | 0, 0, 255);
  color[3] = (0, _math.clamp)(color[3], 0, 1);
  return color;
}

/**
 * @param {module:ol/color~Color} color Color.
 * @return {string} String.
 */
function toString(color) {
  var r = color[0];
  if (r != (r | 0)) {
    r = r + 0.5 | 0;
  }
  var g = color[1];
  if (g != (g | 0)) {
    g = g + 0.5 | 0;
  }
  var b = color[2];
  if (b != (b | 0)) {
    b = b + 0.5 | 0;
  }
  var a = color[3] === undefined ? 1 : color[3];
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}