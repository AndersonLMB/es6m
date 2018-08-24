'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _OSM = require('../source/OSM.js');

var _XYZ2 = require('../source/XYZ.js');

var _XYZ3 = _interopRequireDefault(_XYZ2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Stamen
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @const
 * @type {Array<string>}
 */
var ATTRIBUTIONS = ['Map tiles by <a href="https://stamen.com/">Stamen Design</a>, ' + 'under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY' + ' 3.0</a>.', _OSM.ATTRIBUTION];

/**
 * @type {Object<string, {extension: string, opaque: boolean}>}
 */
var LayerConfig = {
  'terrain': {
    extension: 'jpg',
    opaque: true
  },
  'terrain-background': {
    extension: 'jpg',
    opaque: true
  },
  'terrain-labels': {
    extension: 'png',
    opaque: false
  },
  'terrain-lines': {
    extension: 'png',
    opaque: false
  },
  'toner-background': {
    extension: 'png',
    opaque: true
  },
  'toner': {
    extension: 'png',
    opaque: true
  },
  'toner-hybrid': {
    extension: 'png',
    opaque: false
  },
  'toner-labels': {
    extension: 'png',
    opaque: false
  },
  'toner-lines': {
    extension: 'png',
    opaque: false
  },
  'toner-lite': {
    extension: 'png',
    opaque: true
  },
  'watercolor': {
    extension: 'jpg',
    opaque: true
  }
};

/**
 * @type {Object<string, {minZoom: number, maxZoom: number}>}
 */
var ProviderConfig = {
  'terrain': {
    minZoom: 4,
    maxZoom: 18
  },
  'toner': {
    minZoom: 0,
    maxZoom: 20
  },
  'watercolor': {
    minZoom: 1,
    maxZoom: 16
  }
};

/**
 * @typedef {Object} Options
 * @property {number} [cacheSize=2048] Cache size.
 * @property {string} [layer] Layer.
 * @property {number} [minZoom] Minimum zoom.
 * @property {number} [maxZoom] Maximum zoom.
 * @property {boolean} [opaque] Whether the layer is opaque.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction]
 * Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * Layer source for the Stamen tile server.
 * @api
 */

var Stamen = function (_XYZ) {
  _inherits(Stamen, _XYZ);

  /**
   * @param {module:ol/source/Stamen~Options=} options Stamen options.
   */
  function Stamen(options) {
    _classCallCheck(this, Stamen);

    var i = options.layer.indexOf('-');
    var provider = i == -1 ? options.layer : options.layer.slice(0, i);
    var providerConfig = ProviderConfig[provider];

    var layerConfig = LayerConfig[options.layer];

    var url = options.url !== undefined ? options.url : 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/' + options.layer + '/{z}/{x}/{y}.' + layerConfig.extension;

    return _possibleConstructorReturn(this, (Stamen.__proto__ || Object.getPrototypeOf(Stamen)).call(this, {
      attributions: ATTRIBUTIONS,
      cacheSize: options.cacheSize,
      crossOrigin: 'anonymous',
      maxZoom: options.maxZoom != undefined ? options.maxZoom : providerConfig.maxZoom,
      minZoom: options.minZoom != undefined ? options.minZoom : providerConfig.minZoom,
      opaque: layerConfig.opaque,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileLoadFunction: options.tileLoadFunction,
      url: url,
      wrapX: options.wrapX
    }));
  }

  return Stamen;
}(_XYZ3.default);

exports.default = Stamen;