"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var hero_service_1 = require('./heroes/hero.service');
var health_check_service_1 = require('./healthCheck/health-check.service');
var AppComponent = (function () {
    function AppComponent(heroService, healthCheckService) {
        this.heroService = heroService;
        this.healthCheckService = healthCheckService;
        this.title = 'Tour of Heroes';
    }
    AppComponent.prototype.ngOnInit = function () {
        //this.getHeroes();
        this.getHealthCheckSummary();
        this.getHealthCheckDetail();
    };
    AppComponent.prototype.selectHealthSummary = function (summary) {
        var _this = this;
        this.healthCheckService.getHealthCheckDetailByID(summary.id)
            .then(function (data) {
            _this.selectedHealthCheckDetail = data;
            if (_this.selectedHealthCheckDetail.statusHistory) {
                _this.setHealthCheckDetailStatus();
            }
        })
            .catch(function (ex) {
            //Example console.log
            console.log('Error fetching summary data:', ex);
        });
        //this.healthCheckSummary = summary;
    };
    AppComponent.prototype.getHealthCheckSummary = function () {
        var _this = this;
        this.healthCheckService.getHealthCheckSummary()
            .then(function (data) {
            console.log('summary data: ');
            console.log(data);
            _this.healthCheckSummarys = data;
            _this.setHealthCheckClass();
        })
            .catch(function (ex) {
            //Example console.log
            console.log('Error fetching summary data:', ex);
        });
    };
    AppComponent.prototype.setHealthCheckClass = function () {
        for (var i = 0; i < this.healthCheckSummarys.length; i++) {
            console.log(this.healthCheckSummarys[i].currentStatus);
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
    };
    AppComponent.prototype.setHealthCheckDetailStatus = function () {
        for (var i = 0; i < this.selectedHealthCheckDetail.statusHistory.length; i++) {
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
    };
    AppComponent.prototype.getHealthCheckDetail = function () {
        var _this = this;
        this.healthCheckService.getHealthCheckDetail()
            .then(function (data) {
            console.log('detail data: ');
            console.log(data);
            _this.healthCheckDetails = data;
        })
            .catch(function (ex) {
            //Example console.log
            //console.log('Error fetching CDN data:', ex);
        });
    };
    AppComponent.prototype.getHeroes = function () {
        var _this = this;
        //async call:
        this.heroService.getHeroes()
            .then(function (heroes) { return _this.heroes = heroes; })
            .catch(function (ex) {
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
    };
    AppComponent.prototype.onSelect = function (hero) {
        this.selectedHero = hero;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'APIHealthCheck',
            templateUrl: 'app/app.view.html',
            styleUrls: ['app/app.styles.css'],
            providers: [hero_service_1.HeroService, health_check_service_1.HealthCheckService]
        }), 
        __metadata('design:paramtypes', [hero_service_1.HeroService, health_check_service_1.HealthCheckService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map