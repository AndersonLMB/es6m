'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.measureTextWidths = measureTextWidths;

var _util = require('../../util.js');

var _colorlike = require('../../colorlike.js');

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _straightchunk = require('../../geom/flat/straightchunk.js');

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _has = require('../../has.js');

var _canvas = require('../canvas.js');

var _Instruction = require('../canvas/Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('../canvas/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

var _replay = require('../replay.js');

var _TextPlacement = require('../../style/TextPlacement.js');

var _TextPlacement2 = _interopRequireDefault(_TextPlacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/TextReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CanvasTextReplay = function (_CanvasReplay) {
  _inherits(CanvasTextReplay, _CanvasReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {?} declutterTree Declutter tree.
   */
  function CanvasTextReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    _classCallCheck(this, CanvasTextReplay);

    /**
     * @private
     * @type {module:ol/render/canvas~DeclutterGroup}
     */
    var _this = _possibleConstructorReturn(this, (CanvasTextReplay.__proto__ || Object.getPrototypeOf(CanvasTextReplay)).call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree));

    _this.declutterGroup_;

    /**
     * @private
     * @type {Array<HTMLCanvasElement>}
     */
    _this.labels_ = null;

    /**
     * @private
     * @type {string}
     */
    _this.text_ = '';

    /**
     * @private
     * @type {number}
     */
    _this.textOffsetX_ = 0;

    /**
     * @private
     * @type {number}
     */
    _this.textOffsetY_ = 0;

    /**
     * @private
     * @type {boolean|undefined}
     */
    _this.textRotateWithView_ = undefined;

    /**
     * @private
     * @type {number}
     */
    _this.textRotation_ = 0;

    /**
     * @private
     * @type {?module:ol/render/canvas~FillState}
     */
    _this.textFillState_ = null;

    /**
     * @type {!Object<string, module:ol/render/canvas~FillState>}
     */
    _this.fillStates = {};

    /**
     * @private
     * @type {?module:ol/render/canvas~StrokeState}
     */
    _this.textStrokeState_ = null;

    /**
     * @type {!Object<string, module:ol/render/canvas~StrokeState>}
     */
    _this.strokeStates = {};

    /**
     * @private
     * @type {module:ol/render/canvas~TextState}
     */
    _this.textState_ = /** @type {module:ol/render/canvas~TextState} */{};

    /**
     * @type {!Object<string, module:ol/render/canvas~TextState>}
     */
    _this.textStates = {};

    /**
     * @private
     * @type {string}
     */
    _this.textKey_ = '';

    /**
     * @private
     * @type {string}
     */
    _this.fillKey_ = '';

    /**
     * @private
     * @type {string}
     */
    _this.strokeKey_ = '';

    /**
     * @private
     * @type {Object<string, Object<string, number>>}
     */
    _this.widths_ = {};

    _canvas.labelCache.prune();

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(CanvasTextReplay, [{
    key: 'drawText',
    value: function drawText(geometry, feature) {
      var fillState = this.textFillState_;
      var strokeState = this.textStrokeState_;
      var textState = this.textState_;
      if (this.text_ === '' || !textState || !fillState && !strokeState) {
        return;
      }

      var begin = this.coordinates.length;

      var geometryType = geometry.getType();
      var flatCoordinates = null;
      var end = 2;
      var stride = 2;
      var i = void 0,
          ii = void 0;

      if (textState.placement === _TextPlacement2.default.LINE) {
        if (!(0, _extent.intersects)(this.getBufferedMaxExtent(), geometry.getExtent())) {
          return;
        }
        var ends = void 0;
        flatCoordinates = geometry.getFlatCoordinates();
        stride = geometry.getStride();
        if (geometryType == _GeometryType2.default.LINE_STRING) {
          ends = [flatCoordinates.length];
        } else if (geometryType == _GeometryType2.default.MULTI_LINE_STRING) {
          ends = geometry.getEnds();
        } else if (geometryType == _GeometryType2.default.POLYGON) {
          ends = geometry.getEnds().slice(0, 1);
        } else if (geometryType == _GeometryType2.default.MULTI_POLYGON) {
          var endss = geometry.getEndss();
          ends = [];
          for (i = 0, ii = endss.length; i < ii; ++i) {
            ends.push(endss[i][0]);
          }
        }
        this.beginGeometry(geometry, feature);
        var textAlign = textState.textAlign;
        var flatOffset = 0;
        var flatEnd = void 0;
        for (var o = 0, oo = ends.length; o < oo; ++o) {
          if (textAlign == undefined) {
            var range = (0, _straightchunk.matchingChunk)(textState.maxAngle, flatCoordinates, flatOffset, ends[o], stride);
            flatOffset = range[0];
            flatEnd = range[1];
          } else {
            flatEnd = ends[o];
          }
          for (i = flatOffset; i < flatEnd; i += stride) {
            this.coordinates.push(flatCoordinates[i], flatCoordinates[i + 1]);
          }
          end = this.coordinates.length;
          flatOffset = ends[o];
          this.drawChars_(begin, end, this.declutterGroup_);
          begin = end;
        }
        this.endGeometry(geometry, feature);
      } else {
        var label = this.getImage(this.text_, this.textKey_, this.fillKey_, this.strokeKey_);
        var width = label.width / this.pixelRatio;
        switch (geometryType) {
          case _GeometryType2.default.POINT:
          case _GeometryType2.default.MULTI_POINT:
            flatCoordinates = geometry.getFlatCoordinates();
            end = flatCoordinates.length;
            break;
          case _GeometryType2.default.LINE_STRING:
            flatCoordinates = /** @type {module:ol/geom/LineString} */geometry.getFlatMidpoint();
            break;
          case _GeometryType2.default.CIRCLE:
            flatCoordinates = /** @type {module:ol/geom/Circle} */geometry.getCenter();
            break;
          case _GeometryType2.default.MULTI_LINE_STRING:
            flatCoordinates = /** @type {module:ol/geom/MultiLineString} */geometry.getFlatMidpoints();
            end = flatCoordinates.length;
            break;
          case _GeometryType2.default.POLYGON:
            flatCoordinates = /** @type {module:ol/geom/Polygon} */geometry.getFlatInteriorPoint();
            if (!textState.overflow && flatCoordinates[2] / this.resolution < width) {
              return;
            }
            stride = 3;
            break;
          case _GeometryType2.default.MULTI_POLYGON:
            var interiorPoints = /** @type {module:ol/geom/MultiPolygon} */geometry.getFlatInteriorPoints();
            flatCoordinates = [];
            for (i = 0, ii = interiorPoints.length; i < ii; i += 3) {
              if (textState.overflow || interiorPoints[i + 2] / this.resolution >= width) {
                flatCoordinates.push(interiorPoints[i], interiorPoints[i + 1]);
              }
            }
            end = flatCoordinates.length;
            if (end == 0) {
              return;
            }
            break;
          default:
        }
        end = this.appendFlatCoordinates(flatCoordinates, 0, end, stride, false, false);
        if (textState.backgroundFill || textState.backgroundStroke) {
          this.setFillStrokeStyle(textState.backgroundFill, textState.backgroundStroke);
          if (textState.backgroundFill) {
            this.updateFillStyle(this.state, this.createFill, geometry);
            this.hitDetectionInstructions.push(this.createFill(this.state, geometry));
          }
          if (textState.backgroundStroke) {
            this.updateStrokeStyle(this.state, this.applyStroke);
            this.hitDetectionInstructions.push(this.createStroke(this.state));
          }
        }
        this.beginGeometry(geometry, feature);
        this.drawTextImage_(label, begin, end);
        this.endGeometry(geometry, feature);
      }
    }

    /**
     * @param {string} text Text.
     * @param {string} textKey Text style key.
     * @param {string} fillKey Fill style key.
     * @param {string} strokeKey Stroke style key.
     * @return {HTMLCanvasElement} Image.
     */

  }, {
    key: 'getImage',
    value: function getImage(text, textKey, fillKey, strokeKey) {
      var label = void 0;
      var key = strokeKey + textKey + text + fillKey + this.pixelRatio;

      if (!_canvas.labelCache.containsKey(key)) {
        var strokeState = strokeKey ? this.strokeStates[strokeKey] || this.textStrokeState_ : null;
        var fillState = fillKey ? this.fillStates[fillKey] || this.textFillState_ : null;
        var textState = this.textStates[textKey] || this.textState_;
        var pixelRatio = this.pixelRatio;
        var scale = textState.scale * pixelRatio;
        var align = _replay.TEXT_ALIGN[textState.textAlign || _canvas.defaultTextAlign];
        var strokeWidth = strokeKey && strokeState.lineWidth ? strokeState.lineWidth : 0;

        var lines = text.split('\n');
        var numLines = lines.length;
        var widths = [];
        var width = measureTextWidths(textState.font, lines, widths);
        var lineHeight = (0, _canvas.measureTextHeight)(textState.font);
        var height = lineHeight * numLines;
        var renderWidth = width + strokeWidth;
        var context = (0, _dom.createCanvasContext2D)(Math.ceil(renderWidth * scale), Math.ceil((height + strokeWidth) * scale));
        label = context.canvas;
        _canvas.labelCache.set(key, label);
        if (scale != 1) {
          context.scale(scale, scale);
        }
        context.font = textState.font;
        if (strokeKey) {
          context.strokeStyle = strokeState.strokeStyle;
          context.lineWidth = strokeWidth;
          context.lineCap = strokeState.lineCap;
          context.lineJoin = strokeState.lineJoin;
          context.miterLimit = strokeState.miterLimit;
          if (_has.CANVAS_LINE_DASH && strokeState.lineDash.length) {
            context.setLineDash(strokeState.lineDash);
            context.lineDashOffset = strokeState.lineDashOffset;
          }
        }
        if (fillKey) {
          context.fillStyle = fillState.fillStyle;
        }
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        var leftRight = 0.5 - align;
        var x = align * label.width / scale + leftRight * strokeWidth;
        var i = void 0;
        if (strokeKey) {
          for (i = 0; i < numLines; ++i) {
            context.strokeText(lines[i], x + leftRight * widths[i], 0.5 * (strokeWidth + lineHeight) + i * lineHeight);
          }
        }
        if (fillKey) {
          for (i = 0; i < numLines; ++i) {
            context.fillText(lines[i], x + leftRight * widths[i], 0.5 * (strokeWidth + lineHeight) + i * lineHeight);
          }
        }
      }
      return _canvas.labelCache.get(key);
    }

    /**
     * @private
     * @param {HTMLCanvasElement} label Label.
     * @param {number} begin Begin.
     * @param {number} end End.
     */

  }, {
    key: 'drawTextImage_',
    value: function drawTextImage_(label, begin, end) {
      var textState = this.textState_;
      var strokeState = this.textStrokeState_;
      var pixelRatio = this.pixelRatio;
      var align = _replay.TEXT_ALIGN[textState.textAlign || _canvas.defaultTextAlign];
      var baseline = _replay.TEXT_ALIGN[textState.textBaseline];
      var strokeWidth = strokeState && strokeState.lineWidth ? strokeState.lineWidth : 0;

      var anchorX = align * label.width / pixelRatio + 2 * (0.5 - align) * strokeWidth;
      var anchorY = baseline * label.height / pixelRatio + 2 * (0.5 - baseline) * strokeWidth;
      this.instructions.push([_Instruction2.default.DRAW_IMAGE, begin, end, label, (anchorX - this.textOffsetX_) * pixelRatio, (anchorY - this.textOffsetY_) * pixelRatio, this.declutterGroup_, label.height, 1, 0, 0, this.textRotateWithView_, this.textRotation_, 1, true, label.width, textState.padding == _canvas.defaultPadding ? _canvas.defaultPadding : textState.padding.map(function (p) {
        return p * pixelRatio;
      }), !!textState.backgroundFill, !!textState.backgroundStroke]);
      this.hitDetectionInstructions.push([_Instruction2.default.DRAW_IMAGE, begin, end, label, (anchorX - this.textOffsetX_) * pixelRatio, (anchorY - this.textOffsetY_) * pixelRatio, this.declutterGroup_, label.height, 1, 0, 0, this.textRotateWithView_, this.textRotation_, 1 / pixelRatio, true, label.width, textState.padding, !!textState.backgroundFill, !!textState.backgroundStroke]);
    }

    /**
     * @private
     * @param {number} begin Begin.
     * @param {number} end End.
     * @param {module:ol/render/canvas~DeclutterGroup} declutterGroup Declutter group.
     */

  }, {
    key: 'drawChars_',
    value: function drawChars_(begin, end, declutterGroup) {
      var strokeState = this.textStrokeState_;
      var textState = this.textState_;
      var fillState = this.textFillState_;

      var strokeKey = this.strokeKey_;
      if (strokeState) {
        if (!(strokeKey in this.strokeStates)) {
          this.strokeStates[strokeKey] = /** @type {module:ol/render/canvas~StrokeState} */{
            strokeStyle: strokeState.strokeStyle,
            lineCap: strokeState.lineCap,
            lineDashOffset: strokeState.lineDashOffset,
            lineWidth: strokeState.lineWidth,
            lineJoin: strokeState.lineJoin,
            miterLimit: strokeState.miterLimit,
            lineDash: strokeState.lineDash
          };
        }
      }
      var textKey = this.textKey_;
      if (!(this.textKey_ in this.textStates)) {
        this.textStates[this.textKey_] = /** @type {module:ol/render/canvas~TextState} */{
          font: textState.font,
          textAlign: textState.textAlign || _canvas.defaultTextAlign,
          scale: textState.scale
        };
      }
      var fillKey = this.fillKey_;
      if (fillState) {
        if (!(fillKey in this.fillStates)) {
          this.fillStates[fillKey] = /** @type {module:ol/render/canvas~FillState} */{
            fillStyle: fillState.fillStyle
          };
        }
      }

      var pixelRatio = this.pixelRatio;
      var baseline = _replay.TEXT_ALIGN[textState.textBaseline];

      var offsetY = this.textOffsetY_ * pixelRatio;
      var text = this.text_;
      var font = textState.font;
      var textScale = textState.scale;
      var strokeWidth = strokeState ? strokeState.lineWidth * textScale / 2 : 0;
      var widths = this.widths_[font];
      if (!widths) {
        this.widths_[font] = widths = {};
      }
      this.instructions.push([_Instruction2.default.DRAW_CHARS, begin, end, baseline, declutterGroup, textState.overflow, fillKey, textState.maxAngle, function (text) {
        var width = widths[text];
        if (!width) {
          width = widths[text] = (0, _canvas.measureTextWidth)(font, text);
        }
        return width * textScale * pixelRatio;
      }, offsetY, strokeKey, strokeWidth * pixelRatio, text, textKey, 1]);
      this.hitDetectionInstructions.push([_Instruction2.default.DRAW_CHARS, begin, end, baseline, declutterGroup, textState.overflow, fillKey, textState.maxAngle, function (text) {
        var width = widths[text];
        if (!width) {
          width = widths[text] = (0, _canvas.measureTextWidth)(font, text);
        }
        return width * textScale;
      }, offsetY, strokeKey, strokeWidth, text, textKey, 1 / pixelRatio]);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setTextStyle',
    value: function setTextStyle(textStyle, declutterGroup) {
      var textState = void 0,
          fillState = void 0,
          strokeState = void 0;
      if (!textStyle) {
        this.text_ = '';
      } else {
        this.declutterGroup_ = /** @type {module:ol/render/canvas~DeclutterGroup} */declutterGroup;

        var textFillStyle = textStyle.getFill();
        if (!textFillStyle) {
          fillState = this.textFillState_ = null;
        } else {
          fillState = this.textFillState_;
          if (!fillState) {
            fillState = this.textFillState_ = /** @type {module:ol/render/canvas~FillState} */{};
          }
          fillState.fillStyle = (0, _colorlike.asColorLike)(textFillStyle.getColor() || _canvas.defaultFillStyle);
        }

        var textStrokeStyle = textStyle.getStroke();
        if (!textStrokeStyle) {
          strokeState = this.textStrokeState_ = null;
        } else {
          strokeState = this.textStrokeState_;
          if (!strokeState) {
            strokeState = this.textStrokeState_ = /** @type {module:ol/render/canvas~StrokeState} */{};
          }
          var lineDash = textStrokeStyle.getLineDash();
          var lineDashOffset = textStrokeStyle.getLineDashOffset();
          var lineWidth = textStrokeStyle.getWidth();
          var miterLimit = textStrokeStyle.getMiterLimit();
          strokeState.lineCap = textStrokeStyle.getLineCap() || _canvas.defaultLineCap;
          strokeState.lineDash = lineDash ? lineDash.slice() : _canvas.defaultLineDash;
          strokeState.lineDashOffset = lineDashOffset === undefined ? _canvas.defaultLineDashOffset : lineDashOffset;
          strokeState.lineJoin = textStrokeStyle.getLineJoin() || _canvas.defaultLineJoin;
          strokeState.lineWidth = lineWidth === undefined ? _canvas.defaultLineWidth : lineWidth;
          strokeState.miterLimit = miterLimit === undefined ? _canvas.defaultMiterLimit : miterLimit;
          strokeState.strokeStyle = (0, _colorlike.asColorLike)(textStrokeStyle.getColor() || _canvas.defaultStrokeStyle);
        }

        textState = this.textState_;
        var font = textStyle.getFont() || _canvas.defaultFont;
        (0, _canvas.checkFont)(font);
        var textScale = textStyle.getScale();
        textState.overflow = textStyle.getOverflow();
        textState.font = font;
        textState.maxAngle = textStyle.getMaxAngle();
        textState.placement = textStyle.getPlacement();
        textState.textAlign = textStyle.getTextAlign();
        textState.textBaseline = textStyle.getTextBaseline() || _canvas.defaultTextBaseline;
        textState.backgroundFill = textStyle.getBackgroundFill();
        textState.backgroundStroke = textStyle.getBackgroundStroke();
        textState.padding = textStyle.getPadding() || _canvas.defaultPadding;
        textState.scale = textScale === undefined ? 1 : textScale;

        var textOffsetX = textStyle.getOffsetX();
        var textOffsetY = textStyle.getOffsetY();
        var textRotateWithView = textStyle.getRotateWithView();
        var textRotation = textStyle.getRotation();
        this.text_ = textStyle.getText() || '';
        this.textOffsetX_ = textOffsetX === undefined ? 0 : textOffsetX;
        this.textOffsetY_ = textOffsetY === undefined ? 0 : textOffsetY;
        this.textRotateWithView_ = textRotateWithView === undefined ? false : textRotateWithView;
        this.textRotation_ = textRotation === undefined ? 0 : textRotation;

        this.strokeKey_ = strokeState ? (typeof strokeState.strokeStyle == 'string' ? strokeState.strokeStyle : (0, _util.getUid)(strokeState.strokeStyle)) + strokeState.lineCap + strokeState.lineDashOffset + '|' + strokeState.lineWidth + strokeState.lineJoin + strokeState.miterLimit + '[' + strokeState.lineDash.join() + ']' : '';
        this.textKey_ = textState.font + textState.scale + (textState.textAlign || '?');
        this.fillKey_ = fillState ? typeof fillState.fillStyle == 'string' ? fillState.fillStyle : '|' + (0, _util.getUid)(fillState.fillStyle) : '';
      }
    }
  }]);

  return CanvasTextReplay;
}(_Replay2.default);

/**
 * @param {string} font Font to use for measuring.
 * @param {Array<string>} lines Lines to measure.
 * @param {Array<number>} widths Array will be populated with the widths of
 * each line.
 * @return {number} Width of the whole text.
 */


function measureTextWidths(font, lines, widths) {
  var numLines = lines.length;
  var width = 0;
  for (var i = 0; i < numLines; ++i) {
    var currentWidth = (0, _canvas.measureTextWidth)(font, lines[i]);
    width = Math.max(width, currentWidth);
    widths.push(currentWidth);
  }
  return width;
}

exports.default = CanvasTextReplay;