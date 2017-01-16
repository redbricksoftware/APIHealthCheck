import {IHealthCheckDetail, IHealthCheckDetailArray} from "../../models/IHealthCheck";


export class HealthCheckDetail implements IHealthCheckDetail {
    id: string;
    name: string;
    uri: string;
    statusHistory: HealthCheckDetailArray[];
}

export class HealthCheckDetailArray implements IHealthCheckDetailArray{
    date: string;
    order: number;
    status: string;
    averageResponseTimeMS: number;
    icon: string;
}