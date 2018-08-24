'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../events.js');

var _Object = require('../Object.js');

var _dom = require('../dom.js');

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _math = require('../math.js');

var _obj = require('../obj.js');

var _EventType = require('../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Icon = require('../style/Icon.js');

var _Icon2 = _interopRequireDefault(_Icon);

var _Style = require('../style/Style.js');

var _Style2 = _interopRequireDefault(_Style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Heatmap
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 * @property {Array<string>} [gradient=['#00f', '#0ff', '#0f0', '#ff0', '#f00']] The color gradient
 * of the heatmap, specified as an array of CSS color strings.
 * @property {number} [radius=8] Radius size in pixels.
 * @property {number} [blur=15] Blur size in pixels.
 * @property {number} [shadow=250] Shadow size in pixels.
 * @property {string|function(module:ol/Feature):number} [weight='weight'] The feature
 * attribute to use for the weight or a function that returns a weight from a feature. Weight values
 * should range from 0 to 1 (and values outside will be clamped to that range).
 * @property {module:ol/layer/VectorRenderType|string} [renderMode='vector'] Render mode for vector layers:
 *  * `'image'`: Vector layers are rendered as images. Great performance, but point symbols and
 *    texts are always rotated with the view and pixels are scaled during zoom animations.
 *  * `'vector'`: Vector layers are rendered as vectors. Most accurate rendering even during
 *    animations, but slower performance.
 * @property {module:ol/source/Vector} [source] Source.
 */

/**
 * @enum {string}
 * @private
 */
var Property = {
  BLUR: 'blur',
  GRADIENT: 'gradient',
  RADIUS: 'radius'
};

/**
 * @const
 * @type {Array<string>}
 */
var DEFAULT_GRADIENT = ['#00f', '#0ff', '#0f0', '#ff0', '#f00'];

/**
 * @classdesc
 * Layer for rendering vector data as a heatmap.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @fires module:ol/render/Event~RenderEvent
 * @api
 */

var Heatmap = function (_VectorLayer) {
  _inherits(Heatmap, _VectorLayer);

  /**
   * @param {module:ol/layer/Heatmap~Options=} opt_options Options.
   */
  function Heatmap(opt_options) {
    _classCallCheck(this, Heatmap);

    var options = opt_options ? opt_options : {};

    var baseOptions = (0, _obj.assign)({}, options);

    delete baseOptions.gradient;
    delete baseOptions.radius;
    delete baseOptions.blur;
    delete baseOptions.shadow;
    delete baseOptions.weight;

    /**
     * @private
     * @type {Uint8ClampedArray}
     */
    var _this = _possibleConstructorReturn(this, (Heatmap.__proto__ || Object.getPrototypeOf(Heatmap)).call(this, baseOptions));

    _this.gradient_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.shadow_ = options.shadow !== undefined ? options.shadow : 250;

    /**
     * @private
     * @type {string|undefined}
     */
    _this.circleImage_ = undefined;

    /**
     * @private
     * @type {Array<Array<module:ol/style/Style>>}
     */
    _this.styleCache_ = null;

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.GRADIENT), _this.handleGradientChanged_, _this);

    _this.setGradient(options.gradient ? options.gradient : DEFAULT_GRADIENT);

    _this.setBlur(options.blur !== undefined ? options.blur : 15);

    _this.setRadius(options.radius !== undefined ? options.radius : 8);

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.BLUR), _this.handleStyleChanged_, _this);
    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.RADIUS), _this.handleStyleChanged_, _this);

    _this.handleStyleChanged_();

    var weight = options.weight ? options.weight : 'weight';
    var weightFunction = void 0;
    if (typeof weight === 'string') {
      weightFunction = function weightFunction(feature) {
        return feature.get(weight);
      };
    } else {
      weightFunction = weight;
    }

    _this.setStyle(function (feature, resolution) {
      var weight = weightFunction(feature);
      var opacity = weight !== undefined ? (0, _math.clamp)(weight, 0, 1) : 1;
      // cast to 8 bits
      var index = 255 * opacity | 0;
      var style = this.styleCache_[index];
      if (!style) {
        style = [new _Style2.default({
          image: new _Icon2.default({
            opacity: opacity,
            src: this.circleImage_
          })
        })];
        this.styleCache_[index] = style;
      }
      return style;
    }.bind(_this));

    // For performance reasons, don't sort the features before rendering.
    // The render order is not relevant for a heatmap representation.
    _this.setRenderOrder(null);

    (0, _events.listen)(_this, _EventType2.default.RENDER, _this.handleRender_, _this);
    return _this;
  }

  /**
   * @return {string} Data URL for a circle.
   * @private
   */


  _createClass(Heatmap, [{
    key: 'createCircle_',
    value: function createCircle_() {
      var radius = this.getRadius();
      var blur = this.getBlur();
      var halfSize = radius + blur + 1;
      var size = 2 * halfSize;
      var context = (0, _dom.createCanvasContext2D)(size, size);
      context.shadowOffsetX = context.shadowOffsetY = this.shadow_;
      context.shadowBlur = blur;
      context.shadowColor = '#000';
      context.beginPath();
      var center = halfSize - this.shadow_;
      context.arc(center, center, radius, 0, Math.PI * 2, true);
      context.fill();
      return context.canvas.toDataURL();
    }

    /**
     * Return the blur size in pixels.
     * @return {number} Blur size in pixels.
     * @api
     * @observable
     */

  }, {
    key: 'getBlur',
    value: function getBlur() {
      return (/** @type {number} */this.get(Property.BLUR)
      );
    }

    /**
     * Return the gradient colors as array of strings.
     * @return {Array<string>} Colors.
     * @api
     * @observable
     */

  }, {
    key: 'getGradient',
    value: function getGradient() {
      return (/** @type {Array<string>} */this.get(Property.GRADIENT)
      );
    }

    /**
     * Return the size of the radius in pixels.
     * @return {number} Radius size in pixel.
     * @api
     * @observable
     */

  }, {
    key: 'getRadius',
    value: function getRadius() {
      return (/** @type {number} */this.get(Property.RADIUS)
      );
    }

    /**
     * @private
     */

  }, {
    key: 'handleGradientChanged_',
    value: function handleGradientChanged_() {
      this.gradient_ = createGradient(this.getGradient());
    }

    /**
     * @private
     */

  }, {
    key: 'handleStyleChanged_',
    value: function handleStyleChanged_() {
      this.circleImage_ = this.createCircle_();
      this.styleCache_ = new Array(256);
      this.changed();
    }

    /**
     * @param {module:ol/render/Event} event Post compose event
     * @private
     */

  }, {
    key: 'handleRender_',
    value: function handleRender_(event) {
      var context = event.context;
      var canvas = context.canvas;
      var image = context.getImageData(0, 0, canvas.width, canvas.height);
      var view8 = image.data;
      for (var i = 0, ii = view8.length; i < ii; i += 4) {
        var alpha = view8[i + 3] * 4;
        if (alpha) {
          view8[i] = this.gradient_[alpha];
          view8[i + 1] = this.gradient_[alpha + 1];
          view8[i + 2] = this.gradient_[alpha + 2];
        }
      }
      context.putImageData(image, 0, 0);
    }

    /**
     * Set the blur size in pixels.
     * @param {number} blur Blur size in pixels.
     * @api
     * @observable
     */

  }, {
    key: 'setBlur',
    value: function setBlur(blur) {
      this.set(Property.BLUR, blur);
    }

    /**
     * Set the gradient colors as array of strings.
     * @param {Array<string>} colors Gradient.
     * @api
     * @observable
     */

  }, {
    key: 'setGradient',
    value: function setGradient(colors) {
      this.set(Property.GRADIENT, colors);
    }

    /**
     * Set the size of the radius in pixels.
     * @param {number} radius Radius size in pixel.
     * @api
     * @observable
     */

  }, {
    key: 'setRadius',
    value: function setRadius(radius) {
      this.set(Property.RADIUS, radius);
    }
  }]);

  return Heatmap;
}(_Vector2.default);

/**
 * @param {Array<string>} colors A list of colored.
 * @return {Uint8ClampedArray} An array.
 */


function createGradient(colors) {
  var width = 1;
  var height = 256;
  var context = (0, _dom.createCanvasContext2D)(width, height);

  var gradient = context.createLinearGradient(0, 0, width, height);
  var step = 1 / (colors.length - 1);
  for (var i = 0, ii = colors.length; i < ii; ++i) {
    gradient.addColorStop(i * step, colors[i]);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  return context.getImageData(0, 0, width, height).data;
}

exports.default = Heatmap;