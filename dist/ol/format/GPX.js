'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _array = require('../array.js');

var _Feature3 = require('../format/Feature.js');

var _XMLFeature2 = require('../format/XMLFeature.js');

var _XMLFeature3 = _interopRequireDefault(_XMLFeature2);

var _xsd = require('../format/xsd.js');

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/GPX
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {Array<null|string>}
 */
var NAMESPACE_URIS = [null, 'http://www.topografix.com/GPX/1/0', 'http://www.topografix.com/GPX/1/1'];

/**
 * @const
 * @type {string}
 */
var SCHEMA_LOCATION = 'http://www.topografix.com/GPX/1/1 ' + 'http://www.topografix.com/GPX/1/1/gpx.xsd';

/**
 * @const
 * @type {Object<string, function(Node, Array<*>): (module:ol/Feature|undefined)>}
 */
var FEATURE_READER = {
  'rte': readRte,
  'trk': readTrk,
  'wpt': readWpt
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var GPX_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'rte': (0, _xml.makeArrayPusher)(readRte),
  'trk': (0, _xml.makeArrayPusher)(readTrk),
  'wpt': (0, _xml.makeArrayPusher)(readWpt)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var LINK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'text': (0, _xml.makeObjectPropertySetter)(_xsd.readString, 'linkText'),
  'type': (0, _xml.makeObjectPropertySetter)(_xsd.readString, 'linkType')
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var GPX_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'rte': (0, _xml.makeChildAppender)(writeRte),
  'trk': (0, _xml.makeChildAppender)(writeTrk),
  'wpt': (0, _xml.makeChildAppender)(writeWpt)
});

/**
 * @typedef {Object} Options
 * @property {function(module:ol/Feature, Node)} [readExtensions] Callback function
 * to process `extensions` nodes. To prevent memory leaks, this callback function must
 * not store any references to the node. Note that the `extensions`
 * node is not allowed in GPX 1.0. Moreover, only `extensions`
 * nodes from `wpt`, `rte` and `trk` can be processed, as those are
 * directly mapped to a feature.
 */

/**
 * @typedef {Object} LayoutOptions
 * @property {boolean} [hasZ]
 * @property {boolean} [hasM]
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the GPX format.
 *
 * Note that {@link module:ol/format/GPX~GPX#readFeature} only reads the first
 * feature of the source.
 *
 * When reading, routes (`<rte>`) are converted into LineString geometries, and
 * tracks (`<trk>`) into MultiLineString. Any properties on route and track
 * waypoints are ignored.
 *
 * When writing, LineString geometries are output as routes (`<rte>`), and
 * MultiLineString as tracks (`<trk>`).
 *
 * @api
 */

var GPX = function (_XMLFeature) {
  _inherits(GPX, _XMLFeature);

  /**
   * @param {module:ol/format/GPX~Options=} opt_options Options.
   */
  function GPX(opt_options) {
    _classCallCheck(this, GPX);

    var _this = _possibleConstructorReturn(this, (GPX.__proto__ || Object.getPrototypeOf(GPX)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @inheritDoc
     */
    _this.dataProjection = (0, _proj.get)('EPSG:4326');

    /**
     * @type {function(module:ol/Feature, Node)|undefined}
     * @private
     */
    _this.readExtensions_ = options.readExtensions;
    return _this;
  }

  /**
   * @param {Array<module:ol/Feature>} features List of features.
   * @private
   */


  _createClass(GPX, [{
    key: 'handleReadExtensions_',
    value: function handleReadExtensions_(features) {
      if (!features) {
        features = [];
      }
      for (var i = 0, ii = features.length; i < ii; ++i) {
        var feature = features[i];
        if (this.readExtensions_) {
          var extensionsNode = feature.get('extensionsNode_') || null;
          this.readExtensions_(feature, extensionsNode);
        }
        feature.set('extensionsNode_', undefined);
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeatureFromNode',
    value: function readFeatureFromNode(node, opt_options) {
      if (!(0, _array.includes)(NAMESPACE_URIS, node.namespaceURI)) {
        return null;
      }
      var featureReader = FEATURE_READER[node.localName];
      if (!featureReader) {
        return null;
      }
      var feature = featureReader(node, [this.getReadOptions(node, opt_options)]);
      if (!feature) {
        return null;
      }
      this.handleReadExtensions_([feature]);
      return feature;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromNode',
    value: function readFeaturesFromNode(node, opt_options) {
      if (!(0, _array.includes)(NAMESPACE_URIS, node.namespaceURI)) {
        return [];
      }
      if (node.localName == 'gpx') {
        /** @type {Array<module:ol/Feature>} */
        var features = (0, _xml.pushParseAndPop)([], GPX_PARSERS, node, [this.getReadOptions(node, opt_options)]);
        if (features) {
          this.handleReadExtensions_(features);
          return features;
        } else {
          return [];
        }
      }
      return [];
    }

    /**
     * Encode an array of features in the GPX format as an XML node.
     * LineString geometries are output as routes (`<rte>`), and MultiLineString
     * as tracks (`<trk>`).
     *
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
     * @return {Node} Node.
     * @override
     * @api
     */

  }, {
    key: 'writeFeaturesNode',
    value: function writeFeaturesNode(features, opt_options) {
      opt_options = this.adaptOptions(opt_options);
      //FIXME Serialize metadata
      var gpx = (0, _xml.createElementNS)('http://www.topografix.com/GPX/1/1', 'gpx');
      var xmlnsUri = 'http://www.w3.org/2000/xmlns/';
      gpx.setAttributeNS(xmlnsUri, 'xmlns:xsi', _xml.XML_SCHEMA_INSTANCE_URI);
      gpx.setAttributeNS(_xml.XML_SCHEMA_INSTANCE_URI, 'xsi:schemaLocation', SCHEMA_LOCATION);
      gpx.setAttribute('version', '1.1');
      gpx.setAttribute('creator', 'OpenLayers');

      (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */
      { node: gpx }, GPX_SERIALIZERS, GPX_NODE_FACTORY, features, [opt_options]);
      return gpx;
    }
  }]);

  return GPX;
}(_XMLFeature3.default);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */


var RTE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'cmt': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'desc': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'src': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'link': parseLink,
  'number': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'extensions': parseExtensions,
  'type': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'rtept': parseRtePt
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var RTEPT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ele': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'time': (0, _xml.makeObjectPropertySetter)(_xsd.readDateTime)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TRK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'cmt': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'desc': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'src': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'link': parseLink,
  'number': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'type': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'extensions': parseExtensions,
  'trkseg': parseTrkSeg
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TRKSEG_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'trkpt': parseTrkPt
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var TRKPT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ele': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'time': (0, _xml.makeObjectPropertySetter)(_xsd.readDateTime)
});

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 */
var WPT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ele': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'time': (0, _xml.makeObjectPropertySetter)(_xsd.readDateTime),
  'magvar': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'geoidheight': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'cmt': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'desc': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'src': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'link': parseLink,
  'sym': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'type': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'fix': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'sat': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'hdop': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'vdop': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'pdop': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'ageofdgpsdata': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'dgpsid': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'extensions': parseExtensions
});

/**
 * @const
 * @type {Array<string>}
 */
var LINK_SEQUENCE = ['text', 'type'];

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var LINK_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'text': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'type': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
});

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var RTE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['name', 'cmt', 'desc', 'src', 'link', 'number', 'type', 'rtept']);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var RTE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'name': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'cmt': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'desc': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'src': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'link': (0, _xml.makeChildAppender)(writeLink),
  'number': (0, _xml.makeChildAppender)(_xsd.writeNonNegativeIntegerTextNode),
  'type': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'rtept': (0, _xml.makeArraySerializer)((0, _xml.makeChildAppender)(writeWptType))
});

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var RTEPT_TYPE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['ele', 'time']);

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var TRK_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['name', 'cmt', 'desc', 'src', 'link', 'number', 'type', 'trkseg']);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var TRK_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'name': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'cmt': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'desc': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'src': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'link': (0, _xml.makeChildAppender)(writeLink),
  'number': (0, _xml.makeChildAppender)(_xsd.writeNonNegativeIntegerTextNode),
  'type': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'trkseg': (0, _xml.makeArraySerializer)((0, _xml.makeChildAppender)(writeTrkSeg))
});

/**
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var TRKSEG_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('trkpt');

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var TRKSEG_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'trkpt': (0, _xml.makeChildAppender)(writeWptType)
});

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var WPT_TYPE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['ele', 'time', 'magvar', 'geoidheight', 'name', 'cmt', 'desc', 'src', 'link', 'sym', 'type', 'fix', 'sat', 'hdop', 'vdop', 'pdop', 'ageofdgpsdata', 'dgpsid']);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 */
var WPT_TYPE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ele': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'time': (0, _xml.makeChildAppender)(_xsd.writeDateTimeTextNode),
  'magvar': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'geoidheight': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'name': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'cmt': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'desc': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'src': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'link': (0, _xml.makeChildAppender)(writeLink),
  'sym': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'type': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'fix': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'sat': (0, _xml.makeChildAppender)(_xsd.writeNonNegativeIntegerTextNode),
  'hdop': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'vdop': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'pdop': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'ageofdgpsdata': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'dgpsid': (0, _xml.makeChildAppender)(_xsd.writeNonNegativeIntegerTextNode)
});

/**
 * @const
 * @type {Object<string, string>}
 */
var GEOMETRY_TYPE_TO_NODENAME = {
  'Point': 'wpt',
  'LineString': 'rte',
  'MultiLineString': 'trk'
};

/**
 * @param {*} value Value.
 * @param {Array<*>} objectStack Object stack.
 * @param {string=} opt_nodeName Node name.
 * @return {Node|undefined} Node.
 */
function GPX_NODE_FACTORY(value, objectStack, opt_nodeName) {
  var geometry = /** @type {module:ol/Feature} */value.getGeometry();
  if (geometry) {
    var nodeName = GEOMETRY_TYPE_TO_NODENAME[geometry.getType()];
    if (nodeName) {
      var parentNode = objectStack[objectStack.length - 1].node;
      return (0, _xml.createElementNS)(parentNode.namespaceURI, nodeName);
    }
  }
}

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {module:ol/format/GPX~LayoutOptions} layoutOptions Layout options.
 * @param {Node} node Node.
 * @param {!Object} values Values.
 * @return {Array<number>} Flat coordinates.
 */
function appendCoordinate(flatCoordinates, layoutOptions, node, values) {
  flatCoordinates.push(parseFloat(node.getAttribute('lon')), parseFloat(node.getAttribute('lat')));
  if ('ele' in values) {
    flatCoordinates.push( /** @type {number} */values['ele']);
    delete values['ele'];
    layoutOptions.hasZ = true;
  } else {
    flatCoordinates.push(0);
  }
  if ('time' in values) {
    flatCoordinates.push( /** @type {number} */values['time']);
    delete values['time'];
    layoutOptions.hasM = true;
  } else {
    flatCoordinates.push(0);
  }
  return flatCoordinates;
}

/**
 * Choose GeometryLayout based on flags in layoutOptions and adjust flatCoordinates
 * and ends arrays by shrinking them accordingly (removing unused zero entries).
 *
 * @param {module:ol/format/GPX~LayoutOptions} layoutOptions Layout options.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {Array<number>=} ends Ends.
 * @return {module:ol/geom/GeometryLayout} Layout.
 */
function applyLayoutOptions(layoutOptions, flatCoordinates, ends) {
  var layout = _GeometryLayout2.default.XY;
  var stride = 2;
  if (layoutOptions.hasZ && layoutOptions.hasM) {
    layout = _GeometryLayout2.default.XYZM;
    stride = 4;
  } else if (layoutOptions.hasZ) {
    layout = _GeometryLayout2.default.XYZ;
    stride = 3;
  } else if (layoutOptions.hasM) {
    layout = _GeometryLayout2.default.XYM;
    stride = 3;
  }
  if (stride !== 4) {
    for (var i = 0, ii = flatCoordinates.length / 4; i < ii; i++) {
      flatCoordinates[i * stride] = flatCoordinates[i * 4];
      flatCoordinates[i * stride + 1] = flatCoordinates[i * 4 + 1];
      if (layoutOptions.hasZ) {
        flatCoordinates[i * stride + 2] = flatCoordinates[i * 4 + 2];
      }
      if (layoutOptions.hasM) {
        flatCoordinates[i * stride + 2] = flatCoordinates[i * 4 + 3];
      }
    }
    flatCoordinates.length = flatCoordinates.length / 4 * stride;
    if (ends) {
      for (var _i = 0, _ii = ends.length; _i < _ii; _i++) {
        ends[_i] = ends[_i] / 4 * stride;
      }
    }
  }
  return layout;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function parseLink(node, objectStack) {
  var values = /** @type {Object} */objectStack[objectStack.length - 1];
  var href = node.getAttribute('href');
  if (href !== null) {
    values['link'] = href;
  }
  (0, _xml.parseNode)(LINK_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function parseExtensions(node, objectStack) {
  var values = /** @type {Object} */objectStack[objectStack.length - 1];
  values['extensionsNode_'] = node;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function parseRtePt(node, objectStack) {
  var values = (0, _xml.pushParseAndPop)({}, RTEPT_PARSERS, node, objectStack);
  if (values) {
    var rteValues = /** @type {!Object} */objectStack[objectStack.length - 1];
    var flatCoordinates = /** @type {Array<number>} */rteValues['flatCoordinates'];
    var layoutOptions = /** @type {module:ol/format/GPX~LayoutOptions} */rteValues['layoutOptions'];
    appendCoordinate(flatCoordinates, layoutOptions, node, values);
  }
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function parseTrkPt(node, objectStack) {
  var values = (0, _xml.pushParseAndPop)({}, TRKPT_PARSERS, node, objectStack);
  if (values) {
    var trkValues = /** @type {!Object} */objectStack[objectStack.length - 1];
    var flatCoordinates = /** @type {Array<number>} */trkValues['flatCoordinates'];
    var layoutOptions = /** @type {module:ol/format/GPX~LayoutOptions} */trkValues['layoutOptions'];
    appendCoordinate(flatCoordinates, layoutOptions, node, values);
  }
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function parseTrkSeg(node, objectStack) {
  var values = /** @type {Object} */objectStack[objectStack.length - 1];
  (0, _xml.parseNode)(TRKSEG_PARSERS, node, objectStack);
  var flatCoordinates = /** @type {Array<number>} */
  values['flatCoordinates'];
  var ends = /** @type {Array<number>} */values['ends'];
  ends.push(flatCoordinates.length);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {module:ol/Feature|undefined} Track.
 */
function readRte(node, objectStack) {
  var options = /** @type {module:ol/format/Feature~ReadOptions} */objectStack[0];
  var values = (0, _xml.pushParseAndPop)({
    'flatCoordinates': [],
    'layoutOptions': {}
  }, RTE_PARSERS, node, objectStack);
  if (!values) {
    return undefined;
  }
  var flatCoordinates = /** @type {Array<number>} */
  values['flatCoordinates'];
  delete values['flatCoordinates'];
  var layoutOptions = /** @type {module:ol/format/GPX~LayoutOptions} */values['layoutOptions'];
  delete values['layoutOptions'];
  var layout = applyLayoutOptions(layoutOptions, flatCoordinates);
  var geometry = new _LineString2.default(flatCoordinates, layout);
  (0, _Feature3.transformWithOptions)(geometry, false, options);
  var feature = new _Feature2.default(geometry);
  feature.setProperties(values);
  return feature;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {module:ol/Feature|undefined} Track.
 */
function readTrk(node, objectStack) {
  var options = /** @type {module:ol/format/Feature~ReadOptions} */objectStack[0];
  var values = (0, _xml.pushParseAndPop)({
    'flatCoordinates': [],
    'ends': [],
    'layoutOptions': {}
  }, TRK_PARSERS, node, objectStack);
  if (!values) {
    return undefined;
  }
  var flatCoordinates = /** @type {Array<number>} */
  values['flatCoordinates'];
  delete values['flatCoordinates'];
  var ends = /** @type {Array<number>} */values['ends'];
  delete values['ends'];
  var layoutOptions = /** @type {module:ol/format/GPX~LayoutOptions} */values['layoutOptions'];
  delete values['layoutOptions'];
  var layout = applyLayoutOptions(layoutOptions, flatCoordinates, ends);
  var geometry = new _MultiLineString2.default(flatCoordinates, layout, ends);
  (0, _Feature3.transformWithOptions)(geometry, false, options);
  var feature = new _Feature2.default(geometry);
  feature.setProperties(values);
  return feature;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {module:ol/Feature|undefined} Waypoint.
 */
function readWpt(node, objectStack) {
  var options = /** @type {module:ol/format/Feature~ReadOptions} */objectStack[0];
  var values = (0, _xml.pushParseAndPop)({}, WPT_PARSERS, node, objectStack);
  if (!values) {
    return undefined;
  }
  var layoutOptions = /** @type {module:ol/format/GPX~LayoutOptions} */{};
  var coordinates = appendCoordinate([], layoutOptions, node, values);
  var layout = applyLayoutOptions(layoutOptions, coordinates);
  var geometry = new _Point2.default(coordinates, layout);
  (0, _Feature3.transformWithOptions)(geometry, false, options);
  var feature = new _Feature2.default(geometry);
  feature.setProperties(values);
  return feature;
}

/**
 * @param {Node} node Node.
 * @param {string} value Value for the link's `href` attribute.
 * @param {Array<*>} objectStack Node stack.
 */
function writeLink(node, value, objectStack) {
  node.setAttribute('href', value);
  var context = objectStack[objectStack.length - 1];
  var properties = context['properties'];
  var link = [properties['linkText'], properties['linkType']];
  (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */{ node: node }, LINK_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, link, objectStack, LINK_SEQUENCE);
}

/**
 * @param {Node} node Node.
 * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
 * @param {Array<*>} objectStack Object stack.
 */
function writeWptType(node, coordinate, objectStack) {
  var context = objectStack[objectStack.length - 1];
  var parentNode = context.node;
  var namespaceURI = parentNode.namespaceURI;
  var properties = context['properties'];
  //FIXME Projection handling
  node.setAttributeNS(null, 'lat', coordinate[1]);
  node.setAttributeNS(null, 'lon', coordinate[0]);
  var geometryLayout = context['geometryLayout'];
  switch (geometryLayout) {
    case _GeometryLayout2.default.XYZM:
      if (coordinate[3] !== 0) {
        properties['time'] = coordinate[3];
      }
    // fall through
    case _GeometryLayout2.default.XYZ:
      if (coordinate[2] !== 0) {
        properties['ele'] = coordinate[2];
      }
      break;
    case _GeometryLayout2.default.XYM:
      if (coordinate[2] !== 0) {
        properties['time'] = coordinate[2];
      }
      break;
    default:
    // pass
  }
  var orderedKeys = node.nodeName == 'rtept' ? RTEPT_TYPE_SEQUENCE[namespaceURI] : WPT_TYPE_SEQUENCE[namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */
  { node: node, 'properties': properties }, WPT_TYPE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @param {Node} node Node.
 * @param {module:ol/Feature} feature Feature.
 * @param {Array<*>} objectStack Object stack.
 */
function writeRte(node, feature, objectStack) {
  var options = /** @type {module:ol/format/Feature~WriteOptions} */objectStack[0];
  var properties = feature.getProperties();
  var context = { node: node, 'properties': properties };
  var geometry = feature.getGeometry();
  if (geometry) {
    geometry = /** @type {module:ol/geom/LineString} */(0, _Feature3.transformWithOptions)(geometry, true, options);
    context['geometryLayout'] = geometry.getLayout();
    properties['rtept'] = geometry.getCoordinates();
  }
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = RTE_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, RTE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @param {Node} node Node.
 * @param {module:ol/Feature} feature Feature.
 * @param {Array<*>} objectStack Object stack.
 */
function writeTrk(node, feature, objectStack) {
  var options = /** @type {module:ol/format/Feature~WriteOptions} */objectStack[0];
  var properties = feature.getProperties();
  /** @type {module:ol/xml~NodeStackItem} */
  var context = { node: node, 'properties': properties };
  var geometry = feature.getGeometry();
  if (geometry) {
    geometry = /** @type {module:ol/geom/MultiLineString} */
    (0, _Feature3.transformWithOptions)(geometry, true, options);
    properties['trkseg'] = geometry.getLineStrings();
  }
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = TRK_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, TRK_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @param {Node} node Node.
 * @param {module:ol/geom/LineString} lineString LineString.
 * @param {Array<*>} objectStack Object stack.
 */
function writeTrkSeg(node, lineString, objectStack) {
  /** @type {module:ol/xml~NodeStackItem} */
  var context = { node: node, 'geometryLayout': lineString.getLayout(),
    'properties': {} };
  (0, _xml.pushSerializeAndPop)(context, TRKSEG_SERIALIZERS, TRKSEG_NODE_FACTORY, lineString.getCoordinates(), objectStack);
}

/**
 * @param {Node} node Node.
 * @param {module:ol/Feature} feature Feature.
 * @param {Array<*>} objectStack Object stack.
 */
function writeWpt(node, feature, objectStack) {
  var options = /** @type {module:ol/format/Feature~WriteOptions} */objectStack[0];
  var context = objectStack[objectStack.length - 1];
  context['properties'] = feature.getProperties();
  var geometry = feature.getGeometry();
  if (geometry) {
    geometry = /** @type {module:ol/geom/Point} */
    (0, _Feature3.transformWithOptions)(geometry, true, options);
    context['geometryLayout'] = geometry.getLayout();
    writeWptType(node, geometry.getCoordinates(), objectStack);
  }
}

exports.default = GPX;