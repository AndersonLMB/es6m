'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.defaultImageLoadFunction = defaultImageLoadFunction;

var _common = require('../reproj/common.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _array = require('../array.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _extent = require('../extent.js');

var _proj = require('../proj.js');

var _Image = require('../reproj/Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _Source2 = require('../source/Source.js');

var _Source3 = _interopRequireDefault(_Source2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 */
var ImageSourceEventType = {

  /**
   * Triggered when an image starts loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadstart
   * @api
   */
  IMAGELOADSTART: 'imageloadstart',

  /**
   * Triggered when an image finishes loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadend
   * @api
   */
  IMAGELOADEND: 'imageloadend',

  /**
   * Triggered if image loading results in an error.
   * @event ol/source/Image~ImageSourceEvent#imageloaderror
   * @api
   */
  IMAGELOADERROR: 'imageloaderror'

};

/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Image~ImageSource} instances are instances of this
 * type.
 */

var ImageSourceEvent = function (_Event) {
  _inherits(ImageSourceEvent, _Event);

  /**
   * @param {string} type Type.
   * @param {module:ol/Image} image The image.
   */
  function ImageSourceEvent(type, image) {
    _classCallCheck(this, ImageSourceEvent);

    /**
     * The image related to the event.
     * @type {module:ol/Image}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (ImageSourceEvent.__proto__ || Object.getPrototypeOf(ImageSourceEvent)).call(this, type));

    _this.image = image;

    return _this;
  }

  return ImageSourceEvent;
}(_Event3.default);

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions]
 * @property {module:ol/extent~Extent} [extent]
 * @property {module:ol/proj~ProjectionLike} projection
 * @property {Array<number>} [resolutions]
 * @property {module:ol/source/State} [state]
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for sources providing a single image.
 * @api
 */


var ImageSource = function (_Source) {
  _inherits(ImageSource, _Source);

  /**
   * @param {module:ol/source/Image~Options} options Single image source options.
   */
  function ImageSource(options) {
    _classCallCheck(this, ImageSource);

    /**
     * @private
     * @type {Array<number>}
     */
    var _this2 = _possibleConstructorReturn(this, (ImageSource.__proto__ || Object.getPrototypeOf(ImageSource)).call(this, {
      attributions: options.attributions,
      extent: options.extent,
      projection: options.projection,
      state: options.state
    }));

    _this2.resolutions_ = options.resolutions !== undefined ? options.resolutions : null;

    /**
     * @private
     * @type {module:ol/reproj/Image}
     */
    _this2.reprojectedImage_ = null;

    /**
     * @private
     * @type {number}
     */
    _this2.reprojectedRevision_ = 0;
    return _this2;
  }

  /**
   * @return {Array<number>} Resolutions.
   * @override
   */


  _createClass(ImageSource, [{
    key: 'getResolutions',
    value: function getResolutions() {
      return this.resolutions_;
    }

    /**
     * @protected
     * @param {number} resolution Resolution.
     * @return {number} Resolution.
     */

  }, {
    key: 'findNearestResolution',
    value: function findNearestResolution(resolution) {
      if (this.resolutions_) {
        var idx = (0, _array.linearFindNearest)(this.resolutions_, resolution, 0);
        resolution = this.resolutions_[idx];
      }
      return resolution;
    }

    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {module:ol/ImageBase} Single image.
     */

  }, {
    key: 'getImage',
    value: function getImage(extent, resolution, pixelRatio, projection) {
      var sourceProjection = this.getProjection();
      if (!_common.ENABLE_RASTER_REPROJECTION || !sourceProjection || !projection || (0, _proj.equivalent)(sourceProjection, projection)) {
        if (sourceProjection) {
          projection = sourceProjection;
        }
        return this.getImageInternal(extent, resolution, pixelRatio, projection);
      } else {
        if (this.reprojectedImage_) {
          if (this.reprojectedRevision_ == this.getRevision() && (0, _proj.equivalent)(this.reprojectedImage_.getProjection(), projection) && this.reprojectedImage_.getResolution() == resolution && (0, _extent.equals)(this.reprojectedImage_.getExtent(), extent)) {
            return this.reprojectedImage_;
          }
          this.reprojectedImage_.dispose();
          this.reprojectedImage_ = null;
        }

        this.reprojectedImage_ = new _Image2.default(sourceProjection, projection, extent, resolution, pixelRatio, function (extent, resolution, pixelRatio) {
          return this.getImageInternal(extent, resolution, pixelRatio, sourceProjection);
        }.bind(this));
        this.reprojectedRevision_ = this.getRevision();

        return this.reprojectedImage_;
      }
    }

    /**
     * @abstract
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @return {module:ol/ImageBase} Single image.
     * @protected
     */

  }, {
    key: 'getImageInternal',
    value: function getImageInternal(extent, resolution, pixelRatio, projection) {}

    /**
     * Handle image change events.
     * @param {module:ol/events/Event} event Event.
     * @protected
     */

  }, {
    key: 'handleImageChange',
    value: function handleImageChange(event) {
      var image = /** @type {module:ol/Image} */event.target;
      switch (image.getState()) {
        case _ImageState2.default.LOADING:
          this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADSTART, image));
          break;
        case _ImageState2.default.LOADED:
          this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADEND, image));
          break;
        case _ImageState2.default.ERROR:
          this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADERROR, image));
          break;
        default:
        // pass
      }
    }
  }]);

  return ImageSource;
}(_Source3.default);

/**
 * Default image load function for image sources that use module:ol/Image~Image image
 * instances.
 * @param {module:ol/Image} image Image.
 * @param {string} src Source.
 */


function defaultImageLoadFunction(image, src) {
  image.getImage().src = src;
}

exports.default = ImageSource;