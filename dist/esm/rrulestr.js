import { __assign } from "tslib";
import { RRule } from './rrule';
import { RRuleSet } from './rruleset';
import { untilStringToDate } from './dateutil';
import { includes, split } from './helpers';
import { parseString, parseDtstart } from './parsestring';
/**
 * RRuleStr
 * To parse a set of rrule strings
 */
var DEFAULT_OPTIONS = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    tzid: null,
};
export function parseInput(s, options) {
    var rrulevals = [];
    var rdatevals = [];
    var exrulevals = [];
    var exdatevals = [];
    var parsedDtstart = parseDtstart(s);
    var dtstart = parsedDtstart.dtstart;
    var tzid = parsedDtstart.tzid;
    var lines = splitIntoLines(s, options.unfold);
    lines.forEach(function (line) {
        var _a;
        if (!line)
            return;
        var _b = breakDownLine(line), name = _b.name, parms = _b.parms, value = _b.value;
        switch (name.toUpperCase()) {
            case 'RRULE':
                if (parms.length) {
                    throw new Error("unsupported RRULE parm: ".concat(parms.join(',')));
                }
                rrulevals.push(parseString(line));
                break;
            case 'RDATE':
                var _c = (_a = /RDATE(?:;TZID=([^:=]+))?/i.exec(line)) !== null && _a !== void 0 ? _a : [], rdateTzid = _c[1];
                if (rdateTzid && !tzid) {
                    tzid = rdateTzid;
                }
                rdatevals = rdatevals.concat(parseRDate(value, parms));
                break;
            case 'EXRULE':
                if (parms.length) {
                    throw new Error("unsupported EXRULE parm: ".concat(parms.join(',')));
                }
                exrulevals.push(parseString(value));
                break;
            case 'EXDATE':
                exdatevals = exdatevals.concat(parseRDate(value, parms));
                break;
            case 'DTSTART':
                break;
            default:
                throw new Error('unsupported property: ' + name);
        }
    });
    return {
        dtstart: dtstart,
        tzid: tzid,
        rrulevals: rrulevals,
        rdatevals: rdatevals,
        exrulevals: exrulevals,
        exdatevals: exdatevals,
    };
}
function buildRule(s, options) {
    var _a = parseInput(s, options), rrulevals = _a.rrulevals, rdatevals = _a.rdatevals, exrulevals = _a.exrulevals, exdatevals = _a.exdatevals, dtstart = _a.dtstart, tzid = _a.tzid;
    var noCache = options.cache === false;
    if (options.compatible) {
        options.forceset = true;
        options.unfold = true;
    }
    if (options.forceset ||
        rrulevals.length > 1 ||
        rdatevals.length ||
        exrulevals.length ||
        exdatevals.length) {
        var rset_1 = new RRuleSet(noCache);
        rset_1.dtstart(dtstart);
        rset_1.tzid(tzid || undefined);
        rrulevals.forEach(function (val) {
            rset_1.rrule(new RRule(groomRruleOptions(val, dtstart, tzid), noCache));
        });
        rdatevals.forEach(function (date) {
            rset_1.rdate(date);
        });
        exrulevals.forEach(function (val) {
            rset_1.exrule(new RRule(groomRruleOptions(val, dtstart, tzid), noCache));
        });
        exdatevals.forEach(function (date) {
            rset_1.exdate(date);
        });
        if (options.compatible && options.dtstart)
            rset_1.rdate(dtstart);
        return rset_1;
    }
    var val = rrulevals[0] || {};
    return new RRule(groomRruleOptions(val, val.dtstart || options.dtstart || dtstart, val.tzid || options.tzid || tzid), noCache);
}
export function rrulestr(s, options) {
    if (options === void 0) { options = {}; }
    return buildRule(s, initializeOptions(options));
}
function groomRruleOptions(val, dtstart, tzid) {
    return __assign(__assign({}, val), { dtstart: dtstart, tzid: tzid });
}
function initializeOptions(options) {
    var invalid = [];
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(DEFAULT_OPTIONS);
    keys.forEach(function (key) {
        if (!includes(defaultKeys, key))
            invalid.push(key);
    });
    if (invalid.length) {
        throw new Error('Invalid options: ' + invalid.join(', '));
    }
    return __assign(__assign({}, DEFAULT_OPTIONS), options);
}
function extractName(line) {
    if (line.indexOf(':') === -1) {
        return {
            name: 'RRULE',
            value: line,
        };
    }
    var _a = split(line, ':', 1), name = _a[0], value = _a[1];
    return {
        name: name,
        value: value,
    };
}
function breakDownLine(line) {
    var _a = extractName(line), name = _a.name, value = _a.value;
    var parms = name.split(';');
    if (!parms)
        throw new Error('empty property name');
    return {
        name: parms[0].toUpperCase(),
        parms: parms.slice(1),
        value: value,
    };
}
function splitIntoLines(s, unfold) {
    if (unfold === void 0) { unfold = false; }
    s = s && s.trim();
    if (!s)
        throw new Error('Invalid empty string');
    // More info about 'unfold' option
    // Go head to http://www.ietf.org/rfc/rfc2445.txt
    if (!unfold) {
        return s.split(/\s/);
    }
    var lines = s.split('\n');
    var i = 0;
    while (i < lines.length) {
        // TODO
        var line = (lines[i] = lines[i].replace(/\s+$/g, ''));
        if (!line) {
            lines.splice(i, 1);
        }
        else if (i > 0 && line[0] === ' ') {
            lines[i - 1] += line.slice(1);
            lines.splice(i, 1);
        }
        else {
            i += 1;
        }
    }
    return lines;
}
function validateDateParm(parms) {
    parms.forEach(function (parm) {
        if (!/(VALUE=DATE(-TIME)?)|(TZID=)/.test(parm)) {
            throw new Error('unsupported RDATE/EXDATE parm: ' + parm);
        }
    });
}
function parseRDate(rdateval, parms) {
    validateDateParm(parms);
    return rdateval.split(',').map(function (datestr) { return untilStringToDate(datestr); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnJ1bGVzdHIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnJ1bGVzdHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNyQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDOUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFFM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUE7QUFXekQ7OztHQUdHO0FBQ0gsSUFBTSxlQUFlLEdBQW9CO0lBQ3ZDLE9BQU8sRUFBRSxJQUFJO0lBQ2IsS0FBSyxFQUFFLEtBQUs7SUFDWixNQUFNLEVBQUUsS0FBSztJQUNiLFFBQVEsRUFBRSxLQUFLO0lBQ2YsVUFBVSxFQUFFLEtBQUs7SUFDakIsSUFBSSxFQUFFLElBQUk7Q0FDWCxDQUFBO0FBRUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxDQUFTLEVBQUUsT0FBaUM7SUFDckUsSUFBTSxTQUFTLEdBQXVCLEVBQUUsQ0FBQTtJQUN4QyxJQUFJLFNBQVMsR0FBVyxFQUFFLENBQUE7SUFDMUIsSUFBTSxVQUFVLEdBQXVCLEVBQUUsQ0FBQTtJQUN6QyxJQUFJLFVBQVUsR0FBVyxFQUFFLENBQUE7SUFFM0IsSUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzdCLElBQUEsT0FBTyxHQUFLLGFBQWEsUUFBbEIsQ0FBa0I7SUFDM0IsSUFBQSxJQUFJLEdBQUssYUFBYSxLQUFsQixDQUFrQjtJQUU1QixJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUUvQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTs7UUFDakIs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