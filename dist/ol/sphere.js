'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_RADIUS = undefined;
exports.getDistance = getDistance;
exports.getLength = getLength;
exports.getArea = getArea;
exports.offset = offset;

var _math = require('./math.js');

var _GeometryType = require('./geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Object literal with options for the {@link getLength} or {@link getArea}
 * functions.
 * @typedef {Object} SphereMetricOptions
 * @property {module:ol/proj~ProjectionLike} [projection='EPSG:3857']
 * Projection of the  geometry.  By default, the geometry is assumed to be in
 * Web Mercator.
 * @property {number} [radius=6371008.8] Sphere radius.  By default, the radius of the
 * earth is used (Clarke 1866 Authalic Sphere).
 */

/**
 * The mean Earth radius (1/3 * (2a + b)) for the WGS84 ellipsoid.
 * https://en.wikipedia.org/wiki/Earth_radius#Mean_radius
 * @type {number}
 */
/**
 * @license
 * Latitude/longitude spherical geodesy formulae taken from
 * http://www.movable-type.co.uk/scripts/latlong.html
 * Licensed under CC-BY-3.0.
 */

/**
 * @module ol/sphere
 */
var DEFAULT_RADIUS = exports.DEFAULT_RADIUS = 6371008.8;

/**
 * Get the great circle distance (in meters) between two geographic coordinates.
 * @param {Array} c1 Starting coordinate.
 * @param {Array} c2 Ending coordinate.
 * @param {number=} opt_radius The sphere radius to use.  Defaults to the Earth's
 *     mean radius using the WGS84 ellipsoid.
 * @return {number} The great circle distance between the points (in meters).
 * @api
 */
function getDistance(c1, c2, opt_radius) {
  var radius = opt_radius || DEFAULT_RADIUS;
  var lat1 = (0, _math.toRadians)(c1[1]);
  var lat2 = (0, _math.toRadians)(c2[1]);
  var deltaLatBy2 = (lat2 - lat1) / 2;
  var deltaLonBy2 = (0, _math.toRadians)(c2[0] - c1[0]) / 2;
  var a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) + Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get the cumulative great circle length of linestring coordinates (geographic).
 * @param {Array} coordinates Linestring coordinates.
 * @param {number} radius The sphere radius to use.
 * @return {number} The length (in meters).
 */
function getLengthInternal(coordinates, radius) {
  var length = 0;
  for (var i = 0, ii = coordinates.length; i < ii - 1; ++i) {
    length += getDistance(coordinates[i], coordinates[i + 1], radius);
  }
  return length;
}

/**
 * Get the spherical length of a geometry.  This length is the sum of the
 * great circle distances between coordinates.  For polygons, the length is
 * the sum of all rings.  For points, the length is zero.  For multi-part
 * geometries, the length is the sum of the length of each part.
 * @param {module:ol/geom/Geometry} geometry A geometry.
 * @param {module:ol/sphere~SphereMetricOptions=} opt_options Options for the
 * length calculation.  By default, geometries are assumed to be in 'EPSG:3857'.
 * You can change this by providing a `projection` option.
 * @return {number} The spherical length (in meters).
 * @api
 */
function getLength(geometry, opt_options) {
  var options = opt_options || {};
  var radius = options.radius || DEFAULT_RADIUS;
  var projection = options.projection || 'EPSG:3857';
  var type = geometry.getType();
  if (type !== _GeometryType2.default.GEOMETRY_COLLECTION) {
    geometry = geometry.clone().transform(projection, 'EPSG:4326');
  }
  var length = 0;
  var coordinates = void 0,
      coords = void 0,
      i = void 0,
      ii = void 0,
      j = void 0,
      jj = void 0;
  switch (type) {
    case _GeometryType2.default.POINT:
    case _GeometryType2.default.MULTI_POINT:
      {
        break;
      }
    case _GeometryType2.default.LINE_STRING:
    case _GeometryType2.default.LINEAR_RING:
      {
        coordinates = /** @type {module:ol/geom/SimpleGeometry} */geometry.getCoordinates();
        length = getLengthInternal(coordinates, radius);
        break;
      }
    case _GeometryType2.default.MULTI_LINE_STRING:
    case _GeometryType2.default.POLYGON:
      {
        coordinates = /** @type {module:ol/geom/SimpleGeometry} */geometry.getCoordinates();
        for (i = 0, ii = coordinates.length; i < ii; ++i) {
          length += getLengthInternal(coordinates[i], radius);
        }
        break;
      }
    case _GeometryType2.default.MULTI_POLYGON:
      {
        coordinates = /** @type {module:ol/geom/SimpleGeometry} */geometry.getCoordinates();
        for (i = 0, ii = coordinates.length; i < ii; ++i) {
          coords = coordinates[i];
          for (j = 0, jj = coords.length; j < jj; ++j) {
            length += getLengthInternal(coords[j], radius);
          }
        }
        break;
      }
    case _GeometryType2.default.GEOMETRY_COLLECTION:
      {
        var geometries = /** @type {module:ol/geom/GeometryCollection} */geometry.getGeometries();
        for (i = 0, ii = geometries.length; i < ii; ++i) {
          length += getLength(geometries[i], opt_options);
        }
        break;
      }
    default:
      {
        throw new Error('Unsupported geometry type: ' + type);
      }
  }
  return length;
}

/**
 * Returns the spherical area for a list of coordinates.
 *
 * [Reference](https://trs-new.jpl.nasa.gov/handle/2014/40409)
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 * Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007
 *
 * @param {Array<module:ol/coordinate~Coordinate>} coordinates List of coordinates of a linear
 * ring. If the ring is oriented clockwise, the area will be positive,
 * otherwise it will be negative.
 * @param {number} radius The sphere radius.
 * @return {number} Area (in square meters).
 */
function getAreaInternal(coordinates, radius) {
  var area = 0;
  var len = coordinates.length;
  var x1 = coordinates[len - 1][0];
  var y1 = coordinates[len - 1][1];
  for (var i = 0; i < len; i++) {
    var x2 = coordinates[i][0];
    var y2 = coordinates[i][1];
    area += (0, _math.toRadians)(x2 - x1) * (2 + Math.sin((0, _math.toRadians)(y1)) + Math.sin((0, _math.toRadians)(y2)));
    x1 = x2;
    y1 = y2;
  }
  return area * radius * radius / 2.0;
}

/**
 * Get the spherical area of a geometry.  This is the area (in meters) assuming
 * that polygon edges are segments of great circles on a sphere.
 * @param {module:ol/geom/Geometry} geometry A geometry.
 * @param {module:ol/sphere~SphereMetricOptions=} opt_options Options for the area
 *     calculation.  By default, geometries are assumed to be in 'EPSG:3857'.
 *     You can change this by providing a `projection` option.
 * @return {number} The spherical area (in square meters).
 * @api
 */
function getArea(geometry, opt_options) {
  var options = opt_options || {};
  var radius = options.radius || DEFAULT_RADIUS;
  var projection = options.projection || 'EPSG:3857';
  var type = geometry.getType();
  if (type !== _GeometryType2.default.GEOMETRY_COLLECTION) {
    geometry = geometry.clone().transform(projection, 'EPSG:4326');
  }
  var area = 0;
  var coordinates = void 0,
      coords = void 0,
      i = void 0,
      ii = void 0,
      j = void 0,
      jj = void 0;
  switch (type) {
    case _GeometryType2.default.POINT:
    case _GeometryType2.default.MULTI_POINT:
    case _GeometryType2.default.LINE_STRING:
    case _GeometryType2.default.MULTI_LINE_STRING:
    case _GeometryType2.default.LINEAR_RING:
      {
        break;
      }
    case _GeometryType2.default.POLYGON:
      {
        coordinates = /** @type {module:ol/geom/Polygon} */geometry.getCoordinates();
        area = Math.abs(getAreaInternal(coordinates[0], radius));
        for (i = 1, ii = coordinates.length; i < ii; ++i) {
          area -= Math.abs(getAreaInternal(coordinates[i], radius));
        }
        break;
      }
    case _GeometryType2.default.MULTI_POLYGON:
      {
        coordinates = /** @type {module:ol/geom/SimpleGeometry} */geometry.getCoordinates();
        for (i = 0, ii = coordinates.length; i < ii; ++i) {
          coords = coordinates[i];
          area += Math.abs(getAreaInternal(coords[0], radius));
          for (j = 1, jj = coords.length; j < jj; ++j) {
            area -= Math.abs(getAreaInternal(coords[j], radius));
          }
        }
        break;
      }
    case _GeometryType2.default.GEOMETRY_COLLECTION:
      {
        var geometries = /** @type {module:ol/geom/GeometryCollection} */geometry.getGeometries();
        for (i = 0, ii = geometries.length; i < ii; ++i) {
          area += getArea(geometries[i], opt_options);
        }
        break;
      }
    default:
      {
        throw new Error('Unsupported geometry type: ' + type);
      }
  }
  return area;
}

/**
 * Returns the coordinate at the given distance and bearing from `c1`.
 *
 * @param {module:ol/coordinate~Coordinate} c1 The origin point (`[lon, lat]` in degrees).
 * @param {number} distance The great-circle distance between the origin
 *     point and the target point.
 * @param {number} bearing The bearing (in radians).
 * @param {number=} opt_radius The sphere radius to use.  Defaults to the Earth's
 *     mean radius using the WGS84 ellipsoid.
 * @return {module:ol/coordinate~Coordinate} The target point.
 */
function offset(c1, distance, bearing, opt_radius) {
  var radius = opt_radius || DEFAULT_RADIUS;
  var lat1 = (0, _math.toRadians)(c1[1]);
  var lon1 = (0, _math.toRadians)(c1[0]);
  var dByR = distance / radius;
  var lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
  var lon = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1), Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
  return [(0, _math.toDegrees)(lon), (0, _math.toDegrees)(lat)];
}