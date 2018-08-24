'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../extent.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _deflate = require('../geom/flat/deflate.js');

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/Point
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Point geometry.
 *
 * @api
 */
var Point = function (_SimpleGeometry) {
  _inherits(Point, _SimpleGeometry);

  /**
   * @param {module:ol/coordinate~Coordinate} coordinates Coordinates.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   */
  function Point(coordinates, opt_layout) {
    _classCallCheck(this, Point);

    var _this = _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

    _this.setCoordinates(coordinates, opt_layout);
    return _this;
  }

  /**
   * Make a complete copy of the geometry.
   * @return {!module:ol/geom/Point} Clone.
   * @override
   * @api
   */


  _createClass(Point, [{
    key: 'clone',
    value: function clone() {
      var point = new Point(this.flatCoordinates.slice(), this.layout);
      return point;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'closestPointXY',
    value: function closestPointXY(x, y, closestPoint, minSquaredDistance) {
      var flatCoordinates = this.flatCoordinates;
      var squaredDistance = (0, _math.squaredDistance)(x, y, flatCoordinates[0], flatCoordinates[1]);
      if (squaredDistance < minSquaredDistance) {
        var stride = this.stride;
        for (var i = 0; i < stride; ++i) {
          closestPoint[i] = flatCoordinates[i];
        }
        closestPoint.length = stride;
        return squaredDistance;
      } else {
        return minSquaredDistance;
      }
    }

    /**
     * Return the coordinate of the point.
     * @return {module:ol/coordinate~Coordinate} Coordinates.
     * @override
     * @api
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates() {
      return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'computeExtent',
    value: function computeExtent(extent) {
      return (0, _extent.createOrUpdateFromCoordinate)(this.flatCoordinates, extent);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.POINT;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      return (0, _extent.containsXY)(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {
      this.setLayout(opt_layout, coordinates, 0);
      if (!this.flatCoordinates) {
        this.flatCoordinates = [];
      }
      this.flatCoordinates.length = (0, _deflate.deflateCoordinate)(this.flatCoordinates, 0, coordinates, this.stride);
      this.changed();
    }
  }]);

  return Point;
}(_SimpleGeometry3.default);

exports.default = Point;