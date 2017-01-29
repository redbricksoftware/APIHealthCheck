import {Config} from '../models/Config';
import {expect} from 'chai';
import {isObject} from "util";
import {isNullOrUndefined} from "util";

describe('APIConfig Class', () => {
    it('should be an object', () => {
        let config = new Config();
        expect(config).to.be.an('object');
    });

    it('should convert a mysql Object to Config Object', () => {

        let RowDataPacket = {
            CFGConfigID: 1,
            CFGTenantID: 2,
            CFGName: 'API2a',
            CFGURI: 'http://yahoo.com',
            CFGEnabled: true,
            CFGPollFrequencyInSeconds: 60,
            CFGMaxResponseTimeMS: 2000,
            CFGEmergencyContactGroupID: null
        };

        let config = Config.mapMySQLResultsToConfig(RowDataPacket);

        expect(config.configID).to.equal(1);
        expect(config.tenantID).to.equal(2);
        expect(config.name).to.equal('API2a');
        expect(config.uri).to.equal('http://yahoo.com');
        expect(config.enabled).to.equal(true);
        expect(config.pollFrequencyInSeconds).to.equal(60);
        expect(config.maxResponseTimeMS).to.equal(2000);
        expect(config.emergencyContactGroupID).to.be.a('null');
    });

    it('should convert a mysql null Object to a blank APIConfig Object', () => {
        let RowDataPacket = null;
        let config = Config.mapMySQLResultsToConfig(RowDataPacket);

        expect(config).to.be.null;
    });

    let config: Config = new Config();

    config.validate()
        .then(function (resp) {

        })
        .catch(function (err) {
            it('should validate a configuration object', () => {
                expect(err).to.be.an('array');
                expect(err).to.deep.include.members([
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
    config.uri ='http://yahoo.com';
    config.enabled=true;
    config.pollFrequencyInSeconds= 60;
    config.maxResponseTimeMS= 2000;

    config.validate()
        .then(function(resp){
            it('should be valid after setting the values correctly', () =>{
                expect(resp).to.equal(true);
            });
        })
        .catch(function(err){
            it('should not call this', () =>{
                expect(false).to.equal(true);
            })
        });

});
