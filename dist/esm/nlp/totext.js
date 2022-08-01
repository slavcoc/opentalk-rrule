import ENGLISH from './i18n';
import { RRule } from '../rrule';
import { isArray, isNumber, isPresent } from '../helpers';
// =============================================================================
// Helper functions
// =============================================================================
/**
 * Return true if a value is in an array
 */
var contains = function (arr, val) {
    return arr.indexOf(val) !== -1;
};
var defaultGetText = function (id) { return id.toString(); };
var defaultDateFormatter = function (year, month, day) { return "".concat(month, " ").concat(day, ", ").concat(year); };
/**
 *
 * @param {RRule} rrule
 * Optional:
 * @param {Function} gettext function
 * @param {Object} language definition
 * @constructor
 */
var ToText = /** @class */ (function () {
    function ToText(rrule, gettext, language, dateFormatter) {
        if (gettext === void 0) { gettext = defaultGetText; }
        if (language === void 0) { language = ENGLISH; }
        if (dateFormatter === void 0) { dateFormatter = defaultDateFormatter; }
        this.text = [];
        this.language = language || ENGLISH;
        this.gettext = gettext;
        this.dateFormatter = dateFormatter;
        this.rrule = rrule;
        this.options = rrule.options;
        this.origOptions = rrule.origOptions;
        if (this.origOptions.bymonthday) {
            var bymonthday = [].concat(this.options.bymonthday);
            var bynmonthday = [].concat(this.options.bynmonthday);
            bymonthday.sort(function (a, b) { return a - b; });
            bynmonthday.sort(function (a, b) { return b - a; });
            // 1, 2, 3, .., -5, -4, -3, ..
            this.bymonthday = bymonthday.concat(bynmonthday);
            if (!this.bymonthday.length)
                this.bymonthday = null;
        }
        if (isPresent(this.origOptions.byweekday)) {
            var byweekday = !isArray(this.origOptions.byweekday)
                ? [this.origOptions.byweekday]
                : this.origOptions.byweekday;
            var days = String(byweekday);
            this.byweekday = {
                allWeeks: byweekday.filter(function (weekday) {
                    return !weekday.n;
                }),
                someWeeks: byweekday.filter(function (weekday) {
                    return Boolean(weekday.n);
                }),
                isWeekdays: days.indexOf('MO') !== -1 &&
                    days.indexOf('TU') !== -1 &&
                    days.indexOf('WE') !== -1 &&
                    days.indexOf('TH') !== -1 &&
                    days.indexOf('FR') !== -1 &&
                    days.indexOf('SA') === -1 &&
                    days.indexOf('SU') === -1,
                isEveryDay: days.indexOf('MO') !== -1 &&
                    days.indexOf('TU') !== -1 &&
                    days.indexOf('WE') !== -1 &&
                    days.indexOf('TH') !== -1 &&
                    days.indexOf('FR') !== -1 &&
                    days.indexOf('SA') !== -1 &&
                    days.indexOf('SU') !== -1,
            };
            var sortWeekDays = function (a, b) {
                return a.weekday - b.weekday;
            };
            this.byweekday.allWeeks.sort(sortWeekDays);
            this.byweekday.someWeeks.sort(sortWeekDays);
            if (!this.byweekday.allWeeks.length)
                this.byweekday.allWeeks = null;
            if (!this.byweekday.someWeeks.length)
                this.byweekday.someWeeks = null;
        }
        else {
            this.byweekday = null;
        }
    }
    /**
     * Test whether the rrule can be fully converted to text.
     *
     * @param {RRule} rrule
     * @return {Boolean}
     */
    ToText.isFullyConvertible = function (rrule) {
        var canConvert = true;
        if (!(rrule.options.freq in ToText.IMPLEMENTED))
            return false;
        if (rrule.origOptions.until && rrule.origOptions.count)
            return false;
        for (var key in rrule.origOptions) {
            if (contains(['dtstart', 'wkst', 'freq'], key))
                return true;
            if (!contains(ToText.IMPLEMENTED[rrule.options.freq], key))
                return false;
        }
        return canConvert;
    };
    ToText.prototype.isFullyConvertible = function () {
        return ToText.isFullyConvertible(this.rrule);
    };
    /**
     * Perform the conversion. Only some of the frequencies are supported.
     * If some of the rrule's options aren't supported, they'll
     * be omitted from the output an "(~ approximate)" will be appended.
     *
     * @return {*}
     */
    ToText.prototype.toString = function () {
        var gettext = this.gettext;
        if (!(this.options.freq in ToText.IMPLEMENTED)) {
            return gettext('RRule error: Unable to fully convert this rrule to text');
        }
        this.text = [gettext('every')];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[RRule.FREQUENCIES[this.options.freq]]();
        if (this.options.until) {
            this.add(gettext('until'));
            var until = this.options.until;
            this.add(this.dateFormatter(until.getUTCFullYear(), this.language.monthNames[until.getUTCMonth()], until.getUTCDate()));
        }
        else if (this.options.count) {
            this.add(gettext('for'))
                .add(this.options.count.toString())
                .add(this.plural(this.options.count) ? gettext('times') : gettext('time'));
        }
        if (!this.isFullyConvertible())
            this.add(gettext('(~ approximate)'));
        return this.text.join('');
    };
    ToText.prototype.HOURLY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval) ? gettext('hours') : gettext('hour'));
    };
    ToText.prototype.MINUTELY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval)
            ? gettext('minutes')
            : gettext('minute'));
    };
    ToText.prototype.DAILY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        if (this.byweekday && this.byweekday.isWeekdays) {
            this.add(this.plural(this.options.interval)
                ? gettext('weekdays')
                : gettext('weekday'));
        }
        else {
            this.add(this.plural(this.options.interval) ? gettext('days') : gettext('day'));
        }
        if (this.origOptions.bymonth) {
            this.add(gettext('in'));
            this._bymonth();
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday) {
            this._byweekday();
        }
        else if (this.origOptions.byhour) {
            this._byhour();
        }
    };
    ToText.prototype.WEEKLY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1) {
            this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? gettext('weeks') : gettext('week'));
        }
        if (this.byweekday && this.byweekday.isWeekdays) {
            if (this.options.interval === 1) {
                this.add(this.plural(this.options.interval)
                    ? gettext('weekdays')
                    : gettext('weekday'));
            }
            else {
                this.add(gettext('on')).add(gettext('weekdays'));
            }
        }
        else if (this.byweekday && this.byweekday.isEveryDay) {
            this.add(this.plural(this.options.interval) ? gettext('days') : gettext('day'));
        }
        else {
            if (this.options.interval === 1)
                this.add(gettext('week'));
            if (this.origOptions.bymonth) {
                this.add(gettext('in'));
                this._bymonth();
            }
            if (this.bymonthday) {
                this._bymonthday();
            }
            else if (this.byweekday) {
                this._byweekday();
            }
        }
    };
    ToText.prototype.MONTHLY = function () {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString()).add(gettext('months'));
                if (this.plural(this.options.interval))
                    this.add(gettext('in'));
            }
            else {
                // this.add(gettext('MONTH'))
            }
            this._bymonth();
        }
        else {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString());
            }
            this.add(this.plural(this.options.interval)
                ? gettext('months')
                : gettext('month'));
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday && this.byweekday.isWeekdays) {
            this.add(gettext('on')).add(gettext('weekdays'));
        }
        else if (this.byweekday) {
            this._byweekday();
        }
    };
    ToText.prototype.YEARLY = function () {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString());
                this.add(gettext('years'));
            }
            else {
                // this.add(gettext('YEAR'))
            }
            this._bymonth();
        }
        else {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString());
            }
            this.add(this.plural(this.options.interval) ? gettext('years') : gettext('year'));
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday) {
            this._byweekday();
        }
        if (this.options.byyearday) {
            this.add(gettext('on the'))
                .add(this.list(this.options.byyearday, this.nth, gettext('and')))
                .add(gettext('day'));
        }
        if (this.options.byweekno) {
            this.add(gettext('in'))
                .add(this.plural(this.options.byweekno.length)
                ? gettext('weeks')
                : gettext('week'))
                .add(this.list(this.options.byweekno, undefined, gettext('and')));
        }
    };
    ToText.prototype._bymonthday = function () {
        var gettext = this.gettext;
        if (this.byweekday && this.byweekday.allWeeks) {
            this.add(gettext('on'))
                .add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext('or')))
                .add(gettext('the'))
                .add(this.list(this.bymonthday, this.nth, gettext('or')));
        }
        else {
            this.add(gettext('on the')).add(this.list(this.bymonthday, this.nth, gettext('and')));
        }
        // this.add(gettext('DAY'))
    };
    ToText.prototype._byweekday = function () {
        var gettext = this.gettext;
        if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
            this.add(gettext('on')).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
        }
        if (this.byweekday.someWeeks) {
            if (this.byweekday.allWeeks)
                this.add(gettext('and'));
            this.add(gettext('on the')).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext('and')));
        }
    };
    ToText.prototype._byhour = function () {
        var gettext = this.gettext;
        this.add(gettext('at')).add(this.list(this.origOptions.byhour, undefined, gettext('and')));
    };
    ToText.prototype._bymonth = function () {
        this.add(this.list(this.options.bymonth, this.monthtext, this.gettext('and')));
    };
    ToText.prototype.nth = function (n) {
        n = parseInt(n.toString(), 10);
        var nth;
        var gettext = this.gettext;
        if (n === -1)
            return gettext('last');
        var npos = Math.abs(n);
        switch (npos) {
            case 1:
            case 21:
            case 31:
                nth = npos + gettext('st');
                break;
            case 2:
            case 22:
                nth = npos + gettext('nd');
                break;
            case 3:
            case 23:
                nth = npos + gettext('rd');
                break;
            default:
                nth = npos + gettext('th');
        }
        return n < 0 ? nth + ' ' + gettext('last') : nth;
    };
    ToText.prototype.monthtext = function (m) {
        return this.language.monthNames[m - 1];
    };
    ToText.prototype.weekdaytext = function (wday) {
        var weekday = isNumber(wday) ? (wday + 1) % 7 : wday.getJsWeekday();
        return ((wday.n ? this.nth(wday.n) + ' ' : '') +
            this.language.dayNames[weekday]);
    };
    ToText.prototype.plural = function (n) {
        return n % 100 !== 1;
    };
    ToText.prototype.add = function (s) {
        this.text.push(' ');
        this.text.push(s);
        return this;
    };
    ToText.prototype.list = function (arr, callback, finalDelim, delim) {
        var _this = this;
        if (delim === void 0) { delim = ','; }
        if (!isArray(arr)) {
            arr = [arr];
        }
        var delimJoin = function (array, delimiter, finalDelimiter) {
            var list = '';
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) {
                    if (i === array.length - 1) {
                        list += ' ' + finalDelimiter + ' ';
                    }
                    else {
                        list += delimiter + ' ';
                    }
                }
                list += array[i];
            }
            return list;
        };
        callback =
            callback ||
                function (o) {
                    return o.toString();
                };
        var realCallback = function (arg) {
            return callback && callback.call(_this, arg);
        };
        if (finalDelim) {
            return delimJoin(arr.map(realCallback), delim, finalDelim);
        }
        else {
            return arr.map(realCallback).join(delim + ' ');
        }
    };
    return ToText;
}());
export default ToText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25scC90b3RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFxQixNQUFNLFFBQVEsQ0FBQTtBQUMxQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBR2hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUV6RCxnRkFBZ0Y7QUFDaEYsbUJBQW1CO0FBQ25CLGdGQUFnRjtBQUVoRjs7R0FFRztBQUNILElBQU0sUUFBUSxHQUFHLFVBQVUsR0FBYSxFQUFFLEdBQVc7SUFDbkQsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLENBQUMsQ0FBQTtBQVFELElBQU0sY0FBYyxHQUFZLFVBQUMsRUFBRSxJQUFLLE9BQUEsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFiLENBQWEsQ0FBQTtBQUlyRCxJQUFNLG9CQUFvQixHQUFrQixVQUMxQyxJQUFZLEVBQ1osS0FBYSxFQUNiLEdBQVcsSUFDUixPQUFBLFVBQUcsS0FBSyxjQUFJLEdBQUcsZUFBSyxJQUFJLENBQUUsRUFBMUIsQ0FBMEIsQ0FBQTtBQUUvQjs7Ozs7OztHQU9HO0FBQ0g7SUFpQkUsZ0JBQ0UsS0FBWSxFQUNaLE9BQWlDLEVBQ2pDLFFBQTRCLEVBQzVCLGFBQW1EO1FBRm5ELHdCQUFBLEVBQUEsd0JBQWlDO1FBQ2pDLHlCQUFBLEVBQUEsa0JBQTRCO1FBQzVCLDhCQUFBLEVBQUEsb0NBQW1EO1FBRW5ELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFBO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxD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