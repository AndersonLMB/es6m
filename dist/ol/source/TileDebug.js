'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tile2 = require('../Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('../dom.js');

var _size = require('../size.js');

var _Tile4 = require('../source/Tile.js');

var _Tile5 = _interopRequireDefault(_Tile4);

var _tilecoord = require('../tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/TileDebug
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var LabeledTile = function (_Tile) {
  _inherits(LabeledTile, _Tile);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/size~Size} tileSize Tile size.
   * @param {string} text Text.
   */
  function LabeledTile(tileCoord, tileSize, text) {
    _classCallCheck(this, LabeledTile);

    /**
    * @private
    * @type {module:ol/size~Size}
    */
    var _this = _possibleConstructorReturn(this, (LabeledTile.__proto__ || Object.getPrototypeOf(LabeledTile)).call(this, tileCoord, _TileState2.default.LOADED));

    _this.tileSize_ = tileSize;

    /**
    * @private
    * @type {string}
    */
    _this.text_ = text;

    /**
    * @private
    * @type {HTMLCanvasElement}
    */
    _this.canvas_ = null;

    return _this;
  }

  /**
  * Get the image element for this tile.
  * @return {HTMLCanvasElement} Image.
  */


  _createClass(LabeledTile, [{
    key: 'getImage',
    value: function getImage() {
      if (this.canvas_) {
        return this.canvas_;
      } else {
        var tileSize = this.tileSize_;
        var context = (0, _dom.createCanvasContext2D)(tileSize[0], tileSize[1]);

        context.strokeStyle = 'black';
        context.strokeRect(0.5, 0.5, tileSize[0] + 0.5, tileSize[1] + 0.5);

        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '24px sans-serif';
        context.fillText(this.text_, tileSize[0] / 2, tileSize[1] / 2);

        this.canvas_ = context.canvas;
        return context.canvas;
      }
    }

    /**
    * @override
    */

  }, {
    key: 'load',
    value: function load() {}
  }]);

  return LabeledTile;
}(_Tile3.default);

/**
 * @typedef {Object} Options
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {module:ol/tilegrid/TileGrid} [tileGrid] Tile grid.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * A pseudo tile source, which does not fetch tiles from a server, but renders
 * a grid outline for the tile grid/projection along with the coordinates for
 * each tile. See examples/canvas-tiles for an example.
 *
 * Uses Canvas context2d, so requires Canvas support.
 * @api
 */


var TileDebug = function (_TileSource) {
  _inherits(TileDebug, _TileSource);

  /**
   * @param {module:ol/source/TileDebug~Options=} options Debug tile options.
   */
  function TileDebug(options) {
    _classCallCheck(this, TileDebug);

    return _possibleConstructorReturn(this, (TileDebug.__proto__ || Object.getPrototypeOf(TileDebug)).call(this, {
      opaque: false,
      projection: options.projection,
      tileGrid: options.tileGrid,
      wrapX: options.wrapX !== undefined ? options.wrapX : true
    }));
  }

  /**
  * @inheritDoc
  */


  _createClass(TileDebug, [{
    key: 'getTile',
    value: function getTile(z, x, y) {
      var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
      if (this.tileCache.containsKey(tileCoordKey)) {
        return (/** @type {!module:ol/source/TileDebug~LabeledTile} */this.tileCache.get(tileCoordKey)
        );
      } else {
        var tileSize = (0, _size.toSize)(this.tileGrid.getTileSize(z));
        var tileCoord = [z, x, y];
        var textTileCoord = this.getTileCoordForTileUrlFunction(tileCoord);
        var text = !textTileCoord ? '' : this.getTileCoordForTileUrlFunction(textTileCoord).toString();
        var tile = new LabeledTile(tileCoord, tileSize, text);
        this.tileCache.set(tileCoordKey, tile);
        return tile;
      }
    }
  }]);

  return TileDebug;
}(_Tile5.default);

exports.default = TileDebug;