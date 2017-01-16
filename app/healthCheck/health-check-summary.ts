import {IHealthCheckSummary} from "../../models/IHealthCheck";

export class HealthCheckSummary implements IHealthCheckSummary {

    id: string;
    name: string;
    uri: string;
    currentStatus: string;
    responseTimeMS: number;
    uptime24h: number;
    icon: string;
    rowStatus: string;

    public greet() {
        return "Hello, " + this.id;
    }
}
