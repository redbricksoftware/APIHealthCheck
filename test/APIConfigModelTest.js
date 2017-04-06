"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../modelsv1/Config");
var chai_1 = require("chai");
describe('APIConfig Class', function () {
    it('should be an object', function () {
        var config = new Config_1.Config();
        chai_1.expect(config).to.be.an('object');
    });
    it('should convert a mysql Object to Config Object', function () {
        var RowDataPacket = {
            CFGConfigID: 1,
            CFGTenantID: 2,
            CFGName: 'API2a',
            CFGURI: 'http://yahoo.com',
            CFGEnabled: true,
            CFGPollFrequencyInSeconds: 60,
            CFGMaxResponseTimeMS: 2000,
            CFGEmergencyContactGroupID: null
        };
        var config = Config_1.Config.mapMySQLResultsToConfig(RowDataPacket);
        chai_1.expect(config.configID).to.equal(1);
        chai_1.expect(config.tenantID).to.equal(2);
        chai_1.expect(config.name).to.equal('API2a');
        chai_1.expect(config.uri).to.equal('http://yahoo.com');
        chai_1.expect(config.enabled).to.equal(true);
        chai_1.expect(config.pollFrequencyInSeconds).to.equal(60);
        chai_1.expect(config.maxResponseTimeMS).to.equal(2000);
        chai_1.expect(config.emergencyContactGroupID).to.be.a('null');
    });
    it('should convert a mysql null Object to a blank APIConfig Object', function () {
        var RowDataPacket = null;
        var config = Config_1.Config.mapMySQLResultsToConfig(RowDataPacket);
        chai_1.expect(config).to.be.null;
    });
    var config = new Config_1.Config();
    config.validate()
        .then(function (resp) {
    })
        .catch(function (err) {
        it('should validate a configuration object', function () {
            chai_1.expect(err).to.be.an('array');
            chai_1.expect(err).to.deep.include.members([
                {
                    field: 'tenantID',
                    errorMessage: 'tenantID is a required field.',
                    errorType: 99
                },
                {
                    field: 'name',
                    errorMessage: 'name is a required field.',
                    errorType: 99
                },
                {
                    field: 'uri',
                    errorMessage: 'uri is a required field.',
                    errorType: 99
                },
                {
                    field: 'uri',
                    errorMessage: 'uri is not valid.',
                    errorType: 99
                },
                {
                    field: 'enabled',
                    errorMessage: 'enabled was not provided.',
                    errorType: 1
                },
                {
                    field: 'pollFrequencyInSeconds',
                    errorMessage: 'pollFrequencyInSeconds is a required field.',
                    errorType: 99
                },
                {
                    field: 'maxResponseTimeMS',
                    errorMessage: 'maxResponseTimeMS is a required field.',
                    errorType: 99
                }
            ]);
        });
    });
    config.configID = 1;
    config.tenantID = 2;
    config.name = 'API2a';
    config.uri = 'http://yahoo.com';
    config.enabled = true;
    config.pollFrequencyInSeconds = 60;
    config.maxResponseTimeMS = 2000;
    config.validate()
        .then(function (resp) {
        it('should be valid after setting the values correctly', function () {
            chai_1.expect(resp).to.equal(true);
        });
    })
        .catch(function (err) {
        it('should not call this', function () {
            chai_1.expect(false).to.equal(true);
        });
    });
});
