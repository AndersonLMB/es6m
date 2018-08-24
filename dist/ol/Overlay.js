'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapEventType = require('./MapEventType.js');

var _MapEventType2 = _interopRequireDefault(_MapEventType);

var _Object = require('./Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _OverlayPositioning = require('./OverlayPositioning.js');

var _OverlayPositioning2 = _interopRequireDefault(_OverlayPositioning);

var _css = require('./css.js');

var _dom = require('./dom.js');

var _events = require('./events.js');

var _extent = require('./extent.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Overlay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {number|string} [id] Set the overlay id. The overlay id can be used
 * with the {@link module:ol/Map~Map#getOverlayById} method.
 * @property {HTMLElement} [element] The overlay element.
 * @property {Array<number>} [offset=[0, 0]] Offsets in pixels used when positioning
 * the overlay. The first element in the
 * array is the horizontal offset. A positive value shifts the overlay right.
 * The second element in the array is the vertical offset. A positive value
 * shifts the overlay down.
 * @property {module:ol/coordinate~Coordinate} [position] The overlay position
 * in map projection.
 * @property {module:ol/OverlayPositioning} [positioning='top-left'] Defines how
 * the overlay is actually positioned with respect to its `position` property.
 * Possible values are `'bottom-left'`, `'bottom-center'`, `'bottom-right'`,
 * `'center-left'`, `'center-center'`, `'center-right'`, `'top-left'`,
 * `'top-center'`, and `'top-right'`.
 * @property {boolean} [stopEvent=true] Whether event propagation to the map
 * viewport should be stopped. If `true` the overlay is placed in the same
 * container as that of the controls (CSS class name
 * `ol-overlaycontainer-stopevent`); if `false` it is placed in the container
 * with CSS class name specified by the `className` property.
 * @property {boolean} [insertFirst=true] Whether the overlay is inserted first
 * in the overlay container, or appended. If the overlay is placed in the same
 * container as that of the controls (see the `stopEvent` option) you will
 * probably set `insertFirst` to `true` so the overlay is displayed below the
 * controls.
 * @property {boolean} [autoPan=false] If set to `true` the map is panned when
 * calling `setPosition`, so that the overlay is entirely visible in the current
 * viewport.
 * @property {module:ol/Overlay~PanOptions} [autoPanAnimation] The
 * animation options used to pan the overlay into view. This animation is only
 * used when `autoPan` is enabled. A `duration` and `easing` may be provided to
 * customize the animation.
 * @property {number} [autoPanMargin=20] The margin (in pixels) between the
 * overlay and the borders of the map when autopanning.
 * @property {string} [className='ol-overlay-container ol-selectable'] CSS class
 * name.
 */

/**
 * @typedef {Object} PanOptions
 * @property {number} [duration=1000] The duration of the animation in
 * milliseconds.
 * @property {function(number):number} [easing] The easing function to use. Can
 * be one from {@link module:ol/easing} or a custom function.
 * Default is {@link module:ol/easing~inAndOut}.
 */

/**
 * @enum {string}
 * @protected
 */
var Property = {
  ELEMENT: 'element',
  MAP: 'map',
  OFFSET: 'offset',
  POSITION: 'position',
  POSITIONING: 'positioning'
};

/**
 * @classdesc
 * An element to be displayed over the map and attached to a single map
 * location.  Like {@link module:ol/control/Control~Control}, Overlays are
 * visible widgets. Unlike Controls, they are not in a fixed position on the
 * screen, but are tied to a geographical coordinate, so panning the map will
 * move an Overlay but not a Control.
 *
 * Example:
 *
 *     import Overlay from 'ol/Overlay';
 *
 *     var popup = new Overlay({
 *       element: document.getElementById('popup')
 *     });
 *     popup.setPosition(coordinate);
 *     map.addOverlay(popup);
 *
 * @api
 */

var Overlay = function (_BaseObject) {
  _inherits(Overlay, _BaseObject);

  /**
   * @param {module:ol/Overlay~Options} options Overlay options.
   */
  function Overlay(options) {
    _classCallCheck(this, Overlay);

    /**
     * @protected
     * @type {module:ol/Overlay~Options}
     */
    var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this));

    _this.options = options;

    /**
     * @protected
     * @type {number|string|undefined}
     */
    _this.id = options.id;

    /**
     * @protected
     * @type {boolean}
     */
    _this.insertFirst = options.insertFirst !== undefined ? options.insertFirst : true;

    /**
     * @protected
     * @type {boolean}
     */
    _this.stopEvent = options.stopEvent !== undefined ? options.stopEvent : true;

    /**
     * @protected
     * @type {HTMLElement}
     */
    _this.element = document.createElement('DIV');
    _this.element.className = options.className !== undefined ? options.className : 'ol-overlay-container ' + _css.CLASS_SELECTABLE;
    _this.element.style.position = 'absolute';

    /**
     * @protected
     * @type {boolean}
     */
    _this.autoPan = options.autoPan !== undefined ? options.autoPan : false;

    /**
     * @protected
     * @type {module:ol/Overlay~PanOptions}
     */
    _this.autoPanAnimation = options.autoPanAnimation || /** @type {module:ol/Overlay~PanOptions} */{};

    /**
     * @protected
     * @type {number}
     */
    _this.autoPanMargin = options.autoPanMargin !== undefined ? options.autoPanMargin : 20;

    /**
     * @protected
     * @type {{bottom_: string,
     *         left_: string,
     *         right_: string,
     *         top_: string,
     *         visible: boolean}}
     */
    _this.rendered = {
      bottom_: '',
      left_: '',
      right_: '',
      top_: '',
      visible: true
    };

    /**
     * @protected
     * @type {?module:ol/events~EventsKey}
     */
    _this.mapPostrenderListenerKey = null;

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.ELEMENT), _this.handleElementChanged, _this);

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.MAP), _this.handleMapChanged, _this);

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.OFFSET), _this.handleOffsetChanged, _this);

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.POSITION), _this.handlePositionChanged, _this);

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(Property.POSITIONING), _this.handlePositioningChanged, _this);

    if (options.element !== undefined) {
      _this.setElement(options.element);
    }

    _this.setOffset(options.offset !== undefined ? options.offset : [0, 0]);

    _this.setPositioning(options.positioning !== undefined ?
    /** @type {module:ol/OverlayPositioning} */options.positioning : _OverlayPositioning2.default.TOP_LEFT);

    if (options.position !== undefined) {
      _this.setPosition(options.position);
    }

    return _this;
  }

  /**
   * Get the DOM element of this overlay.
   * @return {HTMLElement|undefined} The Element containing the overlay.
   * @observable
   * @api
   */


  _createClass(Overlay, [{
    key: 'getElement',
    value: function getElement() {
      return (/** @type {HTMLElement|undefined} */this.get(Property.ELEMENT)
      );
    }

    /**
     * Get the overlay identifier which is set on constructor.
     * @return {number|string|undefined} Id.
     * @api
     */

  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }

    /**
     * Get the map associated with this overlay.
     * @return {module:ol/PluggableMap|undefined} The map that the
     * overlay is part of.
     * @observable
     * @api
     */

  }, {
    key: 'getMap',
    value: function getMap() {
      return (
        /** @type {module:ol/PluggableMap|undefined} */this.get(Property.MAP)
      );
    }

    /**
     * Get the offset of this overlay.
     * @return {Array<number>} The offset.
     * @observable
     * @api
     */

  }, {
    key: 'getOffset',
    value: function getOffset() {
      return (/** @type {Array<number>} */this.get(Property.OFFSET)
      );
    }

    /**
     * Get the current position of this overlay.
     * @return {module:ol/coordinate~Coordinate|undefined} The spatial point that the overlay is
     *     anchored at.
     * @observable
     * @api
     */

  }, {
    key: 'getPosition',
    value: function getPosition() {
      return (
        /** @type {module:ol/coordinate~Coordinate|undefined} */this.get(Property.POSITION)
      );
    }

    /**
     * Get the current positioning of this overlay.
     * @return {module:ol/OverlayPositioning} How the overlay is positioned
     *     relative to its point on the map.
     * @observable
     * @api
     */

  }, {
    key: 'getPositioning',
    value: function getPositioning() {
      return (
        /** @type {module:ol/OverlayPositioning} */this.get(Property.POSITIONING)
      );
    }

    /**
     * @protected
     */

  }, {
    key: 'handleElementChanged',
    value: function handleElementChanged() {
      (0, _dom.removeChildren)(this.element);
      var element = this.getElement();
      if (element) {
        this.element.appendChild(element);
      }
    }

    /**
     * @protected
     */

  }, {
    key: 'handleMapChanged',
    value: function handleMapChanged() {
      if (this.mapPostrenderListenerKey) {
        (0, _dom.removeNode)(this.element);
        (0, _events.unlistenByKey)(this.mapPostrenderListenerKey);
        this.mapPostrenderListenerKey = null;
      }
      var map = this.getMap();
      if (map) {
        this.mapPostrenderListenerKey = (0, _events.listen)(map, _MapEventType2.default.POSTRENDER, this.render, this);
        this.updatePixelPosition();
        var container = this.stopEvent ? map.getOverlayContainerStopEvent() : map.getOverlayContainer();
        if (this.insertFirst) {
          container.insertBefore(this.element, container.childNodes[0] || null);
        } else {
          container.appendChild(this.element);
        }
      }
    }

    /**
     * @protected
     */

  }, {
    key: 'render',
    value: function render() {
      this.updatePixelPosition();
    }

    /**
     * @protected
     */

  }, {
    key: 'handleOffsetChanged',
    value: function handleOffsetChanged() {
      this.updatePixelPosition();
    }

    /**
     * @protected
     */

  }, {
    key: 'handlePositionChanged',
    value: function handlePositionChanged() {
      this.updatePixelPosition();
      if (this.get(Property.POSITION) && this.autoPan) {
        this.panIntoView();
      }
    }

    /**
     * @protected
     */

  }, {
    key: 'handlePositioningChanged',
    value: function handlePositioningChanged() {
      this.updatePixelPosition();
    }

    /**
     * Set the DOM element to be associated with this overlay.
     * @param {HTMLElement|undefined} element The Element containing the overlay.
     * @observable
     * @api
     */

  }, {
    key: 'setElement',
    value: function setElement(element) {
      this.set(Property.ELEMENT, element);
    }

    /**
     * Set the map to be associated with this overlay.
     * @param {module:ol/PluggableMap|undefined} map The map that the
     * overlay is part of.
     * @observable
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      this.set(Property.MAP, map);
    }

    /**
     * Set the offset for this overlay.
     * @param {Array<number>} offset Offset.
     * @observable
     * @api
     */

  }, {
    key: 'setOffset',
    value: function setOffset(offset) {
      this.set(Property.OFFSET, offset);
    }

    /**
     * Set the position for this overlay. If the position is `undefined` the
     * overlay is hidden.
     * @param {module:ol/coordinate~Coordinate|undefined} position The spatial point that the overlay
     *     is anchored at.
     * @observable
     * @api
     */

  }, {
    key: 'setPosition',
    value: function setPosition(position) {
      this.set(Property.POSITION, position);
    }

    /**
     * Pan the map so that the overlay is entirely visible in the current viewport
     * (if necessary).
     * @protected
     */

  }, {
    key: 'panIntoView',
    value: function panIntoView() {
      var map = this.getMap();

      if (!map || !map.getTargetElement()) {
        return;
      }

      var mapRect = this.getRect(map.getTargetElement(), map.getSize());
      var element = this.getElement();
      var overlayRect = this.getRect(element, [(0, _dom.outerWidth)(element), (0, _dom.outerHeight)(element)]);

      var margin = this.autoPanMargin;
      if (!(0, _extent.containsExtent)(mapRect, overlayRect)) {
        // the overlay is not completely inside the viewport, so pan the map
        var offsetLeft = overlayRect[0] - mapRect[0];
        var offsetRight = mapRect[2] - overlayRect[2];
        var offsetTop = overlayRect[1] - mapRect[1];
        var offsetBottom = mapRect[3] - overlayRect[3];

        var delta = [0, 0];
        if (offsetLeft < 0) {
          // move map to the left
          delta[0] = offsetLeft - margin;
        } else if (offsetRight < 0) {
          // move map to the right
          delta[0] = Math.abs(offsetRight) + margin;
        }
        if (offsetTop < 0) {
          // move map up
          delta[1] = offsetTop - margin;
        } else if (offsetBottom < 0) {
          // move map down
          delta[1] = Math.abs(offsetBottom) + margin;
        }

        if (delta[0] !== 0 || delta[1] !== 0) {
          var center = /** @type {module:ol/coordinate~Coordinate} */map.getView().getCenter();
          var centerPx = map.getPixelFromCoordinate(center);
          var newCenterPx = [centerPx[0] + delta[0], centerPx[1] + delta[1]];

          map.getView().animate({
            center: map.getCoordinateFromPixel(newCenterPx),
            duration: this.autoPanAnimation.duration,
            easing: this.autoPanAnimation.easing
          });
        }
      }
    }

    /**
     * Get the extent of an element relative to the document
     * @param {HTMLElement|undefined} element The element.
     * @param {module:ol/size~Size|undefined} size The size of the element.
     * @return {module:ol/extent~Extent} The extent.
     * @protected
     */

  }, {
    key: 'getRect',
    value: function getRect(element, size) {
      var box = element.getBoundingClientRect();
      var offsetX = box.left + window.pageXOffset;
      var offsetY = box.top + window.pageYOffset;
      return [offsetX, offsetY, offsetX + size[0], offsetY + size[1]];
    }

    /**
     * Set the positioning for this overlay.
     * @param {module:ol/OverlayPositioning} positioning how the overlay is
     *     positioned relative to its point on the map.
     * @observable
     * @api
     */

  }, {
    key: 'setPositioning',
    value: function setPositioning(positioning) {
      this.set(Property.POSITIONING, positioning);
    }

    /**
     * Modify the visibility of the element.
     * @param {boolean} visible Element visibility.
     * @protected
     */

  }, {
    key: 'setVisible',
    value: function setVisible(visible) {
      if (this.rendered.visible !== visible) {
        this.element.style.display = visible ? '' : 'none';
        this.rendered.visible = visible;
      }
    }

    /**
     * Update pixel position.
     * @protected
     */

  }, {
    key: 'updatePixelPosition',
    value: function updatePixelPosition() {
      var map = this.getMap();
      var position = this.getPosition();
      if (!map || !map.isRendered() || !position) {
        this.setVisible(false);
        return;
      }

      var pixel = map.getPixelFromCoordinate(position);
      var mapSize = map.getSize();
      this.updateRenderedPosition(pixel, mapSize);
    }

    /**
     * @param {module:ol/pixel~Pixel} pixel The pixel location.
     * @param {module:ol/size~Size|undefined} mapSize The map size.
     * @protected
     */

  }, {
    key: 'updateRenderedPosition',
    value: function updateRenderedPosition(pixel, mapSize) {
      var style = this.element.style;
      var offset = this.getOffset();

      var positioning = this.getPositioning();

      this.setVisible(true);

      var offsetX = offset[0];
      var offsetY = offset[1];
      if (positioning == _OverlayPositioning2.default.BOTTOM_RIGHT || positioning == _OverlayPositioning2.default.CENTER_RIGHT || positioning == _OverlayPositioning2.default.TOP_RIGHT) {
        if (this.rendered.left_ !== '') {
          this.rendered.left_ = style.left = '';
        }
        var right = Math.round(mapSize[0] - pixel[0] - offsetX) + 'px';
        if (this.rendered.right_ != right) {
          this.rendered.right_ = style.right = right;
        }
      } else {
        if (this.rendered.right_ !== '') {
          this.rendered.right_ = style.right = '';
        }
        if (positioning == _OverlayPositioning2.default.BOTTOM_CENTER || positioning == _OverlayPositioning2.default.CENTER_CENTER || positioning == _OverlayPositioning2.default.TOP_CENTER) {
          offsetX -= this.element.offsetWidth / 2;
        }
        var left = Math.round(pixel[0] + offsetX) + 'px';
        if (this.rendered.left_ != left) {
          this.rendered.left_ = style.left = left;
        }
      }
      if (positioning == _OverlayPositioning2.default.BOTTOM_LEFT || positioning == _OverlayPositioning2.default.BOTTOM_CENTER || positioning == _OverlayPositioning2.default.BOTTOM_RIGHT) {
        if (this.rendered.top_ !== '') {
          this.rendered.top_ = style.top = '';
        }
        var bottom = Math.round(mapSize[1] - pixel[1] - offsetY) + 'px';
        if (this.rendered.bottom_ != bottom) {
          this.rendered.bottom_ = style.bottom = bottom;
        }
      } else {
        if (this.rendered.bottom_ !== '') {
          this.rendered.bottom_ = style.bottom = '';
        }
        if (positioning == _OverlayPositioning2.default.CENTER_LEFT || positioning == _OverlayPositioning2.default.CENTER_CENTER || positioning == _OverlayPositioning2.default.CENTER_RIGHT) {
          offsetY -= this.element.offsetHeight / 2;
        }
        var top = Math.round(pixel[1] + offsetY) + 'px';
        if (this.rendered.top_ != top) {
          this.rendered.top_ = style.top = top;
        }
      }
    }

    /**
     * returns the options this Overlay has been created with
     * @return {module:ol/Overlay~Options} overlay options
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }]);

  return Overlay;
}(_Object2.default);

exports.default = Overlay;