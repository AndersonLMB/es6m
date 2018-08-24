'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _array = require('../array.js');

var _GML = require('../format/GML2.js');

var _GML2 = _interopRequireDefault(_GML);

var _XMLFeature2 = require('../format/XMLFeature.js');

var _XMLFeature3 = _interopRequireDefault(_XMLFeature2);

var _obj = require('../obj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/WMSGetFeatureInfo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @typedef {Object} Options
 * @property {Array<string>} [layers] If set, only features of the given layers will be returned by the format when read.
 */

/**
 * @const
 * @type {string}
 */
var featureIdentifier = '_feature';

/**
 * @const
 * @type {string}
 */
var layerIdentifier = '_layer';

/**
 * @classdesc
 * Format for reading WMSGetFeatureInfo format. It uses
 * {@link module:ol/format/GML2~GML2} to read features.
 *
 * @api
 */

var WMSGetFeatureInfo = function (_XMLFeature) {
  _inherits(WMSGetFeatureInfo, _XMLFeature);

  /**
   * @param {module:ol/format/WMSGetFeatureInfo~Options=} opt_options Options.
   */
  function WMSGetFeatureInfo(opt_options) {
    _classCallCheck(this, WMSGetFeatureInfo);

    var _this = _possibleConstructorReturn(this, (WMSGetFeatureInfo.__proto__ || Object.getPrototypeOf(WMSGetFeatureInfo)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {string}
     */
    _this.featureNS_ = 'http://mapserver.gis.umn.edu/mapserver';

    /**
     * @private
     * @type {module:ol/format/GML2}
     */
    _this.gmlFormat_ = new _GML2.default();

    /**
     * @private
     * @type {Array<string>}
     */
    _this.layers_ = options.layers ? options.layers : null;
    return _this;
  }

  /**
   * @return {Array<string>} layers
   */


  _createClass(WMSGetFeatureInfo, [{
    key: 'getLayers',
    value: function getLayers() {
      return this.layers_;
    }

    /**
     * @param {Array<string>} layers Layers to parse.
     */

  }, {
    key: 'setLayers',
    value: function setLayers(layers) {
      this.layers_ = layers;
    }

    /**
     * @param {Node} node Node.
     * @param {Array<*>} objectStack Object stack.
     * @return {Array<module:ol/Feature>} Features.
     * @private
     */

  }, {
    key: 'readFeatures_',
    value: function readFeatures_(node, objectStack) {
      node.setAttribute('namespaceURI', this.featureNS_);
      var localName = node.localName;
      /** @type {Array<module:ol/Feature>} */
      var features = [];
      if (node.childNodes.length === 0) {
        return features;
      }
      if (localName == 'msGMLOutput') {
        for (var i = 0, ii = node.childNodes.length; i < ii; i++) {
          var layer = node.childNodes[i];
          if (layer.nodeType !== Node.ELEMENT_NODE) {
            continue;
          }
          var context = objectStack[0];

          var toRemove = layerIdentifier;
          var layerName = layer.localName.replace(toRemove, '');

          if (this.layers_ && !(0, _array.includes)(this.layers_, layerName)) {
            continue;
          }

          var featureType = layerName + featureIdentifier;

          context['featureType'] = featureType;
          context['featureNS'] = this.featureNS_;

          var parsers = {};
          parsers[featureType] = (0, _xml.makeArrayPusher)(this.gmlFormat_.readFeatureElement, this.gmlFormat_);
          var parsersNS = (0, _xml.makeStructureNS)([context['featureNS'], null], parsers);
          layer.setAttribute('namespaceURI', this.featureNS_);
          var layerFeatures = (0, _xml.pushParseAndPop)([], parsersNS, layer, objectStack, this.gmlFormat_);
          if (layerFeatures) {
            (0, _array.extend)(features, layerFeatures);
          }
        }
      }
      if (localName == 'FeatureCollection') {
        var gmlFeatures = (0, _xml.pushParseAndPop)([], this.gmlFormat_.FEATURE_COLLECTION_PARSERS, node, [{}], this.gmlFormat_);
        if (gmlFeatures) {
          features = gmlFeatures;
        }
      }
      return features;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromNode',
    value: function readFeaturesFromNode(node, opt_options) {
      var options = {};
      if (opt_options) {
        (0, _obj.assign)(options, this.getReadOptions(node, opt_options));
      }
      return this.readFeatures_(node, [options]);
    }
  }]);

  return WMSGetFeatureInfo;
}(_XMLFeature3.default);

exports.default = WMSGetFeatureInfo;