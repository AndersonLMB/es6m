'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _extent = require('../../extent.js');

var _obj = require('../../obj.js');

var _defaultshader = require('../webgl/texturereplay/defaultshader.js');

var _Locations = require('../webgl/texturereplay/defaultshader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _Replay = require('../webgl/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

var _webgl = require('../../webgl.js');

var _Context = require('../../webgl/Context.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/TextureReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var WebGLTextureReplay = function (_WebGLReplay) {
  _inherits(WebGLTextureReplay, _WebGLReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   */
  function WebGLTextureReplay(tolerance, maxExtent) {
    _classCallCheck(this, WebGLTextureReplay);

    /**
     * @type {number|undefined}
     * @protected
     */
    var _this = _possibleConstructorReturn(this, (WebGLTextureReplay.__proto__ || Object.getPrototypeOf(WebGLTextureReplay)).call(this, tolerance, maxExtent));

    _this.anchorX = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.anchorY = undefined;

    /**
     * @type {Array<number>}
     * @protected
     */
    _this.groupIndices = [];

    /**
     * @type {Array<number>}
     * @protected
     */
    _this.hitDetectionGroupIndices = [];

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.height = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.imageHeight = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.imageWidth = undefined;

    /**
     * @protected
     * @type {module:ol/render/webgl/texturereplay/defaultshader/Locations}
     */
    _this.defaultLocations = null;

    /**
     * @protected
     * @type {number|undefined}
     */
    _this.opacity = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.originX = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.originY = undefined;

    /**
     * @protected
     * @type {boolean|undefined}
     */
    _this.rotateWithView = undefined;

    /**
     * @protected
     * @type {number|undefined}
     */
    _this.rotation = undefined;

    /**
     * @protected
     * @type {number|undefined}
     */
    _this.scale = undefined;

    /**
     * @type {number|undefined}
     * @protected
     */
    _this.width = undefined;
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLTextureReplay, [{
    key: 'getDeleteResourcesFunction',
    value: function getDeleteResourcesFunction(context) {
      var verticesBuffer = this.verticesBuffer;
      var indicesBuffer = this.indicesBuffer;
      var textures = this.getTextures(true);
      var gl = context.getGL();
      return function () {
        if (!gl.isContextLost()) {
          var i = void 0,
              ii = void 0;
          for (i = 0, ii = textures.length; i < ii; ++i) {
            gl.deleteTexture(textures[i]);
          }
        }
        context.deleteBuffer(verticesBuffer);
        context.deleteBuffer(indicesBuffer);
      };
    }

    /**
     * @param {Array<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {number} My end.
     * @protected
     */

  }, {
    key: 'drawCoordinates',
    value: function drawCoordinates(flatCoordinates, offset, end, stride) {
      var anchorX = /** @type {number} */this.anchorX;
      var anchorY = /** @type {number} */this.anchorY;
      var height = /** @type {number} */this.height;
      var imageHeight = /** @type {number} */this.imageHeight;
      var imageWidth = /** @type {number} */this.imageWidth;
      var opacity = /** @type {number} */this.opacity;
      var originX = /** @type {number} */this.originX;
      var originY = /** @type {number} */this.originY;
      var rotateWithView = this.rotateWithView ? 1.0 : 0.0;
      // this.rotation_ is anti-clockwise, but rotation is clockwise
      var rotation = /** @type {number} */-this.rotation;
      var scale = /** @type {number} */this.scale;
      var width = /** @type {number} */this.width;
      var cos = Math.cos(rotation);
      var sin = Math.sin(rotation);
      var numIndices = this.indices.length;
      var numVertices = this.vertices.length;
      var i = void 0,
          n = void 0,
          offsetX = void 0,
          offsetY = void 0,
          x = void 0,
          y = void 0;
      for (i = offset; i < end; i += stride) {
        x = flatCoordinates[i] - this.origin[0];
        y = flatCoordinates[i + 1] - this.origin[1];

        // There are 4 vertices per [x, y] point, one for each corner of the
        // rectangle we're going to draw. We'd use 1 vertex per [x, y] point if
        // WebGL supported Geometry Shaders (which can emit new vertices), but that
        // is not currently the case.
        //
        // And each vertex includes 8 values: the x and y coordinates, the x and
        // y offsets used to calculate the position of the corner, the u and
        // v texture coordinates for the corner, the opacity, and whether the
        // the image should be rotated with the view (rotateWithView).

        n = numVertices / 8;

        // bottom-left corner
        offsetX = -scale * anchorX;
        offsetY = -scale * (height - anchorY);
        this.vertices[numVertices++] = x;
        this.vertices[numVertices++] = y;
        this.vertices[numVertices++] = offsetX * cos - offsetY * sin;
        this.vertices[numVertices++] = offsetX * sin + offsetY * cos;
        this.vertices[numVertices++] = originX / imageWidth;
        this.vertices[numVertices++] = (originY + height) / imageHeight;
        this.vertices[numVertices++] = opacity;
        this.vertices[numVertices++] = rotateWithView;

        // bottom-right corner
        offsetX = scale * (width - anchorX);
        offsetY = -scale * (height - anchorY);
        this.vertices[numVertices++] = x;
        this.vertices[numVertices++] = y;
        this.vertices[numVertices++] = offsetX * cos - offsetY * sin;
        this.vertices[numVertices++] = offsetX * sin + offsetY * cos;
        this.vertices[numVertices++] = (originX + width) / imageWidth;
        this.vertices[numVertices++] = (originY + height) / imageHeight;
        this.vertices[numVertices++] = opacity;
        this.vertices[numVertices++] = rotateWithView;

        // top-right corner
        offsetX = scale * (width - anchorX);
        offsetY = scale * anchorY;
        this.vertices[numVertices++] = x;
        this.vertices[numVertices++] = y;
        this.vertices[numVertices++] = offsetX * cos - offsetY * sin;
        this.vertices[numVertices++] = offsetX * sin + offsetY * cos;
        this.vertices[numVertices++] = (originX + width) / imageWidth;
        this.vertices[numVertices++] = originY / imageHeight;
        this.vertices[numVertices++] = opacity;
        this.vertices[numVertices++] = rotateWithView;

        // top-left corner
        offsetX = -scale * anchorX;
        offsetY = scale * anchorY;
        this.vertices[numVertices++] = x;
        this.vertices[numVertices++] = y;
        this.vertices[numVertices++] = offsetX * cos - offsetY * sin;
        this.vertices[numVertices++] = offsetX * sin + offsetY * cos;
        this.vertices[numVertices++] = originX / imageWidth;
        this.vertices[numVertices++] = originY / imageHeight;
        this.vertices[numVertices++] = opacity;
        this.vertices[numVertices++] = rotateWithView;

        this.indices[numIndices++] = n;
        this.indices[numIndices++] = n + 1;
        this.indices[numIndices++] = n + 2;
        this.indices[numIndices++] = n;
        this.indices[numIndices++] = n + 2;
        this.indices[numIndices++] = n + 3;
      }

      return numVertices;
    }

    /**
     * @protected
     * @param {Array<WebGLTexture>} textures Textures.
     * @param {Array<HTMLCanvasElement|HTMLImageElement|HTMLVideoElement>} images Images.
     * @param {!Object<string, WebGLTexture>} texturePerImage Texture cache.
     * @param {WebGLRenderingContext} gl Gl.
     */

  }, {
    key: 'createTextures',
    value: function createTextures(textures, images, texturePerImage, gl) {
      var texture = void 0,
          image = void 0,
          uid = void 0,
          i = void 0;
      var ii = images.length;
      for (i = 0; i < ii; ++i) {
        image = images[i];

        uid = (0, _util.getUid)(image).toString();
        if (uid in texturePerImage) {
          texture = texturePerImage[uid];
        } else {
          texture = (0, _Context.createTexture)(gl, image, _webgl.CLAMP_TO_EDGE, _webgl.CLAMP_TO_EDGE);
          texturePerImage[uid] = texture;
        }
        textures[i] = texture;
      }
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
      if (!this.defaultLocations) {
        locations = new _Locations2.default(gl, program);
        this.defaultLocations = locations;
      } else {
        locations = this.defaultLocations;
      }

      // use the program (FIXME: use the return value)
      context.useProgram(program);

      // enable the vertex attrib arrays
      gl.enableVertexAttribArray(locations.a_position);
      gl.vertexAttribPointer(locations.a_position, 2, _webgl.FLOAT, false, 32, 0);

      gl.enableVertexAttribArray(locations.a_offsets);
      gl.vertexAttribPointer(locations.a_offsets, 2, _webgl.FLOAT, false, 32, 8);

      gl.enableVertexAttribArray(locations.a_texCoord);
      gl.vertexAttribPointer(locations.a_texCoord, 2, _webgl.FLOAT, false, 32, 16);

      gl.enableVertexAttribArray(locations.a_opacity);
      gl.vertexAttribPointer(locations.a_opacity, 1, _webgl.FLOAT, false, 32, 24);

      gl.enableVertexAttribArray(locations.a_rotateWithView);
      gl.vertexAttribPointer(locations.a_rotateWithView, 1, _webgl.FLOAT, false, 32, 28);

      return locations;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'shutDownProgram',
    value: function shutDownProgram(gl, locations) {
      gl.disableVertexAttribArray(locations.a_position);
      gl.disableVertexAttribArray(locations.a_offsets);
      gl.disableVertexAttribArray(locations.a_texCoord);
      gl.disableVertexAttribArray(locations.a_opacity);
      gl.disableVertexAttribArray(locations.a_rotateWithView);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawReplay',
    value: function drawReplay(gl, context, skippedFeaturesHash, hitDetection) {
      var textures = hitDetection ? this.getHitDetectionTextures() : this.getTextures();
      var groupIndices = hitDetection ? this.hitDetectionGroupIndices : this.groupIndices;

      if (!(0, _obj.isEmpty)(skippedFeaturesHash)) {
        this.drawReplaySkipping(gl, context, skippedFeaturesHash, textures, groupIndices);
      } else {
        var i = void 0,
            ii = void 0,
            start = void 0;
        for (i = 0, ii = textures.length, start = 0; i < ii; ++i) {
          gl.bindTexture(_webgl.TEXTURE_2D, textures[i]);
          var end = groupIndices[i];
          this.drawElements(gl, context, start, end);
          start = end;
        }
      }
    }

    /**
     * Draw the replay while paying attention to skipped features.
     *
     * This functions creates groups of features that can be drawn to together,
     * so that the number of `drawElements` calls is minimized.
     *
     * For example given the following texture groups:
     *
     *    Group 1: A B C
     *    Group 2: D [E] F G
     *
     * If feature E should be skipped, the following `drawElements` calls will be
     * made:
     *
     *    drawElements with feature A, B and C
     *    drawElements with feature D
     *    drawElements with feature F and G
     *
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features
     *  to skip.
     * @param {Array<WebGLTexture>} textures Textures.
     * @param {Array<number>} groupIndices Texture group indices.
     */

  }, {
    key: 'drawReplaySkipping',
    value: function drawReplaySkipping(gl, context, skippedFeaturesHash, textures, groupIndices) {
      var featureIndex = 0;

      var i = void 0,
          ii = void 0;
      for (i = 0, ii = textures.length; i < ii; ++i) {
        gl.bindTexture(_webgl.TEXTURE_2D, textures[i]);
        var groupStart = i > 0 ? groupIndices[i - 1] : 0;
        var groupEnd = groupIndices[i];

        var start = groupStart;
        var end = groupStart;
        while (featureIndex < this.startIndices.length && this.startIndices[featureIndex] <= groupEnd) {
          var feature = this.startIndicesFeature[featureIndex];

          var featureUid = (0, _util.getUid)(feature).toString();
          if (skippedFeaturesHash[featureUid] !== undefined) {
            // feature should be skipped
            if (start !== end) {
              // draw the features so far
              this.drawElements(gl, context, start, end);
            }
            // continue with the next feature
            start = featureIndex === this.startIndices.length - 1 ? groupEnd : this.startIndices[featureIndex + 1];
            end = start;
          } else {
            // the feature is not skipped, augment the end index
            end = featureIndex === this.startIndices.length - 1 ? groupEnd : this.startIndices[featureIndex + 1];
          }
          featureIndex++;
        }

        if (start !== end) {
          // draw the remaining features (in case there was no skipped feature
          // in this texture group, all features of a group are drawn together)
          this.drawElements(gl, context, start, end);
        }
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawHitDetectionReplayOneByOne',
    value: function drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {
      var i = void 0,
          groupStart = void 0,
          start = void 0,
          end = void 0,
          feature = void 0,
          featureUid = void 0;
      var featureIndex = this.startIndices.length - 1;
      var hitDetectionTextures = this.getHitDetectionTextures();
      for (i = hitDetectionTextures.length - 1; i >= 0; --i) {
        gl.bindTexture(_webgl.TEXTURE_2D, hitDetectionTextures[i]);
        groupStart = i > 0 ? this.hitDetectionGroupIndices[i - 1] : 0;
        end = this.hitDetectionGroupIndices[i];

        // draw all features for this texture group
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

          end = start;
          featureIndex--;
        }
      }
      return undefined;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish(context) {
      this.anchorX = undefined;
      this.anchorY = undefined;
      this.height = undefined;
      this.imageHeight = undefined;
      this.imageWidth = undefined;
      this.indices = null;
      this.opacity = undefined;
      this.originX = undefined;
      this.originY = undefined;
      this.rotateWithView = undefined;
      this.rotation = undefined;
      this.scale = undefined;
      this.vertices = null;
      this.width = undefined;
    }

    /**
     * @abstract
     * @protected
     * @param {boolean=} opt_all Return hit detection textures with regular ones.
     * @returns {Array<WebGLTexture>} Textures.
     */

  }, {
    key: 'getTextures',
    value: function getTextures(opt_all) {}

    /**
     * @abstract
     * @protected
     * @returns {Array<WebGLTexture>} Textures.
     */

  }, {
    key: 'getHitDetectionTextures',
    value: function getHitDetectionTextures() {}
  }]);

  return WebGLTextureReplay;
}(_Replay2.default);

exports.default = WebGLTextureReplay;