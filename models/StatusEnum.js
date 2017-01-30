"use strict";
(function (StatusEnum) {
    StatusEnum[StatusEnum["Up"] = 1] = "Up";
    StatusEnum[StatusEnum["Down"] = 2] = "Down";
    StatusEnum[StatusEnum["Degraded"] = 3] = "Degraded";
    StatusEnum[StatusEnum["Unknown"] = 99] = "Unknown";
})(exports.StatusEnum || (exports.StatusEnum = {}));
var StatusEnum = exports.StatusEnum;
