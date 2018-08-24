'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../../util.js');

var _TextureReplay = require('../webgl/TextureReplay.js');

var _TextureReplay2 = _interopRequireDefault(_TextureReplay);

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/webgl/ImageReplay
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var WebGLImageReplay = function (_WebGLTextureReplay) {
  _inherits(WebGLImageReplay, _WebGLTextureReplay);

  /**
   * @param {number} tolerance Tolerance.
   * @param {module:ol/extent~Extent} maxExtent Max extent.
   */
  function WebGLImageReplay(tolerance, maxExtent) {
    _classCallCheck(this, WebGLImageReplay);

    /**
     * @type {Array<HTMLCanvasElement|HTMLImageElement|HTMLVideoElement>}
     * @protected
     */
    var _this = _possibleConstructorReturn(this, (WebGLImageReplay.__proto__ || Object.getPrototypeOf(WebGLImageReplay)).call(this, tolerance, maxExtent));

    _this.images_ = [];

    /**
     * @type {Array<HTMLCanvasElement|HTMLImageElement|HTMLVideoElement>}
     * @protected
     */
    _this.hitDetectionImages_ = [];

    /**
     * @type {Array<WebGLTexture>}
     * @private
     */
    _this.textures_ = [];

    /**
     * @type {Array<WebGLTexture>}
     * @private
     */
    _this.hitDetectionTextures_ = [];

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLImageReplay, [{
    key: 'drawMultiPoint',
    value: function drawMultiPoint(multiPointGeometry, feature) {
      this.startIndices.push(this.indices.length);
      this.startIndicesFeature.push(feature);
      var flatCoordinates = multiPointGeometry.getFlatCoordinates();
      var stride = multiPointGeometry.getStride();
      this.drawCoordinates(flatCoordinates, 0, flatCoordinates.length, stride);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'drawPoint',
    value: function drawPoint(pointGeometry, feature) {
      this.startIndices.push(this.indices.length);
      this.startIndicesFeature.push(feature);
      var flatCoordinates = pointGeometry.getFlatCoordinates();
      var stride = pointGeometry.getStride();
      this.drawCoordinates(flatCoordinates, 0, flatCoordinates.length, stride);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'finish',
    value: function finish(context) {
      var gl = context.getGL();

      this.groupIndices.push(this.indices.length);
      this.hitDetectionGroupIndices.push(this.indices.length);

      // create, bind, and populate the vertices buffer
      this.verticesBuffer = new _Buffer2.default(this.vertices);

      var indices = this.indices;

      // create, bind, and populate the indices buffer
      this.indicesBuffer = new _Buffer2.default(indices);

      // create textures
      /** @type {Object<string, WebGLTexture>} */
      var texturePerImage = {};

      this.createTextures(this.textures_, this.images_, texturePerImage, gl);

      this.createTextures(this.hitDetectionTextures_, this.hitDetectionImages_, texturePerImage, gl);

      this.images_ = null;
      this.hitDetectionImages_ = null;
      _TextureReplay2.default.prototype.finish.call(this, context);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setImageStyle',
    value: function setImageStyle(imageStyle) {
      var anchor = imageStyle.getAnchor();
      var image = imageStyle.getImage(1);
      var imageSize = imageStyle.getImageSize();
      var hitDetectionImage = imageStyle.getHitDetectionImage(1);
      var opacity = imageStyle.getOpacity();
      var origin = imageStyle.getOrigin();
      var rotateWithView = imageStyle.getRotateWithView();
      var rotation = imageStyle.getRotation();
      var size = imageStyle.getSize();
      var scale = imageStyle.getScale();

      var currentImage = void 0;
      if (this.images_.length === 0) {
        this.images_.push(image);
      } else {
        currentImage = this.images_[this.images_.length - 1];
        if ((0, _util.getUid)(currentImage) != (0, _util.getUid)(image)) {
          this.groupIndices.push(this.indices.length);
          this.images_.push(image);
        }
      }

      if (this.hitDetectionImages_.length === 0) {
        this.hitDetectionImages_.push(hitDetectionImage);
      } else {
        currentImage = this.hitDetectionImages_[this.hitDetectionImages_.length - 1];
        if ((0, _util.getUid)(currentImage) != (0, _util.getUid)(hitDetectionImage)) {
          this.hitDetectionGroupIndices.push(this.indices.length);
          this.hitDetectionImages_.push(hitDetectionImage);
        }
      }

      this.anchorX = anchor[0];
      this.anchorY = anchor[1];
      this.height = size[1];
      this.imageHeight = imageSize[1];
      this.imageWidth = imageSize[0];
      this.opacity = opacity;
      this.originX = origin[0];
      this.originY = origin[1];
      this.rotation = rotation;
      this.rotateWithView = rotateWithView;
      this.scale = scale;
      this.width = size[0];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getTextures',
    value: function getTextures(opt_all) {
      return opt_all ? this.textures_.concat(this.hitDetectionTextures_) : this.textures_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getHitDetectionTextures',
    value: function getHitDetectionTextures() {
      return this.hitDetectionTextures_;
    }
  }]);

  return WebGLImageReplay;
}(_TextureReplay2.default);

exports.default = WebGLImageReplay;