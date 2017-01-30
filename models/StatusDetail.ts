import {StatusEnum} from './StatusEnum';
import {Error, ErrorType} from './Error';
import {isNullOrUndefined} from "util";
import {isDate} from "util";
import {isNumber} from "util";

export class StatusDetail {
    dataID: number;
    configID: number;
    dateTime: Date;
    pingResponseMS: number;
    status: StatusEnum;

    static mapMySQLResultsToStatusDetail(val): StatusDetail {
        let newStatusDetail = new StatusDetail();
        if (val) {
            newStatusDetail.dataID = val.DTADataID;
            newStatusDetail.configID = val.DTAConfigID;
            newStatusDetail.dateTime = val.DTADateTime;
            newStatusDetail.pingResponseMS = val.DTAPingResponseMS;
            newStatusDetail.status = val.DTAStatus;

        } else {
            return null;
        }
        return newStatusDetail;
    }

    validate(): Promise<Error[]> {
        let me = this;
        return new Promise(function (resolve, reject) {
            let errors: Error[] = new Array<Error>();

            if (isNullOrUndefined(me.configID)) {
                errors.push(new Error('configID', 'configID is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.dateTime)) {
                errors.push(new Error('dateTime', 'dateTime is a required field.', ErrorType.Error));
            }

            if (!isDate(me.dateTime)) {
                errors.push(new Error('dateTime', 'dateTime is an invalid Date Time.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.pingResponseMS)) {
                errors.push(new Error('pingResponseMS', 'pingResponseMS is a required field.', ErrorType.Error));
            }

            if (!isNumber(me.pingResponseMS)) {
                errors.push(new Error('pingResponseMS', 'pingResponseMS is an invalid number.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.status)) {
                errors.push(new Error('status', 'status is a required field.', ErrorType.Error));
            }

            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(true);
            }
        });
    }
}