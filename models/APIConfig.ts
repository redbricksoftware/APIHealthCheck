import {EmergencyContactGroup} from './EmergencyContactGroup';

export class APIConfig {
    configID: number;
    tenantID: number;
    name: string;
    uri: string;
    enabled: boolean;
    pollFrequencyInSeconds: number;
    maxResponseTimeMS: number;
    emergencyContactGroup: number;

    static mapMySQLResultsToAPIConfig(val){
        let newAPIConfig = new APIConfig;
        newAPIConfig.configID = val.CFGConfigID;
        newAPIConfig.tenantID = val.CFGTenantID;
        newAPIConfig.name = val.CFGName;
        newAPIConfig.uri = val.CFGURI;
        newAPIConfig.enabled = val.CFGEnabled;
        newAPIConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
        newAPIConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
        newAPIConfig.emergencyContactGroup = val.CFGEmergencyContactGroup;

        return newAPIConfig;
    }

}