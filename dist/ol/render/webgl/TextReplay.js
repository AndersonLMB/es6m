'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _colorlike = require('../../colorlike.js');

var _dom = require('../../dom.js');

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _has = require('../../has.js');

var _replay = require('../replay.js');

var _webgl = require('../webgl.js');

var _TextureReplay = require('../webgl/TextureReplay.js');

var _TextureReplay2 = _interopRequireDefault(_TextureReplay);

var _AtlasManager = require('../../style/AtlasManager.js');

var _AtlasManager2 = _interopRequireDefault(_AtlasManager);

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/TextReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} GlyphAtlas
 * @property {module:ol/style/AtlasManager} atlas
 * @property {Object<string, number>} width
 * @property {number} height
 */

var WebGLTextReplay = function (_WebGLTextureReplay) {
  _inherits(WebGLTextReplay, _WebGLTextureReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   */
  function WebGLTextReplay(tolerance, maxExtent) {
    _classCallCheck(this, WebGLTextReplay);

    /**
     * @private
     * @type {Array<HTMLCanvasElement>}
     */
    var _this = _possibleConstructorReturn(this, (WebGLTextReplay.__proto__ || Object.getPrototypeOf(WebGLTextReplay)).call(this, tolerance, maxExtent));

    _this.images_ = [];

    /**
     * @private
     * @type {Array<WebGLTexture>}
     */
    _this.textures_ = [];

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.measureCanvas_ = (0, _dom.createCanvasContext2D)(0, 0).canvas;

    /**
     * @private
     * @type {{strokeColor: (module:ol/colorlike~ColorLike|null),
     *         lineCap: (string|undefined),
     *         lineDash: Array<number>,
     *         lineDashOffset: (number|undefined),
     *         lineJoin: (string|undefined),
     *         lineWidth: number,
     *         miterLimit: (number|undefined),
     *         fillColor: (module:ol/colorlike~ColorLike|null),
     *         font: (string|undefined),
     *         scale: (number|undefined)}}
     */
    _this.state_ = {
      strokeColor: null,
      lineCap: undefined,
      lineDash: null,
      lineDashOffset: undefined,
      lineJoin: undefined,
      lineWidth: 0,
      miterLimit: undefined,
      fillColor: null,
      font: undefined,
      scale: undefined
    };

    /**
     * @private
     * @type {string}
     */
    _this.text_ = '';

    /**
     * @private
     * @type {number|undefined}
     */
    _this.textAlign_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.textBaseline_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.offsetX_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.offsetY_ = undefined;

    /**
     * @private
     * @type {Object<string, module:ol/render/webgl/TextReplay~GlyphAtlas>}
     */
    _this.atlases_ = {};

    /**
     * @private
     * @type {module:ol/render/webgl/TextReplay~GlyphAtlas|undefined}
     */
    _this.currAtlas_ = undefined;

    _this.scale = 1;

    _this.opacity = 1;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLTextReplay, [{
    key: 'drawText',
    value: function drawText(geometry, feature) {
      if (this.text_) {
        var flatCoordinates = null;
        var offset = 0;
        var end = 2;
        var stride = 2;
        switch (geometry.getType()) {
          case _GeometryType2.default.POINT:
          case _GeometryType2.default.MULTI_POINT:
            flatCoordinates = geometry.getFlatCoordinates();
            end = flatCoordinates.length;
            stride = geometry.getStride();
            break;
          case _GeometryType2.default.CIRCLE:
            flatCoordinates = /** @type {module:ol/geom/Circle} */geometry.getCenter();
            break;
          case _GeometryType2.default.LINE_STRING:
            flatCoordinates = /** @type {module:ol/geom/LineString} */geometry.getFlatMidpoint();
            break;
          case _GeometryType2.default.MULTI_LINE_STRING:
            flatCoordinates = /** @type {module:ol/geom/MultiLineString} */geometry.getFlatMidpoints();
            end = flatCoordinates.length;
            break;
          case _GeometryType2.default.POLYGON:
            flatCoordinates = /** @type {module:ol/geom/Polygon} */geometry.getFlatInteriorPoint();
            break;
          case _GeometryType2.default.MULTI_POLYGON:
            flatCoordinates = /** @type {module:ol/geom/MultiPolygon} */geometry.getFlatInteriorPoints();
            end = flatCoordinates.length;
            break;
          default:
        }
        this.startIndices.push(this.indices.length);
        this.startIndicesFeature.push(feature);

        var glyphAtlas = this.currAtlas_;
        var lines = this.text_.split('\n');
        var textSize = this.getTextSize_(lines);
        var i = void 0,
            ii = void 0,
            j = void 0,
            jj = void 0,
            currX = void 0,
            currY = void 0,
            charArr = void 0,
            charInfo = void 0;
        var anchorX = Math.round(textSize[0] * this.textAlign_ - this.offsetX_);
        var anchorY = Math.round(textSize[1] * this.textBaseline_ - this.offsetY_);
        var lineWidth = this.state_.lineWidth / 2 * this.state_.scale;

        for (i = 0, ii = lines.length; i < ii; ++i) {
          currX = 0;
          currY = glyphAtlas.height * i;
          charArr = lines[i].split('');

          for (j = 0, jj = charArr.length; j < jj; ++j) {
            charInfo = glyphAtlas.atlas.getInfo(charArr[j]);

            if (charInfo) {
              var image = charInfo.image;

              this.anchorX = anchorX - currX;
              this.anchorY = anchorY - currY;
              this.originX = j === 0 ? charInfo.offsetX - lineWidth : charInfo.offsetX;
              this.originY = charInfo.offsetY;
              this.height = glyphAtlas.height;
              this.width = j === 0 || j === charArr.length - 1 ? glyphAtlas.width[charArr[j]] + lineWidth : glyphAtlas.width[charArr[j]];
              this.imageHeight = image.height;
              this.imageWidth = image.width;

              if (this.images_.length === 0) {
                this.images_.push(image);
              } else {
                var currentImage = this.images_[this.images_.length - 1];
                if ((0, _util.getUid)(currentImage) != (0, _util.getUid)(image)) {
                  this.groupIndices.push(this.indices.length);
                  this.images_.push(image);
                }
              }

              this.drawText_(flatCoordinates, offset, end, stride);
            }
            currX += this.width;
          }
        }
      }
    }

    /**
     * @private
     * @param {Array<string>} lines Label to draw split to lines.
     * @return {Array<number>} Size of the label in pixels.
     */

  }, {
    key: 'getTextSize_',
    value: function getTextSize_(lines) {
      var self = this;
      var glyphAtlas = this.currAtlas_;
      var textHeight = lines.length * glyphAtlas.height;
      //Split every line to an array of chars, sum up their width, and select the longest.
      var textWidth = lines.map(function (str) {
        var sum = 0;
        for (var i = 0, ii = str.length; i < ii; ++i) {
          var curr = str[i];
          if (!glyphAtlas.width[curr]) {
            self.addCharToAtlas_(curr);
          }
          sum += glyphAtlas.width[curr] ? glyphAtlas.width[curr] : 0;
        }
        return sum;
      }).reduce(function (max, curr) {
        return Math.max(max, curr);
      });

      return [textWidth, textHeight];
    }

    /**
     * @private
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     */

  }, {
    key: 'drawText_',
    value: function drawText_(flatCoordinates, offset, end, stride) {
      for (var i = offset, ii = end; i < ii; i += stride) {
        this.drawCoordinates(flatCoordinates, offset, end, stride);
      }
    }

    /**
     * @private
     * @param {string} char Character.
     */

  }, {
    key: 'addCharToAtlas_',
    value: function addCharToAtlas_(char) {
      if (char.length === 1) {
        var glyphAtlas = this.currAtlas_;
        var state = this.state_;
        var mCtx = this.measureCanvas_.getContext('2d');
        mCtx.font = state.font;
        var width = Math.ceil(mCtx.measureText(char).width * state.scale);

        var info = glyphAtlas.atlas.add(char, width, glyphAtlas.height, function (ctx, x, y) {
          //Parameterize the canvas
          ctx.font = /** @type {string} */state.font;
          ctx.fillStyle = state.fillColor;
          ctx.strokeStyle = state.strokeColor;
          ctx.lineWidth = state.lineWidth;
          ctx.lineCap = /*** @type {string} */state.lineCap;
          ctx.lineJoin = /** @type {string} */state.lineJoin;
          ctx.miterLimit = /** @type {number} */state.miterLimit;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          if (_has.CANVAS_LINE_DASH && state.lineDash) {
            //FIXME: use pixelRatio
            ctx.setLineDash(state.lineDash);
            ctx.lineDashOffset = /** @type {number} */state.lineDashOffset;
          }
          if (state.scale !== 1) {
            //FIXME: use pixelRatio
            ctx.setTransform( /** @type {number} */state.scale, 0, 0,
            /** @type {number} */state.scale, 0, 0);
          }

          //Draw the character on the canvas
          if (state.strokeColor) {
            ctx.strokeText(char, x, y);
          }
          if (state.fillColor) {
            ctx.fillText(char, x, y);
          }
        });

        if (info) {
          glyphAtlas.width[char] = width;
        }
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish(context) {
      var gl = context.getGL();

      this.groupIndices.push(this.indices.length);
      this.hitDetectionGroupIndices = this.groupIndices;

      // create, bind, and populate the vertices buffer
      this.verticesBuffer = new _Buffer2.default(this.vertices);

      // create, bind, and populate the indices buffer
      this.indicesBuffer = new _Buffer2.default(this.indices);

      // create textures
      /** @type {Object<string, WebGLTexture>} */
      var texturePerImage = {};

      this.createTextures(this.textures_, this.images_, texturePerImage, gl);

      this.state_ = {
        strokeColor: null,
        lineCap: undefined,
        lineDash: null,
        lineDashOffset: undefined,
        lineJoin: undefined,
        lineWidth: 0,
        miterLimit: undefined,
        fillColor: null,
        font: undefined,
        scale: undefined
      };
      this.text_ = '';
      this.textAlign_ = undefined;
      this.textBaseline_ = undefined;
      this.offsetX_ = undefined;
      this.offsetY_ = undefined;
      this.images_ = null;
      this.atlases_ = {};
      this.currAtlas_ = undefined;
      _TextureReplay2.default.prototype.finish.call(this, context);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setTextStyle',
    value: function setTextStyle(textStyle) {
      var state = this.state_;
      var textFillStyle = textStyle.getFill();
      var textStrokeStyle = textStyle.getStroke();
      if (!textStyle || !textStyle.getText() || !textFillStyle && !textStrokeStyle) {
        this.text_ = '';
      } else {
        if (!textFillStyle) {
          state.fillColor = null;
        } else {
          var textFillStyleColor = textFillStyle.getColor();
          state.fillColor = (0, _colorlike.asColorLike)(textFillStyleColor ? textFillStyleColor : _webgl.DEFAULT_FILLSTYLE);
        }
        if (!textStrokeStyle) {
          state.strokeColor = null;
          state.lineWidth = 0;
        } else {
          var textStrokeStyleColor = textStrokeStyle.getColor();
          state.strokeColor = (0, _colorlike.asColorLike)(textStrokeStyleColor ? textStrokeStyleColor : _webgl.DEFAULT_STROKESTYLE);
          state.lineWidth = textStrokeStyle.getWidth() || _webgl.DEFAULT_LINEWIDTH;
          state.lineCap = textStrokeStyle.getLineCap() || _webgl.DEFAULT_LINECAP;
          state.lineDashOffset = textStrokeStyle.getLineDashOffset() || _webgl.DEFAULT_LINEDASHOFFSET;
          state.lineJoin = textStrokeStyle.getLineJoin() || _webgl.DEFAULT_LINEJOIN;
          state.miterLimit = textStrokeStyle.getMiterLimit() || _webgl.DEFAULT_MITERLIMIT;
          var lineDash = textStrokeStyle.getLineDash();
          state.lineDash = lineDash ? lineDash.slice() : _webgl.DEFAULT_LINEDASH;
        }
        state.font = textStyle.getFont() || _webgl.DEFAULT_FONT;
        state.scale = textStyle.getScale() || 1;
        this.text_ = /** @type {string} */textStyle.getText();
        var textAlign = _replay.TEXT_ALIGN[textStyle.getTextAlign()];
        var textBaseline = _replay.TEXT_ALIGN[textStyle.getTextBaseline()];
        this.textAlign_ = textAlign === undefined ? _webgl.DEFAULT_TEXTALIGN : textAlign;
        this.textBaseline_ = textBaseline === undefined ? _webgl.DEFAULT_TEXTBASELINE : textBaseline;
        this.offsetX_ = textStyle.getOffsetX() || 0;
        this.offsetY_ = textStyle.getOffsetY() || 0;
        this.rotateWithView = !!textStyle.getRotateWithView();
        this.rotation = textStyle.getRotation() || 0;

        this.currAtlas_ = this.getAtlas_(state);
      }
    }

    /**
     * @private
     * @param {Object} state Font attributes.
     * @return {module:ol/render/webgl/TextReplay~GlyphAtlas} Glyph atlas.
     */

  }, {
    key: 'getAtlas_',
    value: function getAtlas_(state) {
      var params = [];
      for (var i in state) {
        if (state[i] || state[i] === 0) {
          if (Array.isArray(state[i])) {
            params = params.concat(state[i]);
          } else {
            params.push(state[i]);
          }
        }
      }
      var hash = this.calculateHash_(params);
      if (!this.atlases_[hash]) {
        var mCtx = this.measureCanvas_.getContext('2d');
        mCtx.font = state.font;
        var height = Math.ceil((mCtx.measureText('M').width * 1.5 + state.lineWidth / 2) * state.scale);

        this.atlases_[hash] = {
          atlas: new _AtlasManager2.default({
            space: state.lineWidth + 1
          }),
          width: {},
          height: height
        };
      }
      return this.atlases_[hash];
    }

    /**
     * @private
     * @param {Array<string|number>} params Array of parameters.
     * @return {string} Hash string.
     */

  }, {
    key: 'calculateHash_',
    value: function calculateHash_(params) {
      //TODO: Create a more performant, reliable, general hash function.
      var hash = '';
      for (var i = 0, ii = params.length; i < ii; ++i) {
        hash += params[i];
      }
      return hash;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTextures',
    value: function getTextures(opt_all) {
      return this.textures_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getHitDetectionTextures',
    value: function getHitDetectionTextures() {
      return this.textures_;
    }
  }]);

  return WebGLTextReplay;
}(_TextureReplay2.default);

exports.default = WebGLTextReplay;