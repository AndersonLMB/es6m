'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createEmptyTexture = createEmptyTexture;
exports.createTexture = createTexture;

var _util = require('../util.js');

var _webgl = require('../webgl.js');

var _Disposable2 = require('../Disposable.js');

var _Disposable3 = _interopRequireDefault(_Disposable2);

var _array = require('../array.js');

var _events = require('../events.js');

var _obj = require('../obj.js');

var _ContextEventType = require('../webgl/ContextEventType.js');

var _ContextEventType2 = _interopRequireDefault(_ContextEventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/webgl/Context
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} BufferCacheEntry
 * @property {module:ol/webgl/Buffer} buf
 * @property {WebGLBuffer} buffer
 */

/**
 * @classdesc
 * A WebGL context for accessing low-level WebGL capabilities.
 */
var WebGLContext = function (_Disposable) {
  _inherits(WebGLContext, _Disposable);

  /**
   * @param {HTMLCanvasElement} canvas Canvas.
   * @param {WebGLRenderingContext} gl GL.
   */
  function WebGLContext(canvas, gl) {
    _classCallCheck(this, WebGLContext);

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    var _this = _possibleConstructorReturn(this, (WebGLContext.__proto__ || Object.getPrototypeOf(WebGLContext)).call(this));

    _this.canvas_ = canvas;

    /**
     * @private
     * @type {WebGLRenderingContext}
     */
    _this.gl_ = gl;

    /**
     * @private
     * @type {!Object<string, module:ol/webgl/Context~BufferCacheEntry>}
     */
    _this.bufferCache_ = {};

    /**
     * @private
     * @type {!Object<string, WebGLShader>}
     */
    _this.shaderCache_ = {};

    /**
     * @private
     * @type {!Object<string, WebGLProgram>}
     */
    _this.programCache_ = {};

    /**
     * @private
     * @type {WebGLProgram}
     */
    _this.currentProgram_ = null;

    /**
     * @private
     * @type {WebGLFramebuffer}
     */
    _this.hitDetectionFramebuffer_ = null;

    /**
     * @private
     * @type {WebGLTexture}
     */
    _this.hitDetectionTexture_ = null;

    /**
     * @private
     * @type {WebGLRenderbuffer}
     */
    _this.hitDetectionRenderbuffer_ = null;

    /**
     * @type {boolean}
     */
    _this.hasOESElementIndexUint = (0, _array.includes)(_webgl.EXTENSIONS, 'OES_element_index_uint');

    // use the OES_element_index_uint extension if available
    if (_this.hasOESElementIndexUint) {
      gl.getExtension('OES_element_index_uint');
    }

    (0, _events.listen)(_this.canvas_, _ContextEventType2.default.LOST, _this.handleWebGLContextLost, _this);
    (0, _events.listen)(_this.canvas_, _ContextEventType2.default.RESTORED, _this.handleWebGLContextRestored, _this);

    return _this;
  }

  /**
   * Just bind the buffer if it's in the cache. Otherwise create
   * the WebGL buffer, bind it, populate it, and add an entry to
   * the cache.
   * @param {number} target Target.
   * @param {module:ol/webgl/Buffer} buf Buffer.
   */


  _createClass(WebGLContext, [{
    key: 'bindBuffer',
    value: function bindBuffer(target, buf) {
      var gl = this.getGL();
      var arr = buf.getArray();
      var bufferKey = String((0, _util.getUid)(buf));
      if (bufferKey in this.bufferCache_) {
        var bufferCacheEntry = this.bufferCache_[bufferKey];
        gl.bindBuffer(target, bufferCacheEntry.buffer);
      } else {
        var buffer = gl.createBuffer();
        gl.bindBuffer(target, buffer);
        var /** @type {ArrayBufferView} */arrayBuffer = void 0;
        if (target == _webgl.ARRAY_BUFFER) {
          arrayBuffer = new Float32Array(arr);
        } else if (target == _webgl.ELEMENT_ARRAY_BUFFER) {
          arrayBuffer = this.hasOESElementIndexUint ? new Uint32Array(arr) : new Uint16Array(arr);
        }
        gl.bufferData(target, arrayBuffer, buf.getUsage());
        this.bufferCache_[bufferKey] = {
          buf: buf,
          buffer: buffer
        };
      }
    }

    /**
     * @param {module:ol/webgl/Buffer} buf Buffer.
     */

  }, {
    key: 'deleteBuffer',
    value: function deleteBuffer(buf) {
      var gl = this.getGL();
      var bufferKey = String((0, _util.getUid)(buf));
      var bufferCacheEntry = this.bufferCache_[bufferKey];
      if (!gl.isContextLost()) {
        gl.deleteBuffer(bufferCacheEntry.buffer);
      }
      delete this.bufferCache_[bufferKey];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      (0, _events.unlistenAll)(this.canvas_);
      var gl = this.getGL();
      if (!gl.isContextLost()) {
        for (var key in this.bufferCache_) {
          gl.deleteBuffer(this.bufferCache_[key].buffer);
        }
        for (var _key in this.programCache_) {
          gl.deleteProgram(this.programCache_[_key]);
        }
        for (var _key2 in this.shaderCache_) {
          gl.deleteShader(this.shaderCache_[_key2]);
        }
        // delete objects for hit-detection
        gl.deleteFramebuffer(this.hitDetectionFramebuffer_);
        gl.deleteRenderbuffer(this.hitDetectionRenderbuffer_);
        gl.deleteTexture(this.hitDetectionTexture_);
      }
    }

    /**
     * @return {HTMLCanvasElement} Canvas.
     */

  }, {
    key: 'getCanvas',
    value: function getCanvas() {
      return this.canvas_;
    }

    /**
     * Get the WebGL rendering context
     * @return {WebGLRenderingContext} The rendering context.
     * @api
     */

  }, {
    key: 'getGL',
    value: function getGL() {
      return this.gl_;
    }

    /**
     * Get the frame buffer for hit detection.
     * @return {WebGLFramebuffer} The hit detection frame buffer.
     */

  }, {
    key: 'getHitDetectionFramebuffer',
    value: function getHitDetectionFramebuffer() {
      if (!this.hitDetectionFramebuffer_) {
        this.initHitDetectionFramebuffer_();
      }
      return this.hitDetectionFramebuffer_;
    }

    /**
     * Get shader from the cache if it's in the cache. Otherwise, create
     * the WebGL shader, compile it, and add entry to cache.
     * @param {module:ol/webgl/Shader} shaderObject Shader object.
     * @return {WebGLShader} Shader.
     */

  }, {
    key: 'getShader',
    value: function getShader(shaderObject) {
      var shaderKey = String((0, _util.getUid)(shaderObject));
      if (shaderKey in this.shaderCache_) {
        return this.shaderCache_[shaderKey];
      } else {
        var gl = this.getGL();
        var shader = gl.createShader(shaderObject.getType());
        gl.shaderSource(shader, shaderObject.getSource());
        gl.compileShader(shader);
        this.shaderCache_[shaderKey] = shader;
        return shader;
      }
    }

    /**
     * Get the program from the cache if it's in the cache. Otherwise create
     * the WebGL program, attach the shaders to it, and add an entry to the
     * cache.
     * @param {module:ol/webgl/Fragment} fragmentShaderObject Fragment shader.
     * @param {module:ol/webgl/Vertex} vertexShaderObject Vertex shader.
     * @return {WebGLProgram} Program.
     */

  }, {
    key: 'getProgram',
    value: function getProgram(fragmentShaderObject, vertexShaderObject) {
      var programKey = (0, _util.getUid)(fragmentShaderObject) + '/' + (0, _util.getUid)(vertexShaderObject);
      if (programKey in this.programCache_) {
        return this.programCache_[programKey];
      } else {
        var gl = this.getGL();
        var program = gl.createProgram();
        gl.attachShader(program, this.getShader(fragmentShaderObject));
        gl.attachShader(program, this.getShader(vertexShaderObject));
        gl.linkProgram(program);
        this.programCache_[programKey] = program;
        return program;
      }
    }

    /**
     * FIXME empty description for jsdoc
     */

  }, {
    key: 'handleWebGLContextLost',
    value: function handleWebGLContextLost() {
      (0, _obj.clear)(this.bufferCache_);
      (0, _obj.clear)(this.shaderCache_);
      (0, _obj.clear)(this.programCache_);
      this.currentProgram_ = null;
      this.hitDetectionFramebuffer_ = null;
      this.hitDetectionTexture_ = null;
      this.hitDetectionRenderbuffer_ = null;
    }

    /**
     * FIXME empty description for jsdoc
     */

  }, {
    key: 'handleWebGLContextRestored',
    value: function handleWebGLContextRestored() {}

    /**
     * Creates a 1x1 pixel framebuffer for the hit-detection.
     * @private
     */

  }, {
    key: 'initHitDetectionFramebuffer_',
    value: function initHitDetectionFramebuffer_() {
      var gl = this.gl_;
      var framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      var texture = createEmptyTexture(gl, 1, 1);
      var renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1, 1);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      this.hitDetectionFramebuffer_ = framebuffer;
      this.hitDetectionTexture_ = texture;
      this.hitDetectionRenderbuffer_ = renderbuffer;
    }

    /**
     * Use a program.  If the program is already in use, this will return `false`.
     * @param {WebGLProgram} program Program.
     * @return {boolean} Changed.
     * @api
     */

  }, {
    key: 'useProgram',
    value: function useProgram(program) {
      if (program == this.currentProgram_) {
        return false;
      } else {
        var gl = this.getGL();
        gl.useProgram(program);
        this.currentProgram_ = program;
        return true;
      }
    }
  }]);

  return WebGLContext;
}(_Disposable3.default);

/**
 * @param {WebGLRenderingContext} gl WebGL rendering context.
 * @param {number=} opt_wrapS wrapS.
 * @param {number=} opt_wrapT wrapT.
 * @return {WebGLTexture} The texture.
 */


function createTextureInternal(gl, opt_wrapS, opt_wrapT) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  if (opt_wrapS !== undefined) {
    gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_S, opt_wrapS);
  }
  if (opt_wrapT !== undefined) {
    gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_T, opt_wrapT);
  }

  return texture;
}

/**
 * @param {WebGLRenderingContext} gl WebGL rendering context.
 * @param {number} width Width.
 * @param {number} height Height.
 * @param {number=} opt_wrapS wrapS.
 * @param {number=} opt_wrapT wrapT.
 * @return {WebGLTexture} The texture.
 */
function createEmptyTexture(gl, width, height, opt_wrapS, opt_wrapT) {
  var texture = createTextureInternal(gl, opt_wrapS, opt_wrapT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return texture;
}

/**
 * @param {WebGLRenderingContext} gl WebGL rendering context.
 * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
 * @param {number=} opt_wrapS wrapS.
 * @param {number=} opt_wrapT wrapT.
 * @return {WebGLTexture} The texture.
 */
function createTexture(gl, image, opt_wrapS, opt_wrapT) {
  var texture = createTextureInternal(gl, opt_wrapS, opt_wrapT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
}

exports.default = WebGLContext;