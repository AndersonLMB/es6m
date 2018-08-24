'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _dom = require('../dom.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/FullScreen
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @return {string} Change type.
 */
var getChangeType = function () {
  var changeType = void 0;
  return function () {
    if (!changeType) {
      var body = document.body;
      if (body.webkitRequestFullscreen) {
        changeType = 'webkitfullscreenchange';
      } else if (body.mozRequestFullScreen) {
        changeType = 'mozfullscreenchange';
      } else if (body.msRequestFullscreen) {
        changeType = 'MSFullscreenChange';
      } else if (body.requestFullscreen) {
        changeType = 'fullscreenchange';
      }
    }
    return changeType;
  };
}();

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-full-screen'] CSS class name.
 * @property {string|HTMLElement} [label='\u2922'] Text label to use for the button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string|HTMLElement} [labelActive='\u00d7'] Text label to use for the
 * button when full-screen is active.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [tipLabel='Toggle full-screen'] Text label to use for the button tip.
 * @property {boolean} [keys=false] Full keyboard access.
 * @property {HTMLElement|string} [target] Specify a target if you want the
 * control to be rendered outside of the map's viewport.
 * @property {HTMLElement|string} [source] The element to be displayed
 * fullscreen. When not provided, the element containing the map viewport will
 * be displayed fullscreen.
 */

/**
 * @classdesc
 * Provides a button that when clicked fills up the full screen with the map.
 * The full screen source element is by default the element containing the map viewport unless
 * overridden by providing the `source` option. In which case, the dom
 * element introduced using this parameter will be displayed in full screen.
 *
 * When in full screen mode, a close button is shown to exit full screen mode.
 * The [Fullscreen API](http://www.w3.org/TR/fullscreen/) is used to
 * toggle the map in full screen mode.
 *
 * @api
 */

var FullScreen = function (_Control) {
  _inherits(FullScreen, _Control);

  /**
   * @param {module:ol/control/FullScreen~Options=} opt_options Options.
   */
  function FullScreen(opt_options) {
    _classCallCheck(this, FullScreen);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {string}
     */
    var _this = _possibleConstructorReturn(this, (FullScreen.__proto__ || Object.getPrototypeOf(FullScreen)).call(this, {
      element: document.createElement('div'),
      target: options.target
    }));

    _this.cssClassName_ = options.className !== undefined ? options.className : 'ol-full-screen';

    var label = options.label !== undefined ? options.label : '\u2922';

    /**
     * @private
     * @type {HTMLElement}
     */
    _this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;

    var labelActive = options.labelActive !== undefined ? options.labelActive : '\xD7';

    /**
     * @private
     * @type {HTMLElement}
     */
    _this.labelActiveNode_ = typeof labelActive === 'string' ? document.createTextNode(labelActive) : labelActive;

    var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle full-screen';
    var button = document.createElement('button');
    button.className = _this.cssClassName_ + '-' + isFullScreen();
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(_this.labelNode_);

    (0, _events.listen)(button, _EventType2.default.CLICK, _this.handleClick_, _this);

    var cssClasses = _this.cssClassName_ + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL + ' ' + (!isFullScreenSupported() ? _css.CLASS_UNSUPPORTED : '');
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(button);

    /**
     * @private
     * @type {boolean}
     */
    _this.keys_ = options.keys !== undefined ? options.keys : false;

    /**
     * @private
     * @type {HTMLElement|string|undefined}
     */
    _this.source_ = options.source;

    return _this;
  }

  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */


  _createClass(FullScreen, [{
    key: 'handleClick_',
    value: function handleClick_(event) {
      event.preventDefault();
      this.handleFullScreen_();
    }

    /**
     * @private
     */

  }, {
    key: 'handleFullScreen_',
    value: function handleFullScreen_() {
      if (!isFullScreenSupported()) {
        return;
      }
      var map = this.getMap();
      if (!map) {
        return;
      }
      if (isFullScreen()) {
        exitFullScreen();
      } else {
        var element = void 0;
        if (this.source_) {
          element = typeof this.source_ === 'string' ? document.getElementById(this.source_) : this.source_;
        } else {
          element = map.getTargetElement();
        }
        if (this.keys_) {
          requestFullScreenWithKeys(element);
        } else {
          requestFullScreen(element);
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'handleFullScreenChange_',
    value: function handleFullScreenChange_() {
      var button = this.element.firstElementChild;
      var map = this.getMap();
      if (isFullScreen()) {
        button.className = this.cssClassName_ + '-true';
        (0, _dom.replaceNode)(this.labelActiveNode_, this.labelNode_);
      } else {
        button.className = this.cssClassName_ + '-false';
        (0, _dom.replaceNode)(this.labelNode_, this.labelActiveNode_);
      }
      if (map) {
        map.updateSize();
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      _get(FullScreen.prototype.__proto__ || Object.getPrototypeOf(FullScreen.prototype), 'setMap', this).call(this, map);
      if (map) {
        this.listenerKeys.push((0, _events.listen)(document, getChangeType(), this.handleFullScreenChange_, this));
      }
    }
  }]);

  return FullScreen;
}(_Control3.default);

/**
 * @return {boolean} Fullscreen is supported by the current platform.
 */


function isFullScreenSupported() {
  var body = document.body;
  return !!(body.webkitRequestFullscreen || body.mozRequestFullScreen && document.mozFullScreenEnabled || body.msRequestFullscreen && document.msFullscreenEnabled || body.requestFullscreen && document.fullscreenEnabled);
}

/**
 * @return {boolean} Element is currently in fullscreen.
 */
function isFullScreen() {
  return !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

/**
 * Request to fullscreen an element.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Request to fullscreen an element with keyboard input.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreenWithKeys(element) {
  if (element.mozRequestFullScreenWithKeys) {
    element.mozRequestFullScreenWithKeys();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    requestFullScreen(element);
  }
}

/**
 * Exit fullscreen.
 */
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

exports.default = FullScreen;