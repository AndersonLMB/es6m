'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileSourceEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = require('../functions.js');

var _TileCache = require('../TileCache.js');

var _TileCache2 = _interopRequireDefault(_TileCache);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _proj = require('../proj.js');

var _size = require('../size.js');

var _Source2 = require('../source/Source.js');

var _Source3 = _interopRequireDefault(_Source2);

var _tilecoord = require('../tilecoord.js');

var _tilegrid = require('../tilegrid.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Tile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions]
 * @property {number} [cacheSize]
 * @property {module:ol/extent~Extent} [extent]
 * @property {boolean} [opaque]
 * @property {number} [tilePixelRatio]
 * @property {module:ol/proj~ProjectionLike} [projection]
 * @property {module:ol/source/State} [state]
 * @property {module:ol/tilegrid/TileGrid} [tileGrid]
 * @property {boolean} [wrapX=true]
 * @property {number} [transition]
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for sources providing images divided into a tile grid.
 * @api
 */
var TileSource = function (_Source) {
  _inherits(TileSource, _Source);

  /**
   * @param {module:ol/source/Tile~Options=} options SourceTile source options.
   */
  function TileSource(options) {
    _classCallCheck(this, TileSource);

    /**
     * @private
     * @type {boolean}
     */
    var _this = _possibleConstructorReturn(this, (TileSource.__proto__ || Object.getPrototypeOf(TileSource)).call(this, {
      attributions: options.attributions,
      extent: options.extent,
      projection: options.projection,
      state: options.state,
      wrapX: options.wrapX
    }));

    _this.opaque_ = options.opaque !== undefined ? options.opaque : false;

    /**
     * @private
     * @type {number}
     */
    _this.tilePixelRatio_ = options.tilePixelRatio !== undefined ? options.tilePixelRatio : 1;

    /**
     * @protected
     * @type {module:ol/tilegrid/TileGrid}
     */
    _this.tileGrid = options.tileGrid !== undefined ? options.tileGrid : null;

    /**
     * @protected
     * @type {module:ol/TileCache}
     */
    _this.tileCache = new _TileCache2.default(options.cacheSize);

    /**
     * @protected
     * @type {module:ol/size~Size}
     */
    _this.tmpSize = [0, 0];

    /**
     * @private
     * @type {string}
     */
    _this.key_ = '';

    /**
     * @protected
     * @type {module:ol/Tile~Options}
     */
    _this.tileOptions = { transition: options.transition };

    return _this;
  }

  /**
   * @return {boolean} Can expire cache.
   */


  _createClass(TileSource, [{
    key: 'canExpireCache',
    value: function canExpireCache() {
      return this.tileCache.canExpireCache();
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {!Object<string, module:ol/TileRange>} usedTiles Used tiles.
     */

  }, {
    key: 'expireCache',
    value: function expireCache(projection, usedTiles) {
      var tileCache = this.getTileCacheForProjection(projection);
      if (tileCache) {
        tileCache.expireCache(usedTiles);
      }
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {number} z Zoom level.
     * @param {module:ol/TileRange} tileRange Tile range.
     * @param {function(module:ol/Tile):(boolean|undefined)} callback Called with each
     *     loaded tile.  If the callback returns `false`, the tile will not be
     *     considered loaded.
     * @return {boolean} The tile range is fully covered with loaded tiles.
     */

  }, {
    key: 'forEachLoadedTile',
    value: function forEachLoadedTile(projection, z, tileRange, callback) {
      var tileCache = this.getTileCacheForProjection(projection);
      if (!tileCache) {
        return false;
      }

      var covered = true;
      var tile = void 0,
          tileCoordKey = void 0,
          loaded = void 0;
      for (var x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (var y = tileRange.minY; y <= tileRange.maxY; ++y) {
          tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
          loaded = false;
          if (tileCache.containsKey(tileCoordKey)) {
            tile = /** @type {!module:ol/Tile} */tileCache.get(tileCoordKey);
            loaded = tile.getState() === _TileState2.default.LOADED;
            if (loaded) {
              loaded = callback(tile) !== false;
            }
          }
          if (!loaded) {
            covered = false;
          }
        }
      }
      return covered;
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {number} Gutter.
     */

  }, {
    key: 'getGutterForProjection',
    value: function getGutterForProjection(projection) {
      return 0;
    }

    /**
     * Return the key to be used for all tiles in the source.
     * @return {string} The key for all tiles.
     * @protected
     */

  }, {
    key: 'getKey',
    value: function getKey() {
      return this.key_;
    }

    /**
     * Set the value to be used as the key for all tiles in the source.
     * @param {string} key The key for tiles.
     * @protected
     */

  }, {
    key: 'setKey',
    value: function setKey(key) {
      if (this.key_ !== key) {
        this.key_ = key;
        this.changed();
      }
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {boolean} Opaque.
     */

  }, {
    key: 'getOpaque',
    value: function getOpaque(projection) {
      return this.opaque_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getResolutions',
    value: function getResolutions() {
      return this.tileGrid.getResolutions();
    }

    /**
     * @abstract
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {!module:ol/Tile} Tile.
     */

  }, {
    key: 'getTile',
    value: function getTile(z, x, y, pixelRatio, projection) {}

    /**
     * Return the tile grid of the tile source.
     * @return {module:ol/tilegrid/TileGrid} Tile grid.
     * @api
     */

  }, {
    key: 'getTileGrid',
    value: function getTileGrid() {
      return this.tileGrid;
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {!module:ol/tilegrid/TileGrid} Tile grid.
     */

  }, {
    key: 'getTileGridForProjection',
    value: function getTileGridForProjection(projection) {
      if (!this.tileGrid) {
        return (0, _tilegrid.getForProjection)(projection);
      } else {
        return this.tileGrid;
      }
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {module:ol/TileCache} Tile cache.
     * @protected
     */

  }, {
    key: 'getTileCacheForProjection',
    value: function getTileCacheForProjection(projection) {
      var thisProj = this.getProjection();
      if (thisProj && !(0, _proj.equivalent)(thisProj, projection)) {
        return null;
      } else {
        return this.tileCache;
      }
    }

    /**
     * Get the tile pixel ratio for this source. Subclasses may override this
     * method, which is meant to return a supported pixel ratio that matches the
     * provided `pixelRatio` as close as possible.
     * @param {number} pixelRatio Pixel ratio.
     * @return {number} Tile pixel ratio.
     */

  }, {
    key: 'getTilePixelRatio',
    value: function getTilePixelRatio(pixelRatio) {
      return this.tilePixelRatio_;
    }

    /**
     * @param {number} z Z.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {module:ol/size~Size} Tile size.
     */

  }, {
    key: 'getTilePixelSize',
    value: function getTilePixelSize(z, pixelRatio, projection) {
      var tileGrid = this.getTileGridForProjection(projection);
      var tilePixelRatio = this.getTilePixelRatio(pixelRatio);
      var tileSize = (0, _size.toSize)(tileGrid.getTileSize(z), this.tmpSize);
      if (tilePixelRatio == 1) {
        return tileSize;
      } else {
        return (0, _size.scale)(tileSize, tilePixelRatio, this.tmpSize);
      }
    }

    /**
     * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
     * is outside the resolution and extent range of the tile grid, `null` will be
     * returned.
     * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
     * @param {module:ol/proj/Projection=} opt_projection Projection.
     * @return {module:ol/tilecoord~TileCoord} Tile coordinate to be passed to the tileUrlFunction or
     *     null if no tile URL should be created for the passed `tileCoord`.
     */

  }, {
    key: 'getTileCoordForTileUrlFunction',
    value: function getTileCoordForTileUrlFunction(tileCoord, opt_projection) {
      var projection = opt_projection !== undefined ? opt_projection : this.getProjection();
      var tileGrid = this.getTileGridForProjection(projection);
      if (this.getWrapX() && projection.isGlobal()) {
        tileCoord = (0, _tilegrid.wrapX)(tileGrid, tileCoord, projection);
      }
      return (0, _tilecoord.withinExtentAndZ)(tileCoord, tileGrid) ? tileCoord : null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.tileCache.clear();
      this.changed();
    }
  }]);

  return TileSource;
}(_Source3.default);

/**
 * Marks a tile coord as being used, without triggering a load.
 * @param {number} z Tile coordinate z.
 * @param {number} x Tile coordinate x.
 * @param {number} y Tile coordinate y.
 * @param {module:ol/proj/Projection} projection Projection.
 */


TileSource.prototype.useTile = _functions.VOID;

/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Tile~TileSource} instances are instances of this
 * type.
 */

var TileSourceEvent = exports.TileSourceEvent = function (_Event) {
  _inherits(TileSourceEvent, _Event);

  /**
   * @param {string} type Type.
   * @param {module:ol/Tile} tile The tile.
   */
  function TileSourceEvent(type, tile) {
    _classCallCheck(this, TileSourceEvent);

    /**
     * The tile related to the event.
     * @type {module:ol/Tile}
     * @api
     */
    var _this2 = _possibleConstructorReturn(this, (TileSourceEvent.__proto__ || Object.getPrototypeOf(TileSourceEvent)).call(this, type));

    _this2.tile = tile;

    return _this2;
  }

  return TileSourceEvent;
}(_Event3.default);

exports.default = TileSource;