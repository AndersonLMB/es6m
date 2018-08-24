'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tileurlfunction = require('../tileurlfunction.js');

var _extent2 = require('../extent.js');

var _net = require('../net.js');

var _proj = require('../proj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _tilecoord = require('../tilecoord.js');

var _tilegrid = require('../tilegrid.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/BingMaps
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * The attribution containing a link to the Microsoft® Bing™ Maps Platform APIs’
 * Terms Of Use.
 * @const
 * @type {string}
 */
var TOS_ATTRIBUTION = '<a class="ol-attribution-bing-tos" ' + 'href="https://www.microsoft.com/maps/product/terms.html">' + 'Terms of Use</a>';

/**
 * @typedef {Object} Options
 * @property {number} [cacheSize=2048] Cache size.
 * @property {boolean} [hidpi=false] If `true` hidpi tiles will be requested.
 * @property {string} [culture='en-us'] Culture code.
 * @property {string} key Bing Maps API key. Get yours at http://www.bingmapsportal.com/.
 * @property {string} imagerySet Type of imagery.
 * @property {number} [maxZoom=21] Max zoom. Default is what's advertized by the BingMaps service.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */

/**
 * @classdesc
 * Layer source for Bing Maps tile data.
 * @api
 */

var BingMaps = function (_TileImage) {
  _inherits(BingMaps, _TileImage);

  /**
   * @param {module:ol/source/BingMaps~Options=} options Bing Maps options.
   */
  function BingMaps(options) {
    _classCallCheck(this, BingMaps);

    var hidpi = options.hidpi !== undefined ? options.hidpi : false;

    /**
     * @private
     * @type {boolean}
     */
    var _this = _possibleConstructorReturn(this, (BingMaps.__proto__ || Object.getPrototypeOf(BingMaps)).call(this, {
      cacheSize: options.cacheSize,
      crossOrigin: 'anonymous',
      opaque: true,
      projection: (0, _proj.get)('EPSG:3857'),
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      state: _State2.default.LOADING,
      tileLoadFunction: options.tileLoadFunction,
      tilePixelRatio: hidpi ? 2 : 1,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition
    }));

    _this.hidpi_ = hidpi;

    /**
     * @private
     * @type {string}
     */
    _this.culture_ = options.culture !== undefined ? options.culture : 'en-us';

    /**
     * @private
     * @type {number}
     */
    _this.maxZoom_ = options.maxZoom !== undefined ? options.maxZoom : -1;

    /**
     * @private
     * @type {string}
     */
    _this.apiKey_ = options.key;

    /**
     * @private
     * @type {string}
     */
    _this.imagerySet_ = options.imagerySet;

    var url = 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/' + _this.imagerySet_ + '?uriScheme=https&include=ImageryProviders&key=' + _this.apiKey_ + '&c=' + _this.culture_;

    (0, _net.jsonp)(url, _this.handleImageryMetadataResponse.bind(_this), undefined, 'jsonp');

    return _this;
  }

  /**
   * Get the api key used for this source.
   *
   * @return {string} The api key.
   * @api
   */


  _createClass(BingMaps, [{
    key: 'getApiKey',
    value: function getApiKey() {
      return this.apiKey_;
    }

    /**
     * Get the imagery set associated with this source.
     *
     * @return {string} The imagery set.
     * @api
     */

  }, {
    key: 'getImagerySet',
    value: function getImagerySet() {
      return this.imagerySet_;
    }

    /**
     * @param {BingMapsImageryMetadataResponse} response Response.
     */

  }, {
    key: 'handleImageryMetadataResponse',
    value: function handleImageryMetadataResponse(response) {
      if (response.statusCode != 200 || response.statusDescription != 'OK' || response.authenticationResultCode != 'ValidCredentials' || response.resourceSets.length != 1 || response.resourceSets[0].resources.length != 1) {
        this.setState(_State2.default.ERROR);
        return;
      }

      var resource = response.resourceSets[0].resources[0];
      var maxZoom = this.maxZoom_ == -1 ? resource.zoomMax : this.maxZoom_;

      var sourceProjection = this.getProjection();
      var extent = (0, _tilegrid.extentFromProjection)(sourceProjection);
      var tileSize = resource.imageWidth == resource.imageHeight ? resource.imageWidth : [resource.imageWidth, resource.imageHeight];
      var tileGrid = (0, _tilegrid.createXYZ)({
        extent: extent,
        minZoom: resource.zoomMin,
        maxZoom: maxZoom,
        tileSize: tileSize / (this.hidpi_ ? 2 : 1)
      });
      this.tileGrid = tileGrid;

      var culture = this.culture_;
      var hidpi = this.hidpi_;
      this.tileUrlFunction = (0, _tileurlfunction.createFromTileUrlFunctions)(resource.imageUrlSubdomains.map(function (subdomain) {
        var quadKeyTileCoord = [0, 0, 0];
        var imageUrl = resource.imageUrl.replace('{subdomain}', subdomain).replace('{culture}', culture);
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
              (0, _tilecoord.createOrUpdate)(tileCoord[0], tileCoord[1], -tileCoord[2] - 1, quadKeyTileCoord);
              var url = imageUrl;
              if (hidpi) {
                url += '&dpi=d1&device=mobile';
              }
              return url.replace('{quadkey}', (0, _tilecoord.quadKey)(quadKeyTileCoord));
            }
          }
        );
      }));

      if (resource.imageryProviders) {
        var transform = (0, _proj.getTransformFromProjections)((0, _proj.get)('EPSG:4326'), this.getProjection());

        this.setAttributions(function (frameState) {
          var attributions = [];
          var zoom = frameState.viewState.zoom;
          resource.imageryProviders.map(function (imageryProvider) {
            var intersecting = false;
            var coverageAreas = imageryProvider.coverageAreas;
            for (var i = 0, ii = coverageAreas.length; i < ii; ++i) {
              var coverageArea = coverageAreas[i];
              if (zoom >= coverageArea.zoomMin && zoom <= coverageArea.zoomMax) {
                var bbox = coverageArea.bbox;
                var epsg4326Extent = [bbox[1], bbox[0], bbox[3], bbox[2]];
                var _extent = (0, _extent2.applyTransform)(epsg4326Extent, transform);
                if ((0, _extent2.intersects)(_extent, frameState.extent)) {
                  intersecting = true;
                  break;
                }
              }
            }
            if (intersecting) {
              attributions.push(imageryProvider.attribution);
            }
          });

          attributions.push(TOS_ATTRIBUTION);
          return attributions;
        });
      }

      this.setState(_State2.default.READY);
    }
  }]);

  return BingMaps;
}(_TileImage3.default);

exports.default = BingMaps;