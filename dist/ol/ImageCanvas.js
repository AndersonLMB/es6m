'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageBase2 = require('./ImageBase.js');

var _ImageBase3 = _interopRequireDefault(_ImageBase2);

var _ImageState = require('./ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/ImageCanvas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * A function that is called to trigger asynchronous canvas drawing.  It is
 * called with a "done" callback that should be called when drawing is done.
 * If any error occurs during drawing, the "done" callback should be called with
 * that error.
 *
 * @typedef {function(function(Error))} Loader
 */

var ImageCanvas = function (_ImageBase) {
  _inherits(ImageCanvas, _ImageBase);

  /**
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {HTMLCanvasElement} canvas Canvas.
   * @param {module:ol/ImageCanvas~Loader=} opt_loader Optional loader function to
   *     support asynchronous canvas drawing.
   */
  function ImageCanvas(extent, resolution, pixelRatio, canvas, opt_loader) {
    _classCallCheck(this, ImageCanvas);

    var state = opt_loader !== undefined ? _ImageState2.default.IDLE : _ImageState2.default.LOADED;

    /**
     * Optional canvas loader function.
     * @type {?module:ol/ImageCanvas~Loader}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (ImageCanvas.__proto__ || Object.getPrototypeOf(ImageCanvas)).call(this, extent, resolution, pixelRatio, state));

    _this.loader_ = opt_loader !== undefined ? opt_loader : null;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = canvas;

    /**
     * @private
     * @type {Error}
     */
    _this.error_ = null;

    return _this;
  }

  /**
   * Get any error associated with asynchronous rendering.
   * @return {Error} Any error that occurred during rendering.
   */


  _createClass(ImageCanvas, [{
    key: 'getError',
    value: function getError() {
      return this.error_;
    }

    /**
     * Handle async drawing complete.
     * @param {Error} err Any error during drawing.
     * @private
     */

  }, {
    key: 'handleLoad_',
    value: function handleLoad_(err) {
      if (err) {
        this.error_ = err;
        this.state = _ImageState2.default.ERROR;
      } else {
        this.state = _ImageState2.default.LOADED;
      }
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
        this.loader_(this.handleLoad_.bind(this));
      }
    }

    /**
     * @return {HTMLCanvasElement} Canvas element.
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      return this.canvas_;
    }
  }]);

  return ImageCanvas;
}(_ImageBase3.default);

exports.default = ImageCanvas;