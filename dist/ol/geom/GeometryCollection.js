'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _Geometry2 = require('../geom/Geometry.js');

var _Geometry3 = _interopRequireDefault(_Geometry2);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/geom/GeometryCollection
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * @classdesc
 * An array of {@link module:ol/geom/Geometry} objects.
 *
 * @api
 */
var GeometryCollection = function (_Geometry) {
  _inherits(GeometryCollection, _Geometry);

  /**
   * @param {Array<module:ol/geom/Geometry>=} opt_geometries Geometries.
   */
  function GeometryCollection(opt_geometries) {
    _classCallCheck(this, GeometryCollection);

    /**
     * @private
     * @type {Array<module:ol/geom/Geometry>}
     */
    var _this = _possibleConstructorReturn(this, (GeometryCollection.__proto__ || Object.getPrototypeOf(GeometryCollection)).call(this));

    _this.geometries_ = opt_geometries ? opt_geometries : null;

    _this.listenGeometriesChange_();
    return _this;
  }

  /**
   * @private
   */


  _createClass(GeometryCollection, [{
    key: 'unlistenGeometriesChange_',
    value: function unlistenGeometriesChange_() {
      if (!this.geometries_) {
        return;
      }
      for (var i = 0, ii = this.geometries_.length; i < ii; ++i) {
        (0, _events.unlisten)(this.geometries_[i], _EventType2.default.CHANGE, this.changed, this);
      }
    }

    /**
     * @private
     */

  }, {
    key: 'listenGeometriesChange_',
    value: function listenGeometriesChange_() {
      if (!this.geometries_) {
        return;
      }
      for (var i = 0, ii = this.geometries_.length; i < ii; ++i) {
        (0, _events.listen)(this.geometries_[i], _EventType2.default.CHANGE, this.changed, this);
      }
    }

    /**
     * Make a complete copy of the geometry.
     * @return {!module:ol/geom/GeometryCollection} Clone.
     * @override
     * @api
     */

  }, {
    key: 'clone',
    value: function clone() {
      var geometryCollection = new GeometryCollection(null);
      geometryCollection.setGeometries(this.geometries_);
      return geometryCollection;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'closestPointXY',
    value: function closestPointXY(x, y, closestPoint, minSquaredDistance) {
      if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
        return minSquaredDistance;
      }
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        minSquaredDistance = geometries[i].closestPointXY(x, y, closestPoint, minSquaredDistance);
      }
      return minSquaredDistance;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'containsXY',
    value: function containsXY(x, y) {
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        if (geometries[i].containsXY(x, y)) {
          return true;
        }
      }
      return false;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'computeExtent',
    value: function computeExtent(extent) {
      (0, _extent.createOrUpdateEmpty)(extent);
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        (0, _extent.extend)(extent, geometries[i].getExtent());
      }
      return extent;
    }

    /**
     * Return the geometries that make up this geometry collection.
     * @return {Array<module:ol/geom/Geometry>} Geometries.
     * @api
     */

  }, {
    key: 'getGeometries',
    value: function getGeometries() {
      return cloneGeometries(this.geometries_);
    }

    /**
     * @return {Array<module:ol/geom/Geometry>} Geometries.
     */

  }, {
    key: 'getGeometriesArray',
    value: function getGeometriesArray() {
      return this.geometries_;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'getSimplifiedGeometry',
    value: function getSimplifiedGeometry(squaredTolerance) {
      if (this.simplifiedGeometryRevision != this.getRevision()) {
        (0, _obj.clear)(this.simplifiedGeometryCache);
        this.simplifiedGeometryMaxMinSquaredTolerance = 0;
        this.simplifiedGeometryRevision = this.getRevision();
      }
      if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) {
        return this;
      }
      var key = squaredTolerance.toString();
      if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
        return this.simplifiedGeometryCache[key];
      } else {
        var simplifiedGeometries = [];
        var geometries = this.geometries_;
        var simplified = false;
        for (var i = 0, ii = geometries.length; i < ii; ++i) {
          var geometry = geometries[i];
          var simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
          simplifiedGeometries.push(simplifiedGeometry);
          if (simplifiedGeometry !== geometry) {
            simplified = true;
          }
        }
        if (simplified) {
          var simplifiedGeometryCollection = new GeometryCollection(null);
          simplifiedGeometryCollection.setGeometriesArray(simplifiedGeometries);
          this.simplifiedGeometryCache[key] = simplifiedGeometryCollection;
          return simplifiedGeometryCollection;
        } else {
          this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
          return this;
        }
      }
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'getType',
    value: function getType() {
      return _GeometryType2.default.GEOMETRY_COLLECTION;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'intersectsExtent',
    value: function intersectsExtent(extent) {
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        if (geometries[i].intersectsExtent(extent)) {
          return true;
        }
      }
      return false;
    }

    /**
     * @return {boolean} Is empty.
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.geometries_.length === 0;
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'rotate',
    value: function rotate(angle, anchor) {
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        geometries[i].rotate(angle, anchor);
      }
      this.changed();
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'scale',
    value: function scale(sx, opt_sy, opt_anchor) {
      var anchor = opt_anchor;
      if (!anchor) {
        anchor = (0, _extent.getCenter)(this.getExtent());
      }
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        geometries[i].scale(sx, opt_sy, anchor);
      }
      this.changed();
    }

    /**
     * Set the geometries that make up this geometry collection.
     * @param {Array<module:ol/geom/Geometry>} geometries Geometries.
     * @api
     */

  }, {
    key: 'setGeometries',
    value: function setGeometries(geometries) {
      this.setGeometriesArray(cloneGeometries(geometries));
    }

    /**
     * @param {Array<module:ol/geom/Geometry>} geometries Geometries.
     */

  }, {
    key: 'setGeometriesArray',
    value: function setGeometriesArray(geometries) {
      this.unlistenGeometriesChange_();
      this.geometries_ = geometries;
      this.listenGeometriesChange_();
      this.changed();
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'applyTransform',
    value: function applyTransform(transformFn) {
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        geometries[i].applyTransform(transformFn);
      }
      this.changed();
    }

    /**
     * @inheritDoc
     * @api
     */

  }, {
    key: 'translate',
    value: function translate(deltaX, deltaY) {
      var geometries = this.geometries_;
      for (var i = 0, ii = geometries.length; i < ii; ++i) {
        geometries[i].translate(deltaX, deltaY);
      }
      this.changed();
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'disposeInternal',
    value: function disposeInternal() {
      this.unlistenGeometriesChange_();
      _Geometry3.default.prototype.disposeInternal.call(this);
    }
  }]);

  return GeometryCollection;
}(_Geometry3.default);

/**
 * @param {Array<module:ol/geom/Geometry>} geometries Geometries.
 * @return {Array<module:ol/geom/Geometry>} Cloned geometries.
 */


function cloneGeometries(geometries) {
  var clonedGeometries = [];
  for (var i = 0, ii = geometries.length; i < ii; ++i) {
    clonedGeometries.push(geometries[i].clone());
  }
  return clonedGeometries;
}

exports.default = GeometryCollection;