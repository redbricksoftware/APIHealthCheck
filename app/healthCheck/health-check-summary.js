"use strict";
var HealthCheckSummary = (function () {
    function HealthCheckSummary(HCS) {
        this.id = HCS.id;
        this.name = HCS.name;
        this.uri = HCS.uri;
        this.currentStatus = HCS.currentStatus;
        this.responseTimeMS = HCS.responseTimeMS;
        this.uptime24h = HCS.uptime24h;
        this.icon = HCS.icon;
        this.rowStatus = HCS.rowStatus;
    }
    HealthCheckSummary.prototype.greet = function () {
        return "Hello, " + this.id;
    };
    return HealthCheckSummary;
}());
exports.HealthCheckSummary = HealthCheckSummary;
//# sourceMappingURL=health-check-summary.js.map