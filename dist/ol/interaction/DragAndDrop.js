'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _functions = require('../functions.js');

var _events = require('../events.js');

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Interaction2 = require('../interaction/Interaction.js');

var _Interaction3 = _interopRequireDefault(_Interaction2);

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/interaction/DragAndDrop
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
// FIXME should handle all geo-referenced data, not just vector data

/**
 * @typedef {Object} Options
 * @property {Array<function(new: module:ol/format/Feature)>} [formatConstructors] Format constructors.
 * @property {module:ol/source/Vector} [source] Optional vector source where features will be added.  If a source is provided
 * all existing features will be removed and new features will be added when
 * they are dropped on the target.  If you want to add features to a vector
 * source without removing the existing features (append only), instead of
 * providing the source option listen for the "addfeatures" event.
 * @property {module:ol/proj~ProjectionLike} [projection] Target projection. By default, the map's view's projection is used.
 * @property {Element} [target] The element that is used as the drop target, default is the viewport element.
 */

/**
 * @enum {string}
 */
var DragAndDropEventType = {
  /**
   * Triggered when features are added
   * @event module:ol/interaction/DragAndDrop~DragAndDropEvent#addfeatures
   * @api
   */
  ADD_FEATURES: 'addfeatures'
};

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/DragAndDrop~DragAndDrop} instances are instances
 * of this type.
 */

var DragAndDropEvent = function (_Event) {
  _inherits(DragAndDropEvent, _Event);

  /**
   * @param {module:ol/interaction/DragAndDrop~DragAndDropEventType} type Type.
   * @param {File} file File.
   * @param {Array<module:ol/Feature>=} opt_features Features.
   * @param {module:ol/proj/Projection=} opt_projection Projection.
   */
  function DragAndDropEvent(type, file, opt_features, opt_projection) {
    _classCallCheck(this, DragAndDropEvent);

    /**
     * The features parsed from dropped data.
     * @type {Array<module:ol/Feature>|undefined}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (DragAndDropEvent.__proto__ || Object.getPrototypeOf(DragAndDropEvent)).call(this, type));

    _this.features = opt_features;

    /**
     * The dropped file.
     * @type {File}
     * @api
     */
    _this.file = file;

    /**
     * The feature projection.
     * @type {module:ol/proj/Projection|undefined}
     * @api
     */
    _this.projection = opt_projection;

    return _this;
  }

  return DragAndDropEvent;
}(_Event3.default);

/**
 * @classdesc
 * Handles input of vector data by drag and drop.
 * @api
 *
 * @fires module:ol/interaction/DragAndDrop~DragAndDropEvent
 */


var DragAndDrop = function (_Interaction) {
  _inherits(DragAndDrop, _Interaction);

  /**
   * @param {module:ol/interaction/DragAndDrop~Options=} opt_options Options.
   */
  function DragAndDrop(opt_options) {
    _classCallCheck(this, DragAndDrop);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {Array<function(new: module:ol/format/Feature)>}
     */
    var _this2 = _possibleConstructorReturn(this, (DragAndDrop.__proto__ || Object.getPrototypeOf(DragAndDrop)).call(this, {
      handleEvent: _functions.TRUE
    }));

    _this2.formatConstructors_ = options.formatConstructors ? options.formatConstructors : [];

    /**
     * @private
     * @type {module:ol/proj/Projection}
     */
    _this2.projection_ = options.projection ? (0, _proj.get)(options.projection) : null;

    /**
     * @private
     * @type {Array<module:ol/events~EventsKey>}
     */
    _this2.dropListenKeys_ = null;

    /**
     * @private
     * @type {module:ol/source/Vector}
     */
    _this2.source_ = options.source || null;

    /**
     * @private
     * @type {Element}
     */
    _this2.target = options.target ? options.target : null;

    return _this2;
  }

  /**
   * @param {File} file File.
   * @param {Event} event Load event.
   * @private
   */


  _createClass(DragAndDrop, [{
    key: 'handleResult_',
    value: function handleResult_(file, event) {
      var result = event.target.result;
      var map = this.getMap();
      var projection = this.projection_;
      if (!projection) {
        var view = map.getView();
        projection = view.getProjection();
      }

      var formatConstructors = this.formatConstructors_;
      var features = [];
      for (var i = 0, ii = formatConstructors.length; i < ii; ++i) {
        /**
         * Avoid "cannot instantiate abstract class" error.
         * @type {Function}
         */
        var formatConstructor = formatConstructors[i];
        /**
         * @type {module:ol/format/Feature}
         */
        var format = new formatConstructor();
        features = this.tryReadFeatures_(format, result, {
          featureProjection: projection
        });
        if (features && features.length > 0) {
          break;
        }
      }
      if (this.source_) {
        this.source_.clear();
        this.source_.addFeatures(features);
      }
      this.dispatchEvent(new DragAndDropEvent(DragAndDropEventType.ADD_FEATURES, file, features, projection));
    }

    /**
     * @private
     */

  }, {
    key: 'registerListeners_',
    value: function registerListeners_() {
      var map = this.getMap();
      if (map) {
        var dropArea = this.target ? this.target : map.getViewport();
        this.dropListenKeys_ = [(0, _events.listen)(dropArea, _EventType2.default.DROP, handleDrop, this), (0, _events.listen)(dropArea, _EventType2.default.DRAGENTER, handleStop, this), (0, _events.listen)(dropArea, _EventType2.default.DRAGOVER, handleStop, this), (0, _events.listen)(dropArea, _EventType2.default.DROP, handleStop, this)];
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setActive',
    value: function setActive(active) {
      _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'setActive', this).call(this, active);
      if (active) {
        this.registerListeners_();
      } else {
        this.unregisterListeners_();
      }
    }

    /**
     * @inheritDoc
     */

  }, {
    key: 'setMap',
    value: function setMap(map) {
      this.unregisterListeners_();
      _get(DragAndDrop.prototype.__proto__ || Object.getPrototypeOf(DragAndDrop.prototype), 'setMap', this).call(this, map);
      if (this.getActive()) {
        this.registerListeners_();
      }
    }

    /**
     * @param {module:ol/format/Feature} format Format.
     * @param {string} text Text.
     * @param {module:ol/format/Feature~ReadOptions} options Read options.
     * @private
     * @return {Array<module:ol/Feature>} Features.
     */

  }, {
    key: 'tryReadFeatures_',
    value: function tryReadFeatures_(format, text, options) {
      try {
        return format.readFeatures(text, options);
      } catch (e) {
        return null;
      }
    }

    /**
     * @private
     */

  }, {
    key: 'unregisterListeners_',
    value: function unregisterListeners_() {
      if (this.dropListenKeys_) {
        this.dropListenKeys_.forEach(_events.unlistenByKey);
        this.dropListenKeys_ = null;
      }
    }
  }]);

  return DragAndDrop;
}(_Interaction3.default);

/**
 * @param {DragEvent} event Event.
 * @this {module:ol/interaction/DragAndDrop}
 */


function handleDrop(event) {
  var files = event.dataTransfer.files;
  for (var i = 0, ii = files.length; i < ii; ++i) {
    var file = files.item(i);
    var reader = new FileReader();
    reader.addEventListener(_EventType2.default.LOAD, this.handleResult_.bind(this, file));
    reader.readAsText(file);
  }
}

/**
 * @param {DragEvent} event Event.
 */
function handleStop(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

exports.default = DragAndDrop;