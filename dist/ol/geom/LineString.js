'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _closest = require('../geom/flat/closest.js');

var _deflate = require('../geom/flat/deflate.js');

var _inflate = require('../geom/flat/inflate.js');

var _interpolate = require('../geom/flat/interpolate.js');

var _intersectsextent = require('../geom/flat/intersectsextent.js');

var _length = require('../geom/flat/length.js');

var _segments = require('../geom/flat/segments.js');

var _simplify = require('../geom/flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/LineString
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Linestring geometry.
 *
 * @api
 */
var LineString = function (_SimpleGeometry) {
  _inherits(LineString, _SimpleGeometry);

  /**
   * @param {Array<module:ol/coordinate~Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   */
  function LineString(coordinates, opt_layout) {
    _classCallCheck(this, LineString);

    /**
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    var _this = _possibleConstructorReturn(this, (LineString.__proto__ || Object.getPrototypeOf(LineString)).call(this));

    _this.flatMidpoint_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.flatMidpointRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    _this.maxDelta_ = -1;

    /**
     * @private
     * @type {number}
     */
    _this.maxDeltaRevision_ = -1;

    if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
      _this.setFlatCoordinates(opt_layout, coordinates);
    } else {
      _this.setCoordinates(coordinates, opt_layout);
    }

    return _this;
  }

  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
   * @api
   */


  _createClass(LineString, [{
    key: 'appendCoordinate',
    value: function appendCoordinate(coordinate) {
      if (!this.flatCoordinates) {
        this.flatCoordinates = coordinate.slice();
      } else {
        (0, _array.extend)(this.flatCoordinates, coordinate);
      }
      this.changed();
    }

    /**
     * Make a complete copy of the geometry.
     * @return {!module:ol/geom/LineString} Clone.
     * @override
     * @api
     */

  }, {
    key: 'clone',
    value: function clone() {
      return new LineString(this.flatCoordinates.slice(), this.layout);
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
      if (this.maxDeltaRevision_ != this.getRevision()) {
        this.maxDelta_ = Math.sqrt((0, _closest.maxSquaredDelta)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
        this.maxDeltaRevision_ = this.getRevision();
      }
      return (0, _closest.assignClosestPoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
    }

    /**
     * Iterate over each segment, calling the provided callback.
     * If the callback returns a truthy value the function returns that
     * value immediately. Otherwise the function returns `false`.
     *
     * @param {function(this: S, module:ol/coordinate~Coordinate, module:ol/coordinate~Coordinate): T} callback Function
     *     called for each segment.
     * @return {T|boolean} Value.
     * @template T,S
     * @api
     */

  }, {
    key: 'forEachSegment',
    value: function forEachSegment(callback) {
      return (0, _segments.forEach)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, callback);
    }

    /**
     * Returns the coordinate at `m` using linear interpolation, or `null` if no
     * such coordinate exists.
     *
     * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
     * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
     * M will return the first coordinate and Ms greater than the last M will
     * return the last coordinate.
     *
     * @param {number} m M.
     * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
     * @return {module:ol/coordinate~Coordinate} Coordinate.
     * @api
     */

  }, {
    key: 'getCoordinateAtM',
    value: function getCoordinateAtM(m, opt_extrapolate) {
      if (this.layout != _GeometryLayout2.default.XYM && this.layout != _GeometryLayout2.default.XYZM) {
        return null;
      }
      var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
      return (0, _interpolate.lineStringCoordinateAtM)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, m, extrapolate);
    }

    /**
     * Return the coordinates of the linestring.
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
     * Return the coordinate at the provided fraction along the linestring.
     * The `fraction` is a number between 0 and 1, where 0 is the start of the
     * linestring and 1 is the end.
     * @param {number} fraction Fraction.
     * @param {module:ol/coordinate~Coordinate=} opt_dest Optional coordinate whose values will
     *     be modified. If not provided, a new coordinate will be returned.
     * @return {module:ol/coordinate~Coordinate} Coordinate of the interpolated point.
     * @api
     */

  }, {
    key: 'getCoordinateAt',
    value: function getCoordinateAt(fraction, opt_dest) {
      return (0, _interpolate.interpolatePoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, fraction, opt_dest);
    }

    /**
     * Return the length of the linestring on projected plane.
     * @return {number} Length (on projected plane).
     * @api
     */

  }, {
    key: 'getLength',
    value: function getLength() {
      return (0, _length.lineStringLength)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }

    /**
     * @return {Array<number>} Flat midpoint.
     */

  }, {
    key: 'getFlatMidpoint',
    value: function getFlatMidpoint() {
      if (this.flatMidpointRevision_ != this.getRevision()) {
        this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
        this.flatMidpointRevision_ = this.getRevision();
      }
      return this.flatMidpoint_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometryInternal',
    value: function getSimplifiedGeometryInternal(squaredTolerance) {
      var simplifiedFlatCoordinates = [];
      simplifiedFlatCoordinates.length = (0, _simplify.douglasPeucker)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
      return new LineString(simplifiedFlatCoordinates, _GeometryLayout2.default.XY);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.LINE_STRING;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      return (0, _intersectsextent.intersectsLineString)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
    }

    /**
     * Set the coordinates of the linestring.
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

  return LineString;
}(_SimpleGeometry3.default);

exports.default = LineString;