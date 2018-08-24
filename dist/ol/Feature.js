'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createStyleFunction = createStyleFunction;

var _asserts = require('./asserts.js');

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Object = require('./Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _Geometry = require('./geom/Geometry.js');

var _Geometry2 = _interopRequireDefault(_Geometry);

var _Style = require('./style/Style.js');

var _Style2 = _interopRequireDefault(_Style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Feature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * A vector object for geographic features with a geometry and other
 * attribute properties, similar to the features in vector file formats like
 * GeoJSON.
 *
 * Features can be styled individually with `setStyle`; otherwise they use the
 * style of their vector layer.
 *
 * Note that attribute properties are set as {@link module:ol/Object} properties on
 * the feature object, so they are observable, and have get/set accessors.
 *
 * Typically, a feature has a single geometry property. You can set the
 * geometry using the `setGeometry` method and get it with `getGeometry`.
 * It is possible to store more than one geometry on a feature using attribute
 * properties. By default, the geometry used for rendering is identified by
 * the property name `geometry`. If you want to use another geometry property
 * for rendering, use the `setGeometryName` method to change the attribute
 * property associated with the geometry for the feature.  For example:
 *
 * ```js
 *
 * import Feature from 'ol/Feature';
 * import Polygon from 'ol/geom/Polygon';
 * import Point from 'ol/geom/Point';
 *
 * var feature = new Feature({
 *   geometry: new Polygon(polyCoords),
 *   labelPoint: new Point(labelCoords),
 *   name: 'My Polygon'
 * });
 *
 * // get the polygon geometry
 * var poly = feature.getGeometry();
 *
 * // Render the feature as a point using the coordinates from labelPoint
 * feature.setGeometryName('labelPoint');
 *
 * // get the point geometry
 * var point = feature.getGeometry();
 * ```
 *
 * @api
 */
var Feature = function (_BaseObject) {
  _inherits(Feature, _BaseObject);

  /**
   * @param {module:ol/geom/Geometry|Object<string, *>=} opt_geometryOrProperties
   *     You may pass a Geometry object directly, or an object literal containing
   *     properties. If you pass an object literal, you may include a Geometry
   *     associated with a `geometry` key.
   */
  function Feature(opt_geometryOrProperties) {
    _classCallCheck(this, Feature);

    /**
     * @private
     * @type {number|string|undefined}
     */
    var _this = _possibleConstructorReturn(this, (Feature.__proto__ || Object.getPrototypeOf(Feature)).call(this));

    _this.id_ = undefined;

    /**
     * @type {string}
     * @private
     */
    _this.geometryName_ = 'geometry';

    /**
     * User provided style.
     * @private
     * @type {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
     */
    _this.style_ = null;

    /**
     * @private
     * @type {module:ol/style/Style~StyleFunction|undefined}
     */
    _this.styleFunction_ = undefined;

    /**
     * @private
     * @type {?module:ol/events~EventsKey}
     */
    _this.geometryChangeKey_ = null;

    (0, _events.listen)(_this, (0, _Object.getChangeEventType)(_this.geometryName_), _this.handleGeometryChanged_, _this);

    if (opt_geometryOrProperties !== undefined) {
      if (opt_geometryOrProperties instanceof _Geometry2.default || !opt_geometryOrProperties) {
        var geometry = opt_geometryOrProperties;
        _this.setGeometry(geometry);
      } else {
        /** @type {Object<string, *>} */
        var properties = opt_geometryOrProperties;
        _this.setProperties(properties);
      }
    }
    return _this;
  }

  /**
   * Clone this feature. If the original feature has a geometry it
   * is also cloned. The feature id is not set in the clone.
   * @return {module:ol/Feature} The clone.
   * @api
   */


  _createClass(Feature, [{
    key: 'clone',
    value: function clone() {
      var clone = new Feature(this.getProperties());
      clone.setGeometryName(this.getGeometryName());
      var geometry = this.getGeometry();
      if (geometry) {
        clone.setGeometry(geometry.clone());
      }
      var style = this.getStyle();
      if (style) {
        clone.setStyle(style);
      }
      return clone;
    }

    /**
     * Get the feature's default geometry.  A feature may have any number of named
     * geometries.  The "default" geometry (the one that is rendered by default) is
     * set when calling {@link module:ol/Feature~Feature#setGeometry}.
     * @return {module:ol/geom/Geometry|undefined} The default geometry for the feature.
     * @api
     * @observable
     */

  }, {
    key: 'getGeometry',
    value: function getGeometry() {
      return (
        /** @type {module:ol/geom/Geometry|undefined} */this.get(this.geometryName_)
      );
    }

    /**
     * Get the feature identifier.  This is a stable identifier for the feature and
     * is either set when reading data from a remote source or set explicitly by
     * calling {@link module:ol/Feature~Feature#setId}.
     * @return {number|string|undefined} Id.
     * @api
     */

  }, {
    key: 'getId',
    value: function getId() {
      return this.id_;
    }

    /**
     * Get the name of the feature's default geometry.  By default, the default
     * geometry is named `geometry`.
     * @return {string} Get the property name associated with the default geometry
     *     for this feature.
     * @api
     */

  }, {
    key: 'getGeometryName',
    value: function getGeometryName() {
      return this.geometryName_;
    }

    /**
     * Get the feature's style. Will return what was provided to the
     * {@link module:ol/Feature~Feature#setStyle} method.
     * @return {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} The feature style.
     * @api
     */

  }, {
    key: 'getStyle',
    value: function getStyle() {
      return this.style_;
    }

    /**
     * Get the feature's style function.
     * @return {module:ol/style/Style~StyleFunction|undefined} Return a function
     * representing the current style of this feature.
     * @api
     */

  }, {
    key: 'getStyleFunction',
    value: function getStyleFunction() {
      return this.styleFunction_;
    }

    /**
     * @private
     */

  }, {
    key: 'handleGeometryChange_',
    value: function handleGeometryChange_() {
      this.changed();
    }

    /**
     * @private
     */

  }, {
    key: 'handleGeometryChanged_',
    value: function handleGeometryChanged_() {
      if (this.geometryChangeKey_) {
        (0, _events.unlistenByKey)(this.geometryChangeKey_);
        this.geometryChangeKey_ = null;
      }
      var geometry = this.getGeometry();
      if (geometry) {
        this.geometryChangeKey_ = (0, _events.listen)(geometry, _EventType2.default.CHANGE, this.handleGeometryChange_, this);
      }
      this.changed();
    }

    /**
     * Set the default geometry for the feature.  This will update the property
     * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
     * @param {module:ol/geom/Geometry|undefined} geometry The new geometry.
     * @api
     * @observable
     */

  }, {
    key: 'setGeometry',
    value: function setGeometry(geometry) {
      this.set(this.geometryName_, geometry);
    }

    /**
     * Set the style for the feature.  This can be a single style object, an array
     * of styles, or a function that takes a resolution and returns an array of
     * styles. If it is `null` the feature has no style (a `null` style).
     * @param {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} style Style for this feature.
     * @api
     * @fires module:ol/events/Event~Event#event:change
     */

  }, {
    key: 'setStyle',
    value: function setStyle(style) {
      this.style_ = style;
      this.styleFunction_ = !style ? undefined : createStyleFunction(style);
      this.changed();
    }

    /**
     * Set the feature id.  The feature id is considered stable and may be used when
     * requesting features or comparing identifiers returned from a remote source.
     * The feature id can be used with the
     * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
     * @param {number|string|undefined} id The feature id.
     * @api
     * @fires module:ol/events/Event~Event#event:change
     */

  }, {
    key: 'setId',
    value: function setId(id) {
      this.id_ = id;
      this.changed();
    }

    /**
     * Set the property name to be used when getting the feature's default geometry.
     * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
     * this name will be returned.
     * @param {string} name The property name of the default geometry.
     * @api
     */

  }, {
    key: 'setGeometryName',
    value: function setGeometryName(name) {
      (0, _events.unlisten)(this, (0, _Object.getChangeEventType)(this.geometryName_), this.handleGeometryChanged_, this);
      this.geometryName_ = name;
      (0, _events.listen)(this, (0, _Object.getChangeEventType)(this.geometryName_), this.handleGeometryChanged_, this);
      this.handleGeometryChanged_();
    }
  }]);

  return Feature;
}(_Object2.default);

/**
 * Convert the provided object into a feature style function.  Functions passed
 * through unchanged.  Arrays of module:ol/style/Style or single style objects wrapped
 * in a new feature style function.
 * @param {module:ol/style/Style~StyleFunction|!Array<module:ol/style/Style>|!module:ol/style/Style} obj
 *     A feature style function, a single style, or an array of styles.
 * @return {module:ol/style/Style~StyleFunction} A style function.
 */


function createStyleFunction(obj) {
  if (typeof obj === 'function') {
    return obj;
  } else {
    /**
     * @type {Array<module:ol/style/Style>}
     */
    var styles = void 0;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      (0, _asserts.assert)(obj instanceof _Style2.default, 41); // Expected an `module:ol/style/Style~Style` or an array of `module:ol/style/Style~Style`
      styles = [obj];
    }
    return function () {
      return styles;
    };
  }
}
exports.default = Feature;