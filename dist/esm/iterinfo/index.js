import { notEmpty, repeat, range, isPresent } from '../helpers';
import { Frequency } from '../types';
import { rebuildYear } from './yearinfo';
import { rebuildMonth } from './monthinfo';
import { easter } from './easter';
import { Time } from '../datetime';
import { datetime, sort, toOrdinal } from '../dateutil';
// =============================================================================
// Iterinfo
// =============================================================================
var Iterinfo = /** @class */ (function () {
    // eslint-disable-next-line no-empty-function
    function Iterinfo(options) {
        this.options = options;
    }
    Iterinfo.prototype.rebuild = function (year, month) {
        var options = this.options;
        if (year !== this.lastyear) {
            this.yearinfo = rebuildYear(year, options);
        }
        if (notEmpty(options.bynweekday) &&
            (month !== this.lastmonth || year !== this.lastyear)) {
            var _a = this.yearinfo, yearlen = _a.yearlen, mrange = _a.mrange, wdaymask = _a.wdaymask;
            this.monthinfo = rebuildMonth(year, month, yearlen, mrange, wdaymask, options);
        }
        if (isPresent(options.byeaster)) {
            this.eastermask = easter(year, options.byeaster);
        }
    };
    Object.defineProperty(Iterinfo.prototype, "lastyear", {
        get: function () {
            return this.monthinfo ? this.monthinfo.lastyear : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "lastmonth", {
        get: function () {
            return this.monthinfo ? this.monthinfo.lastmonth : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "yearlen", {
        get: function () {
            return this.yearinfo.yearlen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "yearordinal", {
        get: function () {
            return this.yearinfo.yearordinal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "mrange", {
        get: function () {
            return this.yearinfo.mrange;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "wdaymask", {
        get: function () {
            return this.yearinfo.wdaymask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "mmask", {
        get: function () {
            return this.yearinfo.mmask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "wnomask", {
        get: function () {
            return this.yearinfo.wnomask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "nwdaymask", {
        get: function () {
            return this.monthinfo ? this.monthinfo.nwdaymask : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "nextyearlen", {
        get: function () {
            return this.yearinfo.nextyearlen;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "mdaymask", {
        get: function () {
            return this.yearinfo.mdaymask;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Iterinfo.prototype, "nmdaymask", {
        get: function () {
            return this.yearinfo.nmdaymask;
        },
        enumerable: false,
        configurable: true
    });
    Iterinfo.prototype.ydayset = function () {
        return [range(this.yearlen), 0, this.yearlen];
    };
    Iterinfo.prototype.mdayset = function (_, month) {
        var start = this.mrange[month - 1];
        var end = this.mrange[month];
        var set = repeat(null, this.yearlen);
        for (var i = start; i < end; i++)
            set[i] = i;
        return [set, start, end];
    };
    Iterinfo.prototype.wdayset = function (year, month, day) {
        // We need to handle cross-year weeks here.
        var set = repeat(null, this.yearlen + 7);
        var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
        var start = i;
        for (var j = 0; j < 7; j++) {
            set[i] = i;
            ++i;
            if (this.wdaymask[i] === this.options.wkst)
                break;
        }
        return [set, start, i];
    };
    Iterinfo.prototype.ddayset = function (year, month, day) {
        var set = repeat(null, this.yearlen);
        var i = toOrdinal(datetime(year, month, day)) - this.yearordinal;
        set[i] = i;
        return [set, i, i + 1];
    };
    Iterinfo.prototype.htimeset = function (hour, _, second, millisecond) {
        var _this = this;
        var set = [];
        this.options.byminute.forEach(function (minute) {
            set = set.concat(_this.mtimeset(hour, minute, second, millisecond));
        });
        sort(set);
        return set;
    };
    Iterinfo.prototype.mtimeset = function (hour, minute, _, millisecond) {
        var set = this.options.bysecond.map(function (second) { return new Time(hour, minute, second, millisecond); });
        sort(set);
        return set;
    };
    Iterinfo.prototype.stimeset = function (hour, minute, second, millisecond) {
        return [new Time(hour, minute, second, millisecond)];
    };
    Iterinfo.prototype.getdayset = function (freq) {
        switch (freq) {
            case Frequency.YEARLY:
                return this.ydayset.bind(this);
            case Frequency.MONTHLY:
                return this.mdayset.bind(this);
            case Frequency.WEEKLY:
                return this.wdayset.bind(this);
            case Frequency.DAILY:
                return this.ddayset.bind(this);
            default:
                return this.ddayset.bind(this);
        }
    };
    Iterinfo.prototype.gettimeset = function (freq) {
        switch (freq) {
            case Frequency.HOURLY:
                return this.htimeset.bind(this);
            case Frequency.MINUTELY:
                return this.mtimeset.bind(this);
            case Frequency.SECONDLY:
                return this.stimeset.bind(this);
        }
    };
    return Iterinfo;
}());
export default Iterinfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaXRlcmluZm8vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUMvRCxPQUFPLEVBQWlCLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNuRCxPQUFPLEVBQVksV0FBVyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQWEsTUFBTSxhQUFhLENBQUE7QUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNqQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBQ2xDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUt2RCxnRkFBZ0Y7QUFDaEYsV0FBVztBQUNYLGdGQUFnRjtBQUVoRjtJQUtFLDZDQUE2QztJQUM3QyxrQkFBb0IsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUFHLENBQUM7SUFFOUMsMEJBQU8sR0FBUCxVQUFRLElBQVksRUFBRSxLQUFhO1FBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUE7UUFFNUIsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7U0FDM0M7UUFFRCxJQUNFLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQzVCLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsRUFDcEQ7WUFDTSxJQUFBLEtBQWdDLElBQUksQ0FBQyxRQUFRLEVBQTND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