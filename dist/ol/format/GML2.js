'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extent = require('../extent.js');

var _Feature = require('../format/Feature.js');

var _GMLBase2 = require('../format/GMLBase.js');

var _GMLBase3 = _interopRequireDefault(_GMLBase2);

var _xsd = require('../format/xsd.js');

var _Geometry = require('../geom/Geometry.js');

var _Geometry2 = _interopRequireDefault(_Geometry);

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/GML2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {string}
 */
var schemaLocation = _GMLBase2.GMLNS + ' http://schemas.opengis.net/gml/2.1.2/feature.xsd';

/**
 * @const
 * @type {Object<string, string>}
 */
var MULTIGEOMETRY_TO_MEMBER_NODENAME = {
  'MultiLineString': 'lineStringMember',
  'MultiCurve': 'curveMember',
  'MultiPolygon': 'polygonMember',
  'MultiSurface': 'surfaceMember'
};

/**
 * @classdesc
 * Feature format for reading and writing data in the GML format,
 * version 2.1.2.
 *
 * @api
 */

var GML2 = function (_GMLBase) {
  _inherits(GML2, _GMLBase);

  /**
   * @param {module:ol/format/GMLBase~Options=} opt_options Optional configuration object.
   */
  function GML2(opt_options) {
    _classCallCheck(this, GML2);

    var options = /** @type {module:ol/format/GMLBase~Options} */
    opt_options ? opt_options : {};

    var _this = _possibleConstructorReturn(this, (GML2.__proto__ || Object.getPrototypeOf(GML2)).call(this, options));

    _this.FEATURE_COLLECTION_PARSERS[_GMLBase2.GMLNS]['featureMember'] = (0, _xml.makeArrayPusher)(_this.readFeaturesInternal);

    /**
     * @inheritDoc
     */
    _this.schemaLocation = options.schemaLocation ? options.schemaLocation : schemaLocation;

    return _this;
  }

  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} Flat coordinates.
   */


  _createClass(GML2, [{
    key: 'readFlatCoordinates_',
    value: function readFlatCoordinates_(node, objectStack) {
      var s = (0, _xml.getAllTextContent)(node, false).replace(/^\s*|\s*$/g, '');
      var context = /** @type {module:ol/xml~NodeStackItem} */objectStack[0];
      var containerSrs = context['srsName'];
      var axisOrientation = 'enu';
      if (containerSrs) {
        var proj = (0, _proj.get)(containerSrs);
        if (proj) {
          axisOrientation = proj.getAxisOrientation();
        }
      }
      var coordsGroups = s.trim().split(/\s+/);
      var flatCoordinates = [];
      for (var i = 0, ii = coordsGroups.length; i < ii; i++) {
        var coords = coordsGroups[i].split(/,+/);
        var x = parseFloat(coords[0]);
        var y = parseFloat(coords[1]);
        var z = coords.length === 3 ? parseFloat(coords[2]) : 0;
        if (axisOrientation.substr(0, 2) === 'en') {
          flatCoordinates.push(x, y, z);
        } else {
          flatCoordinates.push(y, x, z);
        }
      }
      return flatCoordinates;
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     * @return {module:ol/extent~Extent|undefined} Envelope.
     */

  }, {
    key: 'readBox_',
    value: function readBox_(node, objectStack) {
      /** @type {Array<number>} */
      var flatCoordinates = (0, _xml.pushParseAndPop)([null], this.BOX_PARSERS_, node, objectStack, this);
      return (0, _extent.createOrUpdate)(flatCoordinates[1][0], flatCoordinates[1][1], flatCoordinates[1][3], flatCoordinates[1][4]);
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     */

  }, {
    key: 'innerBoundaryIsParser_',
    value: function innerBoundaryIsParser_(node, objectStack) {
      /** @type {Array<number>|undefined} */
      var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, this.RING_PARSERS, node, objectStack, this);
      if (flatLinearRing) {
        var flatLinearRings = /** @type {Array<Array<number>>} */
        objectStack[objectStack.length - 1];
        flatLinearRings.push(flatLinearRing);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     */

  }, {
    key: 'outerBoundaryIsParser_',
    value: function outerBoundaryIsParser_(node, objectStack) {
      /** @type {Array<number>|undefined} */
      var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, this.RING_PARSERS, node, objectStack, this);
      if (flatLinearRing) {
        var flatLinearRings = /** @type {Array<Array<number>>} */
        objectStack[objectStack.length - 1];
        flatLinearRings[0] = flatLinearRing;
      }
    }

    /**
     * @const
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string=} opt_nodeName Node name.
     * @return {Node|undefined} Node.
     * @private
     */

  }, {
    key: 'GEOMETRY_NODE_FACTORY_',
    value: function GEOMETRY_NODE_FACTORY_(value, objectStack, opt_nodeName) {
      var context = objectStack[objectStack.length - 1];
      var multiSurface = context['multiSurface'];
      var surface = context['surface'];
      var multiCurve = context['multiCurve'];
      var nodeName = void 0;
      if (!Array.isArray(value)) {
        nodeName = /** @type {module:ol/geom/Geometry} */value.getType();
        if (nodeName === 'MultiPolygon' && multiSurface === true) {
          nodeName = 'MultiSurface';
        } else if (nodeName === 'Polygon' && surface === true) {
          nodeName = 'Surface';
        } else if (nodeName === 'MultiLineString' && multiCurve === true) {
          nodeName = 'MultiCurve';
        }
      } else {
        nodeName = 'Envelope';
      }
      return (0, _xml.createElementNS)('http://www.opengis.net/gml', nodeName);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/Feature} feature Feature.
     * @param {Array<*>} objectStack Node stack.
     */

  }, {
    key: 'writeFeatureElement',
    value: function writeFeatureElement(node, feature, objectStack) {
      var fid = feature.getId();
      if (fid) {
        node.setAttribute('fid', fid);
      }
      var context = /** @type {Object} */objectStack[objectStack.length - 1];
      var featureNS = context['featureNS'];
      var geometryName = feature.getGeometryName();
      if (!context.serializers) {
        context.serializers = {};
        context.serializers[featureNS] = {};
      }
      var properties = feature.getProperties();
      var keys = [];
      var values = [];
      for (var key in properties) {
        var value = properties[key];
        if (value !== null) {
          keys.push(key);
          values.push(value);
          if (key == geometryName || value instanceof _Geometry2.default) {
            if (!(key in context.serializers[featureNS])) {
              context.serializers[featureNS][key] = (0, _xml.makeChildAppender)(this.writeGeometryElement, this);
            }
          } else {
            if (!(key in context.serializers[featureNS])) {
              context.serializers[featureNS][key] = (0, _xml.makeChildAppender)(_xsd.writeStringTextNode);
            }
          }
        }
      }
      var item = (0, _obj.assign)({}, context);
      item.node = node;
      (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */
      item, context.serializers, (0, _xml.makeSimpleNodeFactory)(undefined, featureNS), values, objectStack, keys);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LineString} geometry LineString geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeCurveOrLineString_',
    value: function writeCurveOrLineString_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var srsName = context['srsName'];
      if (node.nodeName !== 'LineStringSegment' && srsName) {
        node.setAttribute('srsName', srsName);
      }
      if (node.nodeName === 'LineString' || node.nodeName === 'LineStringSegment') {
        var coordinates = this.createCoordinatesNode_(node.namespaceURI);
        node.appendChild(coordinates);
        this.writeCoordinates_(coordinates, geometry, objectStack);
      } else if (node.nodeName === 'Curve') {
        var segments = (0, _xml.createElementNS)(node.namespaceURI, 'segments');
        node.appendChild(segments);
        this.writeCurveSegments_(segments, geometry, objectStack);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LineString} line LineString geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeLineStringOrCurveMember_',
    value: function writeLineStringOrCurveMember_(node, line, objectStack) {
      var child = this.GEOMETRY_NODE_FACTORY_(line, objectStack);
      if (child) {
        node.appendChild(child);
        this.writeCurveOrLineString_(child, line, objectStack);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/MultiLineString} geometry MultiLineString geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeMultiCurveOrLineString_',
    value: function writeMultiCurveOrLineString_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      var curve = context['curve'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var lines = geometry.getLineStrings();
      (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName, curve: curve }, this.LINESTRINGORCURVEMEMBER_SERIALIZERS_, this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_, lines, objectStack, undefined, this);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Geometry|module:ol/extent~Extent} geometry Geometry.
     * @param {Array<*>} objectStack Node stack.
     */

  }, {
    key: 'writeGeometryElement',
    value: function writeGeometryElement(node, geometry, objectStack) {
      var context = /** @type {module:ol/format/Feature~WriteOptions} */objectStack[objectStack.length - 1];
      var item = (0, _obj.assign)({}, context);
      item.node = node;
      var value = void 0;
      if (Array.isArray(geometry)) {
        if (context.dataProjection) {
          value = (0, _proj.transformExtent)(geometry, context.featureProjection, context.dataProjection);
        } else {
          value = geometry;
        }
      } else {
        value = (0, _Feature.transformWithOptions)( /** @type {module:ol/geom/Geometry} */geometry, true, context);
      }
      (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */
      item, this.GEOMETRY_SERIALIZERS_, this.GEOMETRY_NODE_FACTORY_, [value], objectStack, undefined, this);
    }

    /**
     * @param {string} namespaceURI XML namespace.
     * @returns {Node} coordinates node.
     * @private
     */

  }, {
    key: 'createCoordinatesNode_',
    value: function createCoordinatesNode_(namespaceURI) {
      var coordinates = (0, _xml.createElementNS)(namespaceURI, 'coordinates');
      coordinates.setAttribute('decimal', '.');
      coordinates.setAttribute('cs', ',');
      coordinates.setAttribute('ts', ' ');

      return coordinates;
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LineString|module:ol/geom/LinearRing} value Geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeCoordinates_',
    value: function writeCoordinates_(node, value, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      // only 2d for simple features profile
      var points = value.getCoordinates();
      var len = points.length;
      var parts = new Array(len);
      for (var i = 0; i < len; ++i) {
        var point = points[i];
        parts[i] = this.getCoords_(point, srsName, hasZ);
      }
      (0, _xsd.writeStringTextNode)(node, parts.join(' '));
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LineString} line LineString geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeCurveSegments_',
    value: function writeCurveSegments_(node, line, objectStack) {
      var child = (0, _xml.createElementNS)(node.namespaceURI, 'LineStringSegment');
      node.appendChild(child);
      this.writeCurveOrLineString_(child, line, objectStack);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Polygon} geometry Polygon geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeSurfaceOrPolygon_',
    value: function writeSurfaceOrPolygon_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      if (node.nodeName !== 'PolygonPatch' && srsName) {
        node.setAttribute('srsName', srsName);
      }
      if (node.nodeName === 'Polygon' || node.nodeName === 'PolygonPatch') {
        var rings = geometry.getLinearRings();
        (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName }, this.RING_SERIALIZERS_, this.RING_NODE_FACTORY_, rings, objectStack, undefined, this);
      } else if (node.nodeName === 'Surface') {
        var patches = (0, _xml.createElementNS)(node.namespaceURI, 'patches');
        node.appendChild(patches);
        this.writeSurfacePatches_(patches, geometry, objectStack);
      }
    }

    /**
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string=} opt_nodeName Node name.
     * @return {Node} Node.
     * @private
     */

  }, {
    key: 'RING_NODE_FACTORY_',
    value: function RING_NODE_FACTORY_(value, objectStack, opt_nodeName) {
      var context = objectStack[objectStack.length - 1];
      var parentNode = context.node;
      var exteriorWritten = context['exteriorWritten'];
      if (exteriorWritten === undefined) {
        context['exteriorWritten'] = true;
      }
      return (0, _xml.createElementNS)(parentNode.namespaceURI, exteriorWritten !== undefined ? 'innerBoundaryIs' : 'outerBoundaryIs');
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Polygon} polygon Polygon geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeSurfacePatches_',
    value: function writeSurfacePatches_(node, polygon, objectStack) {
      var child = (0, _xml.createElementNS)(node.namespaceURI, 'PolygonPatch');
      node.appendChild(child);
      this.writeSurfaceOrPolygon_(child, polygon, objectStack);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LinearRing} ring LinearRing geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeRing_',
    value: function writeRing_(node, ring, objectStack) {
      var linearRing = (0, _xml.createElementNS)(node.namespaceURI, 'LinearRing');
      node.appendChild(linearRing);
      this.writeLinearRing_(linearRing, ring, objectStack);
    }

    /**
     * @param {Array<number>} point Point geometry.
     * @param {string=} opt_srsName Optional srsName
     * @param {boolean=} opt_hasZ whether the geometry has a Z coordinate (is 3D) or not.
     * @return {string} The coords string.
     * @private
     */

  }, {
    key: 'getCoords_',
    value: function getCoords_(point, opt_srsName, opt_hasZ) {
      var axisOrientation = 'enu';
      if (opt_srsName) {
        axisOrientation = (0, _proj.get)(opt_srsName).getAxisOrientation();
      }
      var coords = axisOrientation.substr(0, 2) === 'en' ? point[0] + ',' + point[1] : point[1] + ',' + point[0];
      if (opt_hasZ) {
        // For newly created points, Z can be undefined.
        var z = point[2] || 0;
        coords += ',' + z;
      }

      return coords;
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Point} geometry Point geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writePoint_',
    value: function writePoint_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var coordinates = this.createCoordinatesNode_(node.namespaceURI);
      node.appendChild(coordinates);
      var point = geometry.getCoordinates();
      var coord = this.getCoords_(point, srsName, hasZ);
      (0, _xsd.writeStringTextNode)(coordinates, coord);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/MultiPoint} geometry MultiPoint geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeMultiPoint_',
    value: function writeMultiPoint_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var points = geometry.getPoints();
      (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName }, this.POINTMEMBER_SERIALIZERS_, (0, _xml.makeSimpleNodeFactory)('pointMember'), points, objectStack, undefined, this);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Point} point Point geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writePointMember_',
    value: function writePointMember_(node, point, objectStack) {
      var child = (0, _xml.createElementNS)(node.namespaceURI, 'Point');
      node.appendChild(child);
      this.writePoint_(child, point, objectStack);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/LinearRing} geometry LinearRing geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeLinearRing_',
    value: function writeLinearRing_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var srsName = context['srsName'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var coordinates = this.createCoordinatesNode_(node.namespaceURI);
      node.appendChild(coordinates);
      this.writeCoordinates_(coordinates, geometry, objectStack);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/MultiPolygon} geometry MultiPolygon geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeMultiSurfaceOrPolygon_',
    value: function writeMultiSurfaceOrPolygon_(node, geometry, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var hasZ = context['hasZ'];
      var srsName = context['srsName'];
      var surface = context['surface'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var polygons = geometry.getPolygons();
      (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName, surface: surface }, this.SURFACEORPOLYGONMEMBER_SERIALIZERS_, this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_, polygons, objectStack, undefined, this);
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/geom/Polygon} polygon Polygon geometry.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeSurfaceOrPolygonMember_',
    value: function writeSurfaceOrPolygonMember_(node, polygon, objectStack) {
      var child = this.GEOMETRY_NODE_FACTORY_(polygon, objectStack);
      if (child) {
        node.appendChild(child);
        this.writeSurfaceOrPolygon_(child, polygon, objectStack);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {Array<*>} objectStack Node stack.
     * @private
     */

  }, {
    key: 'writeEnvelope',
    value: function writeEnvelope(node, extent, objectStack) {
      var context = objectStack[objectStack.length - 1];
      var srsName = context['srsName'];
      if (srsName) {
        node.setAttribute('srsName', srsName);
      }
      var keys = ['lowerCorner', 'upperCorner'];
      var values = [extent[0] + ' ' + extent[1], extent[2] + ' ' + extent[3]];
      (0, _xml.pushSerializeAndPop)( /** @type {module:ol/xml~NodeStackItem} */
      { node: node }, this.ENVELOPE_SERIALIZERS_, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, keys, this);
    }

    /**
     * @const
     * @param {*} value Value.
     * @param {Array<*>} objectStack Object stack.
     * @param {string=} opt_nodeName Node name.
     * @return {Node|undefined} Node.
     * @private
     */

  }, {
    key: 'MULTIGEOMETRY_MEMBER_NODE_FACTORY_',
    value: function MULTIGEOMETRY_MEMBER_NODE_FACTORY_(value, objectStack, opt_nodeName) {
      var parentNode = objectStack[objectStack.length - 1].node;
      return (0, _xml.createElementNS)('http://www.opengis.net/gml', MULTIGEOMETRY_TO_MEMBER_NODENAME[parentNode.nodeName]);
    }
  }]);

  return GML2;
}(_GMLBase3.default);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */


GML2.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'coordinates': (0, _xml.makeReplacer)(GML2.prototype.readFlatCoordinates_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GML2.prototype.FLAT_LINEAR_RINGS_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'innerBoundaryIs': GML2.prototype.innerBoundaryIsParser_,
    'outerBoundaryIs': GML2.prototype.outerBoundaryIsParser_
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GML2.prototype.BOX_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'coordinates': (0, _xml.makeArrayPusher)(GML2.prototype.readFlatCoordinates_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GML2.prototype.GEOMETRY_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Point': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readPoint),
    'MultiPoint': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readMultiPoint),
    'LineString': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readLineString),
    'MultiLineString': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readMultiLineString),
    'LinearRing': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readLinearRing),
    'Polygon': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readPolygon),
    'MultiPolygon': (0, _xml.makeReplacer)(_GMLBase3.default.prototype.readMultiPolygon),
    'Box': (0, _xml.makeReplacer)(GML2.prototype.readBox_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.GEOMETRY_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'Curve': (0, _xml.makeChildAppender)(GML2.prototype.writeCurveOrLineString_),
    'MultiCurve': (0, _xml.makeChildAppender)(GML2.prototype.writeMultiCurveOrLineString_),
    'Point': (0, _xml.makeChildAppender)(GML2.prototype.writePoint_),
    'MultiPoint': (0, _xml.makeChildAppender)(GML2.prototype.writeMultiPoint_),
    'LineString': (0, _xml.makeChildAppender)(GML2.prototype.writeCurveOrLineString_),
    'MultiLineString': (0, _xml.makeChildAppender)(GML2.prototype.writeMultiCurveOrLineString_),
    'LinearRing': (0, _xml.makeChildAppender)(GML2.prototype.writeLinearRing_),
    'Polygon': (0, _xml.makeChildAppender)(GML2.prototype.writeSurfaceOrPolygon_),
    'MultiPolygon': (0, _xml.makeChildAppender)(GML2.prototype.writeMultiSurfaceOrPolygon_),
    'Surface': (0, _xml.makeChildAppender)(GML2.prototype.writeSurfaceOrPolygon_),
    'MultiSurface': (0, _xml.makeChildAppender)(GML2.prototype.writeMultiSurfaceOrPolygon_),
    'Envelope': (0, _xml.makeChildAppender)(GML2.prototype.writeEnvelope)
  }
};

/**
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'lineStringMember': (0, _xml.makeChildAppender)(GML2.prototype.writeLineStringOrCurveMember_),
    'curveMember': (0, _xml.makeChildAppender)(GML2.prototype.writeLineStringOrCurveMember_)
  }
};

/**
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.RING_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'outerBoundaryIs': (0, _xml.makeChildAppender)(GML2.prototype.writeRing_),
    'innerBoundaryIs': (0, _xml.makeChildAppender)(GML2.prototype.writeRing_)
  }
};

/**
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.POINTMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'pointMember': (0, _xml.makeChildAppender)(GML2.prototype.writePointMember_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'surfaceMember': (0, _xml.makeChildAppender)(GML2.prototype.writeSurfaceOrPolygonMember_),
    'polygonMember': (0, _xml.makeChildAppender)(GML2.prototype.writeSurfaceOrPolygonMember_)
  }
};

/**
 * @type {Object<string, Object<string, module:ol/xml~Serializer>>}
 * @private
 */
GML2.prototype.ENVELOPE_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'lowerCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
    'upperCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
  }
};

exports.default = GML2;