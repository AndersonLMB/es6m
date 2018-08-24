'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POINTER_TYPE = exports.POINTER_ID = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventSource2 = require('../pointer/EventSource.js');

var _EventSource3 = _interopRequireDefault(_EventSource2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/pointer/MouseSource
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
 * @type {number}
 */
var POINTER_ID = exports.POINTER_ID = 1;

/**
 * @type {string}
 */
var POINTER_TYPE = exports.POINTER_TYPE = 'mouse';

/**
 * Radius around touchend that swallows mouse events.
 *
 * @type {number}
 */
var DEDUP_DIST = 25;

/**
 * Handler for `mousedown`.
 *
 * @this {module:ol/pointer/MouseSource}
 * @param {MouseEvent} inEvent The in event.
 */
function mousedown(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    // TODO(dfreedman) workaround for some elements not sending mouseup
    // http://crbug/149091
    if (POINTER_ID.toString() in this.pointerMap) {
      this.cancel(inEvent);
    }
    var e = prepareEvent(inEvent, this.dispatcher);
    this.pointerMap[POINTER_ID.toString()] = inEvent;
    this.dispatcher.down(e, inEvent);
  }
}

/**
 * Handler for `mousemove`.
 *
 * @this {module:ol/pointer/MouseSource}
 * @param {MouseEvent} inEvent The in event.
 */
function mousemove(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.move(e, inEvent);
  }
}

/**
 * Handler for `mouseup`.
 *
 * @this {module:ol/pointer/MouseSource}
 * @param {MouseEvent} inEvent The in event.
 */
function mouseup(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var p = this.pointerMap[POINTER_ID.toString()];

    if (p && p.button === inEvent.button) {
      var e = prepareEvent(inEvent, this.dispatcher);
      this.dispatcher.up(e, inEvent);
      this.cleanupMouse();
    }
  }
}

/**
 * Handler for `mouseover`.
 *
 * @this {module:ol/pointer/MouseSource}
 * @param {MouseEvent} inEvent The in event.
 */
function mouseover(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.enterOver(e, inEvent);
  }
}

/**
 * Handler for `mouseout`.
 *
 * @this {module:ol/pointer/MouseSource}
 * @param {MouseEvent} inEvent The in event.
 */
function mouseout(inEvent) {
  if (!this.isEventSimulatedFromTouch_(inEvent)) {
    var e = prepareEvent(inEvent, this.dispatcher);
    this.dispatcher.leaveOut(e, inEvent);
  }
}

var MouseSource = function (_EventSource) {
  _inherits(MouseSource, _EventSource);

  /**
   * @param {module:ol/pointer/PointerEventHandler} dispatcher Event handler.
   */
  function MouseSource(dispatcher) {
    _classCallCheck(this, MouseSource);

    var mapping = {
      'mousedown': mousedown,
      'mousemove': mousemove,
      'mouseup': mouseup,
      'mouseover': mouseover,
      'mouseout': mouseout
    };

    /**
     * @const
     * @type {!Object<string, Event|Object>}
     */
    var _this = _possibleConstructorReturn(this, (MouseSource.__proto__ || Object.getPrototypeOf(MouseSource)).call(this, dispatcher, mapping));

    _this.pointerMap = dispatcher.pointerMap;

    /**
     * @const
     * @type {Array<module:ol/pixel~Pixel>}
     */
    _this.lastTouches = [];
    return _this;
  }

  /**
   * Detect if a mouse event was simulated from a touch by
   * checking if previously there was a touch event at the
   * same position.
   *
   * FIXME - Known problem with the native Android browser on
   * Samsung GT-I9100 (Android 4.1.2):
   * In case the page is scrolled, this function does not work
   * correctly when a canvas is used (WebGL or canvas renderer).
   * Mouse listeners on canvas elements (for this browser), create
   * two mouse events: One 'good' and one 'bad' one (on other browsers or
   * when a div is used, there is only one event). For the 'bad' one,
   * clientX/clientY and also pageX/pageY are wrong when the page
   * is scrolled. Because of that, this function can not detect if
   * the events were simulated from a touch event. As result, a
   * pointer event at a wrong position is dispatched, which confuses
   * the map interactions.
   * It is unclear, how one can get the correct position for the event
   * or detect that the positions are invalid.
   *
   * @private
   * @param {MouseEvent} inEvent The in event.
   * @return {boolean} True, if the event was generated by a touch.
   */


  _createClass(MouseSource, [{
    key: 'isEventSimulatedFromTouch_',
    value: function isEventSimulatedFromTouch_(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX;
      var y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t[0]);
        var dy = Math.abs(y - t[1]);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
      return false;
    }

    /**
     * Dispatches a `pointercancel` event.
     *
     * @param {Event} inEvent The in event.
     */

  }, {
    key: 'cancel',
    value: function cancel(inEvent) {
      var e = prepareEvent(inEvent, this.dispatcher);
      this.dispatcher.cancel(e, inEvent);
      this.cleanupMouse();
    }

    /**
     * Remove the mouse from the list of active pointers.
     */

  }, {
    key: 'cleanupMouse',
    value: function cleanupMouse() {
      delete this.pointerMap[POINTER_ID.toString()];
    }
  }]);

  return MouseSource;
}(_EventSource3.default);

/**
 * Creates a copy of the original event that will be used
 * for the fake pointer event.
 *
 * @param {Event} inEvent The in event.
 * @param {module:ol/pointer/PointerEventHandler} dispatcher Event handler.
 * @return {Object} The copied event.
 */


function prepareEvent(inEvent, dispatcher) {
  var e = dispatcher.cloneEvent(inEvent, inEvent);

  // forward mouse preventDefault
  var pd = e.preventDefault;
  e.preventDefault = function () {
    inEvent.preventDefault();
    pd();
  };

  e.pointerId = POINTER_ID;
  e.isPrimary = true;
  e.pointerType = POINTER_TYPE;

  return e;
}

exports.default = MouseSource;