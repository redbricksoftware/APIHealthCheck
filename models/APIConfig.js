"use strict";
var APIConfig = (function () {
    function APIConfig() {
    }
    APIConfig.mapMySQLResultsToAPIConfig = function (val) {
        var newAPIConfig = new APIConfig;
        if (val) {
            newAPIConfig.configID = val.CFGConfigID;
            newAPIConfig.tenantID = val.CFGTenantID;
            newAPIConfig.name = val.CFGName;
            newAPIConfig.uri = val.CFGURI;
            newAPIConfig.enabled = (val.CFGEnabled === 'true' || val.CFGEnabled === 1 || val.CFGEnabled) ? true : false;
            newAPIConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
            newAPIConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
            newAPIConfig.emergencyContactGroup = val.CFGEmergencyContactGroup;
        }
        else {
            return null;
        }
        return newAPIConfig;
    };
    return APIConfig;
}());
exports.APIConfig = APIConfig;
