'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.centroid = centroid;
exports.handleEvent = handleEvent;

var _functions = require('../functions.js');

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _MapBrowserPointerEvent = require('../MapBrowserPointerEvent.js');

var _MapBrowserPointerEvent2 = _interopRequireDefault(_MapBrowserPointerEvent);

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Pointer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/Pointer}
 */
var handleDragEvent = _functions.VOID;

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Capture dragging.
 * @this {module:ol/interaction/Pointer}
 */
var handleUpEvent = _functions.FALSE;

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Capture dragging.
 * @this {module:ol/interaction/Pointer}
 */
var handleDownEvent = _functions.FALSE;

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/Pointer}
 */
var handleMoveEvent = _functions.VOID;

/**
 * @typedef {Object} Options
 * @property {function(module:ol/MapBrowserPointerEvent):boolean} [handleDownEvent]
 * Function handling "down" events. If the function returns `true` then a drag
 * sequence is started.
 * @property {function(module:ol/MapBrowserPointerEvent)} [handleDragEvent]
 * Function handling "drag" events. This function is called on "move" events
 * during a drag sequence.
 * @property {function(module:ol/MapBrowserEvent):boolean} [handleEvent]
 * Method called by the map to notify the interaction that a browser event was
 * dispatched to the map. The function may return `false` to prevent the
 * propagation of the event to other interactions in the map's interactions
 * chain.
 * @property {function(module:ol/MapBrowserPointerEvent)} [handleMoveEvent]
 * Function handling "move" events. This function is called on "move" events,
 * also during a drag sequence (so during a drag sequence both the
 * `handleDragEvent` function and this function are called).
 * @property {function(module:ol/MapBrowserPointerEvent):boolean} [handleUpEvent]
 *  Function handling "up" events. If the function returns `false` then the
 * current drag sequence is stopped.
 * @property {function(boolean):boolean} stopDown
 * Should the down event be propagated to other interactions, or should be
 * stopped?
 */

/**
 * @classdesc
 * Base class that calls user-defined functions on `down`, `move` and `up`
 * events. This class also manages "drag sequences".
 *
 * When the `handleDownEvent` user function returns `true` a drag sequence is
 * started. During a drag sequence the `handleDragEvent` user function is
 * called on `move` events. The drag sequence ends when the `handleUpEvent`
 * user function is called and returns `false`.
 * @api
 */

var PointerInteraction = function (_Interaction) {
  _inherits(PointerInteraction, _Interaction);

  /**
   * @param {module:ol/interaction/Pointer~Options=} opt_options Options.
   */
  function PointerInteraction(opt_options) {
    _classCallCheck(this, PointerInteraction);

    var options = opt_options ? opt_options : {};

    /**
     * @type {function(module:ol/MapBrowserPointerEvent):boolean}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (PointerInteraction.__proto__ || Object.getPrototypeOf(PointerInteraction)).call(this, {
      handleEvent: options.handleEvent || handleEvent
    }));

    _this.handleDownEvent_ = options.handleDownEvent ? options.handleDownEvent : handleDownEvent;

    /**
     * @type {function(module:ol/MapBrowserPointerEvent)}
     * @private
     */
    _this.handleDragEvent_ = options.handleDragEvent ? options.handleDragEvent : handleDragEvent;

    /**
     * @type {function(module:ol/MapBrowserPointerEvent)}
     * @private
     */
    _this.handleMoveEvent_ = options.handleMoveEvent ? options.handleMoveEvent : handleMoveEvent;

    /**
     * @type {function(module:ol/MapBrowserPointerEvent):boolean}
     * @private
     */
    _this.handleUpEvent_ = options.handleUpEvent ? options.handleUpEvent : handleUpEvent;

    /**
     * @type {boolean}
     * @protected
     */
    _this.handlingDownUpSequence = false;

    /**
     * This function is used to determine if "down" events should be propagated
     * to other interactions or should be stopped.
     * @type {function(boolean):boolean}
     * @protected
     */
    _this.stopDown = options.stopDown ? options.stopDown : stopDown;

    /**
     * @type {!Object<string, module:ol/pointer/PointerEvent>}
     * @private
     */
    _this.trackedPointers_ = {};

    /**
     * @type {Array<module:ol/pointer/PointerEvent>}
     * @protected
     */
    _this.targetPointers = [];

    return _this;
  }

  /**
   * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
   * @private
   */


  _createClass(PointerInteraction, [{
    key: 'updateTrackedPointers_',
    value: function updateTrackedPointers_(mapBrowserEvent) {
      if (isPointerDraggingEvent(mapBrowserEvent)) {
        var event = mapBrowserEvent.pointerEvent;

        var id = event.pointerId.toString();
        if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERUP) {
          delete this.trackedPointers_[id];
        } else if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERDOWN) {
          this.trackedPointers_[id] = event;
        } else if (id in this.trackedPointers_) {
          // update only when there was a pointerdown event for this pointer
          this.trackedPointers_[id] = event;
        }
        this.targetPointers = (0, _obj.getValues)(this.trackedPointers_);
      }
    }
  }]);

  return PointerInteraction;
}(_Interaction3.default);

/**
 * @param {Array<module:ol/pointer/PointerEvent>} pointerEvents List of events.
 * @return {module:ol/pixel~Pixel} Centroid pixel.
 */


function centroid(pointerEvents) {
  var length = pointerEvents.length;
  var clientX = 0;
  var clientY = 0;
  for (var i = 0; i < length; i++) {
    clientX += pointerEvents[i].clientX;
    clientY += pointerEvents[i].clientY;
  }
  return [clientX / length, clientY / length];
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Whether the event is a pointerdown, pointerdrag
 *     or pointerup event.
 */
function isPointerDraggingEvent(mapBrowserEvent) {
  var type = mapBrowserEvent.type;
  return type === _MapBrowserEventType2.default.POINTERDOWN || type === _MapBrowserEventType2.default.POINTERDRAG || type === _MapBrowserEventType2.default.POINTERUP;
}

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} and may call into
 * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
 * detected.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/Pointer}
 * @api
 */
function handleEvent(mapBrowserEvent) {
  if (!(mapBrowserEvent instanceof _MapBrowserPointerEvent2.default)) {
    return true;
  }

  var stopEvent = false;
  this.updateTrackedPointers_(mapBrowserEvent);
  if (this.handlingDownUpSequence) {
    if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERDRAG) {
      this.handleDragEvent_(mapBrowserEvent);
    } else if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERUP) {
      var handledUp = this.handleUpEvent_(mapBrowserEvent);
      this.handlingDownUpSequence = handledUp && this.targetPointers.length > 0;
    }
  } else {
    if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERDOWN) {
      var handled = this.handleDownEvent_(mapBrowserEvent);
      if (handled) {
        mapBrowserEvent.preventDefault();
      }
      this.handlingDownUpSequence = handled;
      stopEvent = this.stopDown(handled);
    } else if (mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERMOVE) {
      this.handleMoveEvent_(mapBrowserEvent);
    }
  }
  return !stopEvent;
}

exports.default = PointerInteraction;

/**
 * @param {boolean} handled Was the event handled by the interaction?
 * @return {boolean} Should the `down` event be stopped?
 */

function stopDown(handled) {
  return handled;
}