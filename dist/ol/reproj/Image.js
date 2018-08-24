'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

var _ImageBase2 = require('../ImageBase.js');

var _ImageBase3 = _interopRequireDefault(_ImageBase2);

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _reproj = require('../reproj.js');

var _Triangulation = require('../reproj/Triangulation.js');

var _Triangulation2 = _interopRequireDefault(_Triangulation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/reproj/Image
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {function(module:ol/extent~Extent, number, number) : module:ol/ImageBase} FunctionType
 */

/**
 * @classdesc
 * Class encapsulating single reprojected image.
 * See {@link module:ol/source/Image~ImageSource}.
 */
var ReprojImage = function (_ImageBase) {
  _inherits(ReprojImage, _ImageBase);

  /**
   * @param {module:ol/proj/Projection} sourceProj Source projection (of the data).
   * @param {module:ol/proj/Projection} targetProj Target projection.
   * @param {module:ol/extent~Extent} targetExtent Target extent.
   * @param {number} targetResolution Target resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {module:ol/reproj/Image~FunctionType} getImageFunction
   *     Function returning source images (extent, resolution, pixelRatio).
   */
  function ReprojImage(sourceProj, targetProj, targetExtent, targetResolution, pixelRatio, getImageFunction) {
    _classCallCheck(this, ReprojImage);

    var maxSourceExtent = sourceProj.getExtent();
    var maxTargetExtent = targetProj.getExtent();

    var limitedTargetExtent = maxTargetExtent ? (0, _extent.getIntersection)(targetExtent, maxTargetExtent) : targetExtent;

    var targetCenter = (0, _extent.getCenter)(limitedTargetExtent);
    var sourceResolution = (0, _reproj.calculateSourceResolution)(sourceProj, targetProj, targetCenter, targetResolution);

    var errorThresholdInPixels = _common.ERROR_THRESHOLD;

    var triangulation = new _Triangulation2.default(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels);

    var sourceExtent = triangulation.calculateSourceExtent();
    var sourceImage = getImageFunction(sourceExtent, sourceResolution, pixelRatio);
    var state = _ImageState2.default.LOADED;
    if (sourceImage) {
      state = _ImageState2.default.IDLE;
    }
    var sourcePixelRatio = sourceImage ? sourceImage.getPixelRatio() : 1;

    /**
     * @private
     * @type {module:ol/proj/Projection}
     */
    var _this = _possibleConstructorReturn(this, (ReprojImage.__proto__ || Object.getPrototypeOf(ReprojImage)).call(this, targetExtent, targetResolution, sourcePixelRatio, state));

    _this.targetProj_ = targetProj;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.maxSourceExtent_ = maxSourceExtent;

    /**
     * @private
     * @type {!module:ol/reproj/Triangulation}
     */
    _this.triangulation_ = triangulation;

    /**
     * @private
     * @type {number}
     */
    _this.targetResolution_ = targetResolution;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.targetExtent_ = targetExtent;

    /**
     * @private
     * @type {module:ol/ImageBase}
     */
    _this.sourceImage_ = sourceImage;

    /**
     * @private
     * @type {number}
     */
    _this.sourcePixelRatio_ = sourcePixelRatio;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = null;

    /**
     * @private
     * @type {?module:ol/events~EventsKey}
     */
    _this.sourceListenerKey_ = null;
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(ReprojImage, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      if (this.state == _ImageState2.default.LOADING) {
        this.unlistenSource_();
      }
      _ImageBase3.default.prototype.disposeInternal.call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      return this.canvas_;
    }

    /**
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'getProjection',
    value: function getProjection() {
      return this.targetProj_;
    }

    /**
     * @private
     */

  }, {
    key: 'reproject_',
    value: function reproject_() {
      var sourceState = this.sourceImage_.getState();
      if (sourceState == _ImageState2.default.LOADED) {
        var width = (0, _extent.getWidth)(this.targetExtent_) / this.targetResolution_;
        var height = (0, _extent.getHeight)(this.targetExtent_) / this.targetResolution_;

        this.canvas_ = (0, _reproj.render)(width, height, this.sourcePixelRatio_, this.sourceImage_.getResolution(), this.maxSourceExtent_, this.targetResolution_, this.targetExtent_, this.triangulation_, [{
          extent: this.sourceImage_.getExtent(),
          image: this.sourceImage_.getImage()
        }], 0);
      }
      this.state = sourceState;
      this.changed();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.state == _ImageState2.default.IDLE) {
        this.state = _ImageState2.default.LOADING;
        this.changed();

        var sourceState = this.sourceImage_.getState();
        if (sourceState == _ImageState2.default.LOADED || sourceState == _ImageState2.default.ERROR) {
          this.reproject_();
        } else {
          this.sourceListenerKey_ = (0, _events.listen)(this.sourceImage_, _EventType2.default.CHANGE, function (e) {
            var sourceState = this.sourceImage_.getState();
            if (sourceState == _ImageState2.default.LOADED || sourceState == _ImageState2.default.ERROR) {
              this.unlistenSource_();
              this.reproject_();
            }
          }, this);
          this.sourceImage_.load();
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'unlistenSource_',
    value: function unlistenSource_() {
      (0, _events.unlistenByKey)( /** @type {!module:ol/events~EventsKey} */this.sourceListenerKey_);
      this.sourceListenerKey_ = null;
    }
  }]);

  return ReprojImage;
}(_ImageBase3.default);

exports.default = ReprojImage;