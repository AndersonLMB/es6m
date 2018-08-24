'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _extent = require('../extent.js');

var _functions = require('../functions.js');

var _transform = require('../geom/flat/transform.js');

var _proj = require('../proj.js');

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

var _transform2 = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/Geometry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {module:ol/transform~Transform}
 */
var tmpTransform = (0, _transform2.create)();

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for vector geometries.
 *
 * To get notified of changes to the geometry, register a listener for the
 * generic `change` event on your geometry instance.
 *
 * @abstract
 * @api
 */

var Geometry = function (_BaseObject) {
  _inherits(Geometry, _BaseObject);

  function Geometry() {
    _classCallCheck(this, Geometry);

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    var _this = _possibleConstructorReturn(this, (Geometry.__proto__ || Object.getPrototypeOf(Geometry)).call(this));

    _this.extent_ = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {number}
     */
    _this.extentRevision_ = -1;

    /**
     * @protected
     * @type {Object<string, module:ol/geom/Geometry>}
     */
    _this.simplifiedGeometryCache = {};

    /**
     * @protected
     * @type {number}
     */
    _this.simplifiedGeometryMaxMinSquaredTolerance = 0;

    /**
     * @protected
     * @type {number}
     */
    _this.simplifiedGeometryRevision = 0;

    return _this;
  }

  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!module:ol/geom/Geometry} Clone.
   */


  _createClass(Geometry, [{
    key: 'clone',
    value: function clone() {}

    /**
     * @abstract
     * @param {number} x X.
     * @param {number} y Y.
     * @param {module:ol/coordinate~Coordinate} closestPoint Closest point.
     * @param {number} minSquaredDistance Minimum squared distance.
     * @return {number} Minimum squared distance.
     */

  }, {
    key: 'closestPointXY',
    value: function closestPointXY(x, y, closestPoint, minSquaredDistance) {}

    /**
     * Return the closest point of the geometry to the passed point as
     * {@link module:ol/coordinate~Coordinate coordinate}.
     * @param {module:ol/coordinate~Coordinate} point Point.
     * @param {module:ol/coordinate~Coordinate=} opt_closestPoint Closest point.
     * @return {module:ol/coordinate~Coordinate} Closest point.
     * @api
     */

  }, {
    key: 'getClosestPoint',
    value: function getClosestPoint(point, opt_closestPoint) {
      var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
      this.closestPointXY(point[0], point[1], closestPoint, Infinity);
      return closestPoint;
    }

    /**
     * Returns true if this geometry includes the specified coordinate. If the
     * coordinate is on the boundary of the geometry, returns false.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @return {boolean} Contains coordinate.
     * @api
     */

  }, {
    key: 'intersectsCoordinate',
    value: function intersectsCoordinate(coordinate) {
      return this.containsXY(coordinate[0], coordinate[1]);
    }

    /**
     * @abstract
     * @param {module:ol/extent~Extent} extent Extent.
     * @protected
     * @return {module:ol/extent~Extent} extent Extent.
     */

  }, {
    key: 'computeExtent',
    value: function computeExtent(extent) {}

    /**
     * Get the extent of the geometry.
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} extent Extent.
     * @api
     */

  }, {
    key: 'getExtent',
    value: function getExtent(opt_extent) {
      if (this.extentRevision_ != this.getRevision()) {
        this.extent_ = this.computeExtent(this.extent_);
        this.extentRevision_ = this.getRevision();
      }
      return (0, _extent.returnOrUpdate)(this.extent_, opt_extent);
    }

    /**
     * Rotate the geometry around a given coordinate. This modifies the geometry
     * coordinates in place.
     * @abstract
     * @param {number} angle Rotation angle in radians.
     * @param {module:ol/coordinate~Coordinate} anchor The rotation center.
     * @api
     */

  }, {
    key: 'rotate',
    value: function rotate(angle, anchor) {}

    /**
     * Scale the geometry (with an optional origin).  This modifies the geometry
     * coordinates in place.
     * @abstract
     * @param {number} sx The scaling factor in the x-direction.
     * @param {number=} opt_sy The scaling factor in the y-direction (defaults to
     *     sx).
     * @param {module:ol/coordinate~Coordinate=} opt_anchor The scale origin (defaults to the center
     *     of the geometry extent).
     * @api
     */

  }, {
    key: 'scale',
    value: function scale(sx, opt_sy, opt_anchor) {}

    /**
     * Create a simplified version of this geometry.  For linestrings, this uses
     * the the {@link
     * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
     * Douglas Peucker} algorithm.  For polygons, a quantization-based
     * simplification is used to preserve topology.
     * @function
     * @param {number} tolerance The tolerance distance for simplification.
     * @return {module:ol/geom/Geometry} A new, simplified version of the original
     *     geometry.
     * @api
     */

  }, {
    key: 'simplify',
    value: function simplify(tolerance) {
      return this.getSimplifiedGeometry(tolerance * tolerance);
    }

    /**
     * Create a simplified version of this geometry using the Douglas Peucker
     * algorithm.
     * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
     * @abstract
     * @param {number} squaredTolerance Squared tolerance.
     * @return {module:ol/geom/Geometry} Simplified geometry.
     */

  }, {
    key: 'getSimplifiedGeometry',
    value: function getSimplifiedGeometry(squaredTolerance) {}

    /**
     * Get the type of this geometry.
     * @abstract
     * @return {module:ol/geom/GeometryType} Geometry type.
     */

  }, {
    key: 'getType',
    value: function getType() {}

    /**
     * Apply a transform function to each coordinate of the geometry.
     * The geometry is modified in place.
     * If you do not want the geometry modified in place, first `clone()` it and
     * then use this function on the clone.
     * @abstract
     * @param {module:ol/proj~TransformFunction} transformFn Transform.
     */

  }, {
    key: 'applyTransform',
    value: function applyTransform(transformFn) {}

    /**
     * Test if the geometry and the passed extent intersect.
     * @abstract
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {boolean} `true` if the geometry and the extent intersect.
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {}

    /**
     * Translate the geometry.  This modifies the geometry coordinates in place.  If
     * instead you want a new geometry, first `clone()` this geometry.
     * @abstract
     * @param {number} deltaX Delta X.
     * @param {number} deltaY Delta Y.
     * @api
     */

  }, {
    key: 'translate',
    value: function translate(deltaX, deltaY) {}

    /**
     * Transform each coordinate of the geometry from one coordinate reference
     * system to another. The geometry is modified in place.
     * For example, a line will be transformed to a line and a circle to a circle.
     * If you do not want the geometry modified in place, first `clone()` it and
     * then use this function on the clone.
     *
     * @param {module:ol/proj~ProjectionLike} source The current projection.  Can be a
     *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
     * @param {module:ol/proj~ProjectionLike} destination The desired projection.  Can be a
     *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
     * @return {module:ol/geom/Geometry} This geometry.  Note that original geometry is
     *     modified in place.
     * @api
     */

  }, {
    key: 'transform',
    value: function transform(source, destination) {
      source = (0, _proj.get)(source);
      var transformFn = source.getUnits() == _Units2.default.TILE_PIXELS ? function (inCoordinates, outCoordinates, stride) {
        var pixelExtent = source.getExtent();
        var projectedExtent = source.getWorldExtent();
        var scale = (0, _extent.getHeight)(projectedExtent) / (0, _extent.getHeight)(pixelExtent);
        (0, _transform2.compose)(tmpTransform, projectedExtent[0], projectedExtent[3], scale, -scale, 0, 0, 0);
        (0, _transform.transform2D)(inCoordinates, 0, inCoordinates.length, stride, tmpTransform, outCoordinates);
        return (0, _proj.getTransform)(source, destination)(inCoordinates, outCoordinates, stride);
      } : (0, _proj.getTransform)(source, destination);
      this.applyTransform(transformFn);
      return this;
    }
  }]);

  return Geometry;
}(_Object2.default);

/**
 * @param {number} x X.
 * @param {number} y Y.
 * @return {boolean} Contains (x, y).
 */


Geometry.prototype.containsXY = _functions.FALSE;

exports.default = Geometry;