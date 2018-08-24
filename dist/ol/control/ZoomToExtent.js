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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/ZoomToExtent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {string} [className='ol-zoom-extent'] Class name.
 * @property {HTMLElement|string} [target] Specify a target if you want the control
 * to be rendered outside of the map's viewport.
 * @property {string|HTMLElement} [label='E'] Text label to use for the button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [tipLabel='Fit to extent'] Text label to use for the button tip.
 * @property {module:ol/extent~Extent} [extent] The extent to zoom to. If undefined the validity
 * extent of the view projection is used.
 */

/**
 * @classdesc
 * A button control which, when pressed, changes the map view to a specific
 * extent. To style this control use the css selector `.ol-zoom-extent`.
 *
 * @api
 */
var ZoomToExtent = function (_Control) {
  _inherits(ZoomToExtent, _Control);

  /**
   * @param {module:ol/control/ZoomToExtent~Options=} opt_options Options.
   */
  function ZoomToExtent(opt_options) {
    _classCallCheck(this, ZoomToExtent);

    var options = opt_options ? opt_options : {};

    /**
     * @type {module:ol/extent~Extent}
     * @protected
     */
    var _this = _possibleConstructorReturn(this, (ZoomToExtent.__proto__ || Object.getPrototypeOf(ZoomToExtent)).call(this, {
      element: document.createElement('div'),
      target: options.target
    }));

    _this.extent = options.extent ? options.extent : null;

    var className = options.className !== undefined ? options.className : 'ol-zoom-extent';

    var label = options.label !== undefined ? options.label : 'E';
    var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Fit to extent';
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(typeof label === 'string' ? document.createTextNode(label) : label);

    (0, _events.listen)(button, _EventType2.default.CLICK, _this.handleClick_, _this);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL;
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(button);
    return _this;
  }

  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */


  _createClass(ZoomToExtent, [{
    key: 'handleClick_',
    value: function handleClick_(event) {
      event.preventDefault();
      this.handleZoomToExtent();
    }

    /**
     * @protected
     */

  }, {
    key: 'handleZoomToExtent',
    value: function handleZoomToExtent() {
      var map = this.getMap();
      var view = map.getView();
      var extent = !this.extent ? view.getProjection().getExtent() : this.extent;
      view.fit(extent);
    }
  }]);

  return ZoomToExtent;
}(_Control3.default);

exports.default = ZoomToExtent;