"use strict";
var APIConfig_1 = require('../models/APIConfig');
var chai_1 = require('chai');
describe('APIConfig Class', function () {
    it('should be an object', function () {
        var apiConfig = new APIConfig_1.APIConfig();
        chai_1.expect(apiConfig).to.be.an('object');
    });
    it('should convert a mysql Object to APIConfig Object', function () {
        var RowDataPacket = {
            CFGConfigID: 1,
            CFGTenantID: 2,
            CFGName: 'API2a',
            CFGURI: 'http://yahoo.com',
            CFGEnabled: true,
            CFGPollFrequencyInSeconds: 60,
            CFGMaxResponseTimeMS: 2000,
            CFGEmergencyContactGroup: null
        };
        var apiConfig = APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(RowDataPacket);
        chai_1.expect(apiConfig.configID).to.equal(1);
        chai_1.expect(apiConfig.tenantID).to.equal(2);
        chai_1.expect(apiConfig.name).to.equal('API2a');
        chai_1.expect(apiConfig.uri).to.equal('http://yahoo.com');
        chai_1.expect(apiConfig.enabled).to.equal(true);
        chai_1.expect(apiConfig.pollFrequencyInSeconds).to.equal(60);
        chai_1.expect(apiConfig.maxResponseTimeMS).to.equal(2000);
        chai_1.expect(apiConfig.emergencyContactGroup).to.be.a('null');
    });
    it('should convert a mysql null Object to a blank APIConfig Object', function () {
        var RowDataPacket = null;
        var apiConfig = APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(RowDataPacket);
        chai_1.expect(apiConfig).to.be.null;
    });
});
