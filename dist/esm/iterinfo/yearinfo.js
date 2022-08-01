"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildYear = void 0;
var tslib_1 = require("tslib");
var dateutil_1 = require("../dateutil");
var helpers_1 = require("../helpers");
var masks_1 = require("../masks");
function rebuildYear(year, options) {
    var firstyday = (0, dateutil_1.datetime)(year, 1, 1);
    var yearlen = (0, dateutil_1.isLeapYear)(year) ? 366 : 365;
    var nextyearlen = (0, dateutil_1.isLeapYear)(year + 1) ? 366 : 365;
    var yearordinal = (0, dateutil_1.toOrdinal)(firstyday);
    var yearweekday = (0, dateutil_1.getWeekday)(firstyday);
    var result = tslib_1.__assign(tslib_1.__assign({ yearlen: yearlen, nextyearlen: nextyearlen, yearordinal: yearordinal, yearweekday: yearweekday }, baseYearMasks(year)), { wnomask: null });
    if ((0, helpers_1.empty)(options.byweekno)) {
        return result;
    }
    result.wnomask = (0, helpers_1.repeat)(0, yearlen + 7);
    var firstwkst;
    var wyearlen;
    var no1wkst = (firstwkst = (0, helpers_1.pymod)(7 - yearweekday + options.wkst, 7));
    if (no1wkst >= 4) {
        no1wkst = 0;
        // Number of days in the year, plus the days we got
        // from last year.
        wyearlen = result.yearlen + (0, helpers_1.pymod)(yearweekday - options.wkst, 7);
    }
    else {
        // Number of days in the year, minus the days we
        // left in last year.
        wyearlen = yearlen - no1wkst;
    }
    var div = Math.floor(wyearlen / 7);
    var mod = (0, helpers_1.pymod)(wyearlen, 7);
    var numweeks = Math.floor(div + mod / 4);
    for (var j = 0; j < options.byweekno.length; j++) {
        var n = options.byweekno[j];
        if (n < 0) {
            n += numweeks + 1;
        }
        if (!(n > 0 && n <= numweeks)) {
            continue;
        }
        var i = void 0;
        if (n > 1) {
            i = no1wkst + (n - 1) * 7;
            if (no1wkst !== firstwkst) {
                i -= 7 - firstwkst;
            }
        }
        else {
            i = no1wkst;
        }
        for (var k = 0; k < 7; k++) {
            result.wnomask[i] = 1;
            i++;
            if (result.wdaymask[i] === options.wkst)
                break;
        }
    }
    if ((0, helpers_1.includes)(options.byweekno, 1)) {
        // Check week number 1 of next year as well
        // orig-TODO : Check -numweeks for next year.
        var i = no1wkst + numweeks * 7;
        if (no1wkst !== firstwkst)
            i -= 7 - firstwkst;
        if (i < yearlen) {
            // If week starts in next year, we
            // don't care about it.
            for (var j = 0; j < 7; j++) {
                result.wnomask[i] = 1;
                i += 1;
                if (result.wdaymask[i] === options.wkst)
                    break;
            }
        }
    }
    if (no1wkst) {
        // Check last week number of last year as
        // well. If no1wkst is 0, either the year
        // started on week start, or week number 1
        // got days from last year, so there are no
        // days from last year's last week number in
        // this year.
        var lnumweeks = void 0;
        if (!(0, helpers_1.includes)(options.byweekno, -1)) {
            var lyearweekday = (0, dateutil_1.getWeekday)((0, dateutil_1.datetime)(year - 1, 1, 1));
            var lno1wkst = (0, helpers_1.pymod)(7 - lyearweekday.valueOf() + options.wkst, 7);
            var lyearlen = (0, dateutil_1.isLeapYear)(year - 1) ? 366 : 365;
            var weekst = void 0;
            if (lno1wkst >= 4) {
                lno1wkst = 0;
                weekst = lyearlen + (0, helpers_1.pymod)(lyearweekday - options.wkst, 7);
            }
            else {
                weekst = yearlen - no1wkst;
            }
            lnumweeks = Math.floor(52 + (0, helpers_1.pymod)(weekst, 7) / 4);
        }
        else {
            lnumweeks = -1;
        }
        if ((0, helpers_1.includes)(options.byweekno, lnumweeks)) {
            for (var i = 0; i < no1wkst; i++)
                result.wnomask[i] = 1;
        }
    }
    return result;
}
exports.rebuildYear = rebuildYear;
function baseYearMasks(year) {
    var yearlen = (0, dateutil_1.isLeapYear)(year) ? 366 : 365;
    var firstyday = (0, dateutil_1.datetime)(year, 1, 1);
    var wday = (0, dateutil_1.getWeekday)(firstyday);
    if (yearlen === 365) {
        return {
            mmask: masks_1.M365MASK,
            mdaymask: masks_1.MDAY365MASK,
            nmdaymask: masks_1.NMDAY365MASK,
            wdaymask: masks_1.WDAYMASK.slice(wday),
            mrange: masks_1.M365RANGE,
        };
    }
    return {
        mmask: masks_1.M366MASK,
        mdaymask: masks_1.MDAY366MASK,
        nmdaymask: masks_1.NMDAY366MASK,
        wdaymask: masks_1.WDAYMASK.slice(wday),
        mrange: masks_1.M366RANGE,
    };
}
//# sourceMappingURL=yearinfo.js.map