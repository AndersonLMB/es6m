'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/webgl/Shader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _functions = require('../functions.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @abstract
 */
var WebGLShader = function () {

  /**
   * @param {string} source Source.
   */
  function WebGLShader(source) {
    _classCallCheck(this, WebGLShader);

    /**
     * @private
     * @type {string}
     */
    this.source_ = source;
  }

  /**
   * @abstract
   * @return {number} Type.
   */


  _createClass(WebGLShader, [{
    key: 'getType',
    value: function getType() {}

    /**
     * @return {string} Source.
     */

  }, {
    key: 'getSource',
    value: function getSource() {
      return this.source_;
    }
  }]);

  return WebGLShader;
}();

/**
 * @return {boolean} Is animated?
 */


WebGLShader.prototype.isAnimated = _functions.FALSE;
exports.default = WebGLShader;