'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module ol/Disposable
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _functions = require('./functions.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @classdesc
 * Objects that need to clean up after themselves.
 */
var Disposable = function () {
  function Disposable() {
    _classCallCheck(this, Disposable);
  }

  _createClass(Disposable, [{
    key: 'dispose',

    /**
     * Clean up.
     */
    value: function dispose() {
      if (!this.disposed_) {
        this.disposed_ = true;
        this.disposeInternal();
      }
    }
  }]);

  return Disposable;
}();

/**
 * The object has already been disposed.
 * @type {boolean}
 * @private
 */


Disposable.prototype.disposed_ = false;

/**
 * Extension point for disposable objects.
 * @protected
 */
Disposable.prototype.disposeInternal = _functions.VOID;

exports.default = Disposable;