'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdate = createOrUpdate;
exports.getKeyZXY = getKeyZXY;
exports.getKey = getKey;
exports.fromKey = fromKey;
exports.hash = hash;
exports.quadKey = quadKey;
exports.withinExtentAndZ = withinExtentAndZ;
/**
 * @module ol/tilecoord
 */

/**
 * An array of three numbers representing the location of a tile in a tile
 * grid. The order is `z`, `x`, and `y`. `z` is the zoom level.
 * @typedef {Array<number>} TileCoord
 * @api
 */

/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @param {module:ol/tilecoord~TileCoord=} opt_tileCoord Tile coordinate.
 * @return {module:ol/tilecoord~TileCoord} Tile coordinate.
 */
function createOrUpdate(z, x, y, opt_tileCoord) {
  if (opt_tileCoord !== undefined) {
    opt_tileCoord[0] = z;
    opt_tileCoord[1] = x;
    opt_tileCoord[2] = y;
    return opt_tileCoord;
  } else {
    return [z, x, y];
  }
}

/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @return {string} Key.
 */
function getKeyZXY(z, x, y) {
  return z + '/' + x + '/' + y;
}

/**
 * Get the key for a tile coord.
 * @param {module:ol/tilecoord~TileCoord} tileCoord The tile coord.
 * @return {string} Key.
 */
function getKey(tileCoord) {
  return getKeyZXY(tileCoord[0], tileCoord[1], tileCoord[2]);
}

/**
 * Get a tile coord given a key.
 * @param {string} key The tile coord key.
 * @return {module:ol/tilecoord~TileCoord} The tile coord.
 */
function fromKey(key) {
  return key.split('/').map(Number);
}

/**
 * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coord.
 * @return {number} Hash.
 */
function hash(tileCoord) {
  return (tileCoord[1] << tileCoord[0]) + tileCoord[2];
}

/**
 * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coord.
 * @return {string} Quad key.
 */
function quadKey(tileCoord) {
  var z = tileCoord[0];
  var digits = new Array(z);
  var mask = 1 << z - 1;
  var i = void 0,
      charCode = void 0;
  for (i = 0; i < z; ++i) {
    // 48 is charCode for 0 - '0'.charCodeAt(0)
    charCode = 48;
    if (tileCoord[1] & mask) {
      charCode += 1;
    }
    if (tileCoord[2] & mask) {
      charCode += 2;
    }
    digits[i] = String.fromCharCode(charCode);
    mask >>= 1;
  }
  return digits.join('');
}

/**
 * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
 * @param {!module:ol/tilegrid/TileGrid} tileGrid Tile grid.
 * @return {boolean} Tile coordinate is within extent and zoom level range.
 */
function withinExtentAndZ(tileCoord, tileGrid) {
  var z = tileCoord[0];
  var x = tileCoord[1];
  var y = tileCoord[2];

  if (tileGrid.getMinZoom() > z || z > tileGrid.getMaxZoom()) {
    return false;
  }
  var extent = tileGrid.getExtent();
  var tileRange = void 0;
  if (!extent) {
    tileRange = tileGrid.getFullTileRange(z);
  } else {
    tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
  }
  if (!tileRange) {
    return true;
  } else {
    return tileRange.containsXY(x, y);
  }
}