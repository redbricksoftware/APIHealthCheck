import express = require('express');
import path = require('path');
import logger = require('morgan');
import bodyParser = require('body-parser');
import {daHealthCheck} from './mysql';
import {APIConfig} from "./models/APIConfig";
import {isNullOrUndefined} from "util";
import {APIStatusDetail} from "./models/APIStatusDetail";
import {APIStatus} from './models/APIStatusEnum';

const healthCheck = new daHealthCheck();

const port = process.env.PORT || 3000;
const deploymentType = process.env.NODE_ENV || 'development';

let app = express();
let router = express.Router();

app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
let urlEncodedParser = bodyParser.urlencoded({extended: false})


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

    let apiConfig: APIConfig = new APIConfig;

    if ((!isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        apiConfig.enabled = isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true');
        apiConfig.maxResponseTimeMS = isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS;
        apiConfig.pollFrequencyInSeconds = isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds;
        apiConfig.name = req.body.name;
        apiConfig.uri = req.body.uri;
        apiConfig.tenantID = req.body.tenantID; //TODO: update tenant ID from JWT
    }

    healthCheck.addAPIConfig(apiConfig)
        .then(function (resp: number) {
            apiConfig.configID = resp;
            res.json(apiConfig);
        })
        .catch(function (err: Object) {
            console.error(err);
            res.json(err);
        });
});

//TODO: put update health check by id
router.put('/v1/HealthCheckManagement/:id', urlEncodedParser, function (req, res) {

    console.log(req.body);
    console.log(req.params.id);
    let apiConfig: APIConfig = new APIConfig;

    if ((!isNullOrUndefined(req.body.name) && req.body.name.toString().trim() != '') && (!isNullOrUndefined(req.body.uri) && req.body.uri.toString().trim() != '')) {
        apiConfig.enabled = isNullOrUndefined(req.body.enabled) ? true : (req.body.enabled === 'true');
        apiConfig.maxResponseTimeMS = Number(isNullOrUndefined(req.body.maxResponseTimeMS) ? 1000 : req.body.maxResponseTimeMS);
        apiConfig.pollFrequencyInSeconds = Number(isNullOrUndefined(req.body.pollFrequencyInSeconds) ? 15 * 60 : req.body.pollFrequencyInSeconds);
        apiConfig.name = req.body.name;
        apiConfig.uri = req.body.uri;
        apiConfig.configID = Number(req.params.id);
        //TODO: update tenant ID from JWT
        apiConfig.tenantID = 1;
    }

    healthCheck.updateAPIConfig(apiConfig)
        .then(function (resp: Object) {
            res.json(apiConfig);
        })
        .catch(function (err: Object) {
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

    let apiStatusDetail: APIStatusDetail = new APIStatusDetail;

    //newAPIStatusDetail.dataID = req.body..DTADataID;
    apiStatusDetail.configID = Number(req.body.configID);
    apiStatusDetail.dateTime = new Date(req.body.dateTime);
    apiStatusDetail.pingResponseMS = Number(req.body.pingResponseMS);
    switch (req.body.apiStatus.toString().toLowerCase()) {
        case 'up':
            apiStatusDetail.apiStatus = APIStatus.Up;
            break;
        case '1':
            apiStatusDetail.apiStatus = APIStatus.Up;
            break;
        case 'down':
            apiStatusDetail.apiStatus = APIStatus.Down;
            break;
        case '2':
            apiStatusDetail.apiStatus = APIStatus.Down;
            break;
        case 'degraded':
            apiStatusDetail.apiStatus = APIStatus.Degraded;
            break;
        case '3':
            apiStatusDetail.apiStatus = APIStatus.Degraded;
            break;
        default:
            apiStatusDetail.apiStatus = APIStatus.Unknown;
            break;
    }

    healthCheck.addAPIData(apiStatusDetail)
        .then(function (resp: number) {
            apiStatusDetail.dataID = resp;
            res.json(apiStatusDetail);
        })
        .catch(function (err: Object) {
            console.error(err);
            res.json(err);
        });

});

app.get('/', function (req, res) {
    res.send('Hello World!')
});


app.listen(port);
console.log('Magic happens on port ' + port);

export = app;