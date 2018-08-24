'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _easing = require('../easing.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/Zoom
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number} [duration=250] Animation duration in milliseconds.
 * @property {string} [className='ol-zoom'] CSS class name.
 * @property {string|HTMLElement} [zoomInLabel='+'] Text label to use for the zoom-in
 * button. Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string|HTMLElement} [zoomOutLabel='-'] Text label to use for the zoom-out button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [zoomInTipLabel='Zoom in'] Text label to use for the button tip.
 * @property {string} [zoomOutTipLabel='Zoom out'] Text label to use for the button tip.
 * @property {number} [delta=1] The zoom delta applied on each click.
 * @property {HTMLElement|string} [target] Specify a target if you want the control to be
 * rendered outside of the map's viewport.
 */

/**
 * @classdesc
 * A control with 2 buttons, one for zoom in and one for zoom out.
 * This control is one of the default controls of a map. To style this control
 * use css selectors `.ol-zoom-in` and `.ol-zoom-out`.
 *
 * @api
 */
var Zoom = function (_Control) {
  _inherits(Zoom, _Control);

  /**
   * @param {module:ol/control/Zoom~Options=} opt_options Zoom options.
   */
  function Zoom(opt_options) {
    _classCallCheck(this, Zoom);

    var options = opt_options ? opt_options : {};

    var _this = _possibleConstructorReturn(this, (Zoom.__proto__ || Object.getPrototypeOf(Zoom)).call(this, {
      element: document.createElement('div'),
      target: options.target
    }));

    var className = options.className !== undefined ? options.className : 'ol-zoom';

    var delta = options.delta !== undefined ? options.delta : 1;

    var zoomInLabel = options.zoomInLabel !== undefined ? options.zoomInLabel : '+';
    var zoomOutLabel = options.zoomOutLabel !== undefined ? options.zoomOutLabel : '\u2212';

    var zoomInTipLabel = options.zoomInTipLabel !== undefined ? options.zoomInTipLabel : 'Zoom in';
    var zoomOutTipLabel = options.zoomOutTipLabel !== undefined ? options.zoomOutTipLabel : 'Zoom out';

    var inElement = document.createElement('button');
    inElement.className = className + '-in';
    inElement.setAttribute('type', 'button');
    inElement.title = zoomInTipLabel;
    inElement.appendChild(typeof zoomInLabel === 'string' ? document.createTextNode(zoomInLabel) : zoomInLabel);

    (0, _events.listen)(inElement, _EventType2.default.CLICK, _this.handleClick_.bind(_this, delta));

    var outElement = document.createElement('button');
    outElement.className = className + '-out';
    outElement.setAttribute('type', 'button');
    outElement.title = zoomOutTipLabel;
    outElement.appendChild(typeof zoomOutLabel === 'string' ? document.createTextNode(zoomOutLabel) : zoomOutLabel);

    (0, _events.listen)(outElement, _EventType2.default.CLICK, _this.handleClick_.bind(_this, -delta));

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL;
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(inElement);
    element.appendChild(outElement);

    /**
     * @type {number}
     * @private
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 250;

    return _this;
  }

  /**
   * @param {number} delta Zoom delta.
   * @param {MouseEvent} event The event to handle
   * @private
   */


  _createClass(Zoom, [{
    key: 'handleClick_',
    value: function handleClick_(delta, event) {
      event.preventDefault();
      this.zoomByDelta_(delta);
    }

    /**
     * @param {number} delta Zoom delta.
     * @private
     */

  }, {
    key: 'zoomByDelta_',
    value: function zoomByDelta_(delta) {
      var map = this.getMap();
      var view = map.getView();
      if (!view) {
        // the map does not have a view, so we can't act
        // upon it
        return;
      }
      var currentResolution = view.getResolution();
      if (currentResolution) {
        var newResolution = view.constrainResolution(currentResolution, delta);
        if (this.duration_ > 0) {
          if (view.getAnimating()) {
            view.cancelAnimations();
          }
          view.animate({
            resolution: newResolution,
            duration: this.duration_,
            easing: _easing.easeOut
          });
        } else {
          view.setResolution(newResolution);
        }
      }
    }
  }]);

  return Zoom;
}(_Control3.default);

exports.default = Zoom;