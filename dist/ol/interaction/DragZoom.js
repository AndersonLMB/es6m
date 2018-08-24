'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _easing = require('../easing.js');

var _condition = require('../events/condition.js');

var _extent = require('../extent.js');

var _DragBox2 = require('../interaction/DragBox.js');

var _DragBox3 = _interopRequireDefault(_DragBox2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {string} [className='ol-dragzoom'] CSS class name for styling the
 * box.
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~shiftKeyOnly}.
 * @property {number} [duration=200] Animation duration in milliseconds.
 * @property {boolean} [out=false] Use interaction for zooming out.
 */

/**
 * @classdesc
 * Allows the user to zoom the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when a key, shift by default, is held down.
 *
 * To change the style of the box, use CSS and the `.ol-dragzoom` selector, or
 * your custom one configured with `className`.
 * @api
 */
var DragZoom = function (_DragBox) {
  _inherits(DragZoom, _DragBox);

  /**
   * @param {module:ol/interaction/DragZoom~Options=} opt_options Options.
   */
  function DragZoom(opt_options) {
    _classCallCheck(this, DragZoom);

    var options = opt_options ? opt_options : {};

    var condition = options.condition ? options.condition : _condition.shiftKeyOnly;

    /**
     * @private
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (DragZoom.__proto__ || Object.getPrototypeOf(DragZoom)).call(this, {
      condition: condition,
      className: options.className || 'ol-dragzoom',
      onBoxEnd: onBoxEnd
    }));

    _this.duration_ = options.duration !== undefined ? options.duration : 200;

    /**
     * @private
     * @type {boolean}
     */
    _this.out_ = options.out !== undefined ? options.out : false;
    return _this;
  }

  return DragZoom;
}(_DragBox3.default);

/**
 * @this {module:ol/interaction/DragZoom}
 */


function onBoxEnd() {
  var map = this.getMap();
  var view = /** @type {!module:ol/View} */map.getView();
  var size = /** @type {!module:ol/size~Size} */map.getSize();
  var extent = this.getGeometry().getExtent();

  if (this.out_) {
    var mapExtent = view.calculateExtent(size);
    var boxPixelExtent = (0, _extent.createOrUpdateFromCoordinates)([map.getPixelFromCoordinate((0, _extent.getBottomLeft)(extent)), map.getPixelFromCoordinate((0, _extent.getTopRight)(extent))]);
    var factor = view.getResolutionForExtent(boxPixelExtent, size);

    (0, _extent.scaleFromCenter)(mapExtent, 1 / factor);
    extent = mapExtent;
  }

  var resolution = view.constrainResolution(view.getResolutionForExtent(extent, size));

  var center = (0, _extent.getCenter)(extent);
  center = view.constrainCenter(center);

  view.animate({
    resolution: resolution,
    center: center,
    duration: this.duration_,
    easing: _easing.easeOut
  });
}

exports.default = DragZoom;