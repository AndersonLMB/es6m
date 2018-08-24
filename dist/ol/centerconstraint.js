'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtent = createExtent;
exports.none = none;

var _math = require('./math.js');

/**
 * @typedef {function((module:ol/coordinate~Coordinate|undefined)): (module:ol/coordinate~Coordinate|undefined)} Type
 */

/**
 * @param {module:ol/extent~Extent} extent Extent.
 * @return {module:ol/centerconstraint~Type} The constraint.
 */
function createExtent(extent) {
  return (
    /**
     * @param {module:ol/coordinate~Coordinate=} center Center.
     * @return {module:ol/coordinate~Coordinate|undefined} Center.
     */
    function (center) {
      if (center) {
        return [(0, _math.clamp)(center[0], extent[0], extent[2]), (0, _math.clamp)(center[1], extent[1], extent[3])];
      } else {
        return undefined;
      }
    }
  );
}

/**
 * @param {module:ol/coordinate~Coordinate=} center Center.
 * @return {module:ol/coordinate~Coordinate|undefined} Center.
 */
/**
 * @module ol/centerconstraint
 */
function none(center) {
  return center;
}