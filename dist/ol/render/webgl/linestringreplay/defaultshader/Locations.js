'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('../../../../webgl.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @module ol/render/webgl/linestringreplay/defaultshader/Locations
                                                                                                                                                           */
// This file is automatically generated, do not edit
// Run `make shaders` to generate, and commit the result.

var Locations =

/**
 * @param {WebGLRenderingContext} gl GL.
 * @param {WebGLProgram} program Program.
 */
function Locations(gl, program) {
  _classCallCheck(this, Locations);

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_projectionMatrix = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_projectionMatrix' : 'h');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_offsetScaleMatrix = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_offsetScaleMatrix' : 'i');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_offsetRotateMatrix = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_offsetRotateMatrix' : 'j');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_lineWidth = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_lineWidth' : 'k');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_miterLimit = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_miterLimit' : 'l');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_opacity = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_opacity' : 'm');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_color = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_color' : 'n');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_size = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_size' : 'o');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_pixelRatio = gl.getUniformLocation(program, _webgl.DEBUG ? 'u_pixelRatio' : 'p');

  /**
   * @type {number}
   */
  this.a_lastPos = gl.getAttribLocation(program, _webgl.DEBUG ? 'a_lastPos' : 'd');

  /**
   * @type {number}
   */
  this.a_position = gl.getAttribLocation(program, _webgl.DEBUG ? 'a_position' : 'e');

  /**
   * @type {number}
   */
  this.a_nextPos = gl.getAttribLocation(program, _webgl.DEBUG ? 'a_nextPos' : 'f');

  /**
   * @type {number}
   */
  this.a_direction = gl.getAttribLocation(program, _webgl.DEBUG ? 'a_direction' : 'g');
};

exports.default = Locations;