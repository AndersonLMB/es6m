'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Tile2 = require('./Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('./dom.js');

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/ImageTile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {function(new: module:ol/ImageTile, module:ol/tilecoord~TileCoord,
 * module:ol/TileState, string, ?string, module:ol/Tile~LoadFunction)} TileClass
 * @api
 */

var ImageTile = function (_Tile) {
  _inherits(ImageTile, _Tile);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {module:ol/Tile~LoadFunction} tileLoadFunction Tile load function.
   * @param {module:ol/Tile~Options=} opt_options Tile options.
   */
  function ImageTile(tileCoord, state, src, crossOrigin, tileLoadFunction, opt_options) {
    _classCallCheck(this, ImageTile);

    /**
     * @private
     * @type {?string}
     */
    var _this = _possibleConstructorReturn(this, (ImageTile.__proto__ || Object.getPrototypeOf(ImageTile)).call(this, tileCoord, state, opt_options));

    _this.crossOrigin_ = crossOrigin;

    /**
     * Image URI
     *
     * @private
     * @type {string}
     */
    _this.src_ = src;

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    _this.image_ = new Image();
    if (crossOrigin !== null) {
      _this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this.imageListenerKeys_ = null;

    /**
     * @private
     * @type {module:ol/Tile~LoadFunction}
     */
    _this.tileLoadFunction_ = tileLoadFunction;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(ImageTile, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      if (this.state == _TileState2.default.LOADING) {
        this.unlistenImage_();
        this.image_ = getBlankImage();
      }
      if (this.interimTile) {
        this.interimTile.dispose();
      }
      this.state = _TileState2.default.ABORT;
      this.changed();
      _get(ImageTile.prototype.__proto__ || Object.getPrototypeOf(ImageTile.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
     * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
     * @api
     */

  }, {
    key: 'getImage',
    value: function getImage() {
      return this.image_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getKey',
    value: function getKey() {
      return this.src_;
    }

    /**
     * Tracks loading or read errors.
     *
     * @private
     */

  }, {
    key: 'handleImageError_',
    value: function handleImageError_() {
      this.state = _TileState2.default.ERROR;
      this.unlistenImage_();
      this.image_ = getBlankImage();
      this.changed();
    }

    /**
     * Tracks successful image load.
     *
     * @private
     */

  }, {
    key: 'handleImageLoad_',
    value: function handleImageLoad_() {
      if (this.image_.naturalWidth && this.image_.naturalHeight) {
        this.state = _TileState2.default.LOADED;
      } else {
        this.state = _TileState2.default.EMPTY;
      }
      this.unlistenImage_();
      this.changed();
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.state == _TileState2.default.ERROR) {
        this.state = _TileState2.default.IDLE;
        this.image_ = new Image();
        if (this.crossOrigin_ !== null) {
          this.image_.crossOrigin = this.crossOrigin_;
        }
      }
      if (this.state == _TileState2.default.IDLE) {
        this.state = _TileState2.default.LOADING;
        this.changed();
        this.imageListenerKeys_ = [(0, _events.listenOnce)(this.image_, _EventType2.default.ERROR, this.handleImageError_, this), (0, _events.listenOnce)(this.image_, _EventType2.default.LOAD, this.handleImageLoad_, this)];
        this.tileLoadFunction_(this, this.src_);
      }
    }

    /**
     * Discards event handlers which listen for load completion or errors.
     *
     * @private
     */

  }, {
    key: 'unlistenImage_',
    value: function unlistenImage_() {
      this.imageListenerKeys_.forEach(_events.unlistenByKey);
      this.imageListenerKeys_ = null;
    }
  }]);

  return ImageTile;
}(_Tile3.default);

/**
 * Get a 1-pixel blank image.
 * @return {HTMLCanvasElement} Blank image.
 */


function getBlankImage() {
  var ctx = (0, _dom.createCanvasContext2D)(1, 1);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 1, 1);
  return ctx.canvas;
}

exports.default = ImageTile;