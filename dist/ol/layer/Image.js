'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LayerType = require('../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _Layer2 = require('../layer/Layer.js');

var _Layer3 = _interopRequireDefault(_Layer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Image
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
 * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
 * this layer in its layers collection, and the layer will be rendered on top. This is useful for
 * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
 * use {@link module:ol/Map#addLayer}.
 * @property {module:ol/source/Image} [source] Source for this layer.
 */

/**
 * @classdesc
 * Server-rendered images that are available for arbitrary extents and
 * resolutions.
 * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @fires module:ol/render/Event~RenderEvent
 * @api
 */
var ImageLayer = function (_Layer) {
  _inherits(ImageLayer, _Layer);

  /**
   * @param {module:ol/layer/Image~Options=} opt_options Layer options.
   */
  function ImageLayer(opt_options) {
    _classCallCheck(this, ImageLayer);

    var options = opt_options ? opt_options : {};

    /**
     * The layer type.
     * @protected
     * @type {module:ol/LayerType}
     */
    var _this = _possibleConstructorReturn(this, (ImageLayer.__proto__ || Object.getPrototypeOf(ImageLayer)).call(this, options));

    _this.type = _LayerType2.default.IMAGE;

    return _this;
  }

  return ImageLayer;
}(_Layer3.default);

/**
 * Return the associated {@link module:ol/source/Image source} of the image layer.
 * @function
 * @return {module:ol/source/Image} Source.
 * @api
 */


ImageLayer.prototype.getSource;
exports.default = ImageLayer;