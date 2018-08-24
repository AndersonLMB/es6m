'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.render = render;

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _easing = require('../easing.js');

var _events = require('../events.js');

var _Event = require('../events/Event.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _math = require('../math.js');

var _EventType3 = require('../pointer/EventType.js');

var _EventType4 = _interopRequireDefault(_EventType3);

var _PointerEventHandler = require('../pointer/PointerEventHandler.js');

var _PointerEventHandler2 = _interopRequireDefault(_PointerEventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/ZoomSlider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * The enum for available directions.
 *
 * @enum {number}
 */
var Direction = {
  VERTICAL: 0,
  HORIZONTAL: 1
};

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-zoomslider'] CSS class name.
 * @property {number} [duration=200] Animation duration in milliseconds.
 * @property {function(module:ol/MapEvent)} [render] Function called when the control
 * should be re-rendered. This is called in a `requestAnimationFrame` callback.
 */

/**
 * @classdesc
 * A slider type of control for zooming.
 *
 * Example:
 *
 *     map.addControl(new ZoomSlider());
 *
 * @api
 */

var ZoomSlider = function (_Control) {
  _inherits(ZoomSlider, _Control);

  /**
   * @param {module:ol/control/ZoomSlider~Options=} opt_options Zoom slider options.
   */
  function ZoomSlider(opt_options) {
    _classCallCheck(this, ZoomSlider);

    var options = opt_options ? opt_options : {};

    /**
     * Will hold the current resolution of the view.
     *
     * @type {number|undefined}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (ZoomSlider.__proto__ || Object.getPrototypeOf(ZoomSlider)).call(this, {
      element: document.createElement('div'),
      render: options.render || render
    }));

    _this.currentResolution_ = undefined;

    /**
     * The direction of the slider. Will be determined from actual display of the
     * container and defaults to Direction.VERTICAL.
     *
     * @type {Direction}
     * @private
     */
    _this.direction_ = Direction.VERTICAL;

    /**
     * @type {boolean}
     * @private
     */
    _this.dragging_;

    /**
     * @type {number}
     * @private
     */
    _this.heightLimit_ = 0;

    /**
     * @type {number}
     * @private
     */
    _this.widthLimit_ = 0;

    /**
     * @type {number|undefined}
     * @private
     */
    _this.previousX_;

    /**
     * @type {number|undefined}
     * @private
     */
    _this.previousY_;

    /**
     * The calculated thumb size (border box plus margins).  Set when initSlider_
     * is called.
     * @type {module:ol/size~Size}
     * @private
     */
    _this.thumbSize_ = null;

    /**
     * Whether the slider is initialized.
     * @type {boolean}
     * @private
     */
    _this.sliderInitialized_ = false;

    /**
     * @type {number}
     * @private
     */
    _this.duration_ = options.duration !== undefined ? options.duration : 200;

    var className = options.className !== undefined ? options.className : 'ol-zoomslider';
    var thumbElement = document.createElement('button');
    thumbElement.setAttribute('type', 'button');
    thumbElement.className = className + '-thumb ' + _css.CLASS_UNSELECTABLE;
    var containerElement = _this.element;
    containerElement.className = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL;
    containerElement.appendChild(thumbElement);
    /**
     * @type {module:ol/pointer/PointerEventHandler}
     * @private
     */
    _this.dragger_ = new _PointerEventHandler2.default(containerElement);

    (0, _events.listen)(_this.dragger_, _EventType4.default.POINTERDOWN, _this.handleDraggerStart_, _this);
    (0, _events.listen)(_this.dragger_, _EventType4.default.POINTERMOVE, _this.handleDraggerDrag_, _this);
    (0, _events.listen)(_this.dragger_, _EventType4.default.POINTERUP, _this.handleDraggerEnd_, _this);

    (0, _events.listen)(containerElement, _EventType2.default.CLICK, _this.handleContainerClick_, _this);
    (0, _events.listen)(thumbElement, _EventType2.default.CLICK, _Event.stopPropagation);
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(ZoomSlider, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.dragger_.dispose();
      _get(ZoomSlider.prototype.__proto__ || Object.getPrototypeOf(ZoomSlider.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      _get(ZoomSlider.prototype.__proto__ || Object.getPrototypeOf(ZoomSlider.prototype), 'setMap', this).call(this, map);
      if (map) {
        map.render();
      }
    }

    /**
     * Initializes the slider element. This will determine and set this controls
     * direction_ and also constrain the dragging of the thumb to always be within
     * the bounds of the container.
     *
     * @private
     */

  }, {
    key: 'initSlider_',
    value: function initSlider_() {
      var container = this.element;
      var containerSize = {
        width: container.offsetWidth, height: container.offsetHeight
      };

      var thumb = /** @type {HTMLElement} */container.firstElementChild;
      var computedStyle = getComputedStyle(thumb);
      var thumbWidth = thumb.offsetWidth + parseFloat(computedStyle['marginRight']) + parseFloat(computedStyle['marginLeft']);
      var thumbHeight = thumb.offsetHeight + parseFloat(computedStyle['marginTop']) + parseFloat(computedStyle['marginBottom']);
      this.thumbSize_ = [thumbWidth, thumbHeight];

      if (containerSize.width > containerSize.height) {
        this.direction_ = Direction.HORIZONTAL;
        this.widthLimit_ = containerSize.width - thumbWidth;
      } else {
        this.direction_ = Direction.VERTICAL;
        this.heightLimit_ = containerSize.height - thumbHeight;
      }
      this.sliderInitialized_ = true;
    }

    /**
     * @param {MouseEvent} event The browser event to handle.
     * @private
     */

  }, {
    key: 'handleContainerClick_',
    value: function handleContainerClick_(event) {
      var view = this.getMap().getView();

      var relativePosition = this.getRelativePosition_(event.offsetX - this.thumbSize_[0] / 2, event.offsetY - this.thumbSize_[1] / 2);

      var resolution = this.getResolutionForPosition_(relativePosition);

      view.animate({
        resolution: view.constrainResolution(resolution),
        duration: this.duration_,
        easing: _easing.easeOut
      });
    }

    /**
     * Handle dragger start events.
     * @param {module:ol/pointer/PointerEvent} event The drag event.
     * @private
     */

  }, {
    key: 'handleDraggerStart_',
    value: function handleDraggerStart_(event) {
      if (!this.dragging_ && event.originalEvent.target === this.element.firstElementChild) {
        this.getMap().getView().setHint(_ViewHint2.default.INTERACTING, 1);
        this.previousX_ = event.clientX;
        this.previousY_ = event.clientY;
        this.dragging_ = true;
      }
    }

    /**
     * Handle dragger drag events.
     *
     * @param {module:ol/pointer/PointerEvent|Event} event The drag event.
     * @private
     */

  }, {
    key: 'handleDraggerDrag_',
    value: function handleDraggerDrag_(event) {
      if (this.dragging_) {
        var element = /** @type {HTMLElement} */this.element.firstElementChild;
        var deltaX = event.clientX - this.previousX_ + parseInt(element.style.left, 10);
        var deltaY = event.clientY - this.previousY_ + parseInt(element.style.top, 10);
        var relativePosition = this.getRelativePosition_(deltaX, deltaY);
        this.currentResolution_ = this.getResolutionForPosition_(relativePosition);
        this.getMap().getView().setResolution(this.currentResolution_);
        this.setThumbPosition_(this.currentResolution_);
        this.previousX_ = event.clientX;
        this.previousY_ = event.clientY;
      }
    }

    /**
     * Handle dragger end events.
     * @param {module:ol/pointer/PointerEvent|Event} event The drag event.
     * @private
     */

  }, {
    key: 'handleDraggerEnd_',
    value: function handleDraggerEnd_(event) {
      if (this.dragging_) {
        var view = this.getMap().getView();
        view.setHint(_ViewHint2.default.INTERACTING, -1);

        view.animate({
          resolution: view.constrainResolution(this.currentResolution_),
          duration: this.duration_,
          easing: _easing.easeOut
        });

        this.dragging_ = false;
        this.previousX_ = undefined;
        this.previousY_ = undefined;
      }
    }

    /**
     * Positions the thumb inside its container according to the given resolution.
     *
     * @param {number} res The res.
     * @private
     */

  }, {
    key: 'setThumbPosition_',
    value: function setThumbPosition_(res) {
      var position = this.getPositionForResolution_(res);
      var thumb = /** @type {HTMLElement} */this.element.firstElementChild;

      if (this.direction_ == Direction.HORIZONTAL) {
        thumb.style.left = this.widthLimit_ * position + 'px';
      } else {
        thumb.style.top = this.heightLimit_ * position + 'px';
      }
    }

    /**
     * Calculates the relative position of the thumb given x and y offsets.  The
     * relative position scales from 0 to 1.  The x and y offsets are assumed to be
     * in pixel units within the dragger limits.
     *
     * @param {number} x Pixel position relative to the left of the slider.
     * @param {number} y Pixel position relative to the top of the slider.
     * @return {number} The relative position of the thumb.
     * @private
     */

  }, {
    key: 'getRelativePosition_',
    value: function getRelativePosition_(x, y) {
      var amount = void 0;
      if (this.direction_ === Direction.HORIZONTAL) {
        amount = x / this.widthLimit_;
      } else {
        amount = y / this.heightLimit_;
      }
      return (0, _math.clamp)(amount, 0, 1);
    }

    /**
     * Calculates the corresponding resolution of the thumb given its relative
     * position (where 0 is the minimum and 1 is the maximum).
     *
     * @param {number} position The relative position of the thumb.
     * @return {number} The corresponding resolution.
     * @private
     */

  }, {
    key: 'getResolutionForPosition_',
    value: function getResolutionForPosition_(position) {
      var fn = this.getMap().getView().getResolutionForValueFunction();
      return fn(1 - position);
    }

    /**
     * Determines the relative position of the slider for the given resolution.  A
     * relative position of 0 corresponds to the minimum view resolution.  A
     * relative position of 1 corresponds to the maximum view resolution.
     *
     * @param {number} res The resolution.
     * @return {number} The relative position value (between 0 and 1).
     * @private
     */

  }, {
    key: 'getPositionForResolution_',
    value: function getPositionForResolution_(res) {
      var fn = this.getMap().getView().getValueForResolutionFunction();
      return 1 - fn(res);
    }
  }]);

  return ZoomSlider;
}(_Control3.default);

/**
 * Update the zoomslider element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/ZoomSlider}
 * @api
 */


function render(mapEvent) {
  if (!mapEvent.frameState) {
    return;
  }
  if (!this.sliderInitialized_) {
    this.initSlider_();
  }
  var res = mapEvent.frameState.viewState.resolution;
  if (res !== this.currentResolution_) {
    this.currentResolution_ = res;
    this.setThumbPosition_(res);
  }
}

exports.default = ZoomSlider;