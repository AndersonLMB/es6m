'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _deflate = require('../geom/flat/deflate.js');

var _inflate = require('../geom/flat/inflate.js');

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/MultiPoint
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Multi-point geometry.
 *
 * @api
 */
var MultiPoint = function (_SimpleGeometry) {
  _inherits(MultiPoint, _SimpleGeometry);

  /**
   * @param {Array<module:ol/coordinate~Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   */
  function MultiPoint(coordinates, opt_layout) {
    _classCallCheck(this, MultiPoint);

    var _this = _possibleConstructorReturn(this, (MultiPoint.__proto__ || Object.getPrototypeOf(MultiPoint)).call(this));

    if (opt_layout && !Array.isArray(coordinates[0])) {
      _this.setFlatCoordinates(opt_layout, coordinates);
    } else {
      _this.setCoordinates(coordinates, opt_layout);
    }
    return _this;
  }

  /**
   * Append the passed point to this multipoint.
   * @param {module:ol/geom/Point} point Point.
   * @api
   */


  _createClass(MultiPoint, [{
    key: 'appendPoint',
    value: function appendPoint(point) {
      if (!this.flatCoordinates) {
        this.flatCoordinates = point.getFlatCoordinates().slice();
      } else {
        (0, _array.extend)(this.flatCoordinates, point.getFlatCoordinates());
      }
      this.changed();
    }

    /**
     * Make a complete copy of the geometry.
     * @return {!module:ol/geom/MultiPoint} Clone.
     * @override
     * @api
     */

  }, {
    key: 'clone',
    value: function clone() {
      var multiPoint = new MultiPoint(this.flatCoordinates.slice(), this.layout);
      return multiPoint;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'closestPointXY',
    value: function closestPointXY(x, y, closestPoint, minSquaredDistance) {
      if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
        return minSquaredDistance;
      }
      var flatCoordinates = this.flatCoordinates;
      var stride = this.stride;
      for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
        var squaredDistance = (0, _math.squaredDistance)(x, y, flatCoordinates[i], flatCoordinates[i + 1]);
        if (squaredDistance < minSquaredDistance) {
          minSquaredDistance = squaredDistance;
          for (var j = 0; j < stride; ++j) {
            closestPoint[j] = flatCoordinates[i + j];
          }
          closestPoint.length = stride;
        }
      }
      return minSquaredDistance;
    }

    /**
     * Return the coordinates of the multipoint.
     * @return {Array<module:ol/coordinate~Coordinate>} Coordinates.
     * @override
     * @api
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates() {
      return (0, _inflate.inflateCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }

    /**
     * Return the point at the specified index.
     * @param {number} index Index.
     * @return {module:ol/geom/Point} Point.
     * @api
     */

  }, {
    key: 'getPoint',
    value: function getPoint(index) {
      var n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
      if (index < 0 || n <= index) {
        return null;
      }
      return new _Point2.default(this.flatCoordinates.slice(index * this.stride, (index + 1) * this.stride), this.layout);
    }

    /**
     * Return the points of this multipoint.
     * @return {Array<module:ol/geom/Point>} Points.
     * @api
     */

  }, {
    key: 'getPoints',
    value: function getPoints() {
      var flatCoordinates = this.flatCoordinates;
      var layout = this.layout;
      var stride = this.stride;
      /** @type {Array<module:ol/geom/Point>} */
      var points = [];
      for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
        var point = new _Point2.default(flatCoordinates.slice(i, i + stride), layout);
        points.push(point);
      }
      return points;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.MULTI_POINT;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      var flatCoordinates = this.flatCoordinates;
      var stride = this.stride;
      for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
        var x = flatCoordinates[i];
        var y = flatCoordinates[i + 1];
        if ((0, _extent.containsXY)(extent, x, y)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Set the coordinates of the multipoint.
     * @param {!Array<module:ol/coordinate~Coordinate>} coordinates Coordinates.
     * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
     * @override
     * @api
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {
      this.setLayout(opt_layout, coordinates, 1);
      if (!this.flatCoordinates) {
        this.flatCoordinates = [];
      }
      this.flatCoordinates.length = (0, _deflate.deflateCoordinates)(this.flatCoordinates, 0, coordinates, this.stride);
      this.changed();
    }
  }]);

  return MultiPoint;
}(_SimpleGeometry3.default);

exports.default = MultiPoint;