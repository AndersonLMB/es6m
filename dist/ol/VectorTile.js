'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _util = require('./util.js');

var _Tile2 = require('./Tile.js');

var _Tile3 = _interopRequireDefault(_Tile2);

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/VectorTile
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {module:ol/extent~Extent}
 */
var DEFAULT_EXTENT = [0, 0, 4096, 4096];

/**
 * @typedef {function(new: module:ol/VectorTile, module:ol/tilecoord~TileCoord,
 * module:ol/TileState, string, ?string, module:ol/Tile~LoadFunction)} TileClass
 * @api
 */

var VectorTile = function (_Tile) {
  _inherits(VectorTile, _Tile);

  /**
   * @param {module:ol/tilecoord~TileCoord} tileCoord Tile coordinate.
   * @param {module:ol/TileState} state State.
   * @param {string} src Data source url.
   * @param {module:ol/format/Feature} format Feature format.
   * @param {module:ol/Tile~LoadFunction} tileLoadFunction Tile load function.
   * @param {module:ol/Tile~Options=} opt_options Tile options.
   */
  function VectorTile(tileCoord, state, src, format, tileLoadFunction, opt_options) {
    _classCallCheck(this, VectorTile);

    /**
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (VectorTile.__proto__ || Object.getPrototypeOf(VectorTile)).call(this, tileCoord, state, opt_options));

    _this.consumers = 0;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.extent_ = null;

    /**
     * @private
     * @type {module:ol/format/Feature}
     */
    _this.format_ = format;

    /**
     * @private
     * @type {Array<module:ol/Feature>}
     */
    _this.features_ = null;

    /**
     * @private
     * @type {module:ol/featureloader~FeatureLoader}
     */
    _this.loader_;

    /**
     * Data projection
     * @private
     * @type {module:ol/proj/Projection}
     */
    _this.projection_ = null;

    /**
     * @private
     * @type {Object<string, module:ol/render/ReplayGroup>}
     */
    _this.replayGroups_ = {};

    /**
     * @private
     * @type {module:ol/Tile~LoadFunction}
     */
    _this.tileLoadFunction_ = tileLoadFunction;

    /**
     * @private
     * @type {string}
     */
    _this.url_ = src;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(VectorTile, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.features_ = null;
      this.replayGroups_ = {};
      this.state = _TileState2.default.ABORT;
      this.changed();
      _get(VectorTile.prototype.__proto__ || Object.getPrototypeOf(VectorTile.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * Gets the extent of the vector tile.
     * @return {module:ol/extent~Extent} The extent.
     * @api
     */

  }, {
    key: 'getExtent',
    value: function getExtent() {
      return this.extent_ || DEFAULT_EXTENT;
    }

    /**
     * Get the feature format assigned for reading this tile's features.
     * @return {module:ol/format/Feature} Feature format.
     * @api
     */

  }, {
    key: 'getFormat',
    value: function getFormat() {
      return this.format_;
    }

    /**
     * Get the features for this tile. Geometries will be in the projection returned
     * by {@link module:ol/VectorTile~VectorTile#getProjection}.
     * @return {Array<module:ol/Feature|module:ol/render/Feature>} Features.
     * @api
     */

  }, {
    key: 'getFeatures',
    value: function getFeatures() {
      return this.features_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getKey',
    value: function getKey() {
      return this.url_;
    }

    /**
     * Get the feature projection of features returned by
     * {@link module:ol/VectorTile~VectorTile#getFeatures}.
     * @return {module:ol/proj/Projection} Feature projection.
     * @api
     */

  }, {
    key: 'getProjection',
    value: function getProjection() {
      return this.projection_;
    }

    /**
     * @param {module:ol/layer/Layer} layer Layer.
     * @param {string} key Key.
     * @return {module:ol/render/ReplayGroup} Replay group.
     */

  }, {
    key: 'getReplayGroup',
    value: function getReplayGroup(layer, key) {
      return this.replayGroups_[(0, _util.getUid)(layer) + ',' + key];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'load',
    value: function load() {
      if (this.state == _TileState2.default.IDLE) {
        this.setState(_TileState2.default.LOADING);
        this.tileLoadFunction_(this, this.url_);
        this.loader_(null, NaN, null);
      }
    }

    /**
     * Handler for successful tile load.
     * @param {Array<module:ol/Feature>} features The loaded features.
     * @param {module:ol/proj/Projection} dataProjection Data projection.
     * @param {module:ol/extent~Extent} extent Extent.
     */

  }, {
    key: 'onLoad',
    value: function onLoad(features, dataProjection, extent) {
      this.setProjection(dataProjection);
      this.setFeatures(features);
      this.setExtent(extent);
    }

    /**
     * Handler for tile load errors.
     */

  }, {
    key: 'onError',
    value: function onError() {
      this.setState(_TileState2.default.ERROR);
    }

    /**
     * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s
     * `tileLoadFunction`. Sets the extent of the vector tile. This is only required
     * for tiles in projections with `tile-pixels` as units. The extent should be
     * set to `[0, 0, tilePixelSize, tilePixelSize]`, where `tilePixelSize` is
     * calculated by multiplying the tile size with the tile pixel ratio. For
     * sources using {@link module:ol/format/MVT~MVT} as feature format, the
     * {@link module:ol/format/MVT~MVT#getLastExtent} method will return the correct
     * extent. The default is `[0, 0, 4096, 4096]`.
     * @param {module:ol/extent~Extent} extent The extent.
     * @api
     */

  }, {
    key: 'setExtent',
    value: function setExtent(extent) {
      this.extent_ = extent;
    }

    /**
     * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s `tileLoadFunction`.
     * Sets the features for the tile.
     * @param {Array<module:ol/Feature>} features Features.
     * @api
     */

  }, {
    key: 'setFeatures',
    value: function setFeatures(features) {
      this.features_ = features;
      this.setState(_TileState2.default.LOADED);
    }

    /**
     * Function for use in an {@link module:ol/source/VectorTile~VectorTile}'s `tileLoadFunction`.
     * Sets the projection of the features that were added with
     * {@link module:ol/VectorTile~VectorTile#setFeatures}.
     * @param {module:ol/proj/Projection} projection Feature projection.
     * @api
     */

  }, {
    key: 'setProjection',
    value: function setProjection(projection) {
      this.projection_ = projection;
    }

    /**
     * @param {module:ol/layer/Layer} layer Layer.
     * @param {string} key Key.
     * @param {module:ol/render/ReplayGroup} replayGroup Replay group.
     */

  }, {
    key: 'setReplayGroup',
    value: function setReplayGroup(layer, key, replayGroup) {
      this.replayGroups_[(0, _util.getUid)(layer) + ',' + key] = replayGroup;
    }

    /**
     * Set the feature loader for reading this tile's features.
     * @param {module:ol/featureloader~FeatureLoader} loader Feature loader.
     * @api
     */

  }, {
    key: 'setLoader',
    value: function setLoader(loader) {
      this.loader_ = loader;
    }
  }]);

  return VectorTile;
}(_Tile3.default);

exports.default = VectorTile;