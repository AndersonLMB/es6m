'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../extent.js');

var _OWS = require('../format/OWS.js');

var _OWS2 = _interopRequireDefault(_OWS);

var _XLink = require('../format/XLink.js');

var _XML2 = require('../format/XML.js');

var _XML3 = _interopRequireDefault(_XML2);

var _xsd = require('../format/xsd.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/WMTSCapabilities
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {Array<null|string>}
 */
var NAMESPACE_URIS = [null, 'http://www.opengis.net/wmts/1.0'];

/**
 * @const
 * @type {Array<null|string>}
 */
var OWS_NAMESPACE_URIS = [null, 'http://www.opengis.net/ows/1.1'];

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Contents': (0, _xml.makeObjectPropertySetter)(readContents)
});

/**
 * @classdesc
 * Format for reading WMTS capabilities data.
 *
  * @api
 */

var WMTSCapabilities = function (_XML) {
  _inherits(WMTSCapabilities, _XML);

  function WMTSCapabilities() {
    _classCallCheck(this, WMTSCapabilities);

    /**
     * @type {module:ol/format/OWS}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (WMTSCapabilities.__proto__ || Object.getPrototypeOf(WMTSCapabilities)).call(this));

    _this.owsParser_ = new _OWS2.default();
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(WMTSCapabilities, [{
    key: 'readFromDocument',
    value: function readFromDocument(doc) {
      for (var n = doc.firstChild; n; n = n.nextSibling) {
        if (n.nodeType == Node.ELEMENT_NODE) {
          return this.readFromNode(n);
        }
      }
      return null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFromNode',
    value: function readFromNode(node) {
      var version = node.getAttribute('version').trim();
      var WMTSCapabilityObject = this.owsParser_.readFromNode(node);
      if (!WMTSCapabilityObject) {
        return null;
      }
      WMTSCapabilityObject['version'] = version;
      WMTSCapabilityObject = (0, _xml.pushParseAndPop)(WMTSCapabilityObject, PARSERS, node, []);
      return WMTSCapabilityObject ? WMTSCapabilityObject : null;
    }
  }]);

  return WMTSCapabilities;
}(_XML3.default);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */


var CONTENTS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Layer': (0, _xml.makeObjectPropertyPusher)(readLayer),
  'TileMatrixSet': (0, _xml.makeObjectPropertyPusher)(readTileMatrixSet)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var LAYER_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Style': (0, _xml.makeObjectPropertyPusher)(readStyle),
  'Format': (0, _xml.makeObjectPropertyPusher)(_xsd.readString),
  'TileMatrixSetLink': (0, _xml.makeObjectPropertyPusher)(readTileMatrixSetLink),
  'Dimension': (0, _xml.makeObjectPropertyPusher)(readDimensions),
  'ResourceURL': (0, _xml.makeObjectPropertyPusher)(readResourceUrl)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'WGS84BoundingBox': (0, _xml.makeObjectPropertySetter)(readWgs84BoundingBox),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LegendURL': (0, _xml.makeObjectPropertyPusher)(readLegendUrl)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TMS_LINKS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrixSet': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'TileMatrixSetLimits': (0, _xml.makeObjectPropertySetter)(readTileMatrixLimitsList)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TMS_LIMITS_LIST_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrixLimits': (0, _xml.makeArrayPusher)(readTileMatrixLimits)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TMS_LIMITS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrix': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'MinTileRow': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxTileRow': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MinTileCol': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxTileCol': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var DIMENSION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Default': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Value': (0, _xml.makeObjectPropertyPusher)(_xsd.readString)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var WGS84_BBOX_READERS = (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'LowerCorner': (0, _xml.makeArrayPusher)(readCoordinates),
  'UpperCorner': (0, _xml.makeArrayPusher)(readCoordinates)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TMS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'WellKnownScaleSet': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'TileMatrix': (0, _xml.makeObjectPropertyPusher)(readTileMatrix)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'SupportedCRS': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TM_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TopLeftCorner': (0, _xml.makeObjectPropertySetter)(readCoordinates),
  'ScaleDenominator': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'TileWidth': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'TileHeight': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MatrixWidth': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MatrixHeight': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Attribution object.
 */
function readContents(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTENTS_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Layers object.
 */
function readLayer(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, LAYER_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Tile Matrix Set object.
 */
function readTileMatrixSet(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Style object.
 */
function readStyle(node, objectStack) {
  var style = (0, _xml.pushParseAndPop)({}, STYLE_PARSERS, node, objectStack);
  if (!style) {
    return undefined;
  }
  var isDefault = node.getAttribute('isDefault') === 'true';
  style['isDefault'] = isDefault;
  return style;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Tile Matrix Set Link object.
 */
function readTileMatrixSetLink(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_LINKS_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Dimension object.
 */
function readDimensions(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, DIMENSION_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Resource URL object.
 */
function readResourceUrl(node, objectStack) {
  var format = node.getAttribute('format');
  var template = node.getAttribute('template');
  var resourceType = node.getAttribute('resourceType');
  var resource = {};
  if (format) {
    resource['format'] = format;
  }
  if (template) {
    resource['template'] = template;
  }
  if (resourceType) {
    resource['resourceType'] = resourceType;
  }
  return resource;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} WGS84 BBox object.
 */
function readWgs84BoundingBox(node, objectStack) {
  var coordinates = (0, _xml.pushParseAndPop)([], WGS84_BBOX_READERS, node, objectStack);
  if (coordinates.length != 2) {
    return undefined;
  }
  return (0, _extent.boundingExtent)(coordinates);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Legend object.
 */
function readLegendUrl(node, objectStack) {
  var legend = {};
  legend['format'] = node.getAttribute('format');
  legend['href'] = (0, _XLink.readHref)(node);
  return legend;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Coordinates object.
 */
function readCoordinates(node, objectStack) {
  var coordinates = (0, _xsd.readString)(node).split(' ');
  if (!coordinates || coordinates.length != 2) {
    return undefined;
  }
  var x = +coordinates[0];
  var y = +coordinates[1];
  if (isNaN(x) || isNaN(y)) {
    return undefined;
  }
  return [x, y];
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrix object.
 */
function readTileMatrix(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TM_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrixSetLimits Object.
 */
function readTileMatrixLimitsList(node, objectStack) {
  return (0, _xml.pushParseAndPop)([], TMS_LIMITS_LIST_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrixLimits Array.
 */
function readTileMatrixLimits(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_LIMITS_PARSERS, node, objectStack);
}

exports.default = WMTSCapabilities;