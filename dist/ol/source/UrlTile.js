'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _tileurlfunction = require('../tileurlfunction.js');

var _Tile = require('../source/Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _TileEventType = require('../source/TileEventType.js');

var _TileEventType2 = _interopRequireDefault(_TileEventType);

var _tilecoord = require('../tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/UrlTile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions]
 * @property {number} [cacheSize]
 * @property {module:ol/extent~Extent} [extent]
 * @property {boolean} [opaque]
 * @property {module:ol/proj~ProjectionLike} [projection]
 * @property {module:ol/source/State} [state]
 * @property {module:ol/tilegrid/TileGrid} [tileGrid]
 * @property {module:ol/Tile~LoadFunction} tileLoadFunction
 * @property {number} [tilePixelRatio]
 * @property {module:ol/Tile~UrlFunction} [tileUrlFunction]
 * @property {string} [url]
 * @property {Array<string>} [urls]
 * @property {boolean} [wrapX=true]
 * @property {number} [transition]
 */

/**
 * @classdesc
 * Base class for sources providing tiles divided into a tile grid over http.
 *
 * @fires module:ol/source/TileEvent
 */
var UrlTile = function (_TileSource) {
  _inherits(UrlTile, _TileSource);

  /**
   * @param {module:ol/source/UrlTile~Options=} options Image tile options.
   */
  function UrlTile(options) {
    _classCallCheck(this, UrlTile);

    /**
     * @protected
     * @type {module:ol/Tile~LoadFunction}
     */
    var _this = _possibleConstructorReturn(this, (UrlTile.__proto__ || Object.getPrototypeOf(UrlTile)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      extent: options.extent,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tilePixelRatio: options.tilePixelRatio,
      wrapX: options.wrapX,
      transition: options.transition
    }));

    _this.tileLoadFunction = options.tileLoadFunction;

    /**
     * @protected
     * @type {module:ol/Tile~UrlFunction}
     */
    _this.tileUrlFunction = _this.fixedTileUrlFunction ? _this.fixedTileUrlFunction.bind(_this) : _tileurlfunction.nullTileUrlFunction;

    /**
     * @protected
     * @type {!Array<string>|null}
     */
    _this.urls = null;

    if (options.urls) {
      _this.setUrls(options.urls);
    } else if (options.url) {
      _this.setUrl(options.url);
    }
    if (options.tileUrlFunction) {
      _this.setTileUrlFunction(options.tileUrlFunction);
    }

    /**
     * @private
     * @type {!Object<number, boolean>}
     */
    _this.tileLoadingKeys_ = {};

    return _this;
  }

  /**
   * Return the tile load function of the source.
   * @return {module:ol/Tile~LoadFunction} TileLoadFunction
   * @api
   */


  _createClass(UrlTile, [{
    key: 'getTileLoadFunction',
    value: function getTileLoadFunction() {
      return this.tileLoadFunction;
    }

    /**
     * Return the tile URL function of the source.
     * @return {module:ol/Tile~UrlFunction} TileUrlFunction
     * @api
     */

  }, {
    key: 'getTileUrlFunction',
    value: function getTileUrlFunction() {
      return this.tileUrlFunction;
    }

    /**
     * Return the URLs used for this source.
     * When a tileUrlFunction is used instead of url or urls,
     * null will be returned.
     * @return {!Array<string>|null} URLs.
     * @api
     */

  }, {
    key: 'getUrls',
    value: function getUrls() {
      return this.urls;
    }

    /**
     * Handle tile change events.
     * @param {module:ol/events/Event} event Event.
     * @protected
     */

  }, {
    key: 'handleTileChange',
    value: function handleTileChange(event) {
      var tile = /** @type {module:ol/Tile} */event.target;
      var uid = (0, _util.getUid)(tile);
      var tileState = tile.getState();
      var type = void 0;
      if (tileState == _TileState2.default.LOADING) {
        this.tileLoadingKeys_[uid] = true;
        type = _TileEventType2.default.TILELOADSTART;
      } else if (uid in this.tileLoadingKeys_) {
        delete this.tileLoadingKeys_[uid];
        type = tileState == _TileState2.default.ERROR ? _TileEventType2.default.TILELOADERROR : tileState == _TileState2.default.LOADED || tileState == _TileState2.default.ABORT ? _TileEventType2.default.TILELOADEND : undefined;
      }
      if (type != undefined) {
        this.dispatchEvent(new _Tile.TileSourceEvent(type, tile));
      }
    }

    /**
     * Set the tile load function of the source.
     * @param {module:ol/Tile~LoadFunction} tileLoadFunction Tile load function.
     * @api
     */

  }, {
    key: 'setTileLoadFunction',
    value: function setTileLoadFunction(tileLoadFunction) {
      this.tileCache.clear();
      this.tileLoadFunction = tileLoadFunction;
      this.changed();
    }

    /**
     * Set the tile URL function of the source.
     * @param {module:ol/Tile~UrlFunction} tileUrlFunction Tile URL function.
     * @param {string=} opt_key Optional new tile key for the source.
     * @api
     */

  }, {
    key: 'setTileUrlFunction',
    value: function setTileUrlFunction(tileUrlFunction, opt_key) {
      this.tileUrlFunction = tileUrlFunction;
      this.tileCache.pruneExceptNewestZ();
      if (typeof opt_key !== 'undefined') {
        this.setKey(opt_key);
      } else {
        this.changed();
      }
    }

    /**
     * Set the URL to use for requests.
     * @param {string} url URL.
     * @api
     */

  }, {
    key: 'setUrl',
    value: function setUrl(url) {
      var urls = this.urls = (0, _tileurlfunction.expandUrl)(url);
      this.setTileUrlFunction(this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : (0, _tileurlfunction.createFromTemplates)(urls, this.tileGrid), url);
    }

    /**
     * Set the URLs to use for requests.
     * @param {Array<string>} urls URLs.
     * @api
     */

  }, {
    key: 'setUrls',
    value: function setUrls(urls) {
      this.urls = urls;
      var key = urls.join('\n');
      this.setTileUrlFunction(this.fixedTileUrlFunction ? this.fixedTileUrlFunction.bind(this) : (0, _tileurlfunction.createFromTemplates)(urls, this.tileGrid), key);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'useTile',
    value: function useTile(z, x, y) {
      var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
      if (this.tileCache.containsKey(tileCoordKey)) {
        this.tileCache.get(tileCoordKey);
      }
    }
  }]);

  return UrlTile;
}(_Tile2.default);

/**
 * @type {module:ol/Tile~UrlFunction|undefined}
 * @protected
 */


UrlTile.prototype.fixedTileUrlFunction;

exports.default = UrlTile;