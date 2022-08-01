// =============================================================================
// Weekday
// =============================================================================
export var ALL_WEEKDAYS = [
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
        return new Weekday(ALL_WEEKDAYS.indexOf(str));
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
        var s = ALL_WEEKDAYS[this.weekday];
        if (this.n)
            s = (this.n > 0 ? '+' : '') + String(this.n) + s;
        return s;
    };
    Weekday.prototype.getJsWeekday = function () {
        return this.weekday === 6 ? 0 : this.weekday + 1;
    };
    return Weekday;
}());
export { Weekday };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vla2RheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWVrZGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdGQUFnRjtBQUNoRixVQUFVO0FBQ1YsZ0ZBQWdGO0FBR2hGLE1BQU0sQ0FBQyxJQUFNLFlBQVksR0FBaUI7SUFDeEMsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtDQUNMLENBQUE7QUFFRDtJQUlFLGlCQUFZLE9BQWUsRUFBRSxDQUFVO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUE7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDWixDQUFDO0lBRU0sZUFBTyxHQUFkLFVBQWUsR0FBZTtRQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBRUQsNERBQTREO0lBQzVELGlDQUFpQztJQUNqQyxxQkFBRyxHQUFILFVBQUksQ0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsU0FBUztJQUNULHdCQUFNLEdBQU4sVUFBTyxLQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0lBRUQsV0FBVztJQUNYLDBCQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsR0FBVyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzFDLElBQUksSUFBSSxDQUFDLENBQUM7WUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM1RCxPQUFPLENBQUMsQ0FBQTtJQUNWLENBQUM7SUFFRCw4QkFBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0MifQ==