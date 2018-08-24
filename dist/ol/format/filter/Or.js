'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LogicalNary2 = require('../filter/LogicalNary.js');

var _LogicalNary3 = _interopRequireDefault(_LogicalNary2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Or
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a logical `<Or>` operator between two ore more filter conditions.
 * @api
 */
var Or = function (_LogicalNary) {
  _inherits(Or, _LogicalNary);

  /**
   * @param {...module:ol/format/filter/Filter} conditions Conditions.
   */
  function Or(conditions) {
    var _ref;

    _classCallCheck(this, Or);

    var params = ['Or'].concat(Array.prototype.slice.call(arguments));
    return _possibleConstructorReturn(this, (_ref = Or.__proto__ || Object.getPrototypeOf(Or)).call.apply(_ref, [this].concat(_toConsumableArray(params))));
  }

  return Or;
}(_LogicalNary3.default);

exports.default = Or;