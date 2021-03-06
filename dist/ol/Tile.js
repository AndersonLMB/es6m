'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _easing = require('./easing.js');

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Tile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * A function that takes an {@link module:ol/Tile} for the tile and a
 * `{string}` for the url as arguments. The default is
 * ```js
 * source.setTileLoadFunction(function(tile, src) {
 *   tile.getImage().src = src;
 * });
 * ```
 * For more fine grained control, the load function can use fetch or XMLHttpRequest and involve
 * error handling:
 *
 * ```js
 * import TileState from 'ol/TileState';
 *
 * source.setTileLoadFunction(function(tile, src) {
 *   var xhr = new XMLHttpRequest();
 *   xhr.responseType = 'blob';
 *   xhr.addEventListener('loadend', function (evt) {
 *     var data = this.response;
 *     if (data !== undefined) {
 *       tile.getImage().src = URL.createObjectURL(data);
 *     } else {
 *       tile.setState(TileState.ERROR);
 *     }
 *   });
 *   xhr.addEventListener('error', function () {
 *     tile.setState(TileState.ERROR);
 *   });
 *   xhr.open('GET', src);
 *   xhr.send();
 * });
 * ```
 *
 * @typedef {function(module:ol/Tile, string)} LoadFunction
 * @api
 */

/**
 * {@link module:ol/source/Tile~Tile} sources use a function of this type to get
 * the url that provides a tile for a given tile coordinate.
 *
 * This function takes an {@link module:ol/tilecoord~TileCoord} for the tile
 * coordinate, a `{number}` representing the pixel ratio and a
 * {@link module:ol/proj/Projection} for the projection  as arguments
 * and returns a `{string}` representing the tile URL, or undefined if no tile
 * should be requested for the passed tile coordinate.
 *
 * @typedef {function(module:ol/tilecoord~TileCoord, number,
 *           module:ol/proj/Projection): (string|undefined)} UrlFunction
 * @api
 */

/**
 * @typedef {Object} Options
 * @property {number} [transition=250] A duration for tile opacity
 * transitions in milliseconds. A duration of 0 disables the opacity transition.
 * @api
 */

/**
 * @classdesc
 * Base class for tiles.
 *
 * @abstract
 */
var Tile = function (_EventTarget) {
  _inherits(Tile, _EventTarget);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {module:ol/Tile~Options=} opt_options Tile options.
   */
  function Tile(tileCoord, state, opt_options) {
    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @type {module:ol/tilecoord~TileCoord}
     */
    _this.tileCoord = tileCoord;

    /**
     * @protected
     * @type {module:ol/TileState}
     */
    _this.state = state;

    /**
     * An "interim" tile for this tile. The interim tile may be used while this
     * one is loading, for "smooth" transitions when changing params/dimensions
     * on the source.
     * @type {module:ol/Tile}
     */
    _this.interimTile = null;

    /**
     * A key assigned to the tile. This is used by the tile source to determine
     * if this tile can effectively be used, or if a new tile should be created
     * and this one be used as an interim tile for this new tile.
     * @type {string}
     */
    _this.key = '';

    /**
     * The duration for the opacity transition.
     * @type {number}
     */
    _this.transition_ = options.transition === undefined ? 250 : options.transition;

    /**
     * Lookup of start times for rendering transitions.  If the start time is
     * equal to -1, the transition is complete.
     * @type {Object<number, number>}
     */
    _this.transitionStarts_ = {};

    return _this;
  }

  /**
   * @protected
   */


  _createClass(Tile, [{
    key: 'changed',
    value: function changed() {
      this.dispatchEvent(_EventType2.default.CHANGE);
    }

    /**
     * @return {string} Key.
     */

  }, {
    key: 'getKey',
    value: function getKey() {
      return this.key + '/' + this.tileCoord;
    }

    /**
     * Get the interim tile most suitable for rendering using the chain of interim
     * tiles. This corresponds to the  most recent tile that has been loaded, if no
     * such tile exists, the original tile is returned.
     * @return {!module:ol/Tile} Best tile for rendering.
     */

  }, {
    key: 'getInterimTile',
    value: function getInterimTile() {
      if (!this.interimTile) {
        //empty chain
        return this;
      }
      var tile = this.interimTile;

      // find the first loaded tile and return it. Since the chain is sorted in
      // decreasing order of creation time, there is no need to search the remainder
      // of the list (all those tiles correspond to older requests and will be
      // cleaned up by refreshInterimChain)
      do {
        if (tile.getState() == _TileState2.default.LOADED) {
          return tile;
        }
        tile = tile.interimTile;
      } while (tile);

      // we can not find a better tile
      return this;
    }

    /**
     * Goes through the chain of interim tiles and discards sections of the chain
     * that are no longer relevant.
     */

  }, {
    key: 'refreshInterimChain',
    value: function refreshInterimChain() {
      if (!this.interimTile) {
        return;
      }

      var tile = this.interimTile;
      var prev = this;

      do {
        if (tile.getState() == _TileState2.default.LOADED) {
          //we have a loaded tile, we can discard the rest of the list
          //we would could abort any LOADING tile request
          //older than this tile (i.e. any LOADING tile following this entry in the chain)
          tile.interimTile = null;
          break;
        } else if (tile.getState() == _TileState2.default.LOADING) {
          //keep this LOADING tile any loaded tiles later in the chain are
          //older than this tile, so we're still interested in the request
          prev = tile;
        } else if (tile.getState() == _TileState2.default.IDLE) {
          //the head of the list is the most current tile, we don't need
          //to start any other requests for this chain
          prev.interimTile = tile.interimTile;
        } else {
          prev = tile;
        }
        tile = prev.interimTile;
      } while (tile);
    }

    /**
     * Get the tile coordinate for this tile.
     * @return {module:ol/tilecoord~TileCoord} The tile coordinate.
     * @api
     */

  }, {
    key: 'getTileCoord',
    value: function getTileCoord() {
      return this.tileCoord;
    }

    /**
     * @return {module:ol/TileState} State.
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }

    /**
     * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
     * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
     * when the tile cannot be loaded. Otherwise the tile cannot be removed from
     * the tile queue and will block other requests.
     * @param {module:ol/TileState} state State.
     * @api
     */

  }, {
    key: 'setState',
    value: function setState(state) {
      this.state = state;
      this.changed();
    }

    /**
     * Load the image or retry if loading previously failed.
     * Loading is taken care of by the tile queue, and calling this method is
     * only needed for preloading or for reloading in case of an error.
     * @abstract
     * @api
     */

  }, {
    key: 'load',
    value: function load() {}

    /**
     * Get the alpha value for rendering.
     * @param {number} id An id for the renderer.
     * @param {number} time The render frame time.
     * @return {number} A number between 0 and 1.
     */

  }, {
    key: 'getAlpha',
    value: function getAlpha(id, time) {
      if (!this.transition_) {
        return 1;
      }

      var start = this.transitionStarts_[id];
      if (!start) {
        start = time;
        this.transitionStarts_[id] = start;
      } else if (start === -1) {
        return 1;
      }

      var delta = time - start + 1000 / 60; // avoid rendering at 0
      if (delta >= this.transition_) {
        return 1;
      }
      return (0, _easing.easeIn)(delta / this.transition_);
    }

    /**
     * Determine if a tile is in an alpha transition.  A tile is considered in
     * transition if tile.getAlpha() has not yet been called or has been called
     * and returned 1.
     * @param {number} id An id for the renderer.
     * @return {boolean} The tile is in transition.
     */

  }, {
    key: 'inTransition',
    value: function inTransition(id) {
      if (!this.transition_) {
        return false;
      }
      return this.transitionStarts_[id] !== -1;
    }

    /**
     * Mark a transition as complete.
     * @param {number} id An id for the renderer.
     */

  }, {
    key: 'endTransition',
    value: function endTransition(id) {
      if (this.transition_) {
        this.transitionStarts_[id] = -1;
      }
    }
  }]);

  return Tile;
}(_Target2.default);

exports.default = Tile;