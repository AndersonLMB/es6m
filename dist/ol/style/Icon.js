'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _asserts = require('../asserts.js');

var _color = require('../color.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _IconAnchorUnits = require('../style/IconAnchorUnits.js');

var _IconAnchorUnits2 = _interopRequireDefault(_IconAnchorUnits);

var _IconImage = require('../style/IconImage.js');

var _IconOrigin = require('../style/IconOrigin.js');

var _IconOrigin2 = _interopRequireDefault(_IconOrigin);

var _Image = require('../style/Image.js');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/style/Icon
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {Array<number>} [anchor=[0.5, 0.5]] Anchor. Default value is the icon center.
 * @property {module:ol/style/IconOrigin} [anchorOrigin] Origin of the anchor: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`. Default is `top-left`.
 * @property {module:ol/style/IconAnchorUnits} [anchorXUnits] Units in which the anchor x value is
 * specified. A value of `'fraction'` indicates the x value is a fraction of the icon. A value of `'pixels'` indicates
 * the x value in pixels. Default is `'fraction'`.
 * @property {module:ol/style/IconAnchorUnits} [anchorYUnits] Units in which the anchor y value is
 * specified. A value of `'fraction'` indicates the y value is a fraction of the icon. A value of `'pixels'` indicates
 * the y value in pixels. Default is `'fraction'`.
 * @property {module:ol/color~Color|string} [color] Color to tint the icon. If not specified,
 * the icon will be left as is.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images. Note that you must provide a
 * `crossOrigin` value if you are using the WebGL renderer or if you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {HTMLImageElement|HTMLCanvasElement} [img] Image object for the icon. If the `src` option is not provided then the
 * provided image must already be loaded. And in that case, it is required
 * to provide the size of the image, with the `imgSize` option.
 * @property {Array<number>} [offset=[0, 0]] Offset, which, together with the size and the offset origin, define the
 * sub-rectangle to use from the original icon image.
 * @property {module:ol/style/IconOrigin} [offsetOrigin] Origin of the offset: `bottom-left`, `bottom-right`,
 * `top-left` or `top-right`. Default is `top-left`.
 * @property {number} [opacity=1] Opacity of the icon.
 * @property {number} [scale=1] Scale.
 * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
 * when drawing the icon in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
 * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
 * the icon's position is animated. Without it, the icon may jitter noticeably.
 * @property {boolean} [rotateWithView=false] Whether to rotate the icon with the view.
 * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
 * @property {module:ol/size~Size} [size] Icon size in pixel. Can be used together with `offset` to define the
 * sub-rectangle to use from the origin (sprite) icon image.
 * @property {module:ol/size~Size} [imgSize] Image size in pixels. Only required if `img` is set and `src` is not, and
 * for SVG images in Internet Explorer 11. The provided `imgSize` needs to match the actual size of the image.
 * @property {string} [src] Image source URI.
 */

/**
 * @classdesc
 * Set icon style for vector features.
 * @api
 */
var Icon = function (_ImageStyle) {
  _inherits(Icon, _ImageStyle);

  /**
   * @param {module:ol/style/Icon~Options=} opt_options Options.
   */
  function Icon(opt_options) {
    _classCallCheck(this, Icon);

    var options = opt_options || {};

    /**
     * @type {number}
     */
    var opacity = options.opacity !== undefined ? options.opacity : 1;

    /**
     * @type {number}
     */
    var rotation = options.rotation !== undefined ? options.rotation : 0;

    /**
     * @type {number}
     */
    var scale = options.scale !== undefined ? options.scale : 1;

    /**
     * @type {boolean}
     */
    var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;

    /**
     * @type {boolean}
     */
    var snapToPixel = options.snapToPixel !== undefined ? options.snapToPixel : true;

    /**
     * @private
     * @type {Array<number>}
     */
    var _this = _possibleConstructorReturn(this, (Icon.__proto__ || Object.getPrototypeOf(Icon)).call(this, {
      opacity: opacity,
      rotation: rotation,
      scale: scale,
      snapToPixel: snapToPixel,
      rotateWithView: rotateWithView
    }));

    _this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];

    /**
     * @private
     * @type {Array<number>}
     */
    _this.normalizedAnchor_ = null;

    /**
     * @private
     * @type {module:ol/style/IconOrigin}
     */
    _this.anchorOrigin_ = options.anchorOrigin !== undefined ? options.anchorOrigin : _IconOrigin2.default.TOP_LEFT;

    /**
     * @private
     * @type {module:ol/style/IconAnchorUnits}
     */
    _this.anchorXUnits_ = options.anchorXUnits !== undefined ? options.anchorXUnits : _IconAnchorUnits2.default.FRACTION;

    /**
     * @private
     * @type {module:ol/style/IconAnchorUnits}
     */
    _this.anchorYUnits_ = options.anchorYUnits !== undefined ? options.anchorYUnits : _IconAnchorUnits2.default.FRACTION;

    /**
     * @private
     * @type {?string}
     */
    _this.crossOrigin_ = options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    var image = options.img !== undefined ? options.img : null;

    /**
     * @type {module:ol/size~Size}
     */
    var imgSize = options.imgSize !== undefined ? options.imgSize : null;

    /**
     * @type {string|undefined}
     */
    var src = options.src;

    (0, _asserts.assert)(!(src !== undefined && image), 4); // `image` and `src` cannot be provided at the same time
    (0, _asserts.assert)(!image || image && imgSize, 5); // `imgSize` must be set when `image` is provided

    if ((src === undefined || src.length === 0) && image) {
      src = image.src || (0, _util.getUid)(image).toString();
    }
    (0, _asserts.assert)(src !== undefined && src.length > 0, 6); // A defined and non-empty `src` or `image` must be provided

    /**
     * @type {module:ol/ImageState}
     */
    var imageState = options.src !== undefined ? _ImageState2.default.IDLE : _ImageState2.default.LOADED;

    /**
     * @private
     * @type {module:ol/color~Color}
     */
    _this.color_ = options.color !== undefined ? (0, _color.asArray)(options.color) : null;

    /**
     * @private
     * @type {module:ol/style/IconImage}
     */
    _this.iconImage_ = (0, _IconImage.get)(image, /** @type {string} */src, imgSize, _this.crossOrigin_, imageState, _this.color_);

    /**
     * @private
     * @type {Array<number>}
     */
    _this.offset_ = options.offset !== undefined ? options.offset : [0, 0];

    /**
     * @private
     * @type {module:ol/style/IconOrigin}
     */
    _this.offsetOrigin_ = options.offsetOrigin !== undefined ? options.offsetOrigin : _IconOrigin2.default.TOP_LEFT;

    /**
     * @private
     * @type {Array<number>}
     */
    _this.origin_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.size_ = options.size !== undefined ? options.size : null;

    return _this;
  }

  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {module:ol/style/Icon} The cloned style.
   * @api
   */


  _createClass(Icon, [{
    key: 'clone',
    value: function clone() {
      return new Icon({
        anchor: this.anchor_.slice(),
        anchorOrigin: this.anchorOrigin_,
        anchorXUnits: this.anchorXUnits_,
        anchorYUnits: this.anchorYUnits_,
        crossOrigin: this.crossOrigin_,
        color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || undefined,
        src: this.getSrc(),
        offset: this.offset_.slice(),
        offsetOrigin: this.offsetOrigin_,
        size: this.size_ !== null ? this.size_.slice() : undefined,
        opacity: this.getOpacity(),
        scale: this.getScale(),
        snapToPixel: this.getSnapToPixel(),
        rotation: this.getRotation(),
        rotateWithView: this.getRotateWithView()
      });
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getAnchor',
    value: function getAnchor() {
      if (this.normalizedAnchor_) {
        return this.normalizedAnchor_;
      }
      var anchor = this.anchor_;
      var size = this.getSize();
      if (this.anchorXUnits_ == _IconAnchorUnits2.default.FRACTION || this.anchorYUnits_ == _IconAnchorUnits2.default.FRACTION) {
        if (!size) {
          return null;
        }
        anchor = this.anchor_.slice();
        if (this.anchorXUnits_ == _IconAnchorUnits2.default.FRACTION) {
          anchor[0] *= size[0];
        }
        if (this.anchorYUnits_ == _IconAnchorUnits2.default.FRACTION) {
          anchor[1] *= size[1];
        }
      }

      if (this.anchorOrigin_ != _IconOrigin2.default.TOP_LEFT) {
        if (!size) {
          return null;
        }
        if (anchor === this.anchor_) {
          anchor = this.anchor_.slice();
        }
        if (this.anchorOrigin_ == _IconOrigin2.default.TOP_RIGHT || this.anchorOrigin_ == _IconOrigin2.default.BOTTOM_RIGHT) {
          anchor[0] = -anchor[0] + size[0];
        }
        if (this.anchorOrigin_ == _IconOrigin2.default.BOTTOM_LEFT || this.anchorOrigin_ == _IconOrigin2.default.BOTTOM_RIGHT) {
          anchor[1] = -anchor[1] + size[1];
        }
      }
      this.normalizedAnchor_ = anchor;
      return this.normalizedAnchor_;
    }

    /**
     * Set the anchor point. The anchor determines the center point for the
     * symbolizer.
     *
     * @param {Array<number>} anchor Anchor.
     * @api
     */

  }, {
    key: 'setAnchor',
    value: function setAnchor(anchor) {
      this.anchor_ = anchor;
      this.normalizedAnchor_ = null;
    }

    /**
     * Get the icon color.
     * @return {module:ol/color~Color} Color.
     * @api
     */

  }, {
    key: 'getColor',
    value: function getColor() {
      return this.color_;
    }

    /**
     * Get the image icon.
     * @param {number} pixelRatio Pixel ratio.
     * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
     * @override
     * @api
     */

  }, {
    key: 'getImage',
    value: function getImage(pixelRatio) {
      return this.iconImage_.getImage(pixelRatio);
    }

    /**
     * @override
     */

  }, {
    key: 'getImageSize',
    value: function getImageSize() {
      return this.iconImage_.getSize();
    }

    /**
     * @override
     */

  }, {
    key: 'getHitDetectionImageSize',
    value: function getHitDetectionImageSize() {
      return this.getImageSize();
    }

    /**
     * @override
     */

  }, {
    key: 'getImageState',
    value: function getImageState() {
      return this.iconImage_.getImageState();
    }

    /**
     * @override
     */

  }, {
    key: 'getHitDetectionImage',
    value: function getHitDetectionImage(pixelRatio) {
      return this.iconImage_.getHitDetectionImage(pixelRatio);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getOrigin',
    value: function getOrigin() {
      if (this.origin_) {
        return this.origin_;
      }
      var offset = this.offset_;

      if (this.offsetOrigin_ != _IconOrigin2.default.TOP_LEFT) {
        var size = this.getSize();
        var iconImageSize = this.iconImage_.getSize();
        if (!size || !iconImageSize) {
          return null;
        }
        offset = offset.slice();
        if (this.offsetOrigin_ == _IconOrigin2.default.TOP_RIGHT || this.offsetOrigin_ == _IconOrigin2.default.BOTTOM_RIGHT) {
          offset[0] = iconImageSize[0] - size[0] - offset[0];
        }
        if (this.offsetOrigin_ == _IconOrigin2.default.BOTTOM_LEFT || this.offsetOrigin_ == _IconOrigin2.default.BOTTOM_RIGHT) {
          offset[1] = iconImageSize[1] - size[1] - offset[1];
        }
      }
      this.origin_ = offset;
      return this.origin_;
    }

    /**
     * Get the image URL.
     * @return {string|undefined} Image src.
     * @api
     */

  }, {
    key: 'getSrc',
    value: function getSrc() {
      return this.iconImage_.getSrc();
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getSize',
    value: function getSize() {
      return !this.size_ ? this.iconImage_.getSize() : this.size_;
    }

    /**
     * @override
     */

  }, {
    key: 'listenImageChange',
    value: function listenImageChange(listener, thisArg) {
      return (0, _events.listen)(this.iconImage_, _EventType2.default.CHANGE, listener, thisArg);
    }

    /**
     * Load not yet loaded URI.
     * When rendering a feature with an icon style, the vector renderer will
     * automatically call this method. However, you might want to call this
     * method yourself for preloading or other purposes.
     * @override
     * @api
     */

  }, {
    key: 'load',
    value: function load() {
      this.iconImage_.load();
    }

    /**
     * @override
     */

  }, {
    key: 'unlistenImageChange',
    value: function unlistenImageChange(listener, thisArg) {
      (0, _events.unlisten)(this.iconImage_, _EventType2.default.CHANGE, listener, thisArg);
    }
  }]);

  return Icon;
}(_Image2.default);

exports.default = Icon;