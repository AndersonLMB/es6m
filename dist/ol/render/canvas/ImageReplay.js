'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Instruction = require('../canvas/Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('../canvas/Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/canvas/ImageReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var CanvasImageReplay = function (_CanvasReplay) {
  _inherits(CanvasImageReplay, _CanvasReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {?} declutterTree Declutter tree.
   */
  function CanvasImageReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    _classCallCheck(this, CanvasImageReplay);

    /**
     * @private
     * @type {module:ol/render/canvas~DeclutterGroup}
     */
    var _this = _possibleConstructorReturn(this, (CanvasImageReplay.__proto__ || Object.getPrototypeOf(CanvasImageReplay)).call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree));

    _this.declutterGroup_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
     */
    _this.hitDetectionImage_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
     */
    _this.image_ = null;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.anchorX_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.anchorY_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.height_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.opacity_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.originX_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.originY_ = undefined;

    /**
     * @private
     * @type {boolean|undefined}
     */
    _this.rotateWithView_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.rotation_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.scale_ = undefined;

    /**
     * @private
     * @type {boolean|undefined}
     */
    _this.snapToPixel_ = undefined;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.width_ = undefined;

    return _this;
  }

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} My end.
   */


  _createClass(CanvasImageReplay, [{
    key: 'drawCoordinates_',
    value: function drawCoordinates_(flatCoordinates, offset, end, stride) {
      return this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawPoint',
    value: function drawPoint(pointGeometry, feature) {
      if (!this.image_) {
        return;
      }
      this.beginGeometry(pointGeometry, feature);
      var flatCoordinates = pointGeometry.getFlatCoordinates();
      var stride = pointGeometry.getStride();
      var myBegin = this.coordinates.length;
      var myEnd = this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
      this.instructions.push([_Instruction2.default.DRAW_IMAGE, myBegin, myEnd, this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_ * this.pixelRatio, this.snapToPixel_, this.width_]);
      this.hitDetectionInstructions.push([_Instruction2.default.DRAW_IMAGE, myBegin, myEnd, this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
      this.endGeometry(pointGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawMultiPoint',
    value: function drawMultiPoint(multiPointGeometry, feature) {
      if (!this.image_) {
        return;
      }
      this.beginGeometry(multiPointGeometry, feature);
      var flatCoordinates = multiPointGeometry.getFlatCoordinates();
      var stride = multiPointGeometry.getStride();
      var myBegin = this.coordinates.length;
      var myEnd = this.drawCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
      this.instructions.push([_Instruction2.default.DRAW_IMAGE, myBegin, myEnd, this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_ * this.pixelRatio, this.snapToPixel_, this.width_]);
      this.hitDetectionInstructions.push([_Instruction2.default.DRAW_IMAGE, myBegin, myEnd, this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_, this.anchorY_, this.declutterGroup_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.snapToPixel_, this.width_]);
      this.endGeometry(multiPointGeometry, feature);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish() {
      this.reverseHitDetectionInstructions();
      // FIXME this doesn't really protect us against further calls to draw*Geometry
      this.anchorX_ = undefined;
      this.anchorY_ = undefined;
      this.hitDetectionImage_ = null;
      this.image_ = null;
      this.height_ = undefined;
      this.scale_ = undefined;
      this.opacity_ = undefined;
      this.originX_ = undefined;
      this.originY_ = undefined;
      this.rotateWithView_ = undefined;
      this.rotation_ = undefined;
      this.snapToPixel_ = undefined;
      this.width_ = undefined;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setImageStyle',
    value: function setImageStyle(imageStyle, declutterGroup) {
      var anchor = imageStyle.getAnchor();
      var size = imageStyle.getSize();
      var hitDetectionImage = imageStyle.getHitDetectionImage(1);
      var image = imageStyle.getImage(1);
      var origin = imageStyle.getOrigin();
      this.anchorX_ = anchor[0];
      this.anchorY_ = anchor[1];
      this.declutterGroup_ = /** @type {module:ol/render/canvas~DeclutterGroup} */declutterGroup;
      this.hitDetectionImage_ = hitDetectionImage;
      this.image_ = image;
      this.height_ = size[1];
      this.opacity_ = imageStyle.getOpacity();
      this.originX_ = origin[0];
      this.originY_ = origin[1];
      this.rotateWithView_ = imageStyle.getRotateWithView();
      this.rotation_ = imageStyle.getRotation();
      this.scale_ = imageStyle.getScale();
      this.snapToPixel_ = imageStyle.getSnapToPixel();
      this.width_ = size[0];
    }
  }]);

  return CanvasImageReplay;
}(_Replay2.default);

exports.default = CanvasImageReplay;