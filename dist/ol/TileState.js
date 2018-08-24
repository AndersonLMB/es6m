"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module ol/TileState
 */

/**
 * @enum {number}
 */
exports.default = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   * @api
   */
  ERROR: 3,
  EMPTY: 4,
  ABORT: 5
};