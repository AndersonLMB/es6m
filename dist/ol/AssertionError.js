'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/AssertionError
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
 */
var AssertionError = function (_Error) {
  _inherits(AssertionError, _Error);

  /**
   * @param {number} code Error code.
   */
  function AssertionError(code) {
    _classCallCheck(this, AssertionError);

    var path = _util.VERSION.split('-')[0];
    var message = 'Assertion failed. See https://openlayers.org/en/' + path + '/doc/errors/#' + code + ' for details.';

    /**
     * Error code. The meaning of the code can be found on
     * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
     * the version found in the OpenLayers script's header comment if a version
     * other than the latest is used).
     * @type {number}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (AssertionError.__proto__ || Object.getPrototypeOf(AssertionError)).call(this, message));

    _this.code = code;

    /**
     * @type {string}
     */
    _this.name = 'AssertionError';

    // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
    _this.message = message;
    return _this;
  }

  return AssertionError;
}(Error);

exports.default = AssertionError;