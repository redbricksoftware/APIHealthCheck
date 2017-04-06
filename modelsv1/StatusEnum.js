"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["Up"] = 1] = "Up";
    StatusEnum[StatusEnum["Down"] = 2] = "Down";
    StatusEnum[StatusEnum["Degraded"] = 3] = "Degraded";
    StatusEnum[StatusEnum["Unknown"] = 99] = "Unknown";
})(StatusEnum = exports.StatusEnum || (exports.StatusEnum = {}));
