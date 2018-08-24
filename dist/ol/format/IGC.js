'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('../format/Feature.js');

var _TextFeature2 = require('../format/TextFeature.js');

var _TextFeature3 = _interopRequireDefault(_TextFeature2);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/format/IGC
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * IGC altitude/z. One of 'barometric', 'gps', 'none'.
 * @enum {string}
 */
var IGCZ = {
  BAROMETRIC: 'barometric',
  GPS: 'gps',
  NONE: 'none'
};

/**
 * @const
 * @type {RegExp}
 */
var B_RECORD_RE = /^B(\d{2})(\d{2})(\d{2})(\d{2})(\d{5})([NS])(\d{3})(\d{5})([EW])([AV])(\d{5})(\d{5})/;

/**
 * @const
 * @type {RegExp}
 */
var H_RECORD_RE = /^H.([A-Z]{3}).*?:(.*)/;

/**
 * @const
 * @type {RegExp}
 */
var HFDTE_RECORD_RE = /^HFDTE(\d{2})(\d{2})(\d{2})/;

/**
 * A regular expression matching the newline characters `\r\n`, `\r` and `\n`.
 *
 * @const
 * @type {RegExp}
 */
var NEWLINE_RE = /\r\n|\r|\n/;

/**
 * @typedef {Object} Options
 * @property {IGCZ|string} [altitudeMode='none'] Altitude mode. Possible
 * values are `'barometric'`, `'gps'`, and `'none'`.
 */

/**
 * @classdesc
 * Feature format for `*.igc` flight recording files.
 *
 * As IGC sources contain a single feature,
 * {@link module:ol/format/IGC~IGC#readFeatures} will return the feature in an
 * array
 *
 * @api
 */

var IGC = function (_TextFeature) {
  _inherits(IGC, _TextFeature);

  /**
   * @param {module:ol/format/IGC~Options=} opt_options Options.
   */
  function IGC(opt_options) {
    _classCallCheck(this, IGC);

    var _this = _possibleConstructorReturn(this, (IGC.__proto__ || Object.getPrototypeOf(IGC)).call(this));

    var options = opt_options ? opt_options : {};

    /**
     * @inheritDoc
     */
    _this.dataProjection = (0, _proj.get)('EPSG:4326');

    /**
     * @private
     * @type {IGCZ}
     */
    _this.altitudeMode_ = options.altitudeMode ? options.altitudeMode : IGCZ.NONE;
    return _this;
  }

  /**
   * @inheritDoc
   */


  _createClass(IGC, [{
    key: 'readFeatureFromText',
    value: function readFeatureFromText(text, opt_options) {
      var altitudeMode = this.altitudeMode_;
      var lines = text.split(NEWLINE_RE);
      /** @type {Object<string, string>} */
      var properties = {};
      var flatCoordinates = [];
      var year = 2000;
      var month = 0;
      var day = 1;
      var lastDateTime = -1;
      var i = void 0,
          ii = void 0;
      for (i = 0, ii = lines.length; i < ii; ++i) {
        var line = lines[i];
        var m = void 0;
        if (line.charAt(0) == 'B') {
          m = B_RECORD_RE.exec(line);
          if (m) {
            var hour = parseInt(m[1], 10);
            var minute = parseInt(m[2], 10);
            var second = parseInt(m[3], 10);
            var y = parseInt(m[4], 10) + parseInt(m[5], 10) / 60000;
            if (m[6] == 'S') {
              y = -y;
            }
            var x = parseInt(m[7], 10) + parseInt(m[8], 10) / 60000;
            if (m[9] == 'W') {
              x = -x;
            }
            flatCoordinates.push(x, y);
            if (altitudeMode != IGCZ.NONE) {
              var z = void 0;
              if (altitudeMode == IGCZ.GPS) {
                z = parseInt(m[11], 10);
              } else if (altitudeMode == IGCZ.BAROMETRIC) {
                z = parseInt(m[12], 10);
              } else {
                z = 0;
              }
              flatCoordinates.push(z);
            }
            var dateTime = Date.UTC(year, month, day, hour, minute, second);
            // Detect UTC midnight wrap around.
            if (dateTime < lastDateTime) {
              dateTime = Date.UTC(year, month, day + 1, hour, minute, second);
            }
            flatCoordinates.push(dateTime / 1000);
            lastDateTime = dateTime;
          }
        } else if (line.charAt(0) == 'H') {
          m = HFDTE_RECORD_RE.exec(line);
          if (m) {
            day = parseInt(m[1], 10);
            month = parseInt(m[2], 10) - 1;
            year = 2000 + parseInt(m[3], 10);
          } else {
            m = H_RECORD_RE.exec(line);
            if (m) {
              properties[m[1]] = m[2].trim();
            }
          }
        }
      }
      if (flatCoordinates.length === 0) {
        return null;
      }
      var layout = altitudeMode == IGCZ.NONE ? _GeometryLayout2.default.XYM : _GeometryLayout2.default.XYZM;
      var lineString = new _LineString2.default(flatCoordinates, layout);
      var feature = new _Feature2.default((0, _Feature3.transformWithOptions)(lineString, false, opt_options));
      feature.setProperties(properties);
      return feature;
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'readFeaturesFromText',
    value: function readFeaturesFromText(text, opt_options) {
      var feature = this.readFeatureFromText(text, opt_options);
      if (feature) {
        return [feature];
      } else {
        return [];
      }
    }
  }]);

  return IGC;
}(_TextFeature3.default);

exports.default = IGC;