'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _PriorityQueue2 = require('./structs/PriorityQueue.js');

var _PriorityQueue3 = _interopRequireDefault(_PriorityQueue2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/TileQueue
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {function(module:ol/Tile, string, module:ol/coordinate~Coordinate, number): number} PriorityFunction
 */

var TileQueue = function (_PriorityQueue) {
  _inherits(TileQueue, _PriorityQueue);

  /**
   * @param {module:ol/TileQueue~PriorityFunction} tilePriorityFunction Tile priority function.
   * @param {function(): ?} tileChangeCallback Function called on each tile change event.
   */
  function TileQueue(tilePriorityFunction, tileChangeCallback) {
    _classCallCheck(this, TileQueue);

    /**
     * @private
     * @type {function(): ?}
     */
    var _this = _possibleConstructorReturn(this, (TileQueue.__proto__ || Object.getPrototypeOf(TileQueue)).call(this,
    /**
     * @param {Array} element Element.
     * @return {number} Priority.
     */
    function (element) {
      return tilePriorityFunction.apply(null, element);
    },
    /**
     * @param {Array} element Element.
     * @return {string} Key.
     */
    function (element) {
      return (/** @type {module:ol/Tile} */element[0].getKey()
      );
    }));

    _this.tileChangeCallback_ = tileChangeCallback;

    /**
     * @private
     * @type {number}
     */
    _this.tilesLoading_ = 0;

    /**
     * @private
     * @type {!Object<string,boolean>}
     */
    _this.tilesLoadingKeys_ = {};

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(TileQueue, [{
    key: 'enqueue',
    value: function enqueue(element) {
      var added = _get(TileQueue.prototype.__proto__ || Object.getPrototypeOf(TileQueue.prototype), 'enqueue', this).call(this, element);
      if (added) {
        var tile = element[0];
        (0, _events.listen)(tile, _EventType2.default.CHANGE, this.handleTileChange, this);
      }
      return added;
    }

    /**
     * @return {number} Number of tiles loading.
     */

  }, {
    key: 'getTilesLoading',
    value: function getTilesLoading() {
      return this.tilesLoading_;
    }

    /**
     * @param {module:ol/events/Event} event Event.
     * @protected
     */

  }, {
    key: 'handleTileChange',
    value: function handleTileChange(event) {
      var tile = /** @type {module:ol/Tile} */event.target;
      var state = tile.getState();
      if (state === _TileState2.default.LOADED || state === _TileState2.default.ERROR || state === _TileState2.default.EMPTY || state === _TileState2.default.ABORT) {
        (0, _events.unlisten)(tile, _EventType2.default.CHANGE, this.handleTileChange, this);
        var tileKey = tile.getKey();
        if (tileKey in this.tilesLoadingKeys_) {
          delete this.tilesLoadingKeys_[tileKey];
          --this.tilesLoading_;
        }
        this.tileChangeCallback_();
      }
    }

    /**
     * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
     * @param {number} maxNewLoads Maximum number of new tiles to load.
     */

  }, {
    key: 'loadMoreTiles',
    value: function loadMoreTiles(maxTotalLoading, maxNewLoads) {
      var newLoads = 0;
      var abortedTiles = false;
      var state = void 0,
          tile = void 0,
          tileKey = void 0;
      while (this.tilesLoading_ < maxTotalLoading && newLoads < maxNewLoads && this.getCount() > 0) {
        tile = /** @type {module:ol/Tile} */this.dequeue()[0];
        tileKey = tile.getKey();
        state = tile.getState();
        if (state === _TileState2.default.ABORT) {
          abortedTiles = true;
        } else if (state === _TileState2.default.IDLE && !(tileKey in this.tilesLoadingKeys_)) {
          this.tilesLoadingKeys_[tileKey] = true;
          ++this.tilesLoading_;
          ++newLoads;
          tile.load();
        }
      }
      if (newLoads === 0 && abortedTiles) {
        // Do not stop the render loop when all wanted tiles were aborted due to
        // a small, saturated tile cache.
        this.tileChangeCallback_();
      }
    }
  }]);

  return TileQueue;
}(_PriorityQueue3.default);

exports.default = TileQueue;