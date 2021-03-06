'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROJECTIONS = exports.WORLD_EXTENT = exports.EXTENT = exports.HALF_SIZE = exports.RADIUS = undefined;
exports.fromEPSG4326 = fromEPSG4326;
exports.toEPSG4326 = toEPSG4326;

var _math = require('../math.js');

var _Projection2 = require('../proj/Projection.js');

var _Projection3 = _interopRequireDefault(_Projection2);

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/proj/epsg3857
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
var RADIUS = exports.RADIUS = 6378137;

/**
 * @const
 * @type {number}
 */
var HALF_SIZE = exports.HALF_SIZE = Math.PI * RADIUS;

/**
 * @const
 * @type {module:ol/extent~Extent}
 */
var EXTENT = exports.EXTENT = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];

/**
 * @const
 * @type {module:ol/extent~Extent}
 */
var WORLD_EXTENT = exports.WORLD_EXTENT = [-180, -85, 180, 85];

/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 */

var EPSG3857Projection = function (_Projection) {
  _inherits(EPSG3857Projection, _Projection);

  /**
   * @param {string} code Code.
   */
  function EPSG3857Projection(code) {
    _classCallCheck(this, EPSG3857Projection);

    return _possibleConstructorReturn(this, (EPSG3857Projection.__proto__ || Object.getPrototypeOf(EPSG3857Projection)).call(this, {
      code: code,
      units: _Units2.default.METERS,
      extent: EXTENT,
      global: true,
      worldExtent: WORLD_EXTENT,
      getPointResolution: function getPointResolution(resolution, point) {
        return resolution / (0, _math.cosh)(point[1] / RADIUS);
      }
    }));
  }

  return EPSG3857Projection;
}(_Projection3.default);

/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array<module:ol/proj/Projection>}
 */


var PROJECTIONS = exports.PROJECTIONS = [new EPSG3857Projection('EPSG:3857'), new EPSG3857Projection('EPSG:102100'), new EPSG3857Projection('EPSG:102113'), new EPSG3857Projection('EPSG:900913'), new EPSG3857Projection('urn:ogc:def:crs:EPSG:6.18:3:3857'), new EPSG3857Projection('urn:ogc:def:crs:EPSG::3857'), new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857')];

/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function fromEPSG4326(input, opt_output, opt_dimension) {
  var length = input.length;
  var dimension = opt_dimension > 1 ? opt_dimension : 2;
  var output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  var halfSize = HALF_SIZE;
  for (var i = 0; i < length; i += dimension) {
    output[i] = halfSize * input[i] / 180;
    var y = RADIUS * Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
    if (y > halfSize) {
      y = halfSize;
    } else if (y < -halfSize) {
      y = -halfSize;
    }
    output[i + 1] = y;
  }
  return output;
}

/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function toEPSG4326(input, opt_output, opt_dimension) {
  var length = input.length;
  var dimension = opt_dimension > 1 ? opt_dimension : 2;
  var output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (var i = 0; i < length; i += dimension) {
    output[i] = 180 * input[i] / HALF_SIZE;
    output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / RADIUS)) / Math.PI - 90;
  }
  return output;
}