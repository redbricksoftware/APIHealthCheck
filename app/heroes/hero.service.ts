import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Hero} from './hero';

@Injectable()
export class HeroService {

    //TODO: update for API url
    private heroesUrl = 'http://localhost:3000/api';  // URL to web api

    constructor(private http: Http) {
    }

    //Promise return
    getHeroes(): Promise<Hero[]> {
        return this.http.get(this.heroesUrl)
            .toPromise()
            //data = the property name of the api array return by the server.js api.
            .then(response => response.json().data as Hero[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    //Example non-promise return
    getStr(): String {
        return 'abcd';
    }

    /*
    getHeroesSlowly(): Promise<Hero[]> {

        return new Promise(resolve => {
            // Simulate server latency with 2 second delay
            setTimeout(() => resolve(this.getHeroes()), 2000)
        });
    }
    */
}