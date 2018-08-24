'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.render = render;

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _easing = require('../easing.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/Rotate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {string} [className='ol-rotate'] CSS class name.
 * @property {string|HTMLElement} [label='⇧'] Text label to use for the rotate button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [tipLabel='Reset rotation'] Text label to use for the rotate tip.
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {boolean} [autoHide=true] Hide the control when rotation is 0.
 * @property {function(module:ol/MapEvent)} [render] Function called when the control should
 * be re-rendered. This is called in a `requestAnimationFrame` callback.
 * @property {function()} [resetNorth] Function called when the control is clicked.
 * This will override the default `resetNorth`.
 * @property {HTMLElement|string} [target] Specify a target if you want the control to be
 * rendered outside of the map's viewport.
 */

/**
 * @classdesc
 * A button control to reset rotation to 0.
 * To style this control use css selector `.ol-rotate`. A `.ol-hidden` css
 * selector is added to the button when the rotation is 0.
 *
 * @api
 */
var Rotate = function (_Control) {
  _inherits(Rotate, _Control);

  /**
   * @param {module:ol/control/Rotate~Options=} opt_options Rotate options.
   */
  function Rotate(opt_options) {
    _classCallCheck(this, Rotate);

    var options = opt_options ? opt_options : {};

    var _this = _possibleConstructorReturn(this, (Rotate.__proto__ || Object.getPrototypeOf(Rotate)).call(this, {
      element: document.createElement('div'),
      render: options.render || render,
      target: options.target
    }));

    var className = options.className !== undefined ? options.className : 'ol-rotate';

    var label = options.label !== undefined ? options.label : '\u21E7';

    /**
     * @type {HTMLElement}
     * @private
     */
    _this.label_ = null;

    if (typeof label === 'string') {
      _this.label_ = document.createElement('span');
      _this.label_.className = 'ol-compass';
      _this.label_.textContent = label;
    } else {
      _this.label_ = label;
      _this.label_.classList.add('ol-compass');
    }

    var tipLabel = options.tipLabel ? options.tipLabel : 'Reset rotation';

    var button = document.createElement('button');
    button.className = className + '-reset';
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(_this.label_);

    (0, _events.listen)(button, _EventType2.default.CLICK, _this.handleClick_, _this);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL;
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(button);

    _this.callResetNorth_ = options.resetNorth ? options.resetNorth : undefined;

    /**
     * @type {number}
     * @private
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    /**
     * @type {boolean}
     * @private
     */
    _this.autoHide_ = options.autoHide !== undefined ? options.autoHide : true;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.rotation_ = undefined;

    if (_this.autoHide_) {
      _this.element.classList.add(_css.CLASS_HIDDEN);
    }

    return _this;
  }

  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */


  _createClass(Rotate, [{
    key: 'handleClick_',
    value: function handleClick_(event) {
      event.preventDefault();
      if (this.callResetNorth_ !== undefined) {
        this.callResetNorth_();
      } else {
        this.resetNorth_();
      }
    }

    /**
     * @private
     */

  }, {
    key: 'resetNorth_',
    value: function resetNorth_() {
      var map = this.getMap();
      var view = map.getView();
      if (!view) {
        // the map does not have a view, so we can't act
        // upon it
        return;
      }
      if (view.getRotation() !== undefined) {
        if (this.duration_ > 0) {
          view.animate({
            rotation: 0,
            duration: this.duration_,
            easing: _easing.easeOut
          });
        } else {
          view.setRotation(0);
        }
      }
    }
  }]);

  return Rotate;
}(_Control3.default);

/**
 * Update the rotate control element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/Rotate}
 * @api
 */


function render(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    return;
  }
  var rotation = frameState.viewState.rotation;
  if (rotation != this.rotation_) {
    var transform = 'rotate(' + rotation + 'rad)';
    if (this.autoHide_) {
      var contains = this.element.classList.contains(_css.CLASS_HIDDEN);
      if (!contains && rotation === 0) {
        this.element.classList.add(_css.CLASS_HIDDEN);
      } else if (contains && rotation !== 0) {
        this.element.classList.remove(_css.CLASS_HIDDEN);
      }
    }
    this.label_.style.msTransform = transform;
    this.label_.style.webkitTransform = transform;
    this.label_.style.transform = transform;
  }
  this.rotation_ = rotation;
}

exports.default = Rotate;