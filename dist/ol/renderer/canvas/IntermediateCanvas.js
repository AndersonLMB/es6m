'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _coordinate = require('../../coordinate.js');

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _functions = require('../../functions.js');

var _Layer = require('../canvas/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/IntermediateCanvas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var IntermediateCanvasRenderer = function (_CanvasLayerRenderer) {
  _inherits(IntermediateCanvasRenderer, _CanvasLayerRenderer);

  /**
   * @param {module:ol/layer/Layer} layer Layer.
   */
  function IntermediateCanvasRenderer(layer) {
    _classCallCheck(this, IntermediateCanvasRenderer);

    /**
     * @protected
     * @type {module:ol/transform~Transform}
     */
    var _this = _possibleConstructorReturn(this, (IntermediateCanvasRenderer.__proto__ || Object.getPrototypeOf(IntermediateCanvasRenderer)).call(this, layer));

    _this.coordinateToCanvasPixelTransform = (0, _transform.create)();

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    _this.hitCanvasContext_ = null;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(IntermediateCanvasRenderer, [{
    key: 'composeFrame',
    value: function composeFrame(frameState, layerState, context) {

      this.preCompose(context, frameState);

      var image = this.getImage();
      if (image) {

        // clipped rendering if layer extent is set
        var extent = layerState.extent;
        var clipped = extent !== undefined && !(0, _extent.containsExtent)(extent, frameState.extent) && (0, _extent.intersects)(extent, frameState.extent);
        if (clipped) {
          this.clip(context, frameState, /** @type {module:ol/extent~Extent} */extent);
        }

        var imageTransform = this.getImageTransform();
        // for performance reasons, context.save / context.restore is not used
        // to save and restore the transformation matrix and the opacity.
        // see http://jsperf.com/context-save-restore-versus-variable
        var alpha = context.globalAlpha;
        context.globalAlpha = layerState.opacity;

        // for performance reasons, context.setTransform is only used
        // when the view is rotated. see http://jsperf.com/canvas-transform
        var dx = imageTransform[4];
        var dy = imageTransform[5];
        var dw = image.width * imageTransform[0];
        var dh = image.height * imageTransform[3];
        context.drawImage(image, 0, 0, +image.width, +image.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
        context.globalAlpha = alpha;

        if (clipped) {
          context.restore();
        }
      }

      this.postCompose(context, frameState, layerState);
    }

    /**
     * @abstract
     * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Canvas.
     */

  }, {
    key: 'getImage',
    value: function getImage() {}

    /**
     * @abstract
     * @return {!module:ol/transform~Transform} Image transform.
     */

  }, {
    key: 'getImageTransform',
    value: function getImageTransform() {}

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
    key: 'forEachLayerAtCoordinate',
    value: function forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      if (!this.getImage()) {
        return undefined;
      }

      if (this.getLayer().getSource().forEachFeatureAtCoordinate !== _functions.VOID) {
        // for ImageCanvas sources use the original hit-detection logic,
        // so that for example also transparent polygons are detected
        return _Layer2.default.prototype.forEachLayerAtCoordinate.apply(this, arguments);
      } else {
        var pixel = (0, _transform.apply)(this.coordinateToCanvasPixelTransform, coordinate.slice());
        (0, _coordinate.scale)(pixel, frameState.viewState.resolution / this.renderedResolution);

        if (!this.hitCanvasContext_) {
          this.hitCanvasContext_ = (0, _dom.createCanvasContext2D)(1, 1);
        }

        this.hitCanvasContext_.clearRect(0, 0, 1, 1);
        this.hitCanvasContext_.drawImage(this.getImage(), pixel[0], pixel[1], 1, 1, 0, 0, 1, 1);

        var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
        if (imageData[3] > 0) {
          return callback.call(thisArg, this.getLayer(), imageData);
        } else {
          return undefined;
        }
      }
    }
  }]);

  return IntermediateCanvasRenderer;
}(_Layer2.default);

exports.default = IntermediateCanvasRenderer;