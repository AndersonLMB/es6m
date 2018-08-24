"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/format/filter/Filter
 */

/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature filters.
 *
 * @abstract
 */
var Filter = function () {
  /**
   * @param {!string} tagName The XML tag name for this filter.
   */
  function Filter(tagName) {
    _classCallCheck(this, Filter);

    /**
     * @private
     * @type {!string}
     */
    this.tagName_ = tagName;
  }

  /**
   * The XML tag name for a filter.
   * @returns {!string} Name.
   */


  _createClass(Filter, [{
    key: "getTagName",
    value: function getTagName() {
      return this.tagName_;
    }
  }]);

  return Filter;
}();

exports.default = Filter;