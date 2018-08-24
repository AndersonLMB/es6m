'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Instruction = require('../canvas/Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('../canvas/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/LineStringReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CanvasLineStringReplay = function (_CanvasReplay) {
  _inherits(CanvasLineStringReplay, _CanvasReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {?} declutterTree Declutter tree.
   */
  function CanvasLineStringReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    _classCallCheck(this, CanvasLineStringReplay);

    return _possibleConstructorReturn(this, (CanvasLineStringReplay.__proto__ || Object.getPrototypeOf(CanvasLineStringReplay)).call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree));
  }

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} end.
   */


  _createClass(CanvasLineStringReplay, [{
    key: 'drawFlatCoordinates_',
    value: function drawFlatCoordinates_(flatCoordinates, offset, end, stride) {
      var myBegin = this.coordinates.length;
      var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
      var moveToLineToInstruction = [_Instruction2.default.MOVE_TO_LINE_TO, myBegin, myEnd];
      this.instructions.push(moveToLineToInstruction);
      this.hitDetectionInstructions.push(moveToLineToInstruction);
      return end;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawLineString',
    value: function drawLineString(lineStringGeometry, feature) {
      var state = this.state;
      var strokeStyle = state.strokeStyle;
      var lineWidth = state.lineWidth;
      if (strokeStyle === undefined || lineWidth === undefined) {
        return;
      }
      this.updateStrokeStyle(state, this.applyStroke);
      this.beginGeometry(lineStringGeometry, feature);
      this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset], _Instruction.beginPathInstruction);
      var flatCoordinates = lineStringGeometry.getFlatCoordinates();
      var stride = lineStringGeometry.getStride();
      this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
      this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
      this.endGeometry(lineStringGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiLineString',
    value: function drawMultiLineString(multiLineStringGeometry, feature) {
      var state = this.state;
      var strokeStyle = state.strokeStyle;
      var lineWidth = state.lineWidth;
      if (strokeStyle === undefined || lineWidth === undefined) {
        return;
      }
      this.updateStrokeStyle(state, this.applyStroke);
      this.beginGeometry(multiLineStringGeometry, feature);
      this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset], _Instruction.beginPathInstruction);
      var ends = multiLineStringGeometry.getEnds();
      var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
      var stride = multiLineStringGeometry.getStride();
      var offset = 0;
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        offset = this.drawFlatCoordinates_(flatCoordinates, offset, ends[i], stride);
      }
      this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
      this.endGeometry(multiLineStringGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish() {
      var state = this.state;
      if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
        this.instructions.push(_Instruction.strokeInstruction);
      }
      this.reverseHitDetectionInstructions();
      this.state = null;
    }

    /**
     * @inheritDoc.
     */

  }, {
    key: 'applyStroke',
    value: function applyStroke(state) {
      if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
        this.instructions.push(_Instruction.strokeInstruction);
        state.lastStroke = this.coordinates.length;
      }
      state.lastStroke = 0;
      _Replay2.default.prototype.applyStroke.call(this, state);
      this.instructions.push(_Instruction.beginPathInstruction);
    }
  }]);

  return CanvasLineStringReplay;
}(_Replay2.default);

exports.default = CanvasLineStringReplay;