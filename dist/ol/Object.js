'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getChangeEventType = getChangeEventType;

var _util = require('./util.js');

var _ObjectEventType = require('./ObjectEventType.js');

var _ObjectEventType2 = _interopRequireDefault(_ObjectEventType);

var _Observable2 = require('./Observable.js');

var _Observable3 = _interopRequireDefault(_Observable2);

var _Event2 = require('./events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _obj = require('./obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Object
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
  */
var ObjectEvent = function (_Event) {
  _inherits(ObjectEvent, _Event);

  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  function ObjectEvent(type, key, oldValue) {
    _classCallCheck(this, ObjectEvent);

    /**
     * The name of the property whose value is changing.
     * @type {string}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (ObjectEvent.__proto__ || Object.getPrototypeOf(ObjectEvent)).call(this, type));

    _this.key = key;

    /**
     * The old value. To get the new value use `e.target.get(e.key)` where
     * `e` is the event object.
     * @type {*}
     * @api
     */
    _this.oldValue = oldValue;

    return _this;
  }

  return ObjectEvent;
}(_Event3.default);

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Most non-trivial classes inherit from this.
 *
 * This extends {@link module:ol/Observable} with observable
 * properties, where each property is observable as well as the object as a
 * whole.
 *
 * Classes that inherit from this have pre-defined properties, to which you can
 * add your owns. The pre-defined properties are listed in this documentation as
 * 'Observable Properties', and have their own accessors; for example,
 * {@link module:ol/Map~Map} has a `target` property, accessed with
 * `getTarget()` and changed with `setTarget()`. Not all properties are however
 * settable. There are also general-purpose accessors `get()` and `set()`. For
 * example, `get('target')` is equivalent to `getTarget()`.
 *
 * The `set` accessors trigger a change event, and you can monitor this by
 * registering a listener. For example, {@link module:ol/View~View} has a
 * `center` property, so `view.on('change:center', function(evt) {...});` would
 * call the function whenever the value of the center property changes. Within
 * the function, `evt.target` would be the view, so `evt.target.getCenter()`
 * would return the new center.
 *
 * You can add your own observable properties with
 * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
 * You can listen for changes on that property value with
 * `object.on('change:prop', listener)`. You can get a list of all
 * properties with {@link module:ol/Object~BaseObject#getProperties}.
 *
 * Note that the observable properties are separate from standard JS properties.
 * You can, for example, give your map object a title with
 * `map.title='New title'` and with `map.set('title', 'Another title')`. The
 * first will be a `hasOwnProperty`; the second will appear in
 * `getProperties()`. Only the second is observable.
 *
 * Properties can be deleted by using the unset method. E.g.
 * object.unset('foo').
 *
 * @fires module:ol/Object~ObjectEvent
 * @api
 */


var BaseObject = function (_Observable) {
  _inherits(BaseObject, _Observable);

  /**
   * @param {Object<string, *>=} opt_values An object with key-value pairs.
   */
  function BaseObject(opt_values) {
    _classCallCheck(this, BaseObject);

    // Call {@link module:ol/util~getUid} to ensure that the order of objects' ids is
    // the same as the order in which they were created.  This also helps to
    // ensure that object properties are always added in the same order, which
    // helps many JavaScript engines generate faster code.
    var _this2 = _possibleConstructorReturn(this, (BaseObject.__proto__ || Object.getPrototypeOf(BaseObject)).call(this));

    (0, _util.getUid)(_this2);

    /**
     * @private
     * @type {!Object<string, *>}
     */
    _this2.values_ = {};

    if (opt_values !== undefined) {
      _this2.setProperties(opt_values);
    }
    return _this2;
  }

  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */


  _createClass(BaseObject, [{
    key: 'get',
    value: function get(key) {
      var value = void 0;
      if (this.values_.hasOwnProperty(key)) {
        value = this.values_[key];
      }
      return value;
    }

    /**
     * Get a list of object property names.
     * @return {Array<string>} List of property names.
     * @api
     */

  }, {
    key: 'getKeys',
    value: function getKeys() {
      return Object.keys(this.values_);
    }

    /**
     * Get an object of all property names and values.
     * @return {Object<string, *>} Object.
     * @api
     */

  }, {
    key: 'getProperties',
    value: function getProperties() {
      return (0, _obj.assign)({}, this.values_);
    }

    /**
     * @param {string} key Key name.
     * @param {*} oldValue Old value.
     */

  }, {
    key: 'notify',
    value: function notify(key, oldValue) {
      var eventType = void 0;
      eventType = getChangeEventType(key);
      this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
      eventType = _ObjectEventType2.default.PROPERTYCHANGE;
      this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
    }

    /**
     * Sets a value.
     * @param {string} key Key name.
     * @param {*} value Value.
     * @param {boolean=} opt_silent Update without triggering an event.
     * @api
     */

  }, {
    key: 'set',
    value: function set(key, value, opt_silent) {
      if (opt_silent) {
        this.values_[key] = value;
      } else {
        var oldValue = this.values_[key];
        this.values_[key] = value;
        if (oldValue !== value) {
          this.notify(key, oldValue);
        }
      }
    }

    /**
     * Sets a collection of key-value pairs.  Note that this changes any existing
     * properties and adds new ones (it does not remove any existing properties).
     * @param {Object<string, *>} values Values.
     * @param {boolean=} opt_silent Update without triggering an event.
     * @api
     */

  }, {
    key: 'setProperties',
    value: function setProperties(values, opt_silent) {
      for (var key in values) {
        this.set(key, values[key], opt_silent);
      }
    }

    /**
     * Unsets a property.
     * @param {string} key Key name.
     * @param {boolean=} opt_silent Unset without triggering an event.
     * @api
     */

  }, {
    key: 'unset',
    value: function unset(key, opt_silent) {
      if (key in this.values_) {
        var oldValue = this.values_[key];
        delete this.values_[key];
        if (!opt_silent) {
          this.notify(key, oldValue);
        }
      }
    }
  }]);

  return BaseObject;
}(_Observable3.default);

/**
 * @type {Object<string, string>}
 */


var changeEventTypeCache = {};

/**
 * @param {string} key Key name.
 * @return {string} Change name.
 */
function getChangeEventType(key) {
  return changeEventTypeCache.hasOwnProperty(key) ? changeEventTypeCache[key] : changeEventTypeCache[key] = 'change:' + key;
}

exports.default = BaseObject;