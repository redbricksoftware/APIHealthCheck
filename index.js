"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var mysql_1 = require('./mysql');
var Config_1 = require("./models/Config");
var util_1 = require("util");
var StatusDetail_1 = require("./models/StatusDetail");
var StatusEnum_1 = require('./models/StatusEnum');
var StatusSummaryDaily_1 = require("./models/StatusSummaryDaily");
var jwt = require("express-jwt");
var acctDetails = require('./acctDetails.json');
var jwtCheck = jwt({
    secret: acctDetails.auth0Secret,
    audience: acctDetails.auth0ClientID
});
var healthCheck = new mysql_1.daHealthCheck();
var port = process.env.PORT || 3000;
var deploymentType = process.env.NODE_ENV || 'development';
var app = express();
var publicRouter = express.Router();
var authRouter = express.Router();
app.use(bodyParser.json({ type: "application/json" }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    //allow origin.
    if (req.headers.origin) {
        var origin = req.headers.origin;
        if (origin.indexOf('localhost') > 0) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    // Pass to next layer of middleware
    next();
});
//TODO: Add some auth
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
    var config = new Config_1.Config;
    if ((!util_1.isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!util_1.isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        config.enabled = util_1.isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true' || req.body.enabled === true);
        config.maxResponseTimeMS = util_1.isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS;
        config.pollFrequencyInSeconds = util_1.isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds;
        config.name = req.body.name;
        config.uri = req.body.uri;
        config.tenantID = req.body.tenantID; //TODO: update tenant ID from JWT
    }
    healthCheck.addConfig(config)
        .then(function (resp) {
        config.configID = resp;
        res.json(config);
    })
        .catch(function (err) {
        console.error(err);
        res.json(err);
    });
});
//TODO: put update health check by id
authRouter.put('/v1/HealthCheckManagement/:id', function (req, res) {
    var config = new Config_1.Config;
    if ((!util_1.isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!util_1.isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        config.enabled = util_1.isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true' || req.body.enabled === true);
        config.maxResponseTimeMS = Number(util_1.isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS);
        config.pollFrequencyInSeconds = Number(util_1.isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds);
        config.name = req.body.name;
        config.uri = req.body.uri;
        config.configID = Number(req.params.id);
        //TODO: update tenant ID from JWT
        config.tenantID = 1;
    }
    healthCheck.updateConfig(config)
        .then(function (resp) {
        res.json(config);
    })
        .catch(function (err) {
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
    var configID = Number(req.params.id);
    healthCheck.getStatusDetailsByID(configID)
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
authRouter.post('/v1/HealthCheckDetails', function (req, res) {
    var statusDetail = new StatusDetail_1.StatusDetail;
    statusDetail.configID = Number(req.body.configID);
    statusDetail.dateTime = new Date(req.body.dateTime);
    statusDetail.pingResponseMS = Number(req.body.pingResponseMS);
    if (!req.body.status) {
        statusDetail.status = StatusEnum_1.StatusEnum.Unknown;
    }
    else {
        switch (req.body.status.toString().toLowerCase()) {
            case 'up':
                statusDetail.status = StatusEnum_1.StatusEnum.Up;
                break;
            case '1':
                statusDetail.status = StatusEnum_1.StatusEnum.Up;
                break;
            case 'down':
                statusDetail.status = StatusEnum_1.StatusEnum.Down;
                break;
            case '2':
                statusDetail.status = StatusEnum_1.StatusEnum.Down;
                break;
            case 'degraded':
                statusDetail.status = StatusEnum_1.StatusEnum.Degraded;
                break;
            case '3':
                statusDetail.status = StatusEnum_1.StatusEnum.Degraded;
                break;
            default:
                statusDetail.status = StatusEnum_1.StatusEnum.Unknown;
                break;
        }
    }
    healthCheck.addStatusDetail(statusDetail)
        .then(function (resp) {
        statusDetail.dataID = resp;
        res.json(statusDetail);
    })
        .catch(function (err) {
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
    var statusSummaryDaily = new StatusSummaryDaily_1.StatusSummaryDaily;
    statusSummaryDaily.configID = Number(req.params.id);
    statusSummaryDaily.date = new Date(req.body.date);
    statusSummaryDaily.averagePingResponseMS = Number(req.body.averagePingResponseMS);
    statusSummaryDaily.uptimePercent = Number(req.body.uptimePercent);
    if (!req.body.status) {
        statusSummaryDaily.status = StatusEnum_1.StatusEnum.Unknown;
    }
    else {
        switch (req.body.status.toString().toLowerCase()) {
            case 'up':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Up;
                break;
            case '1':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Up;
                break;
            case 'down':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Down;
                break;
            case '2':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Down;
                break;
            case 'degraded':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Degraded;
                break;
            case '3':
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Degraded;
                break;
            default:
                statusSummaryDaily.status = StatusEnum_1.StatusEnum.Unknown;
                break;
        }
    }
    healthCheck.addStatusSummary(statusSummaryDaily)
        .then(function (resp) {
        statusSummaryDaily.summaryID = resp;
        res.json(statusSummaryDaily);
    })
        .catch(function (err) {
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
app.use('/api', jwtCheck);
app.use('/api', authRouter);
app.use('/public', publicRouter);
/*
 app.get('/', function (req, res) {
 res.send('Hello World!')
 });
 */
app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = app;
