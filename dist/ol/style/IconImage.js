'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.get = get;

var _dom = require('../dom.js');

var _events = require('../events.js');

var _Target = require('../events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _IconImageCache = require('../style/IconImageCache.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/style/IconImage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var IconImage = function (_EventTarget) {
  _inherits(IconImage, _EventTarget);

  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image Image.
   * @param {string|undefined} src Src.
   * @param {module:ol/size~Size} size Size.
   * @param {?string} crossOrigin Cross origin.
   * @param {module:ol/ImageState} imageState Image state.
   * @param {module:ol/color~Color} color Color.
   */
  function IconImage(image, src, size, crossOrigin, imageState, color) {
    _classCallCheck(this, IconImage);

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    var _this = _possibleConstructorReturn(this, (IconImage.__proto__ || Object.getPrototypeOf(IconImage)).call(this));

    _this.hitDetectionImage_ = null;

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    _this.image_ = !image ? new Image() : image;

    if (crossOrigin !== null) {
      _this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = color ?
    /** @type {HTMLCanvasElement} */document.createElement('CANVAS') : null;

    /**
     * @private
     * @type {module:ol/color~Color}
     */
    _this.color_ = color;

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.imageListenerKeys_ = null;

    /**
     * @private
     * @type {module:ol/ImageState}
     */
    _this.imageState_ = imageState;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.size_ = size;

    /**
     * @private
     * @type {string|undefined}
     */
    _this.src_ = src;

    /**
     * @private
     * @type {boolean}
     */
    _this.tainting_ = false;
    if (_this.imageState_ == _ImageState2.default.LOADED) {
      _this.determineTainting_();
    }

    return _this;
  }

  /**
   * @private
   */


  _createClass(IconImage, [{
    key: 'determineTainting_',
    value: function determineTainting_() {
      var context = (0, _dom.createCanvasContext2D)(1, 1);
      try {
        context.drawImage(this.image_, 0, 0);
        context.getImageData(0, 0, 1, 1);
      } catch (e) {
        this.tainting_ = true;
      }
    }

    /**
     * @private
     */

  }, {
    key: 'dispatchChangeEvent_',
    value: function dispatchChangeEvent_() {
      this.dispatchEvent(_EventType2.default.CHANGE);
    }

    /**
     * @private
     */

  }, {
    key: 'handleImageError_',
    value: function handleImageError_() {
      this.imageState_ = _ImageState2.default.ERROR;
      this.unlistenImage_();
      this.dispatchChangeEvent_();
    }

    /**
     * @private
     */

  }, {
    key: 'handleImageLoad_',
    value: function handleImageLoad_() {
      this.imageState_ = _ImageState2.default.LOADED;
      if (this.size_) {
        this.image_.width = this.size_[0];
        this.image_.height = this.size_[1];
      }
      this.size_ = [this.image_.width, this.image_.height];
      this.unlistenImage_();
      this.determineTainting_();
      this.replaceColor_();
      this.dispatchChangeEvent_();
    }

    /**
     * @param {number} pixelRatio Pixel ratio.
     * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
     */

  }, {
    key: 'getImage',
    value: function getImage(pixelRatio) {
      return this.canvas_ ? this.canvas_ : this.image_;
    }

    /**
     * @return {module:ol/ImageState} Image state.
     */

  }, {
    key: 'getImageState',
    value: function getImageState() {
      return this.imageState_;
    }

    /**
     * @param {number} pixelRatio Pixel ratio.
     * @return {HTMLImageElement|HTMLCanvasElement} Image element.
     */

  }, {
    key: 'getHitDetectionImage',
    value: function getHitDetectionImage(pixelRatio) {
      if (!this.hitDetectionImage_) {
        if (this.tainting_) {
          var width = this.size_[0];
          var height = this.size_[1];
          var context = (0, _dom.createCanvasContext2D)(width, height);
          context.fillRect(0, 0, width, height);
          this.hitDetectionImage_ = context.canvas;
        } else {
          this.hitDetectionImage_ = this.image_;
        }
      }
      return this.hitDetectionImage_;
    }

    /**
     * @return {module:ol/size~Size} Image size.
     */

  }, {
    key: 'getSize',
    value: function getSize() {
      return this.size_;
    }

    /**
     * @return {string|undefined} Image src.
     */

  }, {
    key: 'getSrc',
    value: function getSrc() {
      return this.src_;
    }

    /**
     * Load not yet loaded URI.
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.imageState_ == _ImageState2.default.IDLE) {
        this.imageState_ = _ImageState2.default.LOADING;
        this.imageListenerKeys_ = [(0, _events.listenOnce)(this.image_, _EventType2.default.ERROR, this.handleImageError_, this), (0, _events.listenOnce)(this.image_, _EventType2.default.LOAD, this.handleImageLoad_, this)];
        try {
          this.image_.src = this.src_;
        } catch (e) {
          this.handleImageError_();
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'replaceColor_',
    value: function replaceColor_() {
      if (this.tainting_ || this.color_ === null) {
        return;
      }

      this.canvas_.width = this.image_.width;
      this.canvas_.height = this.image_.height;

      var ctx = this.canvas_.getContext('2d');
      ctx.drawImage(this.image_, 0, 0);

      var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
      var data = imgData.data;
      var r = this.color_[0] / 255.0;
      var g = this.color_[1] / 255.0;
      var b = this.color_[2] / 255.0;

      for (var i = 0, ii = data.length; i < ii; i += 4) {
        data[i] *= r;
        data[i + 1] *= g;
        data[i + 2] *= b;
      }
      ctx.putImageData(imgData, 0, 0);
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

  return IconImage;
}(_Target2.default);

/**
 * @param {HTMLImageElement|HTMLCanvasElement} image Image.
 * @param {string} src Src.
 * @param {module:ol/size~Size} size Size.
 * @param {?string} crossOrigin Cross origin.
 * @param {module:ol/ImageState} imageState Image state.
 * @param {module:ol/color~Color} color Color.
 * @return {module:ol/style/IconImage} Icon image.
 */


function get(image, src, size, crossOrigin, imageState, color) {
  var iconImage = _IconImageCache.shared.get(src, crossOrigin, color);
  if (!iconImage) {
    iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
    _IconImageCache.shared.set(src, crossOrigin, color, iconImage);
  }
  return iconImage;
}

exports.default = IconImage;