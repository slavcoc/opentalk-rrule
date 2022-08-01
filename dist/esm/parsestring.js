import { __assign } from "tslib";
import { Frequency } from './types';
import { Weekday } from './weekday';
import { untilStringToDate } from './dateutil';
import { Days } from './rrule';
export function parseString(rfcString) {
    var options = rfcString
        .split('\n')
        .map(parseLine)
        .filter(function (x) { return x !== null; });
    return __assign(__assign({}, options[0]), options[1]);
}
export function parseDtstart(line) {
    var options = {};
    var dtstartWithZone = /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line);
    if (!dtstartWithZone) {
        return options;
    }
    var tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
    if (tzid) {
        options.tzid = tzid;
    }
    options.dtstart = untilStringToDate(dtstart);
    return options;
}
function parseLine(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '');
    if (!rfcString.length)
        return null;
    var header = /^([A-Z]+?)[:;]/.exec(rfcString.toUpperCase());
    if (!header) {
        return parseRrule(rfcString);
    }
    var key = header[1];
    switch (key.toUpperCase()) {
        case 'RRULE':
        case 'EXRULE':
            return parseRrule(rfcString);
        case 'DTSTART':
            return parseDtstart(rfcString);
        default:
            throw new Error("Unsupported RFC prop ".concat(key, " in ").concat(rfcString));
    }
}
function parseRrule(line) {
    var strippedLine = line.replace(/^RRULE:/i, '');
    var options = parseDtstart(strippedLine);
    var attrs = line.replace(/^(?:RRULE|EXRULE):/i, '').split(';');
    attrs.forEach(function (attr) {
        var _a = attr.split('='), key = _a[0], value = _a[1];
        switch (key.toUpperCase()) {
            case 'FREQ':
                options.freq = Frequency[value.toUpperCase()];
                break;
            case 'WKST':
                options.wkst = Days[value.toUpperCase()];
                break;
            case 'COUNT':
            case 'INTERVAL':
            case 'BYSETPOS':
            case 'BYMONTH':
            case 'BYMONTHDAY':
            case 'BYYEARDAY':
            case 'BYWEEKNO':
            case 'BYHOUR':
            case 'BYMINUTE':
            case 'BYSECOND':
                var num = parseNumber(value);
                var optionKey = key.toLowerCase();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                options[optionKey] = num;
                break;
            case 'BYWEEKDAY':
            case 'BYDAY':
                options.byweekday = parseWeekday(value);
                break;
            case 'DTSTART':
            case 'TZID':
                // for backwards compatibility
                var dtstart = parseDtstart(line);
                options.tzid = dtstart.tzid;
                options.dtstart = dtstart.dtstart;
                break;
            case 'UNTIL':
                options.until = untilStringToDate(value);
                break;
            case 'BYEASTER':
                options.byeaster = Number(value);
                break;
            default:
                throw new Error("Unknown RRULE property '" + key + "'");
        }
    });
    return options;
}
function parseNumber(value) {
    if (value.indexOf(',') !== -1) {
        var values = value.split(',');
        return values.map(parseIndividualNumber);
    }
    return parseIndividualNumber(value);
}
function parseIndividualNumber(value) {
    if (/^[+-]?\d+$/.test(value)) {
        return Number(value);
    }
    return value;
}
function parseWeekday(value) {
    var days = value.split(',');
    return days.map(function (day) {
        if (day.length === 2) {
            // MO, TU, ...
            return Days[day]; // wday instanceof Weekday
        }
        // -1MO, +3FR, 1SO, 13TU ...
        var parts = day.match(/^([+-]?\d{1,2})([A-Z]{2})$/);
        if (!parts || parts.length < 3) {
            throw new SyntaxError("Invalid weekday string: ".concat(day));
        }
        var n = Number(parts[1]);
        var wdaypart = parts[2];
        var wday = Days[wdaypart].weekday;
        return new Weekday(wday, n);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VzdHJpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2VzdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBVyxTQUFTLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUNuQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFDOUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUU5QixNQUFNLFVBQVUsV0FBVyxDQUFDLFNBQWlCO0lBQzNDLElBQU0sT0FBTyxHQUFHLFNBQVM7U0FDdEIsS0FBSyxDQUFDLElBQUksQ0FBQztTQUNYLEdBQUcsQ0FBQyxTQUFTLENBQUM7U0FDZCxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQyxDQUFBO0lBQzVCLDZCQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekMsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBWTtJQUN2QyxJQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFBO0lBRXBDLElBQU0sZUFBZSxHQUFHLDhDQUE4QyxDQUFDLElBQUksQ0FDekUsSUFBSSxDQUNMLENBQUE7SUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3BCLE9BQU8sT0FBTyxDQUFBO0tBQ2Y7SUFFUSxJQUFBLElBQUksR0FBYSxlQUFlLEdBQTVCLEVBQUUsT0FBTyxHQUFJLGVBQWUsR0FBbkIsQ0FBbUI7SUFFekMsSUFBSSxJQUFJLEVBQUU7UUFDUixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtLQUNwQjtJQUNELE9BQU8sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDNUMsT0FBTyxPQUFPLENB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