'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DoubleClickZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {number} [delta=1] The zoom delta applied on each double click.
 */

/**
 * @classdesc
 * Allows the user to zoom by double-clicking on the map.
 * @api
 */
var DoubleClickZoom = function (_Interaction) {
  _inherits(DoubleClickZoom, _Interaction);

  /**
   * @param {module:ol/interaction/DoubleClickZoom~Options=} opt_options Options.
   */
  function DoubleClickZoom(opt_options) {
    _classCallCheck(this, DoubleClickZoom);

    var _this = _possibleConstructorReturn(this, (DoubleClickZoom.__proto__ || Object.getPrototypeOf(DoubleClickZoom)).call(this, {
      handleEvent: handleEvent
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {number}
     */
    _this.delta_ = options.delta ? options.delta : 1;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    return _this;
  }

  return DoubleClickZoom;
}(_Interaction3.default);

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} (if it was a
 * doubleclick) and eventually zooms the map.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/DoubleClickZoom}
 */


function handleEvent(mapBrowserEvent) {
  var stopEvent = false;
  var browserEvent = mapBrowserEvent.originalEvent;
  if (mapBrowserEvent.type == _MapBrowserEventType2.default.DBLCLICK) {
    var map = mapBrowserEvent.map;
    var anchor = mapBrowserEvent.coordinate;
    var delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;
    var view = map.getView();
    (0, _Interaction2.zoomByDelta)(view, delta, anchor, this.duration_);
    mapBrowserEvent.preventDefault();
    stopEvent = true;
  }
  return !stopEvent;
}

exports.default = DoubleClickZoom;