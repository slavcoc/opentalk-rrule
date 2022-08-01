import IterResult from './iterresult';
import { clone, cloneDates } from './dateutil';
import { isArray } from './helpers';
function argsMatch(left, right) {
    if (Array.isArray(left)) {
        if (!Array.isArray(right))
            return false;
        if (left.length !== right.length)
            return false;
        return left.every(function (date, i) { return date.getTime() === right[i].getTime(); });
    }
    if (left instanceof Date) {
        return right instanceof Date && left.getTime() === right.getTime();
    }
    return left === right;
}
var Cache = /** @class */ (function () {
    function Cache() {
        this.all = false;
        this.before = [];
        this.after = [];
        this.between = [];
    }
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */
    Cache.prototype._cacheAdd = function (what, value, args) {
        if (value) {
            value = value instanceof Date ? clone(value) : cloneDates(value);
        }
        if (what === 'all') {
            this.all = value;
        }
        else {
            args._value = value;
            this[what].push(args);
        }
    };
    /**
     * @return false - not in the cache
     * @return null  - cached, but zero occurrences (before/after)
     * @return Date  - cached (before/after)
     * @return []    - cached, but zero occurrences (all/between)
     * @return [Date1, DateN] - cached (all/between)
     */
    Cache.prototype._cacheGet = function (what, args) {
        var cached = false;
        var argsKeys = args ? Object.keys(args) : [];
        var findCacheDiff = function (item) {
            for (var i = 0; i < argsKeys.length; i++) {
                var key = argsKeys[i];
                if (!argsMatch(args[key], item[key])) {
                    return true;
                }
            }
            return false;
        };
        var cachedObject = this[what];
        if (what === 'all') {
            cached = this.all;
        }
        else if (isArray(cachedObject)) {
            // Let's see whether we've already called the
            // 'what' method with the same 'args'
            for (var i = 0; i < cachedObject.length; i++) {
                var item = cachedObject[i];
                if (argsKeys.length && findCacheDiff(item))
                    continue;
                cached = item._value;
                break;
            }
        }
        if (!cached && this.all) {
            // Not in the cache, but we already know all the occurrences,
            // so we can find the correct dates from the cached ones.
            var iterResult = new IterResult(what, args);
            for (var i = 0; i < this.all.length; i++) {
                if (!iterResult.accept(this.all[i]))
                    break;
            }
            cached = iterResult.getValue();
            this._cacheAdd(what, cached, args);
        }
        return isArray(cached)
            ? cloneDates(cached)
            : cached instanceof Date
                ? clone(cached)
                : cached;
    };
    return Cache;
}());
export { Cache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxVQUF3QixNQUFNLGNBQWMsQ0FBQTtBQUNuRCxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBSW5DLFNBQVMsU0FBUyxDQUNoQixJQUEwQyxFQUMxQyxLQUEyQztJQUUzQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUE7UUFDdkMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUE7UUFDOUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUMsSUFBSSxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQXJDLENBQXFDLENBQUMsQ0FBQTtLQUN0RTtJQUVELElBQUksSUFBSSxZQUFZLElBQUksRUFBRTtRQUN4QixPQUFPLEtBQUssWUFBWSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNuRTtJQUVELE9BQU8sSUFBSSxLQUFLLEtBQUssQ0FBQTtBQUN2QixDQUFDO0FBRUQ7SUFBQTtRQUNFLFFBQUcsR0FBdUMsS0FBSyxDQUFBO1FBQy9DLFdBQU0sR0FBZSxFQUFFLENBQUE7UUFDdkIsVUFBSyxHQUFlLEVBQUUsQ0FBQTtRQUN0QixZQUFPLEdBQWUsRUFBRSxDQUFBO0lBOEUxQixDQUFDO0lBNUVDOzs7O09BSUc7SUFDSSx5QkFB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