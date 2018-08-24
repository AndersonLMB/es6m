'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require('./common.js');

var _Tile2 = require('../Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _math = require('../math.js');

var _reproj = require('../reproj.js');

var _Triangulation = require('../reproj/Triangulation.js');

var _Triangulation2 = _interopRequireDefault(_Triangulation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/reproj/Tile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {function(number, number, number, number) : module:ol/Tile} FunctionType
 */

/**
 * @classdesc
 * Class encapsulating single reprojected tile.
 * See {@link module:ol/source/TileImage~TileImage}.
 *
 */
var ReprojTile = function (_Tile) {
  _inherits(ReprojTile, _Tile);

  /**
   * @param {module:ol/proj/Projection} sourceProj Source projection.
   * @param {module:ol/tilegrid/TileGrid} sourceTileGrid Source tile grid.
   * @param {module:ol/proj/Projection} targetProj Target projection.
   * @param {module:ol/tilegrid/TileGrid} targetTileGrid Target tile grid.
   * @param {module:ol/tilecoord~TileCoord} tileCoord Coordinate of the tile.
   * @param {module:ol/tilecoord~TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {module:ol/reproj/Tile~FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number=} opt_errorThreshold Acceptable reprojection error (in px).
   * @param {boolean=} opt_renderEdges Render reprojection edges.
   */
  function ReprojTile(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, opt_errorThreshold, opt_renderEdges) {
    _classCallCheck(this, ReprojTile);

    /**
     * @private
     * @type {boolean}
     */
    var _this = _possibleConstructorReturn(this, (ReprojTile.__proto__ || Object.getPrototypeOf(ReprojTile)).call(this, tileCoord, _TileState2.default.IDLE));

    _this.renderEdges_ = opt_renderEdges !== undefined ? opt_renderEdges : false;

    /**
     * @private
     * @type {number}
     */
    _this.pixelRatio_ = pixelRatio;

    /**
     * @private
     * @type {number}
     */
    _this.gutter_ = gutter;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = null;

    /**
     * @private
     * @type {module:ol/tilegrid/TileGrid}
     */
    _this.sourceTileGrid_ = sourceTileGrid;

    /**
     * @private
     * @type {module:ol/tilegrid/TileGrid}
     */
    _this.targetTileGrid_ = targetTileGrid;

    /**
     * @private
     * @type {module:ol/tilecoord~TileCoord}
     */
    _this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;

    /**
     * @private
     * @type {!Array<module:ol/Tile>}
     */
    _this.sourceTiles_ = [];

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.sourcesListenerKeys_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.sourceZ_ = 0;

    var targetExtent = targetTileGrid.getTileCoordExtent(_this.wrappedTileCoord_);
    var maxTargetExtent = _this.targetTileGrid_.getExtent();
    var maxSourceExtent = _this.sourceTileGrid_.getExtent();

    var limitedTargetExtent = maxTargetExtent ? (0, _extent.getIntersection)(targetExtent, maxTargetExtent) : targetExtent;

    if ((0, _extent.getArea)(limitedTargetExtent) === 0) {
      // Tile is completely outside range -> EMPTY
      // TODO: is it actually correct that the source even creates the tile ?
      _this.state = _TileState2.default.EMPTY;
      return _possibleConstructorReturn(_this);
    }

    var sourceProjExtent = sourceProj.getExtent();
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = (0, _extent.getIntersection)(maxSourceExtent, sourceProjExtent);
      }
    }

    var targetResolution = targetTileGrid.getResolution(_this.wrappedTileCoord_[0]);

    var targetCenter = (0, _extent.getCenter)(limitedTargetExtent);
    var sourceResolution = (0, _reproj.calculateSourceResolution)(sourceProj, targetProj, targetCenter, targetResolution);

    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      // invalid sourceResolution -> EMPTY
      // probably edges of the projections when no extent is defined
      _this.state = _TileState2.default.EMPTY;
      return _possibleConstructorReturn(_this);
    }

    var errorThresholdInPixels = opt_errorThreshold !== undefined ? opt_errorThreshold : _common.ERROR_THRESHOLD;

    /**
     * @private
     * @type {!module:ol/reproj/Triangulation}
     */
    _this.triangulation_ = new _Triangulation2.default(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels);

    if (_this.triangulation_.getTriangles().length === 0) {
      // no valid triangles -> EMPTY
      _this.state = _TileState2.default.EMPTY;
      return _possibleConstructorReturn(_this);
    }

    _this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
    var sourceExtent = _this.triangulation_.calculateSourceExtent();

    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = (0, _math.clamp)(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
        sourceExtent[3] = (0, _math.clamp)(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
      } else {
        sourceExtent = (0, _extent.getIntersection)(sourceExtent, maxSourceExtent);
      }
    }

    if (!(0, _extent.getArea)(sourceExtent)) {
      _this.state = _TileState2.default.EMPTY;
    } else {
      var sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(sourceExtent, _this.sourceZ_);

      for (var srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
        for (var srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
          var tile = getTileFunction(_this.sourceZ_, srcX, srcY, pixelRatio);
          if (tile) {
            _this.sourceTiles_.push(tile);
          }
        }
      }

      if (_this.sourceTiles_.length === 0) {
        _this.state = _TileState2.default.EMPTY;
      }
    }
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(ReprojTile, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      if (this.state == _TileState2.default.LOADING) {
        this.unlistenSources_();
      }
      _Tile3.default.prototype.disposeInternal.call(this);
    }

    /**
     * Get the HTML Canvas element for this tile.
     * @return {HTMLCanvasElement} Canvas.
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      return this.canvas_;
    }

    /**
     * @private
     */

  }, {
    key: 'reproject_',
    value: function reproject_() {
      var sources = [];
      this.sourceTiles_.forEach(function (tile, i, arr) {
        if (tile && tile.getState() == _TileState2.default.LOADED) {
          sources.push({
            extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
            image: tile.getImage()
          });
        }
      }.bind(this));
      this.sourceTiles_.length = 0;

      if (sources.length === 0) {
        this.state = _TileState2.default.ERROR;
      } else {
        var z = this.wrappedTileCoord_[0];
        var size = this.targetTileGrid_.getTileSize(z);
        var width = typeof size === 'number' ? size : size[0];
        var height = typeof size === 'number' ? size : size[1];
        var targetResolution = this.targetTileGrid_.getResolution(z);
        var sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);

        var targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
        this.canvas_ = (0, _reproj.render)(width, height, this.pixelRatio_, sourceResolution, this.sourceTileGrid_.getExtent(), targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, this.renderEdges_);

        this.state = _TileState2.default.LOADED;
      }
      this.changed();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.state == _TileState2.default.IDLE) {
        this.state = _TileState2.default.LOADING;
        this.changed();

        var leftToLoad = 0;

        this.sourcesListenerKeys_ = [];
        this.sourceTiles_.forEach(function (tile, i, arr) {
          var state = tile.getState();
          if (state == _TileState2.default.IDLE || state == _TileState2.default.LOADING) {
            leftToLoad++;

            var sourceListenKey = (0, _events.listen)(tile, _EventType2.default.CHANGE, function (e) {
              var state = tile.getState();
              if (state == _TileState2.default.LOADED || state == _TileState2.default.ERROR || state == _TileState2.default.EMPTY) {
                (0, _events.unlistenByKey)(sourceListenKey);
                leftToLoad--;
                if (leftToLoad === 0) {
                  this.unlistenSources_();
                  this.reproject_();
                }
              }
            }, this);
            this.sourcesListenerKeys_.push(sourceListenKey);
          }
        }.bind(this));

        this.sourceTiles_.forEach(function (tile, i, arr) {
          var state = tile.getState();
          if (state == _TileState2.default.IDLE) {
            tile.load();
          }
        });

        if (leftToLoad === 0) {
          setTimeout(this.reproject_.bind(this), 0);
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'unlistenSources_',
    value: function unlistenSources_() {
      this.sourcesListenerKeys_.forEach(_events.unlistenByKey);
      this.sourcesListenerKeys_ = null;
    }
  }]);

  return ReprojTile;
}(_Tile3.default);

exports.default = ReprojTile;