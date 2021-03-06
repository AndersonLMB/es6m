'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomTile = undefined;

var _common = require('../tilegrid/common.js');

var _ImageTile2 = require('../ImageTile.js');

var _ImageTile3 = _interopRequireDefault(_ImageTile2);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _tileurlfunction = require('../tileurlfunction.js');

var _asserts = require('../asserts.js');

var _dom = require('../dom.js');

var _extent = require('../extent.js');

var _size = require('../size.js');

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _TileGrid = require('../tilegrid/TileGrid.js');

var _TileGrid2 = _interopRequireDefault(_TileGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Zoomify
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 */
var TierSizeCalculation = {
  DEFAULT: 'default',
  TRUNCATED: 'truncated'
};

var CustomTile = exports.CustomTile = function (_ImageTile) {
  _inherits(CustomTile, _ImageTile);

  /**
   * @param {module:ol/tilegrid/TileGrid} tileGrid TileGrid that the tile belongs to.
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {module:ol/Tile~LoadFunction} tileLoadFunction Tile load function.
   * @param {module:ol/Tile~Options=} opt_options Tile options.
   */
  function CustomTile(tileGrid, tileCoord, state, src, crossOrigin, tileLoadFunction, opt_options) {
    _classCallCheck(this, CustomTile);

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    var _this = _possibleConstructorReturn(this, (CustomTile.__proto__ || Object.getPrototypeOf(CustomTile)).call(this, tileCoord, state, src, crossOrigin, tileLoadFunction, opt_options));

    _this.zoomifyImage_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.tileSize_ = (0, _size.toSize)(tileGrid.getTileSize(tileCoord[0]));

    return _this;
  }

  return CustomTile;
}(_ImageTile3.default);

/**
 * @inheritDoc
 */


CustomTile.prototype.getImage = function () {
  if (this.zoomifyImage_) {
    return this.zoomifyImage_;
  }
  var image = _ImageTile3.default.prototype.getImage.call(this);
  if (this.state == _TileState2.default.LOADED) {
    var tileSize = this.tileSize_;
    if (image.width == tileSize[0] && image.height == tileSize[1]) {
      this.zoomifyImage_ = image;
      return image;
    } else {
      var context = (0, _dom.createCanvasContext2D)(tileSize[0], tileSize[1]);
      context.drawImage(image, 0, 0);
      this.zoomifyImage_ = context.canvas;
      return context.canvas;
    }
  } else {
    return image;
  }
};

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {module:ol/proj~ProjectionLike} [projection] Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {string} [url] URL template or base URL of the Zoomify service.
 * A base URL is the fixed part
 * of the URL, excluding the tile group, z, x, and y folder structure, e.g.
 * `http://my.zoomify.info/IMAGE.TIF/`. A URL template must include
 * `{TileGroup}`, `{x}`, `{y}`, and `{z}` placeholders, e.g.
 * `http://my.zoomify.info/IMAGE.TIF/{TileGroup}/{z}-{x}-{y}.jpg`.
 * Internet Imaging Protocol (IIP) with JTL extension can be also used with
 * `{tileIndex}` and `{z}` placeholders, e.g.
 * `http://my.zoomify.info?FIF=IMAGE.TIF&JTL={z},{tileIndex}`.
 * A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
 * used instead of defining each one separately in the `urls` option.
 * @property {string} [tierSizeCalculation] Tier size calculation method: `default` or `truncated`.
 * @property {module:ol/size~Size} [size] Size of the image.
 * @property {module:ol/extent~Extent} [extent] Extent for the TileGrid that is created.
 * Default sets the TileGrid in the
 * fourth quadrant, meaning extent is `[0, -height, width, 0]`. To change the
 * extent to the first quadrant (the default for OpenLayers 2) set the extent
 * as `[0, 0, width, height]`.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {number} [tileSize=256] Tile size. Same tile size is used for all zoom levels.
 */

/**
 * @classdesc
 * Layer source for tile data in Zoomify format (both Zoomify and Internet
 * Imaging Protocol are supported).
 * @api
 */

var Zoomify = function (_TileImage) {
  _inherits(Zoomify, _TileImage);

  /**
   * @param {module:ol/source/Zoomify~Options=} opt_options Options.
   */
  function Zoomify(opt_options) {
    _classCallCheck(this, Zoomify);

    var options = opt_options || {};

    var size = options.size;
    var tierSizeCalculation = options.tierSizeCalculation !== undefined ? options.tierSizeCalculation : TierSizeCalculation.DEFAULT;

    var imageWidth = size[0];
    var imageHeight = size[1];
    var extent = options.extent || [0, -size[1], size[0], 0];
    var tierSizeInTiles = [];
    var tileSize = options.tileSize || _common.DEFAULT_TILE_SIZE;
    var tileSizeForTierSizeCalculation = tileSize;

    switch (tierSizeCalculation) {
      case TierSizeCalculation.DEFAULT:
        while (imageWidth > tileSizeForTierSizeCalculation || imageHeight > tileSizeForTierSizeCalculation) {
          tierSizeInTiles.push([Math.ceil(imageWidth / tileSizeForTierSizeCalculation), Math.ceil(imageHeight / tileSizeForTierSizeCalculation)]);
          tileSizeForTierSizeCalculation += tileSizeForTierSizeCalculation;
        }
        break;
      case TierSizeCalculation.TRUNCATED:
        var width = imageWidth;
        var height = imageHeight;
        while (width > tileSizeForTierSizeCalculation || height > tileSizeForTierSizeCalculation) {
          tierSizeInTiles.push([Math.ceil(width / tileSizeForTierSizeCalculation), Math.ceil(height / tileSizeForTierSizeCalculation)]);
          width >>= 1;
          height >>= 1;
        }
        break;
      default:
        (0, _asserts.assert)(false, 53); // Unknown `tierSizeCalculation` configured
        break;
    }

    tierSizeInTiles.push([1, 1]);
    tierSizeInTiles.reverse();

    var resolutions = [1];
    var tileCountUpToTier = [0];
    for (var i = 1, ii = tierSizeInTiles.length; i < ii; i++) {
      resolutions.push(1 << i);
      tileCountUpToTier.push(tierSizeInTiles[i - 1][0] * tierSizeInTiles[i - 1][1] + tileCountUpToTier[i - 1]);
    }
    resolutions.reverse();

    var tileGrid = new _TileGrid2.default({
      tileSize: tileSize,
      extent: extent,
      origin: (0, _extent.getTopLeft)(extent),
      resolutions: resolutions
    });

    var url = options.url;
    if (url && url.indexOf('{TileGroup}') == -1 && url.indexOf('{tileIndex}') == -1) {
      url += '{TileGroup}/{z}-{x}-{y}.jpg';
    }
    var urls = (0, _tileurlfunction.expandUrl)(url);

    /**
     * @param {string} template Template.
     * @return {module:ol/Tile~UrlFunction} Tile URL function.
     */
    function createFromTemplate(template) {

      return (
        /**
         * @param {module:ol/tilecoord~TileCoord} tileCoord Tile Coordinate.
         * @param {number} pixelRatio Pixel ratio.
         * @param {module:ol/proj/Projection} projection Projection.
         * @return {string|undefined} Tile URL.
         */
        function (tileCoord, pixelRatio, projection) {
          if (!tileCoord) {
            return undefined;
          } else {
            var tileCoordZ = tileCoord[0];
            var tileCoordX = tileCoord[1];
            var tileCoordY = -tileCoord[2] - 1;
            var tileIndex = tileCoordX + tileCoordY * tierSizeInTiles[tileCoordZ][0];
            var _tileSize = tileGrid.getTileSize(tileCoordZ);
            var tileGroup = (tileIndex + tileCountUpToTier[tileCoordZ]) / _tileSize | 0;
            var localContext = {
              'z': tileCoordZ,
              'x': tileCoordX,
              'y': tileCoordY,
              'tileIndex': tileIndex,
              'TileGroup': 'TileGroup' + tileGroup
            };
            return template.replace(/\{(\w+?)\}/g, function (m, p) {
              return localContext[p];
            });
          }
        }
      );
    }

    var tileUrlFunction = (0, _tileurlfunction.createFromTileUrlFunctions)(urls.map(createFromTemplate));

    var ZoomifyTileClass = CustomTile.bind(null, tileGrid);

    return _possibleConstructorReturn(this, (Zoomify.__proto__ || Object.getPrototypeOf(Zoomify)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: ZoomifyTileClass,
      tileGrid: tileGrid,
      tileUrlFunction: tileUrlFunction,
      transition: options.transition
    }));
  }

  return Zoomify;
}(_TileImage3.default);

exports.default = Zoomify;