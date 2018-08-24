'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _util = require('../util.js');

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _array = require('../array.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _condition = require('../events/condition.js');

var _functions = require('../functions.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _obj = require('../obj.js');

var _Vector3 = require('../source/Vector.js');

var _Vector4 = _interopRequireDefault(_Vector3);

var _Style = require('../style/Style.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Select
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 */
var SelectEventType = {
  /**
   * Triggered when feature(s) has been (de)selected.
   * @event SelectEvent#select
   * @api
   */
  SELECT: 'select'
};

/**
 * A function that takes an {@link module:ol/Feature} or
 * {@link module:ol/render/Feature} and an
 * {@link module:ol/layer/Layer} and returns `true` if the feature may be
 * selected or `false` otherwise.
 * @typedef {function((module:ol/Feature|module:ol/render/Feature), module:ol/layer/Layer):
 *     boolean} FilterFunction
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [addCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * By default, this is {@link module:ol/events/condition~never}. Use this if you
 * want to use different events for add and remove instead of `toggle`.
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. This is the event
 * for the selected features as a whole. By default, this is
 * {@link module:ol/events/condition~singleClick}. Clicking on a feature selects that
 * feature and removes any that were in the selection. Clicking outside any
 * feature removes all from the selection.
 * See `toggle`, `add`, `remove` options for adding/removing extra features to/
 * from the selection.
 * @property {Array<module:ol/layer/Layer>|function(module:ol/layer/Layer): boolean} [layers]
 * A list of layers from which features should be selected. Alternatively, a
 * filter function can be provided. The function will be called for each layer
 * in the map and should return `true` for layers that you want to be
 * selectable. If the option is absent, all visible layers will be considered
 * selectable.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style]
 * Style for the selected features. By default the default edit style is used
 * (see {@link module:ol/style}).
 * @property {module:ol/events/condition~Condition} [removeCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * By default, this is {@link module:ol/events/condition~never}. Use this if you
 * want to use different events for add and remove instead of `toggle`.
 * @property {module:ol/events/condition~Condition} [toggleCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. This is in addition
 * to the `condition` event. By default,
 * {@link module:ol/events/condition~shiftKeyOnly}, i.e. pressing `shift` as
 * well as the `condition` event, adds that feature to the current selection if
 * it is not currently selected, and removes it if it is. See `add` and `remove`
 * if you want to use different events instead of a toggle.
 * @property {boolean} [multi=false] A boolean that determines if the default
 * behaviour should select only single features or all (overlapping) features at
 * the clicked map position. The default of `false` means single select.
 * @property {module:ol/Collection<module:ol/Feature>} [features]
 * Collection where the interaction will place selected features. Optional. If
 * not set the interaction will create a collection. In any case the collection
 * used by the interaction is returned by
 * {@link module:ol/interaction/Select~Select#getFeatures}.
 * @property {module:ol/interaction/Select~FilterFunction} [filter] A function
 * that takes an {@link module:ol/Feature} and an
 * {@link module:ol/layer/Layer} and returns `true` if the feature may be
 * selected or `false` otherwise.
 * @property {boolean} [wrapX=true] Wrap the world horizontally on the selection
 * overlay.
 * @property {number} [hitTolerance=0] Hit-detection tolerance. Pixels inside
 * the radius around the given position will be checked for features. This only
 * works for the canvas renderer and not for WebGL.
 */

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/Select~Select} instances are instances of
 * this type.
 */

var SelectEvent = function (_Event) {
  _inherits(SelectEvent, _Event);

  /**
   * @param {SelectEventType} type The event type.
   * @param {Array<module:ol/Feature>} selected Selected features.
   * @param {Array<module:ol/Feature>} deselected Deselected features.
   * @param {module:ol/MapBrowserEvent} mapBrowserEvent Associated
   *     {@link module:ol/MapBrowserEvent}.
   */
  function SelectEvent(type, selected, deselected, mapBrowserEvent) {
    _classCallCheck(this, SelectEvent);

    /**
     * Selected features array.
     * @type {Array<module:ol/Feature>}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (SelectEvent.__proto__ || Object.getPrototypeOf(SelectEvent)).call(this, type));

    _this.selected = selected;

    /**
     * Deselected features array.
     * @type {Array<module:ol/Feature>}
     * @api
     */
    _this.deselected = deselected;

    /**
     * Associated {@link module:ol/MapBrowserEvent}.
     * @type {module:ol/MapBrowserEvent}
     * @api
     */
    _this.mapBrowserEvent = mapBrowserEvent;

    return _this;
  }

  return SelectEvent;
}(_Event3.default);

/**
 * @classdesc
 * Interaction for selecting vector features. By default, selected features are
 * styled differently, so this interaction can be used for visual highlighting,
 * as well as selecting features for other actions, such as modification or
 * output. There are three ways of controlling which features are selected:
 * using the browser event as defined by the `condition` and optionally the
 * `toggle`, `add`/`remove`, and `multi` options; a `layers` filter; and a
 * further feature filter using the `filter` option.
 *
 * Selected features are added to an internal unmanaged layer.
 *
 * @fires SelectEvent
 * @api
 */


var Select = function (_Interaction) {
  _inherits(Select, _Interaction);

  /**
   * @param {module:ol/interaction/Select~Options=} opt_options Options.
   */
  function Select(opt_options) {
    _classCallCheck(this, Select);

    var _this2 = _possibleConstructorReturn(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, {
      handleEvent: handleEvent
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.condition_ = options.condition ? options.condition : _condition.singleClick;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.addCondition_ = options.addCondition ? options.addCondition : _condition.never;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.removeCondition_ = options.removeCondition ? options.removeCondition : _condition.never;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.toggleCondition_ = options.toggleCondition ? options.toggleCondition : _condition.shiftKeyOnly;

    /**
     * @private
     * @type {boolean}
     */
    _this2.multi_ = options.multi ? options.multi : false;

    /**
     * @private
     * @type {module:ol/interaction/Select~FilterFunction}
     */
    _this2.filter_ = options.filter ? options.filter : _functions.TRUE;

    /**
     * @private
     * @type {number}
     */
    _this2.hitTolerance_ = options.hitTolerance ? options.hitTolerance : 0;

    var featureOverlay = new _Vector2.default({
      source: new _Vector4.default({
        useSpatialIndex: false,
        features: options.features,
        wrapX: options.wrapX
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });

    /**
     * @private
     * @type {module:ol/layer/Vector}
     */
    _this2.featureOverlay_ = featureOverlay;

    /** @type {function(module:ol/layer/Layer): boolean} */
    var layerFilter = void 0;
    if (options.layers) {
      if (typeof options.layers === 'function') {
        layerFilter = options.layers;
      } else {
        var layers = options.layers;
        layerFilter = function layerFilter(layer) {
          return (0, _array.includes)(layers, layer);
        };
      }
    } else {
      layerFilter = _functions.TRUE;
    }

    /**
     * @private
     * @type {function(module:ol/layer/Layer): boolean}
     */
    _this2.layerFilter_ = layerFilter;

    /**
     * An association between selected feature (key)
     * and layer (value)
     * @private
     * @type {Object<number, module:ol/layer/Layer>}
     */
    _this2.featureLayerAssociation_ = {};

    var features = _this2.featureOverlay_.getSource().getFeaturesCollection();
    (0, _events.listen)(features, _CollectionEventType2.default.ADD, _this2.addFeature_, _this2);
    (0, _events.listen)(features, _CollectionEventType2.default.REMOVE, _this2.removeFeature_, _this2);

    return _this2;
  }

  /**
   * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
   * @param {module:ol/layer/Layer} layer Layer.
   * @private
   */


  _createClass(Select, [{
    key: 'addFeatureLayerAssociation_',
    value: function addFeatureLayerAssociation_(feature, layer) {
      var key = (0, _util.getUid)(feature);
      this.featureLayerAssociation_[key] = layer;
    }

    /**
     * Get the selected features.
     * @return {module:ol/Collection<module:ol/Feature>} Features collection.
     * @api
     */

  }, {
    key: 'getFeatures',
    value: function getFeatures() {
      return this.featureOverlay_.getSource().getFeaturesCollection();
    }

    /**
     * Returns the Hit-detection tolerance.
     * @returns {number} Hit tolerance in pixels.
     * @api
     */

  }, {
    key: 'getHitTolerance',
    value: function getHitTolerance() {
      return this.hitTolerance_;
    }

    /**
     * Returns the associated {@link module:ol/layer/Vector~Vector vectorlayer} of
     * the (last) selected feature. Note that this will not work with any
     * programmatic method like pushing features to
     * {@link module:ol/interaction/Select~Select#getFeatures collection}.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature
     * @return {module:ol/layer/Vector} Layer.
     * @api
     */

  }, {
    key: 'getLayer',
    value: function getLayer(feature) {
      var key = (0, _util.getUid)(feature);
      return (
        /** @type {module:ol/layer/Vector} */this.featureLayerAssociation_[key]
      );
    }

    /**
     * Hit-detection tolerance. Pixels inside the radius around the given position
     * will be checked for features. This only works for the canvas renderer and
     * not for WebGL.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @api
     */

  }, {
    key: 'setHitTolerance',
    value: function setHitTolerance(hitTolerance) {
      this.hitTolerance_ = hitTolerance;
    }

    /**
     * Remove the interaction from its current map, if any,  and attach it to a new
     * map, if any. Pass `null` to just remove the interaction from the current map.
     * @param {module:ol/PluggableMap} map Map.
     * @override
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      var currentMap = this.getMap();
      var selectedFeatures = this.featureOverlay_.getSource().getFeaturesCollection();
      if (currentMap) {
        selectedFeatures.forEach(currentMap.unskipFeature.bind(currentMap));
      }
      _get(Select.prototype.__proto__ || Object.getPrototypeOf(Select.prototype), 'setMap', this).call(this, map);
      this.featureOverlay_.setMap(map);
      if (map) {
        selectedFeatures.forEach(map.skipFeature.bind(map));
      }
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'addFeature_',
    value: function addFeature_(evt) {
      var map = this.getMap();
      if (map) {
        map.skipFeature( /** @type {module:ol/Feature} */evt.element);
      }
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'removeFeature_',
    value: function removeFeature_(evt) {
      var map = this.getMap();
      if (map) {
        map.unskipFeature( /** @type {module:ol/Feature} */evt.element);
      }
    }

    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @private
     */

  }, {
    key: 'removeFeatureLayerAssociation_',
    value: function removeFeatureLayerAssociation_(feature) {
      var key = (0, _util.getUid)(feature);
      delete this.featureLayerAssociation_[key];
    }
  }]);

  return Select;
}(_Interaction3.default);

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} and may change the
 * selected state of features.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/Select}
 */


function handleEvent(mapBrowserEvent) {
  if (!this.condition_(mapBrowserEvent)) {
    return true;
  }
  var add = this.addCondition_(mapBrowserEvent);
  var remove = this.removeCondition_(mapBrowserEvent);
  var toggle = this.toggleCondition_(mapBrowserEvent);
  var set = !add && !remove && !toggle;
  var map = mapBrowserEvent.map;
  var features = this.featureOverlay_.getSource().getFeaturesCollection();
  var deselected = [];
  var selected = [];
  if (set) {
    // Replace the currently selected feature(s) with the feature(s) at the
    // pixel, or clear the selected feature(s) if there is no feature at
    // the pixel.
    (0, _obj.clear)(this.featureLayerAssociation_);
    map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {module:ol/layer/Layer} layer Layer.
     * @return {boolean|undefined} Continue to iterate over the features.
     */
    function (feature, layer) {
      if (this.filter_(feature, layer)) {
        selected.push(feature);
        this.addFeatureLayerAssociation_(feature, layer);
        return !this.multi_;
      }
    }.bind(this), {
      layerFilter: this.layerFilter_,
      hitTolerance: this.hitTolerance_
    });
    for (var i = features.getLength() - 1; i >= 0; --i) {
      var feature = features.item(i);
      var index = selected.indexOf(feature);
      if (index > -1) {
        // feature is already selected
        selected.splice(index, 1);
      } else {
        features.remove(feature);
        deselected.push(feature);
      }
    }
    if (selected.length !== 0) {
      features.extend(selected);
    }
  } else {
    // Modify the currently selected feature(s).
    map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {module:ol/layer/Layer} layer Layer.
     * @return {boolean|undefined} Continue to iterate over the features.
     */
    function (feature, layer) {
      if (this.filter_(feature, layer)) {
        if ((add || toggle) && !(0, _array.includes)(features.getArray(), feature)) {
          selected.push(feature);
          this.addFeatureLayerAssociation_(feature, layer);
        } else if ((remove || toggle) && (0, _array.includes)(features.getArray(), feature)) {
          deselected.push(feature);
          this.removeFeatureLayerAssociation_(feature);
        }
        return !this.multi_;
      }
    }.bind(this), {
      layerFilter: this.layerFilter_,
      hitTolerance: this.hitTolerance_
    });
    for (var j = deselected.length - 1; j >= 0; --j) {
      features.remove(deselected[j]);
    }
    features.extend(selected);
  }
  if (selected.length > 0 || deselected.length > 0) {
    this.dispatchEvent(new SelectEvent(SelectEventType.SELECT, selected, deselected, mapBrowserEvent));
  }
  return (0, _condition.pointerMove)(mapBrowserEvent);
}

/**
 * @return {module:ol/style/Style~StyleFunction} Styles.
 */
function getDefaultStyleFunction() {
  var styles = (0, _Style.createEditingStyle)();
  (0, _array.extend)(styles[_GeometryType2.default.POLYGON], styles[_GeometryType2.default.LINE_STRING]);
  (0, _array.extend)(styles[_GeometryType2.default.GEOMETRY_COLLECTION], styles[_GeometryType2.default.LINE_STRING]);

  return function (feature, resolution) {
    if (!feature.getGeometry()) {
      return null;
    }
    return styles[feature.getGeometry().getType()];
  };
}

exports.default = Select;