"use strict";
// =============================================================================
// Helper functions
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.includes = exports.notEmpty = exports.empty = exports.divmod = exports.pymod = exports.split = exports.padStart = exports.toArray = exports.repeat = exports.clone = exports.range = exports.isArray = exports.isWeekdayStr = exports.isNumber = exports.isPresent = void 0;
var weekday_1 = require("./weekday");
var isPresent = function (value) {
    return value !== null && value !== undefined;
};
exports.isPresent = isPresent;
var isNumber = function (value) {
    return typeof value === 'number';
};
exports.isNumber = isNumber;
var isWeekdayStr = function (value) {
    return typeof value === 'string' && weekday_1.ALL_WEEKDAYS.includes(value);
};
exports.isWeekdayStr = isWeekdayStr;
exports.isArray = Array.isArray;
/**
 * Simplified version of python's range()
 */
var range = function (start, end) {
    if (end === void 0) { end = start; }
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    var rang = [];
    for (var i = start; i < end; i++)
        rang.push(i);
    return rang;
};
exports.range = range;
var clone = function (array) {
    return [].concat(array);
};
exports.clone = clone;
var repeat = function (value, times) {
    var i = 0;
    var array = [];
    if ((0, exports.isArray)(value)) {
        for (; i < times; i++)
            array[i] = [].concat(value);
    }
    else {
        for (; i < times; i++)
            array[i] = value;
    }
    return array;
};
exports.repeat = repeat;
var toArray = function (item) {
    if ((0, exports.isArray)(item)) {
        return item;
    }
    return [item];
};
exports.toArray = toArray;
function padStart(item, targetLength, padString) {
    if (padString === void 0) { padString = ' '; }
    var str = String(item);
    targetLength = targetLength >> 0;
    if (str.length > targetLength) {
        return String(str);
    }
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
        padString += (0, exports.repeat)(padString, targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(str);
}
exports.padStart = padStart;
/**
 * Python like split
 */
var split = function (str, sep, num) {
    var splits = str.split(sep);
    return num
        ? splits.slice(0, num).concat([splits.slice(num).join(sep)])
        : splits;
};
exports.split = split;
/**
 * closure/goog/math/math.js:modulo
 * Copyright 2006 The Closure Library Authors.
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 * or b < x <= 0, depending on the sign of b).
 */
var pymod = function (a, b) {
    var r = a % b;
    // If r and b differ in sign, add b to wrap the result to the correct sign.
    return r * b < 0 ? r + b : r;
};
exports.pymod = pymod;
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
var divmod = function (a, b) {
    return { div: Math.floor(a / b), mod: (0, exports.pymod)(a, b) };
};
exports.divmod = divmod;
var empty = function (obj) {
    return !(0, exports.isPresent)(obj) || obj.length === 0;
};
exports.empty = empty;
/**
 * Python-like boolean
 *
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
var notEmpty = function (obj) {
    return !(0, exports.empty)(obj);
};
exports.notEmpty = notEmpty;
/**
 * Return true if a value is in an array
 */
var includes = function (arr, val) {
    return (0, exports.notEmpty)(arr) && arr.indexOf(val) !== -1;
};
exports.includes = includes;
//# sourceMappingURL=helpers.js.map