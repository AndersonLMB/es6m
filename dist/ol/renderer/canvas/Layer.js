'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../../extent.js');

var _functions = require('../../functions.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _canvas = require('../../render/canvas.js');

var _Immediate = require('../../render/canvas/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Layer = require('../Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/Layer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CanvasLayerRenderer = function (_LayerRenderer) {
  _inherits(CanvasLayerRenderer, _LayerRenderer);

  /**
   * @param {module:ol/layer/Layer} layer Layer.
   */
  function CanvasLayerRenderer(layer) {
    _classCallCheck(this, CanvasLayerRenderer);

    /**
     * @protected
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (CanvasLayerRenderer.__proto__ || Object.getPrototypeOf(CanvasLayerRenderer)).call(this, layer));

    _this.renderedResolution;

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.transform_ = (0, _transform.create)();

    return _this;
  }

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
   * @param {module:ol/extent~Extent} extent Clip extent.
   * @protected
   */


  _createClass(CanvasLayerRenderer, [{
    key: 'clip',
    value: function clip(context, frameState, extent) {
      var pixelRatio = frameState.pixelRatio;
      var width = frameState.size[0] * pixelRatio;
      var height = frameState.size[1] * pixelRatio;
      var rotation = frameState.viewState.rotation;
      var topLeft = (0, _extent.getTopLeft)( /** @type {module:ol/extent~Extent} */extent);
      var topRight = (0, _extent.getTopRight)( /** @type {module:ol/extent~Extent} */extent);
      var bottomRight = (0, _extent.getBottomRight)( /** @type {module:ol/extent~Extent} */extent);
      var bottomLeft = (0, _extent.getBottomLeft)( /** @type {module:ol/extent~Extent} */extent);

      (0, _transform.apply)(frameState.coordinateToPixelTransform, topLeft);
      (0, _transform.apply)(frameState.coordinateToPixelTransform, topRight);
      (0, _transform.apply)(frameState.coordinateToPixelTransform, bottomRight);
      (0, _transform.apply)(frameState.coordinateToPixelTransform, bottomLeft);

      context.save();
      (0, _canvas.rotateAtOffset)(context, -rotation, width / 2, height / 2);
      context.beginPath();
      context.moveTo(topLeft[0] * pixelRatio, topLeft[1] * pixelRatio);
      context.lineTo(topRight[0] * pixelRatio, topRight[1] * pixelRatio);
      context.lineTo(bottomRight[0] * pixelRatio, bottomRight[1] * pixelRatio);
      context.lineTo(bottomLeft[0] * pixelRatio, bottomLeft[1] * pixelRatio);
      context.clip();
      (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
    }

    /**
     * @param {module:ol/render/EventType} type Event type.
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/transform~Transform=} opt_transform Transform.
     * @private
     */

  }, {
    key: 'dispatchComposeEvent_',
    value: function dispatchComposeEvent_(type, context, frameState, opt_transform) {
      var layer = this.getLayer();
      if (layer.hasListener(type)) {
        var width = frameState.size[0] * frameState.pixelRatio;
        var height = frameState.size[1] * frameState.pixelRatio;
        var rotation = frameState.viewState.rotation;
        (0, _canvas.rotateAtOffset)(context, -rotation, width / 2, height / 2);
        var transform = opt_transform !== undefined ? opt_transform : this.getTransform(frameState, 0);
        var render = new _Immediate2.default(context, frameState.pixelRatio, frameState.extent, transform, frameState.viewState.rotation);
        var composeEvent = new _Event2.default(type, render, frameState, context, null);
        layer.dispatchEvent(composeEvent);
        (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
      }
    }

    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {module:ol/PluggableMap~FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {function(this: S, module:ol/layer/Layer, (Uint8ClampedArray|Uint8Array)): T} callback Layer
     *     callback.
     * @param {S} thisArg Value to use as `this` when executing `callback`.
     * @return {T|undefined} Callback result.
     * @template S,T,U
     */

  }, {
    key: 'forEachLayerAtCoordinate',
    value: function forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
      var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, _functions.TRUE, this);

      if (hasFeature) {
        return callback.call(thisArg, this.getLayer(), null);
      } else {
        return undefined;
      }
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @param {module:ol/transform~Transform=} opt_transform Transform.
     * @protected
     */

  }, {
    key: 'postCompose',
    value: function postCompose(context, frameState, layerState, opt_transform) {
      this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, context, frameState, opt_transform);
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/transform~Transform=} opt_transform Transform.
     * @protected
     */

  }, {
    key: 'preCompose',
    value: function preCompose(context, frameState, opt_transform) {
      this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, context, frameState, opt_transform);
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/transform~Transform=} opt_transform Transform.
     * @protected
     */

  }, {
    key: 'dispatchRenderEvent',
    value: function dispatchRenderEvent(context, frameState, opt_transform) {
      this.dispatchComposeEvent_(_EventType2.default.RENDER, context, frameState, opt_transform);
    }

    /**
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {number} offsetX Offset on the x-axis in view coordinates.
     * @protected
     * @return {!module:ol/transform~Transform} Transform.
     */

  }, {
    key: 'getTransform',
    value: function getTransform(frameState, offsetX) {
      var viewState = frameState.viewState;
      var pixelRatio = frameState.pixelRatio;
      var dx1 = pixelRatio * frameState.size[0] / 2;
      var dy1 = pixelRatio * frameState.size[1] / 2;
      var sx = pixelRatio / viewState.resolution;
      var sy = -sx;
      var angle = -viewState.rotation;
      var dx2 = -viewState.center[0] + offsetX;
      var dy2 = -viewState.center[1];
      return (0, _transform.compose)(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
    }

    /**
     * @abstract
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @param {CanvasRenderingContext2D} context Context.
     */

  }, {
    key: 'composeFrame',
    value: function composeFrame(frameState, layerState, context) {}

    /**
     * @abstract
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @param {module:ol/layer/Layer~State} layerState Layer state.
     * @return {boolean} whether composeFrame should be called.
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState) {}
  }]);

  return CanvasLayerRenderer;
}(_Layer2.default);

exports.default = CanvasLayerRenderer;