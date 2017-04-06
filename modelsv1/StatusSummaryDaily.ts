import {StatusEnum} from './StatusEnum';
import {isNullOrUndefined} from "util";
import {Error, ErrorType} from "./Error";
import {isDate} from "util";
import {isNumber} from "util";

export class StatusSummaryDaily {
    summaryID: number;
    configID: number;
    date: Date;
    averagePingResponseMS: number;
    status: StatusEnum;
    uptimePercent: number;


    validate(): Promise<Error[]> {
        let me = this;
        return new Promise(function (resolve, reject) {
            let errors: Error[] = new Array<Error>();

            if (isNullOrUndefined(me.configID)) {
                errors.push(new Error('configID', 'configID is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.date)) {
                errors.push(new Error('date', 'date is a required field.', ErrorType.Error));
            }

            if (!isDate(me.date)) {
                errors.push(new Error('date', 'date is not a valid date.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.averagePingResponseMS)) {
                errors.push(new Error('averagePingResponseMS', 'averagePingResponseMS is a required field.', ErrorType.Error));
            }

            if (!isNumber(me.averagePingResponseMS)) {
                errors.push(new Error('averagePingResponseMS', 'averagePingResponseMS is not a valid number.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.status)) {
                errors.push(new Error('status', 'status is a required field.', ErrorType.Error));
            }

            if (isNullOrUndefined(me.uptimePercent)) {
                errors.push(new Error('uptimePercent', 'uptimePercent is a required field.', ErrorType.Error));
            }

            if (!isNumber(me.uptimePercent)) {
                errors.push(new Error('uptimePercent', 'uptimePercent is not a valid number.', ErrorType.Error));
            }

            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(true);
            }
        });
    }
}