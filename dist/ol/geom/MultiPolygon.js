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

var _MultiPoint = require('../geom/MultiPoint.js');

var _MultiPoint2 = _interopRequireDefault(_MultiPoint);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _area = require('../geom/flat/area.js');

var _center = require('../geom/flat/center.js');

var _closest = require('../geom/flat/closest.js');

var _contains = require('../geom/flat/contains.js');

var _deflate = require('../geom/flat/deflate.js');

var _inflate = require('../geom/flat/inflate.js');

var _interiorpoint = require('../geom/flat/interiorpoint.js');

var _intersectsextent = require('../geom/flat/intersectsextent.js');

var _orient = require('../geom/flat/orient.js');

var _simplify = require('../geom/flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/MultiPolygon
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Multi-polygon geometry.
 *
 * @api
 */
var MultiPolygon = function (_SimpleGeometry) {
  _inherits(MultiPolygon, _SimpleGeometry);

  /**
   * @param {Array<Array<Array<module:ol/coordinate~Coordinate>>>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinats in combination with `opt_layout` and `opt_endss` are also accepted.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   * @param {Array<number>} opt_endss Array of ends for internal use with flat coordinates.
   */
  function MultiPolygon(coordinates, opt_layout, opt_endss) {
    _classCallCheck(this, MultiPolygon);

    /**
     * @type {Array<Array<number>>}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (MultiPolygon.__proto__ || Object.getPrototypeOf(MultiPolygon)).call(this));

    _this.endss_ = [];

    /**
     * @private
     * @type {number}
     */
    _this.flatInteriorPointsRevision_ = -1;

    /**
     * @private
     * @type {Array<number>}
     */
    _this.flatInteriorPoints_ = null;

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

    /**
     * @private
     * @type {number}
     */
    _this.orientedRevision_ = -1;

    /**
     * @private
     * @type {Array<number>}
     */
    _this.orientedFlatCoordinates_ = null;

    if (!opt_endss && !Array.isArray(coordinates[0])) {
      var layout = _this.getLayout();
      var flatCoordinates = [];
      var endss = [];
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        var polygon = coordinates[i];
        if (i === 0) {
          layout = polygon.getLayout();
        }
        var offset = flatCoordinates.length;
        var ends = polygon.getEnds();
        for (var j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] += offset;
        }
        (0, _array.extend)(flatCoordinates, polygon.getFlatCoordinates());
        endss.push(ends);
      }
      opt_layout = layout;
      coordinates = flatCoordinates;
      opt_endss = endss;
    }
    if (opt_layout !== undefined && opt_endss) {
      _this.setFlatCoordinates(opt_layout, coordinates);
      _this.endss_ = opt_endss;
    } else {
      _this.setCoordinates(coordinates, opt_layout);
    }

    return _this;
  }

  /**
   * Append the passed polygon to this multipolygon.
   * @param {module:ol/geom/Polygon} polygon Polygon.
   * @api
   */


  _createClass(MultiPolygon, [{
    key: 'appendPolygon',
    value: function appendPolygon(polygon) {
      /** @type {Array<number>} */
      var ends = void 0;
      if (!this.flatCoordinates) {
        this.flatCoordinates = polygon.getFlatCoordinates().slice();
        ends = polygon.getEnds().slice();
        this.endss_.push();
      } else {
        var offset = this.flatCoordinates.length;
        (0, _array.extend)(this.flatCoordinates, polygon.getFlatCoordinates());
        ends = polygon.getEnds().slice();
        for (var i = 0, ii = ends.length; i < ii; ++i) {
          ends[i] += offset;
        }
      }
      this.endss_.push(ends);
      this.changed();
    }

    /**
     * Make a complete copy of the geometry.
     * @return {!module:ol/geom/MultiPolygon} Clone.
     * @override
     * @api
     */

  }, {
    key: 'clone',
    value: function clone() {
      var len = this.endss_.length;
      var newEndss = new Array(len);
      for (var i = 0; i < len; ++i) {
        newEndss[i] = this.endss_[i].slice();
      }

      return new MultiPolygon(this.flatCoordinates.slice(), this.layout, newEndss);
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
        this.maxDelta_ = Math.sqrt((0, _closest.multiArrayMaxSquaredDelta)(this.flatCoordinates, 0, this.endss_, this.stride, 0));
        this.maxDeltaRevision_ = this.getRevision();
      }
      return (0, _closest.assignClosestMultiArrayPoint)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'containsXY',
    value: function containsXY(x, y) {
      return (0, _contains.linearRingssContainsXY)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, x, y);
    }

    /**
     * Return the area of the multipolygon on projected plane.
     * @return {number} Area (on projected plane).
     * @api
     */

  }, {
    key: 'getArea',
    value: function getArea() {
      return (0, _area.linearRingss)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride);
    }

    /**
     * Get the coordinate array for this geometry.  This array has the structure
     * of a GeoJSON coordinate array for multi-polygons.
     *
     * @param {boolean=} opt_right Orient coordinates according to the right-hand
     *     rule (counter-clockwise for exterior and clockwise for interior rings).
     *     If `false`, coordinates will be oriented according to the left-hand rule
     *     (clockwise for exterior and counter-clockwise for interior rings).
     *     By default, coordinate orientation will depend on how the geometry was
     *     constructed.
     * @return {Array<Array<Array<module:ol/coordinate~Coordinate>>>} Coordinates.
     * @override
     * @api
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates(opt_right) {
      var flatCoordinates = void 0;
      if (opt_right !== undefined) {
        flatCoordinates = this.getOrientedFlatCoordinates().slice();
        (0, _orient.orientLinearRingsArray)(flatCoordinates, 0, this.endss_, this.stride, opt_right);
      } else {
        flatCoordinates = this.flatCoordinates;
      }

      return (0, _inflate.inflateMultiCoordinatesArray)(flatCoordinates, 0, this.endss_, this.stride);
    }

    /**
     * @return {Array<Array<number>>} Endss.
     */

  }, {
    key: 'getEndss',
    value: function getEndss() {
      return this.endss_;
    }

    /**
     * @return {Array<number>} Flat interior points.
     */

  }, {
    key: 'getFlatInteriorPoints',
    value: function getFlatInteriorPoints() {
      if (this.flatInteriorPointsRevision_ != this.getRevision()) {
        var flatCenters = (0, _center.linearRingss)(this.flatCoordinates, 0, this.endss_, this.stride);
        this.flatInteriorPoints_ = (0, _interiorpoint.getInteriorPointsOfMultiArray)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, flatCenters);
        this.flatInteriorPointsRevision_ = this.getRevision();
      }
      return this.flatInteriorPoints_;
    }

    /**
     * Return the interior points as {@link module:ol/geom/MultiPoint multipoint}.
     * @return {module:ol/geom/MultiPoint} Interior points as XYM coordinates, where M is
     * the length of the horizontal intersection that the point belongs to.
     * @api
     */

  }, {
    key: 'getInteriorPoints',
    value: function getInteriorPoints() {
      return new _MultiPoint2.default(this.getFlatInteriorPoints().slice(), _GeometryLayout2.default.XYM);
    }

    /**
     * @return {Array<number>} Oriented flat coordinates.
     */

  }, {
    key: 'getOrientedFlatCoordinates',
    value: function getOrientedFlatCoordinates() {
      if (this.orientedRevision_ != this.getRevision()) {
        var flatCoordinates = this.flatCoordinates;
        if ((0, _orient.linearRingsAreOriented)(flatCoordinates, 0, this.endss_, this.stride)) {
          this.orientedFlatCoordinates_ = flatCoordinates;
        } else {
          this.orientedFlatCoordinates_ = flatCoordinates.slice();
          this.orientedFlatCoordinates_.length = (0, _orient.orientLinearRingsArray)(this.orientedFlatCoordinates_, 0, this.endss_, this.stride);
        }
        this.orientedRevision_ = this.getRevision();
      }
      return this.orientedFlatCoordinates_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometryInternal',
    value: function getSimplifiedGeometryInternal(squaredTolerance) {
      var simplifiedFlatCoordinates = [];
      var simplifiedEndss = [];
      simplifiedFlatCoordinates.length = (0, _simplify.quantizeMultiArray)(this.flatCoordinates, 0, this.endss_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEndss);
      return new MultiPolygon(simplifiedFlatCoordinates, _GeometryLayout2.default.XY, simplifiedEndss);
    }

    /**
     * Return the polygon at the specified index.
     * @param {number} index Index.
     * @return {module:ol/geom/Polygon} Polygon.
     * @api
     */

  }, {
    key: 'getPolygon',
    value: function getPolygon(index) {
      if (index < 0 || this.endss_.length <= index) {
        return null;
      }
      var offset = void 0;
      if (index === 0) {
        offset = 0;
      } else {
        var prevEnds = this.endss_[index - 1];
        offset = prevEnds[prevEnds.length - 1];
      }
      var ends = this.endss_[index].slice();
      var end = ends[ends.length - 1];
      if (offset !== 0) {
        for (var i = 0, ii = ends.length; i < ii; ++i) {
          ends[i] -= offset;
        }
      }
      return new _Polygon2.default(this.flatCoordinates.slice(offset, end), this.layout, ends);
    }

    /**
     * Return the polygons of this multipolygon.
     * @return {Array<module:ol/geom/Polygon>} Polygons.
     * @api
     */

  }, {
    key: 'getPolygons',
    value: function getPolygons() {
      var layout = this.layout;
      var flatCoordinates = this.flatCoordinates;
      var endss = this.endss_;
      var polygons = [];
      var offset = 0;
      for (var i = 0, ii = endss.length; i < ii; ++i) {
        var ends = endss[i].slice();
        var end = ends[ends.length - 1];
        if (offset !== 0) {
          for (var j = 0, jj = ends.length; j < jj; ++j) {
            ends[j] -= offset;
          }
        }
        var polygon = new _Polygon2.default(flatCoordinates.slice(offset, end), layout, ends);
        polygons.push(polygon);
        offset = end;
      }
      return polygons;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.MULTI_POLYGON;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      return (0, _intersectsextent.intersectsLinearRingMultiArray)(this.getOrientedFlatCoordinates(), 0, this.endss_, this.stride, extent);
    }

    /**
     * Set the coordinates of the multipolygon.
     * @param {!Array<Array<Array<module:ol/coordinate~Coordinate>>>} coordinates Coordinates.
     * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
     * @override
     * @api
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {
      this.setLayout(opt_layout, coordinates, 3);
      if (!this.flatCoordinates) {
        this.flatCoordinates = [];
      }
      var endss = (0, _deflate.deflateMultiCoordinatesArray)(this.flatCoordinates, 0, coordinates, this.stride, this.endss_);
      if (endss.length === 0) {
        this.flatCoordinates.length = 0;
      } else {
        var lastEnds = endss[endss.length - 1];
        this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
      }
      this.changed();
    }
  }]);

  return MultiPolygon;
}(_SimpleGeometry3.default);

exports.default = MultiPolygon;