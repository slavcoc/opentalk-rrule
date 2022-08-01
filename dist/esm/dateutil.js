"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.untilStringToDate = exports.timeToUntilString = exports.sort = exports.cloneDates = exports.clone = exports.combine = exports.monthRange = exports.getWeekday = exports.getMonthDays = exports.fromOrdinal = exports.toOrdinal = exports.daysBetween = exports.tzOffset = exports.isValidDate = exports.isDate = exports.isLeapYear = exports.getYearDay = exports.PY_WEEKDAYS = exports.ORDINAL_BASE = exports.MAXYEAR = exports.ONE_DAY = exports.MONTH_DAYS = exports.datetime = void 0;
var helpers_1 = require("./helpers");
var datetime = function (y, m, d, h, i, s) {
    if (h === void 0) { h = 0; }
    if (i === void 0) { i = 0; }
    if (s === void 0) { s = 0; }
    return new Date(Date.UTC(y, m - 1, d, h, i, s));
};
exports.datetime = datetime;
/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
exports.MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * Number of milliseconds of one day
 */
exports.ONE_DAY = 1000 * 60 * 60 * 24;
/**
 * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
 */
exports.MAXYEAR = 9999;
/**
 * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
 * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
 * therefore we use 1-Jan-1970 instead
 */
exports.ORDINAL_BASE = (0, exports.datetime)(1970, 1, 1);
/**
 * Python: MO-SU: 0 - 6
 * JS: SU-SAT 0 - 6
 */
exports.PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
/**
 * py_date.timetuple()[7]
 */
var getYearDay = function (date) {
    var dateNoTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return (Math.ceil((dateNoTime.valueOf() - new Date(date.getUTCFullYear(), 0, 1).valueOf()) /
        exports.ONE_DAY) + 1);
};
exports.getYearDay = getYearDay;
var isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
exports.isLeapYear = isLeapYear;
var isDate = function (value) {
    return value instanceof Date;
};
exports.isDate = isDate;
var isValidDate = function (value) {
    return (0, exports.isDate)(value) && !isNaN(value.getTime());
};
exports.isValidDate = isValidDate;
/**
 * @return {Number} the date's timezone offset in ms
 */
var tzOffset = function (date) {
    return date.getTimezoneOffset() * 60 * 1000;
};
exports.tzOffset = tzOffset;
/**
 * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
 */
var daysBetween = function (date1, date2) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    var date1ms = date1.getTime() - (0, exports.tzOffset)(date1);
    var date2ms = date2.getTime() - (0, exports.tzOffset)(date2);
    // Calculate the difference in milliseconds
    var differencems = date1ms - date2ms;
    // Convert back to days and return
    return Math.round(differencems / exports.ONE_DAY);
};
exports.daysBetween = daysBetween;
/**
 * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
 */
var toOrdinal = function (date) {
    return (0, exports.daysBetween)(date, exports.ORDINAL_BASE);
};
exports.toOrdinal = toOrdinal;
/**
 * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
 */
var fromOrdinal = function (ordinal) {
    return new Date(exports.ORDINAL_BASE.getTime() + ordinal * exports.ONE_DAY);
};
exports.fromOrdinal = fromOrdinal;
var getMonthDays = function (date) {
    var month = date.getUTCMonth();
    return month === 1 && (0, exports.isLeapYear)(date.getUTCFullYear())
        ? 29
        : exports.MONTH_DAYS[month];
};
exports.getMonthDays = getMonthDays;
/**
 * @return {Number} python-like weekday
 */
var getWeekday = function (date) {
    return exports.PY_WEEKDAYS[date.getUTCDay()];
};
exports.getWeekday = getWeekday;
/**
 * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
 */
var monthRange = function (year, month) {
    var date = (0, exports.datetime)(year, month + 1, 1);
    return [(0, exports.getWeekday)(date), (0, exports.getMonthDays)(date)];
};
exports.monthRange = monthRange;
/**
 * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
 */
var combine = function (date, time) {
    time = time || date;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()));
};
exports.combine = combine;
var clone = function (date) {
    var dolly = new Date(date.getTime());
    return dolly;
};
exports.clone = clone;
var cloneDates = function (dates) {
    var clones = [];
    for (var i = 0; i < dates.length; i++) {
        clones.push((0, exports.clone)(dates[i]));
    }
    return clones;
};
exports.cloneDates = cloneDates;
/**
 * Sorts an array of Date or Time objects
 */
var sort = function (dates) {
    dates.sort(function (a, b) {
        return a.getTime() - b.getTime();
    });
};
exports.sort = sort;
var timeToUntilString = function (time, utc) {
    if (utc === void 0) { utc = true; }
    var date = new Date(time);
    return [
        (0, helpers_1.padStart)(date.getUTCFullYear().toString(), 4, '0'),
        (0, helpers_1.padStart)(date.getUTCMonth() + 1, 2, '0'),
        (0, helpers_1.padStart)(date.getUTCDate(), 2, '0'),
        'T',
        (0, helpers_1.padStart)(date.getUTCHours(), 2, '0'),
        (0, helpers_1.padStart)(date.getUTCMinutes(), 2, '0'),
        (0, helpers_1.padStart)(date.getUTCSeconds(), 2, '0'),
        utc ? 'Z' : '',
    ].join('');
};
exports.timeToUntilString = timeToUntilString;
var untilStringToDate = function (until) {
    var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
    var bits = re.exec(until);
    if (!bits)
        throw new Error("Invalid UNTIL value: ".concat(until));
    return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
};
exports.untilStringToDate = untilStringToDate;
//# sourceMappingURL=dateutil.js.map