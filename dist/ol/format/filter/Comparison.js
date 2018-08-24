'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Filter2 = require('../filter/Filter.js');

var _Filter3 = _interopRequireDefault(_Filter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Comparison
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature property comparison filters.
 *
 * @abstract
 */
var Comparison = function (_Filter) {
  _inherits(Comparison, _Filter);

  /**
   * @param {!string} tagName The XML tag name for this filter.
   * @param {!string} propertyName Name of the context property to compare.
   */
  function Comparison(tagName, propertyName) {
    _classCallCheck(this, Comparison);

    /**
     * @type {!string}
     */
    var _this = _possibleConstructorReturn(this, (Comparison.__proto__ || Object.getPrototypeOf(Comparison)).call(this, tagName));

    _this.propertyName = propertyName;
    return _this;
  }

  return Comparison;
}(_Filter3.default);

exports.default = Comparison;