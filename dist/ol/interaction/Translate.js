'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Object = require('../Object.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _functions = require('../functions.js');

var _array = require('../array.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _Property = require('../interaction/Property.js');

var _Property2 = _interopRequireDefault(_Property);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Translate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 */
var TranslateEventType = {
  /**
   * Triggered upon feature translation start.
   * @event TranslateEvent#translatestart
   * @api
   */
  TRANSLATESTART: 'translatestart',
  /**
   * Triggered upon feature translation.
   * @event TranslateEvent#translating
   * @api
   */
  TRANSLATING: 'translating',
  /**
   * Triggered upon feature translation end.
   * @event TranslateEvent#translateend
   * @api
   */
  TRANSLATEEND: 'translateend'
};

/**
 * @typedef {Object} Options
 * @property {module:ol/Collection<module:ol/Feature>} [features] Only features contained in this collection will be able to be translated. If
 * not specified, all features on the map will be able to be translated.
 * @property {Array<module:ol/layer/Layer>|function(module:ol/layer/Layer): boolean} [layers] A list of layers from which features should be
 * translated. Alternatively, a filter function can be provided. The
 * function will be called for each layer in the map and should return
 * `true` for layers that you want to be translatable. If the option is
 * absent, all visible layers will be considered translatable.
 * @property {number} [hitTolerance=0] Hit-detection tolerance. Pixels inside the radius around the given position
 * will be checked for features. This only works for the canvas renderer and
 * not for WebGL.
 */

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/Translate~Translate} instances
 * are instances of this type.
 */

var TranslateEvent = exports.TranslateEvent = function (_Event) {
  _inherits(TranslateEvent, _Event);

  /**
   * @param {module:ol/interaction/Translate~TranslateEventType} type Type.
   * @param {module:ol/Collection<module:ol/Feature>} features The features translated.
   * @param {module:ol/coordinate~Coordinate} coordinate The event coordinate.
   */
  function TranslateEvent(type, features, coordinate) {
    _classCallCheck(this, TranslateEvent);

    /**
     * The features being translated.
     * @type {module:ol/Collection<module:ol/Feature>}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (TranslateEvent.__proto__ || Object.getPrototypeOf(TranslateEvent)).call(this, type));

    _this.features = features;

    /**
     * The coordinate of the drag event.
     * @const
     * @type {module:ol/coordinate~Coordinate}
     * @api
     */
    _this.coordinate = coordinate;

    return _this;
  }

  return TranslateEvent;
}(_Event3.default);

/**
 * @classdesc
 * Interaction for translating (moving) features.
 *
 * @fires module:ol/interaction/Translate~TranslateEvent
 * @api
 */


var Translate = function (_PointerInteraction) {
  _inherits(Translate, _PointerInteraction);

  /**
   * @param {module:ol/interaction/Translate~Options=} opt_options Options.
   */
  function Translate(opt_options) {
    _classCallCheck(this, Translate);

    var _this2 = _possibleConstructorReturn(this, (Translate.__proto__ || Object.getPrototypeOf(Translate)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent
    }));

    var options = opt_options ? opt_options : {};

    /**
     * The last position we translated to.
     * @type {module:ol/coordinate~Coordinate}
     * @private
     */
    _this2.lastCoordinate_ = null;

    /**
     * @type {module:ol/Collection<module:ol/Feature>}
     * @private
     */
    _this2.features_ = options.features !== undefined ? options.features : null;

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
     * @private
     * @type {number}
     */
    _this2.hitTolerance_ = options.hitTolerance ? options.hitTolerance : 0;

    /**
     * @type {module:ol/Feature}
     * @private
     */
    _this2.lastFeature_ = null;

    (0, _events.listen)(_this2, (0, _Object.getChangeEventType)(_Property2.default.ACTIVE), _this2.handleActiveChanged_, _this2);

    return _this2;
  }

  /**
   * Tests to see if the given coordinates intersects any of our selected
   * features.
   * @param {module:ol/pixel~Pixel} pixel Pixel coordinate to test for intersection.
   * @param {module:ol/PluggableMap} map Map to test the intersection on.
   * @return {module:ol/Feature} Returns the feature found at the specified pixel
   * coordinates.
   * @private
   */


  _createClass(Translate, [{
    key: 'featuresAtPixel_',
    value: function featuresAtPixel_(pixel, map) {
      return map.forEachFeatureAtPixel(pixel, function (feature) {
        if (!this.features_ || (0, _array.includes)(this.features_.getArray(), feature)) {
          return feature;
        }
      }.bind(this), {
        layerFilter: this.layerFilter_,
        hitTolerance: this.hitTolerance_
      });
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
     * @inheritDoc
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      var oldMap = this.getMap();
      _get(Translate.prototype.__proto__ || Object.getPrototypeOf(Translate.prototype), 'setMap', this).call(this, map);
      this.updateState_(oldMap);
    }

    /**
     * @private
     */

  }, {
    key: 'handleActiveChanged_',
    value: function handleActiveChanged_() {
      this.updateState_(null);
    }

    /**
     * @param {module:ol/PluggableMap} oldMap Old map.
     * @private
     */

  }, {
    key: 'updateState_',
    value: function updateState_(oldMap) {
      var map = this.getMap();
      var active = this.getActive();
      if (!map || !active) {
        map = map || oldMap;
        if (map) {
          var elem = map.getViewport();
          elem.classList.remove('ol-grab', 'ol-grabbing');
        }
      }
    }
  }]);

  return Translate;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} event Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/Translate}
 */


function handleDownEvent(event) {
  this.lastFeature_ = this.featuresAtPixel_(event.pixel, event.map);
  if (!this.lastCoordinate_ && this.lastFeature_) {
    this.lastCoordinate_ = event.coordinate;
    handleMoveEvent.call(this, event);

    var features = this.features_ || new _Collection2.default([this.lastFeature_]);

    this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATESTART, features, event.coordinate));
    return true;
  }
  return false;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} event Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/Translate}
 */
function handleUpEvent(event) {
  if (this.lastCoordinate_) {
    this.lastCoordinate_ = null;
    handleMoveEvent.call(this, event);

    var features = this.features_ || new _Collection2.default([this.lastFeature_]);

    this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATEEND, features, event.coordinate));
    return true;
  }
  return false;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} event Event.
 * @this {module:ol/interaction/Translate}
 */
function handleDragEvent(event) {
  if (this.lastCoordinate_) {
    var newCoordinate = event.coordinate;
    var deltaX = newCoordinate[0] - this.lastCoordinate_[0];
    var deltaY = newCoordinate[1] - this.lastCoordinate_[1];

    var features = this.features_ || new _Collection2.default([this.lastFeature_]);

    features.forEach(function (feature) {
      var geom = feature.getGeometry();
      geom.translate(deltaX, deltaY);
      feature.setGeometry(geom);
    });

    this.lastCoordinate_ = newCoordinate;
    this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATING, features, newCoordinate));
  }
}

/**
 * @param {module:ol/MapBrowserEvent} event Event.
 * @this {module:ol/interaction/Translate}
 */
function handleMoveEvent(event) {
  var elem = event.map.getViewport();

  // Change the cursor to grab/grabbing if hovering any of the features managed
  // by the interaction
  if (this.featuresAtPixel_(event.pixel, event.map)) {
    elem.classList.remove(this.lastCoordinate_ ? 'ol-grab' : 'ol-grabbing');
    elem.classList.add(this.lastCoordinate_ ? 'ol-grabbing' : 'ol-grab');
  } else {
    elem.classList.remove('ol-grab', 'ol-grabbing');
  }
}

exports.default = Translate;