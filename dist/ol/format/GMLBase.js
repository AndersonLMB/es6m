'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GMLNS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _XMLFeature2 = require('../format/XMLFeature.js');

var _XMLFeature3 = _interopRequireDefault(_XMLFeature2);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _LinearRing = require('../geom/LinearRing.js');

var _LinearRing2 = _interopRequireDefault(_LinearRing);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _MultiPoint = require('../geom/MultiPoint.js');

var _MultiPoint2 = _interopRequireDefault(_MultiPoint);

var _MultiPolygon = require('../geom/MultiPolygon.js');

var _MultiPolygon2 = _interopRequireDefault(_MultiPolygon);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/GMLBase
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// FIXME Envelopes should not be treated as geometries! readEnvelope_ is part
// of GEOMETRY_PARSERS_ and methods using GEOMETRY_PARSERS_ do not expect
// envelopes/extents, only geometries!


/**
 * @const
 * @type {string}
 */
var GMLNS = exports.GMLNS = 'http://www.opengis.net/gml';

/**
 * A regular expression that matches if a string only contains whitespace
 * characters. It will e.g. match `''`, `' '`, `'\n'` etc. The non-breaking
 * space (0xa0) is explicitly included as IE doesn't include it in its
 * definition of `\s`.
 *
 * Information from `goog.string.isEmptyOrWhitespace`: https://github.com/google/closure-library/blob/e877b1e/closure/goog/string/string.js#L156-L160
 *
 * @const
 * @type {RegExp}
 */
var ONLY_WHITESPACE_RE = /^[\s\xa0]*$/;

/**
 * @typedef {Object} Options
 * @property {Object<string, string>|string} [featureNS] Feature
 * namespace. If not defined will be derived from GML. If multiple
 * feature types have been configured which come from different feature
 * namespaces, this will be an object with the keys being the prefixes used
 * in the entries of featureType array. The values of the object will be the
 * feature namespaces themselves. So for instance there might be a featureType
 * item `topp:states` in the `featureType` array and then there will be a key
 * `topp` in the featureNS object with value `http://www.openplans.org/topp`.
 * @property {Array<string>|string} [featureType] Feature type(s) to parse.
 * If multiple feature types need to be configured
 * which come from different feature namespaces, `featureNS` will be an object
 * with the keys being the prefixes used in the entries of featureType array.
 * The values of the object will be the feature namespaces themselves.
 * So for instance there might be a featureType item `topp:states` and then
 * there will be a key named `topp` in the featureNS object with value
 * `http://www.openplans.org/topp`.
 * @property {string} srsName srsName to use when writing geometries.
 * @property {boolean} [surface=false] Write gml:Surface instead of gml:Polygon
 * elements. This also affects the elements in multi-part geometries.
 * @property {boolean} [curve=false] Write gml:Curve instead of gml:LineString
 * elements. This also affects the elements in multi-part geometries.
 * @property {boolean} [multiCurve=true] Write gml:MultiCurve instead of gml:MultiLineString.
 * Since the latter is deprecated in GML 3.
 * @property {boolean} [multiSurface=true] Write gml:multiSurface instead of
 * gml:MultiPolygon. Since the latter is deprecated in GML 3.
 * @property {string} [schemaLocation] Optional schemaLocation to use when
 * writing out the GML, this will override the default provided.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Feature base format for reading and writing data in the GML format.
 * This class cannot be instantiated, it contains only base content that
 * is shared with versioned format classes GML2 and GML3.
 *
 * @abstract
 */

var GMLBase = function (_XMLFeature) {
  _inherits(GMLBase, _XMLFeature);

  /**
   * @param {module:ol/format/GMLBase~Options=} opt_options Optional configuration object.
   */
  function GMLBase(opt_options) {
    _classCallCheck(this, GMLBase);

    var _this = _possibleConstructorReturn(this, (GMLBase.__proto__ || Object.getPrototypeOf(GMLBase)).call(this));

    var options = /** @type {module:ol/format/GMLBase~Options} */opt_options ? opt_options : {};

    /**
     * @protected
     * @type {Array<string>|string|undefined}
     */
    _this.featureType = options.featureType;

    /**
     * @protected
     * @type {Object<string, string>|string|undefined}
     */
    _this.featureNS = options.featureNS;

    /**
     * @protected
     * @type {string}
     */
    _this.srsName = options.srsName;

    /**
     * @protected
     * @type {string}
     */
    _this.schemaLocation = '';

    /**
     * @type {Object<string, Object<string, Object>>}
     */
    _this.FEATURE_COLLECTION_PARSERS = {};
    _this.FEATURE_COLLECTION_PARSERS[GMLNS] = {
      'featureMember': (0, _xml.makeReplacer)(_this.readFeaturesInternal),
      'featureMembers': (0, _xml.makeReplacer)(_this.readFeaturesInternal)
    };

    return _this;
  }

  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<module:ol/Feature> | undefined} Features.
   */


  _createClass(GMLBase, [{
    key: 'readFeaturesInternal',
    value: function readFeaturesInternal(node, objectStack) {
      var localName = node.localName;
      var features = null;
      if (localName == 'FeatureCollection') {
        if (node.namespaceURI === 'http://www.opengis.net/wfs') {
          features = (0, _xml.pushParseAndPop)([], this.FEATURE_COLLECTION_PARSERS, node, objectStack, this);
        } else {
          features = (0, _xml.pushParseAndPop)(null, this.FEATURE_COLLECTION_PARSERS, node, objectStack, this);
        }
      } else if (localName == 'featureMembers' || localName == 'featureMember') {
        var context = objectStack[0];
        var featureType = context['featureType'];
        var featureNS = context['featureNS'];
        var prefix = 'p';
        var defaultPrefix = 'p0';
        if (!featureType && node.childNodes) {
          featureType = [], featureNS = {};
          for (var i = 0, ii = node.childNodes.length; i < ii; ++i) {
            var child = node.childNodes[i];
            if (child.nodeType === 1) {
              var ft = child.nodeName.split(':').pop();
              if (featureType.indexOf(ft) === -1) {
                var key = '';
                var count = 0;
                var uri = child.namespaceURI;
                for (var candidate in featureNS) {
                  if (featureNS[candidate] === uri) {
                    key = candidate;
                    break;
                  }
                  ++count;
                }
                if (!key) {
                  key = prefix + count;
                  featureNS[key] = uri;
                }
                featureType.push(key + ':' + ft);
              }
            }
          }
          if (localName != 'featureMember') {
            // recheck featureType for each featureMember
            context['featureType'] = featureType;
            context['featureNS'] = featureNS;
          }
        }
        if (typeof featureNS === 'string') {
          var ns = featureNS;
          featureNS = {};
          featureNS[defaultPrefix] = ns;
        }
        var parsersNS = {};
        var featureTypes = Array.isArray(featureType) ? featureType : [featureType];
        for (var p in featureNS) {
          var parsers = {};
          for (var _i = 0, _ii = featureTypes.length; _i < _ii; ++_i) {
            var featurePrefix = featureTypes[_i].indexOf(':') === -1 ? defaultPrefix : featureTypes[_i].split(':')[0];
            if (featurePrefix === p) {
              parsers[featureTypes[_i].split(':').pop()] = localName == 'featureMembers' ? (0, _xml.makeArrayPusher)(this.readFeatureElement, this) : (0, _xml.makeReplacer)(this.readFeatureElement, this);
            }
          }
          parsersNS[featureNS[p]] = parsers;
        }
        if (localName == 'featureMember') {
          features = (0, _xml.pushParseAndPop)(undefined, parsersNS, node, objectStack);
        } else {
          features = (0, _xml.pushParseAndPop)([], parsersNS, node, objectStack);
        }
      }
      if (features === null) {
        features = [];
      }
      return features;
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/Geometry|undefined} Geometry.
     */

  }, {
    key: 'readGeometryElement',
    value: function readGeometryElement(node, objectStack) {
      var context = /** @type {Object} */objectStack[0];
      context['srsName'] = node.firstElementChild.getAttribute('srsName');
      context['srsDimension'] = node.firstElementChild.getAttribute('srsDimension');
      /** @type {module:ol/geom/Geometry} */
      var geometry = (0, _xml.pushParseAndPop)(null, this.GEOMETRY_PARSERS_, node, objectStack, this);
      if (geometry) {
        return (
          /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, false, context)
        );
      } else {
        return undefined;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeatureElement',
    value: function readFeatureElement(node, objectStack) {
      var n = void 0;
      var fid = node.getAttribute('fid') || (0, _xml.getAttributeNS)(node, GMLNS, 'id');
      var values = {};
      var geometryName = void 0;
      for (n = node.firstElementChild; n; n = n.nextElementSibling) {
        var localName = n.localName;
        // Assume attribute elements have one child node and that the child
        // is a text or CDATA node (to be treated as text).
        // Otherwise assume it is a geometry node.
        if (n.childNodes.length === 0 || n.childNodes.length === 1 && (n.firstChild.nodeType === 3 || n.firstChild.nodeType === 4)) {
          var value = (0, _xml.getAllTextContent)(n, false);
          if (ONLY_WHITESPACE_RE.test(value)) {
            value = undefined;
          }
          values[localName] = value;
        } else {
          // boundedBy is an extent and must not be considered as a geometry
          if (localName !== 'boundedBy') {
            geometryName = localName;
          }
          values[localName] = this.readGeometryElement(n, objectStack);
        }
      }
      var feature = new _Feature2.default(values);
      if (geometryName) {
        feature.setGeometryName(geometryName);
      }
      if (fid) {
        feature.setId(fid);
      }
      return feature;
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/Point|undefined} Point.
     */

  }, {
    key: 'readPoint',
    value: function readPoint(node, objectStack) {
      var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
      if (flatCoordinates) {
        return new _Point2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/MultiPoint|undefined} MultiPoint.
     */

  }, {
    key: 'readMultiPoint',
    value: function readMultiPoint(node, objectStack) {
      /** @type {Array<Array<number>>} */
      var coordinates = (0, _xml.pushParseAndPop)([], this.MULTIPOINT_PARSERS_, node, objectStack, this);
      if (coordinates) {
        return new _MultiPoint2.default(coordinates);
      } else {
        return undefined;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/MultiLineString|undefined} MultiLineString.
     */

  }, {
    key: 'readMultiLineString',
    value: function readMultiLineString(node, objectStack) {
      /** @type {Array<module:ol/geom/LineString>} */
      var lineStrings = (0, _xml.pushParseAndPop)([], this.MULTILINESTRING_PARSERS_, node, objectStack, this);
      if (lineStrings) {
        return new _MultiLineString2.default(lineStrings);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/MultiPolygon|undefined} MultiPolygon.
     */

  }, {
    key: 'readMultiPolygon',
    value: function readMultiPolygon(node, objectStack) {
      /** @type {Array<module:ol/geom/Polygon>} */
      var polygons = (0, _xml.pushParseAndPop)([], this.MULTIPOLYGON_PARSERS_, node, objectStack, this);
      if (polygons) {
        return new _MultiPolygon2.default(polygons);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     */

  }, {
    key: 'pointMemberParser_',
    value: function pointMemberParser_(node, objectStack) {
      (0, _xml.parseNode)(this.POINTMEMBER_PARSERS_, node, objectStack, this);
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     */

  }, {
    key: 'lineStringMemberParser_',
    value: function lineStringMemberParser_(node, objectStack) {
      (0, _xml.parseNode)(this.LINESTRINGMEMBER_PARSERS_, node, objectStack, this);
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     */

  }, {
    key: 'polygonMemberParser_',
    value: function polygonMemberParser_(node, objectStack) {
      (0, _xml.parseNode)(this.POLYGONMEMBER_PARSERS_, node, objectStack, this);
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/LineString|undefined} LineString.
     */

  }, {
    key: 'readLineString',
    value: function readLineString(node, objectStack) {
      var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
      if (flatCoordinates) {
        var lineString = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
        return lineString;
      } else {
        return undefined;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     * @return {Array<number>|undefined} LinearRing flat coordinates.
     */

  }, {
    key: 'readFlatLinearRing_',
    value: function readFlatLinearRing_(node, objectStack) {
      var ring = (0, _xml.pushParseAndPop)(null, this.GEOMETRY_FLAT_COORDINATES_PARSERS_, node, objectStack, this);
      if (ring) {
        return ring;
      } else {
        return undefined;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/LinearRing|undefined} LinearRing.
     */

  }, {
    key: 'readLinearRing',
    value: function readLinearRing(node, objectStack) {
      var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
      if (flatCoordinates) {
        return new _LinearRing2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {module:ol/geom/Polygon|undefined} Polygon.
     */

  }, {
    key: 'readPolygon',
    value: function readPolygon(node, objectStack) {
      /** @type {Array<Array<number>>} */
      var flatLinearRings = (0, _xml.pushParseAndPop)([null], this.FLAT_LINEAR_RINGS_PARSERS_, node, objectStack, this);
      if (flatLinearRings && flatLinearRings[0]) {
        var flatCoordinates = flatLinearRings[0];
        var ends = [flatCoordinates.length];
        var i = void 0,
            ii = void 0;
        for (i = 1, ii = flatLinearRings.length; i < ii; ++i) {
          (0, _array.extend)(flatCoordinates, flatLinearRings[i]);
          ends.push(flatCoordinates.length);
        }
        return new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XYZ, ends);
      } else {
        return undefined;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @private
     * @return {Array<number>} Flat coordinates.
     */

  }, {
    key: 'readFlatCoordinatesFromNode_',
    value: function readFlatCoordinatesFromNode_(node, objectStack) {
      return (0, _xml.pushParseAndPop)(null, this.GEOMETRY_FLAT_COORDINATES_PARSERS_, node, objectStack, this);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometryFromNode',
    value: function readGeometryFromNode(node, opt_options) {
      var geometry = this.readGeometryElement(node, [this.getReadOptions(node, opt_options ? opt_options : {})]);
      return geometry ? geometry : null;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromNode',
    value: function readFeaturesFromNode(node, opt_options) {
      var options = {
        featureType: this.featureType,
        featureNS: this.featureNS
      };
      if (opt_options) {
        (0, _obj.assign)(options, this.getReadOptions(node, opt_options));
      }
      var features = this.readFeaturesInternal(node, [options]);
      return features || [];
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readProjectionFromNode',
    value: function readProjectionFromNode(node) {
      return (0, _proj.get)(this.srsName ? this.srsName : node.firstElementChild.getAttribute('srsName'));
    }
  }]);

  return GMLBase;
}(_XMLFeature3.default);

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */


GMLBase.prototype.MULTIPOINT_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'pointMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.pointMemberParser_),
    'pointMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.pointMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GMLBase.prototype.MULTILINESTRING_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'lineStringMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.lineStringMemberParser_),
    'lineStringMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.lineStringMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GMLBase.prototype.MULTIPOLYGON_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'polygonMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.polygonMemberParser_),
    'polygonMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.polygonMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GMLBase.prototype.POINTMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Point': (0, _xml.makeArrayPusher)(GMLBase.prototype.readFlatCoordinatesFromNode_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GMLBase.prototype.LINESTRINGMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'LineString': (0, _xml.makeArrayPusher)(GMLBase.prototype.readLineString)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @private
 */
GMLBase.prototype.POLYGONMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Polygon': (0, _xml.makeArrayPusher)(GMLBase.prototype.readPolygon)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, module:ol/xml~Parser>>}
 * @protected
 */
GMLBase.prototype.RING_PARSERS = {
  'http://www.opengis.net/gml': {
    'LinearRing': (0, _xml.makeReplacer)(GMLBase.prototype.readFlatLinearRing_)
  }
};

exports.default = GMLBase;