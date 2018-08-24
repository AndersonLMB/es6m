'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _MapEvent2 = require('./MapEvent.js');

var _MapEvent3 = _interopRequireDefault(_MapEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/MapBrowserEvent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Events emitted as map browser events are instances of this type.
 * See {@link module:ol/Map~Map} for which events trigger a map browser event.
 */
var MapBrowserEvent = function (_MapEvent) {
  _inherits(MapBrowserEvent, _MapEvent);

  /**
   * @param {string} type Event type.
   * @param {module:ol/PluggableMap} map Map.
   * @param {Event} browserEvent Browser event.
   * @param {boolean=} opt_dragging Is the map currently being dragged?
   * @param {?module:ol/PluggableMap~FrameState=} opt_frameState Frame state.
   */
  function MapBrowserEvent(type, map, browserEvent, opt_dragging, opt_frameState) {
    _classCallCheck(this, MapBrowserEvent);

    /**
     * The original browser event.
     * @const
     * @type {Event}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (MapBrowserEvent.__proto__ || Object.getPrototypeOf(MapBrowserEvent)).call(this, type, map, opt_frameState));

    _this.originalEvent = browserEvent;

    /**
     * The map pixel relative to the viewport corresponding to the original browser event.
     * @type {module:ol/pixel~Pixel}
     * @api
     */
    _this.pixel = map.getEventPixel(browserEvent);

    /**
     * The coordinate in view projection corresponding to the original browser event.
     * @type {module:ol/coordinate~Coordinate}
     * @api
     */
    _this.coordinate = map.getCoordinateFromPixel(_this.pixel);

    /**
     * Indicates if the map is currently being dragged. Only set for
     * `POINTERDRAG` and `POINTERMOVE` events. Default is `false`.
     *
     * @type {boolean}
     * @api
     */
    _this.dragging = opt_dragging !== undefined ? opt_dragging : false;

    return _this;
  }

  /**
   * Prevents the default browser action.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
   * @override
   * @api
   */


  _createClass(MapBrowserEvent, [{
    key: 'preventDefault',
    value: function preventDefault() {
      _get(MapBrowserEvent.prototype.__proto__ || Object.getPrototypeOf(MapBrowserEvent.prototype), 'preventDefault', this).call(this);
      this.originalEvent.preventDefault();
    }

    /**
     * Prevents further propagation of the current event.
     * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
     * @override
     * @api
     */

  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      _get(MapBrowserEvent.prototype.__proto__ || Object.getPrototypeOf(MapBrowserEvent.prototype), 'stopPropagation', this).call(this);
      this.originalEvent.stopPropagation();
    }
  }]);

  return MapBrowserEvent;
}(_MapEvent3.default);

exports.default = MapBrowserEvent;