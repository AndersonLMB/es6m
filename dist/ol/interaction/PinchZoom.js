'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _functions = require('../functions.js');

var _Interaction = require('../interaction/Interaction.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/PinchZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [duration=400] Animation duration in milliseconds.
 * @property {boolean} [constrainResolution=false] Zoom to the closest integer
 * zoom level after the pinch gesture ends.
 */

/**
 * @classdesc
 * Allows the user to zoom the map by pinching with two fingers
 * on a touch screen.
 * @api
 */
var PinchZoom = function (_PointerInteraction) {
  _inherits(PinchZoom, _PointerInteraction);

  /**
   * @param {module:ol/interaction/PinchZoom~Options=} opt_options Options.
   */
  function PinchZoom(opt_options) {
    _classCallCheck(this, PinchZoom);

    var _this = _possibleConstructorReturn(this, (PinchZoom.__proto__ || Object.getPrototypeOf(PinchZoom)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {boolean}
     */
    _this.constrainResolution_ = options.constrainResolution || false;

    /**
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    _this.anchor_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 400;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.lastDistance_ = undefined;

    /**
     * @private
     * @type {number}
     */
    _this.lastScaleDelta_ = 1;

    return _this;
  }

  return PinchZoom;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/PinchZoom}
 */


function handleDragEvent(mapBrowserEvent) {
  var scaleDelta = 1.0;

  var touch0 = this.targetPointers[0];
  var touch1 = this.targetPointers[1];
  var dx = touch0.clientX - touch1.clientX;
  var dy = touch0.clientY - touch1.clientY;

  // distance between touches
  var distance = Math.sqrt(dx * dx + dy * dy);

  if (this.lastDistance_ !== undefined) {
    scaleDelta = this.lastDistance_ / distance;
  }
  this.lastDistance_ = distance;

  var map = mapBrowserEvent.map;
  var view = map.getView();
  var resolution = view.getResolution();
  var maxResolution = view.getMaxResolution();
  var minResolution = view.getMinResolution();
  var newResolution = resolution * scaleDelta;
  if (newResolution > maxResolution) {
    scaleDelta = maxResolution / resolution;
    newResolution = maxResolution;
  } else if (newResolution < minResolution) {
    scaleDelta = minResolution / resolution;
    newResolution = minResolution;
  }

  if (scaleDelta != 1.0) {
    this.lastScaleDelta_ = scaleDelta;
  }

  // scale anchor point.
  var viewportPosition = map.getViewport().getBoundingClientRect();
  var centroid = (0, _Pointer.centroid)(this.targetPointers);
  centroid[0] -= viewportPosition.left;
  centroid[1] -= viewportPosition.top;
  this.anchor_ = map.getCoordinateFromPixel(centroid);

  // scale, bypass the resolution constraint
  map.render();
  (0, _Interaction.zoomWithoutConstraints)(view, newResolution, this.anchor_);
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/PinchZoom}
 */
function handleUpEvent(mapBrowserEvent) {
  if (this.targetPointers.length < 2) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    view.setHint(_ViewHint2.default.INTERACTING, -1);
    var resolution = view.getResolution();
    if (this.constrainResolution_ || resolution < view.getMinResolution() || resolution > view.getMaxResolution()) {
      // Zoom to final resolution, with an animation, and provide a
      // direction not to zoom out/in if user was pinching in/out.
      // Direction is > 0 if pinching out, and < 0 if pinching in.
      var direction = this.lastScaleDelta_ - 1;
      (0, _Interaction.zoom)(view, resolution, this.anchor_, this.duration_, direction);
    }
    return false;
  } else {
    return true;
  }
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/PinchZoom}
 */
function handleDownEvent(mapBrowserEvent) {
  if (this.targetPointers.length >= 2) {
    var map = mapBrowserEvent.map;
    this.anchor_ = null;
    this.lastDistance_ = undefined;
    this.lastScaleDelta_ = 1;
    if (!this.handlingDownUpSequence) {
      map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
    }
    return true;
  } else {
    return false;
  }
}

exports.default = PinchZoom;