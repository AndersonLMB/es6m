'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Image = require('../Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _dom = require('../dom.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _proj = require('../proj.js');

var _Image3 = require('../source/Image.js');

var _Image4 = _interopRequireDefault(_Image3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/ImageStatic
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {module:ol/extent~Extent} [imageExtent] Extent of the image in map coordinates.
 * This is the [left, bottom, right, top] map coordinates of your image.
 * @property {module:ol/Image~LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {module:ol/size~Size} [imageSize] Size of the image in pixels. Usually the image size is auto-detected, so this
 * only needs to be set if auto-detection fails for some reason.
 * @property {string} url Image URL.
 */

/**
 * @classdesc
 * A layer source for displaying a single, static image.
 * @api
 */
var Static = function (_ImageSource) {
  _inherits(Static, _ImageSource);

  /**
   * @param {module:ol/source/ImageStatic~Options=} options ImageStatic options.
   */
  function Static(options) {
    _classCallCheck(this, Static);

    var crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : null;

    var /** @type {module:ol/Image~LoadFunction} */imageLoadFunction = options.imageLoadFunction !== undefined ? options.imageLoadFunction : _Image3.defaultImageLoadFunction;

    /**
     * @private
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (Static.__proto__ || Object.getPrototypeOf(Static)).call(this, {
      attributions: options.attributions,
      projection: (0, _proj.get)(options.projection)
    }));

    _this.url_ = options.url;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.imageExtent_ = options.imageExtent;

    /**
     * @private
     * @type {module:ol/Image}
     */
    _this.image_ = new _Image2.default(_this.imageExtent_, undefined, 1, _this.url_, crossOrigin, imageLoadFunction);

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.imageSize_ = options.imageSize ? options.imageSize : null;

    (0, _events.listen)(_this.image_, _EventType2.default.CHANGE, _this.handleImageChange, _this);

    return _this;
  }

  /**
   * Returns the image extent
   * @return {module:ol/extent~Extent} image extent.
   * @api
   */


  _createClass(Static, [{
    key: 'getImageExtent',
    value: function getImageExtent() {
      return this.imageExtent_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageInternal',
    value: function getImageInternal(extent, resolution, pixelRatio, projection) {
      if ((0, _extent.intersects)(extent, this.image_.getExtent())) {
        return this.image_;
      }
      return null;
    }

    /**
     * Return the URL used for this image source.
     * @return {string} URL.
     * @api
     */

  }, {
    key: 'getUrl',
    value: function getUrl() {
      return this.url_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'handleImageChange',
    value: function handleImageChange(evt) {
      if (this.image_.getState() == _ImageState2.default.LOADED) {
        var imageExtent = this.image_.getExtent();
        var image = this.image_.getImage();
        var imageWidth = void 0,
            imageHeight = void 0;
        if (this.imageSize_) {
          imageWidth = this.imageSize_[0];
          imageHeight = this.imageSize_[1];
        } else {
          imageWidth = image.width;
          imageHeight = image.height;
        }
        var resolution = (0, _extent.getHeight)(imageExtent) / imageHeight;
        var targetWidth = Math.ceil((0, _extent.getWidth)(imageExtent) / resolution);
        if (targetWidth != imageWidth) {
          var context = (0, _dom.createCanvasContext2D)(targetWidth, imageHeight);
          var canvas = context.canvas;
          context.drawImage(image, 0, 0, imageWidth, imageHeight, 0, 0, canvas.width, canvas.height);
          this.image_.setImage(canvas);
        }
      }
      _Image4.default.prototype.handleImageChange.call(this, evt);
    }
  }]);

  return Static;
}(_Image4.default);

exports.default = Static;