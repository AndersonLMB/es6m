'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GeolocationProperty = require('./GeolocationProperty.js');

var _GeolocationProperty2 = _interopRequireDefault(_GeolocationProperty);

var _Object = require('./Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Polygon = require('./geom/Polygon.js');

var _has = require('./has.js');

var _math = require('./math.js');

var _proj = require('./proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Geolocation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {boolean} [tracking=false] Start Tracking right after
 * instantiation.
 * @property {PositionOptions} [trackingOptions] Tracking options.
 * See http://www.w3.org/TR/geolocation-API/#position_options_interface.
 * @property {module:ol/proj~ProjectionLike} [projection] The projection the position
 * is reported in.
 */

/**
 * @classdesc
 * Helper class for providing HTML5 Geolocation capabilities.
 * The [Geolocation API](http://www.w3.org/TR/geolocation-API/)
 * is used to locate a user's position.
 *
 * To get notified of position changes, register a listener for the generic
 * `change` event on your instance of {@link module:ol/Geolocation~Geolocation}.
 *
 * Example:
 *
 *     var geolocation = new Geolocation({
 *       // take the projection to use from the map's view
 *       projection: view.getProjection()
 *     });
 *     // listen to changes in position
 *     geolocation.on('change', function(evt) {
 *       window.console.log(geolocation.getPosition());
 *     });
 *
 * @fires error
 * @api
 */
var Geolocation = function (_BaseObject) {
  _inherits(Geolocation, _BaseObject);

  /**
   * @param {module:ol/Geolocation~Options=} opt_options Options.
   */
  function Geolocation(opt_options) {
    _classCallCheck(this, Geolocation);

    var _this = _possibleConstructorReturn(this, (Geolocation.__proto__ || Object.getPrototypeOf(Geolocation)).call(this));

    var options = opt_options || {};

    /**
     * The unprojected (EPSG:4326) device position.
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    _this.position_ = null;

    /**
     * @private
     * @type {module:ol/proj~TransformFunction}
     */
    _this.transform_ = _proj.identityTransform;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.watchId_ = undefined;

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(_GeolocationProperty2.default.PROJECTION), _this.handleProjectionChanged_, _this);
    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(_GeolocationProperty2.default.TRACKING), _this.handleTrackingChanged_, _this);

    if (options.projection !== undefined) {
      _this.setProjection(options.projection);
    }
    if (options.trackingOptions !== undefined) {
      _this.setTrackingOptions(options.trackingOptions);
    }

    _this.setTracking(options.tracking !== undefined ? options.tracking : false);

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(Geolocation, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.setTracking(false);
      _get(Geolocation.prototype.__proto__ || Object.getPrototypeOf(Geolocation.prototype), 'disposeInternal', this).call(this);
    }

    /**
     * @private
     */

  }, {
    key: 'handleProjectionChanged_',
    value: function handleProjectionChanged_() {
      var projection = this.getProjection();
      if (projection) {
        this.transform_ = (0, _proj.getTransformFromProjections)((0, _proj.get)('EPSG:4326'), projection);
        if (this.position_) {
          this.set(_GeolocationProperty2.default.POSITION, this.transform_(this.position_));
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'handleTrackingChanged_',
    value: function handleTrackingChanged_() {
      if (_has.GEOLOCATION) {
        var tracking = this.getTracking();
        if (tracking && this.watchId_ === undefined) {
          this.watchId_ = navigator.geolocation.watchPosition(this.positionChange_.bind(this), this.positionError_.bind(this), this.getTrackingOptions());
        } else if (!tracking && this.watchId_ !== undefined) {
          navigator.geolocation.clearWatch(this.watchId_);
          this.watchId_ = undefined;
        }
      }
    }

    /**
     * @private
     * @param {Position} position position event.
     */

  }, {
    key: 'positionChange_',
    value: function positionChange_(position) {
      var coords = position.coords;
      this.set(_GeolocationProperty2.default.ACCURACY, coords.accuracy);
      this.set(_GeolocationProperty2.default.ALTITUDE, coords.altitude === null ? undefined : coords.altitude);
      this.set(_GeolocationProperty2.default.ALTITUDE_ACCURACY, coords.altitudeAccuracy === null ? undefined : coords.altitudeAccuracy);
      this.set(_GeolocationProperty2.default.HEADING, coords.heading === null ? undefined : (0, _math.toRadians)(coords.heading));
      if (!this.position_) {
        this.position_ = [coords.longitude, coords.latitude];
      } else {
        this.position_[0] = coords.longitude;
        this.position_[1] = coords.latitude;
      }
      var projectedPosition = this.transform_(this.position_);
      this.set(_GeolocationProperty2.default.POSITION, projectedPosition);
      this.set(_GeolocationProperty2.default.SPEED, coords.speed === null ? undefined : coords.speed);
      var geometry = (0, _Polygon.circular)(this.position_, coords.accuracy);
      geometry.applyTransform(this.transform_);
      this.set(_GeolocationProperty2.default.ACCURACY_GEOMETRY, geometry);
      this.changed();
    }

    /**
     * Triggered when the Geolocation returns an error.
     * @event error
     * @api
     */

    /**
     * @private
     * @param {PositionError} error error object.
     */

  }, {
    key: 'positionError_',
    value: function positionError_(error) {
      error.type = _EventType2.default.ERROR;
      this.setTracking(false);
      this.dispatchEvent( /** @type {{type: string, target: undefined}} */error);
    }

    /**
     * Get the accuracy of the position in meters.
     * @return {number|undefined} The accuracy of the position measurement in
     *     meters.
     * @observable
     * @api
     */

  }, {
    key: 'getAccuracy',
    value: function getAccuracy() {
      return (/** @type {number|undefined} */this.get(_GeolocationProperty2.default.ACCURACY)
      );
    }

    /**
     * Get a geometry of the position accuracy.
     * @return {?module:ol/geom/Polygon} A geometry of the position accuracy.
     * @observable
     * @api
     */

  }, {
    key: 'getAccuracyGeometry',
    value: function getAccuracyGeometry() {
      return (
        /** @type {?module:ol/geom/Polygon} */this.get(_GeolocationProperty2.default.ACCURACY_GEOMETRY) || null
      );
    }

    /**
     * Get the altitude associated with the position.
     * @return {number|undefined} The altitude of the position in meters above mean
     *     sea level.
     * @observable
     * @api
     */

  }, {
    key: 'getAltitude',
    value: function getAltitude() {
      return (/** @type {number|undefined} */this.get(_GeolocationProperty2.default.ALTITUDE)
      );
    }

    /**
     * Get the altitude accuracy of the position.
     * @return {number|undefined} The accuracy of the altitude measurement in
     *     meters.
     * @observable
     * @api
     */

  }, {
    key: 'getAltitudeAccuracy',
    value: function getAltitudeAccuracy() {
      return (/** @type {number|undefined} */this.get(_GeolocationProperty2.default.ALTITUDE_ACCURACY)
      );
    }

    /**
     * Get the heading as radians clockwise from North.
     * Note: depending on the browser, the heading is only defined if the `enableHighAccuracy`
     * is set to `true` in the tracking options.
     * @return {number|undefined} The heading of the device in radians from north.
     * @observable
     * @api
     */

  }, {
    key: 'getHeading',
    value: function getHeading() {
      return (/** @type {number|undefined} */this.get(_GeolocationProperty2.default.HEADING)
      );
    }

    /**
     * Get the position of the device.
     * @return {module:ol/coordinate~Coordinate|undefined} The current position of the device reported
     *     in the current projection.
     * @observable
     * @api
     */

  }, {
    key: 'getPosition',
    value: function getPosition() {
      return (
        /** @type {module:ol/coordinate~Coordinate|undefined} */this.get(_GeolocationProperty2.default.POSITION)
      );
    }

    /**
     * Get the projection associated with the position.
     * @return {module:ol/proj/Projection|undefined} The projection the position is
     *     reported in.
     * @observable
     * @api
     */

  }, {
    key: 'getProjection',
    value: function getProjection() {
      return (
        /** @type {module:ol/proj/Projection|undefined} */this.get(_GeolocationProperty2.default.PROJECTION)
      );
    }

    /**
     * Get the speed in meters per second.
     * @return {number|undefined} The instantaneous speed of the device in meters
     *     per second.
     * @observable
     * @api
     */

  }, {
    key: 'getSpeed',
    value: function getSpeed() {
      return (/** @type {number|undefined} */this.get(_GeolocationProperty2.default.SPEED)
      );
    }

    /**
     * Determine if the device location is being tracked.
     * @return {boolean} The device location is being tracked.
     * @observable
     * @api
     */

  }, {
    key: 'getTracking',
    value: function getTracking() {
      return (/** @type {boolean} */this.get(_GeolocationProperty2.default.TRACKING)
      );
    }

    /**
     * Get the tracking options.
     * See http://www.w3.org/TR/geolocation-API/#position-options.
     * @return {PositionOptions|undefined} PositionOptions as defined by
     *     the [HTML5 Geolocation spec
     *     ](http://www.w3.org/TR/geolocation-API/#position_options_interface).
     * @observable
     * @api
     */

  }, {
    key: 'getTrackingOptions',
    value: function getTrackingOptions() {
      return (/** @type {PositionOptions|undefined} */this.get(_GeolocationProperty2.default.TRACKING_OPTIONS)
      );
    }

    /**
     * Set the projection to use for transforming the coordinates.
     * @param {module:ol/proj~ProjectionLike} projection The projection the position is
     *     reported in.
     * @observable
     * @api
     */

  }, {
    key: 'setProjection',
    value: function setProjection(projection) {
      this.set(_GeolocationProperty2.default.PROJECTION, (0, _proj.get)(projection));
    }

    /**
     * Enable or disable tracking.
     * @param {boolean} tracking Enable tracking.
     * @observable
     * @api
     */

  }, {
    key: 'setTracking',
    value: function setTracking(tracking) {
      this.set(_GeolocationProperty2.default.TRACKING, tracking);
    }

    /**
     * Set the tracking options.
     * See http://www.w3.org/TR/geolocation-API/#position-options.
     * @param {PositionOptions} options PositionOptions as defined by the
     *     [HTML5 Geolocation spec
     *     ](http://www.w3.org/TR/geolocation-API/#position_options_interface).
     * @observable
     * @api
     */

  }, {
    key: 'setTrackingOptions',
    value: function setTrackingOptions(options) {
      this.set(_GeolocationProperty2.default.TRACKING_OPTIONS, options);
    }
  }]);

  return Geolocation;
}(_Object2.default);

exports.default = Geolocation;