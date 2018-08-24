'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/style/Fill
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _util = require('../util.js');

var _color = require('../color.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} Options
 * @property {module:ol/color~Color|module:ol/colorlike~ColorLike} [color] A color, gradient or pattern.
 * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
 * Default null; if null, the Canvas/renderer default black will be used.
 */

/**
 * @classdesc
 * Set fill style for vector features.
 * @api
 */
var Fill = function () {
  /**
   * @param {module:ol/style/Fill~Options=} opt_options Options.
   */
  function Fill(opt_options) {
    _classCallCheck(this, Fill);

    var options = opt_options || {};

    /**
     * @private
     * @type {module:ol/color~Color|module:ol/colorlike~ColorLike}
     */
    this.color_ = options.color !== undefined ? options.color : null;

    /**
     * @private
     * @type {string|undefined}
     */
    this.checksum_ = undefined;
  }

  /**
   * Clones the style. The color is not cloned if it is an {@link module:ol/colorlike~ColorLike}.
   * @return {module:ol/style/Fill} The cloned style.
   * @api
   */


  _createClass(Fill, [{
    key: 'clone',
    value: function clone() {
      var color = this.getColor();
      return new Fill({
        color: color && color.slice ? color.slice() : color || undefined
      });
    }

    /**
     * Get the fill color.
     * @return {module:ol/color~Color|module:ol/colorlike~ColorLike} Color.
     * @api
     */

  }, {
    key: 'getColor',
    value: function getColor() {
      return this.color_;
    }

    /**
     * Set the color.
     *
     * @param {module:ol/color~Color|module:ol/colorlike~ColorLike} color Color.
     * @api
     */

  }, {
    key: 'setColor',
    value: function setColor(color) {
      this.color_ = color;
      this.checksum_ = undefined;
    }

    /**
     * @return {string} The checksum.
     */

  }, {
    key: 'getChecksum',
    value: function getChecksum() {
      if (this.checksum_ === undefined) {
        if (this.color_ instanceof CanvasPattern || this.color_ instanceof CanvasGradient) {
          this.checksum_ = (0, _util.getUid)(this.color_).toString();
        } else {
          this.checksum_ = 'f' + (this.color_ ? (0, _color.asString)(this.color_) : '-');
        }
      }

      return this.checksum_;
    }
  }]);

  return Fill;
}();

exports.default = Fill;