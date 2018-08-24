'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AssertionError = require('./AssertionError.js');

var _AssertionError2 = _interopRequireDefault(_AssertionError);

var _CollectionEventType = require('./CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _Object = require('./Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _Event2 = require('./events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/Collection
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @enum {string}
 * @private
 */
var Property = {
  LENGTH: 'length'
};

/**
 * @classdesc
 * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
 * type.
 */

var CollectionEvent = exports.CollectionEvent = function (_Event) {
  _inherits(CollectionEvent, _Event);

  /**
   * @param {module:ol/CollectionEventType} type Type.
   * @param {*=} opt_element Element.
   */
  function CollectionEvent(type, opt_element) {
    _classCallCheck(this, CollectionEvent);

    /**
     * The element that is added to or removed from the collection.
     * @type {*}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (CollectionEvent.__proto__ || Object.getPrototypeOf(CollectionEvent)).call(this, type));

    _this.element = opt_element;

    return _this;
  }

  return CollectionEvent;
}(_Event3.default);

/**
 * @typedef {Object} Options
 * @property {boolean} [unique=false] Disallow the same item from being added to
 * the collection twice.
 */

/**
 * @classdesc
 * An expanded version of standard JS Array, adding convenience methods for
 * manipulation. Add and remove changes to the Collection trigger a Collection
 * event. Note that this does not cover changes to the objects _within_ the
 * Collection; they trigger events on the appropriate object, not on the
 * Collection as a whole.
 *
 * @template T
 * @api
 */


var Collection = function (_BaseObject) {
  _inherits(Collection, _BaseObject);

  /**
   * @param {Array<T>=} opt_array Array.
   * @param {module:ol/Collection~Options=} opt_options Collection options.
   */
  function Collection(opt_array, opt_options) {
    _classCallCheck(this, Collection);

    var _this2 = _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).call(this));

    var options = opt_options || {};

    /**
     * @private
     * @type {boolean}
     */
    _this2.unique_ = !!options.unique;

    /**
     * @private
     * @type {!Array<T>}
     */
    _this2.array_ = opt_array ? opt_array : [];

    if (_this2.unique_) {
      for (var i = 0, ii = _this2.array_.length; i < ii; ++i) {
        _this2.assertUnique_(_this2.array_[i], i);
      }
    }

    _this2.updateLength_();

    return _this2;
  }

  /**
   * Remove all elements from the collection.
   * @api
   */


  _createClass(Collection, [{
    key: 'clear',
    value: function clear() {
      while (this.getLength() > 0) {
        this.pop();
      }
    }

    /**
     * Add elements to the collection.  This pushes each item in the provided array
     * to the end of the collection.
     * @param {!Array<T>} arr Array.
     * @return {module:ol/Collection<T>} This collection.
     * @api
     */

  }, {
    key: 'extend',
    value: function extend(arr) {
      for (var i = 0, ii = arr.length; i < ii; ++i) {
        this.push(arr[i]);
      }
      return this;
    }

    /**
     * Iterate over each element, calling the provided callback.
     * @param {function(T, number, Array<T>): *} f The function to call
     *     for every element. This function takes 3 arguments (the element, the
     *     index and the array). The return value is ignored.
     * @api
     */

  }, {
    key: 'forEach',
    value: function forEach(f) {
      var array = this.array_;
      for (var i = 0, ii = array.length; i < ii; ++i) {
        f(array[i], i, array);
      }
    }

    /**
     * Get a reference to the underlying Array object. Warning: if the array
     * is mutated, no events will be dispatched by the collection, and the
     * collection's "length" property won't be in sync with the actual length
     * of the array.
     * @return {!Array<T>} Array.
     * @api
     */

  }, {
    key: 'getArray',
    value: function getArray() {
      return this.array_;
    }

    /**
     * Get the element at the provided index.
     * @param {number} index Index.
     * @return {T} Element.
     * @api
     */

  }, {
    key: 'item',
    value: function item(index) {
      return this.array_[index];
    }

    /**
     * Get the length of this collection.
     * @return {number} The length of the array.
     * @observable
     * @api
     */

  }, {
    key: 'getLength',
    value: function getLength() {
      return (/** @type {number} */this.get(Property.LENGTH)
      );
    }

    /**
     * Insert an element at the provided index.
     * @param {number} index Index.
     * @param {T} elem Element.
     * @api
     */

  }, {
    key: 'insertAt',
    value: function insertAt(index, elem) {
      if (this.unique_) {
        this.assertUnique_(elem);
      }
      this.array_.splice(index, 0, elem);
      this.updateLength_();
      this.dispatchEvent(new CollectionEvent(_CollectionEventType2.default.ADD, elem));
    }

    /**
     * Remove the last element of the collection and return it.
     * Return `undefined` if the collection is empty.
     * @return {T|undefined} Element.
     * @api
     */

  }, {
    key: 'pop',
    value: function pop() {
      return this.removeAt(this.getLength() - 1);
    }

    /**
     * Insert the provided element at the end of the collection.
     * @param {T} elem Element.
     * @return {number} New length of the collection.
     * @api
     */

  }, {
    key: 'push',
    value: function push(elem) {
      if (this.unique_) {
        this.assertUnique_(elem);
      }
      var n = this.getLength();
      this.insertAt(n, elem);
      return this.getLength();
    }

    /**
     * Remove the first occurrence of an element from the collection.
     * @param {T} elem Element.
     * @return {T|undefined} The removed element or undefined if none found.
     * @api
     */

  }, {
    key: 'remove',
    value: function remove(elem) {
      var arr = this.array_;
      for (var i = 0, ii = arr.length; i < ii; ++i) {
        if (arr[i] === elem) {
          return this.removeAt(i);
        }
      }
      return undefined;
    }

    /**
     * Remove the element at the provided index and return it.
     * Return `undefined` if the collection does not contain this index.
     * @param {number} index Index.
     * @return {T|undefined} Value.
     * @api
     */

  }, {
    key: 'removeAt',
    value: function removeAt(index) {
      var prev = this.array_[index];
      this.array_.splice(index, 1);
      this.updateLength_();
      this.dispatchEvent(new CollectionEvent(_CollectionEventType2.default.REMOVE, prev));
      return prev;
    }

    /**
     * Set the element at the provided index.
     * @param {number} index Index.
     * @param {T} elem Element.
     * @api
     */

  }, {
    key: 'setAt',
    value: function setAt(index, elem) {
      var n = this.getLength();
      if (index < n) {
        if (this.unique_) {
          this.assertUnique_(elem, index);
        }
        var prev = this.array_[index];
        this.array_[index] = elem;
        this.dispatchEvent(new CollectionEvent(_CollectionEventType2.default.REMOVE, prev));
        this.dispatchEvent(new CollectionEvent(_CollectionEventType2.default.ADD, elem));
      } else {
        for (var j = n; j < index; ++j) {
          this.insertAt(j, undefined);
        }
        this.insertAt(index, elem);
      }
    }

    /**
     * @private
     */

  }, {
    key: 'updateLength_',
    value: function updateLength_() {
      this.set(Property.LENGTH, this.array_.length);
    }

    /**
     * @private
     * @param {T} elem Element.
     * @param {number=} opt_except Optional index to ignore.
     */

  }, {
    key: 'assertUnique_',
    value: function assertUnique_(elem, opt_except) {
      for (var i = 0, ii = this.array_.length; i < ii; ++i) {
        if (this.array_[i] === elem && i !== opt_except) {
          throw new _AssertionError2.default(58);
        }
      }
    }
  }]);

  return Collection;
}(_Object2.default);

exports.default = Collection;