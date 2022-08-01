"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterSet = void 0;
var datewithzone_1 = require("./datewithzone");
var iter_1 = require("./iter");
var dateutil_1 = require("./dateutil");
function iterSet(iterResult, _rrule, _exrule, _rdate, _exdate, tzid) {
    var _exdateHash = {};
    var _accept = iterResult.accept;
    function evalExdate(after, before) {
        _exrule.forEach(function (rrule) {
            rrule.between(after, before, true).forEach(function (date) {
                _exdateHash[Number(date)] = true;
            });
        });
    }
    _exdate.forEach(function (date) {
        var zonedDate = new datewithzone_1.DateWithZone(date, tzid).rezonedDate();
        _exdateHash[Number(zonedDate)] = true;
    });
    iterResult.accept = function (date) {
        var dt = Number(date);
        if (isNaN(dt))
            return _accept.call(this, date);
        if (!_exdateHash[dt]) {
            evalExdate(new Date(dt - 1), new Date(dt + 1));
            if (!_exdateHash[dt]) {
                _exdateHash[dt] = true;
                return _accept.call(this, date);
            }
        }
        return true;
    };
    if (iterResult.method === 'between') {
        evalExdate(iterResult.args.after, iterResult.args.before);
        iterResult.accept = function (date) {
            var dt = Number(date);
            if (!_exdateHash[dt]) {
                _exdateHash[dt] = true;
                return _accept.call(this, date);
            }
            return true;
        };
    }
    for (var i = 0; i < _rdate.length; i++) {
        var zonedDate = new datewithzone_1.DateWithZone(_rdate[i], tzid).rezonedDate();
        if (!iterResult.accept(new Date(zonedDate.getTime())))
            break;
    }
    _rrule.forEach(function (rrule) {
        (0, iter_1.iter)(iterResult, rrule.options);
    });
    var res = iterResult._result;
    (0, dateutil_1.sort)(res);
    switch (iterResult.method) {
        case 'all':
        case 'between':
            return res;
        case 'before':
            return ((res.length && res[res.length - 1]) || null);
        case 'after':
        default:
            return ((res.length && res[0]) || null);
    }
}
exports.iterSet = iterSet;
//# sourceMappingURL=iterset.js.map