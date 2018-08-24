"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/render/VectorContext
 */

/**
 * @classdesc
 * Context for drawing geometries.  A vector context is available on render
 * events and does not need to be constructed directly.
 * @api
 */
var VectorContext = function () {
  function VectorContext() {
    _classCallCheck(this, VectorContext);
  }

  _createClass(VectorContext, [{
    key: "drawCustom",

    /**
     * Render a geometry with a custom renderer.
     *
     * @param {module:ol/geom/SimpleGeometry} geometry Geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {Function} renderer Renderer.
     */
    value: function drawCustom(geometry, feature, renderer) {}

    /**
     * Render a geometry.
     *
     * @param {module:ol/geom/Geometry} geometry The geometry to render.
     */

  }, {
    key: "drawGeometry",
    value: function drawGeometry(geometry) {}

    /**
     * Set the rendering style.
     *
     * @param {module:ol/style/Style} style The rendering style.
     */

  }, {
    key: "setStyle",
    value: function setStyle(style) {}

    /**
     * @param {module:ol/geom/Circle} circleGeometry Circle geometry.
     * @param {module:ol/Feature} feature Feature.
     */

  }, {
    key: "drawCircle",
    value: function drawCircle(circleGeometry, feature) {}

    /**
     * @param {module:ol/Feature} feature Feature.
     * @param {module:ol/style/Style} style Style.
     */

  }, {
    key: "drawFeature",
    value: function drawFeature(feature, style) {}

    /**
     * @param {module:ol/geom/GeometryCollection} geometryCollectionGeometry Geometry collection.
     * @param {module:ol/Feature} feature Feature.
     */

  }, {
    key: "drawGeometryCollection",
    value: function drawGeometryCollection(geometryCollectionGeometry, feature) {}

    /**
     * @param {module:ol/geom/LineString|module:ol/render/Feature} lineStringGeometry Line string geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawLineString",
    value: function drawLineString(lineStringGeometry, feature) {}

    /**
     * @param {module:ol/geom/MultiLineString|module:ol/render/Feature} multiLineStringGeometry MultiLineString geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawMultiLineString",
    value: function drawMultiLineString(multiLineStringGeometry, feature) {}

    /**
     * @param {module:ol/geom/MultiPoint|module:ol/render/Feature} multiPointGeometry MultiPoint geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawMultiPoint",
    value: function drawMultiPoint(multiPointGeometry, feature) {}

    /**
     * @param {module:ol/geom/MultiPolygon} multiPolygonGeometry MultiPolygon geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawMultiPolygon",
    value: function drawMultiPolygon(multiPolygonGeometry, feature) {}

    /**
     * @param {module:ol/geom/Point|module:ol/render/Feature} pointGeometry Point geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawPoint",
    value: function drawPoint(pointGeometry, feature) {}

    /**
     * @param {module:ol/geom/Polygon|module:ol/render/Feature} polygonGeometry Polygon geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawPolygon",
    value: function drawPolygon(polygonGeometry, feature) {}

    /**
     * @param {module:ol/geom/Geometry|module:ol/render/Feature} geometry Geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     */

  }, {
    key: "drawText",
    value: function drawText(geometry, feature) {}

    /**
     * @param {module:ol/style/Fill} fillStyle Fill style.
     * @param {module:ol/style/Stroke} strokeStyle Stroke style.
     */

  }, {
    key: "setFillStrokeStyle",
    value: function setFillStrokeStyle(fillStyle, strokeStyle) {}

    /**
     * @param {module:ol/style/Image} imageStyle Image style.
     * @param {module:ol/render/canvas~DeclutterGroup=} opt_declutterGroup Declutter.
     */

  }, {
    key: "setImageStyle",
    value: function setImageStyle(imageStyle, opt_declutterGroup) {}

    /**
     * @param {module:ol/style/Text} textStyle Text style.
     * @param {module:ol/render/canvas~DeclutterGroup=} opt_declutterGroup Declutter.
     */

  }, {
    key: "setTextStyle",
    value: function setTextStyle(textStyle, opt_declutterGroup) {}
  }]);

  return VectorContext;
}();

exports.default = VectorContext;