'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.render = render;

var _array = require('../array.js');

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _dom = require('../dom.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Layer = require('../layer/Layer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/Attribution
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {string} [className='ol-attribution'] CSS class name.
 * @property {HTMLElement|string} [target] Specify a target if you
 * want the control to be rendered outside of the map's
 * viewport.
 * @property {boolean} [collapsible=true] Specify if attributions can
 * be collapsed. If you use an OSM source, should be set to `false` — see
 * {@link https://www.openstreetmap.org/copyright OSM Copyright} —
 * @property {boolean} [collapsed=true] Specify if attributions should
 * be collapsed at startup.
 * @property {string} [tipLabel='Attributions'] Text label to use for the button tip.
 * @property {string} [label='i'] Text label to use for the
 * collapsed attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string|HTMLElement} [collapseLabel='»'] Text label to use
 * for the expanded attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {function(module:ol/MapEvent)} [render] Function called when
 * the control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 */

/**
 * @classdesc
 * Control to show all the attributions associated with the layer sources
 * in the map. This control is one of the default controls included in maps.
 * By default it will show in the bottom right portion of the map, but this can
 * be changed by using a css selector for `.ol-attribution`.
 *
 * @api
 */
var Attribution = function (_Control) {
  _inherits(Attribution, _Control);

  /**
   * @param {module:ol/control/Attribution~Options=} opt_options Attribution options.
   */
  function Attribution(opt_options) {
    _classCallCheck(this, Attribution);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {HTMLElement}
     */
    var _this = _possibleConstructorReturn(this, (Attribution.__proto__ || Object.getPrototypeOf(Attribution)).call(this, {
      element: document.createElement('div'),
      render: options.render || render,
      target: options.target
    }));

    _this.ulElement_ = document.createElement('UL');

    /**
     * @private
     * @type {boolean}
     */
    _this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * @private
     * @type {boolean}
     */
    _this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;

    if (!_this.collapsible_) {
      _this.collapsed_ = false;
    }

    var className = options.className !== undefined ? options.className : 'ol-attribution';

    var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Attributions';

    var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : '\xBB';

    if (typeof collapseLabel === 'string') {
      /**
       * @private
       * @type {HTMLElement}
       */
      _this.collapseLabel_ = document.createElement('span');
      _this.collapseLabel_.textContent = collapseLabel;
    } else {
      _this.collapseLabel_ = collapseLabel;
    }

    var label = options.label !== undefined ? options.label : 'i';

    if (typeof label === 'string') {
      /**
       * @private
       * @type {HTMLElement}
       */
      _this.label_ = document.createElement('span');
      _this.label_.textContent = label;
    } else {
      _this.label_ = label;
    }

    var activeLabel = _this.collapsible_ && !_this.collapsed_ ? _this.collapseLabel_ : _this.label_;
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(activeLabel);

    (0, _events.listen)(button, _EventType2.default.CLICK, _this.handleClick_, _this);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL + (_this.collapsed_ && _this.collapsible_ ? ' ' + _css.CLASS_COLLAPSED : '') + (_this.collapsible_ ? '' : ' ol-uncollapsible');
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(_this.ulElement_);
    element.appendChild(button);

    /**
     * A list of currently rendered resolutions.
     * @type {Array<string>}
     * @private
     */
    _this.renderedAttributions_ = [];

    /**
     * @private
     * @type {boolean}
     */
    _this.renderedVisible_ = true;

    return _this;
  }

  /**
   * Get a list of visible attributions.
   * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
   * @return {Array<string>} Attributions.
   * @private
   */


  _createClass(Attribution, [{
    key: 'getSourceAttributions_',
    value: function getSourceAttributions_(frameState) {
      /**
       * Used to determine if an attribution already exists.
       * @type {!Object<string, boolean>}
       */
      var lookup = {};

      /**
       * A list of visible attributions.
       * @type {Array<string>}
       */
      var visibleAttributions = [];

      var layerStatesArray = frameState.layerStatesArray;
      var resolution = frameState.viewState.resolution;
      for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
        var layerState = layerStatesArray[i];
        if (!(0, _Layer.visibleAtResolution)(layerState, resolution)) {
          continue;
        }

        var source = layerState.layer.getSource();
        if (!source) {
          continue;
        }

        var attributionGetter = source.getAttributions();
        if (!attributionGetter) {
          continue;
        }

        var attributions = attributionGetter(frameState);
        if (!attributions) {
          continue;
        }

        if (Array.isArray(attributions)) {
          for (var j = 0, jj = attributions.length; j < jj; ++j) {
            if (!(attributions[j] in lookup)) {
              visibleAttributions.push(attributions[j]);
              lookup[attributions[j]] = true;
            }
          }
        } else {
          if (!(attributions in lookup)) {
            visibleAttributions.push(attributions);
            lookup[attributions] = true;
          }
        }
      }
      return visibleAttributions;
    }

    /**
     * @private
     * @param {?module:ol/PluggableMap~FrameState} frameState Frame state.
     */

  }, {
    key: 'updateElement_',
    value: function updateElement_(frameState) {
      if (!frameState) {
        if (this.renderedVisible_) {
          this.element.style.display = 'none';
          this.renderedVisible_ = false;
        }
        return;
      }

      var attributions = this.getSourceAttributions_(frameState);

      var visible = attributions.length > 0;
      if (this.renderedVisible_ != visible) {
        this.element.style.display = visible ? '' : 'none';
        this.renderedVisible_ = visible;
      }

      if ((0, _array.equals)(attributions, this.renderedAttributions_)) {
        return;
      }

      (0, _dom.removeChildren)(this.ulElement_);

      // append the attributions
      for (var i = 0, ii = attributions.length; i < ii; ++i) {
        var element = document.createElement('LI');
        element.innerHTML = attributions[i];
        this.ulElement_.appendChild(element);
      }

      this.renderedAttributions_ = attributions;
    }

    /**
     * @param {MouseEvent} event The event to handle
     * @private
     */

  }, {
    key: 'handleClick_',
    value: function handleClick_(event) {
      event.preventDefault();
      this.handleToggle_();
    }

    /**
     * @private
     */

  }, {
    key: 'handleToggle_',
    value: function handleToggle_() {
      this.element.classList.toggle(_css.CLASS_COLLAPSED);
      if (this.collapsed_) {
        (0, _dom.replaceNode)(this.collapseLabel_, this.label_);
      } else {
        (0, _dom.replaceNode)(this.label_, this.collapseLabel_);
      }
      this.collapsed_ = !this.collapsed_;
    }

    /**
     * Return `true` if the attribution is collapsible, `false` otherwise.
     * @return {boolean} True if the widget is collapsible.
     * @api
     */

  }, {
    key: 'getCollapsible',
    value: function getCollapsible() {
      return this.collapsible_;
    }

    /**
     * Set whether the attribution should be collapsible.
     * @param {boolean} collapsible True if the widget is collapsible.
     * @api
     */

  }, {
    key: 'setCollapsible',
    value: function setCollapsible(collapsible) {
      if (this.collapsible_ === collapsible) {
        return;
      }
      this.collapsible_ = collapsible;
      this.element.classList.toggle('ol-uncollapsible');
      if (!collapsible && this.collapsed_) {
        this.handleToggle_();
      }
    }

    /**
     * Collapse or expand the attribution according to the passed parameter. Will
     * not do anything if the attribution isn't collapsible or if the current
     * collapsed state is already the one requested.
     * @param {boolean} collapsed True if the widget is collapsed.
     * @api
     */

  }, {
    key: 'setCollapsed',
    value: function setCollapsed(collapsed) {
      if (!this.collapsible_ || this.collapsed_ === collapsed) {
        return;
      }
      this.handleToggle_();
    }

    /**
     * Return `true` when the attribution is currently collapsed or `false`
     * otherwise.
     * @return {boolean} True if the widget is collapsed.
     * @api
     */

  }, {
    key: 'getCollapsed',
    value: function getCollapsed() {
      return this.collapsed_;
    }
  }]);

  return Attribution;
}(_Control3.default);

/**
 * Update the attribution element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/Attribution}
 * @api
 */


function render(mapEvent) {
  this.updateElement_(mapEvent.frameState);
}

exports.default = Attribution;