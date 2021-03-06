'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionsFromCapabilities = optionsFromCapabilities;

var _tileurlfunction = require('../tileurlfunction.js');

var _array = require('../array.js');

var _extent = require('../extent.js');

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _WMTSRequestEncoding = require('../source/WMTSRequestEncoding.js');

var _WMTSRequestEncoding2 = _interopRequireDefault(_WMTSRequestEncoding);

var _WMTS = require('../tilegrid/WMTS.js');

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/WMTS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {module:ol/tilegrid/WMTS} tileGrid Tile grid.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/source/WMTSRequestEncoding|string} [requestEncoding='KVP'] Request encoding.
 * @property {string} layer Layer name as advertised in the WMTS capabilities.
 * @property {string} style Style name as advertised in the WMTS capabilities.
 * @property {module:ol/ImageTile~TileClass} [tileClass]  Class used to instantiate image tiles. Default is {@link module:ol/ImageTile~ImageTile}.
 * @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service.
 * For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`.
 * @property {string} [version='image/jpeg'] Image format.
 * @property {string} [format='1.0.0'] WMTS version.
 * @property {string} matrixSet Matrix set.
 * @property {!Object} [dimensions] Additional "dimensions" for tile requests.
 * This is an object with properties named like the advertised WMTS dimensions.
 * @property {string} [url]  A URL for the service.
 * For the RESTful request encoding, this is a URL
 * template.  For KVP encoding, it is normal URL. A `{?-?}` template pattern,
 * for example `subdomain{a-f}.domain.com`, may be used instead of defining
 * each one separately in the `urls` option.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {Array<string>} [urls] An array of URLs.
 * Requests will be distributed among the URLs in this array.
 * @property {boolean} [wrapX=false] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */

/**
 * @classdesc
 * Layer source for tile data from WMTS servers.
 * @api
 */
var WMTS = function (_TileImage) {
  _inherits(WMTS, _TileImage);

  /**
   * @param {module:ol/source/WMTS~Options=} options WMTS options.
   */
  function WMTS(options) {
    _classCallCheck(this, WMTS);

    // TODO: add support for TileMatrixLimits

    var requestEncoding = options.requestEncoding !== undefined ?
    /** @type {module:ol/source/WMTSRequestEncoding} */options.requestEncoding : _WMTSRequestEncoding2.default.KVP;

    // FIXME: should we create a default tileGrid?
    // we could issue a getCapabilities xhr to retrieve missing configuration
    var tileGrid = options.tileGrid;

    var urls = options.urls;
    if (urls === undefined && options.url !== undefined) {
      urls = (0, _tileurlfunction.expandUrl)(options.url);
    }

    /**
     * @private
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (WMTS.__proto__ || Object.getPrototypeOf(WMTS)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: options.tileClass,
      tileGrid: tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: _tileurlfunction.nullTileUrlFunction,
      urls: urls,
      wrapX: options.wrapX !== undefined ? options.wrapX : false,
      transition: options.transition
    }));

    _this.version_ = options.version !== undefined ? options.version : '1.0.0';

    /**
     * @private
     * @type {string}
     */
    _this.format_ = options.format !== undefined ? options.format : 'image/jpeg';

    /**
     * @private
     * @type {!Object}
     */
    _this.dimensions_ = options.dimensions !== undefined ? options.dimensions : {};

    /**
     * @private
     * @type {string}
     */
    _this.layer_ = options.layer;

    /**
     * @private
     * @type {string}
     */
    _this.matrixSet_ = options.matrixSet;

    /**
     * @private
     * @type {string}
     */
    _this.style_ = options.style;

    // FIXME: should we guess this requestEncoding from options.url(s)
    //        structure? that would mean KVP only if a template is not provided.

    /**
     * @private
     * @type {module:ol/source/WMTSRequestEncoding}
     */
    _this.requestEncoding_ = requestEncoding;

    _this.setKey(_this.getKeyForDimensions_());

    if (urls && urls.length > 0) {
      _this.tileUrlFunction = (0, _tileurlfunction.createFromTileUrlFunctions)(urls.map(createFromWMTSTemplate.bind(_this)));
    }

    return _this;
  }

  return WMTS;
}(_TileImage3.default);

/**
 * Set the URLs to use for requests.
 * URLs may contain OCG conform URL Template Variables: {TileMatrix}, {TileRow}, {TileCol}.
 * @override
 */


WMTS.prototype.setUrls = function (urls) {
  this.urls = urls;
  var key = urls.join('\n');
  this.setTileUrlFunction(this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : (0, _tileurlfunction.createFromTileUrlFunctions)(urls.map(createFromWMTSTemplate.bind(this))), key);
};

/**
 * Get the dimensions, i.e. those passed to the constructor through the
 * "dimensions" option, and possibly updated using the updateDimensions
 * method.
 * @return {!Object} Dimensions.
 * @api
 */
WMTS.prototype.getDimensions = function () {
  return this.dimensions_;
};

/**
 * Return the image format of the WMTS source.
 * @return {string} Format.
 * @api
 */
WMTS.prototype.getFormat = function () {
  return this.format_;
};

/**
 * Return the layer of the WMTS source.
 * @return {string} Layer.
 * @api
 */
WMTS.prototype.getLayer = function () {
  return this.layer_;
};

/**
 * Return the matrix set of the WMTS source.
 * @return {string} MatrixSet.
 * @api
 */
WMTS.prototype.getMatrixSet = function () {
  return this.matrixSet_;
};

/**
 * Return the request encoding, either "KVP" or "REST".
 * @return {module:ol/source/WMTSRequestEncoding} Request encoding.
 * @api
 */
WMTS.prototype.getRequestEncoding = function () {
  return this.requestEncoding_;
};

/**
 * Return the style of the WMTS source.
 * @return {string} Style.
 * @api
 */
WMTS.prototype.getStyle = function () {
  return this.style_;
};

/**
 * Return the version of the WMTS source.
 * @return {string} Version.
 * @api
 */
WMTS.prototype.getVersion = function () {
  return this.version_;
};

/**
 * @private
 * @return {string} The key for the current dimensions.
 */
WMTS.prototype.getKeyForDimensions_ = function () {
  var i = 0;
  var res = [];
  for (var key in this.dimensions_) {
    res[i++] = key + '-' + this.dimensions_[key];
  }
  return res.join('/');
};

/**
 * Update the dimensions.
 * @param {Object} dimensions Dimensions.
 * @api
 */
WMTS.prototype.updateDimensions = function (dimensions) {
  (0, _obj.assign)(this.dimensions_, dimensions);
  this.setKey(this.getKeyForDimensions_());
};

/**
 * Generate source options from a capabilities object.
 * @param {Object} wmtsCap An object representing the capabilities document.
 * @param {!Object} config Configuration properties for the layer.  Defaults for
 *                  the layer will apply if not provided.
 *
 * Required config properties:
 *  - layer - {string} The layer identifier.
 *
 * Optional config properties:
 *  - matrixSet - {string} The matrix set identifier, required if there is
 *       more than one matrix set in the layer capabilities.
 *  - projection - {string} The desired CRS when no matrixSet is specified.
 *       eg: "EPSG:3857". If the desired projection is not available,
 *       an error is thrown.
 *  - requestEncoding - {string} url encoding format for the layer. Default is
 *       the first tile url format found in the GetCapabilities response.
 *  - style - {string} The name of the style
 *  - format - {string} Image format for the layer. Default is the first
 *       format returned in the GetCapabilities response.
 *  - crossOrigin - {string|null|undefined} Cross origin. Default is `undefined`.
 * @return {?module:ol/source/WMTS~Options} WMTS source options object or `null` if the layer was not found.
 * @api
 */
function optionsFromCapabilities(wmtsCap, config) {
  var layers = wmtsCap['Contents']['Layer'];
  var l = (0, _array.find)(layers, function (elt, index, array) {
    return elt['Identifier'] == config['layer'];
  });
  if (l === null) {
    return null;
  }
  var tileMatrixSets = wmtsCap['Contents']['TileMatrixSet'];
  var idx = void 0;
  if (l['TileMatrixSetLink'].length > 1) {
    if ('projection' in config) {
      idx = (0, _array.findIndex)(l['TileMatrixSetLink'], function (elt, index, array) {
        var tileMatrixSet = (0, _array.find)(tileMatrixSets, function (el) {
          return el['Identifier'] == elt['TileMatrixSet'];
        });
        var supportedCRS = tileMatrixSet['SupportedCRS'];
        var proj1 = (0, _proj.get)(supportedCRS.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || (0, _proj.get)(supportedCRS);
        var proj2 = (0, _proj.get)(config['projection']);
        if (proj1 && proj2) {
          return (0, _proj.equivalent)(proj1, proj2);
        } else {
          return supportedCRS == config['projection'];
        }
      });
    } else {
      idx = (0, _array.findIndex)(l['TileMatrixSetLink'], function (elt, index, array) {
        return elt['TileMatrixSet'] == config['matrixSet'];
      });
    }
  } else {
    idx = 0;
  }
  if (idx < 0) {
    idx = 0;
  }
  var matrixSet = /** @type {string} */
  l['TileMatrixSetLink'][idx]['TileMatrixSet'];
  var matrixLimits = /** @type {Array<Object>} */
  l['TileMatrixSetLink'][idx]['TileMatrixSetLimits'];

  var format = /** @type {string} */l['Format'][0];
  if ('format' in config) {
    format = config['format'];
  }
  idx = (0, _array.findIndex)(l['Style'], function (elt, index, array) {
    if ('style' in config) {
      return elt['Title'] == config['style'];
    } else {
      return elt['isDefault'];
    }
  });
  if (idx < 0) {
    idx = 0;
  }
  var style = /** @type {string} */l['Style'][idx]['Identifier'];

  var dimensions = {};
  if ('Dimension' in l) {
    l['Dimension'].forEach(function (elt, index, array) {
      var key = elt['Identifier'];
      var value = elt['Default'];
      if (value === undefined) {
        value = elt['Value'][0];
      }
      dimensions[key] = value;
    });
  }

  var matrixSets = wmtsCap['Contents']['TileMatrixSet'];
  var matrixSetObj = (0, _array.find)(matrixSets, function (elt, index, array) {
    return elt['Identifier'] == matrixSet;
  });

  var projection = void 0;
  var code = matrixSetObj['SupportedCRS'];
  if (code) {
    projection = (0, _proj.get)(code.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || (0, _proj.get)(code);
  }
  if ('projection' in config) {
    var projConfig = (0, _proj.get)(config['projection']);
    if (projConfig) {
      if (!projection || (0, _proj.equivalent)(projConfig, projection)) {
        projection = projConfig;
      }
    }
  }

  var wgs84BoundingBox = l['WGS84BoundingBox'];
  var extent = void 0,
      wrapX = void 0;
  if (wgs84BoundingBox !== undefined) {
    var wgs84ProjectionExtent = (0, _proj.get)('EPSG:4326').getExtent();
    wrapX = wgs84BoundingBox[0] == wgs84ProjectionExtent[0] && wgs84BoundingBox[2] == wgs84ProjectionExtent[2];
    extent = (0, _proj.transformExtent)(wgs84BoundingBox, 'EPSG:4326', projection);
    var projectionExtent = projection.getExtent();
    if (projectionExtent) {
      // If possible, do a sanity check on the extent - it should never be
      // bigger than the validity extent of the projection of a matrix set.
      if (!(0, _extent.containsExtent)(projectionExtent, extent)) {
        extent = undefined;
      }
    }
  }

  var tileGrid = (0, _WMTS.createFromCapabilitiesMatrixSet)(matrixSetObj, extent, matrixLimits);

  /** @type {!Array<string>} */
  var urls = [];
  var requestEncoding = config['requestEncoding'];
  requestEncoding = requestEncoding !== undefined ? requestEncoding : '';

  if ('OperationsMetadata' in wmtsCap && 'GetTile' in wmtsCap['OperationsMetadata']) {
    var gets = wmtsCap['OperationsMetadata']['GetTile']['DCP']['HTTP']['Get'];

    for (var i = 0, ii = gets.length; i < ii; ++i) {
      if (gets[i]['Constraint']) {
        var constraint = (0, _array.find)(gets[i]['Constraint'], function (element) {
          return element['name'] == 'GetEncoding';
        });
        var encodings = constraint['AllowedValues']['Value'];

        if (requestEncoding === '') {
          // requestEncoding not provided, use the first encoding from the list
          requestEncoding = encodings[0];
        }
        if (requestEncoding === _WMTSRequestEncoding2.default.KVP) {
          if ((0, _array.includes)(encodings, _WMTSRequestEncoding2.default.KVP)) {
            urls.push( /** @type {string} */gets[i]['href']);
          }
        } else {
          break;
        }
      } else if (gets[i]['href']) {
        requestEncoding = _WMTSRequestEncoding2.default.KVP;
        urls.push( /** @type {string} */gets[i]['href']);
      }
    }
  }
  if (urls.length === 0) {
    requestEncoding = _WMTSRequestEncoding2.default.REST;
    l['ResourceURL'].forEach(function (element) {
      if (element['resourceType'] === 'tile') {
        format = element['format'];
        urls.push( /** @type {string} */element['template']);
      }
    });
  }

  return {
    urls: urls,
    layer: config['layer'],
    matrixSet: matrixSet,
    format: format,
    projection: projection,
    requestEncoding: requestEncoding,
    tileGrid: tileGrid,
    style: style,
    dimensions: dimensions,
    wrapX: wrapX,
    crossOrigin: config['crossOrigin']
  };
}

/**
 * @param {string} template Template.
 * @return {module:ol/Tile~UrlFunction} Tile URL function.
 * @this {module:ol/source/WMTS}
 */
function createFromWMTSTemplate(template) {
  var requestEncoding = this.requestEncoding_;

  // context property names are lower case to allow for a case insensitive
  // replacement as some services use different naming conventions
  var context = {
    'layer': this.layer_,
    'style': this.style_,
    'tilematrixset': this.matrixSet_
  };

  if (requestEncoding == _WMTSRequestEncoding2.default.KVP) {
    (0, _obj.assign)(context, {
      'Service': 'WMTS',
      'Request': 'GetTile',
      'Version': this.version_,
      'Format': this.format_
    });
  }

  // TODO: we may want to create our own appendParams function so that params
  // order conforms to wmts spec guidance, and so that we can avoid to escape
  // special template params

  template = requestEncoding == _WMTSRequestEncoding2.default.KVP ? (0, _uri.appendParams)(template, context) : template.replace(/\{(\w+?)\}/g, function (m, p) {
    return p.toLowerCase() in context ? context[p.toLowerCase()] : m;
  });

  var tileGrid = this.tileGrid;

  return (
    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function (tileCoord, pixelRatio, projection) {
      if (!tileCoord) {
        return undefined;
      } else {
        var localContext = {
          'TileMatrix': tileGrid.getMatrixId(tileCoord[0]),
          'TileCol': tileCoord[1],
          'TileRow': -tileCoord[2] - 1
        };
        (0, _obj.assign)(localContext, this.dimensions_);
        var url = template;
        if (requestEncoding == _WMTSRequestEncoding2.default.KVP) {
          url = (0, _uri.appendParams)(url, localContext);
        } else {
          url = url.replace(/\{(\w+?)\}/g, function (m, p) {
            return localContext[p];
          });
        }
        return url;
      }
    }
  );
}

exports.default = WMTS;