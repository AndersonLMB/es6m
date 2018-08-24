'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderType = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LayerType = require('../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _asserts = require('../asserts.js');

var _TileProperty = require('../layer/TileProperty.js');

var _TileProperty2 = _interopRequireDefault(_TileProperty);

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _VectorTileRenderType = require('../layer/VectorTileRenderType.js');

var _VectorTileRenderType2 = _interopRequireDefault(_VectorTileRenderType);

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/VectorTile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 * Render mode for vector tiles:
 *  * `'image'`: Vector tiles are rendered as images. Great performance, but
 *    point symbols and texts are always rotated with the view and pixels are
 *    scaled during zoom animations.
 *  * `'hybrid'`: Polygon and line elements are rendered as images, so pixels
 *    are scaled during zoom animations. Point symbols and texts are accurately
 *    rendered as vectors and can stay upright on rotated views.
 *  * `'vector'`: Vector tiles are rendered as vectors. Most accurate rendering
 *    even during animations, but slower performance than the other options.
 * @api
 */
var RenderType = exports.RenderType = {
  IMAGE: 'image',
  HYBRID: 'hybrid',
  VECTOR: 'vector'
};

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
 * @property {number} [renderBuffer=100] The buffer in pixels around the tile extent used by the
 * renderer when getting features from the vector tile for the rendering or hit-detection.
 * Recommended value: Vector tiles are usually generated with a buffer, so this value should match
 * the largest possible buffer of the used tiles. It should be at least the size of the largest
 * point symbol or line width.
 * @property {module:ol/layer/VectorTileRenderType|string} [renderMode='hybrid'] Render mode for vector tiles:
 *  * `'image'`: Vector tiles are rendered as images. Great performance, but point symbols and texts
 *    are always rotated with the view and pixels are scaled during zoom animations.
 *  * `'hybrid'`: Polygon and line elements are rendered as images, so pixels are scaled during zoom
 *    animations. Point symbols and texts are accurately rendered as vectors and can stay upright on
 *    rotated views.
 *  * `'vector'`: Vector tiles are rendered as vectors. Most accurate rendering even during
 *    animations, but slower performance than the other options.
 *
 * When `declutter` is set to `true`, `'hybrid'` will be used instead of `'image'`.
 * @property {module:ol/source/VectorTile} [source] Source.
 * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
 * image and text styles, and the priority is defined by the z-index of the style. Lower z-index
 * means higher priority. When set to `true`, a `renderMode` of `'image'` will be overridden with
 * `'hybrid'`.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style] Layer style. See
 * {@link module:ol/style} for default style which will be used if this is not defined.
 * @property {boolean} [updateWhileAnimating=false] When set to `true`, feature batches will be
 * recreated during animations. This means that no vectors will be shown clipped, but the setting
 * will have a performance impact for large amounts of vector data. When set to `false`, batches
 * will be recreated when no animation is active.
 * @property {boolean} [updateWhileInteracting=false] When set to `true`, feature batches will be
 * recreated during interactions. See also `updateWhileAnimating`.
 * @property {number} [preload=0] Preload. Load low-resolution tiles up to `preload` levels. `0`
 * means no preloading.
 * @property {module:ol/render~OrderFunction} [renderOrder] Render order. Function to be used when sorting
 * features before rendering. By default features are drawn in the order that they are created.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style] Layer style. See
 * {@link module:ol/style} for default style which will be used if this is not defined.
 * @property {boolean} [useInterimTilesOnError=true] Use interim tiles on error.
 */

/**
 * @classdesc
 * Layer for vector tile data that is rendered client-side.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @param {module:ol/layer/VectorTile~Options=} opt_options Options.
 * @api
 */

var VectorTileLayer = function (_VectorLayer) {
  _inherits(VectorTileLayer, _VectorLayer);

  /**
   * @param {module:ol/layer/VectorTile~Options=} opt_options Options.
   */
  function VectorTileLayer(opt_options) {
    _classCallCheck(this, VectorTileLayer);

    var options = opt_options ? opt_options : {};

    var renderMode = options.renderMode || _VectorTileRenderType2.default.HYBRID;
    (0, _asserts.assert)(renderMode == undefined || renderMode == _VectorTileRenderType2.default.IMAGE || renderMode == _VectorTileRenderType2.default.HYBRID || renderMode == _VectorTileRenderType2.default.VECTOR, 28); // `renderMode` must be `'image'`, `'hybrid'` or `'vector'`
    if (options.declutter && renderMode == _VectorTileRenderType2.default.IMAGE) {
      renderMode = _VectorTileRenderType2.default.HYBRID;
    }
    options.renderMode = renderMode;

    var baseOptions = (0, _obj.assign)({}, options);

    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;

    var _this = _possibleConstructorReturn(this, (VectorTileLayer.__proto__ || Object.getPrototypeOf(VectorTileLayer)).call(this, baseOptions));

    _this.setPreload(options.preload ? options.preload : 0);
    _this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ? options.useInterimTilesOnError : true);

    /**
    * The layer type.
    * @protected
    * @type {module:ol/LayerType}
    */
    _this.type = _LayerType2.default.VECTOR_TILE;

    return _this;
  }

  /**
  * Return the level as number to which we will preload tiles up to.
  * @return {number} The level to preload tiles up to.
  * @observable
  * @api
  */


  _createClass(VectorTileLayer, [{
    key: 'getPreload',
    value: function getPreload() {
      return (/** @type {number} */this.get(_TileProperty2.default.PRELOAD)
      );
    }

    /**
    * Whether we use interim tiles on error.
    * @return {boolean} Use interim tiles on error.
    * @observable
    * @api
    */

  }, {
    key: 'getUseInterimTilesOnError',
    value: function getUseInterimTilesOnError() {
      return (/** @type {boolean} */this.get(_TileProperty2.default.USE_INTERIM_TILES_ON_ERROR)
      );
    }

    /**
    * Set the level as number to which we will preload tiles up to.
    * @param {number} preload The level to preload tiles up to.
    * @observable
    * @api
    */

  }, {
    key: 'setPreload',
    value: function setPreload(preload) {
      this.set(_TileProperty2.default.PRELOAD, preload);
    }

    /**
    * Set whether we use interim tiles on error.
    * @param {boolean} useInterimTilesOnError Use interim tiles on error.
    * @observable
    * @api
    */

  }, {
    key: 'setUseInterimTilesOnError',
    value: function setUseInterimTilesOnError(useInterimTilesOnError) {
      this.set(_TileProperty2.default.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
    }
  }]);

  return VectorTileLayer;
}(_Vector2.default);

/**
 * Return the associated {@link module:ol/source/VectorTile vectortilesource} of the layer.
 * @function
 * @return {module:ol/source/VectorTile} Source.
 * @api
 */


VectorTileLayer.prototype.getSource;
exports.default = VectorTileLayer;