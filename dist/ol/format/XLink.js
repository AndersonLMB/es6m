'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readHref = readHref;
/**
 * @module ol/format/XLink
 */

/**
 * @const
 * @type {string}
 */
var NAMESPACE_URI = 'http://www.w3.org/1999/xlink';

/**
 * @param {Node} node Node.
 * @return {string|undefined} href.
 */
function readHref(node) {
  return node.getAttributeNS(NAMESPACE_URI, 'href');
}