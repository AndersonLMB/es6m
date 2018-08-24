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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/Circle
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Circle geometry.
 *
 * @api
 */
var Circle = function (_SimpleGeometry) {
  _inherits(Circle, _SimpleGeometry);

  /**
   * @param {!module:ol/coordinate~Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `opt_layout` and no
   *     `opt_radius` are also accepted.
   * @param {number=} opt_radius Radius.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   */
  function Circle(center, opt_radius, opt_layout) {
    _classCallCheck(this, Circle);

    var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

    if (opt_layout !== undefined && opt_radius === undefined) {
      _this.setFlatCoordinates(opt_layout, center);
    } else {
      var radius = opt_radius ? opt_radius : 0;
      _this.setCenterAndRadius(center, radius, opt_layout);
    }
    return _this;
  }

  /**
   * Make a complete copy of the geometry.
   * @return {!module:ol/geom/Circle} Clone.
   * @override
   * @api
   */


  _createClass(Circle, [{
    key: 'clone',
    value: function clone() {
      return new Circle(this.flatCoordinates.slice(), undefined, this.layout);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'closestPointXY',
    value: function closestPointXY(x, y, closestPoint, minSquaredDistance) {
      var flatCoordinates = this.flatCoordinates;
      var dx = x - flatCoordinates[0];
      var dy = y - flatCoordinates[1];
      var squaredDistance = dx * dx + dy * dy;
      if (squaredDistance < minSquaredDistance) {
        if (squaredDistance === 0) {
          for (var i = 0; i < this.stride; ++i) {
            closestPoint[i] = flatCoordinates[i];
          }
        } else {
          var delta = this.getRadius() / Math.sqrt(squaredDistance);
          closestPoint[0] = flatCoordinates[0] + delta * dx;
          closestPoint[1] = flatCoordinates[1] + delta * dy;
          for (var _i = 2; _i < this.stride; ++_i) {
            closestPoint[_i] = flatCoordinates[_i];
          }
        }
        closestPoint.length = this.stride;
        return squaredDistance;
      } else {
        return minSquaredDistance;
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'containsXY',
    value: function containsXY(x, y) {
      var flatCoordinates = this.flatCoordinates;
      var dx = x - flatCoordinates[0];
      var dy = y - flatCoordinates[1];
      return dx * dx + dy * dy <= this.getRadiusSquared_();
    }

    /**
     * Return the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
     * @return {module:ol/coordinate~Coordinate} Center.
     * @api
     */

  }, {
    key: 'getCenter',
    value: function getCenter() {
      return this.flatCoordinates.slice(0, this.stride);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'computeExtent',
    value: function computeExtent(extent) {
      var flatCoordinates = this.flatCoordinates;
      var radius = flatCoordinates[this.stride] - flatCoordinates[0];
      return (0, _extent.createOrUpdate)(flatCoordinates[0] - radius, flatCoordinates[1] - radius, flatCoordinates[0] + radius, flatCoordinates[1] + radius, extent);
    }

    /**
     * Return the radius of the circle.
     * @return {number} Radius.
     * @api
     */

  }, {
    key: 'getRadius',
    value: function getRadius() {
      return Math.sqrt(this.getRadiusSquared_());
    }

    /**
     * @private
     * @return {number} Radius squared.
     */

  }, {
    key: 'getRadiusSquared_',
    value: function getRadiusSquared_() {
      var dx = this.flatCoordinates[this.stride] - this.flatCoordinates[0];
      var dy = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
      return dx * dx + dy * dy;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.CIRCLE;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      var circleExtent = this.getExtent();
      if ((0, _extent.intersects)(extent, circleExtent)) {
        var center = this.getCenter();

        if (extent[0] <= center[0] && extent[2] >= center[0]) {
          return true;
        }
        if (extent[1] <= center[1] && extent[3] >= center[1]) {
          return true;
        }

        return (0, _extent.forEachCorner)(extent, this.intersectsCoordinate, this);
      }
      return false;
    }

    /**
     * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
     * @param {module:ol/coordinate~Coordinate} center Center.
     * @api
     */

  }, {
    key: 'setCenter',
    value: function setCenter(center) {
      var stride = this.stride;
      var radius = this.flatCoordinates[stride] - this.flatCoordinates[0];
      var flatCoordinates = center.slice();
      flatCoordinates[stride] = flatCoordinates[0] + radius;
      for (var i = 1; i < stride; ++i) {
        flatCoordinates[stride + i] = center[i];
      }
      this.setFlatCoordinates(this.layout, flatCoordinates);
      this.changed();
    }

    /**
     * Set the center (as {@link module:ol/coordinate~Coordinate coordinate}) and the radius (as
     * number) of the circle.
     * @param {!module:ol/coordinate~Coordinate} center Center.
     * @param {number} radius Radius.
     * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
     * @api
     */

  }, {
    key: 'setCenterAndRadius',
    value: function setCenterAndRadius(center, radius, opt_layout) {
      this.setLayout(opt_layout, center, 0);
      if (!this.flatCoordinates) {
        this.flatCoordinates = [];
      }
      /** @type {Array<number>} */
      var flatCoordinates = this.flatCoordinates;
      var offset = (0, _deflate.deflateCoordinate)(flatCoordinates, 0, center, this.stride);
      flatCoordinates[offset++] = flatCoordinates[0] + radius;
      for (var i = 1, ii = this.stride; i < ii; ++i) {
        flatCoordinates[offset++] = flatCoordinates[i];
      }
      flatCoordinates.length = offset;
      this.changed();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates() {}

    /**
     * @inheritDoc
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {}

    /**
     * Set the radius of the circle. The radius is in the units of the projection.
     * @param {number} radius Radius.
     * @api
     */

  }, {
    key: 'setRadius',
    value: function setRadius(radius) {
      this.flatCoordinates[this.stride] = this.flatCoordinates[0] + radius;
      this.changed();
    }
  }]);

  return Circle;
}(_SimpleGeometry3.default);

/**
 * Transform each coordinate of the circle from one coordinate reference system
 * to another. The geometry is modified in place.
 * If you do not want the geometry modified in place, first clone() it and
 * then use this function on the clone.
 *
 * Internally a circle is currently represented by two points: the center of
 * the circle `[cx, cy]`, and the point to the right of the circle
 * `[cx + r, cy]`. This `transform` function just transforms these two points.
 * So the resulting geometry is also a circle, and that circle does not
 * correspond to the shape that would be obtained by transforming every point
 * of the original circle.
 *
 * @param {module:ol/proj~ProjectionLike} source The current projection.  Can be a
 *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
 * @param {module:ol/proj~ProjectionLike} destination The desired projection.  Can be a
 *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
 * @return {module:ol/geom/Circle} This geometry.  Note that original geometry is
 *     modified in place.
 * @function
 * @api
 */


Circle.prototype.transform;
exports.default = Circle;