'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../events.js');

var _Target = require('../events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _has = require('../has.js');

var _EventType = require('../pointer/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _MouseSource = require('../pointer/MouseSource.js');

var _MouseSource2 = _interopRequireDefault(_MouseSource);

var _MsSource = require('../pointer/MsSource.js');

var _MsSource2 = _interopRequireDefault(_MsSource);

var _NativeSource = require('../pointer/NativeSource.js');

var _NativeSource2 = _interopRequireDefault(_NativeSource);

var _PointerEvent = require('../pointer/PointerEvent.js');

var _PointerEvent2 = _interopRequireDefault(_PointerEvent);

var _TouchSource = require('../pointer/TouchSource.js');

var _TouchSource2 = _interopRequireDefault(_TouchSource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/pointer/PointerEventHandler
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
 * Properties to copy when cloning an event, with default values.
 * @type {Array<Array>}
 */
var CLONE_PROPS = [
// MouseEvent
['bubbles', false], ['cancelable', false], ['view', null], ['detail', null], ['screenX', 0], ['screenY', 0], ['clientX', 0], ['clientY', 0], ['ctrlKey', false], ['altKey', false], ['shiftKey', false], ['metaKey', false], ['button', 0], ['relatedTarget', null],
// DOM Level 3
['buttons', 0],
// PointerEvent
['pointerId', 0], ['width', 0], ['height', 0], ['pressure', 0], ['tiltX', 0], ['tiltY', 0], ['pointerType', ''], ['hwTimestamp', 0], ['isPrimary', false],
// event instance
['type', ''], ['target', null], ['currentTarget', null], ['which', 0]];

var PointerEventHandler = function (_EventTarget) {
  _inherits(PointerEventHandler, _EventTarget);

  /**
   * @param {Element|HTMLDocument} element Viewport element.
   */
  function PointerEventHandler(element) {
    _classCallCheck(this, PointerEventHandler);

    /**
     * @const
     * @private
     * @type {Element|HTMLDocument}
     */
    var _this = _possibleConstructorReturn(this, (PointerEventHandler.__proto__ || Object.getPrototypeOf(PointerEventHandler)).call(this));

    _this.element_ = element;

    /**
     * @const
     * @type {!Object<string, Event|Object>}
     */
    _this.pointerMap = {};

    /**
     * @type {Object<string, function(Event)>}
     * @private
     */
    _this.eventMap_ = {};

    /**
     * @type {Array<module:ol/pointer/EventSource>}
     * @private
     */
    _this.eventSourceList_ = [];

    _this.registerSources();
    return _this;
  }

  /**
   * Set up the event sources (mouse, touch and native pointers)
   * that generate pointer events.
   */


  _createClass(PointerEventHandler, [{
    key: 'registerSources',
    value: function registerSources() {
      if (_has.POINTER) {
        this.registerSource('native', new _NativeSource2.default(this));
      } else if (_has.MSPOINTER) {
        this.registerSource('ms', new _MsSource2.default(this));
      } else {
        var mouseSource = new _MouseSource2.default(this);
        this.registerSource('mouse', mouseSource);

        if (_has.TOUCH) {
          this.registerSource('touch', new _TouchSource2.default(this, mouseSource));
        }
      }

      // register events on the viewport element
      this.register_();
    }

    /**
     * Add a new event source that will generate pointer events.
     *
     * @param {string} name A name for the event source
     * @param {module:ol/pointer/EventSource} source The source event.
     */

  }, {
    key: 'registerSource',
    value: function registerSource(name, source) {
      var s = source;
      var newEvents = s.getEvents();

      if (newEvents) {
        newEvents.forEach(function (e) {
          var handler = s.getHandlerForEvent(e);

          if (handler) {
            this.eventMap_[e] = handler.bind(s);
          }
        }.bind(this));
        this.eventSourceList_.push(s);
      }
    }

    /**
     * Set up the events for all registered event sources.
     * @private
     */

  }, {
    key: 'register_',
    value: function register_() {
      var l = this.eventSourceList_.length;
      for (var i = 0; i < l; i++) {
        var eventSource = this.eventSourceList_[i];
        this.addEvents_(eventSource.getEvents());
      }
    }

    /**
     * Remove all registered events.
     * @private
     */

  }, {
    key: 'unregister_',
    value: function unregister_() {
      var l = this.eventSourceList_.length;
      for (var i = 0; i < l; i++) {
        var eventSource = this.eventSourceList_[i];
        this.removeEvents_(eventSource.getEvents());
      }
    }

    /**
     * Calls the right handler for a new event.
     * @private
     * @param {Event} inEvent Browser event.
     */

  }, {
    key: 'eventHandler_',
    value: function eventHandler_(inEvent) {
      var type = inEvent.type;
      var handler = this.eventMap_[type];
      if (handler) {
        handler(inEvent);
      }
    }

    /**
     * Setup listeners for the given events.
     * @private
     * @param {Array<string>} events List of events.
     */

  }, {
    key: 'addEvents_',
    value: function addEvents_(events) {
      events.forEach(function (eventName) {
        (0, _events.listen)(this.element_, eventName, this.eventHandler_, this);
      }.bind(this));
    }

    /**
     * Unregister listeners for the given events.
     * @private
     * @param {Array<string>} events List of events.
     */

  }, {
    key: 'removeEvents_',
    value: function removeEvents_(events) {
      events.forEach(function (e) {
        (0, _events.unlisten)(this.element_, e, this.eventHandler_, this);
      }.bind(this));
    }

    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} event Browser event.
     * @param {Event|Touch} inEvent An event that contains
     *    properties to copy.
     * @return {Object} An object containing shallow copies of
     *    `inEvent`'s properties.
     */

  }, {
    key: 'cloneEvent',
    value: function cloneEvent(event, inEvent) {
      var eventCopy = {};
      for (var i = 0, ii = CLONE_PROPS.length; i < ii; i++) {
        var p = CLONE_PROPS[i][0];
        eventCopy[p] = event[p] || inEvent[p] || CLONE_PROPS[i][1];
      }

      return eventCopy;
    }

    // EVENTS


    /**
     * Triggers a 'pointerdown' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'down',
    value: function down(data, event) {
      this.fireEvent(_EventType2.default.POINTERDOWN, data, event);
    }

    /**
     * Triggers a 'pointermove' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'move',
    value: function move(data, event) {
      this.fireEvent(_EventType2.default.POINTERMOVE, data, event);
    }

    /**
     * Triggers a 'pointerup' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'up',
    value: function up(data, event) {
      this.fireEvent(_EventType2.default.POINTERUP, data, event);
    }

    /**
     * Triggers a 'pointerenter' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'enter',
    value: function enter(data, event) {
      data.bubbles = false;
      this.fireEvent(_EventType2.default.POINTERENTER, data, event);
    }

    /**
     * Triggers a 'pointerleave' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'leave',
    value: function leave(data, event) {
      data.bubbles = false;
      this.fireEvent(_EventType2.default.POINTERLEAVE, data, event);
    }

    /**
     * Triggers a 'pointerover' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'over',
    value: function over(data, event) {
      data.bubbles = true;
      this.fireEvent(_EventType2.default.POINTEROVER, data, event);
    }

    /**
     * Triggers a 'pointerout' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'out',
    value: function out(data, event) {
      data.bubbles = true;
      this.fireEvent(_EventType2.default.POINTEROUT, data, event);
    }

    /**
     * Triggers a 'pointercancel' event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'cancel',
    value: function cancel(data, event) {
      this.fireEvent(_EventType2.default.POINTERCANCEL, data, event);
    }

    /**
     * Triggers a combination of 'pointerout' and 'pointerleave' events.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'leaveOut',
    value: function leaveOut(data, event) {
      this.out(data, event);
      if (!this.contains_(data.target, data.relatedTarget)) {
        this.leave(data, event);
      }
    }

    /**
     * Triggers a combination of 'pointerover' and 'pointerevents' events.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'enterOver',
    value: function enterOver(data, event) {
      this.over(data, event);
      if (!this.contains_(data.target, data.relatedTarget)) {
        this.enter(data, event);
      }
    }

    /**
     * @private
     * @param {Element} container The container element.
     * @param {Element} contained The contained element.
     * @return {boolean} Returns true if the container element
     *   contains the other element.
     */

  }, {
    key: 'contains_',
    value: function contains_(container, contained) {
      if (!container || !contained) {
        return false;
      }
      return container.contains(contained);
    }

    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `data`.
     *
     * @param {string} inType A string representing the type of event to create.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     * @return {module:ol/pointer/PointerEvent} A PointerEvent of type `inType`.
     */

  }, {
    key: 'makeEvent',
    value: function makeEvent(inType, data, event) {
      return new _PointerEvent2.default(inType, event, data);
    }

    /**
     * Make and dispatch an event in one call.
     * @param {string} inType A string representing the type of event.
     * @param {Object} data Pointer event data.
     * @param {Event} event The event.
     */

  }, {
    key: 'fireEvent',
    value: function fireEvent(inType, data, event) {
      var e = this.makeEvent(inType, data, event);
      this.dispatchEvent(e);
    }

    /**
     * Creates a pointer event from a native pointer event
     * and dispatches this event.
     * @param {Event} event A platform event with a target.
     */

  }, {
    key: 'fireNativeEvent',
    value: function fireNativeEvent(event) {
      var e = this.makeEvent(event.type, event, event);
      this.dispatchEvent(e);
    }

    /**
     * Wrap a native mouse event into a pointer event.
     * This proxy method is required for the legacy IE support.
     * @param {string} eventType The pointer event type.
     * @param {Event} event The event.
     * @return {module:ol/pointer/PointerEvent} The wrapped event.
     */

  }, {
    key: 'wrapMouseEvent',
    value: function wrapMouseEvent(eventType, event) {
      var pointerEvent = this.makeEvent(eventType, _MouseSource2.default.prepareEvent(event, this), event);
      return pointerEvent;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.unregister_();
      _Target2.default.prototype.disposeInternal.call(this);
    }
  }]);

  return PointerEventHandler;
}(_Target2.default);

exports.default = PointerEventHandler;