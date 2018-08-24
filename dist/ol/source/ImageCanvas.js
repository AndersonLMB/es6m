'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageCanvas = require('../ImageCanvas.js');

var _ImageCanvas2 = _interopRequireDefault(_ImageCanvas);

var _extent = require('../extent.js');

var _Image = require('../source/Image.js');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/ImageCanvas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * A function returning the canvas element (`{HTMLCanvasElement}`)
 * used by the source as an image. The arguments passed to the function are:
 * {@link module:ol/extent~Extent} the image extent, `{number}` the image resolution,
 * `{number}` the device pixel ratio, {@link module:ol/size~Size} the image size, and
 * {@link module:ol/proj/Projection} the image projection. The canvas returned by
 * this function is cached by the source. The this keyword inside the function
 * references the {@link module:ol/source/ImageCanvas}.
 *
 * @typedef {function(this:module:ol/ImageCanvas, module:ol/extent~Extent, number,
 *     number, module:ol/size~Size, module:ol/proj/Projection): HTMLCanvasElement} FunctionType
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {module:ol/source/ImageCanvas~FunctionType} [canvasFunction] Canvas function.
 * The function returning the canvas element used by the source
 * as an image. The arguments passed to the function are: `{module:ol/extent~Extent}` the
 * image extent, `{number}` the image resolution, `{number}` the device pixel
 * ratio, `{module:ol/size~Size}` the image size, and `{module:ol/proj/Projection~Projection}` the image
 * projection. The canvas returned by this function is cached by the source. If
 * the value returned by the function is later changed then
 * `changed` should be called on the source for the source to
 * invalidate the current cached image. See @link: {@link module:ol/Observable~Observable#changed}
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [ratio=1.5] Ratio. 1 means canvases are the size of the map viewport, 2 means twice the
 * width and height of the map viewport, and so on. Must be `1` or higher.
 * @property {Array<number>} [resolutions] Resolutions.
 * If specified, new canvases will be created for these resolutions
 * @property {module:ol/source/State} [state] Source state.
 */

/**
 * @classdesc
 * Base class for image sources where a canvas element is the image.
 * @api
 */
var ImageCanvasSource = function (_ImageSource) {
  _inherits(ImageCanvasSource, _ImageSource);

  /**
   * @param {module:ol/source/ImageCanvas~Options=} options ImageCanvas options.
   */
  function ImageCanvasSource(options) {
    _classCallCheck(this, ImageCanvasSource);

    /**
    * @private
    * @type {module:ol/source/ImageCanvas~FunctionType}
    */
    var _this = _possibleConstructorReturn(this, (ImageCanvasSource.__proto__ || Object.getPrototypeOf(ImageCanvasSource)).call(this, {
      attributions: options.attributions,
      projection: options.projection,
      resolutions: options.resolutions,
      state: options.state
    }));

    _this.canvasFunction_ = options.canvasFunction;

    /**
    * @private
    * @type {module:ol/ImageCanvas}
    */
    _this.canvas_ = null;

    /**
    * @private
    * @type {number}
    */
    _this.renderedRevision_ = 0;

    /**
    * @private
    * @type {number}
    */
    _this.ratio_ = options.ratio !== undefined ? options.ratio : 1.5;

    return _this;
  }

  /**
  * @inheritDoc
  */


  _createClass(ImageCanvasSource, [{
    key: 'getImageInternal',
    value: function getImageInternal(extent, resolution, pixelRatio, projection) {
      resolution = this.findNearestResolution(resolution);

      var canvas = this.canvas_;
      if (canvas && this.renderedRevision_ == this.getRevision() && canvas.getResolution() == resolution && canvas.getPixelRatio() == pixelRatio && (0, _extent.containsExtent)(canvas.getExtent(), extent)) {
        return canvas;
      }

      extent = extent.slice();
      (0, _extent.scaleFromCenter)(extent, this.ratio_);
      var width = (0, _extent.getWidth)(extent) / resolution;
      var height = (0, _extent.getHeight)(extent) / resolution;
      var size = [width * pixelRatio, height * pixelRatio];

      var canvasElement = this.canvasFunction_(extent, resolution, pixelRatio, size, projection);
      if (canvasElement) {
        canvas = new _ImageCanvas2.default(extent, resolution, pixelRatio, canvasElement);
      }
      this.canvas_ = canvas;
      this.renderedRevision_ = this.getRevision();

      return canvas;
    }
  }]);

  return ImageCanvasSource;
}(_Image2.default);

exports.default = ImageCanvasSource;