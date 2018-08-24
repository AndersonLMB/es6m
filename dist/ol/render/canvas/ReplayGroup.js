'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getCircleArray = getCircleArray;
exports.replayDeclutter = replayDeclutter;

var _array = require('../../array.js');

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _transform = require('../../geom/flat/transform.js');

var _obj = require('../../obj.js');

var _ReplayGroup2 = require('../ReplayGroup.js');

var _ReplayGroup3 = _interopRequireDefault(_ReplayGroup2);

var _ReplayType = require('../ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

var _Replay = require('../canvas/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

var _ImageReplay = require('../canvas/ImageReplay.js');

var _ImageReplay2 = _interopRequireDefault(_ImageReplay);

var _LineStringReplay = require('../canvas/LineStringReplay.js');

var _LineStringReplay2 = _interopRequireDefault(_LineStringReplay);

var _PolygonReplay = require('../canvas/PolygonReplay.js');

var _PolygonReplay2 = _interopRequireDefault(_PolygonReplay);

var _TextReplay = require('../canvas/TextReplay.js');

var _TextReplay2 = _interopRequireDefault(_TextReplay);

var _replay = require('../replay.js');

var _transform2 = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/ReplayGroup
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @type {Object<module:ol/render/ReplayType,
 *                function(new: module:ol/render/canvas/Replay, number, module:ol/extent~Extent,
 *                number, number, boolean, Array<module:ol/render/canvas~DeclutterGroup>)>}
 */
var BATCH_CONSTRUCTORS = {
  'Circle': _PolygonReplay2.default,
  'Default': _Replay2.default,
  'Image': _ImageReplay2.default,
  'LineString': _LineStringReplay2.default,
  'Polygon': _PolygonReplay2.default,
  'Text': _TextReplay2.default
};

var CanvasReplayGroup = function (_ReplayGroup) {
  _inherits(CanvasReplayGroup, _ReplayGroup);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay group can have overlapping geometries.
   * @param {?} declutterTree Declutter tree for declutter processing in postrender.
   * @param {number=} opt_renderBuffer Optional rendering buffer.
   */
  function CanvasReplayGroup(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree, opt_renderBuffer) {
    _classCallCheck(this, CanvasReplayGroup);

    /**
     * Declutter tree.
     * @private
     */
    var _this = _possibleConstructorReturn(this, (CanvasReplayGroup.__proto__ || Object.getPrototypeOf(CanvasReplayGroup)).call(this));

    _this.declutterTree_ = declutterTree;

    /**
     * @type {module:ol/render/canvas~DeclutterGroup}
     * @private
     */
    _this.declutterGroup_ = null;

    /**
     * @private
     * @type {number}
     */
    _this.tolerance_ = tolerance;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.maxExtent_ = maxExtent;

    /**
     * @private
     * @type {boolean}
     */
    _this.overlaps_ = overlaps;

    /**
     * @private
     * @type {number}
     */
    _this.pixelRatio_ = pixelRatio;

    /**
     * @private
     * @type {number}
     */
    _this.resolution_ = resolution;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.renderBuffer_ = opt_renderBuffer;

    /**
     * @private
     * @type {!Object<string, !Object<module:ol/render/ReplayType, module:ol/render/canvas/Replay>>}
     */
    _this.replaysByZIndex_ = {};

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    _this.hitDetectionContext_ = (0, _dom.createCanvasContext2D)(1, 1);

    /**
     * @private
     * @type {module:ol/transform~Transform}
     */
    _this.hitDetectionTransform_ = (0, _transform2.create)();
    return _this;
  }

  /**
   * @param {boolean} group Group with previous replay.
   * @return {module:ol/render/canvas~DeclutterGroup} Declutter instruction group.
   */


  _createClass(CanvasReplayGroup, [{
    key: 'addDeclutter',
    value: function addDeclutter(group) {
      var declutter = null;
      if (this.declutterTree_) {
        if (group) {
          declutter = this.declutterGroup_;
          /** @type {number} */declutter[4]++;
        } else {
          declutter = this.declutterGroup_ = (0, _extent.createEmpty)();
          declutter.push(1);
        }
      }
      return declutter;
    }

    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/transform~Transform} transform Transform.
     */

  }, {
    key: 'clip',
    value: function clip(context, transform) {
      var flatClipCoords = this.getClipCoords(transform);
      context.beginPath();
      context.moveTo(flatClipCoords[0], flatClipCoords[1]);
      context.lineTo(flatClipCoords[2], flatClipCoords[3]);
      context.lineTo(flatClipCoords[4], flatClipCoords[5]);
      context.lineTo(flatClipCoords[6], flatClipCoords[7]);
      context.clip();
    }

    /**
     * @param {Array<module:ol/render/ReplayType>} replays Replays.
     * @return {boolean} Has replays of the provided types.
     */

  }, {
    key: 'hasReplays',
    value: function hasReplays(replays) {
      for (var zIndex in this.replaysByZIndex_) {
        var candidates = this.replaysByZIndex_[zIndex];
        for (var i = 0, ii = replays.length; i < ii; ++i) {
          if (replays[i] in candidates) {
            return true;
          }
        }
      }
      return false;
    }

    /**
     * FIXME empty description for jsdoc
     */

  }, {
    key: 'finish',
    value: function finish() {
      for (var zKey in this.replaysByZIndex_) {
        var replays = this.replaysByZIndex_[zKey];
        for (var replayKey in replays) {
          replays[replayKey].finish();
        }
      }
    }

    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T} callback Feature callback.
     * @param {Object<string, module:ol/render/canvas~DeclutterGroup>} declutterReplays Declutter replays.
     * @return {T|undefined} Callback result.
     * @template T
     */

  }, {
    key: 'forEachFeatureAtCoordinate',
    value: function forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, skippedFeaturesHash, callback, declutterReplays) {

      hitTolerance = Math.round(hitTolerance);
      var contextSize = hitTolerance * 2 + 1;
      var transform = (0, _transform2.compose)(this.hitDetectionTransform_, hitTolerance + 0.5, hitTolerance + 0.5, 1 / resolution, -1 / resolution, -rotation, -coordinate[0], -coordinate[1]);
      var context = this.hitDetectionContext_;

      if (context.canvas.width !== contextSize || context.canvas.height !== contextSize) {
        context.canvas.width = contextSize;
        context.canvas.height = contextSize;
      } else {
        context.clearRect(0, 0, contextSize, contextSize);
      }

      /**
       * @type {module:ol/extent~Extent}
       */
      var hitExtent = void 0;
      if (this.renderBuffer_ !== undefined) {
        hitExtent = (0, _extent.createEmpty)();
        (0, _extent.extendCoordinate)(hitExtent, coordinate);
        (0, _extent.buffer)(hitExtent, resolution * (this.renderBuffer_ + hitTolerance), hitExtent);
      }

      var mask = getCircleArray(hitTolerance);
      var declutteredFeatures = void 0;
      if (this.declutterTree_) {
        declutteredFeatures = this.declutterTree_.all().map(function (entry) {
          return entry.value;
        });
      }

      var replayType = void 0;

      /**
       * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
       * @return {?} Callback result.
       */
      function featureCallback(feature) {
        var imageData = context.getImageData(0, 0, contextSize, contextSize).data;
        for (var _i = 0; _i < contextSize; _i++) {
          for (var _j = 0; _j < contextSize; _j++) {
            if (mask[_i][_j]) {
              if (imageData[(_j * contextSize + _i) * 4 + 3] > 0) {
                var _result = void 0;
                if (!(declutteredFeatures && (replayType == _ReplayType2.default.IMAGE || replayType == _ReplayType2.default.TEXT)) || declutteredFeatures.indexOf(feature) !== -1) {
                  _result = callback(feature);
                }
                if (_result) {
                  return _result;
                } else {
                  context.clearRect(0, 0, contextSize, contextSize);
                  return undefined;
                }
              }
            }
          }
        }
      }

      /** @type {Array<number>} */
      var zs = Object.keys(this.replaysByZIndex_).map(Number);
      zs.sort(_array.numberSafeCompareFunction);

      var i = void 0,
          j = void 0,
          replays = void 0,
          replay = void 0,
          result = void 0;
      for (i = zs.length - 1; i >= 0; --i) {
        var zIndexKey = zs[i].toString();
        replays = this.replaysByZIndex_[zIndexKey];
        for (j = _replay.ORDER.length - 1; j >= 0; --j) {
          replayType = _replay.ORDER[j];
          replay = replays[replayType];
          if (replay !== undefined) {
            if (declutterReplays && (replayType == _ReplayType2.default.IMAGE || replayType == _ReplayType2.default.TEXT)) {
              var declutter = declutterReplays[zIndexKey];
              if (!declutter) {
                declutterReplays[zIndexKey] = [replay, transform.slice(0)];
              } else {
                declutter.push(replay, transform.slice(0));
              }
            } else {
              result = replay.replayHitDetection(context, transform, rotation, skippedFeaturesHash, featureCallback, hitExtent);
              if (result) {
                return result;
              }
            }
          }
        }
      }
      return undefined;
    }

    /**
     * @param {module:ol/transform~Transform} transform Transform.
     * @return {Array<number>} Clip coordinates.
     */

  }, {
    key: 'getClipCoords',
    value: function getClipCoords(transform) {
      var maxExtent = this.maxExtent_;
      var minX = maxExtent[0];
      var minY = maxExtent[1];
      var maxX = maxExtent[2];
      var maxY = maxExtent[3];
      var flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY];
      (0, _transform.transform2D)(flatClipCoords, 0, 8, 2, transform, flatClipCoords);
      return flatClipCoords;
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
        var Constructor = BATCH_CONSTRUCTORS[replayType];
        replay = new Constructor(this.tolerance_, this.maxExtent_, this.resolution_, this.pixelRatio_, this.overlaps_, this.declutterTree_);
        replays[replayType] = replay;
      }
      return replay;
    }

    /**
     * @return {Object<string, Object<module:ol/render/ReplayType, module:ol/render/canvas/Replay>>} Replays.
     */

  }, {
    key: 'getReplays',
    value: function getReplays() {
      return this.replaysByZIndex_;
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
     * @param {CanvasRenderingContext2D} context Context.
     * @param {module:ol/transform~Transform} transform Transform.
     * @param {number} viewRotation View rotation.
     * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
     * @param {Array<module:ol/render/ReplayType>=} opt_replayTypes Ordered replay types to replay.
     *     Default is {@link module:ol/render/replay~ORDER}
     * @param {Object<string, module:ol/render/canvas~DeclutterGroup>=} opt_declutterReplays Declutter replays.
     */

  }, {
    key: 'replay',
    value: function replay(context, transform, viewRotation, skippedFeaturesHash, opt_replayTypes, opt_declutterReplays) {

      /** @type {Array<number>} */
      var zs = Object.keys(this.replaysByZIndex_).map(Number);
      zs.sort(_array.numberSafeCompareFunction);

      // setup clipping so that the parts of over-simplified geometries are not
      // visible outside the current extent when panning
      context.save();
      this.clip(context, transform);

      var replayTypes = opt_replayTypes ? opt_replayTypes : _replay.ORDER;
      var i = void 0,
          ii = void 0,
          j = void 0,
          jj = void 0,
          replays = void 0,
          replay = void 0;
      for (i = 0, ii = zs.length; i < ii; ++i) {
        var zIndexKey = zs[i].toString();
        replays = this.replaysByZIndex_[zIndexKey];
        for (j = 0, jj = replayTypes.length; j < jj; ++j) {
          var replayType = replayTypes[j];
          replay = replays[replayType];
          if (replay !== undefined) {
            if (opt_declutterReplays && (replayType == _ReplayType2.default.IMAGE || replayType == _ReplayType2.default.TEXT)) {
              var declutter = opt_declutterReplays[zIndexKey];
              if (!declutter) {
                opt_declutterReplays[zIndexKey] = [replay, transform.slice(0)];
              } else {
                declutter.push(replay, transform.slice(0));
              }
            } else {
              replay.replay(context, transform, viewRotation, skippedFeaturesHash);
            }
          }
        }
      }

      context.restore();
    }
  }]);

  return CanvasReplayGroup;
}(_ReplayGroup3.default);

/**
 * This cache is used for storing calculated pixel circles for increasing performance.
 * It is a static property to allow each Replaygroup to access it.
 * @type {Object<number, Array<Array<(boolean|undefined)>>>}
 */


var circleArrayCache = {
  0: [[true]]
};

/**
 * This method fills a row in the array from the given coordinate to the
 * middle with `true`.
 * @param {Array<Array<(boolean|undefined)>>} array The array that will be altered.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 */
function fillCircleArrayRowToMiddle(array, x, y) {
  var i = void 0;
  var radius = Math.floor(array.length / 2);
  if (x >= radius) {
    for (i = radius; i < x; i++) {
      array[i][y] = true;
    }
  } else if (x < radius) {
    for (i = x + 1; i < radius; i++) {
      array[i][y] = true;
    }
  }
}

/**
 * This methods creates a circle inside a fitting array. Points inside the
 * circle are marked by true, points on the outside are undefined.
 * It uses the midpoint circle algorithm.
 * A cache is used to increase performance.
 * @param {number} radius Radius.
 * @returns {Array<Array<(boolean|undefined)>>} An array with marked circle points.
 */
function getCircleArray(radius) {
  if (circleArrayCache[radius] !== undefined) {
    return circleArrayCache[radius];
  }

  var arraySize = radius * 2 + 1;
  var arr = new Array(arraySize);
  for (var i = 0; i < arraySize; i++) {
    arr[i] = new Array(arraySize);
  }

  var x = radius;
  var y = 0;
  var error = 0;

  while (x >= y) {
    fillCircleArrayRowToMiddle(arr, radius + x, radius + y);
    fillCircleArrayRowToMiddle(arr, radius + y, radius + x);
    fillCircleArrayRowToMiddle(arr, radius - y, radius + x);
    fillCircleArrayRowToMiddle(arr, radius - x, radius + y);
    fillCircleArrayRowToMiddle(arr, radius - x, radius - y);
    fillCircleArrayRowToMiddle(arr, radius - y, radius - x);
    fillCircleArrayRowToMiddle(arr, radius + y, radius - x);
    fillCircleArrayRowToMiddle(arr, radius + x, radius - y);

    y++;
    error += 1 + 2 * y;
    if (2 * (error - x) + 1 > 0) {
      x -= 1;
      error += 1 - 2 * x;
    }
  }

  circleArrayCache[radius] = arr;
  return arr;
}

/**
 * @param {!Object<string, Array<*>>} declutterReplays Declutter replays.
 * @param {CanvasRenderingContext2D} context Context.
 * @param {number} rotation Rotation.
 */
function replayDeclutter(declutterReplays, context, rotation) {
  var zs = Object.keys(declutterReplays).map(Number).sort(_array.numberSafeCompareFunction);
  var skippedFeatureUids = {};
  for (var z = 0, zz = zs.length; z < zz; ++z) {
    var replayData = declutterReplays[zs[z].toString()];
    for (var i = 0, ii = replayData.length; i < ii;) {
      var replay = replayData[i++];
      var transform = replayData[i++];
      replay.replay(context, transform, rotation, skippedFeatureUids);
    }
  }
}

exports.default = CanvasReplayGroup;