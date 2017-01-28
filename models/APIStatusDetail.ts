import {APIStatus} from './APIStatusEnum';

export class APIStatusDetail {
    dataID: number;
    configID: number;
    dateTime: Date;
    pingResponseMS: number;
    apiStatus: APIStatus;
}