'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _coordinate = require('../coordinate.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _KeyCode = require('../events/KeyCode.js');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _condition = require('../events/condition.js');

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/KeyboardPan
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. Default is
 * {@link module:ol/events/condition~noModifierKeys} and
 * {@link module:ol/events/condition~targetNotEditable}.
 * @property {number} [duration=100] Animation duration in milliseconds.
 * @property {number} [pixelDelta=128] The amount of pixels to pan on each key
 * press.
 */

/**
 * @classdesc
 * Allows the user to pan the map using keyboard arrows.
 * Note that, although this interaction is by default included in maps,
 * the keys can only be used when browser focus is on the element to which
 * the keyboard events are attached. By default, this is the map div,
 * though you can change this with the `keyboardEventTarget` in
 * {@link module:ol/Map~Map}. `document` never loses focus but, for any other
 * element, focus will have to be on, and returned to, this element if the keys
 * are to function.
 * See also {@link module:ol/interaction/KeyboardZoom~KeyboardZoom}.
 * @api
 */
var KeyboardPan = function (_Interaction) {
  _inherits(KeyboardPan, _Interaction);

  /**
   * @param {module:ol/interaction/KeyboardPan~Options=} opt_options Options.
   */
  function KeyboardPan(opt_options) {
    _classCallCheck(this, KeyboardPan);

    var _this = _possibleConstructorReturn(this, (KeyboardPan.__proto__ || Object.getPrototypeOf(KeyboardPan)).call(this, {
      handleEvent: handleEvent
    }));

    var options = opt_options || {};

    /**
     * @private
     * @param {module:ol/MapBrowserEvent} mapBrowserEvent Browser event.
     * @return {boolean} Combined condition result.
     */
    _this.defaultCondition_ = function (mapBrowserEvent) {
      return (0, _condition.noModifierKeys)(mapBrowserEvent) && (0, _condition.targetNotEditable)(mapBrowserEvent);
    };

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this.condition_ = options.condition !== undefined ? options.condition : _this.defaultCondition_;

    /**
     * @private
     * @type {number}
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 100;

    /**
     * @private
     * @type {number}
     */
    _this.pixelDelta_ = options.pixelDelta !== undefined ? options.pixelDelta : 128;

    return _this;
  }

  return KeyboardPan;
}(_Interaction3.default);

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} if it was a
 * `KeyEvent`, and decides the direction to pan to (if an arrow key was
 * pressed).
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/KeyboardPan}
 */


function handleEvent(mapBrowserEvent) {
  var stopEvent = false;
  if (mapBrowserEvent.type == _EventType2.default.KEYDOWN) {
    var keyEvent = mapBrowserEvent.originalEvent;
    var keyCode = keyEvent.keyCode;
    if (this.condition_(mapBrowserEvent) && (keyCode == _KeyCode2.default.DOWN || keyCode == _KeyCode2.default.LEFT || keyCode == _KeyCode2.default.RIGHT || keyCode == _KeyCode2.default.UP)) {
      var map = mapBrowserEvent.map;
      var view = map.getView();
      var mapUnitsDelta = view.getResolution() * this.pixelDelta_;
      var deltaX = 0,
          deltaY = 0;
      if (keyCode == _KeyCode2.default.DOWN) {
        deltaY = -mapUnitsDelta;
      } else if (keyCode == _KeyCode2.default.LEFT) {
        deltaX = -mapUnitsDelta;
      } else if (keyCode == _KeyCode2.default.RIGHT) {
        deltaX = mapUnitsDelta;
      } else {
        deltaY = mapUnitsDelta;
      }
      var delta = [deltaX, deltaY];
      (0, _coordinate.rotate)(delta, view.getRotation());
      (0, _Interaction2.pan)(view, delta, this.duration_);
      mapBrowserEvent.preventDefault();
      stopEvent = true;
    }
  }
  return !stopEvent;
}

exports.default = KeyboardPan;