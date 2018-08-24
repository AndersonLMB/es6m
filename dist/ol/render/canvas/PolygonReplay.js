'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _color = require('../../color.js');

var _simplify = require('../../geom/flat/simplify.js');

var _canvas = require('../canvas.js');

var _Instruction = require('../canvas/Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('../canvas/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/PolygonReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CanvasPolygonReplay = function (_CanvasReplay) {
  _inherits(CanvasPolygonReplay, _CanvasReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {?} declutterTree Declutter tree.
   */
  function CanvasPolygonReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    _classCallCheck(this, CanvasPolygonReplay);

    return _possibleConstructorReturn(this, (CanvasPolygonReplay.__proto__ || Object.getPrototypeOf(CanvasPolygonReplay)).call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree));
  }

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */


  _createClass(CanvasPolygonReplay, [{
    key: 'drawFlatCoordinatess_',
    value: function drawFlatCoordinatess_(flatCoordinates, offset, ends, stride) {
      var state = this.state;
      var fill = state.fillStyle !== undefined;
      var stroke = state.strokeStyle != undefined;
      var numEnds = ends.length;
      this.instructions.push(_Instruction.beginPathInstruction);
      this.hitDetectionInstructions.push(_Instruction.beginPathInstruction);
      for (var i = 0; i < numEnds; ++i) {
        var end = ends[i];
        var myBegin = this.coordinates.length;
        var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, true, !stroke);
        var moveToLineToInstruction = [_Instruction2.default.MOVE_TO_LINE_TO, myBegin, myEnd];
        this.instructions.push(moveToLineToInstruction);
        this.hitDetectionInstructions.push(moveToLineToInstruction);
        if (stroke) {
          // Performance optimization: only call closePath() when we have a stroke.
          // Otherwise the ring is closed already (see appendFlatCoordinates above).
          this.instructions.push(_Instruction.closePathInstruction);
          this.hitDetectionInstructions.push(_Instruction.closePathInstruction);
        }
        offset = end;
      }
      if (fill) {
        this.instructions.push(_Instruction.fillInstruction);
        this.hitDetectionInstructions.push(_Instruction.fillInstruction);
      }
      if (stroke) {
        this.instructions.push(_Instruction.strokeInstruction);
        this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
      }
      return offset;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawCircle',
    value: function drawCircle(circleGeometry, feature) {
      var state = this.state;
      var fillStyle = state.fillStyle;
      var strokeStyle = state.strokeStyle;
      if (fillStyle === undefined && strokeStyle === undefined) {
        return;
      }
      this.setFillStrokeStyles_(circleGeometry);
      this.beginGeometry(circleGeometry, feature);
      if (state.fillStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
      }
      if (state.strokeStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
      }
      var flatCoordinates = circleGeometry.getFlatCoordinates();
      var stride = circleGeometry.getStride();
      var myBegin = this.coordinates.length;
      this.appendFlatCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
      var circleInstruction = [_Instruction2.default.CIRCLE, myBegin];
      this.instructions.push(_Instruction.beginPathInstruction, circleInstruction);
      this.hitDetectionInstructions.push(_Instruction.beginPathInstruction, circleInstruction);
      this.hitDetectionInstructions.push(_Instruction.fillInstruction);
      if (state.fillStyle !== undefined) {
        this.instructions.push(_Instruction.fillInstruction);
      }
      if (state.strokeStyle !== undefined) {
        this.instructions.push(_Instruction.strokeInstruction);
        this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
      }
      this.endGeometry(circleGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawPolygon',
    value: function drawPolygon(polygonGeometry, feature) {
      var state = this.state;
      var fillStyle = state.fillStyle;
      var strokeStyle = state.strokeStyle;
      if (fillStyle === undefined && strokeStyle === undefined) {
        return;
      }
      this.setFillStrokeStyles_(polygonGeometry);
      this.beginGeometry(polygonGeometry, feature);
      if (state.fillStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
      }
      if (state.strokeStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
      }
      var ends = polygonGeometry.getEnds();
      var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
      var stride = polygonGeometry.getStride();
      this.drawFlatCoordinatess_(flatCoordinates, 0, ends, stride);
      this.endGeometry(polygonGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiPolygon',
    value: function drawMultiPolygon(multiPolygonGeometry, feature) {
      var state = this.state;
      var fillStyle = state.fillStyle;
      var strokeStyle = state.strokeStyle;
      if (fillStyle === undefined && strokeStyle === undefined) {
        return;
      }
      this.setFillStrokeStyles_(multiPolygonGeometry);
      this.beginGeometry(multiPolygonGeometry, feature);
      if (state.fillStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
      }
      if (state.strokeStyle !== undefined) {
        this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
      }
      var endss = multiPolygonGeometry.getEndss();
      var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
      var stride = multiPolygonGeometry.getStride();
      var offset = 0;
      for (var i = 0, ii = endss.length; i < ii; ++i) {
        offset = this.drawFlatCoordinatess_(flatCoordinates, offset, endss[i], stride);
      }
      this.endGeometry(multiPolygonGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish() {
      this.reverseHitDetectionInstructions();
      this.state = null;
      // We want to preserve topology when drawing polygons.  Polygons are
      // simplified using quantization and point elimination. However, we might
      // have received a mix of quantized and non-quantized geometries, so ensure
      // that all are quantized by quantizing all coordinates in the batch.
      var tolerance = this.tolerance;
      if (tolerance !== 0) {
        var coordinates = this.coordinates;
        for (var i = 0, ii = coordinates.length; i < ii; ++i) {
          coordinates[i] = (0, _simplify.snap)(coordinates[i], tolerance);
        }
      }
    }

    /**
     * @private
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     */

  }, {
    key: 'setFillStrokeStyles_',
    value: function setFillStrokeStyles_(geometry) {
      var state = this.state;
      var fillStyle = state.fillStyle;
      if (fillStyle !== undefined) {
        this.updateFillStyle(state, this.createFill, geometry);
      }
      if (state.strokeStyle !== undefined) {
        this.updateStrokeStyle(state, this.applyStroke);
      }
    }
  }]);

  return CanvasPolygonReplay;
}(_Replay2.default);

exports.default = CanvasPolygonReplay;