'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../../extent.js');

var _VectorContext2 = require('../VectorContext.js');

var _VectorContext3 = _interopRequireDefault(_VectorContext2);

var _transform = require('../../transform.js');

var _mat = require('../../vec/mat4.js');

var _webgl = require('../../webgl.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/Replay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var WebGLReplay = function (_VectorContext) {
  _inherits(WebGLReplay, _VectorContext);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   */
  function WebGLReplay(tolerance, maxExtent) {
    _classCallCheck(this, WebGLReplay);

    /**
     * @protected
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (WebGLReplay.__proto__ || Object.getPrototypeOf(WebGLReplay)).call(this));

    _this.tolerance = tolerance;

    /**
     * @protected
     * @const
     * @type {module:ol/extent~Extent}
     */
    _this.maxExtent = maxExtent;

    /**
     * The origin of the coordinate system for the point coordinates sent to
     * the GPU. To eliminate jitter caused by precision problems in the GPU
     * we use the "Rendering Relative to Eye" technique described in the "3D
     * Engine Design for Virtual Globes" book.
     * @protected
     * @type {module:ol/coordinate~Coordinate}
     */
    _this.origin = (0, _extent.getCenter)(maxExtent);

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.projectionMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.offsetRotateMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.offsetScaleMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {Array<number>}
     */
    _this.tmpMat4_ = (0, _mat.create)();

    /**
     * @protected
     * @type {Array<number>}
     */
    _this.indices = [];

    /**
     * @protected
     * @type {?module:ol/webgl/Buffer}
     */
    _this.indicesBuffer = null;

    /**
     * Start index per feature (the index).
     * @protected
     * @type {Array<number>}
     */
    _this.startIndices = [];

    /**
     * Start index per feature (the feature).
     * @protected
     * @type {Array<module:ol/Feature|module:ol/render/Feature>}
     */
    _this.startIndicesFeature = [];

    /**
     * @protected
     * @type {Array<number>}
     */
    _this.vertices = [];

    /**
     * @protected
     * @type {?module:ol/webgl/Buffer}
     */
    _this.verticesBuffer = null;

    /**
     * Optional parameter for PolygonReplay instances.
     * @protected
     * @type {module:ol/render/webgl/LineStringReplay|undefined}
     */
    _this.lineStringReplay = undefined;

    return _this;
  }

  /**
   * @abstract
   * @param {module:ol/webgl/Context} context WebGL context.
   * @return {function()} Delete resources function.
   */


  _createClass(WebGLReplay, [{
    key: 'getDeleteResourcesFunction',
    value: function getDeleteResourcesFunction(context) {}

    /**
     * @abstract
     * @param {module:ol/webgl/Context} context Context.
     */

  }, {
    key: 'finish',
    value: function finish(context) {}

    /**
     * @abstract
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {module:ol/size~Size} size Size.
     * @param {number} pixelRatio Pixel ratio.
     * @return {module:ol/render/webgl/circlereplay/defaultshader/Locations|
       module:ol/render/webgl/linestringreplay/defaultshader/Locations|
       module:ol/render/webgl/polygonreplay/defaultshader/Locations|
       module:ol/render/webgl/texturereplay/defaultshader/Locations} Locations.
     */

  }, {
    key: 'setUpProgram',
    value: function setUpProgram(gl, context, size, pixelRatio) {}

    /**
     * @abstract
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/render/webgl/circlereplay/defaultshader/Locations|
       module:ol/render/webgl/linestringreplay/defaultshader/Locations|
       module:ol/render/webgl/polygonreplay/defaultshader/Locations|
       module:ol/render/webgl/texturereplay/defaultshader/Locations} locations Locations.
     */

  }, {
    key: 'shutDownProgram',
    value: function shutDownProgram(gl, locations) {}

    /**
     * @abstract
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {boolean} hitDetection Hit detection mode.
     */

  }, {
    key: 'drawReplay',
    value: function drawReplay(gl, context, skippedFeaturesHash, hitDetection) {}

    /**
     * @abstract
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} featureCallback Feature callback.
     * @param {module:ol/extent~Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'drawHitDetectionReplayOneByOne',
    value: function drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {}

    /**
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} featureCallback Feature callback.
     * @param {boolean} oneByOne Draw features one-by-one for the hit-detecion.
     * @param {module:ol/extent~Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'drawHitDetectionReplay',
    value: function drawHitDetectionReplay(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
      if (!oneByOne) {
        // draw all hit-detection features in "once" (by texture group)
        return this.drawHitDetectionReplayAll(gl, context, skippedFeaturesHash, featureCallback);
      } else {
        // draw hit-detection features one by one
        return this.drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent);
      }
    }

    /**
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} featureCallback Feature callback.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'drawHitDetectionReplayAll',
    value: function drawHitDetectionReplayAll(gl, context, skippedFeaturesHash, featureCallback) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      this.drawReplay(gl, context, skippedFeaturesHash, true);

      var result = featureCallback(null);
      if (result) {
        return result;
      } else {
        return undefined;
      }
    }

    /**
     * @param {module:ol/webgl/Context} context Context.
     * @param {module:ol/coordinate~Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {module:ol/size~Size} size Size.
     * @param {number} pixelRatio Pixel ratio.
     * @param {number} opacity Global opacity.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} featureCallback Feature callback.
     * @param {boolean} oneByOne Draw features one-by-one for the hit-detecion.
     * @param {module:ol/extent~Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'replay',
    value: function replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
      var gl = context.getGL();
      var tmpStencil = void 0,
          tmpStencilFunc = void 0,
          tmpStencilMaskVal = void 0,
          tmpStencilRef = void 0,
          tmpStencilMask = void 0,
          tmpStencilOpFail = void 0,
          tmpStencilOpPass = void 0,
          tmpStencilOpZFail = void 0;

      if (this.lineStringReplay) {
        tmpStencil = gl.isEnabled(gl.STENCIL_TEST);
        tmpStencilFunc = gl.getParameter(gl.STENCIL_FUNC);
        tmpStencilMaskVal = gl.getParameter(gl.STENCIL_VALUE_MASK);
        tmpStencilRef = gl.getParameter(gl.STENCIL_REF);
        tmpStencilMask = gl.getParameter(gl.STENCIL_WRITEMASK);
        tmpStencilOpFail = gl.getParameter(gl.STENCIL_FAIL);
        tmpStencilOpPass = gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
        tmpStencilOpZFail = gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);

        gl.enable(gl.STENCIL_TEST);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.stencilMask(255);
        gl.stencilFunc(gl.ALWAYS, 1, 255);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

        this.lineStringReplay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);

        gl.stencilMask(0);
        gl.stencilFunc(gl.NOTEQUAL, 1, 255);
      }

      context.bindBuffer(_webgl.ARRAY_BUFFER, this.verticesBuffer);

      context.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

      var locations = this.setUpProgram(gl, context, size, pixelRatio);

      // set the "uniform" values
      var projectionMatrix = (0, _transform.reset)(this.projectionMatrix_);
      (0, _transform.scale)(projectionMatrix, 2 / (resolution * size[0]), 2 / (resolution * size[1]));
      (0, _transform.rotate)(projectionMatrix, -rotation);
      (0, _transform.translate)(projectionMatrix, -(center[0] - this.origin[0]), -(center[1] - this.origin[1]));

      var offsetScaleMatrix = (0, _transform.reset)(this.offsetScaleMatrix_);
      (0, _transform.scale)(offsetScaleMatrix, 2 / size[0], 2 / size[1]);

      var offsetRotateMatrix = (0, _transform.reset)(this.offsetRotateMatrix_);
      if (rotation !== 0) {
        (0, _transform.rotate)(offsetRotateMatrix, -rotation);
      }

      gl.uniformMatrix4fv(locations.u_projectionMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, projectionMatrix));
      gl.uniformMatrix4fv(locations.u_offsetScaleMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, offsetScaleMatrix));
      gl.uniformMatrix4fv(locations.u_offsetRotateMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, offsetRotateMatrix));
      gl.uniform1f(locations.u_opacity, opacity);

      // draw!
      var result = void 0;
      if (featureCallback === undefined) {
        this.drawReplay(gl, context, skippedFeaturesHash, false);
      } else {
        // draw feature by feature for the hit-detection
        result = this.drawHitDetectionReplay(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);
      }

      // disable the vertex attrib arrays
      this.shutDownProgram(gl, locations);

      if (this.lineStringReplay) {
        if (!tmpStencil) {
          gl.disable(gl.STENCIL_TEST);
        }
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.stencilFunc( /** @type {number} */tmpStencilFunc,
        /** @type {number} */tmpStencilRef, /** @type {number} */tmpStencilMaskVal);
        gl.stencilMask( /** @type {number} */tmpStencilMask);
        gl.stencilOp( /** @type {number} */tmpStencilOpFail,
        /** @type {number} */tmpStencilOpZFail, /** @type {number} */tmpStencilOpPass);
      }

      return result;
    }

    /**
     * @protected
     * @param {WebGLRenderingContext} gl gl.
     * @param {module:ol/webgl/Context} context Context.
     * @param {number} start Start index.
     * @param {number} end End index.
     */

  }, {
    key: 'drawElements',
    value: function drawElements(gl, context, start, end) {
      var elementType = context.hasOESElementIndexUint ? _webgl.UNSIGNED_INT : _webgl.UNSIGNED_SHORT;
      var elementSize = context.hasOESElementIndexUint ? 4 : 2;

      var numItems = end - start;
      var offsetInBytes = start * elementSize;
      gl.drawElements(_webgl.TRIANGLES, numItems, elementType, offsetInBytes);
    }
  }]);

  return WebGLReplay;
}(_VectorContext3.default);

exports.default = WebGLReplay;