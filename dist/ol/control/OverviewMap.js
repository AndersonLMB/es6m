'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.render = render;

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Map = require('../Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _MapEventType = require('../MapEventType.js');

var _MapEventType2 = _interopRequireDefault(_MapEventType);

var _MapProperty = require('../MapProperty.js');

var _MapProperty2 = _interopRequireDefault(_MapProperty);

var _Object = require('../Object.js');

var _ObjectEventType = require('../ObjectEventType.js');

var _ObjectEventType2 = _interopRequireDefault(_ObjectEventType);

var _Overlay = require('../Overlay.js');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _OverlayPositioning = require('../OverlayPositioning.js');

var _OverlayPositioning2 = _interopRequireDefault(_OverlayPositioning);

var _ViewProperty = require('../ViewProperty.js');

var _ViewProperty2 = _interopRequireDefault(_ViewProperty);

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _coordinate = require('../coordinate.js');

var _css = require('../css.js');

var _dom = require('../dom.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/OverviewMap
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Maximum width and/or height extent ratio that determines when the overview
 * map should be zoomed out.
 * @type {number}
 */
var MAX_RATIO = 0.75;

/**
 * Minimum width and/or height extent ratio that determines when the overview
 * map should be zoomed in.
 * @type {number}
 */
var MIN_RATIO = 0.1;

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-overviewmap'] CSS class name.
 * @property {boolean} [collapsed=true] Whether the control should start collapsed or not (expanded).
 * @property {string|HTMLElement} [collapseLabel='«'] Text label to use for the
 * expanded overviewmap button. Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {boolean} [collapsible=true] Whether the control can be collapsed or not.
 * @property {string|HTMLElement} [label='»'] Text label to use for the collapsed
 * overviewmap button. Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {Array<module:ol/layer/Layer>|module:ol/Collection<module:ol/layer/Layer>} [layers]
 * Layers for the overview map. If not set, then all main map layers are used
 * instead.
 * @property {function(module:ol/MapEvent)} [render] Function called when the control
 * should be re-rendered. This is called in a `requestAnimationFrame` callback.
 * @property {HTMLElement|string} [target] Specify a target if you want the control
 * to be rendered outside of the map's viewport.
 * @property {string} [tipLabel='Overview map'] Text label to use for the button tip.
 * @property {module:ol/View} [view] Custom view for the overview map. If not provided,
 * a default view with an EPSG:3857 projection will be used.
 */

/**
 * Create a new control with a map acting as an overview map for an other
 * defined map.
 *
 * @api
 */

var OverviewMap = function (_Control) {
  _inherits(OverviewMap, _Control);

  /**
   * @param {module:ol/control/OverviewMap~Options=} opt_options OverviewMap options.
   */
  function OverviewMap(opt_options) {
    _classCallCheck(this, OverviewMap);

    var options = opt_options ? opt_options : {};

    /**
     * @type {boolean}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (OverviewMap.__proto__ || Object.getPrototypeOf(OverviewMap)).call(this, {
      element: document.createElement('div'),
      render: options.render || render,
      target: options.target
    }));

    _this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * @private
     * @type {boolean}
     */
    _this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;

    if (!_this.collapsible_) {
      _this.collapsed_ = false;
    }

    var className = options.className !== undefined ? options.className : 'ol-overviewmap';

    var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Overview map';

    var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : '\xAB';

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

    var label = options.label !== undefined ? options.label : '\xBB';

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

    /**
     * @type {HTMLElement}
     * @private
     */
    _this.ovmapDiv_ = document.createElement('DIV');
    _this.ovmapDiv_.className = 'ol-overviewmap-map';

    /**
     * @type {module:ol/Map}
     * @private
     */
    _this.ovmap_ = new _Map2.default({
      controls: new _Collection2.default(),
      interactions: new _Collection2.default(),
      view: options.view
    });
    var ovmap = _this.ovmap_;

    if (options.layers) {
      options.layers.forEach(
      /**
       * @param {module:ol/layer/Layer} layer Layer.
       */
      function (layer) {
        ovmap.addLayer(layer);
      }.bind(_this));
    }

    var box = document.createElement('DIV');
    box.className = 'ol-overviewmap-box';
    box.style.boxSizing = 'border-box';

    /**
     * @type {module:ol/Overlay}
     * @private
     */
    _this.boxOverlay_ = new _Overlay2.default({
      position: [0, 0],
      positioning: _OverlayPositioning2.default.BOTTOM_LEFT,
      element: box
    });
    _this.ovmap_.addOverlay(_this.boxOverlay_);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL + (_this.collapsed_ && _this.collapsible_ ? ' ' + _css.CLASS_COLLAPSED : '') + (_this.collapsible_ ? '' : ' ol-uncollapsible');
    var element = _this.element;
    element.className = cssClasses;
    element.appendChild(_this.ovmapDiv_);
    element.appendChild(button);

    /* Interactive map */

    var scope = _this;

    var overlay = _this.boxOverlay_;
    var overlayBox = _this.boxOverlay_.getElement();

    /* Functions definition */

    var computeDesiredMousePosition = function computeDesiredMousePosition(mousePosition) {
      return {
        clientX: mousePosition.clientX - overlayBox.offsetWidth / 2,
        clientY: mousePosition.clientY + overlayBox.offsetHeight / 2
      };
    };

    var move = function move(event) {
      var coordinates = ovmap.getEventCoordinate(computeDesiredMousePosition(event));

      overlay.setPosition(coordinates);
    };

    var endMoving = function endMoving(event) {
      var coordinates = ovmap.getEventCoordinate(event);

      scope.getMap().getView().setCenter(coordinates);

      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', endMoving);
    };

    /* Binding */

    overlayBox.addEventListener('mousedown', function () {
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endMoving);
    });
    return _this;
  }

  /**
   * @inheritDoc
   * @api
   */


  _createClass(OverviewMap, [{
    key: 'setMap',
    value: function setMap(map) {
      var oldMap = this.getMap();
      if (map === oldMap) {
        return;
      }
      if (oldMap) {
        var oldView = oldMap.getView();
        if (oldView) {
          this.unbindView_(oldView);
        }
        this.ovmap_.setTarget(null);
      }
      _get(OverviewMap.prototype.__proto__ || Object.getPrototypeOf(OverviewMap.prototype), 'setMap', this).call(this, map);

      if (map) {
        this.ovmap_.setTarget(this.ovmapDiv_);
        this.listenerKeys.push((0, _events.listen)(map, _ObjectEventType2.default.PROPERTYCHANGE, this.handleMapPropertyChange_, this));

        // TODO: to really support map switching, this would need to be reworked
        if (this.ovmap_.getLayers().getLength() === 0) {
          this.ovmap_.setLayerGroup(map.getLayerGroup());
        }

        var view = map.getView();
        if (view) {
          this.bindView_(view);
          if (view.isDef()) {
            this.ovmap_.updateSize();
            this.resetExtent_();
          }
        }
      }
    }

    /**
     * Handle map property changes.  This only deals with changes to the map's view.
     * @param {module:ol/Object~ObjectEvent} event The propertychange event.
     * @private
     */

  }, {
    key: 'handleMapPropertyChange_',
    value: function handleMapPropertyChange_(event) {
      if (event.key === _MapProperty2.default.VIEW) {
        var oldView = /** @type {module:ol/View} */event.oldValue;
        if (oldView) {
          this.unbindView_(oldView);
        }
        var newView = this.getMap().getView();
        this.bindView_(newView);
      }
    }

    /**
     * Register listeners for view property changes.
     * @param {module:ol/View} view The view.
     * @private
     */

  }, {
    key: 'bindView_',
    value: function bindView_(view) {
      (0, _events.listen)(view, (0, _Object.getChangeEventType)(_ViewProperty2.default.ROTATION), this.handleRotationChanged_, this);
    }

    /**
     * Unregister listeners for view property changes.
     * @param {module:ol/View} view The view.
     * @private
     */

  }, {
    key: 'unbindView_',
    value: function unbindView_(view) {
      (0, _events.unlisten)(view, (0, _Object.getChangeEventType)(_ViewProperty2.default.ROTATION), this.handleRotationChanged_, this);
    }

    /**
     * Handle rotation changes to the main map.
     * TODO: This should rotate the extent rectrangle instead of the
     * overview map's view.
     * @private
     */

  }, {
    key: 'handleRotationChanged_',
    value: function handleRotationChanged_() {
      this.ovmap_.getView().setRotation(this.getMap().getView().getRotation());
    }

    /**
     * Reset the overview map extent if the box size (width or
     * height) is less than the size of the overview map size times minRatio
     * or is greater than the size of the overview size times maxRatio.
     *
     * If the map extent was not reset, the box size can fits in the defined
     * ratio sizes. This method then checks if is contained inside the overview
     * map current extent. If not, recenter the overview map to the current
     * main map center location.
     * @private
     */

  }, {
    key: 'validateExtent_',
    value: function validateExtent_() {
      var map = this.getMap();
      var ovmap = this.ovmap_;

      if (!map.isRendered() || !ovmap.isRendered()) {
        return;
      }

      var mapSize = /** @type {module:ol/size~Size} */map.getSize();

      var view = map.getView();
      var extent = view.calculateExtent(mapSize);

      var ovmapSize = /** @type {module:ol/size~Size} */ovmap.getSize();

      var ovview = ovmap.getView();
      var ovextent = ovview.calculateExtent(ovmapSize);

      var topLeftPixel = ovmap.getPixelFromCoordinate((0, _extent.getTopLeft)(extent));
      var bottomRightPixel = ovmap.getPixelFromCoordinate((0, _extent.getBottomRight)(extent));

      var boxWidth = Math.abs(topLeftPixel[0] - bottomRightPixel[0]);
      var boxHeight = Math.abs(topLeftPixel[1] - bottomRightPixel[1]);

      var ovmapWidth = ovmapSize[0];
      var ovmapHeight = ovmapSize[1];

      if (boxWidth < ovmapWidth * MIN_RATIO || boxHeight < ovmapHeight * MIN_RATIO || boxWidth > ovmapWidth * MAX_RATIO || boxHeight > ovmapHeight * MAX_RATIO) {
        this.resetExtent_();
      } else if (!(0, _extent.containsExtent)(ovextent, extent)) {
        this.recenter_();
      }
    }

    /**
     * Reset the overview map extent to half calculated min and max ratio times
     * the extent of the main map.
     * @private
     */

  }, {
    key: 'resetExtent_',
    value: function resetExtent_() {
      if (MAX_RATIO === 0 || MIN_RATIO === 0) {
        return;
      }

      var map = this.getMap();
      var ovmap = this.ovmap_;

      var mapSize = /** @type {module:ol/size~Size} */map.getSize();

      var view = map.getView();
      var extent = view.calculateExtent(mapSize);

      var ovview = ovmap.getView();

      // get how many times the current map overview could hold different
      // box sizes using the min and max ratio, pick the step in the middle used
      // to calculate the extent from the main map to set it to the overview map,
      var steps = Math.log(MAX_RATIO / MIN_RATIO) / Math.LN2;
      var ratio = 1 / (Math.pow(2, steps / 2) * MIN_RATIO);
      (0, _extent.scaleFromCenter)(extent, ratio);
      ovview.fit(extent);
    }

    /**
     * Set the center of the overview map to the map center without changing its
     * resolution.
     * @private
     */

  }, {
    key: 'recenter_',
    value: function recenter_() {
      var map = this.getMap();
      var ovmap = this.ovmap_;

      var view = map.getView();

      var ovview = ovmap.getView();

      ovview.setCenter(view.getCenter());
    }

    /**
     * Update the box using the main map extent
     * @private
     */

  }, {
    key: 'updateBox_',
    value: function updateBox_() {
      var map = this.getMap();
      var ovmap = this.ovmap_;

      if (!map.isRendered() || !ovmap.isRendered()) {
        return;
      }

      var mapSize = /** @type {module:ol/size~Size} */map.getSize();

      var view = map.getView();

      var ovview = ovmap.getView();

      var rotation = view.getRotation();

      var overlay = this.boxOverlay_;
      var box = this.boxOverlay_.getElement();
      var extent = view.calculateExtent(mapSize);
      var ovresolution = ovview.getResolution();
      var bottomLeft = (0, _extent.getBottomLeft)(extent);
      var topRight = (0, _extent.getTopRight)(extent);

      // set position using bottom left coordinates
      var rotateBottomLeft = this.calculateCoordinateRotate_(rotation, bottomLeft);
      overlay.setPosition(rotateBottomLeft);

      // set box size calculated from map extent size and overview map resolution
      if (box) {
        box.style.width = Math.abs((bottomLeft[0] - topRight[0]) / ovresolution) + 'px';
        box.style.height = Math.abs((topRight[1] - bottomLeft[1]) / ovresolution) + 'px';
      }
    }

    /**
     * @param {number} rotation Target rotation.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @return {module:ol/coordinate~Coordinate|undefined} Coordinate for rotation and center anchor.
     * @private
     */

  }, {
    key: 'calculateCoordinateRotate_',
    value: function calculateCoordinateRotate_(rotation, coordinate) {
      var coordinateRotate = void 0;

      var map = this.getMap();
      var view = map.getView();

      var currentCenter = view.getCenter();

      if (currentCenter) {
        coordinateRotate = [coordinate[0] - currentCenter[0], coordinate[1] - currentCenter[1]];
        (0, _coordinate.rotate)(coordinateRotate, rotation);
        (0, _coordinate.add)(coordinateRotate, currentCenter);
      }
      return coordinateRotate;
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

      // manage overview map if it had not been rendered before and control
      // is expanded
      var ovmap = this.ovmap_;
      if (!this.collapsed_ && !ovmap.isRendered()) {
        ovmap.updateSize();
        this.resetExtent_();
        (0, _events.listenOnce)(ovmap, _MapEventType2.default.POSTRENDER, function (event) {
          this.updateBox_();
        }, this);
      }
    }

    /**
     * Return `true` if the overview map is collapsible, `false` otherwise.
     * @return {boolean} True if the widget is collapsible.
     * @api
     */

  }, {
    key: 'getCollapsible',
    value: function getCollapsible() {
      return this.collapsible_;
    }

    /**
     * Set whether the overview map should be collapsible.
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
     * Collapse or expand the overview map according to the passed parameter. Will
     * not do anything if the overview map isn't collapsible or if the current
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
     * Determine if the overview map is collapsed.
     * @return {boolean} The overview map is collapsed.
     * @api
     */

  }, {
    key: 'getCollapsed',
    value: function getCollapsed() {
      return this.collapsed_;
    }

    /**
     * Return the overview map.
     * @return {module:ol/PluggableMap} Overview map.
     * @api
     */

  }, {
    key: 'getOverviewMap',
    value: function getOverviewMap() {
      return this.ovmap_;
    }
  }]);

  return OverviewMap;
}(_Control3.default);

/**
 * Update the overview map element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/OverviewMap}
 * @api
 */


function render(mapEvent) {
  this.validateExtent_();
  this.updateBox_();
}

exports.default = OverviewMap;