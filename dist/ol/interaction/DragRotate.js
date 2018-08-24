'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rotationconstraint = require('../rotationconstraint.js');

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _condition = require('../events/condition.js');

var _functions = require('../functions.js');

var _Interaction = require('../interaction/Interaction.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragRotate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that takes an
 * {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~altShiftKeysOnly}.
 * @property {number} [duration=250] Animation duration in milliseconds.
 */

/**
 * @classdesc
 * Allows the user to rotate the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when the alt and shift keys are held down.
 *
 * This interaction is only supported for mouse devices.
 * @api
 */
var DragRotate = function (_PointerInteraction) {
  _inherits(DragRotate, _PointerInteraction);

  /**
   * @param {module:ol/interaction/DragRotate~Options=} opt_options Options.
   */
  function DragRotate(opt_options) {
    _classCallCheck(this, DragRotate);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    var _this = _possibleConstructorReturn(this, (DragRotate.__proto__ || Object.getPrototypeOf(DragRotate)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    _this.condition_ = options.condition ? options.condition : _condition.altShiftKeysOnly;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.lastAngle_ = undefined;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    return _this;
  }

  return DragRotate;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/DragRotate}
 */


function handleDragEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return;
  }

  var map = mapBrowserEvent.map;
  var view = map.getView();
  if (view.getConstraints().rotation === _rotationconstraint.disable) {
    return;
  }
  var size = map.getSize();
  var offset = mapBrowserEvent.pixel;
  var theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
  if (this.lastAngle_ !== undefined) {
    var delta = theta - this.lastAngle_;
    var rotation = view.getRotation();
    (0, _Interaction.rotateWithoutConstraints)(view, rotation - delta);
  }
  this.lastAngle_ = theta;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/DragRotate}
 */
function handleUpEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return true;
  }

  var map = mapBrowserEvent.map;
  var view = map.getView();
  view.setHint(_ViewHint2.default.INTERACTING, -1);
  var rotation = view.getRotation();
  (0, _Interaction.rotate)(view, rotation, undefined, this.duration_);
  return false;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/DragRotate}
 */
function handleDownEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return false;
  }

  if ((0, _condition.mouseActionButton)(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
    var map = mapBrowserEvent.map;
    map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
    this.lastAngle_ = undefined;
    return true;
  } else {
    return false;
  }
}

exports.default = DragRotate;