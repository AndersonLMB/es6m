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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/IsLike
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<PropertyIsLike>` comparison operator.
 * @api
 */
var IsLike = function (_Comparison) {
  _inherits(IsLike, _Comparison);

  /**
   * [constructor description]
   * @param {!string} propertyName Name of the context property to compare.
   * @param {!string} pattern Text pattern.
   * @param {string=} opt_wildCard Pattern character which matches any sequence of
   *    zero or more string characters. Default is '*'.
   * @param {string=} opt_singleChar pattern character which matches any single
   *    string character. Default is '.'.
   * @param {string=} opt_escapeChar Escape character which can be used to escape
   *    the pattern characters. Default is '!'.
   * @param {boolean=} opt_matchCase Case-sensitive?
   */
  function IsLike(propertyName, pattern, opt_wildCard, opt_singleChar, opt_escapeChar, opt_matchCase) {
    _classCallCheck(this, IsLike);

    /**
     * @type {!string}
     */
    var _this = _possibleConstructorReturn(this, (IsLike.__proto__ || Object.getPrototypeOf(IsLike)).call(this, 'PropertyIsLike', propertyName));

    _this.pattern = pattern;

    /**
     * @type {!string}
     */
    _this.wildCard = opt_wildCard !== undefined ? opt_wildCard : '*';

    /**
     * @type {!string}
     */
    _this.singleChar = opt_singleChar !== undefined ? opt_singleChar : '.';

    /**
     * @type {!string}
     */
    _this.escapeChar = opt_escapeChar !== undefined ? opt_escapeChar : '!';

    /**
     * @type {boolean|undefined}
     */
    _this.matchCase = opt_matchCase;

    return _this;
  }

  return IsLike;
}(_Comparison3.default);

exports.default = IsLike;