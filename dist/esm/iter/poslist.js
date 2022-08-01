"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPoslist = void 0;
var dateutil_1 = require("../dateutil");
var helpers_1 = require("../helpers");
function buildPoslist(bysetpos, timeset, start, end, ii, dayset) {
    var poslist = [];
    for (var j = 0; j < bysetpos.length; j++) {
        var daypos = void 0;
        var timepos = void 0;
        var pos = bysetpos[j];
        if (pos < 0) {
            daypos = Math.floor(pos / timeset.length);
            timepos = (0, helpers_1.pymod)(pos, timeset.length);
        }
        else {
            daypos = Math.floor((pos - 1) / timeset.length);
            timepos = (0, helpers_1.pymod)(pos - 1, timeset.length);
        }
        var tmp = [];
        for (var k = start; k < end; k++) {
            var val = dayset[k];
            if (!(0, helpers_1.isPresent)(val))
                continue;
            tmp.push(val);
        }
        var i = void 0;
        if (daypos < 0) {
            i = tmp.slice(daypos)[0];
        }
        else {
            i = tmp[daypos];
        }
        var time = timeset[timepos];
        var date = (0, dateutil_1.fromOrdinal)(ii.yearordinal + i);
        var res = (0, dateutil_1.combine)(date, time);
        // XXX: can this ever be in the array?
        // - compare the actual date instead?
        if (!(0, helpers_1.includes)(poslist, res))
            poslist.push(res);
    }
    (0, dateutil_1.sort)(poslist);
    return poslist;
}
exports.buildPoslist = buildPoslist;
//# sourceMappingURL=poslist.js.map