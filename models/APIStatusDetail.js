"use strict";
var APIStatusDetail = (function () {
    function APIStatusDetail() {
    }
    APIStatusDetail.mapMySQLResultsToAPIStatusDetail = function (val) {
        var newAPIStatusDetail = new APIStatusDetail();
        if (val) {
            newAPIStatusDetail.dataID = val.DTADataID;
            newAPIStatusDetail.configID = val.DTAConfigID;
            newAPIStatusDetail.dateTime = val.DTADateTime;
            newAPIStatusDetail.pingResponseMS = val.DTAPingResponseMS;
            newAPIStatusDetail.apiStatus = val.DTAStatus;
        }
        else {
            return null;
        }
        return newAPIStatusDetail;
    };
    return APIStatusDetail;
}());
exports.APIStatusDetail = APIStatusDetail;
