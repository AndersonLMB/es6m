'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../extent.js');

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry2 = require('../geom/SimpleGeometry.js');

var _SimpleGeometry3 = _interopRequireDefault(_SimpleGeometry2);

var _area = require('../geom/flat/area.js');

var _closest = require('../geom/flat/closest.js');

var _deflate = require('../geom/flat/deflate.js');

var _inflate = require('../geom/flat/inflate.js');

var _simplify = require('../geom/flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/LinearRing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Linear ring geometry. Only used as part of polygon; cannot be rendered
 * on its own.
 *
 * @api
 */
var LinearRing = function (_SimpleGeometry) {
  _inherits(LinearRing, _SimpleGeometry);

  /**
   * @param {Array<module:ol/coordinate~Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `opt_layout` are also accepted.
   * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
   */
  function LinearRing(coordinates, opt_layout) {
    _classCallCheck(this, LinearRing);

    /**
     * @private
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (LinearRing.__proto__ || Object.getPrototypeOf(LinearRing)).call(this));

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
   * Make a complete copy of the geometry.
   * @return {!module:ol/geom/LinearRing} Clone.
   * @override
   * @api
   */


  _createClass(LinearRing, [{
    key: 'clone',
    value: function clone() {
      return new LinearRing(this.flatCoordinates.slice(), this.layout);
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
      return (0, _closest.assignClosestPoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
    }

    /**
     * Return the area of the linear ring on projected plane.
     * @return {number} Area (on projected plane).
     * @api
     */

  }, {
    key: 'getArea',
    value: function getArea() {
      return (0, _area.linearRing)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }

    /**
     * Return the coordinates of the linear ring.
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
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometryInternal',
    value: function getSimplifiedGeometryInternal(squaredTolerance) {
      var simplifiedFlatCoordinates = [];
      simplifiedFlatCoordinates.length = (0, _simplify.douglasPeucker)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
      return new LinearRing(simplifiedFlatCoordinates, _GeometryLayout2.default.XY);
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.LINEAR_RING;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {}

    /**
     * Set the coordinates of the linear ring.
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

  return LinearRing;
}(_SimpleGeometry3.default);

exports.default = LinearRing;