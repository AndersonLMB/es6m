'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.handleEvent = handleEvent;

var _util = require('../util.js');

var _Collection = require('../Collection.js');

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _functions = require('../functions.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Polygon = require('../geom/Polygon.js');

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _obj = require('../obj.js');

var _Vector = require('../source/Vector.js');

var _VectorEventType = require('../source/VectorEventType.js');

var _VectorEventType2 = _interopRequireDefault(_VectorEventType);

var _RBush = require('../structs/RBush.js');

var _RBush2 = _interopRequireDefault(_RBush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Snap
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Result
 * @property {boolean} snapped
 * @property {module:ol/coordinate~Coordinate|null} vertex
 * @property {module:ol/pixel~Pixel|null} vertexPixel
 */

/**
 * @typedef {Object} SegmentData
 * @property {module:ol/Feature} feature
 * @property {Array<module:ol/coordinate~Coordinate>} segment
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/Collection<module:ol/Feature>} [features] Snap to these features. Either this option or source should be provided.
 * @property {boolean} [edge=true] Snap to edges.
 * @property {boolean} [vertex=true] Snap to vertices.
 * @property {number} [pixelTolerance=10] Pixel tolerance for considering the pointer close enough to a segment or
 * vertex for snapping.
 * @property {module:ol/source/Vector} [source] Snap to features from this source. Either this option or features should be provided
 */

/**
 * @classdesc
 * Handles snapping of vector features while modifying or drawing them.  The
 * features can come from a {@link module:ol/source/Vector} or {@link module:ol/Collection~Collection}
 * Any interaction object that allows the user to interact
 * with the features using the mouse can benefit from the snapping, as long
 * as it is added before.
 *
 * The snap interaction modifies map browser event `coordinate` and `pixel`
 * properties to force the snap to occur to any interaction that them.
 *
 * Example:
 *
 *     import Snap from 'ol/interaction/Snap';
 *
 *     var snap = new Snap({
 *       source: source
 *     });
 *
 * @api
 */
var Snap = function (_PointerInteraction) {
  _inherits(Snap, _PointerInteraction);

  /**
   * @param {module:ol/interaction/Snap~Options=} opt_options Options.
   */
  function Snap(opt_options) {
    _classCallCheck(this, Snap);

    var _this = _possibleConstructorReturn(this, (Snap.__proto__ || Object.getPrototypeOf(Snap)).call(this, {
      handleEvent: handleEvent,
      handleDownEvent: _functions.TRUE,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    var options = opt_options ? opt_options : {};

    /**
     * @type {module:ol/source/Vector}
     * @private
     */
    _this.source_ = options.source ? options.source : null;

    /**
     * @private
     * @type {boolean}
     */
    _this.vertex_ = options.vertex !== undefined ? options.vertex : true;

    /**
     * @private
     * @type {boolean}
     */
    _this.edge_ = options.edge !== undefined ? options.edge : true;

    /**
     * @type {module:ol/Collection<module:ol/Feature>}
     * @private
     */
    _this.features_ = options.features ? options.features : null;

    /**
     * @type {Array<module:ol/events~EventsKey>}
     * @private
     */
    _this.featuresListenerKeys_ = [];

    /**
     * @type {Object<number, module:ol/events~EventsKey>}
     * @private
     */
    _this.featureChangeListenerKeys_ = {};

    /**
     * Extents are preserved so indexed segment can be quickly removed
     * when its feature geometry changes
     * @type {Object<number, module:ol/extent~Extent>}
     * @private
     */
    _this.indexedFeaturesExtents_ = {};

    /**
     * If a feature geometry changes while a pointer drag|move event occurs, the
     * feature doesn't get updated right away.  It will be at the next 'pointerup'
     * event fired.
     * @type {!Object<number, module:ol/Feature>}
     * @private
     */
    _this.pendingFeatures_ = {};

    /**
     * Used for distance sorting in sortByDistance_
     * @type {module:ol/coordinate~Coordinate}
     * @private
     */
    _this.pixelCoordinate_ = null;

    /**
     * @type {number}
     * @private
     */
    _this.pixelTolerance_ = options.pixelTolerance !== undefined ? options.pixelTolerance : 10;

    /**
     * @type {function(module:ol/interaction/Snap~SegmentData, module:ol/interaction/Snap~SegmentData): number}
     * @private
     */
    _this.sortByDistance_ = sortByDistance.bind(_this);

    /**
    * Segment RTree for each layer
    * @type {module:ol/structs/RBush<module:ol/interaction/Snap~SegmentData>}
    * @private
    */
    _this.rBush_ = new _RBush2.default();

    /**
    * @const
    * @private
    * @type {Object<string, function(module:ol/Feature, module:ol/geom/Geometry)>}
    */
    _this.SEGMENT_WRITERS_ = {
      'Point': _this.writePointGeometry_,
      'LineString': _this.writeLineStringGeometry_,
      'LinearRing': _this.writeLineStringGeometry_,
      'Polygon': _this.writePolygonGeometry_,
      'MultiPoint': _this.writeMultiPointGeometry_,
      'MultiLineString': _this.writeMultiLineStringGeometry_,
      'MultiPolygon': _this.writeMultiPolygonGeometry_,
      'GeometryCollection': _this.writeGeometryCollectionGeometry_,
      'Circle': _this.writeCircleGeometry_
    };
    return _this;
  }

  /**
   * Add a feature to the collection of features that we may snap to.
   * @param {module:ol/Feature} feature Feature.
   * @param {boolean=} opt_listen Whether to listen to the feature change or not
   *     Defaults to `true`.
   * @api
   */


  _createClass(Snap, [{
    key: 'addFeature',
    value: function addFeature(feature, opt_listen) {
      var register = opt_listen !== undefined ? opt_listen : true;
      var feature_uid = (0, _util.getUid)(feature);
      var geometry = feature.getGeometry();
      if (geometry) {
        var segmentWriter = this.SEGMENT_WRITERS_[geometry.getType()];
        if (segmentWriter) {
          this.indexedFeaturesExtents_[feature_uid] = geometry.getExtent((0, _extent.createEmpty)());
          segmentWriter.call(this, feature, geometry);
        }
      }

      if (register) {
        this.featureChangeListenerKeys_[feature_uid] = (0, _events.listen)(feature, _EventType2.default.CHANGE, this.handleFeatureChange_, this);
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @private
     */

  }, {
    key: 'forEachFeatureAdd_',
    value: function forEachFeatureAdd_(feature) {
      this.addFeature(feature);
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @private
     */

  }, {
    key: 'forEachFeatureRemove_',
    value: function forEachFeatureRemove_(feature) {
      this.removeFeature(feature);
    }

    /**
     * @return {module:ol/Collection<module:ol/Feature>|Array<module:ol/Feature>} Features.
     * @private
     */

  }, {
    key: 'getFeatures_',
    value: function getFeatures_() {
      var features = void 0;
      if (this.features_) {
        features = this.features_;
      } else if (this.source_) {
        features = this.source_.getFeatures();
      }
      return (
        /** @type {!Array<module:ol/Feature>|!module:ol/Collection<module:ol/Feature>} */features
      );
    }

    /**
     * @param {module:ol/source/Vector|module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureAdd_',
    value: function handleFeatureAdd_(evt) {
      var feature = void 0;
      if (evt instanceof _Vector.VectorSourceEvent) {
        feature = evt.feature;
      } else if (evt instanceof _Collection.CollectionEvent) {
        feature = evt.element;
      }
      this.addFeature( /** @type {module:ol/Feature} */feature);
    }

    /**
     * @param {module:ol/source/Vector|module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureRemove_',
    value: function handleFeatureRemove_(evt) {
      var feature = void 0;
      if (evt instanceof _Vector.VectorSourceEvent) {
        feature = evt.feature;
      } else if (evt instanceof _Collection.CollectionEvent) {
        feature = evt.element;
      }
      this.removeFeature( /** @type {module:ol/Feature} */feature);
    }

    /**
     * @param {module:ol/events/Event} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureChange_',
    value: function handleFeatureChange_(evt) {
      var feature = /** @type {module:ol/Feature} */evt.target;
      if (this.handlingDownUpSequence) {
        var uid = (0, _util.getUid)(feature);
        if (!(uid in this.pendingFeatures_)) {
          this.pendingFeatures_[uid] = feature;
        }
      } else {
        this.updateFeature_(feature);
      }
    }

    /**
     * Remove a feature from the collection of features that we may snap to.
     * @param {module:ol/Feature} feature Feature
     * @param {boolean=} opt_unlisten Whether to unlisten to the feature change
     *     or not. Defaults to `true`.
     * @api
     */

  }, {
    key: 'removeFeature',
    value: function removeFeature(feature, opt_unlisten) {
      var unregister = opt_unlisten !== undefined ? opt_unlisten : true;
      var feature_uid = (0, _util.getUid)(feature);
      var extent = this.indexedFeaturesExtents_[feature_uid];
      if (extent) {
        var rBush = this.rBush_;
        var nodesToRemove = [];
        rBush.forEachInExtent(extent, function (node) {
          if (feature === node.feature) {
            nodesToRemove.push(node);
          }
        });
        for (var i = nodesToRemove.length - 1; i >= 0; --i) {
          rBush.remove(nodesToRemove[i]);
        }
      }

      if (unregister) {
        (0, _events.unlistenByKey)(this.featureChangeListenerKeys_[feature_uid]);
        delete this.featureChangeListenerKeys_[feature_uid];
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      var currentMap = this.getMap();
      var keys = this.featuresListenerKeys_;
      var features = this.getFeatures_();

      if (currentMap) {
        keys.forEach(_events.unlistenByKey);
        keys.length = 0;
        features.forEach(this.forEachFeatureRemove_.bind(this));
      }
      _get(Snap.prototype.__proto__ || Object.getPrototypeOf(Snap.prototype), 'setMap', this).call(this, map);

      if (map) {
        if (this.features_) {
          keys.push((0, _events.listen)(this.features_, _CollectionEventType2.default.ADD, this.handleFeatureAdd_, this), (0, _events.listen)(this.features_, _CollectionEventType2.default.REMOVE, this.handleFeatureRemove_, this));
        } else if (this.source_) {
          keys.push((0, _events.listen)(this.source_, _VectorEventType2.default.ADDFEATURE, this.handleFeatureAdd_, this), (0, _events.listen)(this.source_, _VectorEventType2.default.REMOVEFEATURE, this.handleFeatureRemove_, this));
        }
        features.forEach(this.forEachFeatureAdd_.bind(this));
      }
    }

    /**
     * @param {module:ol/pixel~Pixel} pixel Pixel
     * @param {module:ol/coordinate~Coordinate} pixelCoordinate Coordinate
     * @param {module:ol/PluggableMap} map Map.
     * @return {module:ol/interaction/Snap~Result} Snap result
     */

  }, {
    key: 'snapTo',
    value: function snapTo(pixel, pixelCoordinate, map) {

      var lowerLeft = map.getCoordinateFromPixel([pixel[0] - this.pixelTolerance_, pixel[1] + this.pixelTolerance_]);
      var upperRight = map.getCoordinateFromPixel([pixel[0] + this.pixelTolerance_, pixel[1] - this.pixelTolerance_]);
      var box = (0, _extent.boundingExtent)([lowerLeft, upperRight]);

      var segments = this.rBush_.getInExtent(box);

      // If snapping on vertices only, don't consider circles
      if (this.vertex_ && !this.edge_) {
        segments = segments.filter(function (segment) {
          return segment.feature.getGeometry().getType() !== _GeometryType2.default.CIRCLE;
        });
      }

      var snappedToVertex = false;
      var snapped = false;
      var vertex = null;
      var vertexPixel = null;
      var dist = void 0,
          pixel1 = void 0,
          pixel2 = void 0,
          squaredDist1 = void 0,
          squaredDist2 = void 0;
      if (segments.length > 0) {
        this.pixelCoordinate_ = pixelCoordinate;
        segments.sort(this.sortByDistance_);
        var closestSegment = segments[0].segment;
        var isCircle = segments[0].feature.getGeometry().getType() === _GeometryType2.default.CIRCLE;
        if (this.vertex_ && !this.edge_) {
          pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
          pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
          squaredDist1 = (0, _coordinate.squaredDistance)(pixel, pixel1);
          squaredDist2 = (0, _coordinate.squaredDistance)(pixel, pixel2);
          dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
          snappedToVertex = dist <= this.pixelTolerance_;
          if (snappedToVertex) {
            snapped = true;
            vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
            vertexPixel = map.getPixelFromCoordinate(vertex);
          }
        } else if (this.edge_) {
          if (isCircle) {
            vertex = (0, _coordinate.closestOnCircle)(pixelCoordinate,
            /** @type {module:ol/geom/Circle} */segments[0].feature.getGeometry());
          } else {
            vertex = (0, _coordinate.closestOnSegment)(pixelCoordinate, closestSegment);
          }
          vertexPixel = map.getPixelFromCoordinate(vertex);
          if ((0, _coordinate.distance)(pixel, vertexPixel) <= this.pixelTolerance_) {
            snapped = true;
            if (this.vertex_ && !isCircle) {
              pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
              pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
              squaredDist1 = (0, _coordinate.squaredDistance)(vertexPixel, pixel1);
              squaredDist2 = (0, _coordinate.squaredDistance)(vertexPixel, pixel2);
              dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
              snappedToVertex = dist <= this.pixelTolerance_;
              if (snappedToVertex) {
                vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
                vertexPixel = map.getPixelFromCoordinate(vertex);
              }
            }
          }
        }
        if (snapped) {
          vertexPixel = [Math.round(vertexPixel[0]), Math.round(vertexPixel[1])];
        }
      }
      return (
        /** @type {module:ol/interaction/Snap~Result} */{
          snapped: snapped,
          vertex: vertex,
          vertexPixel: vertexPixel
        }
      );
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @private
     */

  }, {
    key: 'updateFeature_',
    value: function updateFeature_(feature) {
      this.removeFeature(feature, false);
      this.addFeature(feature, false);
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/Circle} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeCircleGeometry_',
    value: function writeCircleGeometry_(feature, geometry) {
      var polygon = (0, _Polygon.fromCircle)(geometry);
      var coordinates = polygon.getCoordinates()[0];
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var segment = coordinates.slice(i, i + 2);
        var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
          feature: feature,
          segment: segment
        };
        this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/GeometryCollection} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeGeometryCollectionGeometry_',
    value: function writeGeometryCollectionGeometry_(feature, geometry) {
      var geometries = geometry.getGeometriesArray();
      for (var i = 0; i < geometries.length; ++i) {
        var segmentWriter = this.SEGMENT_WRITERS_[geometries[i].getType()];
        if (segmentWriter) {
          segmentWriter.call(this, feature, geometries[i]);
        }
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/LineString} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeLineStringGeometry_',
    value: function writeLineStringGeometry_(feature, geometry) {
      var coordinates = geometry.getCoordinates();
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var segment = coordinates.slice(i, i + 2);
        var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
          feature: feature,
          segment: segment
        };
        this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/MultiLineString} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeMultiLineStringGeometry_',
    value: function writeMultiLineStringGeometry_(feature, geometry) {
      var lines = geometry.getCoordinates();
      for (var j = 0, jj = lines.length; j < jj; ++j) {
        var coordinates = lines[j];
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
          var segment = coordinates.slice(i, i + 2);
          var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
            feature: feature,
            segment: segment
          };
          this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
        }
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/MultiPoint} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeMultiPointGeometry_',
    value: function writeMultiPointGeometry_(feature, geometry) {
      var points = geometry.getCoordinates();
      for (var i = 0, ii = points.length; i < ii; ++i) {
        var coordinates = points[i];
        var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
          feature: feature,
          segment: [coordinates, coordinates]
        };
        this.rBush_.insert(geometry.getExtent(), segmentData);
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/MultiPolygon} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeMultiPolygonGeometry_',
    value: function writeMultiPolygonGeometry_(feature, geometry) {
      var polygons = geometry.getCoordinates();
      for (var k = 0, kk = polygons.length; k < kk; ++k) {
        var rings = polygons[k];
        for (var j = 0, jj = rings.length; j < jj; ++j) {
          var coordinates = rings[j];
          for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var segment = coordinates.slice(i, i + 2);
            var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
              feature: feature,
              segment: segment
            };
            this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
          }
        }
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/Point} geometry Geometry.
     * @private
     */

  }, {
    key: 'writePointGeometry_',
    value: function writePointGeometry_(feature, geometry) {
      var coordinates = geometry.getCoordinates();
      var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
        feature: feature,
        segment: [coordinates, coordinates]
      };
      this.rBush_.insert(geometry.getExtent(), segmentData);
    }

    /**
     * @param {module:ol/Feature} feature Feature
     * @param {module:ol/geom/Polygon} geometry Geometry.
     * @private
     */

  }, {
    key: 'writePolygonGeometry_',
    value: function writePolygonGeometry_(feature, geometry) {
      var rings = geometry.getCoordinates();
      for (var j = 0, jj = rings.length; j < jj; ++j) {
        var coordinates = rings[j];
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
          var segment = coordinates.slice(i, i + 2);
          var segmentData = /** @type {module:ol/interaction/Snap~SegmentData} */{
            feature: feature,
            segment: segment
          };
          this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
        }
      }
    }
  }]);

  return Snap;
}(_Pointer2.default);

/**
 * Handle all pointer events events.
 * @param {module:ol/MapBrowserEvent} evt A move event.
 * @return {boolean} Pass the event to other interactions.
 * @this {module:ol/interaction/Snap}
 */


function handleEvent(evt) {
  var result = this.snapTo(evt.pixel, evt.coordinate, evt.map);
  if (result.snapped) {
    evt.coordinate = result.vertex.slice(0, 2);
    evt.pixel = result.vertexPixel;
  }
  return _Pointer.handleEvent.call(this, evt);
}

/**
 * @param {module:ol/MapBrowserPointerEvent} evt Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/Snap}
 */
function handleUpEvent(evt) {
  var featuresToUpdate = (0, _obj.getValues)(this.pendingFeatures_);
  if (featuresToUpdate.length) {
    featuresToUpdate.forEach(this.updateFeature_.bind(this));
    this.pendingFeatures_ = {};
  }
  return false;
}

/**
 * Sort segments by distance, helper function
 * @param {module:ol/interaction/Snap~SegmentData} a The first segment data.
 * @param {module:ol/interaction/Snap~SegmentData} b The second segment data.
 * @return {number} The difference in distance.
 * @this {module:ol/interaction/Snap}
 */
function sortByDistance(a, b) {
  var deltaA = (0, _coordinate.squaredDistanceToSegment)(this.pixelCoordinate_, a.segment);
  var deltaB = (0, _coordinate.squaredDistanceToSegment)(this.pixelCoordinate_, b.segment);
  return deltaA - deltaB;
}

exports.default = Snap;