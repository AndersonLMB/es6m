'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getForProjection = getForProjection;
exports.wrapX = wrapX;
exports.createForExtent = createForExtent;
exports.createXYZ = createXYZ;
exports.createForProjection = createForProjection;
exports.extentFromProjection = extentFromProjection;

var _common = require('./tilegrid/common.js');

var _size = require('./size.js');

var _extent = require('./extent.js');

var _Corner = require('./extent/Corner.js');

var _Corner2 = _interopRequireDefault(_Corner);

var _obj = require('./obj.js');

var _proj = require('./proj.js');

var _Units = require('./proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

var _TileGrid = require('./tilegrid/TileGrid.js');

var _TileGrid2 = _interopRequireDefault(_TileGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {module:ol/proj/Projection} projection Projection.
 * @return {!module:ol/tilegrid/TileGrid} Default tile grid for the
 * passed projection.
 */
/**
 * @module ol/tilegrid
 */
function getForProjection(projection) {
  var tileGrid = projection.getDefaultTileGrid();
  if (!tileGrid) {
    tileGrid = createForProjection(projection);
    projection.setDefaultTileGrid(tileGrid);
  }
  return tileGrid;
}

/**
 * @param {module:ol/tilegrid/TileGrid} tileGrid Tile grid.
 * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
 * @param {module:ol/proj/Projection} projection Projection.
 * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
 */
function wrapX(tileGrid, tileCoord, projection) {
  var z = tileCoord[0];
  var center = tileGrid.getTileCoordCenter(tileCoord);
  var projectionExtent = extentFromProjection(projection);
  if (!(0, _extent.containsCoordinate)(projectionExtent, center)) {
    var worldWidth = (0, _extent.getWidth)(projectionExtent);
    var worldsAway = Math.ceil((projectionExtent[0] - center[0]) / worldWidth);
    center[0] += worldWidth * worldsAway;
    return tileGrid.getTileCoordForCoordAndZ(center, z);
  } else {
    return tileCoord;
  }
}

/**
 * @param {module:ol/extent~Extent} extent Extent.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|module:ol/size~Size=} opt_tileSize Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @param {module:ol/extent/Corner=} opt_corner Extent corner (default is `'top-left'`).
 * @return {!module:ol/tilegrid/TileGrid} TileGrid instance.
 */
function createForExtent(extent, opt_maxZoom, opt_tileSize, opt_corner) {
  var corner = opt_corner !== undefined ? opt_corner : _Corner2.default.TOP_LEFT;

  var resolutions = resolutionsFromExtent(extent, opt_maxZoom, opt_tileSize);

  return new _TileGrid2.default({
    extent: extent,
    origin: (0, _extent.getCorner)(extent, corner),
    resolutions: resolutions,
    tileSize: opt_tileSize
  });
}

/**
 * @typedef {Object} XYZOptions
 * @property {module:ol/extent~Extent} [extent] Extent for the tile grid. The origin for an XYZ tile grid is the
 * top-left corner of the extent. The zero level of the grid is defined by the resolution at which one tile fits in the
 * provided extent. If not provided, the extent of the EPSG:3857 projection is used.
 * @property {number} [maxZoom] Maximum zoom. The default is `42`. This determines the number of levels
 * in the grid set. For example, a `maxZoom` of 21 means there are 22 levels in the grid set.
 * @property {number} [minZoom=0] Minimum zoom.
 * @property {number|module:ol/size~Size} [tileSize=[256, 256]] Tile size in pixels.
 */

/**
 * Creates a tile grid with a standard XYZ tiling scheme.
 * @param {module:ol/tilegrid~XYZOptions=} opt_options Tile grid options.
 * @return {!module:ol/tilegrid/TileGrid} Tile grid instance.
 * @api
 */
function createXYZ(opt_options) {
  var options = /** @type {module:ol/tilegrid/TileGrid~Options} */{};
  (0, _obj.assign)(options, opt_options !== undefined ? opt_options : /** @type {module:ol/tilegrid~XYZOptions} */{});
  if (options.extent === undefined) {
    options.extent = (0, _proj.get)('EPSG:3857').getExtent();
  }
  options.resolutions = resolutionsFromExtent(options.extent, options.maxZoom, options.tileSize);
  delete options.maxZoom;

  return new _TileGrid2.default(options);
}

/**
 * Create a resolutions array from an extent.  A zoom factor of 2 is assumed.
 * @param {module:ol/extent~Extent} extent Extent.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|module:ol/size~Size=} opt_tileSize Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @return {!Array<number>} Resolutions array.
 */
function resolutionsFromExtent(extent, opt_maxZoom, opt_tileSize) {
  var maxZoom = opt_maxZoom !== undefined ? opt_maxZoom : _common.DEFAULT_MAX_ZOOM;

  var height = (0, _extent.getHeight)(extent);
  var width = (0, _extent.getWidth)(extent);

  var tileSize = (0, _size.toSize)(opt_tileSize !== undefined ? opt_tileSize : _common.DEFAULT_TILE_SIZE);
  var maxResolution = Math.max(width / tileSize[0], height / tileSize[1]);

  var length = maxZoom + 1;
  var resolutions = new Array(length);
  for (var z = 0; z < length; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }
  return resolutions;
}

/**
 * @param {module:ol/proj~ProjectionLike} projection Projection.
 * @param {number=} opt_maxZoom Maximum zoom level (default is
 *     DEFAULT_MAX_ZOOM).
 * @param {number|module:ol/size~Size=} opt_tileSize Tile size (default uses
 *     DEFAULT_TILE_SIZE).
 * @param {module:ol/extent/Corner=} opt_corner Extent corner (default is `'top-left'`).
 * @return {!module:ol/tilegrid/TileGrid} TileGrid instance.
 */
function createForProjection(projection, opt_maxZoom, opt_tileSize, opt_corner) {
  var extent = extentFromProjection(projection);
  return createForExtent(extent, opt_maxZoom, opt_tileSize, opt_corner);
}

/**
 * Generate a tile grid extent from a projection.  If the projection has an
 * extent, it is used.  If not, a global extent is assumed.
 * @param {module:ol/proj~ProjectionLike} projection Projection.
 * @return {module:ol/extent~Extent} Extent.
 */
function extentFromProjection(projection) {
  projection = (0, _proj.get)(projection);
  var extent = projection.getExtent();
  if (!extent) {
    var half = 180 * _proj.METERS_PER_UNIT[_Units2.default.DEGREES] / projection.getMetersPerUnit();
    extent = (0, _extent.createOrUpdate)(-half, -half, half, half);
  }
  return extent;
}