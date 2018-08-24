'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Image = require('../Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _obj = require('../obj.js');

var _Image3 = require('../source/Image.js');

var _Image4 = _interopRequireDefault(_Image3);

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/ImageMapGuide
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {string} [url] The mapagent url.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {number} [displayDpi=96] The display resolution.
 * @property {number} [metersPerUnit=1] The meters-per-unit value.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {boolean} [useOverlay] If `true`, will use `GETDYNAMICMAPOVERLAYIMAGE`.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [ratio=1] Ratio. `1` means image requests are the size of the map viewport, `2` means
 * twice the width and height of the map viewport, and so on. Must be `1` or higher.
 * @property {Array<number>} [resolutions] Resolutions.
 * If specified, requests will be made for these resolutions only.
 * @property {module:ol/Image~LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
 * @property {Object} [params] Additional parameters.
 */

/**
 * @classdesc
 * Source for images from Mapguide servers
 *
 * @fires ol/source/Image~ImageSourceEvent
 * @api
 */
var ImageMapGuide = function (_ImageSource) {
  _inherits(ImageMapGuide, _ImageSource);

  /**
   * @param {module:ol/source/ImageMapGuide~Options=} options ImageMapGuide options.
   */
  function ImageMapGuide(options) {
    _classCallCheck(this, ImageMapGuide);

    /**
     * @private
     * @type {?string}
     */
    var _this = _possibleConstructorReturn(this, (ImageMapGuide.__proto__ || Object.getPrototypeOf(ImageMapGuide)).call(this, {
      projection: options.projection,
      resolutions: options.resolutions
    }));

    _this.crossOrigin_ = options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @private
     * @type {number}
     */
    _this.displayDpi_ = options.displayDpi !== undefined ? options.displayDpi : 96;

    /**
     * @private
     * @type {!Object}
     */
    _this.params_ = options.params || {};

    /**
     * @private
     * @type {string|undefined}
     */
    _this.url_ = options.url;

    /**
     * @private
     * @type {module:ol/Image~LoadFunction}
     */
    _this.imageLoadFunction_ = options.imageLoadFunction !== undefined ? options.imageLoadFunction : _Image3.defaultImageLoadFunction;

    /**
     * @private
     * @type {boolean}
     */
    _this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {number}
     */
    _this.metersPerUnit_ = options.metersPerUnit !== undefined ? options.metersPerUnit : 1;

    /**
     * @private
     * @type {number}
     */
    _this.ratio_ = options.ratio !== undefined ? options.ratio : 1;

    /**
     * @private
     * @type {boolean}
     */
    _this.useOverlay_ = options.useOverlay !== undefined ? options.useOverlay : false;

    /**
     * @private
     * @type {module:ol/Image}
     */
    _this.image_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.renderedRevision_ = 0;

    return _this;
  }

  /**
   * Get the user-provided params, i.e. those passed to the constructor through
   * the "params" option, and possibly updated using the updateParams method.
   * @return {Object} Params.
   * @api
   */


  _createClass(ImageMapGuide, [{
    key: 'getParams',
    value: function getParams() {
      return this.params_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageInternal',
    value: function getImageInternal(extent, resolution, pixelRatio, projection) {
      resolution = this.findNearestResolution(resolution);
      pixelRatio = this.hidpi_ ? pixelRatio : 1;

      var image = this.image_;
      if (image && this.renderedRevision_ == this.getRevision() && image.getResolution() == resolution && image.getPixelRatio() == pixelRatio && (0, _extent.containsExtent)(image.getExtent(), extent)) {
        return image;
      }

      if (this.ratio_ != 1) {
        extent = extent.slice();
        (0, _extent.scaleFromCenter)(extent, this.ratio_);
      }
      var width = (0, _extent.getWidth)(extent) / resolution;
      var height = (0, _extent.getHeight)(extent) / resolution;
      var size = [width * pixelRatio, height * pixelRatio];

      if (this.url_ !== undefined) {
        var imageUrl = this.getUrl(this.url_, this.params_, extent, size, projection);
        image = new _Image2.default(extent, resolution, pixelRatio, imageUrl, this.crossOrigin_, this.imageLoadFunction_);
        (0, _events.listen)(image, _EventType2.default.CHANGE, this.handleImageChange, this);
      } else {
        image = null;
      }
      this.image_ = image;
      this.renderedRevision_ = this.getRevision();

      return image;
    }

    /**
     * Return the image load function of the source.
     * @return {module:ol/Image~LoadFunction} The image load function.
     * @api
     */

  }, {
    key: 'getImageLoadFunction',
    value: function getImageLoadFunction() {
      return this.imageLoadFunction_;
    }

    /**
     * Update the user-provided params.
     * @param {Object} params Params.
     * @api
     */

  }, {
    key: 'updateParams',
    value: function updateParams(params) {
      (0, _obj.assign)(this.params_, params);
      this.changed();
    }

    /**
     * @param {string} baseUrl The mapagent url.
     * @param {Object<string, string|number>} params Request parameters.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {module:ol/size~Size} size Size.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {string} The mapagent map image request URL.
     */

  }, {
    key: 'getUrl',
    value: function getUrl(baseUrl, params, extent, size, projection) {
      var scale = getScale(extent, size, this.metersPerUnit_, this.displayDpi_);
      var center = (0, _extent.getCenter)(extent);
      var baseParams = {
        'OPERATION': this.useOverlay_ ? 'GETDYNAMICMAPOVERLAYIMAGE' : 'GETMAPIMAGE',
        'VERSION': '2.0.0',
        'LOCALE': 'en',
        'CLIENTAGENT': 'ol/source/ImageMapGuide source',
        'CLIP': '1',
        'SETDISPLAYDPI': this.displayDpi_,
        'SETDISPLAYWIDTH': Math.round(size[0]),
        'SETDISPLAYHEIGHT': Math.round(size[1]),
        'SETVIEWSCALE': scale,
        'SETVIEWCENTERX': center[0],
        'SETVIEWCENTERY': center[1]
      };
      (0, _obj.assign)(baseParams, params);
      return (0, _uri.appendParams)(baseUrl, baseParams);
    }

    /**
     * Set the image load function of the MapGuide source.
     * @param {module:ol/Image~LoadFunction} imageLoadFunction Image load function.
     * @api
     */

  }, {
    key: 'setImageLoadFunction',
    value: function setImageLoadFunction(imageLoadFunction) {
      this.image_ = null;
      this.imageLoadFunction_ = imageLoadFunction;
      this.changed();
    }
  }]);

  return ImageMapGuide;
}(_Image4.default);

/**
 * @param {module:ol/extent~Extent} extent The map extents.
 * @param {module:ol/size~Size} size The viewport size.
 * @param {number} metersPerUnit The meters-per-unit value.
 * @param {number} dpi The display resolution.
 * @return {number} The computed map scale.
 */


function getScale(extent, size, metersPerUnit, dpi) {
  var mcsW = (0, _extent.getWidth)(extent);
  var mcsH = (0, _extent.getHeight)(extent);
  var devW = size[0];
  var devH = size[1];
  var mpp = 0.0254 / dpi;
  if (devH * mcsW > devW * mcsH) {
    return mcsW * metersPerUnit / (devW * mpp); // width limited
  } else {
    return mcsH * metersPerUnit / (devH * mpp); // height limited
  }
}

exports.default = ImageMapGuide;