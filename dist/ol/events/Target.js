'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Disposable2 = require('../Disposable.js');

var _Disposable3 = _interopRequireDefault(_Disposable2);

var _events = require('../events.js');

var _functions = require('../functions.js');

var _Event = require('../events/Event.js');

var _Event2 = _interopRequireDefault(_Event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/events/Target
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {EventTarget|module:ol/events/Target} EventTargetLike
 */

/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 */
var Target = function (_Disposable) {
  _inherits(Target, _Disposable);

  function Target() {
    _classCallCheck(this, Target);

    /**
     * @private
     * @type {!Object<string, number>}
     */
    var _this = _possibleConstructorReturn(this, (Target.__proto__ || Object.getPrototypeOf(Target)).call(this));

    _this.pendingRemovals_ = {};

    /**
     * @private
     * @type {!Object<string, number>}
     */
    _this.dispatching_ = {};

    /**
     * @private
     * @type {!Object<string, Array<module:ol/events~ListenerFunction>>}
     */
    _this.listeners_ = {};

    return _this;
  }

  /**
   * @param {string} type Type.
   * @param {module:ol/events~ListenerFunction} listener Listener.
   */


  _createClass(Target, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      var listeners = this.listeners_[type];
      if (!listeners) {
        listeners = this.listeners_[type] = [];
      }
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
    }

    /**
     * Dispatches an event and calls all listeners listening for events
     * of this type. The event parameter can either be a string or an
     * Object with a `type` property.
     *
     * @param {{type: string,
     *     target: (module:ol/events/Target~EventTargetLike|undefined)}|
     *     module:ol/events/Event|string} event Event object.
     * @return {boolean|undefined} `false` if anyone called preventDefault on the
     *     event object or if any of the listeners returned false.
     * @function
     * @api
     */

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      var evt = typeof event === 'string' ? new _Event2.default(event) : event;
      var type = evt.type;
      evt.target = this;
      var listeners = this.listeners_[type];
      var propagate = void 0;
      if (listeners) {
        if (!(type in this.dispatching_)) {
          this.dispatching_[type] = 0;
          this.pendingRemovals_[type] = 0;
        }
        ++this.dispatching_[type];
        for (var i = 0, ii = listeners.length; i < ii; ++i) {
          if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
            propagate = false;
            break;
          }
        }
        --this.dispatching_[type];
        if (this.dispatching_[type] === 0) {
          var pendingRemovals = this.pendingRemovals_[type];
          delete this.pendingRemovals_[type];
          while (pendingRemovals--) {
            this.removeEventListener(type, _functions.VOID);
          }
          delete this.dispatching_[type];
        }
        return propagate;
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      (0, _events.unlistenAll)(this);
    }

    /**
     * Get the listeners for a specified event type. Listeners are returned in the
     * order that they will be called in.
     *
     * @param {string} type Type.
     * @return {Array<module:ol/events~ListenerFunction>} Listeners.
     */

  }, {
    key: 'getListeners',
    value: function getListeners(type) {
      return this.listeners_[type];
    }

    /**
     * @param {string=} opt_type Type. If not provided,
     *     `true` will be returned if this event target has any listeners.
     * @return {boolean} Has listeners.
     */

  }, {
    key: 'hasListener',
    value: function hasListener(opt_type) {
      return opt_type ? opt_type in this.listeners_ : Object.keys(this.listeners_).length > 0;
    }

    /**
     * @param {string} type Type.
     * @param {module:ol/events~ListenerFunction} listener Listener.
     */

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, listener) {
      var listeners = this.listeners_[type];
      if (listeners) {
        var index = listeners.indexOf(listener);
        if (type in this.pendingRemovals_) {
          // make listener a no-op, and remove later in #dispatchEvent()
          listeners[index] = _functions.VOID;
          ++this.pendingRemovals_[type];
        } else {
          listeners.splice(index, 1);
          if (listeners.length === 0) {
            delete this.listeners_[type];
          }
        }
      }
    }
  }]);

  return Target;
}(_Disposable3.default);

exports.default = Target;