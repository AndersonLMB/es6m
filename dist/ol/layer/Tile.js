'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LayerType = require('../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _Layer2 = require('../layer/Layer.js');

var _Layer3 = _interopRequireDefault(_Layer2);

var _TileProperty = require('../layer/TileProperty.js');

var _TileProperty2 = _interopRequireDefault(_TileProperty);

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Tile
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
 * @property {number} [preload=0] Preload. Load low-resolution tiles up to `preload` levels. `0`
 * means no preloading.
 * @property {module:ol/source/Tile} [source] Source for this layer.
 * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {boolean} [useInterimTilesOnError=true] Use interim tiles on error.
 */

/**
 * @classdesc
 * For layer sources that provide pre-rendered, tiled images in grids that are
 * organized by zoom levels for specific resolutions.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @api
 */
var TileLayer = function (_Layer) {
  _inherits(TileLayer, _Layer);

  /**
   * @param {module:ol/layer/Tile~Options=} opt_options Tile layer options.
   */
  function TileLayer(opt_options) {
    _classCallCheck(this, TileLayer);

    var options = opt_options ? opt_options : {};

    var baseOptions = (0, _obj.assign)({}, options);

    delete baseOptions.preload;
    delete baseOptions.useInterimTilesOnError;

    var _this = _possibleConstructorReturn(this, (TileLayer.__proto__ || Object.getPrototypeOf(TileLayer)).call(this, baseOptions));

    _this.setPreload(options.preload !== undefined ? options.preload : 0);
    _this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ? options.useInterimTilesOnError : true);

    /**
    * The layer type.
    * @protected
    * @type {module:ol/LayerType}
    */
    _this.type = _LayerType2.default.TILE;

    return _this;
  }

  /**
  * Return the level as number to which we will preload tiles up to.
  * @return {number} The level to preload tiles up to.
  * @observable
  * @api
  */


  _createClass(TileLayer, [{
    key: 'getPreload',
    value: function getPreload() {
      return (/** @type {number} */this.get(_TileProperty2.default.PRELOAD)
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

  return TileLayer;
}(_Layer3.default);

/**
 * Return the associated {@link module:ol/source/Tile tilesource} of the layer.
 * @function
 * @return {module:ol/source/Tile} Source.
 * @api
 */


TileLayer.prototype.getSource;

exports.default = TileLayer;