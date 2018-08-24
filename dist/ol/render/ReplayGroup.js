"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module ol/render/ReplayGroup
 */
/**
 * Base class for replay groups.
 */
var ReplayGroup = function () {
  function ReplayGroup() {
    _classCallCheck(this, ReplayGroup);
  }

  _createClass(ReplayGroup, [{
    key: "getReplay",

    /**
     * @abstract
     * @param {number|undefined} zIndex Z index.
     * @param {module:ol/render/ReplayType} replayType Replay type.
     * @return {module:ol/render/VectorContext} Replay.
     */
    value: function getReplay(zIndex, replayType) {}

    /**
     * @abstract
     * @return {boolean} Is empty.
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {}
  }]);

  return ReplayGroup;
}();

exports.default = ReplayGroup;