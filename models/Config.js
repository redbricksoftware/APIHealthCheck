"use strict";
var Error_1 = require('./Error');
var util_1 = require("util");
var Helpers_1 = require("./Helpers");
var util_2 = require("util");
var Config = (function () {
    function Config() {
    }
    Config.mapMySQLResultsToConfig = function (val) {
        var newConfig = new Config;
        if (val) {
            newConfig.configID = val.CFGConfigID;
            newConfig.tenantID = val.CFGTenantID;
            newConfig.name = val.CFGName;
            newConfig.uri = val.CFGURI;
            newConfig.enabled = (val.CFGEnabled === 'true' || val.CFGEnabled === 1 || val.CFGEnabled) ? true : false;
            newConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
            newConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
            newConfig.emergencyContactGroupID = val.CFGEmergencyContactGroupID;
        }
        else {
            return null;
        }
        return newConfig;
    };
    Config.prototype.validate = function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            var errors = new Array();
            if (util_1.isNullOrUndefined(me.tenantID)) {
                errors.push(new Error_1.Error('tenantID', 'tenantID is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.name)) {
                errors.push(new Error_1.Error('name', 'name is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.uri)) {
                errors.push(new Error_1.Error('uri', 'uri is a required field.', Error_1.ErrorType.Error));
            }
            if (!Helpers_1.Helpers.validateURL(me.uri)) {
                errors.push(new Error_1.Error('uri', 'uri is not valid.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.enabled)) {
                errors.push(new Error_1.Error('enabled', 'enabled was not provided.', Error_1.ErrorType.Warning));
            }
            if (!util_1.isNullOrUndefined(me.enabled)) {
                if (!util_2.isBoolean(me.enabled)) {
                    errors.push(new Error_1.Error('enabled', 'enabled is not a boolean value.', Error_1.ErrorType.Error));
                }
            }
            if (util_1.isNullOrUndefined(me.pollFrequencyInSeconds)) {
                errors.push(new Error_1.Error('pollFrequencyInSeconds', 'pollFrequencyInSeconds is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.maxResponseTimeMS)) {
                errors.push(new Error_1.Error('maxResponseTimeMS', 'maxResponseTimeMS is a required field.', Error_1.ErrorType.Error));
            }
            if (errors.length > 0) {
                reject(errors);
            }
            else {
                resolve(true);
            }
        });
    };
    return Config;
}());
exports.Config = Config;
