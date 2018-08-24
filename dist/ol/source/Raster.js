'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util.js');

var _ImageCanvas = require('../ImageCanvas.js');

var _ImageCanvas2 = _interopRequireDefault(_ImageCanvas);

var _TileQueue = require('../TileQueue.js');

var _TileQueue2 = _interopRequireDefault(_TileQueue);

var _dom = require('../dom.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _index = require('pixelworks/lib/index');

var _extent = require('../extent.js');

var _LayerType = require('../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _Layer = require('../layer/Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _Image = require('../layer/Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _Tile = require('../layer/Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _obj = require('../obj.js');

var _ImageLayer = require('../renderer/canvas/ImageLayer.js');

var _ImageLayer2 = _interopRequireDefault(_ImageLayer);

var _TileLayer = require('../renderer/canvas/TileLayer.js');

var _TileLayer2 = _interopRequireDefault(_TileLayer);

var _Image3 = require('../source/Image.js');

var _Image4 = _interopRequireDefault(_Image3);

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

var _Tile3 = require('../source/Tile.js');

var _Tile4 = _interopRequireDefault(_Tile3);

var _transform = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/source/Raster
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * A function that takes an array of input data, performs some operation, and
 * returns an array of output data.
 * For `pixel` type operations, the function will be called with an array of
 * pixels, where each pixel is an array of four numbers (`[r, g, b, a]`) in the
 * range of 0 - 255. It should return a single pixel array.
 * For `'image'` type operations, functions will be called with an array of
 * {@link ImageData https://developer.mozilla.org/en-US/docs/Web/API/ImageData}
 * and should return a single {@link ImageData
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageData}.  The operations
 * are called with a second "data" argument, which can be used for storage.  The
 * data object is accessible from raster events, where it can be initialized in
 * "beforeoperations" and accessed again in "afteroperations".
 *
 * @typedef {function((Array<Array<number>>|Array<ImageData>), Object):
 *     (Array<number>|ImageData)} Operation
 */

/**
 * @enum {string}
 */
var RasterEventType = {
  /**
   * Triggered before operations are run.
   * @event ol/source/Raster~RasterSourceEvent#beforeoperations
   * @api
   */
  BEFOREOPERATIONS: 'beforeoperations',

  /**
   * Triggered after operations are run.
   * @event ol/source/Raster~RasterSourceEvent#afteroperations
   * @api
   */
  AFTEROPERATIONS: 'afteroperations'
};

/**
 * Raster operation type. Supported values are `'pixel'` and `'image'`.
 * @enum {string}
 */
var RasterOperationType = {
  PIXEL: 'pixel',
  IMAGE: 'image'
};

/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Raster} instances are instances of this
 * type.
 */

var RasterSourceEvent = function (_Event) {
  _inherits(RasterSourceEvent, _Event);

  /**
   * @param {string} type Type.
   * @param {module:ol/PluggableMap~FrameState} frameState The frame state.
   * @param {Object} data An object made available to operations.
   */
  function RasterSourceEvent(type, frameState, data) {
    _classCallCheck(this, RasterSourceEvent);

    /**
     * The raster extent.
     * @type {module:ol/extent~Extent}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (RasterSourceEvent.__proto__ || Object.getPrototypeOf(RasterSourceEvent)).call(this, type));

    _this.extent = frameState.extent;

    /**
     * The pixel resolution (map units per pixel).
     * @type {number}
     * @api
     */
    _this.resolution = frameState.viewState.resolution / frameState.pixelRatio;

    /**
     * An object made available to all operations.  This can be used by operations
     * as a storage object (e.g. for calculating statistics).
     * @type {Object}
     * @api
     */
    _this.data = data;

    return _this;
  }

  return RasterSourceEvent;
}(_Event3.default);

/**
 * @typedef {Object} Options
 * @property {Array<module:ol/source/Source|module:ol/layer/Layer>} sources Input
 * sources or layers. Vector layers must be configured with `renderMode: 'image'`.
 * @property {module:ol/source/Raster~Operation} [operation] Raster operation.
 * The operation will be called with data from input sources
 * and the output will be assigned to the raster source.
 * @property {Object} [lib] Functions that will be made available to operations run in a worker.
 * @property {number} [threads] By default, operations will be run in a single worker thread.
 * To avoid using workers altogether, set `threads: 0`.  For pixel operations, operations can
 * be run in multiple worker threads.  Note that there is additional overhead in
 * transferring data to multiple workers, and that depending on the user's
 * system, it may not be possible to parallelize the work.
 * @property {module:ol/source/Raster~RasterOperationType} [operationType='pixel'] Operation type.
 * Supported values are `'pixel'` and `'image'`.  By default,
 * `'pixel'` operations are assumed, and operations will be called with an
 * array of pixels from input sources.  If set to `'image'`, operations will
 * be called with an array of ImageData objects from input sources.
 */

/**
 * @classdesc
 * A source that transforms data from any number of input sources using an
 * {@link module:ol/source/Raster~Operation} function to transform input pixel values into
 * output pixel values.
 *
 * @fires ol/source/Raster~RasterSourceEvent
 * @api
 */


var RasterSource = function (_ImageSource) {
  _inherits(RasterSource, _ImageSource);

  /**
   * @param {module:ol/source/Raster~Options=} options Options.
   */
  function RasterSource(options) {
    _classCallCheck(this, RasterSource);

    /**
     * @private
     * @type {*}
     */
    var _this2 = _possibleConstructorReturn(this, (RasterSource.__proto__ || Object.getPrototypeOf(RasterSource)).call(this, {}));

    _this2.worker_ = null;

    /**
     * @private
     * @type {module:ol/source/Raster~RasterOperationType}
     */
    _this2.operationType_ = options.operationType !== undefined ? options.operationType : RasterOperationType.PIXEL;

    /**
     * @private
     * @type {number}
     */
    _this2.threads_ = options.threads !== undefined ? options.threads : 1;

    /**
     * @private
     * @type {Array<module:ol/renderer/canvas/Layer>}
     */
    _this2.renderers_ = createRenderers(options.sources);

    for (var r = 0, rr = _this2.renderers_.length; r < rr; ++r) {
      (0, _events.listen)(_this2.renderers_[r], _EventType2.default.CHANGE, _this2.changed, _this2);
    }

    /**
     * @private
     * @type {module:ol/TileQueue}
     */
    _this2.tileQueue_ = new _TileQueue2.default(function () {
      return 1;
    }, _this2.changed.bind(_this2));

    var layerStatesArray = getLayerStatesArray(_this2.renderers_);
    var layerStates = {};
    for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      layerStates[(0, _util.getUid)(layerStatesArray[i].layer)] = layerStatesArray[i];
    }

    /**
     * The most recently requested frame state.
     * @type {module:ol/PluggableMap~FrameState}
     * @private
     */
    _this2.requestedFrameState_;

    /**
     * The most recently rendered image canvas.
     * @type {module:ol/ImageCanvas}
     * @private
     */
    _this2.renderedImageCanvas_ = null;

    /**
     * The most recently rendered revision.
     * @type {number}
     */
    _this2.renderedRevision_;

    /**
     * @private
     * @type {module:ol/PluggableMap~FrameState}
     */
    _this2.frameState_ = {
      animate: false,
      coordinateToPixelTransform: (0, _transform.create)(),
      extent: null,
      focus: null,
      index: 0,
      layerStates: layerStates,
      layerStatesArray: layerStatesArray,
      pixelRatio: 1,
      pixelToCoordinateTransform: (0, _transform.create)(),
      postRenderFunctions: [],
      size: [0, 0],
      skippedFeatureUids: {},
      tileQueue: _this2.tileQueue_,
      time: Date.now(),
      usedTiles: {},
      viewState: /** @type {module:ol/View~State} */{
        rotation: 0
      },
      viewHints: [],
      wantedTiles: {}
    };

    if (options.operation !== undefined) {
      _this2.setOperation(options.operation, options.lib);
    }

    return _this2;
  }

  /**
   * Set the operation.
   * @param {module:ol/source/Raster~Operation} operation New operation.
   * @param {Object=} opt_lib Functions that will be available to operations run
   *     in a worker.
   * @api
   */


  _createClass(RasterSource, [{
    key: 'setOperation',
    value: function setOperation(operation, opt_lib) {
      this.worker_ = new _index.Processor({
        operation: operation,
        imageOps: this.operationType_ === RasterOperationType.IMAGE,
        queue: 1,
        lib: opt_lib,
        threads: this.threads_
      });
      this.changed();
    }

    /**
     * Update the stored frame state.
     * @param {module:ol/extent~Extent} extent The view extent (in map units).
     * @param {number} resolution The view resolution.
     * @param {module:ol/proj/Projection} projection The view projection.
     * @return {module:ol/PluggableMap~FrameState} The updated frame state.
     * @private
     */

  }, {
    key: 'updateFrameState_',
    value: function updateFrameState_(extent, resolution, projection) {

      var frameState = /** @type {module:ol/PluggableMap~FrameState} */(0, _obj.assign)({}, this.frameState_);

      frameState.viewState = /** @type {module:ol/View~State} */(0, _obj.assign)({}, frameState.viewState);

      var center = (0, _extent.getCenter)(extent);

      frameState.extent = extent.slice();
      frameState.focus = center;
      frameState.size[0] = Math.round((0, _extent.getWidth)(extent) / resolution);
      frameState.size[1] = Math.round((0, _extent.getHeight)(extent) / resolution);
      frameState.time = Date.now();
      frameState.animate = false;

      var viewState = frameState.viewState;
      viewState.center = center;
      viewState.projection = projection;
      viewState.resolution = resolution;
      return frameState;
    }

    /**
     * Determine if all sources are ready.
     * @return {boolean} All sources are ready.
     * @private
     */

  }, {
    key: 'allSourcesReady_',
    value: function allSourcesReady_() {
      var ready = true;
      var source = void 0;
      for (var i = 0, ii = this.renderers_.length; i < ii; ++i) {
        source = this.renderers_[i].getLayer().getSource();
        if (source.getState() !== _State2.default.READY) {
          ready = false;
          break;
        }
      }
      return ready;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImage',
    value: function getImage(extent, resolution, pixelRatio, projection) {
      if (!this.allSourcesReady_()) {
        return null;
      }

      var frameState = this.updateFrameState_(extent, resolution, projection);
      this.requestedFrameState_ = frameState;

      // check if we can't reuse the existing ol/ImageCanvas
      if (this.renderedImageCanvas_) {
        var renderedResolution = this.renderedImageCanvas_.getResolution();
        var renderedExtent = this.renderedImageCanvas_.getExtent();
        if (resolution !== renderedResolution || !(0, _extent.equals)(extent, renderedExtent)) {
          this.renderedImageCanvas_ = null;
        }
      }

      if (!this.renderedImageCanvas_ || this.getRevision() !== this.renderedRevision_) {
        this.processSources_();
      }

      frameState.tileQueue.loadMoreTiles(16, 16);

      if (frameState.animate) {
        requestAnimationFrame(this.changed.bind(this));
      }

      return this.renderedImageCanvas_;
    }

    /**
     * Start processing source data.
     * @private
     */

  }, {
    key: 'processSources_',
    value: function processSources_() {
      var frameState = this.requestedFrameState_;
      var len = this.renderers_.length;
      var imageDatas = new Array(len);
      for (var i = 0; i < len; ++i) {
        var imageData = getImageData(this.renderers_[i], frameState, frameState.layerStatesArray[i]);
        if (imageData) {
          imageDatas[i] = imageData;
        } else {
          return;
        }
      }

      var data = {};
      this.dispatchEvent(new RasterSourceEvent(RasterEventType.BEFOREOPERATIONS, frameState, data));
      this.worker_.process(imageDatas, data, this.onWorkerComplete_.bind(this, frameState));
    }

    /**
     * Called when pixel processing is complete.
     * @param {module:ol/PluggableMap~FrameState} frameState The frame state.
     * @param {Error} err Any error during processing.
     * @param {ImageData} output The output image data.
     * @param {Object} data The user data.
     * @private
     */

  }, {
    key: 'onWorkerComplete_',
    value: function onWorkerComplete_(frameState, err, output, data) {
      if (err || !output) {
        return;
      }

      // do nothing if extent or resolution changed
      var extent = frameState.extent;
      var resolution = frameState.viewState.resolution;
      if (resolution !== this.requestedFrameState_.viewState.resolution || !(0, _extent.equals)(extent, this.requestedFrameState_.extent)) {
        return;
      }

      var context = void 0;
      if (this.renderedImageCanvas_) {
        context = this.renderedImageCanvas_.getImage().getContext('2d');
      } else {
        var width = Math.round((0, _extent.getWidth)(extent) / resolution);
        var height = Math.round((0, _extent.getHeight)(extent) / resolution);
        context = (0, _dom.createCanvasContext2D)(width, height);
        this.renderedImageCanvas_ = new _ImageCanvas2.default(extent, resolution, 1, context.canvas);
      }
      context.putImageData(output, 0, 0);

      this.changed();
      this.renderedRevision_ = this.getRevision();

      this.dispatchEvent(new RasterSourceEvent(RasterEventType.AFTEROPERATIONS, frameState, data));
    }

    /**
     * @override
     */

  }, {
    key: 'getImageInternal',
    value: function getImageInternal() {
      return null; // not implemented
    }
  }]);

  return RasterSource;
}(_Image4.default);

/**
 * A reusable canvas context.
 * @type {CanvasRenderingContext2D}
 * @private
 */


var sharedContext = null;

/**
 * Get image data from a renderer.
 * @param {module:ol/renderer/canvas/Layer} renderer Layer renderer.
 * @param {module:ol/PluggableMap~FrameState} frameState The frame state.
 * @param {module:ol/layer/Layer~State} layerState The layer state.
 * @return {ImageData} The image data.
 */
function getImageData(renderer, frameState, layerState) {
  if (!renderer.prepareFrame(frameState, layerState)) {
    return null;
  }
  var width = frameState.size[0];
  var height = frameState.size[1];
  if (!sharedContext) {
    sharedContext = (0, _dom.createCanvasContext2D)(width, height);
  } else {
    var canvas = sharedContext.canvas;
    if (canvas.width !== width || canvas.height !== height) {
      sharedContext = (0, _dom.createCanvasContext2D)(width, height);
    } else {
      sharedContext.clearRect(0, 0, width, height);
    }
  }
  renderer.composeFrame(frameState, layerState, sharedContext);
  return sharedContext.getImageData(0, 0, width, height);
}

/**
 * Get a list of layer states from a list of renderers.
 * @param {Array<module:ol/renderer/canvas/Layer>} renderers Layer renderers.
 * @return {Array<module:ol/layer/Layer~State>} The layer states.
 */
function getLayerStatesArray(renderers) {
  return renderers.map(function (renderer) {
    return renderer.getLayer().getLayerState();
  });
}

/**
 * Create renderers for all sources.
 * @param {Array<module:ol/source/Source>} sources The sources.
 * @return {Array<module:ol/renderer/canvas/Layer>} Array of layer renderers.
 */
function createRenderers(sources) {
  var len = sources.length;
  var renderers = new Array(len);
  for (var i = 0; i < len; ++i) {
    renderers[i] = createRenderer(sources[i]);
  }
  return renderers;
}

/**
 * Create a renderer for the provided source.
 * @param {module:ol/source/Source} source The source.
 * @return {module:ol/renderer/canvas/Layer} The renderer.
 */
function createRenderer(source) {
  var renderer = null;
  if (source instanceof _Tile4.default) {
    renderer = createTileRenderer(source);
  } else if (source instanceof _Image4.default) {
    renderer = createImageRenderer(source);
  } else if (source instanceof _Tile2.default) {
    renderer = new _TileLayer2.default(source);
  } else if (source instanceof _Layer2.default && (source.getType() == _LayerType2.default.IMAGE || source.getType() == _LayerType2.default.VECTOR)) {
    renderer = new _ImageLayer2.default(source);
  }
  return renderer;
}

/**
 * Create an image renderer for the provided source.
 * @param {module:ol/source/Image} source The source.
 * @return {module:ol/renderer/canvas/Layer} The renderer.
 */
function createImageRenderer(source) {
  var layer = new _Image2.default({ source: source });
  return new _ImageLayer2.default(layer);
}

/**
 * Create a tile renderer for the provided source.
 * @param {module:ol/source/Tile} source The source.
 * @return {module:ol/renderer/canvas/Layer} The renderer.
 */
function createTileRenderer(source) {
  var layer = new _Tile2.default({ source: source });
  return new _TileLayer2.default(layer);
}

exports.default = RasterSource;