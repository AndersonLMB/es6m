'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _XLink = require('../format/XLink.js');

var _XML2 = require('../format/XML.js');

var _XML3 = _interopRequireDefault(_XML2);

var _xsd = require('../format/xsd.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/OWS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {Array<null|string>}
 */
var NAMESPACE_URIS = [null, 'http://www.opengis.net/ows/1.1'];

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ServiceIdentification': (0, _xml.makeObjectPropertySetter)(readServiceIdentification),
  'ServiceProvider': (0, _xml.makeObjectPropertySetter)(readServiceProvider),
  'OperationsMetadata': (0, _xml.makeObjectPropertySetter)(readOperationsMetadata)
});

var OWS = function (_XML) {
  _inherits(OWS, _XML);

  function OWS() {
    _classCallCheck(this, OWS);

    return _possibleConstructorReturn(this, (OWS.__proto__ || Object.getPrototypeOf(OWS)).call(this));
  }

  /**
   * @inheritDoc
   */


  _createClass(OWS, [{
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
      var owsObject = (0, _xml.pushParseAndPop)({}, PARSERS, node, []);
      return owsObject ? owsObject : null;
    }
  }]);

  return OWS;
}(_XML3.default);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */


var ADDRESS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'DeliveryPoint': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'City': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'AdministrativeArea': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'PostalCode': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Country': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ElectronicMailAddress': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var ALLOWED_VALUES_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Value': (0, _xml.makeObjectPropertyPusher)(readValue)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var CONSTRAINT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'AllowedValues': (0, _xml.makeObjectPropertySetter)(readAllowedValues)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var CONTACT_INFO_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Phone': (0, _xml.makeObjectPropertySetter)(readPhone),
  'Address': (0, _xml.makeObjectPropertySetter)(readAddress)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var DCP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'HTTP': (0, _xml.makeObjectPropertySetter)(readHttp)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var HTTP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Get': (0, _xml.makeObjectPropertyPusher)(readGet),
  'Post': undefined // TODO
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var OPERATION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'DCP': (0, _xml.makeObjectPropertySetter)(readDcp)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var OPERATIONS_METADATA_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Operation': readOperation
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var PHONE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Voice': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Facsimile': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var REQUEST_METHOD_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Constraint': (0, _xml.makeObjectPropertyPusher)(readConstraint)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var SERVICE_CONTACT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'IndividualName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'PositionName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactInfo': (0, _xml.makeObjectPropertySetter)(readContactInfo)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var SERVICE_IDENTIFICATION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'AccessConstraints': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Fees': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ServiceTypeVersion': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ServiceType': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var SERVICE_PROVIDER_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ProviderName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ProviderSite': (0, _xml.makeObjectPropertySetter)(_XLink.readHref),
  'ServiceContact': (0, _xml.makeObjectPropertySetter)(readServiceContact)
});

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The address.
 */
function readAddress(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, ADDRESS_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The values.
 */
function readAllowedValues(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, ALLOWED_VALUES_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The constraint.
 */
function readConstraint(node, objectStack) {
  var name = node.getAttribute('name');
  if (!name) {
    return undefined;
  }
  return (0, _xml.pushParseAndPop)({ 'name': name }, CONSTRAINT_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The contact info.
 */
function readContactInfo(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTACT_INFO_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The DCP.
 */
function readDcp(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, DCP_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The GET object.
 */
function readGet(node, objectStack) {
  var href = (0, _XLink.readHref)(node);
  if (!href) {
    return undefined;
  }
  return (0, _xml.pushParseAndPop)({ 'href': href }, REQUEST_METHOD_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The HTTP object.
 */
function readHttp(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, HTTP_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The operation.
 */
function readOperation(node, objectStack) {
  var name = node.getAttribute('name');
  var value = (0, _xml.pushParseAndPop)({}, OPERATION_PARSERS, node, objectStack);
  if (!value) {
    return undefined;
  }
  var object = /** @type {Object} */
  objectStack[objectStack.length - 1];
  object[name] = value;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The operations metadata.
 */
function readOperationsMetadata(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, OPERATIONS_METADATA_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The phone.
 */
function readPhone(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, PHONE_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service identification.
 */
function readServiceIdentification(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_IDENTIFICATION_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service contact.
 */
function readServiceContact(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_CONTACT_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service provider.
 */
function readServiceProvider(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_PROVIDER_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {string|undefined} The value.
 */
function readValue(node, objectStack) {
  return (0, _xsd.readString)(node);
}

exports.default = OWS;