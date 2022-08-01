import { __extends } from "tslib";
import IterResult from './iterresult';
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult = /** @class */ (function (_super) {
    __extends(CallbackIterResult, _super);
    function CallbackIterResult(method, args, iterator) {
        var _this = _super.call(this, method, args) || this;
        _this.iterator = iterator;
        return _this;
    }
    CallbackIterResult.prototype.add = function (date) {
        if (this.iterator(date, this._result.length)) {
            this._result.push(date);
            return true;
        }
        return false;
    };
    return CallbackIterResult;
}(IterResult));
export default CallbackIterResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2tpdGVycmVzdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NhbGxiYWNraXRlcnJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxVQUF3QixNQUFNLGNBQWMsQ0FBQTtBQUluRDs7O0dBR0c7QUFDSDtJQUFnRCxzQ0FBNkI7SUFHM0UsNEJBQ0UsTUFBeUIsRUFDekIsSUFBdUIsRUFDdkIsUUFBa0I7UUFIcEIsWUFLRSxrQkFBTSxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBR3BCO1FBREMsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7O0lBQzFCLENBQUM7SUFFRCxnQ0FBRyxHQUFILFVBQUksSUFBVTtRQUNaLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN2QixPQUFPLElBQUksQ0FBQTtTQUNaO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBcEJELENBQWdELFVBQVUsR0FvQnpEIn0=