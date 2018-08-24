'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('../../reproj/common.js');

var _functions = require('../../functions.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _Layer = require('../webgl/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

var _webgl = require('../../webgl.js');

var _Context = require('../../webgl/Context.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/webgl/ImageLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * WebGL renderer for image layers.
 * @api
 */
var WebGLImageLayerRenderer = function (_WebGLLayerRenderer) {
  _inherits(WebGLImageLayerRenderer, _WebGLLayerRenderer);

  /**
   * @param {module:ol/renderer/webgl/Map} mapRenderer Map renderer.
   * @param {module:ol/layer/Image} imageLayer Tile layer.
   */
  function WebGLImageLayerRenderer(mapRenderer, imageLayer) {
    _classCallCheck(this, WebGLImageLayerRenderer);

    /**
     * The last rendered image.
     * @private
     * @type {?module:ol/ImageBase}
     */
    var _this = _possibleConstructorReturn(this, (WebGLImageLayerRenderer.__proto__ || Object.getPrototypeOf(WebGLImageLayerRenderer)).call(this, mapRenderer, imageLayer));

    _this.image_ = null;

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    _this.hitCanvasContext_ = null;

    /**
     * @private
     * @type {?module:ol/transform~Transform}
     */
    _this.hitTransformationMatrix_ = null;

    return _this;
  }

  /**
   * @param {module:ol/ImageBase} image Image.
   * @private
   * @return {WebGLTexture} Texture.
   */


  _createClass(WebGLImageLayerRenderer, [{
    key: 'createTexture_',
    value: function createTexture_(image) {

      // We meet the conditions to work with non-power of two textures.
      // http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
      // http://learningwebgl.com/blog/?p=2101

      var imageElement = image.getImage();
      var gl = this.mapRenderer.getGL();

      return (0, _Context.createTexture)(gl, imageElement, _webgl.CLAMP_TO_EDGE, _webgl.CLAMP_TO_EDGE);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      var layer = this.getLayer();
      var source = layer.getSource();
      var resolution = frameState.viewState.resolution;
      var rotation = frameState.viewState.rotation;
      var skippedFeatureUids = frameState.skippedFeatureUids;
      return source.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, skippedFeatureUids,

      /**
       * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
       * @return {?} Callback result.
       */
      function (feature) {
        return callback.call(thisArg, feature, layer);
      });
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState, context) {

      var gl = this.mapRenderer.getGL();

      var pixelRatio = frameState.pixelRatio;
      var viewState = frameState.viewState;
      var viewCenter = viewState.center;
      var viewResolution = viewState.resolution;
      var viewRotation = viewState.rotation;

      var image = this.image_;
      var texture = this.texture;
      var imageLayer = /** @type {module:ol/layer/Image} */this.getLayer();
      var imageSource = imageLayer.getSource();

      var hints = frameState.viewHints;

      var renderedExtent = frameState.extent;
      if (layerState.extent !== undefined) {
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
        var image_ = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
        if (image_) {
          var loaded = this.loadImage(image_);
          if (loaded) {
            image = image_;
            texture = this.createTexture_(image_);
            if (this.texture) {
              /**
               * @param {WebGLRenderingContext} gl GL.
               * @param {WebGLTexture} texture Texture.
               */
              var postRenderFunction = function (gl, texture) {
                if (!gl.isContextLost()) {
                  gl.deleteTexture(texture);
                }
              }.bind(null, gl, this.texture);
              frameState.postRenderFunctions.push(
              /** @type {module:ol/PluggableMap~PostRenderFunction} */postRenderFunction);
            }
          }
        }
      }

      if (image) {
        var canvas = this.mapRenderer.getContext().getCanvas();

        this.updateProjectionMatrix_(canvas.width, canvas.height, pixelRatio, viewCenter, viewResolution, viewRotation, image.getExtent());
        this.hitTransformationMatrix_ = null;

        // Translate and scale to flip the Y coord.
        var texCoordMatrix = this.texCoordMatrix;
        (0, _transform.reset)(texCoordMatrix);
        (0, _transform.scale)(texCoordMatrix, 1, -1);
        (0, _transform.translate)(texCoordMatrix, 0, -1);

        this.image_ = image;
        this.texture = texture;
      }

      return !!image;
    }

    /**
     * @param {number} canvasWidth Canvas width.
     * @param {number} canvasHeight Canvas height.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/coordinate~Coordinate} viewCenter View center.
     * @param {number} viewResolution View resolution.
     * @param {number} viewRotation View rotation.
     * @param {module:ol/extent~Extent} imageExtent Image extent.
     * @private
     */

  }, {
    key: 'updateProjectionMatrix_',
    value: function updateProjectionMatrix_(canvasWidth, canvasHeight, pixelRatio, viewCenter, viewResolution, viewRotation, imageExtent) {

      var canvasExtentWidth = canvasWidth * viewResolution;
      var canvasExtentHeight = canvasHeight * viewResolution;

      var projectionMatrix = this.projectionMatrix;
      (0, _transform.reset)(projectionMatrix);
      (0, _transform.scale)(projectionMatrix, pixelRatio * 2 / canvasExtentWidth, pixelRatio * 2 / canvasExtentHeight);
      (0, _transform.rotate)(projectionMatrix, -viewRotation);
      (0, _transform.translate)(projectionMatrix, imageExtent[0] - viewCenter[0], imageExtent[1] - viewCenter[1]);
      (0, _transform.scale)(projectionMatrix, (imageExtent[2] - imageExtent[0]) / 2, (imageExtent[3] - imageExtent[1]) / 2);
      (0, _transform.translate)(projectionMatrix, 1, 1);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'hasFeatureAtCoordinate',
    value: function hasFeatureAtCoordinate(coordinate, frameState) {
      var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, 0, _functions.TRUE, this);
      return hasFeature !== undefined;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {
      if (!this.image_ || !this.image_.getImage()) {
        return undefined;
      }

      if (this.getLayer().getSource().forEachFeatureAtCoordinate !== _functions.VOID) {
        // for ImageCanvas sources use the original hit-detection logic,
        // so that for example also transparent polygons are detected
        var coordinate = (0, _transform.apply)(frameState.pixelToCoordinateTransform, pixel.slice());
        var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, 0, _functions.TRUE, this);

        if (hasFeature) {
          return callback.call(thisArg, this.getLayer(), null);
        } else {
          return undefined;
        }
      } else {
        var imageSize = [this.image_.getImage().width, this.image_.getImage().height];

        if (!this.hitTransformationMatrix_) {
          this.hitTransformationMatrix_ = this.getHitTransformationMatrix_(frameState.size, imageSize);
        }

        var pixelOnFrameBuffer = (0, _transform.apply)(this.hitTransformationMatrix_, pixel.slice());

        if (pixelOnFrameBuffer[0] < 0 || pixelOnFrameBuffer[0] > imageSize[0] || pixelOnFrameBuffer[1] < 0 || pixelOnFrameBuffer[1] > imageSize[1]) {
          // outside the image, no need to check
          return undefined;
        }

        if (!this.hitCanvasContext_) {
          this.hitCanvasContext_ = (0, _dom.createCanvasContext2D)(1, 1);
        }

        this.hitCanvasContext_.clearRect(0, 0, 1, 1);
        this.hitCanvasContext_.drawImage(this.image_.getImage(), pixelOnFrameBuffer[0], pixelOnFrameBuffer[1], 1, 1, 0, 0, 1, 1);

        var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
        if (imageData[3] > 0) {
          return callback.call(thisArg, this.getLayer(), imageData);
        } else {
          return undefined;
        }
      }
    }

    /**
     * The transformation matrix to get the pixel on the image for a
     * pixel on the map.
     * @param {module:ol/size~Size} mapSize The map size.
     * @param {module:ol/size~Size} imageSize The image size.
     * @return {module:ol/transform~Transform} The transformation matrix.
     * @private
     */

  }, {
    key: 'getHitTransformationMatrix_',
    value: function getHitTransformationMatrix_(mapSize, imageSize) {
      // the first matrix takes a map pixel, flips the y-axis and scales to
      // a range between -1 ... 1
      var mapCoordTransform = (0, _transform.create)();
      (0, _transform.translate)(mapCoordTransform, -1, -1);
      (0, _transform.scale)(mapCoordTransform, 2 / mapSize[0], 2 / mapSize[1]);
      (0, _transform.translate)(mapCoordTransform, 0, mapSize[1]);
      (0, _transform.scale)(mapCoordTransform, 1, -1);

      // the second matrix is the inverse of the projection matrix used in the
      // shader for drawing
      var projectionMatrixInv = (0, _transform.invert)(this.projectionMatrix.slice());

      // the third matrix scales to the image dimensions and flips the y-axis again
      var transform = (0, _transform.create)();
      (0, _transform.translate)(transform, 0, imageSize[1]);
      (0, _transform.scale)(transform, 1, -1);
      (0, _transform.scale)(transform, imageSize[0] / 2, imageSize[1] / 2);
      (0, _transform.translate)(transform, 1, 1);

      (0, _transform.multiply)(transform, projectionMatrixInv);
      (0, _transform.multiply)(transform, mapCoordTransform);

      return transform;
    }
  }]);

  return WebGLImageLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


WebGLImageLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.IMAGE;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/webgl/ImageLayer} The layer renderer.
 */
WebGLImageLayerRenderer['create'] = function (mapRenderer, layer) {
  return new WebGLImageLayerRenderer(
  /** @type {module:ol/renderer/webgl/Map} */mapRenderer,
  /** @type {module:ol/layer/Image} */layer);
};

exports.default = WebGLImageLayerRenderer;