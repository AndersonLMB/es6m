'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.encodeDeltas = encodeDeltas;
exports.decodeDeltas = decodeDeltas;
exports.encodeFloats = encodeFloats;
exports.decodeFloats = decodeFloats;
exports.encodeSignedIntegers = encodeSignedIntegers;
exports.decodeSignedIntegers = decodeSignedIntegers;
exports.encodeUnsignedIntegers = encodeUnsignedIntegers;
exports.decodeUnsignedIntegers = decodeUnsignedIntegers;
exports.encodeUnsignedInteger = encodeUnsignedInteger;

var _asserts = require('../asserts.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _TextFeature2 = require('../format/TextFeature.js');

var _TextFeature3 = _interopRequireDefault(_TextFeature2);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _SimpleGeometry = require('../geom/SimpleGeometry.js');

var _flip = require('../geom/flat/flip.js');

var _inflate = require('../geom/flat/inflate.js');

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/Polyline
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [factor=1e5] The factor by which the coordinates values will be scaled.
 * @property {module:ol/geom/GeometryLayout} [geometryLayout='XY'] Layout of the
 * feature geometries created by the format reader.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the Encoded
 * Polyline Algorithm Format.
 *
 * When reading features, the coordinates are assumed to be in two dimensions
 * and in [latitude, longitude] order.
 *
 * As Polyline sources contain a single feature,
 * {@link module:ol/format/Polyline~Polyline#readFeatures} will return the
 * feature in an array.
 *
 * @api
 */
var Polyline = function (_TextFeature) {
  _inherits(Polyline, _TextFeature);

  /**
   * @param {module:ol/format/Polyline~Options=} opt_options Optional configuration object.
   */
  function Polyline(opt_options) {
    _classCallCheck(this, Polyline);

    var _this = _possibleConstructorReturn(this, (Polyline.__proto__ || Object.getPrototypeOf(Polyline)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @inheritDoc
     */
    _this.dataProjection = (0, _proj.get)('EPSG:4326');

    /**
     * @private
     * @type {number}
     */
    _this.factor_ = options.factor ? options.factor : 1e5;

    /**
     * @private
     * @type {module:ol/geom/GeometryLayout}
     */
    _this.geometryLayout_ = options.geometryLayout ? options.geometryLayout : _GeometryLayout2.default.XY;
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(Polyline, [{
    key: 'readFeatureFromText',
    value: function readFeatureFromText(text, opt_options) {
      var geometry = this.readGeometryFromText(text, opt_options);
      return new _Feature2.default(geometry);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromText',
    value: function readFeaturesFromText(text, opt_options) {
      var feature = this.readFeatureFromText(text, opt_options);
      return [feature];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometryFromText',
    value: function readGeometryFromText(text, opt_options) {
      var stride = (0, _SimpleGeometry.getStrideForLayout)(this.geometryLayout_);
      var flatCoordinates = decodeDeltas(text, stride, this.factor_);
      (0, _flip.flipXY)(flatCoordinates, 0, flatCoordinates.length, stride, flatCoordinates);
      var coordinates = (0, _inflate.inflateCoordinates)(flatCoordinates, 0, flatCoordinates.length, stride);

      return (
        /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(new _LineString2.default(coordinates, this.geometryLayout_), false, this.adaptOptions(opt_options))
      );
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeFeatureText',
    value: function writeFeatureText(feature, opt_options) {
      var geometry = feature.getGeometry();
      if (geometry) {
        return this.writeGeometryText(geometry, opt_options);
      } else {
        (0, _asserts.assert)(false, 40); // Expected `feature` to have a geometry
        return '';
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeFeaturesText',
    value: function writeFeaturesText(features, opt_options) {
      return this.writeFeatureText(features[0], opt_options);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeGeometryText',
    value: function writeGeometryText(geometry, opt_options) {
      geometry = /** @type {module:ol/geom/LineString} */
      (0, _Feature3.transformWithOptions)(geometry, true, this.adaptOptions(opt_options));
      var flatCoordinates = geometry.getFlatCoordinates();
      var stride = geometry.getStride();
      (0, _flip.flipXY)(flatCoordinates, 0, flatCoordinates.length, stride, flatCoordinates);
      return encodeDeltas(flatCoordinates, stride, this.factor_);
    }
  }]);

  return Polyline;
}(_TextFeature3.default);

/**
 * Encode a list of n-dimensional points and return an encoded string
 *
 * Attention: This function will modify the passed array!
 *
 * @param {Array<number>} numbers A list of n-dimensional points.
 * @param {number} stride The number of dimension of the points in the list.
 * @param {number=} opt_factor The factor by which the numbers will be
 *     multiplied. The remaining decimal places will get rounded away.
 *     Default is `1e5`.
 * @return {string} The encoded string.
 * @api
 */


function encodeDeltas(numbers, stride, opt_factor) {
  var factor = opt_factor ? opt_factor : 1e5;
  var d = void 0;

  var lastNumbers = new Array(stride);
  for (d = 0; d < stride; ++d) {
    lastNumbers[d] = 0;
  }

  for (var i = 0, ii = numbers.length; i < ii;) {
    for (d = 0; d < stride; ++d, ++i) {
      var num = numbers[i];
      var delta = num - lastNumbers[d];
      lastNumbers[d] = num;

      numbers[i] = delta;
    }
  }

  return encodeFloats(numbers, factor);
}

/**
 * Decode a list of n-dimensional points from an encoded string
 *
 * @param {string} encoded An encoded string.
 * @param {number} stride The number of dimension of the points in the
 *     encoded string.
 * @param {number=} opt_factor The factor by which the resulting numbers will
 *     be divided. Default is `1e5`.
 * @return {Array<number>} A list of n-dimensional points.
 * @api
 */
function decodeDeltas(encoded, stride, opt_factor) {
  var factor = opt_factor ? opt_factor : 1e5;
  var d = void 0;

  /** @type {Array<number>} */
  var lastNumbers = new Array(stride);
  for (d = 0; d < stride; ++d) {
    lastNumbers[d] = 0;
  }

  var numbers = decodeFloats(encoded, factor);

  for (var i = 0, ii = numbers.length; i < ii;) {
    for (d = 0; d < stride; ++d, ++i) {
      lastNumbers[d] += numbers[i];

      numbers[i] = lastNumbers[d];
    }
  }

  return numbers;
}

/**
 * Encode a list of floating point numbers and return an encoded string
 *
 * Attention: This function will modify the passed array!
 *
 * @param {Array<number>} numbers A list of floating point numbers.
 * @param {number=} opt_factor The factor by which the numbers will be
 *     multiplied. The remaining decimal places will get rounded away.
 *     Default is `1e5`.
 * @return {string} The encoded string.
 * @api
 */
function encodeFloats(numbers, opt_factor) {
  var factor = opt_factor ? opt_factor : 1e5;
  for (var i = 0, ii = numbers.length; i < ii; ++i) {
    numbers[i] = Math.round(numbers[i] * factor);
  }

  return encodeSignedIntegers(numbers);
}

/**
 * Decode a list of floating point numbers from an encoded string
 *
 * @param {string} encoded An encoded string.
 * @param {number=} opt_factor The factor by which the result will be divided.
 *     Default is `1e5`.
 * @return {Array<number>} A list of floating point numbers.
 * @api
 */
function decodeFloats(encoded, opt_factor) {
  var factor = opt_factor ? opt_factor : 1e5;
  var numbers = decodeSignedIntegers(encoded);
  for (var i = 0, ii = numbers.length; i < ii; ++i) {
    numbers[i] /= factor;
  }
  return numbers;
}

/**
 * Encode a list of signed integers and return an encoded string
 *
 * Attention: This function will modify the passed array!
 *
 * @param {Array<number>} numbers A list of signed integers.
 * @return {string} The encoded string.
 */
function encodeSignedIntegers(numbers) {
  for (var i = 0, ii = numbers.length; i < ii; ++i) {
    var num = numbers[i];
    numbers[i] = num < 0 ? ~(num << 1) : num << 1;
  }
  return encodeUnsignedIntegers(numbers);
}

/**
 * Decode a list of signed integers from an encoded string
 *
 * @param {string} encoded An encoded string.
 * @return {Array<number>} A list of signed integers.
 */
function decodeSignedIntegers(encoded) {
  var numbers = decodeUnsignedIntegers(encoded);
  for (var i = 0, ii = numbers.length; i < ii; ++i) {
    var num = numbers[i];
    numbers[i] = num & 1 ? ~(num >> 1) : num >> 1;
  }
  return numbers;
}

/**
 * Encode a list of unsigned integers and return an encoded string
 *
 * @param {Array<number>} numbers A list of unsigned integers.
 * @return {string} The encoded string.
 */
function encodeUnsignedIntegers(numbers) {
  var encoded = '';
  for (var i = 0, ii = numbers.length; i < ii; ++i) {
    encoded += encodeUnsignedInteger(numbers[i]);
  }
  return encoded;
}

/**
 * Decode a list of unsigned integers from an encoded string
 *
 * @param {string} encoded An encoded string.
 * @return {Array<number>} A list of unsigned integers.
 */
function decodeUnsignedIntegers(encoded) {
  var numbers = [];
  var current = 0;
  var shift = 0;
  for (var i = 0, ii = encoded.length; i < ii; ++i) {
    var b = encoded.charCodeAt(i) - 63;
    current |= (b & 0x1f) << shift;
    if (b < 0x20) {
      numbers.push(current);
      current = 0;
      shift = 0;
    } else {
      shift += 5;
    }
  }
  return numbers;
}

/**
 * Encode one single unsigned integer and return an encoded string
 *
 * @param {number} num Unsigned integer that should be encoded.
 * @return {string} The encoded string.
 */
function encodeUnsignedInteger(num) {
  var value = void 0,
      encoded = '';
  while (num >= 0x20) {
    value = (0x20 | num & 0x1f) + 63;
    encoded += String.fromCharCode(value);
    num >>= 5;
  }
  value = num + 63;
  encoded += String.fromCharCode(value);
  return encoded;
}

exports.default = Polyline;