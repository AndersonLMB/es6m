'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Disposable2 = require('../Disposable.js');

var _Disposable3 = _interopRequireDefault(_Disposable2);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/Box
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var RenderBox = function (_Disposable) {
  _inherits(RenderBox, _Disposable);

  /**
   * @param {string} className CSS class name.
   */
  function RenderBox(className) {
    _classCallCheck(this, RenderBox);

    /**
     * @type {module:ol/geom/Polygon}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (RenderBox.__proto__ || Object.getPrototypeOf(RenderBox)).call(this));

    _this.geometry_ = null;

    /**
     * @type {HTMLDivElement}
     * @private
     */
    _this.element_ = /** @type {HTMLDivElement} */document.createElement('div');
    _this.element_.style.position = 'absolute';
    _this.element_.className = 'ol-box ' + className;

    /**
     * @private
     * @type {module:ol/PluggableMap}
     */
    _this.map_ = null;

    /**
     * @private
     * @type {module:ol/pixel~Pixel}
     */
    _this.startPixel_ = null;

    /**
     * @private
     * @type {module:ol/pixel~Pixel}
     */
    _this.endPixel_ = null;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(RenderBox, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.setMap(null);
    }

    /**
     * @private
     */

  }, {
    key: 'render_',
    value: function render_() {
      var startPixel = this.startPixel_;
      var endPixel = this.endPixel_;
      var px = 'px';
      var style = this.element_.style;
      style.left = Math.min(startPixel[0], endPixel[0]) + px;
      style.top = Math.min(startPixel[1], endPixel[1]) + px;
      style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
      style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
    }

    /**
     * @param {module:ol/PluggableMap} map Map.
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      if (this.map_) {
        this.map_.getOverlayContainer().removeChild(this.element_);
        var style = this.element_.style;
        style.left = style.top = style.width = style.height = 'inherit';
      }
      this.map_ = map;
      if (this.map_) {
        this.map_.getOverlayContainer().appendChild(this.element_);
      }
    }

    /**
     * @param {module:ol/pixel~Pixel} startPixel Start pixel.
     * @param {module:ol/pixel~Pixel} endPixel End pixel.
     */

  }, {
    key: 'setPixels',
    value: function setPixels(startPixel, endPixel) {
      this.startPixel_ = startPixel;
      this.endPixel_ = endPixel;
      this.createOrUpdateGeometry();
      this.render_();
    }

    /**
     * Creates or updates the cached geometry.
     */

  }, {
    key: 'createOrUpdateGeometry',
    value: function createOrUpdateGeometry() {
      var startPixel = this.startPixel_;
      var endPixel = this.endPixel_;
      var pixels = [startPixel, [startPixel[0], endPixel[1]], endPixel, [endPixel[0], startPixel[1]]];
      var coordinates = pixels.map(this.map_.getCoordinateFromPixel, this.map_);
      // close the polygon
      coordinates[4] = coordinates[0].slice();
      if (!this.geometry_) {
        this.geometry_ = new _Polygon2.default([coordinates]);
      } else {
        this.geometry_.setCoordinates([coordinates]);
      }
    }

    /**
     * @return {module:ol/geom/Polygon} Geometry.
     */

  }, {
    key: 'getGeometry',
    value: function getGeometry() {
      return this.geometry_;
    }
  }]);

  return RenderBox;
}(_Disposable3.default);

exports.default = RenderBox;