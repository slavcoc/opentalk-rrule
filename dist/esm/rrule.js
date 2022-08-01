import { isValidDate } from './dateutil';
import IterResult from './iterresult';
import CallbackIterResult from './callbackiterresult';
import { fromText, parseText, toText, isFullyConvertible } from './nlp/index';
import { Frequency, } from './types';
import { parseOptions, initializeOptions } from './parseoptions';
import { parseString } from './parsestring';
import { optionsToString } from './optionstostring';
import { Cache } from './cache';
import { Weekday } from './weekday';
import { iter } from './iter/index';
// =============================================================================
// RRule
// =============================================================================
export var Days = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6),
};
export var DEFAULT_OPTIONS = {
    freq: Frequency.YEARLY,
    dtstart: null,
    interval: 1,
    wkst: Days.MO,
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
export var defaultKeys = Object.keys(DEFAULT_OPTIONS);
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
        this._cache = noCache ? null : new Cache();
        // used by toString()
        this.origOptions = initializeOptions(options);
        var parsedOptions = parseOptions(options).parsedOptions;
        this.options = parsedOptions;
    }
    RRule.parseText = function (text, language) {
        return parseText(text, language);
    };
    RRule.fromText = function (text, language) {
        return fromText(text, language);
    };
    RRule.fromString = function (str) {
        return new RRule(RRule.parseString(str) || undefined);
    };
    RRule.prototype._iter = function (iterResult) {
        return iter(iterResult, this.options);
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
            return this._iter(new CallbackIterResult('all', {}, iterator));
        }
        var result = this._cacheGet('all');
        if (result === false) {
            result = this._iter(new IterResult('all', {}));
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
        if (!isValidDate(after) || !isValidDate(before)) {
            throw new Error('Invalid date passed in to RRule.between');
        }
        var args = {
            before: before,
            after: after,
            inc: inc,
        };
        if (iterator) {
            return this._iter(new CallbackIterResult('between', args, iterator));
        }
        var result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new IterResult('between', args));
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
        if (!isValidDate(dt)) {
            throw new Error('Invalid date passed in to RRule.before');
        }
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('before', args);
        if (result === false) {
            result = this._iter(new IterResult('before', args));
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
        if (!isValidDate(dt)) {
            throw new Error('Invalid date passed in to RRule.after');
        }
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('after', args);
        if (result === false) {
            result = this._iter(new IterResult('after', args));
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
        return optionsToString(this.origOptions);
    };
    /**
     * Will convert all rules described in nlp:ToText
     * to text.
     */
    RRule.prototype.toText = function (gettext, language, dateFormatter) {
        return toText(this, gettext, language, dateFormatter);
    };
    RRule.prototype.isFullyConvertibleToText = function () {
        return isFullyConvertible(this);
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
    RRule.YEARLY = Frequency.YEARLY;
    RRule.MONTHLY = Frequency.MONTHLY;
    RRule.WEEKLY = Frequency.WEEKLY;
    RRule.DAILY = Frequency.DAILY;
    RRule.HOURLY = Frequency.HOURLY;
    RRule.MINUTELY = Frequency.MINUTELY;
    RRule.SECONDLY = Frequency.SECONDLY;
    RRule.MO = Days.MO;
    RRule.TU = Days.TU;
    RRule.WE = Days.WE;
    RRule.TH = Days.TH;
    RRule.FR = Days.FR;
    RRule.SA = Days.SA;
    RRule.SU = Days.SU;
    RRule.parseString = parseString;
    RRule.optionsToString = optionsToString;
    return RRule;
}());
export { RRule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUV4QyxPQUFPLFVBQXdCLE1BQU0sY0FBYyxDQUFBO0FBQ25ELE9BQU8sa0JBQWtCLE1BQU0sc0JBQXNCLENBQUE7QUFFckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sYUFBYSxDQUFBO0FBRTdFLE9BQU8sRUFHTCxTQUFTLEdBSVYsTUFBTSxTQUFTLENBQUE7QUFDaEIsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQ2hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFBO0FBQ25ELE9BQU8sRUFBRSxLQUFLLEVBQWEsTUFBTSxTQUFTLENBQUE7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUNuQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBRW5DLGdGQUFnRjtBQUNoRixRQUFRO0FBQ1IsZ0ZBQWdGO0FBRWhGLE1BQU0sQ0FBQyxJQUFNLElBQUksR0FBRztJQUNsQixFQUFFLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLEVBQUUsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEIsRUFBRSxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsQixFQUFFLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLEVBQUUsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEIsRUFBRSxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztJ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