'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../reproj/common.js');

var _util = require('../util.js');

var _ImageTile = require('../ImageTile.js');

var _ImageTile2 = _interopRequireDefault(_ImageTile);

var _TileCache = require('../TileCache.js');

var _TileCache2 = _interopRequireDefault(_TileCache);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _proj = require('../proj.js');

var _Tile = require('../reproj/Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _UrlTile2 = require('../source/UrlTile.js');

var _UrlTile3 = _interopRequireDefault(_UrlTile2);

var _tilecoord = require('../tilecoord.js');

var _tilegrid = require('../tilegrid.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/TileImage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [opaque=true] Whether the layer is opaque.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {module:ol/source/State} [state] Source state.
 * @property {module:ol/ImageTile~TileClass} [tileClass] Class used to instantiate image tiles.
 * Default is {@link module:ol/ImageTile~ImageTile}.
 * @property {module:ol/tilegrid/TileGrid} [tileGrid] Tile grid.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {number} [tilePixelRatio=1] The pixel ratio used by the tile service. For example, if the tile
 * service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`.
 * @property {module:ol/Tile~UrlFunction} [tileUrlFunction] Optional function to get tile URL given a tile coordinate and the projection.
 * @property {string} [url] URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
 * used instead of defining each one separately in the `urls` option.
 * @property {Array<string>} [urls] An array of URL templates.
 * @property {boolean} [wrapX] Whether to wrap the world horizontally. The default, is to
 * request out-of-bounds tiles from the server. When set to `false`, only one
 * world will be rendered. When set to `true`, tiles will be requested for one
 * world only, but they will be wrapped horizontally to render multiple worlds.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */

/**
 * @classdesc
 * Base class for sources providing images divided into a tile grid.
 *
 * @fires module:ol/source/Tile~TileSourceEvent
 * @api
 */
var TileImage = function (_UrlTile) {
  _inherits(TileImage, _UrlTile);

  /**
   * @param {module:ol/source/TileImage~Options=} options Image tile options.
   */
  function TileImage(options) {
    _classCallCheck(this, TileImage);

    /**
     * @protected
     * @type {?string}
     */
    var _this = _possibleConstructorReturn(this, (TileImage.__proto__ || Object.getPrototypeOf(TileImage)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      extent: options.extent,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : defaultTileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: options.tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX,
      transition: options.transition
    }));

    _this.crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @protected
     * @type {function(new: module:ol/ImageTile, module:ol/tilecoord~TileCoord, module:ol/TileState, string,
     *        ?string, module:ol/Tile~LoadFunction, module:ol/Tile~Options=)}
     */
    _this.tileClass = options.tileClass !== undefined ? options.tileClass : _ImageTile2.default;

    /**
     * @protected
     * @type {!Object<string, module:ol/TileCache>}
     */
    _this.tileCacheForProjection = {};

    /**
     * @protected
     * @type {!Object<string, module:ol/tilegrid/TileGrid>}
     */
    _this.tileGridForProjection = {};

    /**
     * @private
     * @type {number|undefined}
     */
    _this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;

    /**
     * @private
     * @type {boolean}
     */
    _this.renderReprojectionEdges_ = false;
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(TileImage, [{
    key: 'canExpireCache',
    value: function canExpireCache() {
      if (!_common.ENABLE_RASTER_REPROJECTION) {
        return _UrlTile3.default.prototype.canExpireCache.call(this);
      }
      if (this.tileCache.canExpireCache()) {
        return true;
      } else {
        for (var key in this.tileCacheForProjection) {
          if (this.tileCacheForProjection[key].canExpireCache()) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'expireCache',
    value: function expireCache(projection, usedTiles) {
      if (!_common.ENABLE_RASTER_REPROJECTION) {
        _UrlTile3.default.prototype.expireCache.call(this, projection, usedTiles);
        return;
      }
      var usedTileCache = this.getTileCacheForProjection(projection);

      this.tileCache.expireCache(this.tileCache == usedTileCache ? usedTiles : {});
      for (var id in this.tileCacheForProjection) {
        var tileCache = this.tileCacheForProjection[id];
        tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getGutterForProjection',
    value: function getGutterForProjection(projection) {
      if (_common.ENABLE_RASTER_REPROJECTION && this.getProjection() && projection && !(0, _proj.equivalent)(this.getProjection(), projection)) {
        return 0;
      } else {
        return this.getGutter();
      }
    }

    /**
     * @return {number} Gutter.
     */

  }, {
    key: 'getGutter',
    value: function getGutter() {
      return 0;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getOpaque',
    value: function getOpaque(projection) {
      if (_common.ENABLE_RASTER_REPROJECTION && this.getProjection() && projection && !(0, _proj.equivalent)(this.getProjection(), projection)) {
        return false;
      } else {
        return _UrlTile3.default.prototype.getOpaque.call(this, projection);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTileGridForProjection',
    value: function getTileGridForProjection(projection) {
      if (!_common.ENABLE_RASTER_REPROJECTION) {
        return _UrlTile3.default.prototype.getTileGridForProjection.call(this, projection);
      }
      var thisProj = this.getProjection();
      if (this.tileGrid && (!thisProj || (0, _proj.equivalent)(thisProj, projection))) {
        return this.tileGrid;
      } else {
        var projKey = (0, _util.getUid)(projection).toString();
        if (!(projKey in this.tileGridForProjection)) {
          this.tileGridForProjection[projKey] = (0, _tilegrid.getForProjection)(projection);
        }
        return (
          /** @type {!module:ol/tilegrid/TileGrid} */this.tileGridForProjection[projKey]
        );
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTileCacheForProjection',
    value: function getTileCacheForProjection(projection) {
      if (!_common.ENABLE_RASTER_REPROJECTION) {
        return _UrlTile3.default.prototype.getTileCacheForProjection.call(this, projection);
      }
      var thisProj = this.getProjection();if (!thisProj || (0, _proj.equivalent)(thisProj, projection)) {
        return this.tileCache;
      } else {
        var projKey = (0, _util.getUid)(projection).toString();
        if (!(projKey in this.tileCacheForProjection)) {
          this.tileCacheForProjection[projKey] = new _TileCache2.default(this.tileCache.highWaterMark);
        }
        return this.tileCacheForProjection[projKey];
      }
    }

    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {string} key The key set on the tile.
     * @return {!module:ol/Tile} Tile.
     * @private
     */

  }, {
    key: 'createTile_',
    value: function createTile_(z, x, y, pixelRatio, projection, key) {
      var tileCoord = [z, x, y];
      var urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
      var tileUrl = urlTileCoord ? this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : undefined;
      var tile = new this.tileClass(tileCoord, tileUrl !== undefined ? _TileState2.default.IDLE : _TileState2.default.EMPTY, tileUrl !== undefined ? tileUrl : '', this.crossOrigin, this.tileLoadFunction, this.tileOptions);
      tile.key = key;
      (0, _events.listen)(tile, _EventType2.default.CHANGE, this.handleTileChange, this);
      return tile;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTile',
    value: function getTile(z, x, y, pixelRatio, projection) {
      var sourceProjection = /** @type {!module:ol/proj/Projection} */this.getProjection();
      if (!_common.ENABLE_RASTER_REPROJECTION || !sourceProjection || !projection || (0, _proj.equivalent)(sourceProjection, projection)) {
        return this.getTileInternal(z, x, y, pixelRatio, sourceProjection || projection);
      } else {
        var cache = this.getTileCacheForProjection(projection);
        var tileCoord = [z, x, y];
        var tile = void 0;
        var tileCoordKey = (0, _tilecoord.getKey)(tileCoord);
        if (cache.containsKey(tileCoordKey)) {
          tile = /** @type {!module:ol/Tile} */cache.get(tileCoordKey);
        }
        var key = this.getKey();
        if (tile && tile.key == key) {
          return tile;
        } else {
          var sourceTileGrid = this.getTileGridForProjection(sourceProjection);
          var targetTileGrid = this.getTileGridForProjection(projection);
          var wrappedTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
          var newTile = new _Tile2.default(sourceProjection, sourceTileGrid, projection, targetTileGrid, tileCoord, wrappedTileCoord, this.getTilePixelRatio(pixelRatio), this.getGutter(), function (z, x, y, pixelRatio) {
            return this.getTileInternal(z, x, y, pixelRatio, sourceProjection);
          }.bind(this), this.reprojectionErrorThreshold_, this.renderReprojectionEdges_);
          newTile.key = key;

          if (tile) {
            newTile.interimTile = tile;
            newTile.refreshInterimChain();
            cache.replace(tileCoordKey, newTile);
          } else {
            cache.set(tileCoordKey, newTile);
          }
          return newTile;
        }
      }
    }

    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {!module:ol/proj/Projection} projection Projection.
     * @return {!module:ol/Tile} Tile.
     * @protected
     */

  }, {
    key: 'getTileInternal',
    value: function getTileInternal(z, x, y, pixelRatio, projection) {
      var tile = null;
      var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
      var key = this.getKey();
      if (!this.tileCache.containsKey(tileCoordKey)) {
        tile = this.createTile_(z, x, y, pixelRatio, projection, key);
        this.tileCache.set(tileCoordKey, tile);
      } else {
        tile = this.tileCache.get(tileCoordKey);
        if (tile.key != key) {
          // The source's params changed. If the tile has an interim tile and if we
          // can use it then we use it. Otherwise we create a new tile.  In both
          // cases we attempt to assign an interim tile to the new tile.
          var interimTile = tile;
          tile = this.createTile_(z, x, y, pixelRatio, projection, key);

          //make the new tile the head of the list,
          if (interimTile.getState() == _TileState2.default.IDLE) {
            //the old tile hasn't begun loading yet, and is now outdated, so we can simply discard it
            tile.interimTile = interimTile.interimTile;
          } else {
            tile.interimTile = interimTile;
          }
          tile.refreshInterimChain();
          this.tileCache.replace(tileCoordKey, tile);
        }
      }
      return tile;
    }

    /**
     * Sets whether to render reprojection edges or not (usually for debugging).
     * @param {boolean} render Render the edges.
     * @api
     */

  }, {
    key: 'setRenderReprojectionEdges',
    value: function setRenderReprojectionEdges(render) {
      if (!_common.ENABLE_RASTER_REPROJECTION || this.renderReprojectionEdges_ == render) {
        return;
      }
      this.renderReprojectionEdges_ = render;
      for (var id in this.tileCacheForProjection) {
        this.tileCacheForProjection[id].clear();
      }
      this.changed();
    }

    /**
     * Sets the tile grid to use when reprojecting the tiles to the given
     * projection instead of the default tile grid for the projection.
     *
     * This can be useful when the default tile grid cannot be created
     * (e.g. projection has no extent defined) or
     * for optimization reasons (custom tile size, resolutions, ...).
     *
     * @param {module:ol/proj~ProjectionLike} projection Projection.
     * @param {module:ol/tilegrid/TileGrid} tilegrid Tile grid to use for the projection.
     * @api
     */

  }, {
    key: 'setTileGridForProjection',
    value: function setTileGridForProjection(projection, tilegrid) {
      if (_common.ENABLE_RASTER_REPROJECTION) {
        var proj = (0, _proj.get)(projection);
        if (proj) {
          var projKey = (0, _util.getUid)(proj).toString();
          if (!(projKey in this.tileGridForProjection)) {
            this.tileGridForProjection[projKey] = tilegrid;
          }
        }
      }
    }
  }]);

  return TileImage;
}(_UrlTile3.default);

/**
 * @param {module:ol/ImageTile} imageTile Image tile.
 * @param {string} src Source.
 */


function defaultTileLoadFunction(imageTile, src) {
  imageTile.getImage().src = src;
}

exports.default = TileImage;