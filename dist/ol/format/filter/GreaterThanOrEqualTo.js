'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary2 = require('../filter/ComparisonBinary.js');

var _ComparisonBinary3 = _interopRequireDefault(_ComparisonBinary2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/GreaterThanOrEqualTo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<PropertyIsGreaterThanOrEqualTo>` comparison operator.
 * @api
 */
var GreaterThanOrEqualTo = function (_ComparisonBinary) {
  _inherits(GreaterThanOrEqualTo, _ComparisonBinary);

  /**
   * @param {!string} propertyName Name of the context property to compare.
   * @param {!number} expression The value to compare.
   */
  function GreaterThanOrEqualTo(propertyName, expression) {
    _classCallCheck(this, GreaterThanOrEqualTo);

    return _possibleConstructorReturn(this, (GreaterThanOrEqualTo.__proto__ || Object.getPrototypeOf(GreaterThanOrEqualTo)).call(this, 'PropertyIsGreaterThanOrEqualTo', propertyName, expression));
  }

  return GreaterThanOrEqualTo;
}(_ComparisonBinary3.default);

exports.default = GreaterThanOrEqualTo;