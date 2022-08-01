"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RRule = exports.defaultKeys = exports.DEFAULT_OPTIONS = exports.Days = void 0;
var tslib_1 = require("tslib");
var dateutil_1 = require("./dateutil");
var iterresult_1 = tslib_1.__importDefault(require("./iterresult"));
var callbackiterresult_1 = tslib_1.__importDefault(require("./callbackiterresult"));
var index_1 = require("./nlp/index");
var types_1 = require("./types");
var parseoptions_1 = require("./parseoptions");
var parsestring_1 = require("./parsestring");
var optionstostring_1 = require("./optionstostring");
var cache_1 = require("./cache");
var weekday_1 = require("./weekday");
var index_2 = require("./iter/index");
// =============================================================================
// RRule
// =============================================================================
exports.Days = {
    MO: new weekday_1.Weekday(0),
    TU: new weekday_1.Weekday(1),
    WE: new weekday_1.Weekday(2),
    TH: new weekday_1.Weekday(3),
    FR: new weekday_1.Weekday(4),
    SA: new weekday_1.Weekday(5),
    SU: new weekday_1.Weekday(6),
};
exports.DEFAULT_OPTIONS = {
    freq: types_1.Frequency.YEARLY,
    dtstart: null,
    interval: 1,
    wkst: exports.Days.MO,
    count: null,
    until: null,
    tzid: null,
    bysetpos: null,
    bymonth: null,
    bymonthday: null,
    bynmonthday: null,
    byyearday: null,
    byweekno: null,
    byweekday: null,
    bynweekday: null,
    byhour: null,
    byminute: null,
    bysecond: null,
    byeaster: null,
};
exports.defaultKeys = Object.keys(exports.DEFAULT_OPTIONS);
/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 * - The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
var RRule = /** @class */ (function () {
    function RRule(options, noCache) {
        if (options === void 0) { options = {}; }
        if (noCache === void 0) { noCache = false; }
        // RFC string
        this._cache = noCache ? null : new cache_1.Cache();
        // used by toString()
        this.origOptions = (0, parseoptions_1.initializeOptions)(options);
        var parsedOptions = (0, parseoptions_1.parseOptions)(options).parsedOptions;
        this.options = parsedOptions;
    }
    RRule.parseText = function (text, language) {
        return (0, index_1.parseText)(text, language);
    };
    RRule.fromText = function (text, language) {
        return (0, index_1.fromText)(text, language);
    };
    RRule.fromString = function (str) {
        return new RRule(RRule.parseString(str) || undefined);
    };
    RRule.prototype._iter = function (iterResult) {
        return (0, index_2.iter)(iterResult, this.options);
    };
    RRule.prototype._cacheGet = function (what, args) {
        if (!this._cache)
            return false;
        return this._cache._cacheGet(what, args);
    };
    RRule.prototype._cacheAdd = function (what, value, args) {
        if (!this._cache)
            return;
        return this._cache._cacheAdd(what, value, args);
    };
    /**
     * @param {Function} iterator - optional function that will be called
     * on each date that is added. It can return false
     * to stop the iteration.
     * @return Array containing all recurrences.
     */
    RRule.prototype.all = function (iterator) {
        if (iterator) {
            return this._iter(new callbackiterresult_1.default('all', {}, iterator));
        }
        var result = this._cacheGet('all');
        if (result === false) {
            result = this._iter(new iterresult_1.default('all', {}));
            this._cacheAdd('all', result);
        }
        return result;
    };
    /**
     * Returns all the occurrences of the rrule between after and before.
     * The inc keyword defines what happens if after and/or before are
     * themselves occurrences. With inc == True, they will be included in the
     * list, if they are found in the recurrence set.
     *
     * @return Array
     */
    RRule.prototype.between = function (after, before, inc, iterator) {
        if (inc === void 0) { inc = false; }
        if (!(0, dateutil_1.isValidDate)(after) || !(0, dateutil_1.isValidDate)(before)) {
            throw new Error('Invalid date passed in to RRule.between');
        }
        var args = {
            before: before,
            after: after,
            inc: inc,
        };
        if (iterator) {
            return this._iter(new callbackiterresult_1.default('between', args, iterator));
        }
        var result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('between', args));
            this._cacheAdd('between', result, args);
        }
        return result;
    };
    /**
     * Returns the last recurrence before the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     *
     * @return Date or null
     */
    RRule.prototype.before = function (dt, inc) {
        if (inc === void 0) { inc = false; }
        if (!(0, dateutil_1.isValidDate)(dt)) {
            throw new Error('Invalid date passed in to RRule.before');
        }
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('before', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('before', args));
            this._cacheAdd('before', result, args);
        }
        return result;
    };
    /**
     * Returns the first recurrence after the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     *
     * @return Date or null
     */
    RRule.prototype.after = function (dt, inc) {
        if (inc === void 0) { inc = false; }
        if (!(0, dateutil_1.isValidDate)(dt)) {
            throw new Error('Invalid date passed in to RRule.after');
        }
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('after', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('after', args));
            this._cacheAdd('after', result, args);
        }
        return result;
    };
    /**
     * Returns the number of recurrences in this set. It will have go trough
     * the whole recurrence, if this hasn't been done before.
     */
    RRule.prototype.count = function () {
        return this.all().length;
    };
    /**
     * Converts the rrule into its string representation
     *
     * @see <http://www.ietf.org/rfc/rfc2445.txt>
     * @return String
     */
    RRule.prototype.toString = function () {
        return (0, optionstostring_1.optionsToString)(this.origOptions);
    };
    /**
     * Will convert all rules described in nlp:ToText
     * to text.
     */
    RRule.prototype.toText = function (gettext, language, dateFormatter) {
        return (0, index_1.toText)(this, gettext, language, dateFormatter);
    };
    RRule.prototype.isFullyConvertibleToText = function () {
        return (0, index_1.isFullyConvertible)(this);
    };
    /**
     * @return a RRule instance with the same freq and options
     * as this one (cache is not cloned)
     */
    RRule.prototype.clone = function () {
        return new RRule(this.origOptions);
    };
    // RRule class 'constants'
    RRule.FREQUENCIES = [
        'YEARLY',
        'MONTHLY',
        'WEEKLY',
        'DAILY',
        'HOURLY',
        'MINUTELY',
        'SECONDLY',
    ];
    RRule.YEARLY = types_1.Frequency.YEARLY;
    RRule.MONTHLY = types_1.Frequency.MONTHLY;
    RRule.WEEKLY = types_1.Frequency.WEEKLY;
    RRule.DAILY = types_1.Frequency.DAILY;
    RRule.HOURLY = types_1.Frequency.HOURLY;
    RRule.MINUTELY = types_1.Frequency.MINUTELY;
    RRule.SECONDLY = types_1.Frequency.SECONDLY;
    RRule.MO = exports.Days.MO;
    RRule.TU = exports.Days.TU;
    RRule.WE = exports.Days.WE;
    RRule.TH = exports.Days.TH;
    RRule.FR = exports.Days.FR;
    RRule.SA = exports.Days.SA;
    RRule.SU = exports.Days.SU;
    RRule.parseString = parsestring_1.parseString;
    RRule.optionsToString = optionstostring_1.optionsToString;
    return RRule;
}());
exports.RRule = RRule;
//# sourceMappingURL=rrule.js.map