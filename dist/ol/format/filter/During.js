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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/During
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<During>` comparison operator.
 * @api
 */
var During = function (_Comparison) {
  _inherits(During, _Comparison);

  /**
   * @param {!string} propertyName Name of the context property to compare.
   * @param {!string} begin The begin date in ISO-8601 format.
   * @param {!string} end The end date in ISO-8601 format.
   */
  function During(propertyName, begin, end) {
    _classCallCheck(this, During);

    /**
     * @type {!string}
     */
    var _this = _possibleConstructorReturn(this, (During.__proto__ || Object.getPrototypeOf(During)).call(this, 'During', propertyName));

    _this.begin = begin;

    /**
     * @type {!string}
     */
    _this.end = end;
    return _this;
  }

  return During;
}(_Comparison3.default);

exports.default = During;