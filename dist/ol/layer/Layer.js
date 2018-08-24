'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.visibleAtResolution = visibleAtResolution;

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _util = require('../util.js');

var _Object = require('../Object.js');

var _Base = require('../layer/Base.js');

var _Base2 = _interopRequireDefault(_Base);

var _Property = require('../layer/Property.js');

var _Property2 = _interopRequireDefault(_Property);

var _obj = require('../obj.js');

var _EventType3 = require('../render/EventType.js');

var _EventType4 = _interopRequireDefault(_EventType3);

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Layer
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
 * @property {module:ol/source/Source} [source] Source for this layer.  If not provided to the constructor,
 * the source can be set by calling {@link module:ol/layer/Layer#setSource layer.setSource(source)} after
 * construction.
 */

/**
 * @typedef {Object} State
 * @property {module:ol/layer/Layer} layer
 * @property {number} opacity
 * @property {module:ol/source/Source~State} sourceState
 * @property {boolean} visible
 * @property {boolean} managed
 * @property {module:ol/extent~Extent} [extent]
 * @property {number} zIndex
 * @property {number} maxResolution
 * @property {number} minResolution
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * A visual representation of raster or vector map data.
 * Layers group together those properties that pertain to how the data is to be
 * displayed, irrespective of the source of that data.
 *
 * Layers are usually added to a map with {@link module:ol/Map#addLayer}. Components
 * like {@link module:ol/interaction/Select~Select} use unmanaged layers
 * internally. These unmanaged layers are associated with the map using
 * {@link module:ol/layer/Layer~Layer#setMap} instead.
 *
 * A generic `change` event is fired when the state of the source changes.
 *
 * @fires module:ol/render/Event~RenderEvent
 */
var Layer = function (_BaseLayer) {
  _inherits(Layer, _BaseLayer);

  /**
   * @param {module:ol/layer/Layer~Options} options Layer options.
   */
  function Layer(options) {
    _classCallCheck(this, Layer);

    var baseOptions = (0, _obj.assign)({}, options);
    delete baseOptions.source;

    /**
     * @private
     * @type {?module:ol/events~EventsKey}
     */
    var _this = _possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, baseOptions));

    _this.mapPrecomposeKey_ = null;

    /**
     * @private
     * @type {?module:ol/events~EventsKey}
     */
    _this.mapRenderKey_ = null;

    /**
     * @private
     * @type {?module:ol/events~EventsKey}
     */
    _this.sourceChangeKey_ = null;

    if (options.map) {
      _this.setMap(options.map);
    }

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(_Property2.default.SOURCE), _this.handleSourcePropertyChange_, _this);

    var source = options.source ? options.source : null;
    _this.setSource(source);
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(Layer, [{
    key: 'getLayersArray',
    value: function getLayersArray(opt_array) {
      var array = opt_array ? opt_array : [];
      array.push(this);
      return array;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getLayerStatesArray',
    value: function getLayerStatesArray(opt_states) {
      var states = opt_states ? opt_states : [];
      states.push(this.getLayerState());
      return states;
    }

    /**
     * Get the layer source.
     * @return {module:ol/source/Source} The layer source (or `null` if not yet set).
     * @observable
     * @api
     */

  }, {
    key: 'getSource',
    value: function getSource() {
      var source = this.get(_Property2.default.SOURCE);
      return (
        /** @type {module:ol/source/Source} */source || null
      );
    }

    /**
      * @inheritDoc
      */

  }, {
    key: 'getSourceState',
    value: function getSourceState() {
      var source = this.getSource();
      return !source ? _State2.default.UNDEFINED : source.getState();
    }

    /**
     * @private
     */

  }, {
    key: 'handleSourceChange_',
    value: function handleSourceChange_() {
      this.changed();
    }

    /**
     * @private
     */

  }, {
    key: 'handleSourcePropertyChange_',
    value: function handleSourcePropertyChange_() {
      if (this.sourceChangeKey_) {
        (0, _events.unlistenByKey)(this.sourceChangeKey_);
        this.sourceChangeKey_ = null;
      }
      var source = this.getSource();
      if (source) {
        this.sourceChangeKey_ = (0, _events.listen)(source, _EventType2.default.CHANGE, this.handleSourceChange_, this);
      }
      this.changed();
    }

    /**
     * Sets the layer to be rendered on top of other layers on a map. The map will
     * not manage this layer in its layers collection, and the callback in
     * {@link module:ol/Map#forEachLayerAtPixel} will receive `null` as layer. This
     * is useful for temporary layers. To remove an unmanaged layer from the map,
     * use `#setMap(null)`.
     *
     * To add the layer to a map and have it managed by the map, use
     * {@link module:ol/Map#addLayer} instead.
     * @param {module:ol/PluggableMap} map Map.
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      if (this.mapPrecomposeKey_) {
        (0, _events.unlistenByKey)(this.mapPrecomposeKey_);
        this.mapPrecomposeKey_ = null;
      }
      if (!map) {
        this.changed();
      }
      if (this.mapRenderKey_) {
        (0, _events.unlistenByKey)(this.mapRenderKey_);
        this.mapRenderKey_ = null;
      }
      if (map) {
        this.mapPrecomposeKey_ = (0, _events.listen)(map, _EventType4.default.PRECOMPOSE, function (evt) {
          var layerState = this.getLayerState();
          layerState.managed = false;
          layerState.zIndex = Infinity;
          evt.frameState.layerStatesArray.push(layerState);
          evt.frameState.layerStates[(0, _util.getUid)(this)] = layerState;
        }, this);
        this.mapRenderKey_ = (0, _events.listen)(this, _EventType2.default.CHANGE, map.render, map);
        this.changed();
      }
    }

    /**
     * Set the layer source.
     * @param {module:ol/source/Source} source The layer source.
     * @observable
     * @api
     */

  }, {
    key: 'setSource',
    value: function setSource(source) {
      this.set(_Property2.default.SOURCE, source);
    }
  }]);

  return Layer;
}(_Base2.default);

/**
 * Return `true` if the layer is visible, and if the passed resolution is
 * between the layer's minResolution and maxResolution. The comparison is
 * inclusive for `minResolution` and exclusive for `maxResolution`.
 * @param {module:ol/layer/Layer~State} layerState Layer state.
 * @param {number} resolution Resolution.
 * @return {boolean} The layer is visible at the given resolution.
 */


function visibleAtResolution(layerState, resolution) {
  return layerState.visible && resolution >= layerState.minResolution && resolution < layerState.maxResolution;
}

exports.default = Layer;