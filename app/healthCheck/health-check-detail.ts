export class HealthCheckDetail {
    id: string;
    name: string;
    uri: string;
    statusHistory: HealthCheckDetailArray[];
}

export class HealthCheckDetailArray {
    date: string;
    order: number;
    status: string;
    averageResponseTimeMS: number;
    icon: string;
}