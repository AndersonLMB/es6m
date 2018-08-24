'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LayerType = require('../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _Layer2 = require('../layer/Layer.js');

var _Layer3 = _interopRequireDefault(_Layer2);

var _VectorRenderType = require('../layer/VectorRenderType.js');

var _VectorRenderType2 = _interopRequireDefault(_VectorRenderType);

var _obj = require('../obj.js');

var _Style = require('../style/Style.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Vector
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
 * @property {module:ol/render~OrderFunction} [renderOrder] Render order. Function to be used when sorting
 * features before rendering. By default features are drawn in the order that they are created. Use
 * `null` to avoid the sort, but get an undefined draw order.
 * @property {number} [renderBuffer=100] The buffer in pixels around the viewport extent used by the
 * renderer when getting features from the vector source for the rendering or hit-detection.
 * Recommended value: the size of the largest symbol, line width or label.
 * @property {module:ol/layer/VectorRenderType|string} [renderMode='vector'] Render mode for vector layers:
 *  * `'image'`: Vector layers are rendered as images. Great performance, but point symbols and
 *    texts are always rotated with the view and pixels are scaled during zoom animations.
 *  * `'vector'`: Vector layers are rendered as vectors. Most accurate rendering even during
 *    animations, but slower performance.
 * @property {module:ol/source/Vector} [source] Source.
 * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
 * image and text styles, and the priority is defined by the z-index of the style. Lower z-index
 * means higher priority.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style] Layer style. See
 * {@link module:ol/style} for default style which will be used if this is not defined.
 * @property {boolean} [updateWhileAnimating=false] When set to `true` and `renderMode`
 * is `vector`, feature batches will be recreated during animations. This means that no
 * vectors will be shown clipped, but the setting will have a performance impact for large
 * amounts of vector data. When set to `false`, batches will be recreated when no animation
 * is active.
 * @property {boolean} [updateWhileInteracting=false] When set to `true` and `renderMode`
 * is `vector`, feature batches will be recreated during interactions. See also
 * `updateWhileAnimating`.
 */

/**
 * @enum {string}
 * Render mode for vector layers:
 *  * `'image'`: Vector layers are rendered as images. Great performance, but
 *    point symbols and texts are always rotated with the view and pixels are
 *    scaled during zoom animations.
 *  * `'vector'`: Vector layers are rendered as vectors. Most accurate rendering
 *    even during animations, but slower performance.
 * @api
 */
var RenderType = exports.RenderType = {
  IMAGE: 'image',
  VECTOR: 'vector'
};

/**
 * @enum {string}
 * @private
 */
var Property = {
  RENDER_ORDER: 'renderOrder'
};

/**
 * @classdesc
 * Vector data that is rendered client-side.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @api
 */

var VectorLayer = function (_Layer) {
  _inherits(VectorLayer, _Layer);

  /**
   * @param {module:ol/layer/Vector~Options=} opt_options Options.
   */
  function VectorLayer(opt_options) {
    _classCallCheck(this, VectorLayer);

    var options = opt_options ? opt_options : /** @type {module:ol/layer/Vector~Options} */{};

    var baseOptions = (0, _obj.assign)({}, options);

    delete baseOptions.style;
    delete baseOptions.renderBuffer;
    delete baseOptions.updateWhileAnimating;
    delete baseOptions.updateWhileInteracting;

    /**
    * @private
    * @type {boolean}
    */
    var _this = _possibleConstructorReturn(this, (VectorLayer.__proto__ || Object.getPrototypeOf(VectorLayer)).call(this, baseOptions));

    _this.declutter_ = options.declutter !== undefined ? options.declutter : false;

    /**
    * @type {number}
    * @private
    */
    _this.renderBuffer_ = options.renderBuffer !== undefined ? options.renderBuffer : 100;

    /**
    * User provided style.
    * @type {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
    * @private
    */
    _this.style_ = null;

    /**
    * Style function for use within the library.
    * @type {module:ol/style/Style~StyleFunction|undefined}
    * @private
    */
    _this.styleFunction_ = undefined;

    _this.setStyle(options.style);

    /**
    * @type {boolean}
    * @private
    */
    _this.updateWhileAnimating_ = options.updateWhileAnimating !== undefined ? options.updateWhileAnimating : false;

    /**
    * @type {boolean}
    * @private
    */
    _this.updateWhileInteracting_ = options.updateWhileInteracting !== undefined ? options.updateWhileInteracting : false;

    /**
    * @private
    * @type {module:ol/layer/VectorTileRenderType|string}
    */
    _this.renderMode_ = options.renderMode || _VectorRenderType2.default.VECTOR;

    /**
    * The layer type.
    * @protected
    * @type {module:ol/LayerType}
    */
    _this.type = _LayerType2.default.VECTOR;

    return _this;
  }

  /**
  * @return {boolean} Declutter.
  */


  _createClass(VectorLayer, [{
    key: 'getDeclutter',
    value: function getDeclutter() {
      return this.declutter_;
    }

    /**
    * @param {boolean} declutter Declutter.
    */

  }, {
    key: 'setDeclutter',
    value: function setDeclutter(declutter) {
      this.declutter_ = declutter;
    }

    /**
    * @return {number|undefined} Render buffer.
    */

  }, {
    key: 'getRenderBuffer',
    value: function getRenderBuffer() {
      return this.renderBuffer_;
    }

    /**
    * @return {function(module:ol/Feature, module:ol/Feature): number|null|undefined} Render
    *     order.
    */

  }, {
    key: 'getRenderOrder',
    value: function getRenderOrder() {
      return (
        /** @type {module:ol/render~OrderFunction|null|undefined} */this.get(Property.RENDER_ORDER)
      );
    }

    /**
    * Get the style for features.  This returns whatever was passed to the `style`
    * option at construction or to the `setStyle` method.
    * @return {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
    *     Layer style.
    * @api
    */

  }, {
    key: 'getStyle',
    value: function getStyle() {
      return this.style_;
    }

    /**
    * Get the style function.
    * @return {module:ol/style/Style~StyleFunction|undefined} Layer style function.
    * @api
    */

  }, {
    key: 'getStyleFunction',
    value: function getStyleFunction() {
      return this.styleFunction_;
    }

    /**
    * @return {boolean} Whether the rendered layer should be updated while
    *     animating.
    */

  }, {
    key: 'getUpdateWhileAnimating',
    value: function getUpdateWhileAnimating() {
      return this.updateWhileAnimating_;
    }

    /**
    * @return {boolean} Whether the rendered layer should be updated while
    *     interacting.
    */

  }, {
    key: 'getUpdateWhileInteracting',
    value: function getUpdateWhileInteracting() {
      return this.updateWhileInteracting_;
    }

    /**
    * @param {module:ol/render~OrderFunction|null|undefined} renderOrder
    *     Render order.
    */

  }, {
    key: 'setRenderOrder',
    value: function setRenderOrder(renderOrder) {
      this.set(Property.RENDER_ORDER, renderOrder);
    }

    /**
    * Set the style for features.  This can be a single style object, an array
    * of styles, or a function that takes a feature and resolution and returns
    * an array of styles. If it is `undefined` the default style is used. If
    * it is `null` the layer has no style (a `null` style), so only features
    * that have their own styles will be rendered in the layer. See
    * {@link module:ol/style} for information on the default style.
    * @param {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction|null|undefined} style Layer style.
    * @api
    */

  }, {
    key: 'setStyle',
    value: function setStyle(style) {
      this.style_ = style !== undefined ? style : _Style.createDefaultStyle;
      this.styleFunction_ = style === null ? undefined : (0, _Style.toFunction)(this.style_);
      this.changed();
    }

    /**
    * @return {module:ol/layer/VectorRenderType|string} The render mode.
    */

  }, {
    key: 'getRenderMode',
    value: function getRenderMode() {
      return this.renderMode_;
    }
  }]);

  return VectorLayer;
}(_Layer3.default);

/**
 * Return the associated {@link module:ol/source/Vector vectorsource} of the layer.
 * @function
 * @return {module:ol/source/Vector} Source.
 * @api
 */


VectorLayer.prototype.getSource;

exports.default = VectorLayer;