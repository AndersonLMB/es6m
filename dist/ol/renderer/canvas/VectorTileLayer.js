'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _TileState = require('../../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('../../dom.js');

var _events = require('../../events.js');

var _EventType = require('../../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _rbush = require('rbush');

var _rbush2 = _interopRequireDefault(_rbush);

var _extent = require('../../extent.js');

var _VectorTileRenderType = require('../../layer/VectorTileRenderType.js');

var _VectorTileRenderType2 = _interopRequireDefault(_VectorTileRenderType);

var _proj = require('../../proj.js');

var _Units = require('../../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

var _ReplayType = require('../../render/ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

var _canvas = require('../../render/canvas.js');

var _ReplayGroup = require('../../render/canvas/ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

var _replay = require('../../render/replay.js');

var _TileLayer = require('../canvas/TileLayer.js');

var _TileLayer2 = _interopRequireDefault(_TileLayer);

var _vector = require('../vector.js');

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/VectorTileLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {!Object<string, Array<module:ol/render/ReplayType>>}
 */
var IMAGE_REPLAYS = {
  'image': [_ReplayType2.default.POLYGON, _ReplayType2.default.CIRCLE, _ReplayType2.default.LINE_STRING, _ReplayType2.default.IMAGE, _ReplayType2.default.TEXT],
  'hybrid': [_ReplayType2.default.POLYGON, _ReplayType2.default.LINE_STRING]
};

/**
 * @type {!Object<string, Array<module:ol/render/ReplayType>>}
 */
var VECTOR_REPLAYS = {
  'image': [_ReplayType2.default.DEFAULT],
  'hybrid': [_ReplayType2.default.IMAGE, _ReplayType2.default.TEXT, _ReplayType2.default.DEFAULT],
  'vector': _replay.ORDER
};

/**
 * @classdesc
 * Canvas renderer for vector tile layers.
 * @api
 */

var CanvasVectorTileLayerRenderer = function (_CanvasTileLayerRende) {
  _inherits(CanvasVectorTileLayerRenderer, _CanvasTileLayerRende);

  /**
   * @param {module:ol/layer/VectorTile} layer VectorTile layer.
   */
  function CanvasVectorTileLayerRenderer(layer) {
    _classCallCheck(this, CanvasVectorTileLayerRenderer);

    /**
     * Declutter tree.
     * @private
     */
    var _this = _possibleConstructorReturn(this, (CanvasVectorTileLayerRenderer.__proto__ || Object.getPrototypeOf(CanvasVectorTileLayerRenderer)).call(this, layer, true));

    _this.declutterTree_ = layer.getDeclutter() ? (0, _rbush2.default)(9, undefined) : null;

    /**
     * @private
     * @type {boolean}
     */
    _this.dirty_ = false;

    /**
     * @private
     * @type {number}
     */
    _this.renderedLayerRevision_;

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.tmpTransform_ = (0, _transform.create)();

    // Use lower resolution for pure vector rendering. Closest resolution otherwise.
    _this.zDirection = layer.getRenderMode() == _VectorTileRenderType2.default.VECTOR ? 1 : 0;

    (0, _events.listen)(_canvas.labelCache, _EventType2.default.CLEAR, _this.handleFontsChanged_, _this);

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(CanvasVectorTileLayerRenderer, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      (0, _events.unlisten)(_canvas.labelCache, _EventType2.default.CLEAR, this.handleFontsChanged_, this);
      _TileLayer2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTile',
    value: function getTile(z, x, y, pixelRatio, projection) {
      var tile = _TileLayer2.default.prototype.getTile.call(this, z, x, y, pixelRatio, projection);
      if (tile.getState() === _TileState2.default.LOADED) {
        this.createReplayGroup_(tile, pixelRatio, projection);
        if (this.context) {
          this.renderTileImage_(tile, pixelRatio, projection);
        }
      }
      return tile;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState) {
      var layer = this.getLayer();
      var layerRevision = layer.getRevision();
      if (this.renderedLayerRevision_ != layerRevision) {
        this.renderedTiles.length = 0;
        var renderMode = layer.getRenderMode();
        if (!this.context && renderMode != _VectorTileRenderType2.default.VECTOR) {
          this.context = (0, _dom.createCanvasContext2D)();
        }
        if (this.context && renderMode == _VectorTileRenderType2.default.VECTOR) {
          this.context = null;
        }
      }
      this.renderedLayerRevision_ = layerRevision;
      return _TileLayer2.default.prototype.prepareFrame.apply(this, arguments);
    }

    /**
     * @param {module:ol/VectorImageTile} tile Tile.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @private
     */

  }, {
    key: 'createReplayGroup_',
    value: function createReplayGroup_(tile, pixelRatio, projection) {
      var _this2 = this;

      var layer = this.getLayer();
      var revision = layer.getRevision();
      var renderOrder = /** @type {module:ol/render~OrderFunction} */layer.getRenderOrder() || null;

      var replayState = tile.getReplayState(layer);
      if (!replayState.dirty && replayState.renderedRevision == revision && replayState.renderedRenderOrder == renderOrder) {
        return;
      }

      var source = /** @type {module:ol/source/VectorTile} */layer.getSource();
      var sourceTileGrid = source.getTileGrid();
      var tileGrid = source.getTileGridForProjection(projection);
      var resolution = tileGrid.getResolution(tile.tileCoord[0]);
      var tileExtent = tile.extent;

      var zIndexKeys = {};

      var _loop = function _loop(t, tt) {
        var sourceTile = tile.getTile(tile.tileKeys[t]);
        if (sourceTile.getState() != _TileState2.default.LOADED) {
          return 'continue';
        }

        var sourceTileCoord = sourceTile.tileCoord;
        var sourceTileExtent = sourceTileGrid.getTileCoordExtent(sourceTileCoord);
        var sharedExtent = (0, _extent.getIntersection)(tileExtent, sourceTileExtent);
        var bufferedExtent = (0, _extent.equals)(sourceTileExtent, sharedExtent) ? null : (0, _extent.buffer)(sharedExtent, layer.getRenderBuffer() * resolution, _this2.tmpExtent);
        var tileProjection = sourceTile.getProjection();
        var reproject = false;
        if (!(0, _proj.equivalent)(projection, tileProjection)) {
          reproject = true;
          sourceTile.setProjection(projection);
        }
        replayState.dirty = false;
        var replayGroup = new _ReplayGroup2.default(0, sharedExtent, resolution, pixelRatio, source.getOverlaps(), _this2.declutterTree_, layer.getRenderBuffer());
        var squaredTolerance = (0, _vector.getSquaredTolerance)(resolution, pixelRatio);

        /**
         * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
         * @this {module:ol/renderer/canvas/VectorTileLayer}
         */
        var render = function render(feature) {
          var styles = void 0;
          var styleFunction = feature.getStyleFunction() || layer.getStyleFunction();
          if (styleFunction) {
            styles = styleFunction(feature, resolution);
          }
          if (styles) {
            var dirty = this.renderFeature(feature, squaredTolerance, styles, replayGroup);
            this.dirty_ = this.dirty_ || dirty;
            replayState.dirty = replayState.dirty || dirty;
          }
        };

        var features = sourceTile.getFeatures();
        if (renderOrder && renderOrder !== replayState.renderedRenderOrder) {
          features.sort(renderOrder);
        }
        for (var i = 0, ii = features.length; i < ii; ++i) {
          var feature = features[i];
          if (reproject) {
            if (tileProjection.getUnits() == _Units2.default.TILE_PIXELS) {
              // projected tile extent
              tileProjection.setWorldExtent(sourceTileExtent);
              // tile extent in tile pixel space
              tileProjection.setExtent(sourceTile.getExtent());
            }
            feature.getGeometry().transform(tileProjection, projection);
          }
          if (!bufferedExtent || (0, _extent.intersects)(bufferedExtent, feature.getGeometry().getExtent())) {
            render.call(_this2, feature);
          }
        }
        replayGroup.finish();
        for (var r in replayGroup.getReplays()) {
          zIndexKeys[r] = true;
        }
        sourceTile.setReplayGroup(layer, tile.tileCoord.toString(), replayGroup);
      };

      for (var t = 0, tt = tile.tileKeys.length; t < tt; ++t) {
        var _ret = _loop(t, tt);

        if (_ret === 'continue') continue;
      }
      replayState.renderedRevision = revision;
      replayState.renderedRenderOrder = renderOrder;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      var resolution = frameState.viewState.resolution;
      var rotation = frameState.viewState.rotation;
      hitTolerance = hitTolerance == undefined ? 0 : hitTolerance;
      var layer = this.getLayer();
      /** @type {!Object<string, boolean>} */
      var features = {};

      /** @type {Array<module:ol/VectorImageTile>} */
      var renderedTiles = this.renderedTiles;

      var bufferedExtent = void 0,
          found = void 0;
      var i = void 0,
          ii = void 0,
          replayGroup = void 0;
      for (i = 0, ii = renderedTiles.length; i < ii; ++i) {
        var tile = renderedTiles[i];
        bufferedExtent = (0, _extent.buffer)(tile.extent, hitTolerance * resolution, bufferedExtent);
        if (!(0, _extent.containsCoordinate)(bufferedExtent, coordinate)) {
          continue;
        }
        for (var t = 0, tt = tile.tileKeys.length; t < tt; ++t) {
          var _sourceTile = tile.getTile(tile.tileKeys[t]);
          if (_sourceTile.getState() != _TileState2.default.LOADED) {
            continue;
          }
          replayGroup = _sourceTile.getReplayGroup(layer, tile.tileCoord.toString());
          found = found || replayGroup.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, {},
          /**
           * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
           * @return {?} Callback result.
           */
          function (feature) {
            var key = (0, _util.getUid)(feature).toString();
            if (!(key in features)) {
              features[key] = true;
              return callback.call(thisArg, feature, layer);
            }
          }, null);
        }
      }
      return found;
    }

    /**
     * @param {module:ol/VectorTile} tile Tile.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @return {module:ol/transform~Transform} transform Transform.
     * @private
     */

  }, {
    key: 'getReplayTransform_',
    value: function getReplayTransform_(tile, frameState) {
      var layer = this.getLayer();
      var source = /** @type {module:ol/source/VectorTile} */layer.getSource();
      var tileGrid = source.getTileGrid();
      var tileCoord = tile.tileCoord;
      var tileResolution = tileGrid.getResolution(tileCoord[0]);
      var viewState = frameState.viewState;
      var pixelRatio = frameState.pixelRatio;
      var renderResolution = viewState.resolution / pixelRatio;
      var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent);
      var center = viewState.center;
      var origin = (0, _extent.getTopLeft)(tileExtent);
      var size = frameState.size;
      var offsetX = Math.round(pixelRatio * size[0] / 2);
      var offsetY = Math.round(pixelRatio * size[1] / 2);
      return (0, _transform.compose)(this.tmpTransform_, offsetX, offsetY, tileResolution / renderResolution, tileResolution / renderResolution, viewState.rotation, (origin[0] - center[0]) / tileResolution, (center[1] - origin[1]) / tileResolution);
    }

    /**
     * @param {module:ol/events/Event} event Event.
     */

  }, {
    key: 'handleFontsChanged_',
    value: function handleFontsChanged_(event) {
      var layer = this.getLayer();
      if (layer.getVisible() && this.renderedLayerRevision_ !== undefined) {
        layer.changed();
      }
    }

    /**
     * Handle changes in image style state.
     * @param {module:ol/events/Event} event Image style change event.
     * @private
     */

  }, {
    key: 'handleStyleImageChange_',
    value: function handleStyleImageChange_(event) {
      this.renderIfReadyAndVisible();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'postCompose',
    value: function postCompose(context, frameState, layerState) {
      var layer = this.getLayer();
      var renderMode = layer.getRenderMode();
      if (renderMode != _VectorTileRenderType2.default.IMAGE) {
        var declutterReplays = layer.getDeclutter() ? {} : null;
        var source = /** @type {module:ol/source/VectorTile} */layer.getSource();
        var replayTypes = VECTOR_REPLAYS[renderMode];
        var pixelRatio = frameState.pixelRatio;
        var rotation = frameState.viewState.rotation;
        var size = frameState.size;
        var offsetX = void 0,
            offsetY = void 0;
        if (rotation) {
          offsetX = Math.round(pixelRatio * size[0] / 2);
          offsetY = Math.round(pixelRatio * size[1] / 2);
          (0, _canvas.rotateAtOffset)(context, -rotation, offsetX, offsetY);
        }
        if (declutterReplays) {
          this.declutterTree_.clear();
        }
        var tiles = this.renderedTiles;
        var tileGrid = source.getTileGridForProjection(frameState.viewState.projection);
        var clips = [];
        var zs = [];
        for (var i = tiles.length - 1; i >= 0; --i) {
          var tile = /** @type {module:ol/VectorImageTile} */tiles[i];
          if (tile.getState() == _TileState2.default.ABORT) {
            continue;
          }
          var tileCoord = tile.tileCoord;
          var worldOffset = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent)[0] - tile.extent[0];
          var transform = undefined;
          for (var t = 0, tt = tile.tileKeys.length; t < tt; ++t) {
            var _sourceTile2 = tile.getTile(tile.tileKeys[t]);
            if (_sourceTile2.getState() != _TileState2.default.LOADED) {
              continue;
            }
            var _replayGroup = _sourceTile2.getReplayGroup(layer, tileCoord.toString());
            if (!_replayGroup || !_replayGroup.hasReplays(replayTypes)) {
              // sourceTile was not yet loaded when this.createReplayGroup_() was
              // called, or it has no replays of the types we want to render
              continue;
            }
            if (!transform) {
              transform = this.getTransform(frameState, worldOffset);
            }
            var currentZ = _sourceTile2.tileCoord[0];
            var currentClip = _replayGroup.getClipCoords(transform);
            context.save();
            context.globalAlpha = layerState.opacity;
            // Create a clip mask for regions in this low resolution tile that are
            // already filled by a higher resolution tile
            for (var j = 0, jj = clips.length; j < jj; ++j) {
              var clip = clips[j];
              if (currentZ < zs[j]) {
                context.beginPath();
                // counter-clockwise (outer ring) for current tile
                context.moveTo(currentClip[0], currentClip[1]);
                context.lineTo(currentClip[2], currentClip[3]);
                context.lineTo(currentClip[4], currentClip[5]);
                context.lineTo(currentClip[6], currentClip[7]);
                // clockwise (inner ring) for higher resolution tile
                context.moveTo(clip[6], clip[7]);
                context.lineTo(clip[4], clip[5]);
                context.lineTo(clip[2], clip[3]);
                context.lineTo(clip[0], clip[1]);
                context.clip();
              }
            }
            _replayGroup.replay(context, transform, rotation, {}, replayTypes, declutterReplays);
            context.restore();
            clips.push(currentClip);
            zs.push(currentZ);
          }
        }
        if (declutterReplays) {
          (0, _ReplayGroup.replayDeclutter)(declutterReplays, context, rotation);
        }
        if (rotation) {
          (0, _canvas.rotateAtOffset)(context, rotation,
          /** @type {number} */offsetX, /** @type {number} */offsetY);
        }
      }
      _TileLayer2.default.prototype.postCompose.apply(this, arguments);
    }

    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {module:ol/style/Style|Array<module:ol/style/Style>} styles The style or array of styles.
     * @param {module:ol/render/canvas/ReplayGroup} replayGroup Replay group.
     * @return {boolean} `true` if an image is loading.
     */

  }, {
    key: 'renderFeature',
    value: function renderFeature(feature, squaredTolerance, styles, replayGroup) {
      if (!styles) {
        return false;
      }
      var loading = false;
      if (Array.isArray(styles)) {
        for (var i = 0, ii = styles.length; i < ii; ++i) {
          loading = (0, _vector.renderFeature)(replayGroup, feature, styles[i], squaredTolerance, this.handleStyleImageChange_, this) || loading;
        }
      } else {
        loading = (0, _vector.renderFeature)(replayGroup, feature, styles, squaredTolerance, this.handleStyleImageChange_, this);
      }
      return loading;
    }

    /**
     * @param {module:ol/VectorImageTile} tile Tile.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @private
     */

  }, {
    key: 'renderTileImage_',
    value: function renderTileImage_(tile, pixelRatio, projection) {
      var layer = this.getLayer();
      var replayState = tile.getReplayState(layer);
      var revision = layer.getRevision();
      var replays = IMAGE_REPLAYS[layer.getRenderMode()];
      if (replays && replayState.renderedTileRevision !== revision) {
        replayState.renderedTileRevision = revision;
        var tileCoord = tile.wrappedTileCoord;
        var z = tileCoord[0];
        var source = /** @type {module:ol/source/VectorTile} */layer.getSource();
        var tileGrid = source.getTileGridForProjection(projection);
        var resolution = tileGrid.getResolution(z);
        var context = tile.getContext(layer);
        var size = source.getTilePixelSize(z, pixelRatio, projection);
        context.canvas.width = size[0];
        context.canvas.height = size[1];
        var tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent);
        for (var i = 0, ii = tile.tileKeys.length; i < ii; ++i) {
          var _sourceTile3 = tile.getTile(tile.tileKeys[i]);
          if (_sourceTile3.getState() != _TileState2.default.LOADED) {
            continue;
          }
          var pixelScale = pixelRatio / resolution;
          var transform = (0, _transform.reset)(this.tmpTransform_);
          (0, _transform.scale)(transform, pixelScale, -pixelScale);
          (0, _transform.translate)(transform, -tileExtent[0], -tileExtent[3]);
          var _replayGroup2 = _sourceTile3.getReplayGroup(layer, tile.tileCoord.toString());
          _replayGroup2.replay(context, transform, 0, {}, replays);
        }
      }
    }
  }]);

  return CanvasVectorTileLayerRenderer;
}(_TileLayer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


CanvasVectorTileLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.VECTOR_TILE;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/canvas/VectorTileLayer} The layer renderer.
 */
CanvasVectorTileLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasVectorTileLayerRenderer( /** @type {module:ol/layer/VectorTile} */layer);
};

exports.default = CanvasVectorTileLayerRenderer;