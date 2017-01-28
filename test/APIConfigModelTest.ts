import {APIConfig} from '../models/APIConfig';
import {expect} from 'chai';
import {isObject} from "util";
import {isNullOrUndefined} from "util";

describe('APIConfig Class', () => {
    it('should be an object', () => {
        let apiConfig = new APIConfig();
        expect(apiConfig).to.be.an('object');
    });

    it('should convert a mysql Object to APIConfig Object', () => {

        let RowDataPacket = {
            CFGConfigID: 1,
            CFGTenantID: 2,
            CFGName: 'API2a',
            CFGURI: 'http://yahoo.com',
            CFGEnabled: true,
            CFGPollFrequencyInSeconds: 60,
            CFGMaxResponseTimeMS: 2000,
            CFGEmergencyContactGroup: null
        };

        let apiConfig = APIConfig.mapMySQLResultsToAPIConfig(RowDataPacket);

        expect(apiConfig.configID).to.equal(1);
        expect(apiConfig.tenantID).to.equal(2);
        expect(apiConfig.name).to.equal('API2a');
        expect(apiConfig.uri).to.equal('http://yahoo.com');
        expect(apiConfig.enabled).to.equal(true);
        expect(apiConfig.pollFrequencyInSeconds).to.equal(60);
        expect(apiConfig.maxResponseTimeMS).to.equal(2000);
        expect(apiConfig.emergencyContactGroup).to.be.a('null');
    });

    it('should convert a mysql null Object to a blank APIConfig Object', () => {
        let RowDataPacket = null;
        let apiConfig = APIConfig.mapMySQLResultsToAPIConfig(RowDataPacket);

        expect(apiConfig).to.be.null;
    });
});
