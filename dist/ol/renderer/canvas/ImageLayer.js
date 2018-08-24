'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../../reproj/common.js');

var _ImageCanvas = require('../../ImageCanvas.js');

var _ImageCanvas2 = _interopRequireDefault(_ImageCanvas);

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _array = require('../../array.js');

var _extent = require('../../extent.js');

var _VectorRenderType = require('../../layer/VectorRenderType.js');

var _VectorRenderType2 = _interopRequireDefault(_VectorRenderType);

var _obj = require('../../obj.js');

var _Map = require('./Map.js');

var _IntermediateCanvas = require('./IntermediateCanvas.js');

var _IntermediateCanvas2 = _interopRequireDefault(_IntermediateCanvas);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/ImageLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Canvas renderer for image layers.
 * @api
 */
var CanvasImageLayerRenderer = function (_IntermediateCanvasRe) {
  _inherits(CanvasImageLayerRenderer, _IntermediateCanvasRe);

  /**
   * @param {module:ol/layer/Image|module:ol/layer/Vector} imageLayer Image or vector layer.
   */
  function CanvasImageLayerRenderer(imageLayer) {
    _classCallCheck(this, CanvasImageLayerRenderer);

    /**
     * @private
     * @type {?module:ol/ImageBase}
     */
    var _this = _possibleConstructorReturn(this, (CanvasImageLayerRenderer.__proto__ || Object.getPrototypeOf(CanvasImageLayerRenderer)).call(this, imageLayer));

    _this.image_ = null;

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.imageTransform_ = (0, _transform.create)();

    /**
     * @type {!Array<string>}
     */
    _this.skippedFeatures_ = [];

    /**
     * @private
     * @type {module:ol/renderer/canvas/VectorLayer}
     */
    _this.vectorRenderer_ = null;

    if (imageLayer.getType() === _LayerType2.default.VECTOR) {
      for (var i = 0, ii = _Map.layerRendererConstructors.length; i < ii; ++i) {
        var ctor = _Map.layerRendererConstructors[i];
        if (ctor !== CanvasImageLayerRenderer && ctor['handles'](imageLayer)) {
          _this.vectorRenderer_ = new ctor(imageLayer);
          break;
        }
      }
    }

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(CanvasImageLayerRenderer, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      if (this.vectorRenderer_) {
        this.vectorRenderer_.dispose();
      }
      _IntermediateCanvas2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      return !this.image_ ? null : this.image_.getImage();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageTransform',
    value: function getImageTransform() {
      return this.imageTransform_;
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
      var viewCenter = viewState.center;
      var viewResolution = viewState.resolution;

      var image = void 0;
      var imageLayer = /** @type {module:ol/layer/Image} */this.getLayer();
      var imageSource = imageLayer.getSource();

      var hints = frameState.viewHints;

      var vectorRenderer = this.vectorRenderer_;
      var renderedExtent = frameState.extent;
      if (!vectorRenderer && layerState.extent !== undefined) {
        renderedExtent = (0, _extent.getIntersection)(renderedExtent, layerState.extent);
      }

      if (!hints[_ViewHint2.default.ANIMATING] && !hints[_ViewHint2.default.INTERACTING] && !(0, _extent.isEmpty)(renderedExtent)) {
        var projection = viewState.projection;
        if (!_common.ENABLE_RASTER_REPROJECTION) {
          var sourceProjection = imageSource.getProjection();
          if (sourceProjection) {
            projection = sourceProjection;
          }
        }
        var skippedFeatures = this.skippedFeatures_;
        if (vectorRenderer) {
          var context = vectorRenderer.context;
          var imageFrameState = /** @type {module:ol/PluggableMap~FrameState} */(0, _obj.assign)({}, frameState, {
            size: [(0, _extent.getWidth)(renderedExtent) / viewResolution, (0, _extent.getHeight)(renderedExtent) / viewResolution],
            viewState: /** @type {module:ol/View~State} */(0, _obj.assign)({}, frameState.viewState, {
              rotation: 0
            })
          });
          var newSkippedFeatures = Object.keys(imageFrameState.skippedFeatureUids).sort();
          image = new _ImageCanvas2.default(renderedExtent, viewResolution, pixelRatio, context.canvas, function (callback) {
            if (vectorRenderer.prepareFrame(imageFrameState, layerState) && (vectorRenderer.replayGroupChanged || !(0, _array.equals)(skippedFeatures, newSkippedFeatures))) {
              context.canvas.width = imageFrameState.size[0] * pixelRatio;
              context.canvas.height = imageFrameState.size[1] * pixelRatio;
              vectorRenderer.compose(context, imageFrameState, layerState);
              skippedFeatures = newSkippedFeatures;
              callback();
            }
          });
        } else {
          image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
        }
        if (image && this.loadImage(image)) {
          this.image_ = image;
          this.skippedFeatures_ = skippedFeatures;
        }
      }

      if (this.image_) {
        image = this.image_;
        var imageExtent = image.getExtent();
        var imageResolution = image.getResolution();
        var imagePixelRatio = image.getPixelRatio();
        var scale = pixelRatio * imageResolution / (viewResolution * imagePixelRatio);
        var transform = (0, _transform.compose)(this.imageTransform_, pixelRatio * size[0] / 2, pixelRatio * size[1] / 2, scale, scale, 0, imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolution, imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolution);
        (0, _transform.compose)(this.coordinateToCanvasPixelTransform, pixelRatio * size[0] / 2 - transform[4], pixelRatio * size[1] / 2 - transform[5], pixelRatio / viewResolution, -pixelRatio / viewResolution, 0, -viewCenter[0], -viewCenter[1]);

        this.renderedResolution = imageResolution * pixelRatio / imagePixelRatio;
      }

      return !!this.image_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      if (this.vectorRenderer_) {
        return this.vectorRenderer_.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg);
      } else {
        return _IntermediateCanvas2.default.prototype.forEachFeatureAtCoordinate.call(this, coordinate, frameState, hitTolerance, callback, thisArg);
      }
    }
  }]);

  return CanvasImageLayerRenderer;
}(_IntermediateCanvas2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


CanvasImageLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.IMAGE || layer.getType() === _LayerType2.default.VECTOR &&
  /** @type {module:ol/layer/Vector} */layer.getRenderMode() === _VectorRenderType2.default.IMAGE;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/canvas/ImageLayer} The layer renderer.
 */
CanvasImageLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasImageLayerRenderer( /** @type {module:ol/layer/Image} */layer);
};

exports.default = CanvasImageLayerRenderer;