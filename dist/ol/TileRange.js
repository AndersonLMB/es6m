"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createOrUpdate = createOrUpdate;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/TileRange
 */

/**
 * A representation of a contiguous block of tiles.  A tile range is specified
 * by its min/max tile coordinates and is inclusive of coordinates.
 */
var TileRange = function () {

  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  function TileRange(minX, maxX, minY, maxY) {
    _classCallCheck(this, TileRange);

    /**
     * @type {number}
     */
    this.minX = minX;

    /**
     * @type {number}
     */
    this.maxX = maxX;

    /**
     * @type {number}
     */
    this.minY = minY;

    /**
     * @type {number}
     */
    this.maxY = maxY;
  }

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */


  _createClass(TileRange, [{
    key: "contains",
    value: function contains(tileCoord) {
      return this.containsXY(tileCoord[1], tileCoord[2]);
    }

    /**
     * @param {module:ol/TileRange} tileRange Tile range.
     * @return {boolean} Contains.
     */

  }, {
    key: "containsTileRange",
    value: function containsTileRange(tileRange) {
      return this.minX <= tileRange.minX && tileRange.maxX <= this.maxX && this.minY <= tileRange.minY && tileRange.maxY <= this.maxY;
    }

    /**
     * @param {number} x Tile coordinate x.
     * @param {number} y Tile coordinate y.
     * @return {boolean} Contains coordinate.
     */

  }, {
    key: "containsXY",
    value: function containsXY(x, y) {
      return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
    }

    /**
     * @param {module:ol/TileRange} tileRange Tile range.
     * @return {boolean} Equals.
     */

  }, {
    key: "equals",
    value: function equals(tileRange) {
      return this.minX == tileRange.minX && this.minY == tileRange.minY && this.maxX == tileRange.maxX && this.maxY == tileRange.maxY;
    }

    /**
     * @param {module:ol/TileRange} tileRange Tile range.
     */

  }, {
    key: "extend",
    value: function extend(tileRange) {
      if (tileRange.minX < this.minX) {
        this.minX = tileRange.minX;
      }
      if (tileRange.maxX > this.maxX) {
        this.maxX = tileRange.maxX;
      }
      if (tileRange.minY < this.minY) {
        this.minY = tileRange.minY;
      }
      if (tileRange.maxY > this.maxY) {
        this.maxY = tileRange.maxY;
      }
    }

    /**
    * @return {number} Height.
    */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.maxY - this.minY + 1;
    }

    /**
    * @return {module:ol/size~Size} Size.
    */

  }, {
    key: "getSize",
    value: function getSize() {
      return [this.getWidth(), this.getHeight()];
    }

    /**
    * @return {number} Width.
    */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.maxX - this.minX + 1;
    }

    /**
    * @param {module:ol/TileRange} tileRange Tile range.
    * @return {boolean} Intersects.
    */

  }, {
    key: "intersects",
    value: function intersects(tileRange) {
      return this.minX <= tileRange.maxX && this.maxX >= tileRange.minX && this.minY <= tileRange.maxY && this.maxY >= tileRange.minY;
    }
  }]);

  return TileRange;
}();

/**
 * @param {number} minX Minimum X.
 * @param {number} maxX Maximum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxY Maximum Y.
 * @param {module:ol/TileRange=} tileRange TileRange.
 * @return {module:ol/TileRange} Tile range.
 */


function createOrUpdate(minX, maxX, minY, maxY, tileRange) {
  if (tileRange !== undefined) {
    tileRange.minX = minX;
    tileRange.maxX = maxX;
    tileRange.minY = minY;
    tileRange.maxY = maxY;
    return tileRange;
  } else {
    return new TileRange(minX, maxX, minY, maxY);
  }
}

exports.default = TileRange;