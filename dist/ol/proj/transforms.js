'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.add = add;
exports.remove = remove;
exports.get = get;

var _obj = require('../obj.js');

/**
 * @private
 * @type {!Object<string, Object<string, module:ol/proj~TransformFunction>>}
 */
var transforms = {};

/**
 * Clear the transform cache.
 */
/**
 * @module ol/proj/transforms
 */
function clear() {
  transforms = {};
}

/**
 * Registers a conversion function to convert coordinates from the source
 * projection to the destination projection.
 *
 * @param {module:ol/proj/Projection} source Source.
 * @param {module:ol/proj/Projection} destination Destination.
 * @param {module:ol/proj~TransformFunction} transformFn Transform.
 */
function add(source, destination, transformFn) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  if (!(sourceCode in transforms)) {
    transforms[sourceCode] = {};
  }
  transforms[sourceCode][destinationCode] = transformFn;
}

/**
 * Unregisters the conversion function to convert coordinates from the source
 * projection to the destination projection.  This method is used to clean up
 * cached transforms during testing.
 *
 * @param {module:ol/proj/Projection} source Source projection.
 * @param {module:ol/proj/Projection} destination Destination projection.
 * @return {module:ol/proj~TransformFunction} transformFn The unregistered transform.
 */
function remove(source, destination) {
  var sourceCode = source.getCode();
  var destinationCode = destination.getCode();
  var transform = transforms[sourceCode][destinationCode];
  delete transforms[sourceCode][destinationCode];
  if ((0, _obj.isEmpty)(transforms[sourceCode])) {
    delete transforms[sourceCode];
  }
  return transform;
}

/**
 * Get a transform given a source code and a destination code.
 * @param {string} sourceCode The code for the source projection.
 * @param {string} destinationCode The code for the destination projection.
 * @return {module:ol/proj~TransformFunction|undefined} The transform function (if found).
 */
function get(sourceCode, destinationCode) {
  var transform = void 0;
  if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
    transform = transforms[sourceCode][destinationCode];
  }
  return transform;
}