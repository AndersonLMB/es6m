'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vertex = exports.fragment = undefined;

var _webgl = require('../../../webgl.js');

var _Fragment = require('../../../webgl/Fragment.js');

var _Fragment2 = _interopRequireDefault(_Fragment);

var _Vertex = require('../../../webgl/Vertex.js');

var _Vertex2 = _interopRequireDefault(_Vertex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fragment = exports.fragment = new _Fragment2.default(_webgl.DEBUG ? 'precision mediump float;\n\n\n\nuniform vec4 u_color;\nuniform float u_opacity;\n\nvoid main(void) {\n  gl_FragColor = u_color;\n  float alpha = u_color.a * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n' : 'precision mediump float;uniform vec4 e;uniform float f;void main(void){gl_FragColor=e;float alpha=e.a*f;if(alpha==0.0){discard;}gl_FragColor.a=alpha;}'); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @module ol/render/webgl/polygonreplay/defaultshader
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
// This file is automatically generated, do not edit.
// Run `make shaders` to generate, and commit the result.

var vertex = exports.vertex = new _Vertex2.default(_webgl.DEBUG ? '\n\nattribute vec2 a_position;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\n\nvoid main(void) {\n  gl_Position = u_projectionMatrix * vec4(a_position, 0.0, 1.0);\n}\n\n\n' : 'attribute vec2 a;uniform mat4 b;uniform mat4 c;uniform mat4 d;void main(void){gl_Position=b*vec4(a,0.0,1.0);}');