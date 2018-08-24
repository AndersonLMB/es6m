'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _EventSource2 = require('../pointer/EventSource.js');

var _EventSource3 = _interopRequireDefault(_EventSource2);

var _MouseSource = require('../pointer/MouseSource.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/pointer/TouchSource
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
var CLICK_COUNT_TIMEOUT = 200;

/**
 * @type {string}
 */
var POINTER_TYPE = 'touch';

/**
 * Handler for `touchstart`, triggers `pointerover`,
 * `pointerenter` and `pointerdown` events.
 *
 * @this {module:ol/pointer/TouchSource}
 * @param {TouchEvent} inEvent The in event.
 */
function touchstart(inEvent) {
  this.vacuumTouches_(inEvent);
  this.setPrimaryTouch_(inEvent.changedTouches[0]);
  this.dedupSynthMouse_(inEvent);
  this.clickCount_++;
  this.processTouches_(inEvent, this.overDown_);
}

/**
 * Handler for `touchmove`.
 *
 * @this {module:ol/pointer/TouchSource}
 * @param {TouchEvent} inEvent The in event.
 */
function touchmove(inEvent) {
  this.processTouches_(inEvent, this.moveOverOut_);
}

/**
 * Handler for `touchend`, triggers `pointerup`,
 * `pointerout` and `pointerleave` events.
 *
 * @this {module:ol/pointer/TouchSource}
 * @param {TouchEvent} inEvent The event.
 */
function touchend(inEvent) {
  this.dedupSynthMouse_(inEvent);
  this.processTouches_(inEvent, this.upOut_);
}

/**
 * Handler for `touchcancel`, triggers `pointercancel`,
 * `pointerout` and `pointerleave` events.
 *
 * @this {module:ol/pointer/TouchSource}
 * @param {TouchEvent} inEvent The in event.
 */
function touchcancel(inEvent) {
  this.processTouches_(inEvent, this.cancelOut_);
}

var TouchSource = function (_EventSource) {
  _inherits(TouchSource, _EventSource);

  /**
   * @param {module:ol/pointer/PointerEventHandler} dispatcher The event handler.
   * @param {module:ol/pointer/MouseSource} mouseSource Mouse source.
   */
  function TouchSource(dispatcher, mouseSource) {
    _classCallCheck(this, TouchSource);

    var mapping = {
      'touchstart': touchstart,
      'touchmove': touchmove,
      'touchend': touchend,
      'touchcancel': touchcancel
    };

    /**
     * @const
     * @type {!Object<string, Event|Object>}
     */
    var _this = _possibleConstructorReturn(this, (TouchSource.__proto__ || Object.getPrototypeOf(TouchSource)).call(this, dispatcher, mapping));

    _this.pointerMap = dispatcher.pointerMap;

    /**
     * @const
     * @type {module:ol/pointer/MouseSource}
     */
    _this.mouseSource = mouseSource;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.firstTouchId_ = undefined;

    /**
     * @private
     * @type {number}
     */
    _this.clickCount_ = 0;

    /**
     * @private
     * @type {number|undefined}
     */
    _this.resetId_ = undefined;

    /**
     * Mouse event timeout: This should be long enough to
     * ignore compat mouse events made by touch.
     * @private
     * @type {number}
     */
    _this.dedupTimeout_ = 2500;
    return _this;
  }

  /**
   * @private
   * @param {Touch} inTouch The in touch.
   * @return {boolean} True, if this is the primary touch.
   */


  _createClass(TouchSource, [{
    key: 'isPrimaryTouch_',
    value: function isPrimaryTouch_(inTouch) {
      return this.firstTouchId_ === inTouch.identifier;
    }

    /**
     * Set primary touch if there are no pointers, or the only pointer is the mouse.
     * @param {Touch} inTouch The in touch.
     * @private
     */

  }, {
    key: 'setPrimaryTouch_',
    value: function setPrimaryTouch_(inTouch) {
      var count = Object.keys(this.pointerMap).length;
      if (count === 0 || count === 1 && _MouseSource.POINTER_ID.toString() in this.pointerMap) {
        this.firstTouchId_ = inTouch.identifier;
        this.cancelResetClickCount_();
      }
    }

    /**
     * @private
     * @param {PointerEvent} inPointer The in pointer object.
     */

  }, {
    key: 'removePrimaryPointer_',
    value: function removePrimaryPointer_(inPointer) {
      if (inPointer.isPrimary) {
        this.firstTouchId_ = undefined;
        this.resetClickCount_();
      }
    }

    /**
     * @private
     */

  }, {
    key: 'resetClickCount_',
    value: function resetClickCount_() {
      this.resetId_ = setTimeout(this.resetClickCountHandler_.bind(this), CLICK_COUNT_TIMEOUT);
    }

    /**
     * @private
     */

  }, {
    key: 'resetClickCountHandler_',
    value: function resetClickCountHandler_() {
      this.clickCount_ = 0;
      this.resetId_ = undefined;
    }

    /**
     * @private
     */

  }, {
    key: 'cancelResetClickCount_',
    value: function cancelResetClickCount_() {
      if (this.resetId_ !== undefined) {
        clearTimeout(this.resetId_);
      }
    }

    /**
     * @private
     * @param {TouchEvent} browserEvent Browser event
     * @param {Touch} inTouch Touch event
     * @return {PointerEvent} A pointer object.
     */

  }, {
    key: 'touchToPointer_',
    value: function touchToPointer_(browserEvent, inTouch) {
      var e = this.dispatcher.cloneEvent(browserEvent, inTouch);
      // Spec specifies that pointerId 1 is reserved for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      e.pointerId = inTouch.identifier + 2;
      // TODO: check if this is necessary?
      //e.target = findTarget(e);
      e.bubbles = true;
      e.cancelable = true;
      e.detail = this.clickCount_;
      e.button = 0;
      e.buttons = 1;
      e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
      e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
      e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
      e.isPrimary = this.isPrimaryTouch_(inTouch);
      e.pointerType = POINTER_TYPE;

      // make sure that the properties that are different for
      // each `Touch` object are not copied from the BrowserEvent object
      e.clientX = inTouch.clientX;
      e.clientY = inTouch.clientY;
      e.screenX = inTouch.screenX;
      e.screenY = inTouch.screenY;

      return e;
    }

    /**
     * @private
     * @param {TouchEvent} inEvent Touch event
     * @param {function(TouchEvent, PointerEvent)} inFunction In function.
     */

  }, {
    key: 'processTouches_',
    value: function processTouches_(inEvent, inFunction) {
      var touches = Array.prototype.slice.call(inEvent.changedTouches);
      var count = touches.length;
      function preventDefault() {
        inEvent.preventDefault();
      }
      for (var i = 0; i < count; ++i) {
        var pointer = this.touchToPointer_(inEvent, touches[i]);
        // forward touch preventDefaults
        pointer.preventDefault = preventDefault;
        inFunction.call(this, inEvent, pointer);
      }
    }

    /**
     * @private
     * @param {TouchList} touchList The touch list.
     * @param {number} searchId Search identifier.
     * @return {boolean} True, if the `Touch` with the given id is in the list.
     */

  }, {
    key: 'findTouch_',
    value: function findTouch_(touchList, searchId) {
      var l = touchList.length;
      for (var i = 0; i < l; i++) {
        var touch = touchList[i];
        if (touch.identifier === searchId) {
          return true;
        }
      }
      return false;
    }

    /**
     * In some instances, a touchstart can happen without a touchend. This
     * leaves the pointermap in a broken state.
     * Therefore, on every touchstart, we remove the touches that did not fire a
     * touchend event.
     * To keep state globally consistent, we fire a pointercancel for
     * this "abandoned" touch
     *
     * @private
     * @param {TouchEvent} inEvent The in event.
     */

  }, {
    key: 'vacuumTouches_',
    value: function vacuumTouches_(inEvent) {
      var touchList = inEvent.touches;
      // pointerMap.getCount() should be < touchList.length here,
      // as the touchstart has not been processed yet.
      var keys = Object.keys(this.pointerMap);
      var count = keys.length;
      if (count >= touchList.length) {
        var d = [];
        for (var i = 0; i < count; ++i) {
          var key = keys[i];
          var value = this.pointerMap[key];
          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (key != _MouseSource.POINTER_ID && !this.findTouch_(touchList, key - 2)) {
            d.push(value.out);
          }
        }
        for (var _i = 0; _i < d.length; ++_i) {
          this.cancelOut_(inEvent, d[_i]);
        }
      }
    }

    /**
     * @private
     * @param {TouchEvent} browserEvent The event.
     * @param {PointerEvent} inPointer The in pointer object.
     */

  }, {
    key: 'overDown_',
    value: function overDown_(browserEvent, inPointer) {
      this.pointerMap[inPointer.pointerId] = {
        target: inPointer.target,
        out: inPointer,
        outTarget: inPointer.target
      };
      this.dispatcher.over(inPointer, browserEvent);
      this.dispatcher.enter(inPointer, browserEvent);
      this.dispatcher.down(inPointer, browserEvent);
    }

    /**
     * @private
     * @param {TouchEvent} browserEvent The event.
     * @param {PointerEvent} inPointer The in pointer.
     */

  }, {
    key: 'moveOverOut_',
    value: function moveOverOut_(browserEvent, inPointer) {
      var event = inPointer;
      var pointer = this.pointerMap[event.pointerId];
      // a finger drifted off the screen, ignore it
      if (!pointer) {
        return;
      }
      var outEvent = pointer.out;
      var outTarget = pointer.outTarget;
      this.dispatcher.move(event, browserEvent);
      if (outEvent && outTarget !== event.target) {
        outEvent.relatedTarget = event.target;
        event.relatedTarget = outTarget;
        // recover from retargeting by shadow
        outEvent.target = outTarget;
        if (event.target) {
          this.dispatcher.leaveOut(outEvent, browserEvent);
          this.dispatcher.enterOver(event, browserEvent);
        } else {
          // clean up case when finger leaves the screen
          event.target = outTarget;
          event.relatedTarget = null;
          this.cancelOut_(browserEvent, event);
        }
      }
      pointer.out = event;
      pointer.outTarget = event.target;
    }

    /**
     * @private
     * @param {TouchEvent} browserEvent An event.
     * @param {PointerEvent} inPointer The inPointer object.
     */

  }, {
    key: 'upOut_',
    value: function upOut_(browserEvent, inPointer) {
      this.dispatcher.up(inPointer, browserEvent);
      this.dispatcher.out(inPointer, browserEvent);
      this.dispatcher.leave(inPointer, browserEvent);
      this.cleanUpPointer_(inPointer);
    }

    /**
     * @private
     * @param {TouchEvent} browserEvent The event.
     * @param {PointerEvent} inPointer The in pointer.
     */

  }, {
    key: 'cancelOut_',
    value: function cancelOut_(browserEvent, inPointer) {
      this.dispatcher.cancel(inPointer, browserEvent);
      this.dispatcher.out(inPointer, browserEvent);
      this.dispatcher.leave(inPointer, browserEvent);
      this.cleanUpPointer_(inPointer);
    }

    /**
     * @private
     * @param {PointerEvent} inPointer The inPointer object.
     */

  }, {
    key: 'cleanUpPointer_',
    value: function cleanUpPointer_(inPointer) {
      delete this.pointerMap[inPointer.pointerId];
      this.removePrimaryPointer_(inPointer);
    }

    /**
     * Prevent synth mouse events from creating pointer events.
     *
     * @private
     * @param {TouchEvent} inEvent The in event.
     */

  }, {
    key: 'dedupSynthMouse_',
    value: function dedupSynthMouse_(inEvent) {
      var lts = this.mouseSource.lastTouches;
      var t = inEvent.changedTouches[0];
      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch_(t)) {
        // remember x/y of last touch
        var lt = [t.clientX, t.clientY];
        lts.push(lt);

        setTimeout(function () {
          // remove touch after timeout
          (0, _array.remove)(lts, lt);
        }, this.dedupTimeout_);
      }
    }
  }]);

  return TouchSource;
}(_EventSource3.default);

exports.default = TouchSource;