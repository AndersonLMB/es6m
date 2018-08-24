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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/IsBetween
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<PropertyIsBetween>` comparison operator.
 * @api
 */
var IsBetween = function (_Comparison) {
  _inherits(IsBetween, _Comparison);

  /**
   * @param {!string} propertyName Name of the context property to compare.
   * @param {!number} lowerBoundary The lower bound of the range.
   * @param {!number} upperBoundary The upper bound of the range.
   */
  function IsBetween(propertyName, lowerBoundary, upperBoundary) {
    _classCallCheck(this, IsBetween);

    /**
     * @type {!number}
     */
    var _this = _possibleConstructorReturn(this, (IsBetween.__proto__ || Object.getPrototypeOf(IsBetween)).call(this, 'PropertyIsBetween', propertyName));

    _this.lowerBoundary = lowerBoundary;

    /**
     * @type {!number}
     */
    _this.upperBoundary = upperBoundary;

    return _this;
  }

  return IsBetween;
}(_Comparison3.default);

exports.default = IsBetween;