'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/style/Atlas
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _dom = require('../dom.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} AtlasBlock
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * Provides information for an image inside an atlas.
 * `offsetX` and `offsetY` are the position of the image inside the atlas image `image`.
 * @typedef {Object} AtlasInfo
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {HTMLCanvasElement} image
 */

/**
 * @classesc
 * This class facilitates the creation of image atlases.
 *
 * Images added to an atlas will be rendered onto a single
 * atlas canvas. The distribution of images on the canvas is
 * managed with the bin packing algorithm described in:
 * http://www.blackpawn.com/texts/lightmaps/
 *
 * @param {number} size The size in pixels of the sprite image.
 * @param {number} space The space in pixels between images.
 *    Because texture coordinates are float values, the edges of
 *    images might not be completely correct (in a way that the
 *    edges overlap when being rendered). To avoid this we add a
 *    padding around each image.
 */
var Atlas = function () {

  /**
   * @param {number} size The size in pixels of the sprite image.
   * @param {number} space The space in pixels between images.
   *    Because texture coordinates are float values, the edges of
   *    images might not be completely correct (in a way that the
   *    edges overlap when being rendered). To avoid this we add a
   *    padding around each image.
   */
  function Atlas(size, space) {
    _classCallCheck(this, Atlas);

    /**
     * @private
     * @type {number}
     */
    this.space_ = space;

    /**
     * @private
     * @type {Array<module:ol/style/Atlas~AtlasBlock>}
     */
    this.emptyBlocks_ = [{ x: 0, y: 0, width: size, height: size }];

    /**
     * @private
     * @type {Object<string, module:ol/style/Atlas~AtlasInfo>}
     */
    this.entries_ = {};

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.context_ = (0, _dom.createCanvasContext2D)(size, size);

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = this.context_.canvas;
  }

  /**
   * @param {string} id The identifier of the entry to check.
   * @return {?module:ol/style/Atlas~AtlasInfo} The atlas info.
   */


  _createClass(Atlas, [{
    key: 'get',
    value: function get(id) {
      return this.entries_[id] || null;
    }

    /**
     * @param {string} id The identifier of the entry to add.
     * @param {number} width The width.
     * @param {number} height The height.
     * @param {function(CanvasRenderingContext2D, number, number)} renderCallback
     *    Called to render the new image onto an atlas image.
     * @param {Object=} opt_this Value to use as `this` when executing
     *    `renderCallback`.
     * @return {?module:ol/style/Atlas~AtlasInfo} The position and atlas image for the entry.
     */

  }, {
    key: 'add',
    value: function add(id, width, height, renderCallback, opt_this) {
      for (var i = 0, ii = this.emptyBlocks_.length; i < ii; ++i) {
        var block = this.emptyBlocks_[i];
        if (block.width >= width + this.space_ && block.height >= height + this.space_) {
          // we found a block that is big enough for our entry
          var entry = {
            offsetX: block.x + this.space_,
            offsetY: block.y + this.space_,
            image: this.canvas_
          };
          this.entries_[id] = entry;

          // render the image on the atlas image
          renderCallback.call(opt_this, this.context_, block.x + this.space_, block.y + this.space_);

          // split the block after the insertion, either horizontally or vertically
          this.split_(i, block, width + this.space_, height + this.space_);

          return entry;
        }
      }

      // there is no space for the new entry in this atlas
      return null;
    }

    /**
     * @private
     * @param {number} index The index of the block.
     * @param {module:ol/style/Atlas~AtlasBlock} block The block to split.
     * @param {number} width The width of the entry to insert.
     * @param {number} height The height of the entry to insert.
     */

  }, {
    key: 'split_',
    value: function split_(index, block, width, height) {
      var deltaWidth = block.width - width;
      var deltaHeight = block.height - height;

      /** @type {module:ol/style/Atlas~AtlasBlock} */
      var newBlock1 = void 0;
      /** @type {module:ol/style/Atlas~AtlasBlock} */
      var newBlock2 = void 0;

      if (deltaWidth > deltaHeight) {
        // split vertically
        // block right of the inserted entry
        newBlock1 = {
          x: block.x + width,
          y: block.y,
          width: block.width - width,
          height: block.height
        };

        // block below the inserted entry
        newBlock2 = {
          x: block.x,
          y: block.y + height,
          width: width,
          height: block.height - height
        };
        this.updateBlocks_(index, newBlock1, newBlock2);
      } else {
        // split horizontally
        // block right of the inserted entry
        newBlock1 = {
          x: block.x + width,
          y: block.y,
          width: block.width - width,
          height: height
        };

        // block below the inserted entry
        newBlock2 = {
          x: block.x,
          y: block.y + height,
          width: block.width,
          height: block.height - height
        };
        this.updateBlocks_(index, newBlock1, newBlock2);
      }
    }

    /**
     * Remove the old block and insert new blocks at the same array position.
     * The new blocks are inserted at the same position, so that splitted
     * blocks (that are potentially smaller) are filled first.
     * @private
     * @param {number} index The index of the block to remove.
     * @param {module:ol/style/Atlas~AtlasBlock} newBlock1 The 1st block to add.
     * @param {module:ol/style/Atlas~AtlasBlock} newBlock2 The 2nd block to add.
     */

  }, {
    key: 'updateBlocks_',
    value: function updateBlocks_(index, newBlock1, newBlock2) {
      var args = [index, 1];
      if (newBlock1.width > 0 && newBlock1.height > 0) {
        args.push(newBlock1);
      }
      if (newBlock2.width > 0 && newBlock2.height > 0) {
        args.push(newBlock2);
      }
      this.emptyBlocks_.splice.apply(this.emptyBlocks_, args);
    }
  }]);

  return Atlas;
}();

exports.default = Atlas;