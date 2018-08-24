'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageBase2 = require('./ImageBase.js');

var _ImageBase3 = _interopRequireDefault(_ImageBase2);

var _ImageState = require('./ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('./extent.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * A function that takes an {@link module:ol/Image~Image} for the image and a
 * `{string}` for the src as arguments. It is supposed to make it so the
 * underlying image {@link module:ol/Image~Image#getImage} is assigned the
 * content specified by the src. If not specified, the default is
 *
 *     function(image, src) {
 *       image.getImage().src = src;
 *     }
 *
 * Providing a custom `imageLoadFunction` can be useful to load images with
 * post requests or - in general - through XHR requests, where the src of the
 * image element would be set to a data URI when the content is loaded.
 *
 * @typedef {function(module:ol/Image, string)} LoadFunction
 * @api
 */

var ImageWrapper = function (_ImageBase) {
  _inherits(ImageWrapper, _ImageBase);

  /**
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number|undefined} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {module:ol/Image~LoadFunction} imageLoadFunction Image load function.
   */
  function ImageWrapper(extent, resolution, pixelRatio, src, crossOrigin, imageLoadFunction) {
    _classCallCheck(this, ImageWrapper);

    /**
     * @private
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (ImageWrapper.__proto__ || Object.getPrototypeOf(ImageWrapper)).call(this, extent, resolution, pixelRatio, _ImageState2.default.IDLE));

    _this.src_ = src;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    _this.image_ = new Image();
    if (crossOrigin !== null) {
      _this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.imageListenerKeys_ = null;

    /**
     * @protected
     * @type {module:ol/ImageState}
     */
    _this.state = _ImageState2.default.IDLE;

    /**
     * @private
     * @type {module:ol/Image~LoadFunction}
     */
    _this.imageLoadFunction_ = imageLoadFunction;

    return _this;
  }

  /**
   * @inheritDoc
   * @api
   */


  _createClass(ImageWrapper, [{
    key: 'getImage',
    value: function getImage() {
      return this.image_;
    }

    /**
     * Tracks loading or read errors.
     *
     * @private
     */

  }, {
    key: 'handleImageError_',
    value: function handleImageError_() {
      this.state = _ImageState2.default.ERROR;
      this.unlistenImage_();
      this.changed();
    }

    /**
     * Tracks successful image load.
     *
     * @private
     */

  }, {
    key: 'handleImageLoad_',
    value: function handleImageLoad_() {
      if (this.resolution === undefined) {
        this.resolution = (0, _extent.getHeight)(this.extent) / this.image_.height;
      }
      this.state = _ImageState2.default.LOADED;
      this.unlistenImage_();
      this.changed();
    }

    /**
     * Load the image or retry if loading previously failed.
     * Loading is taken care of by the tile queue, and calling this method is
     * only needed for preloading or for reloading in case of an error.
     * @override
     * @api
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.state == _ImageState2.default.IDLE || this.state == _ImageState2.default.ERROR) {
        this.state = _ImageState2.default.LOADING;
        this.changed();
        this.imageListenerKeys_ = [(0, _events.listenOnce)(this.image_, _EventType2.default.ERROR, this.handleImageError_, this), (0, _events.listenOnce)(this.image_, _EventType2.default.LOAD, this.handleImageLoad_, this)];
        this.imageLoadFunction_(this, this.src_);
      }
    }

    /**
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
     */

  }, {
    key: 'setImage',
    value: function setImage(image) {
      this.image_ = image;
    }

    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */

  }, {
    key: 'unlistenImage_',
    value: function unlistenImage_() {
      this.imageListenerKeys_.forEach(_events.unlistenByKey);
      this.imageListenerKeys_ = null;
    }
  }]);

  return ImageWrapper;
}(_ImageBase3.default);

exports.default = ImageWrapper;