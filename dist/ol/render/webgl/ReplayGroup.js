'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../../array.js');

var _extent = require('../../extent.js');

var _obj = require('../../obj.js');

var _replay = require('../replay.js');

var _ReplayGroup2 = require('../ReplayGroup.js');

var _ReplayGroup3 = _interopRequireDefault(_ReplayGroup2);

var _CircleReplay = require('../webgl/CircleReplay.js');

var _CircleReplay2 = _interopRequireDefault(_CircleReplay);

var _ImageReplay = require('../webgl/ImageReplay.js');

var _ImageReplay2 = _interopRequireDefault(_ImageReplay);

var _LineStringReplay = require('../webgl/LineStringReplay.js');

var _LineStringReplay2 = _interopRequireDefault(_LineStringReplay);

var _PolygonReplay = require('../webgl/PolygonReplay.js');

var _PolygonReplay2 = _interopRequireDefault(_PolygonReplay);

var _TextReplay = require('../webgl/TextReplay.js');

var _TextReplay2 = _interopRequireDefault(_TextReplay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/ReplayGroup
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @type {Array<number>}
 */
var HIT_DETECTION_SIZE = [1, 1];

/**
 * @type {Object<module:ol/render/ReplayType,
 *                function(new: module:ol/render/webgl/Replay, number,
 *                module:ol/extent~Extent)>}
 */
var BATCH_CONSTRUCTORS = {
  'Circle': _CircleReplay2.default,
  'Image': _ImageReplay2.default,
  'LineString': _LineStringReplay2.default,
  'Polygon': _PolygonReplay2.default,
  'Text': _TextReplay2.default
};

var WebGLReplayGroup = function (_ReplayGroup) {
  _inherits(WebGLReplayGroup, _ReplayGroup);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   * @param {number=} opt_renderBuffer Render buffer.
   */
  function WebGLReplayGroup(tolerance, maxExtent, opt_renderBuffer) {
    _classCallCheck(this, WebGLReplayGroup);

    /**
     * @type {module:ol/extent~Extent}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (WebGLReplayGroup.__proto__ || Object.getPrototypeOf(WebGLReplayGroup)).call(this));

    _this.maxExtent_ = maxExtent;

    /**
     * @type {number}
     * @private
     */
    _this.tolerance_ = tolerance;

    /**
     * @type {number|undefined}
     * @private
     */
    _this.renderBuffer_ = opt_renderBuffer;

    /**
     * @private
     * @type {!Object<string,
     *        Object<module:ol/render/ReplayType, module:ol/render/webgl/Replay>>}
     */
    _this.replaysByZIndex_ = {};

    return _this;
  }

  /**
   * @param {module:ol/style/Style} style Style.
   * @param {boolean} group Group with previous replay.
   */


  _createClass(WebGLReplayGroup, [{
    key: 'addDeclutter',
    value: function addDeclutter(style, group) {}

    /**
     * @param {module:ol/webgl/Context} context WebGL context.
     * @return {function()} Delete resources function.
     */

  }, {
    key: 'getDeleteResourcesFunction',
    value: function getDeleteResourcesFunction(context) {
      var functions = [];
      var zKey = void 0;
      for (zKey in this.replaysByZIndex_) {
        var replays = this.replaysByZIndex_[zKey];
        for (var replayKey in replays) {
          functions.push(replays[replayKey].getDeleteResourcesFunction(context));
        }
      }
      return function () {
        var length = functions.length;
        var result = void 0;
        for (var i = 0; i < length; i++) {
          result = functions[i].apply(this, arguments);
        }
        return result;
      };
    }

    /**
     * @param {module:ol/webgl/Context} context Context.
     */

  }, {
    key: 'finish',
    value: function finish(context) {
      var zKey = void 0;
      for (zKey in this.replaysByZIndex_) {
        var replays = this.replaysByZIndex_[zKey];
        for (var replayKey in replays) {
          replays[replayKey].finish(context);
        }
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getReplay',
    value: function getReplay(zIndex, replayType) {
      var zIndexKey = zIndex !== undefined ? zIndex.toString() : '0';
      var replays = this.replaysByZIndex_[zIndexKey];
      if (replays === undefined) {
        replays = {};
        this.replaysByZIndex_[zIndexKey] = replays;
      }
      var replay = replays[replayType];
      if (replay === undefined) {
        /**
         * @type {Function}
         */
        var Constructor = BATCH_CONSTRUCTORS[replayType];
        replay = new Constructor(this.tolerance_, this.maxExtent_);
        replays[replayType] = replay;
      }
      return replay;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return (0, _obj.isEmpty)(this.replaysByZIndex_);
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
     */

  }, {
    key: 'replay',
    value: function replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash) {
      /** @type {Array<number>} */
      var zs = Object.keys(this.replaysByZIndex_).map(Number);
      zs.sort(_array.numberSafeCompareFunction);

      var i = void 0,
          ii = void 0,
          j = void 0,
          jj = void 0,
          replays = void 0,
          replay = void 0;
      for (i = 0, ii = zs.length; i < ii; ++i) {
        replays = this.replaysByZIndex_[zs[i].toString()];
        for (j = 0, jj = _replay.ORDER.length; j < jj; ++j) {
          replay = replays[_replay.ORDER[j]];
          if (replay !== undefined) {
            replay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, undefined, false);
          }
        }
      }
    }

    /**
     * @private
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
     * @param {module:ol/extent~Extent=} opt_hitExtent Hit extent: Only features intersecting
     *  this extent are checked.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'replayHitDetection_',
    value: function replayHitDetection_(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
      /** @type {Array<number>} */
      var zs = Object.keys(this.replaysByZIndex_).map(Number);
      zs.sort(function (a, b) {
        return b - a;
      });

      var i = void 0,
          ii = void 0,
          j = void 0,
          replays = void 0,
          replay = void 0,
          result = void 0;
      for (i = 0, ii = zs.length; i < ii; ++i) {
        replays = this.replaysByZIndex_[zs[i].toString()];
        for (j = _replay.ORDER.length - 1; j >= 0; --j) {
          replay = replays[_replay.ORDER[j]];
          if (replay !== undefined) {
            result = replay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);
            if (result) {
              return result;
            }
          }
        }
      }
      return undefined;
    }

    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {module:ol/webgl/Context} context Context.
     * @param {module:ol/coordinate~Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {module:ol/size~Size} size Size.
     * @param {number} pixelRatio Pixel ratio.
     * @param {number} opacity Global opacity.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T|undefined} callback Feature callback.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, callback) {
      var gl = context.getGL();
      gl.bindFramebuffer(gl.FRAMEBUFFER, context.getHitDetectionFramebuffer());

      /**
       * @type {module:ol/extent~Extent}
       */
      var hitExtent = void 0;
      if (this.renderBuffer_ !== undefined) {
        // build an extent around the coordinate, so that only features that
        // intersect this extent are checked
        hitExtent = (0, _extent.buffer)((0, _extent.createOrUpdateFromCoordinate)(coordinate), resolution * this.renderBuffer_);
      }

      return this.replayHitDetection_(context, coordinate, resolution, rotation, HIT_DETECTION_SIZE, pixelRatio, opacity, skippedFeaturesHash,
      /**
       * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
       * @return {?} Callback result.
       */
      function (feature) {
        var imageData = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

        if (imageData[3] > 0) {
          var result = callback(feature);
          if (result) {
            return result;
          }
        }
      }, true, hitExtent);
    }

    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {module:ol/webgl/Context} context Context.
     * @param {module:ol/coordinate~Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {module:ol/size~Size} size Size.
     * @param {number} pixelRatio Pixel ratio.
     * @param {number} opacity Global opacity.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @return {boolean} Is there a feature at the given coordinate?
     */

  }, {
    key: 'hasFeatureAtCoordinate',
    value: function hasFeatureAtCoordinate(coordinate, context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash) {
      var gl = context.getGL();
      gl.bindFramebuffer(gl.FRAMEBUFFER, context.getHitDetectionFramebuffer());

      var hasFeature = this.replayHitDetection_(context, coordinate, resolution, rotation, HIT_DETECTION_SIZE, pixelRatio, opacity, skippedFeaturesHash,
      /**
       * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
       * @return {boolean} Is there a feature?
       */
      function (feature) {
        var imageData = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
        return imageData[3] > 0;
      }, false);

      return hasFeature !== undefined;
    }
  }]);

  return WebGLReplayGroup;
}(_ReplayGroup3.default);

exports.default = WebGLReplayGroup;