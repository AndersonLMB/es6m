'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _util = require('../util.js');

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _MapBrowserPointerEvent = require('../MapBrowserPointerEvent.js');

var _MapBrowserPointerEvent2 = _interopRequireDefault(_MapBrowserPointerEvent);

var _array = require('../array.js');

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _condition = require('../events/condition.js');

var _extent = require('../extent.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _Vector3 = require('../source/Vector.js');

var _Vector4 = _interopRequireDefault(_Vector3);

var _VectorEventType = require('../source/VectorEventType.js');

var _VectorEventType2 = _interopRequireDefault(_VectorEventType);

var _RBush = require('../structs/RBush.js');

var _RBush2 = _interopRequireDefault(_RBush);

var _Style = require('../style/Style.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Modify
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * The segment index assigned to a circle's center when
 * breaking up a circle into ModifySegmentDataType segments.
 * @type {number}
 */
var CIRCLE_CENTER_INDEX = 0;

/**
 * The segment index assigned to a circle's circumference when
 * breaking up a circle into ModifySegmentDataType segments.
 * @type {number}
 */
var CIRCLE_CIRCUMFERENCE_INDEX = 1;

/**
 * @enum {string}
 */
var ModifyEventType = {
  /**
   * Triggered upon feature modification start
   * @event ModifyEvent#modifystart
   * @api
   */
  MODIFYSTART: 'modifystart',
  /**
   * Triggered upon feature modification end
   * @event ModifyEvent#modifyend
   * @api
   */
  MODIFYEND: 'modifyend'
};

/**
 * @typedef {Object} SegmentData
 * @property {Array<number>} [depth]
 * @property {module:ol/Feature} feature
 * @property {module:ol/geom/SimpleGeometry} geometry
 * @property {number} index
 * @property {Array<module:ol/extent~Extent>} segment
 * @property {Array<module:ol/interaction/Modify~SegmentData>} [featureSegments]
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event will be considered to add or move a
 * vertex to the sketch. Default is
 * {@link module:ol/events/condition~primaryAction}.
 * @property {module:ol/events/condition~Condition} [deleteCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. By default,
 * {@link module:ol/events/condition~singleClick} with
 * {@link module:ol/events/condition~altKeyOnly} results in a vertex deletion.
 * @property {module:ol/events/condition~Condition} [insertVertexCondition] A
 * function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and
 * returns a boolean to indicate whether a new vertex can be added to the sketch
 * features. Default is {@link module:ol/events/condition~always}.
 * @property {number} [pixelTolerance=10] Pixel tolerance for considering the
 * pointer close enough to a segment or vertex for editing.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style]
 * Style used for the features being modified. By default the default edit
 * style is used (see {@link module:ol/style}).
 * @property {module:ol/source/Vector} [source] The vector source with
 * features to modify.  If a vector source is not provided, a feature collection
 * must be provided with the features option.
 * @property {module:ol/Collection<module:ol/Feature>} [features]
 * The features the interaction works on.  If a feature collection is not
 * provided, a vector source must be provided with the source option.
 * @property {boolean} [wrapX=false] Wrap the world horizontally on the sketch
 * overlay.
 */

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/Modify~Modify} instances are
 * instances of this type.
 */

var ModifyEvent = exports.ModifyEvent = function (_Event) {
  _inherits(ModifyEvent, _Event);

  /**
   * @param {ModifyEventType} type Type.
   * @param {module:ol/Collection<module:ol/Feature>} features
   * The features modified.
   * @param {module:ol/MapBrowserPointerEvent} mapBrowserPointerEvent
   * Associated {@link module:ol/MapBrowserPointerEvent}.
   */
  function ModifyEvent(type, features, mapBrowserPointerEvent) {
    _classCallCheck(this, ModifyEvent);

    /**
     * The features being modified.
     * @type {module:ol/Collection<module:ol/Feature>}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (ModifyEvent.__proto__ || Object.getPrototypeOf(ModifyEvent)).call(this, type));

    _this.features = features;

    /**
     * Associated {@link module:ol/MapBrowserEvent}.
     * @type {module:ol/MapBrowserEvent}
     * @api
     */
    _this.mapBrowserEvent = mapBrowserPointerEvent;

    return _this;
  }

  return ModifyEvent;
}(_Event3.default);

/**
 * @classdesc
 * Interaction for modifying feature geometries.  To modify features that have
 * been added to an existing source, construct the modify interaction with the
 * `source` option.  If you want to modify features in a collection (for example,
 * the collection used by a select interaction), construct the interaction with
 * the `features` option.  The interaction must be constructed with either a
 * `source` or `features` option.
 *
 * By default, the interaction will allow deletion of vertices when the `alt`
 * key is pressed.  To configure the interaction with a different condition
 * for deletion, use the `deleteCondition` option.
 * @fires module:ol/interaction/Modify~ModifyEvent
 * @api
 */


var Modify = function (_PointerInteraction) {
  _inherits(Modify, _PointerInteraction);

  /**
   * @param {module:ol/interaction/Modify~Options} options Options.
   */
  function Modify(options) {
    _classCallCheck(this, Modify);

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    var _this2 = _possibleConstructorReturn(this, (Modify.__proto__ || Object.getPrototypeOf(Modify)).call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleEvent: handleEvent,
      handleUpEvent: handleUpEvent
    }));

    _this2.condition_ = options.condition ? options.condition : _condition.primaryAction;

    /**
     * @private
     * @param {module:ol/MapBrowserEvent} mapBrowserEvent Browser event.
     * @return {boolean} Combined condition result.
     */
    _this2.defaultDeleteCondition_ = function (mapBrowserEvent) {
      return (0, _condition.altKeyOnly)(mapBrowserEvent) && (0, _condition.singleClick)(mapBrowserEvent);
    };

    /**
     * @type {module:ol/events/condition~Condition}
     * @private
     */
    _this2.deleteCondition_ = options.deleteCondition ? options.deleteCondition : _this2.defaultDeleteCondition_;

    /**
     * @type {module:ol/events/condition~Condition}
     * @private
     */
    _this2.insertVertexCondition_ = options.insertVertexCondition ? options.insertVertexCondition : _condition.always;

    /**
     * Editing vertex.
     * @type {module:ol/Feature}
     * @private
     */
    _this2.vertexFeature_ = null;

    /**
     * Segments intersecting {@link this.vertexFeature_} by segment uid.
     * @type {Object<string, boolean>}
     * @private
     */
    _this2.vertexSegments_ = null;

    /**
     * @type {module:ol/pixel~Pixel}
     * @private
     */
    _this2.lastPixel_ = [0, 0];

    /**
     * Tracks if the next `singleclick` event should be ignored to prevent
     * accidental deletion right after vertex creation.
     * @type {boolean}
     * @private
     */
    _this2.ignoreNextSingleClick_ = false;

    /**
     * @type {boolean}
     * @private
     */
    _this2.modified_ = false;

    /**
     * Segment RTree for each layer
     * @type {module:ol/structs/RBush<module:ol/interaction/Modify~SegmentData>}
     * @private
     */
    _this2.rBush_ = new _RBush2.default();

    /**
     * @type {number}
     * @private
     */
    _this2.pixelTolerance_ = options.pixelTolerance !== undefined ? options.pixelTolerance : 10;

    /**
     * @type {boolean}
     * @private
     */
    _this2.snappedToVertex_ = false;

    /**
     * Indicate whether the interaction is currently changing a feature's
     * coordinates.
     * @type {boolean}
     * @private
     */
    _this2.changingFeature_ = false;

    /**
     * @type {Array}
     * @private
     */
    _this2.dragSegments_ = [];

    /**
     * Draw overlay where sketch features are drawn.
     * @type {module:ol/layer/Vector}
     * @private
     */
    _this2.overlay_ = new _Vector2.default({
      source: new _Vector4.default({
        useSpatialIndex: false,
        wrapX: !!options.wrapX
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });

    /**
     * @const
     * @private
     * @type {!Object<string, function(module:ol/Feature, module:ol/geom/Geometry)>}
     */
    _this2.SEGMENT_WRITERS_ = {
      'Point': _this2.writePointGeometry_,
      'LineString': _this2.writeLineStringGeometry_,
      'LinearRing': _this2.writeLineStringGeometry_,
      'Polygon': _this2.writePolygonGeometry_,
      'MultiPoint': _this2.writeMultiPointGeometry_,
      'MultiLineString': _this2.writeMultiLineStringGeometry_,
      'MultiPolygon': _this2.writeMultiPolygonGeometry_,
      'Circle': _this2.writeCircleGeometry_,
      'GeometryCollection': _this2.writeGeometryCollectionGeometry_
    };

    /**
     * @type {module:ol/source/Vector}
     * @private
     */
    _this2.source_ = null;

    var features = void 0;
    if (options.source) {
      _this2.source_ = options.source;
      features = new _Collection2.default(_this2.source_.getFeatures());
      (0, _events.listen)(_this2.source_, _VectorEventType2.default.ADDFEATURE, _this2.handleSourceAdd_, _this2);
      (0, _events.listen)(_this2.source_, _VectorEventType2.default.REMOVEFEATURE, _this2.handleSourceRemove_, _this2);
    } else {
      features = options.features;
    }
    if (!features) {
      throw new Error('The modify interaction requires features or a source');
    }

    /**
     * @type {module:ol/Collection<module:ol/Feature>}
     * @private
     */
    _this2.features_ = features;

    _this2.features_.forEach(_this2.addFeature_.bind(_this2));
    (0, _events.listen)(_this2.features_, _CollectionEventType2.default.ADD, _this2.handleFeatureAdd_, _this2);
    (0, _events.listen)(_this2.features_, _CollectionEventType2.default.REMOVE, _this2.handleFeatureRemove_, _this2);

    /**
     * @type {module:ol/MapBrowserPointerEvent}
     * @private
     */
    _this2.lastPointerEvent_ = null;

    return _this2;
  }

  /**
   * @param {module:ol/Feature} feature Feature.
   * @private
   */


  _createClass(Modify, [{
    key: 'addFeature_',
    value: function addFeature_(feature) {
      var geometry = feature.getGeometry();
      if (geometry && geometry.getType() in this.SEGMENT_WRITERS_) {
        this.SEGMENT_WRITERS_[geometry.getType()].call(this, feature, geometry);
      }
      var map = this.getMap();
      if (map && map.isRendered() && this.getActive()) {
        this.handlePointerAtPixel_(this.lastPixel_, map);
      }
      (0, _events.listen)(feature, _EventType2.default.CHANGE, this.handleFeatureChange_, this);
    }

    /**
     * @param {module:ol/MapBrowserPointerEvent} evt Map browser event
     * @private
     */

  }, {
    key: 'willModifyFeatures_',
    value: function willModifyFeatures_(evt) {
      if (!this.modified_) {
        this.modified_ = true;
        this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYSTART, this.features_, evt));
      }
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @private
     */

  }, {
    key: 'removeFeature_',
    value: function removeFeature_(feature) {
      this.removeFeatureSegmentData_(feature);
      // Remove the vertex feature if the collection of canditate features
      // is empty.
      if (this.vertexFeature_ && this.features_.getLength() === 0) {
        this.overlay_.getSource().removeFeature(this.vertexFeature_);
        this.vertexFeature_ = null;
      }
      (0, _events.unlisten)(feature, _EventType2.default.CHANGE, this.handleFeatureChange_, this);
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @private
     */

  }, {
    key: 'removeFeatureSegmentData_',
    value: function removeFeatureSegmentData_(feature) {
      var rBush = this.rBush_;
      var /** @type {Array<module:ol/interaction/Modify~SegmentData>} */nodesToRemove = [];
      rBush.forEach(
      /**
       * @param {module:ol/interaction/Modify~SegmentData} node RTree node.
       */
      function (node) {
        if (feature === node.feature) {
          nodesToRemove.push(node);
        }
      });
      for (var i = nodesToRemove.length - 1; i >= 0; --i) {
        rBush.remove(nodesToRemove[i]);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setActive',
    value: function setActive(active) {
      if (this.vertexFeature_ && !active) {
        this.overlay_.getSource().removeFeature(this.vertexFeature_);
        this.vertexFeature_ = null;
      }
      _get(Modify.prototype.__proto__ || Object.getPrototypeOf(Modify.prototype), 'setActive', this).call(this, active);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      this.overlay_.setMap(map);
      _get(Modify.prototype.__proto__ || Object.getPrototypeOf(Modify.prototype), 'setMap', this).call(this, map);
    }

    /**
     * @param {module:ol/source/Vector~VectorSourceEvent} event Event.
     * @private
     */

  }, {
    key: 'handleSourceAdd_',
    value: function handleSourceAdd_(event) {
      if (event.feature) {
        this.features_.push(event.feature);
      }
    }

    /**
     * @param {module:ol/source/Vector~VectorSourceEvent} event Event.
     * @private
     */

  }, {
    key: 'handleSourceRemove_',
    value: function handleSourceRemove_(event) {
      if (event.feature) {
        this.features_.remove(event.feature);
      }
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureAdd_',
    value: function handleFeatureAdd_(evt) {
      this.addFeature_( /** @type {module:ol/Feature} */evt.element);
    }

    /**
     * @param {module:ol/events/Event} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureChange_',
    value: function handleFeatureChange_(evt) {
      if (!this.changingFeature_) {
        var feature = /** @type {module:ol/Feature} */evt.target;
        this.removeFeature_(feature);
        this.addFeature_(feature);
      }
    }

    /**
     * @param {module:ol/Collection~CollectionEvent} evt Event.
     * @private
     */

  }, {
    key: 'handleFeatureRemove_',
    value: function handleFeatureRemove_(evt) {
      var feature = /** @type {module:ol/Feature} */evt.element;
      this.removeFeature_(feature);
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
      var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
        feature: feature,
        geometry: geometry,
        segment: [coordinates, coordinates]
      };
      this.rBush_.insert(geometry.getExtent(), segmentData);
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
        var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
          feature: feature,
          geometry: geometry,
          depth: [i],
          index: i,
          segment: [coordinates, coordinates]
        };
        this.rBush_.insert(geometry.getExtent(), segmentData);
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
        var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
          feature: feature,
          geometry: geometry,
          index: i,
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
          var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
            feature: feature,
            geometry: geometry,
            depth: [j],
            index: i,
            segment: segment
          };
          this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
        }
      }
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
          var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
            feature: feature,
            geometry: geometry,
            depth: [j],
            index: i,
            segment: segment
          };
          this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
        }
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
            var segmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
              feature: feature,
              geometry: geometry,
              depth: [j, k],
              index: i,
              segment: segment
            };
            this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
          }
        }
      }
    }

    /**
     * We convert a circle into two segments.  The segment at index
     * {@link CIRCLE_CENTER_INDEX} is the
     * circle's center (a point).  The segment at index
     * {@link CIRCLE_CIRCUMFERENCE_INDEX} is
     * the circumference, and is not a line segment.
     *
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/geom/Circle} geometry Geometry.
     * @private
     */

  }, {
    key: 'writeCircleGeometry_',
    value: function writeCircleGeometry_(feature, geometry) {
      var coordinates = geometry.getCenter();
      var centerSegmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
        feature: feature,
        geometry: geometry,
        index: CIRCLE_CENTER_INDEX,
        segment: [coordinates, coordinates]
      };
      var circumferenceSegmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
        feature: feature,
        geometry: geometry,
        index: CIRCLE_CIRCUMFERENCE_INDEX,
        segment: [coordinates, coordinates]
      };
      var featureSegments = [centerSegmentData, circumferenceSegmentData];
      centerSegmentData.featureSegments = circumferenceSegmentData.featureSegments = featureSegments;
      this.rBush_.insert((0, _extent.createOrUpdateFromCoordinate)(coordinates), centerSegmentData);
      this.rBush_.insert(geometry.getExtent(), circumferenceSegmentData);
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
        this.SEGMENT_WRITERS_[geometries[i].getType()].call(this, feature, geometries[i]);
      }
    }

    /**
     * @param {module:ol/coordinate~Coordinate} coordinates Coordinates.
     * @return {module:ol/Feature} Vertex feature.
     * @private
     */

  }, {
    key: 'createOrUpdateVertexFeature_',
    value: function createOrUpdateVertexFeature_(coordinates) {
      var vertexFeature = this.vertexFeature_;
      if (!vertexFeature) {
        vertexFeature = new _Feature2.default(new _Point2.default(coordinates));
        this.vertexFeature_ = vertexFeature;
        this.overlay_.getSource().addFeature(vertexFeature);
      } else {
        var geometry = /** @type {module:ol/geom/Point} */vertexFeature.getGeometry();
        geometry.setCoordinates(coordinates);
      }
      return vertexFeature;
    }

    /**
     * @param {module:ol/MapBrowserEvent} evt Event.
     * @private
     */

  }, {
    key: 'handlePointerMove_',
    value: function handlePointerMove_(evt) {
      this.lastPixel_ = evt.pixel;
      this.handlePointerAtPixel_(evt.pixel, evt.map);
    }

    /**
     * @param {module:ol/pixel~Pixel} pixel Pixel
     * @param {module:ol/PluggableMap} map Map.
     * @private
     */

  }, {
    key: 'handlePointerAtPixel_',
    value: function handlePointerAtPixel_(pixel, map) {
      var pixelCoordinate = map.getCoordinateFromPixel(pixel);
      var sortByDistance = function sortByDistance(a, b) {
        return pointDistanceToSegmentDataSquared(pixelCoordinate, a) - pointDistanceToSegmentDataSquared(pixelCoordinate, b);
      };

      var box = (0, _extent.buffer)((0, _extent.createOrUpdateFromCoordinate)(pixelCoordinate), map.getView().getResolution() * this.pixelTolerance_);

      var rBush = this.rBush_;
      var nodes = rBush.getInExtent(box);
      if (nodes.length > 0) {
        nodes.sort(sortByDistance);
        var node = nodes[0];
        var closestSegment = node.segment;
        var vertex = closestOnSegmentData(pixelCoordinate, node);
        var vertexPixel = map.getPixelFromCoordinate(vertex);
        var dist = (0, _coordinate.distance)(pixel, vertexPixel);
        if (dist <= this.pixelTolerance_) {
          var vertexSegments = {};

          if (node.geometry.getType() === _GeometryType2.default.CIRCLE && node.index === CIRCLE_CIRCUMFERENCE_INDEX) {

            this.snappedToVertex_ = true;
            this.createOrUpdateVertexFeature_(vertex);
          } else {
            var pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
            var pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
            var squaredDist1 = (0, _coordinate.squaredDistance)(vertexPixel, pixel1);
            var squaredDist2 = (0, _coordinate.squaredDistance)(vertexPixel, pixel2);
            dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
            this.snappedToVertex_ = dist <= this.pixelTolerance_;
            if (this.snappedToVertex_) {
              vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
            }
            this.createOrUpdateVertexFeature_(vertex);
            for (var i = 1, ii = nodes.length; i < ii; ++i) {
              var segment = nodes[i].segment;
              if ((0, _coordinate.equals)(closestSegment[0], segment[0]) && (0, _coordinate.equals)(closestSegment[1], segment[1]) || (0, _coordinate.equals)(closestSegment[0], segment[1]) && (0, _coordinate.equals)(closestSegment[1], segment[0])) {
                vertexSegments[(0, _util.getUid)(segment)] = true;
              } else {
                break;
              }
            }
          }

          vertexSegments[(0, _util.getUid)(closestSegment)] = true;
          this.vertexSegments_ = vertexSegments;
          return;
        }
      }
      if (this.vertexFeature_) {
        this.overlay_.getSource().removeFeature(this.vertexFeature_);
        this.vertexFeature_ = null;
      }
    }

    /**
     * @param {module:ol/interaction/Modify~SegmentData} segmentData Segment data.
     * @param {module:ol/coordinate~Coordinate} vertex Vertex.
     * @private
     */

  }, {
    key: 'insertVertex_',
    value: function insertVertex_(segmentData, vertex) {
      var segment = segmentData.segment;
      var feature = segmentData.feature;
      var geometry = segmentData.geometry;
      var depth = segmentData.depth;
      var index = /** @type {number} */segmentData.index;
      var coordinates = void 0;

      while (vertex.length < geometry.getStride()) {
        vertex.push(0);
      }

      switch (geometry.getType()) {
        case _GeometryType2.default.MULTI_LINE_STRING:
          coordinates = geometry.getCoordinates();
          coordinates[depth[0]].splice(index + 1, 0, vertex);
          break;
        case _GeometryType2.default.POLYGON:
          coordinates = geometry.getCoordinates();
          coordinates[depth[0]].splice(index + 1, 0, vertex);
          break;
        case _GeometryType2.default.MULTI_POLYGON:
          coordinates = geometry.getCoordinates();
          coordinates[depth[1]][depth[0]].splice(index + 1, 0, vertex);
          break;
        case _GeometryType2.default.LINE_STRING:
          coordinates = geometry.getCoordinates();
          coordinates.splice(index + 1, 0, vertex);
          break;
        default:
          return;
      }

      this.setGeometryCoordinates_(geometry, coordinates);
      var rTree = this.rBush_;
      rTree.remove(segmentData);
      this.updateSegmentIndices_(geometry, index, depth, 1);
      var newSegmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
        segment: [segment[0], vertex],
        feature: feature,
        geometry: geometry,
        depth: depth,
        index: index
      };
      rTree.insert((0, _extent.boundingExtent)(newSegmentData.segment), newSegmentData);
      this.dragSegments_.push([newSegmentData, 1]);

      var newSegmentData2 = /** @type {module:ol/interaction/Modify~SegmentData} */{
        segment: [vertex, segment[1]],
        feature: feature,
        geometry: geometry,
        depth: depth,
        index: index + 1
      };
      rTree.insert((0, _extent.boundingExtent)(newSegmentData2.segment), newSegmentData2);
      this.dragSegments_.push([newSegmentData2, 0]);
      this.ignoreNextSingleClick_ = true;
    }

    /**
     * Removes the vertex currently being pointed.
     * @return {boolean} True when a vertex was removed.
     * @api
     */

  }, {
    key: 'removePoint',
    value: function removePoint() {
      if (this.lastPointerEvent_ && this.lastPointerEvent_.type != _MapBrowserEventType2.default.POINTERDRAG) {
        var evt = this.lastPointerEvent_;
        this.willModifyFeatures_(evt);
        this.removeVertex_();
        this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.features_, evt));
        this.modified_ = false;
        return true;
      }
      return false;
    }

    /**
     * Removes a vertex from all matching features.
     * @return {boolean} True when a vertex was removed.
     * @private
     */

  }, {
    key: 'removeVertex_',
    value: function removeVertex_() {
      var dragSegments = this.dragSegments_;
      var segmentsByFeature = {};
      var deleted = false;
      var component = void 0,
          coordinates = void 0,
          dragSegment = void 0,
          geometry = void 0,
          i = void 0,
          index = void 0,
          left = void 0;
      var newIndex = void 0,
          right = void 0,
          segmentData = void 0,
          uid = void 0;
      for (i = dragSegments.length - 1; i >= 0; --i) {
        dragSegment = dragSegments[i];
        segmentData = dragSegment[0];
        uid = (0, _util.getUid)(segmentData.feature);
        if (segmentData.depth) {
          // separate feature components
          uid += '-' + segmentData.depth.join('-');
        }
        if (!(uid in segmentsByFeature)) {
          segmentsByFeature[uid] = {};
        }
        if (dragSegment[1] === 0) {
          segmentsByFeature[uid].right = segmentData;
          segmentsByFeature[uid].index = segmentData.index;
        } else if (dragSegment[1] == 1) {
          segmentsByFeature[uid].left = segmentData;
          segmentsByFeature[uid].index = segmentData.index + 1;
        }
      }
      for (uid in segmentsByFeature) {
        right = segmentsByFeature[uid].right;
        left = segmentsByFeature[uid].left;
        index = segmentsByFeature[uid].index;
        newIndex = index - 1;
        if (left !== undefined) {
          segmentData = left;
        } else {
          segmentData = right;
        }
        if (newIndex < 0) {
          newIndex = 0;
        }
        geometry = segmentData.geometry;
        coordinates = geometry.getCoordinates();
        component = coordinates;
        deleted = false;
        switch (geometry.getType()) {
          case _GeometryType2.default.MULTI_LINE_STRING:
            if (coordinates[segmentData.depth[0]].length > 2) {
              coordinates[segmentData.depth[0]].splice(index, 1);
              deleted = true;
            }
            break;
          case _GeometryType2.default.LINE_STRING:
            if (coordinates.length > 2) {
              coordinates.splice(index, 1);
              deleted = true;
            }
            break;
          case _GeometryType2.default.MULTI_POLYGON:
            component = component[segmentData.depth[1]];
          /* falls through */
          case _GeometryType2.default.POLYGON:
            component = component[segmentData.depth[0]];
            if (component.length > 4) {
              if (index == component.length - 1) {
                index = 0;
              }
              component.splice(index, 1);
              deleted = true;
              if (index === 0) {
                // close the ring again
                component.pop();
                component.push(component[0]);
                newIndex = component.length - 1;
              }
            }
            break;
          default:
          // pass
        }

        if (deleted) {
          this.setGeometryCoordinates_(geometry, coordinates);
          var segments = [];
          if (left !== undefined) {
            this.rBush_.remove(left);
            segments.push(left.segment[0]);
          }
          if (right !== undefined) {
            this.rBush_.remove(right);
            segments.push(right.segment[1]);
          }
          if (left !== undefined && right !== undefined) {
            var newSegmentData = /** @type {module:ol/interaction/Modify~SegmentData} */{
              depth: segmentData.depth,
              feature: segmentData.feature,
              geometry: segmentData.geometry,
              index: newIndex,
              segment: segments
            };
            this.rBush_.insert((0, _extent.boundingExtent)(newSegmentData.segment), newSegmentData);
          }
          this.updateSegmentIndices_(geometry, index, segmentData.depth, -1);
          if (this.vertexFeature_) {
            this.overlay_.getSource().removeFeature(this.vertexFeature_);
            this.vertexFeature_ = null;
          }
          dragSegments.length = 0;
        }
      }
      return deleted;
    }

    /**
     * @param {module:ol/geom/SimpleGeometry} geometry Geometry.
     * @param {Array} coordinates Coordinates.
     * @private
     */

  }, {
    key: 'setGeometryCoordinates_',
    value: function setGeometryCoordinates_(geometry, coordinates) {
      this.changingFeature_ = true;
      geometry.setCoordinates(coordinates);
      this.changingFeature_ = false;
    }

    /**
     * @param {module:ol/geom/SimpleGeometry} geometry Geometry.
     * @param {number} index Index.
     * @param {Array<number>|undefined} depth Depth.
     * @param {number} delta Delta (1 or -1).
     * @private
     */

  }, {
    key: 'updateSegmentIndices_',
    value: function updateSegmentIndices_(geometry, index, depth, delta) {
      this.rBush_.forEachInExtent(geometry.getExtent(), function (segmentDataMatch) {
        if (segmentDataMatch.geometry === geometry && (depth === undefined || segmentDataMatch.depth === undefined || (0, _array.equals)(segmentDataMatch.depth, depth)) && segmentDataMatch.index > index) {
          segmentDataMatch.index += delta;
        }
      });
    }
  }]);

  return Modify;
}(_Pointer2.default);

/**
 * @param {module:ol/interaction/Modify~SegmentData} a The first segment data.
 * @param {module:ol/interaction/Modify~SegmentData} b The second segment data.
 * @return {number} The difference in indexes.
 */


function compareIndexes(a, b) {
  return a.index - b.index;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} evt Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/Modify}
 */
function handleDownEvent(evt) {
  if (!this.condition_(evt)) {
    return false;
  }
  this.handlePointerAtPixel_(evt.pixel, evt.map);
  var pixelCoordinate = evt.map.getCoordinateFromPixel(evt.pixel);
  this.dragSegments_.length = 0;
  this.modified_ = false;
  var vertexFeature = this.vertexFeature_;
  if (vertexFeature) {
    var insertVertices = [];
    var geometry = /** @type {module:ol/geom/Point} */vertexFeature.getGeometry();
    var vertex = geometry.getCoordinates();
    var vertexExtent = (0, _extent.boundingExtent)([vertex]);
    var segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
    var componentSegments = {};
    segmentDataMatches.sort(compareIndexes);
    for (var i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
      var segmentDataMatch = segmentDataMatches[i];
      var segment = segmentDataMatch.segment;
      var uid = (0, _util.getUid)(segmentDataMatch.feature);
      var depth = segmentDataMatch.depth;
      if (depth) {
        uid += '-' + depth.join('-'); // separate feature components
      }
      if (!componentSegments[uid]) {
        componentSegments[uid] = new Array(2);
      }
      if (segmentDataMatch.geometry.getType() === _GeometryType2.default.CIRCLE && segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX) {

        var closestVertex = closestOnSegmentData(pixelCoordinate, segmentDataMatch);
        if ((0, _coordinate.equals)(closestVertex, vertex) && !componentSegments[uid][0]) {
          this.dragSegments_.push([segmentDataMatch, 0]);
          componentSegments[uid][0] = segmentDataMatch;
        }
      } else if ((0, _coordinate.equals)(segment[0], vertex) && !componentSegments[uid][0]) {
        this.dragSegments_.push([segmentDataMatch, 0]);
        componentSegments[uid][0] = segmentDataMatch;
      } else if ((0, _coordinate.equals)(segment[1], vertex) && !componentSegments[uid][1]) {

        // prevent dragging closed linestrings by the connecting node
        if ((segmentDataMatch.geometry.getType() === _GeometryType2.default.LINE_STRING || segmentDataMatch.geometry.getType() === _GeometryType2.default.MULTI_LINE_STRING) && componentSegments[uid][0] && componentSegments[uid][0].index === 0) {
          continue;
        }

        this.dragSegments_.push([segmentDataMatch, 1]);
        componentSegments[uid][1] = segmentDataMatch;
      } else if (this.insertVertexCondition_(evt) && (0, _util.getUid)(segment) in this.vertexSegments_ && !componentSegments[uid][0] && !componentSegments[uid][1]) {
        insertVertices.push([segmentDataMatch, vertex]);
      }
    }
    if (insertVertices.length) {
      this.willModifyFeatures_(evt);
    }
    for (var j = insertVertices.length - 1; j >= 0; --j) {
      this.insertVertex_.apply(this, insertVertices[j]);
    }
  }
  return !!this.vertexFeature_;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} evt Event.
 * @this {module:ol/interaction/Modify}
 */
function handleDragEvent(evt) {
  this.ignoreNextSingleClick_ = false;
  this.willModifyFeatures_(evt);

  var vertex = evt.coordinate;
  for (var i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
    var dragSegment = this.dragSegments_[i];
    var segmentData = dragSegment[0];
    var depth = segmentData.depth;
    var geometry = segmentData.geometry;
    var coordinates = void 0;
    var segment = segmentData.segment;
    var index = dragSegment[1];

    while (vertex.length < geometry.getStride()) {
      vertex.push(segment[index][vertex.length]);
    }

    switch (geometry.getType()) {
      case _GeometryType2.default.POINT:
        coordinates = vertex;
        segment[0] = segment[1] = vertex;
        break;
      case _GeometryType2.default.MULTI_POINT:
        coordinates = geometry.getCoordinates();
        coordinates[segmentData.index] = vertex;
        segment[0] = segment[1] = vertex;
        break;
      case _GeometryType2.default.LINE_STRING:
        coordinates = geometry.getCoordinates();
        coordinates[segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case _GeometryType2.default.MULTI_LINE_STRING:
        coordinates = geometry.getCoordinates();
        coordinates[depth[0]][segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case _GeometryType2.default.POLYGON:
        coordinates = geometry.getCoordinates();
        coordinates[depth[0]][segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case _GeometryType2.default.MULTI_POLYGON:
        coordinates = geometry.getCoordinates();
        coordinates[depth[1]][depth[0]][segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case _GeometryType2.default.CIRCLE:
        segment[0] = segment[1] = vertex;
        if (segmentData.index === CIRCLE_CENTER_INDEX) {
          this.changingFeature_ = true;
          geometry.setCenter(vertex);
          this.changingFeature_ = false;
        } else {
          // We're dragging the circle's circumference:
          this.changingFeature_ = true;
          geometry.setRadius((0, _coordinate.distance)(geometry.getCenter(), vertex));
          this.changingFeature_ = false;
        }
        break;
      default:
      // pass
    }

    if (coordinates) {
      this.setGeometryCoordinates_(geometry, coordinates);
    }
  }
  this.createOrUpdateVertexFeature_(vertex);
}

/**
 * @param {module:ol/MapBrowserPointerEvent} evt Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/Modify}
 */
function handleUpEvent(evt) {
  for (var i = this.dragSegments_.length - 1; i >= 0; --i) {
    var segmentData = this.dragSegments_[i][0];
    var geometry = segmentData.geometry;
    if (geometry.getType() === _GeometryType2.default.CIRCLE) {
      // Update a circle object in the R* bush:
      var coordinates = geometry.getCenter();
      var centerSegmentData = segmentData.featureSegments[0];
      var circumferenceSegmentData = segmentData.featureSegments[1];
      centerSegmentData.segment[0] = centerSegmentData.segment[1] = coordinates;
      circumferenceSegmentData.segment[0] = circumferenceSegmentData.segment[1] = coordinates;
      this.rBush_.update((0, _extent.createOrUpdateFromCoordinate)(coordinates), centerSegmentData);
      this.rBush_.update(geometry.getExtent(), circumferenceSegmentData);
    } else {
      this.rBush_.update((0, _extent.boundingExtent)(segmentData.segment), segmentData);
    }
  }
  if (this.modified_) {
    this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.features_, evt));
    this.modified_ = false;
  }
  return false;
}

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} and may modify the
 * geometry.
 * @param {module:ol/MapBrowserEvent} mapBrowserEvent Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/Modify}
 */
function handleEvent(mapBrowserEvent) {
  if (!(mapBrowserEvent instanceof _MapBrowserPointerEvent2.default)) {
    return true;
  }
  this.lastPointerEvent_ = mapBrowserEvent;

  var handled = void 0;
  if (!mapBrowserEvent.map.getView().getInteracting() && mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERMOVE && !this.handlingDownUpSequence) {
    this.handlePointerMove_(mapBrowserEvent);
  }
  if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) {
    if (mapBrowserEvent.type != _MapBrowserEventType2.default.SINGLECLICK || !this.ignoreNextSingleClick_) {
      handled = this.removePoint();
    } else {
      handled = true;
    }
  }

  if (mapBrowserEvent.type == _MapBrowserEventType2.default.SINGLECLICK) {
    this.ignoreNextSingleClick_ = false;
  }

  return _Pointer.handleEvent.call(this, mapBrowserEvent) && !handled;
}

/**
 * Returns the distance from a point to a line segment.
 *
 * @param {module:ol/coordinate~Coordinate} pointCoordinates The coordinates of the point from
 *        which to calculate the distance.
 * @param {module:ol/interaction/Modify~SegmentData} segmentData The object describing the line
 *        segment we are calculating the distance to.
 * @return {number} The square of the distance between a point and a line segment.
 */
function pointDistanceToSegmentDataSquared(pointCoordinates, segmentData) {
  var geometry = segmentData.geometry;

  if (geometry.getType() === _GeometryType2.default.CIRCLE) {
    var circleGeometry = /** @type {module:ol/geom/Circle} */geometry;

    if (segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
      var distanceToCenterSquared = (0, _coordinate.squaredDistance)(circleGeometry.getCenter(), pointCoordinates);
      var distanceToCircumference = Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius();
      return distanceToCircumference * distanceToCircumference;
    }
  }
  return (0, _coordinate.squaredDistanceToSegment)(pointCoordinates, segmentData.segment);
}

/**
 * Returns the point closest to a given line segment.
 *
 * @param {module:ol/coordinate~Coordinate} pointCoordinates The point to which a closest point
 *        should be found.
 * @param {module:ol/interaction/Modify~SegmentData} segmentData The object describing the line
 *        segment which should contain the closest point.
 * @return {module:ol/coordinate~Coordinate} The point closest to the specified line segment.
 */
function closestOnSegmentData(pointCoordinates, segmentData) {
  var geometry = segmentData.geometry;

  if (geometry.getType() === _GeometryType2.default.CIRCLE && segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
    return geometry.getClosestPoint(pointCoordinates);
  }
  return (0, _coordinate.closestOnSegment)(pointCoordinates, segmentData.segment);
}

/**
 * @return {module:ol/style/Style~StyleFunction} Styles.
 */
function getDefaultStyleFunction() {
  var style = (0, _Style.createEditingStyle)();
  return function (feature, resolution) {
    return style[_GeometryType2.default.POINT];
  };
}

exports.default = Modify;