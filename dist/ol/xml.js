'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OBJECT_PROPERTY_NODE_FACTORY = exports.XML_SCHEMA_INSTANCE_URI = exports.DOCUMENT = undefined;
exports.createElementNS = createElementNS;
exports.getAllTextContent = getAllTextContent;
exports.getAllTextContent_ = getAllTextContent_;
exports.isDocument = isDocument;
exports.isNode = isNode;
exports.getAttributeNS = getAttributeNS;
exports.parse = parse;
exports.makeArrayExtender = makeArrayExtender;
exports.makeArrayPusher = makeArrayPusher;
exports.makeReplacer = makeReplacer;
exports.makeObjectPropertyPusher = makeObjectPropertyPusher;
exports.makeObjectPropertySetter = makeObjectPropertySetter;
exports.makeChildAppender = makeChildAppender;
exports.makeArraySerializer = makeArraySerializer;
exports.makeSimpleNodeFactory = makeSimpleNodeFactory;
exports.makeSequence = makeSequence;
exports.makeStructureNS = makeStructureNS;
exports.parseNode = parseNode;
exports.pushParseAndPop = pushParseAndPop;
exports.serialize = serialize;
exports.pushSerializeAndPop = pushSerializeAndPop;

var _array = require('./array.js');

/**
 * When using {@link module:ol/xml~makeChildAppender} or
 * {@link module:ol/xml~makeSimpleNodeFactory}, the top `objectStack` item needs
 * to have this structure.
 * @typedef {Object} NodeStackItem
 * @property {Node} node
 */

/**
 * @typedef {function(Node, Array<*>)} Parser
 */

/**
 * @typedef {function(Node, *, Array<*>)} Serializer
 */

/**
 * This document should be used when creating nodes for XML serializations. This
 * document is also used by {@link module:ol/xml~createElementNS}
 * @const
 * @type {Document}
 */
var DOCUMENT = exports.DOCUMENT = document.implementation.createDocument('', '', null);

/**
 * @type {string}
 */
/**
 * @module ol/xml
 */
var XML_SCHEMA_INSTANCE_URI = exports.XML_SCHEMA_INSTANCE_URI = 'http://www.w3.org/2001/XMLSchema-instance';

/**
 * @param {string} namespaceURI Namespace URI.
 * @param {string} qualifiedName Qualified name.
 * @return {Node} Node.
 */
function createElementNS(namespaceURI, qualifiedName) {
  return DOCUMENT.createElementNS(namespaceURI, qualifiedName);
}

/**
 * Recursively grab all text content of child nodes into a single string.
 * @param {Node} node Node.
 * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
 * breaks.
 * @return {string} All text content.
 * @api
 */
function getAllTextContent(node, normalizeWhitespace) {
  return getAllTextContent_(node, normalizeWhitespace, []).join('');
}

/**
 * Recursively grab all text content of child nodes into a single string.
 * @param {Node} node Node.
 * @param {boolean} normalizeWhitespace Normalize whitespace: remove all line
 * breaks.
 * @param {Array<string>} accumulator Accumulator.
 * @private
 * @return {Array<string>} Accumulator.
 */
function getAllTextContent_(node, normalizeWhitespace, accumulator) {
  if (node.nodeType == Node.CDATA_SECTION_NODE || node.nodeType == Node.TEXT_NODE) {
    if (normalizeWhitespace) {
      accumulator.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ''));
    } else {
      accumulator.push(node.nodeValue);
    }
  } else {
    var n = void 0;
    for (n = node.firstChild; n; n = n.nextSibling) {
      getAllTextContent_(n, normalizeWhitespace, accumulator);
    }
  }
  return accumulator;
}

/**
 * @param {?} value Value.
 * @return {boolean} Is document.
 */
function isDocument(value) {
  return value instanceof Document;
}

/**
 * @param {?} value Value.
 * @return {boolean} Is node.
 */
function isNode(value) {
  return value instanceof Node;
}

/**
 * @param {Node} node Node.
 * @param {?string} namespaceURI Namespace URI.
 * @param {string} name Attribute name.
 * @return {string} Value
 */
function getAttributeNS(node, namespaceURI, name) {
  return node.getAttributeNS(namespaceURI, name) || '';
}

/**
 * Parse an XML string to an XML Document.
 * @param {string} xml XML.
 * @return {Document} Document.
 * @api
 */
function parse(xml) {
  return new DOMParser().parseFromString(xml, 'application/xml');
}

/**
 * Make an array extender function for extending the array at the top of the
 * object stack.
 * @param {function(this: T, Node, Array<*>): (Array<*>|undefined)} valueReader Value reader.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {module:ol/xml~Parser} Parser.
 * @template T
 */
function makeArrayExtender(valueReader, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function (node, objectStack) {
      var value = valueReader.call(opt_this !== undefined ? opt_this : this, node, objectStack);
      if (value !== undefined) {
        var array = /** @type {Array<*>} */objectStack[objectStack.length - 1];
        (0, _array.extend)(array, value);
      }
    }
  );
}

/**
 * Make an array pusher function for pushing to the array at the top of the
 * object stack.
 * @param {function(this: T, Node, Array<*>): *} valueReader Value reader.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {module:ol/xml~Parser} Parser.
 * @template T
 */
function makeArrayPusher(valueReader, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function (node, objectStack) {
      var value = valueReader.call(opt_this !== undefined ? opt_this : this, node, objectStack);
      if (value !== undefined) {
        var array = /** @type {Array<*>} */objectStack[objectStack.length - 1];
        array.push(value);
      }
    }
  );
}

/**
 * Make an object stack replacer function for replacing the object at the
 * top of the stack.
 * @param {function(this: T, Node, Array<*>): *} valueReader Value reader.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {module:ol/xml~Parser} Parser.
 * @template T
 */
function makeReplacer(valueReader, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function (node, objectStack) {
      var value = valueReader.call(opt_this !== undefined ? opt_this : this, node, objectStack);
      if (value !== undefined) {
        objectStack[objectStack.length - 1] = value;
      }
    }
  );
}

/**
 * Make an object property pusher function for adding a property to the
 * object at the top of the stack.
 * @param {function(this: T, Node, Array<*>): *} valueReader Value reader.
 * @param {string=} opt_property Property.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {module:ol/xml~Parser} Parser.
 * @template T
 */
function makeObjectPropertyPusher(valueReader, opt_property, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function (node, objectStack) {
      var value = valueReader.call(opt_this !== undefined ? opt_this : this, node, objectStack);
      if (value !== undefined) {
        var object = /** @type {!Object} */objectStack[objectStack.length - 1];
        var property = opt_property !== undefined ? opt_property : node.localName;
        var array = void 0;
        if (property in object) {
          array = object[property];
        } else {
          array = object[property] = [];
        }
        array.push(value);
      }
    }
  );
}

/**
 * Make an object property setter function.
 * @param {function(this: T, Node, Array<*>): *} valueReader Value reader.
 * @param {string=} opt_property Property.
 * @param {T=} opt_this The object to use as `this` in `valueReader`.
 * @return {module:ol/xml~Parser} Parser.
 * @template T
 */
function makeObjectPropertySetter(valueReader, opt_property, opt_this) {
  return (
    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     */
    function (node, objectStack) {
      var value = valueReader.call(opt_this !== undefined ? opt_this : this, node, objectStack);
      if (value !== undefined) {
        var object = /** @type {!Object} */objectStack[objectStack.length - 1];
        var property = opt_property !== undefined ? opt_property : node.localName;
        object[property] = value;
      }
    }
  );
}

/**
 * Create a serializer that appends nodes written by its `nodeWriter` to its
 * designated parent. The parent is the `node` of the
 * {@link module:ol/xml~NodeStackItem} at the top of the `objectStack`.
 * @param {function(this: T, Node, V, Array<*>)} nodeWriter Node writer.
 * @param {T=} opt_this The object to use as `this` in `nodeWriter`.
 * @return {module:ol/xml~Serializer} Serializer.
 * @template T, V
 */
function makeChildAppender(nodeWriter, opt_this) {
  return function (node, value, objectStack) {
    nodeWriter.call(opt_this !== undefined ? opt_this : this, node, value, objectStack);
    var parent = /** @type {module:ol/xml~NodeStackItem} */objectStack[objectStack.length - 1];
    var parentNode = parent.node;
    parentNode.appendChild(node);
  };
}

/**
 * Create a serializer that calls the provided `nodeWriter` from
 * {@link module:ol/xml~serialize}. This can be used by the parent writer to have the
 * 'nodeWriter' called with an array of values when the `nodeWriter` was
 * designed to serialize a single item. An example would be a LineString
 * geometry writer, which could be reused for writing MultiLineString
 * geometries.
 * @param {function(this: T, Node, V, Array<*>)} nodeWriter Node writer.
 * @param {T=} opt_this The object to use as `this` in `nodeWriter`.
 * @return {module:ol/xml~Serializer} Serializer.
 * @template T, V
 */
function makeArraySerializer(nodeWriter, opt_this) {
  var serializersNS = void 0,
      nodeFactory = void 0;
  return function (node, value, objectStack) {
    if (serializersNS === undefined) {
      serializersNS = {};
      var serializers = {};
      serializers[node.localName] = nodeWriter;
      serializersNS[node.namespaceURI] = serializers;
      nodeFactory = makeSimpleNodeFactory(node.localName);
    }
    serialize(serializersNS, nodeFactory, value, objectStack);
  };
}

/**
 * Create a node factory which can use the `opt_keys` passed to
 * {@link module:ol/xml~serialize} or {@link module:ol/xml~pushSerializeAndPop} as node names,
 * or a fixed node name. The namespace of the created nodes can either be fixed,
 * or the parent namespace will be used.
 * @param {string=} opt_nodeName Fixed node name which will be used for all
 *     created nodes. If not provided, the 3rd argument to the resulting node
 *     factory needs to be provided and will be the nodeName.
 * @param {string=} opt_namespaceURI Fixed namespace URI which will be used for
 *     all created nodes. If not provided, the namespace of the parent node will
 *     be used.
 * @return {function(*, Array<*>, string=): (Node|undefined)} Node factory.
 */
function makeSimpleNodeFactory(opt_nodeName, opt_namespaceURI) {
  var fixedNodeName = opt_nodeName;
  return (
    /**
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string=} opt_nodeName Node name.
     * @return {Node} Node.
     */
    function (value, objectStack, opt_nodeName) {
      var context = /** @type {module:ol/xml~NodeStackItem} */objectStack[objectStack.length - 1];
      var node = context.node;
      var nodeName = fixedNodeName;
      if (nodeName === undefined) {
        nodeName = opt_nodeName;
      }

      var namespaceURI = opt_namespaceURI !== undefined ? opt_namespaceURI : node.namespaceURI;
      return createElementNS(namespaceURI, /** @type {string} */nodeName);
    }
  );
}

/**
 * A node factory that creates a node using the parent's `namespaceURI` and the
 * `nodeName` passed by {@link module:ol/xml~serialize} or
 * {@link module:ol/xml~pushSerializeAndPop} to the node factory.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var OBJECT_PROPERTY_NODE_FACTORY = exports.OBJECT_PROPERTY_NODE_FACTORY = makeSimpleNodeFactory();

/**
 * Create an array of `values` to be used with {@link module:ol/xml~serialize} or
 * {@link module:ol/xml~pushSerializeAndPop}, where `orderedKeys` has to be provided as
 * `opt_key` argument.
 * @param {Object<string, V>} object Key-value pairs for the sequence. Keys can
 *     be a subset of the `orderedKeys`.
 * @param {Array<string>} orderedKeys Keys in the order of the sequence.
 * @return {Array<V>} Values in the order of the sequence. The resulting array
 *     has the same length as the `orderedKeys` array. Values that are not
 *     present in `object` will be `undefined` in the resulting array.
 * @template V
 */
function makeSequence(object, orderedKeys) {
  var length = orderedKeys.length;
  var sequence = new Array(length);
  for (var i = 0; i < length; ++i) {
    sequence[i] = object[orderedKeys[i]];
  }
  return sequence;
}

/**
 * Create a namespaced structure, using the same values for each namespace.
 * This can be used as a starting point for versioned parsers, when only a few
 * values are version specific.
 * @param {Array<string>} namespaceURIs Namespace URIs.
 * @param {T} structure Structure.
 * @param {Object<string, T>=} opt_structureNS Namespaced structure to add to.
 * @return {Object<string, T>} Namespaced structure.
 * @template T
 */
function makeStructureNS(namespaceURIs, structure, opt_structureNS) {
  /**
   * @type {Object<string, T>}
   */
  var structureNS = opt_structureNS !== undefined ? opt_structureNS : {};
  var i = void 0,
      ii = void 0;
  for (i = 0, ii = namespaceURIs.length; i < ii; ++i) {
    structureNS[namespaceURIs[i]] = structure;
  }
  return structureNS;
}

/**
 * Parse a node using the parsers and object stack.
 * @param {Object<string, Object<string, module:ol/xml~Parser>>} parsersNS
 *     Parsers by namespace.
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @param {*=} opt_this The object to use as `this`.
 */
function parseNode(parsersNS, node, objectStack, opt_this) {
  var n = void 0;
  for (n = node.firstElementChild; n; n = n.nextElementSibling) {
    var parsers = parsersNS[n.namespaceURI];
    if (parsers !== undefined) {
      var parser = parsers[n.localName];
      if (parser !== undefined) {
        parser.call(opt_this, n, objectStack);
      }
    }
  }
}

/**
 * Push an object on top of the stack, parse and return the popped object.
 * @param {T} object Object.
 * @param {Object<string, Object<string, module:ol/xml~Parser>>} parsersNS
 *     Parsers by namespace.
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @param {*=} opt_this The object to use as `this`.
 * @return {T} Object.
 * @template T
 */
function pushParseAndPop(object, parsersNS, node, objectStack, opt_this) {
  objectStack.push(object);
  parseNode(parsersNS, node, objectStack, opt_this);
  return (/** @type {T} */objectStack.pop()
  );
}

/**
 * Walk through an array of `values` and call a serializer for each value.
 * @param {Object<string, Object<string, module:ol/xml~Serializer>>} serializersNS
 *     Namespaced serializers.
 * @param {function(this: T, *, Array<*>, (string|undefined)): (Node|undefined)} nodeFactory
 *     Node factory. The `nodeFactory` creates the node whose namespace and name
 *     will be used to choose a node writer from `serializersNS`. This
 *     separation allows us to decide what kind of node to create, depending on
 *     the value we want to serialize. An example for this would be different
 *     geometry writers based on the geometry type.
 * @param {Array<*>} values Values to serialize. An example would be an array
 *     of {@link module:ol/Feature~Feature} instances.
 * @param {Array<*>} objectStack Node stack.
 * @param {Array<string>=} opt_keys Keys of the `values`. Will be passed to the
 *     `nodeFactory`. This is used for serializing object literals where the
 *     node name relates to the property key. The array length of `opt_keys` has
 *     to match the length of `values`. For serializing a sequence, `opt_keys`
 *     determines the order of the sequence.
 * @param {T=} opt_this The object to use as `this` for the node factory and
 *     serializers.
 * @template T
 */
function serialize(serializersNS, nodeFactory, values, objectStack, opt_keys, opt_this) {
  var length = (opt_keys !== undefined ? opt_keys : values).length;
  var value = void 0,
      node = void 0;
  for (var i = 0; i < length; ++i) {
    value = values[i];
    if (value !== undefined) {
      node = nodeFactory.call(opt_this !== undefined ? opt_this : this, value, objectStack, opt_keys !== undefined ? opt_keys[i] : undefined);
      if (node !== undefined) {
        serializersNS[node.namespaceURI][node.localName].call(opt_this, node, value, objectStack);
      }
    }
  }
}

/**
 * @param {O} object Object.
 * @param {Object<string, Object<string, module:ol/xml~Serializer>>} serializersNS
 *     Namespaced serializers.
 * @param {function(this: T, *, Array<*>, (string|undefined)): (Node|undefined)} nodeFactory
 *     Node factory. The `nodeFactory` creates the node whose namespace and name
 *     will be used to choose a node writer from `serializersNS`. This
 *     separation allows us to decide what kind of node to create, depending on
 *     the value we want to serialize. An example for this would be different
 *     geometry writers based on the geometry type.
 * @param {Array<*>} values Values to serialize. An example would be an array
 *     of {@link module:ol/Feature~Feature} instances.
 * @param {Array<*>} objectStack Node stack.
 * @param {Array<string>=} opt_keys Keys of the `values`. Will be passed to the
 *     `nodeFactory`. This is used for serializing object literals where the
 *     node name relates to the property key. The array length of `opt_keys` has
 *     to match the length of `values`. For serializing a sequence, `opt_keys`
 *     determines the order of the sequence.
 * @param {T=} opt_this The object to use as `this` for the node factory and
 *     serializers.
 * @return {O|undefined} Object.
 * @template O, T
 */
function pushSerializeAndPop(object, serializersNS, nodeFactory, values, objectStack, opt_keys, opt_this) {
  objectStack.push(object);
  serialize(serializersNS, nodeFactory, values, objectStack, opt_keys, opt_this);
  return (/** @type {O|undefined} */objectStack.pop()
  );
}