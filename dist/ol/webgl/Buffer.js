'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/webgl/Buffer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _webgl = require('../webgl.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @enum {number}
 */
var BufferUsage = {
  STATIC_DRAW: _webgl.STATIC_DRAW,
  STREAM_DRAW: _webgl.STREAM_DRAW,
  DYNAMIC_DRAW: _webgl.DYNAMIC_DRAW
};

var WebGLBuffer = function () {

  /**
   * @param {Array<number>=} opt_arr Array.
   * @param {number=} opt_usage Usage.
   */
  function WebGLBuffer(opt_arr, opt_usage) {
    _classCallCheck(this, WebGLBuffer);

    /**
     * @private
     * @type {Array<number>}
     */
    this.arr_ = opt_arr !== undefined ? opt_arr : [];

    /**
     * @private
     * @type {number}
     */
    this.usage_ = opt_usage !== undefined ? opt_usage : BufferUsage.STATIC_DRAW;
  }

  /**
   * @return {Array<number>} Array.
   */


  _createClass(WebGLBuffer, [{
    key: 'getArray',
    value: function getArray() {
      return this.arr_;
    }

    /**
     * @return {number} Usage.
     */

  }, {
    key: 'getUsage',
    value: function getUsage() {
      return this.usage_;
    }
  }]);

  return WebGLBuffer;
}();

exports.default = WebGLBuffer;