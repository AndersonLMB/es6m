'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _condition = require('../events/condition.js');

var _functions = require('../functions.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _Box = require('../render/Box.js');

var _Box2 = _interopRequireDefault(_Box);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragBox
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// FIXME draw drag box


/**
 * A function that takes a {@link module:ol/MapBrowserEvent} and two
 * {@link module:ol/pixel~Pixel}s and returns a `{boolean}`. If the condition is met,
 * true should be returned.
 * @typedef {function(this: ?, module:ol/MapBrowserEvent, module:ol/pixel~Pixel, module:ol/pixel~Pixel):boolean} EndCondition
 */

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-dragbox'] CSS class name for styling the box.
 * @property {module:ol/events/condition~Condition} [condition] A function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol/events/condition~always}.
 * @property {number} [minArea=64] The minimum area of the box in pixel, this value is used by the default
 * `boxEndCondition` function.
 * @property {module:ol/interaction/DragBox~EndCondition} [boxEndCondition] A function that takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and two
 * {@link module:ol/pixel~Pixel}s to indicate whether a `boxend` event should be fired.
 * Default is `true` if the area of the box is bigger than the `minArea` option.
 * @property {function(this:module:ol/interaction/DragBox, module:ol/MapBrowserEvent)} onBoxEnd Code to execute just
 * before `boxend` is fired.
 */

/**
 * @enum {string}
 */
var DragBoxEventType = {
  /**
   * Triggered upon drag box start.
   * @event module:ol/interaction/DragBox~DragBoxEvent#boxstart
   * @api
   */
  BOXSTART: 'boxstart',

  /**
   * Triggered on drag when box is active.
   * @event module:ol/interaction/DragBox~DragBoxEvent#boxdrag
   * @api
   */
  BOXDRAG: 'boxdrag',

  /**
   * Triggered upon drag box end.
   * @event module:ol/interaction/DragBox~DragBoxEvent#boxend
   * @api
   */
  BOXEND: 'boxend'
};

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/DragBox~DragBox} instances are instances of
 * this type.
 */

var DragBoxEvent = function (_Event) {
  _inherits(DragBoxEvent, _Event);

  /**
   * @param {string} type The event type.
   * @param {module:ol/coordinate~Coordinate} coordinate The event coordinate.
   * @param {module:ol/MapBrowserEvent} mapBrowserEvent Originating event.
   */
  function DragBoxEvent(type, coordinate, mapBrowserEvent) {
    _classCallCheck(this, DragBoxEvent);

    /**
     * The coordinate of the drag event.
     * @const
     * @type {module:ol/coordinate~Coordinate}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (DragBoxEvent.__proto__ || Object.getPrototypeOf(DragBoxEvent)).call(this, type));

    _this.coordinate = coordinate;

    /**
     * @const
     * @type {module:ol/MapBrowserEvent}
     * @api
     */
    _this.mapBrowserEvent = mapBrowserEvent;

    return _this;
  }

  return DragBoxEvent;
}(_Event3.default);

/**
 * @classdesc
 * Allows the user to draw a vector box by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when the shift or other key is held down. This is used, for example,
 * for zooming to a specific area of the map
 * (see {@link module:ol/interaction/DragZoom~DragZoom} and
 * {@link module:ol/interaction/DragRotateAndZoom}).
 *
 * This interaction is only supported for mouse devices.
 *
 * @fires module:ol/interaction/DragBox~DragBoxEvent
 * @api
 */


var DragBox = function (_PointerInteraction) {
  _inherits(DragBox, _PointerInteraction);

  /**
   * @param {module:ol/interaction/DragBox~Options=} opt_options Options.
   */
  function DragBox(opt_options) {
    _classCallCheck(this, DragBox);

    var _this2 = _possibleConstructorReturn(this, (DragBox.__proto__ || Object.getPrototypeOf(DragBox)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleUpEvent: handleUpEvent
    }));

    var options = opt_options ? opt_options : {};

    /**
    * @type {module:ol/render/Box}
    * @private
    */
    _this2.box_ = new _Box2.default(options.className || 'ol-dragbox');

    /**
    * @type {number}
    * @private
    */
    _this2.minArea_ = options.minArea !== undefined ? options.minArea : 64;

    /**
     * Function to execute just before `onboxend` is fired
     * @type {function(this:module:ol/interaction/DragBox, module:ol/MapBrowserEvent)}
     * @private
     */
    _this2.onBoxEnd_ = options.onBoxEnd ? options.onBoxEnd : _functions.VOID;

    /**
    * @type {module:ol/pixel~Pixel}
    * @private
    */
    _this2.startPixel_ = null;

    /**
    * @private
    * @type {module:ol/events/condition~Condition}
    */
    _this2.condition_ = options.condition ? options.condition : _condition.always;

    /**
    * @private
    * @type {module:ol/interaction/DragBox~EndCondition}
    */
    _this2.boxEndCondition_ = options.boxEndCondition ? options.boxEndCondition : defaultBoxEndCondition;
    return _this2;
  }

  /**
  * Returns geometry of last drawn box.
  * @return {module:ol/geom/Polygon} Geometry.
  * @api
  */


  _createClass(DragBox, [{
    key: 'getGeometry',
    value: function getGeometry() {
      return this.box_.getGeometry();
    }
  }]);

  return DragBox;
}(_Pointer2.default);

/**
 * The default condition for determining whether the boxend event
 * should fire.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent The originating MapBrowserEvent
 *     leading to the box end.
 * @param {module:ol/pixel~Pixel} startPixel The starting pixel of the box.
 * @param {module:ol/pixel~Pixel} endPixel The end pixel of the box.
 * @return {boolean} Whether or not the boxend condition should be fired.
 * @this {module:ol/interaction/DragBox}
 */


function defaultBoxEndCondition(mapBrowserEvent, startPixel, endPixel) {
  var width = endPixel[0] - startPixel[0];
  var height = endPixel[1] - startPixel[1];
  return width * width + height * height >= this.minArea_;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @this {module:ol/interaction/DragBox}
 */
function handleDragEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return;
  }

  this.box_.setPixels(this.startPixel_, mapBrowserEvent.pixel);

  this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXDRAG, mapBrowserEvent.coordinate, mapBrowserEvent));
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/DragBox}
 */
function handleUpEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return true;
  }

  this.box_.setMap(null);

  if (this.boxEndCondition_(mapBrowserEvent, this.startPixel_, mapBrowserEvent.pixel)) {
    this.onBoxEnd_(mapBrowserEvent);
    this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXEND, mapBrowserEvent.coordinate, mapBrowserEvent));
  }
  return false;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} mapBrowserEvent Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/DragBox}
 */
function handleDownEvent(mapBrowserEvent) {
  if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
    return false;
  }

  if ((0, _condition.mouseActionButton)(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
    this.startPixel_ = mapBrowserEvent.pixel;
    this.box_.setMap(mapBrowserEvent.map);
    this.box_.setPixels(this.startPixel_, this.startPixel_);
    this.dispatchEvent(new DragBoxEvent(DragBoxEventType.BOXSTART, mapBrowserEvent.coordinate, mapBrowserEvent));
    return true;
  } else {
    return false;
  }
}

exports.default = DragBox;