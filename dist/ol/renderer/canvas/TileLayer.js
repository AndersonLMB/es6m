'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _TileRange = require('../../TileRange.js');

var _TileRange2 = _interopRequireDefault(_TileRange);

var _TileState = require('../../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _IntermediateCanvas = require('../canvas/IntermediateCanvas.js');

var _IntermediateCanvas2 = _interopRequireDefault(_IntermediateCanvas);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/TileLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Canvas renderer for tile layers.
 * @api
 */
var CanvasTileLayerRenderer = function (_IntermediateCanvasRe) {
  _inherits(CanvasTileLayerRenderer, _IntermediateCanvasRe);

  /**
   * @param {module:ol/layer/Tile|module:ol/layer/VectorTile} tileLayer Tile layer.
   * @param {boolean=} opt_noContext Skip the context creation.
   */
  function CanvasTileLayerRenderer(tileLayer, opt_noContext) {
    _classCallCheck(this, CanvasTileLayerRenderer);

    /**
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    var _this = _possibleConstructorReturn(this, (CanvasTileLayerRenderer.__proto__ || Object.getPrototypeOf(CanvasTileLayerRenderer)).call(this, tileLayer));

    _this.context = opt_noContext ? null : (0, _dom.createCanvasContext2D)();

    /**
     * @private
     * @type {number}
     */
    _this.oversampling_;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.renderedExtent_ = null;

    /**
     * @protected
     * @type {number}
     */
    _this.renderedRevision;

    /**
     * @protected
     * @type {!Array<module:ol/Tile>}
     */
    _this.renderedTiles = [];

    /**
     * @private
     * @type {boolean}
     */
    _this.newTiles_ = false;

    /**
     * @protected
     * @type {module:ol/extent~Extent}
     */
    _this.tmpExtent = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {module:ol/TileRange}
     */
    _this.tmpTileRange_ = new _TileRange2.default(0, 0, 0, 0);

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.imageTransform_ = (0, _transform.create)();

    /**
     * @protected
     * @type {number}
     */
    _this.zDirection = 0;

    return _this;
  }

  /**
   * @private
   * @param {module:ol/Tile} tile Tile.
   * @return {boolean} Tile is drawable.
   */


  _createClass(CanvasTileLayerRenderer, [{
    key: 'isDrawableTile_',
    value: function isDrawableTile_(tile) {
      var tileState = tile.getState();
      var useInterimTilesOnError = this.getLayer().getUseInterimTilesOnError();
      return tileState == _TileState2.default.LOADED || tileState == _TileState2.default.EMPTY || tileState == _TileState2.default.ERROR && !useInterimTilesOnError;
    }

    /**
     * @param {number} z Tile coordinate z.
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {!module:ol/Tile} Tile.
     */

  }, {
    key: 'getTile',
    value: function getTile(z, x, y, pixelRatio, projection) {
      var layer = this.getLayer();
      var source = /** @type {module:ol/source/Tile} */layer.getSource();
      var tile = source.getTile(z, x, y, pixelRatio, projection);
      if (tile.getState() == _TileState2.default.ERROR) {
        if (!layer.getUseInterimTilesOnError()) {
          // When useInterimTilesOnError is false, we consider the error tile as loaded.
          tile.setState(_TileState2.default.LOADED);
        } else if (layer.getPreload() > 0) {
          // Preloaded tiles for lower resolutions might have finished loading.
          this.newTiles_ = true;
        }
      }
      if (!this.isDrawableTile_(tile)) {
        tile = tile.getInterimTile();
      }
      return tile;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState) {

      var pixelRatio = frameState.pixelRatio;
      var size = frameState.size;
      var viewState = frameState.viewState;
      var projection = viewState.projection;
      var viewResolution = viewState.resolution;
      var viewCenter = viewState.center;

      var tileLayer = this.getLayer();
      var tileSource = /** @type {module:ol/source/Tile} */tileLayer.getSource();
      var sourceRevision = tileSource.getRevision();
      var tileGrid = tileSource.getTileGridForProjection(projection);
      var z = tileGrid.getZForResolution(viewResolution, this.zDirection);
      var tileResolution = tileGrid.getResolution(z);
      var oversampling = Math.round(viewResolution / tileResolution) || 1;
      var extent = frameState.extent;

      if (layerState.extent !== undefined) {
        extent = (0, _extent.getIntersection)(extent, layerState.extent);
      }
      if ((0, _extent.isEmpty)(extent)) {
        // Return false to prevent the rendering of the layer.
        return false;
      }

      var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
      var imageExtent = tileGrid.getTileRangeExtent(z, tileRange);

      var tilePixelRatio = tileSource.getTilePixelRatio(pixelRatio);

      /**
       * @type {Object<number, Object<string, module:ol/Tile>>}
       */
      var tilesToDrawByZ = {};
      tilesToDrawByZ[z] = {};

      var findLoadedTiles = this.createLoadedTileFinder(tileSource, projection, tilesToDrawByZ);

      var hints = frameState.viewHints;
      var animatingOrInteracting = hints[_ViewHint2.default.ANIMATING] || hints[_ViewHint2.default.INTERACTING];

      var tmpExtent = this.tmpExtent;
      var tmpTileRange = this.tmpTileRange_;
      this.newTiles_ = false;
      var tile = void 0,
          x = void 0,
          y = void 0;
      for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
          if (Date.now() - frameState.time > 16 && animatingOrInteracting) {
            continue;
          }
          tile = this.getTile(z, x, y, pixelRatio, projection);
          if (this.isDrawableTile_(tile)) {
            var uid = (0, _util.getUid)(this);
            if (tile.getState() == _TileState2.default.LOADED) {
              tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
              var inTransition = tile.inTransition(uid);
              if (!this.newTiles_ && (inTransition || this.renderedTiles.indexOf(tile) === -1)) {
                this.newTiles_ = true;
              }
            }
            if (tile.getAlpha(uid, frameState.time) === 1) {
              // don't look for alt tiles if alpha is 1
              continue;
            }
          }

          var childTileRange = tileGrid.getTileCoordChildTileRange(tile.tileCoord, tmpTileRange, tmpExtent);
          var covered = false;
          if (childTileRange) {
            covered = findLoadedTiles(z + 1, childTileRange);
          }
          if (!covered) {
            tileGrid.forEachTileCoordParentTileRange(tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
          }
        }
      }

      var renderedResolution = tileResolution * pixelRatio / tilePixelRatio * oversampling;
      if (!(this.renderedResolution && Date.now() - frameState.time > 16 && animatingOrInteracting) && (this.newTiles_ || !(this.renderedExtent_ && (0, _extent.containsExtent)(this.renderedExtent_, extent)) || this.renderedRevision != sourceRevision || oversampling != this.oversampling_ || !animatingOrInteracting && renderedResolution != this.renderedResolution)) {

        var context = this.context;
        if (context) {
          var tilePixelSize = tileSource.getTilePixelSize(z, pixelRatio, projection);
          var width = Math.round(tileRange.getWidth() * tilePixelSize[0] / oversampling);
          var height = Math.round(tileRange.getHeight() * tilePixelSize[1] / oversampling);
          var canvas = context.canvas;
          if (canvas.width != width || canvas.height != height) {
            this.oversampling_ = oversampling;
            canvas.width = width;
            canvas.height = height;
          } else {
            if (this.renderedExtent_ && !(0, _extent.equals)(imageExtent, this.renderedExtent_)) {
              context.clearRect(0, 0, width, height);
            }
            oversampling = this.oversampling_;
          }
        }

        this.renderedTiles.length = 0;
        /** @type {Array<number>} */
        var zs = Object.keys(tilesToDrawByZ).map(Number);
        zs.sort(function (a, b) {
          if (a === z) {
            return 1;
          } else if (b === z) {
            return -1;
          } else {
            return a > b ? 1 : a < b ? -1 : 0;
          }
        });
        var currentResolution = void 0,
            currentScale = void 0,
            currentTilePixelSize = void 0,
            currentZ = void 0,
            i = void 0,
            ii = void 0;
        var tileExtent = void 0,
            tileGutter = void 0,
            tilesToDraw = void 0,
            w = void 0,
            h = void 0;
        for (i = 0, ii = zs.length; i < ii; ++i) {
          currentZ = zs[i];
          currentTilePixelSize = tileSource.getTilePixelSize(currentZ, pixelRatio, projection);
          currentResolution = tileGrid.getResolution(currentZ);
          currentScale = currentResolution / tileResolution;
          tileGutter = tilePixelRatio * tileSource.getGutterForProjection(projection);
          tilesToDraw = tilesToDrawByZ[currentZ];
          for (var tileCoordKey in tilesToDraw) {
            tile = tilesToDraw[tileCoordKey];
            tileExtent = tileGrid.getTileCoordExtent(tile.getTileCoord(), tmpExtent);
            x = (tileExtent[0] - imageExtent[0]) / tileResolution * tilePixelRatio / oversampling;
            y = (imageExtent[3] - tileExtent[3]) / tileResolution * tilePixelRatio / oversampling;
            w = currentTilePixelSize[0] * currentScale / oversampling;
            h = currentTilePixelSize[1] * currentScale / oversampling;
            this.drawTileImage(tile, frameState, layerState, x, y, w, h, tileGutter, z === currentZ);
            this.renderedTiles.push(tile);
          }
        }

        this.renderedRevision = sourceRevision;
        this.renderedResolution = tileResolution * pixelRatio / tilePixelRatio * oversampling;
        this.renderedExtent_ = imageExtent;
      }

      var scale = this.renderedResolution / viewResolution;
      var transform = (0, _transform.compose)(this.imageTransform_, pixelRatio * size[0] / 2, pixelRatio * size[1] / 2, scale, scale, 0, (this.renderedExtent_[0] - viewCenter[0]) / this.renderedResolution * pixelRatio, (viewCenter[1] - this.renderedExtent_[3]) / this.renderedResolution * pixelRatio);
      (0, _transform.compose)(this.coordinateToCanvasPixelTransform, pixelRatio * size[0] / 2 - transform[4], pixelRatio * size[1] / 2 - transform[5], pixelRatio / viewResolution, -pixelRatio / viewResolution, 0, -viewCenter[0], -viewCenter[1]);

      this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
      this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, z, tileLayer.getPreload());
      this.scheduleExpireCache(frameState, tileSource);

      return this.renderedTiles.length > 0;
    }

    /**
     * @param {module:ol/Tile} tile Tile.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @param {number} x Left of the tile.
     * @param {number} y Top of the tile.
     * @param {number} w Width of the tile.
     * @param {number} h Height of the tile.
     * @param {number} gutter Tile gutter.
     * @param {boolean} transition Apply an alpha transition.
     */

  }, {
    key: 'drawTileImage',
    value: function drawTileImage(tile, frameState, layerState, x, y, w, h, gutter, transition) {
      var image = tile.getImage(this.getLayer());
      if (!image) {
        return;
      }
      var uid = (0, _util.getUid)(this);
      var alpha = transition ? tile.getAlpha(uid, frameState.time) : 1;
      if (alpha === 1 && !this.getLayer().getSource().getOpaque(frameState.viewState.projection)) {
        this.context.clearRect(x, y, w, h);
      }
      var alphaChanged = alpha !== this.context.globalAlpha;
      if (alphaChanged) {
        this.context.save();
        this.context.globalAlpha = alpha;
      }
      this.context.drawImage(image, gutter, gutter, image.width - 2 * gutter, image.height - 2 * gutter, x, y, w, h);

      if (alphaChanged) {
        this.context.restore();
      }
      if (alpha !== 1) {
        frameState.animate = true;
      } else if (transition) {
        tile.endTransition(uid);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      var context = this.context;
      return context ? context.canvas : null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageTransform',
    value: function getImageTransform() {
      return this.imageTransform_;
    }
  }]);

  return CanvasTileLayerRenderer;
}(_IntermediateCanvas2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


CanvasTileLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.TILE;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/canvas/TileLayer} The layer renderer.
 */
CanvasTileLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasTileLayerRenderer( /** @type {module:ol/layer/Tile} */layer);
};

/**
 * @function
 * @return {module:ol/layer/Tile|module:ol/layer/VectorTile}
 */
CanvasTileLayerRenderer.prototype.getLayer;

exports.default = CanvasTileLayerRenderer;