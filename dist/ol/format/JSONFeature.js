'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Feature = require('../format/Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _FormatType = require('../format/FormatType.js');

var _FormatType2 = _interopRequireDefault(_FormatType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/JSONFeature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for JSON feature formats.
 *
 * @abstract
 */
var JSONFeature = function (_FeatureFormat) {
  _inherits(JSONFeature, _FeatureFormat);

  function JSONFeature() {
    _classCallCheck(this, JSONFeature);

    return _possibleConstructorReturn(this, (JSONFeature.__proto__ || Object.getPrototypeOf(JSONFeature)).call(this));
  }

  /**
   * @inheritDoc
   */


  _createClass(JSONFeature, [{
    key: 'getType',
    value: function getType() {
      return _FormatType2.default.JSON;
    }

    /**
     * Read a feature.  Only works for a single feature. Use `readFeatures` to
     * read a feature collection.
     *
     * @param {ArrayBuffer|Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/Feature} Feature.
     * @api
     */

  }, {
    key: 'readFeature',
    value: function readFeature(source, opt_options) {
      return this.readFeatureFromObject(getObject(source), this.getReadOptions(source, opt_options));
    }

    /**
     * Read all features.  Works with both a single feature and a feature
     * collection.
     *
     * @param {ArrayBuffer|Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {Array<module:ol/Feature>} Features.
     * @api
     */

  }, {
    key: 'readFeatures',
    value: function readFeatures(source, opt_options) {
      return this.readFeaturesFromObject(getObject(source), this.getReadOptions(source, opt_options));
    }

    /**
     * @abstract
     * @param {Object} object Object.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeatureFromObject',
    value: function readFeatureFromObject(object, opt_options) {}

    /**
     * @abstract
     * @param {Object} object Object.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'readFeaturesFromObject',
    value: function readFeaturesFromObject(object, opt_options) {}

    /**
     * Read a geometry.
     *
     * @param {ArrayBuffer|Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/geom/Geometry} Geometry.
     * @api
     */

  }, {
    key: 'readGeometry',
    value: function readGeometry(source, opt_options) {
      return this.readGeometryFromObject(getObject(source), this.getReadOptions(source, opt_options));
    }

    /**
     * @abstract
     * @param {Object} object Object.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {module:ol/geom/Geometry} Geometry.
     */

  }, {
    key: 'readGeometryFromObject',
    value: function readGeometryFromObject(object, opt_options) {}

    /**
     * Read the projection.
     *
     * @param {ArrayBuffer|Document|Node|Object|string} source Source.
     * @return {module:ol/proj/Projection} Projection.
     * @api
     */

  }, {
    key: 'readProjection',
    value: function readProjection(source) {
      return this.readProjectionFromObject(getObject(source));
    }

    /**
     * @abstract
     * @param {Object} object Object.
     * @protected
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'readProjectionFromObject',
    value: function readProjectionFromObject(object) {}

    /**
     * Encode a feature as string.
     *
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Encoded feature.
     * @api
     */

  }, {
    key: 'writeFeature',
    value: function writeFeature(feature, opt_options) {
      return JSON.stringify(this.writeFeatureObject(feature, opt_options));
    }

    /**
     * @abstract
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {Object} Object.
     */

  }, {
    key: 'writeFeatureObject',
    value: function writeFeatureObject(feature, opt_options) {}

    /**
     * Encode an array of features as string.
     *
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Encoded features.
     * @api
     */

  }, {
    key: 'writeFeatures',
    value: function writeFeatures(features, opt_options) {
      return JSON.stringify(this.writeFeaturesObject(features, opt_options));
    }

    /**
     * @abstract
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {Object} Object.
     */

  }, {
    key: 'writeFeaturesObject',
    value: function writeFeaturesObject(features, opt_options) {}

    /**
     * Encode a geometry as string.
     *
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Encoded geometry.
     * @api
     */

  }, {
    key: 'writeGeometry',
    value: function writeGeometry(geometry, opt_options) {
      return JSON.stringify(this.writeGeometryObject(geometry, opt_options));
    }

    /**
     * @abstract
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {Object} Object.
     */

  }, {
    key: 'writeGeometryObject',
    value: function writeGeometryObject(geometry, opt_options) {}
  }]);

  return JSONFeature;
}(_Feature2.default);

/**
 * @param {Document|Node|Object|string} source Source.
 * @return {Object} Object.
 */


function getObject(source) {
  if (typeof source === 'string') {
    var object = JSON.parse(source);
    return object ? /** @type {Object} */object : null;
  } else if (source !== null) {
    return source;
  } else {
    return null;
  }
}

exports.default = JSONFeature;