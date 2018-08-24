'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event2 = require('../events/Event.js');

var _Event3 = _interopRequireDefault(_Event2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module ol/render/Event
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var RenderEvent = function (_Event) {
  _inherits(RenderEvent, _Event);

  /**
   * @param {module:ol/render/EventType} type Type.
   * @param {module:ol/render/VectorContext=} opt_vectorContext Vector context.
   * @param {module:ol/PluggableMap~FrameState=} opt_frameState Frame state.
   * @param {?CanvasRenderingContext2D=} opt_context Context.
   * @param {?module:ol/webgl/Context=} opt_glContext WebGL Context.
   */
  function RenderEvent(type, opt_vectorContext, opt_frameState, opt_context, opt_glContext) {
    _classCallCheck(this, RenderEvent);

    /**
     * For canvas, this is an instance of {@link module:ol/render/canvas/Immediate}.
     * @type {module:ol/render/VectorContext|undefined}
     * @api
     */
    var _this = _possibleConstructorReturn(this, (RenderEvent.__proto__ || Object.getPrototypeOf(RenderEvent)).call(this, type));

    _this.vectorContext = opt_vectorContext;

    /**
     * An object representing the current render frame state.
     * @type {module:ol/PluggableMap~FrameState|undefined}
     * @api
     */
    _this.frameState = opt_frameState;

    /**
     * Canvas context. Only available when a Canvas renderer is used, null
     * otherwise.
     * @type {CanvasRenderingContext2D|null|undefined}
     * @api
     */
    _this.context = opt_context;

    /**
     * WebGL context. Only available when a WebGL renderer is used, null
     * otherwise.
     * @type {module:ol/webgl/Context|null|undefined}
     * @api
     */
    _this.glContext = opt_glContext;

    return _this;
  }

  return RenderEvent;
}(_Event3.default);

exports.default = RenderEvent;