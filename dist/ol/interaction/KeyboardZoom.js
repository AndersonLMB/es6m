'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _condition = require('../events/condition.js');

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/KeyboardZoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [duration=100] Animation duration in milliseconds.
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition~targetNotEditable}.
 * @property {number} [delta=1] The zoom level delta on each key press.
 */

/**
 * @classdesc
 * Allows the user to zoom the map using keyboard + and -.
 * Note that, although this interaction is by default included in maps,
 * the keys can only be used when browser focus is on the element to which
 * the keyboard events are attached. By default, this is the map div,
 * though you can change this with the `keyboardEventTarget` in
 * {@link module:ol/Map~Map}. `document` never loses focus but, for any other
 * element, focus will have to be on, and returned to, this element if the keys
 * are to function.
 * See also {@link moudle:ol/interaction/KeyboardPan~KeyboardPan}.
 * @api
 */
var KeyboardZoom = function (_Interaction) {
  _inherits(KeyboardZoom, _Interaction);

  /**
   * @param {module:ol/interaction/KeyboardZoom~Options=} opt_options Options.
   */
  function KeyboardZoom(opt_options) {
    _classCallCheck(this, KeyboardZoom);

    var _this = _possibleConstructorReturn(this, (KeyboardZoom.__proto__ || Object.getPrototypeOf(KeyboardZoom)).call(this, {
      handleEvent: handleEvent
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this.condition_ = options.condition ? options.condition : _condition.targetNotEditable;

    /**
     * @private
     * @type {number}
     */
    _this.delta_ = options.delta ? options.delta : 1;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 100;

    return _this;
  }

  return KeyboardZoom;
}(_Interaction3.default);

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} if it was a
 * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
 * key pressed was '+' or '-').
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/KeyboardZoom}
 */


function handleEvent(mapBrowserEvent) {
  var stopEvent = false;
  if (mapBrowserEvent.type == _EventType2.default.KEYDOWN || mapBrowserEvent.type == _EventType2.default.KEYPRESS) {
    var keyEvent = mapBrowserEvent.originalEvent;
    var charCode = keyEvent.charCode;
    if (this.condition_(mapBrowserEvent) && (charCode == '+'.charCodeAt(0) || charCode == '-'.charCodeAt(0))) {
      var map = mapBrowserEvent.map;
      var delta = charCode == '+'.charCodeAt(0) ? this.delta_ : -this.delta_;
      var view = map.getView();
      (0, _Interaction2.zoomByDelta)(view, delta, undefined, this.duration_);
      mapBrowserEvent.preventDefault();
      stopEvent = true;
    }
  }
  return !stopEvent;
}

exports.default = KeyboardZoom;