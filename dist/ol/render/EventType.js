'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module ol/render/EventType
 */

/**
 * @enum {string}
 */
exports.default = {
  /**
   * @event module:ol/render/Event~RenderEvent#postcompose
   * @api
   */
  POSTCOMPOSE: 'postcompose',
  /**
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: 'precompose',
  /**
   * @event module:ol/render/Event~RenderEvent#render
   * @api
   */
  RENDER: 'render'
};