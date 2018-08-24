'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _JSONFeature2 = require('../format/JSONFeature.js');

var _JSONFeature3 = _interopRequireDefault(_JSONFeature2);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

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

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/TopoJSON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {module:ol/proj~ProjectionLike} [dataProjection='EPSG:4326'] Default data projection.
 * @property {string} [layerName] Set the name of the TopoJSON topology
 * `objects`'s children as feature property with the specified name. This means
 * that when set to `'layer'`, a topology like
 * ```
 * {
 *   "type": "Topology",
 *   "objects": {
 *     "example": {
 *       "type": "GeometryCollection",
 *       "geometries": []
 *     }
 *   }
 * }
 * ```
 * will result in features that have a property `'layer'` set to `'example'`.
 * When not set, no property will be added to features.
 * @property {Array<string>} [layers] Names of the TopoJSON topology's
 * `objects`'s children to read features from.  If not provided, features will
 * be read from all children.
 */

/**
 * @classdesc
 * Feature format for reading data in the TopoJSON format.
 *
 * @api
 */
var TopoJSON = function (_JSONFeature) {
  _inherits(TopoJSON, _JSONFeature);

  /**
   * @param {module:ol/format/TopoJSON~Options=} opt_options Options.
   */
  function TopoJSON(opt_options) {
    _classCallCheck(this, TopoJSON);

    var _this = _possibleConstructorReturn(this, (TopoJSON.__proto__ || Object.getPrototypeOf(TopoJSON)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {string|undefined}
     */
    _this.layerName_ = options.layerName;

    /**
     * @private
     * @type {Array<string>}
     */
    _this.layers_ = options.layers ? options.layers : null;

    /**
     * @inheritDoc
     */
    _this.dataProjection = (0, _proj.get)(options.dataProjection ? options.dataProjection : 'EPSG:4326');

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(TopoJSON, [{
    key: 'readFeaturesFromObject',
    value: function readFeaturesFromObject(object, opt_options) {
      if (object.type == 'Topology') {
        var topoJSONTopology = /** @type {TopoJSONTopology} */object;
        var transform = void 0,
            scale = null,
            translate = null;
        if (topoJSONTopology.transform) {
          transform = topoJSONTopology.transform;
          scale = transform.scale;
          translate = transform.translate;
        }
        var arcs = topoJSONTopology.arcs;
        if (transform) {
          transformArcs(arcs, scale, translate);
        }
        /** @type {Array<module:ol/Feature>} */
        var features = [];
        var topoJSONFeatures = topoJSONTopology.objects;
        var property = this.layerName_;
        var feature = void 0;
        for (var objectName in topoJSONFeatures) {
          if (this.layers_ && this.layers_.indexOf(objectName) == -1) {
            continue;
          }
          if (topoJSONFeatures[objectName].type === 'GeometryCollection') {
            feature = /** @type {TopoJSONGeometryCollection} */topoJSONFeatures[objectName];
            features.push.apply(features, readFeaturesFromGeometryCollection(feature, arcs, scale, translate, property, objectName, opt_options));
          } else {
            feature = /** @type {TopoJSONGeometry} */topoJSONFeatures[objectName];
            features.push(readFeatureFromGeometry(feature, arcs, scale, translate, property, objectName, opt_options));
          }
        }
        return features;
      } else {
        return [];
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readProjectionFromObject',
    value: function readProjectionFromObject(object) {
      return this.dataProjection;
    }
  }]);

  return TopoJSON;
}(_JSONFeature3.default);

/**
 * @const
 * @type {Object<string, function(TopoJSONGeometry, Array, ...Array): module:ol/geom/Geometry>}
 */


var GEOMETRY_READERS = {
  'Point': readPointGeometry,
  'LineString': readLineStringGeometry,
  'Polygon': readPolygonGeometry,
  'MultiPoint': readMultiPointGeometry,
  'MultiLineString': readMultiLineStringGeometry,
  'MultiPolygon': readMultiPolygonGeometry
};

/**
 * Concatenate arcs into a coordinate array.
 * @param {Array<number>} indices Indices of arcs to concatenate.  Negative
 *     values indicate arcs need to be reversed.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs (already
 *     transformed).
 * @return {Array<module:ol/coordinate~Coordinate>} Coordinates array.
 */
function concatenateArcs(indices, arcs) {
  /** @type {Array<module:ol/coordinate~Coordinate>} */
  var coordinates = [];
  var index = void 0,
      arc = void 0;
  for (var i = 0, ii = indices.length; i < ii; ++i) {
    index = indices[i];
    if (i > 0) {
      // splicing together arcs, discard last point
      coordinates.pop();
    }
    if (index >= 0) {
      // forward arc
      arc = arcs[index];
    } else {
      // reverse arc
      arc = arcs[~index].slice().reverse();
    }
    coordinates.push.apply(coordinates, arc);
  }
  // provide fresh copies of coordinate arrays
  for (var j = 0, jj = coordinates.length; j < jj; ++j) {
    coordinates[j] = coordinates[j].slice();
  }
  return coordinates;
}

/**
 * Create a point from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 * @return {module:ol/geom/Point} Geometry.
 */
function readPointGeometry(object, scale, translate) {
  var coordinates = object.coordinates;
  if (scale && translate) {
    transformVertex(coordinates, scale, translate);
  }
  return new _Point2.default(coordinates);
}

/**
 * Create a multi-point from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 * @return {module:ol/geom/MultiPoint} Geometry.
 */
function readMultiPointGeometry(object, scale, translate) {
  var coordinates = object.coordinates;
  if (scale && translate) {
    for (var i = 0, ii = coordinates.length; i < ii; ++i) {
      transformVertex(coordinates[i], scale, translate);
    }
  }
  return new _MultiPoint2.default(coordinates);
}

/**
 * Create a linestring from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @return {module:ol/geom/LineString} Geometry.
 */
function readLineStringGeometry(object, arcs) {
  var coordinates = concatenateArcs(object.arcs, arcs);
  return new _LineString2.default(coordinates);
}

/**
 * Create a multi-linestring from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @return {module:ol/geom/MultiLineString} Geometry.
 */
function readMultiLineStringGeometry(object, arcs) {
  var coordinates = [];
  for (var i = 0, ii = object.arcs.length; i < ii; ++i) {
    coordinates[i] = concatenateArcs(object.arcs[i], arcs);
  }
  return new _MultiLineString2.default(coordinates);
}

/**
 * Create a polygon from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @return {module:ol/geom/Polygon} Geometry.
 */
function readPolygonGeometry(object, arcs) {
  var coordinates = [];
  for (var i = 0, ii = object.arcs.length; i < ii; ++i) {
    coordinates[i] = concatenateArcs(object.arcs[i], arcs);
  }
  return new _Polygon2.default(coordinates);
}

/**
 * Create a multi-polygon from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @return {module:ol/geom/MultiPolygon} Geometry.
 */
function readMultiPolygonGeometry(object, arcs) {
  var coordinates = [];
  for (var i = 0, ii = object.arcs.length; i < ii; ++i) {
    // for each polygon
    var polyArray = object.arcs[i];
    var ringCoords = [];
    for (var j = 0, jj = polyArray.length; j < jj; ++j) {
      // for each ring
      ringCoords[j] = concatenateArcs(polyArray[j], arcs);
    }
    coordinates[i] = ringCoords;
  }
  return new _MultiPolygon2.default(coordinates);
}

/**
 * Create features from a TopoJSON GeometryCollection object.
 *
 * @param {TopoJSONGeometryCollection} collection TopoJSON Geometry
 *     object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 * @param {string|undefined} property Property to set the `GeometryCollection`'s parent
 *     object to.
 * @param {string} name Name of the `Topology`'s child object.
 * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
 * @return {Array<module:ol/Feature>} Array of features.
 */
function readFeaturesFromGeometryCollection(collection, arcs, scale, translate, property, name, opt_options) {
  var geometries = collection.geometries;
  var features = [];
  for (var i = 0, ii = geometries.length; i < ii; ++i) {
    features[i] = readFeatureFromGeometry(geometries[i], arcs, scale, translate, property, name, opt_options);
  }
  return features;
}

/**
 * Create a feature from a TopoJSON geometry object.
 *
 * @param {TopoJSONGeometry} object TopoJSON geometry object.
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 * @param {string|undefined} property Property to set the `GeometryCollection`'s parent
 *     object to.
 * @param {string} name Name of the `Topology`'s child object.
 * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
 * @return {module:ol/Feature} Feature.
 */
function readFeatureFromGeometry(object, arcs, scale, translate, property, name, opt_options) {
  var geometry = void 0;
  var type = object.type;
  var geometryReader = GEOMETRY_READERS[type];
  if (type === 'Point' || type === 'MultiPoint') {
    geometry = geometryReader(object, scale, translate);
  } else {
    geometry = geometryReader(object, arcs);
  }
  var feature = new _Feature2.default();
  feature.setGeometry( /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, false, opt_options));
  if (object.id !== undefined) {
    feature.setId(object.id);
  }
  var properties = object.properties;
  if (property) {
    if (!properties) {
      properties = {};
    }
    properties[property] = name;
  }
  if (properties) {
    feature.setProperties(properties);
  }
  return feature;
}

/**
 * Apply a linear transform to array of arcs.  The provided array of arcs is
 * modified in place.
 *
 * @param {Array<Array<module:ol/coordinate~Coordinate>>} arcs Array of arcs.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 */
function transformArcs(arcs, scale, translate) {
  for (var i = 0, ii = arcs.length; i < ii; ++i) {
    transformArc(arcs[i], scale, translate);
  }
}

/**
 * Apply a linear transform to an arc.  The provided arc is modified in place.
 *
 * @param {Array<module:ol/coordinate~Coordinate>} arc Arc.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 */
function transformArc(arc, scale, translate) {
  var x = 0;
  var y = 0;
  for (var i = 0, ii = arc.length; i < ii; ++i) {
    var vertex = arc[i];
    x += vertex[0];
    y += vertex[1];
    vertex[0] = x;
    vertex[1] = y;
    transformVertex(vertex, scale, translate);
  }
}

/**
 * Apply a linear transform to a vertex.  The provided vertex is modified in
 * place.
 *
 * @param {module:ol/coordinate~Coordinate} vertex Vertex.
 * @param {Array<number>} scale Scale for each dimension.
 * @param {Array<number>} translate Translation for each dimension.
 */
function transformVertex(vertex, scale, translate) {
  vertex[0] = vertex[0] * scale[0] + translate[0];
  vertex[1] = vertex[1] * scale[1] + translate[1];
}

exports.default = TopoJSON;