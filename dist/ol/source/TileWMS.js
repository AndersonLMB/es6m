'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

var _asserts = require('../asserts.js');

var _extent = require('../extent.js');

var _obj = require('../obj.js');

var _math = require('../math.js');

var _proj = require('../proj.js');

var _reproj = require('../reproj.js');

var _size = require('../size.js');

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _WMSServerType = require('../source/WMSServerType.js');

var _WMSServerType2 = _interopRequireDefault(_WMSServerType);

var _tilecoord = require('../tilecoord.js');

var _string = require('../string.js');

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/TileWMS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {Object<string,*>} params WMS request parameters.
 * At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @property {number} [gutter=0]
 * The size in pixels of the gutter around image tiles to ignore. By setting
 * this property to a non-zero value, images will be requested that are wider
 * and taller than the tile size by a value of `2 x gutter`.
 * Using a non-zero value allows artifacts of rendering at tile edges to be
 * ignored. If you control the WMS service it is recommended to address
 * "artifacts at tile edges" issues by properly configuring the WMS service. For
 * example, MapServer has a `tile_map_edge_buffer` configuration parameter for
 * this. See http://mapserver.org/output/tile_mode.html.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/ImageTile~TileClass} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/ImageTile~TileClass}.
 * @property {module:ol/tilegrid/TileGrid} [tileGrid] Tile grid. Base this on the resolutions,
 * tilesize and extent supported by the server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used..
 * @property {module:ol/source/WMSServerType|string} [serverType]
 * The type of the remote WMS server. Currently only used when `hidpi` is
 * `true`.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] WMS service URL.
 * @property {Array<string>} [urls] WMS service urls.
 * Use this instead of `url` when the WMS supports multiple urls for GetMap requests.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * When set to `false`, only one world
 * will be rendered. When `true`, tiles will be requested for one world only,
 * but they will be wrapped horizontally to render multiple worlds.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */

/**
 * @classdesc
 * Layer source for tile data from WMS servers.
 * @api
 */
var TileWMS = function (_TileImage) {
  _inherits(TileWMS, _TileImage);

  /**
   * @param {module:ol/source/TileWMS~Options=} [opt_options] Tile WMS options.
   */
  function TileWMS(opt_options) {
    _classCallCheck(this, TileWMS);

    var options = opt_options || {};

    var params = options.params || {};

    var transparent = 'TRANSPARENT' in params ? params['TRANSPARENT'] : true;

    /**
     * @private
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (TileWMS.__proto__ || Object.getPrototypeOf(TileWMS)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      opaque: !transparent,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: options.tileClass,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition
    }));

    _this.gutter_ = options.gutter !== undefined ? options.gutter : 0;

    /**
     * @private
     * @type {!Object}
     */
    _this.params_ = params;

    /**
     * @private
     * @type {boolean}
     */
    _this.v13_ = true;

    /**
     * @private
     * @type {module:ol/source/WMSServerType|undefined}
     */
    _this.serverType_ = /** @type {module:ol/source/WMSServerType|undefined} */options.serverType;

    /**
     * @private
     * @type {boolean}
     */
    _this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.tmpExtent_ = (0, _extent.createEmpty)();

    _this.updateV13_();
    _this.setKey(_this.getKeyForParams_());

    return _this;
  }

  /**
   * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
   * projection. Return `undefined` if the GetFeatureInfo URL cannot be
   * constructed.
   * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {module:ol/proj~ProjectionLike} projection Projection.
   * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
   *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
   *     in the `LAYERS` parameter will be used. `VERSION` should not be
   *     specified here.
   * @return {string|undefined} GetFeatureInfo URL.
   * @api
   */


  _createClass(TileWMS, [{
    key: 'getGetFeatureInfoUrl',
    value: function getGetFeatureInfoUrl(coordinate, resolution, projection, params) {
      var projectionObj = (0, _proj.get)(projection);
      var sourceProjectionObj = this.getProjection();

      var tileGrid = this.getTileGrid();
      if (!tileGrid) {
        tileGrid = this.getTileGridForProjection(projectionObj);
      }

      var tileCoord = tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);

      if (tileGrid.getResolutions().length <= tileCoord[0]) {
        return undefined;
      }

      var tileResolution = tileGrid.getResolution(tileCoord[0]);
      var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
      var tileSize = (0, _size.toSize)(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);

      var gutter = this.gutter_;
      if (gutter !== 0) {
        tileSize = (0, _size.buffer)(tileSize, gutter, this.tmpSize);
        tileExtent = (0, _extent.buffer)(tileExtent, tileResolution * gutter, tileExtent);
      }

      if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
        tileResolution = (0, _reproj.calculateSourceResolution)(sourceProjectionObj, projectionObj, coordinate, tileResolution);
        tileExtent = (0, _proj.transformExtent)(tileExtent, projectionObj, sourceProjectionObj);
        coordinate = (0, _proj.transform)(coordinate, projectionObj, sourceProjectionObj);
      }

      var baseParams = {
        'SERVICE': 'WMS',
        'VERSION': _common.DEFAULT_WMS_VERSION,
        'REQUEST': 'GetFeatureInfo',
        'FORMAT': 'image/png',
        'TRANSPARENT': true,
        'QUERY_LAYERS': this.params_['LAYERS']
      };
      (0, _obj.assign)(baseParams, this.params_, params);

      var x = Math.floor((coordinate[0] - tileExtent[0]) / tileResolution);
      var y = Math.floor((tileExtent[3] - coordinate[1]) / tileResolution);

      baseParams[this.v13_ ? 'I' : 'X'] = x;
      baseParams[this.v13_ ? 'J' : 'Y'] = y;

      return this.getRequestUrl_(tileCoord, tileSize, tileExtent, 1, sourceProjectionObj || projectionObj, baseParams);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getGutter',
    value: function getGutter() {
      return this.gutter_;
    }

    /**
     * Get the user-provided params, i.e. those passed to the constructor through
     * the "params" option, and possibly updated using the updateParams method.
     * @return {Object} Params.
     * @api
     */

  }, {
    key: 'getParams',
    value: function getParams() {
      return this.params_;
    }

    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {module:ol/size~Size} tileSize Tile size.
     * @param {module:ol/extent~Extent} tileExtent Tile extent.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {Object} params Params.
     * @return {string|undefined} Request URL.
     * @private
     */

  }, {
    key: 'getRequestUrl_',
    value: function getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {

      var urls = this.urls;
      if (!urls) {
        return undefined;
      }

      params['WIDTH'] = tileSize[0];
      params['HEIGHT'] = tileSize[1];

      params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

      if (!('STYLES' in this.params_)) {
        params['STYLES'] = '';
      }

      if (pixelRatio != 1) {
        switch (this.serverType_) {
          case _WMSServerType2.default.GEOSERVER:
            var dpi = 90 * pixelRatio + 0.5 | 0;
            if ('FORMAT_OPTIONS' in params) {
              params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
            } else {
              params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
            }
            break;
          case _WMSServerType2.default.MAPSERVER:
            params['MAP_RESOLUTION'] = 90 * pixelRatio;
            break;
          case _WMSServerType2.default.CARMENTA_SERVER:
          case _WMSServerType2.default.QGIS:
            params['DPI'] = 90 * pixelRatio;
            break;
          default:
            (0, _asserts.assert)(false, 52); // Unknown `serverType` configured
            break;
        }
      }

      var axisOrientation = projection.getAxisOrientation();
      var bbox = tileExtent;
      if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
        var tmp = void 0;
        tmp = tileExtent[0];
        bbox[0] = tileExtent[1];
        bbox[1] = tmp;
        tmp = tileExtent[2];
        bbox[2] = tileExtent[3];
        bbox[3] = tmp;
      }
      params['BBOX'] = bbox.join(',');

      var url = void 0;
      if (urls.length == 1) {
        url = urls[0];
      } else {
        var index = (0, _math.modulo)((0, _tilecoord.hash)(tileCoord), urls.length);
        url = urls[index];
      }
      return (0, _uri.appendParams)(url, params);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTilePixelRatio',
    value: function getTilePixelRatio(pixelRatio) {
      return !this.hidpi_ || this.serverType_ === undefined ? 1 :
      /** @type {number} */pixelRatio;
    }

    /**
     * @private
     * @return {string} The key for the current params.
     */

  }, {
    key: 'getKeyForParams_',
    value: function getKeyForParams_() {
      var i = 0;
      var res = [];
      for (var key in this.params_) {
        res[i++] = key + '-' + this.params_[key];
      }
      return res.join('/');
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'fixedTileUrlFunction',
    value: function fixedTileUrlFunction(tileCoord, pixelRatio, projection) {

      var tileGrid = this.getTileGrid();
      if (!tileGrid) {
        tileGrid = this.getTileGridForProjection(projection);
      }

      if (tileGrid.getResolutions().length <= tileCoord[0]) {
        return undefined;
      }

      if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === undefined)) {
        pixelRatio = 1;
      }

      var tileResolution = tileGrid.getResolution(tileCoord[0]);
      var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
      var tileSize = (0, _size.toSize)(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);

      var gutter = this.gutter_;
      if (gutter !== 0) {
        tileSize = (0, _size.buffer)(tileSize, gutter, this.tmpSize);
        tileExtent = (0, _extent.buffer)(tileExtent, tileResolution * gutter, tileExtent);
      }

      if (pixelRatio != 1) {
        tileSize = (0, _size.scale)(tileSize, pixelRatio, this.tmpSize);
      }

      var baseParams = {
        'SERVICE': 'WMS',
        'VERSION': _common.DEFAULT_WMS_VERSION,
        'REQUEST': 'GetMap',
        'FORMAT': 'image/png',
        'TRANSPARENT': true
      };
      (0, _obj.assign)(baseParams, this.params_);

      return this.getRequestUrl_(tileCoord, tileSize, tileExtent, pixelRatio, projection, baseParams);
    }

    /**
     * Update the user-provided params.
     * @param {Object} params Params.
     * @api
     */

  }, {
    key: 'updateParams',
    value: function updateParams(params) {
      (0, _obj.assign)(this.params_, params);
      this.updateV13_();
      this.setKey(this.getKeyForParams_());
    }

    /**
     * @private
     */

  }, {
    key: 'updateV13_',
    value: function updateV13_() {
      var version = this.params_['VERSION'] || _common.DEFAULT_WMS_VERSION;
      this.v13_ = (0, _string.compareVersions)(version, '1.3') >= 0;
    }
  }]);

  return TileWMS;
}(_TileImage3.default);

exports.default = TileWMS;