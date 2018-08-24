'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rotationconstraint = require('../rotationconstraint.js');

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _condition = require('../events/condition.js');

var _Interaction = require('../interaction/Interaction.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragRotateAndZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~shiftKeyOnly}.
 * @property {number} [duration=400] Animation duration in milliseconds.
 */

/**
 * @classdesc
 * Allows the user to zoom and rotate the map by clicking and dragging
 * on the map.  By default, this interaction is limited to when the shift
 * key is held down.
 *
 * This interaction is only supported for mouse devices.
 *
 * And this interaction is not included in the default interactions.
 * @api
 */
var DragRotateAndZoom = function (_PointerInteraction) {
  _inherits(DragRotateAndZoom, _PointerInteraction);

  /**
   * @param {module:ol/interaction/DragRotateAndZoom~Options=} opt_options Options.
   */
  function DragRotateAndZoom(opt_options) {
    _classCallCheck(this, DragRotateAndZoom);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    var _this = _possibleConstructorReturn(this, (DragRotateAndZoom.__proto__ || Object.getPrototypeOf(DragRotateAndZoom)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent
    }));

    _this.condition_ = options.condition ? options.condition : _condition.shiftKeyOnly;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.lastAngle_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.lastMagnitude_ = undefined;

    /**
     * @private
     * @type {number}
     */
    _this.lastScaleDelta_ = 0;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 400;

    return _this;
  }

  return DragRotateAndZoom;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/DragRotateAndZoom}
 */


function handleDragEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return;
  }

  var map = mapBrowserEvent.map;
  var size = map.getSize();
  var offset = mapBrowserEvent.pixel;
  var deltaX = offset[0] - size[0] / 2;
  var deltaY = size[1] / 2 - offset[1];
  var theta = Math.atan2(deltaY, deltaX);
  var magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  var view = map.getView();
  if (view.getConstraints().rotation !== _rotationconstraint.disable && this.lastAngle_ !== undefined) {
    var angleDelta = theta - this.lastAngle_;
    (0, _Interaction.rotateWithoutConstraints)(view, view.getRotation() - angleDelta);
  }
  this.lastAngle_ = theta;
  if (this.lastMagnitude_ !== undefined) {
    var resolution = this.lastMagnitude_ * (view.getResolution() / magnitude);
    (0, _Interaction.zoomWithoutConstraints)(view, resolution);
  }
  if (this.lastMagnitude_ !== undefined) {
    this.lastScaleDelta_ = this.lastMagnitude_ / magnitude;
  }
  this.lastMagnitude_ = magnitude;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/DragRotateAndZoom}
 */
function handleUpEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return true;
  }

  var map = mapBrowserEvent.map;
  var view = map.getView();
  view.setHint(_ViewHint2.default.INTERACTING, -1);
  var direction = this.lastScaleDelta_ - 1;
  (0, _Interaction.rotate)(view, view.getRotation());
  (0, _Interaction.zoom)(view, view.getResolution(), undefined, this.duration_, direction);
  this.lastScaleDelta_ = 0;
  return false;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/DragRotateAndZoom}
 */
function handleDownEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return false;
  }

  if (this.condition_(mapBrowserEvent)) {
    mapBrowserEvent.map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
    this.lastAngle_ = undefined;
    this.lastMagnitude_ = undefined;
    return true;
  } else {
    return false;
  }
}

exports.default = DragRotateAndZoom;