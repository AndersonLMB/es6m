'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MapBrowserEvent2 = require('./MapBrowserEvent.js');

var _MapBrowserEvent3 = _interopRequireDefault(_MapBrowserEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/MapBrowserPointerEvent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MapBrowserPointerEvent = function (_MapBrowserEvent) {
  _inherits(MapBrowserPointerEvent, _MapBrowserEvent);

  /**
   * @param {string} type Event type.
   * @param {module:ol/PluggableMap} map Map.
   * @param {module:ol/pointer/PointerEvent} pointerEvent Pointer event.
   * @param {boolean=} opt_dragging Is the map currently being dragged?
   * @param {?module:ol/PluggableMap~FrameState=} opt_frameState Frame state.
   */
  function MapBrowserPointerEvent(type, map, pointerEvent, opt_dragging, opt_frameState) {
    _classCallCheck(this, MapBrowserPointerEvent);

    /**
     * @const
     * @type {module:ol/pointer/PointerEvent}
     */
    var _this = _possibleConstructorReturn(this, (MapBrowserPointerEvent.__proto__ || Object.getPrototypeOf(MapBrowserPointerEvent)).call(this, type, map, pointerEvent.originalEvent, opt_dragging, opt_frameState));

    _this.pointerEvent = pointerEvent;

    return _this;
  }

  return MapBrowserPointerEvent;
}(_MapBrowserEvent3.default);

exports.default = MapBrowserPointerEvent;