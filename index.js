"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var mysql_1 = require('./mysql');
var APIConfig_1 = require("./models/APIConfig");
var util_1 = require("util");
var APIStatusDetail_1 = require("./models/APIStatusDetail");
var APIStatusEnum_1 = require('./models/APIStatusEnum');
var healthCheck = new mysql_1.daHealthCheck();
var port = process.env.PORT || 3000;
var deploymentType = process.env.NODE_ENV || 'development';
var app = express();
var router = express.Router();
app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
//TODO: Add some auth
// create application/x-www-form-urlencoded parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
router.get('/v1/HealthCheckManagement', function (req, res) {
    healthCheck.getAPIConfigAll()
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
router.get('/v1/HealthCheckManagement/:id', function (req, res) {
    //console.log('Get Specific Health Check: ' + req.params.id);
    //TODO: implement token and get tenant id from token.
    healthCheck.getAPIConfigByID(1, req.params.id)
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
//TODO: post add new health checks
//Include urlEncodedParser to read req.body and parse to json.
router.post('/v1/HealthCheckManagement', urlEncodedParser, function (req, res) {
    var apiConfig = new APIConfig_1.APIConfig;
    if ((!util_1.isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!util_1.isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        apiConfig.enabled = util_1.isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true');
        apiConfig.maxResponseTimeMS = util_1.isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS;
        apiConfig.pollFrequencyInSeconds = util_1.isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds;
        apiConfig.name = req.body.name;
        apiConfig.uri = req.body.uri;
        apiConfig.tenantID = req.body.tenantID; //TODO: update tenant ID from JWT
    }
    healthCheck.addAPIConfig(apiConfig)
        .then(function (resp) {
        apiConfig.configID = resp;
        res.json(apiConfig);
    })
        .catch(function (err) {
        console.error(err);
        res.json(err);
    });
});
//TODO: put update health check by id
router.put('/v1/HealthCheckManagement/:id', urlEncodedParser, function (req, res) {
    console.log(req.body);
    console.log(req.params.id);
    var apiConfig = new APIConfig_1.APIConfig;
    if ((!util_1.isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!util_1.isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        apiConfig.enabled = util_1.isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true');
        apiConfig.maxResponseTimeMS = Number(util_1.isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS);
        apiConfig.pollFrequencyInSeconds = Number(util_1.isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds);
        apiConfig.name = req.body.name;
        apiConfig.uri = req.body.uri;
        apiConfig.configID = Number(req.params.id);
        //TODO: update tenant ID from JWT
        apiConfig.tenantID = 1;
    }
    healthCheck.updateAPIConfig(apiConfig)
        .then(function (resp) {
        res.json(apiConfig);
    })
        .catch(function (err) {
        console.error(err);
        res.json(err);
    });
});
/*
 //Delete not allowed
 router.delete('/v1/HealthCheckManagement/:id', function (req, res) {
 console.log('Delete Health Check: ' + req.params.id);
 res.json({'unfound': 'abc'});
 });
 */
router.get('/v1/HealthCheckDetails', function (req, res) {
    healthCheck.getAPIStatusDetailsByTenantID(1)
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
router.post('/v1/HealthCheckDetails/', urlEncodedParser, function (req, res) {
    var apiStatusDetail = new APIStatusDetail_1.APIStatusDetail;
    //newAPIStatusDetail.dataID = req.body..DTADataID;
    apiStatusDetail.configID = Number(req.body.configID);
    apiStatusDetail.dateTime = new Date(req.body.dateTime);
    apiStatusDetail.pingResponseMS = Number(req.body.pingResponseMS);
    switch (req.body.apiStatus.toString().toLowerCase()) {
        case 'up':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Up;
            break;
        case '1':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Up;
            break;
        case 'down':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Down;
            break;
        case '2':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Down;
            break;
        case 'degraded':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Degraded;
            break;
        case '3':
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Degraded;
            break;
        default:
            apiStatusDetail.apiStatus = APIStatusEnum_1.APIStatus.Unknown;
            break;
    }
    healthCheck.addAPIData(apiStatusDetail)
        .then(function (resp) {
        apiStatusDetail.dataID = resp;
        res.json(apiStatusDetail);
    })
        .catch(function (err) {
        console.error(err);
        res.json(err);
    });
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = app;
