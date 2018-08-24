"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.get = get;
exports.add = add;
/**
 * @module ol/proj/projections
 */

/**
 * @type {Object<string, module:ol/proj/Projection>}
 */
var cache = {};

/**
 * Clear the projections cache.
 */
function clear() {
  cache = {};
}

/**
 * Get a cached projection by code.
 * @param {string} code The code for the projection.
 * @return {module:ol/proj/Projection} The projection (if cached).
 */
function get(code) {
  return cache[code] || null;
}

/**
 * Add a projection to the cache.
 * @param {string} code The projection code.
 * @param {module:ol/proj/Projection} projection The projection to cache.
 */
function add(code, projection) {
  cache[code] = projection;
}