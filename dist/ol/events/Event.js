"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.stopPropagation = stopPropagation;
exports.preventDefault = preventDefault;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/events/Event
 */

/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link module:ol/events/Target~Target}.
 */
var Event = function () {

  /**
   * @param {string} type Type.
   */
  function Event(type) {
    _classCallCheck(this, Event);

    /**
     * @type {boolean}
     */
    this.propagationStopped;

    /**
     * The event type.
     * @type {string}
     * @api
     */
    this.type = type;

    /**
     * The event target.
     * @type {Object}
     * @api
     */
    this.target = null;
  }

  /**
   * Stop event propagation.
   * @function
   * @api
   */


  _createClass(Event, [{
    key: "preventDefault",
    value: function preventDefault() {
      this.propagationStopped = true;
    }

    /**
     * Stop event propagation.
     * @function
     * @api
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
  }]);

  return Event;
}();

/**
 * @param {Event|module:ol/events/Event} evt Event
 */


function stopPropagation(evt) {
  evt.stopPropagation();
}

/**
 * @param {Event|module:ol/events/Event} evt Event
 */
function preventDefault(evt) {
  evt.preventDefault();
}

exports.default = Event;