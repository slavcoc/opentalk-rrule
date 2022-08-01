import { RRule, DEFAULT_OPTIONS } from './rrule';
import { includes, isPresent, isArray, isNumber, toArray } from './helpers';
import { Weekday } from './weekday';
import { timeToUntilString } from './dateutil';
import { DateWithZone } from './datewithzone';
export function optionsToString(options) {
    var rrule = [];
    var dtstart = '';
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(DEFAULT_OPTIONS);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'tzid')
            continue;
        if (!includes(defaultKeys, keys[i]))
            continue;
        var key = keys[i].toUpperCase();
        var value = options[keys[i]];
        var outValue = '';
        if (!isPresent(value) || (isArray(value) && !value.length))
            continue;
        switch (key) {
            case 'FREQ':
                outValue = RRule.FREQUENCIES[options.freq];
                break;
            case 'WKST':
                if (isNumber(value)) {
                    outValue = new Weekday(value).toString();
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
                outValue = toArray(value)
                    .map(function (wday) {
                    if (wday instanceof Weekday) {
                        return wday;
                    }
                    if (isArray(wday)) {
                        return new Weekday(wday[0], wday[1]);
                    }
                    return new Weekday(wday);
                })
                    .toString();
                break;
            case 'DTSTART':
                dtstart = buildDtstart(value, options.tzid);
                break;
            case 'UNTIL':
                outValue = timeToUntilString(value, !options.tzid);
                break;
            default:
                if (isArray(value)) {
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
function buildDtstart(dtstart, tzid) {
    if (!dtstart) {
        return '';
    }
    return 'DTSTART' + new DateWithZone(new Date(dtstart), tzid).toString();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uc3Rvc3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29wdGlvbnN0b3N0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNoRCxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUMzRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBQ25DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFN0MsTUFBTSxVQUFVLGVBQWUsQ0FBQyxPQUF5QjtJQUN2RCxJQUFNLEtBQUssR0FBZSxFQUFFLENBQUE7SUFDNUIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLElBQU0sSUFBSSxHQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBc0IsQ0FBQTtJQUN6RSxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0lBRWhELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU07WUFBRSxTQUFRO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFFLFNBQVE7UUFFN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQy9CLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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