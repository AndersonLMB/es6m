'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RegularShape2 = require('../style/RegularShape.js');

var _RegularShape3 = _interopRequireDefault(_RegularShape2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/style/Circle
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/style/Fill} [fill] Fill style.
 * @property {number} radius Circle radius.
 * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
 * when drawing the circle in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
 * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
 * the circle's position is animated. Without it, the circle may jitter noticeably.
 * @property {module:ol/style/Stroke} [stroke] Stroke style.
 * @property {module:ol/style/AtlasManager} [atlasManager] The atlas manager to use for this circle.
 * When using WebGL it is recommended to use an atlas manager to avoid texture switching. If an atlas manager is given,
 * the circle is added to an atlas. By default no atlas manager is used.
 */

/**
 * @classdesc
 * Set circle style for vector features.
 * @api
 */
var CircleStyle = function (_RegularShape) {
  _inherits(CircleStyle, _RegularShape);

  /**
   * @param {module:ol/style/Circle~Options=} opt_options Options.
   */
  function CircleStyle(opt_options) {
    _classCallCheck(this, CircleStyle);

    var options = opt_options || {};

    return _possibleConstructorReturn(this, (CircleStyle.__proto__ || Object.getPrototypeOf(CircleStyle)).call(this, {
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      snapToPixel: options.snapToPixel,
      stroke: options.stroke,
      atlasManager: options.atlasManager
    }));
  }

  /**
  * Clones the style.  If an atlasmanager was provided to the original style it will be used in the cloned style, too.
  * @return {module:ol/style/Circle} The cloned style.
  * @override
  * @api
  */


  _createClass(CircleStyle, [{
    key: 'clone',
    value: function clone() {
      var style = new CircleStyle({
        fill: this.getFill() ? this.getFill().clone() : undefined,
        stroke: this.getStroke() ? this.getStroke().clone() : undefined,
        radius: this.getRadius(),
        snapToPixel: this.getSnapToPixel(),
        atlasManager: this.atlasManager_
      });
      style.setOpacity(this.getOpacity());
      style.setScale(this.getScale());
      return style;
    }

    /**
    * Set the circle radius.
    *
    * @param {number} radius Circle radius.
    * @api
    */

  }, {
    key: 'setRadius',
    value: function setRadius(radius) {
      this.radius_ = radius;
      this.render_(this.atlasManager_);
    }
  }]);

  return CircleStyle;
}(_RegularShape3.default);

exports.default = CircleStyle;