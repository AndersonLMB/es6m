'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Spatial2 = require('../filter/Spatial.js');

var _Spatial3 = _interopRequireDefault(_Spatial2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Contains
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<Contains>` operator to test whether a geometry-valued property
 * contains a given geometry.
 * @api
 */
var Contains = function (_Spatial) {
  _inherits(Contains, _Spatial);

  /**
   * @param {!string} geometryName Geometry name to use.
   * @param {!module:ol/geom/Geometry} geometry Geometry.
   * @param {string=} opt_srsName SRS name. No srsName attribute will be
   *    set on geometries when this is not provided.
   */
  function Contains(geometryName, geometry, opt_srsName) {
    _classCallCheck(this, Contains);

    return _possibleConstructorReturn(this, (Contains.__proto__ || Object.getPrototypeOf(Contains)).call(this, 'Contains', geometryName, geometry, opt_srsName));
  }

  return Contains;
}(_Spatial3.default);

exports.default = Contains;