'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomTile = undefined;

var _Tile2 = require('../Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _tileurlfunction = require('../tileurlfunction.js');

var _asserts = require('../asserts.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _net = require('../net.js');

var _proj = require('../proj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _Tile4 = require('../source/Tile.js');

var _Tile5 = _interopRequireDefault(_Tile4);

var _tilecoord = require('../tilecoord.js');

var _tilegrid = require('../tilegrid.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/UTFGrid
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CustomTile = exports.CustomTile = function (_Tile) {
  _inherits(CustomTile, _Tile);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {string} src Image source URI.
   * @param {module:ol/extent~Extent} extent Extent of the tile.
   * @param {boolean} preemptive Load the tile when visible (before it's needed).
   * @param {boolean} jsonp Load the tile as a script.
   */
  function CustomTile(tileCoord, state, src, extent, preemptive, jsonp) {
    _classCallCheck(this, CustomTile);

    /**
     * @private
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (CustomTile.__proto__ || Object.getPrototypeOf(CustomTile)).call(this, tileCoord, state));

    _this.src_ = src;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.extent_ = extent;

    /**
     * @private
     * @type {boolean}
     */
    _this.preemptive_ = preemptive;

    /**
     * @private
     * @type {Array<string>}
     */
    _this.grid_ = null;

    /**
     * @private
     * @type {Array<string>}
     */
    _this.keys_ = null;

    /**
     * @private
     * @type {Object<string, Object>|undefined}
     */
    _this.data_ = null;

    /**
     * @private
     * @type {boolean}
     */
    _this.jsonp_ = jsonp;

    return _this;
  }

  return CustomTile;
}(_Tile3.default);

/**
 * Get the image element for this tile.
 * @return {HTMLImageElement} Image.
 */


CustomTile.prototype.getImage = function () {
  return null;
};

/**
 * Synchronously returns data at given coordinate (if available).
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @return {*} The data.
 */
CustomTile.prototype.getData = function (coordinate) {
  if (!this.grid_ || !this.keys_) {
    return null;
  }
  var xRelative = (coordinate[0] - this.extent_[0]) / (this.extent_[2] - this.extent_[0]);
  var yRelative = (coordinate[1] - this.extent_[1]) / (this.extent_[3] - this.extent_[1]);

  var row = this.grid_[Math.floor((1 - yRelative) * this.grid_.length)];

  if (typeof row !== 'string') {
    return null;
  }

  var code = row.charCodeAt(Math.floor(xRelative * row.length));
  if (code >= 93) {
    code--;
  }
  if (code >= 35) {
    code--;
  }
  code -= 32;

  var data = null;
  if (code in this.keys_) {
    var id = this.keys_[code];
    if (this.data_ && id in this.data_) {
      data = this.data_[id];
    } else {
      data = id;
    }
  }
  return data;
};

/**
 * Calls the callback (synchronously by default) with the available data
 * for given coordinate (or `null` if not yet loaded).
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {function(this: T, *)} callback Callback.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @param {boolean=} opt_request If `true` the callback is always async.
 *                               The tile data is requested if not yet loaded.
 * @template T
 */
CustomTile.prototype.forDataAtCoordinate = function (coordinate, callback, opt_this, opt_request) {
  if (this.state == _TileState2.default.IDLE && opt_request === true) {
    (0, _events.listenOnce)(this, _EventType2.default.CHANGE, function (e) {
      callback.call(opt_this, this.getData(coordinate));
    }, this);
    this.loadInternal_();
  } else {
    if (opt_request === true) {
      setTimeout(function () {
        callback.call(opt_this, this.getData(coordinate));
      }.bind(this), 0);
    } else {
      callback.call(opt_this, this.getData(coordinate));
    }
  }
};

/**
 * @inheritDoc
 */
CustomTile.prototype.getKey = function () {
  return this.src_;
};

/**
 * @private
 */
CustomTile.prototype.handleError_ = function () {
  this.state = _TileState2.default.ERROR;
  this.changed();
};

/**
 * @param {!UTFGridJSON} json UTFGrid data.
 * @private
 */
CustomTile.prototype.handleLoad_ = function (json) {
  this.grid_ = json.grid;
  this.keys_ = json.keys;
  this.data_ = json.data;

  this.state = _TileState2.default.EMPTY;
  this.changed();
};

/**
 * @private
 */
CustomTile.prototype.loadInternal_ = function () {
  if (this.state == _TileState2.default.IDLE) {
    this.state = _TileState2.default.LOADING;
    if (this.jsonp_) {
      (0, _net.jsonp)(this.src_, this.handleLoad_.bind(this), this.handleError_.bind(this));
    } else {
      var client = new XMLHttpRequest();
      client.addEventListener('load', this.onXHRLoad_.bind(this));
      client.addEventListener('error', this.onXHRError_.bind(this));
      client.open('GET', this.src_);
      client.send();
    }
  }
};

/**
 * @private
 * @param {Event} event The load event.
 */
CustomTile.prototype.onXHRLoad_ = function (event) {
  var client = /** @type {XMLHttpRequest} */event.target;
  // status will be 0 for file:// urls
  if (!client.status || client.status >= 200 && client.status < 300) {
    var response = void 0;
    try {
      response = /** @type {!UTFGridJSON} */JSON.parse(client.responseText);
    } catch (err) {
      this.handleError_();
      return;
    }
    this.handleLoad_(response);
  } else {
    this.handleError_();
  }
};

/**
 * @private
 * @param {Event} event The error event.
 */
CustomTile.prototype.onXHRError_ = function (event) {
  this.handleError_();
};

/**
 * @override
 */
CustomTile.prototype.load = function () {
  if (this.preemptive_) {
    this.loadInternal_();
  }
};

/**
 * @typedef {Object} Options
 * @property {boolean} [preemptive=true]
 * If `true` the UTFGrid source loads the tiles based on their "visibility".
 * This improves the speed of response, but increases traffic.
 * Note that if set to `false`, you need to pass `true` as `opt_request`
 * to the `forDataAtCoordinateAndResolution` method otherwise no data
 * will ever be loaded.
 * @property {boolean} [jsonp=false] Use JSONP with callback to load the TileJSON.
 * Useful when the server does not support CORS..
 * @property {tileJSON} [tileJSON] TileJSON configuration for this source.
 * If not provided, `url` must be configured.
 * @property {string} [url] TileJSON endpoint that provides the configuration for this source.
 * Request will be made through JSONP. If not provided, `tileJSON` must be configured.
 */

/**
 * @classdesc
 * Layer source for UTFGrid interaction data loaded from TileJSON format.
 * @api
 */

var UTFGrid = function (_TileSource) {
  _inherits(UTFGrid, _TileSource);

  /**
   * @param {module:ol/source/UTFGrid~Options=} options Source options.
   */
  function UTFGrid(options) {
    _classCallCheck(this, UTFGrid);

    /**
     * @private
     * @type {boolean}
     */
    var _this2 = _possibleConstructorReturn(this, (UTFGrid.__proto__ || Object.getPrototypeOf(UTFGrid)).call(this, {
      projection: (0, _proj.get)('EPSG:3857'),
      state: _State2.default.LOADING
    }));

    _this2.preemptive_ = options.preemptive !== undefined ? options.preemptive : true;

    /**
     * @private
     * @type {!module:ol/Tile~UrlFunction}
     */
    _this2.tileUrlFunction_ = _tileurlfunction.nullTileUrlFunction;

    /**
     * @private
     * @type {string|undefined}
     */
    _this2.template_ = undefined;

    /**
     * @private
     * @type {boolean}
     */
    _this2.jsonp_ = options.jsonp || false;

    if (options.url) {
      if (_this2.jsonp_) {
        (0, _net.jsonp)(options.url, _this2.handleTileJSONResponse.bind(_this2), _this2.handleTileJSONError.bind(_this2));
      } else {
        var client = new XMLHttpRequest();
        client.addEventListener('load', _this2.onXHRLoad_.bind(_this2));
        client.addEventListener('error', _this2.onXHRError_.bind(_this2));
        client.open('GET', options.url);
        client.send();
      }
    } else if (options.tileJSON) {
      _this2.handleTileJSONResponse(options.tileJSON);
    } else {
      (0, _asserts.assert)(false, 51); // Either `url` or `tileJSON` options must be provided
    }

    return _this2;
  }

  return UTFGrid;
}(_Tile5.default);

/**
 * @private
 * @param {Event} event The load event.
 */


UTFGrid.prototype.onXHRLoad_ = function (event) {
  var client = /** @type {XMLHttpRequest} */event.target;
  // status will be 0 for file:// urls
  if (!client.status || client.status >= 200 && client.status < 300) {
    var response = void 0;
    try {
      response = /** @type {TileJSON} */JSON.parse(client.responseText);
    } catch (err) {
      this.handleTileJSONError();
      return;
    }
    this.handleTileJSONResponse(response);
  } else {
    this.handleTileJSONError();
  }
};

/**
 * @private
 * @param {Event} event The error event.
 */
UTFGrid.prototype.onXHRError_ = function (event) {
  this.handleTileJSONError();
};

/**
 * Return the template from TileJSON.
 * @return {string|undefined} The template from TileJSON.
 * @api
 */
UTFGrid.prototype.getTemplate = function () {
  return this.template_;
};

/**
 * Calls the callback (synchronously by default) with the available data
 * for given coordinate and resolution (or `null` if not yet loaded or
 * in case of an error).
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @param {function(*)} callback Callback.
 * @param {boolean=} opt_request If `true` the callback is always async.
 *                               The tile data is requested if not yet loaded.
 * @api
 */
UTFGrid.prototype.forDataAtCoordinateAndResolution = function (coordinate, resolution, callback, opt_request) {
  if (this.tileGrid) {
    var tileCoord = this.tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);
    var tile = /** @type {!module:ol/source/UTFGrid~CustomTile} */this.getTile(tileCoord[0], tileCoord[1], tileCoord[2], 1, this.getProjection());
    tile.forDataAtCoordinate(coordinate, callback, null, opt_request);
  } else {
    if (opt_request === true) {
      setTimeout(function () {
        callback(null);
      }, 0);
    } else {
      callback(null);
    }
  }
};

/**
 * @protected
 */
UTFGrid.prototype.handleTileJSONError = function () {
  this.setState(_State2.default.ERROR);
};

/**
 * TODO: very similar to ol/source/TileJSON#handleTileJSONResponse
 * @protected
 * @param {TileJSON} tileJSON Tile JSON.
 */
UTFGrid.prototype.handleTileJSONResponse = function (tileJSON) {

  var epsg4326Projection = (0, _proj.get)('EPSG:4326');

  var sourceProjection = this.getProjection();
  var extent = void 0;
  if (tileJSON.bounds !== undefined) {
    var transform = (0, _proj.getTransformFromProjections)(epsg4326Projection, sourceProjection);
    extent = (0, _extent.applyTransform)(tileJSON.bounds, transform);
  }

  var minZoom = tileJSON.minzoom || 0;
  var maxZoom = tileJSON.maxzoom || 22;
  var tileGrid = (0, _tilegrid.createXYZ)({
    extent: (0, _tilegrid.extentFromProjection)(sourceProjection),
    maxZoom: maxZoom,
    minZoom: minZoom
  });
  this.tileGrid = tileGrid;

  this.template_ = tileJSON.template;

  var grids = tileJSON.grids;
  if (!grids) {
    this.setState(_State2.default.ERROR);
    return;
  }

  this.tileUrlFunction_ = (0, _tileurlfunction.createFromTemplates)(grids, tileGrid);

  if (tileJSON.attribution !== undefined) {
    var attributionExtent = extent !== undefined ? extent : epsg4326Projection.getExtent();

    this.setAttributions(function (frameState) {
      if ((0, _extent.intersects)(attributionExtent, frameState.extent)) {
        return [tileJSON.attribution];
      }
      return null;
    });
  }

  this.setState(_State2.default.READY);
};

/**
 * @inheritDoc
 */
UTFGrid.prototype.getTile = function (z, x, y, pixelRatio, projection) {
  var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
  if (this.tileCache.containsKey(tileCoordKey)) {
    return (
      /** @type {!module:ol/Tile} */this.tileCache.get(tileCoordKey)
    );
  } else {
    var tileCoord = [z, x, y];
    var urlTileCoord = this.getTileCoordForTileUrlFunction(tileCoord, projection);
    var tileUrl = this.tileUrlFunction_(urlTileCoord, pixelRatio, projection);
    var tile = new CustomTile(tileCoord, tileUrl !== undefined ? _TileState2.default.IDLE : _TileState2.default.EMPTY, tileUrl !== undefined ? tileUrl : '', this.tileGrid.getTileCoordExtent(tileCoord), this.preemptive_, this.jsonp_);
    this.tileCache.set(tileCoordKey, tile);
    return tile;
  }
};

/**
 * @inheritDoc
 */
UTFGrid.prototype.useTile = function (z, x, y) {
  var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
  if (this.tileCache.containsKey(tileCoordKey)) {
    this.tileCache.get(tileCoordKey);
  }
};

exports.default = UTFGrid;