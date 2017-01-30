import {EmergencyContactGroup} from './EmergencyContactGroup';
import {Error, ErrorType} from './Error';
import {isNumber} from "util";
import {isNullOrUndefined} from "util";
import {} from './Helpers';
import {Helpers} from "./Helpers";
import {isBoolean} from "util";

export class Config {
    configID: number;
    tenantID: number;
    name: string;
    uri: string;
    enabled: boolean;
    pollFrequencyInSeconds: number;
    maxResponseTimeMS: number;
    emergencyContactGroupID: number;

    static mapMySQLResultsToConfig(val): Config {
        let newConfig = new Config;
        if (val) {
            newConfig.configID = val.CFGConfigID;
            newConfig.tenantID = val.CFGTenantID;
            newConfig.name = val.CFGName;
            newConfig.uri = val.CFGURI;
            newConfig.enabled = (val.CFGEnabled === 'true' || val.CFGEnabled === 1 || val.CFGEnabled) ? true : false;
            newConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
            newConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
            newConfig.emergencyContactGroupID = val.CFGEmergencyContactGroupID;
        } else {
            return null;
        }
        return newConfig;
    }

    validate(): Promise<Error[]> {
        let me = this;
        return new Promise(function (resolve, reject) {
            let errors: Error[] = new Array<Error>();

            if (isNullOrUndefined(me.tenantID)) {
                errors.push(new Error('tenantID', 'tenantID is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.name)) {
                errors.push(new Error('name', 'name is a required field.', ErrorType.Error));
            }

            if(isNullOrUndefined(me.uri)){
                errors.push(new Error('uri', 'uri is a required field.', ErrorType.Error));
            }

            if(!Helpers.validateURL(me.uri)){
                errors.push(new Error('uri', 'uri is not valid.', ErrorType.Error));
            }

            if(isNullOrUndefined(me.enabled)){
                errors.push(new Error('enabled', 'enabled was not provided.', ErrorType.Warning));
            }

            if(!isNullOrUndefined(me.enabled)){
                if(!isBoolean(me.enabled)){
                    errors.push(new Error('enabled', 'enabled is not a boolean value.', ErrorType.Error));
                }
            }

            if(isNullOrUndefined(me.pollFrequencyInSeconds)){
                errors.push(new Error('pollFrequencyInSeconds', 'pollFrequencyInSeconds is a required field.', ErrorType.Error));
            }

            if(isNullOrUndefined(me.maxResponseTimeMS)){
                errors.push(new Error('maxResponseTimeMS', 'maxResponseTimeMS is a required field.', ErrorType.Error));
            }

            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(true);
            }
        });
    }

}
