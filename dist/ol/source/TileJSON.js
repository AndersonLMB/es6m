'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tileurlfunction = require('../tileurlfunction.js');

var _asserts = require('../asserts.js');

var _extent = require('../extent.js');

var _net = require('../net.js');

var _proj = require('../proj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _TileImage2 = require('../source/TileImage.js');

var _TileImage3 = _interopRequireDefault(_TileImage2);

var _tilegrid = require('../tilegrid.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/TileJSON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// FIXME check order of async callbacks

/**
 * See http://mapbox.com/developers/api/.
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [jsonp=false] Use JSONP with callback to load the TileJSON.
 * Useful when the server does not support CORS..
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {tileJSON} [tileJSON] TileJSON configuration for this source.
 * If not provided, `url` must be configured.
 * @property {module:ol/Tile~LoadFunction} [tileLoadFunction] Optional function to load a tile given a URL. The default is
 * ```js
 * function(imageTile, src) {
 *   imageTile.getImage().src = src;
 * };
 * ```
 * @property {string} [url] URL to the TileJSON file. If not provided, `tileJSON` must be configured.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 */

/**
 * @classdesc
 * Layer source for tile data in TileJSON format.
 * @api
 */
var TileJSON = function (_TileImage) {
  _inherits(TileJSON, _TileImage);

  /**
   * @param {module:ol/source/TileJSON~Options=} options TileJSON options.
   */
  function TileJSON(options) {
    _classCallCheck(this, TileJSON);

    /**
     * @type {TileJSON}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (TileJSON.__proto__ || Object.getPrototypeOf(TileJSON)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      projection: (0, _proj.get)('EPSG:3857'),
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      state: _State2.default.LOADING,
      tileLoadFunction: options.tileLoadFunction,
      wrapX: options.wrapX !== undefined ? options.wrapX : true,
      transition: options.transition
    }));

    _this.tileJSON_ = null;

    if (options.url) {
      if (options.jsonp) {
        (0, _net.jsonp)(options.url, _this.handleTileJSONResponse.bind(_this), _this.handleTileJSONError.bind(_this));
      } else {
        var client = new XMLHttpRequest();
        client.addEventListener('load', _this.onXHRLoad_.bind(_this));
        client.addEventListener('error', _this.onXHRError_.bind(_this));
        client.open('GET', options.url);
        client.send();
      }
    } else if (options.tileJSON) {
      _this.handleTileJSONResponse(options.tileJSON);
    } else {
      (0, _asserts.assert)(false, 51); // Either `url` or `tileJSON` options must be provided
    }

    return _this;
  }

  /**
   * @private
   * @param {Event} event The load event.
   */


  _createClass(TileJSON, [{
    key: 'onXHRLoad_',
    value: function onXHRLoad_(event) {
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
    }

    /**
     * @private
     * @param {Event} event The error event.
     */

  }, {
    key: 'onXHRError_',
    value: function onXHRError_(event) {
      this.handleTileJSONError();
    }

    /**
     * @return {TileJSON} The tilejson object.
     * @api
     */

  }, {
    key: 'getTileJSON',
    value: function getTileJSON() {
      return this.tileJSON_;
    }

    /**
     * @protected
     * @param {TileJSON} tileJSON Tile JSON.
     */

  }, {
    key: 'handleTileJSONResponse',
    value: function handleTileJSONResponse(tileJSON) {

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

      this.tileUrlFunction = (0, _tileurlfunction.createFromTemplates)(tileJSON.tiles, tileGrid);

      if (tileJSON.attribution !== undefined && !this.getAttributions()) {
        var attributionExtent = extent !== undefined ? extent : epsg4326Projection.getExtent();

        this.setAttributions(function (frameState) {
          if ((0, _extent.intersects)(attributionExtent, frameState.extent)) {
            return [tileJSON.attribution];
          }
          return null;
        });
      }
      this.tileJSON_ = tileJSON;
      this.setState(_State2.default.READY);
    }

    /**
     * @protected
     */

  }, {
    key: 'handleTileJSONError',
    value: function handleTileJSONError() {
      this.setState(_State2.default.ERROR);
    }
  }]);

  return TileJSON;
}(_TileImage3.default);

exports.default = TileJSON;