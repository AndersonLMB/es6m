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

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _closest = require('../geom/flat/closest.js');

var _deflate = require('../geom/flat/deflate.js');

var _inflate = require('../geom/flat/inflate.js');

var _interpolate = require('../geom/flat/interpolate.js');

var _intersectsextent = require('../geom/flat/intersectsextent.js');

var _simplify = require('../geom/flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/MultiLineString
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Multi-linestring geometry.
 *
 * @api
 */
var MultiLineString = function (_SimpleGeometry) {
  _inherits(MultiLineString, _SimpleGeometry);

  /**
   * @param {Array<Array<module:ol/coordinate~Coordinate>|module:ol/geom~MultiLineString>|Array<number>} coordinates
   *     Coordinates or LineString geometries. (For internal use, flat coordinates in
   *     combination with `opt_layout` and `opt_ends` are also accepted.)
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   * @param {Array<number>} opt_ends Flat coordinate ends for internal use.
   */
  function MultiLineString(coordinates, opt_layout, opt_ends) {
    _classCallCheck(this, MultiLineString);

    /**
     * @type {Array<number>}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (MultiLineString.__proto__ || Object.getPrototypeOf(MultiLineString)).call(this));

    _this.ends_ = [];

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

    if (Array.isArray(coordinates[0])) {
      _this.setCoordinates(coordinates, opt_layout);
    } else if (opt_layout !== undefined && opt_ends) {
      _this.setFlatCoordinates(opt_layout, coordinates);
      _this.ends_ = opt_ends;
    } else {
      var layout = _this.getLayout();
      var flatCoordinates = [];
      var ends = [];
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        var lineString = coordinates[i];
        if (i === 0) {
          layout = lineString.getLayout();
        }
        (0, _array.extend)(flatCoordinates, lineString.getFlatCoordinates());
        ends.push(flatCoordinates.length);
      }
      _this.setFlatCoordinates(layout, flatCoordinates);
      _this.ends_ = ends;
    }

    return _this;
  }

  /**
   * Append the passed linestring to the multilinestring.
   * @param {module:ol/geom/LineString} lineString LineString.
   * @api
   */


  _createClass(MultiLineString, [{
    key: 'appendLineString',
    value: function appendLineString(lineString) {
      if (!this.flatCoordinates) {
        this.flatCoordinates = lineString.getFlatCoordinates().slice();
      } else {
        (0, _array.extend)(this.flatCoordinates, lineString.getFlatCoordinates().slice());
      }
      this.ends_.push(this.flatCoordinates.length);
      this.changed();
    }

    /**
     * Make a complete copy of the geometry.
     * @return {!module:ol/geom/MultiLineString} Clone.
     * @override
     * @api
     */

  }, {
    key: 'clone',
    value: function clone() {
      return new MultiLineString(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
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
        this.maxDelta_ = Math.sqrt((0, _closest.arrayMaxSquaredDelta)(this.flatCoordinates, 0, this.ends_, this.stride, 0));
        this.maxDeltaRevision_ = this.getRevision();
      }
      return (0, _closest.assignClosestArrayPoint)(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
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
     * `opt_interpolate` controls interpolation between consecutive LineStrings
     * within the MultiLineString. If `opt_interpolate` is `true` the coordinates
     * will be linearly interpolated between the last coordinate of one LineString
     * and the first coordinate of the next LineString.  If `opt_interpolate` is
     * `false` then the function will return `null` for Ms falling between
     * LineStrings.
     *
     * @param {number} m M.
     * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
     * @param {boolean=} opt_interpolate Interpolate. Default is `false`.
     * @return {module:ol/coordinate~Coordinate} Coordinate.
     * @api
     */

  }, {
    key: 'getCoordinateAtM',
    value: function getCoordinateAtM(m, opt_extrapolate, opt_interpolate) {
      if (this.layout != _GeometryLayout2.default.XYM && this.layout != _GeometryLayout2.default.XYZM || this.flatCoordinates.length === 0) {
        return null;
      }
      var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
      var interpolate = opt_interpolate !== undefined ? opt_interpolate : false;
      return (0, _interpolate.lineStringsCoordinateAtM)(this.flatCoordinates, 0, this.ends_, this.stride, m, extrapolate, interpolate);
    }

    /**
     * Return the coordinates of the multilinestring.
     * @return {Array<Array<module:ol/coordinate~Coordinate>>} Coordinates.
     * @override
     * @api
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates() {
      return (0, _inflate.inflateCoordinatesArray)(this.flatCoordinates, 0, this.ends_, this.stride);
    }

    /**
     * @return {Array<number>} Ends.
     */

  }, {
    key: 'getEnds',
    value: function getEnds() {
      return this.ends_;
    }

    /**
     * Return the linestring at the specified index.
     * @param {number} index Index.
     * @return {module:ol/geom/LineString} LineString.
     * @api
     */

  }, {
    key: 'getLineString',
    value: function getLineString(index) {
      if (index < 0 || this.ends_.length <= index) {
        return null;
      }
      return new _LineString2.default(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
    }

    /**
     * Return the linestrings of this multilinestring.
     * @return {Array<module:ol/geom/LineString>} LineStrings.
     * @api
     */

  }, {
    key: 'getLineStrings',
    value: function getLineStrings() {
      var flatCoordinates = this.flatCoordinates;
      var ends = this.ends_;
      var layout = this.layout;
      /** @type {Array<module:ol/geom/LineString>} */
      var lineStrings = [];
      var offset = 0;
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        var lineString = new _LineString2.default(flatCoordinates.slice(offset, end), layout);
        lineStrings.push(lineString);
        offset = end;
      }
      return lineStrings;
    }

    /**
     * @return {Array<number>} Flat midpoints.
     */

  }, {
    key: 'getFlatMidpoints',
    value: function getFlatMidpoints() {
      var midpoints = [];
      var flatCoordinates = this.flatCoordinates;
      var offset = 0;
      var ends = this.ends_;
      var stride = this.stride;
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        var midpoint = (0, _interpolate.interpolatePoint)(flatCoordinates, offset, end, stride, 0.5);
        (0, _array.extend)(midpoints, midpoint);
        offset = end;
      }
      return midpoints;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometryInternal',
    value: function getSimplifiedGeometryInternal(squaredTolerance) {
      var simplifiedFlatCoordinates = [];
      var simplifiedEnds = [];
      simplifiedFlatCoordinates.length = (0, _simplify.douglasPeuckerArray)(this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0, simplifiedEnds);
      return new MultiLineString(simplifiedFlatCoordinates, _GeometryLayout2.default.XY, simplifiedEnds);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.MULTI_LINE_STRING;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      return (0, _intersectsextent.intersectsLineStringArray)(this.flatCoordinates, 0, this.ends_, this.stride, extent);
    }

    /**
     * Set the coordinates of the multilinestring.
     * @param {!Array<Array<module:ol/coordinate~Coordinate>>} coordinates Coordinates.
     * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
     * @override
     * @api
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {
      this.setLayout(opt_layout, coordinates, 2);
      if (!this.flatCoordinates) {
        this.flatCoordinates = [];
      }
      var ends = (0, _deflate.deflateCoordinatesArray)(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
      this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
      this.changed();
    }
  }]);

  return MultiLineString;
}(_SimpleGeometry3.default);

exports.default = MultiLineString;