'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shared = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/style/IconImageCache
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _color = require('../color.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc
 * Singleton class. Available through {@link module:ol/style/IconImageCache~shared}.
 */
var IconImageCache = function () {
  function IconImageCache() {
    _classCallCheck(this, IconImageCache);

    /**
    * @type {!Object<string, module:ol/style/IconImage>}
    * @private
    */
    this.cache_ = {};

    /**
    * @type {number}
    * @private
    */
    this.cacheSize_ = 0;

    /**
    * @type {number}
    * @private
    */
    this.maxCacheSize_ = 32;
  }

  /**
  * FIXME empty description for jsdoc
  */


  _createClass(IconImageCache, [{
    key: 'clear',
    value: function clear() {
      this.cache_ = {};
      this.cacheSize_ = 0;
    }

    /**
    * FIXME empty description for jsdoc
    */

  }, {
    key: 'expire',
    value: function expire() {
      if (this.cacheSize_ > this.maxCacheSize_) {
        var i = 0;
        for (var key in this.cache_) {
          var iconImage = this.cache_[key];
          if ((i++ & 3) === 0 && !iconImage.hasListener()) {
            delete this.cache_[key];
            --this.cacheSize_;
          }
        }
      }
    }

    /**
    * @param {string} src Src.
    * @param {?string} crossOrigin Cross origin.
    * @param {module:ol/color~Color} color Color.
    * @return {module:ol/style/IconImage} Icon image.
    */

  }, {
    key: 'get',
    value: function get(src, crossOrigin, color) {
      var key = getKey(src, crossOrigin, color);
      return key in this.cache_ ? this.cache_[key] : null;
    }

    /**
    * @param {string} src Src.
    * @param {?string} crossOrigin Cross origin.
    * @param {module:ol/color~Color} color Color.
    * @param {module:ol/style/IconImage} iconImage Icon image.
    */

  }, {
    key: 'set',
    value: function set(src, crossOrigin, color, iconImage) {
      var key = getKey(src, crossOrigin, color);
      this.cache_[key] = iconImage;
      ++this.cacheSize_;
    }

    /**
    * Set the cache size of the icon cache. Default is `32`. Change this value when
    * your map uses more than 32 different icon images and you are not caching icon
    * styles on the application level.
    * @param {number} maxCacheSize Cache max size.
    * @api
    */

  }, {
    key: 'setSize',
    value: function setSize(maxCacheSize) {
      this.maxCacheSize_ = maxCacheSize;
      this.expire();
    }
  }]);

  return IconImageCache;
}();

/**
 * @param {string} src Src.
 * @param {?string} crossOrigin Cross origin.
 * @param {module:ol/color~Color} color Color.
 * @return {string} Cache key.
 */


function getKey(src, crossOrigin, color) {
  var colorString = color ? (0, _color.asString)(color) : 'null';
  return crossOrigin + ':' + src + ':' + colorString;
}

exports.default = IconImageCache;

/**
 * The {@link module:ol/style/IconImageCache~IconImageCache} for
 * {@link module:ol/style/Icon~Icon} images.
 * @api
 */

var shared = exports.shared = new IconImageCache();