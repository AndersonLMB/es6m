'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/format/Feature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.transformWithOptions = transformWithOptions;

var _Geometry = require('../geom/Geometry.js');

var _Geometry2 = _interopRequireDefault(_Geometry);

var _obj = require('../obj.js');

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} ReadOptions
 * @property {module:ol/proj~ProjectionLike} [dataProjection] Projection of the data we are reading.
 * If not provided, the projection will be derived from the data (where possible) or
 * the `dataProjection` of the format is assigned (where set). If the projection
 * can not be derived from the data and if no `dataProjection` is set for a format,
 * the features will not be reprojected.
 * @property {module:ol/extent~Extent} [extent] Tile extent of the tile being read. This is only used and
 * required for {@link module:ol/format/MVT}.
 * @property {module:ol/proj~ProjectionLike} [featureProjection] Projection of the feature geometries
 * created by the format reader. If not provided, features will be returned in the
 * `dataProjection`.
 */

/**
 * @typedef {Object} WriteOptions
 * @property {module:ol/proj~ProjectionLike} [dataProjection] Projection of the data we are writing.
 * If not provided, the `dataProjection` of the format is assigned (where set).
 * If no `dataProjection` is set for a format, the features will be returned
 * in the `featureProjection`.
 * @property {module:ol/proj~ProjectionLike} [featureProjection] Projection of the feature geometries
 * that will be serialized by the format writer. If not provided, geometries are assumed
 * to be in the `dataProjection` if that is set; in other words, they are not transformed.
 * @property {boolean} [rightHanded] When writing geometries, follow the right-hand
 * rule for linear ring orientation.  This means that polygons will have counter-clockwise
 * exterior rings and clockwise interior rings.  By default, coordinates are serialized
 * as they are provided at construction.  If `true`, the right-hand rule will
 * be applied.  If `false`, the left-hand rule will be applied (clockwise for
 * exterior and counter-clockwise for interior rings).  Note that not all
 * formats support this.  The GeoJSON format does use this property when writing
 * geometries.
 * @property {number} [decimals] Maximum number of decimal places for coordinates.
 * Coordinates are stored internally as floats, but floating-point arithmetic can create
 * coordinates with a large number of decimal places, not generally wanted on output.
 * Set a number here to round coordinates. Can also be used to ensure that
 * coordinates read in can be written back out with the same number of decimals.
 * Default is no rounding.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for feature formats.
 * {module:ol/format/Feature~FeatureFormat} subclasses provide the ability to decode and encode
 * {@link module:ol/Feature~Feature} objects from a variety of commonly used geospatial
 * file formats.  See the documentation for each format for more details.
 *
 * @abstract
 * @api
 */
var FeatureFormat = function () {
  function FeatureFormat() {
    _classCallCheck(this, FeatureFormat);

    /**
     * @protected
     * @type {module:ol/proj/Projection}
     */
    this.dataProjection = null;

    /**
     * @protected
     * @type {module:ol/proj/Projection}
     */
    this.defaultFeatureProjection = null;
  }

  /**
   * Adds the data projection to the read options.
   * @param {Document|Node|Object|string} source Source.
   * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
   * @return {module:ol/format/Feature~ReadOptions|undefined} Options.
   * @protected
   */


  _createClass(FeatureFormat, [{
    key: 'getReadOptions',
    value: function getReadOptions(source, opt_options) {
      var options = void 0;
      if (opt_options) {
        options = {
          dataProjection: opt_options.dataProjection ? opt_options.dataProjection : this.readProjection(source),
          featureProjection: opt_options.featureProjection
        };
      }
      return this.adaptOptions(options);
    }

    /**
     * Sets the `dataProjection` on the options, if no `dataProjection`
     * is set.
     * @param {module:ol/format/Feature~WriteOptions|module:ol/format/Feature~ReadOptions|undefined} options
     *     Options.
     * @protected
     * @return {module:ol/format/Feature~WriteOptions|module:ol/format/Feature~ReadOptions|undefined}
     *     Updated options.
     */

  }, {
    key: 'adaptOptions',
    value: function adaptOptions(options) {
      return (0, _obj.assign)({
        dataProjection: this.dataProjection,
        featureProjection: this.defaultFeatureProjection
      }, options);
    }

    /**
     * Get the extent from the source of the last {@link readFeatures} call.
     * @return {module:ol/extent~Extent} Tile extent.
     */

  }, {
    key: 'getLastExtent',
    value: function getLastExtent() {
      return null;
    }

    /**
     * @abstract
     * @return {module:ol/format/FormatType} Format.
     */

  }, {
    key: 'getType',
    value: function getType() {}

    /**
     * Read a single feature from a source.
     *
     * @abstract
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeature',
    value: function readFeature(source, opt_options) {}

    /**
     * Read all features from a source.
     *
     * @abstract
     * @param {Document|Node|ArrayBuffer|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'readFeatures',
    value: function readFeatures(source, opt_options) {}

    /**
     * Read a single geometry from a source.
     *
     * @abstract
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/geom/Geometry} Geometry.
     */

  }, {
    key: 'readGeometry',
    value: function readGeometry(source, opt_options) {}

    /**
     * Read the projection from a source.
     *
     * @abstract
     * @param {Document|Node|Object|string} source Source.
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'readProjection',
    value: function readProjection(source) {}

    /**
     * Encode a feature in this format.
     *
     * @abstract
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Result.
     */

  }, {
    key: 'writeFeature',
    value: function writeFeature(feature, opt_options) {}

    /**
     * Encode an array of features in this format.
     *
     * @abstract
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Result.
     */

  }, {
    key: 'writeFeatures',
    value: function writeFeatures(features, opt_options) {}

    /**
     * Write a single geometry in this format.
     *
     * @abstract
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Result.
     */

  }, {
    key: 'writeGeometry',
    value: function writeGeometry(geometry, opt_options) {}
  }]);

  return FeatureFormat;
}();

exports.default = FeatureFormat;

/**
 * @param {module:ol/geom/Geometry|module:ol/extent~Extent} geometry Geometry.
 * @param {boolean} write Set to true for writing, false for reading.
 * @param {module:ol/format/Feature~WriteOptions|module:ol/format/Feature~ReadOptions|undefined} opt_options
 *     Options.
 * @return {module:ol/geom/Geometry|module:ol/extent~Extent} Transformed geometry.
 */

function transformWithOptions(geometry, write, opt_options) {
  var featureProjection = opt_options ? (0, _proj.get)(opt_options.featureProjection) : null;
  var dataProjection = opt_options ? (0, _proj.get)(opt_options.dataProjection) : null;
  /**
   * @type {module:ol/geom/Geometry|module:ol/extent~Extent}
   */
  var transformed = void 0;
  if (featureProjection && dataProjection && !(0, _proj.equivalent)(featureProjection, dataProjection)) {
    if (geometry instanceof _Geometry2.default) {
      transformed = (write ? geometry.clone() : geometry).transform(write ? featureProjection : dataProjection, write ? dataProjection : featureProjection);
    } else {
      // FIXME this is necessary because GML treats extents
      // as geometries
      transformed = (0, _proj.transformExtent)(geometry, dataProjection, featureProjection);
    }
  } else {
    transformed = geometry;
  }
  if (write && opt_options && opt_options.decimals !== undefined) {
    var power = Math.pow(10, opt_options.decimals);
    // if decimals option on write, round each coordinate appropriately
    /**
     * @param {Array<number>} coordinates Coordinates.
     * @return {Array<number>} Transformed coordinates.
     */
    var transform = function transform(coordinates) {
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        coordinates[i] = Math.round(coordinates[i] * power) / power;
      }
      return coordinates;
    };
    if (transformed === geometry) {
      transformed = transformed.clone();
    }
    transformed.applyTransform(transform);
  }
  return transformed;
}