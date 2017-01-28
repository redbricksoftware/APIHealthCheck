"use strict";
var APIConfig = (function () {
    function APIConfig() {
    }
    APIConfig.mapMySQLResultsToAPIConfig = function (val) {
        var newAPIConfig = new APIConfig;
        newAPIConfig.configID = val.CFGConfigID;
        newAPIConfig.tenantID = val.CFGTenantID;
        newAPIConfig.name = val.CFGName;
        newAPIConfig.uri = val.CFGURI;
        newAPIConfig.enabled = val.CFGEnabled;
        newAPIConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
        newAPIConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
        newAPIConfig.emergencyContactGroup = val.CFGEmergencyContactGroup;
        return newAPIConfig;
    };
    return APIConfig;
}());
exports.APIConfig = APIConfig;
