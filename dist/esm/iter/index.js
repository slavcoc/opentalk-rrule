"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iter = void 0;
var tslib_1 = require("tslib");
var types_1 = require("../types");
var dateutil_1 = require("../dateutil");
var index_1 = tslib_1.__importDefault(require("../iterinfo/index"));
var rrule_1 = require("../rrule");
var parseoptions_1 = require("../parseoptions");
var helpers_1 = require("../helpers");
var datewithzone_1 = require("../datewithzone");
var poslist_1 = require("./poslist");
var datetime_1 = require("../datetime");
function iter(iterResult, options) {
    var dtstart = options.dtstart, freq = options.freq, interval = options.interval, until = options.until, bysetpos = options.bysetpos;
    var count = options.count;
    if (count === 0 || interval === 0) {
        return emitResult(iterResult);
    }
    var counterDate = datetime_1.DateTime.fromDate(dtstart);
    var ii = new index_1.default(options);
    ii.rebuild(counterDate.year, counterDate.month);
    var timeset = makeTimeset(ii, counterDate, options);
    for (;;) {
        var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
        var filtered = removeFilteredDays(dayset, start, end, ii, options);
        if ((0, helpers_1.notEmpty)(bysetpos)) {
            var poslist = (0, poslist_1.buildPoslist)(bysetpos, timeset, start, end, ii, dayset);
            for (var j = 0; j < poslist.length; j++) {
                var res = poslist[j];
                if (until && res > until) {
                    return emitResult(iterResult);
                }
                if (res >= dtstart) {
                    var rezonedDate = rezoneIfNeeded(res, options);
                    if (!iterResult.accept(rezonedDate)) {
                        return emitResult(iterResult);
                    }
                    if (count) {
                        --count;
                        if (!count) {
                            return emitResult(iterResult);
                        }
                    }
                }
            }
        }
        else {
            for (var j = start; j < end; j++) {
                var currentDay = dayset[j];
                if (!(0, helpers_1.isPresent)(currentDay)) {
                    continue;
                }
                var date = (0, dateutil_1.fromOrdinal)(ii.yearordinal + currentDay);
                for (var k = 0; k < timeset.length; k++) {
                    var time = timeset[k];
                    var res = (0, dateutil_1.combine)(date, time);
                    if (until && res > until) {
                        return emitResult(iterResult);
                    }
                    if (res >= dtstart) {
                        var rezonedDate = rezoneIfNeeded(res, options);
                        if (!iterResult.accept(rezonedDate)) {
                            return emitResult(iterResult);
                        }
                        if (count) {
                            --count;
                            if (!count) {
                                return emitResult(iterResult);
                            }
                        }
                    }
                }
            }
        }
        if (options.interval === 0) {
            return emitResult(iterResult);
        }
        // Handle frequency and interval
        counterDate.add(options, filtered);
        if (counterDate.year > dateutil_1.MAXYEAR) {
            return emitResult(iterResult);
        }
        if (!(0, types_1.freqIsDailyOrGreater)(freq)) {
            timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0);
        }
        ii.rebuild(counterDate.year, counterDate.month);
    }
}
exports.iter = iter;
function isFiltered(ii, currentDay, options) {
    var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
    return (((0, helpers_1.notEmpty)(bymonth) && !(0, helpers_1.includes)(bymonth, ii.mmask[currentDay])) ||
        ((0, helpers_1.notEmpty)(byweekno) && !ii.wnomask[currentDay]) ||
        ((0, helpers_1.notEmpty)(byweekday) && !(0, helpers_1.includes)(byweekday, ii.wdaymask[currentDay])) ||
        ((0, helpers_1.notEmpty)(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
        (byeaster !== null && !(0, helpers_1.includes)(ii.eastermask, currentDay)) ||
        (((0, helpers_1.notEmpty)(bymonthday) || (0, helpers_1.notEmpty)(bynmonthday)) &&
            !(0, helpers_1.includes)(bymonthday, ii.mdaymask[currentDay]) &&
            !(0, helpers_1.includes)(bynmonthday, ii.nmdaymask[currentDay])) ||
        ((0, helpers_1.notEmpty)(byyearday) &&
            ((currentDay < ii.yearlen &&
                !(0, helpers_1.includes)(byyearday, currentDay + 1) &&
                !(0, helpers_1.includes)(byyearday, -ii.yearlen + currentDay)) ||
                (currentDay >= ii.yearlen &&
                    !(0, helpers_1.includes)(byyearday, currentDay + 1 - ii.yearlen) &&
                    !(0, helpers_1.includes)(byyearday, -ii.nextyearlen + currentDay - ii.yearlen)))));
}
function rezoneIfNeeded(date, options) {
    return new datewithzone_1.DateWithZone(date, options.tzid).rezonedDate();
}
function emitResult(iterResult) {
    return iterResult.getValue();
}
function removeFilteredDays(dayset, start, end, ii, options) {
    var filtered = false;
    for (var dayCounter = start; dayCounter < end; dayCounter++) {
        var currentDay = dayset[dayCounter];
        filtered = isFiltered(ii, currentDay, options);
        if (filtered)
            dayset[currentDay] = null;
    }
    return filtered;
}
function makeTimeset(ii, counterDate, options) {
    var freq = options.freq, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
    if ((0, types_1.freqIsDailyOrGreater)(freq)) {
        return (0, parseoptions_1.buildTimeset)(options);
    }
    if ((freq >= rrule_1.RRule.HOURLY &&
        (0, helpers_1.notEmpty)(byhour) &&
        !(0, helpers_1.includes)(byhour, counterDate.hour)) ||
        (freq >= rrule_1.RRule.MINUTELY &&
            (0, helpers_1.notEmpty)(byminute) &&
            !(0, helpers_1.includes)(byminute, counterDate.minute)) ||
        (freq >= rrule_1.RRule.SECONDLY &&
            (0, helpers_1.notEmpty)(bysecond) &&
            !(0, helpers_1.includes)(bysecond, counterDate.second))) {
        return [];
    }
    return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
}
//# sourceMappingURL=index.js.map