'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/style/AtlasManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _webgl = require('../webgl.js');

var _functions = require('../functions.js');

var _Atlas = require('../style/Atlas.js');

var _Atlas2 = _interopRequireDefault(_Atlas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} Options
 * @property {number} [initialSize=256] The size in pixels of the first atlas image.
 * @property {number} [maxSize] The maximum size in pixels of atlas images. Default is
 * `webgl/MAX_TEXTURE_SIZE` or 2048 if WebGL is not supported.
 * @property {number} [space=1] The space in pixels between images.
 */

/**
 * Provides information for an image inside an atlas manager.
 * `offsetX` and `offsetY` is the position of the image inside
 * the atlas image `image` and the position of the hit-detection image
 * inside the hit-detection atlas image `hitImage`.
 * @typedef {Object} AtlasManagerInfo
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {HTMLCanvasElement} image
 * @property {HTMLCanvasElement} hitImage
 */

/**
 * The size in pixels of the first atlas image.
 * @type {number}
 */
var INITIAL_ATLAS_SIZE = 256;

/**
 * The maximum size in pixels of atlas images.
 * @type {number}
 */
var MAX_ATLAS_SIZE = -1;

/**
 * @classdesc
 * Manages the creation of image atlases.
 *
 * Images added to this manager will be inserted into an atlas, which
 * will be used for rendering.
 * The `size` given in the constructor is the size for the first
 * atlas. After that, when new atlases are created, they will have
 * twice the size as the latest atlas (until `maxSize` is reached).
 *
 * If an application uses many images or very large images, it is recommended
 * to set a higher `size` value to avoid the creation of too many atlases.
 * @api
 */

var AtlasManager = function () {
  /**
   * @param {module:ol/style/AtlasManager~Options=} opt_options Options.
   */
  function AtlasManager(opt_options) {
    _classCallCheck(this, AtlasManager);

    var options = opt_options || {};

    /**
     * The size in pixels of the latest atlas image.
     * @private
     * @type {number}
     */
    this.currentSize_ = options.initialSize !== undefined ? options.initialSize : INITIAL_ATLAS_SIZE;

    /**
     * The maximum size in pixels of atlas images.
     * @private
     * @type {number}
     */
    this.maxSize_ = options.maxSize !== undefined ? options.maxSize : MAX_ATLAS_SIZE != -1 ? MAX_ATLAS_SIZE : _webgl.MAX_TEXTURE_SIZE !== undefined ? _webgl.MAX_TEXTURE_SIZE : 2048;

    /**
     * The size in pixels between images.
     * @private
     * @type {number}
     */
    this.space_ = options.space !== undefined ? options.space : 1;

    /**
     * @private
     * @type {Array<module:ol/style/Atlas>}
     */
    this.atlases_ = [new _Atlas2.default(this.currentSize_, this.space_)];

    /**
     * The size in pixels of the latest atlas image for hit-detection images.
     * @private
     * @type {number}
     */
    this.currentHitSize_ = this.currentSize_;

    /**
     * @private
     * @type {Array<module:ol/style/Atlas>}
     */
    this.hitAtlases_ = [new _Atlas2.default(this.currentHitSize_, this.space_)];
  }

  /**
   * @param {string} id The identifier of the entry to check.
   * @return {?module:ol/style/AtlasManager~AtlasManagerInfo} The position and atlas image for the
   *    entry, or `null` if the entry is not part of the atlas manager.
   */


  _createClass(AtlasManager, [{
    key: 'getInfo',
    value: function getInfo(id) {
      /** @type {?module:ol/style/Atlas~AtlasInfo} */
      var info = this.getInfo_(this.atlases_, id);

      if (!info) {
        return null;
      }
      var hitInfo = /** @type {module:ol/style/Atlas~AtlasInfo} */this.getInfo_(this.hitAtlases_, id);

      return this.mergeInfos_(info, hitInfo);
    }

    /**
     * @private
     * @param {Array<module:ol/style/Atlas>} atlases The atlases to search.
     * @param {string} id The identifier of the entry to check.
     * @return {?module:ol/style/Atlas~AtlasInfo} The position and atlas image for the entry,
     *    or `null` if the entry is not part of the atlases.
     */

  }, {
    key: 'getInfo_',
    value: function getInfo_(atlases, id) {
      for (var i = 0, ii = atlases.length; i < ii; ++i) {
        var atlas = atlases[i];
        var info = atlas.get(id);
        if (info) {
          return info;
        }
      }
      return null;
    }

    /**
     * @private
     * @param {module:ol/style/Atlas~AtlasInfo} info The info for the real image.
     * @param {module:ol/style/Atlas~AtlasInfo} hitInfo The info for the hit-detection
     *    image.
     * @return {?module:ol/style/AtlasManager~AtlasManagerInfo} The position and atlas image for the
     *    entry, or `null` if the entry is not part of the atlases.
     */

  }, {
    key: 'mergeInfos_',
    value: function mergeInfos_(info, hitInfo) {
      return (
        /** @type {module:ol/style/AtlasManager~AtlasManagerInfo} */{
          offsetX: info.offsetX,
          offsetY: info.offsetY,
          image: info.image,
          hitImage: hitInfo.image
        }
      );
    }

    /**
     * Add an image to the atlas manager.
     *
     * If an entry for the given id already exists, the entry will
     * be overridden (but the space on the atlas graphic will not be freed).
     *
     * If `renderHitCallback` is provided, the image (or the hit-detection version
     * of the image) will be rendered into a separate hit-detection atlas image.
     *
     * @param {string} id The identifier of the entry to add.
     * @param {number} width The width.
     * @param {number} height The height.
     * @param {function(CanvasRenderingContext2D, number, number)} renderCallback
     *    Called to render the new image onto an atlas image.
     * @param {function(CanvasRenderingContext2D, number, number)=} opt_renderHitCallback Called to render a hit-detection image onto a hit
     *    detection atlas image.
     * @param {Object=} opt_this Value to use as `this` when executing
     *    `renderCallback` and `renderHitCallback`.
     * @return {?module:ol/style/AtlasManager~AtlasManagerInfo}  The position and atlas image for the
     *    entry, or `null` if the image is too big.
     */

  }, {
    key: 'add',
    value: function add(id, width, height, renderCallback, opt_renderHitCallback, opt_this) {
      if (width + this.space_ > this.maxSize_ || height + this.space_ > this.maxSize_) {
        return null;
      }

      /** @type {?module:ol/style/Atlas~AtlasInfo} */
      var info = this.add_(false, id, width, height, renderCallback, opt_this);
      if (!info) {
        return null;
      }

      // even if no hit-detection entry is requested, we insert a fake entry into
      // the hit-detection atlas, to make sure that the offset is the same for
      // the original image and the hit-detection image.
      var renderHitCallback = opt_renderHitCallback !== undefined ? opt_renderHitCallback : _functions.VOID;

      var hitInfo = /** @type {module:ol/style/Atlas~AtlasInfo} */this.add_(true, id, width, height, renderHitCallback, opt_this);

      return this.mergeInfos_(info, hitInfo);
    }

    /**
     * @private
     * @param {boolean} isHitAtlas If the hit-detection atlases are used.
     * @param {string} id The identifier of the entry to add.
     * @param {number} width The width.
     * @param {number} height The height.
     * @param {function(CanvasRenderingContext2D, number, number)} renderCallback
     *    Called to render the new image onto an atlas image.
     * @param {Object=} opt_this Value to use as `this` when executing
     *    `renderCallback` and `renderHitCallback`.
     * @return {?module:ol/style/Atlas~AtlasInfo}  The position and atlas image for the entry,
     *    or `null` if the image is too big.
     */

  }, {
    key: 'add_',
    value: function add_(isHitAtlas, id, width, height, renderCallback, opt_this) {
      var atlases = isHitAtlas ? this.hitAtlases_ : this.atlases_;
      var atlas = void 0,
          info = void 0,
          i = void 0,
          ii = void 0;
      for (i = 0, ii = atlases.length; i < ii; ++i) {
        atlas = atlases[i];
        info = atlas.add(id, width, height, renderCallback, opt_this);
        if (info) {
          return info;
        } else if (!info && i === ii - 1) {
          // the entry could not be added to one of the existing atlases,
          // create a new atlas that is twice as big and try to add to this one.
          var size = void 0;
          if (isHitAtlas) {
            size = Math.min(this.currentHitSize_ * 2, this.maxSize_);
            this.currentHitSize_ = size;
          } else {
            size = Math.min(this.currentSize_ * 2, this.maxSize_);
            this.currentSize_ = size;
          }
          atlas = new _Atlas2.default(size, this.space_);
          atlases.push(atlas);
          // run the loop another time
          ++ii;
        }
      }
      return null;
    }
  }]);

  return AtlasManager;
}();

exports.default = AtlasManager;