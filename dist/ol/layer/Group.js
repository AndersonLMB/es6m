'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _Object = require('../Object.js');

var _ObjectEventType = require('../ObjectEventType.js');

var _ObjectEventType2 = _interopRequireDefault(_ObjectEventType);

var _asserts = require('../asserts.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _Base = require('../layer/Base.js');

var _Base2 = _interopRequireDefault(_Base);

var _obj = require('../obj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/layer/Group
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
 * @property {Array<module:ol/layer/Base>|module:ol/Collection<module:ol/layer/Base>} [layers] Child layers.
 */

/**
 * @enum {string}
 * @private
 */
var Property = {
  LAYERS: 'layers'
};

/**
 * @classdesc
 * A {@link module:ol/Collection~Collection} of layers that are handled together.
 *
 * A generic `change` event is triggered when the group/Collection changes.
 *
 * @api
 */

var LayerGroup = function (_BaseLayer) {
  _inherits(LayerGroup, _BaseLayer);

  /**
   * @param {module:ol/layer/Group~Options=} opt_options Layer options.
   */
  function LayerGroup(opt_options) {
    _classCallCheck(this, LayerGroup);

    var options = opt_options || {};
    var baseOptions = /** @type {module:ol/layer/Group~Options} */(0, _obj.assign)({}, options);
    delete baseOptions.layers;

    var layers = options.layers;

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    var _this = _possibleConstructorReturn(this, (LayerGroup.__proto__ || Object.getPrototypeOf(LayerGroup)).call(this, baseOptions));

    _this.layersListenerKeys_ = [];

    /**
     * @private
     * @type {Object<string, Array<module:ol/events~EventsKey>>}
     */
    _this.listenerKeys_ = {};

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.LAYERS), _this.handleLayersChanged_, _this);

    if (layers) {
      if (Array.isArray(layers)) {
        layers = new _Collection2.default(layers.slice(), { unique: true });
      } else {
        (0, _asserts.assert)(layers instanceof _Collection2.default, 43); // Expected `layers` to be an array or a `Collection`
        layers = layers;
      }
    } else {
      layers = new _Collection2.default(undefined, { unique: true });
    }

    _this.setLayers(layers);

    return _this;
  }

  /**
   * @private
   */


  _createClass(LayerGroup, [{
    key: 'handleLayerChange_',
    value: function handleLayerChange_() {
      this.changed();
    }

    /**
     * @param {module:ol/events/Event} event Event.
     * @private
     */

  }, {
    key: 'handleLayersChanged_',
    value: function handleLayersChanged_() {
      this.layersListenerKeys_.forEach(_events.unlistenByKey);
      this.layersListenerKeys_.length = 0;

      var layers = this.getLayers();
      this.layersListenerKeys_.push((0, _events.listen)(layers, _CollectionEventType2.default.ADD, this.handleLayersAdd_, this), (0, _events.listen)(layers, _CollectionEventType2.default.REMOVE, this.handleLayersRemove_, this));

      for (var id in this.listenerKeys_) {
        this.listenerKeys_[id].forEach(_events.unlistenByKey);
      }
      (0, _obj.clear)(this.listenerKeys_);

      var layersArray = layers.getArray();
      for (var i = 0, ii = layersArray.length; i < ii; i++) {
        var layer = layersArray[i];
        this.listenerKeys_[(0, _util.getUid)(layer).toString()] = [(0, _events.listen)(layer, _ObjectEventType2.default.PROPERTYCHANGE, this.handleLayerChange_, this), (0, _events.listen)(layer, _EventType2.default.CHANGE, this.handleLayerChange_, this)];
      }

      this.changed();
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} collectionEvent CollectionEvent.
     * @private
     */

  }, {
    key: 'handleLayersAdd_',
    value: function handleLayersAdd_(collectionEvent) {
      var layer = /** @type {module:ol/layer/Base} */collectionEvent.element;
      var key = (0, _util.getUid)(layer).toString();
      this.listenerKeys_[key] = [(0, _events.listen)(layer, _ObjectEventType2.default.PROPERTYCHANGE, this.handleLayerChange_, this), (0, _events.listen)(layer, _EventType2.default.CHANGE, this.handleLayerChange_, this)];
      this.changed();
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} collectionEvent CollectionEvent.
     * @private
     */

  }, {
    key: 'handleLayersRemove_',
    value: function handleLayersRemove_(collectionEvent) {
      var layer = /** @type {module:ol/layer/Base} */collectionEvent.element;
      var key = (0, _util.getUid)(layer).toString();
      this.listenerKeys_[key].forEach(_events.unlistenByKey);
      delete this.listenerKeys_[key];
      this.changed();
    }

    /**
     * Returns the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
     * in this group.
     * @return {!module:ol/Collection<module:ol/layer/Base>} Collection of
     *   {@link module:ol/layer/Base layers} that are part of this group.
     * @observable
     * @api
     */

  }, {
    key: 'getLayers',
    value: function getLayers() {
      return (
        /** @type {!module:ol/Collection<module:ol/layer/Base>} */this.get(Property.LAYERS)
      );
    }

    /**
     * Set the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
     * in this group.
     * @param {!module:ol/Collection<module:ol/layer/Base>} layers Collection of
     *   {@link module:ol/layer/Base layers} that are part of this group.
     * @observable
     * @api
     */

  }, {
    key: 'setLayers',
    value: function setLayers(layers) {
      this.set(Property.LAYERS, layers);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getLayersArray',
    value: function getLayersArray(opt_array) {
      var array = opt_array !== undefined ? opt_array : [];
      this.getLayers().forEach(function (layer) {
        layer.getLayersArray(array);
      });
      return array;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getLayerStatesArray',
    value: function getLayerStatesArray(opt_states) {
      var states = opt_states !== undefined ? opt_states : [];

      var pos = states.length;

      this.getLayers().forEach(function (layer) {
        layer.getLayerStatesArray(states);
      });

      var ownLayerState = this.getLayerState();
      for (var i = pos, ii = states.length; i < ii; i++) {
        var layerState = states[i];
        layerState.opacity *= ownLayerState.opacity;
        layerState.visible = layerState.visible && ownLayerState.visible;
        layerState.maxResolution = Math.min(layerState.maxResolution, ownLayerState.maxResolution);
        layerState.minResolution = Math.max(layerState.minResolution, ownLayerState.minResolution);
        if (ownLayerState.extent !== undefined) {
          if (layerState.extent !== undefined) {
            layerState.extent = (0, _extent.getIntersection)(layerState.extent, ownLayerState.extent);
          } else {
            layerState.extent = ownLayerState.extent;
          }
        }
      }

      return states;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSourceState',
    value: function getSourceState() {
      return _State2.default.READY;
    }
  }]);

  return LayerGroup;
}(_Base2.default);

exports.default = LayerGroup;