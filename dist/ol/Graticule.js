'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/Graticule
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _coordinate = require('./coordinate.js');

var _events = require('./events.js');

var _extent = require('./extent.js');

var _GeometryLayout = require('./geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('./geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _Point = require('./geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _geodesic = require('./geom/flat/geodesic.js');

var _math = require('./math.js');

var _proj = require('./proj.js');

var _EventType = require('./render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Fill = require('./style/Fill.js');

var _Fill2 = _interopRequireDefault(_Fill);

var _Stroke = require('./style/Stroke.js');

var _Stroke2 = _interopRequireDefault(_Stroke);

var _Text = require('./style/Text.js');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {module:ol/style/Stroke}
 * @private
 * @const
 */
var DEFAULT_STROKE_STYLE = new _Stroke2.default({
  color: 'rgba(0,0,0,0.2)'
});

/**
 * TODO can be configurable
 * @type {Array<number>}
 * @private
 */
var INTERVALS = [90, 45, 30, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.002, 0.001];

/**
 * @typedef {Object} GraticuleLabelDataType
 * @property {module:ol/geom/Point} geom
 * @property {string} text
 */

/**
 * @typedef {Object} Options
 * @property {module:ol/PluggableMap} [map] Reference to an
 * {@link module:ol/Map~Map} object.
 * @property {number} [maxLines=100] The maximum number of meridians and
 * parallels from the center of the map. The default value of 100 means that at
 * most 200 meridians and 200 parallels will be displayed. The default value is
 * appropriate for conformal projections like Spherical Mercator. If you
 * increase the value, more lines will be drawn and the drawing performance will
 * decrease.
 * @property {module:ol/style/Stroke} [strokeStyle='rgba(0,0,0,0.2)'] The
 * stroke style to use for drawing the graticule. If not provided, a not fully
 * opaque black will be used.
 * @property {number} [targetSize=100] The target size of the graticule cells,
 * in pixels.
 * @property {boolean} [showLabels=false] Render a label with the respective
 * latitude/longitude for each graticule line.
 * @property {function(number):string} [lonLabelFormatter] Label formatter for
 * longitudes. This function is called with the longitude as argument, and
 * should return a formatted string representing the longitude. By default,
 * labels are formatted as degrees, minutes, seconds and hemisphere.
 * @property {function(number):string} [latLabelFormatter] Label formatter for
 * latitudes. This function is called with the latitude as argument, and
 * should return a formatted string representing the latitude. By default,
 * labels are formatted as degrees, minutes, seconds and hemisphere.
 * @property {number} [lonLabelPosition=0] Longitude label position in fractions
 * (0..1) of view extent. 0 means at the bottom of the viewport, 1 means at the
 * top.
 * @property {number} [latLabelPosition=1] Latitude label position in fractions
 * (0..1) of view extent. 0 means at the left of the viewport, 1 means at the
 * right.
 * @property {module:ol/style/Text} [lonLabelStyle] Longitude label text
 * style. If not provided, the following style will be used:
 * ```js
 * new Text({
 *   font: '12px Calibri,sans-serif',
 *   textBaseline: 'bottom',
 *   fill: new Fill({
 *     color: 'rgba(0,0,0,1)'
 *   }),
 *   stroke: new Stroke({
 *     color: 'rgba(255,255,255,1)',
 *     width: 3
 *   })
 * });
 * ```
 * Note that the default's `textBaseline` configuration will not work well for
 * `lonLabelPosition` configurations that position labels close to the top of
 * the viewport.
 * @property {module:ol/style/Text} [latLabelStyle] Latitude label text style.
 * If not provided, the following style will be used:
 * ```js
 * new Text({
 *   font: '12px Calibri,sans-serif',
 *   textAlign: 'end',
 *   fill: new Fill({
 *     color: 'rgba(0,0,0,1)'
 *   }),
 *   stroke: Stroke({
 *     color: 'rgba(255,255,255,1)',
 *     width: 3
 *   })
 * });
 * ```
 * Note that the default's `textAlign` configuration will not work well for
 * `latLabelPosition` configurations that position labels close to the left of
 * the viewport.
 */

/**
 * Render a grid for a coordinate system on a map.
 * @api
 */

var Graticule = function () {

  /**
   * @param {module:ol/Graticule~Options=} opt_options Options.
   */
  function Graticule(opt_options) {
    _classCallCheck(this, Graticule);

    var options = opt_options || {};

    /**
     * @type {module:ol/PluggableMap}
     * @private
     */
    this.map_ = null;

    /**
     * @type {?module:ol/events~EventsKey}
     * @private
     */
    this.postcomposeListenerKey_ = null;

    /**
     * @type {module:ol/proj/Projection}
     */
    this.projection_ = null;

    /**
     * @type {number}
     * @private
     */
    this.maxLat_ = Infinity;

    /**
     * @type {number}
     * @private
     */
    this.maxLon_ = Infinity;

    /**
     * @type {number}
     * @private
     */
    this.minLat_ = -Infinity;

    /**
     * @type {number}
     * @private
     */
    this.minLon_ = -Infinity;

    /**
     * @type {number}
     * @private
     */
    this.maxLatP_ = Infinity;

    /**
     * @type {number}
     * @private
     */
    this.maxLonP_ = Infinity;

    /**
     * @type {number}
     * @private
     */
    this.minLatP_ = -Infinity;

    /**
     * @type {number}
     * @private
     */
    this.minLonP_ = -Infinity;

    /**
     * @type {number}
     * @private
     */
    this.targetSize_ = options.targetSize !== undefined ? options.targetSize : 100;

    /**
     * @type {number}
     * @private
     */
    this.maxLines_ = options.maxLines !== undefined ? options.maxLines : 100;

    /**
     * @type {Array<module:ol/geom/LineString>}
     * @private
     */
    this.meridians_ = [];

    /**
     * @type {Array<module:ol/geom/LineString>}
     * @private
     */
    this.parallels_ = [];

    /**
     * @type {module:ol/style/Stroke}
     * @private
     */
    this.strokeStyle_ = options.strokeStyle !== undefined ? options.strokeStyle : DEFAULT_STROKE_STYLE;

    /**
     * @type {module:ol/proj~TransformFunction|undefined}
     * @private
     */
    this.fromLonLatTransform_ = undefined;

    /**
     * @type {module:ol/proj~TransformFunction|undefined}
     * @private
     */
    this.toLonLatTransform_ = undefined;

    /**
     * @type {module:ol/coordinate~Coordinate}
     * @private
     */
    this.projectionCenterLonLat_ = null;

    /**
     * @type {Array<module:ol/Graticule~GraticuleLabelDataType>}
     * @private
     */
    this.meridiansLabels_ = null;

    /**
     * @type {Array<module:ol/Graticule~GraticuleLabelDataType>}
     * @private
     */
    this.parallelsLabels_ = null;

    if (options.showLabels == true) {

      /**
       * @type {null|function(number):string}
       * @private
       */
      this.lonLabelFormatter_ = options.lonLabelFormatter == undefined ? _coordinate.degreesToStringHDMS.bind(this, 'EW') : options.lonLabelFormatter;

      /**
       * @type {function(number):string}
       * @private
       */
      this.latLabelFormatter_ = options.latLabelFormatter == undefined ? _coordinate.degreesToStringHDMS.bind(this, 'NS') : options.latLabelFormatter;

      /**
       * Longitude label position in fractions (0..1) of view extent. 0 means
       * bottom, 1 means top.
       * @type {number}
       * @private
       */
      this.lonLabelPosition_ = options.lonLabelPosition == undefined ? 0 : options.lonLabelPosition;

      /**
       * Latitude Label position in fractions (0..1) of view extent. 0 means left, 1
       * means right.
       * @type {number}
       * @private
       */
      this.latLabelPosition_ = options.latLabelPosition == undefined ? 1 : options.latLabelPosition;

      /**
       * @type {module:ol/style/Text}
       * @private
       */
      this.lonLabelStyle_ = options.lonLabelStyle !== undefined ? options.lonLabelStyle : new _Text2.default({
        font: '12px Calibri,sans-serif',
        textBaseline: 'bottom',
        fill: new _Fill2.default({
          color: 'rgba(0,0,0,1)'
        }),
        stroke: new _Stroke2.default({
          color: 'rgba(255,255,255,1)',
          width: 3
        })
      });

      /**
       * @type {module:ol/style/Text}
       * @private
       */
      this.latLabelStyle_ = options.latLabelStyle !== undefined ? options.latLabelStyle : new _Text2.default({
        font: '12px Calibri,sans-serif',
        textAlign: 'end',
        fill: new _Fill2.default({
          color: 'rgba(0,0,0,1)'
        }),
        stroke: new _Stroke2.default({
          color: 'rgba(255,255,255,1)',
          width: 3
        })
      });

      this.meridiansLabels_ = [];
      this.parallelsLabels_ = [];
    }

    this.setMap(options.map !== undefined ? options.map : null);
  }

  /**
   * @param {number} lon Longitude.
   * @param {number} minLat Minimal latitude.
   * @param {number} maxLat Maximal latitude.
   * @param {number} squaredTolerance Squared tolerance.
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number} index Index.
   * @return {number} Index.
   * @private
   */


  _createClass(Graticule, [{
    key: 'addMeridian_',
    value: function addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, index) {
      var lineString = this.getMeridian_(lon, minLat, maxLat, squaredTolerance, index);
      if ((0, _extent.intersects)(lineString.getExtent(), extent)) {
        if (this.meridiansLabels_) {
          var textPoint = this.getMeridianPoint_(lineString, extent, index);
          this.meridiansLabels_[index] = {
            geom: textPoint,
            text: this.lonLabelFormatter_(lon)
          };
        }
        this.meridians_[index++] = lineString;
      }
      return index;
    }

    /**
     * @param {module:ol/geom/LineString} lineString Meridian
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} index Index.
     * @return {module:ol/geom/Point} Meridian point.
     * @private
     */

  }, {
    key: 'getMeridianPoint_',
    value: function getMeridianPoint_(lineString, extent, index) {
      var flatCoordinates = lineString.getFlatCoordinates();
      var clampedBottom = Math.max(extent[1], flatCoordinates[1]);
      var clampedTop = Math.min(extent[3], flatCoordinates[flatCoordinates.length - 1]);
      var lat = (0, _math.clamp)(extent[1] + Math.abs(extent[1] - extent[3]) * this.lonLabelPosition_, clampedBottom, clampedTop);
      var coordinate = [flatCoordinates[0], lat];
      var point = void 0;
      if (index in this.meridiansLabels_) {
        point = this.meridiansLabels_[index].geom;
        point.setCoordinates(coordinate);
      } else {
        point = new _Point2.default(coordinate);
      }
      return point;
    }

    /**
     * @param {number} lat Latitude.
     * @param {number} minLon Minimal longitude.
     * @param {number} maxLon Maximal longitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} index Index.
     * @return {number} Index.
     * @private
     */

  }, {
    key: 'addParallel_',
    value: function addParallel_(lat, minLon, maxLon, squaredTolerance, extent, index) {
      var lineString = this.getParallel_(lat, minLon, maxLon, squaredTolerance, index);
      if ((0, _extent.intersects)(lineString.getExtent(), extent)) {
        if (this.parallelsLabels_) {
          var textPoint = this.getParallelPoint_(lineString, extent, index);
          this.parallelsLabels_[index] = {
            geom: textPoint,
            text: this.latLabelFormatter_(lat)
          };
        }
        this.parallels_[index++] = lineString;
      }
      return index;
    }

    /**
     * @param {module:ol/geom/LineString} lineString Parallels.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} index Index.
     * @return {module:ol/geom/Point} Parallel point.
     * @private
     */

  }, {
    key: 'getParallelPoint_',
    value: function getParallelPoint_(lineString, extent, index) {
      var flatCoordinates = lineString.getFlatCoordinates();
      var clampedLeft = Math.max(extent[0], flatCoordinates[0]);
      var clampedRight = Math.min(extent[2], flatCoordinates[flatCoordinates.length - 2]);
      var lon = (0, _math.clamp)(extent[0] + Math.abs(extent[0] - extent[2]) * this.latLabelPosition_, clampedLeft, clampedRight);
      var coordinate = [lon, flatCoordinates[1]];
      var point = void 0;
      if (index in this.parallelsLabels_) {
        point = this.parallelsLabels_[index].geom;
        point.setCoordinates(coordinate);
      } else {
        point = new _Point2.default(coordinate);
      }
      return point;
    }

    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {module:ol/coordinate~Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} squaredTolerance Squared tolerance.
     * @private
     */

  }, {
    key: 'createGraticule_',
    value: function createGraticule_(extent, center, resolution, squaredTolerance) {

      var interval = this.getInterval_(resolution);
      if (interval == -1) {
        this.meridians_.length = this.parallels_.length = 0;
        if (this.meridiansLabels_) {
          this.meridiansLabels_.length = 0;
        }
        if (this.parallelsLabels_) {
          this.parallelsLabels_.length = 0;
        }
        return;
      }

      var centerLonLat = this.toLonLatTransform_(center);
      var centerLon = centerLonLat[0];
      var centerLat = centerLonLat[1];
      var maxLines = this.maxLines_;
      var cnt = void 0,
          idx = void 0,
          lat = void 0,
          lon = void 0;

      var validExtent = [Math.max(extent[0], this.minLonP_), Math.max(extent[1], this.minLatP_), Math.min(extent[2], this.maxLonP_), Math.min(extent[3], this.maxLatP_)];

      validExtent = (0, _proj.transformExtent)(validExtent, this.projection_, 'EPSG:4326');
      var maxLat = validExtent[3];
      var maxLon = validExtent[2];
      var minLat = validExtent[1];
      var minLon = validExtent[0];

      // Create meridians

      centerLon = Math.floor(centerLon / interval) * interval;
      lon = (0, _math.clamp)(centerLon, this.minLon_, this.maxLon_);

      idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, 0);

      cnt = 0;
      while (lon != this.minLon_ && cnt++ < maxLines) {
        lon = Math.max(lon - interval, this.minLon_);
        idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
      }

      lon = (0, _math.clamp)(centerLon, this.minLon_, this.maxLon_);

      cnt = 0;
      while (lon != this.maxLon_ && cnt++ < maxLines) {
        lon = Math.min(lon + interval, this.maxLon_);
        idx = this.addMeridian_(lon, minLat, maxLat, squaredTolerance, extent, idx);
      }

      this.meridians_.length = idx;
      if (this.meridiansLabels_) {
        this.meridiansLabels_.length = idx;
      }

      // Create parallels

      centerLat = Math.floor(centerLat / interval) * interval;
      lat = (0, _math.clamp)(centerLat, this.minLat_, this.maxLat_);

      idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, 0);

      cnt = 0;
      while (lat != this.minLat_ && cnt++ < maxLines) {
        lat = Math.max(lat - interval, this.minLat_);
        idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, idx);
      }

      lat = (0, _math.clamp)(centerLat, this.minLat_, this.maxLat_);

      cnt = 0;
      while (lat != this.maxLat_ && cnt++ < maxLines) {
        lat = Math.min(lat + interval, this.maxLat_);
        idx = this.addParallel_(lat, minLon, maxLon, squaredTolerance, extent, idx);
      }

      this.parallels_.length = idx;
      if (this.parallelsLabels_) {
        this.parallelsLabels_.length = idx;
      }
    }

    /**
     * @param {number} resolution Resolution.
     * @return {number} The interval in degrees.
     * @private
     */

  }, {
    key: 'getInterval_',
    value: function getInterval_(resolution) {
      var centerLon = this.projectionCenterLonLat_[0];
      var centerLat = this.projectionCenterLonLat_[1];
      var interval = -1;
      var target = Math.pow(this.targetSize_ * resolution, 2);
      /** @type {Array<number>} **/
      var p1 = [];
      /** @type {Array<number>} **/
      var p2 = [];
      for (var i = 0, ii = INTERVALS.length; i < ii; ++i) {
        var delta = INTERVALS[i] / 2;
        p1[0] = centerLon - delta;
        p1[1] = centerLat - delta;
        p2[0] = centerLon + delta;
        p2[1] = centerLat + delta;
        this.fromLonLatTransform_(p1, p1);
        this.fromLonLatTransform_(p2, p2);
        var dist = Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2);
        if (dist <= target) {
          break;
        }
        interval = INTERVALS[i];
      }
      return interval;
    }

    /**
     * Get the map associated with this graticule.
     * @return {module:ol/PluggableMap} The map.
     * @api
     */

  }, {
    key: 'getMap',
    value: function getMap() {
      return this.map_;
    }

    /**
     * @param {number} lon Longitude.
     * @param {number} minLat Minimal latitude.
     * @param {number} maxLat Maximal latitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @return {module:ol/geom/LineString} The meridian line string.
     * @param {number} index Index.
     * @private
     */

  }, {
    key: 'getMeridian_',
    value: function getMeridian_(lon, minLat, maxLat, squaredTolerance, index) {
      var flatCoordinates = (0, _geodesic.meridian)(lon, minLat, maxLat, this.projection_, squaredTolerance);
      var lineString = this.meridians_[index];
      if (!lineString) {
        lineString = this.meridians_[index] = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XY);
      } else {
        lineString.setFlatCoordinates(_GeometryLayout2.default.XY, flatCoordinates);
        lineString.changed();
      }
      return lineString;
    }

    /**
     * Get the list of meridians.  Meridians are lines of equal longitude.
     * @return {Array<module:ol/geom/LineString>} The meridians.
     * @api
     */

  }, {
    key: 'getMeridians',
    value: function getMeridians() {
      return this.meridians_;
    }

    /**
     * @param {number} lat Latitude.
     * @param {number} minLon Minimal longitude.
     * @param {number} maxLon Maximal longitude.
     * @param {number} squaredTolerance Squared tolerance.
     * @return {module:ol/geom/LineString} The parallel line string.
     * @param {number} index Index.
     * @private
     */

  }, {
    key: 'getParallel_',
    value: function getParallel_(lat, minLon, maxLon, squaredTolerance, index) {
      var flatCoordinates = (0, _geodesic.parallel)(lat, minLon, maxLon, this.projection_, squaredTolerance);
      var lineString = this.parallels_[index];
      if (!lineString) {
        lineString = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XY);
      } else {
        lineString.setFlatCoordinates(_GeometryLayout2.default.XY, flatCoordinates);
        lineString.changed();
      }
      return lineString;
    }

    /**
     * Get the list of parallels.  Parallels are lines of equal latitude.
     * @return {Array<module:ol/geom/LineString>} The parallels.
     * @api
     */

  }, {
    key: 'getParallels',
    value: function getParallels() {
      return this.parallels_;
    }

    /**
     * @param {module:ol/render/Event} e Event.
     * @private
     */

  }, {
    key: 'handlePostCompose_',
    value: function handlePostCompose_(e) {
      var vectorContext = e.vectorContext;
      var frameState = e.frameState;
      var extent = frameState.extent;
      var viewState = frameState.viewState;
      var center = viewState.center;
      var projection = viewState.projection;
      var resolution = viewState.resolution;
      var pixelRatio = frameState.pixelRatio;
      var squaredTolerance = resolution * resolution / (4 * pixelRatio * pixelRatio);

      var updateProjectionInfo = !this.projection_ || !(0, _proj.equivalent)(this.projection_, projection);

      if (updateProjectionInfo) {
        this.updateProjectionInfo_(projection);
      }

      this.createGraticule_(extent, center, resolution, squaredTolerance);

      // Draw the lines
      vectorContext.setFillStrokeStyle(null, this.strokeStyle_);
      var i = void 0,
          l = void 0,
          line = void 0;
      for (i = 0, l = this.meridians_.length; i < l; ++i) {
        line = this.meridians_[i];
        vectorContext.drawGeometry(line);
      }
      for (i = 0, l = this.parallels_.length; i < l; ++i) {
        line = this.parallels_[i];
        vectorContext.drawGeometry(line);
      }
      var labelData = void 0;
      if (this.meridiansLabels_) {
        for (i = 0, l = this.meridiansLabels_.length; i < l; ++i) {
          labelData = this.meridiansLabels_[i];
          this.lonLabelStyle_.setText(labelData.text);
          vectorContext.setTextStyle(this.lonLabelStyle_);
          vectorContext.drawGeometry(labelData.geom);
        }
      }
      if (this.parallelsLabels_) {
        for (i = 0, l = this.parallelsLabels_.length; i < l; ++i) {
          labelData = this.parallelsLabels_[i];
          this.latLabelStyle_.setText(labelData.text);
          vectorContext.setTextStyle(this.latLabelStyle_);
          vectorContext.drawGeometry(labelData.geom);
        }
      }
    }

    /**
     * @param {module:ol/proj/Projection} projection Projection.
     * @private
     */

  }, {
    key: 'updateProjectionInfo_',
    value: function updateProjectionInfo_(projection) {
      var epsg4326Projection = (0, _proj.get)('EPSG:4326');

      var worldExtent = projection.getWorldExtent();
      var worldExtentP = (0, _proj.transformExtent)(worldExtent, epsg4326Projection, projection);

      this.maxLat_ = worldExtent[3];
      this.maxLon_ = worldExtent[2];
      this.minLat_ = worldExtent[1];
      this.minLon_ = worldExtent[0];

      this.maxLatP_ = worldExtentP[3];
      this.maxLonP_ = worldExtentP[2];
      this.minLatP_ = worldExtentP[1];
      this.minLonP_ = worldExtentP[0];

      this.fromLonLatTransform_ = (0, _proj.getTransform)(epsg4326Projection, projection);

      this.toLonLatTransform_ = (0, _proj.getTransform)(projection, epsg4326Projection);

      this.projectionCenterLonLat_ = this.toLonLatTransform_((0, _extent.getCenter)(projection.getExtent()));

      this.projection_ = projection;
    }

    /**
     * Set the map for this graticule.  The graticule will be rendered on the
     * provided map.
     * @param {module:ol/PluggableMap} map Map.
     * @api
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      if (this.map_) {
        (0, _events.unlistenByKey)(this.postcomposeListenerKey_);
        this.postcomposeListenerKey_ = null;
        this.map_.render();
      }
      if (map) {
        this.postcomposeListenerKey_ = (0, _events.listen)(map, _EventType2.default.POSTCOMPOSE, this.handlePostCompose_, this);
        map.render();
      }
      this.map_ = map;
    }
  }]);

  return Graticule;
}();

exports.default = Graticule;