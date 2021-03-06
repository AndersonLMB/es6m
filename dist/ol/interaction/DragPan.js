'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _coordinate = require('../coordinate.js');

var _easing = require('../easing.js');

var _condition = require('../events/condition.js');

var _functions = require('../functions.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragPan
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~noModifierKeys}.
 * @property {module:ol/Kinetic} [kinetic] Kinetic inertia to apply to the pan.
 */

/**
 * @classdesc
 * Allows the user to pan the map by dragging the map.
 * @api
 */
var DragPan = function (_PointerInteraction) {
  _inherits(DragPan, _PointerInteraction);

  /**
   * @param {module:ol/interaction/DragPan~Options=} opt_options Options.
   */
  function DragPan(opt_options) {
    _classCallCheck(this, DragPan);

    var _this = _possibleConstructorReturn(this, (DragPan.__proto__ || Object.getPrototypeOf(DragPan)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {module:ol/Kinetic|undefined}
     */
    _this.kinetic_ = options.kinetic;

    /**
     * @type {module:ol/pixel~Pixel}
     */
    _this.lastCentroid = null;

    /**
     * @type {number}
     */
    _this.lastPointersCount_;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this.condition_ = options.condition ? options.condition : _condition.noModifierKeys;

    /**
     * @private
     * @type {boolean}
     */
    _this.noKinetic_ = false;

    return _this;
  }

  return DragPan;
}(_Pointer2.default);

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/DragPan}
 */


function handleDragEvent(mapBrowserEvent) {
  var targetPointers = this.targetPointers;
  var centroid = (0, _Pointer.centroid)(targetPointers);
  if (targetPointers.length == this.lastPointersCount_) {
    if (this.kinetic_) {
      this.kinetic_.update(centroid[0], centroid[1]);
    }
    if (this.lastCentroid) {
      var deltaX = this.lastCentroid[0] - centroid[0];
      var deltaY = centroid[1] - this.lastCentroid[1];
      var map = mapBrowserEvent.map;
      var view = map.getView();
      var center = [deltaX, deltaY];
      (0, _coordinate.scale)(center, view.getResolution());
      (0, _coordinate.rotate)(center, view.getRotation());
      (0, _coordinate.add)(center, view.getCenter());
      center = view.constrainCenter(center);
      view.setCenter(center);
    }
  } else if (this.kinetic_) {
    // reset so we don't overestimate the kinetic energy after
    // after one finger down, tiny drag, second finger down
    this.kinetic_.begin();
  }
  this.lastCentroid = centroid;
  this.lastPointersCount_ = targetPointers.length;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/DragPan}
 */
function handleUpEvent(mapBrowserEvent) {
  var map = mapBrowserEvent.map;
  var view = map.getView();
  if (this.targetPointers.length === 0) {
    if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
      var distance = this.kinetic_.getDistance();
      var angle = this.kinetic_.getAngle();
      var center = /** @type {!module:ol/coordinate~Coordinate} */view.getCenter();
      var centerpx = map.getPixelFromCoordinate(center);
      var dest = map.getCoordinateFromPixel([centerpx[0] - distance * Math.cos(angle), centerpx[1] - distance * Math.sin(angle)]);
      view.animate({
        center: view.constrainCenter(dest),
        duration: 500,
        easing: _easing.easeOut
      });
    }
    view.setHint(_ViewHint2.default.INTERACTING, -1);
    return false;
  } else {
    if (this.kinetic_) {
      // reset so we don't overestimate the kinetic energy after
      // after one finger up, tiny drag, second finger up
      this.kinetic_.begin();
    }
    this.lastCentroid = null;
    return true;
  }
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/DragPan}
 */
function handleDownEvent(mapBrowserEvent) {
  if (this.targetPointers.length > 0 && this.condition_(mapBrowserEvent)) {
    var map = mapBrowserEvent.map;
    var view = map.getView();
    this.lastCentroid = null;
    if (!this.handlingDownUpSequence) {
      view.setHint(_ViewHint2.default.INTERACTING, 1);
    }
    // stop any current animation
    if (view.getAnimating()) {
      view.setCenter(mapBrowserEvent.frameState.viewState.center);
    }
    if (this.kinetic_) {
      this.kinetic_.begin();
    }
    // No kinetic as soon as more than one pointer on the screen is
    // detected. This is to prevent nasty pans after pinch.
    this.noKinetic_ = this.targetPointers.length > 1;
    return true;
  } else {
    return false;
  }
}

exports.default = DragPan;