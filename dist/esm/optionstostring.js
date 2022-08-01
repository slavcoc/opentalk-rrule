"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsToString = void 0;
var rrule_1 = require("./rrule");
var helpers_1 = require("./helpers");
var weekday_1 = require("./weekday");
var dateutil_1 = require("./dateutil");
var datewithzone_1 = require("./datewithzone");
function optionsToString(options) {
    var rrule = [];
    var dtstart = '';
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(rrule_1.DEFAULT_OPTIONS);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'tzid')
            continue;
        if (!(0, helpers_1.includes)(defaultKeys, keys[i]))
            continue;
        var key = keys[i].toUpperCase();
        var value = options[keys[i]];
        var outValue = '';
        if (!(0, helpers_1.isPresent)(value) || ((0, helpers_1.isArray)(value) && !value.length))
            continue;
        switch (key) {
            case 'FREQ':
                outValue = rrule_1.RRule.FREQUENCIES[options.freq];
                break;
            case 'WKST':
                if ((0, helpers_1.isNumber)(value)) {
                    outValue = new weekday_1.Weekday(value).toString();
                }
                else {
                    outValue = value.toString();
                }
                break;
            case 'BYWEEKDAY':
                /*
                  NOTE: BYWEEKDAY is a special case.
                  RRule() deconstructs the rule.options.byweekday array
                  into an array of Weekday arguments.
                  On the other hand, rule.origOptions is an array of Weekdays.
                  We need to handle both cases here.
                  It might be worth change RRule to keep the Weekdays.
        
                  Also, BYWEEKDAY (used by RRule) vs. BYDAY (RFC)
        
                  */
                key = 'BYDAY';
                outValue = (0, helpers_1.toArray)(value)
                    .map(function (wday) {
                    if (wday instanceof weekday_1.Weekday) {
                        return wday;
                    }
                    if ((0, helpers_1.isArray)(wday)) {
                        return new weekday_1.Weekday(wday[0], wday[1]);
                    }
                    return new weekday_1.Weekday(wday);
                })
                    .toString();
                break;
            case 'DTSTART':
                dtstart = buildDtstart(value, options.tzid);
                break;
            case 'UNTIL':
                outValue = (0, dateutil_1.timeToUntilString)(value, !options.tzid);
                break;
            default:
                if ((0, helpers_1.isArray)(value)) {
                    var strValues = [];
                    for (var j = 0; j < value.length; j++) {
                        strValues[j] = String(value[j]);
                    }
                    outValue = strValues.toString();
                }
                else {
                    outValue = String(value);
                }
        }
        if (outValue) {
            rrule.push([key, outValue]);
        }
    }
    var rules = rrule
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, "=").concat(value.toString());
    })
        .join(';');
    var ruleString = '';
    if (rules !== '') {
        ruleString = "RRULE:".concat(rules);
    }
    return [dtstart, ruleString].filter(function (x) { return !!x; }).join('\n');
}
exports.optionsToString = optionsToString;
function buildDtstart(dtstart, tzid) {
    if (!dtstart) {
        return '';
    }
    return 'DTSTART' + new datewithzone_1.DateWithZone(new Date(dtstart), tzid).toString();
}
//# sourceMappingURL=optionstostring.js.map