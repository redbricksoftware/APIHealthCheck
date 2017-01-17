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

    constructor(HCS?: HealthCheckSummary){
        this.id = HCS.id;
        this.name = HCS.name;
        this.uri = HCS.uri;
        this.currentStatus = HCS.currentStatus;
        this.responseTimeMS = HCS.responseTimeMS;
        this.uptime24h = HCS.uptime24h;
        this.icon = HCS.icon;
        this.rowStatus = HCS.rowStatus;
    }

    public greet() {
        return "Hello, " + this.id;
    }
}
