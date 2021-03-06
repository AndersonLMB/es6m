"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchingChunk = matchingChunk;
/**
 * @module ol/geom/flat/straightchunk
 */

/**
 * @param {number} maxAngle Maximum acceptable angle delta between segments.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {Array<number>} Start and end of the first suitable chunk of the
 * given `flatCoordinates`.
 */
function matchingChunk(maxAngle, flatCoordinates, offset, end, stride) {
  var chunkStart = offset;
  var chunkEnd = offset;
  var chunkM = 0;
  var m = 0;
  var start = offset;
  var acos = void 0,
      i = void 0,
      m12 = void 0,
      m23 = void 0,
      x1 = void 0,
      y1 = void 0,
      x12 = void 0,
      y12 = void 0,
      x23 = void 0,
      y23 = void 0;
  for (i = offset; i < end; i += stride) {
    var x2 = flatCoordinates[i];
    var y2 = flatCoordinates[i + 1];
    if (x1 !== undefined) {
      x23 = x2 - x1;
      y23 = y2 - y1;
      m23 = Math.sqrt(x23 * x23 + y23 * y23);
      if (x12 !== undefined) {
        m += m12;
        acos = Math.acos((x12 * x23 + y12 * y23) / (m12 * m23));
        if (acos > maxAngle) {
          if (m > chunkM) {
            chunkM = m;
            chunkStart = start;
            chunkEnd = i;
          }
          m = 0;
          start = i - stride;
        }
      }
      m12 = m23;
      x12 = x23;
      y12 = y23;
    }
    x1 = x2;
    y1 = y2;
  }
  m += m23;
  return m > chunkM ? [start, i] : [chunkStart, chunkEnd];
}