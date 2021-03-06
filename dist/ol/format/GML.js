'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GML = require('../format/GML3.js');

var _GML2 = _interopRequireDefault(_GML);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Feature format for reading and writing data in the GML format
 * version 3.1.1.
 * Currently only supports GML 3.1.1 Simple Features profile.
 *
 * @param {module:ol/format/GMLBase~Options=} opt_options
 *     Optional configuration object.
 * @api
 */
var GML = _GML2.default;

/**
 * Encode an array of features in GML 3.1.1 Simple Features.
 *
 * @function
 * @param {Array<module:ol/Feature>} features Features.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
 * @return {string} Result.
 * @api
 */
/**
 * @module ol/format/GML
 */
GML.prototype.writeFeatures;

/**
 * Encode an array of features in the GML 3.1.1 format as an XML node.
 *
 * @function
 * @param {Array<module:ol/Feature>} features Features.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
 * @return {Node} Node.
 * @api
 */
GML.prototype.writeFeaturesNode;

exports.default = GML;