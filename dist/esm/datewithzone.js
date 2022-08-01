import { timeToUntilString } from './dateutil';
var DateWithZone = /** @class */ (function () {
    function DateWithZone(date, tzid) {
        if (isNaN(date.getTime())) {
            throw new RangeError('Invalid date passed to DateWithZone');
        }
        this.date = date;
        this.tzid = tzid;
    }
    Object.defineProperty(DateWithZone.prototype, "isUTC", {
        get: function () {
            return !this.tzid || this.tzid.toUpperCase() === 'UTC';
        },
        enumerable: false,
        configurable: true
    });
    DateWithZone.prototype.toString = function () {
        var datestr = timeToUntilString(this.date.getTime(), this.isUTC);
        if (!this.isUTC) {
            return ";TZID=".concat(this.tzid, ":").concat(datestr);
        }
        return ":".concat(datestr);
    };
    DateWithZone.prototype.getTime = function () {
        return this.date.getTime();
    };
    DateWithZone.prototype.rezonedDate = function () {
        var _a;
        if (this.isUTC) {
            return this.date;
        }
        var localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var dateInLocalTZ = new Date(this.date.toLocaleString(undefined, { timeZone: localTimeZone }));
        var dateInTargetTZ = new Date(this.date.toLocaleString(undefined, { timeZone: (_a = this.tzid) !== null && _a !== void 0 ? _a : 'UTC' }));
        var tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime();
        return new Date(this.date.getTime() - tzOffset);
    };
    return DateWithZone;
}());
export { DateWithZone };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXdpdGh6b25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGV3aXRoem9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUE7QUFFOUM7SUFJRSxzQkFBWSxJQUFVLEVBQUUsSUFBb0I7UUFDMUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7WUFDekIsTUFBTSxJQUFJLFVBQVUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVELHNCQUFZLCtCQUFLO2FBQWpCO1lBQ0UsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUE7UUFDeEQsQ0FBQzs7O09BQUE7SUFFTSwrQkFBUSxHQUFmO1FBQ0UsSUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixPQUFPLGdCQUFTLElBQUksQ0FBQyxJQUFJLGNBQUksT0FBTyxDQUFFLENBQUE7U0FDdkM7UUFFRCxPQUFPLFdBQUksT0FBTyxDQUFFLENBQUE7SUFDdEIsQ0FBQztJQUVNLDhCQUFPLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDNUIsQ0FBQztJQUVNLGtDQUFXLEdBQWxCOztRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtTQUNqQjtRQUVELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUE7UUFDdEUsSUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUNqRSxDQUFBO1FBQ0QsSUFBTSxjQUFjLEdBQUcsSUFBSSxJQUFJLENBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFBLElBQUksQ0FBQyxJQUFJLG1DQUFJLEtBQUssRUFBRSxDQUFDLENBQ3RFLENBQUE7UUFDRCxJQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRW5FLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQTtJQUNqRCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDIn0=