import {APIStatus} from './APIStatusEnum';

export class APIStatusDetail {
    dataID: number;
    configID: number;
    dateTime: Date;
    pingResponseMS: number;
    apiStatus: APIStatus;

    static mapMySQLResultsToAPIStatusDetail(val): APIStatusDetail {
        let newAPIStatusDetail = new APIStatusDetail();
        if (val) {
            newAPIStatusDetail.dataID = val.DTADataID;
            newAPIStatusDetail.configID = val.DTAConfigID;
            newAPIStatusDetail.dateTime = val.DTADateTime;
            newAPIStatusDetail.pingResponseMS = val.DTAPingResponseMS;
            newAPIStatusDetail.apiStatus = val.DTAStatus;

        } else {
            return null;
        }
        return newAPIStatusDetail;
    }
}