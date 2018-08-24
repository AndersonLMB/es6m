'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colorlike = require('../colorlike.js');

var _dom = require('../dom.js');

var _has = require('../has.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _canvas = require('../render/canvas.js');

var _Image = require('../style/Image.js');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/style/RegularShape
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Specify radius for regular polygons, or radius1 and radius2 for stars.
 * @typedef {Object} Options
 * @property {module:ol/style/Fill} [fill] Fill style.
 * @property {number} points Number of points for stars and regular polygons. In case of a polygon, the number of points
 * is the number of sides.
 * @property {number} [radius] Radius of a regular polygon.
 * @property {number} [radius1] Outer radius of a star.
 * @property {number} [radius2] Inner radius of a star.
 * @property {number} [angle=0] Shape's angle in radians. A value of 0 will have one of the shape's point facing up.
 * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
 * when drawing the shape in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
 * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
 * the shape's position is animated. Without it, the shape may jitter noticeably.
 * @property {module:ol/style/Stroke} [stroke] Stroke style.
 * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
 * @property {boolean} [rotateWithView=false] Whether to rotate the shape with the view.
 * @property {module:ol/style/AtlasManager} [atlasManager] The atlas manager to use for this symbol. When
 * using WebGL it is recommended to use an atlas manager to avoid texture switching. If an atlas manager is given, the
 * symbol is added to an atlas. By default no atlas manager is used.
 */

/**
 * @typedef {Object} RenderOptions
 * @property {module:ol/colorlike~ColorLike} [strokeStyle]
 * @property {number} strokeWidth
 * @property {number} size
 * @property {string} lineCap
 * @property {Array<number>} lineDash
 * @property {number} lineDashOffset
 * @property {string} lineJoin
 * @property {number} miterLimit
 */

/**
 * @classdesc
 * Set regular shape style for vector features. The resulting shape will be
 * a regular polygon when `radius` is provided, or a star when `radius1` and
 * `radius2` are provided.
 * @api
 */
var RegularShape = function (_ImageStyle) {
  _inherits(RegularShape, _ImageStyle);

  /**
   * @param {module:ol/style/RegularShape~Options} options Options.
   */
  function RegularShape(options) {
    _classCallCheck(this, RegularShape);

    /**
     * @type {boolean}
     */
    var snapToPixel = options.snapToPixel !== undefined ? options.snapToPixel : true;

    /**
     * @type {boolean}
     */
    var rotateWithView = options.rotateWithView !== undefined ? options.rotateWithView : false;

    /**
     * @private
     * @type {Array<string>}
     */
    var _this = _possibleConstructorReturn(this, (RegularShape.__proto__ || Object.getPrototypeOf(RegularShape)).call(this, {
      opacity: 1,
      rotateWithView: rotateWithView,
      rotation: options.rotation !== undefined ? options.rotation : 0,
      scale: 1,
      snapToPixel: snapToPixel
    }));

    _this.checksums_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.canvas_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    _this.hitDetectionCanvas_ = null;

    /**
     * @private
     * @type {module:ol/style/Fill}
     */
    _this.fill_ = options.fill !== undefined ? options.fill : null;

    /**
     * @private
     * @type {Array<number>}
     */
    _this.origin_ = [0, 0];

    /**
     * @private
     * @type {number}
     */
    _this.points_ = options.points;

    /**
     * @protected
     * @type {number}
     */
    _this.radius_ = /** @type {number} */options.radius !== undefined ? options.radius : options.radius1;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.radius2_ = options.radius2;

    /**
     * @private
     * @type {number}
     */
    _this.angle_ = options.angle !== undefined ? options.angle : 0;

    /**
     * @private
     * @type {module:ol/style/Stroke}
     */
    _this.stroke_ = options.stroke !== undefined ? options.stroke : null;

    /**
     * @private
     * @type {Array<number>}
     */
    _this.anchor_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.size_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.imageSize_ = null;

    /**
     * @private
     * @type {module:ol/size~Size}
     */
    _this.hitDetectionImageSize_ = null;

    /**
     * @protected
     * @type {module:ol/style/AtlasManager|undefined}
     */
    _this.atlasManager_ = options.atlasManager;

    _this.render_(_this.atlasManager_);

    return _this;
  }

  /**
   * Clones the style. If an atlasmanager was provided to the original style it will be used in the cloned style, too.
   * @return {module:ol/style/RegularShape} The cloned style.
   * @api
   */


  _createClass(RegularShape, [{
    key: 'clone',
    value: function clone() {
      var style = new RegularShape({
        fill: this.getFill() ? this.getFill().clone() : undefined,
        points: this.getPoints(),
        radius: this.getRadius(),
        radius2: this.getRadius2(),
        angle: this.getAngle(),
        snapToPixel: this.getSnapToPixel(),
        stroke: this.getStroke() ? this.getStroke().clone() : undefined,
        rotation: this.getRotation(),
        rotateWithView: this.getRotateWithView(),
        atlasManager: this.atlasManager_
      });
      style.setOpacity(this.getOpacity());
      style.setScale(this.getScale());
      return style;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getAnchor',
    value: function getAnchor() {
      return this.anchor_;
    }

    /**
     * Get the angle used in generating the shape.
     * @return {number} Shape's rotation in radians.
     * @api
     */

  }, {
    key: 'getAngle',
    value: function getAngle() {
      return this.angle_;
    }

    /**
     * Get the fill style for the shape.
     * @return {module:ol/style/Fill} Fill style.
     * @api
     */

  }, {
    key: 'getFill',
    value: function getFill() {
      return this.fill_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getHitDetectionImage',
    value: function getHitDetectionImage(pixelRatio) {
      return this.hitDetectionCanvas_;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getImage',
    value: function getImage(pixelRatio) {
      return this.canvas_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageSize',
    value: function getImageSize() {
      return this.imageSize_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getHitDetectionImageSize',
    value: function getHitDetectionImageSize() {
      return this.hitDetectionImageSize_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getImageState',
    value: function getImageState() {
      return _ImageState2.default.LOADED;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getOrigin',
    value: function getOrigin() {
      return this.origin_;
    }

    /**
     * Get the number of points for generating the shape.
     * @return {number} Number of points for stars and regular polygons.
     * @api
     */

  }, {
    key: 'getPoints',
    value: function getPoints() {
      return this.points_;
    }

    /**
     * Get the (primary) radius for the shape.
     * @return {number} Radius.
     * @api
     */

  }, {
    key: 'getRadius',
    value: function getRadius() {
      return this.radius_;
    }

    /**
     * Get the secondary radius for the shape.
     * @return {number|undefined} Radius2.
     * @api
     */

  }, {
    key: 'getRadius2',
    value: function getRadius2() {
      return this.radius2_;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getSize',
    value: function getSize() {
      return this.size_;
    }

    /**
     * Get the stroke style for the shape.
     * @return {module:ol/style/Stroke} Stroke style.
     * @api
     */

  }, {
    key: 'getStroke',
    value: function getStroke() {
      return this.stroke_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'listenImageChange',
    value: function listenImageChange(listener, thisArg) {}

    /**
     * @inheritDoc
     */

  }, {
    key: 'load',
    value: function load() {}

    /**
     * @inheritDoc
     */

  }, {
    key: 'unlistenImageChange',
    value: function unlistenImageChange(listener, thisArg) {}

    /**
     * @protected
     * @param {module:ol/style/AtlasManager|undefined} atlasManager An atlas manager.
     */

  }, {
    key: 'render_',
    value: function render_(atlasManager) {
      var imageSize = void 0;
      var lineCap = '';
      var lineJoin = '';
      var miterLimit = 0;
      var lineDash = null;
      var lineDashOffset = 0;
      var strokeStyle = void 0;
      var strokeWidth = 0;

      if (this.stroke_) {
        strokeStyle = this.stroke_.getColor();
        if (strokeStyle === null) {
          strokeStyle = _canvas.defaultStrokeStyle;
        }
        strokeStyle = (0, _colorlike.asColorLike)(strokeStyle);
        strokeWidth = this.stroke_.getWidth();
        if (strokeWidth === undefined) {
          strokeWidth = _canvas.defaultLineWidth;
        }
        lineDash = this.stroke_.getLineDash();
        lineDashOffset = this.stroke_.getLineDashOffset();
        if (!_has.CANVAS_LINE_DASH) {
          lineDash = null;
          lineDashOffset = 0;
        }
        lineJoin = this.stroke_.getLineJoin();
        if (lineJoin === undefined) {
          lineJoin = _canvas.defaultLineJoin;
        }
        lineCap = this.stroke_.getLineCap();
        if (lineCap === undefined) {
          lineCap = _canvas.defaultLineCap;
        }
        miterLimit = this.stroke_.getMiterLimit();
        if (miterLimit === undefined) {
          miterLimit = _canvas.defaultMiterLimit;
        }
      }

      var size = 2 * (this.radius_ + strokeWidth) + 1;

      /** @type {module:ol/style/RegularShape~RenderOptions} */
      var renderOptions = {
        strokeStyle: strokeStyle,
        strokeWidth: strokeWidth,
        size: size,
        lineCap: lineCap,
        lineDash: lineDash,
        lineDashOffset: lineDashOffset,
        lineJoin: lineJoin,
        miterLimit: miterLimit
      };

      if (atlasManager === undefined) {
        // no atlas manager is used, create a new canvas
        var context = (0, _dom.createCanvasContext2D)(size, size);
        this.canvas_ = context.canvas;

        // canvas.width and height are rounded to the closest integer
        size = this.canvas_.width;
        imageSize = size;

        this.draw_(renderOptions, context, 0, 0);

        this.createHitDetectionCanvas_(renderOptions);
      } else {
        // an atlas manager is used, add the symbol to an atlas
        size = Math.round(size);

        var hasCustomHitDetectionImage = !this.fill_;
        var renderHitDetectionCallback = void 0;
        if (hasCustomHitDetectionImage) {
          // render the hit-detection image into a separate atlas image
          renderHitDetectionCallback = this.drawHitDetectionCanvas_.bind(this, renderOptions);
        }

        var id = this.getChecksum();
        var info = atlasManager.add(id, size, size, this.draw_.bind(this, renderOptions), renderHitDetectionCallback);

        this.canvas_ = info.image;
        this.origin_ = [info.offsetX, info.offsetY];
        imageSize = info.image.width;

        if (hasCustomHitDetectionImage) {
          this.hitDetectionCanvas_ = info.hitImage;
          this.hitDetectionImageSize_ = [info.hitImage.width, info.hitImage.height];
        } else {
          this.hitDetectionCanvas_ = this.canvas_;
          this.hitDetectionImageSize_ = [imageSize, imageSize];
        }
      }

      this.anchor_ = [size / 2, size / 2];
      this.size_ = [size, size];
      this.imageSize_ = [imageSize, imageSize];
    }

    /**
     * @private
     * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
     * @param {CanvasRenderingContext2D} context The rendering context.
     * @param {number} x The origin for the symbol (x).
     * @param {number} y The origin for the symbol (y).
     */

  }, {
    key: 'draw_',
    value: function draw_(renderOptions, context, x, y) {
      var i = void 0,
          angle0 = void 0,
          radiusC = void 0;
      // reset transform
      context.setTransform(1, 0, 0, 1, 0, 0);

      // then move to (x, y)
      context.translate(x, y);

      context.beginPath();

      var points = this.points_;
      if (points === Infinity) {
        context.arc(renderOptions.size / 2, renderOptions.size / 2, this.radius_, 0, 2 * Math.PI, true);
      } else {
        var radius2 = this.radius2_ !== undefined ? this.radius2_ : this.radius_;
        if (radius2 !== this.radius_) {
          points = 2 * points;
        }
        for (i = 0; i <= points; i++) {
          angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this.angle_;
          radiusC = i % 2 === 0 ? this.radius_ : radius2;
          context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0), renderOptions.size / 2 + radiusC * Math.sin(angle0));
        }
      }

      if (this.fill_) {
        var color = this.fill_.getColor();
        if (color === null) {
          color = _canvas.defaultFillStyle;
        }
        context.fillStyle = (0, _colorlike.asColorLike)(color);
        context.fill();
      }
      if (this.stroke_) {
        context.strokeStyle = renderOptions.strokeStyle;
        context.lineWidth = renderOptions.strokeWidth;
        if (renderOptions.lineDash) {
          context.setLineDash(renderOptions.lineDash);
          context.lineDashOffset = renderOptions.lineDashOffset;
        }
        context.lineCap = renderOptions.lineCap;
        context.lineJoin = renderOptions.lineJoin;
        context.miterLimit = renderOptions.miterLimit;
        context.stroke();
      }
      context.closePath();
    }

    /**
     * @private
     * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
     */

  }, {
    key: 'createHitDetectionCanvas_',
    value: function createHitDetectionCanvas_(renderOptions) {
      this.hitDetectionImageSize_ = [renderOptions.size, renderOptions.size];
      if (this.fill_) {
        this.hitDetectionCanvas_ = this.canvas_;
        return;
      }

      // if no fill style is set, create an extra hit-detection image with a
      // default fill style
      var context = (0, _dom.createCanvasContext2D)(renderOptions.size, renderOptions.size);
      this.hitDetectionCanvas_ = context.canvas;

      this.drawHitDetectionCanvas_(renderOptions, context, 0, 0);
    }

    /**
     * @private
     * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
     * @param {CanvasRenderingContext2D} context The context.
     * @param {number} x The origin for the symbol (x).
     * @param {number} y The origin for the symbol (y).
     */

  }, {
    key: 'drawHitDetectionCanvas_',
    value: function drawHitDetectionCanvas_(renderOptions, context, x, y) {
      // reset transform
      context.setTransform(1, 0, 0, 1, 0, 0);

      // then move to (x, y)
      context.translate(x, y);

      context.beginPath();

      var points = this.points_;
      if (points === Infinity) {
        context.arc(renderOptions.size / 2, renderOptions.size / 2, this.radius_, 0, 2 * Math.PI, true);
      } else {
        var radius2 = this.radius2_ !== undefined ? this.radius2_ : this.radius_;
        if (radius2 !== this.radius_) {
          points = 2 * points;
        }
        var i = void 0,
            radiusC = void 0,
            angle0 = void 0;
        for (i = 0; i <= points; i++) {
          angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this.angle_;
          radiusC = i % 2 === 0 ? this.radius_ : radius2;
          context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0), renderOptions.size / 2 + radiusC * Math.sin(angle0));
        }
      }

      context.fillStyle = _canvas.defaultFillStyle;
      context.fill();
      if (this.stroke_) {
        context.strokeStyle = renderOptions.strokeStyle;
        context.lineWidth = renderOptions.strokeWidth;
        if (renderOptions.lineDash) {
          context.setLineDash(renderOptions.lineDash);
          context.lineDashOffset = renderOptions.lineDashOffset;
        }
        context.stroke();
      }
      context.closePath();
    }

    /**
     * @return {string} The checksum.
     */

  }, {
    key: 'getChecksum',
    value: function getChecksum() {
      var strokeChecksum = this.stroke_ ? this.stroke_.getChecksum() : '-';
      var fillChecksum = this.fill_ ? this.fill_.getChecksum() : '-';

      var recalculate = !this.checksums_ || strokeChecksum != this.checksums_[1] || fillChecksum != this.checksums_[2] || this.radius_ != this.checksums_[3] || this.radius2_ != this.checksums_[4] || this.angle_ != this.checksums_[5] || this.points_ != this.checksums_[6];

      if (recalculate) {
        var checksum = 'r' + strokeChecksum + fillChecksum + (this.radius_ !== undefined ? this.radius_.toString() : '-') + (this.radius2_ !== undefined ? this.radius2_.toString() : '-') + (this.angle_ !== undefined ? this.angle_.toString() : '-') + (this.points_ !== undefined ? this.points_.toString() : '-');
        this.checksums_ = [checksum, strokeChecksum, fillChecksum, this.radius_, this.radius2_, this.angle_, this.points_];
      }

      return this.checksums_[0];
    }
  }]);

  return RegularShape;
}(_Image2.default);

exports.default = RegularShape;