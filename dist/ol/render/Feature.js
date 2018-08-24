'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/render/Feature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _functions = require('../functions.js');

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _center = require('../geom/flat/center.js');

var _interiorpoint = require('../geom/flat/interiorpoint.js');

var _interpolate = require('../geom/flat/interpolate.js');

var _proj = require('../proj.js');

var _transform = require('../geom/flat/transform.js');

var _transform2 = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {module:ol/transform~Transform}
 */
var tmpTransform = (0, _transform2.create)();

/**
 * Lightweight, read-only, {@link module:ol/Feature~Feature} and {@link module:ol/geom/Geometry~Geometry} like
 * structure, optimized for vector tile rendering and styling. Geometry access
 * through the API is limited to getting the type and extent of the geometry.
 *
 * @param {module:ol/geom/GeometryType} type Geometry type.
 * @param {Array<number>} flatCoordinates Flat coordinates. These always need
 *     to be right-handed for polygons.
 * @param {Array<number>|Array<Array<number>>} ends Ends or Endss.
 * @param {Object<string, *>} properties Properties.
 * @param {number|string|undefined} id Feature id.
 */

var RenderFeature = function () {
  function RenderFeature(type, flatCoordinates, ends, properties, id) {
    _classCallCheck(this, RenderFeature);

    /**
    * @private
    * @type {module:ol/extent~Extent|undefined}
    */
    this.extent_;

    /**
    * @private
    * @type {number|string|undefined}
    */
    this.id_ = id;

    /**
    * @private
    * @type {module:ol/geom/GeometryType}
    */
    this.type_ = type;

    /**
    * @private
    * @type {Array<number>}
    */
    this.flatCoordinates_ = flatCoordinates;

    /**
    * @private
    * @type {Array<number>}
    */
    this.flatInteriorPoints_ = null;

    /**
    * @private
    * @type {Array<number>}
    */
    this.flatMidpoints_ = null;

    /**
    * @private
    * @type {Array<number>|Array<Array<number>>}
    */
    this.ends_ = ends;

    /**
    * @private
    * @type {Object<string, *>}
    */
    this.properties_ = properties;
  }

  /**
  * Get a feature property by its key.
  * @param {string} key Key
  * @return {*} Value for the requested key.
  * @api
  */


  _createClass(RenderFeature, [{
    key: 'get',
    value: function get(key) {
      return this.properties_[key];
    }

    /**
    * Get the extent of this feature's geometry.
    * @return {module:ol/extent~Extent} Extent.
    * @api
    */

  }, {
    key: 'getExtent',
    value: function getExtent() {
      if (!this.extent_) {
        this.extent_ = this.type_ === _GeometryType2.default.POINT ? (0, _extent.createOrUpdateFromCoordinate)(this.flatCoordinates_) : (0, _extent.createOrUpdateFromFlatCoordinates)(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2);
      }
      return this.extent_;
    }

    /**
    * @return {Array<number>} Flat interior points.
    */

  }, {
    key: 'getFlatInteriorPoint',
    value: function getFlatInteriorPoint() {
      if (!this.flatInteriorPoints_) {
        var flatCenter = (0, _extent.getCenter)(this.getExtent());
        this.flatInteriorPoints_ = (0, _interiorpoint.getInteriorPointOfArray)(this.flatCoordinates_, 0, this.ends_, 2, flatCenter, 0);
      }
      return this.flatInteriorPoints_;
    }

    /**
    * @return {Array<number>} Flat interior points.
    */

  }, {
    key: 'getFlatInteriorPoints',
    value: function getFlatInteriorPoints() {
      if (!this.flatInteriorPoints_) {
        var flatCenters = (0, _center.linearRingss)(this.flatCoordinates_, 0, this.ends_, 2);
        this.flatInteriorPoints_ = (0, _interiorpoint.getInteriorPointsOfMultiArray)(this.flatCoordinates_, 0, this.ends_, 2, flatCenters);
      }
      return this.flatInteriorPoints_;
    }

    /**
    * @return {Array<number>} Flat midpoint.
    */

  }, {
    key: 'getFlatMidpoint',
    value: function getFlatMidpoint() {
      if (!this.flatMidpoints_) {
        this.flatMidpoints_ = (0, _interpolate.interpolatePoint)(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2, 0.5);
      }
      return this.flatMidpoints_;
    }

    /**
    * @return {Array<number>} Flat midpoints.
    */

  }, {
    key: 'getFlatMidpoints',
    value: function getFlatMidpoints() {
      if (!this.flatMidpoints_) {
        this.flatMidpoints_ = [];
        var flatCoordinates = this.flatCoordinates_;
        var offset = 0;
        var ends = this.ends_;
        for (var i = 0, ii = ends.length; i < ii; ++i) {
          var end = ends[i];
          var midpoint = (0, _interpolate.interpolatePoint)(flatCoordinates, offset, end, 2, 0.5);
          (0, _array.extend)(this.flatMidpoints_, midpoint);
          offset = end;
        }
      }
      return this.flatMidpoints_;
    }

    /**
    * Get the feature identifier.  This is a stable identifier for the feature and
    * is set when reading data from a remote source.
    * @return {number|string|undefined} Id.
    * @api
    */

  }, {
    key: 'getId',
    value: function getId() {
      return this.id_;
    }

    /**
    * @return {Array<number>} Flat coordinates.
    */

  }, {
    key: 'getOrientedFlatCoordinates',
    value: function getOrientedFlatCoordinates() {
      return this.flatCoordinates_;
    }

    /**
    * For API compatibility with {@link module:ol/Feature~Feature}, this method is useful when
    * determining the geometry type in style function (see {@link #getType}).
    * @return {module:ol/render/Feature} Feature.
    * @api
    */

  }, {
    key: 'getGeometry',
    value: function getGeometry() {
      return this;
    }

    /**
    * Get the feature properties.
    * @return {Object<string, *>} Feature properties.
    * @api
    */

  }, {
    key: 'getProperties',
    value: function getProperties() {
      return this.properties_;
    }

    /**
    * @return {number} Stride.
    */

  }, {
    key: 'getStride',
    value: function getStride() {
      return 2;
    }

    /**
    * Get the type of this feature's geometry.
    * @return {module:ol/geom/GeometryType} Geometry type.
    * @api
    */

  }, {
    key: 'getType',
    value: function getType() {
      return this.type_;
    }

    /**
    * Transform geometry coordinates from tile pixel space to projected.
    * The SRS of the source and destination are expected to be the same.
    *
    * @param {module:ol/proj~ProjectionLike} source The current projection
    * @param {module:ol/proj~ProjectionLike} destination The desired projection.
    */

  }, {
    key: 'transform',
    value: function transform(source, destination) {
      source = (0, _proj.get)(source);
      var pixelExtent = source.getExtent();
      var projectedExtent = source.getWorldExtent();
      var scale = (0, _extent.getHeight)(projectedExtent) / (0, _extent.getHeight)(pixelExtent);
      (0, _transform2.compose)(tmpTransform, projectedExtent[0], projectedExtent[3], scale, -scale, 0, 0, 0);
      (0, _transform.transform2D)(this.flatCoordinates_, 0, this.flatCoordinates_.length, 2, tmpTransform, this.flatCoordinates_);
    }
  }]);

  return RenderFeature;
}();

/**
 * @return {Array<number>|Array<Array<number>>} Ends or endss.
 */


RenderFeature.prototype.getEnds = RenderFeature.prototype.getEndss = function () {
  return this.ends_;
};

/**
 * @return {Array<number>} Flat coordinates.
 */
RenderFeature.prototype.getFlatCoordinates = RenderFeature.prototype.getOrientedFlatCoordinates;

/**
 * Get the feature for working with its geometry.
 * @return {module:ol/render/Feature} Feature.
 */
RenderFeature.prototype.getSimplifiedGeometry = RenderFeature.prototype.getGeometry;

/**
 * @return {undefined}
 */
RenderFeature.prototype.getStyleFunction = _functions.VOID;

exports.default = RenderFeature;