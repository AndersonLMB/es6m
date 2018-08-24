'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event2 = require('./events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/MapEvent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Events emitted as map events are instances of this type.
 * See {@link module:ol/Map~Map} for which events trigger a map event.
 */
var MapEvent = function (_Event) {
  _inherits(MapEvent, _Event);

  /**
   * @param {string} type Event type.
   * @param {module:ol/PluggableMap} map Map.
   * @param {?module:ol/PluggableMap~FrameState=} opt_frameState Frame state.
   */
  function MapEvent(type, map, opt_frameState) {
    _classCallCheck(this, MapEvent);

    /**
     * The map where the event occurred.
     * @type {module:ol/PluggableMap}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (MapEvent.__proto__ || Object.getPrototypeOf(MapEvent)).call(this, type));

    _this.map = map;

    /**
     * The frame state at the time of the event.
     * @type {?module:ol/PluggableMap~FrameState}
     * @api
     */
    _this.frameState = opt_frameState !== undefined ? opt_frameState : null;

    return _this;
  }

  return MapEvent;
}(_Event3.default);

exports.default = MapEvent;