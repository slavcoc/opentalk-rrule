import ToText from './totext';
import parseText from './parsetext';
import { RRule } from '../rrule';
import { Frequency } from '../types';
import ENGLISH from './i18n';
/* !
 * rrule.js - Library for working with recurrence rules for calendar dates.
 * https://github.com/jakubroztocil/rrule
 *
 * Copyright 2010, Jakub Roztocil and Lars Schoning
 * Licenced under the BSD licence.
 * https://github.com/jakubroztocil/rrule/blob/master/LICENCE
 *
 */
/**
 *
 * Implementation of RRule.fromText() and RRule::toText().
 *
 *
 * On the client side, this file needs to be included
 * when those functions are used.
 *
 */
// =============================================================================
// fromText
// =============================================================================
/**
 * Will be able to convert some of the below described rules from
 * text format to a rule object.
 *
 *
 * RULES
 *
 * Every ([n])
 * day(s)
 * | [weekday], ..., (and) [weekday]
 * | weekday(s)
 * | week(s)
 * | month(s)
 * | [month], ..., (and) [month]
 * | year(s)
 *
 *
 * Plus 0, 1, or multiple of these:
 *
 * on [weekday], ..., (or) [weekday] the [monthday], [monthday], ... (or) [monthday]
 *
 * on [weekday], ..., (and) [weekday]
 *
 * on the [monthday], [monthday], ... (and) [monthday] (day of the month)
 *
 * on the [nth-weekday], ..., (and) [nth-weekday] (of the month/year)
 *
 *
 * Plus 0 or 1 of these:
 *
 * for [n] time(s)
 *
 * until [date]
 *
 * Plus (.)
 *
 *
 * Definitely no supported for parsing:
 *
 * (for year):
 * in week(s) [n], ..., (and) [n]
 *
 * on the [yearday], ..., (and) [n] day of the year
 * on day [yearday], ..., (and) [n]
 *
 *
 * NON-TERMINALS
 *
 * [n]: 1, 2 ..., one, two, three ..
 * [month]: January, February, March, April, May, ... December
 * [weekday]: Monday, ... Sunday
 * [nth-weekday]: first [weekday], 2nd [weekday], ... last [weekday], ...
 * [monthday]: first, 1., 2., 1st, 2nd, second, ... 31st, last day, 2nd last day, ..
 * [date]:
 * - [month] (0-31(,) ([year])),
 * - (the) 0-31.(1-12.([year])),
 * - (the) 0-31/(1-12/([year])),
 * - [weekday]
 *
 * [year]: 0000, 0001, ... 01, 02, ..
 *
 * Definitely not supported for parsing:
 *
 * [yearday]: first, 1., 2., 1st, 2nd, second, ... 366th, last day, 2nd last day, ..
 *
 * @param {String} text
 * @return {Object, Boolean} the rule, or null.
 */
var fromText = function (text, language) {
    if (language === void 0) { language = ENGLISH; }
    return new RRule(parseText(text, language) || undefined);
};
var common = [
    'count',
    'until',
    'interval',
    'byweekday',
    'bymonthday',
    'bymonth',
];
ToText.IMPLEMENTED = [];
ToText.IMPLEMENTED[Frequency.HOURLY] = common;
ToText.IMPLEMENTED[Frequency.MINUTELY] = common;
ToText.IMPLEMENTED[Frequency.DAILY] = ['byhour'].concat(common);
ToText.IMPLEMENTED[Frequency.WEEKLY] = common;
ToText.IMPLEMENTED[Frequency.MONTHLY] = common;
ToText.IMPLEMENTED[Frequency.YEARLY] = ['byweekno', 'byyearday'].concat(common);
// =============================================================================
// Export
// =============================================================================
var toText = function (rrule, gettext, language, dateFormatter) {
    return new ToText(rrule, gettext, language, dateFormatter).toString();
};
var isFullyConvertible = ToText.isFullyConvertible;
export { fromText, parseText, isFullyConvertible, toText };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbmxwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBa0MsTUFBTSxVQUFVLENBQUE7QUFDekQsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBQ25DLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFDaEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNwQyxPQUFPLE9BQXFCLE1BQU0sUUFBUSxDQUFBO0FBRTFDOzs7Ozs7OztHQVFHO0FBRUg7Ozs7Ozs7O0dBUUc7QUFFSCxnRkFBZ0Y7QUFDaEYsV0FBVztBQUNYLGdGQUFnRjtBQUNoRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1FRztBQUNILElBQU0sUUFBUSxHQUFHLFVBQVUsSUFBWSxFQUFFLFFBQTRCO0lBQTVCLHlCQUFBLEVBQUEsa0JBQTRCO0lBQ25FLE9BQU8sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQTtBQUMxRCxDQUFDLENBQUE7QUFFRCxJQUFNLE1BQU0sR0FBRztJQUNiLE9BQU87SUFDUCxPQUFPO0lBQ1AsVUFBVTtJQUNWLFdBQVc7SUFDWCxZQUFZO0lBQ1osU0FBUztDQUNWLENBQUE7QUFFRCxNQUFNLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQTtBQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUE7QUFDN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFBO0FBQy9DLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQy9ELE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQTtBQUM3QyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUE7QUFDOUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRS9FLGdGQUFnRjtBQUNoRixTQUFTO0FBQ1QsZ0ZBQWdGO0FBRWhGLElBQU0sTUFBTSxHQUFHLFVBQ2IsS0FBWSxFQUNaLE9BQWlCLEVBQ2pCLFFBQW1CLEVBQ25CLGFBQTZCO0lBRTdCLE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDdkUsQ0FBQyxDQUFBO0FBRU8sSUFBQSxrQkFBa0IsR0FBSyxNQUFNLG1CQUFYLENBQVc7QUFTckMsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLENBQUEifQ==