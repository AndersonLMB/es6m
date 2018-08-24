'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Immediate = require('../../render/webgl/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Layer = require('../Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _defaultmapshader = require('../webgl/defaultmapshader.js');

var _Locations = require('../webgl/defaultmapshader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _transform = require('../../transform.js');

var _mat = require('../../vec/mat4.js');

var _webgl = require('../../webgl.js');

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

var _Context = require('../../webgl/Context.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/webgl/Layer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var WebGLLayerRenderer = function (_LayerRenderer) {
  _inherits(WebGLLayerRenderer, _LayerRenderer);

  /**
   * @param {module:ol/renderer/webgl/Map} mapRenderer Map renderer.
   * @param {module:ol/layer/Layer} layer Layer.
   */
  function WebGLLayerRenderer(mapRenderer, layer) {
    _classCallCheck(this, WebGLLayerRenderer);

    /**
     * @protected
     * @type {module:ol/renderer/webgl/Map}
     */
    var _this = _possibleConstructorReturn(this, (WebGLLayerRenderer.__proto__ || Object.getPrototypeOf(WebGLLayerRenderer)).call(this, layer));

    _this.mapRenderer = mapRenderer;

    /**
     * @private
     * @type {module:ol/webgl/Buffer}
     */
    _this.arrayBuffer_ = new _Buffer2.default([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);

    /**
     * @protected
     * @type {WebGLTexture}
     */
    _this.texture = null;

    /**
     * @protected
     * @type {WebGLFramebuffer}
     */
    _this.framebuffer = null;

    /**
     * @protected
     * @type {number|undefined}
     */
    _this.framebufferDimension = undefined;

    /**
     * @protected
     * @type {module:ol/transform~Transform}
     */
    _this.texCoordMatrix = (0, _transform.create)();

    /**
     * @protected
     * @type {module:ol/transform~Transform}
     */
    _this.projectionMatrix = (0, _transform.create)();

    /**
     * @type {Array<number>}
     * @private
     */
    _this.tmpMat4_ = (0, _mat.create)();

    /**
     * @private
     * @type {module:ol/renderer/webgl/defaultmapshader/Locations}
     */
    _this.defaultLocations_ = null;

    return _this;
  }

  /**
   * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
   * @param {number} framebufferDimension Framebuffer dimension.
   * @protected
   */


  _createClass(WebGLLayerRenderer, [{
    key: 'bindFramebuffer',
    value: function bindFramebuffer(frameState, framebufferDimension) {

      var gl = this.mapRenderer.getGL();

      if (this.framebufferDimension === undefined || this.framebufferDimension != framebufferDimension) {
        /**
         * @param {WebGLRenderingContext} gl GL.
         * @param {WebGLFramebuffer} framebuffer Framebuffer.
         * @param {WebGLTexture} texture Texture.
         */
        var postRenderFunction = function (gl, framebuffer, texture) {
          if (!gl.isContextLost()) {
            gl.deleteFramebuffer(framebuffer);
            gl.deleteTexture(texture);
          }
        }.bind(null, gl, this.framebuffer, this.texture);

        frameState.postRenderFunctions.push(
        /** @type {module:ol/PluggableMap~PostRenderFunction} */postRenderFunction);

        var texture = (0, _Context.createEmptyTexture)(gl, framebufferDimension, framebufferDimension);

        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(_webgl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(_webgl.FRAMEBUFFER, _webgl.COLOR_ATTACHMENT0, _webgl.TEXTURE_2D, texture, 0);

        this.texture = texture;
        this.framebuffer = framebuffer;
        this.framebufferDimension = framebufferDimension;
      } else {
        gl.bindFramebuffer(_webgl.FRAMEBUFFER, this.framebuffer);
      }
    }

    /**
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @param {module:ol/webgl/Context} context Context.
     */

  }, {
    key: 'composeFrame',
    value: function composeFrame(frameState, layerState, context) {

      this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, context, frameState);

      context.bindBuffer(_webgl.ARRAY_BUFFER, this.arrayBuffer_);

      var gl = context.getGL();

      var program = context.getProgram(_defaultmapshader.fragment, _defaultmapshader.vertex);

      var locations = void 0;
      if (!this.defaultLocations_) {
        locations = new _Locations2.default(gl, program);
        this.defaultLocations_ = locations;
      } else {
        locations = this.defaultLocations_;
      }

      if (context.useProgram(program)) {
        gl.enableVertexAttribArray(locations.a_position);
        gl.vertexAttribPointer(locations.a_position, 2, _webgl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(locations.a_texCoord);
        gl.vertexAttribPointer(locations.a_texCoord, 2, _webgl.FLOAT, false, 16, 8);
        gl.uniform1i(locations.u_texture, 0);
      }

      gl.uniformMatrix4fv(locations.u_texCoordMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, this.getTexCoordMatrix()));
      gl.uniformMatrix4fv(locations.u_projectionMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, this.getProjectionMatrix()));
      gl.uniform1f(locations.u_opacity, layerState.opacity);
      gl.bindTexture(_webgl.TEXTURE_2D, this.getTexture());
      gl.drawArrays(_webgl.TRIANGLE_STRIP, 0, 4);

      this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, context, frameState);
    }

    /**
     * @param {module:ol/render/EventType} type Event type.
     * @param {module:ol/webgl/Context} context WebGL context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @private
     */

  }, {
    key: 'dispatchComposeEvent_',
    value: function dispatchComposeEvent_(type, context, frameState) {
      var layer = this.getLayer();
      if (layer.hasListener(type)) {
        var viewState = frameState.viewState;
        var resolution = viewState.resolution;
        var pixelRatio = frameState.pixelRatio;
        var extent = frameState.extent;
        var center = viewState.center;
        var rotation = viewState.rotation;
        var size = frameState.size;

        var render = new _Immediate2.default(context, center, resolution, rotation, size, extent, pixelRatio);
        var composeEvent = new _Event2.default(type, render, frameState, null, context);
        layer.dispatchEvent(composeEvent);
      }
    }

    /**
     * @return {!module:ol/transform~Transform} Matrix.
     */

  }, {
    key: 'getTexCoordMatrix',
    value: function getTexCoordMatrix() {
      return this.texCoordMatrix;
    }

    /**
     * @return {WebGLTexture} Texture.
     */

  }, {
    key: 'getTexture',
    value: function getTexture() {
      return this.texture;
    }

    /**
     * @return {!module:ol/transform~Transform} Matrix.
     */

  }, {
    key: 'getProjectionMatrix',
    value: function getProjectionMatrix() {
      return this.projectionMatrix;
    }

    /**
     * Handle webglcontextlost.
     */

  }, {
    key: 'handleWebGLContextLost',
    value: function handleWebGLContextLost() {
      this.texture = null;
      this.framebuffer = null;
      this.framebufferDimension = undefined;
    }

    /**
     * @abstract
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @param {module:ol/webgl/Context} context Context.
     * @return {boolean} whether composeFrame should be called.
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState, context) {}

    /**
     * @abstract
     * @param {module:ol/pixel~Pixel} pixel Pixel.
     * @param {module:ol/PluggableMap~FrameState} frameState FrameState.
     * @param {function(this: S, module:ol/layer/Layer, (Uint8ClampedArray|Uint8Array)): T} callback Layer
     *     callback.
     * @param {S} thisArg Value to use as `this` when executing `callback`.
     * @return {T|undefined} Callback result.
     * @template S,T,U
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {}
  }]);

  return WebGLLayerRenderer;
}(_Layer2.default);

exports.default = WebGLLayerRenderer;