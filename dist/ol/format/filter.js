'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.and = and;
exports.or = or;
exports.not = not;
exports.bbox = bbox;
exports.contains = contains;
exports.intersects = intersects;
exports.within = within;
exports.equalTo = equalTo;
exports.notEqualTo = notEqualTo;
exports.lessThan = lessThan;
exports.lessThanOrEqualTo = lessThanOrEqualTo;
exports.greaterThan = greaterThan;
exports.greaterThanOrEqualTo = greaterThanOrEqualTo;
exports.isNull = isNull;
exports.between = between;
exports.like = like;
exports.during = during;

var _And = require('../format/filter/And.js');

var _And2 = _interopRequireDefault(_And);

var _Bbox = require('../format/filter/Bbox.js');

var _Bbox2 = _interopRequireDefault(_Bbox);

var _Contains = require('../format/filter/Contains.js');

var _Contains2 = _interopRequireDefault(_Contains);

var _During = require('../format/filter/During.js');

var _During2 = _interopRequireDefault(_During);

var _EqualTo = require('../format/filter/EqualTo.js');

var _EqualTo2 = _interopRequireDefault(_EqualTo);

var _GreaterThan = require('../format/filter/GreaterThan.js');

var _GreaterThan2 = _interopRequireDefault(_GreaterThan);

var _GreaterThanOrEqualTo = require('../format/filter/GreaterThanOrEqualTo.js');

var _GreaterThanOrEqualTo2 = _interopRequireDefault(_GreaterThanOrEqualTo);

var _Intersects = require('../format/filter/Intersects.js');

var _Intersects2 = _interopRequireDefault(_Intersects);

var _IsBetween = require('../format/filter/IsBetween.js');

var _IsBetween2 = _interopRequireDefault(_IsBetween);

var _IsLike = require('../format/filter/IsLike.js');

var _IsLike2 = _interopRequireDefault(_IsLike);

var _IsNull = require('../format/filter/IsNull.js');

var _IsNull2 = _interopRequireDefault(_IsNull);

var _LessThan = require('../format/filter/LessThan.js');

var _LessThan2 = _interopRequireDefault(_LessThan);

var _LessThanOrEqualTo = require('../format/filter/LessThanOrEqualTo.js');

var _LessThanOrEqualTo2 = _interopRequireDefault(_LessThanOrEqualTo);

var _Not = require('../format/filter/Not.js');

var _Not2 = _interopRequireDefault(_Not);

var _NotEqualTo = require('../format/filter/NotEqualTo.js');

var _NotEqualTo2 = _interopRequireDefault(_NotEqualTo);

var _Or = require('../format/filter/Or.js');

var _Or2 = _interopRequireDefault(_Or);

var _Within = require('../format/filter/Within.js');

var _Within2 = _interopRequireDefault(_Within);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a logical `<And>` operator between two or more filter conditions.
 *
 * @param {...module:ol/format/filter/Filter} conditions Filter conditions.
 * @returns {!module:ol/format/filter/And} `<And>` operator.
 * @api
 */
function and(conditions) {
  var params = [null].concat(Array.prototype.slice.call(arguments));
  return new (Function.prototype.bind.apply(_And2.default, params))();
}

/**
 * Create a logical `<Or>` operator between two or more filter conditions.
 *
 * @param {...module:ol/format/filter/Filter} conditions Filter conditions.
 * @returns {!module:ol/format/filter/Or} `<Or>` operator.
 * @api
 */
/**
 * @module ol/format/filter
 */
function or(conditions) {
  var params = [null].concat(Array.prototype.slice.call(arguments));
  return new (Function.prototype.bind.apply(_Or2.default, params))();
}

/**
 * Represents a logical `<Not>` operator for a filter condition.
 *
 * @param {!module:ol/format/filter/Filter} condition Filter condition.
 * @returns {!module:ol/format/filter/Not} `<Not>` operator.
 * @api
 */
function not(condition) {
  return new _Not2.default(condition);
}

/**
 * Create a `<BBOX>` operator to test whether a geometry-valued property
 * intersects a fixed bounding box
 *
 * @param {!string} geometryName Geometry name to use.
 * @param {!module:ol/extent~Extent} extent Extent.
 * @param {string=} opt_srsName SRS name. No srsName attribute will be
 *    set on geometries when this is not provided.
 * @returns {!module:ol/format/filter/Bbox} `<BBOX>` operator.
 * @api
 */
function bbox(geometryName, extent, opt_srsName) {
  return new _Bbox2.default(geometryName, extent, opt_srsName);
}

/**
 * Create a `<Contains>` operator to test whether a geometry-valued property
 * contains a given geometry.
 *
 * @param {!string} geometryName Geometry name to use.
 * @param {!module:ol/geom/Geometry} geometry Geometry.
 * @param {string=} opt_srsName SRS name. No srsName attribute will be
 *    set on geometries when this is not provided.
 * @returns {!module:ol/format/filter/Contains} `<Contains>` operator.
 * @api
 */
function contains(geometryName, geometry, opt_srsName) {
  return new _Contains2.default(geometryName, geometry, opt_srsName);
}

/**
 * Create a `<Intersects>` operator to test whether a geometry-valued property
 * intersects a given geometry.
 *
 * @param {!string} geometryName Geometry name to use.
 * @param {!module:ol/geom/Geometry} geometry Geometry.
 * @param {string=} opt_srsName SRS name. No srsName attribute will be
 *    set on geometries when this is not provided.
 * @returns {!module:ol/format/filter/Intersects} `<Intersects>` operator.
 * @api
 */
function intersects(geometryName, geometry, opt_srsName) {
  return new _Intersects2.default(geometryName, geometry, opt_srsName);
}

/**
 * Create a `<Within>` operator to test whether a geometry-valued property
 * is within a given geometry.
 *
 * @param {!string} geometryName Geometry name to use.
 * @param {!module:ol/geom/Geometry} geometry Geometry.
 * @param {string=} opt_srsName SRS name. No srsName attribute will be
 *    set on geometries when this is not provided.
 * @returns {!module:ol/format/filter/Within} `<Within>` operator.
 * @api
 */
function within(geometryName, geometry, opt_srsName) {
  return new _Within2.default(geometryName, geometry, opt_srsName);
}

/**
 * Creates a `<PropertyIsEqualTo>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!(string|number)} expression The value to compare.
 * @param {boolean=} opt_matchCase Case-sensitive?
 * @returns {!module:ol/format/filter/EqualTo} `<PropertyIsEqualTo>` operator.
 * @api
 */
function equalTo(propertyName, expression, opt_matchCase) {
  return new _EqualTo2.default(propertyName, expression, opt_matchCase);
}

/**
 * Creates a `<PropertyIsNotEqualTo>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!(string|number)} expression The value to compare.
 * @param {boolean=} opt_matchCase Case-sensitive?
 * @returns {!module:ol/format/filter/NotEqualTo} `<PropertyIsNotEqualTo>` operator.
 * @api
 */
function notEqualTo(propertyName, expression, opt_matchCase) {
  return new _NotEqualTo2.default(propertyName, expression, opt_matchCase);
}

/**
 * Creates a `<PropertyIsLessThan>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!number} expression The value to compare.
 * @returns {!module:ol/format/filter/LessThan} `<PropertyIsLessThan>` operator.
 * @api
 */
function lessThan(propertyName, expression) {
  return new _LessThan2.default(propertyName, expression);
}

/**
 * Creates a `<PropertyIsLessThanOrEqualTo>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!number} expression The value to compare.
 * @returns {!module:ol/format/filter/LessThanOrEqualTo} `<PropertyIsLessThanOrEqualTo>` operator.
 * @api
 */
function lessThanOrEqualTo(propertyName, expression) {
  return new _LessThanOrEqualTo2.default(propertyName, expression);
}

/**
 * Creates a `<PropertyIsGreaterThan>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!number} expression The value to compare.
 * @returns {!module:ol/format/filter/GreaterThan} `<PropertyIsGreaterThan>` operator.
 * @api
 */
function greaterThan(propertyName, expression) {
  return new _GreaterThan2.default(propertyName, expression);
}

/**
 * Creates a `<PropertyIsGreaterThanOrEqualTo>` comparison operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!number} expression The value to compare.
 * @returns {!module:ol/format/filter/GreaterThanOrEqualTo} `<PropertyIsGreaterThanOrEqualTo>` operator.
 * @api
 */
function greaterThanOrEqualTo(propertyName, expression) {
  return new _GreaterThanOrEqualTo2.default(propertyName, expression);
}

/**
 * Creates a `<PropertyIsNull>` comparison operator to test whether a property value
 * is null.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @returns {!module:ol/format/filter/IsNull} `<PropertyIsNull>` operator.
 * @api
 */
function isNull(propertyName) {
  return new _IsNull2.default(propertyName);
}

/**
 * Creates a `<PropertyIsBetween>` comparison operator to test whether an expression
 * value lies within a range given by a lower and upper bound (inclusive).
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!number} lowerBoundary The lower bound of the range.
 * @param {!number} upperBoundary The upper bound of the range.
 * @returns {!module:ol/format/filter/IsBetween} `<PropertyIsBetween>` operator.
 * @api
 */
function between(propertyName, lowerBoundary, upperBoundary) {
  return new _IsBetween2.default(propertyName, lowerBoundary, upperBoundary);
}

/**
 * Represents a `<PropertyIsLike>` comparison operator that matches a string property
 * value against a text pattern.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!string} pattern Text pattern.
 * @param {string=} opt_wildCard Pattern character which matches any sequence of
 *    zero or more string characters. Default is '*'.
 * @param {string=} opt_singleChar pattern character which matches any single
 *    string character. Default is '.'.
 * @param {string=} opt_escapeChar Escape character which can be used to escape
 *    the pattern characters. Default is '!'.
 * @param {boolean=} opt_matchCase Case-sensitive?
 * @returns {!module:ol/format/filter/IsLike} `<PropertyIsLike>` operator.
 * @api
 */
function like(propertyName, pattern, opt_wildCard, opt_singleChar, opt_escapeChar, opt_matchCase) {
  return new _IsLike2.default(propertyName, pattern, opt_wildCard, opt_singleChar, opt_escapeChar, opt_matchCase);
}

/**
 * Create a `<During>` temporal operator.
 *
 * @param {!string} propertyName Name of the context property to compare.
 * @param {!string} begin The begin date in ISO-8601 format.
 * @param {!string} end The end date in ISO-8601 format.
 * @returns {!module:ol/format/filter/During} `<During>` operator.
 * @api
 */
function during(propertyName, begin, end) {
  return new _During2.default(propertyName, begin, end);
}