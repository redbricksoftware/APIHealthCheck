import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {HealthCheckSummary} from './health-check-summary';
import {HealthCheckDetail} from './health-check-detail';

@Injectable()
export class HealthCheckService {

    private healthCheckURI = 'http://localhost:3000/api/v1/';  // URL to web api

    constructor(private http: Http) {
    }

    getHealthCheckSummary(): Promise<HealthCheckSummary[]> {
        return this.http.get(this.healthCheckURI + 'HealthCheckSummary')
            .toPromise()
            .then(response => response.json().data as HealthCheckSummary[])
            .catch(this.handleError);
    }

    getHealthCheckDetail(): Promise<HealthCheckDetail[]> {
        return this.http.get(this.healthCheckURI + 'HealthCheckDetail')
            .toPromise()
            .then(response => response.json().data as HealthCheckDetail[])
            .catch(this.handleError);
    }


    getHealthCheckDetailByID(id: string): Promise<HealthCheckDetail> {
        return this.http.get(this.healthCheckURI + 'HealthCheckDetail/' + id)
            .toPromise()
            .then(response => response.json() as HealthCheckDetail)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        //console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
