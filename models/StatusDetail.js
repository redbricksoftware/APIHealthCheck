"use strict";
var Error_1 = require('./Error');
var util_1 = require("util");
var util_2 = require("util");
var util_3 = require("util");
var StatusDetail = (function () {
    function StatusDetail() {
    }
    StatusDetail.prototype.validate = function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            var errors = new Array();
            if (util_1.isNullOrUndefined(me.configID)) {
                errors.push(new Error_1.Error('configID', 'configID is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.dateTime)) {
                errors.push(new Error_1.Error('dateTime', 'dateTime is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_2.isDate(me.dateTime)) {
                errors.push(new Error_1.Error('dateTime', 'dateTime is an invalid Date Time.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.pingResponseMS)) {
                errors.push(new Error_1.Error('pingResponseMS', 'pingResponseMS is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_3.isNumber(me.pingResponseMS)) {
                errors.push(new Error_1.Error('pingResponseMS', 'pingResponseMS is an invalid number.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.status)) {
                errors.push(new Error_1.Error('status', 'status is a required field.', Error_1.ErrorType.Error));
            }
            if (errors.length > 0) {
                reject(errors);
            }
            else {
                resolve(true);
            }
        });
    };
    return StatusDetail;
}());
exports.StatusDetail = StatusDetail;
