'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/ImageBase
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @abstract
 */
var ImageBase = function (_EventTarget) {
  _inherits(ImageBase, _EventTarget);

  /**
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number|undefined} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {module:ol/ImageState} state State.
   */
  function ImageBase(extent, resolution, pixelRatio, state) {
    _classCallCheck(this, ImageBase);

    /**
     * @protected
     * @type {module:ol/extent~Extent}
     */
    var _this = _possibleConstructorReturn(this, (ImageBase.__proto__ || Object.getPrototypeOf(ImageBase)).call(this));

    _this.extent = extent;

    /**
     * @private
     * @type {number}
     */
    _this.pixelRatio_ = pixelRatio;

    /**
     * @protected
     * @type {number|undefined}
     */
    _this.resolution = resolution;

    /**
     * @protected
     * @type {module:ol/ImageState}
     */
    _this.state = state;

    return _this;
  }

  /**
   * @protected
   */


  _createClass(ImageBase, [{
    key: 'changed',
    value: function changed() {
      this.dispatchEvent(_EventType2.default.CHANGE);
    }

    /**
     * @return {module:ol/extent~Extent} Extent.
     */

  }, {
    key: 'getExtent',
    value: function getExtent() {
      return this.extent;
    }

    /**
     * @abstract
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     */

  }, {
    key: 'getImage',
    value: function getImage() {}

    /**
     * @return {number} PixelRatio.
     */

  }, {
    key: 'getPixelRatio',
    value: function getPixelRatio() {
      return this.pixelRatio_;
    }

    /**
     * @return {number} Resolution.
     */

  }, {
    key: 'getResolution',
    value: function getResolution() {
      return (/** @type {number} */this.resolution
      );
    }

    /**
     * @return {module:ol/ImageState} State.
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }

    /**
     * Load not yet loaded URI.
     * @abstract
     */

  }, {
    key: 'load',
    value: function load() {}
  }]);

  return ImageBase;
}(_Target2.default);

exports.default = ImageBase;