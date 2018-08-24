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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Intersects
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Represents a `<Intersects>` operator to test whether a geometry-valued property
 * intersects a given geometry.
 * @api
 */
var Intersects = function (_Spatial) {
  _inherits(Intersects, _Spatial);

  /**
   * @param {!string} geometryName Geometry name to use.
   * @param {!module:ol/geom/Geometry} geometry Geometry.
   * @param {string=} opt_srsName SRS name. No srsName attribute will be
   *    set on geometries when this is not provided.
   */
  function Intersects(geometryName, geometry, opt_srsName) {
    _classCallCheck(this, Intersects);

    return _possibleConstructorReturn(this, (Intersects.__proto__ || Object.getPrototypeOf(Intersects)).call(this, 'Intersects', geometryName, geometry, opt_srsName));
  }

  return Intersects;
}(_Spatial3.default);

exports.default = Intersects;