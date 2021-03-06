'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module ol/css
 */

/**
 * The CSS class for hidden feature.
 *
 * @const
 * @type {string}
 */
var CLASS_HIDDEN = exports.CLASS_HIDDEN = 'ol-hidden';

/**
 * The CSS class that we'll give the DOM elements to have them selectable.
 *
 * @const
 * @type {string}
 */
var CLASS_SELECTABLE = exports.CLASS_SELECTABLE = 'ol-selectable';

/**
 * The CSS class that we'll give the DOM elements to have them unselectable.
 *
 * @const
 * @type {string}
 */
var CLASS_UNSELECTABLE = exports.CLASS_UNSELECTABLE = 'ol-unselectable';

/**
 * The CSS class for unsupported feature.
 *
 * @const
 * @type {string}
 */
var CLASS_UNSUPPORTED = exports.CLASS_UNSUPPORTED = 'ol-unsupported';

/**
 * The CSS class for controls.
 *
 * @const
 * @type {string}
 */
var CLASS_CONTROL = exports.CLASS_CONTROL = 'ol-control';

/**
 * The CSS class that we'll give the DOM elements that are collapsed, i.e.
 * to those elements which usually can be expanded.
 *
 * @const
 * @type {string}
 */
var CLASS_COLLAPSED = exports.CLASS_COLLAPSED = 'ol-collapsed';

/**
 * Get the list of font families from a font spec.  Note that this doesn't work
 * for font families that have commas in them.
 * @param {string} The CSS font property.
 * @return {Object<string>} The font families (or null if the input spec is invalid).
 */
var getFontFamilies = exports.getFontFamilies = function () {
  var style = void 0;
  var cache = {};
  return function (font) {
    if (!style) {
      style = document.createElement('div').style;
    }
    if (!(font in cache)) {
      style.font = font;
      var family = style.fontFamily;
      style.font = '';
      if (!family) {
        return null;
      }
      cache[font] = family.split(/,\s?/);
    }
    return cache[font];
  };
}();