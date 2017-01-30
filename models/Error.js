"use strict";
var Error = (function () {
    function Error(field, errorMessage, errorType) {
        this.field = field;
        this.errorMessage = errorMessage;
        this.errorType = errorType;
    }
    return Error;
}());
exports.Error = Error;
(function (ErrorType) {
    ErrorType[ErrorType["Warning"] = 1] = "Warning";
    ErrorType[ErrorType["Error"] = 99] = "Error";
})(exports.ErrorType || (exports.ErrorType = {}));
var ErrorType = exports.ErrorType;
