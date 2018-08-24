'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asserts = require('../asserts.js');

var _Target = require('../events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/structs/LRUCache
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * @typedef {Object} Entry
 * @property {string} key_
 * @property {Object} newer
 * @property {Object} older
 * @property {*} value_
 */

/**
 * @classdesc
 * Implements a Least-Recently-Used cache where the keys do not conflict with
 * Object's properties (e.g. 'hasOwnProperty' is not allowed as a key). Expiring
 * items from the cache is the responsibility of the user.
 *
 * @fires module:ol/events/Event~Event
 * @template T
 */
var LRUCache = function (_EventTarget) {
  _inherits(LRUCache, _EventTarget);

  /**
   * @param {number=} opt_highWaterMark High water mark.
   */
  function LRUCache(opt_highWaterMark) {
    _classCallCheck(this, LRUCache);

    /**
     * @type {number}
     */
    var _this = _possibleConstructorReturn(this, (LRUCache.__proto__ || Object.getPrototypeOf(LRUCache)).call(this));

    _this.highWaterMark = opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;

    /**
     * @private
     * @type {number}
     */
    _this.count_ = 0;

    /**
     * @private
     * @type {!Object<string, module:ol/structs/LRUCache~Entry>}
     */
    _this.entries_ = {};

    /**
     * @private
     * @type {?module:ol/structs/LRUCache~Entry}
     */
    _this.oldest_ = null;

    /**
     * @private
     * @type {?module:ol/structs/LRUCache~Entry}
     */
    _this.newest_ = null;

    return _this;
  }

  /**
   * @return {boolean} Can expire cache.
   */


  _createClass(LRUCache, [{
    key: 'canExpireCache',
    value: function canExpireCache() {
      return this.getCount() > this.highWaterMark;
    }

    /**
     * FIXME empty description for jsdoc
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.count_ = 0;
      this.entries_ = {};
      this.oldest_ = null;
      this.newest_ = null;
      this.dispatchEvent(_EventType2.default.CLEAR);
    }

    /**
     * @param {string} key Key.
     * @return {boolean} Contains key.
     */

  }, {
    key: 'containsKey',
    value: function containsKey(key) {
      return this.entries_.hasOwnProperty(key);
    }

    /**
     * @param {function(this: S, T, string, module:ol/structs/LRUCache): ?} f The function
     *     to call for every entry from the oldest to the newer. This function takes
     *     3 arguments (the entry value, the entry key and the LRUCache object).
     *     The return value is ignored.
     * @param {S=} opt_this The object to use as `this` in `f`.
     * @template S
     */

  }, {
    key: 'forEach',
    value: function forEach(f, opt_this) {
      var entry = this.oldest_;
      while (entry) {
        f.call(opt_this, entry.value_, entry.key_, this);
        entry = entry.newer;
      }
    }

    /**
     * @param {string} key Key.
     * @return {T} Value.
     */

  }, {
    key: 'get',
    value: function get(key) {
      var entry = this.entries_[key];
      (0, _asserts.assert)(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
      if (entry === this.newest_) {
        return entry.value_;
      } else if (entry === this.oldest_) {
        this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */this.oldest_.newer;
        this.oldest_.older = null;
      } else {
        entry.newer.older = entry.older;
        entry.older.newer = entry.newer;
      }
      entry.newer = null;
      entry.older = this.newest_;
      this.newest_.newer = entry;
      this.newest_ = entry;
      return entry.value_;
    }

    /**
     * Remove an entry from the cache.
     * @param {string} key The entry key.
     * @return {T} The removed entry.
     */

  }, {
    key: 'remove',
    value: function remove(key) {
      var entry = this.entries_[key];
      (0, _asserts.assert)(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
      if (entry === this.newest_) {
        this.newest_ = /** @type {module:ol/structs/LRUCache~Entry} */entry.older;
        if (this.newest_) {
          this.newest_.newer = null;
        }
      } else if (entry === this.oldest_) {
        this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */entry.newer;
        if (this.oldest_) {
          this.oldest_.older = null;
        }
      } else {
        entry.newer.older = entry.older;
        entry.older.newer = entry.newer;
      }
      delete this.entries_[key];
      --this.count_;
      return entry.value_;
    }

    /**
     * @return {number} Count.
     */

  }, {
    key: 'getCount',
    value: function getCount() {
      return this.count_;
    }

    /**
     * @return {Array<string>} Keys.
     */

  }, {
    key: 'getKeys',
    value: function getKeys() {
      var keys = new Array(this.count_);
      var i = 0;
      var entry = void 0;
      for (entry = this.newest_; entry; entry = entry.older) {
        keys[i++] = entry.key_;
      }
      return keys;
    }

    /**
     * @return {Array<T>} Values.
     */

  }, {
    key: 'getValues',
    value: function getValues() {
      var values = new Array(this.count_);
      var i = 0;
      var entry = void 0;
      for (entry = this.newest_; entry; entry = entry.older) {
        values[i++] = entry.value_;
      }
      return values;
    }

    /**
     * @return {T} Last value.
     */

  }, {
    key: 'peekLast',
    value: function peekLast() {
      return this.oldest_.value_;
    }

    /**
     * @return {string} Last key.
     */

  }, {
    key: 'peekLastKey',
    value: function peekLastKey() {
      return this.oldest_.key_;
    }

    /**
     * Get the key of the newest item in the cache.  Throws if the cache is empty.
     * @return {string} The newest key.
     */

  }, {
    key: 'peekFirstKey',
    value: function peekFirstKey() {
      return this.newest_.key_;
    }

    /**
     * @return {T} value Value.
     */

  }, {
    key: 'pop',
    value: function pop() {
      var entry = this.oldest_;
      delete this.entries_[entry.key_];
      if (entry.newer) {
        entry.newer.older = null;
      }
      this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */entry.newer;
      if (!this.oldest_) {
        this.newest_ = null;
      }
      --this.count_;
      return entry.value_;
    }

    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */

  }, {
    key: 'replace',
    value: function replace(key, value) {
      this.get(key); // update `newest_`
      this.entries_[key].value_ = value;
    }

    /**
     * @param {string} key Key.
     * @param {T} value Value.
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      (0, _asserts.assert)(!(key in this.entries_), 16); // Tried to set a value for a key that is used already
      var entry = /** @type {module:ol/structs/LRUCache~Entry} */{
        key_: key,
        newer: null,
        older: this.newest_,
        value_: value
      };
      if (!this.newest_) {
        this.oldest_ = entry;
      } else {
        this.newest_.newer = entry;
      }
      this.newest_ = entry;
      this.entries_[key] = entry;
      ++this.count_;
    }

    /**
     * Set a maximum number of entries for the cache.
     * @param {number} size Cache size.
     * @api
     */

  }, {
    key: 'setSize',
    value: function setSize(size) {
      this.highWaterMark = size;
    }

    /**
     * Prune the cache.
     */

  }, {
    key: 'prune',
    value: function prune() {
      while (this.canExpireCache()) {
        this.pop();
      }
    }
  }]);

  return LRUCache;
}(_Target2.default);

exports.default = LRUCache;