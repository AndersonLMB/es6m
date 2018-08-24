'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _events = require('../../events.js');

var _EventType = require('../../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _rbush = require('rbush');

var _rbush2 = _interopRequireDefault(_rbush);

var _extent = require('../../extent.js');

var _EventType3 = require('../../render/EventType.js');

var _EventType4 = _interopRequireDefault(_EventType3);

var _canvas = require('../../render/canvas.js');

var _ReplayGroup = require('../../render/canvas/ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

var _Layer = require('../canvas/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _vector = require('../vector.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/VectorLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Canvas renderer for vector layers.
 * @api
 */
var CanvasVectorLayerRenderer = function (_CanvasLayerRenderer) {
  _inherits(CanvasVectorLayerRenderer, _CanvasLayerRenderer);

  /**
   * @param {module:ol/layer/Vector} vectorLayer Vector layer.
   */
  function CanvasVectorLayerRenderer(vectorLayer) {
    _classCallCheck(this, CanvasVectorLayerRenderer);

    /**
     * Declutter tree.
     * @private
     */
    var _this = _possibleConstructorReturn(this, (CanvasVectorLayerRenderer.__proto__ || Object.getPrototypeOf(CanvasVectorLayerRenderer)).call(this, vectorLayer));

    _this.declutterTree_ = vectorLayer.getDeclutter() ? (0, _rbush2.default)(9, undefined) : null;

    /**
     * @private
     * @type {boolean}
     */
    _this.dirty_ = false;

    /**
     * @private
     * @type {number}
     */
    _this.renderedRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    _this.renderedResolution_ = NaN;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.renderedExtent_ = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {function(module:ol/Feature, module:ol/Feature): number|null}
     */
    _this.renderedRenderOrder_ = null;

    /**
     * @private
     * @type {module:ol/render/canvas/ReplayGroup}
     */
    _this.replayGroup_ = null;

    /**
     * A new replay group had to be created by `prepareFrame()`
     * @type {boolean}
     */
    _this.replayGroupChanged = true;

    /**
     * @type {CanvasRenderingContext2D}
     */
    _this.context = (0, _dom.createCanvasContext2D)();

    (0, _events.listen)(_canvas.labelCache, _EventType2.default.CLEAR, _this.handleFontsChanged_, _this);

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(CanvasVectorLayerRenderer, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      (0, _events.unlisten)(_canvas.labelCache, _EventType2.default.CLEAR, this.handleFontsChanged_, this);
      _Layer2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     */

  }, {
    key: 'compose',
    value: function compose(context, frameState, layerState) {
      var extent = frameState.extent;
      var pixelRatio = frameState.pixelRatio;
      var skippedFeatureUids = layerState.managed ? frameState.skippedFeatureUids : {};
      var viewState = frameState.viewState;
      var projection = viewState.projection;
      var rotation = viewState.rotation;
      var projectionExtent = projection.getExtent();
      var vectorSource = /** @type {module:ol/source/Vector} */this.getLayer().getSource();

      var transform = this.getTransform(frameState, 0);

      // clipped rendering if layer extent is set
      var clipExtent = layerState.extent;
      var clipped = clipExtent !== undefined;
      if (clipped) {
        this.clip(context, frameState, /** @type {module:ol/extent~Extent} */clipExtent);
      }
      var replayGroup = this.replayGroup_;
      if (replayGroup && !replayGroup.isEmpty()) {
        if (this.declutterTree_) {
          this.declutterTree_.clear();
        }
        var layer = /** @type {module:ol/layer/Vector} */this.getLayer();
        var drawOffsetX = 0;
        var drawOffsetY = 0;
        var replayContext = void 0;
        var transparentLayer = layerState.opacity !== 1;
        var hasRenderListeners = layer.hasListener(_EventType4.default.RENDER);
        if (transparentLayer || hasRenderListeners) {
          var drawWidth = context.canvas.width;
          var drawHeight = context.canvas.height;
          if (rotation) {
            var drawSize = Math.round(Math.sqrt(drawWidth * drawWidth + drawHeight * drawHeight));
            drawOffsetX = (drawSize - drawWidth) / 2;
            drawOffsetY = (drawSize - drawHeight) / 2;
            drawWidth = drawHeight = drawSize;
          }
          // resize and clear
          this.context.canvas.width = drawWidth;
          this.context.canvas.height = drawHeight;
          replayContext = this.context;
        } else {
          replayContext = context;
        }

        var alpha = replayContext.globalAlpha;
        if (!transparentLayer) {
          // for performance reasons, context.save / context.restore is not used
          // to save and restore the transformation matrix and the opacity.
          // see http://jsperf.com/context-save-restore-versus-variable
          replayContext.globalAlpha = layerState.opacity;
        }

        if (replayContext != context) {
          replayContext.translate(drawOffsetX, drawOffsetY);
        }

        var width = frameState.size[0] * pixelRatio;
        var height = frameState.size[1] * pixelRatio;
        (0, _canvas.rotateAtOffset)(replayContext, -rotation, width / 2, height / 2);
        replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids);
        if (vectorSource.getWrapX() && projection.canWrapX() && !(0, _extent.containsExtent)(projectionExtent, extent)) {
          var startX = extent[0];
          var worldWidth = (0, _extent.getWidth)(projectionExtent);
          var world = 0;
          var offsetX = void 0;
          while (startX < projectionExtent[0]) {
            --world;
            offsetX = worldWidth * world;
            transform = this.getTransform(frameState, offsetX);
            replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids);
            startX += worldWidth;
          }
          world = 0;
          startX = extent[2];
          while (startX > projectionExtent[2]) {
            ++world;
            offsetX = worldWidth * world;
            transform = this.getTransform(frameState, offsetX);
            replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids);
            startX -= worldWidth;
          }
        }
        (0, _canvas.rotateAtOffset)(replayContext, rotation, width / 2, height / 2);

        if (hasRenderListeners) {
          this.dispatchRenderEvent(replayContext, frameState, transform);
        }
        if (replayContext != context) {
          if (transparentLayer) {
            var mainContextAlpha = context.globalAlpha;
            context.globalAlpha = layerState.opacity;
            context.drawImage(replayContext.canvas, -drawOffsetX, -drawOffsetY);
            context.globalAlpha = mainContextAlpha;
          } else {
            context.drawImage(replayContext.canvas, -drawOffsetX, -drawOffsetY);
          }
          replayContext.translate(-drawOffsetX, -drawOffsetY);
        }

        if (!transparentLayer) {
          replayContext.globalAlpha = alpha;
        }
      }

      if (clipped) {
        context.restore();
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'composeFrame',
    value: function composeFrame(frameState, layerState, context) {
      var transform = this.getTransform(frameState, 0);
      this.preCompose(context, frameState, transform);
      this.compose(context, frameState, layerState);
      this.postCompose(context, frameState, layerState, transform);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      if (!this.replayGroup_) {
        return undefined;
      } else {
        var resolution = frameState.viewState.resolution;
        var rotation = frameState.viewState.rotation;
        var layer = /** @type {module:ol/layer/Vector} */this.getLayer();
        /** @type {!Object<string, boolean>} */
        var features = {};
        var result = this.replayGroup_.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, {},
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
        return result;
      }
    }

    /**
     * @param {module:ol/events/Event} event Event.
     */

  }, {
    key: 'handleFontsChanged_',
    value: function handleFontsChanged_(event) {
      var layer = this.getLayer();
      if (layer.getVisible() && this.replayGroup_) {
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
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState) {
      var vectorLayer = /** @type {module:ol/layer/Vector} */this.getLayer();
      var vectorSource = vectorLayer.getSource();

      var animating = frameState.viewHints[_ViewHint2.default.ANIMATING];
      var interacting = frameState.viewHints[_ViewHint2.default.INTERACTING];
      var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
      var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();

      if (!this.dirty_ && !updateWhileAnimating && animating || !updateWhileInteracting && interacting) {
        return true;
      }

      var frameStateExtent = frameState.extent;
      var viewState = frameState.viewState;
      var projection = viewState.projection;
      var resolution = viewState.resolution;
      var pixelRatio = frameState.pixelRatio;
      var vectorLayerRevision = vectorLayer.getRevision();
      var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
      var vectorLayerRenderOrder = vectorLayer.getRenderOrder();

      if (vectorLayerRenderOrder === undefined) {
        vectorLayerRenderOrder = _vector.defaultOrder;
      }

      var extent = (0, _extent.buffer)(frameStateExtent, vectorLayerRenderBuffer * resolution);
      var projectionExtent = viewState.projection.getExtent();

      if (vectorSource.getWrapX() && viewState.projection.canWrapX() && !(0, _extent.containsExtent)(projectionExtent, frameState.extent)) {
        // For the replay group, we need an extent that intersects the real world
        // (-180° to +180°). To support geometries in a coordinate range from -540°
        // to +540°, we add at least 1 world width on each side of the projection
        // extent. If the viewport is wider than the world, we need to add half of
        // the viewport width to make sure we cover the whole viewport.
        var worldWidth = (0, _extent.getWidth)(projectionExtent);
        var gutter = Math.max((0, _extent.getWidth)(extent) / 2, worldWidth);
        extent[0] = projectionExtent[0] - gutter;
        extent[2] = projectionExtent[2] + gutter;
      }

      if (!this.dirty_ && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && (0, _extent.containsExtent)(this.renderedExtent_, extent)) {
        this.replayGroupChanged = false;
        return true;
      }

      this.replayGroup_ = null;

      this.dirty_ = false;

      var replayGroup = new _ReplayGroup2.default((0, _vector.getTolerance)(resolution, pixelRatio), extent, resolution, pixelRatio, vectorSource.getOverlaps(), this.declutterTree_, vectorLayer.getRenderBuffer());
      vectorSource.loadFeatures(extent, resolution, projection);
      /**
       * @param {module:ol/Feature} feature Feature.
       * @this {module:ol/renderer/canvas/VectorLayer}
       */
      var render = function (feature) {
        var styles = void 0;
        var styleFunction = feature.getStyleFunction() || vectorLayer.getStyleFunction();
        if (styleFunction) {
          styles = styleFunction(feature, resolution);
        }
        if (styles) {
          var dirty = this.renderFeature(feature, resolution, pixelRatio, styles, replayGroup);
          this.dirty_ = this.dirty_ || dirty;
        }
      }.bind(this);
      if (vectorLayerRenderOrder) {
        /** @type {Array<module:ol/Feature>} */
        var features = [];
        vectorSource.forEachFeatureInExtent(extent,
        /**
         * @param {module:ol/Feature} feature Feature.
         */
        function (feature) {
          features.push(feature);
        }, this);
        features.sort(vectorLayerRenderOrder);
        for (var i = 0, ii = features.length; i < ii; ++i) {
          render(features[i]);
        }
      } else {
        vectorSource.forEachFeatureInExtent(extent, render, this);
      }
      replayGroup.finish();

      this.renderedResolution_ = resolution;
      this.renderedRevision_ = vectorLayerRevision;
      this.renderedRenderOrder_ = vectorLayerRenderOrder;
      this.renderedExtent_ = extent;
      this.replayGroup_ = replayGroup;

      this.replayGroupChanged = true;
      return true;
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/style/Style|Array<module:ol/style/Style>} styles The style or array of styles.
     * @param {module:ol/render/canvas/ReplayGroup} replayGroup Replay group.
     * @return {boolean} `true` if an image is loading.
     */

  }, {
    key: 'renderFeature',
    value: function renderFeature(feature, resolution, pixelRatio, styles, replayGroup) {
      if (!styles) {
        return false;
      }
      var loading = false;
      if (Array.isArray(styles)) {
        for (var i = 0, ii = styles.length; i < ii; ++i) {
          loading = (0, _vector.renderFeature)(replayGroup, feature, styles[i], (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
        }
      } else {
        loading = (0, _vector.renderFeature)(replayGroup, feature, styles, (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this);
      }
      return loading;
    }
  }]);

  return CanvasVectorLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


CanvasVectorLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.VECTOR;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/canvas/VectorLayer} The layer renderer.
 */
CanvasVectorLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasVectorLayerRenderer( /** @type {module:ol/layer/Vector} */layer);
};

exports.default = CanvasVectorLayerRenderer;