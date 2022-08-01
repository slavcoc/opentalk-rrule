// =============================================================================
// Helper functions
// =============================================================================
import { ALL_WEEKDAYS } from './weekday';
export var isPresent = function (value) {
    return value !== null && value !== undefined;
};
export var isNumber = function (value) {
    return typeof value === 'number';
};
export var isWeekdayStr = function (value) {
    return typeof value === 'string' && ALL_WEEKDAYS.includes(value);
};
export var isArray = Array.isArray;
/**
 * Simplified version of python's range()
 */
export var range = function (start, end) {
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
export var clone = function (array) {
    return [].concat(array);
};
export var repeat = function (value, times) {
    var i = 0;
    var array = [];
    if (isArray(value)) {
        for (; i < times; i++)
            array[i] = [].concat(value);
    }
    else {
        for (; i < times; i++)
            array[i] = value;
    }
    return array;
};
export var toArray = function (item) {
    if (isArray(item)) {
        return item;
    }
    return [item];
};
export function padStart(item, targetLength, padString) {
    if (padString === void 0) { padString = ' '; }
    var str = String(item);
    targetLength = targetLength >> 0;
    if (str.length > targetLength) {
        return String(str);
    }
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
        padString += repeat(padString, targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(str);
}
/**
 * Python like split
 */
export var split = function (str, sep, num) {
    var splits = str.split(sep);
    return num
        ? splits.slice(0, num).concat([splits.slice(num).join(sep)])
        : splits;
};
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
export var pymod = function (a, b) {
    var r = a % b;
    // If r and b differ in sign, add b to wrap the result to the correct sign.
    return r * b < 0 ? r + b : r;
};
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
export var divmod = function (a, b) {
    return { div: Math.floor(a / b), mod: pymod(a, b) };
};
export var empty = function (obj) {
    return !isPresent(obj) || obj.length === 0;
};
/**
 * Python-like boolean
 *
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
export var notEmpty = function (obj) {
    return !empty(obj);
};
/**
 * Return true if a value is in an array
 */
export var includes = function (arr, val) {
    return notEmpty(arr) && arr.indexOf(val) !== -1;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUNoRixtQkFBbUI7QUFDbkIsZ0ZBQWdGO0FBRWhGLE9BQU8sRUFBRSxZQUFZLEVBQWMsTUFBTSxXQUFXLENBQUE7QUFFcEQsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFHLFVBQ3ZCLEtBQTRCO0lBRTVCLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFBO0FBQzlDLENBQUMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxJQUFNLFFBQVEsR0FBRyxVQUFVLEtBQWM7SUFDOUMsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUE7QUFDbEMsQ0FBQyxDQUFBO0FBRUQsTUFBTSxDQUFDLElBQU0sWUFBWSxHQUFHLFVBQVUsS0FBYztJQUNsRCxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQW1CLENBQUMsQ0FBQTtBQUNoRixDQUFDLENBQUE7QUFFRCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQTtBQUVwQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxJQUFNLEtBQUssR0FBRyxVQUFVLEtBQWEsRUFBRSxHQUFtQjtJQUFuQixvQkFBQSxFQUFBLFdBQW1CO0lBQy9ELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsR0FBRyxHQUFHLEtBQUssQ0FBQTtRQUNYLEtBQUssR0FBRyxDQUFDLENBQUE7S0FDVjtJQUNELElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QyxPQUFPLElBQUks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