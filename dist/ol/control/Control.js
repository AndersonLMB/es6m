'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _functions = require('../functions.js');

var _MapEventType = require('../MapEventType.js');

var _MapEventType2 = _interopRequireDefault(_MapEventType);

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _dom = require('../dom.js');

var _events = require('../events.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/Control
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {HTMLElement} [element] The element is the control's
 * container element. This only needs to be specified if you're developing
 * a custom control.
 * @property {function(module:ol/MapEvent)} [render] Function called when
 * the control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 * @property {HTMLElement|string} [target] Specify a target if you want
 * the control to be rendered outside of the map's viewport.
 */

/**
 * @classdesc
 * A control is a visible widget with a DOM element in a fixed position on the
 * screen. They can involve user input (buttons), or be informational only;
 * the position is determined using CSS. By default these are placed in the
 * container with CSS class name `ol-overlaycontainer-stopevent`, but can use
 * any outside DOM element.
 *
 * This is the base class for controls. You can use it for simple custom
 * controls by creating the element with listeners, creating an instance:
 * ```js
 * var myControl = new Control({element: myElement});
 * ```
 * and then adding this to the map.
 *
 * The main advantage of having this as a control rather than a simple separate
 * DOM element is that preventing propagation is handled for you. Controls
 * will also be objects in a {@link module:ol/Collection~Collection}, so you can use their methods.
 *
 * You can also extend this base for your own control class. See
 * examples/custom-controls for an example of how to do this.
 *
 * @api
 */
var Control = function (_BaseObject) {
  _inherits(Control, _BaseObject);

  /**
   * @param {module:ol/control/Control~Options} options Control options.
   */
  function Control(options) {
    _classCallCheck(this, Control);

    /**
     * @protected
     * @type {HTMLElement}
     */
    var _this = _possibleConstructorReturn(this, (Control.__proto__ || Object.getPrototypeOf(Control)).call(this));

    _this.element = options.element ? options.element : null;

    /**
     * @private
     * @type {HTMLElement}
     */
    _this.target_ = null;

    /**
     * @private
     * @type {module:ol/PluggableMap}
     */
    _this.map_ = null;

    /**
     * @protected
     * @type {!Array<module:ol/events~EventsKey>}
     */
    _this.listenerKeys = [];

    /**
     * @type {function(module:ol/MapEvent)}
     */
    _this.render = options.render ? options.render : _functions.VOID;

    if (options.target) {
      _this.setTarget(options.target);
    }

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(Control, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      (0, _dom.removeNode)(this.element);
      _get(Control.prototype.__proto__ || Object.getPrototypeOf(Control.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * Get the map associated with this control.
     * @return {module:ol/PluggableMap} Map.
     * @api
     */

  }, {
    key: 'getMap',
    value: function getMap() {
      return this.map_;
    }

    /**
     * Remove the control from its current map and attach it to the new map.
     * Subclasses may set up event handlers to get notified about changes to
     * the map here.
     * @param {module:ol/PluggableMap} map Map.
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      if (this.map_) {
        (0, _dom.removeNode)(this.element);
      }
      for (var i = 0, ii = this.listenerKeys.length; i < ii; ++i) {
        (0, _events.unlistenByKey)(this.listenerKeys[i]);
      }
      this.listenerKeys.length = 0;
      this.map_ = map;
      if (this.map_) {
        var target = this.target_ ? this.target_ : map.getOverlayContainerStopEvent();
        target.appendChild(this.element);
        if (this.render !== _functions.VOID) {
          this.listenerKeys.push((0, _events.listen)(map, _MapEventType2.default.POSTRENDER, this.render, this));
        }
        map.render();
      }
    }

    /**
     * This function is used to set a target element for the control. It has no
     * effect if it is called after the control has been added to the map (i.e.
     * after `setMap` is called on the control). If no `target` is set in the
     * options passed to the control constructor and if `setTarget` is not called
     * then the control is added to the map's overlay container.
     * @param {HTMLElement|string} target Target.
     * @api
     */

  }, {
    key: 'setTarget',
    value: function setTarget(target) {
      this.target_ = typeof target === 'string' ? document.getElementById(target) : target;
    }
  }]);

  return Control;
}(_Object2.default);

exports.default = Control;