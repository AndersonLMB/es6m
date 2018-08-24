'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../extent.js');

var _math = require('../math.js');

var _obj = require('../obj.js');

var _size = require('../size.js');

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _tilecoord = require('../tilecoord.js');

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/TileArcGISRest
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.
 * Note that you must provide a `crossOrigin` value if you are using the WebGL renderer
 * or if you want to access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
 * for more detail.
 * @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service defaults will be
 * used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is `IMAGE` by
 * default. `TRANSPARENT` is `true` by default.  `BBOX, `SIZE`, `BBOXSR`,
 * and `IMAGESR` will be set dynamically. Set `LAYERS` to
 * override the default service layer visibility. See
 * http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Export_Map/02r3000000v7000000/
 * for further reference.
 * @property {module:ol/tilegrid/TileGrid} [tileGrid] Tile grid. Base this on the resolutions,
 * tilesize and extent supported by the server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL.
 * The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] ArcGIS Rest service URL for a Map Service or Image Service. The
 * url should include /MapServer or /ImageServer.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.  To disable the opacity
 * transition, pass `transition: 0`.
 * @property {Array<string>} urls ArcGIS Rest service urls. Use this instead of `url` when the ArcGIS
 * Service supports multiple urls for export requests.
 */

/**
 * @classdesc
 * Layer source for tile data from ArcGIS Rest services. Map and Image
 * Services are supported.
 *
 * For cached ArcGIS services, better performance is available using the
 * {@link module:ol/source/XYZ~XYZ} data source.
 * @api
 */
var TileArcGISRest = function (_TileImage) {
  _inherits(TileArcGISRest, _TileImage);

  /**
   * @param {module:ol/source/TileArcGISRest~Options=} opt_options Tile ArcGIS Rest options.
   */
  function TileArcGISRest(opt_options) {
    _classCallCheck(this, TileArcGISRest);

    var options = opt_options || {};

    /**
     * @private
     * @type {!Object}
     */
    var _this = _possibleConstructorReturn(this, (TileArcGISRest.__proto__ || Object.getPrototypeOf(TileArcGISRest)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition
    }));

    _this.params_ = options.params || {};

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.tmpExtent_ = (0, _extent.createEmpty)();

    _this.setKey(_this.getKeyForParams_());
    return _this;
  }

  /**
   * @private
   * @return {string} The key for the current params.
   */


  _createClass(TileArcGISRest, [{
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

      // ArcGIS Server only wants the numeric portion of the projection ID.
      var srid = projection.getCode().split(':').pop();

      params['SIZE'] = tileSize[0] + ',' + tileSize[1];
      params['BBOX'] = tileExtent.join(',');
      params['BBOXSR'] = srid;
      params['IMAGESR'] = srid;
      params['DPI'] = Math.round(params['DPI'] ? params['DPI'] * pixelRatio : 90 * pixelRatio);

      var url = void 0;
      if (urls.length == 1) {
        url = urls[0];
      } else {
        var index = (0, _math.modulo)((0, _tilecoord.hash)(tileCoord), urls.length);
        url = urls[index];
      }

      var modifiedUrl = url.replace(/MapServer\/?$/, 'MapServer/export').replace(/ImageServer\/?$/, 'ImageServer/exportImage');
      return (0, _uri.appendParams)(modifiedUrl, params);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTilePixelRatio',
    value: function getTilePixelRatio(pixelRatio) {
      return (/** @type {number} */pixelRatio
      );
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

      var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent_);
      var tileSize = (0, _size.toSize)(tileGrid.getTileSize(tileCoord[0]), this.tmpSize);

      if (pixelRatio != 1) {
        tileSize = (0, _size.scale)(tileSize, pixelRatio, this.tmpSize);
      }

      // Apply default params and override with user specified values.
      var baseParams = {
        'F': 'image',
        'FORMAT': 'PNG32',
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
      this.setKey(this.getKeyForParams_());
    }
  }]);

  return TileArcGISRest;
}(_TileImage3.default);

exports.default = TileArcGISRest;