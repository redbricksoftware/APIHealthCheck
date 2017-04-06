"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error = (function () {
    function Error(field, errorMessage, errorType) {
        this.field = field;
        this.errorMessage = errorMessage;
        this.errorType = errorType;
    }
    return Error;
}());
exports.Error = Error;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["Warning"] = 1] = "Warning";
    ErrorType[ErrorType["Error"] = 99] = "Error";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
