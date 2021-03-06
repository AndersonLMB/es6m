'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetTransform = exports.measureTextHeight = exports.checkFont = exports.textHeights = exports.checkedFonts = exports.labelCache = exports.defaultLineWidth = exports.defaultPadding = exports.defaultTextBaseline = exports.defaultTextAlign = exports.defaultStrokeStyle = exports.defaultMiterLimit = exports.defaultLineJoin = exports.defaultLineDashOffset = exports.defaultLineDash = exports.defaultLineCap = exports.defaultFillStyle = exports.defaultFont = undefined;
exports.measureTextWidth = measureTextWidth;
exports.rotateAtOffset = rotateAtOffset;
exports.drawImage = drawImage;

var _css = require('../css.js');

var _dom = require('../dom.js');

var _obj = require('../obj.js');

var _LRUCache = require('../structs/LRUCache.js');

var _LRUCache2 = _interopRequireDefault(_LRUCache);

var _transform = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} FillState
 * @property {module:ol/colorlike~ColorLike} fillStyle
 */

/**
 * @typedef {Object} FillStrokeState
 * @property {module:ol/colorlike~ColorLike} [currentFillStyle]
 * @property {module:ol/colorlike~ColorLike} [currentStrokeStyle]
 * @property {string} [currentLineCap]
 * @property {Array<number>} currentLineDash
 * @property {number} [currentLineDashOffset]
 * @property {string} [currentLineJoin]
 * @property {number} [currentLineWidth]
 * @property {number} [currentMiterLimit]
 * @property {number} [lastStroke]
 * @property {module:ol/colorlike~ColorLike} [fillStyle]
 * @property {module:ol/colorlike~ColorLike} [strokeStyle]
 * @property {string} [lineCap]
 * @property {Array<number>} lineDash
 * @property {number} [lineDashOffset]
 * @property {string} [lineJoin]
 * @property {number} [lineWidth]
 * @property {number} [miterLimit]
 */

/**
 * @typedef {Object} StrokeState
 * @property {string} lineCap
 * @property {Array<number>} lineDash
 * @property {number} lineDashOffset
 * @property {string} lineJoin
 * @property {number} lineWidth
 * @property {number} miterLimit
 * @property {module:ol/colorlike~ColorLike} strokeStyle
 */

/**
 * @typedef {Object} TextState
 * @property {string} font
 * @property {string} [textAlign]
 * @property {string} textBaseline
 */

/**
 * Container for decluttered replay instructions that need to be rendered or
 * omitted together, i.e. when styles render both an image and text, or for the
 * characters that form text along lines. The basic elements of this array are
 * `[minX, minY, maxX, maxY, count]`, where the first four entries are the
 * rendered extent of the group in pixel space. `count` is the number of styles
 * in the group, i.e. 2 when an image and a text are grouped, or 1 otherwise.
 * In addition to these four elements, declutter instruction arrays (i.e. the
 * arguments to {@link module:ol/render/canvas~drawImage} are appended to the array.
 * @typedef {Array<*>} DeclutterGroup
 */

/**
 * @const
 * @type {string}
 */
var defaultFont = exports.defaultFont = '10px sans-serif';

/**
 * @const
 * @type {module:ol/color~Color}
 */
/**
 * @module ol/render/canvas
 */
var defaultFillStyle = exports.defaultFillStyle = [0, 0, 0, 1];

/**
 * @const
 * @type {string}
 */
var defaultLineCap = exports.defaultLineCap = 'round';

/**
 * @const
 * @type {Array<number>}
 */
var defaultLineDash = exports.defaultLineDash = [];

/**
 * @const
 * @type {number}
 */
var defaultLineDashOffset = exports.defaultLineDashOffset = 0;

/**
 * @const
 * @type {string}
 */
var defaultLineJoin = exports.defaultLineJoin = 'round';

/**
 * @const
 * @type {number}
 */
var defaultMiterLimit = exports.defaultMiterLimit = 10;

/**
 * @const
 * @type {module:ol/color~Color}
 */
var defaultStrokeStyle = exports.defaultStrokeStyle = [0, 0, 0, 1];

/**
 * @const
 * @type {string}
 */
var defaultTextAlign = exports.defaultTextAlign = 'center';

/**
 * @const
 * @type {string}
 */
var defaultTextBaseline = exports.defaultTextBaseline = 'middle';

/**
 * @const
 * @type {Array<number>}
 */
var defaultPadding = exports.defaultPadding = [0, 0, 0, 0];

/**
 * @const
 * @type {number}
 */
var defaultLineWidth = exports.defaultLineWidth = 1;

/**
 * The label cache for text rendering. To change the default cache size of 2048
 * entries, use {@link module:ol/structs/LRUCache#setSize}.
 * @type {module:ol/structs/LRUCache<HTMLCanvasElement>}
 * @api
 */
var labelCache = exports.labelCache = new _LRUCache2.default();

/**
 * @type {!Object<string, number>}
 */
var checkedFonts = exports.checkedFonts = {};

/**
 * @type {CanvasRenderingContext2D}
 */
var measureContext = null;

/**
 * @type {!Object<string, number>}
 */
var textHeights = exports.textHeights = {};

/**
 * Clears the label cache when a font becomes available.
 * @param {string} fontSpec CSS font spec.
 */
var checkFont = exports.checkFont = function () {
  var retries = 60;
  var checked = checkedFonts;
  var size = '32px ';
  var referenceFonts = ['monospace', 'serif'];
  var len = referenceFonts.length;
  var text = 'wmytzilWMYTZIL@#/&?$%10\uF013';
  var interval = void 0,
      referenceWidth = void 0;

  function isAvailable(font) {
    var context = getMeasureContext();
    var available = true;
    for (var i = 0; i < len; ++i) {
      var referenceFont = referenceFonts[i];
      context.font = size + referenceFont;
      referenceWidth = context.measureText(text).width;
      if (font != referenceFont) {
        context.font = size + font + ',' + referenceFont;
        var width = context.measureText(text).width;
        // If width and referenceWidth are the same, then the fallback was used
        // instead of the font we wanted, so the font is not available.
        available = available && width != referenceWidth;
      }
    }
    return available;
  }

  function check() {
    var done = true;
    for (var font in checked) {
      if (checked[font] < retries) {
        if (isAvailable(font)) {
          checked[font] = retries;
          (0, _obj.clear)(textHeights);
          // Make sure that loaded fonts are picked up by Safari
          measureContext = null;
          labelCache.clear();
        } else {
          ++checked[font];
          done = false;
        }
      }
    }
    if (done) {
      clearInterval(interval);
      interval = undefined;
    }
  }

  return function (fontSpec) {
    var fontFamilies = (0, _css.getFontFamilies)(fontSpec);
    if (!fontFamilies) {
      return;
    }
    for (var i = 0, ii = fontFamilies.length; i < ii; ++i) {
      var fontFamily = fontFamilies[i];
      if (!(fontFamily in checked)) {
        checked[fontFamily] = retries;
        if (!isAvailable(fontFamily)) {
          checked[fontFamily] = 0;
          if (interval === undefined) {
            interval = setInterval(check, 32);
          }
        }
      }
    }
  };
}();

/**
 * @return {CanvasRenderingContext2D} Measure context.
 */
function getMeasureContext() {
  if (!measureContext) {
    measureContext = (0, _dom.createCanvasContext2D)(1, 1);
  }
  return measureContext;
}

/**
 * @param {string} font Font to use for measuring.
 * @return {module:ol/size~Size} Measurement.
 */
var measureTextHeight = exports.measureTextHeight = function () {
  var span = void 0;
  var heights = textHeights;
  return function (font) {
    var height = heights[font];
    if (height == undefined) {
      if (!span) {
        span = document.createElement('span');
        span.textContent = 'M';
        span.style.margin = span.style.padding = '0 !important';
        span.style.position = 'absolute !important';
        span.style.left = '-99999px !important';
      }
      span.style.font = font;
      document.body.appendChild(span);
      height = heights[font] = span.offsetHeight;
      document.body.removeChild(span);
    }
    return height;
  };
}();

/**
 * @param {string} font Font.
 * @param {string} text Text.
 * @return {number} Width.
 */
function measureTextWidth(font, text) {
  var measureContext = getMeasureContext();
  if (font != measureContext.font) {
    measureContext.font = font;
  }
  return measureContext.measureText(text).width;
}

/**
 * @param {CanvasRenderingContext2D} context Context.
 * @param {number} rotation Rotation.
 * @param {number} offsetX X offset.
 * @param {number} offsetY Y offset.
 */
function rotateAtOffset(context, rotation, offsetX, offsetY) {
  if (rotation !== 0) {
    context.translate(offsetX, offsetY);
    context.rotate(rotation);
    context.translate(-offsetX, -offsetY);
  }
}

var resetTransform = exports.resetTransform = (0, _transform.create)();

/**
 * @param {CanvasRenderingContext2D} context Context.
 * @param {module:ol/transform~Transform|null} transform Transform.
 * @param {number} opacity Opacity.
 * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image Image.
 * @param {number} originX Origin X.
 * @param {number} originY Origin Y.
 * @param {number} w Width.
 * @param {number} h Height.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {number} scale Scale.
 */
function drawImage(context, transform, opacity, image, originX, originY, w, h, x, y, scale) {
  var alpha = void 0;
  if (opacity != 1) {
    alpha = context.globalAlpha;
    context.globalAlpha = alpha * opacity;
  }
  if (transform) {
    context.setTransform.apply(context, transform);
  }

  context.drawImage(image, originX, originY, w, h, x, y, w * scale, h * scale);

  if (alpha) {
    context.globalAlpha = alpha;
  }
  if (transform) {
    context.setTransform.apply(context, resetTransform);
  }
}