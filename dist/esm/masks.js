"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NMDAY366MASK = exports.NMDAY365MASK = exports.MDAY366MASK = exports.MDAY365MASK = exports.M366RANGE = exports.M366MASK = exports.M365RANGE = exports.M365MASK = exports.WDAYMASK = void 0;
var tslib_1 = require("tslib");
var helpers_1 = require("./helpers");
// =============================================================================
// Date masks
// =============================================================================
// Every mask is 7 days longer to handle cross-year weekly periods.
var M365MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (0, helpers_1.repeat)(1, 31), true), (0, helpers_1.repeat)(2, 28), true), (0, helpers_1.repeat)(3, 31), true), (0, helpers_1.repeat)(4, 30), true), (0, helpers_1.repeat)(5, 31), true), (0, helpers_1.repeat)(6, 30), true), (0, helpers_1.repeat)(7, 31), true), (0, helpers_1.repeat)(8, 31), true), (0, helpers_1.repeat)(9, 30), true), (0, helpers_1.repeat)(10, 31), true), (0, helpers_1.repeat)(11, 30), true), (0, helpers_1.repeat)(12, 31), true), (0, helpers_1.repeat)(1, 7), true);
exports.M365MASK = M365MASK;
var M366MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (0, helpers_1.repeat)(1, 31), true), (0, helpers_1.repeat)(2, 29), true), (0, helpers_1.repeat)(3, 31), true), (0, helpers_1.repeat)(4, 30), true), (0, helpers_1.repeat)(5, 31), true), (0, helpers_1.repeat)(6, 30), true), (0, helpers_1.repeat)(7, 31), true), (0, helpers_1.repeat)(8, 31), true), (0, helpers_1.repeat)(9, 30), true), (0, helpers_1.repeat)(10, 31), true), (0, helpers_1.repeat)(11, 30), true), (0, helpers_1.repeat)(12, 31), true), (0, helpers_1.repeat)(1, 7), true);
exports.M366MASK = M366MASK;
var M28 = (0, helpers_1.range)(1, 29);
var M29 = (0, helpers_1.range)(1, 30);
var M30 = (0, helpers_1.range)(1, 31);
var M31 = (0, helpers_1.range)(1, 32);
var MDAY366MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], M31, true), M29, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
exports.MDAY366MASK = MDAY366MASK;
var MDAY365MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], M31, true), M28, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31, true), M30, true), M31, true), M30, true), M31, true), M31.slice(0, 7), true);
exports.MDAY365MASK = MDAY365MASK;
var NM28 = (0, helpers_1.range)(-28, 0);
var NM29 = (0, helpers_1.range)(-29, 0);
var NM30 = (0, helpers_1.range)(-30, 0);
var NM31 = (0, helpers_1.range)(-31, 0);
var NMDAY366MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], NM31, true), NM29, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
exports.NMDAY366MASK = NMDAY366MASK;
var NMDAY365MASK = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], NM31, true), NM28, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31, true), NM30, true), NM31, true), NM30, true), NM31, true), NM31.slice(0, 7), true);
exports.NMDAY365MASK = NMDAY365MASK;
var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
exports.M366RANGE = M366RANGE;
var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
exports.M365RANGE = M365RANGE;
var WDAYMASK = (function () {
    var wdaymask = [];
    for (var i = 0; i < 55; i++)
        wdaymask = wdaymask.concat((0, helpers_1.range)(7));
    return wdaymask;
})();
exports.WDAYMASK = WDAYMASK;
//# sourceMappingURL=masks.js.map