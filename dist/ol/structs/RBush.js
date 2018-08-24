'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/structs/RBush
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _util = require('../util.js');

var _rbush = require('rbush');

var _rbush2 = _interopRequireDefault(_rbush);

var _extent = require('../extent.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} Entry
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 * @property {Object} [value]
 */

/**
 * @classdesc
 * Wrapper around the RBush by Vladimir Agafonkin.
 * See https://github.com/mourner/rbush.
 *
 * @template T
 */
var RBush = function () {
  /**
   * @param {number=} opt_maxEntries Max entries.
   */
  function RBush(opt_maxEntries) {
    _classCallCheck(this, RBush);

    /**
     * @private
     */
    this.rbush_ = (0, _rbush2.default)(opt_maxEntries, undefined);

    /**
     * A mapping between the objects added to this rbush wrapper
     * and the objects that are actually added to the internal rbush.
     * @private
     * @type {Object<number, module:ol/structs/RBush~Entry>}
     */
    this.items_ = {};
  }

  /**
   * Insert a value into the RBush.
   * @param {module:ol/extent~Extent} extent Extent.
   * @param {T} value Value.
   */


  _createClass(RBush, [{
    key: 'insert',
    value: function insert(extent, value) {
      /** @type {module:ol/structs/RBush~Entry} */
      var item = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3],
        value: value
      };

      this.rbush_.insert(item);
      this.items_[(0, _util.getUid)(value)] = item;
    }

    /**
     * Bulk-insert values into the RBush.
     * @param {Array<module:ol/extent~Extent>} extents Extents.
     * @param {Array<T>} values Values.
     */

  }, {
    key: 'load',
    value: function load(extents, values) {
      var items = new Array(values.length);
      for (var i = 0, l = values.length; i < l; i++) {
        var extent = extents[i];
        var value = values[i];

        /** @type {module:ol/structs/RBush~Entry} */
        var item = {
          minX: extent[0],
          minY: extent[1],
          maxX: extent[2],
          maxY: extent[3],
          value: value
        };
        items[i] = item;
        this.items_[(0, _util.getUid)(value)] = item;
      }
      this.rbush_.load(items);
    }

    /**
     * Remove a value from the RBush.
     * @param {T} value Value.
     * @return {boolean} Removed.
     */

  }, {
    key: 'remove',
    value: function remove(value) {
      var uid = (0, _util.getUid)(value);

      // get the object in which the value was wrapped when adding to the
      // internal rbush. then use that object to do the removal.
      var item = this.items_[uid];
      delete this.items_[uid];
      return this.rbush_.remove(item) !== null;
    }

    /**
     * Update the extent of a value in the RBush.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {T} value Value.
     */

  }, {
    key: 'update',
    value: function update(extent, value) {
      var item = this.items_[(0, _util.getUid)(value)];
      var bbox = [item.minX, item.minY, item.maxX, item.maxY];
      if (!(0, _extent.equals)(bbox, extent)) {
        this.remove(value);
        this.insert(extent, value);
      }
    }

    /**
     * Return all values in the RBush.
     * @return {Array<T>} All.
     */

  }, {
    key: 'getAll',
    value: function getAll() {
      var items = this.rbush_.all();
      return items.map(function (item) {
        return item.value;
      });
    }

    /**
     * Return all values in the given extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {Array<T>} All in extent.
     */

  }, {
    key: 'getInExtent',
    value: function getInExtent(extent) {
      /** @type {module:ol/structs/RBush~Entry} */
      var bbox = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3]
      };
      var items = this.rbush_.search(bbox);
      return items.map(function (item) {
        return item.value;
      });
    }

    /**
     * Calls a callback function with each value in the tree.
     * If the callback returns a truthy value, this value is returned without
     * checking the rest of the tree.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @return {*} Callback return value.
     * @template S
     */

  }, {
    key: 'forEach',
    value: function forEach(callback, opt_this) {
      return this.forEach_(this.getAll(), callback, opt_this);
    }

    /**
     * Calls a callback function with each value in the provided extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @return {*} Callback return value.
     * @template S
     */

  }, {
    key: 'forEachInExtent',
    value: function forEachInExtent(extent, callback, opt_this) {
      return this.forEach_(this.getInExtent(extent), callback, opt_this);
    }

    /**
     * @param {Array<T>} values Values.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @private
     * @return {*} Callback return value.
     * @template S
     */

  }, {
    key: 'forEach_',
    value: function forEach_(values, callback, opt_this) {
      var result = void 0;
      for (var i = 0, l = values.length; i < l; i++) {
        result = callback.call(opt_this, values[i]);
        if (result) {
          return result;
        }
      }
      return result;
    }

    /**
     * @return {boolean} Is empty.
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return (0, _obj.isEmpty)(this.items_);
    }

    /**
     * Remove all values from the RBush.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.rbush_.clear();
      this.items_ = {};
    }

    /**
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */

  }, {
    key: 'getExtent',
    value: function getExtent(opt_extent) {
      // FIXME add getExtent() to rbush
      var data = this.rbush_.data;
      return (0, _extent.createOrUpdate)(data.minX, data.minY, data.maxX, data.maxY, opt_extent);
    }

    /**
     * @param {module:ol/structs/RBush} rbush R-Tree.
     */

  }, {
    key: 'concat',
    value: function concat(rbush) {
      this.rbush_.load(rbush.rbush_.all());
      for (var i in rbush.items_) {
        this.items_[i | 0] = rbush.items_[i | 0];
      }
    }
  }]);

  return RBush;
}();

exports.default = RBush;