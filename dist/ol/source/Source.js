'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _functions = require('../functions.js');

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _proj = require('../proj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Source
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * A function that returns a string or an array of strings representing source
 * attributions.
 *
 * @typedef {function(module:ol/PluggableMap~FrameState): (string|Array<string>)} Attribution
 */

/**
 * A type that can be used to provide attribution information for data sources.
 *
 * It represents either
 * * a simple string (e.g. `'© Acme Inc.'`)
 * * an array of simple strings (e.g. `['© Acme Inc.', '© Bacme Inc.']`)
 * * a function that returns a string or array of strings (`{@link module:ol/source/Source~Attribution}`)
 *
 * @typedef {string|Array<string>|module:ol/source/Source~Attribution} AttributionLike
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions]
 * @property {module:ol/proj~ProjectionLike} projection
 * @property {module:ol/source/State} [state]
 * @property {boolean} [wrapX]
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for {@link module:ol/layer/Layer~Layer} sources.
 *
 * A generic `change` event is triggered when the state of the source changes.
 * @api
 */
var Source = function (_BaseObject) {
  _inherits(Source, _BaseObject);

  /**
   * @param {module:ol/source/Source~Options} options Source options.
   */
  function Source(options) {
    _classCallCheck(this, Source);

    /**
    * @private
    * @type {module:ol/proj/Projection}
    */
    var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this));

    _this.projection_ = (0, _proj.get)(options.projection);

    /**
    * @private
    * @type {?module:ol/source/Source~Attribution}
    */
    _this.attributions_ = _this.adaptAttributions_(options.attributions);

    /**
    * @private
    * @type {module:ol/source/State}
    */
    _this.state_ = options.state !== undefined ? options.state : _State2.default.READY;

    /**
    * @private
    * @type {boolean}
    */
    _this.wrapX_ = options.wrapX !== undefined ? options.wrapX : false;

    return _this;
  }

  /**
  * Turns the attributions option into an attributions function.
  * @param {module:ol/source/Source~AttributionLike|undefined} attributionLike The attribution option.
  * @return {?module:ol/source/Source~Attribution} An attribution function (or null).
  */


  _createClass(Source, [{
    key: 'adaptAttributions_',
    value: function adaptAttributions_(attributionLike) {
      if (!attributionLike) {
        return null;
      }
      if (Array.isArray(attributionLike)) {
        return function (frameState) {
          return attributionLike;
        };
      }

      if (typeof attributionLike === 'function') {
        return attributionLike;
      }

      return function (frameState) {
        return [attributionLike];
      };
    }

    /**
    * Get the attribution function for the source.
    * @return {?module:ol/source/Source~Attribution} Attribution function.
    */

  }, {
    key: 'getAttributions',
    value: function getAttributions() {
      return this.attributions_;
    }

    /**
    * Get the projection of the source.
    * @return {module:ol/proj/Projection} Projection.
    * @api
    */

  }, {
    key: 'getProjection',
    value: function getProjection() {
      return this.projection_;
    }

    /**
    * @abstract
    * @return {Array<number>|undefined} Resolutions.
    */

  }, {
    key: 'getResolutions',
    value: function getResolutions() {}

    /**
    * Get the state of the source, see {@link module:ol/source/State~State} for possible states.
    * @return {module:ol/source/State} State.
    * @api
    */

  }, {
    key: 'getState',
    value: function getState() {
      return this.state_;
    }

    /**
    * @return {boolean|undefined} Wrap X.
    */

  }, {
    key: 'getWrapX',
    value: function getWrapX() {
      return this.wrapX_;
    }

    /**
    * Refreshes the source and finally dispatches a 'change' event.
    * @api
    */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.changed();
    }

    /**
    * Set the attributions of the source.
    * @param {module:ol/source/Source~AttributionLike|undefined} attributions Attributions.
    *     Can be passed as `string`, `Array<string>`, `{@link module:ol/source/Source~Attribution}`,
    *     or `undefined`.
    * @api
    */

  }, {
    key: 'setAttributions',
    value: function setAttributions(attributions) {
      this.attributions_ = this.adaptAttributions_(attributions);
      this.changed();
    }

    /**
    * Set the state of the source.
    * @param {module:ol/source/State} state State.
    * @protected
    */

  }, {
    key: 'setState',
    value: function setState(state) {
      this.state_ = state;
      this.changed();
    }
  }]);

  return Source;
}(_Object2.default);

/**
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @param {number} rotation Rotation.
 * @param {number} hitTolerance Hit tolerance in pixels.
 * @param {Object<string, boolean>} skippedFeatureUids Skipped feature uids.
 * @param {function((module:ol/Feature|module:ol/render/Feature)): T} callback Feature callback.
 * @return {T|void} Callback result.
 * @template T
 */


Source.prototype.forEachFeatureAtCoordinate = _functions.VOID;

exports.default = Source;