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

var _rotationconstraint = require('../rotationconstraint.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/PinchRotate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [duration=250] The duration of the animation in
 * milliseconds.
 * @property {number} [threshold=0.3] Minimal angle in radians to start a rotation.
 */

/**
 * @classdesc
 * Allows the user to rotate the map by twisting with two fingers
 * on a touch screen.
 * @api
 */
var PinchRotate = function (_PointerInteraction) {
  _inherits(PinchRotate, _PointerInteraction);

  /**
   * @param {module:ol/interaction/PinchRotate~Options=} opt_options Options.
   */
  function PinchRotate(opt_options) {
    _classCallCheck(this, PinchRotate);

    var _this = _possibleConstructorReturn(this, (PinchRotate.__proto__ || Object.getPrototypeOf(PinchRotate)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    var options = opt_options || {};

    /**
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    _this.anchor_ = null;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.lastAngle_ = undefined;

    /**
     * @private
     * @type {boolean}
     */
    _this.rotating_ = false;

    /**
     * @private
     * @type {number}
     */
    _this.rotationDelta_ = 0.0;

    /**
     * @private
     * @type {number}
     */
    _this.threshold_ = options.threshold !== undefined ? options.threshold : 0.3;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    return _this;
  }

  return PinchRotate;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/PinchRotate}
 */


function handleDragEvent(mapBrowserEvent) {
  var rotationDelta = 0.0;

  var touch0 = this.targetPointers[0];
  var touch1 = this.targetPointers[1];

  // angle between touches
  var angle = Math.atan2(touch1.clientY - touch0.clientY, touch1.clientX - touch0.clientX);

  if (this.lastAngle_ !== undefined) {
    var delta = angle - this.lastAngle_;
    this.rotationDelta_ += delta;
    if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
      this.rotating_ = true;
    }
    rotationDelta = delta;
  }
  this.lastAngle_ = angle;

  var map = mapBrowserEvent.map;
  var view = map.getView();
  if (view.getConstraints().rotation === _rotationconstraint.disable) {
    return;
  }

  // rotate anchor point.
  // FIXME: should be the intersection point between the lines:
  //     touch0,touch1 and previousTouch0,previousTouch1
  var viewportPosition = map.getViewport().getBoundingClientRect();
  var centroid = (0, _Pointer.centroid)(this.targetPointers);
  centroid[0] -= viewportPosition.left;
  centroid[1] -= viewportPosition.top;
  this.anchor_ = map.getCoordinateFromPixel(centroid);

  // rotate
  if (this.rotating_) {
    var rotation = view.getRotation();
    map.render();
    (0, _Interaction.rotateWithoutConstraints)(view, rotation + rotationDelta, this.anchor_);
  }
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/PinchRotate}
 */
function handleUpEvent(mapBrowserEvent) {
  if (this.targetPointers.length < 2) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    view.setHint(_ViewHint2.default.INTERACTING, -1);
    if (this.rotating_) {
      var rotation = view.getRotation();
      (0, _Interaction.rotate)(view, rotation, this.anchor_, this.duration_);
    }
    return false;
  } else {
    return true;
  }
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/PinchRotate}
 */
function handleDownEvent(mapBrowserEvent) {
  if (this.targetPointers.length >= 2) {
    var map = mapBrowserEvent.map;
    this.anchor_ = null;
    this.lastAngle_ = undefined;
    this.rotating_ = false;
    this.rotationDelta_ = 0.0;
    if (!this.handlingDownUpSequence) {
      map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
    }
    return true;
  } else {
    return false;
  }
}

exports.default = PinchRotate;