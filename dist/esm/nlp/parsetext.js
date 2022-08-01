import ENGLISH from './i18n';
import { RRule } from '../rrule';
// =============================================================================
// Parser
// =============================================================================
var Parser = /** @class */ (function () {
    function Parser(rules) {
        this.done = true;
        this.rules = rules;
    }
    Parser.prototype.start = function (text) {
        this.text = text;
        this.done = false;
        return this.nextSymbol();
    };
    Parser.prototype.isDone = function () {
        return this.done && this.symbol === null;
    };
    Parser.prototype.nextSymbol = function () {
        var best;
        var bestSymbol;
        this.symbol = null;
        this.value = null;
        do {
            if (this.done)
                return false;
            var rule = void 0;
            best = null;
            for (var name_1 in this.rules) {
                rule = this.rules[name_1];
                var match = rule.exec(this.text);
                if (match) {
                    if (best === null || match[0].length > best[0].length) {
                        best = match;
                        bestSymbol = name_1;
                    }
                }
            }
            if (best != null) {
                this.text = this.text.substr(best[0].length);
                if (this.text === '')
                    this.done = true;
            }
            if (best == null) {
                this.done = true;
                this.symbol = null;
                this.value = null;
                return;
            }
        } while (bestSymbol === 'SKIP');
        this.symbol = bestSymbol;
        this.value = best;
        return true;
    };
    Parser.prototype.accept = function (name) {
        if (this.symbol === name) {
            if (this.value) {
                var v = this.value;
                this.nextSymbol();
                return v;
            }
            this.nextSymbol();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptNumber = function () {
        return this.accept('number');
    };
    Parser.prototype.expect = function (name) {
        if (this.accept(name))
            return true;
        throw new Error('expected ' + name + ' but found ' + this.symbol);
    };
    return Parser;
}());
export default function parseText(text, language) {
    if (language === void 0) { language = ENGLISH; }
    var options = {};
    var ttr = new Parser(language.tokens);
    if (!ttr.start(text))
        return null;
    S();
    return options;
    function S() {
        // every [n]
        ttr.expect('every');
        var n = ttr.acceptNumber();
        if (n)
            options.interval = parseInt(n[0], 10);
        if (ttr.isDone())
            throw new Error('Unexpected end');
        switch (ttr.symbol) {
            case 'day(s)':
                options.freq = RRule.DAILY;
                if (ttr.nextSymbol()) {
                    AT();
                    F();
                }
                break;
            // FIXME Note: every 2 weekdays != every two weeks on weekdays.
            // DAILY on weekdays is not a valid rule
            case 'weekday(s)':
                options.freq = RRule.WEEKLY;
                options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
                ttr.nextSymbol();
                F();
                break;
            case 'week(s)':
                options.freq = RRule.WEEKLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'hour(s)':
                options.freq = RRule.HOURLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'minute(s)':
                options.freq = RRule.MINUTELY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'month(s)':
                options.freq = RRule.MONTHLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'year(s)':
                options.freq = RRule.YEARLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'monday':
            case 'tuesday':
            case 'wednesday':
            case 'thursday':
            case 'friday':
            case 'saturday':
            case 'sunday':
                options.freq = RRule.WEEKLY;
                var key = ttr.symbol
                    .substr(0, 2)
                    .toUpperCase();
                options.byweekday = [RRule[key]];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    var wkd = decodeWKD();
                    if (!wkd) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected weekday');
                    }
                    options.byweekday.push(RRule[wkd]);
                    ttr.nextSymbol();
                }
                MDAYs();
                F();
                break;
            case 'january':
            case 'february':
            case 'march':
            case 'april':
            case 'may':
            case 'june':
            case 'july':
            case 'august':
            case 'september':
            case 'october':
            case 'november':
            case 'december':
                options.freq = RRule.YEARLY;
                options.bymonth = [decodeM()];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    var m = decodeM();
                    if (!m) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected month');
                    }
                    options.bymonth.push(m);
                    ttr.nextSymbol();
                }
                ON();
                F();
                break;
            default:
                throw new Error('Unknown symbol');
        }
    }
    function ON() {
        var on = ttr.accept('on');
        var the = ttr.accept('the');
        if (!(on || the))
            return;
        do {
            var nth = decodeNTH();
            var wkd = decodeWKD();
            var m = decodeM();
            // nth <weekday> | <weekday>
            if (nth) {
                // ttr.nextSymbol()
                if (wkd) {
                    ttr.nextSymbol();
                    if (!options.byweekday)
                        options.byweekday = [];
                    options.byweekday.push(RRule[wkd].nth(nth));
                }
                else {
                    if (!options.bymonthday)
                        options.bymonthday = [];
                    options.bymonthday.push(nth);
                    ttr.accept('day(s)');
                }
                // <weekday>
            }
            else if (wkd) {
                ttr.nextSymbol();
                if (!options.byweekday)
                    options.byweekday = [];
                options.byweekday.push(RRule[wkd]);
            }
            else if (ttr.symbol === 'weekday(s)') {
                ttr.nextSymbol();
                if (!options.byweekday) {
                    options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
                }
            }
            else if (ttr.symbol === 'week(s)') {
                ttr.nextSymbol();
                var n = ttr.acceptNumber();
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + ', expected week number');
                }
                options.byweekno = [parseInt(n[0], 10)];
                while (ttr.accept('comma')) {
                    n = ttr.acceptNumber();
                    if (!n) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
                    }
                    options.byweekno.push(parseInt(n[0], 10));
                }
            }
            else if (m) {
                ttr.nextSymbol();
                if (!options.bymonth)
                    options.bymonth = [];
                options.bymonth.push(m);
            }
            else {
                return;
            }
        } while (ttr.accept('comma') || ttr.accept('the') || ttr.accept('on'));
    }
    function AT() {
        var at = ttr.accept('at');
        if (!at)
            return;
        do {
            var n = ttr.acceptNumber();
            if (!n) {
                throw new Error('Unexpected symbol ' + ttr.symbol + ', expected hour');
            }
            options.byhour = [parseInt(n[0], 10)];
            while (ttr.accept('comma')) {
                n = ttr.acceptNumber();
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + '; expected hour');
                }
                options.byhour.push(parseInt(n[0], 10));
            }
        } while (ttr.accept('comma') || ttr.accept('at'));
    }
    function decodeM() {
        switch (ttr.symbol) {
            case 'january':
                return 1;
            case 'february':
                return 2;
            case 'march':
                return 3;
            case 'april':
                return 4;
            case 'may':
                return 5;
            case 'june':
                return 6;
            case 'july':
                return 7;
            case 'august':
                return 8;
            case 'september':
                return 9;
            case 'october':
                return 10;
            case 'november':
                return 11;
            case 'december':
                return 12;
            default:
                return false;
        }
    }
    function decodeWKD() {
        switch (ttr.symbol) {
            case 'monday':
            case 'tuesday':
            case 'wednesday':
            case 'thursday':
            case 'friday':
            case 'saturday':
            case 'sunday':
                return ttr.symbol.substr(0, 2).toUpperCase();
            default:
                return false;
        }
    }
    function decodeNTH() {
        switch (ttr.symbol) {
            case 'last':
                ttr.nextSymbol();
                return -1;
            case 'first':
                ttr.nextSymbol();
                return 1;
            case 'second':
                ttr.nextSymbol();
                return ttr.accept('last') ? -2 : 2;
            case 'third':
                ttr.nextSymbol();
                return ttr.accept('last') ? -3 : 3;
            case 'nth':
                var v = parseInt(ttr.value[1], 10);
                if (v < -366 || v > 366)
                    throw new Error('Nth out of range: ' + v);
                ttr.nextSymbol();
                return ttr.accept('last') ? -v : v;
            default:
                return false;
        }
    }
    function MDAYs() {
        ttr.accept('on');
        ttr.accept('the');
        var nth = decodeNTH();
        if (!nth)
            return;
        options.bymonthday = [nth];
        ttr.nextSymbol();
        while (ttr.accept('comma')) {
            nth = decodeNTH();
            if (!nth) {
                throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
            }
            options.bymonthday.push(nth);
            ttr.nextSymbol();
        }
    }
    function F() {
        if (ttr.symbol === 'until') {
            var date = Date.parse(ttr.text);
            if (!date)
                throw new Error('Cannot parse until date:' + ttr.text);
            options.until = new Date(date);
        }
        else if (ttr.accept('for')) {
            options.count = parseInt(ttr.value[0], 10);
            ttr.expect('number');
            // ttr.expect('times')
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2V0ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL25scC9wYXJzZXRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFxQixNQUFNLFFBQVEsQ0FBQTtBQUMxQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBSWhDLGdGQUFnRjtBQUNoRixTQUFTO0FBQ1QsZ0ZBQWdGO0FBRWhGO0lBT0UsZ0JBQVksS0FBOEI7UUFGbEMsU0FBSSxHQUFHLElBQUksQ0FBQTtRQUdqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtJQUNwQixDQUFDO0lBRUQsc0JBQUssR0FBTCxVQUFNLElBQVk7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7UUFDakIsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDMUIsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUE7SUFDMUMsQ0FBQztJQUVELDJCQUFVLEdBQVY7UUFDRSxJQUFJLElBQTRCLENBQUE7UUFDaEMsSUFBSSxVQUFrQixDQUFBO1FBRXRCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ2pCLEdBQUc7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJO2dCQUFFLE9BQU8sS0FBSyxDQUFBO1lBRTNCLElBQUksSUFBSSxTQUFRLENBQUE7WUFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNYLEtBQUssSUFBTSxNQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDN0IsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBSSxDQUFDLENBQUE7Z0JBQ3ZCLElB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