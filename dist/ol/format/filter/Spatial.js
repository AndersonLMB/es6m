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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/filter/Spatial
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Represents a spatial operator to test whether a geometry-valued property
 * relates to a given geometry.
 *
 * @abstract
 */
var Spatial = function (_Filter) {
  _inherits(Spatial, _Filter);

  /**
   * @param {!string} tagName The XML tag name for this filter.
   * @param {!string} geometryName Geometry name to use.
   * @param {!module:ol/geom/Geometry} geometry Geometry.
   * @param {string=} opt_srsName SRS name. No srsName attribute will be
   *    set on geometries when this is not provided.
   */
  function Spatial(tagName, geometryName, geometry, opt_srsName) {
    _classCallCheck(this, Spatial);

    /**
     * @type {!string}
     */
    var _this = _possibleConstructorReturn(this, (Spatial.__proto__ || Object.getPrototypeOf(Spatial)).call(this, tagName));

    _this.geometryName = geometryName || 'the_geom';

    /**
     * @type {module:ol/geom/Geometry}
     */
    _this.geometry = geometry;

    /**
     * @type {string|undefined}
     */
    _this.srsName = opt_srsName;
    return _this;
  }

  return Spatial;
}(_Filter3.default);

exports.default = Spatial;