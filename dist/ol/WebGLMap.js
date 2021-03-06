'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PluggableMap2 = require('./PluggableMap.js');

var _PluggableMap3 = _interopRequireDefault(_PluggableMap2);

var _control = require('./control.js');

var _interaction = require('./interaction.js');

var _obj = require('./obj.js');

var _ImageLayer = require('./renderer/webgl/ImageLayer.js');

var _ImageLayer2 = _interopRequireDefault(_ImageLayer);

var _Map = require('./renderer/webgl/Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _TileLayer = require('./renderer/webgl/TileLayer.js');

var _TileLayer2 = _interopRequireDefault(_TileLayer);

var _VectorLayer = require('./renderer/webgl/VectorLayer.js');

var _VectorLayer2 = _interopRequireDefault(_VectorLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/WebGLMap
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * The WebGLMap uses WebGL for rendering map layers.  This renderer has limited
 * support for vector data and no support for vector tiles.
 *
 *     import WebGLMap from 'ol/WebGLMap';
 *     import TileLayer from 'ol/layer/Tile';
 *     import OSM from 'ol/source/OSM';
 *     import View from 'ol/View';
 *
 *     var map = new WebGLMap({
 *       view: new View({
 *         center: [0, 0],
 *         zoom: 1
 *       }),
 *       layers: [
 *         new TileLayer({
 *           source: new OSM()
 *         })
 *       ],
 *       target: 'map'
 *     });
 *
 * The above snippet creates a map using a {@link module:ol/layer/Tile~Tile} to
 * display {@link module:ol/source/OSM~OSM} OSM data and render it to a DOM
 * element with the id `map`.
 *
 * The constructor places a viewport container (with CSS class name
 * `ol-viewport`) in the target element (see `getViewport()`), and then two
 * further elements within the viewport: one with CSS class name
 * `ol-overlaycontainer-stopevent` for controls and some overlays, and one with
 * CSS class name `ol-overlaycontainer` for other overlays (see the `stopEvent`
 * option of {@link module:ol/Overlay~Overlay} for the difference). The map
 * itself is placed in a further element within the viewport.
 *
 * Layers are stored as a {@link module:ol/Collection~Collection} in
 * layerGroups. A top-level group is provided by the library. This is what is
 * accessed by `getLayerGroup` and `setLayerGroup`. Layers entered in the
 * options are added to this group, and `addLayer` and `removeLayer` change the
 * layer collection in the group. `getLayers` is a convenience function for
 * `getLayerGroup().getLayers()`.
 * Note that {@link module:ol/layer/Group~Group} is a subclass of
 * {@link module:ol/layer/Base}, so layers entered in the options or added
 * with `addLayer` can be groups, which can contain further groups, and so on.
 *
 * @fires module:ol/MapBrowserEvent~MapBrowserEvent
 * @fires module:ol/MapEvent~MapEvent
 * @fires module:ol/render/Event~RenderEvent#postcompose
 * @fires module:ol/render/Event~RenderEvent#precompose
 * @api
 */
var WebGLMap = function (_PluggableMap) {
  _inherits(WebGLMap, _PluggableMap);

  /**
   * @param {module:ol/PluggableMap~MapOptions} options Map options.
   */
  function WebGLMap(options) {
    _classCallCheck(this, WebGLMap);

    options = (0, _obj.assign)({}, options);
    if (!options.controls) {
      options.controls = (0, _control.defaults)();
    }
    if (!options.interactions) {
      options.interactions = (0, _interaction.defaults)();
    }

    return _possibleConstructorReturn(this, (WebGLMap.__proto__ || Object.getPrototypeOf(WebGLMap)).call(this, options));
  }

  _createClass(WebGLMap, [{
    key: 'createRenderer',
    value: function createRenderer() {
      var renderer = new _Map2.default(this);
      renderer.registerLayerRenderers([_ImageLayer2.default, _TileLayer2.default, _VectorLayer2.default]);
      return renderer;
    }
  }]);

  return WebGLMap;
}(_PluggableMap3.default);

exports.default = WebGLMap;