"use strict";
var util_1 = require("util");
var Error_1 = require("./Error");
var util_2 = require("util");
var util_3 = require("util");
var StatusSummaryDaily = (function () {
    function StatusSummaryDaily() {
    }
    StatusSummaryDaily.mapMySQLResultsToStatusSummaryDaily = function (val) {
        var newStatusSummaryDaily = new StatusSummaryDaily();
        if (val) {
            newStatusSummaryDaily.summaryID = Number(val.SSDStatusSummaryDailyID);
            newStatusSummaryDaily.configID = Number(val.SSDConfigID);
            newStatusSummaryDaily.date = val.SSDDate;
            newStatusSummaryDaily.averagePingResponseMS = val.SSDAveragePingResponseMS;
            newStatusSummaryDaily.status = val.SSDStatus;
            newStatusSummaryDaily.uptimePercent = val.SSDUptimePercent;
        }
        else {
            return null;
        }
        return newStatusSummaryDaily;
    };
    StatusSummaryDaily.prototype.validate = function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            var errors = new Array();
            if (util_1.isNullOrUndefined(me.configID)) {
                errors.push(new Error_1.Error('configID', 'configID is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.date)) {
                errors.push(new Error_1.Error('date', 'date is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_2.isDate(me.date)) {
                errors.push(new Error_1.Error('date', 'date is not a valid date.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.averagePingResponseMS)) {
                errors.push(new Error_1.Error('averagePingResponseMS', 'averagePingResponseMS is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_3.isNumber(me.averagePingResponseMS)) {
                errors.push(new Error_1.Error('averagePingResponseMS', 'averagePingResponseMS is not a valid number.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.status)) {
                errors.push(new Error_1.Error('status', 'status is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.uptimePercent)) {
                errors.push(new Error_1.Error('uptimePercent', 'uptimePercent is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_3.isNumber(me.uptimePercent)) {
                errors.push(new Error_1.Error('uptimePercent', 'uptimePercent is not a valid number.', Error_1.ErrorType.Error));
            }
            if (errors.length > 0) {
                reject(errors);
            }
            else {
                resolve(true);
            }
        });
    };
    return StatusSummaryDaily;
}());
exports.StatusSummaryDaily = StatusSummaryDaily;
