'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

var _Image = require('../Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _asserts = require('../asserts.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _reproj = require('../reproj.js');

var _Image3 = require('../source/Image.js');

var _Image4 = _interopRequireDefault(_Image3);

var _WMSServerType = require('../source/WMSServerType.js');

var _WMSServerType2 = _interopRequireDefault(_WMSServerType);

var _string = require('../string.js');

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/ImageWMS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @const
 * @type {module:ol/size~Size}
 */
var GETFEATUREINFO_IMAGE_SIZE = [101, 101];

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting
 * the image from the remote server.
 * @property {module:ol/source/WMSServerType|string} [serverType] The type of
 * the remote WMS server: `mapserver`, `geoserver` or `qgis`. Only needed if `hidpi` is `true`.
 * @property {module:ol/Image~LoadFunction} [imageLoadFunction] Optional function to load an image given a URL.
 * @property {Object<string,*>} params WMS request parameters.
 * At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport, `2` means
 * twice the width and height of the map viewport, and so on. Must be `1` or
 * higher.
 * @property {Array<number>} [resolutions] Resolutions.
 * If specified, requests will be made for these resolutions only.
 * @property {string} url WMS service URL.
 */

/**
 * @classdesc
 * Source for WMS servers providing single, untiled images.
 *
 * @fires ol/source/Image~ImageSourceEvent
 * @api
 */

var ImageWMS = function (_ImageSource) {
  _inherits(ImageWMS, _ImageSource);

  /**
   * @param {module:ol/source/ImageWMS~Options=} [opt_options] ImageWMS options.
   */
  function ImageWMS(opt_options) {
    _classCallCheck(this, ImageWMS);

    var options = opt_options || {};

    /**
     * @private
     * @type {?string}
     */
    var _this = _possibleConstructorReturn(this, (ImageWMS.__proto__ || Object.getPrototypeOf(ImageWMS)).call(this, {
      attributions: options.attributions,
      projection: options.projection,
      resolutions: options.resolutions
    }));

    _this.crossOrigin_ = options.crossOrigin !== undefined ? options.crossOrigin : null;

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
     * @type {!Object}
     */
    _this.params_ = options.params || {};

    /**
     * @private
     * @type {boolean}
     */
    _this.v13_ = true;
    _this.updateV13_();

    /**
     * @private
     * @type {module:ol/source/WMSServerType|undefined}
     */
    _this.serverType_ = /** @type {module:ol/source/WMSServerType|undefined} */options.serverType;

    /**
     * @private
     * @type {boolean}
     */
    _this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {module:ol/Image}
     */
    _this.image_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.imageSize_ = [0, 0];

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
   * Return the GetFeatureInfo URL for the passed coordinate, resolution, and
   * projection. Return `undefined` if the GetFeatureInfo URL cannot be
   * constructed.
   * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {module:ol/proj~ProjectionLike} projection Projection.
   * @param {!Object} params GetFeatureInfo params. `INFO_FORMAT` at least should
   *     be provided. If `QUERY_LAYERS` is not provided then the layers specified
   *     in the `LAYERS` parameter will be used. `VERSION` should not be
   *     specified here.
   * @return {string|undefined} GetFeatureInfo URL.
   * @api
   */


  _createClass(ImageWMS, [{
    key: 'getGetFeatureInfoUrl',
    value: function getGetFeatureInfoUrl(coordinate, resolution, projection, params) {
      if (this.url_ === undefined) {
        return undefined;
      }
      var projectionObj = (0, _proj.get)(projection);
      var sourceProjectionObj = this.getProjection();

      if (sourceProjectionObj && sourceProjectionObj !== projectionObj) {
        resolution = (0, _reproj.calculateSourceResolution)(sourceProjectionObj, projectionObj, coordinate, resolution);
        coordinate = (0, _proj.transform)(coordinate, projectionObj, sourceProjectionObj);
      }

      var extent = (0, _extent.getForViewAndSize)(coordinate, resolution, 0, GETFEATUREINFO_IMAGE_SIZE);

      var baseParams = {
        'SERVICE': 'WMS',
        'VERSION': _common.DEFAULT_WMS_VERSION,
        'REQUEST': 'GetFeatureInfo',
        'FORMAT': 'image/png',
        'TRANSPARENT': true,
        'QUERY_LAYERS': this.params_['LAYERS']
      };
      (0, _obj.assign)(baseParams, this.params_, params);

      var x = Math.floor((coordinate[0] - extent[0]) / resolution);
      var y = Math.floor((extent[3] - coordinate[1]) / resolution);
      baseParams[this.v13_ ? 'I' : 'X'] = x;
      baseParams[this.v13_ ? 'J' : 'Y'] = y;

      return this.getRequestUrl_(extent, GETFEATUREINFO_IMAGE_SIZE, 1, sourceProjectionObj || projectionObj, baseParams);
    }

    /**
     * Get the user-provided params, i.e. those passed to the constructor through
     * the "params" option, and possibly updated using the updateParams method.
     * @return {Object} Params.
     * @api
     */

  }, {
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

      if (this.url_ === undefined) {
        return null;
      }

      resolution = this.findNearestResolution(resolution);

      if (pixelRatio != 1 && (!this.hidpi_ || this.serverType_ === undefined)) {
        pixelRatio = 1;
      }

      var imageResolution = resolution / pixelRatio;

      var center = (0, _extent.getCenter)(extent);
      var viewWidth = Math.ceil((0, _extent.getWidth)(extent) / imageResolution);
      var viewHeight = Math.ceil((0, _extent.getHeight)(extent) / imageResolution);
      var viewExtent = (0, _extent.getForViewAndSize)(center, imageResolution, 0, [viewWidth, viewHeight]);
      var requestWidth = Math.ceil(this.ratio_ * (0, _extent.getWidth)(extent) / imageResolution);
      var requestHeight = Math.ceil(this.ratio_ * (0, _extent.getHeight)(extent) / imageResolution);
      var requestExtent = (0, _extent.getForViewAndSize)(center, imageResolution, 0, [requestWidth, requestHeight]);

      var image = this.image_;
      if (image && this.renderedRevision_ == this.getRevision() && image.getResolution() == resolution && image.getPixelRatio() == pixelRatio && (0, _extent.containsExtent)(image.getExtent(), viewExtent)) {
        return image;
      }

      var params = {
        'SERVICE': 'WMS',
        'VERSION': _common.DEFAULT_WMS_VERSION,
        'REQUEST': 'GetMap',
        'FORMAT': 'image/png',
        'TRANSPARENT': true
      };
      (0, _obj.assign)(params, this.params_);

      this.imageSize_[0] = Math.round((0, _extent.getWidth)(requestExtent) / imageResolution);
      this.imageSize_[1] = Math.round((0, _extent.getHeight)(requestExtent) / imageResolution);

      var url = this.getRequestUrl_(requestExtent, this.imageSize_, pixelRatio, projection, params);

      this.image_ = new _Image2.default(requestExtent, resolution, pixelRatio, url, this.crossOrigin_, this.imageLoadFunction_);

      this.renderedRevision_ = this.getRevision();

      (0, _events.listen)(this.image_, _EventType2.default.CHANGE, this.handleImageChange, this);

      return this.image_;
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
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {module:ol/size~Size} size Size.
     * @param {number} pixelRatio Pixel ratio.
     * @param {module:ol/proj/Projection} projection Projection.
     * @param {Object} params Params.
     * @return {string} Request URL.
     * @private
     */

  }, {
    key: 'getRequestUrl_',
    value: function getRequestUrl_(extent, size, pixelRatio, projection, params) {

      (0, _asserts.assert)(this.url_ !== undefined, 9); // `url` must be configured or set using `#setUrl()`

      params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

      if (!('STYLES' in this.params_)) {
        params['STYLES'] = '';
      }

      if (pixelRatio != 1) {
        switch (this.serverType_) {
          case _WMSServerType2.default.GEOSERVER:
            var dpi = 90 * pixelRatio + 0.5 | 0;
            if ('FORMAT_OPTIONS' in params) {
              params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
            } else {
              params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
            }
            break;
          case _WMSServerType2.default.MAPSERVER:
            params['MAP_RESOLUTION'] = 90 * pixelRatio;
            break;
          case _WMSServerType2.default.CARMENTA_SERVER:
          case _WMSServerType2.default.QGIS:
            params['DPI'] = 90 * pixelRatio;
            break;
          default:
            (0, _asserts.assert)(false, 8); // Unknown `serverType` configured
            break;
        }
      }

      params['WIDTH'] = size[0];
      params['HEIGHT'] = size[1];

      var axisOrientation = projection.getAxisOrientation();
      var bbox = void 0;
      if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
        bbox = [extent[1], extent[0], extent[3], extent[2]];
      } else {
        bbox = extent;
      }
      params['BBOX'] = bbox.join(',');

      return (0, _uri.appendParams)( /** @type {string} */this.url_, params);
    }

    /**
     * Return the URL used for this WMS source.
     * @return {string|undefined} URL.
     * @api
     */

  }, {
    key: 'getUrl',
    value: function getUrl() {
      return this.url_;
    }

    /**
     * Set the image load function of the source.
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

    /**
     * Set the URL to use for requests.
     * @param {string|undefined} url URL.
     * @api
     */

  }, {
    key: 'setUrl',
    value: function setUrl(url) {
      if (url != this.url_) {
        this.url_ = url;
        this.image_ = null;
        this.changed();
      }
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
      this.updateV13_();
      this.image_ = null;
      this.changed();
    }

    /**
     * @private
     */

  }, {
    key: 'updateV13_',
    value: function updateV13_() {
      var version = this.params_['VERSION'] || _common.DEFAULT_WMS_VERSION;
      this.v13_ = (0, _string.compareVersions)(version, '1.3') >= 0;
    }
  }]);

  return ImageWMS;
}(_Image4.default);

exports.default = ImageWMS;