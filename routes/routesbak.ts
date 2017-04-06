import {daHealthCheck} from "../mysql";
import {Config} from "../modelsv1/Config";
import {isNullOrUndefined} from "util";
import {StatusDetail} from "../modelsv1/StatusDetail";
import {StatusEnum} from "../modelsv1/StatusEnum";
import {StatusSummaryDaily} from "../modelsv1/StatusSummaryDaily";

module.exports = function (healthCheck: daHealthCheck) {
    var express = require('express');
    const publicRouter = express.Router();
    const authRouter = express.Router();

    publicRouter.get('/v2/HealthCheckManagement', function (req, res) {

        /*
         var tenant = sequelize.import('./modelsv1/Tenant2');
         tenant.sync({force:true}).then(function() {
         console.log('hurray!');
         return tenant.create({
         name: 'abc'
         });
         });


         User.sync({force: true}).then(function () {
         // Table created
         return User.create({
         firstName: 'Bryce',
         lastName: 'Hancock'
         });

         });
         */
        res.json({success: true});

    });

    publicRouter.get('/v2/test2', function (req, res) {

        /*
         User.findAll().then(function (user) {
         res.json(user);
         });
         */
        res.json({success: true});
    });


    authRouter.get('/v1/HealthCheckManagement', function (req, res) {
        healthCheck.getConfigByTenantID(1)
            .then(function (resp) {
                //console.log(resp);
                res.json(resp);
            })
            .catch(function (err) {
                console.log(err);
                res.json(err);
            });
    });

    authRouter.get('/v1/HealthCheckManagement/:id', function (req, res) {

        //console.log('Get Specific Health Check: ' + req.params.id);

        //TODO: implement token and get tenant id from token.
        healthCheck.getConfigByID(1, req.params.id)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

//TODO: post add new health checks
//Include urlEncodedParser to read req.body and parse to json.
    authRouter.post('/v1/HealthCheckManagement', function (req, res) {

        let config: Config = new Config;

        if ((!isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
            config.enabled = isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true' || req.body.enabled === true);
            config.maxResponseTimeMS = isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS;
            config.pollFrequencyInSeconds = isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds;
            config.name = req.body.name;
            config.uri = req.body.uri;
            config.tenantID = req.body.tenantID; //TODO: update tenant ID from JWT
        }

        healthCheck.addConfig(config)
            .then(function (resp: number) {
                config.configID = resp;
                res.json(config);
            })
            .catch(function (err: Object) {
                console.error(err);
                res.json(err);
            });
    });

//TODO: put update health check by id
    authRouter.put('/v1/HealthCheckManagement/:id', function (req, res) {

        let config: Config = new Config;

        if ((!isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
            config.enabled = isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true' || req.body.enabled === true);
            config.maxResponseTimeMS = Number(isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS);
            config.pollFrequencyInSeconds = Number(isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds);
            config.name = req.body.name;
            config.uri = req.body.uri;
            config.configID = Number(req.params.id);
            //TODO: update tenant ID from JWT
            config.tenantID = 1;
        }

        healthCheck.updateConfig(config)
            .then(function (resp: Object) {
                res.json(config);
            })
            .catch(function (err: Object) {
                console.error(err);
                res.json(err);
            });
    });

    authRouter.get('/v1/HealthCheckDetails', function (req, res) {
        healthCheck.getStatusDetailsByTenantID(1)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    authRouter.get('/v1/HealthCheckDetails/:id', function (req, res) {
        let configID = Number(req.params.id);

        healthCheck.getStatusDetailsByID(configID)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    authRouter.post('/v1/HealthCheckDetails', function (req, res) {

        let statusDetail: StatusDetail = new StatusDetail;

        statusDetail.configID = Number(req.body.configID);
        statusDetail.dateTime = new Date(req.body.dateTime);
        statusDetail.pingResponseMS = Number(req.body.pingResponseMS);
        if (!req.body.status) {
            statusDetail.status = StatusEnum.Unknown;
        } else {
            switch (req.body.status.toString().toLowerCase()) {
                case 'up':
                    statusDetail.status = StatusEnum.Up;
                    break;
                case '1':
                    statusDetail.status = StatusEnum.Up;
                    break;
                case 'down':
                    statusDetail.status = StatusEnum.Down;
                    break;
                case '2':
                    statusDetail.status = StatusEnum.Down;
                    break;
                case 'degraded':
                    statusDetail.status = StatusEnum.Degraded;
                    break;
                case '3':
                    statusDetail.status = StatusEnum.Degraded;
                    break;
                default:
                    statusDetail.status = StatusEnum.Unknown;
                    break;
            }
        }

        healthCheck.addStatusDetail(statusDetail)
            .then(function (resp: number) {
                statusDetail.dataID = resp;
                res.json(statusDetail);
            })
            .catch(function (err: Object) {
                console.error(err);
                res.json(err);
            });

    });

    authRouter.get('/v1/HealthCheckSummaryDaily/', function (req, res) {
        healthCheck.getStatusSummaryByTenantID(1)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    authRouter.post('/v1/HealthCheckSummaryDaily/:id', function (req, res) {

        let statusSummaryDaily: StatusSummaryDaily = new StatusSummaryDaily;

        statusSummaryDaily.configID = Number(req.params.id);
        statusSummaryDaily.date = new Date(req.body.date);
        statusSummaryDaily.averagePingResponseMS = Number(req.body.averagePingResponseMS);
        statusSummaryDaily.uptimePercent = Number(req.body.uptimePercent);
        if (!req.body.status) {
            statusSummaryDaily.status = StatusEnum.Unknown;
        } else {
            switch (req.body.status.toString().toLowerCase()) {
                case 'up':
                    statusSummaryDaily.status = StatusEnum.Up;
                    break;
                case '1':
                    statusSummaryDaily.status = StatusEnum.Up;
                    break;
                case 'down':
                    statusSummaryDaily.status = StatusEnum.Down;
                    break;
                case '2':
                    statusSummaryDaily.status = StatusEnum.Down;
                    break;
                case 'degraded':
                    statusSummaryDaily.status = StatusEnum.Degraded;
                    break;
                case '3':
                    statusSummaryDaily.status = StatusEnum.Degraded;
                    break;
                default:
                    statusSummaryDaily.status = StatusEnum.Unknown;
                    break;
            }
        }

        healthCheck.addStatusSummary(statusSummaryDaily)
            .then(function (resp: number) {
                statusSummaryDaily.summaryID = resp;
                res.json(statusSummaryDaily);
            })
            .catch(function (err: Object) {
                console.error(err);
                res.json(err);
            });

    });

    publicRouter.get('/v1/HealthCheckDetails', function (req, res) {
        healthCheck.getStatusDetailsByTenantID(1)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    return publicRouter;
};
