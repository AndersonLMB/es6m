'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asserts = require('../../asserts.js');

var _Filter2 = require('../filter/Filter.js');

var _Filter3 = _interopRequireDefault(_Filter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/LogicalNary
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature n-ary logical filters.
 *
 * @abstract
 */
var LogicalNary = function (_Filter) {
  _inherits(LogicalNary, _Filter);

  /**
   * @param {!string} tagName The XML tag name for this filter.
   * @param {...module:ol/format/filter/Filter} conditions Conditions.
   */
  function LogicalNary(tagName, conditions) {
    _classCallCheck(this, LogicalNary);

    /**
     * @type {Array<module:ol/format/filter/Filter>}
     */
    var _this = _possibleConstructorReturn(this, (LogicalNary.__proto__ || Object.getPrototypeOf(LogicalNary)).call(this, tagName));

    _this.conditions = Array.prototype.slice.call(arguments, 1);
    (0, _asserts.assert)(_this.conditions.length >= 2, 57); // At least 2 conditions are required.
    return _this;
  }

  return LogicalNary;
}(_Filter3.default);

exports.default = LogicalNary;