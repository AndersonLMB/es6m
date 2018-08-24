'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _Property = require('../layer/Property.js');

var _Property2 = _interopRequireDefault(_Property);

var _math = require('../math.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Base
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Note that with {@link module:ol/layer/Base} and all its subclasses, any property set in
 * the options is set as a {@link module:ol/Object} property on the layer object, so
 * is observable, and has get/set accessors.
 *
 * @api
 */
var BaseLayer = function (_BaseObject) {
  _inherits(BaseLayer, _BaseObject);

  /**
   * @param {module:ol/layer/Base~Options} options Layer options.
   */
  function BaseLayer(options) {
    _classCallCheck(this, BaseLayer);

    /**
    * @type {Object<string, *>}
    */
    var /** @type {module:ol/layer/Layer} */_this = _possibleConstructorReturn(this, (BaseLayer.__proto__ || Object.getPrototypeOf(BaseLayer)).call(this));

    var properties = (0, _obj.assign)({}, options);
    properties[_Property2.default.OPACITY] = options.opacity !== undefined ? options.opacity : 1;
    properties[_Property2.default.VISIBLE] = options.visible !== undefined ? options.visible : true;
    properties[_Property2.default.Z_INDEX] = options.zIndex !== undefined ? options.zIndex : 0;
    properties[_Property2.default.MAX_RESOLUTION] = options.maxResolution !== undefined ? options.maxResolution : Infinity;
    properties[_Property2.default.MIN_RESOLUTION] = options.minResolution !== undefined ? options.minResolution : 0;

    _this.setProperties(properties);

    /**
    * @type {module:ol/layer/Layer~State}
    * @private
    */
    _this.state_ = /** @type {module:ol/layer/Layer~State} */{
      layer: _this,
      managed: true
    };

    /**
    * The layer type.
    * @type {module:ol/LayerType}
    * @protected;
    */
    _this.type;

    return _this;
  }

  /**
  * Get the layer type (used when creating a layer renderer).
  * @return {module:ol/LayerType} The layer type.
  */


  _createClass(BaseLayer, [{
    key: 'getType',
    value: function getType() {
      return this.type;
    }

    /**
    * @return {module:ol/layer/Layer~State} Layer state.
    */

  }, {
    key: 'getLayerState',
    value: function getLayerState() {
      this.state_.opacity = (0, _math.clamp)(this.getOpacity(), 0, 1);
      this.state_.sourceState = this.getSourceState();
      this.state_.visible = this.getVisible();
      this.state_.extent = this.getExtent();
      this.state_.zIndex = this.getZIndex();
      this.state_.maxResolution = this.getMaxResolution();
      this.state_.minResolution = Math.max(this.getMinResolution(), 0);

      return this.state_;
    }

    /**
    * @abstract
    * @param {Array<module:ol/layer/Layer>=} opt_array Array of layers (to be
    *     modified in place).
    * @return {Array<module:ol/layer/Layer>} Array of layers.
    */

  }, {
    key: 'getLayersArray',
    value: function getLayersArray(opt_array) {}

    /**
    * @abstract
    * @param {Array<module:ol/layer/Layer~State>=} opt_states Optional list of layer
    *     states (to be modified in place).
    * @return {Array<module:ol/layer/Layer~State>} List of layer states.
    */

  }, {
    key: 'getLayerStatesArray',
    value: function getLayerStatesArray(opt_states) {}

    /**
    * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
    * will be visible regardless of extent.
    * @return {module:ol/extent~Extent|undefined} The layer extent.
    * @observable
    * @api
    */

  }, {
    key: 'getExtent',
    value: function getExtent() {
      return (
        /** @type {module:ol/extent~Extent|undefined} */this.get(_Property2.default.EXTENT)
      );
    }

    /**
    * Return the maximum resolution of the layer.
    * @return {number} The maximum resolution of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'getMaxResolution',
    value: function getMaxResolution() {
      return (/** @type {number} */this.get(_Property2.default.MAX_RESOLUTION)
      );
    }

    /**
    * Return the minimum resolution of the layer.
    * @return {number} The minimum resolution of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'getMinResolution',
    value: function getMinResolution() {
      return (/** @type {number} */this.get(_Property2.default.MIN_RESOLUTION)
      );
    }

    /**
    * Return the opacity of the layer (between 0 and 1).
    * @return {number} The opacity of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'getOpacity',
    value: function getOpacity() {
      return (/** @type {number} */this.get(_Property2.default.OPACITY)
      );
    }

    /**
    * @abstract
    * @return {module:ol/source/State} Source state.
    */

  }, {
    key: 'getSourceState',
    value: function getSourceState() {}

    /**
    * Return the visibility of the layer (`true` or `false`).
    * @return {boolean} The visibility of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'getVisible',
    value: function getVisible() {
      return (/** @type {boolean} */this.get(_Property2.default.VISIBLE)
      );
    }

    /**
    * Return the Z-index of the layer, which is used to order layers before
    * rendering. The default Z-index is 0.
    * @return {number} The Z-index of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'getZIndex',
    value: function getZIndex() {
      return (/** @type {number} */this.get(_Property2.default.Z_INDEX)
      );
    }

    /**
    * Set the extent at which the layer is visible.  If `undefined`, the layer
    * will be visible at all extents.
    * @param {module:ol/extent~Extent|undefined} extent The extent of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setExtent',
    value: function setExtent(extent) {
      this.set(_Property2.default.EXTENT, extent);
    }

    /**
    * Set the maximum resolution at which the layer is visible.
    * @param {number} maxResolution The maximum resolution of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setMaxResolution',
    value: function setMaxResolution(maxResolution) {
      this.set(_Property2.default.MAX_RESOLUTION, maxResolution);
    }

    /**
    * Set the minimum resolution at which the layer is visible.
    * @param {number} minResolution The minimum resolution of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setMinResolution',
    value: function setMinResolution(minResolution) {
      this.set(_Property2.default.MIN_RESOLUTION, minResolution);
    }

    /**
    * Set the opacity of the layer, allowed values range from 0 to 1.
    * @param {number} opacity The opacity of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.set(_Property2.default.OPACITY, opacity);
    }

    /**
    * Set the visibility of the layer (`true` or `false`).
    * @param {boolean} visible The visibility of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setVisible',
    value: function setVisible(visible) {
      this.set(_Property2.default.VISIBLE, visible);
    }

    /**
    * Set Z-index of the layer, which is used to order layers before rendering.
    * The default Z-index is 0.
    * @param {number} zindex The z-index of the layer.
    * @observable
    * @api
    */

  }, {
    key: 'setZIndex',
    value: function setZIndex(zindex) {
      this.set(_Property2.default.Z_INDEX, zindex);
    }
  }]);

  return BaseLayer;
}(_Object2.default);

exports.default = BaseLayer;