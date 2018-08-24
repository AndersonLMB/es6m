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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/TextFeature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for text feature formats.
 *
 * @abstract
 */
var TextFeature = function (_FeatureFormat) {
  _inherits(TextFeature, _FeatureFormat);

  function TextFeature() {
    _classCallCheck(this, TextFeature);

    return _possibleConstructorReturn(this, (TextFeature.__proto__ || Object.getPrototypeOf(TextFeature)).call(this));
  }

  /**
   * @inheritDoc
   */


  _createClass(TextFeature, [{
    key: 'getType',
    value: function getType() {
      return _FormatType2.default.TEXT;
    }

    /**
     * Read the feature from the source.
     *
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/Feature} Feature.
     * @api
     */

  }, {
    key: 'readFeature',
    value: function readFeature(source, opt_options) {
      return this.readFeatureFromText(getText(source), this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {string} text Text.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeatureFromText',
    value: function readFeatureFromText(text, opt_options) {}

    /**
     * Read the features from the source.
     *
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {Array<module:ol/Feature>} Features.
     * @api
     */

  }, {
    key: 'readFeatures',
    value: function readFeatures(source, opt_options) {
      return this.readFeaturesFromText(getText(source), this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {string} text Text.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'readFeaturesFromText',
    value: function readFeaturesFromText(text, opt_options) {}

    /**
     * Read the geometry from the source.
     *
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/geom/Geometry} Geometry.
     * @api
     */

  }, {
    key: 'readGeometry',
    value: function readGeometry(source, opt_options) {
      return this.readGeometryFromText(getText(source), this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {string} text Text.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @protected
     * @return {module:ol/geom/Geometry} Geometry.
     */

  }, {
    key: 'readGeometryFromText',
    value: function readGeometryFromText(text, opt_options) {}

    /**
     * Read the projection from the source.
     *
     * @function
     * @param {Document|Node|Object|string} source Source.
     * @return {module:ol/proj/Projection} Projection.
     * @api
     */

  }, {
    key: 'readProjection',
    value: function readProjection(source) {
      return this.readProjectionFromText(getText(source));
    }

    /**
     * @param {string} text Text.
     * @protected
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'readProjectionFromText',
    value: function readProjectionFromText(text) {
      return this.dataProjection;
    }

    /**
     * Encode a feature as a string.
     *
     * @function
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Encoded feature.
     * @api
     */

  }, {
    key: 'writeFeature',
    value: function writeFeature(feature, opt_options) {
      return this.writeFeatureText(feature, this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {module:ol/Feature} feature Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @protected
     * @return {string} Text.
     */

  }, {
    key: 'writeFeatureText',
    value: function writeFeatureText(feature, opt_options) {}

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
      return this.writeFeaturesText(features, this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @protected
     * @return {string} Text.
     */

  }, {
    key: 'writeFeaturesText',
    value: function writeFeaturesText(features, opt_options) {}

    /**
     * Write a single geometry.
     *
     * @function
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Geometry.
     * @api
     */

  }, {
    key: 'writeGeometry',
    value: function writeGeometry(geometry, opt_options) {
      return this.writeGeometryText(geometry, this.adaptOptions(opt_options));
    }

    /**
     * @abstract
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @protected
     * @return {string} Text.
     */

  }, {
    key: 'writeGeometryText',
    value: function writeGeometryText(geometry, opt_options) {}
  }]);

  return TextFeature;
}(_Feature2.default);

/**
 * @param {Document|Node|Object|string} source Source.
 * @return {string} Text.
 */


function getText(source) {
  if (typeof source === 'string') {
    return source;
  } else {
    return '';
  }
}

exports.default = TextFeature;