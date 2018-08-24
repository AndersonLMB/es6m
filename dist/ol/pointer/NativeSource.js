'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventSource2 = require('../pointer/EventSource.js');

var _EventSource3 = _interopRequireDefault(_EventSource2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/pointer/NativeSource
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Based on https://github.com/Polymer/PointerEvents

// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
// * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * Handler for `pointerdown`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerDown(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `pointermove`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerMove(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `pointerup`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerUp(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `pointerout`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerOut(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `pointerover`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerOver(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `pointercancel`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function pointerCancel(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `lostpointercapture`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function lostPointerCapture(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

/**
 * Handler for `gotpointercapture`.
 *
 * @this {module:ol/pointer/NativeSource}
 * @param {Event} inEvent The in event.
 */
function gotPointerCapture(inEvent) {
  this.dispatcher.fireNativeEvent(inEvent);
}

var NativeSource = function (_EventSource) {
  _inherits(NativeSource, _EventSource);

  /**
   * @param {module:ol/pointer/PointerEventHandler} dispatcher Event handler.
   */
  function NativeSource(dispatcher) {
    _classCallCheck(this, NativeSource);

    var mapping = {
      'pointerdown': pointerDown,
      'pointermove': pointerMove,
      'pointerup': pointerUp,
      'pointerout': pointerOut,
      'pointerover': pointerOver,
      'pointercancel': pointerCancel,
      'gotpointercapture': gotPointerCapture,
      'lostpointercapture': lostPointerCapture
    };
    return _possibleConstructorReturn(this, (NativeSource.__proto__ || Object.getPrototypeOf(NativeSource)).call(this, dispatcher, mapping));
  }

  return NativeSource;
}(_EventSource3.default);

exports.default = NativeSource;