'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Units = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.render = render;

var _Object = require('../Object.js');

var _asserts = require('../asserts.js');

var _Control2 = require('../control/Control.js');

var _Control3 = _interopRequireDefault(_Control2);

var _css = require('../css.js');

var _events = require('../events.js');

var _proj = require('../proj.js');

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/control/ScaleLine
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {string}
 */
var UNITS_PROP = 'units';

/**
 * Units for the scale line. Supported values are `'degrees'`, `'imperial'`,
 * `'nautical'`, `'metric'`, `'us'`.
 * @enum {string}
 */
var Units = exports.Units = {
  DEGREES: 'degrees',
  IMPERIAL: 'imperial',
  NAUTICAL: 'nautical',
  METRIC: 'metric',
  US: 'us'
};

/**
 * @const
 * @type {Array<number>}
 */
var LEADING_DIGITS = [1, 2, 5];

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-scale-line'] CSS Class name.
 * @property {number} [minWidth=64] Minimum width in pixels.
 * @property {function(module:ol/MapEvent)} [render] Function called when the control
 * should be re-rendered. This is called in a `requestAnimationFrame` callback.
 * @property {HTMLElement|string} [target] Specify a target if you want the control
 * to be rendered outside of the map's viewport.
 * @property {module:ol/control/ScaleLine~Units|string} [units='metric'] Units.
 */

/**
 * @classdesc
 * A control displaying rough y-axis distances, calculated for the center of the
 * viewport. For conformal projections (e.g. EPSG:3857, the default view
 * projection in OpenLayers), the scale is valid for all directions.
 * No scale line will be shown when the y-axis distance of a pixel at the
 * viewport center cannot be calculated in the view projection.
 * By default the scale line will show in the bottom left portion of the map,
 * but this can be changed by using the css selector `.ol-scale-line`.
 *
 * @api
 */

var ScaleLine = function (_Control) {
  _inherits(ScaleLine, _Control);

  /**
   * @param {module:ol/control/ScaleLine~Options=} opt_options Scale line options.
   */
  function ScaleLine(opt_options) {
    _classCallCheck(this, ScaleLine);

    var options = opt_options ? opt_options : {};

    var className = options.className !== undefined ? options.className : 'ol-scale-line';

    /**
     * @private
     * @type {HTMLElement}
     */
    var _this = _possibleConstructorReturn(this, (ScaleLine.__proto__ || Object.getPrototypeOf(ScaleLine)).call(this, {
      element: document.createElement('DIV'),
      render: options.render || render,
      target: options.target
    }));

    _this.innerElement_ = document.createElement('DIV');
    _this.innerElement_.className = className + '-inner';

    _this.element.className = className + ' ' + _css.CLASS_UNSELECTABLE;
    _this.element.appendChild(_this.innerElement_);

    /**
     * @private
     * @type {?module:ol/View~State}
     */
    _this.viewState_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.minWidth_ = options.minWidth !== undefined ? options.minWidth : 64;

    /**
     * @private
     * @type {boolean}
     */
    _this.renderedVisible_ = false;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.renderedWidth_ = undefined;

    /**
     * @private
     * @type {string}
     */
    _this.renderedHTML_ = '';

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(UNITS_PROP), _this.handleUnitsChanged_, _this);

    _this.setUnits( /** @type {module:ol/control/ScaleLine~Units} */options.units || Units.METRIC);

    return _this;
  }

  /**
   * Return the units to use in the scale line.
   * @return {module:ol/control/ScaleLine~Units|undefined} The units
   * to use in the scale line.
   * @observable
   * @api
   */


  _createClass(ScaleLine, [{
    key: 'getUnits',
    value: function getUnits() {
      return (
        /** @type {module:ol/control/ScaleLine~Units|undefined} */this.get(UNITS_PROP)
      );
    }

    /**
     * @private
     */

  }, {
    key: 'handleUnitsChanged_',
    value: function handleUnitsChanged_() {
      this.updateElement_();
    }

    /**
     * Set the units to use in the scale line.
     * @param {module:ol/control/ScaleLine~Units} units The units to use in the scale line.
     * @observable
     * @api
     */

  }, {
    key: 'setUnits',
    value: function setUnits(units) {
      this.set(UNITS_PROP, units);
    }

    /**
     * @private
     */

  }, {
    key: 'updateElement_',
    value: function updateElement_() {
      var viewState = this.viewState_;

      if (!viewState) {
        if (this.renderedVisible_) {
          this.element.style.display = 'none';
          this.renderedVisible_ = false;
        }
        return;
      }

      var center = viewState.center;
      var projection = viewState.projection;
      var units = this.getUnits();
      var pointResolutionUnits = units == Units.DEGREES ? _Units2.default.DEGREES : _Units2.default.METERS;
      var pointResolution = (0, _proj.getPointResolution)(projection, viewState.resolution, center, pointResolutionUnits);
      if (projection.getUnits() != _Units2.default.DEGREES && projection.getMetersPerUnit() && pointResolutionUnits == _Units2.default.METERS) {
        pointResolution *= projection.getMetersPerUnit();
      }

      var nominalCount = this.minWidth_ * pointResolution;
      var suffix = '';
      if (units == Units.DEGREES) {
        var metersPerDegree = _proj.METERS_PER_UNIT[_Units2.default.DEGREES];
        if (projection.getUnits() == _Units2.default.DEGREES) {
          nominalCount *= metersPerDegree;
        } else {
          pointResolution /= metersPerDegree;
        }
        if (nominalCount < metersPerDegree / 60) {
          suffix = '\u2033'; // seconds
          pointResolution *= 3600;
        } else if (nominalCount < metersPerDegree) {
          suffix = '\u2032'; // minutes
          pointResolution *= 60;
        } else {
          suffix = '\xB0'; // degrees
        }
      } else if (units == Units.IMPERIAL) {
        if (nominalCount < 0.9144) {
          suffix = 'in';
          pointResolution /= 0.0254;
        } else if (nominalCount < 1609.344) {
          suffix = 'ft';
          pointResolution /= 0.3048;
        } else {
          suffix = 'mi';
          pointResolution /= 1609.344;
        }
      } else if (units == Units.NAUTICAL) {
        pointResolution /= 1852;
        suffix = 'nm';
      } else if (units == Units.METRIC) {
        if (nominalCount < 0.001) {
          suffix = 'μm';
          pointResolution *= 1000000;
        } else if (nominalCount < 1) {
          suffix = 'mm';
          pointResolution *= 1000;
        } else if (nominalCount < 1000) {
          suffix = 'm';
        } else {
          suffix = 'km';
          pointResolution /= 1000;
        }
      } else if (units == Units.US) {
        if (nominalCount < 0.9144) {
          suffix = 'in';
          pointResolution *= 39.37;
        } else if (nominalCount < 1609.344) {
          suffix = 'ft';
          pointResolution /= 0.30480061;
        } else {
          suffix = 'mi';
          pointResolution /= 1609.3472;
        }
      } else {
        (0, _asserts.assert)(false, 33); // Invalid units
      }

      var i = 3 * Math.floor(Math.log(this.minWidth_ * pointResolution) / Math.log(10));
      var count = void 0,
          width = void 0;
      while (true) {
        count = LEADING_DIGITS[(i % 3 + 3) % 3] * Math.pow(10, Math.floor(i / 3));
        width = Math.round(count / pointResolution);
        if (isNaN(width)) {
          this.element.style.display = 'none';
          this.renderedVisible_ = false;
          return;
        } else if (width >= this.minWidth_) {
          break;
        }
        ++i;
      }

      var html = count + ' ' + suffix;
      if (this.renderedHTML_ != html) {
        this.innerElement_.innerHTML = html;
        this.renderedHTML_ = html;
      }

      if (this.renderedWidth_ != width) {
        this.innerElement_.style.width = width + 'px';
        this.renderedWidth_ = width;
      }

      if (!this.renderedVisible_) {
        this.element.style.display = '';
        this.renderedVisible_ = true;
      }
    }
  }]);

  return ScaleLine;
}(_Control3.default);

/**
 * Update the scale line element.
 * @param {module:ol/MapEvent} mapEvent Map event.
 * @this {module:ol/control/ScaleLine}
 * @api
 */


function render(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.viewState_ = null;
  } else {
    this.viewState_ = frameState.viewState;
  }
  this.updateElement_();
}

exports.default = ScaleLine;