"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/Kinetic
 */

/**
 * @classdesc
 * Implementation of inertial deceleration for map movement.
 *
 * @api
 */
var Kinetic = function () {

  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  function Kinetic(decay, minVelocity, delay) {
    _classCallCheck(this, Kinetic);

    /**
     * @private
     * @type {number}
     */
    this.decay_ = decay;

    /**
     * @private
     * @type {number}
     */
    this.minVelocity_ = minVelocity;

    /**
     * @private
     * @type {number}
     */
    this.delay_ = delay;

    /**
     * @private
     * @type {Array<number>}
     */
    this.points_ = [];

    /**
     * @private
     * @type {number}
     */
    this.angle_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.initialVelocity_ = 0;
  }

  /**
   * FIXME empty description for jsdoc
   */


  _createClass(Kinetic, [{
    key: "begin",
    value: function begin() {
      this.points_.length = 0;
      this.angle_ = 0;
      this.initialVelocity_ = 0;
    }

    /**
     * @param {number} x X.
     * @param {number} y Y.
     */

  }, {
    key: "update",
    value: function update(x, y) {
      this.points_.push(x, y, Date.now());
    }

    /**
     * @return {boolean} Whether we should do kinetic animation.
     */

  }, {
    key: "end",
    value: function end() {
      if (this.points_.length < 6) {
        // at least 2 points are required (i.e. there must be at least 6 elements
        // in the array)
        return false;
      }
      var delay = Date.now() - this.delay_;
      var lastIndex = this.points_.length - 3;
      if (this.points_[lastIndex + 2] < delay) {
        // the last tracked point is too old, which means that the user stopped
        // panning before releasing the map
        return false;
      }

      // get the first point which still falls into the delay time
      var firstIndex = lastIndex - 3;
      while (firstIndex > 0 && this.points_[firstIndex + 2] > delay) {
        firstIndex -= 3;
      }

      var duration = this.points_[lastIndex + 2] - this.points_[firstIndex + 2];
      // we don't want a duration of 0 (divide by zero)
      // we also make sure the user panned for a duration of at least one frame
      // (1/60s) to compute sane displacement values
      if (duration < 1000 / 60) {
        return false;
      }

      var dx = this.points_[lastIndex] - this.points_[firstIndex];
      var dy = this.points_[lastIndex + 1] - this.points_[firstIndex + 1];
      this.angle_ = Math.atan2(dy, dx);
      this.initialVelocity_ = Math.sqrt(dx * dx + dy * dy) / duration;
      return this.initialVelocity_ > this.minVelocity_;
    }

    /**
     * @return {number} Total distance travelled (pixels).
     */

  }, {
    key: "getDistance",
    value: function getDistance() {
      return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
    }

    /**
     * @return {number} Angle of the kinetic panning animation (radians).
     */

  }, {
    key: "getAngle",
    value: function getAngle() {
      return this.angle_;
    }
  }]);

  return Kinetic;
}();

exports.default = Kinetic;