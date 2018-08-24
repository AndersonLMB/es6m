'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.handleEvent = handleEvent;
exports.createRegularPolygon = createRegularPolygon;
exports.createBox = createBox;

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _MapBrowserPointerEvent = require('../MapBrowserPointerEvent.js');

var _MapBrowserPointerEvent2 = _interopRequireDefault(_MapBrowserPointerEvent);

var _Object = require('../Object.js');

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _condition = require('../events/condition.js');

var _extent = require('../extent.js');

var _functions = require('../functions.js');

var _Circle = require('../geom/Circle.js');

var _Circle2 = _interopRequireDefault(_Circle);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _MultiPoint = require('../geom/MultiPoint.js');

var _MultiPoint2 = _interopRequireDefault(_MultiPoint);

var _MultiPolygon = require('../geom/MultiPolygon.js');

var _MultiPolygon2 = _interopRequireDefault(_MultiPolygon);

var _MouseSource = require('../pointer/MouseSource.js');

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _Pointer = require('../interaction/Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _Property = require('../interaction/Property.js');

var _Property2 = _interopRequireDefault(_Property);

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _Vector3 = require('../source/Vector.js');

var _Vector4 = _interopRequireDefault(_Vector3);

var _Style = require('../style/Style.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/Draw
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/geom/GeometryType} type Geometry type of
 * the geometries being drawn with this instance.
 * @property {number} [clickTolerance=6] The maximum distance in pixels between
 * "down" and "up" for a "up" event to be considered a "click" event and
 * actually add a point/vertex to the geometry being drawn.  The default of `6`
 * was chosen for the draw interaction to behave correctly on mouse as well as
 * on touch devices.
 * @property {module:ol/Collection<module:ol/Feature>} [features]
 * Destination collection for the drawn features.
 * @property {module:ol/source/Vector} [source] Destination source for
 * the drawn features.
 * @property {number} [dragVertexDelay=500] Delay in milliseconds after pointerdown
 * before the current vertex can be dragged to its exact position.
 * @property {number} [snapTolerance=12] Pixel distance for snapping to the
 * drawing finish.
 * @property {boolean} [stopClick=false] Stop click, singleclick, and
 * doubleclick events from firing during drawing.
 * @property {number} [maxPoints] The number of points that can be drawn before
 * a polygon ring or line string is finished. By default there is no
 * restriction.
 * @property {number} [minPoints] The number of points that must be drawn
 * before a polygon ring or line string can be finished. Default is `3` for
 * polygon rings and `2` for line strings.
 * @property {module:ol/events/condition~Condition} [finishCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether the drawing can be finished.
 * @property {module:ol/style/Style|Array<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style]
 * Style for sketch features.
 * @property {module:ol/interaction/Draw~GeometryFunction} [geometryFunction]
 * Function that is called when a geometry's coordinates are updated.
 * @property {string} [geometryName] Geometry name to use for features created
 * by the draw interaction.
 * @property {module:ol/events/condition~Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * By default {@link module:ol/events/condition~noModifierKeys}, i.e. a click,
 * adds a vertex or deactivates freehand drawing.
 * @property {boolean} [freehand=false] Operate in freehand mode for lines,
 * polygons, and circles.  This makes the interaction always operate in freehand
 * mode and takes precedence over any `freehandCondition` option.
 * @property {module:ol/events/condition~Condition} [freehandCondition]
 * Condition that activates freehand drawing for lines and polygons. This
 * function takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and
 * returns a boolean to indicate whether that event should be handled. The
 * default is {@link module:ol/events/condition~shiftKeyOnly}, meaning that the
 * Shift key activates freehand drawing.
 * @property {boolean} [wrapX=false] Wrap the world horizontally on the sketch
 * overlay.
 */

/**
 * Function that takes an array of coordinates and an optional existing geometry as
 * arguments, and returns a geometry. The optional existing geometry is the
 * geometry that is returned when the function is called without a second
 * argument.
 * @typedef {function(!Array<module:ol/coordinate~Coordinate>, module:ol/geom/SimpleGeometry=):
 *     module:ol/geom/SimpleGeometry} GeometryFunction
 */

/**
 * Draw mode.  This collapses multi-part geometry types with their single-part
 * cousins.
 * @enum {string}
 */
var Mode = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  CIRCLE: 'Circle'
};

/**
 * @enum {string}
 */
var DrawEventType = {
  /**
   * Triggered upon feature draw start
   * @event module:ol/interaction/Draw~DrawEvent#drawstart
   * @api
   */
  DRAWSTART: 'drawstart',
  /**
   * Triggered upon feature draw end
   * @event module:ol/interaction/Draw~DrawEvent#drawend
   * @api
   */
  DRAWEND: 'drawend'
};

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/Draw~Draw} instances are
 * instances of this type.
 */

var DrawEvent = function (_Event) {
  _inherits(DrawEvent, _Event);

  /**
   * @param {module:ol/interaction/Draw~DrawEventType} type Type.
   * @param {module:ol/Feature} feature The feature drawn.
   */
  function DrawEvent(type, feature) {
    _classCallCheck(this, DrawEvent);

    /**
     * The feature being drawn.
     * @type {module:ol/Feature}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (DrawEvent.__proto__ || Object.getPrototypeOf(DrawEvent)).call(this, type));

    _this.feature = feature;

    return _this;
  }

  return DrawEvent;
}(_Event3.default);

/**
 * @classdesc
 * Interaction for drawing feature geometries.
 *
 * @fires module:ol/interaction/Draw~DrawEvent
 * @api
 */


var Draw = function (_PointerInteraction) {
  _inherits(Draw, _PointerInteraction);

  /**
   * @param {module:ol/interaction/Draw~Options} options Options.
   */
  function Draw(options) {
    _classCallCheck(this, Draw);

    /**
     * @type {boolean}
     * @private
     */
    var _this2 = _possibleConstructorReturn(this, (Draw.__proto__ || Object.getPrototypeOf(Draw)).call(this, {
      handleDownEvent: handleDownEvent,
      handleEvent: handleEvent,
      handleUpEvent: handleUpEvent,
      stopDown: _functions.FALSE
    }));

    _this2.shouldHandle_ = false;

    /**
     * @type {module:ol/pixel~Pixel}
     * @private
     */
    _this2.downPx_ = null;

    /**
     * @type {number|undefined}
     * @private
     */
    _this2.downTimeout_;

    /**
     * @type {number|undefined}
     * @private
     */
    _this2.lastDragTime_;

    /**
     * @type {boolean}
     * @private
     */
    _this2.freehand_ = false;

    /**
     * Target source for drawn features.
     * @type {module:ol/source/Vector}
     * @private
     */
    _this2.source_ = options.source ? options.source : null;

    /**
     * Target collection for drawn features.
     * @type {module:ol/Collection<module:ol/Feature>}
     * @private
     */
    _this2.features_ = options.features ? options.features : null;

    /**
     * Pixel distance for snapping.
     * @type {number}
     * @private
     */
    _this2.snapTolerance_ = options.snapTolerance ? options.snapTolerance : 12;

    /**
     * Geometry type.
     * @type {module:ol/geom/GeometryType}
     * @private
     */
    _this2.type_ = /** @type {module:ol/geom/GeometryType} */options.type;

    /**
     * Drawing mode (derived from geometry type.
     * @type {module:ol/interaction/Draw~Mode}
     * @private
     */
    _this2.mode_ = getMode(_this2.type_);

    /**
     * Stop click, singleclick, and doubleclick events from firing during drawing.
     * Default is `false`.
     * @type {boolean}
     * @private
     */
    _this2.stopClick_ = !!options.stopClick;

    /**
     * The number of points that must be drawn before a polygon ring or line
     * string can be finished.  The default is 3 for polygon rings and 2 for
     * line strings.
     * @type {number}
     * @private
     */
    _this2.minPoints_ = options.minPoints ? options.minPoints : _this2.mode_ === Mode.POLYGON ? 3 : 2;

    /**
     * The number of points that can be drawn before a polygon ring or line string
     * is finished. The default is no restriction.
     * @type {number}
     * @private
     */
    _this2.maxPoints_ = options.maxPoints ? options.maxPoints : Infinity;

    /**
     * A function to decide if a potential finish coordinate is permissible
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.finishCondition_ = options.finishCondition ? options.finishCondition : _functions.TRUE;

    var geometryFunction = options.geometryFunction;
    if (!geometryFunction) {
      if (_this2.type_ === _GeometryType2.default.CIRCLE) {
        /**
         * @param {!Array<module:ol/coordinate~Coordinate>} coordinates
         *     The coordinates.
         * @param {module:ol/geom/SimpleGeometry=} opt_geometry Optional geometry.
         * @return {module:ol/geom/SimpleGeometry} A geometry.
         */
        geometryFunction = function geometryFunction(coordinates, opt_geometry) {
          var circle = opt_geometry ? /** @type {module:ol/geom/Circle} */opt_geometry : new _Circle2.default([NaN, NaN]);
          var squaredLength = (0, _coordinate.squaredDistance)(coordinates[0], coordinates[1]);
          circle.setCenterAndRadius(coordinates[0], Math.sqrt(squaredLength));
          return circle;
        };
      } else {
        var Constructor = void 0;
        var mode = _this2.mode_;
        if (mode === Mode.POINT) {
          Constructor = _Point2.default;
        } else if (mode === Mode.LINE_STRING) {
          Constructor = _LineString2.default;
        } else if (mode === Mode.POLYGON) {
          Constructor = _Polygon2.default;
        }
        /**
         * @param {!Array<module:ol/coordinate~Coordinate>} coordinates
         *     The coordinates.
         * @param {module:ol/geom/SimpleGeometry=} opt_geometry Optional geometry.
         * @return {module:ol/geom/SimpleGeometry} A geometry.
         */
        geometryFunction = function geometryFunction(coordinates, opt_geometry) {
          var geometry = opt_geometry;
          if (geometry) {
            if (mode === Mode.POLYGON) {
              if (coordinates[0].length) {
                // Add a closing coordinate to match the first
                geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])]);
              } else {
                geometry.setCoordinates([]);
              }
            } else {
              geometry.setCoordinates(coordinates);
            }
          } else {
            geometry = new Constructor(coordinates);
          }
          return geometry;
        };
      }
    }

    /**
     * @type {module:ol/interaction/Draw~GeometryFunction}
     * @private
     */
    _this2.geometryFunction_ = geometryFunction;

    /**
     * @type {number}
     * @private
     */
    _this2.dragVertexDelay_ = options.dragVertexDelay !== undefined ? options.dragVertexDelay : 500;

    /**
     * Finish coordinate for the feature (first point for polygons, last point for
     * linestrings).
     * @type {module:ol/coordinate~Coordinate}
     * @private
     */
    _this2.finishCoordinate_ = null;

    /**
     * Sketch feature.
     * @type {module:ol/Feature}
     * @private
     */
    _this2.sketchFeature_ = null;

    /**
     * Sketch point.
     * @type {module:ol/Feature}
     * @private
     */
    _this2.sketchPoint_ = null;

    /**
     * Sketch coordinates. Used when drawing a line or polygon.
     * @type {module:ol/coordinate~Coordinate|Array<module:ol/coordinate~Coordinate>|Array<Array<module:ol/coordinate~Coordinate>>}
     * @private
     */
    _this2.sketchCoords_ = null;

    /**
     * Sketch line. Used when drawing polygon.
     * @type {module:ol/Feature}
     * @private
     */
    _this2.sketchLine_ = null;

    /**
     * Sketch line coordinates. Used when drawing a polygon or circle.
     * @type {Array<module:ol/coordinate~Coordinate>}
     * @private
     */
    _this2.sketchLineCoords_ = null;

    /**
     * Squared tolerance for handling up events.  If the squared distance
     * between a down and up event is greater than this tolerance, up events
     * will not be handled.
     * @type {number}
     * @private
     */
    _this2.squaredClickTolerance_ = options.clickTolerance ? options.clickTolerance * options.clickTolerance : 36;

    /**
     * Draw overlay where our sketch features are drawn.
     * @type {module:ol/layer/Vector}
     * @private
     */
    _this2.overlay_ = new _Vector2.default({
      source: new _Vector4.default({
        useSpatialIndex: false,
        wrapX: options.wrapX ? options.wrapX : false
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileInteracting: true
    });

    /**
     * Name of the geometry attribute for newly created features.
     * @type {string|undefined}
     * @private
     */
    _this2.geometryName_ = options.geometryName;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.condition_ = options.condition ? options.condition : _condition.noModifierKeys;

    /**
     * @private
     * @type {module:ol/events/condition~Condition}
     */
    _this2.freehandCondition_;
    if (options.freehand) {
      _this2.freehandCondition_ = _condition.always;
    } else {
      _this2.freehandCondition_ = options.freehandCondition ? options.freehandCondition : _condition.shiftKeyOnly;
    }

    (0, _events.listen)(_this2, (0, _Object.getChangeEventType)(_Property2.default.ACTIVE), _this2.updateState_, _this2);

    return _this2;
  }

  /**
   * @inheritDoc
   */


  _createClass(Draw, [{
    key: 'setMap',
    value: function setMap(map) {
      _get(Draw.prototype.__proto__ || Object.getPrototypeOf(Draw.prototype), 'setMap', this).call(this, map);
      this.updateState_();
    }

    /**
     * Handle move events.
     * @param {module:ol/MapBrowserEvent} event A move event.
     * @return {boolean} Pass the event to other interactions.
     * @private
     */

  }, {
    key: 'handlePointerMove_',
    value: function handlePointerMove_(event) {
      if (this.downPx_ && (!this.freehand_ && this.shouldHandle_ || this.freehand_ && !this.shouldHandle_)) {
        var downPx = this.downPx_;
        var clickPx = event.pixel;
        var dx = downPx[0] - clickPx[0];
        var dy = downPx[1] - clickPx[1];
        var squaredDistance = dx * dx + dy * dy;
        this.shouldHandle_ = this.freehand_ ? squaredDistance > this.squaredClickTolerance_ : squaredDistance <= this.squaredClickTolerance_;
        if (!this.shouldHandle_) {
          return true;
        }
      }

      if (this.finishCoordinate_) {
        this.modifyDrawing_(event);
      } else {
        this.createOrUpdateSketchPoint_(event);
      }
      return true;
    }

    /**
     * Determine if an event is within the snapping tolerance of the start coord.
     * @param {module:ol/MapBrowserEvent} event Event.
     * @return {boolean} The event is within the snapping tolerance of the start.
     * @private
     */

  }, {
    key: 'atFinish_',
    value: function atFinish_(event) {
      var at = false;
      if (this.sketchFeature_) {
        var potentiallyDone = false;
        var potentiallyFinishCoordinates = [this.finishCoordinate_];
        if (this.mode_ === Mode.LINE_STRING) {
          potentiallyDone = this.sketchCoords_.length > this.minPoints_;
        } else if (this.mode_ === Mode.POLYGON) {
          potentiallyDone = this.sketchCoords_[0].length > this.minPoints_;
          potentiallyFinishCoordinates = [this.sketchCoords_[0][0], this.sketchCoords_[0][this.sketchCoords_[0].length - 2]];
        }
        if (potentiallyDone) {
          var map = event.map;
          for (var i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
            var finishCoordinate = potentiallyFinishCoordinates[i];
            var finishPixel = map.getPixelFromCoordinate(finishCoordinate);
            var pixel = event.pixel;
            var dx = pixel[0] - finishPixel[0];
            var dy = pixel[1] - finishPixel[1];
            var snapTolerance = this.freehand_ ? 1 : this.snapTolerance_;
            at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance;
            if (at) {
              this.finishCoordinate_ = finishCoordinate;
              break;
            }
          }
        }
      }
      return at;
    }

    /**
     * @param {module:ol/MapBrowserEvent} event Event.
     * @private
     */

  }, {
    key: 'createOrUpdateSketchPoint_',
    value: function createOrUpdateSketchPoint_(event) {
      var coordinates = event.coordinate.slice();
      if (!this.sketchPoint_) {
        this.sketchPoint_ = new _Feature2.default(new _Point2.default(coordinates));
        this.updateSketchFeatures_();
      } else {
        var sketchPointGeom = /** @type {module:ol/geom/Point} */this.sketchPoint_.getGeometry();
        sketchPointGeom.setCoordinates(coordinates);
      }
    }

    /**
     * Start the drawing.
     * @param {module:ol/MapBrowserEvent} event Event.
     * @private
     */

  }, {
    key: 'startDrawing_',
    value: function startDrawing_(event) {
      var start = event.coordinate;
      this.finishCoordinate_ = start;
      if (this.mode_ === Mode.POINT) {
        this.sketchCoords_ = start.slice();
      } else if (this.mode_ === Mode.POLYGON) {
        this.sketchCoords_ = [[start.slice(), start.slice()]];
        this.sketchLineCoords_ = this.sketchCoords_[0];
      } else {
        this.sketchCoords_ = [start.slice(), start.slice()];
      }
      if (this.sketchLineCoords_) {
        this.sketchLine_ = new _Feature2.default(new _LineString2.default(this.sketchLineCoords_));
      }
      var geometry = this.geometryFunction_(this.sketchCoords_);
      this.sketchFeature_ = new _Feature2.default();
      if (this.geometryName_) {
        this.sketchFeature_.setGeometryName(this.geometryName_);
      }
      this.sketchFeature_.setGeometry(geometry);
      this.updateSketchFeatures_();
      this.dispatchEvent(new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_));
    }

    /**
     * Modify the drawing.
     * @param {module:ol/MapBrowserEvent} event Event.
     * @private
     */

  }, {
    key: 'modifyDrawing_',
    value: function modifyDrawing_(event) {
      var coordinate = event.coordinate;
      var geometry = /** @type {module:ol/geom/SimpleGeometry} */this.sketchFeature_.getGeometry();
      var coordinates = void 0,
          last = void 0;
      if (this.mode_ === Mode.POINT) {
        last = this.sketchCoords_;
      } else if (this.mode_ === Mode.POLYGON) {
        coordinates = this.sketchCoords_[0];
        last = coordinates[coordinates.length - 1];
        if (this.atFinish_(event)) {
          // snap to finish
          coordinate = this.finishCoordinate_.slice();
        }
      } else {
        coordinates = this.sketchCoords_;
        last = coordinates[coordinates.length - 1];
      }
      last[0] = coordinate[0];
      last[1] = coordinate[1];
      this.geometryFunction_( /** @type {!Array<module:ol/coordinate~Coordinate>} */this.sketchCoords_, geometry);
      if (this.sketchPoint_) {
        var sketchPointGeom = /** @type {module:ol/geom/Point} */this.sketchPoint_.getGeometry();
        sketchPointGeom.setCoordinates(coordinate);
      }
      var sketchLineGeom = void 0;
      if (geometry instanceof _Polygon2.default && this.mode_ !== Mode.POLYGON) {
        if (!this.sketchLine_) {
          this.sketchLine_ = new _Feature2.default();
        }
        var ring = geometry.getLinearRing(0);
        sketchLineGeom = /** @type {module:ol/geom/LineString} */this.sketchLine_.getGeometry();
        if (!sketchLineGeom) {
          sketchLineGeom = new _LineString2.default(ring.getFlatCoordinates(), ring.getLayout());
          this.sketchLine_.setGeometry(sketchLineGeom);
        } else {
          sketchLineGeom.setFlatCoordinates(ring.getLayout(), ring.getFlatCoordinates());
          sketchLineGeom.changed();
        }
      } else if (this.sketchLineCoords_) {
        sketchLineGeom = /** @type {module:ol/geom/LineString} */this.sketchLine_.getGeometry();
        sketchLineGeom.setCoordinates(this.sketchLineCoords_);
      }
      this.updateSketchFeatures_();
    }

    /**
     * Add a new coordinate to the drawing.
     * @param {module:ol/MapBrowserEvent} event Event.
     * @private
     */

  }, {
    key: 'addToDrawing_',
    value: function addToDrawing_(event) {
      var coordinate = event.coordinate;
      var geometry = /** @type {module:ol/geom/SimpleGeometry} */this.sketchFeature_.getGeometry();
      var done = void 0;
      var coordinates = void 0;
      if (this.mode_ === Mode.LINE_STRING) {
        this.finishCoordinate_ = coordinate.slice();
        coordinates = this.sketchCoords_;
        if (coordinates.length >= this.maxPoints_) {
          if (this.freehand_) {
            coordinates.pop();
          } else {
            done = true;
          }
        }
        coordinates.push(coordinate.slice());
        this.geometryFunction_(coordinates, geometry);
      } else if (this.mode_ === Mode.POLYGON) {
        coordinates = this.sketchCoords_[0];
        if (coordinates.length >= this.maxPoints_) {
          if (this.freehand_) {
            coordinates.pop();
          } else {
            done = true;
          }
        }
        coordinates.push(coordinate.slice());
        if (done) {
          this.finishCoordinate_ = coordinates[0];
        }
        this.geometryFunction_(this.sketchCoords_, geometry);
      }
      this.updateSketchFeatures_();
      if (done) {
        this.finishDrawing();
      }
    }

    /**
     * Remove last point of the feature currently being drawn.
     * @api
     */

  }, {
    key: 'removeLastPoint',
    value: function removeLastPoint() {
      if (!this.sketchFeature_) {
        return;
      }
      var geometry = /** @type {module:ol/geom/SimpleGeometry} */this.sketchFeature_.getGeometry();
      var coordinates = void 0,
          sketchLineGeom = void 0;
      if (this.mode_ === Mode.LINE_STRING) {
        coordinates = this.sketchCoords_;
        coordinates.splice(-2, 1);
        this.geometryFunction_(coordinates, geometry);
        if (coordinates.length >= 2) {
          this.finishCoordinate_ = coordinates[coordinates.length - 2].slice();
        }
      } else if (this.mode_ === Mode.POLYGON) {
        coordinates = this.sketchCoords_[0];
        coordinates.splice(-2, 1);
        sketchLineGeom = /** @type {module:ol/geom/LineString} */this.sketchLine_.getGeometry();
        sketchLineGeom.setCoordinates(coordinates);
        this.geometryFunction_(this.sketchCoords_, geometry);
      }

      if (coordinates.length === 0) {
        this.finishCoordinate_ = null;
      }

      this.updateSketchFeatures_();
    }

    /**
     * Stop drawing and add the sketch feature to the target layer.
     * The {@link module:ol/interaction/Draw~DrawEventType.DRAWEND} event is
     * dispatched before inserting the feature.
     * @api
     */

  }, {
    key: 'finishDrawing',
    value: function finishDrawing() {
      var sketchFeature = this.abortDrawing_();
      if (!sketchFeature) {
        return;
      }
      var coordinates = this.sketchCoords_;
      var geometry = /** @type {module:ol/geom/SimpleGeometry} */sketchFeature.getGeometry();
      if (this.mode_ === Mode.LINE_STRING) {
        // remove the redundant last point
        coordinates.pop();
        this.geometryFunction_(coordinates, geometry);
      } else if (this.mode_ === Mode.POLYGON) {
        // remove the redundant last point in ring
        coordinates[0].pop();
        this.geometryFunction_(coordinates, geometry);
        coordinates = geometry.getCoordinates();
      }

      // cast multi-part geometries
      if (this.type_ === _GeometryType2.default.MULTI_POINT) {
        sketchFeature.setGeometry(new _MultiPoint2.default([coordinates]));
      } else if (this.type_ === _GeometryType2.default.MULTI_LINE_STRING) {
        sketchFeature.setGeometry(new _MultiLineString2.default([coordinates]));
      } else if (this.type_ === _GeometryType2.default.MULTI_POLYGON) {
        sketchFeature.setGeometry(new _MultiPolygon2.default([coordinates]));
      }

      // First dispatch event to allow full set up of feature
      this.dispatchEvent(new DrawEvent(DrawEventType.DRAWEND, sketchFeature));

      // Then insert feature
      if (this.features_) {
        this.features_.push(sketchFeature);
      }
      if (this.source_) {
        this.source_.addFeature(sketchFeature);
      }
    }

    /**
     * Stop drawing without adding the sketch feature to the target layer.
     * @return {module:ol/Feature} The sketch feature (or null if none).
     * @private
     */

  }, {
    key: 'abortDrawing_',
    value: function abortDrawing_() {
      this.finishCoordinate_ = null;
      var sketchFeature = this.sketchFeature_;
      if (sketchFeature) {
        this.sketchFeature_ = null;
        this.sketchPoint_ = null;
        this.sketchLine_ = null;
        this.overlay_.getSource().clear(true);
      }
      return sketchFeature;
    }

    /**
     * Extend an existing geometry by adding additional points. This only works
     * on features with `LineString` geometries, where the interaction will
     * extend lines by adding points to the end of the coordinates array.
     * @param {!module:ol/Feature} feature Feature to be extended.
     * @api
     */

  }, {
    key: 'extend',
    value: function extend(feature) {
      var geometry = feature.getGeometry();
      var lineString = /** @type {module:ol/geom/LineString} */geometry;
      this.sketchFeature_ = feature;
      this.sketchCoords_ = lineString.getCoordinates();
      var last = this.sketchCoords_[this.sketchCoords_.length - 1];
      this.finishCoordinate_ = last.slice();
      this.sketchCoords_.push(last.slice());
      this.updateSketchFeatures_();
      this.dispatchEvent(new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_));
    }

    /**
     * Redraw the sketch features.
     * @private
     */

  }, {
    key: 'updateSketchFeatures_',
    value: function updateSketchFeatures_() {
      var sketchFeatures = [];
      if (this.sketchFeature_) {
        sketchFeatures.push(this.sketchFeature_);
      }
      if (this.sketchLine_) {
        sketchFeatures.push(this.sketchLine_);
      }
      if (this.sketchPoint_) {
        sketchFeatures.push(this.sketchPoint_);
      }
      var overlaySource = this.overlay_.getSource();
      overlaySource.clear(true);
      overlaySource.addFeatures(sketchFeatures);
    }

    /**
     * @private
     */

  }, {
    key: 'updateState_',
    value: function updateState_() {
      var map = this.getMap();
      var active = this.getActive();
      if (!map || !active) {
        this.abortDrawing_();
      }
      this.overlay_.setMap(active ? map : null);
    }
  }]);

  return Draw;
}(_Pointer2.default);

/**
 * @return {module:ol/style/Style~StyleFunction} Styles.
 */


function getDefaultStyleFunction() {
  var styles = (0, _Style.createEditingStyle)();
  return function (feature, resolution) {
    return styles[feature.getGeometry().getType()];
  };
}

/**
 * Handles the {@link module:ol/MapBrowserEvent map browser event} and may actually
 * draw or finish the drawing.
 * @param {module:ol/MapBrowserEvent} event Map browser event.
 * @return {boolean} `false` to stop event propagation.
 * @this {module:ol/interaction/Draw}
 * @api
 */
function handleEvent(event) {
  if (event.originalEvent.type === _EventType2.default.CONTEXTMENU) {
    // Avoid context menu for long taps when drawing on mobile
    event.preventDefault();
  }
  this.freehand_ = this.mode_ !== Mode.POINT && this.freehandCondition_(event);
  var move = event.type === _MapBrowserEventType2.default.POINTERMOVE;
  var pass = true;
  if (this.lastDragTime_ && event.type === _MapBrowserEventType2.default.POINTERDRAG) {
    var now = Date.now();
    if (now - this.lastDragTime_ >= this.dragVertexDelay_) {
      this.downPx_ = event.pixel;
      this.shouldHandle_ = !this.freehand_;
      move = true;
    } else {
      this.lastDragTime_ = undefined;
    }
    if (this.shouldHandle_ && this.downTimeout_) {
      clearTimeout(this.downTimeout_);
      this.downTimeout_ = undefined;
    }
  }
  if (this.freehand_ && event.type === _MapBrowserEventType2.default.POINTERDRAG && this.sketchFeature_ !== null) {
    this.addToDrawing_(event);
    pass = false;
  } else if (this.freehand_ && event.type === _MapBrowserEventType2.default.POINTERDOWN) {
    pass = false;
  } else if (move) {
    pass = event.type === _MapBrowserEventType2.default.POINTERMOVE;
    if (pass && this.freehand_) {
      pass = this.handlePointerMove_(event);
    } else if (event.pointerEvent.pointerType == _MouseSource.POINTER_TYPE || event.type === _MapBrowserEventType2.default.POINTERDRAG && !this.downTimeout_) {
      this.handlePointerMove_(event);
    }
  } else if (event.type === _MapBrowserEventType2.default.DBLCLICK) {
    pass = false;
  }

  return _Pointer.handleEvent.call(this, event) && pass;
}

/**
 * @param {module:ol/MapBrowserPointerEvent} event Event.
 * @return {boolean} Start drag sequence?
 * @this {module:ol/interaction/Draw}
 */
function handleDownEvent(event) {
  this.shouldHandle_ = !this.freehand_;

  if (this.freehand_) {
    this.downPx_ = event.pixel;
    if (!this.finishCoordinate_) {
      this.startDrawing_(event);
    }
    return true;
  } else if (this.condition_(event)) {
    this.lastDragTime_ = Date.now();
    this.downTimeout_ = setTimeout(function () {
      this.handlePointerMove_(new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERMOVE, event.map, event.pointerEvent, event.frameState));
    }.bind(this), this.dragVertexDelay_);
    this.downPx_ = event.pixel;
    return true;
  } else {
    return false;
  }
}

/**
 * @param {module:ol/MapBrowserPointerEvent} event Event.
 * @return {boolean} Stop drag sequence?
 * @this {module:ol/interaction/Draw}
 */
function handleUpEvent(event) {
  var pass = true;

  if (this.downTimeout_) {
    clearTimeout(this.downTimeout_);
    this.downTimeout_ = undefined;
  }

  this.handlePointerMove_(event);

  var circleMode = this.mode_ === Mode.CIRCLE;

  if (this.shouldHandle_) {
    if (!this.finishCoordinate_) {
      this.startDrawing_(event);
      if (this.mode_ === Mode.POINT) {
        this.finishDrawing();
      }
    } else if (this.freehand_ || circleMode) {
      this.finishDrawing();
    } else if (this.atFinish_(event)) {
      if (this.finishCondition_(event)) {
        this.finishDrawing();
      }
    } else {
      this.addToDrawing_(event);
    }
    pass = false;
  } else if (this.freehand_) {
    this.finishCoordinate_ = null;
    this.abortDrawing_();
  }
  if (!pass && this.stopClick_) {
    event.stopPropagation();
  }
  return pass;
}

/**
 * Create a `geometryFunction` for `type: 'Circle'` that will create a regular
 * polygon with a user specified number of sides and start angle instead of an
 * `module:ol/geom/Circle~Circle` geometry.
 * @param {number=} opt_sides Number of sides of the regular polygon. Default is
 *     32.
 * @param {number=} opt_angle Angle of the first point in radians. 0 means East.
 *     Default is the angle defined by the heading from the center of the
 *     regular polygon to the current pointer position.
 * @return {module:ol/interaction/Draw~GeometryFunction} Function that draws a
 *     polygon.
 * @api
 */
function createRegularPolygon(opt_sides, opt_angle) {
  return function (coordinates, opt_geometry) {
    var center = coordinates[0];
    var end = coordinates[1];
    var radius = Math.sqrt((0, _coordinate.squaredDistance)(center, end));
    var geometry = opt_geometry ? /** @type {module:ol/geom/Polygon} */opt_geometry : (0, _Polygon.fromCircle)(new _Circle2.default(center), opt_sides);
    var angle = opt_angle;
    if (!opt_angle) {
      var x = end[0] - center[0];
      var y = end[1] - center[1];
      angle = Math.atan(y / x) - (x < 0 ? Math.PI : 0);
    }
    (0, _Polygon.makeRegular)(geometry, center, radius, angle);
    return geometry;
  };
}

/**
 * Create a `geometryFunction` that will create a box-shaped polygon (aligned
 * with the coordinate system axes).  Use this with the draw interaction and
 * `type: 'Circle'` to return a box instead of a circle geometry.
 * @return {module:ol/interaction/Draw~GeometryFunction} Function that draws a box-shaped polygon.
 * @api
 */
function createBox() {
  return function (coordinates, opt_geometry) {
    var extent = (0, _extent.boundingExtent)(coordinates);
    var boxCoordinates = [[(0, _extent.getBottomLeft)(extent), (0, _extent.getBottomRight)(extent), (0, _extent.getTopRight)(extent), (0, _extent.getTopLeft)(extent), (0, _extent.getBottomLeft)(extent)]];
    var geometry = opt_geometry;
    if (geometry) {
      geometry.setCoordinates(boxCoordinates);
    } else {
      geometry = new _Polygon2.default(boxCoordinates);
    }
    return geometry;
  };
}

/**
 * Get the drawing mode.  The mode for mult-part geometries is the same as for
 * their single-part cousins.
 * @param {module:ol/geom/GeometryType} type Geometry type.
 * @return {module:ol/interaction/Draw~Mode} Drawing mode.
 */
function getMode(type) {
  var mode = void 0;
  if (type === _GeometryType2.default.POINT || type === _GeometryType2.default.MULTI_POINT) {
    mode = Mode.POINT;
  } else if (type === _GeometryType2.default.LINE_STRING || type === _GeometryType2.default.MULTI_LINE_STRING) {
    mode = Mode.LINE_STRING;
  } else if (type === _GeometryType2.default.POLYGON || type === _GeometryType2.default.MULTI_POLYGON) {
    mode = Mode.POLYGON;
  } else if (type === _GeometryType2.default.CIRCLE) {
    mode = Mode.CIRCLE;
  }
  return (
    /** @type {!module:ol/interaction/Draw~Mode} */mode
  );
}

exports.default = Draw;