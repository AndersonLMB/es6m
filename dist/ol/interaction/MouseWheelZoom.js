'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _condition = require('../events/condition.js');

var _easing = require('../easing.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _has = require('../has.js');

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/MouseWheelZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Maximum mouse wheel delta.
 * @type {number}
 */
var MAX_DELTA = 1;

/**
 * @enum {string}
 */
var Mode = exports.Mode = {
  TRACKPAD: 'trackpad',
  WHEEL: 'wheel'
};

/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition~always}.
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {number} [timeout=80] Mouse wheel timeout duration in milliseconds.
 * @property {boolean} [constrainResolution=false] When using a trackpad or
 * magic mouse, zoom to the closest integer zoom level after the scroll gesture
 * ends.
 * @property {boolean} [useAnchor=true] Enable zooming using the mouse's
 * location as the anchor. When set to `false`, zooming in and out will zoom to
 * the center of the screen instead of zooming on the mouse's location.
 */

/**
 * @classdesc
 * Allows the user to zoom the map by scrolling the mouse wheel.
 * @api
 */

var MouseWheelZoom = function (_Interaction) {
  _inherits(MouseWheelZoom, _Interaction);

  /**
   * @param {module:ol/interaction/MouseWheelZoom~Options=} opt_options Options.
   */
  function MouseWheelZoom(opt_options) {
    _classCallCheck(this, MouseWheelZoom);

    var _this = _possibleConstructorReturn(this, (MouseWheelZoom.__proto__ || Object.getPrototypeOf(MouseWheelZoom)).call(this, {
      handleEvent: handleEvent
    }));

    var options = opt_options || {};

    /**
     * @private
     * @type {number}
     */
    _this.delta_ = 0;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    /**
     * @private
     * @type {number}
     */
    _this.timeout_ = options.timeout !== undefined ? options.timeout : 80;

    /**
     * @private
     * @type {boolean}
     */
    _this.useAnchor_ = options.useAnchor !== undefined ? options.useAnchor : true;

    /**
     * @private
     * @type {boolean}
     */
    _this.constrainResolution_ = options.constrainResolution || false;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this.condition_ = options.condition ? options.condition : _condition.always;

    /**
     * @private
     * @type {?module:ol/coordinate~Coordinate}
     */
    _this.lastAnchor_ = null;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.startTime_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.timeoutId_ = undefined;

    /**
     * @private
     * @type {module:ol/interaction/MouseWheelZoom~Mode|undefined}
     */
    _this.mode_ = undefined;

    /**
     * Trackpad events separated by this delay will be considered separate
     * interactions.
     * @type {number}
     */
    _this.trackpadEventGap_ = 400;

    /**
     * @type {number|undefined}
     */
    _this.trackpadTimeoutId_ = undefined;

    /**
     * The number of delta values per zoom level
     * @private
     * @type {number}
     */
    _this.trackpadDeltaPerZoom_ = 300;

    /**
     * The zoom factor by which scroll zooming is allowed to exceed the limits.
     * @private
     * @type {number}
     */
    _this.trackpadZoomBuffer_ = 1.5;

    return _this;
  }

  /**
   * @private
   */


  _createClass(MouseWheelZoom, [{
    key: 'decrementInteractingHint_',
    value: function decrementInteractingHint_() {
      this.trackpadTimeoutId_ = undefined;
      var view = this.getMap().getView();
      view.setHint(_ViewHint2.default.INTERACTING, -1);
    }

    /**
     * @private
     * @param {module:ol/PluggableMap} map Map.
     */

  }, {
    key: 'handleWheelZoom_',
    value: function handleWheelZoom_(map) {
      var view = map.getView();
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      var maxDelta = MAX_DELTA;
      var delta = (0, _math.clamp)(this.delta_, -maxDelta, maxDelta);
      (0, _Interaction2.zoomByDelta)(view, -delta, this.lastAnchor_, this.duration_);
      this.mode_ = undefined;
      this.delta_ = 0;
      this.lastAnchor_ = null;
      this.startTime_ = undefined;
      this.timeoutId_ = undefined;
    }

    /**
     * Enable or disable using the mouse's location as an anchor when zooming
     * @param {boolean} useAnchor true to zoom to the mouse's location, false
     * to zoom to the center of the map
     * @api
     */

  }, {
    key: 'setMouseAnchor',
    value: function setMouseAnchor(useAnchor) {
      this.useAnchor_ = useAnchor;
      if (!useAnchor) {
        this.lastAnchor_ = null;
      }
    }
  }]);

  return MouseWheelZoom;
}(_Interaction3.default);

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} (if it was a
 * mousewheel-event) and eventually zooms the map.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} Allow event propagation.
 * @this {module:ol/interaction/MouseWheelZoom}
 */


function handleEvent(mapBrowserEvent) {
  if (!this.condition_(mapBrowserEvent)) {
    return true;
  }
  var type = mapBrowserEvent.type;
  if (type !== _EventType2.default.WHEEL && type !== _EventType2.default.MOUSEWHEEL) {
    return true;
  }

  mapBrowserEvent.preventDefault();

  var map = mapBrowserEvent.map;
  var wheelEvent = /** @type {WheelEvent} */mapBrowserEvent.originalEvent;

  if (this.useAnchor_) {
    this.lastAnchor_ = mapBrowserEvent.coordinate;
  }

  // Delta normalisation inspired by
  // https://github.com/mapbox/mapbox-gl-js/blob/001c7b9/js/ui/handler/scroll_zoom.js
  var delta = void 0;
  if (mapBrowserEvent.type == _EventType2.default.WHEEL) {
    delta = wheelEvent.deltaY;
    if (_has.FIREFOX && wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      delta /= _has.DEVICE_PIXEL_RATIO;
    }
    if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      delta *= 40;
    }
  } else if (mapBrowserEvent.type == _EventType2.default.MOUSEWHEEL) {
    delta = -wheelEvent.wheelDeltaY;
    if (_has.SAFARI) {
      delta /= 3;
    }
  }

  if (delta === 0) {
    return false;
  }

  var now = Date.now();

  if (this.startTime_ === undefined) {
    this.startTime_ = now;
  }

  if (!this.mode_ || now - this.startTime_ > this.trackpadEventGap_) {
    this.mode_ = Math.abs(delta) < 4 ? Mode.TRACKPAD : Mode.WHEEL;
  }

  if (this.mode_ === Mode.TRACKPAD) {
    var view = map.getView();
    if (this.trackpadTimeoutId_) {
      clearTimeout(this.trackpadTimeoutId_);
    } else {
      view.setHint(_ViewHint2.default.INTERACTING, 1);
    }
    this.trackpadTimeoutId_ = setTimeout(this.decrementInteractingHint_.bind(this), this.trackpadEventGap_);
    var resolution = view.getResolution() * Math.pow(2, delta / this.trackpadDeltaPerZoom_);
    var minResolution = view.getMinResolution();
    var maxResolution = view.getMaxResolution();
    var rebound = 0;
    if (resolution < minResolution) {
      resolution = Math.max(resolution, minResolution / this.trackpadZoomBuffer_);
      rebound = 1;
    } else if (resolution > maxResolution) {
      resolution = Math.min(resolution, maxResolution * this.trackpadZoomBuffer_);
      rebound = -1;
    }
    if (this.lastAnchor_) {
      var center = view.calculateCenterZoom(resolution, this.lastAnchor_);
      view.setCenter(view.constrainCenter(center));
    }
    view.setResolution(resolution);

    if (rebound === 0 && this.constrainResolution_) {
      view.animate({
        resolution: view.constrainResolution(resolution, delta > 0 ? -1 : 1),
        easing: _easing.easeOut,
        anchor: this.lastAnchor_,
        duration: this.duration_
      });
    }

    if (rebound > 0) {
      view.animate({
        resolution: minResolution,
        easing: _easing.easeOut,
        anchor: this.lastAnchor_,
        duration: 500
      });
    } else if (rebound < 0) {
      view.animate({
        resolution: maxResolution,
        easing: _easing.easeOut,
        anchor: this.lastAnchor_,
        duration: 500
      });
    }
    this.startTime_ = now;
    return false;
  }

  this.delta_ += delta;

  var timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0);

  clearTimeout(this.timeoutId_);
  this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, map), timeLeft);

  return false;
}

exports.default = MouseWheelZoom;