import { __extends } from "tslib";
import { RRule } from './rrule';
import { sort, timeToUntilString } from './dateutil';
import { includes } from './helpers';
import { iterSet } from './iterset';
import { rrulestr } from './rrulestr';
import { optionsToString } from './optionstostring';
function createGetterSetter(fieldName) {
    var _this = this;
    return function (field) {
        if (field !== undefined) {
            _this["_".concat(fieldName)] = field;
        }
        if (_this["_".concat(fieldName)] !== undefined) {
            return _this["_".concat(fieldName)];
        }
        for (var i = 0; i < _this._rrule.length; i++) {
            var field_1 = _this._rrule[i].origOptions[fieldName];
            if (field_1) {
                return field_1;
            }
        }
    };
}
var RRuleSet = /** @class */ (function (_super) {
    __extends(RRuleSet, _super);
    /**
     *
     * @param {Boolean?} noCache
     * The same stratagy as RRule on cache, default to false
     * @constructor
     */
    function RRuleSet(noCache) {
        if (noCache === void 0) { noCache = false; }
        var _this = _super.call(this, {}, noCache) || this;
        _this.dtstart = createGetterSetter.apply(_this, ['dtstart']);
        _this.tzid = createGetterSetter.apply(_this, ['tzid']);
        _this._rrule = [];
        _this._rdate = [];
        _this._exrule = [];
        _this._exdate = [];
        return _this;
    }
    RRuleSet.prototype._iter = function (iterResult) {
        return iterSet(iterResult, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
    };
    /**
     * Adds an RRule to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.rrule = function (rrule) {
        _addRule(rrule, this._rrule);
    };
    /**
     * Adds an EXRULE to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.exrule = function (rrule) {
        _addRule(rrule, this._exrule);
    };
    /**
     * Adds an RDate to the set
     *
     * @param {Date}
     */
    RRuleSet.prototype.rdate = function (date) {
        _addDate(date, this._rdate);
    };
    /**
     * Adds an EXDATE to the set
     *
     * @param {Date}
     */
    RRuleSet.prototype.exdate = function (date) {
        _addDate(date, this._exdate);
    };
    /**
     * Get list of included rrules in this recurrence set.
     *
     * @return List of rrules
     */
    RRuleSet.prototype.rrules = function () {
        return this._rrule.map(function (e) { return rrulestr(e.toString()); });
    };
    /**
     * Get list of excluded rrules in this recurrence set.
     *
     * @return List of exrules
     */
    RRuleSet.prototype.exrules = function () {
        return this._exrule.map(function (e) { return rrulestr(e.toString()); });
    };
    /**
     * Get list of included datetimes in this recurrence set.
     *
     * @return List of rdates
     */
    RRuleSet.prototype.rdates = function () {
        return this._rdate.map(function (e) { return new Date(e.getTime()); });
    };
    /**
     * Get list of included datetimes in this recurrence set.
     *
     * @return List of exdates
     */
    RRuleSet.prototype.exdates = function () {
        return this._exdate.map(function (e) { return new Date(e.getTime()); });
    };
    RRuleSet.prototype.valueOf = function () {
        var result = [];
        if (!this._rrule.length && this._dtstart) {
            result = result.concat(optionsToString({ dtstart: this._dtstart }));
        }
        this._rrule.forEach(function (rrule) {
            result = result.concat(rrule.toString().split('\n'));
        });
        this._exrule.forEach(function (exrule) {
            result = result.concat(exrule
                .toString()
                .split('\n')
                .map(function (line) { return line.replace(/^RRULE:/, 'EXRULE:'); })
                .filter(function (line) { return !/^DTSTART/.test(line); }));
        });
        if (this._rdate.length) {
            result.push(rdatesToString('RDATE', this._rdate, this.tzid()));
        }
        if (this._exdate.length) {
            result.push(rdatesToString('EXDATE', this._exdate, this.tzid()));
        }
        return result;
    };
    /**
     * to generate recurrence field such as:
     * DTSTART:19970902T010000Z
     * RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU
     * RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH
     */
    RRuleSet.prototype.toString = function () {
        return this.valueOf().join('\n');
    };
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    RRuleSet.prototype.clone = function () {
        var rrs = new RRuleSet(!!this._cache);
        this._rrule.forEach(function (rule) { return rrs.rrule(rule.clone()); });
        this._exrule.forEach(function (rule) { return rrs.exrule(rule.clone()); });
        this._rdate.forEach(function (date) { return rrs.rdate(new Date(date.getTime())); });
        this._exdate.forEach(function (date) { return rrs.exdate(new Date(date.getTime())); });
        return rrs;
    };
    return RRuleSet;
}(RRule));
export { RRuleSet };
function _addRule(rrule, collection) {
    if (!(rrule instanceof RRule)) {
        throw new TypeError(String(rrule) + ' is not RRule instance');
    }
    if (!includes(collection.map(String), String(rrule))) {
        collection.push(rrule);
    }
}
function _addDate(date, collection) {
    if (!(date instanceof Date)) {
        throw new TypeError(String(date) + ' is not Date instance');
    }
    if (!includes(collection.map(Number), Number(date))) {
        collection.push(date);
        sort(collection);
    }
}
function rdatesToString(param, rdates, tzid) {
    var isUTC = !tzid || tzid.toUpperCase() === 'UTC';
    var header = isUTC ? "".concat(param, ":") : "".concat(param, ";TZID=").concat(tzid, ":");
    var dateString = rdates
        .map(function (rdate) { return timeToUntilString(rdate.valueOf(), isUTC); })
        .join(',');
    return "".concat(header).concat(dateString);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnJ1bGVzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnJ1bGVzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDL0IsT0FBTyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNwRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRXBDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFFbkMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFFbkQsU0FBUyxrQkFBa0IsQ0FBSSxTQUFpQjtJQUFoRCxpQkFpQkM7SUFoQkMsT0FBTyxVQUFDLEtBQVM7UUFDZixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsS0FBSSxDQUFDLFdBQUksU0FBUyxDQUFFLENBQUMsR0FBRyxLQUFLLENBQUE7U0FDOUI7UUFFRCxJQUFJLEtBQUksQ0FBQyxXQUFJLFNBQVMsQ0FBRSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3ZDLE9BQU8sS0FBSSxDQUFDLFdBQUksU0FBUyxDQUFFLENBQUMsQ0FBQTtTQUM3QjtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFNLE9BQUssR0FBTSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUN0RCxJQUFJLE9BQUssRUFBRTtnQkFDVCxPQUFPLE9BQUssQ0FBQTthQUNiO1NBQ0Y7SUFDSCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQ7SUFBOEIsNEJBQUs7SUFTakM7Ozs7O09BS0c7SUFDSCxrQkFBWSxPQUFlO1FBQWYsd0JBQUEsRUFBQSxlQUFlO1FBQTNCLFlBQ0Usa0JBQU0sRUFBRSxFQUFFLE9BQU8sQ0FBQyxTQU1uQjtRQUVELGFBQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUNyRCxVQUFJLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFQN0MsS0FBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDaEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDaEIsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDakIsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7O0lBQ25CLENBQUM7SUFLRCx3QkFBSyxHQUFMLFVBQ0UsVUFBeUI7UUFFekIsT0FBTyxPQUFPLENBQ1osVUFBVSxFQUNWLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxDQUNaLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHdCQUFLLEdBQUwsVUFBTSxLQUFZO1FBQ2hCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gseUJBQU0sR0FBTixVQUFPLEtBQVk7UUFDakIsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx3QkFBSyxHQUFMLFVBQU0sSUFBVTtRQUNkLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gseUJBQU0sR0FBTixVQUFPLElBQVU7UUFDZixRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHlCQUFNLEdBQU47UUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwwQkFBTyxHQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gseUJBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsMEJBQU8sR0FBUDtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFBO0lBQ3ZELENBQUM7SUFFRCwwQkFBTyxHQUFQO1FBQ0UsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFBO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3hDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQ3BFO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLO1lBQ2pDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsTUFBTTtZQUNuQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDcEIsTUFBTTtpQkFDSCxRQUFRLEVBQUU7aUJBQ1YsS0FBSyxDQUFDLElBQUksQ0FBQztpQkFDWCxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQztpQkFDakQsTUFBTSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQzVDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUMvRDtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUNqRTtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsMkJBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx3QkFBSyxHQUFMO1FBQ0UsSUFBTSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQTtRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQTtRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFBO1FBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUE7UUFFcEUsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF2S0QsQ0FBOEIsS0FBSyxHQXVLbEM7O0FBRUQsU0FBUyxRQUFRLENBQUMsS0FBWSxFQUFFLFVBQW1CO0lBQ2pELElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsRUFBRTtRQUM3QixNQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyx3QkFBd0IsQ0FBQyxDQUFBO0tBQzlEO0lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3BELFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdkI7QUFDSCxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsSUFBVSxFQUFFLFVBQWtCO0lBQzlDLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTtRQUMzQixNQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxDQUFBO0tBQzVEO0lBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ25ELFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQ2pCO0FBQ0gsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUNyQixLQUFhLEVBQ2IsTUFBYyxFQUNkLElBQXdCO0lBRXhCLElBQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUE7SUFDbkQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFHLEtBQUssTUFBRyxDQUFDLENBQUMsQ0FBQyxVQUFHLEtBQUssbUJBQVMsSUFBSSxNQUFHLENBQUE7SUFFN0QsSUFBTSxVQUFVLEdBQUcsTUFBTTtTQUN0QixHQUFHLENBQUMsVUFBQyxLQUFLLElBQUssT0FBQSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQXpDLENBQXlDLENBQUM7U0FDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRVosT0FBTyxVQUFHLE1BQU0sU0FBRyxVQUFVLENBQUUsQ0FBQTtBQUNqQyxDQUFDIn0=