'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROJECTIONS = exports.METERS_PER_UNIT = exports.EXTENT = exports.RADIUS = undefined;

var _Projection2 = require('../proj/Projection.js');

var _Projection3 = _interopRequireDefault(_Projection2);

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/proj/epsg4326
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Semi-major radius of the WGS84 ellipsoid.
 *
 * @const
 * @type {number}
 */
var RADIUS = exports.RADIUS = 6378137;

/**
 * Extent of the EPSG:4326 projection which is the whole world.
 *
 * @const
 * @type {module:ol/extent~Extent}
 */
var EXTENT = exports.EXTENT = [-180, -90, 180, 90];

/**
 * @const
 * @type {number}
 */
var METERS_PER_UNIT = exports.METERS_PER_UNIT = Math.PI * RADIUS / 180;

/**
 * @classdesc
 * Projection object for WGS84 geographic coordinates (EPSG:4326).
 *
 * Note that OpenLayers does not strictly comply with the EPSG definition.
 * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
 * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
 */

var EPSG4326Projection = function (_Projection) {
  _inherits(EPSG4326Projection, _Projection);

  /**
   * @param {string} code Code.
   * @param {string=} opt_axisOrientation Axis orientation.
   */
  function EPSG4326Projection(code, opt_axisOrientation) {
    _classCallCheck(this, EPSG4326Projection);

    return _possibleConstructorReturn(this, (EPSG4326Projection.__proto__ || Object.getPrototypeOf(EPSG4326Projection)).call(this, {
      code: code,
      units: _Units2.default.DEGREES,
      extent: EXTENT,
      axisOrientation: opt_axisOrientation,
      global: true,
      metersPerUnit: METERS_PER_UNIT,
      worldExtent: EXTENT
    }));
  }

  return EPSG4326Projection;
}(_Projection3.default);

/**
 * Projections equal to EPSG:4326.
 *
 * @const
 * @type {Array<module:ol/proj/Projection>}
 */


var PROJECTIONS = exports.PROJECTIONS = [new EPSG4326Projection('CRS:84'), new EPSG4326Projection('EPSG:4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:EPSG::4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:EPSG:6.6:4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'), new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'), new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'), new EPSG4326Projection('urn:x-ogc:def:crs:EPSG:4326', 'neu')];