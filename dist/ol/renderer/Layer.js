'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _Observable2 = require('../Observable.js');

var _Observable3 = _interopRequireDefault(_Observable2);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _functions = require('../functions.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/Layer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LayerRenderer = function (_Observable) {
  _inherits(LayerRenderer, _Observable);

  /**
   * @param {module:ol/layer/Layer} layer Layer.
   */
  function LayerRenderer(layer) {
    _classCallCheck(this, LayerRenderer);

    /**
     * @private
     * @type {module:ol/layer/Layer}
     */
    var _this = _possibleConstructorReturn(this, (LayerRenderer.__proto__ || Object.getPrototypeOf(LayerRenderer)).call(this));

    _this.layer_ = layer;

    return _this;
  }

  /**
   * Create a function that adds loaded tiles to the tile lookup.
   * @param {module:ol/source/Tile} source Tile source.
   * @param {module:ol/proj/Projection} projection Projection of the tiles.
   * @param {Object<number, Object<string, module:ol/Tile>>} tiles Lookup of loaded tiles by zoom level.
   * @return {function(number, module:ol/TileRange):boolean} A function that can be
   *     called with a zoom level and a tile range to add loaded tiles to the lookup.
   * @protected
   */


  _createClass(LayerRenderer, [{
    key: 'createLoadedTileFinder',
    value: function createLoadedTileFinder(source, projection, tiles) {
      return (
        /**
         * @param {number} zoom Zoom level.
         * @param {module:ol/TileRange} tileRange Tile range.
         * @return {boolean} The tile range is fully loaded.
         */
        function (zoom, tileRange) {
          function callback(tile) {
            if (!tiles[zoom]) {
              tiles[zoom] = {};
            }
            tiles[zoom][tile.tileCoord.toString()] = tile;
          }
          return source.forEachLoadedTile(projection, zoom, tileRange, callback);
        }
      );
    }

    /**
     * @return {module:ol/layer/Layer} Layer.
     */

  }, {
    key: 'getLayer',
    value: function getLayer() {
      return this.layer_;
    }

    /**
     * Handle changes in image state.
     * @param {module:ol/events/Event} event Image change event.
     * @private
     */

  }, {
    key: 'handleImageChange_',
    value: function handleImageChange_(event) {
      var image = /** @type {module:ol/Image} */event.target;
      if (image.getState() === _ImageState2.default.LOADED) {
        this.renderIfReadyAndVisible();
      }
    }

    /**
     * Load the image if not already loaded, and register the image change
     * listener if needed.
     * @param {module:ol/ImageBase} image Image.
     * @return {boolean} `true` if the image is already loaded, `false` otherwise.
     * @protected
     */

  }, {
    key: 'loadImage',
    value: function loadImage(image) {
      var imageState = image.getState();
      if (imageState != _ImageState2.default.LOADED && imageState != _ImageState2.default.ERROR) {
        (0, _events.listen)(image, _EventType2.default.CHANGE, this.handleImageChange_, this);
      }
      if (imageState == _ImageState2.default.IDLE) {
        image.load();
        imageState = image.getState();
      }
      return imageState == _ImageState2.default.LOADED;
    }

    /**
     * @protected
     */

  }, {
    key: 'renderIfReadyAndVisible',
    value: function renderIfReadyAndVisible() {
      var layer = this.getLayer();
      if (layer.getVisible() && layer.getSourceState() == _State2.default.READY) {
        this.changed();
      }
    }

    /**
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/source/Tile} tileSource Tile source.
     * @protected
     */

  }, {
    key: 'scheduleExpireCache',
    value: function scheduleExpireCache(frameState, tileSource) {
      if (tileSource.canExpireCache()) {
        /**
         * @param {module:ol/source/Tile} tileSource Tile source.
         * @param {module:ol/PluggableMap} map Map.
         * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
         */
        var postRenderFunction = function (tileSource, map, frameState) {
          var tileSourceKey = (0, _util.getUid)(tileSource).toString();
          if (tileSourceKey in frameState.usedTiles) {
            tileSource.expireCache(frameState.viewState.projection, frameState.usedTiles[tileSourceKey]);
          }
        }.bind(null, tileSource);

        frameState.postRenderFunctions.push(
        /** @type {module:ol/PluggableMap~PostRenderFunction} */postRenderFunction);
      }
    }

    /**
     * @param {!Object<string, !Object<string, module:ol/TileRange>>} usedTiles Used tiles.
     * @param {module:ol/source/Tile} tileSource Tile source.
     * @param {number} z Z.
     * @param {module:ol/TileRange} tileRange Tile range.
     * @protected
     */

  }, {
    key: 'updateUsedTiles',
    value: function updateUsedTiles(usedTiles, tileSource, z, tileRange) {
      // FIXME should we use tilesToDrawByZ instead?
      var tileSourceKey = (0, _util.getUid)(tileSource).toString();
      var zKey = z.toString();
      if (tileSourceKey in usedTiles) {
        if (zKey in usedTiles[tileSourceKey]) {
          usedTiles[tileSourceKey][zKey].extend(tileRange);
        } else {
          usedTiles[tileSourceKey][zKey] = tileRange;
        }
      } else {
        usedTiles[tileSourceKey] = {};
        usedTiles[tileSourceKey][zKey] = tileRange;
      }
    }

    /**
     * Manage tile pyramid.
     * This function performs a number of functions related to the tiles at the
     * current zoom and lower zoom levels:
     * - registers idle tiles in frameState.wantedTiles so that they are not
     *   discarded by the tile queue
     * - enqueues missing tiles
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/source/Tile} tileSource Tile source.
     * @param {module:ol/tilegrid/TileGrid} tileGrid Tile grid.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} currentZ Current Z.
     * @param {number} preload Load low resolution tiles up to 'preload' levels.
     * @param {function(this: T, module:ol/Tile)=} opt_tileCallback Tile callback.
     * @param {T=} opt_this Object to use as `this` in `opt_tileCallback`.
     * @protected
     * @template T
     */

  }, {
    key: 'manageTilePyramid',
    value: function manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, currentZ, preload, opt_tileCallback, opt_this) {
      var tileSourceKey = (0, _util.getUid)(tileSource).toString();
      if (!(tileSourceKey in frameState.wantedTiles)) {
        frameState.wantedTiles[tileSourceKey] = {};
      }
      var wantedTiles = frameState.wantedTiles[tileSourceKey];
      var tileQueue = frameState.tileQueue;
      var minZoom = tileGrid.getMinZoom();
      var tile = void 0,
          tileRange = void 0,
          tileResolution = void 0,
          x = void 0,
          y = void 0,
          z = void 0;
      for (z = minZoom; z <= currentZ; ++z) {
        tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
        tileResolution = tileGrid.getResolution(z);
        for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
          for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
            if (currentZ - z <= preload) {
              tile = tileSource.getTile(z, x, y, pixelRatio, projection);
              if (tile.getState() == _TileState2.default.IDLE) {
                wantedTiles[tile.getKey()] = true;
                if (!tileQueue.isKeyQueued(tile.getKey())) {
                  tileQueue.enqueue([tile, tileSourceKey, tileGrid.getTileCoordCenter(tile.tileCoord), tileResolution]);
                }
              }
              if (opt_tileCallback !== undefined) {
                opt_tileCallback.call(opt_this, tile);
              }
            } else {
              tileSource.useTile(z, x, y, projection);
            }
          }
        }
      }
    }
  }]);

  return LayerRenderer;
}(_Observable3.default);

/**
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
 * @param {number} hitTolerance Hit tolerance in pixels.
 * @param {function(this: S, (module:ol/Feature|module:ol/render/Feature), module:ol/layer/Layer): T} callback Feature callback.
 * @param {S} thisArg Value to use as `this` when executing `callback`.
 * @return {T|void} Callback result.
 * @template S,T
 */


LayerRenderer.prototype.forEachFeatureAtCoordinate = _functions.VOID;

/**
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
 * @return {boolean} Is there a feature at the given coordinate?
 */
LayerRenderer.prototype.hasFeatureAtCoordinate = _functions.FALSE;

exports.default = LayerRenderer;