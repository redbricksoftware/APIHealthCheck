"use strict";
(function (APIStatus) {
    APIStatus[APIStatus["Up"] = 0] = "Up";
    APIStatus[APIStatus["Down"] = 1] = "Down";
    APIStatus[APIStatus["Degraded"] = 2] = "Degraded";
})(exports.APIStatus || (exports.APIStatus = {}));
var APIStatus = exports.APIStatus;
