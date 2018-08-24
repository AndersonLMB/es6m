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

var _extent = require('../../extent.js');

var _ReplayGroup = require('../../render/webgl/ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

var _vector = require('../vector.js');

var _Layer = require('../webgl/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/webgl/VectorLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * WebGL renderer for vector layers.
 * @api
 */
var WebGLVectorLayerRenderer = function (_WebGLLayerRenderer) {
  _inherits(WebGLVectorLayerRenderer, _WebGLLayerRenderer);

  /**
   * @param {module:ol/renderer/webgl/Map} mapRenderer Map renderer.
   * @param {module:ol/layer/Vector} vectorLayer Vector layer.
   */
  function WebGLVectorLayerRenderer(mapRenderer, vectorLayer) {
    _classCallCheck(this, WebGLVectorLayerRenderer);

    /**
     * @private
     * @type {boolean}
     */
    var _this = _possibleConstructorReturn(this, (WebGLVectorLayerRenderer.__proto__ || Object.getPrototypeOf(WebGLVectorLayerRenderer)).call(this, mapRenderer, vectorLayer));

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
     * @type {module:ol/render/webgl/ReplayGroup}
     */
    _this.replayGroup_ = null;

    /**
     * The last layer state.
     * @private
     * @type {?module:ol/layer/Layer~State}
     */
    _this.layerState_ = null;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLVectorLayerRenderer, [{
    key: 'composeFrame',
    value: function composeFrame(frameState, layerState, context) {
      this.layerState_ = layerState;
      var viewState = frameState.viewState;
      var replayGroup = this.replayGroup_;
      var size = frameState.size;
      var pixelRatio = frameState.pixelRatio;
      var gl = this.mapRenderer.getGL();
      if (replayGroup && !replayGroup.isEmpty()) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
        replayGroup.replay(context, viewState.center, viewState.resolution, viewState.rotation, size, pixelRatio, layerState.opacity, layerState.managed ? frameState.skippedFeatureUids : {});
        gl.disable(gl.SCISSOR_TEST);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      var replayGroup = this.replayGroup_;
      if (replayGroup) {
        var context = this.mapRenderer.getContext();
        replayGroup.getDeleteResourcesFunction(context)();
        this.replayGroup_ = null;
      }
      _Layer2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      if (!this.replayGroup_ || !this.layerState_) {
        return undefined;
      } else {
        var context = this.mapRenderer.getContext();
        var viewState = frameState.viewState;
        var layer = this.getLayer();
        var layerState = this.layerState_;
        /** @type {!Object<string, boolean>} */
        var features = {};
        return this.replayGroup_.forEachFeatureAtCoordinate(coordinate, context, viewState.center, viewState.resolution, viewState.rotation, frameState.size, frameState.pixelRatio, layerState.opacity, {},
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
        });
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'hasFeatureAtCoordinate',
    value: function hasFeatureAtCoordinate(coordinate, frameState) {
      if (!this.replayGroup_ || !this.layerState_) {
        return false;
      } else {
        var context = this.mapRenderer.getContext();
        var viewState = frameState.viewState;
        var layerState = this.layerState_;
        return this.replayGroup_.hasFeatureAtCoordinate(coordinate, context, viewState.center, viewState.resolution, viewState.rotation, frameState.size, frameState.pixelRatio, layerState.opacity, frameState.skippedFeatureUids);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {
      var coordinate = (0, _transform.apply)(frameState.pixelToCoordinateTransform, pixel.slice());
      var hasFeature = this.hasFeatureAtCoordinate(coordinate, frameState);

      if (hasFeature) {
        return callback.call(thisArg, this.getLayer(), null);
      } else {
        return undefined;
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
    value: function prepareFrame(frameState, layerState, context) {
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

      if (!this.dirty_ && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && (0, _extent.containsExtent)(this.renderedExtent_, extent)) {
        return true;
      }

      if (this.replayGroup_) {
        frameState.postRenderFunctions.push(this.replayGroup_.getDeleteResourcesFunction(context));
      }

      this.dirty_ = false;

      var replayGroup = new _ReplayGroup2.default((0, _vector.getTolerance)(resolution, pixelRatio), extent, vectorLayer.getRenderBuffer());
      vectorSource.loadFeatures(extent, resolution, projection);
      /**
       * @param {module:ol/Feature} feature Feature.
       * @this {module:ol/renderer/webgl/VectorLayer}
       */
      var render = function render(feature) {
        var styles = void 0;
        var styleFunction = feature.getStyleFunction() || vectorLayer.getStyleFunction();
        if (styleFunction) {
          styles = styleFunction(feature, resolution);
        }
        if (styles) {
          var dirty = this.renderFeature(feature, resolution, pixelRatio, styles, replayGroup);
          this.dirty_ = this.dirty_ || dirty;
        }
      };
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
        features.forEach(render.bind(this));
      } else {
        vectorSource.forEachFeatureInExtent(extent, render, this);
      }
      replayGroup.finish(context);

      this.renderedResolution_ = resolution;
      this.renderedRevision_ = vectorLayerRevision;
      this.renderedRenderOrder_ = vectorLayerRenderOrder;
      this.renderedExtent_ = extent;
      this.replayGroup_ = replayGroup;

      return true;
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/style/Style|Array<module:ol/style/Style>} styles The style or array of
     *     styles.
     * @param {module:ol/render/webgl/ReplayGroup} replayGroup Replay group.
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
        for (var i = styles.length - 1, ii = 0; i >= ii; --i) {
          loading = (0, _vector.renderFeature)(replayGroup, feature, styles[i], (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
        }
      } else {
        loading = (0, _vector.renderFeature)(replayGroup, feature, styles, (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
      }
      return loading;
    }
  }]);

  return WebGLVectorLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


WebGLVectorLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.VECTOR;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/webgl/VectorLayer} The layer renderer.
 */
WebGLVectorLayerRenderer['create'] = function (mapRenderer, layer) {
  return new WebGLVectorLayerRenderer(
  /** @type {module:ol/renderer/webgl/Map} */mapRenderer,
  /** @type {module:ol/layer/Vector} */layer);
};

exports.default = WebGLVectorLayerRenderer;