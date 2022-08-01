"use strict";
// =============================================================================
// Weekday
// =============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weekday = exports.ALL_WEEKDAYS = void 0;
exports.ALL_WEEKDAYS = [
    'MO',
    'TU',
    'WE',
    'TH',
    'FR',
    'SA',
    'SU',
];
var Weekday = /** @class */ (function () {
    function Weekday(weekday, n) {
        if (n === 0)
            throw new Error("Can't create weekday with n == 0");
        this.weekday = weekday;
        this.n = n;
    }
    Weekday.fromStr = function (str) {
        return new Weekday(exports.ALL_WEEKDAYS.indexOf(str));
    };
    // __call__ - Cannot call the object directly, do it through
    // e.g. RRule.TH.nth(-1) instead,
    Weekday.prototype.nth = function (n) {
        return this.n === n ? this : new Weekday(this.weekday, n);
    };
    // __eq__
    Weekday.prototype.equals = function (other) {
        return this.weekday === other.weekday && this.n === other.n;
    };
    // __repr__
    Weekday.prototype.toString = function () {
        var s = exports.ALL_WEEKDAYS[this.weekday];
        if (this.n)
            s = (this.n > 0 ? '+' : '') + String(this.n) + s;
        return s;
    };
    Weekday.prototype.getJsWeekday = function () {
        return this.weekday === 6 ? 0 : this.weekday + 1;
    };
    return Weekday;
}());
exports.Weekday = Weekday;
//# sourceMappingURL=weekday.js.map