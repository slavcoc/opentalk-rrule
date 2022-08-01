import { __extends } from "tslib";
import { Frequency } from './types';
import { pymod, divmod, empty, includes } from './helpers';
import { getWeekday, MAXYEAR, monthRange } from './dateutil';
var Time = /** @class */ (function () {
    function Time(hour, minute, second, millisecond) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond || 0;
    }
    Time.prototype.getHours = function () {
        return this.hour;
    };
    Time.prototype.getMinutes = function () {
        return this.minute;
    };
    Time.prototype.getSeconds = function () {
        return this.second;
    };
    Time.prototype.getMilliseconds = function () {
        return this.millisecond;
    };
    Time.prototype.getTime = function () {
        return ((this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 +
            this.millisecond);
    };
    return Time;
}());
export { Time };
var DateTime = /** @class */ (function (_super) {
    __extends(DateTime, _super);
    function DateTime(year, month, day, hour, minute, second, millisecond) {
        var _this = _super.call(this, hour, minute, second, millisecond) || this;
        _this.year = year;
        _this.month = month;
        _this.day = day;
        return _this;
    }
    DateTime.fromDate = function (date) {
        return new this(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.valueOf() % 1000);
    };
    DateTime.prototype.getWeekday = function () {
        return getWeekday(new Date(this.getTime()));
    };
    DateTime.prototype.getTime = function () {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
    };
    DateTime.prototype.getDay = function () {
        return this.day;
    };
    DateTime.prototype.getMonth = function () {
        return this.month;
    };
    DateTime.prototype.getYear = function () {
        return this.year;
    };
    DateTime.prototype.addYears = function (years) {
        this.year += years;
    };
    DateTime.prototype.addMonths = function (months) {
        this.month += months;
        if (this.month > 12) {
            var yearDiv = Math.floor(this.month / 12);
            var monthMod = pymod(this.month, 12);
            this.month = monthMod;
            this.year += yearDiv;
            if (this.month === 0) {
                this.month = 12;
                --this.year;
            }
        }
    };
    DateTime.prototype.addWeekly = function (days, wkst) {
        if (wkst > this.getWeekday()) {
            this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7;
        }
        else {
            this.day += -(this.getWeekday() - wkst) + days * 7;
        }
        this.fixDay();
    };
    DateTime.prototype.addDaily = function (days) {
        this.day += days;
        this.fixDay();
    };
    DateTime.prototype.addHours = function (hours, filtered, byhour) {
        if (filtered) {
            // Jump to one iteration before next day
            this.hour += Math.floor((23 - this.hour) / hours) * hours;
        }
        for (;;) {
            this.hour += hours;
            var _a = divmod(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
            if (dayDiv) {
                this.hour = hourMod;
                this.addDaily(dayDiv);
            }
            if (empty(byhour) || includes(byhour, this.hour))
                break;
        }
    };
    DateTime.prototype.addMinutes = function (minutes, filtered, byhour, byminute) {
        if (filtered) {
            // Jump to one iteration before next day
            this.minute +=
                Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes;
        }
        for (;;) {
            this.minute += minutes;
            var _a = divmod(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
            if (hourDiv) {
                this.minute = minuteMod;
                this.addHours(hourDiv, false, byhour);
            }
            if ((empty(byhour) || includes(byhour, this.hour)) &&
                (empty(byminute) || includes(byminute, this.minute))) {
                break;
            }
        }
    };
    DateTime.prototype.addSeconds = function (seconds, filtered, byhour, byminute, bysecond) {
        if (filtered) {
            // Jump to one iteration before next day
            this.second +=
                Math.floor((86399 - (this.hour * 3600 + this.minute * 60 + this.second)) /
                    seconds) * seconds;
        }
        for (;;) {
            this.second += seconds;
            var _a = divmod(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
            if (minuteDiv) {
                this.second = secondMod;
                this.addMinutes(minuteDiv, false, byhour, byminute);
            }
            if ((empty(byhour) || includes(byhour, this.hour)) &&
                (empty(byminute) || includes(byminute, this.minute)) &&
                (empty(bysecond) || includes(bysecond, this.second))) {
                break;
            }
        }
    };
    DateTime.prototype.fixDay = function () {
        if (this.day <= 28) {
            return;
        }
        var daysinmonth = monthRange(this.year, this.month - 1)[1];
        if (this.day <= daysinmonth) {
            return;
        }
        while (this.day > daysinmonth) {
            this.day -= daysinmonth;
            ++this.month;
            if (this.month === 13) {
                this.month = 1;
                ++this.year;
                if (this.year > MAXYEAR) {
                    return;
                }
            }
            daysinmonth = monthRange(this.year, this.month - 1)[1];
        }
    };
    DateTime.prototype.add = function (options, filtered) {
        var freq = options.freq, interval = options.interval, wkst = options.wkst, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
        switch (freq) {
            case Frequency.YEARLY:
                return this.addYears(interval);
            case Frequency.MONTHLY:
                return this.addMonths(interval);
            case Frequency.WEEKLY:
                return this.addWeekly(interval, wkst);
            case Frequency.DAILY:
                return this.addDaily(interval);
            case Frequency.HOURLY:
                return this.addHours(interval, filtered, byhour);
            case Frequency.MINUTELY:
                return this.addMinutes(interval, filtered, byhour, byminute);
            case Frequency.SECONDLY:
                return this.addSeconds(interval, filtered, byhour, byminute, bysecond);
        }
    };
    return DateTime;
}(Time));
export { DateTime };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0ZXRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBRTVEO0lBTUUsY0FDRSxJQUFZLEVBQ1osTUFBYyxFQUNkLE1BQWMsRUFDZCxXQUFtQjtRQUVuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsSUFBSSxDQUFDLENBQUE7SUFDckMsQ0FBQztJQUVELHVCQUFRLEdBQVI7UUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVELHlCQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDcEIsQ0FBQztJQUVELHlCQUFVLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDcEIsQ0FBQztJQUVELDhCQUFlLEdBQWY7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7SUFDekIsQ0FBQztJQUVELHNCQUFPLEdBQVA7UUFDRSxPQUFPLENBQ0wsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUk7WUFDN0QsSUFBSSxDQUFDLFdBQVcsQ0FDakIsQ0FBQTtJQUNI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