import {Component} from '@angular/core';
import {OnInit} from '@angular/core';

import {Hero} from './heroes/hero';
import {HeroDetailComponent} from './heroes/hero-detail.component';
import {HeroService} from './heroes/hero.service';

//CDN Service
import {HealthCheckSummary} from './healthCheck/health-check-summary';
import {HealthCheckDetail} from './healthCheck/health-check-detail';
import {HealthCheckComponent} from './healthCheck/health-check.component';
import {HealthCheckService} from './healthCheck/health-check.service';

@Component({
    selector: 'APIHealthCheck',
    templateUrl: 'app/app.view.html',
    styleUrls: ['app/app.styles.css'],
    providers: [HeroService, HealthCheckService]
})
export class AppComponent implements OnInit {
    constructor(private heroService: HeroService, private healthCheckService: HealthCheckService) {
    }

    ngOnInit(): void {
        //this.getHeroes();
        this.getHealthCheckSummary();
        this.getHealthCheckDetail();
    }

    healthCheckSummary: HealthCheckSummary;

    selectHealthSummary(summary: HealthCheckSummary): void {
        this.healthCheckService.getHealthCheckDetailByID(summary.id)
            .then(data => {

                this.selectedHealthCheckDetail = data;
                if (this.selectedHealthCheckDetail.statusHistory) {
                    this.setHealthCheckDetailStatus();
                }
            })
            .catch((ex) => {
                //Example console.log
                console.log('Error fetching summary data:', ex);
            });
        //this.healthCheckSummary = summary;
    }

    getHealthCheckSummary(): void {
        this.healthCheckService.getHealthCheckSummary()
            .then(data => {
                this.healthCheckSummarys = data;
                this.setHealthCheckClass();
            })
            .catch((ex) => {
                //Example console.log
                console.log('Error fetching summary data:', ex);
            });
    }

    setHealthCheckClass(): void {

        let listHCS: HealthCheckSummary[] = [];

        for (let i = 0; i < this.healthCheckSummarys.length; i++) {

            listHCS[i] = new HealthCheckSummary(this.healthCheckSummarys[i]);

            switch (this.healthCheckSummarys[i].currentStatus) {
                case 'operational':
                    this.healthCheckSummarys[i].icon = 'images/success.png';
                    this.healthCheckSummarys[i].rowStatus = 'success';
                    break;
                case 'degraded':
                    this.healthCheckSummarys[i].icon = 'images/warning.png';
                    this.healthCheckSummarys[i].rowStatus = 'warning';
                    break;
                case 'unknown':
                    this.healthCheckSummarys[i].icon = 'images/info.png';
                    this.healthCheckSummarys[i].rowStatus = 'info';
                    break;
                default:
                    this.healthCheckSummarys[i].icon = 'images/error.png';
                    this.healthCheckSummarys[i].rowStatus = 'danger';
                    break;
            }

        }

        console.log(listHCS[1].greet());
    }

    setHealthCheckDetailStatus(): void {
        for (let i = 0; i < this.selectedHealthCheckDetail.statusHistory.length; i++) {
            switch (this.selectedHealthCheckDetail.statusHistory[i].status) {
                case 'operational':
                    this.selectedHealthCheckDetail.statusHistory[i].icon = 'images/success.png';
                    break;
                case 'degraded':
                    this.selectedHealthCheckDetail.statusHistory[i].icon = 'images/warning.png';
                    break;
                case 'unknown':
                    this.selectedHealthCheckDetail.statusHistory[i].icon = 'images/info.png';
                    break;
                default:
                    this.selectedHealthCheckDetail.statusHistory[i].icon = 'images/error.png';
                    break;
            }
        }
    }

    getHealthCheckDetail(): void {
        this.healthCheckService.getHealthCheckDetail()
            .then(data => {
                //console.log('detail data: ');
                //console.log(data);
                this.healthCheckDetails = data
            })
            .catch((ex) => {
                //Example console.log
                console.log('Error fetching Health Check Detail data:', ex);
            });
    }

    getHeroes(): void {

        //async call:
        this.heroService.getHeroes()
            .then(heroes => this.heroes = heroes)
            .catch((ex) => {
                //example console.error
                console.error('Error fetching heroes:', ex);
            });
        //sync call:
        var abcd = this.heroService.getStr();

        /*
         //slow async:
         this.heroService.getHeroesSlowly()
         .then(heroes => this.slowHeroes = heroes)
         .catch(ex => console.log('Error hero service slow: ' + ex));
         */
    }

    title = 'Tour of Heroes';

    healthCheckDetails: HealthCheckDetail[];
    healthCheckSummarys: HealthCheckSummary[];

    selectedHealthCheckDetail: HealthCheckDetail;


    heroes: Hero[];
    slowHeroes: Hero[];
    selectedHero: Hero;

    onSelect(hero: Hero): void {
        this.selectedHero = hero;
    }

}
