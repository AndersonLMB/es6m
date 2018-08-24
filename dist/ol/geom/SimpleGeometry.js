'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getStrideForLayout = getStrideForLayout;
exports.transformGeom2D = transformGeom2D;

var _functions = require('../functions.js');

var _extent = require('../extent.js');

var _Geometry2 = require('../geom/Geometry.js');

var _Geometry3 = _interopRequireDefault(_Geometry2);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _transform = require('../geom/flat/transform.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/SimpleGeometry
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract base class; only used for creating subclasses; do not instantiate
 * in apps, as cannot be rendered.
 *
 * @abstract
 * @api
 */
var SimpleGeometry = function (_Geometry) {
  _inherits(SimpleGeometry, _Geometry);

  function SimpleGeometry() {
    _classCallCheck(this, SimpleGeometry);

    /**
     * @protected
     * @type {module:ol/geom/GeometryLayout}
     */
    var _this = _possibleConstructorReturn(this, (SimpleGeometry.__proto__ || Object.getPrototypeOf(SimpleGeometry)).call(this));

    _this.layout = _GeometryLayout2.default.XY;

    /**
     * @protected
     * @type {number}
     */
    _this.stride = 2;

    /**
     * @protected
     * @type {Array<number>}
     */
    _this.flatCoordinates = null;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(SimpleGeometry, [{
    key: 'computeExtent',
    value: function computeExtent(extent) {
      return (0, _extent.createOrUpdateFromFlatCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
    }

    /**
     * @abstract
     * @return {Array} Coordinates.
     */

  }, {
    key: 'getCoordinates',
    value: function getCoordinates() {}

    /**
     * Return the first coordinate of the geometry.
     * @return {module:ol/coordinate~Coordinate} First coordinate.
     * @api
     */

  }, {
    key: 'getFirstCoordinate',
    value: function getFirstCoordinate() {
      return this.flatCoordinates.slice(0, this.stride);
    }

    /**
     * @return {Array<number>} Flat coordinates.
     */

  }, {
    key: 'getFlatCoordinates',
    value: function getFlatCoordinates() {
      return this.flatCoordinates;
    }

    /**
     * Return the last coordinate of the geometry.
     * @return {module:ol/coordinate~Coordinate} Last point.
     * @api
     */

  }, {
    key: 'getLastCoordinate',
    value: function getLastCoordinate() {
      return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
    }

    /**
     * Return the {@link module:ol/geom/GeometryLayout~GeometryLayout layout} of the geometry.
     * @return {module:ol/geom/GeometryLayout} Layout.
     * @api
     */

  }, {
    key: 'getLayout',
    value: function getLayout() {
      return this.layout;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometry',
    value: function getSimplifiedGeometry(squaredTolerance) {
      if (this.simplifiedGeometryRevision != this.getRevision()) {
        (0, _obj.clear)(this.simplifiedGeometryCache);
        this.simplifiedGeometryMaxMinSquaredTolerance = 0;
        this.simplifiedGeometryRevision = this.getRevision();
      }
      // If squaredTolerance is negative or if we know that simplification will not
      // have any effect then just return this.
      if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance) {
        return this;
      }
      var key = squaredTolerance.toString();
      if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
        return this.simplifiedGeometryCache[key];
      } else {
        var simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
        var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
        if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
          this.simplifiedGeometryCache[key] = simplifiedGeometry;
          return simplifiedGeometry;
        } else {
          // Simplification did not actually remove any coordinates.  We now know
          // that any calls to getSimplifiedGeometry with a squaredTolerance less
          // than or equal to the current squaredTolerance will also not have any
          // effect.  This allows us to short circuit simplification (saving CPU
          // cycles) and prevents the cache of simplified geometries from filling
          // up with useless identical copies of this geometry (saving memory).
          this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
          return this;
        }
      }
    }

    /**
     * @param {number} squaredTolerance Squared tolerance.
     * @return {module:ol/geom/SimpleGeometry} Simplified geometry.
     * @protected
     */

  }, {
    key: 'getSimplifiedGeometryInternal',
    value: function getSimplifiedGeometryInternal(squaredTolerance) {
      return this;
    }

    /**
     * @return {number} Stride.
     */

  }, {
    key: 'getStride',
    value: function getStride() {
      return this.stride;
    }

    /**
     * @param {module:ol/geom/GeometryLayout} layout Layout.
     * @param {Array<number>} flatCoordinates Flat coordinates.
      */

  }, {
    key: 'setFlatCoordinates',
    value: function setFlatCoordinates(layout, flatCoordinates) {
      this.stride = getStrideForLayout(layout);
      this.layout = layout;
      this.flatCoordinates = flatCoordinates;
    }

    /**
     * @abstract
     * @param {!Array} coordinates Coordinates.
     * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
     */

  }, {
    key: 'setCoordinates',
    value: function setCoordinates(coordinates, opt_layout) {}

    /**
     * @param {module:ol/geom/GeometryLayout|undefined} layout Layout.
     * @param {Array} coordinates Coordinates.
     * @param {number} nesting Nesting.
     * @protected
     */

  }, {
    key: 'setLayout',
    value: function setLayout(layout, coordinates, nesting) {
      /** @type {number} */
      var stride = void 0;
      if (layout) {
        stride = getStrideForLayout(layout);
      } else {
        for (var i = 0; i < nesting; ++i) {
          if (coordinates.length === 0) {
            this.layout = _GeometryLayout2.default.XY;
            this.stride = 2;
            return;
          } else {
            coordinates = /** @type {Array} */coordinates[0];
          }
        }
        stride = coordinates.length;
        layout = getLayoutForStride(stride);
      }
      this.layout = layout;
      this.stride = stride;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'applyTransform',
    value: function applyTransform(transformFn) {
      if (this.flatCoordinates) {
        transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
        this.changed();
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'rotate',
    value: function rotate(angle, anchor) {
      var flatCoordinates = this.getFlatCoordinates();
      if (flatCoordinates) {
        var stride = this.getStride();
        (0, _transform.rotate)(flatCoordinates, 0, flatCoordinates.length, stride, angle, anchor, flatCoordinates);
        this.changed();
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'scale',
    value: function scale(sx, opt_sy, opt_anchor) {
      var sy = opt_sy;
      if (sy === undefined) {
        sy = sx;
      }
      var anchor = opt_anchor;
      if (!anchor) {
        anchor = (0, _extent.getCenter)(this.getExtent());
      }
      var flatCoordinates = this.getFlatCoordinates();
      if (flatCoordinates) {
        var stride = this.getStride();
        (0, _transform.scale)(flatCoordinates, 0, flatCoordinates.length, stride, sx, sy, anchor, flatCoordinates);
        this.changed();
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'translate',
    value: function translate(deltaX, deltaY) {
      var flatCoordinates = this.getFlatCoordinates();
      if (flatCoordinates) {
        var stride = this.getStride();
        (0, _transform.translate)(flatCoordinates, 0, flatCoordinates.length, stride, deltaX, deltaY, flatCoordinates);
        this.changed();
      }
    }
  }]);

  return SimpleGeometry;
}(_Geometry3.default);

/**
 * @param {number} stride Stride.
 * @return {module:ol/geom/GeometryLayout} layout Layout.
 */


function getLayoutForStride(stride) {
  var layout = void 0;
  if (stride == 2) {
    layout = _GeometryLayout2.default.XY;
  } else if (stride == 3) {
    layout = _GeometryLayout2.default.XYZ;
  } else if (stride == 4) {
    layout = _GeometryLayout2.default.XYZM;
  }
  return (
    /** @type {module:ol/geom/GeometryLayout} */layout
  );
}

/**
 * @param {module:ol/geom/GeometryLayout} layout Layout.
 * @return {number} Stride.
 */
function getStrideForLayout(layout) {
  var stride = void 0;
  if (layout == _GeometryLayout2.default.XY) {
    stride = 2;
  } else if (layout == _GeometryLayout2.default.XYZ || layout == _GeometryLayout2.default.XYM) {
    stride = 3;
  } else if (layout == _GeometryLayout2.default.XYZM) {
    stride = 4;
  }
  return (/** @type {number} */stride
  );
}

/**
 * @inheritDoc
 */
SimpleGeometry.prototype.containsXY = _functions.FALSE;

/**
 * @param {module:ol/geom/SimpleGeometry} simpleGeometry Simple geometry.
 * @param {module:ol/transform~Transform} transform Transform.
 * @param {Array<number>=} opt_dest Destination.
 * @return {Array<number>} Transformed flat coordinates.
 */
function transformGeom2D(simpleGeometry, transform, opt_dest) {
  var flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    var stride = simpleGeometry.getStride();
    return (0, _transform.transform2D)(flatCoordinates, 0, flatCoordinates.length, stride, transform, opt_dest);
  }
}

exports.default = SimpleGeometry;