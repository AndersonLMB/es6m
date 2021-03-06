'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _functions = require('../../functions.js');

var _array = require('../../array.js');

var _colorlike = require('../../colorlike.js');

var _extent = require('../../extent.js');

var _Relationship = require('../../extent/Relationship.js');

var _Relationship2 = _interopRequireDefault(_Relationship);

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _inflate = require('../../geom/flat/inflate.js');

var _length = require('../../geom/flat/length.js');

var _textpath = require('../../geom/flat/textpath.js');

var _transform = require('../../geom/flat/transform.js');

var _has = require('../../has.js');

var _obj = require('../../obj.js');

var _VectorContext2 = require('../VectorContext.js');

var _VectorContext3 = _interopRequireDefault(_VectorContext2);

var _canvas = require('../canvas.js');

var _Instruction = require('../canvas/Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _replay = require('../replay.js');

var _transform2 = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/Replay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {module:ol/extent~Extent}
 */
var tmpExtent = (0, _extent.createEmpty)();

/**
 * @type {!module:ol/transform~Transform}
 */
var tmpTransform = (0, _transform2.create)();

var CanvasReplay = function (_VectorContext) {
  _inherits(CanvasReplay, _VectorContext);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {?} declutterTree Declutter tree.
   */
  function CanvasReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    _classCallCheck(this, CanvasReplay);

    /**
     * @type {?}
     */
    var _this = _possibleConstructorReturn(this, (CanvasReplay.__proto__ || Object.getPrototypeOf(CanvasReplay)).call(this));

    _this.declutterTree = declutterTree;

    /**
     * @protected
     * @type {number}
     */
    _this.tolerance = tolerance;

    /**
     * @protected
     * @const
     * @type {module:ol/extent~Extent}
     */
    _this.maxExtent = maxExtent;

    /**
     * @protected
     * @type {boolean}
     */
    _this.overlaps = overlaps;

    /**
     * @protected
     * @type {number}
     */
    _this.pixelRatio = pixelRatio;

    /**
     * @protected
     * @type {number}
     */
    _this.maxLineWidth = 0;

    /**
     * @protected
     * @const
     * @type {number}
     */
    _this.resolution = resolution;

    /**
     * @private
     * @type {boolean}
     */
    _this.alignFill_;

    /**
     * @private
     * @type {Array<*>}
     */
    _this.beginGeometryInstruction1_ = null;

    /**
     * @private
     * @type {Array<*>}
     */
    _this.beginGeometryInstruction2_ = null;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.bufferedMaxExtent_ = null;

    /**
     * @protected
     * @type {Array<*>}
     */
    _this.instructions = [];

    /**
     * @protected
     * @type {Array<number>}
     */
    _this.coordinates = [];

    /**
     * @private
     * @type {!Object<number,module:ol/coordinate~Coordinate|Array<module:ol/coordinate~Coordinate>|Array<Array<module:ol/coordinate~Coordinate>>>}
     */
    _this.coordinateCache_ = {};

    /**
     * @private
     * @type {!module:ol/transform~Transform}
     */
    _this.renderedTransform_ = (0, _transform2.create)();

    /**
     * @protected
     * @type {Array<*>}
     */
    _this.hitDetectionInstructions = [];

    /**
     * @private
     * @type {Array<number>}
     */
    _this.pixelCoordinates_ = null;

    /**
     * @protected
     * @type {module:ol/render/canvas~FillStrokeState}
     */
    _this.state = /** @type {module:ol/render/canvas~FillStrokeState} */{};

    /**
     * @private
     * @type {number}
     */
    _this.viewRotation_ = 0;

    return _this;
  }

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {module:ol/coordinate~Coordinate} p1 1st point of the background box.
   * @param {module:ol/coordinate~Coordinate} p2 2nd point of the background box.
   * @param {module:ol/coordinate~Coordinate} p3 3rd point of the background box.
   * @param {module:ol/coordinate~Coordinate} p4 4th point of the background box.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   */


  _createClass(CanvasReplay, [{
    key: 'replayTextBackground_',
    value: function replayTextBackground_(context, p1, p2, p3, p4, fillInstruction, strokeInstruction) {
      context.beginPath();
      context.moveTo.apply(context, p1);
      context.lineTo.apply(context, p2);
      context.lineTo.apply(context, p3);
      context.lineTo.apply(context, p4);
      context.lineTo.apply(context, p1);
      if (fillInstruction) {
        this.alignFill_ = /** @type {boolean} */fillInstruction[2];
        this.fill_(context);
      }
      if (strokeInstruction) {
        this.setStrokeStyle_(context, /** @type {Array<*>} */strokeInstruction);
        context.stroke();
      }
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {number} x X.
     * @param {number} y Y.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image Image.
     * @param {number} anchorX Anchor X.
     * @param {number} anchorY Anchor Y.
     * @param {module:ol/render/canvas~DeclutterGroup} declutterGroup Declutter group.
     * @param {number} height Height.
     * @param {number} opacity Opacity.
     * @param {number} originX Origin X.
     * @param {number} originY Origin Y.
     * @param {number} rotation Rotation.
     * @param {number} scale Scale.
     * @param {boolean} snapToPixel Snap to pixel.
     * @param {number} width Width.
     * @param {Array<number>} padding Padding.
     * @param {Array<*>} fillInstruction Fill instruction.
     * @param {Array<*>} strokeInstruction Stroke instruction.
     */

  }, {
    key: 'replayImage_',
    value: function replayImage_(context, x, y, image, anchorX, anchorY, declutterGroup, height, opacity, originX, originY, rotation, scale, snapToPixel, width, padding, fillInstruction, strokeInstruction) {
      var fillStroke = fillInstruction || strokeInstruction;
      anchorX *= scale;
      anchorY *= scale;
      x -= anchorX;
      y -= anchorY;

      var w = width + originX > image.width ? image.width - originX : width;
      var h = height + originY > image.height ? image.height - originY : height;
      var boxW = padding[3] + w * scale + padding[1];
      var boxH = padding[0] + h * scale + padding[2];
      var boxX = x - padding[3];
      var boxY = y - padding[0];

      /** @type {module:ol/coordinate~Coordinate} */
      var p1 = void 0;
      /** @type {module:ol/coordinate~Coordinate} */
      var p2 = void 0;
      /** @type {module:ol/coordinate~Coordinate} */
      var p3 = void 0;
      /** @type {module:ol/coordinate~Coordinate} */
      var p4 = void 0;
      if (fillStroke || rotation !== 0) {
        p1 = [boxX, boxY];
        p2 = [boxX + boxW, boxY];
        p3 = [boxX + boxW, boxY + boxH];
        p4 = [boxX, boxY + boxH];
      }

      var transform = null;
      if (rotation !== 0) {
        var centerX = x + anchorX;
        var centerY = y + anchorY;
        transform = (0, _transform2.compose)(tmpTransform, centerX, centerY, 1, 1, rotation, -centerX, -centerY);

        (0, _extent.createOrUpdateEmpty)(tmpExtent);
        (0, _extent.extendCoordinate)(tmpExtent, (0, _transform2.apply)(tmpTransform, p1));
        (0, _extent.extendCoordinate)(tmpExtent, (0, _transform2.apply)(tmpTransform, p2));
        (0, _extent.extendCoordinate)(tmpExtent, (0, _transform2.apply)(tmpTransform, p3));
        (0, _extent.extendCoordinate)(tmpExtent, (0, _transform2.apply)(tmpTransform, p4));
      } else {
        (0, _extent.createOrUpdate)(boxX, boxY, boxX + boxW, boxY + boxH, tmpExtent);
      }
      var canvas = context.canvas;
      var strokePadding = strokeInstruction ? strokeInstruction[2] * scale / 2 : 0;
      var intersects = tmpExtent[0] - strokePadding <= canvas.width && tmpExtent[2] + strokePadding >= 0 && tmpExtent[1] - strokePadding <= canvas.height && tmpExtent[3] + strokePadding >= 0;

      if (snapToPixel) {
        x = Math.round(x);
        y = Math.round(y);
      }

      if (declutterGroup) {
        if (!intersects && declutterGroup[4] == 1) {
          return;
        }
        (0, _extent.extend)(declutterGroup, tmpExtent);
        var declutterArgs = intersects ? [context, transform ? transform.slice(0) : null, opacity, image, originX, originY, w, h, x, y, scale] : null;
        if (declutterArgs && fillStroke) {
          declutterArgs.push(fillInstruction, strokeInstruction, p1, p2, p3, p4);
        }
        declutterGroup.push(declutterArgs);
      } else if (intersects) {
        if (fillStroke) {
          this.replayTextBackground_(context, p1, p2, p3, p4,
          /** @type {Array<*>} */fillInstruction,
          /** @type {Array<*>} */strokeInstruction);
        }
        (0, _canvas.drawImage)(context, transform, opacity, image, originX, originY, w, h, x, y, scale);
      }
    }

    /**
     * @protected
     * @param {Array<number>} dashArray Dash array.
     * @return {Array<number>} Dash array with pixel ratio applied
     */

  }, {
    key: 'applyPixelRatio',
    value: function applyPixelRatio(dashArray) {
      var pixelRatio = this.pixelRatio;
      return pixelRatio == 1 ? dashArray : dashArray.map(function (dash) {
        return dash * pixelRatio;
      });
    }

    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {boolean} closed Last input coordinate equals first.
     * @param {boolean} skipFirst Skip first coordinate.
     * @protected
     * @return {number} My end.
     */

  }, {
    key: 'appendFlatCoordinates',
    value: function appendFlatCoordinates(flatCoordinates, offset, end, stride, closed, skipFirst) {

      var myEnd = this.coordinates.length;
      var extent = this.getBufferedMaxExtent();
      if (skipFirst) {
        offset += stride;
      }
      var lastCoord = [flatCoordinates[offset], flatCoordinates[offset + 1]];
      var nextCoord = [NaN, NaN];
      var skipped = true;

      var i = void 0,
          lastRel = void 0,
          nextRel = void 0;
      for (i = offset + stride; i < end; i += stride) {
        nextCoord[0] = flatCoordinates[i];
        nextCoord[1] = flatCoordinates[i + 1];
        nextRel = (0, _extent.coordinateRelationship)(extent, nextCoord);
        if (nextRel !== lastRel) {
          if (skipped) {
            this.coordinates[myEnd++] = lastCoord[0];
            this.coordinates[myEnd++] = lastCoord[1];
          }
          this.coordinates[myEnd++] = nextCoord[0];
          this.coordinates[myEnd++] = nextCoord[1];
          skipped = false;
        } else if (nextRel === _Relationship2.default.INTERSECTING) {
          this.coordinates[myEnd++] = nextCoord[0];
          this.coordinates[myEnd++] = nextCoord[1];
          skipped = false;
        } else {
          skipped = true;
        }
        lastCoord[0] = nextCoord[0];
        lastCoord[1] = nextCoord[1];
        lastRel = nextRel;
      }

      // Last coordinate equals first or only one point to append:
      if (closed && skipped || i === offset + stride) {
        this.coordinates[myEnd++] = lastCoord[0];
        this.coordinates[myEnd++] = lastCoord[1];
      }
      return myEnd;
    }

    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {Array<number>} ends Ends.
     * @param {number} stride Stride.
     * @param {Array<number>} replayEnds Replay ends.
     * @return {number} Offset.
     */

  }, {
    key: 'drawCustomCoordinates_',
    value: function drawCustomCoordinates_(flatCoordinates, offset, ends, stride, replayEnds) {
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        var end = ends[i];
        var replayEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
        replayEnds.push(replayEnd);
        offset = end;
      }
      return offset;
    }

    /**
     * @inheritDoc.
     */

  }, {
    key: 'drawCustom',
    value: function drawCustom(geometry, feature, renderer) {
      this.beginGeometry(geometry, feature);
      var type = geometry.getType();
      var stride = geometry.getStride();
      var replayBegin = this.coordinates.length;
      var flatCoordinates = void 0,
          replayEnd = void 0,
          replayEnds = void 0,
          replayEndss = void 0;
      var offset = void 0;
      if (type == _GeometryType2.default.MULTI_POLYGON) {
        geometry = /** @type {module:ol/geom/MultiPolygon} */geometry;
        flatCoordinates = geometry.getOrientedFlatCoordinates();
        replayEndss = [];
        var endss = geometry.getEndss();
        offset = 0;
        for (var i = 0, ii = endss.length; i < ii; ++i) {
          var myEnds = [];
          offset = this.drawCustomCoordinates_(flatCoordinates, offset, endss[i], stride, myEnds);
          replayEndss.push(myEnds);
        }
        this.instructions.push([_Instruction2.default.CUSTOM, replayBegin, replayEndss, geometry, renderer, _inflate.inflateMultiCoordinatesArray]);
      } else if (type == _GeometryType2.default.POLYGON || type == _GeometryType2.default.MULTI_LINE_STRING) {
        replayEnds = [];
        flatCoordinates = type == _GeometryType2.default.POLYGON ?
        /** @type {module:ol/geom/Polygon} */geometry.getOrientedFlatCoordinates() : geometry.getFlatCoordinates();
        offset = this.drawCustomCoordinates_(flatCoordinates, 0,
        /** @type {module:ol/geom/Polygon|module:ol/geom/MultiLineString} */geometry.getEnds(), stride, replayEnds);
        this.instructions.push([_Instruction2.default.CUSTOM, replayBegin, replayEnds, geometry, renderer, _inflate.inflateCoordinatesArray]);
      } else if (type == _GeometryType2.default.LINE_STRING || type == _GeometryType2.default.MULTI_POINT) {
        flatCoordinates = geometry.getFlatCoordinates();
        replayEnd = this.appendFlatCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
        this.instructions.push([_Instruction2.default.CUSTOM, replayBegin, replayEnd, geometry, renderer, _inflate.inflateCoordinates]);
      } else if (type == _GeometryType2.default.POINT) {
        flatCoordinates = geometry.getFlatCoordinates();
        this.coordinates.push(flatCoordinates[0], flatCoordinates[1]);
        replayEnd = this.coordinates.length;
        this.instructions.push([_Instruction2.default.CUSTOM, replayBegin, replayEnd, geometry, renderer]);
      }
      this.endGeometry(geometry, feature);
    }

    /**
     * @protected
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: 'beginGeometry',
    value: function beginGeometry(geometry, feature) {
      this.beginGeometryInstruction1_ = [_Instruction2.default.BEGIN_GEOMETRY, feature, 0];
      this.instructions.push(this.beginGeometryInstruction1_);
      this.beginGeometryInstruction2_ = [_Instruction2.default.BEGIN_GEOMETRY, feature, 0];
      this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     */

  }, {
    key: 'fill_',
    value: function fill_(context) {
      if (this.alignFill_) {
        var origin = (0, _transform2.apply)(this.renderedTransform_, [0, 0]);
        var repeatSize = 512 * this.pixelRatio;
        context.translate(origin[0] % repeatSize, origin[1] % repeatSize);
        context.rotate(this.viewRotation_);
      }
      context.fill();
      if (this.alignFill_) {
        context.setTransform.apply(context, _canvas.resetTransform);
      }
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     * @param {Array<*>} instruction Instruction.
     */

  }, {
    key: 'setStrokeStyle_',
    value: function setStrokeStyle_(context, instruction) {
      context.strokeStyle = /** @type {module:ol/colorlike~ColorLike} */instruction[1];
      context.lineWidth = /** @type {number} */instruction[2];
      context.lineCap = /** @type {string} */instruction[3];
      context.lineJoin = /** @type {string} */instruction[4];
      context.miterLimit = /** @type {number} */instruction[5];
      if (_has.CANVAS_LINE_DASH) {
        context.lineDashOffset = /** @type {number} */instruction[7];
        context.setLineDash( /** @type {Array<number>} */instruction[6]);
      }
    }

    /**
     * @param {module:ol/render/canvas~DeclutterGroup} declutterGroup Declutter group.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: 'renderDeclutter_',
    value: function renderDeclutter_(declutterGroup, feature) {
      if (declutterGroup && declutterGroup.length > 5) {
        var groupCount = declutterGroup[4];
        if (groupCount == 1 || groupCount == declutterGroup.length - 5) {
          /** @type {module:ol/structs/RBush~Entry} */
          var box = {
            minX: /** @type {number} */declutterGroup[0],
            minY: /** @type {number} */declutterGroup[1],
            maxX: /** @type {number} */declutterGroup[2],
            maxY: /** @type {number} */declutterGroup[3],
            value: feature
          };
          if (!this.declutterTree.collides(box)) {
            this.declutterTree.insert(box);
            for (var j = 5, jj = declutterGroup.length; j < jj; ++j) {
              var declutterData = /** @type {Array} */declutterGroup[j];
              if (declutterData) {
                if (declutterData.length > 11) {
                  this.replayTextBackground_(declutterData[0], declutterData[13], declutterData[14], declutterData[15], declutterData[16], declutterData[11], declutterData[12]);
                }
                _canvas.drawImage.apply(undefined, declutterData);
              }
            }
          }
          declutterGroup.length = 5;
          (0, _extent.createOrUpdateEmpty)(declutterGroup);
        }
      }
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/transform~Transform} transform Transform.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features
     *     to skip.
     * @param {Array<*>} instructions Instructions array.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} featureCallback Feature callback.
     * @param {module:ol/extent~Extent=} opt_hitExtent Only check features that intersect this
     *     extent.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'replay_',
    value: function replay_(context, transform, skippedFeaturesHash, instructions, featureCallback, opt_hitExtent) {
      /** @type {Array<number>} */
      var pixelCoordinates = void 0;
      if (this.pixelCoordinates_ && (0, _array.equals)(transform, this.renderedTransform_)) {
        pixelCoordinates = this.pixelCoordinates_;
      } else {
        if (!this.pixelCoordinates_) {
          this.pixelCoordinates_ = [];
        }
        pixelCoordinates = (0, _transform.transform2D)(this.coordinates, 0, this.coordinates.length, 2, transform, this.pixelCoordinates_);
        (0, _transform2.setFromArray)(this.renderedTransform_, transform);
      }
      var skipFeatures = !(0, _obj.isEmpty)(skippedFeaturesHash);
      var i = 0; // instruction index
      var ii = instructions.length; // end of instructions
      var d = 0; // data index
      var dd = void 0; // end of per-instruction data
      var anchorX = void 0,
          anchorY = void 0,
          prevX = void 0,
          prevY = void 0,
          roundX = void 0,
          roundY = void 0,
          declutterGroup = void 0,
          image = void 0;
      var pendingFill = 0;
      var pendingStroke = 0;
      var lastFillInstruction = null;
      var lastStrokeInstruction = null;
      var coordinateCache = this.coordinateCache_;
      var viewRotation = this.viewRotation_;

      var state = /** @type {module:ol/render~State} */{
        context: context,
        pixelRatio: this.pixelRatio,
        resolution: this.resolution,
        rotation: viewRotation
      };

      // When the batch size gets too big, performance decreases. 200 is a good
      // balance between batch size and number of fill/stroke instructions.
      var batchSize = this.instructions != instructions || this.overlaps ? 0 : 200;
      var /** @type {module:ol/Feature|module:ol/render/Feature} */feature = void 0;
      var x = void 0,
          y = void 0;
      while (i < ii) {
        var instruction = instructions[i];
        var type = /** @type {module:ol/render/canvas/Instruction} */instruction[0];
        switch (type) {
          case _Instruction2.default.BEGIN_GEOMETRY:
            feature = /** @type {module:ol/Feature|module:ol/render/Feature} */instruction[1];
            if (skipFeatures && skippedFeaturesHash[(0, _util.getUid)(feature).toString()] || !feature.getGeometry()) {
              i = /** @type {number} */instruction[2];
            } else if (opt_hitExtent !== undefined && !(0, _extent.intersects)(opt_hitExtent, feature.getGeometry().getExtent())) {
              i = /** @type {number} */instruction[2] + 1;
            } else {
              ++i;
            }
            break;
          case _Instruction2.default.BEGIN_PATH:
            if (pendingFill > batchSize) {
              this.fill_(context);
              pendingFill = 0;
            }
            if (pendingStroke > batchSize) {
              context.stroke();
              pendingStroke = 0;
            }
            if (!pendingFill && !pendingStroke) {
              context.beginPath();
              prevX = prevY = NaN;
            }
            ++i;
            break;
          case _Instruction2.default.CIRCLE:
            d = /** @type {number} */instruction[1];
            var x1 = pixelCoordinates[d];
            var y1 = pixelCoordinates[d + 1];
            var x2 = pixelCoordinates[d + 2];
            var y2 = pixelCoordinates[d + 3];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var r = Math.sqrt(dx * dx + dy * dy);
            context.moveTo(x1 + r, y1);
            context.arc(x1, y1, r, 0, 2 * Math.PI, true);
            ++i;
            break;
          case _Instruction2.default.CLOSE_PATH:
            context.closePath();
            ++i;
            break;
          case _Instruction2.default.CUSTOM:
            d = /** @type {number} */instruction[1];
            dd = instruction[2];
            var geometry = /** @type {module:ol/geom/SimpleGeometry} */instruction[3];
            var renderer = instruction[4];
            var fn = instruction.length == 6 ? instruction[5] : undefined;
            state.geometry = geometry;
            state.feature = feature;
            if (!(i in coordinateCache)) {
              coordinateCache[i] = [];
            }
            var coords = coordinateCache[i];
            if (fn) {
              fn(pixelCoordinates, d, dd, 2, coords);
            } else {
              coords[0] = pixelCoordinates[d];
              coords[1] = pixelCoordinates[d + 1];
              coords.length = 2;
            }
            renderer(coords, state);
            ++i;
            break;
          case _Instruction2.default.DRAW_IMAGE:
            d = /** @type {number} */instruction[1];
            dd = /** @type {number} */instruction[2];
            image = /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */
            instruction[3];
            // Remaining arguments in DRAW_IMAGE are in alphabetical order
            anchorX = /** @type {number} */instruction[4];
            anchorY = /** @type {number} */instruction[5];
            declutterGroup = featureCallback ? null : /** @type {module:ol/render/canvas~DeclutterGroup} */instruction[6];
            var height = /** @type {number} */instruction[7];
            var opacity = /** @type {number} */instruction[8];
            var originX = /** @type {number} */instruction[9];
            var originY = /** @type {number} */instruction[10];
            var rotateWithView = /** @type {boolean} */instruction[11];
            var rotation = /** @type {number} */instruction[12];
            var scale = /** @type {number} */instruction[13];
            var snapToPixel = /** @type {boolean} */instruction[14];
            var width = /** @type {number} */instruction[15];

            var padding = void 0,
                backgroundFill = void 0,
                backgroundStroke = void 0;
            if (instruction.length > 16) {
              padding = /** @type {Array<number>} */instruction[16];
              backgroundFill = /** @type {boolean} */instruction[17];
              backgroundStroke = /** @type {boolean} */instruction[18];
            } else {
              padding = _canvas.defaultPadding;
              backgroundFill = backgroundStroke = false;
            }

            if (rotateWithView) {
              rotation += viewRotation;
            }
            for (; d < dd; d += 2) {
              this.replayImage_(context, pixelCoordinates[d], pixelCoordinates[d + 1], image, anchorX, anchorY, declutterGroup, height, opacity, originX, originY, rotation, scale, snapToPixel, width, padding, backgroundFill ? /** @type {Array<*>} */lastFillInstruction : null, backgroundStroke ? /** @type {Array<*>} */lastStrokeInstruction : null);
            }
            this.renderDeclutter_(declutterGroup, feature);
            ++i;
            break;
          case _Instruction2.default.DRAW_CHARS:
            var begin = /** @type {number} */instruction[1];
            var end = /** @type {number} */instruction[2];
            var baseline = /** @type {number} */instruction[3];
            declutterGroup = featureCallback ? null : /** @type {module:ol/render/canvas~DeclutterGroup} */instruction[4];
            var overflow = /** @type {number} */instruction[5];
            var fillKey = /** @type {string} */instruction[6];
            var maxAngle = /** @type {number} */instruction[7];
            var measure = /** @type {function(string):number} */instruction[8];
            var offsetY = /** @type {number} */instruction[9];
            var strokeKey = /** @type {string} */instruction[10];
            var strokeWidth = /** @type {number} */instruction[11];
            var text = /** @type {string} */instruction[12];
            var textKey = /** @type {string} */instruction[13];
            var textScale = /** @type {number} */instruction[14];

            var pathLength = (0, _length.lineStringLength)(pixelCoordinates, begin, end, 2);
            var textLength = measure(text);
            if (overflow || textLength <= pathLength) {
              var textAlign = /** @type {module:ol~render} */this.textStates[textKey].textAlign;
              var startM = (pathLength - textLength) * _replay.TEXT_ALIGN[textAlign];
              var parts = (0, _textpath.drawTextOnPath)(pixelCoordinates, begin, end, 2, text, measure, startM, maxAngle);
              if (parts) {
                var c = void 0,
                    cc = void 0,
                    chars = void 0,
                    label = void 0,
                    part = void 0;
                if (strokeKey) {
                  for (c = 0, cc = parts.length; c < cc; ++c) {
                    part = parts[c]; // x, y, anchorX, rotation, chunk
                    chars = /** @type {string} */part[4];
                    label = /** @type {module:ol~render} */this.getImage(chars, textKey, '', strokeKey);
                    anchorX = /** @type {number} */part[2] + strokeWidth;
                    anchorY = baseline * label.height + (0.5 - baseline) * 2 * strokeWidth - offsetY;
                    this.replayImage_(context,
                    /** @type {number} */part[0], /** @type {number} */part[1], label, anchorX, anchorY, declutterGroup, label.height, 1, 0, 0,
                    /** @type {number} */part[3], textScale, false, label.width, _canvas.defaultPadding, null, null);
                  }
                }
                if (fillKey) {
                  for (c = 0, cc = parts.length; c < cc; ++c) {
                    part = parts[c]; // x, y, anchorX, rotation, chunk
                    chars = /** @type {string} */part[4];
                    label = /** @type {module:ol~render} */this.getImage(chars, textKey, fillKey, '');
                    anchorX = /** @type {number} */part[2];
                    anchorY = baseline * label.height - offsetY;
                    this.replayImage_(context,
                    /** @type {number} */part[0], /** @type {number} */part[1], label, anchorX, anchorY, declutterGroup, label.height, 1, 0, 0,
                    /** @type {number} */part[3], textScale, false, label.width, _canvas.defaultPadding, null, null);
                  }
                }
              }
            }
            this.renderDeclutter_(declutterGroup, feature);
            ++i;
            break;
          case _Instruction2.default.END_GEOMETRY:
            if (featureCallback !== undefined) {
              feature = /** @type {module:ol/Feature|module:ol/render/Feature} */instruction[1];
              var result = featureCallback(feature);
              if (result) {
                return result;
              }
            }
            ++i;
            break;
          case _Instruction2.default.FILL:
            if (batchSize) {
              pendingFill++;
            } else {
              this.fill_(context);
            }
            ++i;
            break;
          case _Instruction2.default.MOVE_TO_LINE_TO:
            d = /** @type {number} */instruction[1];
            dd = /** @type {number} */instruction[2];
            x = pixelCoordinates[d];
            y = pixelCoordinates[d + 1];
            roundX = x + 0.5 | 0;
            roundY = y + 0.5 | 0;
            if (roundX !== prevX || roundY !== prevY) {
              context.moveTo(x, y);
              prevX = roundX;
              prevY = roundY;
            }
            for (d += 2; d < dd; d += 2) {
              x = pixelCoordinates[d];
              y = pixelCoordinates[d + 1];
              roundX = x + 0.5 | 0;
              roundY = y + 0.5 | 0;
              if (d == dd - 2 || roundX !== prevX || roundY !== prevY) {
                context.lineTo(x, y);
                prevX = roundX;
                prevY = roundY;
              }
            }
            ++i;
            break;
          case _Instruction2.default.SET_FILL_STYLE:
            lastFillInstruction = instruction;
            this.alignFill_ = instruction[2];

            if (pendingFill) {
              this.fill_(context);
              pendingFill = 0;
              if (pendingStroke) {
                context.stroke();
                pendingStroke = 0;
              }
            }

            context.fillStyle = /** @type {module:ol/colorlike~ColorLike} */instruction[1];
            ++i;
            break;
          case _Instruction2.default.SET_STROKE_STYLE:
            lastStrokeInstruction = instruction;
            if (pendingStroke) {
              context.stroke();
              pendingStroke = 0;
            }
            this.setStrokeStyle_(context, /** @type {Array<*>} */instruction);
            ++i;
            break;
          case _Instruction2.default.STROKE:
            if (batchSize) {
              pendingStroke++;
            } else {
              context.stroke();
            }
            ++i;
            break;
          default:
            ++i; // consume the instruction anyway, to avoid an infinite loop
            break;
        }
      }
      if (pendingFill) {
        this.fill_(context);
      }
      if (pendingStroke) {
        context.stroke();
      }
      return undefined;
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/transform~Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features
     *     to skip.
     */

  }, {
    key: 'replay',
    value: function replay(context, transform, viewRotation, skippedFeaturesHash) {
      this.viewRotation_ = viewRotation;
      this.replay_(context, transform, skippedFeaturesHash, this.instructions, undefined, undefined);
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/transform~Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features
     *     to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T=} opt_featureCallback
     *     Feature callback.
     * @param {module:ol/extent~Extent=} opt_hitExtent Only check features that intersect this
     *     extent.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'replayHitDetection',
    value: function replayHitDetection(context, transform, viewRotation, skippedFeaturesHash, opt_featureCallback, opt_hitExtent) {
      this.viewRotation_ = viewRotation;
      return this.replay_(context, transform, skippedFeaturesHash, this.hitDetectionInstructions, opt_featureCallback, opt_hitExtent);
    }

    /**
     * Reverse the hit detection instructions.
     */

  }, {
    key: 'reverseHitDetectionInstructions',
    value: function reverseHitDetectionInstructions() {
      var hitDetectionInstructions = this.hitDetectionInstructions;
      // step 1 - reverse array
      hitDetectionInstructions.reverse();
      // step 2 - reverse instructions within geometry blocks
      var i = void 0;
      var n = hitDetectionInstructions.length;
      var instruction = void 0;
      var type = void 0;
      var begin = -1;
      for (i = 0; i < n; ++i) {
        instruction = hitDetectionInstructions[i];
        type = /** @type {module:ol/render/canvas/Instruction} */instruction[0];
        if (type == _Instruction2.default.END_GEOMETRY) {
          begin = i;
        } else if (type == _Instruction2.default.BEGIN_GEOMETRY) {
          instruction[2] = i;
          (0, _array.reverseSubArray)(this.hitDetectionInstructions, begin, i);
          begin = -1;
        }
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setFillStrokeStyle',
    value: function setFillStrokeStyle(fillStyle, strokeStyle) {
      var state = this.state;
      if (fillStyle) {
        var fillStyleColor = fillStyle.getColor();
        state.fillStyle = (0, _colorlike.asColorLike)(fillStyleColor ? fillStyleColor : _canvas.defaultFillStyle);
      } else {
        state.fillStyle = undefined;
      }
      if (strokeStyle) {
        var strokeStyleColor = strokeStyle.getColor();
        state.strokeStyle = (0, _colorlike.asColorLike)(strokeStyleColor ? strokeStyleColor : _canvas.defaultStrokeStyle);
        var strokeStyleLineCap = strokeStyle.getLineCap();
        state.lineCap = strokeStyleLineCap !== undefined ? strokeStyleLineCap : _canvas.defaultLineCap;
        var strokeStyleLineDash = strokeStyle.getLineDash();
        state.lineDash = strokeStyleLineDash ? strokeStyleLineDash.slice() : _canvas.defaultLineDash;
        var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
        state.lineDashOffset = strokeStyleLineDashOffset ? strokeStyleLineDashOffset : _canvas.defaultLineDashOffset;
        var strokeStyleLineJoin = strokeStyle.getLineJoin();
        state.lineJoin = strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : _canvas.defaultLineJoin;
        var strokeStyleWidth = strokeStyle.getWidth();
        state.lineWidth = strokeStyleWidth !== undefined ? strokeStyleWidth : _canvas.defaultLineWidth;
        var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
        state.miterLimit = strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : _canvas.defaultMiterLimit;

        if (state.lineWidth > this.maxLineWidth) {
          this.maxLineWidth = state.lineWidth;
          // invalidate the buffered max extent cache
          this.bufferedMaxExtent_ = null;
        }
      } else {
        state.strokeStyle = undefined;
        state.lineCap = undefined;
        state.lineDash = null;
        state.lineDashOffset = undefined;
        state.lineJoin = undefined;
        state.lineWidth = undefined;
        state.miterLimit = undefined;
      }
    }

    /**
     * @param {module:ol/render/canvas~FillStrokeState} state State.
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     * @return {Array<*>} Fill instruction.
     */

  }, {
    key: 'createFill',
    value: function createFill(state, geometry) {
      var fillStyle = state.fillStyle;
      var fillInstruction = [_Instruction2.default.SET_FILL_STYLE, fillStyle];
      if (typeof fillStyle !== 'string') {
        // Fill is a pattern or gradient - align it!
        fillInstruction.push(true);
      }
      return fillInstruction;
    }

    /**
     * @param {module:ol/render/canvas~FillStrokeState} state State.
     */

  }, {
    key: 'applyStroke',
    value: function applyStroke(state) {
      this.instructions.push(this.createStroke(state));
    }

    /**
     * @param {module:ol/render/canvas~FillStrokeState} state State.
     * @return {Array<*>} Stroke instruction.
     */

  }, {
    key: 'createStroke',
    value: function createStroke(state) {
      return [_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth * this.pixelRatio, state.lineCap, state.lineJoin, state.miterLimit, this.applyPixelRatio(state.lineDash), state.lineDashOffset * this.pixelRatio];
    }

    /**
     * @param {module:ol/render/canvas~FillStrokeState} state State.
     * @param {function(this:module:ol/render/canvas/Replay, module:ol/render/canvas~FillStrokeState, (module:ol/geom/Geometry|module:ol/render/Feature)):Array<*>} createFill Create fill.
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     */

  }, {
    key: 'updateFillStyle',
    value: function updateFillStyle(state, createFill, geometry) {
      var fillStyle = state.fillStyle;
      if (typeof fillStyle !== 'string' || state.currentFillStyle != fillStyle) {
        if (fillStyle !== undefined) {
          this.instructions.push(createFill.call(this, state, geometry));
        }
        state.currentFillStyle = fillStyle;
      }
    }

    /**
     * @param {module:ol/render/canvas~FillStrokeState} state State.
     * @param {function(this:module:ol/render/canvas/Replay, module:ol/render/canvas~FillStrokeState)} applyStroke Apply stroke.
     */

  }, {
    key: 'updateStrokeStyle',
    value: function updateStrokeStyle(state, applyStroke) {
      var strokeStyle = state.strokeStyle;
      var lineCap = state.lineCap;
      var lineDash = state.lineDash;
      var lineDashOffset = state.lineDashOffset;
      var lineJoin = state.lineJoin;
      var lineWidth = state.lineWidth;
      var miterLimit = state.miterLimit;
      if (state.currentStrokeStyle != strokeStyle || state.currentLineCap != lineCap || lineDash != state.currentLineDash && !(0, _array.equals)(state.currentLineDash, lineDash) || state.currentLineDashOffset != lineDashOffset || state.currentLineJoin != lineJoin || state.currentLineWidth != lineWidth || state.currentMiterLimit != miterLimit) {
        if (strokeStyle !== undefined) {
          applyStroke.call(this, state);
        }
        state.currentStrokeStyle = strokeStyle;
        state.currentLineCap = lineCap;
        state.currentLineDash = lineDash;
        state.currentLineDashOffset = lineDashOffset;
        state.currentLineJoin = lineJoin;
        state.currentLineWidth = lineWidth;
        state.currentMiterLimit = miterLimit;
      }
    }

    /**
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: 'endGeometry',
    value: function endGeometry(geometry, feature) {
      this.beginGeometryInstruction1_[2] = this.instructions.length;
      this.beginGeometryInstruction1_ = null;
      this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
      this.beginGeometryInstruction2_ = null;
      var endGeometryInstruction = [_Instruction2.default.END_GEOMETRY, feature];
      this.instructions.push(endGeometryInstruction);
      this.hitDetectionInstructions.push(endGeometryInstruction);
    }

    /**
     * Get the buffered rendering extent.  Rendering will be clipped to the extent
     * provided to the constructor.  To account for symbolizers that may intersect
     * this extent, we calculate a buffered extent (e.g. based on stroke width).
     * @return {module:ol/extent~Extent} The buffered rendering extent.
     * @protected
     */

  }, {
    key: 'getBufferedMaxExtent',
    value: function getBufferedMaxExtent() {
      if (!this.bufferedMaxExtent_) {
        this.bufferedMaxExtent_ = (0, _extent.clone)(this.maxExtent);
        if (this.maxLineWidth > 0) {
          var width = this.resolution * (this.maxLineWidth + 1) / 2;
          (0, _extent.buffer)(this.bufferedMaxExtent_, width, this.bufferedMaxExtent_);
        }
      }
      return this.bufferedMaxExtent_;
    }
  }]);

  return CanvasReplay;
}(_VectorContext3.default);

/**
 * FIXME empty description for jsdoc
 */


CanvasReplay.prototype.finish = _functions.VOID;

exports.default = CanvasReplay;