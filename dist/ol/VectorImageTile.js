'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.defaultLoadFunction = defaultLoadFunction;

var _util = require('./util.js');

var _Tile2 = require('./Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('./dom.js');

var _events = require('./events.js');

var _extent = require('./extent.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _featureloader = require('./featureloader.js');

var _functions = require('./functions.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/VectorImageTile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} ReplayState
 * @property {boolean} dirty
 * @property {null|module:ol/render~OrderFunction} renderedRenderOrder
 * @property {number} renderedTileRevision
 * @property {number} renderedRevision
 */

var VectorImageTile = function (_Tile) {
  _inherits(VectorImageTile, _Tile);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {number} sourceRevision Source revision.
   * @param {module:ol/format/Feature} format Feature format.
   * @param {module:ol/Tile~LoadFunction} tileLoadFunction Tile load function.
   * @param {module:ol/tilecoord~TileCoord} urlTileCoord Wrapped tile coordinate for source urls.
   * @param {module:ol/Tile~UrlFunction} tileUrlFunction Tile url function.
   * @param {module:ol/tilegrid/TileGrid} sourceTileGrid Tile grid of the source.
   * @param {module:ol/tilegrid/TileGrid} tileGrid Tile grid of the renderer.
   * @param {Object<string, module:ol/VectorTile>} sourceTiles Source tiles.
   * @param {number} pixelRatio Pixel ratio.
   * @param {module:ol/proj/Projection} projection Projection.
   * @param {function(new: module:ol/VectorTile, module:ol/tilecoord~TileCoord, module:ol/TileState, string,
   *     module:ol/format/Feature, module:ol/Tile~LoadFunction)} tileClass Class to
   *     instantiate for source tiles.
   * @param {function(this: module:ol/source/VectorTile, module:ol/events/Event)} handleTileChange
   *     Function to call when a source tile's state changes.
   * @param {number} zoom Integer zoom to render the tile for.
   */
  function VectorImageTile(tileCoord, state, sourceRevision, format, tileLoadFunction, urlTileCoord, tileUrlFunction, sourceTileGrid, tileGrid, sourceTiles, pixelRatio, projection, tileClass, handleTileChange, zoom) {
    _classCallCheck(this, VectorImageTile);

    /**
     * @private
     * @type {!Object<string, CanvasRenderingContext2D>}
     */
    var _this = _possibleConstructorReturn(this, (VectorImageTile.__proto__ || Object.getPrototypeOf(VectorImageTile)).call(this, tileCoord, state, { transition: 0 }));

    _this.context_ = {};

    /**
     * @private
     * @type {module:ol/featureloader~FeatureLoader}
     */
    _this.loader_;

    /**
     * @private
     * @type {!Object<string, module:ol/VectorImageTile~ReplayState>}
     */
    _this.replayState_ = {};

    /**
     * @private
     * @type {Object<string, module:ol/VectorTile>}
     */
    _this.sourceTiles_ = sourceTiles;

    /**
     * Keys of source tiles used by this tile. Use with {@link #getTile}.
     * @type {Array<string>}
     */
    _this.tileKeys = [];

    /**
     * @type {module:ol/extent~Extent}
     */
    _this.extent = null;

    /**
     * @type {number}
     */
    _this.sourceRevision_ = sourceRevision;

    /**
     * @type {module:ol/tilecoord~TileCoord}
     */
    _this.wrappedTileCoord = urlTileCoord;

    /**
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.loadListenerKeys_ = [];

    /**
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.sourceTileListenerKeys_ = [];

    if (urlTileCoord) {
      var extent = _this.extent = tileGrid.getTileCoordExtent(urlTileCoord);
      var resolution = tileGrid.getResolution(zoom);
      var sourceZ = sourceTileGrid.getZForResolution(resolution);
      var useLoadedOnly = zoom != tileCoord[0];
      var loadCount = 0;
      sourceTileGrid.forEachTileCoord(extent, sourceZ, function (sourceTileCoord) {
        var sharedExtent = (0, _extent.getIntersection)(extent, sourceTileGrid.getTileCoordExtent(sourceTileCoord));
        var sourceExtent = sourceTileGrid.getExtent();
        if (sourceExtent) {
          sharedExtent = (0, _extent.getIntersection)(sharedExtent, sourceExtent, sharedExtent);
        }
        if ((0, _extent.getWidth)(sharedExtent) / resolution >= 0.5 && (0, _extent.getHeight)(sharedExtent) / resolution >= 0.5) {
          // only include source tile if overlap is at least 1 pixel
          ++loadCount;
          var sourceTileKey = sourceTileCoord.toString();
          var sourceTile = sourceTiles[sourceTileKey];
          if (!sourceTile && !useLoadedOnly) {
            var tileUrl = tileUrlFunction(sourceTileCoord, pixelRatio, projection);
            sourceTile = sourceTiles[sourceTileKey] = new tileClass(sourceTileCoord, tileUrl == undefined ? _TileState2.default.EMPTY : _TileState2.default.IDLE, tileUrl == undefined ? '' : tileUrl, format, tileLoadFunction);
            this.sourceTileListenerKeys_.push((0, _events.listen)(sourceTile, _EventType2.default.CHANGE, handleTileChange));
          }
          if (sourceTile && (!useLoadedOnly || sourceTile.getState() == _TileState2.default.LOADED)) {
            sourceTile.consumers++;
            this.tileKeys.push(sourceTileKey);
          }
        }
      }.bind(_this));

      if (useLoadedOnly && loadCount == _this.tileKeys.length) {
        _this.finishLoading_();
      }

      if (zoom <= tileCoord[0] && _this.state != _TileState2.default.LOADED) {
        while (zoom > tileGrid.getMinZoom()) {
          var tile = new VectorImageTile(tileCoord, state, sourceRevision, format, tileLoadFunction, urlTileCoord, tileUrlFunction, sourceTileGrid, tileGrid, sourceTiles, pixelRatio, projection, tileClass, _functions.VOID, --zoom);
          if (tile.state == _TileState2.default.LOADED) {
            _this.interimTile = tile;
            break;
          }
        }
      }
    }

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(VectorImageTile, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.state = _TileState2.default.ABORT;
      this.changed();
      if (this.interimTile) {
        this.interimTile.dispose();
      }

      for (var i = 0, ii = this.tileKeys.length; i < ii; ++i) {
        var sourceTileKey = this.tileKeys[i];
        var sourceTile = this.getTile(sourceTileKey);
        sourceTile.consumers--;
        if (sourceTile.consumers == 0) {
          delete this.sourceTiles_[sourceTileKey];
          sourceTile.dispose();
        }
      }
      this.tileKeys.length = 0;
      this.sourceTiles_ = null;
      this.loadListenerKeys_.forEach(_events.unlistenByKey);
      this.loadListenerKeys_.length = 0;
      this.sourceTileListenerKeys_.forEach(_events.unlistenByKey);
      this.sourceTileListenerKeys_.length = 0;
      _get(VectorImageTile.prototype.__proto__ || Object.getPrototypeOf(VectorImageTile.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * @param {module:ol/layer/Layer} layer Layer.
     * @return {CanvasRenderingContext2D} The rendering context.
     */

  }, {
    key: 'getContext',
    value: function getContext(layer) {
      var key = (0, _util.getUid)(layer).toString();
      if (!(key in this.context_)) {
        this.context_[key] = (0, _dom.createCanvasContext2D)();
      }
      return this.context_[key];
    }

    /**
     * Get the Canvas for this tile.
     * @param {module:ol/layer/Layer} layer Layer.
     * @return {HTMLCanvasElement} Canvas.
     */

  }, {
    key: 'getImage',
    value: function getImage(layer) {
      return this.getReplayState(layer).renderedTileRevision == -1 ? null : this.getContext(layer).canvas;
    }

    /**
     * @param {module:ol/layer/Layer} layer Layer.
     * @return {module:ol/VectorImageTile~ReplayState} The replay state.
     */

  }, {
    key: 'getReplayState',
    value: function getReplayState(layer) {
      var key = (0, _util.getUid)(layer).toString();
      if (!(key in this.replayState_)) {
        this.replayState_[key] = {
          dirty: false,
          renderedRenderOrder: null,
          renderedRevision: -1,
          renderedTileRevision: -1
        };
      }
      return this.replayState_[key];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getKey',
    value: function getKey() {
      return this.tileKeys.join('/') + '-' + this.sourceRevision_;
    }

    /**
     * @param {string} tileKey Key (tileCoord) of the source tile.
     * @return {module:ol/VectorTile} Source tile.
     */

  }, {
    key: 'getTile',
    value: function getTile(tileKey) {
      return this.sourceTiles_[tileKey];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'load',
    value: function load() {
      // Source tiles with LOADED state - we just count them because once they are
      // loaded, we're no longer listening to state changes.
      var leftToLoad = 0;
      // Source tiles with ERROR state - we track them because they can still have
      // an ERROR state after another load attempt.
      var errorSourceTiles = {};

      if (this.state == _TileState2.default.IDLE) {
        this.setState(_TileState2.default.LOADING);
      }
      if (this.state == _TileState2.default.LOADING) {
        this.tileKeys.forEach(function (sourceTileKey) {
          var sourceTile = this.getTile(sourceTileKey);
          if (sourceTile.state == _TileState2.default.IDLE) {
            sourceTile.setLoader(this.loader_);
            sourceTile.load();
          }
          if (sourceTile.state == _TileState2.default.LOADING) {
            var key = (0, _events.listen)(sourceTile, _EventType2.default.CHANGE, function (e) {
              var state = sourceTile.getState();
              if (state == _TileState2.default.LOADED || state == _TileState2.default.ERROR) {
                var uid = (0, _util.getUid)(sourceTile);
                if (state == _TileState2.default.ERROR) {
                  errorSourceTiles[uid] = true;
                } else {
                  --leftToLoad;
                  delete errorSourceTiles[uid];
                }
                if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
                  this.finishLoading_();
                }
              }
            }.bind(this));
            this.loadListenerKeys_.push(key);
            ++leftToLoad;
          }
        }.bind(this));
      }
      if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
        setTimeout(this.finishLoading_.bind(this), 0);
      }
    }

    /**
     * @private
     */

  }, {
    key: 'finishLoading_',
    value: function finishLoading_() {
      var loaded = this.tileKeys.length;
      var empty = 0;
      for (var i = loaded - 1; i >= 0; --i) {
        var state = this.getTile(this.tileKeys[i]).getState();
        if (state != _TileState2.default.LOADED) {
          --loaded;
        }
        if (state == _TileState2.default.EMPTY) {
          ++empty;
        }
      }
      if (loaded == this.tileKeys.length) {
        this.loadListenerKeys_.forEach(_events.unlistenByKey);
        this.loadListenerKeys_.length = 0;
        this.setState(_TileState2.default.LOADED);
      } else {
        this.setState(empty == this.tileKeys.length ? _TileState2.default.EMPTY : _TileState2.default.ERROR);
      }
    }
  }]);

  return VectorImageTile;
}(_Tile3.default);

exports.default = VectorImageTile;

/**
 * Sets the loader for a tile.
 * @param {module:ol/VectorTile} tile Vector tile.
 * @param {string} url URL.
 */

function defaultLoadFunction(tile, url) {
  var loader = (0, _featureloader.loadFeaturesXhr)(url, tile.getFormat(), tile.onLoad.bind(tile), tile.onError.bind(tile));
  tile.setLoader(loader);
}