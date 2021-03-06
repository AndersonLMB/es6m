'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asserts = require('../asserts.js');

var _pbf = require('pbf');

var _pbf2 = _interopRequireDefault(_pbf);

var _Feature = require('../format/Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _FormatType = require('../format/FormatType.js');

var _FormatType2 = _interopRequireDefault(_FormatType);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

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

var _orient = require('../geom/flat/orient.js');

var _Projection = require('../proj/Projection.js');

var _Projection2 = _interopRequireDefault(_Projection);

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

var _Feature3 = require('../render/Feature.js');

var _Feature4 = _interopRequireDefault(_Feature3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/MVT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
//FIXME Implement projection handling

/**
 * @typedef {Object} Options
 * @property {function((module:ol/geom/Geometry|Object<string,*>)=)|function(module:ol/geom/GeometryType,Array<number>,(Array<number>|Array<Array<number>>),Object<string,*>,number)} [featureClass]
 * Class for features returned by {@link module:ol/format/MVT#readFeatures}. Set to
 * {@link module:ol/Feature~Feature} to get full editing and geometry support at the cost of
 * decreased rendering performance. The default is {@link module:ol/render/Feature~RenderFeature},
 * which is optimized for rendering and hit detection.
 * @property {string} [geometryName='geometry'] Geometry name to use when creating
 * features.
 * @property {string} [layerName='layer'] Name of the feature attribute that
 * holds the layer name.
 * @property {Array<string>} [layers] Layers to read features from. If not
 * provided, features will be read from all layers.
 */

/**
 * @classdesc
 * Feature format for reading data in the Mapbox MVT format.
 *
 * @param {module:ol/format/MVT~Options=} opt_options Options.
 * @api
 */
var MVT = function (_FeatureFormat) {
  _inherits(MVT, _FeatureFormat);

  /**
   * @param {module:ol/format/MVT~Options=} opt_options Options.
   */
  function MVT(opt_options) {
    _classCallCheck(this, MVT);

    var _this = _possibleConstructorReturn(this, (MVT.__proto__ || Object.getPrototypeOf(MVT)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @type {module:ol/proj/Projection}
     */
    _this.dataProjection = new _Projection2.default({
      code: '',
      units: _Units2.default.TILE_PIXELS
    });

    /**
     * @private
     * @type {function((module:ol/geom/Geometry|Object<string,*>)=)|
     *     function(module:ol/geom/GeometryType,Array<number>,
     *         (Array<number>|Array<Array<number>>),Object<string,*>,number)}
     */
    _this.featureClass_ = options.featureClass ? options.featureClass : _Feature4.default;

    /**
     * @private
     * @type {string|undefined}
     */
    _this.geometryName_ = options.geometryName;

    /**
     * @private
     * @type {string}
     */
    _this.layerName_ = options.layerName ? options.layerName : 'layer';

    /**
     * @private
     * @type {Array<string>}
     */
    _this.layers_ = options.layers ? options.layers : null;

    /**
     * @private
     * @type {module:ol/extent~Extent}
     */
    _this.extent_ = null;

    return _this;
  }

  /**
   * Read the raw geometry from the pbf offset stored in a raw feature's geometry
   * property.
   * @suppress {missingProperties}
   * @param {Object} pbf PBF.
   * @param {Object} feature Raw feature.
   * @param {Array<number>} flatCoordinates Array to store flat coordinates in.
   * @param {Array<number>} ends Array to store ends in.
   * @private
   */


  _createClass(MVT, [{
    key: 'readRawGeometry_',
    value: function readRawGeometry_(pbf, feature, flatCoordinates, ends) {
      pbf.pos = feature.geometry;

      var end = pbf.readVarint() + pbf.pos;
      var cmd = 1;
      var length = 0;
      var x = 0;
      var y = 0;
      var coordsLen = 0;
      var currentEnd = 0;

      while (pbf.pos < end) {
        if (!length) {
          var cmdLen = pbf.readVarint();
          cmd = cmdLen & 0x7;
          length = cmdLen >> 3;
        }

        length--;

        if (cmd === 1 || cmd === 2) {
          x += pbf.readSVarint();
          y += pbf.readSVarint();

          if (cmd === 1) {
            // moveTo
            if (coordsLen > currentEnd) {
              ends.push(coordsLen);
              currentEnd = coordsLen;
            }
          }

          flatCoordinates.push(x, y);
          coordsLen += 2;
        } else if (cmd === 7) {

          if (coordsLen > currentEnd) {
            // close polygon
            flatCoordinates.push(flatCoordinates[currentEnd], flatCoordinates[currentEnd + 1]);
            coordsLen += 2;
          }
        } else {
          (0, _asserts.assert)(false, 59); // Invalid command found in the PBF
        }
      }

      if (coordsLen > currentEnd) {
        ends.push(coordsLen);
        currentEnd = coordsLen;
      }
    }

    /**
     * @private
     * @param {Object} pbf PBF
     * @param {Object} rawFeature Raw Mapbox feature.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/Feature|module:ol/render/Feature} Feature.
     */

  }, {
    key: 'createFeature_',
    value: function createFeature_(pbf, rawFeature, opt_options) {
      var type = rawFeature.type;
      if (type === 0) {
        return null;
      }

      var feature = void 0;
      var id = rawFeature.id;
      var values = rawFeature.properties;
      values[this.layerName_] = rawFeature.layer.name;

      var flatCoordinates = [];
      var ends = [];
      this.readRawGeometry_(pbf, rawFeature, flatCoordinates, ends);

      var geometryType = getGeometryType(type, ends.length);

      if (this.featureClass_ === _Feature4.default) {
        feature = new this.featureClass_(geometryType, flatCoordinates, ends, values, id);
      } else {
        var geom = void 0;
        if (geometryType == _GeometryType2.default.POLYGON) {
          var endss = [];
          var offset = 0;
          var prevEndIndex = 0;
          for (var i = 0, ii = ends.length; i < ii; ++i) {
            var end = ends[i];
            if (!(0, _orient.linearRingIsClockwise)(flatCoordinates, offset, end, 2)) {
              endss.push(ends.slice(prevEndIndex, i));
              prevEndIndex = i;
            }
            offset = end;
          }
          if (endss.length > 1) {
            geom = new _MultiPolygon2.default(flatCoordinates, _GeometryLayout2.default.XY, endss);
          } else {
            geom = new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XY, ends);
          }
        } else {
          geom = geometryType === _GeometryType2.default.POINT ? new _Point2.default(flatCoordinates, _GeometryLayout2.default.XY) : geometryType === _GeometryType2.default.LINE_STRING ? new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XY) : geometryType === _GeometryType2.default.POLYGON ? new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XY, ends) : geometryType === _GeometryType2.default.MULTI_POINT ? new _MultiPoint2.default(flatCoordinates, _GeometryLayout2.default.XY) : geometryType === _GeometryType2.default.MULTI_LINE_STRING ? new _MultiLineString2.default(flatCoordinates, _GeometryLayout2.default.XY, ends) : null;
        }
        feature = new this.featureClass_();
        if (this.geometryName_) {
          feature.setGeometryName(this.geometryName_);
        }
        var geometry = (0, _Feature.transformWithOptions)(geom, false, this.adaptOptions(opt_options));
        feature.setGeometry(geometry);
        feature.setId(id);
        feature.setProperties(values);
      }

      return feature;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getLastExtent',
    value: function getLastExtent() {
      return this.extent_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _FormatType2.default.ARRAY_BUFFER;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'readFeatures',
    value: function readFeatures(source, opt_options) {
      var layers = this.layers_;

      var pbf = new _pbf2.default( /** @type {ArrayBuffer} */source);
      var pbfLayers = pbf.readFields(layersPBFReader, {});
      /** @type {Array<module:ol/Feature|module:ol/render/Feature>} */
      var features = [];
      for (var name in pbfLayers) {
        if (layers && layers.indexOf(name) == -1) {
          continue;
        }
        var pbfLayer = pbfLayers[name];

        for (var i = 0, ii = pbfLayer.length; i < ii; ++i) {
          var rawFeature = readRawFeature(pbf, pbfLayer, i);
          features.push(this.createFeature_(pbf, rawFeature));
        }
        this.extent_ = pbfLayer ? [0, 0, pbfLayer.extent, pbfLayer.extent] : null;
      }

      return features;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'readProjection',
    value: function readProjection(source) {
      return this.dataProjection;
    }

    /**
     * Sets the layers that features will be read from.
     * @param {Array<string>} layers Layers.
     * @api
     */

  }, {
    key: 'setLayers',
    value: function setLayers(layers) {
      this.layers_ = layers;
    }
  }]);

  return MVT;
}(_Feature2.default);

/**
 * Reader callback for parsing layers.
 * @param {number} tag The tag.
 * @param {Object} layers The layers object.
 * @param {Object} pbf The PBF.
 */


function layersPBFReader(tag, layers, pbf) {
  if (tag === 3) {
    var layer = {
      keys: [],
      values: [],
      features: []
    };
    var end = pbf.readVarint() + pbf.pos;
    pbf.readFields(layerPBFReader, layer, end);
    layer.length = layer.features.length;
    if (layer.length) {
      layers[layer.name] = layer;
    }
  }
}

/**
 * Reader callback for parsing layer.
 * @param {number} tag The tag.
 * @param {Object} layer The layer object.
 * @param {Object} pbf The PBF.
 */
function layerPBFReader(tag, layer, pbf) {
  if (tag === 15) {
    layer.version = pbf.readVarint();
  } else if (tag === 1) {
    layer.name = pbf.readString();
  } else if (tag === 5) {
    layer.extent = pbf.readVarint();
  } else if (tag === 2) {
    layer.features.push(pbf.pos);
  } else if (tag === 3) {
    layer.keys.push(pbf.readString());
  } else if (tag === 4) {
    var value = null;
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
      tag = pbf.readVarint() >> 3;
      value = tag === 1 ? pbf.readString() : tag === 2 ? pbf.readFloat() : tag === 3 ? pbf.readDouble() : tag === 4 ? pbf.readVarint64() : tag === 5 ? pbf.readVarint() : tag === 6 ? pbf.readSVarint() : tag === 7 ? pbf.readBoolean() : null;
    }
    layer.values.push(value);
  }
}

/**
 * Reader callback for parsing feature.
 * @param {number} tag The tag.
 * @param {Object} feature The feature object.
 * @param {Object} pbf The PBF.
 */
function featurePBFReader(tag, feature, pbf) {
  if (tag == 1) {
    feature.id = pbf.readVarint();
  } else if (tag == 2) {
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
      var key = feature.layer.keys[pbf.readVarint()];
      var value = feature.layer.values[pbf.readVarint()];
      feature.properties[key] = value;
    }
  } else if (tag == 3) {
    feature.type = pbf.readVarint();
  } else if (tag == 4) {
    feature.geometry = pbf.pos;
  }
}

/**
 * Read a raw feature from the pbf offset stored at index `i` in the raw layer.
 * @suppress {missingProperties}
 * @param {Object} pbf PBF.
 * @param {Object} layer Raw layer.
 * @param {number} i Index of the feature in the raw layer's `features` array.
 * @return {Object} Raw feature.
 */
function readRawFeature(pbf, layer, i) {
  pbf.pos = layer.features[i];
  var end = pbf.readVarint() + pbf.pos;

  var feature = {
    layer: layer,
    type: 0,
    properties: {}
  };
  pbf.readFields(featurePBFReader, feature, end);
  return feature;
}

/**
 * @suppress {missingProperties}
 * @param {number} type The raw feature's geometry type
 * @param {number} numEnds Number of ends of the flat coordinates of the
 * geometry.
 * @return {module:ol/geom/GeometryType} The geometry type.
 */
function getGeometryType(type, numEnds) {
  /** @type {module:ol/geom/GeometryType} */
  var geometryType = void 0;
  if (type === 1) {
    geometryType = numEnds === 1 ? _GeometryType2.default.POINT : _GeometryType2.default.MULTI_POINT;
  } else if (type === 2) {
    geometryType = numEnds === 1 ? _GeometryType2.default.LINE_STRING : _GeometryType2.default.MULTI_LINE_STRING;
  } else if (type === 3) {
    geometryType = _GeometryType2.default.POLYGON;
    // MultiPolygon not relevant for rendering - winding order determines
    // outer rings of polygons.
  }
  return geometryType;
}

exports.default = MVT;