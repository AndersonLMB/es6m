'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/format/XML
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _xml = require('../xml.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc
 * Generic format for reading non-feature XML data
 *
 * @abstract
 */
var XML = function () {
  function XML() {
    _classCallCheck(this, XML);
  }

  _createClass(XML, [{
    key: 'read',

    /**
     * Read the source document.
     *
     * @param {Document|Node|string} source The XML source.
     * @return {Object} An object representing the source.
     * @api
     */
    value: function read(source) {
      if ((0, _xml.isDocument)(source)) {
        return this.readFromDocument( /** @type {Document} */source);
      } else if ((0, _xml.isNode)(source)) {
        return this.readFromNode( /** @type {Node} */source);
      } else if (typeof source === 'string') {
        var doc = (0, _xml.parse)(source);
        return this.readFromDocument(doc);
      } else {
        return null;
      }
    }

    /**
     * @abstract
     * @param {Document} doc Document.
     * @return {Object} Object
     */

  }, {
    key: 'readFromDocument',
    value: function readFromDocument(doc) {}

    /**
     * @abstract
     * @param {Node} node Node.
     * @return {Object} Object
     */

  }, {
    key: 'readFromNode',
    value: function readFromNode(node) {}
  }]);

  return XML;
}();

exports.default = XML;