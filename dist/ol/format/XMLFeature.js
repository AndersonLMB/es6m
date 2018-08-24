'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _Feature = require('../format/Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _FormatType = require('../format/FormatType.js');

var _FormatType2 = _interopRequireDefault(_FormatType);

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/XMLFeature
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for XML feature formats.
 *
 * @abstract
 */
var XMLFeature = function (_FeatureFormat) {
  _inherits(XMLFeature, _FeatureFormat);

  function XMLFeature() {
    _classCallCheck(this, XMLFeature);

    /**
     * @type {XMLSerializer}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (XMLFeature.__proto__ || Object.getPrototypeOf(XMLFeature)).call(this));

    _this.xmlSerializer_ = new XMLSerializer();
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(XMLFeature, [{
    key: 'getType',
    value: function getType() {
      return _FormatType2.default.XML;
    }

    /**
     * Read a single feature.
     *
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Read options.
     * @return {module:ol/Feature} Feature.
     * @api
     */

  }, {
    key: 'readFeature',
    value: function readFeature(source, opt_options) {
      if ((0, _xml.isDocument)(source)) {
        return this.readFeatureFromDocument( /** @type {Document} */source, opt_options);
      } else if ((0, _xml.isNode)(source)) {
        return this.readFeatureFromNode( /** @type {Node} */source, opt_options);
      } else if (typeof source === 'string') {
        var doc = (0, _xml.parse)(source);
        return this.readFeatureFromDocument(doc, opt_options);
      } else {
        return null;
      }
    }

    /**
     * @param {Document} doc Document.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeatureFromDocument',
    value: function readFeatureFromDocument(doc, opt_options) {
      var features = this.readFeaturesFromDocument(doc, opt_options);
      if (features.length > 0) {
        return features[0];
      } else {
        return null;
      }
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @return {module:ol/Feature} Feature.
     */

  }, {
    key: 'readFeatureFromNode',
    value: function readFeatureFromNode(node, opt_options) {
      return null; // not implemented
    }

    /**
     * Read all features from a feature collection.
     *
     * @function
     * @param {Document|Node|Object|string} source Source.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @return {Array<module:ol/Feature>} Features.
     * @api
     */

  }, {
    key: 'readFeatures',
    value: function readFeatures(source, opt_options) {
      if ((0, _xml.isDocument)(source)) {
        return this.readFeaturesFromDocument(
        /** @type {Document} */source, opt_options);
      } else if ((0, _xml.isNode)(source)) {
        return this.readFeaturesFromNode( /** @type {Node} */source, opt_options);
      } else if (typeof source === 'string') {
        var doc = (0, _xml.parse)(source);
        return this.readFeaturesFromDocument(doc, opt_options);
      } else {
        return [];
      }
    }

    /**
     * @param {Document} doc Document.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @protected
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'readFeaturesFromDocument',
    value: function readFeaturesFromDocument(doc, opt_options) {
      /** @type {Array<module:ol/Feature>} */
      var features = [];
      for (var n = doc.firstChild; n; n = n.nextSibling) {
        if (n.nodeType == Node.ELEMENT_NODE) {
          (0, _array.extend)(features, this.readFeaturesFromNode(n, opt_options));
        }
      }
      return features;
    }

    /**
     * @abstract
     * @param {Node} node Node.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @protected
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'readFeaturesFromNode',
    value: function readFeaturesFromNode(node, opt_options) {}

    /**
     * @inheritDoc
     */

  }, {
    key: 'readGeometry',
    value: function readGeometry(source, opt_options) {
      if ((0, _xml.isDocument)(source)) {
        return this.readGeometryFromDocument(
        /** @type {Document} */source, opt_options);
      } else if ((0, _xml.isNode)(source)) {
        return this.readGeometryFromNode( /** @type {Node} */source, opt_options);
      } else if (typeof source === 'string') {
        var doc = (0, _xml.parse)(source);
        return this.readGeometryFromDocument(doc, opt_options);
      } else {
        return null;
      }
    }

    /**
     * @param {Document} doc Document.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @protected
     * @return {module:ol/geom/Geometry} Geometry.
     */

  }, {
    key: 'readGeometryFromDocument',
    value: function readGeometryFromDocument(doc, opt_options) {
      return null; // not implemented
    }

    /**
     * @param {Node} node Node.
     * @param {module:ol/format/Feature~ReadOptions=} opt_options Options.
     * @protected
     * @return {module:ol/geom/Geometry} Geometry.
     */

  }, {
    key: 'readGeometryFromNode',
    value: function readGeometryFromNode(node, opt_options) {
      return null; // not implemented
    }

    /**
     * Read the projection from the source.
     *
     * @param {Document|Node|Object|string} source Source.
     * @return {module:ol/proj/Projection} Projection.
     * @api
     */

  }, {
    key: 'readProjection',
    value: function readProjection(source) {
      if ((0, _xml.isDocument)(source)) {
        return this.readProjectionFromDocument( /** @type {Document} */source);
      } else if ((0, _xml.isNode)(source)) {
        return this.readProjectionFromNode( /** @type {Node} */source);
      } else if (typeof source === 'string') {
        var doc = (0, _xml.parse)(source);
        return this.readProjectionFromDocument(doc);
      } else {
        return null;
      }
    }

    /**
     * @param {Document} doc Document.
     * @protected
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'readProjectionFromDocument',
    value: function readProjectionFromDocument(doc) {
      return this.dataProjection;
    }

    /**
     * @param {Node} node Node.
     * @protected
     * @return {module:ol/proj/Projection} Projection.
     */

  }, {
    key: 'readProjectionFromNode',
    value: function readProjectionFromNode(node) {
      return this.dataProjection;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeFeature',
    value: function writeFeature(feature, opt_options) {
      var node = this.writeFeatureNode(feature, opt_options);
      return this.xmlSerializer_.serializeToString(node);
    }

    /**
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
     * @protected
     * @return {Node} Node.
     */

  }, {
    key: 'writeFeatureNode',
    value: function writeFeatureNode(feature, opt_options) {
      return null; // not implemented
    }

    /**
     * Encode an array of features as string.
     *
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Write options.
     * @return {string} Result.
     * @api
     */

  }, {
    key: 'writeFeatures',
    value: function writeFeatures(features, opt_options) {
      var node = this.writeFeaturesNode(features, opt_options);
      return this.xmlSerializer_.serializeToString(node);
    }

    /**
     * @param {Array<module:ol/Feature>} features Features.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
     * @return {Node} Node.
     */

  }, {
    key: 'writeFeaturesNode',
    value: function writeFeaturesNode(features, opt_options) {
      return null; // not implemented
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'writeGeometry',
    value: function writeGeometry(geometry, opt_options) {
      var node = this.writeGeometryNode(geometry, opt_options);
      return this.xmlSerializer_.serializeToString(node);
    }

    /**
     * @param {module:ol/geom/Geometry} geometry Geometry.
     * @param {module:ol/format/Feature~WriteOptions=} opt_options Options.
     * @return {Node} Node.
     */

  }, {
    key: 'writeGeometryNode',
    value: function writeGeometryNode(geometry, opt_options) {
      return null; // not implemented
    }
  }]);

  return XMLFeature;
}(_Feature2.default);

exports.default = XMLFeature;