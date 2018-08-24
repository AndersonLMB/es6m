'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTION = undefined;

var _XYZ2 = require('../source/XYZ.js');

var _XYZ3 = _interopRequireDefault(_XYZ2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/OSM
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * The attribution containing a link to the OpenStreetMap Copyright and License
 * page.
 * @const
 * @type {string}
 * @api
 */
var ATTRIBUTION = exports.ATTRIBUTION = '&copy; ' + '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' + 'contributors.';

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {number} [maxZoom=19] Max zoom.
 * @property {boolean} [opaque=true] Whether the layer is opaque.
 * @property {number} [reprojectionErrorThreshold=1.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url='https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'] URL template.
 * Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * Layer source for the OpenStreetMap tile server.
 * @api
 */

var OSM = function (_XYZ) {
  _inherits(OSM, _XYZ);

  /**
   * @param {module:ol/source/OSM~Options=} [opt_options] Open Street Map options.
   */
  function OSM(opt_options) {
    _classCallCheck(this, OSM);

    var options = opt_options || {};

    var attributions = void 0;
    if (options.attributions !== undefined) {
      attributions = options.attributions;
    } else {
      attributions = [ATTRIBUTION];
    }

    var crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : 'anonymous';

    var url = options.url !== undefined ? options.url : 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    return _possibleConstructorReturn(this, (OSM.__proto__ || Object.getPrototypeOf(OSM)).call(this, {
      attributions: attributions,
      cacheSize: options.cacheSize,
      crossOrigin: crossOrigin,
      opaque: options.opaque !== undefined ? options.opaque : true,
      maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileLoadFunction: options.tileLoadFunction,
      url: url,
      wrapX: options.wrapX
    }));
  }

  return OSM;
}(_XYZ3.default);

exports.default = OSM;