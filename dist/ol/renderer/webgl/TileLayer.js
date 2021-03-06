'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _TileRange = require('../../TileRange.js');

var _TileRange2 = _interopRequireDefault(_TileRange);

var _TileState = require('../../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _array = require('../../array.js');

var _extent = require('../../extent.js');

var _math = require('../../math.js');

var _Layer = require('../webgl/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _tilelayershader = require('../webgl/tilelayershader.js');

var _Locations = require('../webgl/tilelayershader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _size = require('../../size.js');

var _transform = require('../../transform.js');

var _webgl = require('../../webgl.js');

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/renderer/webgl/TileLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// FIXME large resolutions lead to too large framebuffers :-(
// FIXME animated shaders! check in redraw

/**
 * @classdesc
 * WebGL renderer for tile layers.
 * @api
 */
var WebGLTileLayerRenderer = function (_WebGLLayerRenderer) {
  _inherits(WebGLTileLayerRenderer, _WebGLLayerRenderer);

  /**
   * @param {module:ol/renderer/webgl/Map} mapRenderer Map renderer.
   * @param {module:ol/layer/Tile} tileLayer Tile layer.
   */
  function WebGLTileLayerRenderer(mapRenderer, tileLayer) {
    _classCallCheck(this, WebGLTileLayerRenderer);

    /**
     * @private
     * @type {module:ol/webgl/Fragment}
     */
    var _this = _possibleConstructorReturn(this, (WebGLTileLayerRenderer.__proto__ || Object.getPrototypeOf(WebGLTileLayerRenderer)).call(this, mapRenderer, tileLayer));

    _this.fragmentShader_ = _tilelayershader.fragment;

    /**
     * @private
     * @type {module:ol/webgl/Vertex}
     */
    _this.vertexShader_ = _tilelayershader.vertex;

    /**
     * @private
     * @type {module:ol/renderer/webgl/tilelayershader/Locations}
     */
    _this.locations_ = null;

    /**
     * @private
     * @type {module:ol/webgl/Buffer}
     */
    _this.renderArrayBuffer_ = new _Buffer2.default([0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0]);

    /**
     * @private
     * @type {module:ol/TileRange}
     */
    _this.renderedTileRange_ = null;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.renderedFramebufferExtent_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.renderedRevision_ = -1;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.tmpSize_ = [0, 0];

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLTileLayerRenderer, [{
    key: 'disposeInternal',
    value: function disposeInternal() {
      var context = this.mapRenderer.getContext();
      context.deleteBuffer(this.renderArrayBuffer_);
      _Layer2.default.prototype.disposeInternal.call(this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'createLoadedTileFinder',
    value: function createLoadedTileFinder(source, projection, tiles) {
      var mapRenderer = this.mapRenderer;

      return (
        /**
         * @param {number} zoom Zoom level.
         * @param {module:ol/TileRange} tileRange Tile range.
         * @return {boolean} The tile range is fully loaded.
         */
        function (zoom, tileRange) {
          function callback(tile) {
            var loaded = mapRenderer.isTileTextureLoaded(tile);
            if (loaded) {
              if (!tiles[zoom]) {
                tiles[zoom] = {};
              }
              tiles[zoom][tile.tileCoord.toString()] = tile;
            }
            return loaded;
          }
          return source.forEachLoadedTile(projection, zoom, tileRange, callback);
        }
      );
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'handleWebGLContextLost',
    value: function handleWebGLContextLost() {
      _Layer2.default.prototype.handleWebGLContextLost.call(this);
      this.locations_ = null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame(frameState, layerState, context) {

      var mapRenderer = this.mapRenderer;
      var gl = context.getGL();

      var viewState = frameState.viewState;
      var projection = viewState.projection;

      var tileLayer = /** @type {module:ol/layer/Tile} */this.getLayer();
      var tileSource = tileLayer.getSource();
      var tileGrid = tileSource.getTileGridForProjection(projection);
      var z = tileGrid.getZForResolution(viewState.resolution);
      var tileResolution = tileGrid.getResolution(z);

      var tilePixelSize = tileSource.getTilePixelSize(z, frameState.pixelRatio, projection);
      var pixelRatio = tilePixelSize[0] / (0, _size.toSize)(tileGrid.getTileSize(z), this.tmpSize_)[0];
      var tilePixelResolution = tileResolution / pixelRatio;
      var tileGutter = tileSource.getTilePixelRatio(pixelRatio) * tileSource.getGutterForProjection(projection);

      var center = viewState.center;
      var extent = frameState.extent;
      var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);

      var framebufferExtent = void 0;
      if (this.renderedTileRange_ && this.renderedTileRange_.equals(tileRange) && this.renderedRevision_ == tileSource.getRevision()) {
        framebufferExtent = this.renderedFramebufferExtent_;
      } else {

        var tileRangeSize = tileRange.getSize();

        var maxDimension = Math.max(tileRangeSize[0] * tilePixelSize[0], tileRangeSize[1] * tilePixelSize[1]);
        var framebufferDimension = (0, _math.roundUpToPowerOfTwo)(maxDimension);
        var framebufferExtentDimension = tilePixelResolution * framebufferDimension;
        var origin = tileGrid.getOrigin(z);
        var minX = origin[0] + tileRange.minX * tilePixelSize[0] * tilePixelResolution;
        var minY = origin[1] + tileRange.minY * tilePixelSize[1] * tilePixelResolution;
        framebufferExtent = [minX, minY, minX + framebufferExtentDimension, minY + framebufferExtentDimension];

        this.bindFramebuffer(frameState, framebufferDimension);
        gl.viewport(0, 0, framebufferDimension, framebufferDimension);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(_webgl.COLOR_BUFFER_BIT);
        gl.disable(_webgl.BLEND);

        var program = context.getProgram(this.fragmentShader_, this.vertexShader_);
        context.useProgram(program);
        if (!this.locations_) {
          this.locations_ = new _Locations2.default(gl, program);
        }

        context.bindBuffer(_webgl.ARRAY_BUFFER, this.renderArrayBuffer_);
        gl.enableVertexAttribArray(this.locations_.a_position);
        gl.vertexAttribPointer(this.locations_.a_position, 2, _webgl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(this.locations_.a_texCoord);
        gl.vertexAttribPointer(this.locations_.a_texCoord, 2, _webgl.FLOAT, false, 16, 8);
        gl.uniform1i(this.locations_.u_texture, 0);

        /**
         * @type {Object<number, Object<string, module:ol/Tile>>}
         */
        var tilesToDrawByZ = {};
        tilesToDrawByZ[z] = {};

        var findLoadedTiles = this.createLoadedTileFinder(tileSource, projection, tilesToDrawByZ);

        var useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
        var allTilesLoaded = true;
        var tmpExtent = (0, _extent.createEmpty)();
        var tmpTileRange = new _TileRange2.default(0, 0, 0, 0);
        var childTileRange = void 0,
            drawable = void 0,
            fullyLoaded = void 0,
            tile = void 0,
            tileState = void 0;
        var x = void 0,
            y = void 0,
            tileExtent = void 0;
        for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
          for (y = tileRange.minY; y <= tileRange.maxY; ++y) {

            tile = tileSource.getTile(z, x, y, pixelRatio, projection);
            if (layerState.extent !== undefined) {
              // ignore tiles outside layer extent
              tileExtent = tileGrid.getTileCoordExtent(tile.tileCoord, tmpExtent);
              if (!(0, _extent.intersects)(tileExtent, layerState.extent)) {
                continue;
              }
            }
            tileState = tile.getState();
            drawable = tileState == _TileState2.default.LOADED || tileState == _TileState2.default.EMPTY || tileState == _TileState2.default.ERROR && !useInterimTilesOnError;
            if (!drawable) {
              tile = tile.getInterimTile();
            }
            tileState = tile.getState();
            if (tileState == _TileState2.default.LOADED) {
              if (mapRenderer.isTileTextureLoaded(tile)) {
                tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
                continue;
              }
            } else if (tileState == _TileState2.default.EMPTY || tileState == _TileState2.default.ERROR && !useInterimTilesOnError) {
              continue;
            }

            allTilesLoaded = false;
            fullyLoaded = tileGrid.forEachTileCoordParentTileRange(tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
            if (!fullyLoaded) {
              childTileRange = tileGrid.getTileCoordChildTileRange(tile.tileCoord, tmpTileRange, tmpExtent);
              if (childTileRange) {
                findLoadedTiles(z + 1, childTileRange);
              }
            }
          }
        }

        /** @type {Array<number>} */
        var zs = Object.keys(tilesToDrawByZ).map(Number);
        zs.sort(_array.numberSafeCompareFunction);
        var u_tileOffset = new Float32Array(4);
        for (var i = 0, ii = zs.length; i < ii; ++i) {
          var tilesToDraw = tilesToDrawByZ[zs[i]];
          for (var tileKey in tilesToDraw) {
            tile = tilesToDraw[tileKey];
            tileExtent = tileGrid.getTileCoordExtent(tile.tileCoord, tmpExtent);
            u_tileOffset[0] = 2 * (tileExtent[2] - tileExtent[0]) / framebufferExtentDimension;
            u_tileOffset[1] = 2 * (tileExtent[3] - tileExtent[1]) / framebufferExtentDimension;
            u_tileOffset[2] = 2 * (tileExtent[0] - framebufferExtent[0]) / framebufferExtentDimension - 1;
            u_tileOffset[3] = 2 * (tileExtent[1] - framebufferExtent[1]) / framebufferExtentDimension - 1;
            gl.uniform4fv(this.locations_.u_tileOffset, u_tileOffset);
            mapRenderer.bindTileTexture(tile, tilePixelSize, tileGutter * pixelRatio, _webgl.LINEAR, _webgl.LINEAR);
            gl.drawArrays(_webgl.TRIANGLE_STRIP, 0, 4);
          }
        }

        if (allTilesLoaded) {
          this.renderedTileRange_ = tileRange;
          this.renderedFramebufferExtent_ = framebufferExtent;
          this.renderedRevision_ = tileSource.getRevision();
        } else {
          this.renderedTileRange_ = null;
          this.renderedFramebufferExtent_ = null;
          this.renderedRevision_ = -1;
          frameState.animate = true;
        }
      }

      this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
      var tileTextureQueue = mapRenderer.getTileTextureQueue();
      this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, z, tileLayer.getPreload(),
      /**
       * @param {module:ol/Tile} tile Tile.
       */
      function (tile) {
        if (tile.getState() == _TileState2.default.LOADED && !mapRenderer.isTileTextureLoaded(tile) && !tileTextureQueue.isKeyQueued(tile.getKey())) {
          tileTextureQueue.enqueue([tile, tileGrid.getTileCoordCenter(tile.tileCoord), tileGrid.getResolution(tile.tileCoord[0]), tilePixelSize, tileGutter * pixelRatio]);
        }
      }, this);
      this.scheduleExpireCache(frameState, tileSource);

      var texCoordMatrix = this.texCoordMatrix;
      (0, _transform.reset)(texCoordMatrix);
      (0, _transform.translate)(texCoordMatrix, (Math.round(center[0] / tileResolution) * tileResolution - framebufferExtent[0]) / (framebufferExtent[2] - framebufferExtent[0]), (Math.round(center[1] / tileResolution) * tileResolution - framebufferExtent[1]) / (framebufferExtent[3] - framebufferExtent[1]));
      if (viewState.rotation !== 0) {
        (0, _transform.rotate)(texCoordMatrix, viewState.rotation);
      }
      (0, _transform.scale)(texCoordMatrix, frameState.size[0] * viewState.resolution / (framebufferExtent[2] - framebufferExtent[0]), frameState.size[1] * viewState.resolution / (framebufferExtent[3] - framebufferExtent[1]));
      (0, _transform.translate)(texCoordMatrix, -0.5, -0.5);

      return true;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'forEachLayerAtPixel',
    value: function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {
      if (!this.framebuffer) {
        return undefined;
      }

      var pixelOnMapScaled = [pixel[0] / frameState.size[0], (frameState.size[1] - pixel[1]) / frameState.size[1]];

      var pixelOnFrameBufferScaled = (0, _transform.apply)(this.texCoordMatrix, pixelOnMapScaled.slice());
      var pixelOnFrameBuffer = [pixelOnFrameBufferScaled[0] * this.framebufferDimension, pixelOnFrameBufferScaled[1] * this.framebufferDimension];

      var gl = this.mapRenderer.getContext().getGL();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      var imageData = new Uint8Array(4);
      gl.readPixels(pixelOnFrameBuffer[0], pixelOnFrameBuffer[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

      if (imageData[3] > 0) {
        return callback.call(thisArg, this.getLayer(), imageData);
      } else {
        return undefined;
      }
    }
  }]);

  return WebGLTileLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {module:ol/layer/Layer} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */


WebGLTileLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.TILE;
};

/**
 * Create a layer renderer.
 * @param {module:ol/renderer/Map} mapRenderer The map renderer.
 * @param {module:ol/layer/Layer} layer The layer to be rendererd.
 * @return {module:ol/renderer/webgl/TileLayer} The layer renderer.
 */
WebGLTileLayerRenderer['create'] = function (mapRenderer, layer) {
  return new WebGLTileLayerRenderer(
  /** @type {module:ol/renderer/webgl/Map} */mapRenderer,
  /** @type {module:ol/layer/Tile} */layer);
};

exports.default = WebGLTileLayerRenderer;