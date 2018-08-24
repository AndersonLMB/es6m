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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Not
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a logical `<Not>` operator for a filter condition.
 * @api
 */
var Not = function (_Filter) {
  _inherits(Not, _Filter);

  /**
   * @param {!module:ol/format/filter/Filter} condition Filter condition.
   */
  function Not(condition) {
    _classCallCheck(this, Not);

    /**
     * @type {!module:ol/format/filter/Filter}
     */
    var _this = _possibleConstructorReturn(this, (Not.__proto__ || Object.getPrototypeOf(Not)).call(this, 'Not'));

    _this.condition = condition;

    return _this;
  }

  return Not;
}(_Filter3.default);

exports.default = Not;