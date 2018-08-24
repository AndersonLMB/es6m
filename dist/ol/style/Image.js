"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/style/Image
 */

/**
 * @typedef {Object} Options
 * @property {number} opacity
 * @property {boolean} rotateWithView
 * @property {number} rotation
 * @property {number} scale
 * @property {boolean} snapToPixel
 */

/**
 * @classdesc
 * A base class used for creating subclasses and not instantiated in
 * apps. Base class for {@link module:ol/style/Icon~Icon}, {@link module:ol/style/Circle~CircleStyle} and
 * {@link module:ol/style/RegularShape~RegularShape}.
 * @api
 */
var ImageStyle = function () {
  /**
   * @param {module:ol/style/Image~Options} options Options.
   */
  function ImageStyle(options) {
    _classCallCheck(this, ImageStyle);

    /**
    * @private
    * @type {number}
    */
    this.opacity_ = options.opacity;

    /**
    * @private
    * @type {boolean}
    */
    this.rotateWithView_ = options.rotateWithView;

    /**
    * @private
    * @type {number}
    */
    this.rotation_ = options.rotation;

    /**
    * @private
    * @type {number}
    */
    this.scale_ = options.scale;

    /**
    * @private
    * @type {boolean}
    */
    this.snapToPixel_ = options.snapToPixel;
  }

  /**
  * Get the symbolizer opacity.
  * @return {number} Opacity.
  * @api
  */


  _createClass(ImageStyle, [{
    key: "getOpacity",
    value: function getOpacity() {
      return this.opacity_;
    }

    /**
    * Determine whether the symbolizer rotates with the map.
    * @return {boolean} Rotate with map.
    * @api
    */

  }, {
    key: "getRotateWithView",
    value: function getRotateWithView() {
      return this.rotateWithView_;
    }

    /**
    * Get the symoblizer rotation.
    * @return {number} Rotation.
    * @api
    */

  }, {
    key: "getRotation",
    value: function getRotation() {
      return this.rotation_;
    }

    /**
    * Get the symbolizer scale.
    * @return {number} Scale.
    * @api
    */

  }, {
    key: "getScale",
    value: function getScale() {
      return this.scale_;
    }

    /**
    * Determine whether the symbolizer should be snapped to a pixel.
    * @return {boolean} The symbolizer should snap to a pixel.
    * @api
    */

  }, {
    key: "getSnapToPixel",
    value: function getSnapToPixel() {
      return this.snapToPixel_;
    }

    /**
    * Get the anchor point in pixels. The anchor determines the center point for the
    * symbolizer.
    * @abstract
    * @return {Array<number>} Anchor.
    */

  }, {
    key: "getAnchor",
    value: function getAnchor() {}

    /**
    * Get the image element for the symbolizer.
    * @abstract
    * @param {number} pixelRatio Pixel ratio.
    * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
    */

  }, {
    key: "getImage",
    value: function getImage(pixelRatio) {}

    /**
    * @abstract
    * @param {number} pixelRatio Pixel ratio.
    * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
    */

  }, {
    key: "getHitDetectionImage",
    value: function getHitDetectionImage(pixelRatio) {}

    /**
    * @abstract
    * @return {module:ol/ImageState} Image state.
    */

  }, {
    key: "getImageState",
    value: function getImageState() {}

    /**
    * @abstract
    * @return {module:ol/size~Size} Image size.
    */

  }, {
    key: "getImageSize",
    value: function getImageSize() {}

    /**
    * @abstract
    * @return {module:ol/size~Size} Size of the hit-detection image.
    */

  }, {
    key: "getHitDetectionImageSize",
    value: function getHitDetectionImageSize() {}

    /**
    * Get the origin of the symbolizer.
    * @abstract
    * @return {Array<number>} Origin.
    */

  }, {
    key: "getOrigin",
    value: function getOrigin() {}

    /**
    * Get the size of the symbolizer (in pixels).
    * @abstract
    * @return {module:ol/size~Size} Size.
    */

  }, {
    key: "getSize",
    value: function getSize() {}

    /**
    * Set the opacity.
    *
    * @param {number} opacity Opacity.
    * @api
    */

  }, {
    key: "setOpacity",
    value: function setOpacity(opacity) {
      this.opacity_ = opacity;
    }

    /**
    * Set whether to rotate the style with the view.
    *
    * @param {boolean} rotateWithView Rotate with map.
    * @api
    */

  }, {
    key: "setRotateWithView",
    value: function setRotateWithView(rotateWithView) {
      this.rotateWithView_ = rotateWithView;
    }

    /**
    * Set the rotation.
    *
    * @param {number} rotation Rotation.
    * @api
    */

  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      this.rotation_ = rotation;
    }

    /**
    * Set the scale.
    *
    * @param {number} scale Scale.
    * @api
    */

  }, {
    key: "setScale",
    value: function setScale(scale) {
      this.scale_ = scale;
    }

    /**
    * Set whether to snap the image to the closest pixel.
    *
    * @param {boolean} snapToPixel Snap to pixel?
    * @api
    */

  }, {
    key: "setSnapToPixel",
    value: function setSnapToPixel(snapToPixel) {
      this.snapToPixel_ = snapToPixel;
    }

    /**
    * @abstract
    * @param {function(this: T, module:ol/events/Event)} listener Listener function.
    * @param {T} thisArg Value to use as `this` when executing `listener`.
    * @return {module:ol/events~EventsKey|undefined} Listener key.
    * @template T
    */

  }, {
    key: "listenImageChange",
    value: function listenImageChange(listener, thisArg) {}

    /**
    * Load not yet loaded URI.
    * @abstract
    */

  }, {
    key: "load",
    value: function load() {}

    /**
    * @abstract
    * @param {function(this: T, module:ol/events/Event)} listener Listener function.
    * @param {T} thisArg Value to use as `this` when executing `listener`.
    * @template T
    */

  }, {
    key: "unlistenImageChange",
    value: function unlistenImageChange(listener, thisArg) {}
  }]);

  return ImageStyle;
}();

exports.default = ImageStyle;