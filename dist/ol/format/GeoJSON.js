'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asserts = require('../asserts.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _JSONFeature2 = require('../format/JSONFeature.js');

var _JSONFeature3 = _interopRequireDefault(_JSONFeature2);

var _GeometryCollection = require('../geom/GeometryCollection.js');

var _GeometryCollection2 = _interopRequireDefault(_GeometryCollection);

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

var _obj = require('../obj.js');

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/GeoJSON
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// TODO: serialize dataProjection as crs member when writing
// see https://github.com/openlayers/openlayers/issues/2078

/**
 * @typedef {Object} Options
 * @property {module:ol/proj~ProjectionLike} [dataProjection='EPSG:4326'] Default data projection.
 * @property {module:ol/proj~ProjectionLike} [featureProjection] Projection for features read or
 * written by the format.  Options passed to read or write methods will take precedence.
 * @property {string} [geometryName] Geometry name to use when creating features.
 * @property {boolean} [extractGeometryName=false] Certain GeoJSON providers include
 * the geometry_name field in the feature GeoJSON. If set to `true` the GeoJSON reader
 * will look for that field to set the geometry name. If both this field is set to `true`
 * and a `geometryName` is provided, the `geometryName` will take precedence.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
  * @api
 */
var GeoJSON = function (_JSONFeature) {
  _inherits(GeoJSON, _JSONFeature);

  /**
   * @param {module:ol/format/GeoJSON~Options=} opt_options Options.
   */
  function GeoJSON(opt_options) {
    _classCallCheck(this, GeoJSON);

    var options = opt_options ? opt_options : {};

    /**
     * @inheritDoc
     */
    var _this = _possibleConstructorReturn(this, (GeoJSON.__proto__ || Object.getPrototypeOf(GeoJSON)).call(this));

    _this.dataProjection = (0, _proj.get)(options.dataProjection ? options.dataProjection : 'EPSG:4326');

    if (options.featureProjection) {
      _this.defaultFeatureProjection = (0, _proj.get)(options.featureProjection);
    }

    /**
     * Name of the geometry attribute for features.
     * @type {string|undefined}
     * @private
     */
    _this.geometryName_ = options.geometryName;

    /**
     * Look for the geometry name in the feature GeoJSON
     * @type {boolean|undefined}
     * @private
     */
    _this.extractGeometryName_ = options.extractGeometryName;

    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(GeoJSON, [{
    key: 'readFeatureFromObject',
    value: function readFeatureFromObject(object, opt_options) {
      /**
       * @type {GeoJSONFeature}
       */
      var geoJSONFeature = null;
      if (object.type === 'Feature') {
        geoJSONFeature = /** @type {GeoJSONFeature} */object;
      } else {
        geoJSONFeature = /** @type {GeoJSONFeature} */{
          type: 'Feature',
          geometry: /** @type {GeoJSONGeometry|GeoJSONGeometryCollection} */object
        };
      }

      var geometry = readGeometry(geoJSONFeature.geometry, opt_options);
      var feature = new _Feature2.default();
      if (this.geometryName_) {
        feature.setGeometryName(this.geometryName_);
      } else if (this.extractGeometryName_ && geoJSONFeature.geometry_name !== undefined) {
        feature.setGeometryName(geoJSONFeature.geometry_name);
      }
      feature.setGeometry(geometry);
      if (geoJSONFeature.id !== undefined) {
        feature.setId(geoJSONFeature.id);
      }
      if (geoJSONFeature.properties) {
        feature.setProperties(geoJSONFeature.properties);
      }
      return feature;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromObject',
    value: function readFeaturesFromObject(object, opt_options) {
      var geoJSONObject = /** @type {GeoJSONObject} */object;
      /** @type {Array<module:ol/Feature>} */
      var features = null;
      if (geoJSONObject.type === 'FeatureCollection') {
        var geoJSONFeatureCollection = /** @type {GeoJSONFeatureCollection} */object;
        features = [];
        var geoJSONFeatures = geoJSONFeatureCollection.features;
        for (var i = 0, ii = geoJSONFeatures.length; i < ii; ++i) {
          features.push(this.readFeatureFromObject(geoJSONFeatures[i], opt_options));
        }
      } else {
        features = [this.readFeatureFromObject(object, opt_options)];
      }
      return features;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometryFromObject',
    value: function readGeometryFromObject(object, opt_options) {
      return readGeometry( /** @type {GeoJSONGeometry} */object, opt_options);
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readProjectionFromObject',
    value: function readProjectionFromObject(object) {
      var geoJSONObject = /** @type {GeoJSONObject} */object;
      var crs = geoJSONObject.crs;
      var projection = void 0;
      if (crs) {
        if (crs.type == 'name') {
          projection = (0, _proj.get)(crs.properties.name);
        } else {
          (0, _asserts.assert)(false, 36); // Unknown SRS type
        }
      } else {
        projection = this.dataProjection;
      }
      return (
        /** @type {module:ol/proj/Projection} */projection
      );
    }

    /**
     * Encode a feature as a GeoJSON Feature object.
     *
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {GeoJSONFeature} Object.
     * @override
     * @api
     */

  }, {
    key: 'writeFeatureObject',
    value: function writeFeatureObject(feature, opt_options) {
      opt_options = this.adaptOptions(opt_options);

      var object = /** @type {GeoJSONFeature} */{
        'type': 'Feature'
      };
      var id = feature.getId();
      if (id !== undefined) {
        object.id = id;
      }
      var geometry = feature.getGeometry();
      if (geometry) {
        object.geometry = writeGeometry(geometry, opt_options);
      } else {
        object.geometry = null;
      }
      var properties = feature.getProperties();
      delete properties[feature.getGeometryName()];
      if (!(0, _obj.isEmpty)(properties)) {
        object.properties = properties;
      } else {
        object.properties = null;
      }
      return object;
    }

    /**
     * Encode an array of features as a GeoJSON object.
     *
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {GeoJSONFeatureCollection} GeoJSON Object.
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
      return (/** @type {GeoJSONFeatureCollection} */{
          type: 'FeatureCollection',
          features: objects
        }
      );
    }

    /**
     * Encode a geometry as a GeoJSON object.
     *
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {GeoJSONGeometry|GeoJSONGeometryCollection} Object.
     * @override
     * @api
     */

  }, {
    key: 'writeGeometryObject',
    value: function writeGeometryObject(geometry, opt_options) {
      return writeGeometry(geometry, this.adaptOptions(opt_options));
    }
  }]);

  return GeoJSON;
}(_JSONFeature3.default);

/**
 * @const
 * @type {Object<string, function(GeoJSONObject): module:ol/geom/Geometry>}
 */


var GEOMETRY_READERS = {
  'Point': readPointGeometry,
  'LineString': readLineStringGeometry,
  'Polygon': readPolygonGeometry,
  'MultiPoint': readMultiPointGeometry,
  'MultiLineString': readMultiLineStringGeometry,
  'MultiPolygon': readMultiPolygonGeometry,
  'GeometryCollection': readGeometryCollectionGeometry
};

/**
 * @const
 * @type {Object<string, function(module:ol/geom/Geometry, module:ol/format/Feature~WriteOptions=): (GeoJSONGeometry|GeoJSONGeometryCollection)>}
 */
var GEOMETRY_WRITERS = {
  'Point': writePointGeometry,
  'LineString': writeLineStringGeometry,
  'Polygon': writePolygonGeometry,
  'MultiPoint': writeMultiPointGeometry,
  'MultiLineString': writeMultiLineStringGeometry,
  'MultiPolygon': writeMultiPolygonGeometry,
  'GeometryCollection': writeGeometryCollectionGeometry,
  'Circle': writeEmptyGeometryCollectionGeometry
};

/**
 * @param {GeoJSONGeometry|GeoJSONGeometryCollection} object Object.
 * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
 * @return {module:ol/geom/Geometry} Geometry.
 */
function readGeometry(object, opt_options) {
  if (!object) {
    return null;
  }
  var geometryReader = GEOMETRY_READERS[object.type];
  return (
    /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometryReader(object), false, opt_options)
  );
}

/**
 * @param {GeoJSONGeometryCollection} object Object.
 * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
 * @return {module:ol/geom/GeometryCollection} Geometry collection.
 */
function readGeometryCollectionGeometry(object, opt_options) {
  var geometries = object.geometries.map(
  /**
   * @param {GeoJSONGeometry} geometry Geometry.
   * @return {module:ol/geom/Geometry} geometry Geometry.
   */
  function (geometry) {
    return readGeometry(geometry, opt_options);
  });
  return new _GeometryCollection2.default(geometries);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/Point} Point.
 */
function readPointGeometry(object) {
  return new _Point2.default(object.coordinates);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/LineString} LineString.
 */
function readLineStringGeometry(object) {
  return new _LineString2.default(object.coordinates);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/MultiLineString} MultiLineString.
 */
function readMultiLineStringGeometry(object) {
  return new _MultiLineString2.default(object.coordinates);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/MultiPoint} MultiPoint.
 */
function readMultiPointGeometry(object) {
  return new _MultiPoint2.default(object.coordinates);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/MultiPolygon} MultiPolygon.
 */
function readMultiPolygonGeometry(object) {
  return new _MultiPolygon2.default(object.coordinates);
}

/**
 * @param {GeoJSONGeometry} object Object.
 * @return {module:ol/geom/Polygon} Polygon.
 */
function readPolygonGeometry(object) {
  return new _Polygon2.default(object.coordinates);
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry|GeoJSONGeometryCollection} GeoJSON geometry.
 */
function writeGeometry(geometry, opt_options) {
  var geometryWriter = GEOMETRY_WRITERS[geometry.getType()];
  return geometryWriter( /** @type {module:ol/geom/Geometry} */(0, _Feature3.transformWithOptions)(geometry, true, opt_options), opt_options);
}

/**
 * @param {module:ol/geom/Geometry} geometry Geometry.
 * @return {GeoJSONGeometryCollection} Empty GeoJSON geometry collection.
 */
function writeEmptyGeometryCollectionGeometry(geometry) {
  return (/** @type {GeoJSONGeometryCollection} */{
      type: 'GeometryCollection',
      geometries: []
    }
  );
}

/**
 * @param {module:ol/geom/GeometryCollection} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometryCollection} GeoJSON geometry collection.
 */
function writeGeometryCollectionGeometry(geometry, opt_options) {
  var geometries = geometry.getGeometriesArray().map(function (geometry) {
    var options = (0, _obj.assign)({}, opt_options);
    delete options.featureProjection;
    return writeGeometry(geometry, options);
  });
  return (/** @type {GeoJSONGeometryCollection} */{
      type: 'GeometryCollection',
      geometries: geometries
    }
  );
}

/**
 * @param {module:ol/geom/LineString} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeLineStringGeometry(geometry, opt_options) {
  return (/** @type {GeoJSONGeometry} */{
      type: 'LineString',
      coordinates: geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/MultiLineString} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiLineStringGeometry(geometry, opt_options) {
  return (/** @type {GeoJSONGeometry} */{
      type: 'MultiLineString',
      coordinates: geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/MultiPoint} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiPointGeometry(geometry, opt_options) {
  return (/** @type {GeoJSONGeometry} */{
      type: 'MultiPoint',
      coordinates: geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/MultiPolygon} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiPolygonGeometry(geometry, opt_options) {
  var right = void 0;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return (/** @type {GeoJSONGeometry} */{
      type: 'MultiPolygon',
      coordinates: geometry.getCoordinates(right)
    }
  );
}

/**
 * @param {module:ol/geom/Point} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writePointGeometry(geometry, opt_options) {
  return (/** @type {GeoJSONGeometry} */{
      type: 'Point',
      coordinates: geometry.getCoordinates()
    }
  );
}

/**
 * @param {module:ol/geom/Polygon} geometry Geometry.
 * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writePolygonGeometry(geometry, opt_options) {
  var right = void 0;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return (/** @type {GeoJSONGeometry} */{
      type: 'Polygon',
      coordinates: geometry.getCoordinates(right)
    }
  );
}

exports.default = GeoJSON;