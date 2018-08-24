'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.render = render;

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Object = require('../Object.js');

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/MousePosition
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {string}
 */
var PROJECTION = 'projection';

/**
 * @type {string}
 */
var COORDINATE_FORMAT = 'coordinateFormat';

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-mouse-position'] CSS class name.
 * @property {module:ol/coordinate~CoordinateFormat} [coordinateFormat] Coordinate format.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {function(module:ol/MapEvent)} [render] Function called when the
 * control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 * @property {Element|string} [target] Specify a target if you want the
 * control to be rendered outside of the map's viewport.
 * @property {string} [undefinedHTML='&nbsp;'] Markup to show when coordinates are not
 * available (e.g. when the pointer leaves the map viewport).  By default, the last position
 * will be replaced with `'&nbsp;'` when the pointer leaves the viewport.  To
 * retain the last rendered position, set this option to something falsey (like an empty
 * string `''`).
 */

/**
 * @classdesc
 * A control to show the 2D coordinates of the mouse cursor. By default, these
 * are in the view projection, but can be in any supported projection.
 * By default the control is shown in the top right corner of the map, but this
 * can be changed by using the css selector `.ol-mouse-position`.
 *
 * @api
 */

var MousePosition = function (_Control) {
  _inherits(MousePosition, _Control);

  /**
   * @param {module:ol/control/MousePosition~Options=} opt_options Mouse position options.
   */
  function MousePosition(opt_options) {
    _classCallCheck(this, MousePosition);

    var options = opt_options ? opt_options : {};

    var element = document.createElement('DIV');
    element.className = options.className !== undefined ? options.className : 'ol-mouse-position';

    var _this = _possibleConstructorReturn(this, (MousePosition.__proto__ || Object.getPrototypeOf(MousePosition)).call(this, {
      element: element,
      render: options.render || render,
      target: options.target
    }));

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(PROJECTION), _this.handleProjectionChanged_, _this);

    if (options.coordinateFormat) {
      _this.setCoordinateFormat(options.coordinateFormat);
    }
    if (options.projection) {
      _this.setProjection(options.projection);
    }

    /**
     * @private
     * @type {string}
     */
    _this.undefinedHTML_ = 'undefinedHTML' in options ? options.undefinedHTML : '&nbsp;';

    /**
     * @private
     * @type {boolean}
     */
    _this.renderOnMouseOut_ = !!_this.undefinedHTML_;

    /**
     * @private
     * @type {string}
     */
    _this.renderedHTML_ = element.innerHTML;

    /**
     * @private
     * @type {module:ol/proj/Projection}
     */
    _this.mapProjection_ = null;

    /**
     * @private
     * @type {?module:ol/proj~TransformFunction}
     */
    _this.transform_ = null;

    /**
     * @private
     * @type {module:ol/pixel~Pixel}
     */
    _this.lastMouseMovePixel_ = null;

    return _this;
  }

  /**
   * @private
   */


  _createClass(MousePosition, [{
    key: 'handleProjectionChanged_',
    value: function handleProjectionChanged_() {
      this.transform_ = null;
    }

    /**
     * Return the coordinate format type used to render the current position or
     * undefined.
     * @return {module:ol/coordinate~CoordinateFormat|undefined} The format to render the current
     *     position in.
     * @observable
     * @api
     */

  }, {
    key: 'getCoordinateFormat',
    value: function getCoordinateFormat() {
      return (
        /** @type {module:ol/coordinate~CoordinateFormat|undefined} */this.get(COORDINATE_FORMAT)
      );
    }

    /**
     * Return the projection that is used to report the mouse position.
     * @return {module:ol/proj/Projection|undefined} The projection to report mouse
     *     position in.
     * @observable
     * @api
     */

  }, {
    key: 'getProjection',
    value: function getProjection() {
      return (
        /** @type {module:ol/proj/Projection|undefined} */this.get(PROJECTION)
      );
    }

    /**
     * @param {Event} event Browser event.
     * @protected
     */

  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {
      var map = this.getMap();
      this.lastMouseMovePixel_ = map.getEventPixel(event);
      this.updateHTML_(this.lastMouseMovePixel_);
    }

    /**
     * @param {Event} event Browser event.
     * @protected
     */

  }, {
    key: 'handleMouseOut',
    value: function handleMouseOut(event) {
      this.updateHTML_(null);
      this.lastMouseMovePixel_ = null;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      _get(MousePosition.prototype.__proto__ || Object.getPrototypeOf(MousePosition.prototype), 'setMap', this).call(this, map);
      if (map) {
        var viewport = map.getViewport();
        this.listenerKeys.push((0, _events.listen)(viewport, _EventType2.default.MOUSEMOVE, this.handleMouseMove, this));
        if (this.renderOnMouseOut_) {
          this.listenerKeys.push((0, _events.listen)(viewport, _EventType2.default.MOUSEOUT, this.handleMouseOut, this));
        }
      }
    }

    /**
     * Set the coordinate format type used to render the current position.
     * @param {module:ol/coordinate~CoordinateFormat} format The format to render the current
     *     position in.
     * @observable
     * @api
     */

  }, {
    key: 'setCoordinateFormat',
    value: function setCoordinateFormat(format) {
      this.set(COORDINATE_FORMAT, format);
    }

    /**
     * Set the projection that is used to report the mouse position.
     * @param {module:ol/proj~ProjectionLike} projection The projection to report mouse
     *     position in.
     * @observable
     * @api
     */

  }, {
    key: 'setProjection',
    value: function setProjection(projection) {
      this.set(PROJECTION, (0, _proj.get)(projection));
    }

    /**
     * @param {?module:ol/pixel~Pixel} pixel Pixel.
     * @private
     */

  }, {
    key: 'updateHTML_',
    value: function updateHTML_(pixel) {
      var html = this.undefinedHTML_;
      if (pixel && this.mapProjection_) {
        if (!this.transform_) {
          var projection = this.getProjection();
          if (projection) {
            this.transform_ = (0, _proj.getTransformFromProjections)(this.mapProjection_, projection);
          } else {
            this.transform_ = _proj.identityTransform;
          }
        }
        var map = this.getMap();
        var coordinate = map.getCoordinateFromPixel(pixel);
        if (coordinate) {
          this.transform_(coordinate, coordinate);
          var coordinateFormat = this.getCoordinateFormat();
          if (coordinateFormat) {
            html = coordinateFormat(coordinate);
          } else {
            html = coordinate.toString();
          }
        }
      }
      if (!this.renderedHTML_ || html !== this.renderedHTML_) {
        this.element.innerHTML = html;
        this.renderedHTML_ = html;
      }
    }
  }]);

  return MousePosition;
}(_Control3.default);

/**
 * Update the mouseposition element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/MousePosition}
 * @api
 */


function render(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.mapProjection_ = null;
  } else {
    if (this.mapProjection_ != frameState.viewState.projection) {
      this.mapProjection_ = frameState.viewState.projection;
      this.transform_ = null;
    }
  }
  this.updateHTML_(this.lastMouseMovePixel_);
}

exports.default = MousePosition;