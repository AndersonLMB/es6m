'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _array = require('../../array.js');

var _color = require('../../color.js');

var _extent = require('../../extent.js');

var _orient = require('../../geom/flat/orient.js');

var _transform = require('../../geom/flat/transform.js');

var _topology = require('../../geom/flat/topology.js');

var _obj = require('../../obj.js');

var _webgl = require('../webgl.js');

var _Replay = require('../webgl/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

var _defaultshader = require('../webgl/linestringreplay/defaultshader.js');

var _Locations = require('../webgl/linestringreplay/defaultshader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _webgl2 = require('../../webgl.js');

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/LineStringReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {number}
 */
var Instruction = {
  ROUND: 2,
  BEGIN_LINE: 3,
  END_LINE: 5,
  BEGIN_LINE_CAP: 7,
  END_LINE_CAP: 11,
  BEVEL_FIRST: 13,
  BEVEL_SECOND: 17,
  MITER_BOTTOM: 19,
  MITER_TOP: 23
};

var WebGLLineStringReplay = function (_WebGLReplay) {
  _inherits(WebGLLineStringReplay, _WebGLReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   */
  function WebGLLineStringReplay(tolerance, maxExtent) {
    _classCallCheck(this, WebGLLineStringReplay);

    /**
     * @private
     * @type {module:ol/render/webgl/linestringreplay/defaultshader/Locations}
     */
    var _this = _possibleConstructorReturn(this, (WebGLLineStringReplay.__proto__ || Object.getPrototypeOf(WebGLLineStringReplay)).call(this, tolerance, maxExtent));

    _this.defaultLocations_ = null;

    /**
     * @private
     * @type {Array<Array<?>>}
     */
    _this.styles_ = [];

    /**
     * @private
     * @type {Array<number>}
     */
    _this.styleIndices_ = [];

    /**
     * @private
     * @type {{strokeColor: (Array<number>|null),
     *         lineCap: (string|undefined),
     *         lineDash: Array<number>,
     *         lineDashOffset: (number|undefined),
     *         lineJoin: (string|undefined),
     *         lineWidth: (number|undefined),
     *         miterLimit: (number|undefined),
     *         changed: boolean}|null}
     */
    _this.state_ = {
      strokeColor: null,
      lineCap: undefined,
      lineDash: null,
      lineDashOffset: undefined,
      lineJoin: undefined,
      lineWidth: undefined,
      miterLimit: undefined,
      changed: false
    };

    return _this;
  }

  /**
   * Draw one segment.
   * @private
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   */


  _createClass(WebGLLineStringReplay, [{
    key: 'drawCoordinates_',
    value: function drawCoordinates_(flatCoordinates, offset, end, stride) {

      var i = void 0,
          ii = void 0;
      var numVertices = this.vertices.length;
      var numIndices = this.indices.length;
      //To save a vertex, the direction of a point is a product of the sign (1 or -1), a prime from
      //Instruction, and a rounding factor (1 or 2). If the product is even,
      //we round it. If it is odd, we don't.
      var lineJoin = this.state_.lineJoin === 'bevel' ? 0 : this.state_.lineJoin === 'miter' ? 1 : 2;
      var lineCap = this.state_.lineCap === 'butt' ? 0 : this.state_.lineCap === 'square' ? 1 : 2;
      var closed = (0, _topology.lineStringIsClosed)(flatCoordinates, offset, end, stride);
      var startCoords = void 0,
          sign = void 0,
          n = void 0;
      var lastIndex = numIndices;
      var lastSign = 1;
      //We need the adjacent vertices to define normals in joins. p0 = last, p1 = current, p2 = next.
      var p0 = void 0,
          p1 = void 0,
          p2 = void 0;

      for (i = offset, ii = end; i < ii; i += stride) {

        n = numVertices / 7;

        p0 = p1;
        p1 = p2 || [flatCoordinates[i], flatCoordinates[i + 1]];
        //First vertex.
        if (i === offset) {
          p2 = [flatCoordinates[i + stride], flatCoordinates[i + stride + 1]];
          if (end - offset === stride * 2 && (0, _array.equals)(p1, p2)) {
            break;
          }
          if (closed) {
            //A closed line! Complete the circle.
            p0 = [flatCoordinates[end - stride * 2], flatCoordinates[end - stride * 2 + 1]];

            startCoords = p2;
          } else {
            //Add the first two/four vertices.

            if (lineCap) {
              numVertices = this.addVertices_([0, 0], p1, p2, lastSign * Instruction.BEGIN_LINE_CAP * lineCap, numVertices);

              numVertices = this.addVertices_([0, 0], p1, p2, -lastSign * Instruction.BEGIN_LINE_CAP * lineCap, numVertices);

              this.indices[numIndices++] = n + 2;
              this.indices[numIndices++] = n;
              this.indices[numIndices++] = n + 1;

              this.indices[numIndices++] = n + 1;
              this.indices[numIndices++] = n + 3;
              this.indices[numIndices++] = n + 2;
            }

            numVertices = this.addVertices_([0, 0], p1, p2, lastSign * Instruction.BEGIN_LINE * (lineCap || 1), numVertices);

            numVertices = this.addVertices_([0, 0], p1, p2, -lastSign * Instruction.BEGIN_LINE * (lineCap || 1), numVertices);

            lastIndex = numVertices / 7 - 1;

            continue;
          }
        } else if (i === end - stride) {
          //Last vertex.
          if (closed) {
            //Same as the first vertex.
            p2 = startCoords;
            break;
          } else {
            p0 = p0 || [0, 0];

            numVertices = this.addVertices_(p0, p1, [0, 0], lastSign * Instruction.END_LINE * (lineCap || 1), numVertices);

            numVertices = this.addVertices_(p0, p1, [0, 0], -lastSign * Instruction.END_LINE * (lineCap || 1), numVertices);

            this.indices[numIndices++] = n;
            this.indices[numIndices++] = lastIndex - 1;
            this.indices[numIndices++] = lastIndex;

            this.indices[numIndices++] = lastIndex;
            this.indices[numIndices++] = n + 1;
            this.indices[numIndices++] = n;

            if (lineCap) {
              numVertices = this.addVertices_(p0, p1, [0, 0], lastSign * Instruction.END_LINE_CAP * lineCap, numVertices);

              numVertices = this.addVertices_(p0, p1, [0, 0], -lastSign * Instruction.END_LINE_CAP * lineCap, numVertices);

              this.indices[numIndices++] = n + 2;
              this.indices[numIndices++] = n;
              this.indices[numIndices++] = n + 1;

              this.indices[numIndices++] = n + 1;
              this.indices[numIndices++] = n + 3;
              this.indices[numIndices++] = n + 2;
            }

            break;
          }
        } else {
          p2 = [flatCoordinates[i + stride], flatCoordinates[i + stride + 1]];
        }

        // We group CW and straight lines, thus the not so inituitive CCW checking function.
        sign = (0, _webgl.triangleIsCounterClockwise)(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]) ? -1 : 1;

        numVertices = this.addVertices_(p0, p1, p2, sign * Instruction.BEVEL_FIRST * (lineJoin || 1), numVertices);

        numVertices = this.addVertices_(p0, p1, p2, sign * Instruction.BEVEL_SECOND * (lineJoin || 1), numVertices);

        numVertices = this.addVertices_(p0, p1, p2, -sign * Instruction.MITER_BOTTOM * (lineJoin || 1), numVertices);

        if (i > offset) {
          this.indices[numIndices++] = n;
          this.indices[numIndices++] = lastIndex - 1;
          this.indices[numIndices++] = lastIndex;

          this.indices[numIndices++] = n + 2;
          this.indices[numIndices++] = n;
          this.indices[numIndices++] = lastSign * sign > 0 ? lastIndex : lastIndex - 1;
        }

        this.indices[numIndices++] = n;
        this.indices[numIndices++] = n + 2;
        this.indices[numIndices++] = n + 1;

        lastIndex = n + 2;
        lastSign = sign;

        //Add miter
        if (lineJoin) {
          numVertices = this.addVertices_(p0, p1, p2, sign * Instruction.MITER_TOP * lineJoin, numVertices);

          this.indices[numIndices++] = n + 1;
          this.indices[numIndices++] = n + 3;
          this.indices[numIndices++] = n;
        }
      }

      if (closed) {
        n = n || numVertices / 7;
        sign = (0, _orient.linearRingIsClockwise)([p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]], 0, 6, 2) ? 1 : -1;

        numVertices = this.addVertices_(p0, p1, p2, sign * Instruction.BEVEL_FIRST * (lineJoin || 1), numVertices);

        numVertices = this.addVertices_(p0, p1, p2, -sign * Instruction.MITER_BOTTOM * (lineJoin || 1), numVertices);

        this.indices[numIndices++] = n;
        this.indices[numIndices++] = lastIndex - 1;
        this.indices[numIndices++] = lastIndex;

        this.indices[numIndices++] = n + 1;
        this.indices[numIndices++] = n;
        this.indices[numIndices++] = lastSign * sign > 0 ? lastIndex : lastIndex - 1;
      }
    }

    /**
     * @param {Array<number>} p0 Last coordinates.
     * @param {Array<number>} p1 Current coordinates.
     * @param {Array<number>} p2 Next coordinates.
     * @param {number} product Sign, instruction, and rounding product.
     * @param {number} numVertices Vertex counter.
     * @return {number} Vertex counter.
     * @private
     */

  }, {
    key: 'addVertices_',
    value: function addVertices_(p0, p1, p2, product, numVertices) {
      this.vertices[numVertices++] = p0[0];
      this.vertices[numVertices++] = p0[1];
      this.vertices[numVertices++] = p1[0];
      this.vertices[numVertices++] = p1[1];
      this.vertices[numVertices++] = p2[0];
      this.vertices[numVertices++] = p2[1];
      this.vertices[numVertices++] = product;

      return numVertices;
    }

    /**
     * Check if the linestring can be drawn (i. e. valid).
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {boolean} The linestring can be drawn.
     * @private
     */

  }, {
    key: 'isValid_',
    value: function isValid_(flatCoordinates, offset, end, stride) {
      var range = end - offset;
      if (range < stride * 2) {
        return false;
      } else if (range === stride * 2) {
        var firstP = [flatCoordinates[offset], flatCoordinates[offset + 1]];
        var lastP = [flatCoordinates[offset + stride], flatCoordinates[offset + stride + 1]];
        return !(0, _array.equals)(firstP, lastP);
      }

      return true;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawLineString',
    value: function drawLineString(lineStringGeometry, feature) {
      var flatCoordinates = lineStringGeometry.getFlatCoordinates();
      var stride = lineStringGeometry.getStride();
      if (this.isValid_(flatCoordinates, 0, flatCoordinates.length, stride)) {
        flatCoordinates = (0, _transform.translate)(flatCoordinates, 0, flatCoordinates.length, stride, -this.origin[0], -this.origin[1]);
        if (this.state_.changed) {
          this.styleIndices_.push(this.indices.length);
          this.state_.changed = false;
        }
        this.startIndices.push(this.indices.length);
        this.startIndicesFeature.push(feature);
        this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiLineString',
    value: function drawMultiLineString(multiLineStringGeometry, feature) {
      var indexCount = this.indices.length;
      var ends = multiLineStringGeometry.getEnds();
      ends.unshift(0);
      var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
      var stride = multiLineStringGeometry.getStride();
      var i = void 0,
          ii = void 0;
      if (ends.length > 1) {
        for (i = 1, ii = ends.length; i < ii; ++i) {
          if (this.isValid_(flatCoordinates, ends[i - 1], ends[i], stride)) {
            var lineString = (0, _transform.translate)(flatCoordinates, ends[i - 1], ends[i], stride, -this.origin[0], -this.origin[1]);
            this.drawCoordinates_(lineString, 0, lineString.length, stride);
          }
        }
      }
      if (this.indices.length > indexCount) {
        this.startIndices.push(indexCount);
        this.startIndicesFeature.push(feature);
        if (this.state_.changed) {
          this.styleIndices_.push(indexCount);
          this.state_.changed = false;
        }
      }
    }

    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {Array<Array<number>>} holeFlatCoordinates Hole flat coordinates.
     * @param {number} stride Stride.
     */

  }, {
    key: 'drawPolygonCoordinates',
    value: function drawPolygonCoordinates(flatCoordinates, holeFlatCoordinates, stride) {
      if (!(0, _topology.lineStringIsClosed)(flatCoordinates, 0, flatCoordinates.length, stride)) {
        flatCoordinates.push(flatCoordinates[0]);
        flatCoordinates.push(flatCoordinates[1]);
      }
      this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
      if (holeFlatCoordinates.length) {
        var i = void 0,
            ii = void 0;
        for (i = 0, ii = holeFlatCoordinates.length; i < ii; ++i) {
          if (!(0, _topology.lineStringIsClosed)(holeFlatCoordinates[i], 0, holeFlatCoordinates[i].length, stride)) {
            holeFlatCoordinates[i].push(holeFlatCoordinates[i][0]);
            holeFlatCoordinates[i].push(holeFlatCoordinates[i][1]);
          }
          this.drawCoordinates_(holeFlatCoordinates[i], 0, holeFlatCoordinates[i].length, stride);
        }
      }
    }

    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {number=} opt_index Index count.
     */

  }, {
    key: 'setPolygonStyle',
    value: function setPolygonStyle(feature, opt_index) {
      var index = opt_index === undefined ? this.indices.length : opt_index;
      this.startIndices.push(index);
      this.startIndicesFeature.push(feature);
      if (this.state_.changed) {
        this.styleIndices_.push(index);
        this.state_.changed = false;
      }
    }

    /**
     * @return {number} Current index.
     */

  }, {
    key: 'getCurrentIndex',
    value: function getCurrentIndex() {
      return this.indices.length;
    }

    /**
     * @inheritDoc
     **/

  }, {
    key: 'finish',
    value: function finish(context) {
      // create, bind, and populate the vertices buffer
      this.verticesBuffer = new _Buffer2.default(this.vertices);

      // create, bind, and populate the indices buffer
      this.indicesBuffer = new _Buffer2.default(this.indices);

      this.startIndices.push(this.indices.length);

      //Clean up, if there is nothing to draw
      if (this.styleIndices_.length === 0 && this.styles_.length > 0) {
        this.styles_ = [];
      }

      this.vertices = null;
      this.indices = null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getDeleteResourcesFunction',
    value: function getDeleteResourcesFunction(context) {
      var verticesBuffer = this.verticesBuffer;
      var indicesBuffer = this.indicesBuffer;
      return function () {
        context.deleteBuffer(verticesBuffer);
        context.deleteBuffer(indicesBuffer);
      };
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setUpProgram',
    value: function setUpProgram(gl, context, size, pixelRatio) {
      // get the program
      var program = context.getProgram(_defaultshader.fragment, _defaultshader.vertex);

      // get the locations
      var locations = void 0;
      if (!this.defaultLocations_) {
        locations = new _Locations2.default(gl, program);
        this.defaultLocations_ = locations;
      } else {
        locations = this.defaultLocations_;
      }

      context.useProgram(program);

      // enable the vertex attrib arrays
      gl.enableVertexAttribArray(locations.a_lastPos);
      gl.vertexAttribPointer(locations.a_lastPos, 2, _webgl2.FLOAT, false, 28, 0);

      gl.enableVertexAttribArray(locations.a_position);
      gl.vertexAttribPointer(locations.a_position, 2, _webgl2.FLOAT, false, 28, 8);

      gl.enableVertexAttribArray(locations.a_nextPos);
      gl.vertexAttribPointer(locations.a_nextPos, 2, _webgl2.FLOAT, false, 28, 16);

      gl.enableVertexAttribArray(locations.a_direction);
      gl.vertexAttribPointer(locations.a_direction, 1, _webgl2.FLOAT, false, 28, 24);

      // Enable renderer specific uniforms.
      gl.uniform2fv(locations.u_size, size);
      gl.uniform1f(locations.u_pixelRatio, pixelRatio);

      return locations;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'shutDownProgram',
    value: function shutDownProgram(gl, locations) {
      gl.disableVertexAttribArray(locations.a_lastPos);
      gl.disableVertexAttribArray(locations.a_position);
      gl.disableVertexAttribArray(locations.a_nextPos);
      gl.disableVertexAttribArray(locations.a_direction);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawReplay',
    value: function drawReplay(gl, context, skippedFeaturesHash, hitDetection) {
      //Save GL parameters.
      var tmpDepthFunc = /** @type {number} */gl.getParameter(gl.DEPTH_FUNC);
      var tmpDepthMask = /** @type {boolean} */gl.getParameter(gl.DEPTH_WRITEMASK);

      if (!hitDetection) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.NOTEQUAL);
      }

      if (!(0, _obj.isEmpty)(skippedFeaturesHash)) {
        this.drawReplaySkipping_(gl, context, skippedFeaturesHash);
      } else {
        //Draw by style groups to minimize drawElements() calls.
        var i = void 0,
            start = void 0,
            end = void 0,
            nextStyle = void 0;
        end = this.startIndices[this.startIndices.length - 1];
        for (i = this.styleIndices_.length - 1; i >= 0; --i) {
          start = this.styleIndices_[i];
          nextStyle = this.styles_[i];
          this.setStrokeStyle_(gl, nextStyle[0], nextStyle[1], nextStyle[2]);
          this.drawElements(gl, context, start, end);
          gl.clear(gl.DEPTH_BUFFER_BIT);
          end = start;
        }
      }
      if (!hitDetection) {
        gl.disable(gl.DEPTH_TEST);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        //Restore GL parameters.
        gl.depthMask(tmpDepthMask);
        gl.depthFunc(tmpDepthFunc);
      }
    }

    /**
     * @private
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object} skippedFeaturesHash Ids of features to skip.
     */

  }, {
    key: 'drawReplaySkipping_',
    value: function drawReplaySkipping_(gl, context, skippedFeaturesHash) {
      var i = void 0,
          start = void 0,
          end = void 0,
          nextStyle = void 0,
          groupStart = void 0,
          feature = void 0,
          featureUid = void 0,
          featureIndex = void 0,
          featureStart = void 0;
      featureIndex = this.startIndices.length - 2;
      end = start = this.startIndices[featureIndex + 1];
      for (i = this.styleIndices_.length - 1; i >= 0; --i) {
        nextStyle = this.styles_[i];
        this.setStrokeStyle_(gl, nextStyle[0], nextStyle[1], nextStyle[2]);
        groupStart = this.styleIndices_[i];

        while (featureIndex >= 0 && this.startIndices[featureIndex] >= groupStart) {
          featureStart = this.startIndices[featureIndex];
          feature = this.startIndicesFeature[featureIndex];
          featureUid = (0, _util.getUid)(feature).toString();

          if (skippedFeaturesHash[featureUid]) {
            if (start !== end) {
              this.drawElements(gl, context, start, end);
              gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            end = featureStart;
          }
          featureIndex--;
          start = featureStart;
        }
        if (start !== end) {
          this.drawElements(gl, context, start, end);
          gl.clear(gl.DEPTH_BUFFER_BIT);
        }
        start = end = groupStart;
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawHitDetectionReplayOneByOne',
    value: function drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {
      var i = void 0,
          start = void 0,
          end = void 0,
          nextStyle = void 0,
          groupStart = void 0,
          feature = void 0,
          featureUid = void 0,
          featureIndex = void 0;
      featureIndex = this.startIndices.length - 2;
      end = this.startIndices[featureIndex + 1];
      for (i = this.styleIndices_.length - 1; i >= 0; --i) {
        nextStyle = this.styles_[i];
        this.setStrokeStyle_(gl, nextStyle[0], nextStyle[1], nextStyle[2]);
        groupStart = this.styleIndices_[i];

        while (featureIndex >= 0 && this.startIndices[featureIndex] >= groupStart) {
          start = this.startIndices[featureIndex];
          feature = this.startIndicesFeature[featureIndex];
          featureUid = (0, _util.getUid)(feature).toString();

          if (skippedFeaturesHash[featureUid] === undefined && feature.getGeometry() && (opt_hitExtent === undefined || (0, _extent.intersects)(
          /** @type {Array<number>} */opt_hitExtent, feature.getGeometry().getExtent()))) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.drawElements(gl, context, start, end);

            var result = featureCallback(feature);

            if (result) {
              return result;
            }
          }
          featureIndex--;
          end = start;
        }
      }
      return undefined;
    }

    /**
     * @private
     * @param {WebGLRenderingContext} gl gl.
     * @param {Array<number>} color Color.
     * @param {number} lineWidth Line width.
     * @param {number} miterLimit Miter limit.
     */

  }, {
    key: 'setStrokeStyle_',
    value: function setStrokeStyle_(gl, color, lineWidth, miterLimit) {
      gl.uniform4fv(this.defaultLocations_.u_color, color);
      gl.uniform1f(this.defaultLocations_.u_lineWidth, lineWidth);
      gl.uniform1f(this.defaultLocations_.u_miterLimit, miterLimit);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setFillStrokeStyle',
    value: function setFillStrokeStyle(fillStyle, strokeStyle) {
      var strokeStyleLineCap = strokeStyle.getLineCap();
      this.state_.lineCap = strokeStyleLineCap !== undefined ? strokeStyleLineCap : _webgl.DEFAULT_LINECAP;
      var strokeStyleLineDash = strokeStyle.getLineDash();
      this.state_.lineDash = strokeStyleLineDash ? strokeStyleLineDash : _webgl.DEFAULT_LINEDASH;
      var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
      this.state_.lineDashOffset = strokeStyleLineDashOffset ? strokeStyleLineDashOffset : _webgl.DEFAULT_LINEDASHOFFSET;
      var strokeStyleLineJoin = strokeStyle.getLineJoin();
      this.state_.lineJoin = strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : _webgl.DEFAULT_LINEJOIN;
      var strokeStyleColor = strokeStyle.getColor();
      if (!(strokeStyleColor instanceof CanvasGradient) && !(strokeStyleColor instanceof CanvasPattern)) {
        strokeStyleColor = (0, _color.asArray)(strokeStyleColor).map(function (c, i) {
          return i != 3 ? c / 255 : c;
        }) || _webgl.DEFAULT_STROKESTYLE;
      } else {
        strokeStyleColor = _webgl.DEFAULT_STROKESTYLE;
      }
      var strokeStyleWidth = strokeStyle.getWidth();
      strokeStyleWidth = strokeStyleWidth !== undefined ? strokeStyleWidth : _webgl.DEFAULT_LINEWIDTH;
      var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
      strokeStyleMiterLimit = strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : _webgl.DEFAULT_MITERLIMIT;
      if (!this.state_.strokeColor || !(0, _array.equals)(this.state_.strokeColor, strokeStyleColor) || this.state_.lineWidth !== strokeStyleWidth || this.state_.miterLimit !== strokeStyleMiterLimit) {
        this.state_.changed = true;
        this.state_.strokeColor = strokeStyleColor;
        this.state_.lineWidth = strokeStyleWidth;
        this.state_.miterLimit = strokeStyleMiterLimit;
        this.styles_.push([strokeStyleColor, strokeStyleWidth, strokeStyleMiterLimit]);
      }
    }
  }]);

  return WebGLLineStringReplay;
}(_Replay2.default);

exports.default = WebGLLineStringReplay;