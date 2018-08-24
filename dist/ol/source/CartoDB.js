'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _obj = require('../obj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _XYZ2 = require('../source/XYZ.js');

var _XYZ3 = _interopRequireDefault(_XYZ2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/CartoDB
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize=2048] Cache size.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {module:ol/proj~ProjectionLike} [projection='EPSG:3857'] Projection.
 * @property {number} [maxZoom=18] Max zoom.
 * @property {number} [minZoom] Minimum zoom.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 * @property {Object} [config] If using anonymous maps, the CartoDB config to use. See
 * http://docs.cartodb.com/cartodb-platform/maps-api/anonymous-maps/
 * for more detail.
 * If using named maps, a key-value lookup with the template parameters.
 * See http://docs.cartodb.com/cartodb-platform/maps-api/named-maps/
 * for more detail.
 * @property {string} [map] If using named maps, this will be the name of the template to load.
 * See http://docs.cartodb.com/cartodb-platform/maps-api/named-maps/
 * for more detail.
 * @property {string} account If using named maps, this will be the name of the template to load.
 */

/**
 * @classdesc
 * Layer source for the CartoDB Maps API.
 * @api
 */
var CartoDB = function (_XYZ) {
  _inherits(CartoDB, _XYZ);

  /**
   * @param {module:ol/source/CartoDB~Options=} options CartoDB options.
   */
  function CartoDB(options) {
    _classCallCheck(this, CartoDB);

    /**
     * @type {string}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (CartoDB.__proto__ || Object.getPrototypeOf(CartoDB)).call(this, {
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      maxZoom: options.maxZoom !== undefined ? options.maxZoom : 18,
      minZoom: options.minZoom,
      projection: options.projection,
      state: _State2.default.LOADING,
      wrapX: options.wrapX
    }));

    _this.account_ = options.account;

    /**
     * @type {string}
     * @private
     */
    _this.mapId_ = options.map || '';

    /**
     * @type {!Object}
     * @private
     */
    _this.config_ = options.config || {};

    /**
     * @type {!Object<string, CartoDBLayerInfo>}
     * @private
     */
    _this.templateCache_ = {};

    _this.initializeMap_();
    return _this;
  }

  /**
   * Returns the current config.
   * @return {!Object} The current configuration.
   * @api
   */


  _createClass(CartoDB, [{
    key: 'getConfig',
    value: function getConfig() {
      return this.config_;
    }

    /**
     * Updates the carto db config.
     * @param {Object} config a key-value lookup. Values will replace current values
     *     in the config.
     * @api
     */

  }, {
    key: 'updateConfig',
    value: function updateConfig(config) {
      (0, _obj.assign)(this.config_, config);
      this.initializeMap_();
    }

    /**
     * Sets the CartoDB config
     * @param {Object} config In the case of anonymous maps, a CartoDB configuration
     *     object.
     * If using named maps, a key-value lookup with the template parameters.
     * @api
     */

  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      this.config_ = config || {};
      this.initializeMap_();
    }

    /**
     * Issue a request to initialize the CartoDB map.
     * @private
     */

  }, {
    key: 'initializeMap_',
    value: function initializeMap_() {
      var paramHash = JSON.stringify(this.config_);
      if (this.templateCache_[paramHash]) {
        this.applyTemplate_(this.templateCache_[paramHash]);
        return;
      }
      var mapUrl = 'https://' + this.account_ + '.carto.com/api/v1/map';

      if (this.mapId_) {
        mapUrl += '/named/' + this.mapId_;
      }

      var client = new XMLHttpRequest();
      client.addEventListener('load', this.handleInitResponse_.bind(this, paramHash));
      client.addEventListener('error', this.handleInitError_.bind(this));
      client.open('POST', mapUrl);
      client.setRequestHeader('Content-type', 'application/json');
      client.send(JSON.stringify(this.config_));
    }

    /**
     * Handle map initialization response.
     * @param {string} paramHash a hash representing the parameter set that was used
     *     for the request
     * @param {Event} event Event.
     * @private
     */

  }, {
    key: 'handleInitResponse_',
    value: function handleInitResponse_(paramHash, event) {
      var client = /** @type {XMLHttpRequest} */event.target;
      // status will be 0 for file:// urls
      if (!client.status || client.status >= 200 && client.status < 300) {
        var response = void 0;
        try {
          response = /** @type {CartoDBLayerInfo} */JSON.parse(client.responseText);
        } catch (err) {
          this.setState(_State2.default.ERROR);
          return;
        }
        this.applyTemplate_(response);
        this.templateCache_[paramHash] = response;
        this.setState(_State2.default.READY);
      } else {
        this.setState(_State2.default.ERROR);
      }
    }

    /**
     * @private
     * @param {Event} event Event.
     */

  }, {
    key: 'handleInitError_',
    value: function handleInitError_(event) {
      this.setState(_State2.default.ERROR);
    }

    /**
     * Apply the new tile urls returned by carto db
     * @param {CartoDBLayerInfo} data Result of carto db call.
     * @private
     */

  }, {
    key: 'applyTemplate_',
    value: function applyTemplate_(data) {
      var tilesUrl = 'https://' + data.cdn_url.https + '/' + this.account_ + '/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png';
      this.setUrl(tilesUrl);
    }
  }]);

  return CartoDB;
}(_XYZ3.default);

exports.default = CartoDB;