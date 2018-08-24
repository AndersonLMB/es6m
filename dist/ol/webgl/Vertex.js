'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webgl = require('../webgl.js');

var _Shader = require('../webgl/Shader.js');

var _Shader2 = _interopRequireDefault(_Shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/webgl/Vertex
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var WebGLVertex = function (_WebGLShader) {
  _inherits(WebGLVertex, _WebGLShader);

  /**
   * @param {string} source Source.
   */
  function WebGLVertex(source) {
    _classCallCheck(this, WebGLVertex);

    return _possibleConstructorReturn(this, (WebGLVertex.__proto__ || Object.getPrototypeOf(WebGLVertex)).call(this, source));
  }

  /**
   * @inheritDoc
   */


  _createClass(WebGLVertex, [{
    key: 'getType',
    value: function getType() {
      return _webgl.VERTEX_SHADER;
    }
  }]);

  return WebGLVertex;
}(_Shader2.default);

exports.default = WebGLVertex;