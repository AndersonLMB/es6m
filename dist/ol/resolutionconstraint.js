'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSnapToResolutions = createSnapToResolutions;
exports.createSnapToPower = createSnapToPower;

var _array = require('./array.js');

var _math = require('./math.js');

/**
 * @typedef {function((number|undefined), number, number): (number|undefined)} Type
 */

/**
 * @param {Array<number>} resolutions Resolutions.
 * @return {module:ol/resolutionconstraint~Type} Zoom function.
 */
/**
 * @module ol/resolutionconstraint
 */
function createSnapToResolutions(resolutions) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @return {number|undefined} Resolution.
     */
    function (resolution, delta, direction) {
      if (resolution !== undefined) {
        var z = (0, _array.linearFindNearest)(resolutions, resolution, direction);
        z = (0, _math.clamp)(z + delta, 0, resolutions.length - 1);
        var index = Math.floor(z);
        if (z != index && index < resolutions.length - 1) {
          var power = resolutions[index] / resolutions[index + 1];
          return resolutions[index] / Math.pow(power, z - index);
        } else {
          return resolutions[index];
        }
      } else {
        return undefined;
      }
    }
  );
}

/**
 * @param {number} power Power.
 * @param {number} maxResolution Maximum resolution.
 * @param {number=} opt_maxLevel Maximum level.
 * @return {module:ol/resolutionconstraint~Type} Zoom function.
 */
function createSnapToPower(power, maxResolution, opt_maxLevel) {
  return (
    /**
     * @param {number|undefined} resolution Resolution.
     * @param {number} delta Delta.
     * @param {number} direction Direction.
     * @return {number|undefined} Resolution.
     */
    function (resolution, delta, direction) {
      if (resolution !== undefined) {
        var offset = -direction / 2 + 0.5;
        var oldLevel = Math.floor(Math.log(maxResolution / resolution) / Math.log(power) + offset);
        var newLevel = Math.max(oldLevel + delta, 0);
        if (opt_maxLevel !== undefined) {
          newLevel = Math.min(newLevel, opt_maxLevel);
        }
        return maxResolution / Math.pow(power, newLevel);
      } else {
        return undefined;
      }
    }
  );
}