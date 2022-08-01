"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var iterresult_1 = tslib_1.__importDefault(require("./iterresult"));
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult = /** @class */ (function (_super) {
    tslib_1.__extends(CallbackIterResult, _super);
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
}(iterresult_1.default));
exports.default = CallbackIterResult;
//# sourceMappingURL=callbackiterresult.js.map