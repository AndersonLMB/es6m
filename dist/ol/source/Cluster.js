'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _asserts = require('../asserts.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Vector = require('../source/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Cluster
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Options
 * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
 * @property {number} [distance=20] Minimum distance in pixels between clusters.
 * @property {module:ol/extent~Extent} [extent] Extent.
 * @property {function(module:ol/Feature):module:ol/geom/Point} [geometryFunction]
 * Function that takes an {@link module:ol/Feature} as argument and returns an
 * {@link module:ol/geom/Point} as cluster calculation point for the feature. When a
 * feature should not be considered for clustering, the function should return
 * `null`. The default, which works when the underyling source contains point
 * features only, is
 * ```js
 * function(feature) {
 *   return feature.getGeometry();
 * }
 * ```
 * See {@link module:ol/geom/Polygon~Polygon#getInteriorPoint} for a way to get a cluster
 * calculation point for polygons.
 * @property {module:ol/proj~ProjectionLike} projection Projection.
 * @property {module:ol/source/Vector} source Source.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * Layer source to cluster vector data. Works out of the box with point
 * geometries. For other geometry types, or if not all geometries should be
 * considered for clustering, a custom `geometryFunction` can be defined.
 * @api
 */
var Cluster = function (_VectorSource) {
  _inherits(Cluster, _VectorSource);

  /**
   * @param {module:ol/source/Cluster~Options=} options Cluster options.
   */
  function Cluster(options) {
    _classCallCheck(this, Cluster);

    /**
     * @type {number|undefined}
     * @protected
     */
    var _this = _possibleConstructorReturn(this, (Cluster.__proto__ || Object.getPrototypeOf(Cluster)).call(this, {
      attributions: options.attributions,
      extent: options.extent,
      projection: options.projection,
      wrapX: options.wrapX
    }));

    _this.resolution = undefined;

    /**
     * @type {number}
     * @protected
     */
    _this.distance = options.distance !== undefined ? options.distance : 20;

    /**
     * @type {Array<module:ol/Feature>}
     * @protected
     */
    _this.features = [];

    /**
     * @param {module:ol/Feature} feature Feature.
     * @return {module:ol/geom/Point} Cluster calculation point.
     * @protected
     */
    _this.geometryFunction = options.geometryFunction || function (feature) {
      var geometry = /** @type {module:ol/geom/Point} */feature.getGeometry();
      (0, _asserts.assert)(geometry instanceof _Point2.default, 10); // The default `geometryFunction` can only handle `module:ol/geom/Point~Point` geometries
      return geometry;
    };

    /**
     * @type {module:ol/source/Vector}
     * @protected
     */
    _this.source = options.source;

    (0, _events.listen)(_this.source, _EventType2.default.CHANGE, _this.refresh, _this);
    return _this;
  }

  /**
   * Get the distance in pixels between clusters.
   * @return {number} Distance.
   * @api
   */


  _createClass(Cluster, [{
    key: 'getDistance',
    value: function getDistance() {
      return this.distance;
    }

    /**
     * Get a reference to the wrapped source.
     * @return {module:ol/source/Vector} Source.
     * @api
     */

  }, {
    key: 'getSource',
    value: function getSource() {
      return this.source;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'loadFeatures',
    value: function loadFeatures(extent, resolution, projection) {
      this.source.loadFeatures(extent, resolution, projection);
      if (resolution !== this.resolution) {
        this.clear();
        this.resolution = resolution;
        this.cluster();
        this.addFeatures(this.features);
      }
    }

    /**
     * Set the distance in pixels between clusters.
     * @param {number} distance The distance in pixels.
     * @api
     */

  }, {
    key: 'setDistance',
    value: function setDistance(distance) {
      this.distance = distance;
      this.refresh();
    }

    /**
     * handle the source changing
     * @override
     */

  }, {
    key: 'refresh',
    value: function refresh() {
      this.clear();
      this.cluster();
      this.addFeatures(this.features);
      _Vector2.default.prototype.refresh.call(this);
    }

    /**
     * @protected
     */

  }, {
    key: 'cluster',
    value: function cluster() {
      if (this.resolution === undefined) {
        return;
      }
      this.features.length = 0;
      var extent = (0, _extent.createEmpty)();
      var mapDistance = this.distance * this.resolution;
      var features = this.source.getFeatures();

      /**
       * @type {!Object<string, boolean>}
       */
      var clustered = {};

      for (var i = 0, ii = features.length; i < ii; i++) {
        var feature = features[i];
        if (!((0, _util.getUid)(feature).toString() in clustered)) {
          var geometry = this.geometryFunction(feature);
          if (geometry) {
            var coordinates = geometry.getCoordinates();
            (0, _extent.createOrUpdateFromCoordinate)(coordinates, extent);
            (0, _extent.buffer)(extent, mapDistance, extent);

            var neighbors = this.source.getFeaturesInExtent(extent);
            neighbors = neighbors.filter(function (neighbor) {
              var uid = (0, _util.getUid)(neighbor).toString();
              if (!(uid in clustered)) {
                clustered[uid] = true;
                return true;
              } else {
                return false;
              }
            });
            this.features.push(this.createCluster(neighbors));
          }
        }
      }
    }

    /**
     * @param {Array<module:ol/Feature>} features Features
     * @return {module:ol/Feature} The cluster feature.
     * @protected
     */

  }, {
    key: 'createCluster',
    value: function createCluster(features) {
      var centroid = [0, 0];
      for (var i = features.length - 1; i >= 0; --i) {
        var geometry = this.geometryFunction(features[i]);
        if (geometry) {
          (0, _coordinate.add)(centroid, geometry.getCoordinates());
        } else {
          features.splice(i, 1);
        }
      }
      (0, _coordinate.scale)(centroid, 1 / features.length);

      var cluster = new _Feature2.default(new _Point2.default(centroid));
      cluster.set('features', features);
      return cluster;
    }
  }]);

  return Cluster;
}(_Vector2.default);

exports.default = Cluster;