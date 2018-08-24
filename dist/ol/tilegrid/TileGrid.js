'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/tilegrid/TileGrid
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _common = require('./common.js');

var _asserts = require('../asserts.js');

var _TileRange = require('../TileRange.js');

var _TileRange2 = _interopRequireDefault(_TileRange);

var _array = require('../array.js');

var _extent = require('../extent.js');

var _math = require('../math.js');

var _size = require('../size.js');

var _tilecoord = require('../tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 * @type {module:ol/tilecoord~TileCoord}
 */
var tmpTileCoord = [0, 0, 0];

/**
 * @typedef {Object} Options
 * @property {module:ol/extent~Extent} [extent] Extent for the tile grid. No tiles outside this
 * extent will be requested by {@link module:ol/source/Tile} sources. When no `origin` or
 * `origins` are configured, the `origin` will be set to the top-left corner of the extent.
 * @property {number} [minZoom=0] Minimum zoom.
 * @property {module:ol/coordinate~Coordinate} [origin] The tile grid origin, i.e. where the `x`
 * and `y` axes meet (`[z, 0, 0]`). Tile coordinates increase left to right and upwards. If not
 * specified, `extent` or `origins` must be provided.
 * @property {Array<module:ol/coordinate~Coordinate>} [origins] Tile grid origins, i.e. where
 * the `x` and `y` axes meet (`[z, 0, 0]`), for each zoom level. If given, the array length
 * should match the length of the `resolutions` array, i.e. each resolution can have a different
 * origin. Tile coordinates increase left to right and upwards. If not specified, `extent` or
 * `origin` must be provided.
 * @property {!Array<number>} resolutions Resolutions. The array index of each resolution needs
 * to match the zoom level. This means that even if a `minZoom` is configured, the resolutions
 * array will have a length of `maxZoom + 1`.
 * @property {Array<module:ol/size~Size>} [sizes] Sizes.
 * @property {number|module:ol/size~Size} [tileSize] Tile size.
 * Default is `[256, 256]`.
 * @property {Array<module:ol/size~Size>} [tileSizes] Tile sizes. If given, the array length
 * should match the length of the `resolutions` array, i.e. each resolution can have a different
 * tile size.
 */

/**
 * @classdesc
 * Base class for setting the grid pattern for sources accessing tiled-image
 * servers.
 * @api
 */

var TileGrid = function () {
  /**
   * @param {module:ol/tilegrid/TileGrid~Options} options Tile grid options.
   */
  function TileGrid(options) {
    _classCallCheck(this, TileGrid);

    /**
     * @protected
     * @type {number}
     */
    this.minZoom = options.minZoom !== undefined ? options.minZoom : 0;

    /**
     * @private
     * @type {!Array<number>}
     */
    this.resolutions_ = options.resolutions;
    (0, _asserts.assert)((0, _array.isSorted)(this.resolutions_, function (a, b) {
      return b - a;
    }, true), 17); // `resolutions` must be sorted in descending order


    // check if we've got a consistent zoom factor and origin
    var zoomFactor = void 0;
    if (!options.origins) {
      for (var i = 0, ii = this.resolutions_.length - 1; i < ii; ++i) {
        if (!zoomFactor) {
          zoomFactor = this.resolutions_[i] / this.resolutions_[i + 1];
        } else {
          if (this.resolutions_[i] / this.resolutions_[i + 1] !== zoomFactor) {
            zoomFactor = undefined;
            break;
          }
        }
      }
    }

    /**
     * @private
     * @type {number|undefined}
     */
    this.zoomFactor_ = zoomFactor;

    /**
     * @protected
     * @type {number}
     */
    this.maxZoom = this.resolutions_.length - 1;

    /**
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    this.origin_ = options.origin !== undefined ? options.origin : null;

    /**
     * @private
     * @type {Array<module:ol/coordinate~Coordinate>}
     */
    this.origins_ = null;
    if (options.origins !== undefined) {
      this.origins_ = options.origins;
      (0, _asserts.assert)(this.origins_.length == this.resolutions_.length, 20); // Number of `origins` and `resolutions` must be equal
    }

    var extent = options.extent;

    if (extent !== undefined && !this.origin_ && !this.origins_) {
      this.origin_ = (0, _extent.getTopLeft)(extent);
    }

    (0, _asserts.assert)(!this.origin_ && this.origins_ || this.origin_ && !this.origins_, 18); // Either `origin` or `origins` must be configured, never both

    /**
     * @private
     * @type {Array<number|module:ol/size~Size>}
     */
    this.tileSizes_ = null;
    if (options.tileSizes !== undefined) {
      this.tileSizes_ = options.tileSizes;
      (0, _asserts.assert)(this.tileSizes_.length == this.resolutions_.length, 19); // Number of `tileSizes` and `resolutions` must be equal
    }

    /**
     * @private
     * @type {number|module:ol/size~Size}
     */
    this.tileSize_ = options.tileSize !== undefined ? options.tileSize : !this.tileSizes_ ? _common.DEFAULT_TILE_SIZE : null;
    (0, _asserts.assert)(!this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_, 22); // Either `tileSize` or `tileSizes` must be configured, never both

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    this.extent_ = extent !== undefined ? extent : null;

    /**
     * @private
     * @type {Array<module:ol/TileRange>}
     */
    this.fullTileRanges_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    this.tmpSize_ = [0, 0];

    if (options.sizes !== undefined) {
      this.fullTileRanges_ = options.sizes.map(function (size, z) {
        var tileRange = new _TileRange2.default(Math.min(0, size[0]), Math.max(size[0] - 1, -1), Math.min(0, size[1]), Math.max(size[1] - 1, -1));
        return tileRange;
      }, this);
    } else if (extent) {
      this.calculateTileRanges_(extent);
    }
  }

  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(module:ol/tilecoord~TileCoord)} callback Function called with each tile coordinate.
   * @api
   */


  _createClass(TileGrid, [{
    key: 'forEachTileCoord',
    value: function forEachTileCoord(extent, zoom, callback) {
      var tileRange = this.getTileRangeForExtentAndZ(extent, zoom);
      for (var i = tileRange.minX, ii = tileRange.maxX; i <= ii; ++i) {
        for (var j = tileRange.minY, jj = tileRange.maxY; j <= jj; ++j) {
          callback([zoom, i, j]);
        }
      }
    }

    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {function(this: T, number, module:ol/TileRange): boolean} callback Callback.
     * @param {T=} opt_this The object to use as `this` in `callback`.
     * @param {module:ol/TileRange=} opt_tileRange Temporary module:ol/TileRange object.
     * @param {module:ol/extent~Extent=} opt_extent Temporary module:ol/extent~Extent object.
     * @return {boolean} Callback succeeded.
     * @template T
     */

  }, {
    key: 'forEachTileCoordParentTileRange',
    value: function forEachTileCoordParentTileRange(tileCoord, callback, opt_this, opt_tileRange, opt_extent) {
      var tileRange = void 0,
          x = void 0,
          y = void 0;
      var tileCoordExtent = null;
      var z = tileCoord[0] - 1;
      if (this.zoomFactor_ === 2) {
        x = tileCoord[1];
        y = tileCoord[2];
      } else {
        tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
      }
      while (z >= this.minZoom) {
        if (this.zoomFactor_ === 2) {
          x = Math.floor(x / 2);
          y = Math.floor(y / 2);
          tileRange = (0, _TileRange.createOrUpdate)(x, x, y, y, opt_tileRange);
        } else {
          tileRange = this.getTileRangeForExtentAndZ(tileCoordExtent, z, opt_tileRange);
        }
        if (callback.call(opt_this, z, tileRange)) {
          return true;
        }
        --z;
      }
      return false;
    }

    /**
     * Get the extent for this tile grid, if it was configured.
     * @return {module:ol/extent~Extent} Extent.
     */

  }, {
    key: 'getExtent',
    value: function getExtent() {
      return this.extent_;
    }

    /**
     * Get the maximum zoom level for the grid.
     * @return {number} Max zoom.
     * @api
     */

  }, {
    key: 'getMaxZoom',
    value: function getMaxZoom() {
      return this.maxZoom;
    }

    /**
     * Get the minimum zoom level for the grid.
     * @return {number} Min zoom.
     * @api
     */

  }, {
    key: 'getMinZoom',
    value: function getMinZoom() {
      return this.minZoom;
    }

    /**
     * Get the origin for the grid at the given zoom level.
     * @param {number} z Integer zoom level.
     * @return {module:ol/coordinate~Coordinate} Origin.
     * @api
     */

  }, {
    key: 'getOrigin',
    value: function getOrigin(z) {
      if (this.origin_) {
        return this.origin_;
      } else {
        return this.origins_[z];
      }
    }

    /**
     * Get the resolution for the given zoom level.
     * @param {number} z Integer zoom level.
     * @return {number} Resolution.
     * @api
     */

  }, {
    key: 'getResolution',
    value: function getResolution(z) {
      return this.resolutions_[z];
    }

    /**
     * Get the list of resolutions for the tile grid.
     * @return {Array<number>} Resolutions.
     * @api
     */

  }, {
    key: 'getResolutions',
    value: function getResolutions() {
      return this.resolutions_;
    }

    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {module:ol/TileRange=} opt_tileRange Temporary module:ol/TileRange object.
     * @param {module:ol/extent~Extent=} opt_extent Temporary module:ol/extent~Extent object.
     * @return {module:ol/TileRange} Tile range.
     */

  }, {
    key: 'getTileCoordChildTileRange',
    value: function getTileCoordChildTileRange(tileCoord, opt_tileRange, opt_extent) {
      if (tileCoord[0] < this.maxZoom) {
        if (this.zoomFactor_ === 2) {
          var minX = tileCoord[1] * 2;
          var minY = tileCoord[2] * 2;
          return (0, _TileRange.createOrUpdate)(minX, minX + 1, minY, minY + 1, opt_tileRange);
        }
        var tileCoordExtent = this.getTileCoordExtent(tileCoord, opt_extent);
        return this.getTileRangeForExtentAndZ(tileCoordExtent, tileCoord[0] + 1, opt_tileRange);
      }
      return null;
    }

    /**
     * Get the extent for a tile range.
     * @param {number} z Integer zoom level.
     * @param {module:ol/TileRange} tileRange Tile range.
     * @param {module:ol/extent~Extent=} opt_extent Temporary module:ol/extent~Extent object.
     * @return {module:ol/extent~Extent} Extent.
     */

  }, {
    key: 'getTileRangeExtent',
    value: function getTileRangeExtent(z, tileRange, opt_extent) {
      var origin = this.getOrigin(z);
      var resolution = this.getResolution(z);
      var tileSize = (0, _size.toSize)(this.getTileSize(z), this.tmpSize_);
      var minX = origin[0] + tileRange.minX * tileSize[0] * resolution;
      var maxX = origin[0] + (tileRange.maxX + 1) * tileSize[0] * resolution;
      var minY = origin[1] + tileRange.minY * tileSize[1] * resolution;
      var maxY = origin[1] + (tileRange.maxY + 1) * tileSize[1] * resolution;
      return (0, _extent.createOrUpdate)(minX, minY, maxX, maxY, opt_extent);
    }

    /**
     * Get a tile range for the given extent and integer zoom level.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} z Integer zoom level.
     * @param {module:ol/TileRange=} opt_tileRange Temporary tile range object.
     * @return {module:ol/TileRange} Tile range.
     */

  }, {
    key: 'getTileRangeForExtentAndZ',
    value: function getTileRangeForExtentAndZ(extent, z, opt_tileRange) {
      var tileCoord = tmpTileCoord;
      this.getTileCoordForXYAndZ_(extent[0], extent[1], z, false, tileCoord);
      var minX = tileCoord[1];
      var minY = tileCoord[2];
      this.getTileCoordForXYAndZ_(extent[2], extent[3], z, true, tileCoord);
      return (0, _TileRange.createOrUpdate)(minX, tileCoord[1], minY, tileCoord[2], opt_tileRange);
    }

    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @return {module:ol/coordinate~Coordinate} Tile center.
     */

  }, {
    key: 'getTileCoordCenter',
    value: function getTileCoordCenter(tileCoord) {
      var origin = this.getOrigin(tileCoord[0]);
      var resolution = this.getResolution(tileCoord[0]);
      var tileSize = (0, _size.toSize)(this.getTileSize(tileCoord[0]), this.tmpSize_);
      return [origin[0] + (tileCoord[1] + 0.5) * tileSize[0] * resolution, origin[1] + (tileCoord[2] + 0.5) * tileSize[1] * resolution];
    }

    /**
     * Get the extent of a tile coordinate.
     *
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {module:ol/extent~Extent=} opt_extent Temporary extent object.
     * @return {module:ol/extent~Extent} Extent.
     * @api
     */

  }, {
    key: 'getTileCoordExtent',
    value: function getTileCoordExtent(tileCoord, opt_extent) {
      var origin = this.getOrigin(tileCoord[0]);
      var resolution = this.getResolution(tileCoord[0]);
      var tileSize = (0, _size.toSize)(this.getTileSize(tileCoord[0]), this.tmpSize_);
      var minX = origin[0] + tileCoord[1] * tileSize[0] * resolution;
      var minY = origin[1] + tileCoord[2] * tileSize[1] * resolution;
      var maxX = minX + tileSize[0] * resolution;
      var maxY = minY + tileSize[1] * resolution;
      return (0, _extent.createOrUpdate)(minX, minY, maxX, maxY, opt_extent);
    }

    /**
     * Get the tile coordinate for the given map coordinate and resolution.  This
     * method considers that coordinates that intersect tile boundaries should be
     * assigned the higher tile coordinate.
     *
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {module:ol/tilecoord~TileCoord=} opt_tileCoord Destination module:ol/tilecoord~TileCoord object.
     * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
     * @api
     */

  }, {
    key: 'getTileCoordForCoordAndResolution',
    value: function getTileCoordForCoordAndResolution(coordinate, resolution, opt_tileCoord) {
      return this.getTileCoordForXYAndResolution_(coordinate[0], coordinate[1], resolution, false, opt_tileCoord);
    }

    /**
     * Note that this method should not be called for resolutions that correspond
     * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {number} resolution Resolution (for a non-integer zoom level).
     * @param {boolean} reverseIntersectionPolicy Instead of letting edge
     *     intersections go to the higher tile coordinate, let edge intersections
     *     go to the lower tile coordinate.
     * @param {module:ol/tilecoord~TileCoord=} opt_tileCoord Temporary module:ol/tilecoord~TileCoord object.
     * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
     * @private
     */

  }, {
    key: 'getTileCoordForXYAndResolution_',
    value: function getTileCoordForXYAndResolution_(x, y, resolution, reverseIntersectionPolicy, opt_tileCoord) {
      var z = this.getZForResolution(resolution);
      var scale = resolution / this.getResolution(z);
      var origin = this.getOrigin(z);
      var tileSize = (0, _size.toSize)(this.getTileSize(z), this.tmpSize_);

      var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
      var adjustY = reverseIntersectionPolicy ? 0 : 0.5;
      var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
      var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
      var tileCoordX = scale * xFromOrigin / tileSize[0];
      var tileCoordY = scale * yFromOrigin / tileSize[1];

      if (reverseIntersectionPolicy) {
        tileCoordX = Math.ceil(tileCoordX) - 1;
        tileCoordY = Math.ceil(tileCoordY) - 1;
      } else {
        tileCoordX = Math.floor(tileCoordX);
        tileCoordY = Math.floor(tileCoordY);
      }

      return (0, _tilecoord.createOrUpdate)(z, tileCoordX, tileCoordY, opt_tileCoord);
    }

    /**
     * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
     * they should have separate implementations.  This method is for integer zoom
     * levels.  The other method should only be called for resolutions corresponding
     * to non-integer zoom levels.
     * @param {number} x Map x coordinate.
     * @param {number} y Map y coordinate.
     * @param {number} z Integer zoom level.
     * @param {boolean} reverseIntersectionPolicy Instead of letting edge
     *     intersections go to the higher tile coordinate, let edge intersections
     *     go to the lower tile coordinate.
     * @param {module:ol/tilecoord~TileCoord=} opt_tileCoord Temporary module:ol/tilecoord~TileCoord object.
     * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
     * @private
     */

  }, {
    key: 'getTileCoordForXYAndZ_',
    value: function getTileCoordForXYAndZ_(x, y, z, reverseIntersectionPolicy, opt_tileCoord) {
      var origin = this.getOrigin(z);
      var resolution = this.getResolution(z);
      var tileSize = (0, _size.toSize)(this.getTileSize(z), this.tmpSize_);

      var adjustX = reverseIntersectionPolicy ? 0.5 : 0;
      var adjustY = reverseIntersectionPolicy ? 0 : 0.5;
      var xFromOrigin = Math.floor((x - origin[0]) / resolution + adjustX);
      var yFromOrigin = Math.floor((y - origin[1]) / resolution + adjustY);
      var tileCoordX = xFromOrigin / tileSize[0];
      var tileCoordY = yFromOrigin / tileSize[1];

      if (reverseIntersectionPolicy) {
        tileCoordX = Math.ceil(tileCoordX) - 1;
        tileCoordY = Math.ceil(tileCoordY) - 1;
      } else {
        tileCoordX = Math.floor(tileCoordX);
        tileCoordY = Math.floor(tileCoordY);
      }

      return (0, _tilecoord.createOrUpdate)(z, tileCoordX, tileCoordY, opt_tileCoord);
    }

    /**
     * Get a tile coordinate given a map coordinate and zoom level.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {number} z Zoom level.
     * @param {module:ol/tilecoord~TileCoord=} opt_tileCoord Destination module:ol/tilecoord~TileCoord object.
     * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
     * @api
     */

  }, {
    key: 'getTileCoordForCoordAndZ',
    value: function getTileCoordForCoordAndZ(coordinate, z, opt_tileCoord) {
      return this.getTileCoordForXYAndZ_(coordinate[0], coordinate[1], z, false, opt_tileCoord);
    }

    /**
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @return {number} Tile resolution.
     */

  }, {
    key: 'getTileCoordResolution',
    value: function getTileCoordResolution(tileCoord) {
      return this.resolutions_[tileCoord[0]];
    }

    /**
     * Get the tile size for a zoom level. The type of the return value matches the
     * `tileSize` or `tileSizes` that the tile grid was configured with. To always
     * get an `module:ol/size~Size`, run the result through `module:ol/size~Size.toSize()`.
     * @param {number} z Z.
     * @return {number|module:ol/size~Size} Tile size.
     * @api
     */

  }, {
    key: 'getTileSize',
    value: function getTileSize(z) {
      if (this.tileSize_) {
        return this.tileSize_;
      } else {
        return this.tileSizes_[z];
      }
    }

    /**
     * @param {number} z Zoom level.
     * @return {module:ol/TileRange} Extent tile range for the specified zoom level.
     */

  }, {
    key: 'getFullTileRange',
    value: function getFullTileRange(z) {
      if (!this.fullTileRanges_) {
        return null;
      } else {
        return this.fullTileRanges_[z];
      }
    }

    /**
     * @param {number} resolution Resolution.
     * @param {number=} opt_direction If 0, the nearest resolution will be used.
     *     If 1, the nearest lower resolution will be used. If -1, the nearest
     *     higher resolution will be used. Default is 0.
     * @return {number} Z.
     * @api
     */

  }, {
    key: 'getZForResolution',
    value: function getZForResolution(resolution, opt_direction) {
      var z = (0, _array.linearFindNearest)(this.resolutions_, resolution, opt_direction || 0);
      return (0, _math.clamp)(z, this.minZoom, this.maxZoom);
    }

    /**
     * @param {!module:ol/extent~Extent} extent Extent for this tile grid.
     * @private
     */

  }, {
    key: 'calculateTileRanges_',
    value: function calculateTileRanges_(extent) {
      var length = this.resolutions_.length;
      var fullTileRanges = new Array(length);
      for (var z = this.minZoom; z < length; ++z) {
        fullTileRanges[z] = this.getTileRangeForExtentAndZ(extent, z);
      }
      this.fullTileRanges_ = fullTileRanges;
    }
  }]);

  return TileGrid;
}();

exports.default = TileGrid;