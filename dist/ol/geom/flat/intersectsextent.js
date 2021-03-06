'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.intersectsLineString = intersectsLineString;
exports.intersectsLineStringArray = intersectsLineStringArray;
exports.intersectsLinearRing = intersectsLinearRing;
exports.intersectsLinearRingArray = intersectsLinearRingArray;
exports.intersectsLinearRingMultiArray = intersectsLinearRingMultiArray;

var _extent = require('../../extent.js');

var _contains = require('../flat/contains.js');

var _segments = require('../flat/segments.js');

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLineString(flatCoordinates, offset, end, stride, extent) {
  var coordinatesExtent = (0, _extent.extendFlatCoordinates)((0, _extent.createEmpty)(), flatCoordinates, offset, end, stride);
  if (!(0, _extent.intersects)(extent, coordinatesExtent)) {
    return false;
  }
  if ((0, _extent.containsExtent)(extent, coordinatesExtent)) {
    return true;
  }
  if (coordinatesExtent[0] >= extent[0] && coordinatesExtent[2] <= extent[2]) {
    return true;
  }
  if (coordinatesExtent[1] >= extent[1] && coordinatesExtent[3] <= extent[3]) {
    return true;
  }
  return (0, _segments.forEach)(flatCoordinates, offset, end, stride,
  /**
   * @param {module:ol/coordinate~Coordinate} point1 Start point.
   * @param {module:ol/coordinate~Coordinate} point2 End point.
   * @return {boolean} `true` if the segment and the extent intersect,
   *     `false` otherwise.
   */
  function (point1, point2) {
    return (0, _extent.intersectsSegment)(extent, point1, point2);
  });
}

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
/**
 * @module ol/geom/flat/intersectsextent
 */
function intersectsLineStringArray(flatCoordinates, offset, ends, stride, extent) {
  for (var i = 0, ii = ends.length; i < ii; ++i) {
    if (intersectsLineString(flatCoordinates, offset, ends[i], stride, extent)) {
      return true;
    }
    offset = ends[i];
  }
  return false;
}

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLinearRing(flatCoordinates, offset, end, stride, extent) {
  if (intersectsLineString(flatCoordinates, offset, end, stride, extent)) {
    return true;
  }
  if ((0, _contains.linearRingContainsXY)(flatCoordinates, offset, end, stride, extent[0], extent[1])) {
    return true;
  }
  if ((0, _contains.linearRingContainsXY)(flatCoordinates, offset, end, stride, extent[0], extent[3])) {
    return true;
  }
  if ((0, _contains.linearRingContainsXY)(flatCoordinates, offset, end, stride, extent[2], extent[1])) {
    return true;
  }
  if ((0, _contains.linearRingContainsXY)(flatCoordinates, offset, end, stride, extent[2], extent[3])) {
    return true;
  }
  return false;
}

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<number>} ends Ends.
 * @param {number} stride Stride.
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent) {
  if (!intersectsLinearRing(flatCoordinates, offset, ends[0], stride, extent)) {
    return false;
  }
  if (ends.length === 1) {
    return true;
  }
  for (var i = 1, ii = ends.length; i < ii; ++i) {
    if ((0, _contains.linearRingContainsExtent)(flatCoordinates, ends[i - 1], ends[i], stride, extent)) {
      return false;
    }
  }
  return true;
}

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<Array<number>>} endss Endss.
 * @param {number} stride Stride.
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {boolean} True if the geometry and the extent intersect.
 */
function intersectsLinearRingMultiArray(flatCoordinates, offset, endss, stride, extent) {
  for (var i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    if (intersectsLinearRingArray(flatCoordinates, offset, ends, stride, extent)) {
      return true;
    }
    offset = ends[ends.length - 1];
  }
  return false;
}