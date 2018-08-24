'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _asserts = require('../asserts.js');

var _extent = require('../extent.js');

var _Feature3 = require('../format/Feature.js');

var _JSONFeature2 = require('../format/JSONFeature.js');

var _JSONFeature3 = _interopRequireDefault(_JSONFeature2);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

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

var _deflate = require('../geom/flat/deflate.js');

var _orient = require('../geom/flat/orient.js');

var _obj = require('../obj.js');

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/EsriJSON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @const
 * @type {Object<module:ol/geom/GeometryType, function(EsriJSONGeometry): module:ol/geom/Geometry>}
 */
var GEOMETRY_READERS = {};
GEOMETRY_READERS[_GeometryType2.default.POINT] = readPointGeometry;
GEOMETRY_READERS[_GeometryType2.default.LINE_STRING] = readLineStringGeometry;
GEOMETRY_READERS[_GeometryType2.default.POLYGON] = readPolygonGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_POINT] = readMultiPointGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_LINE_STRING] = readMultiLineStringGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_POLYGON] = readMultiPolygonGeometry;

/**
 * @const
 * @type {Object<string, function(module:ol/geom/Geometry, module:ol/format/Feature~WriteOptions=): (EsriJSONGeometry)>}
 */
var GEOMETRY_WRITERS = {};
GEOMETRY_WRITERS[_GeometryType2.default.POINT] = writePointGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.LINE_STRING] = writeLineStringGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.POLYGON] = writePolygonGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_POINT] = writeMultiPointGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_LINE_STRING] = writeMultiLineStringGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_POLYGON] = writeMultiPolygonGeometry;

/**
 * @typedef {Object} Options
 * @property {string} [geometryName] Geometry name to use when creating features.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the EsriJSON format.
 *
 * @api
 */

var EsriJSON = function (_JSONFeature) {
  _inherits(EsriJSON, _JSONFeature);

  /**
   * @param {module:ol/format/EsriJSON~Options=} opt_options Options.
   */
  function EsriJSON(opt_options) {
    _classCallCheck(this, EsriJSON);

    var options = opt_options ? opt_options : {};

    /**
     * Name of the geometry attribute for features.
     * @type {string|undefined}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (EsriJSON.__proto__ || Object.getPrototypeOf(EsriJSON)).call(this));

    _this.geometryName_ = options.geometryName;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(EsriJSON, [{
    key: 'readFeatureFromObject',
    value: function readFeatureFromObject(object, opt_options) {
      var esriJSONFeature = /** @type {EsriJSONFeature} */object;
      var geometry = readGeometry(esriJSONFeature.geometry, opt_options);
      var feature = new _Feature2.default();
      if (this.geometryName_) {
        feature.setGeometryName(this.geometryName_);
      }
      feature.setGeometry(geometry);
      if (opt_options && opt_options.idField && esriJSONFeature.attributes[opt_options.idField]) {
        feature.setId( /** @type {number} */esriJSONFeature.attributes[opt_options.idField]);
      }
      if (esriJSONFeature.attributes) {
        feature.setProperties(esriJSONFeature.attributes);
      }
      return feature;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromObject',
    value: function readFeaturesFromObject(object, opt_options) {
      var esriJSONObject = /** @type {EsriJSONObject} */object;
      var options = opt_options ? opt_options : {};
      if (esriJSONObject.features) {
        var esriJSONFeatureCollection = /** @type {EsriJSONFeatureCollection} */object;
        /** @type {Array<module:ol/Feature>} */
        var features = [];
        var esriJSONFeatures = esriJSONFeatureCollection.features;
        options.idField = object.objectIdFieldName;
        for (var i = 0, ii = esriJSONFeatures.length; i < ii; ++i) {
          features.push(this.readFeatureFromObject(esriJSONFeatures[i], options));
        }
        return features;
      } else {
        return [this.readFeatureFromObject(object, options)];
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometryFromObject',
    value: function readGeometryFromObject(object, opt_options) {
      return readGeometry( /** @type {EsriJSONGeometry} */object, opt_options);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readProjectionFromObject',
    value: function readProjectionFromObject(object) {
      var esriJSONObject = /** @type {EsriJSONObject} */object;
      if (esriJSONObject.spatialReference && esriJSONObject.spatialReference.wkid) {
        var crs = esriJSONObject.spatialReference.wkid;
        return (0, _proj.get)('EPSG:' + crs);
      } else {
        return null;
      }
    }

    /**
     * Encode a geometry as a EsriJSON object.
     *
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {EsriJSONGeometry} Object.
     * @override
     * @api
     */

  }, {
    key: 'writeGeometryObject',
    value: function writeGeometryObject(geometry, opt_options) {
      return writeGeometry(geometry, this.adaptOptions(opt_options));
    }

    /**
     * Encode a feature as a esriJSON Feature object.
     *
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {Object} Object.
     * @override
     * @api
     */

  }, {
    key: 'writeFeatureObject',
    value: function writeFeatureObject(feature, opt_options) {
      opt_options = this.adaptOptions(opt_options);
      var object = {};
      var geometry = feature.getGeometry();
      if (geometry) {
        object['geometry'] = writeGeometry(geometry, opt_options);
        if (opt_options && opt_options.featureProjection) {
          object['geometry']['spatialReference'] = /** @type {EsriJSONCRS} */{
            wkid: (0, _proj.get)(opt_options.featureProjection).getCode().split(':').pop()
          };
        }
      }
      var properties = feature.getProperties();
      delete properties[feature.getGeometryName()];
      if (!(0, _obj.isEmpty)(properties)) {
        object['attributes'] = properties;
      } else {
        object['attributes'] = {};
      }
      return object;
    }

    /**
     * Encode an array of features as a EsriJSON object.
     *
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {Object} EsriJSON Object.
     * @override
     * @api
     */

  }, {
    key: 'writeFeaturesObject',
    value: function writeFeaturesObject(features, opt_options) {
      opt_options = this.adaptOptions(opt_options);
      var objects = [];
      for (var i = 0, ii = features.length; i < ii; ++i) {
        objects.push(this.writeFeatureObject(features[i], opt_options));
      }
      return (/** @type {EsriJSONFeatureCollection} */{
          'features': objects
        }
      );
    }
  }]);

  return EsriJSON;
}(_JSONFeature3.default);

/**
 * @param {EsriJSONGeometry} object Object.
 * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
 * @return {module:ol/geom/Geometry} Geometry.
 */


function readGeometry(object, opt_options) {
  if (!object) {
    return null;
  }
  /** @type {module:ol/geom/GeometryType} */
  var type = void 0;
  if (typeof object.x === 'number' && typeof object.y === 'number') {
    type = _GeometryType2.default.POINT;
  } else if (object.points) {
    type = _GeometryType2.default.MULTI_POINT;
  } else if (object.paths) {
    if (object.paths.length === 1) {
      type = _GeometryType2.default.LINE_STRING;
    } else {
      type = _GeometryType2.default.MULTI_LINE_STRING;
    }
  } else if (object.rings) {
    var layout = getGeometryLayout(object);
    var rings = convertRings(object.rings, layout);
    object = /** @type {EsriJSONGeometry} */(0, _obj.assign)({}, object);
    if (rings.length === 1) {
      type = _GeometryType2.default.POLYGON;
      object.rings = rings[0];
    } else {
      type = _GeometryType2.default.MULTI_POLYGON;
      object.rings = rings;
    }
  }
  var geometryReader = GEOMETRY_READERS[type];
  return (
    /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometryReader(object), false, opt_options)
  );
}

/**
 * Determines inner and outer rings.
 * Checks if any polygons in this array contain any other polygons in this
 * array. It is used for checking for holes.
 * Logic inspired by: https://github.com/Esri/terraformer-arcgis-parser
 * @param {Array<!Array<!Array<number>>>} rings Rings.
 * @param {module:ol/geom/GeometryLayout} layout Geometry layout.
 * @return {Array<!Array<!Array<number>>>} Transformed rings.
 */
function convertRings(rings, layout) {
  var flatRing = [];
  var outerRings = [];
  var holes = [];
  var i = void 0,
      ii = void 0;
  for (i = 0, ii = rings.length; i < ii; ++i) {
    flatRing.length = 0;
    (0, _deflate.deflateCoordinates)(flatRing, 0, rings[i], layout.length);
    // is this ring an outer ring? is it clockwise?
    var clockwise = (0, _orient.linearRingIsClockwise)(flatRing, 0, flatRing.length, layout.length);
    if (clockwise) {
      outerRings.push([rings[i]]);
    } else {
      holes.push(rings[i]);
    }
  }
  while (holes.length) {
    var hole = holes.shift();
    var matched = false;
    // loop over all outer rings and see if they contain our hole.
    for (i = outerRings.length - 1; i >= 0; i--) {
      var outerRing = outerRings[i][0];
      var containsHole = (0, _extent.containsExtent)(new _LinearRing2.default(outerRing).getExtent(), new _LinearRing2.default(hole).getExtent());
      if (containsHole) {
        // the hole is contained push it into our polygon
        outerRings[i].push(hole);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // no outer rings contain this hole turn it into and outer
      // ring (reverse it)
      outerRings.push([hole.reverse()]);
    }
  }
  return outerRings;
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} Point.
 */
function readPointGeometry(object) {
  var point = void 0;
  if (object.m !== undefined && object.z !== undefined) {
    point = new _Point2.default([object.x, object.y, object.z, object.m], _GeometryLayout2.default.XYZM);
  } else if (object.z !== undefined) {
    point = new _Point2.default([object.x, object.y, object.z], _GeometryLayout2.default.XYZ);
  } else if (object.m !== undefined) {
    point = new _Point2.default([object.x, object.y, object.m], _GeometryLayout2.default.XYM);
  } else {
    point = new _Point2.default([object.x, object.y]);
  }
  return point;
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} LineString.
 */
function readLineStringGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _LineString2.default(object.paths[0], layout);
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} MultiLineString.
 */
function readMultiLineStringGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiLineString2.default(object.paths, layout);
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/GeometryLayout} The geometry layout to use.
 */
function getGeometryLayout(object) {
  var layout = _GeometryLayout2.default.XY;
  if (object.hasZ === true && object.hasM === true) {
    layout = _GeometryLayout2.default.XYZM;
  } else if (object.hasZ === true) {
    layout = _GeometryLayout2.default.XYZ;
  } else if (object.hasM === true) {
    layout = _GeometryLayout2.default.XYM;
  }
  return layout;
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} MultiPoint.
 */
function readMultiPointGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiPoint2.default(object.points, layout);
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} MultiPolygon.
 */
function readMultiPolygonGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiPolygon2.default(
  /** @type {Array<Array<Array<Array<number>>>>} */object.rings, layout);
}

/**
 * @param {EsriJSONGeometry} object Object.
 * @return {module:ol/geom/Geometry} Polygon.
 */
function readPolygonGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _Polygon2.default(object.rings, layout);
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONGeometry} EsriJSON geometry.
 */
function writePointGeometry(geometry, opt_options) {
  var coordinates = /** @type {module:ol/geom/Point} */geometry.getCoordinates();
  var esriJSON = void 0;
  var layout = /** @type {module:ol/geom/Point} */geometry.getLayout();
  if (layout === _GeometryLayout2.default.XYZ) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      z: coordinates[2]
    };
  } else if (layout === _GeometryLayout2.default.XYM) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      m: coordinates[2]
    };
  } else if (layout === _GeometryLayout2.default.XYZM) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      z: coordinates[2],
      m: coordinates[3]
    };
  } else if (layout === _GeometryLayout2.default.XY) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1]
    };
  } else {
    (0, _asserts.assert)(false, 34); // Invalid geometry layout
  }
  return (/** @type {EsriJSONGeometry} */esriJSON
  );
}

/**
 * @param {module:ol/geom/SimpleGeometry} geometry Geometry.
 * @return {Object} Object with boolean hasZ and hasM keys.
 */
function getHasZM(geometry) {
  var layout = geometry.getLayout();
  return {
    hasZ: layout === _GeometryLayout2.default.XYZ || layout === _GeometryLayout2.default.XYZM,
    hasM: layout === _GeometryLayout2.default.XYM || layout === _GeometryLayout2.default.XYZM
  };
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolyline} EsriJSON geometry.
 */
function writeLineStringGeometry(geometry, opt_options) {
  var hasZM = getHasZM( /** @type {module:ol/geom/LineString} */geometry);
  return (
    /** @type {EsriJSONPolyline} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      paths: [
      /** @type {module:ol/geom/LineString} */geometry.getCoordinates()]
    }
  );
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolygon} EsriJSON geometry.
 */
function writePolygonGeometry(geometry, opt_options) {
  // Esri geometries use the left-hand rule
  var hasZM = getHasZM( /** @type {module:ol/geom/Polygon} */geometry);
  return (
    /** @type {EsriJSONPolygon} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      rings: /** @type {module:ol/geom/Polygon} */geometry.getCoordinates(false)
    }
  );
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolyline} EsriJSON geometry.
 */
function writeMultiLineStringGeometry(geometry, opt_options) {
  var hasZM = getHasZM( /** @type {module:ol/geom/MultiLineString} */geometry);
  return (
    /** @type {EsriJSONPolyline} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      paths: /** @type {module:ol/geom/MultiLineString} */geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONMultipoint} EsriJSON geometry.
 */
function writeMultiPointGeometry(geometry, opt_options) {
  var hasZM = getHasZM( /** @type {module:ol/geom/MultiPoint} */geometry);
  return (
    /** @type {EsriJSONMultipoint} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      points: /** @type {module:ol/geom/MultiPoint} */geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolygon} EsriJSON geometry.
 */
function writeMultiPolygonGeometry(geometry, opt_options) {
  var hasZM = getHasZM( /** @type {module:ol/geom/MultiPolygon} */geometry);
  var coordinates = /** @type {module:ol/geom/MultiPolygon} */geometry.getCoordinates(false);
  var output = [];
  for (var i = 0; i < coordinates.length; i++) {
    for (var x = coordinates[i].length - 1; x >= 0; x--) {
      output.push(coordinates[i][x]);
    }
  }
  return (/** @type {EsriJSONPolygon} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      rings: output
    }
  );
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {EsriJSONGeometry} EsriJSON geometry.
 */
function writeGeometry(geometry, opt_options) {
  var geometryWriter = GEOMETRY_WRITERS[geometry.getType()];
  return geometryWriter( /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, true, opt_options), opt_options);
}

exports.default = EsriJSON;