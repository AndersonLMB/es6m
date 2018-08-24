'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../../array.js');

var _css = require('../../css.js');

var _dom = require('../../dom.js');

var _events = require('../../events.js');

var _Layer = require('../../layer/Layer.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Immediate = require('../../render/webgl/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Map = require('../Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _State = require('../../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _LRUCache = require('../../structs/LRUCache.js');

var _LRUCache2 = _interopRequireDefault(_LRUCache);

var _PriorityQueue = require('../../structs/PriorityQueue.js');

var _PriorityQueue2 = _interopRequireDefault(_PriorityQueue);

var _webgl = require('../../webgl.js');

var _Context = require('../../webgl/Context.js');

var _Context2 = _interopRequireDefault(_Context);

var _ContextEventType = require('../../webgl/ContextEventType.js');

var _ContextEventType2 = _interopRequireDefault(_ContextEventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/webgl/Map
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} TextureCacheEntry
 * @property {number} magFilter
 * @property {number} minFilter
 * @property {WebGLTexture} texture
 */

/**
 * Texture cache high water mark.
 * @type {number}
 */
var WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;

/**
 * @classdesc
 * WebGL map renderer.
 * @api
 */

var WebGLMapRenderer = function (_MapRenderer) {
  _inherits(WebGLMapRenderer, _MapRenderer);

  /**
   * @param {module:ol/PluggableMap} map Map.
   */
  function WebGLMapRenderer(map) {
    _classCallCheck(this, WebGLMapRenderer);

    var _this = _possibleConstructorReturn(this, (WebGLMapRenderer.__proto__ || Object.getPrototypeOf(WebGLMapRenderer)).call(this, map));

    var container = map.getViewport();

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = /** @type {HTMLCanvasElement} */
    document.createElement('CANVAS');
    _this.canvas_.style.width = '100%';
    _this.canvas_.style.height = '100%';
    _this.canvas_.style.display = 'block';
    _this.canvas_.className = _css.CLASS_UNSELECTABLE;
    container.insertBefore(_this.canvas_, container.childNodes[0] || null);

    /**
     * @private
     * @type {number}
     */
    _this.clipTileCanvasWidth_ = 0;

    /**
     * @private
     * @type {number}
     */
    _this.clipTileCanvasHeight_ = 0;

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    _this.clipTileContext_ = (0, _dom.createCanvasContext2D)();

    /**
     * @private
     * @type {boolean}
     */
    _this.renderedVisible_ = true;

    /**
     * @private
     * @type {WebGLRenderingContext}
     */
    _this.gl_ = (0, _webgl.getContext)(_this.canvas_, {
      antialias: true,
      depth: true,
      failIfMajorPerformanceCaveat: true,
      preserveDrawingBuffer: false,
      stencil: true
    });

    /**
     * @private
     * @type {module:ol/webgl/Context}
     */
    _this.context_ = new _Context2.default(_this.canvas_, _this.gl_);

    (0, _events.listen)(_this.canvas_, _ContextEventType2.default.LOST, _this.handleWebGLContextLost, _this);
    (0, _events.listen)(_this.canvas_, _ContextEventType2.default.RESTORED, _this.handleWebGLContextRestored, _this);

    /**
     * @private
     * @type {module:ol/structs/LRUCache<module:ol/renderer/webgl/Map~TextureCacheEntry|null>}
     */
    _this.textureCache_ = new _LRUCache2.default();

    /**
     * @private
     * @type {module:ol/coordinate~Coordinate}
     */
    _this.focus_ = null;

    /**
     * @private
     * @type {module:ol/structs/PriorityQueue<Array>}
     */
    _this.tileTextureQueue_ = new _PriorityQueue2.default(
    /**
     * @param {Array<*>} element Element.
     * @return {number} Priority.
     * @this {module:ol/renderer/webgl/Map}
     */
    function (element) {
      var tileCenter = /** @type {module:ol/coordinate~Coordinate} */element[1];
      var tileResolution = /** @type {number} */element[2];
      var deltaX = tileCenter[0] - this.focus_[0];
      var deltaY = tileCenter[1] - this.focus_[1];
      return 65536 * Math.log(tileResolution) + Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tileResolution;
    }.bind(_this),
    /**
     * @param {Array<*>} element Element.
     * @return {string} Key.
     */
    function (element) {
      return (
        /** @type {module:ol/Tile} */element[0].getKey()
      );
    });

    /**
     * @param {module:ol/PluggableMap} map Map.
     * @param {?module:ol/PluggableMap~FrameState} frameState Frame state.
     * @return {boolean} false.
     * @this {module:ol/renderer/webgl/Map}
     */
    _this.loadNextTileTexture_ = function (map, frameState) {
      if (!this.tileTextureQueue_.isEmpty()) {
        this.tileTextureQueue_.reprioritize();
        var element = this.tileTextureQueue_.dequeue();
        var tile = /** @type {module:ol/Tile} */element[0];
        var tileSize = /** @type {module:ol/size~Size} */element[3];
        var tileGutter = /** @type {number} */element[4];
        this.bindTileTexture(tile, tileSize, tileGutter, _webgl.LINEAR, _webgl.LINEAR);
      }
      return false;
    }.bind(_this);

    /**
     * @private
     * @type {number}
     */
    _this.textureCacheFrameMarkerCount_ = 0;

    _this.initializeGL_();
    return _this;
  }

  /**
   * @param {module:ol/Tile} tile Tile.
   * @param {module:ol/size~Size} tileSize Tile size.
   * @param {number} tileGutter Tile gutter.
   * @param {number} magFilter Mag filter.
   * @param {number} minFilter Min filter.
   */


  _createClass(WebGLMapRenderer, [{
    key: 'bindTileTexture',
    value: function bindTileTexture(tile, tileSize, tileGutter, magFilter, minFilter) {
      var gl = this.getGL();
      var tileKey = tile.getKey();
      if (this.textureCache_.containsKey(tileKey)) {
        var textureCacheEntry = this.textureCache_.get(tileKey);
        gl.bindTexture(_webgl.TEXTURE_2D, textureCacheEntry.texture);
        if (textureCacheEntry.magFilter != magFilter) {
          gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MAG_FILTER, magFilter);
          textureCacheEntry.magFilter = magFilter;
        }
        if (textureCacheEntry.minFilter != minFilter) {
          gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MIN_FILTER, minFilter);
          textureCacheEntry.minFilter = minFilter;
        }
      } else {
        var texture = gl.createTexture();
        gl.bindTexture(_webgl.TEXTURE_2D, texture);
        if (tileGutter > 0) {
          var clipTileCanvas = this.clipTileContext_.canvas;
          var clipTileContext = this.clipTileContext_;
          if (this.clipTileCanvasWidth_ !== tileSize[0] || this.clipTileCanvasHeight_ !== tileSize[1]) {
            clipTileCanvas.width = tileSize[0];
            clipTileCanvas.height = tileSize[1];
            this.clipTileCanvasWidth_ = tileSize[0];
            this.clipTileCanvasHeight_ = tileSize[1];
          } else {
            clipTileContext.clearRect(0, 0, tileSize[0], tileSize[1]);
          }
          clipTileContext.drawImage(tile.getImage(), tileGutter, tileGutter, tileSize[0], tileSize[1], 0, 0, tileSize[0], tileSize[1]);
          gl.texImage2D(_webgl.TEXTURE_2D, 0, _webgl.RGBA, _webgl.RGBA, _webgl.UNSIGNED_BYTE, clipTileCanvas);
        } else {
          gl.texImage2D(_webgl.TEXTURE_2D, 0, _webgl.RGBA, _webgl.RGBA, _webgl.UNSIGNED_BYTE, tile.getImage());
        }
        gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_S, _webgl.CLAMP_TO_EDGE);
        gl.texParameteri(_webgl.TEXTURE_2D, _webgl.TEXTURE_WRAP_T, _webgl.CLAMP_TO_EDGE);
        this.textureCache_.set(tileKey, {
          texture: texture,
          magFilter: magFilter,
          minFilter: minFilter
        });
      }
    }

    /**
     * @param {module:ol/render/EventType} type Event type.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @private
     */

  }, {
    key: 'dispatchComposeEvent_',
    value: function dispatchComposeEvent_(type, frameState) {
      var map = this.getMap();
      if (map.hasListener(type)) {
        var context = this.context_;

        var extent = frameState.extent;
        var size = frameState.size;
        var viewState = frameState.viewState;
        var pixelRatio = frameState.pixelRatio;

        var resolution = viewState.resolution;
        var center = viewState.center;
        var rotation = viewState.rotation;

        var vectorContext = new _Immediate2.default(context, center, resolution, rotation, size, extent, pixelRatio);
        var composeEvent = new _Event2.default(type, vectorContext, frameState, null, context);
        map.dispatchEvent(composeEvent);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      var gl = this.getGL();
      if (!gl.isContextLost()) {
        this.textureCache_.forEach(
        /**
         * @param {?module:ol/renderer/webgl/Map~TextureCacheEntry} textureCacheEntry
         *     Texture cache entry.
         */
        function (textureCacheEntry) {
          if (textureCacheEntry) {
            gl.deleteTexture(textureCacheEntry.texture);
          }
        });
      }
      this.context_.dispose();
      _Map2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @param {module:ol/PluggableMap} map Map.
     * @param {module:ol/PluggableMap~FrameState} frameState Frame state.
     * @private
     */

  }, {
    key: 'expireCache_',
    value: function expireCache_(map, frameState) {
      var gl = this.getGL();
      var textureCacheEntry = void 0;
      while (this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK) {
        textureCacheEntry = this.textureCache_.peekLast();
        if (!textureCacheEntry) {
          if (+this.textureCache_.peekLastKey() == frameState.index) {
            break;
          } else {
            --this.textureCacheFrameMarkerCount_;
          }
        } else {
          gl.deleteTexture(textureCacheEntry.texture);
        }
        this.textureCache_.pop();
      }
    }

    /**
     * @return {module:ol/webgl/Context} The context.
     */

  }, {
    key: 'getContext',
    value: function getContext() {
      return this.context_;
    }

    /**
     * @return {WebGLRenderingContext} GL.
     */

  }, {
    key: 'getGL',
    value: function getGL() {
      return this.gl_;
    }

    /**
     * @return {module:ol/structs/PriorityQueue<Array>} Tile texture queue.
     */

  }, {
    key: 'getTileTextureQueue',
    value: function getTileTextureQueue() {
      return this.tileTextureQueue_;
    }

    /**
     * @param {module:ol/events/Event} event Event.
     * @protected
     */

  }, {
    key: 'handleWebGLContextLost',
    value: function handleWebGLContextLost(event) {
      event.preventDefault();
      this.textureCache_.clear();
      this.textureCacheFrameMarkerCount_ = 0;

      var renderers = this.getLayerRenderers();
      for (var id in renderers) {
        var renderer = /** @type {module:ol/renderer/webgl/Layer} */renderers[id];
        renderer.handleWebGLContextLost();
      }
    }

    /**
     * @protected
     */

  }, {
    key: 'handleWebGLContextRestored',
    value: function handleWebGLContextRestored() {
      this.initializeGL_();
      this.getMap().render();
    }

    /**
     * @private
     */

  }, {
    key: 'initializeGL_',
    value: function initializeGL_() {
      var gl = this.gl_;
      gl.activeTexture(_webgl.TEXTURE0);
      gl.blendFuncSeparate(_webgl.SRC_ALPHA, _webgl.ONE_MINUS_SRC_ALPHA, _webgl.ONE, _webgl.ONE_MINUS_SRC_ALPHA);
      gl.disable(_webgl.CULL_FACE);
      gl.disable(_webgl.DEPTH_TEST);
      gl.disable(_webgl.SCISSOR_TEST);
      gl.disable(_webgl.STENCIL_TEST);
    }

    /**
     * @param {module:ol/Tile} tile Tile.
     * @return {boolean} Is tile texture loaded.
     */

  }, {
    key: 'isTileTextureLoaded',
    value: function isTileTextureLoaded(tile) {
      return this.textureCache_.containsKey(tile.getKey());
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'renderFrame',
    value: function renderFrame(frameState) {

      var context = this.getContext();
      var gl = this.getGL();

      if (gl.isContextLost()) {
        return false;
      }

      if (!frameState) {
        if (this.renderedVisible_) {
          this.canvas_.style.display = 'none';
          this.renderedVisible_ = false;
        }
        return false;
      }

      this.focus_ = frameState.focus;

      this.textureCache_.set((-frameState.index).toString(), null);
      ++this.textureCacheFrameMarkerCount_;

      this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, frameState);

      /** @type {Array<module:ol/layer/Layer~State>} */
      var layerStatesToDraw = [];
      var layerStatesArray = frameState.layerStatesArray;
      (0, _array.stableSort)(layerStatesArray, _Map.sortByZIndex);

      var viewResolution = frameState.viewState.resolution;
      var i = void 0,
          ii = void 0,
          layerRenderer = void 0,
          layerState = void 0;
      for (i = 0, ii = layerStatesArray.length; i < ii; ++i) {
        layerState = layerStatesArray[i];
        if ((0, _Layer.visibleAtResolution)(layerState, viewResolution) && layerState.sourceState == _State2.default.READY) {
          layerRenderer = /** @type {module:ol/renderer/webgl/Layer} */this.getLayerRenderer(layerState.layer);
          if (layerRenderer.prepareFrame(frameState, layerState, context)) {
            layerStatesToDraw.push(layerState);
          }
        }
      }

      var width = frameState.size[0] * frameState.pixelRatio;
      var height = frameState.size[1] * frameState.pixelRatio;
      if (this.canvas_.width != width || this.canvas_.height != height) {
        this.canvas_.width = width;
        this.canvas_.height = height;
      }

      gl.bindFramebuffer(_webgl.FRAMEBUFFER, null);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(_webgl.COLOR_BUFFER_BIT);
      gl.enable(_webgl.BLEND);
      gl.viewport(0, 0, this.canvas_.width, this.canvas_.height);

      for (i = 0, ii = layerStatesToDraw.length; i < ii; ++i) {
        layerState = layerStatesToDraw[i];
        layerRenderer = /** @type {module:ol/renderer/webgl/Layer} */this.getLayerRenderer(layerState.layer);
        layerRenderer.composeFrame(frameState, layerState, context);
      }

      if (!this.renderedVisible_) {
        this.canvas_.style.display = '';
        this.renderedVisible_ = true;
      }

      this.calculateMatrices2D(frameState);

      if (this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK) {
        frameState.postRenderFunctions.push(
        /** @type {module:ol/PluggableMap~PostRenderFunction} */this.expireCache_.bind(this));
      }

      if (!this.tileTextureQueue_.isEmpty()) {
        frameState.postRenderFunctions.push(this.loadNextTileTexture_);
        frameState.animate = true;
      }

      this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, frameState);

      this.scheduleRemoveUnusedLayerRenderers(frameState);
      this.scheduleExpireIconCache(frameState);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
      var result = void 0;

      if (this.getGL().isContextLost()) {
        return false;
      }

      var viewState = frameState.viewState;

      var layerStates = frameState.layerStatesArray;
      var numLayers = layerStates.length;
      var i = void 0;
      for (i = numLayers - 1; i >= 0; --i) {
        var layerState = layerStates[i];
        var layer = layerState.layer;
        if ((0, _Layer.visibleAtResolution)(layerState, viewState.resolution) && layerFilter.call(thisArg2, layer)) {
          var layerRenderer = this.getLayerRenderer(layer);
          result = layerRenderer.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg);
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
    key: 'hasFeatureAtCoordinate',
    value: function hasFeatureAtCoordinate(coordinate, frameState, hitTolerance, layerFilter, thisArg) {
      var hasFeature = false;

      if (this.getGL().isContextLost()) {
        return false;
      }

      var viewState = frameState.viewState;

      var layerStates = frameState.layerStatesArray;
      var numLayers = layerStates.length;
      var i = void 0;
      for (i = numLayers - 1; i >= 0; --i) {
        var layerState = layerStates[i];
        var layer = layerState.layer;
        if ((0, _Layer.visibleAtResolution)(layerState, viewState.resolution) && layerFilter.call(thisArg, layer)) {
          var layerRenderer = this.getLayerRenderer(layer);
          hasFeature = layerRenderer.hasFeatureAtCoordinate(coordinate, frameState);
          if (hasFeature) {
            return true;
          }
        }
      }
      return hasFeature;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
      if (this.getGL().isContextLost()) {
        return false;
      }

      var viewState = frameState.viewState;
      var result = void 0;

      var layerStates = frameState.layerStatesArray;
      var numLayers = layerStates.length;
      var i = void 0;
      for (i = numLayers - 1; i >= 0; --i) {
        var layerState = layerStates[i];
        var layer = layerState.layer;
        if ((0, _Layer.visibleAtResolution)(layerState, viewState.resolution) && layerFilter.call(thisArg, layer)) {
          var layerRenderer = /** @type {module:ol/renderer/webgl/Layer} */this.getLayerRenderer(layer);
          result = layerRenderer.forEachLayerAtPixel(pixel, frameState, callback, thisArg);
          if (result) {
            return result;
          }
        }
      }
      return undefined;
    }
  }]);

  return WebGLMapRenderer;
}(_Map2.default);

exports.default = WebGLMapRenderer;