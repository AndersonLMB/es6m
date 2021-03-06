'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createFromCapabilitiesMatrixSet = createFromCapabilitiesMatrixSet;

var _array = require('../array.js');

var _proj = require('../proj.js');

var _TileGrid2 = require('../tilegrid/TileGrid.js');

var _TileGrid3 = _interopRequireDefault(_TileGrid2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/tilegrid/WMTS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/extent~Extent} [extent] Extent for the tile grid. No tiles
 * outside this extent will be requested by {@link module:ol/source/Tile} sources.
 * When no `origin` or `origins` are configured, the `origin` will be set to the
 * top-left corner of the extent.
 * @property {module:ol/coordinate~Coordinate} [origin] The tile grid origin, i.e.
 * where the `x` and `y` axes meet (`[z, 0, 0]`). Tile coordinates increase left
 * to right and upwards. If not specified, `extent` or `origins` must be provided.
 * @property {Array<module:ol/coordinate~Coordinate>} [origins] Tile grid origins,
 * i.e. where the `x` and `y` axes meet (`[z, 0, 0]`), for each zoom level. If
 * given, the array length should match the length of the `resolutions` array, i.e.
 * each resolution can have a different origin. Tile coordinates increase left to
 * right and upwards. If not specified, `extent` or `origin` must be provided.
 * @property {!Array<number>} resolutions Resolutions. The array index of each
 * resolution needs to match the zoom level. This means that even if a `minZoom`
 * is configured, the resolutions array will have a length of `maxZoom + 1`
 * @property {!Array<string>} matrixIds matrix IDs. The length of this array needs
 * to match the length of the `resolutions` array.
 * @property {Array<module:ol/size~Size>} [sizes] Number of tile rows and columns
 * of the grid for each zoom level. The values here are the `TileMatrixWidth` and
 * `TileMatrixHeight` advertised in the GetCapabilities response of the WMTS, and
 * define the grid's extent together with the `origin`.
 * An `extent` can be configured in addition, and will further limit the extent for
 * which tile requests are made by sources. Note that when the top-left corner of
 * the `extent` is used as `origin` or `origins`, then the `y` value must be
 * negative because OpenLayers tile coordinates increase upwards.
 * @property {number|module:ol/size~Size} [tileSize] Tile size.
 * @property {Array<module:ol/size~Size>} [tileSizes] Tile sizes. The length of
 * this array needs to match the length of the `resolutions` array.
 * @property {Array<number>} [widths] Number of tile columns that cover the grid's
 * extent for each zoom level. Only required when used with a source that has `wrapX`
 * set to `true`, and only when the grid's origin differs from the one of the
 * projection's extent. The array length has to match the length of the `resolutions`
 * array, i.e. each resolution will have a matching entry here.
 */

/**
 * @classdesc
 * Set the grid pattern for sources accessing WMTS tiled-image servers.
 * @api
 */
var WMTSTileGrid = function (_TileGrid) {
  _inherits(WMTSTileGrid, _TileGrid);

  /**
   * @param {module:ol/tilegrid/WMTS~Options} options WMTS options.
   */
  function WMTSTileGrid(options) {
    _classCallCheck(this, WMTSTileGrid);

    /**
     * @private
     * @type {!Array<string>}
     */
    var _this = _possibleConstructorReturn(this, (WMTSTileGrid.__proto__ || Object.getPrototypeOf(WMTSTileGrid)).call(this, {
      extent: options.extent,
      origin: options.origin,
      origins: options.origins,
      resolutions: options.resolutions,
      tileSize: options.tileSize,
      tileSizes: options.tileSizes,
      sizes: options.sizes
    }));

    _this.matrixIds_ = options.matrixIds;
    return _this;
  }

  /**
   * @param {number} z Z.
   * @return {string} MatrixId..
   */


  _createClass(WMTSTileGrid, [{
    key: 'getMatrixId',
    value: function getMatrixId(z) {
      return this.matrixIds_[z];
    }

    /**
     * Get the list of matrix identifiers.
     * @return {Array<string>} MatrixIds.
     * @api
     */

  }, {
    key: 'getMatrixIds',
    value: function getMatrixIds() {
      return this.matrixIds_;
    }
  }]);

  return WMTSTileGrid;
}(_TileGrid3.default);

exports.default = WMTSTileGrid;

/**
 * Create a tile grid from a WMTS capabilities matrix set and an
 * optional TileMatrixSetLimits.
 * @param {Object} matrixSet An object representing a matrixSet in the
 *     capabilities document.
 * @param {module:ol/extent~Extent=} opt_extent An optional extent to restrict the tile
 *     ranges the server provides.
 * @param {Array<Object>=} opt_matrixLimits An optional object representing
 *     the available matrices for tileGrid.
 * @return {module:ol/tilegrid/WMTS} WMTS tileGrid instance.
 * @api
 */

function createFromCapabilitiesMatrixSet(matrixSet, opt_extent, opt_matrixLimits) {

  /** @type {!Array<number>} */
  var resolutions = [];
  /** @type {!Array<string>} */
  var matrixIds = [];
  /** @type {!Array<module:ol/coordinate~Coordinate>} */
  var origins = [];
  /** @type {!Array<module:ol/size~Size>} */
  var tileSizes = [];
  /** @type {!Array<module:ol/size~Size>} */
  var sizes = [];

  var matrixLimits = opt_matrixLimits !== undefined ? opt_matrixLimits : [];

  var supportedCRSPropName = 'SupportedCRS';
  var matrixIdsPropName = 'TileMatrix';
  var identifierPropName = 'Identifier';
  var scaleDenominatorPropName = 'ScaleDenominator';
  var topLeftCornerPropName = 'TopLeftCorner';
  var tileWidthPropName = 'TileWidth';
  var tileHeightPropName = 'TileHeight';

  var code = matrixSet[supportedCRSPropName];
  var projection = (0, _proj.get)(code.replace(/urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, '$1:$3')) || (0, _proj.get)(code);
  var metersPerUnit = projection.getMetersPerUnit();
  // swap origin x and y coordinates if axis orientation is lat/long
  var switchOriginXY = projection.getAxisOrientation().substr(0, 2) == 'ne';

  matrixSet[matrixIdsPropName].sort(function (a, b) {
    return b[scaleDenominatorPropName] - a[scaleDenominatorPropName];
  });

  matrixSet[matrixIdsPropName].forEach(function (elt) {

    var matrixAvailable = void 0;
    // use of matrixLimits to filter TileMatrices from GetCapabilities
    // TileMatrixSet from unavailable matrix levels.
    if (matrixLimits.length > 0) {
      matrixAvailable = (0, _array.find)(matrixLimits, function (elt_ml) {
        if (elt[identifierPropName] == elt_ml[matrixIdsPropName]) {
          return true;
        }
        // Fallback for tileMatrix identifiers that don't get prefixed
        // by their tileMatrixSet identifiers.
        if (elt[identifierPropName].indexOf(':') === -1) {
          return matrixSet[identifierPropName] + ':' + elt[identifierPropName] === elt_ml[matrixIdsPropName];
        }
        return false;
      });
    } else {
      matrixAvailable = true;
    }

    if (matrixAvailable) {
      matrixIds.push(elt[identifierPropName]);
      var resolution = elt[scaleDenominatorPropName] * 0.28E-3 / metersPerUnit;
      var tileWidth = elt[tileWidthPropName];
      var tileHeight = elt[tileHeightPropName];
      if (switchOriginXY) {
        origins.push([elt[topLeftCornerPropName][1], elt[topLeftCornerPropName][0]]);
      } else {
        origins.push(elt[topLeftCornerPropName]);
      }
      resolutions.push(resolution);
      tileSizes.push(tileWidth == tileHeight ? tileWidth : [tileWidth, tileHeight]);
      // top-left origin, so height is negative
      sizes.push([elt['MatrixWidth'], -elt['MatrixHeight']]);
    }
  });

  return new WMTSTileGrid({
    extent: opt_extent,
    origins: origins,
    resolutions: resolutions,
    matrixIds: matrixIds,
    tileSizes: tileSizes,
    sizes: sizes
  });
}