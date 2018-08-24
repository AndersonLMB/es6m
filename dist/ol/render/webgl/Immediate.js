'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../../extent.js');

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _ReplayType = require('../ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

var _VectorContext2 = require('../VectorContext.js');

var _VectorContext3 = _interopRequireDefault(_VectorContext2);

var _ReplayGroup = require('../webgl/ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/Immediate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var WebGLImmediateRenderer = function (_VectorContext) {
  _inherits(WebGLImmediateRenderer, _VectorContext);

  /**
   * @param {module:ol/webgl/Context} context Context.
   * @param {module:ol/coordinate~Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {module:ol/size~Size} size Size.
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {number} pixelRatio Pixel ratio.
   */
  function WebGLImmediateRenderer(context, center, resolution, rotation, size, extent, pixelRatio) {
    _classCallCheck(this, WebGLImmediateRenderer);

    /**
     * @private
     */
    var _this = _possibleConstructorReturn(this, (WebGLImmediateRenderer.__proto__ || Object.getPrototypeOf(WebGLImmediateRenderer)).call(this));

    _this.context_ = context;

    /**
     * @private
     */
    _this.center_ = center;

    /**
     * @private
     */
    _this.extent_ = extent;

    /**
     * @private
     */
    _this.pixelRatio_ = pixelRatio;

    /**
     * @private
     */
    _this.size_ = size;

    /**
     * @private
     */
    _this.rotation_ = rotation;

    /**
     * @private
     */
    _this.resolution_ = resolution;

    /**
     * @private
     * @type {module:ol/style/Image}
     */
    _this.imageStyle_ = null;

    /**
     * @private
     * @type {module:ol/style/Fill}
     */
    _this.fillStyle_ = null;

    /**
     * @private
     * @type {module:ol/style/Stroke}
     */
    _this.strokeStyle_ = null;

    /**
     * @private
     * @type {module:ol/style/Text}
     */
    _this.textStyle_ = null;

    return _this;
  }

  /**
   * @param {module:ol/render/webgl/ReplayGroup} replayGroup Replay group.
   * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
   * @private
   */


  _createClass(WebGLImmediateRenderer, [{
    key: 'drawText_',
    value: function drawText_(replayGroup, geometry) {
      var context = this.context_;
      var replay = /** @type {module:ol/render/webgl/TextReplay} */replayGroup.getReplay(0, _ReplayType2.default.TEXT);
      replay.setTextStyle(this.textStyle_);
      replay.drawText(geometry, null);
      replay.finish(context);
      // default colors
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();
    }

    /**
     * Set the rendering style.  Note that since this is an immediate rendering API,
     * any `zIndex` on the provided style will be ignored.
     *
     * @param {module:ol/style/Style} style The rendering style.
     * @override
     * @api
     */

  }, {
    key: 'setStyle',
    value: function setStyle(style) {
      this.setFillStrokeStyle(style.getFill(), style.getStroke());
      this.setImageStyle(style.getImage());
      this.setTextStyle(style.getText());
    }

    /**
     * Render a geometry into the canvas.  Call
     * {@link ol/render/webgl/Immediate#setStyle} first to set the rendering style.
     *
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry The geometry to render.
     * @override
     * @api
     */

  }, {
    key: 'drawGeometry',
    value: function drawGeometry(geometry) {
      var type = geometry.getType();
      switch (type) {
        case _GeometryType2.default.POINT:
          this.drawPoint( /** @type {module:ol/geom/Point} */geometry, null);
          break;
        case _GeometryType2.default.LINE_STRING:
          this.drawLineString( /** @type {module:ol/geom/LineString} */geometry, null);
          break;
        case _GeometryType2.default.POLYGON:
          this.drawPolygon( /** @type {module:ol/geom/Polygon} */geometry, null);
          break;
        case _GeometryType2.default.MULTI_POINT:
          this.drawMultiPoint( /** @type {module:ol/geom/MultiPoint} */geometry, null);
          break;
        case _GeometryType2.default.MULTI_LINE_STRING:
          this.drawMultiLineString( /** @type {module:ol/geom/MultiLineString} */geometry, null);
          break;
        case _GeometryType2.default.MULTI_POLYGON:
          this.drawMultiPolygon( /** @type {module:ol/geom/MultiPolygon} */geometry, null);
          break;
        case _GeometryType2.default.GEOMETRY_COLLECTION:
          this.drawGeometryCollection( /** @type {module:ol/geom/GeometryCollection} */geometry, null);
          break;
        case _GeometryType2.default.CIRCLE:
          this.drawCircle( /** @type {module:ol/geom/Circle} */geometry, null);
          break;
        default:
        // pass
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'drawFeature',
    value: function drawFeature(feature, style) {
      var geometry = style.getGeometryFunction()(feature);
      if (!geometry || !(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
        return;
      }
      this.setStyle(style);
      this.drawGeometry(geometry);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawGeometryCollection',
    value: function drawGeometryCollection(geometry, data) {
      var geometries = geometry.getGeometriesArray();
      var i = void 0,
          ii = void 0;
      for (i = 0, ii = geometries.length; i < ii; ++i) {
        this.drawGeometry(geometries[i]);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawPoint',
    value: function drawPoint(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/ImageReplay} */replayGroup.getReplay(0, _ReplayType2.default.IMAGE);
      replay.setImageStyle(this.imageStyle_);
      replay.drawPoint(geometry, data);
      replay.finish(context);
      // default colors
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiPoint',
    value: function drawMultiPoint(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/ImageReplay} */replayGroup.getReplay(0, _ReplayType2.default.IMAGE);
      replay.setImageStyle(this.imageStyle_);
      replay.drawMultiPoint(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawLineString',
    value: function drawLineString(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/LineStringReplay} */replayGroup.getReplay(0, _ReplayType2.default.LINE_STRING);
      replay.setFillStrokeStyle(null, this.strokeStyle_);
      replay.drawLineString(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiLineString',
    value: function drawMultiLineString(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/LineStringReplay} */replayGroup.getReplay(0, _ReplayType2.default.LINE_STRING);
      replay.setFillStrokeStyle(null, this.strokeStyle_);
      replay.drawMultiLineString(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawPolygon',
    value: function drawPolygon(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/PolygonReplay} */replayGroup.getReplay(0, _ReplayType2.default.POLYGON);
      replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
      replay.drawPolygon(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiPolygon',
    value: function drawMultiPolygon(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/PolygonReplay} */replayGroup.getReplay(0, _ReplayType2.default.POLYGON);
      replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
      replay.drawMultiPolygon(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawCircle',
    value: function drawCircle(geometry, data) {
      var context = this.context_;
      var replayGroup = new _ReplayGroup2.default(1, this.extent_);
      var replay = /** @type {module:ol/render/webgl/CircleReplay} */replayGroup.getReplay(0, _ReplayType2.default.CIRCLE);
      replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
      replay.drawCircle(geometry, data);
      replay.finish(context);
      var opacity = 1;
      var skippedFeatures = {};
      var featureCallback = void 0;
      var oneByOne = false;
      replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
      replay.getDeleteResourcesFunction(context)();

      if (this.textStyle_) {
        this.drawText_(replayGroup, geometry);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setImageStyle',
    value: function setImageStyle(imageStyle) {
      this.imageStyle_ = imageStyle;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setFillStrokeStyle',
    value: function setFillStrokeStyle(fillStyle, strokeStyle) {
      this.fillStyle_ = fillStyle;
      this.strokeStyle_ = strokeStyle;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setTextStyle',
    value: function setTextStyle(textStyle) {
      this.textStyle_ = textStyle;
    }
  }]);

  return WebGLImmediateRenderer;
}(_VectorContext3.default);

exports.default = WebGLImmediateRenderer;