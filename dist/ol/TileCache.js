'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LRUCache2 = require('./structs/LRUCache.js');

var _LRUCache3 = _interopRequireDefault(_LRUCache2);

var _tilecoord = require('./tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/TileCache
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var TileCache = function (_LRUCache) {
  _inherits(TileCache, _LRUCache);

  /**
   * @param {number=} opt_highWaterMark High water mark.
   */
  function TileCache(opt_highWaterMark) {
    _classCallCheck(this, TileCache);

    return _possibleConstructorReturn(this, (TileCache.__proto__ || Object.getPrototypeOf(TileCache)).call(this, opt_highWaterMark));
  }

  /**
   * @param {!Object<string, module:ol/TileRange>} usedTiles Used tiles.
   */


  _createClass(TileCache, [{
    key: 'expireCache',
    value: function expireCache(usedTiles) {
      while (this.canExpireCache()) {
        var tile = this.peekLast();
        var zKey = tile.tileCoord[0].toString();
        if (zKey in usedTiles && usedTiles[zKey].contains(tile.tileCoord)) {
          break;
        } else {
          this.pop().dispose();
        }
      }
    }

    /**
     * Prune all tiles from the cache that don't have the same z as the newest tile.
     */

  }, {
    key: 'pruneExceptNewestZ',
    value: function pruneExceptNewestZ() {
      if (this.getCount() === 0) {
        return;
      }
      var key = this.peekFirstKey();
      var tileCoord = (0, _tilecoord.fromKey)(key);
      var z = tileCoord[0];
      this.forEach(function (tile) {
        if (tile.tileCoord[0] !== z) {
          this.remove((0, _tilecoord.getKey)(tile.tileCoord));
          tile.dispose();
        }
      }, this);
    }
  }]);

  return TileCache;
}(_LRUCache3.default);

exports.default = TileCache;