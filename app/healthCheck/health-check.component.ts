import {Component, Input} from '@angular/core';
import {HealthCheckSummary} from './health-check-summary';
import {HealthCheckDetail} from "./health-check-detail";

@Component({
    selector: 'health-check',
    templateUrl: 'app/healthCheck/health-check.view.html'
})

export class HealthCheckComponent {
    @Input()
    healthCheckSummary: HealthCheckSummary;
    @Input()
    selectedHealthCheckDetail: HealthCheckDetail;
}