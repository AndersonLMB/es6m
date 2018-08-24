'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/format/WKT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _TextFeature2 = require('../format/TextFeature.js');

var _TextFeature3 = _interopRequireDefault(_TextFeature2);

var _GeometryCollection = require('../geom/GeometryCollection.js');

var _GeometryCollection2 = _interopRequireDefault(_GeometryCollection);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _MultiPoint = require('../geom/MultiPoint.js');

var _MultiPoint2 = _interopRequireDefault(_MultiPoint);

var _MultiPolygon = require('../geom/MultiPolygon.js');

var _MultiPolygon2 = _interopRequireDefault(_MultiPolygon);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _SimpleGeometry = require('../geom/SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @enum {function (new:module:ol/geom/Geometry, Array, module:ol/geom/GeometryLayout)}
 */
var GeometryConstructor = {
  'POINT': _Point2.default,
  'LINESTRING': _LineString2.default,
  'POLYGON': _Polygon2.default,
  'MULTIPOINT': _MultiPoint2.default,
  'MULTILINESTRING': _MultiLineString2.default,
  'MULTIPOLYGON': _MultiPolygon2.default
};

/**
 * @typedef {Object} Options
 * @property {boolean} [splitCollection=false] Whether to split GeometryCollections into
 * multiple features on reading.
 */

/**
 * @typedef {Object} Token
 * @property {number} type
 * @property {number|string} [value]
 * @property {number} position
 */

/**
 * @const
 * @type {string}
 */
var EMPTY = 'EMPTY';

/**
 * @const
 * @type {string}
 */
var Z = 'Z';

/**
 * @const
 * @type {string}
 */
var M = 'M';

/**
 * @const
 * @type {string}
 */
var ZM = 'ZM';

/**
 * @const
 * @enum {number}
 */
var TokenType = {
  TEXT: 1,
  LEFT_PAREN: 2,
  RIGHT_PAREN: 3,
  NUMBER: 4,
  COMMA: 5,
  EOF: 6
};

/**
 * @const
 * @type {Object<string, string>}
 */
var WKTGeometryType = {};
for (var type in _GeometryType2.default) {
  WKTGeometryType[type] = _GeometryType2.default[type].toUpperCase();
}

/**
 * Class to tokenize a WKT string.
 */

var Lexer = function () {

  /**
   * @param {string} wkt WKT string.
   */
  function Lexer(wkt) {
    _classCallCheck(this, Lexer);

    /**
     * @type {string}
     */
    this.wkt = wkt;

    /**
     * @type {number}
     * @private
     */
    this.index_ = -1;
  }

  /**
   * @param {string} c Character.
   * @return {boolean} Whether the character is alphabetic.
   * @private
   */


  _createClass(Lexer, [{
    key: 'isAlpha_',
    value: function isAlpha_(c) {
      return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
    }

    /**
     * @param {string} c Character.
     * @param {boolean=} opt_decimal Whether the string number
     *     contains a dot, i.e. is a decimal number.
     * @return {boolean} Whether the character is numeric.
     * @private
     */

  }, {
    key: 'isNumeric_',
    value: function isNumeric_(c, opt_decimal) {
      var decimal = opt_decimal !== undefined ? opt_decimal : false;
      return c >= '0' && c <= '9' || c == '.' && !decimal;
    }

    /**
     * @param {string} c Character.
     * @return {boolean} Whether the character is whitespace.
     * @private
     */

  }, {
    key: 'isWhiteSpace_',
    value: function isWhiteSpace_(c) {
      return c == ' ' || c == '\t' || c == '\r' || c == '\n';
    }

    /**
     * @return {string} Next string character.
     * @private
     */

  }, {
    key: 'nextChar_',
    value: function nextChar_() {
      return this.wkt.charAt(++this.index_);
    }

    /**
     * Fetch and return the next token.
     * @return {!module:ol/format/WKT~Token} Next string token.
     */

  }, {
    key: 'nextToken',
    value: function nextToken() {
      var c = this.nextChar_();
      var token = { position: this.index_, value: c };

      if (c == '(') {
        token.type = TokenType.LEFT_PAREN;
      } else if (c == ',') {
        token.type = TokenType.COMMA;
      } else if (c == ')') {
        token.type = TokenType.RIGHT_PAREN;
      } else if (this.isNumeric_(c) || c == '-') {
        token.type = TokenType.NUMBER;
        token.value = this.readNumber_();
      } else if (this.isAlpha_(c)) {
        token.type = TokenType.TEXT;
        token.value = this.readText_();
      } else if (this.isWhiteSpace_(c)) {
        return this.nextToken();
      } else if (c === '') {
        token.type = TokenType.EOF;
      } else {
        throw new Error('Unexpected character: ' + c);
      }

      return token;
    }

    /**
     * @return {number} Numeric token value.
     * @private
     */

  }, {
    key: 'readNumber_',
    value: function readNumber_() {
      var c = void 0;
      var index = this.index_;
      var decimal = false;
      var scientificNotation = false;
      do {
        if (c == '.') {
          decimal = true;
        } else if (c == 'e' || c == 'E') {
          scientificNotation = true;
        }
        c = this.nextChar_();
      } while (this.isNumeric_(c, decimal) ||
      // if we haven't detected a scientific number before, 'e' or 'E'
      // hint that we should continue to read
      !scientificNotation && (c == 'e' || c == 'E') ||
      // once we know that we have a scientific number, both '-' and '+'
      // are allowed
      scientificNotation && (c == '-' || c == '+'));
      return parseFloat(this.wkt.substring(index, this.index_--));
    }

    /**
     * @return {string} String token value.
     * @private
     */

  }, {
    key: 'readText_',
    value: function readText_() {
      var c = void 0;
      var index = this.index_;
      do {
        c = this.nextChar_();
      } while (this.isAlpha_(c));
      return this.wkt.substring(index, this.index_--).toUpperCase();
    }
  }]);

  return Lexer;
}();

/**
 * Class to parse the tokens from the WKT string.
 */


var Parser = function () {

  /**
   * @param {module:ol/format/WKT~Lexer} lexer The lexer.
   */
  function Parser(lexer) {
    _classCallCheck(this, Parser);

    /**
     * @type {module:ol/format/WKT~Lexer}
     * @private
     */
    this.lexer_ = lexer;

    /**
     * @type {module:ol/format/WKT~Token}
     * @private
     */
    this.token_;

    /**
     * @type {module:ol/geom/GeometryLayout}
     * @private
     */
    this.layout_ = _GeometryLayout2.default.XY;
  }

  /**
   * Fetch the next token form the lexer and replace the active token.
   * @private
   */


  _createClass(Parser, [{
    key: 'consume_',
    value: function consume_() {
      this.token_ = this.lexer_.nextToken();
    }

    /**
     * Tests if the given type matches the type of the current token.
     * @param {module:ol/format/WKT~TokenType} type Token type.
     * @return {boolean} Whether the token matches the given type.
     */

  }, {
    key: 'isTokenType',
    value: function isTokenType(type) {
      var isMatch = this.token_.type == type;
      return isMatch;
    }

    /**
     * If the given type matches the current token, consume it.
     * @param {module:ol/format/WKT~TokenType} type Token type.
     * @return {boolean} Whether the token matches the given type.
     */

  }, {
    key: 'match',
    value: function match(type) {
      var isMatch = this.isTokenType(type);
      if (isMatch) {
        this.consume_();
      }
      return isMatch;
    }

    /**
     * Try to parse the tokens provided by the lexer.
     * @return {module:ol/geom/Geometry} The geometry.
     */

  }, {
    key: 'parse',
    value: function parse() {
      this.consume_();
      var geometry = this.parseGeometry_();
      return geometry;
    }

    /**
     * Try to parse the dimensional info.
     * @return {module:ol/geom/GeometryLayout} The layout.
     * @private
     */

  }, {
    key: 'parseGeometryLayout_',
    value: function parseGeometryLayout_() {
      var layout = _GeometryLayout2.default.XY;
      var dimToken = this.token_;
      if (this.isTokenType(TokenType.TEXT)) {
        var dimInfo = dimToken.value;
        if (dimInfo === Z) {
          layout = _GeometryLayout2.default.XYZ;
        } else if (dimInfo === M) {
          layout = _GeometryLayout2.default.XYM;
        } else if (dimInfo === ZM) {
          layout = _GeometryLayout2.default.XYZM;
        }
        if (layout !== _GeometryLayout2.default.XY) {
          this.consume_();
        }
      }
      return layout;
    }

    /**
     * @return {!Array<module:ol/geom/Geometry>} A collection of geometries.
     * @private
     */

  }, {
    key: 'parseGeometryCollectionText_',
    value: function parseGeometryCollectionText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var geometries = [];
        do {
          geometries.push(this.parseGeometry_());
        } while (this.match(TokenType.COMMA));
        if (this.match(TokenType.RIGHT_PAREN)) {
          return geometries;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {Array<number>} All values in a point.
     * @private
     */

  }, {
    key: 'parsePointText_',
    value: function parsePointText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = this.parsePoint_();
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return null;
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} All points in a linestring.
     * @private
     */

  }, {
    key: 'parseLineStringText_',
    value: function parseLineStringText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = this.parsePointList_();
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} All points in a polygon.
     * @private
     */

  }, {
    key: 'parsePolygonText_',
    value: function parsePolygonText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = this.parseLineStringTextList_();
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} All points in a multipoint.
     * @private
     */

  }, {
    key: 'parseMultiPointText_',
    value: function parseMultiPointText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = void 0;
        if (this.token_.type == TokenType.LEFT_PAREN) {
          coordinates = this.parsePointTextList_();
        } else {
          coordinates = this.parsePointList_();
        }
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} All linestring points
     *                                        in a multilinestring.
     * @private
     */

  }, {
    key: 'parseMultiLineStringText_',
    value: function parseMultiLineStringText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = this.parseLineStringTextList_();
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} All polygon points in a multipolygon.
     * @private
     */

  }, {
    key: 'parseMultiPolygonText_',
    value: function parseMultiPolygonText_() {
      if (this.match(TokenType.LEFT_PAREN)) {
        var coordinates = this.parsePolygonTextList_();
        if (this.match(TokenType.RIGHT_PAREN)) {
          return coordinates;
        }
      } else if (this.isEmptyGeometry_()) {
        return [];
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<number>} A point.
     * @private
     */

  }, {
    key: 'parsePoint_',
    value: function parsePoint_() {
      var coordinates = [];
      var dimensions = this.layout_.length;
      for (var i = 0; i < dimensions; ++i) {
        var token = this.token_;
        if (this.match(TokenType.NUMBER)) {
          coordinates.push(token.value);
        } else {
          break;
        }
      }
      if (coordinates.length == dimensions) {
        return coordinates;
      }
      throw new Error(this.formatErrorMessage_());
    }

    /**
     * @return {!Array<!Array<number>>} An array of points.
     * @private
     */

  }, {
    key: 'parsePointList_',
    value: function parsePointList_() {
      var coordinates = [this.parsePoint_()];
      while (this.match(TokenType.COMMA)) {
        coordinates.push(this.parsePoint_());
      }
      return coordinates;
    }

    /**
     * @return {!Array<!Array<number>>} An array of points.
     * @private
     */

  }, {
    key: 'parsePointTextList_',
    value: function parsePointTextList_() {
      var coordinates = [this.parsePointText_()];
      while (this.match(TokenType.COMMA)) {
        coordinates.push(this.parsePointText_());
      }
      return coordinates;
    }

    /**
     * @return {!Array<!Array<number>>} An array of points.
     * @private
     */

  }, {
    key: 'parseLineStringTextList_',
    value: function parseLineStringTextList_() {
      var coordinates = [this.parseLineStringText_()];
      while (this.match(TokenType.COMMA)) {
        coordinates.push(this.parseLineStringText_());
      }
      return coordinates;
    }

    /**
     * @return {!Array<!Array<number>>} An array of points.
     * @private
     */

  }, {
    key: 'parsePolygonTextList_',
    value: function parsePolygonTextList_() {
      var coordinates = [this.parsePolygonText_()];
      while (this.match(TokenType.COMMA)) {
        coordinates.push(this.parsePolygonText_());
      }
      return coordinates;
    }

    /**
     * @return {boolean} Whether the token implies an empty geometry.
     * @private
     */

  }, {
    key: 'isEmptyGeometry_',
    value: function isEmptyGeometry_() {
      var isEmpty = this.isTokenType(TokenType.TEXT) && this.token_.value == EMPTY;
      if (isEmpty) {
        this.consume_();
      }
      return isEmpty;
    }

    /**
     * Create an error message for an unexpected token error.
     * @return {string} Error message.
     * @private
     */

  }, {
    key: 'formatErrorMessage_',
    value: function formatErrorMessage_() {
      return 'Unexpected `' + this.token_.value + '` at position ' + this.token_.position + ' in `' + this.lexer_.wkt + '`';
    }

    /**
     * @return {!module:ol/geom/Geometry} The geometry.
     * @private
     */

  }, {
    key: 'parseGeometry_',
    value: function parseGeometry_() {
      var token = this.token_;
      if (this.match(TokenType.TEXT)) {
        var geomType = token.value;
        this.layout_ = this.parseGeometryLayout_();
        if (geomType == 'GEOMETRYCOLLECTION') {
          var geometries = this.parseGeometryCollectionText_();
          return new _GeometryCollection2.default(geometries);
        } else {
          var ctor = GeometryConstructor[geomType];
          if (!ctor) {
            throw new Error('Invalid geometry type: ' + geomType);
          }

          var coordinates = void 0;
          switch (geomType) {
            case 'POINT':
              {
                coordinates = this.parsePointText_();
                break;
              }
            case 'LINESTRING':
              {
                coordinates = this.parseLineStringText_();
                break;
              }
            case 'POLYGON':
              {
                coordinates = this.parsePolygonText_();
                break;
              }
            case 'MULTIPOINT':
              {
                coordinates = this.parseMultiPointText_();
                break;
              }
            case 'MULTILINESTRING':
              {
                coordinates = this.parseMultiLineStringText_();
                break;
              }
            case 'MULTIPOLYGON':
              {
                coordinates = this.parseMultiPolygonText_();
                break;
              }
            default:
              {
                throw new Error('Invalid geometry type: ' + geomType);
              }
          }

          if (!coordinates) {
            if (ctor === GeometryConstructor['POINT']) {
              coordinates = [NaN, NaN];
            } else {
              coordinates = [];
            }
          }
          return new ctor(coordinates, this.layout_);
        }
      }
      throw new Error(this.formatErrorMessage_());
    }
  }]);

  return Parser;
}();

/**
 * @classdesc
 * Geometry format for reading and writing data in the `WellKnownText` (WKT)
 * format.
 *
 * @api
 */


var WKT = function (_TextFeature) {
  _inherits(WKT, _TextFeature);

  /**
   * @param {module:ol/format/WKT~Options=} opt_options Options.
   */
  function WKT(opt_options) {
    _classCallCheck(this, WKT);

    var _this = _possibleConstructorReturn(this, (WKT.__proto__ || Object.getPrototypeOf(WKT)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * Split GeometryCollection into multiple features.
     * @type {boolean}
     * @private
     */
    _this.splitCollection_ = options.splitCollection !== undefined ? options.splitCollection : false;

    return _this;
  }

  /**
   * Parse a WKT string.
   * @param {string} wkt WKT string.
   * @return {module:ol/geom/Geometry|undefined}
   *     The geometry created.
   * @private
   */


  _createClass(WKT, [{
    key: 'parse_',
    value: function parse_(wkt) {
      var lexer = new Lexer(wkt);
      var parser = new Parser(lexer);
      return parser.parse();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeatureFromText',
    value: function readFeatureFromText(text, opt_options) {
      var geom = this.readGeometryFromText(text, opt_options);
      if (geom) {
        var feature = new _Feature2.default();
        feature.setGeometry(geom);
        return feature;
      }
      return null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromText',
    value: function readFeaturesFromText(text, opt_options) {
      var geometries = [];
      var geometry = this.readGeometryFromText(text, opt_options);
      if (this.splitCollection_ && geometry.getType() == _GeometryType2.default.GEOMETRY_COLLECTION) {
        geometries = /** @type {module:ol/geom/GeometryCollection} */geometry.getGeometriesArray();
      } else {
        geometries = [geometry];
      }
      var features = [];
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        var feature = new _Feature2.default();
        feature.setGeometry(geometries[i]);
        features.push(feature);
      }
      return features;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometryFromText',
    value: function readGeometryFromText(text, opt_options) {
      var geometry = this.parse_(text);
      if (geometry) {
        return (
          /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, false, opt_options)
        );
      } else {
        return null;
      }
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
      }
      return '';
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeFeaturesText',
    value: function writeFeaturesText(features, opt_options) {
      if (features.length == 1) {
        return this.writeFeatureText(features[0], opt_options);
      }
      var geometries = [];
      for (var i = 0, ii = features.length; i < ii; ++i) {
        geometries.push(features[i].getGeometry());
      }
      var collection = new _GeometryCollection2.default(geometries);
      return this.writeGeometryText(collection, opt_options);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeGeometryText',
    value: function writeGeometryText(geometry, opt_options) {
      return encode( /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, true, opt_options));
    }
  }]);

  return WKT;
}(_TextFeature3.default);

/**
 * @param {module:ol/geom/Point} geom Point geometry.
 * @return {string} Coordinates part of Point as WKT.
 */


function encodePointGeometry(geom) {
  var coordinates = geom.getCoordinates();
  if (coordinates.length === 0) {
    return '';
  }
  return coordinates.join(' ');
}

/**
 * @param {module:ol/geom/MultiPoint} geom MultiPoint geometry.
 * @return {string} Coordinates part of MultiPoint as WKT.
 */
function encodeMultiPointGeometry(geom) {
  var array = [];
  var components = geom.getPoints();
  for (var i = 0, ii = components.length; i < ii; ++i) {
    array.push('(' + encodePointGeometry(components[i]) + ')');
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/GeometryCollection} geom GeometryCollection geometry.
 * @return {string} Coordinates part of GeometryCollection as WKT.
 */
function encodeGeometryCollectionGeometry(geom) {
  var array = [];
  var geoms = geom.getGeometries();
  for (var i = 0, ii = geoms.length; i < ii; ++i) {
    array.push(encode(geoms[i]));
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/LineString|module:ol/geom/LinearRing} geom LineString geometry.
 * @return {string} Coordinates part of LineString as WKT.
 */
function encodeLineStringGeometry(geom) {
  var coordinates = geom.getCoordinates();
  var array = [];
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    array.push(coordinates[i].join(' '));
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/MultiLineString} geom MultiLineString geometry.
 * @return {string} Coordinates part of MultiLineString as WKT.
 */
function encodeMultiLineStringGeometry(geom) {
  var array = [];
  var components = geom.getLineStrings();
  for (var i = 0, ii = components.length; i < ii; ++i) {
    array.push('(' + encodeLineStringGeometry(components[i]) + ')');
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/Polygon} geom Polygon geometry.
 * @return {string} Coordinates part of Polygon as WKT.
 */
function encodePolygonGeometry(geom) {
  var array = [];
  var rings = geom.getLinearRings();
  for (var i = 0, ii = rings.length; i < ii; ++i) {
    array.push('(' + encodeLineStringGeometry(rings[i]) + ')');
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/MultiPolygon} geom MultiPolygon geometry.
 * @return {string} Coordinates part of MultiPolygon as WKT.
 */
function encodeMultiPolygonGeometry(geom) {
  var array = [];
  var components = geom.getPolygons();
  for (var i = 0, ii = components.length; i < ii; ++i) {
    array.push('(' + encodePolygonGeometry(components[i]) + ')');
  }
  return array.join(',');
}

/**
 * @param {module:ol/geom/SimpleGeometry} geom SimpleGeometry geometry.
 * @return {string} Potential dimensional information for WKT type.
 */
function encodeGeometryLayout(geom) {
  var layout = geom.getLayout();
  var dimInfo = '';
  if (layout === _GeometryLayout2.default.XYZ || layout === _GeometryLayout2.default.XYZM) {
    dimInfo += Z;
  }
  if (layout === _GeometryLayout2.default.XYM || layout === _GeometryLayout2.default.XYZM) {
    dimInfo += M;
  }
  return dimInfo;
}

/**
 * @const
 * @type {Object<string, function(module:ol/geom/Geometry): string>}
 */
var GeometryEncoder = {
  'Point': encodePointGeometry,
  'LineString': encodeLineStringGeometry,
  'Polygon': encodePolygonGeometry,
  'MultiPoint': encodeMultiPointGeometry,
  'MultiLineString': encodeMultiLineStringGeometry,
  'MultiPolygon': encodeMultiPolygonGeometry,
  'GeometryCollection': encodeGeometryCollectionGeometry
};

/**
 * Encode a geometry as WKT.
 * @param {module:ol/geom/Geometry} geom The geometry to encode.
 * @return {string} WKT string for the geometry.
 */
function encode(geom) {
  var type = geom.getType();
  var geometryEncoder = GeometryEncoder[type];
  var enc = geometryEncoder(geom);
  type = type.toUpperCase();
  if (geom instanceof _SimpleGeometry2.default) {
    var dimInfo = encodeGeometryLayout(geom);
    if (dimInfo.length > 0) {
      type += ' ' + dimInfo;
    }
  }
  if (enc.length === 0) {
    return type + ' ' + EMPTY;
  }
  return type + '(' + enc + ')';
}

exports.default = WKT;