'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventSource2 = require('../pointer/EventSource.js');

var _EventSource3 = _interopRequireDefault(_EventSource2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/pointer/MsSource
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
 * @const
 * @type {Array<string>}
 */
var POINTER_TYPES = ['', 'unavailable', 'touch', 'pen', 'mouse'];

/**
 * Handler for `msPointerDown`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerDown(inEvent) {
  this.pointerMap[inEvent.pointerId.toString()] = inEvent;
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.down(e, inEvent);
}

/**
 * Handler for `msPointerMove`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerMove(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.move(e, inEvent);
}

/**
 * Handler for `msPointerUp`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerUp(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.up(e, inEvent);
  this.cleanup(inEvent.pointerId);
}

/**
 * Handler for `msPointerOut`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerOut(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.leaveOut(e, inEvent);
}

/**
 * Handler for `msPointerOver`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerOver(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.enterOver(e, inEvent);
}

/**
 * Handler for `msPointerCancel`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msPointerCancel(inEvent) {
  var e = this.prepareEvent_(inEvent);
  this.dispatcher.cancel(e, inEvent);
  this.cleanup(inEvent.pointerId);
}

/**
 * Handler for `msLostPointerCapture`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msLostPointerCapture(inEvent) {
  var e = this.dispatcher.makeEvent('lostpointercapture', inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
}

/**
 * Handler for `msGotPointerCapture`.
 *
 * @this {module:ol/pointer/MsSource}
 * @param {MSPointerEvent} inEvent The in event.
 */
function msGotPointerCapture(inEvent) {
  var e = this.dispatcher.makeEvent('gotpointercapture', inEvent, inEvent);
  this.dispatcher.dispatchEvent(e);
}

var MsSource = function (_EventSource) {
  _inherits(MsSource, _EventSource);

  /**
   * @param {module:ol/pointer/PointerEventHandler} dispatcher Event handler.
   */
  function MsSource(dispatcher) {
    _classCallCheck(this, MsSource);

    var mapping = {
      'MSPointerDown': msPointerDown,
      'MSPointerMove': msPointerMove,
      'MSPointerUp': msPointerUp,
      'MSPointerOut': msPointerOut,
      'MSPointerOver': msPointerOver,
      'MSPointerCancel': msPointerCancel,
      'MSGotPointerCapture': msGotPointerCapture,
      'MSLostPointerCapture': msLostPointerCapture
    };

    /**
     * @const
     * @type {!Object<string, MSPointerEvent|Object>}
     */
    var _this = _possibleConstructorReturn(this, (MsSource.__proto__ || Object.getPrototypeOf(MsSource)).call(this, dispatcher, mapping));

    _this.pointerMap = dispatcher.pointerMap;
    return _this;
  }

  /**
   * Creates a copy of the original event that will be used
   * for the fake pointer event.
   *
   * @private
   * @param {MSPointerEvent} inEvent The in event.
   * @return {Object} The copied event.
   */


  _createClass(MsSource, [{
    key: 'prepareEvent_',
    value: function prepareEvent_(inEvent) {
      var e = inEvent;
      if (typeof inEvent.pointerType === 'number') {
        e = this.dispatcher.cloneEvent(inEvent, inEvent);
        e.pointerType = POINTER_TYPES[inEvent.pointerType];
      }

      return e;
    }

    /**
     * Remove this pointer from the list of active pointers.
     * @param {number} pointerId Pointer identifier.
     */

  }, {
    key: 'cleanup',
    value: function cleanup(pointerId) {
      delete this.pointerMap[pointerId.toString()];
    }
  }]);

  return MsSource;
}(_EventSource3.default);

exports.default = MsSource;