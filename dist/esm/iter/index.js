import { freqIsDailyOrGreater } from '../types';
import { combine, fromOrdinal, MAXYEAR } from '../dateutil';
import Iterinfo from '../iterinfo/index';
import { RRule } from '../rrule';
import { buildTimeset } from '../parseoptions';
import { notEmpty, includes, isPresent } from '../helpers';
import { DateWithZone } from '../datewithzone';
import { buildPoslist } from './poslist';
import { DateTime } from '../datetime';
export function iter(iterResult, options) {
    var dtstart = options.dtstart, freq = options.freq, interval = options.interval, until = options.until, bysetpos = options.bysetpos;
    var count = options.count;
    if (count === 0 || interval === 0) {
        return emitResult(iterResult);
    }
    var counterDate = DateTime.fromDate(dtstart);
    var ii = new Iterinfo(options);
    ii.rebuild(counterDate.year, counterDate.month);
    var timeset = makeTimeset(ii, counterDate, options);
    for (;;) {
        var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
        var filtered = removeFilteredDays(dayset, start, end, ii, options);
        if (notEmpty(bysetpos)) {
            var poslist = buildPoslist(bysetpos, timeset, start, end, ii, dayset);
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
                if (!isPresent(currentDay)) {
                    continue;
                }
                var date = fromOrdinal(ii.yearordinal + currentDay);
                for (var k = 0; k < timeset.length; k++) {
                    var time = timeset[k];
                    var res = combine(date, time);
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
        if (counterDate.year > MAXYEAR) {
            return emitResult(iterResult);
        }
        if (!freqIsDailyOrGreater(freq)) {
            timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0);
        }
        ii.rebuild(counterDate.year, counterDate.month);
    }
}
function isFiltered(ii, currentDay, options) {
    var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
    return ((notEmpty(bymonth) && !includes(bymonth, ii.mmask[currentDay])) ||
        (notEmpty(byweekno) && !ii.wnomask[currentDay]) ||
        (notEmpty(byweekday) && !includes(byweekday, ii.wdaymask[currentDay])) ||
        (notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
        (byeaster !== null && !includes(ii.eastermask, currentDay)) ||
        ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
            !includes(bymonthday, ii.mdaymask[currentDay]) &&
            !includes(bynmonthday, ii.nmdaymask[currentDay])) ||
        (notEmpty(byyearday) &&
            ((currentDay < ii.yearlen &&
                !includes(byyearday, currentDay + 1) &&
                !includes(byyearday, -ii.yearlen + currentDay)) ||
                (currentDay >= ii.yearlen &&
                    !includes(byyearday, currentDay + 1 - ii.yearlen) &&
                    !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen)))));
}
function rezoneIfNeeded(date, options) {
    return new DateWithZone(date, options.tzid).rezonedDate();
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
    if (freqIsDailyOrGreater(freq)) {
        return buildTimeset(options);
    }
    if ((freq >= RRule.HOURLY &&
        notEmpty(byhour) &&
        !includes(byhour, counterDate.hour)) ||
        (freq >= RRule.MINUTELY &&
            notEmpty(byminute) &&
            !includes(byminute, counterDate.minute)) ||
        (freq >= RRule.SECONDLY &&
            notEmpty(bysecond) &&
            !includes(bysecond, counterDate.second))) {
        return [];
    }
    return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaXRlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQWlCLG9CQUFvQixFQUFvQixNQUFNLFVBQVUsQ0FBQTtBQUNoRixPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFDM0QsT0FBTyxRQUFRLE1BQU0sbUJBQW1CLENBQUE7QUFDeEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNoQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDOUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFBO0FBQzFELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBQ3hDLE9BQU8sRUFBUSxRQUFRLEVBQUUsTUFBTSxhQUFhLENBQUE7QUFFNUMsTUFBTSxVQUFVLElBQUksQ0FDbEIsVUFBeUIsRUFDekIsT0FBc0I7SUFFZCxJQUFBLE9BQU8sR0FBc0MsT0FBTyxRQUE3QyxFQUFFLElBQUksR0FBZ0MsT0FBTyxLQUF2QyxFQUFFLFFBQVEsR0FBc0IsT0FBTyxTQUE3QixFQUFFLEtBQUssR0FBZSxPQUFPLE1BQXRCLEVBQUUsUUFBUSxHQUFLLE9BQU8sU0FBWixDQUFZO0lBRTVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUE7SUFDekIsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxDQUFDLEVBQUU7UUFDakMsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDOUI7SUFFRCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTlD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QUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN0RSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlDLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLE9BQU87Z0JBQ3ZCLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsT0FBTztvQkFDdkIsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFF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