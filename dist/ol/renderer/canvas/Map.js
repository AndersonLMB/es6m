'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layerRendererConstructors = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transform = require('../../transform.js');

var _array = require('../../array.js');

var _css = require('../../css.js');

var _dom = require('../../dom.js');

var _Layer = require('../../layer/Layer.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _canvas = require('../../render/canvas.js');

var _Immediate = require('../../render/canvas/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Map = require('../Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _State = require('../../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/canvas/Map
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @type {Array<module:ol/renderer/Layer>}
 */
var layerRendererConstructors = exports.layerRendererConstructors = [];

/**
 * @classdesc
 * Canvas map renderer.
 * @api
 */

var CanvasMapRenderer = function (_MapRenderer) {
  _inherits(CanvasMapRenderer, _MapRenderer);

  /**
   * @param {module:ol/PluggableMap} map Map.
   */
  function CanvasMapRenderer(map) {
    _classCallCheck(this, CanvasMapRenderer);

    var _this = _possibleConstructorReturn(this, (CanvasMapRenderer.__proto__ || Object.getPrototypeOf(CanvasMapRenderer)).call(this, map));

    var container = map.getViewport();

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    _this.context_ = (0, _dom.createCanvasContext2D)();

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = _this.context_.canvas;

    _this.canvas_.style.width = '100%';
    _this.canvas_.style.height = '100%';
    _this.canvas_.style.display = 'block';
    _this.canvas_.className = _css.CLASS_UNSELECTABLE;
    container.insertBefore(_this.canvas_, container.childNodes[0] || null);

    /**
     * @private
     * @type {boolean}
     */
    _this.renderedVisible_ = true;

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.transform_ = (0, _transform.create)();

    return _this;
  }

  /**
   * @param {module:ol/render/EventType} type Event type.
   * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
   * @private
   */


  _createClass(CanvasMapRenderer, [{
    key: 'dispatchComposeEvent_',
    value: function dispatchComposeEvent_(type, frameState) {
      var map = this.getMap();
      var context = this.context_;
      if (map.hasListener(type)) {
        var extent = frameState.extent;
        var pixelRatio = frameState.pixelRatio;
        var viewState = frameState.viewState;
        var rotation = viewState.rotation;

        var transform = this.getTransform(frameState);

        var vectorContext = new _Immediate2.default(context, pixelRatio, extent, transform, rotation);
        var composeEvent = new _Event2.default(type, vectorContext, frameState, context, null);
        map.dispatchEvent(composeEvent);
      }
    }

    /**
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @protected
     * @return {!module:ol/transform~Transform} Transform.
     */

  }, {
    key: 'getTransform',
    value: function getTransform(frameState) {
      var viewState = frameState.viewState;
      var dx1 = this.canvas_.width / 2;
      var dy1 = this.canvas_.height / 2;
      var sx = frameState.pixelRatio / viewState.resolution;
      var sy = -sx;
      var angle = -viewState.rotation;
      var dx2 = -viewState.center[0];
      var dy2 = -viewState.center[1];
      return (0, _transform.compose)(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'renderFrame',
    value: function renderFrame(frameState) {

      if (!frameState) {
        if (this.renderedVisible_) {
          this.canvas_.style.display = 'none';
          this.renderedVisible_ = false;
        }
        return;
      }

      var context = this.context_;
      var pixelRatio = frameState.pixelRatio;
      var width = Math.round(frameState.size[0] * pixelRatio);
      var height = Math.round(frameState.size[1] * pixelRatio);
      if (this.canvas_.width != width || this.canvas_.height != height) {
        this.canvas_.width = width;
        this.canvas_.height = height;
      } else {
        context.clearRect(0, 0, width, height);
      }

      var rotation = frameState.viewState.rotation;

      this.calculateMatrices2D(frameState);

      this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, frameState);

      var layerStatesArray = frameState.layerStatesArray;
      (0, _array.stableSort)(layerStatesArray, _Map.sortByZIndex);

      if (rotation) {
        context.save();
        (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
      }

      var viewResolution = frameState.viewState.resolution;
      var i = void 0,
          ii = void 0,
          layer = void 0,
          layerRenderer = void 0,
          layerState = void 0;
      for (i = 0, ii = layerStatesArray.length; i < ii; ++i) {
        layerState = layerStatesArray[i];
        layer = layerState.layer;
        layerRenderer = /** @type {module:ol/renderer/canvas/Layer} */this.getLayerRenderer(layer);
        if (!(0, _Layer.visibleAtResolution)(layerState, viewResolution) || layerState.sourceState != _State2.default.READY) {
          continue;
        }
        if (layerRenderer.prepareFrame(frameState, layerState)) {
          layerRenderer.composeFrame(frameState, layerState, context);
        }
      }

      if (rotation) {
        context.restore();
      }

      this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, frameState);

      if (!this.renderedVisible_) {
        this.canvas_.style.display = '';
        this.renderedVisible_ = true;
      }

      this.scheduleRemoveUnusedLayerRenderers(frameState);
      this.scheduleExpireIconCache(frameState);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
      var result = void 0;
      var viewState = frameState.viewState;
      var viewResolution = viewState.resolution;

      var layerStates = frameState.layerStatesArray;
      var numLayers = layerStates.length;

      var coordinate = (0, _transform.apply)(frameState.pixelToCoordinateTransform, pixel.slice());

      var i = void 0;
      for (i = numLayers - 1; i >= 0; --i) {
        var layerState = layerStates[i];
        var layer = layerState.layer;
        if ((0, _Layer.visibleAtResolution)(layerState, viewResolution) && layerFilter.call(thisArg2, layer)) {
          var layerRenderer = /** @type {module:ol/renderer/canvas/Layer} */this.getLayerRenderer(layer);
          result = layerRenderer.forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'registerLayerRenderers',
    value: function registerLayerRenderers(constructors) {
      _Map2.default.prototype.registerLayerRenderers.call(this, constructors);
      for (var i = 0, ii = constructors.length; i < ii; ++i) {
        var ctor = constructors[i];
        if (!(0, _array.includes)(layerRendererConstructors, ctor)) {
          layerRendererConstructors.push(ctor);
        }
      }
    }
  }]);

  return CanvasMapRenderer;
}(_Map2.default);

exports.default = CanvasMapRenderer;