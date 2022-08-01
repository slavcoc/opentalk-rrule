"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildMonth = void 0;
var rrule_1 = require("../rrule");
var helpers_1 = require("../helpers");
function rebuildMonth(year, month, yearlen, mrange, wdaymask, options) {
    var result = {
        lastyear: year,
        lastmonth: month,
        nwdaymask: [],
    };
    var ranges = [];
    if (options.freq === rrule_1.RRule.YEARLY) {
        if ((0, helpers_1.empty)(options.bymonth)) {
            ranges = [[0, yearlen]];
        }
        else {
            for (var j = 0; j < options.bymonth.length; j++) {
                month = options.bymonth[j];
                ranges.push(mrange.slice(month - 1, month + 1));
            }
        }
    }
    else if (options.freq === rrule_1.RRule.MONTHLY) {
        ranges = [mrange.slice(month - 1, month + 1)];
    }
    if ((0, helpers_1.empty)(ranges)) {
        return result;
    }
    // Weekly frequency won't get here, so we may not
    // care about cross-year weekly periods.
    result.nwdaymask = (0, helpers_1.repeat)(0, yearlen);
    for (var j = 0; j < ranges.length; j++) {
        var rang = ranges[j];
        var first = rang[0];
        var last = rang[1] - 1;
        for (var k = 0; k < options.bynweekday.length; k++) {
            var i = void 0;
            var _a = options.bynweekday[k], wday = _a[0], n = _a[1];
            if (n < 0) {
                i = last + (n + 1) * 7;
                i -= (0, helpers_1.pymod)(wdaymask[i] - wday, 7);
            }
            else {
                i = first + (n - 1) * 7;
                i += (0, helpers_1.pymod)(7 - wdaymask[i] + wday, 7);
            }
            if (first <= i && i <= last)
                result.nwdaymask[i] = 1;
        }
    }
    return result;
}
exports.rebuildMonth = rebuildMonth;
//# sourceMappingURL=monthinfo.js.map