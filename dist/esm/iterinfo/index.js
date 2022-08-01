"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var types_1 = require("../types");
var yearinfo_1 = require("./yearinfo");
var monthinfo_1 = require("./monthinfo");
var easter_1 = require("./easter");
var datetime_1 = require("../datetime");
var dateutil_1 = require("../dateutil");
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
            this.yearinfo = (0, yearinfo_1.rebuildYear)(year, options);
        }
        if ((0, helpers_1.notEmpty)(options.bynweekday) &&
            (month !== this.lastmonth || year !== this.lastyear)) {
            var _a = this.yearinfo, yearlen = _a.yearlen, mrange = _a.mrange, wdaymask = _a.wdaymask;
            this.monthinfo = (0, monthinfo_1.rebuildMonth)(year, month, yearlen, mrange, wdaymask, options);
        }
        if ((0, helpers_1.isPresent)(options.byeaster)) {
            this.eastermask = (0, easter_1.easter)(year, options.byeaster);
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
        return [(0, helpers_1.range)(this.yearlen), 0, this.yearlen];
    };
    Iterinfo.prototype.mdayset = function (_, month) {
        var start = this.mrange[month - 1];
        var end = this.mrange[month];
        var set = (0, helpers_1.repeat)(null, this.yearlen);
        for (var i = start; i < end; i++)
            set[i] = i;
        return [set, start, end];
    };
    Iterinfo.prototype.wdayset = function (year, month, day) {
        // We need to handle cross-year weeks here.
        var set = (0, helpers_1.repeat)(null, this.yearlen + 7);
        var i = (0, dateutil_1.toOrdinal)((0, dateutil_1.datetime)(year, month, day)) - this.yearordinal;
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
        var set = (0, helpers_1.repeat)(null, this.yearlen);
        var i = (0, dateutil_1.toOrdinal)((0, dateutil_1.datetime)(year, month, day)) - this.yearordinal;
        set[i] = i;
        return [set, i, i + 1];
    };
    Iterinfo.prototype.htimeset = function (hour, _, second, millisecond) {
        var _this = this;
        var set = [];
        this.options.byminute.forEach(function (minute) {
            set = set.concat(_this.mtimeset(hour, minute, second, millisecond));
        });
        (0, dateutil_1.sort)(set);
        return set;
    };
    Iterinfo.prototype.mtimeset = function (hour, minute, _, millisecond) {
        var set = this.options.bysecond.map(function (second) { return new datetime_1.Time(hour, minute, second, millisecond); });
        (0, dateutil_1.sort)(set);
        return set;
    };
    Iterinfo.prototype.stimeset = function (hour, minute, second, millisecond) {
        return [new datetime_1.Time(hour, minute, second, millisecond)];
    };
    Iterinfo.prototype.getdayset = function (freq) {
        switch (freq) {
            case types_1.Frequency.YEARLY:
                return this.ydayset.bind(this);
            case types_1.Frequency.MONTHLY:
                return this.mdayset.bind(this);
            case types_1.Frequency.WEEKLY:
                return this.wdayset.bind(this);
            case types_1.Frequency.DAILY:
                return this.ddayset.bind(this);
            default:
                return this.ddayset.bind(this);
        }
    };
    Iterinfo.prototype.gettimeset = function (freq) {
        switch (freq) {
            case types_1.Frequency.HOURLY:
                return this.htimeset.bind(this);
            case types_1.Frequency.MINUTELY:
                return this.mtimeset.bind(this);
            case types_1.Frequency.SECONDLY:
                return this.stimeset.bind(this);
        }
    };
    return Iterinfo;
}());
exports.default = Iterinfo;
//# sourceMappingURL=index.js.map