"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/pointer/EventSource
 */

var EventSource = function () {

  /**
   * @param {module:ol/pointer/PointerEventHandler} dispatcher Event handler.
   * @param {!Object<string, function(Event)>} mapping Event mapping.
   */
  function EventSource(dispatcher, mapping) {
    _classCallCheck(this, EventSource);

    /**
     * @type {module:ol/pointer/PointerEventHandler}
     */
    this.dispatcher = dispatcher;

    /**
     * @private
     * @const
     * @type {!Object<string, function(Event)>}
     */
    this.mapping_ = mapping;
  }

  /**
   * List of events supported by this source.
   * @return {Array<string>} Event names
   */


  _createClass(EventSource, [{
    key: "getEvents",
    value: function getEvents() {
      return Object.keys(this.mapping_);
    }

    /**
     * Returns the handler that should handle a given event type.
     * @param {string} eventType The event type.
     * @return {function(Event)} Handler
     */

  }, {
    key: "getHandlerForEvent",
    value: function getHandlerForEvent(eventType) {
      return this.mapping_[eventType];
    }
  }]);

  return EventSource;
}();

exports.default = EventSource;