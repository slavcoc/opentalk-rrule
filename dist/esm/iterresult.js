/**
 * This class helps us to emulate python's generators, sorta.
 */
var IterResult = /** @class */ (function () {
    function IterResult(method, args) {
        this.minDate = null;
        this.maxDate = null;
        this._result = [];
        this.total = 0;
        this.method = method;
        this.args = args;
        if (method === 'between') {
            this.maxDate = args.inc
                ? args.before
                : new Date(args.before.getTime() - 1);
            this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
        }
        else if (method === 'before') {
            this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
        }
        else if (method === 'after') {
            this.minDate = args.inc ? args.dt : new Date(args.dt.getTime() + 1);
        }
    }
    /**
     * Possibly adds a date into the result.
     *
     * @param {Date} date - the date isn't necessarly added to the result
     * list (if it is too late/too early)
     * @return {Boolean} true if it makes sense to continue the iteration
     * false if we're done.
     */
    IterResult.prototype.accept = function (date) {
        ++this.total;
        var tooEarly = this.minDate && date < this.minDate;
        var tooLate = this.maxDate && date > this.maxDate;
        if (this.method === 'between') {
            if (tooEarly)
                return true;
            if (tooLate)
                return false;
        }
        else if (this.method === 'before') {
            if (tooLate)
                return false;
        }
        else if (this.method === 'after') {
            if (tooEarly)
                return true;
            this.add(date);
            return false;
        }
        return this.add(date);
    };
    /**
     *
     * @param {Date} date that is part of the result.
     * @return {Boolean} whether we are interested in more values.
     */
    IterResult.prototype.add = function (date) {
        this._result.push(date);
        return true;
    };
    /**
     * 'before' and 'after' return only one date, whereas 'all'
     * and 'between' an array.
     *
     * @return {Date,Array?}
     */
    IterResult.prototype.getValue = function () {
        var res = this._result;
        switch (this.method) {
            case 'all':
            case 'between':
                return res;
            case 'before':
            case 'after':
            default:
                return (res.length ? res[res.length - 1] : null);
        }
    };
    IterResult.prototype.clone = function () {
        return new IterResult(this.method, this.args);
    };
    return IterResult;
}());
export default IterResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcnJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pdGVycmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWNBOztHQUVHO0FBQ0g7SUFRRSxvQkFBWSxNQUFTLEVBQUUsSUFBdUI7UUFMOUIsWUFBTyxHQUFnQixJQUFJLENBQUE7UUFDM0IsWUFBTyxHQUFnQixJQUFJLENBQUE7UUFDcEMsWUFBTyxHQUFXLEVBQUUsQ0FBQTtRQUNwQixVQUFLLEdBQUcsQ0FBQyxDQUFBO1FBR2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFFaEIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUc7Z0JBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDYixDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7U0FDMUU7YUFBTSxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ3BFO2FBQU0sSUFBSSxNQUFNLEtBQUssT0FBTyxFQUFFO1lBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNwRTtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsMkJBQU0sR0FBTixVQUFPLElBQVU7UUFDZixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDWixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO1FBQ3BELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUE7UUFFbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUM3QixJQUFJLFFBQVE7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDekIsSUFBSSxPQUFPO2dCQUFFLE9BQU8sS0FBSyxDQUFBO1NBQzFCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUNuQyxJQUFJLE9BQU87Z0JBQUUsT0FBTyxLQUFLLENBQUE7U0FDMUI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO1lBQ2xDLElBQUksUUFBUTtnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2QsT0FBTyxLQUFLLENBQUE7U0FDYjtRQUVELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN2QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHdCQUFHLEdBQUgsVUFBSSxJQUFVO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkIsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw2QkFBUSxHQUFSO1FBQ0UsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUN4QixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbkIsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLFNBQVM7Z0JBQ1osT0FBTyxHQUF3QixDQUFBO1lBQ2pDLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxPQUFPLENBQUM7WUFDYjtnQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBc0IsQ0FBQTtTQUN4RTtJQUNILENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQ0UsT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBbkZELElBbUZDIn0=