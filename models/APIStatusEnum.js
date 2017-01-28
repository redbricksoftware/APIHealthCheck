"use strict";
(function (APIStatus) {
    APIStatus[APIStatus["Up"] = 1] = "Up";
    APIStatus[APIStatus["Down"] = 2] = "Down";
    APIStatus[APIStatus["Degraded"] = 3] = "Degraded";
    APIStatus[APIStatus["Unknown"] = 99] = "Unknown";
})(exports.APIStatus || (exports.APIStatus = {}));
var APIStatus = exports.APIStatus;
