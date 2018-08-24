'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _has = require('./has.js');

var _MapBrowserEventType = require('./MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _MapBrowserPointerEvent = require('./MapBrowserPointerEvent.js');

var _MapBrowserPointerEvent2 = _interopRequireDefault(_MapBrowserPointerEvent);

var _events = require('./events.js');

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./pointer/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _PointerEventHandler = require('./pointer/PointerEventHandler.js');

var _PointerEventHandler2 = _interopRequireDefault(_PointerEventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/MapBrowserEventHandler
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MapBrowserEventHandler = function (_EventTarget) {
  _inherits(MapBrowserEventHandler, _EventTarget);

  /**
   * @param {module:ol/PluggableMap} map The map with the viewport to listen to events on.
   * @param {number=} moveTolerance The minimal distance the pointer must travel to trigger a move.
   */
  function MapBrowserEventHandler(map, moveTolerance) {
    _classCallCheck(this, MapBrowserEventHandler);

    /**
     * This is the element that we will listen to the real events on.
     * @type {module:ol/PluggableMap}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (MapBrowserEventHandler.__proto__ || Object.getPrototypeOf(MapBrowserEventHandler)).call(this));

    _this.map_ = map;

    /**
     * @type {number}
     * @private
     */
    _this.clickTimeoutId_ = 0;

    /**
     * @type {boolean}
     * @private
     */
    _this.dragging_ = false;

    /**
     * @type {!Array<module:ol/events~EventsKey>}
     * @private
     */
    _this.dragListenerKeys_ = [];

    /**
     * @type {number}
     * @private
     */
    _this.moveTolerance_ = moveTolerance ? moveTolerance * _has.DEVICE_PIXEL_RATIO : _has.DEVICE_PIXEL_RATIO;

    /**
     * The most recent "down" type event (or null if none have occurred).
     * Set on pointerdown.
     * @type {module:ol/pointer/PointerEvent}
     * @private
     */
    _this.down_ = null;

    var element = _this.map_.getViewport();

    /**
     * @type {number}
     * @private
     */
    _this.activePointers_ = 0;

    /**
     * @type {!Object<number, boolean>}
     * @private
     */
    _this.trackedTouches_ = {};

    /**
     * Event handler which generates pointer events for
     * the viewport element.
     *
     * @type {module:ol/pointer/PointerEventHandler}
     * @private
     */
    _this.pointerEventHandler_ = new _PointerEventHandler2.default(element);

    /**
     * Event handler which generates pointer events for
     * the document (used when dragging).
     *
     * @type {module:ol/pointer/PointerEventHandler}
     * @private
     */
    _this.documentPointerEventHandler_ = null;

    /**
     * @type {?module:ol/events~EventsKey}
     * @private
     */
    _this.pointerdownListenerKey_ = (0, _events.listen)(_this.pointerEventHandler_, _EventType2.default.POINTERDOWN, _this.handlePointerDown_, _this);

    /**
     * @type {?module:ol/events~EventsKey}
     * @private
     */
    _this.relayedListenerKey_ = (0, _events.listen)(_this.pointerEventHandler_, _EventType2.default.POINTERMOVE, _this.relayEvent_, _this);

    return _this;
  }

  /**
   * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */


  _createClass(MapBrowserEventHandler, [{
    key: 'emulateClick_',
    value: function emulateClick_(pointerEvent) {
      var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.CLICK, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);
      if (this.clickTimeoutId_ !== 0) {
        // double-click
        clearTimeout(this.clickTimeoutId_);
        this.clickTimeoutId_ = 0;
        newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.DBLCLICK, this.map_, pointerEvent);
        this.dispatchEvent(newEvent);
      } else {
        // click
        this.clickTimeoutId_ = setTimeout(function () {
          this.clickTimeoutId_ = 0;
          var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.SINGLECLICK, this.map_, pointerEvent);
          this.dispatchEvent(newEvent);
        }.bind(this), 250);
      }
    }

    /**
     * Keeps track on how many pointers are currently active.
     *
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */

  }, {
    key: 'updateActivePointers_',
    value: function updateActivePointers_(pointerEvent) {
      var event = pointerEvent;

      if (event.type == _MapBrowserEventType2.default.POINTERUP || event.type == _MapBrowserEventType2.default.POINTERCANCEL) {
        delete this.trackedTouches_[event.pointerId];
      } else if (event.type == _MapBrowserEventType2.default.POINTERDOWN) {
        this.trackedTouches_[event.pointerId] = true;
      }
      this.activePointers_ = Object.keys(this.trackedTouches_).length;
    }

    /**
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */

  }, {
    key: 'handlePointerUp_',
    value: function handlePointerUp_(pointerEvent) {
      this.updateActivePointers_(pointerEvent);
      var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERUP, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);

      // We emulate click events on left mouse button click, touch contact, and pen
      // contact. isMouseActionButton returns true in these cases (evt.button is set
      // to 0).
      // See http://www.w3.org/TR/pointerevents/#button-states
      // We only fire click, singleclick, and doubleclick if nobody has called
      // event.stopPropagation() or event.preventDefault().
      if (!newEvent.propagationStopped && !this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
        this.emulateClick_(this.down_);
      }

      if (this.activePointers_ === 0) {
        this.dragListenerKeys_.forEach(_events.unlistenByKey);
        this.dragListenerKeys_.length = 0;
        this.dragging_ = false;
        this.down_ = null;
        this.documentPointerEventHandler_.dispose();
        this.documentPointerEventHandler_ = null;
      }
    }

    /**
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @return {boolean} If the left mouse button was pressed.
     * @private
     */

  }, {
    key: 'isMouseActionButton_',
    value: function isMouseActionButton_(pointerEvent) {
      return pointerEvent.button === 0;
    }

    /**
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */

  }, {
    key: 'handlePointerDown_',
    value: function handlePointerDown_(pointerEvent) {
      this.updateActivePointers_(pointerEvent);
      var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERDOWN, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);

      this.down_ = pointerEvent;

      if (this.dragListenerKeys_.length === 0) {
        /* Set up a pointer event handler on the `document`,
         * which is required when the pointer is moved outside
         * the viewport when dragging.
         */
        this.documentPointerEventHandler_ = new _PointerEventHandler2.default(document);

        this.dragListenerKeys_.push((0, _events.listen)(this.documentPointerEventHandler_, _MapBrowserEventType2.default.POINTERMOVE, this.handlePointerMove_, this), (0, _events.listen)(this.documentPointerEventHandler_, _MapBrowserEventType2.default.POINTERUP, this.handlePointerUp_, this),
        /* Note that the listener for `pointercancel is set up on
         * `pointerEventHandler_` and not `documentPointerEventHandler_` like
         * the `pointerup` and `pointermove` listeners.
         *
         * The reason for this is the following: `TouchSource.vacuumTouches_()`
         * issues `pointercancel` events, when there was no `touchend` for a
         * `touchstart`. Now, let's say a first `touchstart` is registered on
         * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
         * But `documentPointerEventHandler_` doesn't know about the first
         * `touchstart`. If there is no `touchend` for the `touchstart`, we can
         * only receive a `touchcancel` from `pointerEventHandler_`, because it is
         * only registered there.
         */
        (0, _events.listen)(this.pointerEventHandler_, _MapBrowserEventType2.default.POINTERCANCEL, this.handlePointerUp_, this));
      }
    }

    /**
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */

  }, {
    key: 'handlePointerMove_',
    value: function handlePointerMove_(pointerEvent) {
      // Between pointerdown and pointerup, pointermove events are triggered.
      // To avoid a 'false' touchmove event to be dispatched, we test if the pointer
      // moved a significant distance.
      if (this.isMoving_(pointerEvent)) {
        this.dragging_ = true;
        var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERDRAG, this.map_, pointerEvent, this.dragging_);
        this.dispatchEvent(newEvent);
      }

      // Some native android browser triggers mousemove events during small period
      // of time. See: https://code.google.com/p/android/issues/detail?id=5491 or
      // https://code.google.com/p/android/issues/detail?id=19827
      // ex: Galaxy Tab P3110 + Android 4.1.1
      pointerEvent.preventDefault();
    }

    /**
     * Wrap and relay a pointer event.  Note that this requires that the type
     * string for the MapBrowserPointerEvent matches the PointerEvent type.
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @private
     */

  }, {
    key: 'relayEvent_',
    value: function relayEvent_(pointerEvent) {
      var dragging = !!(this.down_ && this.isMoving_(pointerEvent));
      this.dispatchEvent(new _MapBrowserPointerEvent2.default(pointerEvent.type, this.map_, pointerEvent, dragging));
    }

    /**
     * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer
     * event.
     * @return {boolean} Is moving.
     * @private
     */

  }, {
    key: 'isMoving_',
    value: function isMoving_(pointerEvent) {
      return this.dragging_ || Math.abs(pointerEvent.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      if (this.relayedListenerKey_) {
        (0, _events.unlistenByKey)(this.relayedListenerKey_);
        this.relayedListenerKey_ = null;
      }
      if (this.pointerdownListenerKey_) {
        (0, _events.unlistenByKey)(this.pointerdownListenerKey_);
        this.pointerdownListenerKey_ = null;
      }

      this.dragListenerKeys_.forEach(_events.unlistenByKey);
      this.dragListenerKeys_.length = 0;

      if (this.documentPointerEventHandler_) {
        this.documentPointerEventHandler_.dispose();
        this.documentPointerEventHandler_ = null;
      }
      if (this.pointerEventHandler_) {
        this.pointerEventHandler_.dispose();
        this.pointerEventHandler_ = null;
      }
      _get(MapBrowserEventHandler.prototype.__proto__ || Object.getPrototypeOf(MapBrowserEventHandler.prototype), 'disposeInternal', this).call(this);
    }
  }]);

  return MapBrowserEventHandler;
}(_Target2.default);

exports.default = MapBrowserEventHandler;