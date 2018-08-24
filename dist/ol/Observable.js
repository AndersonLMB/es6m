'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.unByKey = unByKey;

var _events = require('./events.js');

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Observable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 * {@link module:ol/Observable~Observable#changed}.
 *
 * @fires module:ol/events/Event~Event
 * @api
 */
var Observable = function (_EventTarget) {
  _inherits(Observable, _EventTarget);

  function Observable() {
    _classCallCheck(this, Observable);

    /**
     * @private
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (Observable.__proto__ || Object.getPrototypeOf(Observable)).call(this));

    _this.revision_ = 0;

    return _this;
  }

  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */


  _createClass(Observable, [{
    key: 'changed',
    value: function changed() {
      ++this.revision_;
      this.dispatchEvent(_EventType2.default.CHANGE);
    }

    /**
     * Get the version number for this object.  Each time the object is modified,
     * its version number will be incremented.
     * @return {number} Revision.
     * @api
     */

  }, {
    key: 'getRevision',
    value: function getRevision() {
      return this.revision_;
    }

    /**
     * Listen for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @return {module:ol/events~EventsKey|Array<module:ol/events~EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */

  }, {
    key: 'on',
    value: function on(type, listener) {
      if (Array.isArray(type)) {
        var len = type.length;
        var keys = new Array(len);
        for (var i = 0; i < len; ++i) {
          keys[i] = (0, _events.listen)(this, type[i], listener);
        }
        return keys;
      } else {
        return (0, _events.listen)(this, /** @type {string} */type, listener);
      }
    }

    /**
     * Listen once for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @return {module:ol/events~EventsKey|Array<module:ol/events~EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */

  }, {
    key: 'once',
    value: function once(type, listener) {
      if (Array.isArray(type)) {
        var len = type.length;
        var keys = new Array(len);
        for (var i = 0; i < len; ++i) {
          keys[i] = (0, _events.listenOnce)(this, type[i], listener);
        }
        return keys;
      } else {
        return (0, _events.listenOnce)(this, /** @type {string} */type, listener);
      }
    }

    /**
     * Unlisten for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @api
     */

  }, {
    key: 'un',
    value: function un(type, listener) {
      if (Array.isArray(type)) {
        for (var i = 0, ii = type.length; i < ii; ++i) {
          (0, _events.unlisten)(this, type[i], listener);
        }
        return;
      } else {
        (0, _events.unlisten)(this, /** @type {string} */type, listener);
      }
    }
  }]);

  return Observable;
}(_Target2.default);

/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * @param {module:ol/events~EventsKey|Array<module:ol/events~EventsKey>} key The key returned by `on()`
 *     or `once()` (or an array of keys).
 * @api
 */


function unByKey(key) {
  if (Array.isArray(key)) {
    for (var i = 0, ii = key.length; i < ii; ++i) {
      (0, _events.unlistenByKey)(key[i]);
    }
  } else {
    (0, _events.unlistenByKey)( /** @type {module:ol/events~EventsKey} */key);
  }
}

exports.default = Observable;