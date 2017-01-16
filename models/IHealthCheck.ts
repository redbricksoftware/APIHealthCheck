export interface IHealthCheckSummary {
    id: string;
    name: string;
    uri: string;
    currentStatus?: string;
    responseTimeMS?: number;
    uptime24h?: number;
    icon?: string;
    rowStatus?: string;
}

export interface IHealthCheckDetailArray {
    date: string;
    order: number;
    status: string;
    averageResponseTimeMS: number;
    icon: string;
}

export interface IHealthCheckDetail {
    id: string;
    name: string;
    uri: string;
    statusHistory: IHealthCheckDetailArray[];
}
