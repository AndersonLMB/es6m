'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comparison2 = require('../filter/Comparison.js');

var _Comparison3 = _interopRequireDefault(_Comparison2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/ComparisonBinary
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature property binary comparison filters.
 *
 * @abstract
 */
var ComparisonBinary = function (_Comparison) {
  _inherits(ComparisonBinary, _Comparison);

  /**
   * @param {!string} tagName The XML tag name for this filter.
   * @param {!string} propertyName Name of the context property to compare.
   * @param {!(string|number)} expression The value to compare.
   * @param {boolean=} opt_matchCase Case-sensitive?
   */
  function ComparisonBinary(tagName, propertyName, expression, opt_matchCase) {
    _classCallCheck(this, ComparisonBinary);

    /**
     * @type {!(string|number)}
     */
    var _this = _possibleConstructorReturn(this, (ComparisonBinary.__proto__ || Object.getPrototypeOf(ComparisonBinary)).call(this, tagName, propertyName));

    _this.expression = expression;

    /**
     * @type {boolean|undefined}
     */
    _this.matchCase = opt_matchCase;
    return _this;
  }

  return ComparisonBinary;
}(_Comparison3.default);

exports.default = ComparisonBinary;